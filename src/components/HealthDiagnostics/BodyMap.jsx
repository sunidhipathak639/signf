import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Tooltip,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Switch,
  FormControlLabel,
  Paper,
  Divider,
  Fade,
  Zoom,
  ButtonGroup,
  Badge
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  RotateLeft,
  RotateRight,
  ZoomIn,
  ZoomOut,
  Refresh,
  LocationOn,
  Delete,
  Info,
  Warning,
  CheckCircle,
  RadioButtonUnchecked,
  Accessibility,
  Psychology,
  Favorite,
  Healing,
  ThreeDRotation,
  ViewInAr,
  TouchApp,
  Fullscreen,
  FullscreenExit,
  Download,
  Assessment
} from '@mui/icons-material';

const BodyMap = ({ 
  selectedSymptoms: externalSelectedSymptoms = [], 
  onAddSymptom, 
  onRemoveSymptom 
}) => {
  // Use external symptoms if provided, otherwise use local state
  const [localSelectedSymptoms, setLocalSelectedSymptoms] = useState([]);
  const selectedSymptoms = externalSelectedSymptoms.length > 0 ? externalSelectedSymptoms : localSelectedSymptoms;
  
  // Update local state setter to use external callback if provided
  const setSelectedSymptoms = onAddSymptom ? 
    (newSymptoms) => {
      if (typeof newSymptoms === 'function') {
        const updated = newSymptoms(selectedSymptoms);
        // Handle array updates
        if (Array.isArray(updated)) {
          // Find new symptoms and add them
          updated.forEach(symptom => {
            if (!selectedSymptoms.find(s => s.id === symptom.id)) {
              onAddSymptom(symptom);
            }
          });
        }
      }
    } : 
    setLocalSelectedSymptoms;
  const [viewMode, setViewMode] = useState('front');
  const [showLabels, setShowLabels] = useState(true);
  const [selectedBodyPart, setSelectedBodyPart] = useState(null);
  const [hoveredBodyPart, setHoveredBodyPart] = useState(null);
  const [symptomIntensity, setSymptomIntensity] = useState(5);
  const [activeLayer, setActiveLayer] = useState('all');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [animationFrame, setAnimationFrame] = useState(0);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // Enhanced body parts with more anatomical accuracy and 3D coordinates
  const bodyParts = {
    front: {
      // Head and Face
      head: { 
        x: 200, y: 30, width: 100, height: 120, 
        label: 'Head', 
        shape: 'ellipse',
        depth: 15,
        subParts: {
          forehead: { x: 210, y: 40, width: 80, height: 30 },
          eyes: { x: 220, y: 70, width: 60, height: 20 },
          nose: { x: 240, y: 90, width: 20, height: 25 },
          mouth: { x: 230, y: 115, width: 40, height: 15 }
        }
      },
      neck: { 
        x: 230, y: 150, width: 40, height: 40, 
        label: 'Neck', 
        shape: 'cylinder',
        depth: 12
      },
      
      // Torso
      chest: { 
        x: 170, y: 190, width: 160, height: 120, 
        label: 'Chest', 
        shape: 'rounded',
        depth: 25,
        subParts: {
          leftBreast: { x: 190, y: 210, width: 40, height: 40 },
          rightBreast: { x: 270, y: 210, width: 40, height: 40 },
          sternum: { x: 240, y: 200, width: 20, height: 80 }
        }
      },
      abdomen: { 
        x: 180, y: 310, width: 140, height: 100, 
        label: 'Abdomen', 
        shape: 'rounded',
        depth: 20,
        subParts: {
          upperAbs: { x: 190, y: 320, width: 120, height: 40 },
          lowerAbs: { x: 190, y: 360, width: 120, height: 40 }
        }
      },
      pelvis: { 
        x: 190, y: 410, width: 120, height: 80, 
        label: 'Pelvis', 
        shape: 'rounded',
        depth: 18
      },
      
      // Arms
      leftShoulder: { 
        x: 130, y: 190, width: 60, height: 60, 
        label: 'Left Shoulder', 
        shape: 'circle',
        depth: 20
      },
      rightShoulder: { 
        x: 310, y: 190, width: 60, height: 60, 
        label: 'Right Shoulder', 
        shape: 'circle',
        depth: 20
      },
      leftUpperArm: { 
        x: 110, y: 250, width: 40, height: 80, 
        label: 'Left Upper Arm', 
        shape: 'cylinder',
        depth: 15
      },
      rightUpperArm: { 
        x: 350, y: 250, width: 40, height: 80, 
        label: 'Right Upper Arm', 
        shape: 'cylinder',
        depth: 15
      },
      leftElbow: { 
        x: 115, y: 330, width: 30, height: 30, 
        label: 'Left Elbow', 
        shape: 'circle',
        depth: 12
      },
      rightElbow: { 
        x: 355, y: 330, width: 30, height: 30, 
        label: 'Right Elbow', 
        shape: 'circle',
        depth: 12
      },
      leftForearm: { 
        x: 110, y: 360, width: 35, height: 80, 
        label: 'Left Forearm', 
        shape: 'cylinder',
        depth: 12
      },
      rightForearm: { 
        x: 355, y: 360, width: 35, height: 80, 
        label: 'Right Forearm', 
        shape: 'cylinder',
        depth: 12
      },
      leftHand: { 
        x: 105, y: 440, width: 45, height: 60, 
        label: 'Left Hand', 
        shape: 'hand',
        depth: 8
      },
      rightHand: { 
        x: 350, y: 440, width: 45, height: 60, 
        label: 'Right Hand', 
        shape: 'hand',
        depth: 8
      },
      
      // Legs
      leftThigh: { 
        x: 190, y: 490, width: 50, height: 120, 
        label: 'Left Thigh', 
        shape: 'cylinder',
        depth: 18
      },
      rightThigh: { 
        x: 260, y: 490, width: 50, height: 120, 
        label: 'Right Thigh', 
        shape: 'cylinder',
        depth: 18
      },
      leftKnee: { 
        x: 195, y: 610, width: 40, height: 40, 
        label: 'Left Knee', 
        shape: 'circle',
        depth: 15
      },
      rightKnee: { 
        x: 265, y: 610, width: 40, height: 40, 
        label: 'Right Knee', 
        shape: 'circle',
        depth: 15
      },
      leftShin: { 
        x: 195, y: 650, width: 35, height: 100, 
        label: 'Left Shin', 
        shape: 'cylinder',
        depth: 12
      },
      rightShin: { 
        x: 270, y: 650, width: 35, height: 100, 
        label: 'Right Shin', 
        shape: 'cylinder',
        depth: 12
      },
      leftFoot: { 
        x: 185, y: 750, width: 55, height: 80, 
        label: 'Left Foot', 
        shape: 'foot',
        depth: 10
      },
      rightFoot: { 
        x: 260, y: 750, width: 55, height: 80, 
        label: 'Right Foot', 
        shape: 'foot',
        depth: 10
      }
    },
    back: {
      head: { 
        x: 200, y: 30, width: 100, height: 120, 
        label: 'Head (Back)', 
        shape: 'ellipse',
        depth: 15
      },
      neck: { 
        x: 230, y: 150, width: 40, height: 40, 
        label: 'Neck (Back)', 
        shape: 'cylinder',
        depth: 12
      },
      upperBack: { 
        x: 170, y: 190, width: 160, height: 80, 
        label: 'Upper Back', 
        shape: 'rounded',
        depth: 25,
        subParts: {
          leftShouderBlade: { x: 190, y: 200, width: 50, height: 60 },
          rightShoulderBlade: { x: 260, y: 200, width: 50, height: 60 },
          spine: { x: 245, y: 190, width: 10, height: 200 }
        }
      },
      lowerBack: { 
        x: 180, y: 270, width: 140, height: 100, 
        label: 'Lower Back', 
        shape: 'rounded',
        depth: 20
      },
      leftShoulder: { 
        x: 130, y: 190, width: 60, height: 60, 
        label: 'Left Shoulder (Back)', 
        shape: 'circle',
        depth: 20
      },
      rightShoulder: { 
        x: 310, y: 190, width: 60, height: 60, 
        label: 'Right Shoulder (Back)', 
        shape: 'circle',
        depth: 20
      },
      leftUpperArm: { 
        x: 110, y: 250, width: 40, height: 80, 
        label: 'Left Upper Arm (Back)', 
        shape: 'cylinder',
        depth: 15
      },
      rightUpperArm: { 
        x: 350, y: 250, width: 40, height: 80, 
        label: 'Right Upper Arm (Back)', 
        shape: 'cylinder',
        depth: 15
      },
      buttocks: { 
        x: 190, y: 370, width: 120, height: 80, 
        label: 'Buttocks', 
        shape: 'rounded',
        depth: 22
      },
      leftThigh: { 
        x: 190, y: 450, width: 50, height: 120, 
        label: 'Left Thigh (Back)', 
        shape: 'cylinder',
        depth: 18
      },
      rightThigh: { 
        x: 260, y: 450, width: 50, height: 120, 
        label: 'Right Thigh (Back)', 
        shape: 'cylinder',
        depth: 18
      },
      leftCalf: { 
        x: 195, y: 570, width: 40, height: 100, 
        label: 'Left Calf', 
        shape: 'cylinder',
        depth: 15
      },
      rightCalf: { 
        x: 265, y: 570, width: 40, height: 100, 
        label: 'Right Calf', 
        shape: 'cylinder',
        depth: 15
      }
    },
    side: {
      head: { 
        x: 200, y: 30, width: 80, height: 120, 
        label: 'Head (Side)', 
        shape: 'ellipse',
        depth: 20
      },
      neck: { 
        x: 220, y: 150, width: 40, height: 40, 
        label: 'Neck (Side)', 
        shape: 'cylinder',
        depth: 15
      },
      spine: { 
        x: 240, y: 190, width: 15, height: 300, 
        label: 'Spine', 
        shape: 'spine',
        depth: 8
      },
      chest: { 
        x: 180, y: 190, width: 100, height: 120, 
        label: 'Chest (Side)', 
        shape: 'rounded',
        depth: 30
      },
      abdomen: { 
        x: 190, y: 310, width: 80, height: 100, 
        label: 'Abdomen (Side)', 
        shape: 'rounded',
        depth: 25
      }
    }
  };

  // Enhanced symptom categories with neon colors for dark theme
  const symptomCategories = {
    pain: { 
      color: '#ff4757', 
      glowColor: '#ff6b7a', 
      icon: '⚡', 
      label: 'Pain',
      gradient: ['#ff4757', '#ff3742']
    },
    swelling: { 
      color: '#ffa502', 
      glowColor: '#ffb732', 
      icon: '🔴', 
      label: 'Swelling',
      gradient: ['#ffa502', '#ff9500']
    },
    rash: { 
      color: '#ff6348', 
      glowColor: '#ff7675', 
      icon: '🔸', 
      label: 'Rash/Skin',
      gradient: ['#ff6348', '#ff5533']
    },
    numbness: { 
      color: '#a55eea', 
      glowColor: '#c44569', 
      icon: '❄️', 
      label: 'Numbness',
      gradient: ['#a55eea', '#9c44dc']
    },
    weakness: { 
      color: '#3742fa', 
      glowColor: '#5352ed', 
      icon: '💪', 
      label: 'Weakness',
      gradient: ['#3742fa', '#2f3542']
    },
    inflammation: { 
      color: '#ff9ff3', 
      glowColor: '#f368e0', 
      icon: '🔥', 
      label: 'Inflammation',
      gradient: ['#ff9ff3', '#ee5a6f']
    },
    stiffness: { 
      color: '#70a1ff', 
      glowColor: '#5352ed', 
      icon: '🔒', 
      label: 'Stiffness',
      gradient: ['#70a1ff', '#5a67d8']
    },
    other: { 
      color: '#747d8c', 
      glowColor: '#a4b0be', 
      icon: '❓', 
      label: 'Other',
      gradient: ['#747d8c', '#57606f']
    }
  };

  // Animation loop for 3D effects
  useEffect(() => {
    const animate = () => {
      setAnimationFrame(prev => prev + 1);
      requestAnimationFrame(animate);
    };
    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  // Enhanced canvas drawing with 3D effects
  useEffect(() => {
    drawBodyMap();
  }, [viewMode, selectedSymptoms, showLabels, selectedBodyPart, hoveredBodyPart, zoomLevel, panOffset, animationFrame]);

  const drawBodyMap = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const currentBodyParts = bodyParts[viewMode];
    
    // Enable anti-aliasing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Clear canvas with dark background
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Apply zoom and pan transformations
    ctx.save();
    ctx.translate(panOffset.x, panOffset.y);
    ctx.scale(zoomLevel, zoomLevel);

    // Draw grid for reference (subtle)
    drawGrid(ctx, canvas.width, canvas.height);

    // Draw body parts with 3D effects
    Object.entries(currentBodyParts).forEach(([partId, part]) => {
      drawBodyPart(ctx, partId, part);
    });

    ctx.restore();
  }, [viewMode, selectedSymptoms, showLabels, selectedBodyPart, hoveredBodyPart, zoomLevel, panOffset, animationFrame]);

  const drawGrid = (ctx, width, height) => {
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 0.5;
    ctx.globalAlpha = 0.3;
    
    for (let x = 0; x <= width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    for (let y = 0; y <= height; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    
    ctx.globalAlpha = 1;
  };

  const drawBodyPart = (ctx, partId, part) => {
    const isSelected = selectedBodyPart === partId;
    const isHovered = hoveredBodyPart === partId;
    const hasSymptom = selectedSymptoms.some(s => s.bodyPart === partId);
    const symptom = selectedSymptoms.find(s => s.bodyPart === partId);

    // Calculate 3D effect based on animation frame
    const pulseEffect = Math.sin(animationFrame * 0.05) * 0.1 + 1;
    const glowIntensity = isHovered ? pulseEffect : (isSelected ? 0.8 : 0.3);

    // Set up colors and effects
    let fillColor = '#2a2a2a';
    let strokeColor = '#404040';
    let glowColor = '#00bcd4';
    
    if (hasSymptom) {
      const category = symptomCategories[symptom.category];
      fillColor = category.color;
      glowColor = category.glowColor;
      strokeColor = category.color;
    } else if (isSelected) {
      fillColor = '#00bcd4';
      glowColor = '#00e5ff';
    } else if (isHovered) {
      fillColor = '#404040';
      glowColor = '#00bcd4';
    }

    // Draw shadow for 3D depth
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = part.depth || 10;
    ctx.shadowOffsetX = (part.depth || 10) * 0.3;
    ctx.shadowOffsetY = (part.depth || 10) * 0.3;

    // Draw glow effect
    if (isHovered || isSelected || hasSymptom) {
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = 20 * glowIntensity;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    }

    // Draw the body part based on its shape
    drawShape(ctx, part, fillColor, strokeColor, isHovered, isSelected, hasSymptom);

    ctx.restore();

    // Draw labels with enhanced styling
    if (showLabels) {
      drawLabel(ctx, part, isHovered || isSelected);
    }

    // Draw symptom indicators
    if (hasSymptom) {
      drawSymptomIndicator(ctx, part, symptom);
    }

    // Draw hover effect
    if (isHovered && !hasSymptom) {
      drawHoverEffect(ctx, part);
    }
  };

  const drawShape = (ctx, part, fillColor, strokeColor, isHovered, isSelected, hasSymptom) => {
    const { x, y, width, height, shape } = part;
    
    // Create gradient for 3D effect
    let gradient;
    if (hasSymptom) {
      const category = symptomCategories[selectedSymptoms.find(s => s.bodyPart === part.id)?.category];
      if (category) {
        gradient = ctx.createLinearGradient(x, y, x + width, y + height);
        gradient.addColorStop(0, category.gradient[0]);
        gradient.addColorStop(1, category.gradient[1]);
      }
    } else {
      gradient = ctx.createLinearGradient(x, y, x + width, y + height);
      gradient.addColorStop(0, fillColor);
      gradient.addColorStop(0.5, adjustBrightness(fillColor, 20));
      gradient.addColorStop(1, adjustBrightness(fillColor, -20));
    }

    ctx.fillStyle = gradient || fillColor;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = isSelected ? 3 : (isHovered ? 2 : 1);

    switch (shape) {
      case 'ellipse':
        drawEllipse(ctx, x, y, width, height);
        break;
      case 'circle':
        drawCircle(ctx, x + width/2, y + height/2, Math.min(width, height)/2);
        break;
      case 'cylinder':
        drawCylinder(ctx, x, y, width, height);
        break;
      case 'rounded':
        drawRoundedRect(ctx, x, y, width, height, 15);
        break;
      case 'hand':
        drawHand(ctx, x, y, width, height);
        break;
      case 'foot':
        drawFoot(ctx, x, y, width, height);
        break;
      case 'spine':
        drawSpine(ctx, x, y, width, height);
        break;
      default:
        drawRoundedRect(ctx, x, y, width, height, 8);
    }
  };

  const drawEllipse = (ctx, x, y, width, height) => {
    ctx.beginPath();
    ctx.ellipse(x + width/2, y + height/2, width/2, height/2, 0, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
  };

  const drawCircle = (ctx, x, y, radius) => {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
  };

  const drawCylinder = (ctx, x, y, width, height) => {
    // Draw cylinder with 3D effect
    ctx.beginPath();
    ctx.ellipse(x + width/2, y + height * 0.2, width/2, height * 0.1, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.fillRect(x, y + height * 0.1, width, height * 0.8);
    
    ctx.beginPath();
    ctx.ellipse(x + width/2, y + height * 0.9, width/2, height * 0.1, 0, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
  };

  const drawRoundedRect = (ctx, x, y, width, height, radius) => {
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, radius);
    ctx.fill();
    ctx.stroke();
  };

  const drawHand = (ctx, x, y, width, height) => {
    // Draw palm
    drawRoundedRect(ctx, x, y + height * 0.3, width * 0.8, height * 0.7, 8);
    
    // Draw fingers
    for (let i = 0; i < 4; i++) {
      const fingerX = x + (i * width * 0.2) + width * 0.1;
      drawRoundedRect(ctx, fingerX, y, width * 0.15, height * 0.5, 4);
    }
    
    // Draw thumb
    drawRoundedRect(ctx, x + width * 0.8, y + height * 0.2, width * 0.2, height * 0.4, 4);
  };

  const drawFoot = (ctx, x, y, width, height) => {
    // Draw foot shape
    ctx.beginPath();
    ctx.ellipse(x + width/2, y + height * 0.7, width/2, height * 0.3, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // Draw toes
    for (let i = 0; i < 5; i++) {
      const toeX = x + (i * width * 0.18) + width * 0.1;
      drawCircle(ctx, toeX, y + height * 0.1, width * 0.08);
    }
    
    ctx.stroke();
  };

  const drawSpine = (ctx, x, y, width, height) => {
    // Draw spine with vertebrae
    const segments = 12;
    const segmentHeight = height / segments;
    
    for (let i = 0; i < segments; i++) {
      const segY = y + (i * segmentHeight);
      drawEllipse(ctx, x, segY, width, segmentHeight * 0.8);
    }
  };

  const drawLabel = (ctx, part, isHighlighted) => {
    ctx.fillStyle = isHighlighted ? '#00e5ff' : '#ffffff';
    ctx.font = `${isHighlighted ? 'bold ' : ''}12px 'Segoe UI', Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Add text shadow for better readability
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    
    ctx.fillText(
      part.label,
      part.x + part.width / 2,
      part.y + part.height / 2
    );
    
    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  };

  const drawSymptomIndicator = (ctx, part, symptom) => {
    const category = symptomCategories[symptom.category];
    if (!category) return;

    // Draw pulsing indicator
    const pulse = Math.sin(animationFrame * 0.1) * 0.3 + 1;
    const indicatorSize = 20 * pulse;
    
    ctx.fillStyle = category.color;
    ctx.shadowColor = category.glowColor;
    ctx.shadowBlur = 15;
    
    drawCircle(
      ctx,
      part.x + part.width - 15,
      part.y + 15,
      indicatorSize / 2
    );
    
    // Draw icon
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.shadowBlur = 0;
    ctx.fillText(
      category.icon,
      part.x + part.width - 15,
      part.y + 15
    );
  };

  const drawHoverEffect = (ctx, part) => {
    // Draw animated border
    const borderWidth = 3;
    const dashOffset = animationFrame * 0.5;
    
    ctx.strokeStyle = '#00bcd4';
    ctx.lineWidth = borderWidth;
    ctx.setLineDash([10, 5]);
    ctx.lineDashOffset = dashOffset;
    
    ctx.strokeRect(
      part.x - borderWidth,
      part.y - borderWidth,
      part.width + borderWidth * 2,
      part.height + borderWidth * 2
    );
    
    ctx.setLineDash([]);
  };

  const adjustBrightness = (color, amount) => {
    // Simple brightness adjustment for hex colors
    const num = parseInt(color.replace('#', ''), 16);
    const r = Math.max(0, Math.min(255, (num >> 16) + amount));
    const g = Math.max(0, Math.min(255, (num >> 8 & 0x00FF) + amount));
    const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  };

  // Enhanced mouse event handlers
  const handleCanvasMouseMove = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left - panOffset.x) / zoomLevel;
    const y = (event.clientY - rect.top - panOffset.y) / zoomLevel;

    if (isDragging) {
      setPanOffset({
        x: panOffset.x + (event.clientX - dragStart.x),
        y: panOffset.y + (event.clientY - dragStart.y)
      });
      setDragStart({ x: event.clientX, y: event.clientY });
      return;
    }

    const currentBodyParts = bodyParts[viewMode];
    let foundPart = null;

    Object.entries(currentBodyParts).forEach(([partId, part]) => {
      if (
        x >= part.x &&
        x <= part.x + part.width &&
        y >= part.y &&
        y <= part.y + part.height
      ) {
        foundPart = partId;
      }
    });

    setHoveredBodyPart(foundPart);
    canvas.style.cursor = foundPart ? 'pointer' : (isDragging ? 'grabbing' : 'grab');
  };

  const handleCanvasClick = (event) => {
    if (isDragging) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left - panOffset.x) / zoomLevel;
    const y = (event.clientY - rect.top - panOffset.y) / zoomLevel;

    const currentBodyParts = bodyParts[viewMode];
    
    Object.entries(currentBodyParts).forEach(([partId, part]) => {
      if (
        x >= part.x &&
        x <= part.x + part.width &&
        y >= part.y &&
        y <= part.y + part.height
      ) {
        setSelectedBodyPart(partId);
      }
    });
  };

  const handleMouseDown = (event) => {
    if (event.button === 0) { // Left mouse button
      setIsDragging(true);
      setDragStart({ x: event.clientX, y: event.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (event) => {
    event.preventDefault();
    const delta = event.deltaY > 0 ? 0.9 : 1.1;
    setZoomLevel(prev => Math.max(0.5, Math.min(3, prev * delta)));
  };

  // Rest of the component methods remain similar but with enhanced styling...
  const addSymptom = (category) => {
    if (!selectedBodyPart) return;

    const newSymptom = {
      id: Date.now(),
      bodyPart: selectedBodyPart,
      category,
      intensity: symptomIntensity,
      timestamp: new Date().toISOString(),
      bodyPartLabel: bodyParts[viewMode][selectedBodyPart]?.label || selectedBodyPart
    };

    if (onAddSymptom) {
      onAddSymptom(newSymptom);
    } else {
      setLocalSelectedSymptoms(prev => [...prev, newSymptom]);
    }
    setSelectedBodyPart(null);
  };

  const removeSymptom = (symptomId) => {
    if (onRemoveSymptom) {
      onRemoveSymptom(symptomId);
    } else {
      setLocalSelectedSymptoms(prev => prev.filter(s => s.id !== symptomId));
    }
  };

  const resetView = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
    setSelectedBodyPart(null);
    setHoveredBodyPart(null);
  };

  const getIntensityColor = (intensity) => {
    if (intensity <= 3) return '#4caf50';
    if (intensity <= 6) return '#ff9800';
    return '#f44336';
  };

  const getIntensityLabel = (intensity) => {
    if (intensity <= 3) return 'Mild';
    if (intensity <= 6) return 'Moderate';
    return 'Severe';
  };

  return (
    <Box sx={{ 
      p: { xs: 1, sm: 2 },
      backgroundColor: '#000000',
      minHeight: '100vh',
      color: '#ffffff'
    }}>
      <Grid container spacing={{ xs: 2, sm: 3 }}>
        {/* Enhanced Control Panel */}
        <Grid item xs={12} lg={3}>
          <Card sx={{ 
            mb: 2,
            backgroundColor: '#0a0a0a',
            border: '1px solid #333',
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 188, 212, 0.1)'
          }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ 
                  color: '#00bcd4', 
                  fontSize: { xs: '1.1rem', sm: '1.25rem' },
                  fontWeight: 'bold',
                  textShadow: '0 0 10px rgba(0, 188, 212, 0.5)'
                }}
              >
                <ThreeDRotation sx={{ mr: 1, verticalAlign: 'middle' }} />
                SIGNF 3D Body Map
              </Typography>
              
              <FormControl fullWidth margin="normal">
                <InputLabel sx={{ color: '#b0b0b0' }}>View Mode</InputLabel>
                <Select
                  value={viewMode}
                  onChange={(e) => setViewMode(e.target.value)}
                  sx={{
                    color: '#ffffff',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#333',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#00bcd4',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#00bcd4',
                    },
                    '& .MuiSvgIcon-root': {
                      color: '#b0b0b0',
                    },
                  }}
                >
                  <MenuItem value="front" sx={{ color: '#ffffff', backgroundColor: '#1a1a1a' }}>
                    <ViewInAr sx={{ mr: 1 }} /> Front View
                  </MenuItem>
                  <MenuItem value="back" sx={{ color: '#ffffff', backgroundColor: '#1a1a1a' }}>
                    <ViewInAr sx={{ mr: 1 }} /> Back View
                  </MenuItem>
                  <MenuItem value="side" sx={{ color: '#ffffff', backgroundColor: '#1a1a1a' }}>
                    <ViewInAr sx={{ mr: 1 }} /> Side View
                  </MenuItem>
                </Select>
              </FormControl>

              <Box sx={{ mt: 2, mb: 2 }}>
                <Typography variant="body2" sx={{ color: '#b0b0b0', mb: 1 }}>
                  Zoom: {Math.round(zoomLevel * 100)}%
                </Typography>
                <Slider
                  value={zoomLevel}
                  onChange={(e, value) => setZoomLevel(value)}
                  min={0.5}
                  max={3}
                  step={0.1}
                  sx={{
                    color: '#00bcd4',
                    '& .MuiSlider-thumb': {
                      backgroundColor: '#00bcd4',
                      boxShadow: '0 0 10px rgba(0, 188, 212, 0.5)',
                    },
                    '& .MuiSlider-track': {
                      backgroundColor: '#00bcd4',
                    },
                    '& .MuiSlider-rail': {
                      backgroundColor: '#333',
                    },
                  }}
                />
              </Box>

              <FormControlLabel
                control={
                  <Switch
                    checked={showLabels}
                    onChange={(e) => setShowLabels(e.target.checked)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#00bcd4',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#00bcd4',
                      },
                    }}
                  />
                }
                label={<span style={{ color: '#ffffff' }}>Show Labels</span>}
                sx={{ mt: 1, display: 'block' }}
              />

              <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={resetView}
                  sx={{
                    borderColor: '#00bcd4',
                    color: '#00bcd4',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 188, 212, 0.1)',
                      borderColor: '#00e5ff',
                    }
                  }}
                >
                  <Refresh sx={{ mr: 0.5 }} fontSize="small" />
                  Reset
                </Button>
                
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  sx={{
                    borderColor: '#00bcd4',
                    color: '#00bcd4',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 188, 212, 0.1)',
                      borderColor: '#00e5ff',
                    }
                  }}
                >
                  {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Symptom Categories Legend */}
          <Card sx={{ 
            mb: 2,
            backgroundColor: '#0a0a0a',
            border: '1px solid #333',
            borderRadius: 2
          }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: '#00bcd4', fontWeight: 'bold' }}>
                Symptom Categories
              </Typography>
              
              {Object.entries(symptomCategories).map(([category, info]) => (
                <Box key={category} sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mb: 1,
                  p: 1,
                  borderRadius: 1,
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  border: `1px solid ${info.color}20`
                }}>
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      backgroundColor: info.color,
                      borderRadius: '50%',
                      mr: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      boxShadow: `0 0 10px ${info.glowColor}50`
                    }}
                  >
                    {info.icon}
                  </Box>
                  <Typography variant="body2" sx={{ color: '#ffffff' }}>
                    {info.label}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Enhanced Body Map Canvas */}
        <Grid item xs={12} lg={6}>
          <Card sx={{
            backgroundColor: '#0a0a0a',
            border: '1px solid #333',
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 188, 212, 0.1)'
          }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mb: 2, 
                flexWrap: 'wrap', 
                gap: 1 
              }}>
                <Typography variant="h6" sx={{ 
                  color: '#00bcd4', 
                  fontSize: { xs: '1.1rem', sm: '1.25rem' },
                  fontWeight: 'bold',
                  textShadow: '0 0 10px rgba(0, 188, 212, 0.5)'
                }}>
                  <TouchApp sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Interactive 3D Body Map
                </Typography>
                
                <ButtonGroup variant="outlined" size="small">
                  {['front', 'back', 'side'].map((view) => (
                    <Button
                      key={view}
                      variant={viewMode === view ? 'contained' : 'outlined'}
                      onClick={() => setViewMode(view)}
                      sx={{
                        backgroundColor: viewMode === view ? '#00bcd4' : 'transparent',
                        borderColor: '#00bcd4',
                        color: viewMode === view ? '#000' : '#00bcd4',
                        '&:hover': {
                          backgroundColor: viewMode === view ? '#00acc1' : 'rgba(0, 188, 212, 0.1)',
                        }
                      }}
                    >
                      {view.charAt(0).toUpperCase() + view.slice(1)}
                    </Button>
                  ))}
                </ButtonGroup>
              </Box>

              {/* Canvas Container */}
              <Box 
                ref={containerRef}
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  border: '2px solid #333',
                  borderRadius: 2,
                  p: { xs: 1, sm: 2 },
                  bgcolor: '#0a0a0a',
                  overflow: 'hidden',
                  position: 'relative',
                  minHeight: '600px',
                  background: 'radial-gradient(circle at center, #1a1a1a 0%, #0a0a0a 100%)'
                }}
              >
                <canvas
                  ref={canvasRef}
                  width={500}
                  height={850}
                  onMouseMove={handleCanvasMouseMove}
                  onMouseDown={handleMouseDown}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onWheel={handleWheel}
                  style={{ 
                    cursor: isDragging ? 'grabbing' : 'grab',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    backgroundColor: '#0a0a0a',
                    maxWidth: '100%',
                    height: 'auto',
                    boxShadow: '0 0 30px rgba(0, 188, 212, 0.2)'
                  }}
                />
              </Box>

              {/* Enhanced Instructions */}
              <Alert 
                severity="info" 
                sx={{ 
                  mt: 2,
                  backgroundColor: '#1a1a1a',
                  border: '1px solid #00bcd4',
                  borderRadius: 2,
                  '& .MuiAlert-icon': {
                    color: '#00bcd4'
                  }
                }}
              >
                <Typography variant="body2" sx={{ color: '#ffffff' }}>
                  <strong>Interactive Controls:</strong> Click body parts to select • Scroll to zoom • Drag to pan • 
                  Hover for highlights • Use view buttons to rotate the 3D model
                </Typography>
              </Alert>

              {/* Selected Body Part Info with Enhanced UI */}
              {selectedBodyPart && (
                <Zoom in={!!selectedBodyPart}>
                  <Paper sx={{ 
                    p: 3, 
                    mt: 2, 
                    bgcolor: '#1a1a1a',
                    border: '2px solid #00bcd4',
                    borderRadius: 2,
                    boxShadow: '0 0 20px rgba(0, 188, 212, 0.3)'
                  }}>
                    <Typography variant="h6" gutterBottom sx={{ color: '#00bcd4', fontWeight: 'bold' }}>
                      <LocationOn sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Selected: {bodyParts[viewMode][selectedBodyPart]?.label}
                    </Typography>
                    
                    <Typography variant="body2" gutterBottom sx={{ color: '#ffffff', mb: 2 }}>
                      Symptom Intensity: {symptomIntensity}/10 ({getIntensityLabel(symptomIntensity)})
                    </Typography>
                    
                    <Slider
                      value={symptomIntensity}
                      onChange={(e, value) => setSymptomIntensity(value)}
                      min={1}
                      max={10}
                      step={1}
                      marks
                      valueLabelDisplay="auto"
                      sx={{ 
                        mb: 3,
                        color: getIntensityColor(symptomIntensity),
                        '& .MuiSlider-thumb': {
                          backgroundColor: getIntensityColor(symptomIntensity),
                          boxShadow: `0 0 10px ${getIntensityColor(symptomIntensity)}80`,
                        },
                        '& .MuiSlider-track': {
                          backgroundColor: getIntensityColor(symptomIntensity),
                        },
                        '& .MuiSlider-rail': {
                          backgroundColor: '#333',
                        },
                      }}
                    />

                    <Typography variant="body2" gutterBottom sx={{ color: '#ffffff', mb: 2 }}>
                      Add Symptom Category:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {Object.entries(symptomCategories).map(([category, info]) => (
                        <Button
                          key={category}
                          variant="outlined"
                          size="small"
                          onClick={() => addSymptom(category)}
                          sx={{ 
                            borderColor: info.color,
                            color: info.color,
                            backgroundColor: 'rgba(0, 0, 0, 0.3)',
                            '&:hover': {
                              backgroundColor: info.color,
                              color: '#000',
                              boxShadow: `0 0 15px ${info.glowColor}80`,
                              transform: 'scale(1.05)'
                            },
                            transition: 'all 0.3s ease'
                          }}
                        >
                          {info.icon} {info.label}
                        </Button>
                      ))}
                    </Box>
                  </Paper>
                </Zoom>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Enhanced Recorded Symptoms Section */}
        <Grid item xs={12} lg={4}>
          <Card sx={{
            mb: 3,
            backgroundColor: '#0a0a0a',
            border: '1px solid #333',
            borderRadius: 2,
            position: 'sticky',
            top: 20,
            maxHeight: 'calc(100vh - 40px)',
            overflow: 'auto'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" sx={{ color: '#00bcd4', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                  <Badge badgeContent={selectedSymptoms.length} color="primary" sx={{ mr: 2 }}>
                    <Healing />
                  </Badge>
                  Recorded Symptoms
                </Typography>
                
                {/* Clear All Button */}
                {selectedSymptoms.length > 0 && (
                  <Tooltip title="Clear all symptoms">
                    <IconButton
                      size="small"
                      onClick={() => setSelectedSymptoms([])}
                      sx={{
                        color: '#ff4757',
                        backgroundColor: 'rgba(255, 71, 87, 0.1)',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 71, 87, 0.2)',
                          transform: 'scale(1.1)'
                        }
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
              
              {/* Summary Stats */}
              {selectedSymptoms.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Paper sx={{ 
                        p: 1.5, 
                        backgroundColor: '#1a1a1a', 
                        border: '1px solid #333',
                        textAlign: 'center'
                      }}>
                        <Typography variant="h6" sx={{ color: '#00bcd4', fontWeight: 'bold' }}>
                          {selectedSymptoms.length}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#b0b0b0' }}>
                          Total Symptoms
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6}>
                      <Paper sx={{ 
                        p: 1.5, 
                        backgroundColor: '#1a1a1a', 
                        border: '1px solid #333',
                        textAlign: 'center'
                      }}>
                        <Typography variant="h6" sx={{ color: '#ff9800', fontWeight: 'bold' }}>
                          {selectedSymptoms.length > 0 ? 
                            (selectedSymptoms.reduce((sum, s) => sum + s.intensity, 0) / selectedSymptoms.length).toFixed(1) : 
                            '0'
                          }
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#b0b0b0' }}>
                          Avg Intensity
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>
              )}
              
              {selectedSymptoms.length === 0 ? (
                <Box sx={{ 
                  textAlign: 'center', 
                  py: 4,
                  border: '2px dashed #333',
                  borderRadius: 2,
                  backgroundColor: '#1a1a1a'
                }}>
                  <Psychology sx={{ fontSize: 48, color: '#333', mb: 2 }} />
                  <Typography variant="body2" color="#666" sx={{ mb: 1 }}>
                    No symptoms recorded yet.
                  </Typography>
                  <Typography variant="caption" color="#888">
                    Click on body parts above to add symptoms.
                  </Typography>
                  
                  {/* Quick Start Tips */}
                  <Box sx={{ mt: 3, p: 2, backgroundColor: '#0f0f0f', borderRadius: 1 }}>
                    <Typography variant="caption" sx={{ color: '#00bcd4', fontWeight: 'bold', display: 'block', mb: 1 }}>
                      💡 Quick Tips:
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#b0b0b0', display: 'block', textAlign: 'left' }}>
                      • Click any body part to select it
                      <br />
                      • Choose symptom category from the panel
                      <br />
                      • Adjust intensity with the slider
                      <br />
                      • Use zoom controls for better precision
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <Box>
                  {/* Filter and Sort Options */}
                  <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip
                      label="Sort by Intensity"
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        const sorted = [...selectedSymptoms].sort((a, b) => b.intensity - a.intensity);
                        setSelectedSymptoms(sorted);
                      }}
                      sx={{
                        borderColor: '#333',
                        color: '#b0b0b0',
                        '&:hover': { borderColor: '#00bcd4', color: '#00bcd4' }
                      }}
                    />
                    <Chip
                      label="Sort by Time"
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        const sorted = [...selectedSymptoms].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                        setSelectedSymptoms(sorted);
                      }}
                      sx={{
                        borderColor: '#333',
                        color: '#b0b0b0',
                        '&:hover': { borderColor: '#00bcd4', color: '#00bcd4' }
                      }}
                    />
                  </Box>

                  {/* Symptoms List */}
                  <List dense sx={{ maxHeight: '400px', overflow: 'auto' }}>
                    {selectedSymptoms.map((symptom, index) => (
                      <Fade in={true} timeout={300 * (index + 1)} key={symptom.id}>
                        <ListItem
                          sx={{
                            border: `1px solid ${symptomCategories[symptom.category]?.color}40`,
                            borderRadius: 2,
                            mb: 1,
                            backgroundColor: '#1a1a1a',
                            '&:hover': {
                              backgroundColor: '#2a2a2a',
                              boxShadow: `0 0 15px ${symptomCategories[symptom.category]?.glowColor}30`,
                              transform: 'translateY(-1px)'
                            },
                            transition: 'all 0.3s ease',
                            position: 'relative',
                            overflow: 'hidden'
                          }}
                        >
                          {/* Intensity Bar */}
                          <Box
                            sx={{
                              position: 'absolute',
                              left: 0,
                              top: 0,
                              bottom: 0,
                              width: `${(symptom.intensity / 10) * 100}%`,
                              backgroundColor: `${getIntensityColor(symptom.intensity)}20`,
                              transition: 'width 0.3s ease'
                            }}
                          />
                          
                          <ListItemIcon sx={{ minWidth: 40 }}>
                            <Box
                              sx={{
                                width: 32,
                                height: 32,
                                borderRadius: '50%',
                                backgroundColor: symptomCategories[symptom.category]?.color,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '16px',
                                boxShadow: `0 0 10px ${symptomCategories[symptom.category]?.glowColor}50`,
                                position: 'relative',
                                zIndex: 1
                              }}
                            >
                              {symptomCategories[symptom.category]?.icon}
                            </Box>
                          </ListItemIcon>
                          
                          <ListItemText
                            sx={{ position: 'relative', zIndex: 1 }}
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography variant="subtitle2" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                                  {symptom.bodyPartLabel}
                                </Typography>
                                <Chip
                                  label={`${getIntensityLabel(symptom.intensity)} (${symptom.intensity}/10)`}
                                  size="small"
                                  sx={{
                                    backgroundColor: getIntensityColor(symptom.intensity),
                                    color: 'white',
                                    fontSize: '10px',
                                    height: '20px',
                                    fontWeight: 'bold',
                                    boxShadow: `0 0 8px ${getIntensityColor(symptom.intensity)}50`
                                  }}
                                />
                              </Box>
                            }
                            secondary={
                              <Box>
                                <Typography variant="caption" display="block" sx={{ color: '#b0b0b0', mb: 0.5 }}>
                                  {symptomCategories[symptom.category]?.label}
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#888', fontSize: '0.7rem' }}>
                                  Added: {new Date(symptom.timestamp).toLocaleTimeString()}
                                </Typography>
                              </Box>
                            }
                          />
                          
                          {/* Action Buttons */}
                          <Box sx={{ display: 'flex', gap: 0.5, position: 'relative', zIndex: 1 }}>
                            <Tooltip title="Edit intensity">
                              <IconButton
                                size="small"
                                onClick={() => {
                                  // Open intensity editor
                                  const newIntensity = prompt(`Current intensity: ${symptom.intensity}/10\nEnter new intensity (1-10):`, symptom.intensity);
                                  if (newIntensity && !isNaN(newIntensity) && newIntensity >= 1 && newIntensity <= 10) {
                                    setSelectedSymptoms(prev => 
                                      prev.map(s => s.id === symptom.id ? { ...s, intensity: parseInt(newIntensity) } : s)
                                    );
                                  }
                                }}
                                sx={{
                                  color: '#00bcd4',
                                  '&:hover': {
                                    backgroundColor: 'rgba(0, 188, 212, 0.1)',
                                    transform: 'scale(1.1)'
                                  }
                                }}
                              >
                                <Info />
                              </IconButton>
                            </Tooltip>
                            
                            <Tooltip title="Remove symptom">
                              <IconButton
                                size="small"
                                onClick={() => removeSymptom(symptom.id)}
                                sx={{
                                  color: '#ff4757',
                                  '&:hover': {
                                    backgroundColor: 'rgba(255, 71, 87, 0.1)',
                                    transform: 'scale(1.1)'
                                  }
                                }}
                              >
                                <Delete />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </ListItem>
                      </Fade>
                    ))}
                  </List>

                  {/* Export Options */}
                  {selectedSymptoms.length > 0 && (
                    <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #333' }}>
                      <Typography variant="caption" sx={{ color: '#b0b0b0', display: 'block', mb: 1 }}>
                        Export Options:
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<Download />}
                          onClick={() => {
                            const data = JSON.stringify(selectedSymptoms, null, 2);
                            const blob = new Blob([data], { type: 'application/json' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `symptoms-${new Date().toISOString().split('T')[0]}.json`;
                            a.click();
                            URL.revokeObjectURL(url);
                          }}
                          sx={{
                            borderColor: '#333',
                            color: '#b0b0b0',
                            fontSize: '0.7rem',
                            '&:hover': { borderColor: '#00bcd4', color: '#00bcd4' }
                          }}
                        >
                          JSON
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<Assessment />}
                          onClick={() => {
                            // Navigate to SymptomChecker with current symptoms
                            console.log('Navigate to analysis with symptoms:', selectedSymptoms);
                          }}
                          sx={{
                            borderColor: '#333',
                            color: '#b0b0b0',
                            fontSize: '0.7rem',
                            '&:hover': { borderColor: '#00bcd4', color: '#00bcd4' }
                          }}
                        >
                          Analyze
                        </Button>
                      </Box>
                    </Box>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

      </Grid>
    </Box>
  );
};

export default BodyMap;
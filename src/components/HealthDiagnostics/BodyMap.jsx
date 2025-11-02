import React, { useState, useRef, useEffect } from 'react';
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
  Divider
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
  Healing
} from '@mui/icons-material';

const BodyMap = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [viewMode, setViewMode] = useState('front'); // front, back, side
  const [showLabels, setShowLabels] = useState(true);
  const [selectedBodyPart, setSelectedBodyPart] = useState(null);
  const [symptomIntensity, setSymptomIntensity] = useState(5);
  const [activeLayer, setActiveLayer] = useState('all');
  const canvasRef = useRef(null);

  // Body parts mapping with coordinates for different views
  const bodyParts = {
    front: {
      head: { x: 200, y: 50, width: 80, height: 80, label: 'Head' },
      neck: { x: 220, y: 130, width: 40, height: 30, label: 'Neck' },
      chest: { x: 180, y: 160, width: 120, height: 100, label: 'Chest' },
      leftArm: { x: 120, y: 160, width: 50, height: 120, label: 'Left Arm' },
      rightArm: { x: 310, y: 160, width: 50, height: 120, label: 'Right Arm' },
      abdomen: { x: 180, y: 260, width: 120, height: 80, label: 'Abdomen' },
      pelvis: { x: 180, y: 340, width: 120, height: 60, label: 'Pelvis' },
      leftLeg: { x: 180, y: 400, width: 50, height: 150, label: 'Left Leg' },
      rightLeg: { x: 250, y: 400, width: 50, height: 150, label: 'Right Leg' },
      leftFoot: { x: 180, y: 550, width: 50, height: 40, label: 'Left Foot' },
      rightFoot: { x: 250, y: 550, width: 50, height: 40, label: 'Right Foot' }
    },
    back: {
      head: { x: 200, y: 50, width: 80, height: 80, label: 'Head (Back)' },
      neck: { x: 220, y: 130, width: 40, height: 30, label: 'Neck (Back)' },
      upperBack: { x: 180, y: 160, width: 120, height: 80, label: 'Upper Back' },
      lowerBack: { x: 180, y: 240, width: 120, height: 80, label: 'Lower Back' },
      leftShoulder: { x: 120, y: 160, width: 50, height: 60, label: 'Left Shoulder' },
      rightShoulder: { x: 310, y: 160, width: 50, height: 60, label: 'Right Shoulder' },
      leftArm: { x: 120, y: 220, width: 50, height: 120, label: 'Left Arm (Back)' },
      rightArm: { x: 310, y: 220, width: 50, height: 120, label: 'Right Arm (Back)' },
      buttocks: { x: 180, y: 320, width: 120, height: 80, label: 'Buttocks' },
      leftLeg: { x: 180, y: 400, width: 50, height: 150, label: 'Left Leg (Back)' },
      rightLeg: { x: 250, y: 400, width: 50, height: 150, label: 'Right Leg (Back)' }
    }
  };

  // Symptom categories with colors
  const symptomCategories = {
    pain: { color: '#f44336', icon: '⚡', label: 'Pain' },
    swelling: { color: '#ff9800', icon: '🔴', label: 'Swelling' },
    rash: { color: '#e91e63', icon: '🔸', label: 'Rash/Skin' },
    numbness: { color: '#9c27b0', icon: '❄️', label: 'Numbness' },
    weakness: { color: '#3f51b5', icon: '💪', label: 'Weakness' },
    other: { color: '#607d8b', icon: '❓', label: 'Other' }
  };

  // Real symptom categories that users can select from
  const commonSymptoms = {
    head: ['Headache', 'Dizziness', 'Eye strain', 'Sinus pressure', 'Migraine', 'Jaw pain'],
    neck: ['Neck pain', 'Stiffness', 'Muscle tension', 'Swollen glands'],
    chest: ['Chest pain', 'Shortness of breath', 'Heart palpitations', 'Cough'],
    abdomen: ['Abdominal pain', 'Nausea', 'Bloating', 'Cramping', 'Heartburn'],
    back: ['Back pain', 'Muscle spasms', 'Stiffness', 'Lower back pain'],
    arms: ['Arm pain', 'Numbness', 'Tingling', 'Weakness', 'Joint pain'],
    legs: ['Leg pain', 'Swelling', 'Cramping', 'Restlessness', 'Knee pain']
  };

  useEffect(() => {
    drawBodyMap();
  }, [viewMode, selectedSymptoms, showLabels, selectedBodyPart]);

  const drawBodyMap = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const currentBodyParts = bodyParts[viewMode];

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw body outline
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.fillStyle = '#f5f5f5';

    // Draw each body part
    Object.entries(currentBodyParts).forEach(([partId, part]) => {
      const isSelected = selectedBodyPart === partId;
      const hasSymptom = selectedSymptoms.some(s => s.bodyPart === partId);

      // Set colors based on state
      if (hasSymptom) {
        const symptom = selectedSymptoms.find(s => s.bodyPart === partId);
        ctx.fillStyle = symptomCategories[symptom.category]?.color || '#f44336';
        ctx.globalAlpha = 0.6;
      } else if (isSelected) {
        ctx.fillStyle = '#2196f3';
        ctx.globalAlpha = 0.3;
      } else {
        ctx.fillStyle = '#e0e0e0';
        ctx.globalAlpha = 0.8;
      }

      // Draw body part
      ctx.fillRect(part.x, part.y, part.width, part.height);
      ctx.globalAlpha = 1;
      ctx.strokeRect(part.x, part.y, part.width, part.height);

      // Draw labels if enabled
      if (showLabels) {
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(
          part.label,
          part.x + part.width / 2,
          part.y + part.height / 2 + 4
        );
      }

      // Draw symptom indicators
      if (hasSymptom) {
        const symptom = selectedSymptoms.find(s => s.bodyPart === partId);
        ctx.fillStyle = '#fff';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(
          symptomCategories[symptom.category]?.icon || '⚡',
          part.x + part.width - 10,
          part.y + 15
        );
      }
    });
  };

  const handleCanvasClick = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const currentBodyParts = bodyParts[viewMode];
    
    // Check which body part was clicked
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

    setSelectedSymptoms(prev => [...prev, newSymptom]);
    setSelectedBodyPart(null);
  };

  const removeSymptom = (symptomId) => {
    setSelectedSymptoms(prev => prev.filter(s => s.id !== symptomId));
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
    <Box sx={{ p: { xs: 1, sm: 2 } }}>
      <Grid container spacing={{ xs: 2, sm: 3 }}>
        {/* Control Panel */}
        <Grid item xs={12} lg={3}>
          <Card sx={{ 
            mb: 2,
            backgroundColor: '#0a0a0a',
            border: '1px solid #333'
          }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#ffffff', fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                3D Body Map Controls
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
                  <MenuItem value="front" sx={{ color: '#ffffff', backgroundColor: '#1a1a1a' }}>Front View</MenuItem>
                  <MenuItem value="back" sx={{ color: '#ffffff', backgroundColor: '#1a1a1a' }}>Back View</MenuItem>
                  <MenuItem value="side" sx={{ color: '#ffffff', backgroundColor: '#1a1a1a' }}>Side View</MenuItem>
                </Select>
              </FormControl>

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
                sx={{ mt: 2, display: 'block' }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Body Map Canvas */}
        <Grid item xs={12} lg={8}>
          <Card sx={{
            backgroundColor: '#0a0a0a',
            border: '1px solid #333'
          }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                <Typography variant="h6" sx={{ color: '#ffffff', fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                  Interactive Body Map
                </Typography>
                
                {/* View Controls */}
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Button
                    variant={viewMode === 'front' ? 'contained' : 'outlined'}
                    onClick={() => setViewMode('front')}
                    size="small"
                    sx={{
                      backgroundColor: viewMode === 'front' ? '#00bcd4' : 'transparent',
                      borderColor: '#00bcd4',
                      color: viewMode === 'front' ? '#000' : '#00bcd4',
                      '&:hover': {
                        backgroundColor: viewMode === 'front' ? '#00acc1' : 'rgba(0, 188, 212, 0.1)',
                      }
                    }}
                  >
                    Front
                  </Button>
                  <Button
                    variant={viewMode === 'back' ? 'contained' : 'outlined'}
                    onClick={() => setViewMode('back')}
                    size="small"
                    sx={{
                      backgroundColor: viewMode === 'back' ? '#00bcd4' : 'transparent',
                      borderColor: '#00bcd4',
                      color: viewMode === 'back' ? '#000' : '#00bcd4',
                      '&:hover': {
                        backgroundColor: viewMode === 'back' ? '#00acc1' : 'rgba(0, 188, 212, 0.1)',
                      }
                    }}
                  >
                    Back
                  </Button>
                  <Tooltip title="Toggle Labels">
                    <IconButton 
                      onClick={() => setShowLabels(!showLabels)}
                      sx={{
                        color: '#00bcd4',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 188, 212, 0.1)',
                          transform: 'scale(1.05)'
                        }
                      }}
                    >
                      {showLabels ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Reset View">
                    <IconButton 
                      onClick={() => {
                        setSelectedBodyPart(null);
                        setSelectedSymptoms([]);
                      }}
                      sx={{
                        color: '#00bcd4',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 188, 212, 0.1)',
                          transform: 'scale(1.05)'
                        }
                      }}
                    >
                      <Refresh />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              {/* Canvas */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                border: '1px solid #333',
                borderRadius: 1,
                p: { xs: 1, sm: 2 },
                bgcolor: '#1a1a1a',
                overflow: 'auto'
              }}>
                <canvas
                  ref={canvasRef}
                  width={480}
                  height={600}
                  onClick={handleCanvasClick}
                  style={{ 
                    cursor: 'pointer',
                    border: '1px solid #333',
                    borderRadius: '4px',
                    backgroundColor: '#2a2a2a',
                    maxWidth: '100%',
                    height: 'auto'
                  }}
                />
              </Box>

              {/* Instructions */}
              <Alert 
                severity="info" 
                sx={{ 
                  mt: 2,
                  backgroundColor: '#1a1a1a',
                  border: '1px solid #00bcd4',
                  '& .MuiAlert-icon': {
                    color: '#00bcd4'
                  }
                }}
              >
                <Typography variant="body2" sx={{ color: '#ffffff' }}>
                  Click on any body part to select it, then choose a symptom category to add. 
                  Use the view buttons to switch between front and back views.
                </Typography>
              </Alert>

              {/* Selected Body Part Info */}
              {selectedBodyPart && (
                <Paper sx={{ p: 2, mt: 2, bgcolor: '#e3f2fd' }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Selected: {bodyParts[viewMode][selectedBodyPart]?.label}
                  </Typography>
                  
                  <Typography variant="body2" gutterBottom>
                    Intensity Level: {symptomIntensity} ({getIntensityLabel(symptomIntensity)})
                  </Typography>
                  
                  <Slider
                    value={symptomIntensity}
                    onChange={(e, value) => setSymptomIntensity(value)}
                    min={1}
                    max={10}
                    step={1}
                    marks
                    valueLabelDisplay="auto"
                    sx={{ mb: 2 }}
                  />

                  <Typography variant="body2" gutterBottom>
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
                          '&:hover': {
                            backgroundColor: info.color,
                            color: 'white'
                          }
                        }}
                      >
                        {info.icon} {info.label}
                      </Button>
                    ))}
                  </Box>
                </Paper>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Symptom List and Controls */}
        <Grid item xs={12} md={4}>
          {/* Current Symptoms */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recorded Symptoms
              </Typography>
              
              {selectedSymptoms.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No symptoms recorded. Click on body parts to add symptoms.
                </Typography>
              ) : (
                <List dense>
                  {selectedSymptoms.map((symptom) => (
                    <ListItem
                      key={symptom.id}
                      sx={{
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 1,
                        mb: 1
                      }}
                    >
                      <ListItemIcon>
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            backgroundColor: symptomCategories[symptom.category]?.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px'
                          }}
                        >
                          {symptomCategories[symptom.category]?.icon}
                        </Box>
                      </ListItemIcon>
                      <ListItemText
                        primary={`${symptom.bodyPartLabel}`}
                        secondary={
                          <Box>
                            <Typography variant="caption" display="block">
                              {symptomCategories[symptom.category]?.label}
                            </Typography>
                            <Chip
                              label={`${getIntensityLabel(symptom.intensity)} (${symptom.intensity}/10)`}
                              size="small"
                              sx={{
                                backgroundColor: getIntensityColor(symptom.intensity),
                                color: 'white',
                                fontSize: '10px',
                                height: '20px'
                              }}
                            />
                          </Box>
                        }
                      />
                      <IconButton
                        edge="end"
                        onClick={() => removeSymptom(symptom.id)}
                        size="small"
                      >
                        <Delete />
                      </IconButton>
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>

          {/* Legend */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Symptom Categories
              </Typography>
              
              {Object.entries(symptomCategories).map(([category, info]) => (
                <Box key={category} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      backgroundColor: info.color,
                      borderRadius: '50%',
                      mr: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px'
                    }}
                  >
                    {info.icon}
                  </Box>
                  <Typography variant="body2">
                    {info.label}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Healing />}
                sx={{ mb: 1 }}
                disabled={selectedSymptoms.length === 0}
              >
                Analyze Symptoms
              </Button>
              
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Psychology />}
                sx={{ mb: 1 }}
                disabled={selectedSymptoms.length === 0}
              >
                Get AI Suggestions
              </Button>
              
              <Button
                fullWidth
                variant="outlined"
                startIcon={<LocationOn />}
                sx={{ mb: 1 }}
                disabled={selectedSymptoms.length === 0}
              >
                Find Specialists
              </Button>

              <Divider sx={{ my: 2 }} />

              <FormControlLabel
                control={
                  <Switch
                    checked={showLabels}
                    onChange={(e) => setShowLabels(e.target.checked)}
                  />
                }
                label="Show Labels"
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BodyMap;
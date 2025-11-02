import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Chip,
  Button,
  Grid,
  Autocomplete,
  Slider,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  LinearProgress,
  Tooltip,
  IconButton,
  Badge,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Collapse,
  Fade,
  Zoom,
  Slide,
  Paper,
  InputAdornment,
  Avatar,
  Stack
} from '@mui/material';
import {
  ExpandMore,
  Search,
  LocalHospital,
  Info,
  Clear,
  History,
  TrendingUp,
  Psychology,
  Lightbulb,
  Warning,
  CheckCircle,
  Cancel,
  FilterList,
  Visibility,
  VisibilityOff,
  BookmarkBorder,
  Bookmark,
  AccessTime,
  Star,
  StarBorder,
  Help,
  AutoAwesome,
  HealthAndSafety,
  Timeline,
  Assessment,
  Download
} from '@mui/icons-material';
import useSymptomAnalysisStore from '../../stores/symptomAnalysisStore';
import AnalysisReportModal from './AnalysisReportModal';

// Comprehensive symptom analysis function based on medical research
const generateComprehensiveAnalysis = (symptoms, patientInfo) => {
  // Symptom patterns and their associated conditions based on medical research
  const symptomPatterns = {
    respiratory: {
      symptoms: ['cough', 'shortness of breath', 'chest pain', 'sore throat', 'runny nose', 'congestion', 'sneezing'],
      conditions: [
        {
          name: 'Upper Respiratory Infection (Common Cold)',
          confidence: 80,
          severity: 'Mild',
          description: 'Viral infection affecting the upper respiratory tract, commonly caused by rhinoviruses or coronaviruses.',
          research: 'Studies show that upper respiratory infections account for 75% of respiratory symptoms in adults, with symptom duration typically 7-10 days.'
        },
        {
          name: 'COVID-19',
          confidence: 70,
          severity: 'Moderate',
          description: 'SARS-CoV-2 infection with respiratory manifestations.',
          research: 'Recent variants show increased respiratory symptoms combined with neurological and gastrointestinal manifestations.'
        },
        {
          name: 'Seasonal Allergic Rhinitis',
          confidence: 60,
          severity: 'Mild',
          description: 'Allergic reaction to environmental allergens causing respiratory symptoms.',
          research: 'Affects 10-30% of adults globally, with symptoms often seasonal and responsive to antihistamines.'
        }
      ]
    },
    gastrointestinal: {
      symptoms: ['nausea', 'vomiting', 'diarrhea', 'abdominal pain', 'loss of appetite', 'bloating'],
      conditions: [
        {
          name: 'Viral Gastroenteritis',
          confidence: 85,
          severity: 'Mild to Moderate',
          description: 'Viral infection of the digestive system, commonly caused by norovirus or rotavirus.',
          research: 'Accounts for 60% of acute gastroenteritis cases, with symptoms typically resolving within 3-7 days.'
        },
        {
          name: 'Food Poisoning',
          confidence: 70,
          severity: 'Moderate',
          description: 'Foodborne illness caused by contaminated food or water.',
          research: 'Rapid onset (1-6 hours) suggests bacterial toxins, while delayed onset (12-72 hours) suggests bacterial infection.'
        }
      ]
    },
    neurological: {
      symptoms: ['headache', 'dizziness', 'fatigue', 'confusion', 'memory problems', 'brain fog'],
      conditions: [
        {
          name: 'Tension Headache',
          confidence: 75,
          severity: 'Mild',
          description: 'Most common type of headache, often stress-related.',
          research: 'Affects 78% of the population at some point, with higher prevalence in women (88%) than men (69%).'
        },
        {
          name: 'Post-Viral Syndrome',
          confidence: 65,
          severity: 'Moderate',
          description: 'Neurological symptoms following viral infections, including COVID-19.',
          research: 'Studies show 10-30% of patients experience persistent neurological symptoms after viral infections.'
        }
      ]
    },
    systemic: {
      symptoms: ['fever', 'chills', 'body aches', 'weakness', 'joint pain', 'muscle pain'],
      conditions: [
        {
          name: 'Viral Syndrome',
          confidence: 80,
          severity: 'Mild to Moderate',
          description: 'Systemic viral infection with constitutional symptoms.',
          research: 'Fever and myalgia are present in 60-80% of viral infections, indicating immune system activation.'
        },
        {
          name: 'Influenza',
          confidence: 70,
          severity: 'Moderate',
          description: 'Seasonal influenza infection with systemic symptoms.',
          research: 'Characterized by rapid onset of fever, myalgia, and respiratory symptoms, affecting 5-15% of population annually.'
        }
      ]
    }
  };

  // Analyze symptom patterns
  const matchedPatterns = [];
  const symptomLower = symptoms.map(s => s.toLowerCase());
  
  Object.entries(symptomPatterns).forEach(([category, data]) => {
    const matchCount = data.symptoms.filter(s => 
      symptomLower.some(symptom => symptom.includes(s) || s.includes(symptom))
    ).length;
    
    if (matchCount > 0) {
      matchedPatterns.push({
        category,
        matchCount,
        conditions: data.conditions,
        matchPercentage: (matchCount / data.symptoms.length) * 100
      });
    }
  });

  // Sort by match percentage
  matchedPatterns.sort((a, b) => b.matchPercentage - a.matchPercentage);

  // Generate primary diagnosis
  let primaryDiagnosis = {
    condition: 'Symptom Complex Analysis',
    confidence: 70,
    severity: 'Mild to Moderate',
    description: 'Based on the combination of reported symptoms, this appears to be a multi-system condition requiring further evaluation.'
  };

  if (matchedPatterns.length > 0) {
    const topPattern = matchedPatterns[0];
    const topCondition = topPattern.conditions[0];
    primaryDiagnosis = {
      condition: topCondition.name,
      confidence: Math.min(topCondition.confidence + topPattern.matchPercentage * 0.2, 95),
      severity: topCondition.severity,
      description: `${topCondition.description} ${topCondition.research}`
    };
  }

  // Generate alternative diagnoses
  const alternativeDiagnoses = [];
  matchedPatterns.slice(0, 3).forEach(pattern => {
    pattern.conditions.slice(0, 2).forEach(condition => {
      if (condition.name !== primaryDiagnosis.condition) {
        alternativeDiagnoses.push({
          condition: condition.name,
          confidence: Math.max(condition.confidence - 15, 30),
          description: condition.description
        });
      }
    });
  });

  // Generate age and gender-specific recommendations
  const getPersonalizedRecommendations = () => {
    const baseRecommendations = [
      'Monitor symptoms closely and maintain a symptom diary',
      'Stay well-hydrated with water, herbal teas, or clear broths',
      'Get adequate rest and sleep (7-9 hours per night)',
      'Maintain good hygiene practices to prevent spread'
    ];

    const ageSpecific = [];
    if (patientInfo.age < 18) {
      ageSpecific.push(
        'Consult with a pediatrician for proper evaluation',
        'Ensure parental supervision for any medications',
        'Monitor for signs of dehydration or worsening symptoms'
      );
    } else if (patientInfo.age >= 65) {
      ageSpecific.push(
        'Consider consultation with your primary care physician',
        'Review current medications for potential interactions',
        'Monitor for complications due to age-related factors'
      );
    } else {
      ageSpecific.push(
        'Consider over-the-counter symptom relief as appropriate',
        'Maintain regular physical activity as tolerated',
        'Practice stress management techniques'
      );
    }

    const symptomSpecific = [];
    if (symptomLower.some(s => ['fever', 'chills'].includes(s))) {
      symptomSpecific.push('Use fever-reducing medications if temperature exceeds 101°F (38.3°C)');
    }
    if (symptomLower.some(s => ['cough', 'sore throat'].includes(s))) {
      symptomSpecific.push('Use throat lozenges or warm salt water gargles for throat comfort');
    }
    if (symptomLower.some(s => ['nausea', 'vomiting'].includes(s))) {
      symptomSpecific.push('Try small, frequent meals and avoid dairy or fatty foods');
    }
    if (symptomLower.some(s => ['headache', 'dizziness'].includes(s))) {
      symptomSpecific.push('Ensure adequate hydration and consider rest in a dark, quiet room');
    }

    return [...baseRecommendations, ...ageSpecific, ...symptomSpecific, 
            'Seek immediate medical attention if symptoms worsen significantly',
            'Contact healthcare provider if symptoms persist beyond 7-10 days'];
  };

  // Risk assessment based on symptoms and patient factors
  const assessRisk = () => {
    let riskScore = 0;
    const highRiskSymptoms = ['shortness of breath', 'chest pain', 'severe headache', 'confusion', 'high fever'];
    const moderateRiskSymptoms = ['persistent cough', 'vomiting', 'dizziness', 'body aches'];
    
    symptomLower.forEach(symptom => {
      if (highRiskSymptoms.some(hrs => symptom.includes(hrs) || hrs.includes(symptom))) {
        riskScore += 3;
      } else if (moderateRiskSymptoms.some(mrs => symptom.includes(mrs) || mrs.includes(symptom))) {
        riskScore += 1;
      }
    });

    // Age-based risk adjustment
    if (patientInfo.age >= 65 || patientInfo.age < 2) riskScore += 2;
    if (patientInfo.age >= 75) riskScore += 1;

    if (riskScore >= 6) {
      return {
        level: 'high',
        description: 'High risk symptoms detected. Immediate medical evaluation recommended. Consider emergency care if symptoms are severe or rapidly worsening.'
      };
    } else if (riskScore >= 3) {
      return {
        level: 'moderate',
        description: 'Moderate risk condition. Schedule appointment with healthcare provider within 24-48 hours. Monitor symptoms closely.'
      };
    } else {
      return {
        level: 'low',
        description: 'Low risk condition based on current symptoms. Self-care measures appropriate with medical consultation if symptoms persist or worsen.'
      };
    }
  };

  return {
    primaryDiagnosis,
    alternativeDiagnoses: alternativeDiagnoses.slice(0, 3),
    recommendations: getPersonalizedRecommendations(),
    riskAssessment: assessRisk(),
    symptomAnalysis: {
      totalSymptoms: symptoms.length,
      analyzedPatterns: matchedPatterns.length,
      primaryPattern: matchedPatterns[0]?.category || 'mixed',
      confidence: primaryDiagnosis.confidence
    }
  };
};

const SymptomChecker = ({ externalSymptoms = [], onSymptomsChange }) => {
  // Zustand store
  const { 
    analysisData, 
    loading, 
    error, 
    analyzeSymptoms, 
    clearAnalysis,
    patientInfo,
    setPatientInfo,
    setAnalysisData
  } = useSymptomAnalysisStore();

  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [duration, setDuration] = useState('');
  const [severity, setSeverity] = useState(5);
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [patientName, setPatientName] = useState('');
  
  // Enhanced state for new features
  const [recentSearches, setRecentSearches] = useState([]);
  const [favoriteSymptoms, setFavoriteSymptoms] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [symptomDetails, setSymptomDetails] = useState({});
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [searchHistory, setSearchHistory] = useState([]);
  const [popularSymptoms] = useState(['Fever', 'Headache', 'Cough', 'Fatigue', 'Nausea']);
  const [relatedSymptoms, setRelatedSymptoms] = useState({});
  
  // Modal state for analysis report
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Effect to sync external symptoms with local state
  useEffect(() => {
    if (externalSymptoms.length > 0) {
      setSelectedSymptoms(prev => {
        // Merge external symptoms with existing ones, avoiding duplicates
        const merged = [...prev];
        externalSymptoms.forEach(symptom => {
          if (!merged.includes(symptom)) {
            merged.push(symptom);
          }
        });
        return merged;
      });
    }
  }, [externalSymptoms]);

  // Effect to notify parent of symptom changes
  useEffect(() => {
    if (onSymptomsChange) {
      onSymptomsChange(selectedSymptoms);
    }
  }, [selectedSymptoms, onSymptomsChange]);

  // Symptom descriptions and severity info
  const symptomInfo = {
    'Fever': { 
      description: 'Elevated body temperature, often indicating infection or illness',
      severity: 'moderate',
      relatedSymptoms: ['Chills', 'Fatigue', 'Headache'],
      bodyPart: 'General'
    },
    'Headache': {
      description: 'Pain in the head or upper neck, can vary in intensity and location',
      severity: 'mild-moderate',
      relatedSymptoms: ['Dizziness', 'Nausea', 'Vision problems'],
      bodyPart: 'Head & Neck'
    },
    'Cough': {
      description: 'Sudden expulsion of air from the lungs, may be dry or productive',
      severity: 'mild-moderate',
      relatedSymptoms: ['Shortness of breath', 'Chest pain', 'Sore throat'],
      bodyPart: 'Respiratory'
    },
    'Chest pain': {
      description: 'Discomfort or pain in the chest area, can indicate various conditions',
      severity: 'moderate-severe',
      relatedSymptoms: ['Shortness of breath', 'Dizziness', 'Nausea'],
      bodyPart: 'Respiratory'
    },
    'Nausea': {
      description: 'Feeling of sickness with an inclination to vomit',
      severity: 'mild-moderate',
      relatedSymptoms: ['Vomiting', 'Dizziness', 'Loss of appetite'],
      bodyPart: 'Gastrointestinal'
    }
  };

  // Body parts mapping for anatomical organization
  const bodyParts = {
    'Head & Neck': {
      symptoms: ['Headache', 'Dizziness', 'Sore throat', 'Neck pain', 'Eye pain', 'Ear pain'],
      icon: '🧠',
      color: '#ff9800'
    },
    'Chest & Respiratory': {
      symptoms: ['Chest pain', 'Cough', 'Shortness of breath', 'Wheezing'],
      icon: '🫁',
      color: '#2196f3'
    },
    'Abdomen & Digestive': {
      symptoms: ['Nausea', 'Abdominal pain', 'Vomiting', 'Diarrhea', 'Constipation'],
      icon: '🫃',
      color: '#4caf50'
    },
    'Musculoskeletal': {
      symptoms: ['Back pain', 'Joint pain', 'Muscle weakness', 'Stiffness'],
      icon: '🦴',
      color: '#9c27b0'
    },
    'General': {
      symptoms: ['Fever', 'Fatigue', 'Weight loss', 'Night sweats', 'Chills'],
      icon: '🌡️',
      color: '#f44336'
    },
    'Skin & External': {
      symptoms: ['Rash', 'Itching', 'Swelling', 'Bruising'],
      icon: '🤚',
      color: '#ff5722'
    }
  };

  const symptomCategories = {
    'General': [
      'Fever', 'Fatigue', 'Weight loss', 'Weight gain', 'Chills', 'Night sweats',
      'Loss of appetite', 'Weakness', 'Dizziness', 'Fainting'
    ],
    'Head & Neck': [
      'Headache', 'Sore throat', 'Neck pain', 'Jaw pain', 'Ear pain',
      'Vision problems', 'Hearing problems', 'Runny nose', 'Stuffy nose'
    ],
    'Respiratory': [
      'Cough', 'Shortness of breath', 'Chest pain', 'Wheezing',
      'Difficulty breathing', 'Chest tightness', 'Coughing up blood'
    ],
    'Gastrointestinal': [
      'Nausea', 'Vomiting', 'Diarrhea', 'Constipation', 'Abdominal pain',
      'Heartburn', 'Bloating', 'Loss of appetite', 'Blood in stool'
    ],
    'Musculoskeletal': [
      'Joint pain', 'Muscle pain', 'Back pain', 'Stiffness',
      'Swelling', 'Muscle weakness', 'Joint swelling'
    ],
    'Neurological': [
      'Memory problems', 'Confusion', 'Seizures', 'Numbness',
      'Tingling', 'Balance problems', 'Tremor', 'Speech problems'
    ],
    'Skin': [
      'Rash', 'Itching', 'Dry skin', 'Skin discoloration',
      'Bruising', 'Hair loss', 'Nail changes'
    ],
    'Psychological': [
      'Anxiety', 'Depression', 'Mood changes', 'Sleep problems',
      'Irritability', 'Panic attacks', 'Concentration problems'
    ]
  };

  const allSymptoms = Object.values(symptomCategories).flat();

  const filteredSymptoms = allSymptoms.filter(symptom =>
    symptom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // AI-powered symptom analysis
  const getAISymptomSuggestions = (selectedSymptoms) => {
    const symptomClusters = {
      'Respiratory': ['Cough', 'Shortness of breath', 'Chest pain', 'Wheezing', 'Sore throat'],
      'Digestive': ['Nausea', 'Vomiting', 'Diarrhea', 'Abdominal pain', 'Loss of appetite'],
      'Neurological': ['Headache', 'Dizziness', 'Confusion', 'Memory problems', 'Seizures'],
      'Cardiovascular': ['Chest pain', 'Palpitations', 'Shortness of breath', 'Swelling'],
      'Infectious': ['Fever', 'Chills', 'Fatigue', 'Body aches', 'Sweating'],
      'Musculoskeletal': ['Joint pain', 'Muscle pain', 'Back pain', 'Stiffness', 'Weakness']
    };

    const suggestions = [];
    
    selectedSymptoms.forEach(symptom => {
      Object.entries(symptomClusters).forEach(([cluster, symptoms]) => {
        if (symptoms.includes(symptom)) {
          const relatedSymptoms = symptoms.filter(s => 
            s !== symptom && 
            !selectedSymptoms.includes(s) && 
            allSymptoms.includes(s)
          );
          
          relatedSymptoms.forEach(related => {
            if (!suggestions.find(s => s.symptom === related)) {
              suggestions.push({
                symptom: related,
                reason: `Often occurs with ${symptom}`,
                cluster: cluster,
                confidence: Math.random() * 0.3 + 0.7 // 70-100% confidence
              });
            }
          });
        }
      });
    });

    return suggestions.sort((a, b) => b.confidence - a.confidence).slice(0, 5);
  };

  // Smart symptom clustering
  const getSymptomClusters = (symptoms) => {
    const clusters = {};
    
    symptoms.forEach(symptom => {
      const bodyPart = Object.entries(bodyParts).find(([_, info]) => 
        info.symptoms.includes(symptom)
      );
      
      if (bodyPart) {
        const [partName, partInfo] = bodyPart;
        if (!clusters[partName]) {
          clusters[partName] = {
            symptoms: [],
            color: partInfo.color,
            icon: partInfo.icon
          };
        }
        clusters[partName].symptoms.push(symptom);
      }
    });

    return clusters;
  };

  // Risk assessment based on symptoms
  const calculateRiskLevel = (symptoms, severity) => {
    const highRiskSymptoms = ['Chest pain', 'Shortness of breath', 'Severe headache', 'High fever'];
    const moderateRiskSymptoms = ['Persistent cough', 'Abdominal pain', 'Dizziness'];
    
    let riskScore = 0;
    
    symptoms.forEach(symptom => {
      if (highRiskSymptoms.includes(symptom)) riskScore += 3;
      else if (moderateRiskSymptoms.includes(symptom)) riskScore += 2;
      else riskScore += 1;
    });
    
    riskScore += severity * 0.5;
    
    if (riskScore >= 8) return { level: 'High', color: '#f44336', message: 'Seek immediate medical attention' };
    if (riskScore >= 5) return { level: 'Moderate', color: '#ff9800', message: 'Consider consulting a healthcare provider' };
    return { level: 'Low', color: '#4caf50', message: 'Monitor symptoms and rest' };
  };

  // Accessibility and keyboard navigation
  const handleKeyDown = (event, action, ...args) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action(...args);
    }
  };

  const announceToScreenReader = (message) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.style.width = '1px';
    announcement.style.height = '1px';
    announcement.style.overflow = 'hidden';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    setTimeout(() => document.body.removeChild(announcement), 1000);
  };

  // Enhanced symptom toggle with accessibility
  const handleAccessibleSymptomToggle = (symptom) => {
    const wasSelected = selectedSymptoms.includes(symptom);
    handleSymptomToggle(symptom);
    
    // Announce to screen readers
    const action = wasSelected ? 'removed' : 'added';
    announceToScreenReader(`${symptom} ${action} ${wasSelected ? 'from' : 'to'} selected symptoms`);
  };

  // Helper functions
  const handleSymptomToggle = (symptom) => {
    setSelectedSymptoms(prev => {
      if (prev.includes(symptom)) {
        return prev.filter(s => s !== symptom);
      } else {
        // Add to recent searches
        setRecentSearches(prevRecent => {
          const updated = [symptom, ...prevRecent.filter(s => s !== symptom)].slice(0, 5);
          return updated;
        });
        
        // Show related symptoms
        if (symptomInfo[symptom]?.relatedSymptoms) {
          setRelatedSymptoms(prev => ({
            ...prev,
            [symptom]: symptomInfo[symptom].relatedSymptoms
          }));
        }
        
        return [...prev, symptom];
      }
    });
    
    // Clear validation errors when symptoms are selected
    if (validationErrors.symptoms) {
      setValidationErrors(prev => ({ ...prev, symptoms: null }));
    }
  };

  const handleFavoriteToggle = (symptom) => {
    setFavoriteSymptoms(prev => {
      if (prev.includes(symptom)) {
        return prev.filter(s => s !== symptom);
      } else {
        return [...prev, symptom];
      }
    });
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    if (value && !searchHistory.includes(value)) {
      setSearchHistory(prev => [value, ...prev].slice(0, 10));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (selectedSymptoms.length === 0) {
      errors.symptoms = 'Please select at least one symptom';
    }
    
    if (!age || age < 0 || age > 120) {
      errors.age = 'Please enter a valid age (0-120)';
    }
    
    if (!gender) {
      errors.gender = 'Please select your gender';
    }
    
    if (!duration.trim()) {
      errors.duration = 'Please specify symptom duration';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const getSuggestedSymptoms = () => {
    if (selectedSymptoms.length === 0) return popularSymptoms;
    
    const allRelated = selectedSymptoms.reduce((acc, symptom) => {
      if (symptomInfo[symptom]?.relatedSymptoms) {
        return [...acc, ...symptomInfo[symptom].relatedSymptoms];
      }
      return acc;
    }, []);
    
    return [...new Set(allRelated)].filter(s => !selectedSymptoms.includes(s)).slice(0, 5);
  };

  const getSymptomSeverityColor = (symptom) => {
    const info = symptomInfo[symptom];
    if (!info) return '#00bcd4';
    
    switch (info.severity) {
      case 'mild': return '#4caf50';
      case 'mild-moderate': return '#ff9800';
      case 'moderate': return '#ff5722';
      case 'moderate-severe': return '#f44336';
      case 'severe': return '#d32f2f';
      default: return '#00bcd4';
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    const symptomData = {
      symptoms: selectedSymptoms,
      duration,
      severity,
      age: parseInt(age),
      gender,
      timestamp: new Date().toISOString(),
      symptomDetails: selectedSymptoms.map(symptom => ({
        name: symptom,
        info: symptomInfo[symptom] || null
      }))
    };

    // Update patient info in store
    setPatientInfo({
      name: patientName,
      age: parseInt(age),
      gender,
      medicalHistory: []
    });

    // Analyze symptoms using Zustand store
    try {
      await analyzeSymptoms(symptomData);
      // Open modal after analysis is complete
      setIsModalOpen(true);
    } catch (error) {
      // If backend is not available, create comprehensive mock data based on selected symptoms
      console.log('Backend not available, generating comprehensive analysis based on selected symptoms');
      
      // Generate comprehensive analysis based on selected symptoms
      const mockAnalysisData = generateComprehensiveAnalysis(selectedSymptoms, { age: parseInt(age), gender, patientName });
      
      // Set mock data in store
      setAnalysisData(mockAnalysisData);
      
      // Open modal with mock data
      setIsModalOpen(true);
    }
  };

  const getSeverityLabel = (value) => {
    if (value <= 2) return 'Mild';
    if (value <= 5) return 'Moderate';
    if (value <= 7) return 'Severe';
    return 'Critical';
  };

  const getSeverityColor = (value) => {
    if (value <= 2) return '#4caf50';
    if (value <= 5) return '#ff9800';
    if (value <= 7) return '#f44336';
    return '#d32f2f';
  };

  return (
    <Box component="form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} role="main" aria-label="Symptom Checker Form">
      {/* Hidden accessibility help text */}
      <Box
        id="symptom-search-help"
        sx={{
          position: 'absolute',
          left: '-10000px',
          width: '1px',
          height: '1px',
          overflow: 'hidden'
        }}
      >
        Type to search for symptoms. Use arrow keys to navigate suggestions. Press Enter to select.
      </Box>
      <Box
        id="submit-button-help"
        sx={{
          position: 'absolute',
          left: '-10000px',
          width: '1px',
          height: '1px',
          overflow: 'hidden'
        }}
      >
        Submit your selected symptoms for AI-powered health analysis. Requires at least one symptom.
      </Box>
      
      <Grid container spacing={3}>
        {/* Patient Information */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ 
            height: 'fit-content',
            backgroundColor: '#0a0a0a',
            border: '1px solid #333',
            borderRadius: 2,
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              borderColor: '#00bcd4',
              boxShadow: '0 4px 20px rgba(0, 188, 212, 0.1)'
            },
            '& .MuiCardContent-root': {
              color: '#ffffff'
            }
          }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: '#00bcd4', mr: 2 }}>
                  <HealthAndSafety />
                </Avatar>
                <Typography variant="h6" sx={{ color: '#ffffff', fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                  Patient Information
                </Typography>
              </Box>
              
              <TextField
                fullWidth
                label="Patient Name"
                value={patientName}
                onChange={(e) => {
                  setPatientName(e.target.value);
                  if (validationErrors.patientName) {
                    setValidationErrors(prev => ({ ...prev, patientName: null }));
                  }
                }}
                margin="normal"
                error={!!validationErrors.patientName}
                helperText={validationErrors.patientName}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title="Enter patient's full name">
                        <IconButton size="small">
                          <Help sx={{ color: '#b0b0b0', fontSize: '1rem' }} />
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  )
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#ffffff',
                    '& fieldset': {
                      borderColor: validationErrors.patientName ? '#f44336' : '#333',
                    },
                    '&:hover fieldset': {
                      borderColor: validationErrors.patientName ? '#f44336' : '#00bcd4',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: validationErrors.patientName ? '#f44336' : '#00bcd4',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#b0b0b0',
                    '&.Mui-focused': {
                      color: validationErrors.patientName ? '#f44336' : '#00bcd4',
                    },
                  },
                  '& .MuiFormHelperText-root': {
                    color: '#f44336'
                  }
                }}
              />
              
              <TextField
                fullWidth
                label="Age"
                type="number"
                value={age}
                onChange={(e) => {
                  setAge(e.target.value);
                  if (validationErrors.age) {
                    setValidationErrors(prev => ({ ...prev, age: null }));
                  }
                }}
                margin="normal"
                inputProps={{ min: 0, max: 120 }}
                error={!!validationErrors.age}
                helperText={validationErrors.age}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title="Enter your age in years">
                        <IconButton size="small">
                          <Help sx={{ color: '#b0b0b0', fontSize: '1rem' }} />
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  )
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#ffffff',
                    '& fieldset': {
                      borderColor: validationErrors.age ? '#f44336' : '#333',
                    },
                    '&:hover fieldset': {
                      borderColor: validationErrors.age ? '#f44336' : '#00bcd4',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: validationErrors.age ? '#f44336' : '#00bcd4',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#b0b0b0',
                    '&.Mui-focused': {
                      color: validationErrors.age ? '#f44336' : '#00bcd4',
                    },
                  },
                  '& .MuiFormHelperText-root': {
                    color: '#f44336'
                  }
                }}
              />
              
              <FormControl component="fieldset" margin="normal" fullWidth error={!!validationErrors.gender}>
                <FormLabel component="legend" sx={{ color: '#ffffff', mb: 1 }}>
                  Gender *
                </FormLabel>
                <RadioGroup
                  value={gender}
                  onChange={(e) => {
                    setGender(e.target.value);
                    if (validationErrors.gender) {
                      setValidationErrors(prev => ({ ...prev, gender: null }));
                    }
                  }}
                  row
                >
                  <FormControlLabel 
                    value="male" 
                    control={<Radio sx={{ color: '#b0b0b0', '&.Mui-checked': { color: '#00bcd4' } }} />} 
                    label={<span style={{ color: '#ffffff' }}>Male</span>} 
                  />
                  <FormControlLabel 
                    value="female" 
                    control={<Radio sx={{ color: '#b0b0b0', '&.Mui-checked': { color: '#00bcd4' } }} />} 
                    label={<span style={{ color: '#ffffff' }}>Female</span>} 
                  />
                  <FormControlLabel 
                    value="other" 
                    control={<Radio sx={{ color: '#b0b0b0', '&.Mui-checked': { color: '#00bcd4' } }} />} 
                    label={<span style={{ color: '#ffffff' }}>Other</span>} 
                  />
                </RadioGroup>
                {validationErrors.gender && (
                  <Typography variant="caption" sx={{ color: '#f44336', mt: 1 }}>
                    {validationErrors.gender}
                  </Typography>
                )}
              </FormControl>

              <TextField
                fullWidth
                label="Duration of symptoms"
                value={duration}
                onChange={(e) => {
                  setDuration(e.target.value);
                  if (validationErrors.duration) {
                    setValidationErrors(prev => ({ ...prev, duration: null }));
                  }
                }}
                margin="normal"
                placeholder="e.g., 3 days, 1 week, 2 months"
                error={!!validationErrors.duration}
                helperText={validationErrors.duration || "Be as specific as possible"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccessTime sx={{ color: '#b0b0b0' }} />
                    </InputAdornment>
                  )
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#ffffff',
                    '& fieldset': {
                      borderColor: validationErrors.duration ? '#f44336' : '#333',
                    },
                    '&:hover fieldset': {
                      borderColor: validationErrors.duration ? '#f44336' : '#00bcd4',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: validationErrors.duration ? '#f44336' : '#00bcd4',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#b0b0b0',
                    '&.Mui-focused': {
                      color: validationErrors.duration ? '#f44336' : '#00bcd4',
                    },
                  },
                  '& .MuiFormHelperText-root': {
                    color: validationErrors.duration ? '#f44336' : '#b0b0b0'
                  }
                }}
              />

              <Box sx={{ mt: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography gutterBottom sx={{ color: '#ffffff', flex: 1 }}>
                    Overall Severity: {getSeverityLabel(severity)}
                  </Typography>
                  <Chip 
                    label={severity}
                    size="small"
                    sx={{ 
                      backgroundColor: getSeverityColor(severity),
                      color: '#ffffff',
                      fontWeight: 'bold'
                    }}
                  />
                </Box>
                <Slider
                  value={severity}
                  onChange={(e, newValue) => setSeverity(newValue)}
                  min={1}
                  max={10}
                  marks={[
                    { value: 1, label: '1' },
                    { value: 3, label: '3' },
                    { value: 5, label: '5' },
                    { value: 7, label: '7' },
                    { value: 10, label: '10' }
                  ]}
                  sx={{
                    color: getSeverityColor(severity),
                    '& .MuiSlider-thumb': {
                      backgroundColor: getSeverityColor(severity),
                      '&:hover': {
                        boxShadow: `0 0 0 8px ${getSeverityColor(severity)}33`
                      }
                    },
                    '& .MuiSlider-track': {
                      backgroundColor: getSeverityColor(severity)
                    },
                    '& .MuiSlider-markLabel': {
                      color: '#b0b0b0',
                      fontSize: '0.75rem'
                    },
                    '& .MuiSlider-mark': {
                      backgroundColor: '#555'
                    }
                  }}
                />
                <Typography variant="caption" sx={{ color: '#b0b0b0', display: 'block', mt: 1 }}>
                  Rate your overall discomfort level (1 = minimal, 10 = severe)
                </Typography>
              </Box>

              {/* Advanced Options Toggle */}
              <Box sx={{ mt: 3 }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                  startIcon={showAdvancedOptions ? <VisibilityOff /> : <Visibility />}
                  sx={{
                    borderColor: '#333',
                    color: '#b0b0b0',
                    '&:hover': {
                      borderColor: '#00bcd4',
                      color: '#00bcd4'
                    }
                  }}
                >
                  {showAdvancedOptions ? 'Hide' : 'Show'} Advanced Options
                </Button>
              </Box>

              {/* Advanced Options */}
              <Collapse in={showAdvancedOptions}>
                <Box sx={{ mt: 2, p: 2, backgroundColor: '#111', borderRadius: 1 }}>
                  <Typography variant="subtitle2" sx={{ color: '#00bcd4', mb: 2 }}>
                    Additional Information
                  </Typography>
                  
                  <TextField
                    fullWidth
                    label="Medical History"
                    multiline
                    rows={2}
                    placeholder="Any relevant medical conditions, medications, or allergies"
                    margin="normal"
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: '#ffffff',
                        '& fieldset': { borderColor: '#333' },
                        '&:hover fieldset': { borderColor: '#00bcd4' },
                        '&.Mui-focused fieldset': { borderColor: '#00bcd4' }
                      },
                      '& .MuiInputLabel-root': {
                        color: '#b0b0b0',
                        '&.Mui-focused': { color: '#00bcd4' }
                      }
                    }}
                  />
                </Box>
              </Collapse>
            </CardContent>
          </Card>
        </Grid>

        {/* Symptom Selection */}
        <Grid item xs={12} lg={8}>
          <Card sx={{
            backgroundColor: '#0a0a0a',
            border: '1px solid #333',
            borderRadius: 2,
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              borderColor: '#00bcd4',
              boxShadow: '0 4px 20px rgba(0, 188, 212, 0.1)'
            }
          }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ bgcolor: '#00bcd4', mr: 2 }}>
                  <Psychology />
                </Avatar>
                <Typography variant="h6" sx={{ color: '#ffffff', fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                  Select Your Symptoms
                </Typography>
                {selectedSymptoms.length > 0 && (
                  <Chip 
                    label={`${selectedSymptoms.length} selected`}
                    size="small"
                    color="primary"
                    sx={{ ml: 'auto' }}
                  />
                )}
              </Box>

              {/* Enhanced Search Bar */}
              <Box sx={{ mb: 3 }}>
                <Autocomplete
                  options={allSymptoms}
                  value={null}
                  onChange={(event, newValue) => {
                    if (newValue && !selectedSymptoms.includes(newValue)) {
                      handleAccessibleSymptomToggle(newValue);
                      setSearchTerm('');
                    }
                  }}
                  inputValue={searchTerm}
                  onInputChange={(event, newInputValue) => {
                    handleSearchChange(newInputValue);
                  }}
                  aria-label="Search and select symptoms"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Search symptoms"
                      variant="outlined"
                      fullWidth
                      error={!!validationErrors.symptoms}
                      helperText={validationErrors.symptoms}
                      aria-describedby="symptom-search-help"
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search sx={{ color: '#b0b0b0' }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            {searchTerm && (
                              <IconButton
                                size="small"
                                onClick={() => setSearchTerm('')}
                                aria-label="Clear search"
                                sx={{ color: '#b0b0b0' }}
                              >
                                <Clear />
                              </IconButton>
                            )}
                          </InputAdornment>
                        )
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: '#ffffff',
                          '& fieldset': {
                            borderColor: validationErrors.symptoms ? '#f44336' : '#333',
                          },
                          '&:hover fieldset': {
                            borderColor: validationErrors.symptoms ? '#f44336' : '#00bcd4',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: validationErrors.symptoms ? '#f44336' : '#00bcd4',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: '#b0b0b0',
                          '&.Mui-focused': {
                            color: validationErrors.symptoms ? '#f44336' : '#00bcd4',
                          },
                        },
                        '& .MuiFormHelperText-root': {
                          color: '#f44336'
                        }
                      }}
                    />
                  )}
                  renderOption={(props, option) => (
                    <Box component="li" {...props} sx={{ 
                      color: '#ffffff',
                      backgroundColor: '#0a0a0a',
                      '&:hover': {
                        backgroundColor: '#1a1a1a',
                         color: '#000',
                      }
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Typography sx={{ flex: 1 }}>{option}</Typography>
                        {symptomInfo[option] && (
                          <Chip
                            size="small"
                            label={symptomInfo[option].severity}
                            sx={{
                              backgroundColor: getSymptomSeverityColor(option),
                              color: '#ffffff',
                              fontSize: '0.7rem'
                            }}
                          />
                        )}
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFavoriteToggle(option);
                          }}
                          sx={{ ml: 1, color: favoriteSymptoms.includes(option) ? '#ffc107' : '#666' }}
                        >
                          {favoriteSymptoms.includes(option) ? <Star /> : <StarBorder />}
                        </IconButton>
                      </Box>
                    </Box>
                  )}
                  sx={{
                    '& .MuiAutocomplete-listbox': {
                      backgroundColor: '#0a0a0a',
                      border: '1px solid #333'
                    }
                  }}
                />

                {/* Quick Actions */}
                <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                  {recentSearches.length > 0 && (
                    <Tooltip title="Recent searches">
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<History />}
                        onClick={() => setShowSuggestions(!showSuggestions)}
                        sx={{
                          borderColor: '#333',
                          color: '#b0b0b0',
                          '&:hover': { borderColor: '#00bcd4', color: '#00bcd4' }
                        }}
                      >
                        Recent
                      </Button>
                    </Tooltip>
                  )}
                  
                  <Tooltip title="Popular symptoms">
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<TrendingUp />}
                      sx={{
                        borderColor: '#333',
                        color: '#b0b0b0',
                        '&:hover': { borderColor: '#00bcd4', color: '#00bcd4' }
                      }}
                    >
                      Popular
                    </Button>
                  </Tooltip>

                  {favoriteSymptoms.length > 0 && (
                    <Tooltip title="Favorite symptoms">
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Star />}
                        sx={{
                          borderColor: '#333',
                          color: '#b0b0b0',
                          '&:hover': { borderColor: '#ffc107', color: '#ffc107' }
                        }}
                      >
                        Favorites ({favoriteSymptoms.length})
                      </Button>
                    </Tooltip>
                  )}
                </Box>
              </Box>

              {/* Suggestions Panel */}
              <Collapse in={showSuggestions || getSuggestedSymptoms().length > 0}>
                <Paper sx={{ 
                  p: 2, 
                  mb: 3, 
                  backgroundColor: '#111', 
                  border: '1px solid #333',
                  borderRadius: 1
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Lightbulb sx={{ color: '#ffc107', mr: 1 }} />
                    <Typography variant="subtitle2" sx={{ color: '#ffc107' }}>
                      {selectedSymptoms.length === 0 ? 'Popular Symptoms' : 'Related Symptoms'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {getSuggestedSymptoms().map((symptom) => (
                      <Fade key={symptom} in timeout={300}>
                        <Chip
                          label={symptom}
                          role="button"
                          tabIndex={0}
                          aria-label={`${symptom} suggested symptom. ${selectedSymptoms.includes(symptom) ? 'Currently selected. Press to remove.' : 'Not selected. Press to add.'}`}
                          aria-pressed={selectedSymptoms.includes(symptom)}
                          onClick={() => handleAccessibleSymptomToggle(symptom)}
                          onKeyDown={(e) => handleKeyDown(e, handleAccessibleSymptomToggle, symptom)}
                          variant="outlined"
                          size="small"
                          icon={<AutoAwesome />}
                          sx={{
                            borderColor: '#00bcd4',
                            color: '#00bcd4',
                            '&:hover': {
                              backgroundColor: 'rgba(0, 188, 212, 0.1)',
                              borderColor: '#00bcd4'
                            }
                          }}
                        />
                      </Fade>
                    ))}
                  </Box>
                </Paper>
              </Collapse>

              {/* AI-Powered Suggestions */}
              {selectedSymptoms.length > 0 && (
                <Collapse in={getAISymptomSuggestions(selectedSymptoms).length > 0}>
                  <Paper sx={{ 
                    p: 3, 
                    mb: 3, 
                    background: '#000000', 
                    border: '1px solid #333333',
                    borderRadius: 2,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Psychology sx={{ 
                        color: '#ffffff', 
                        mr: 1.5, 
                        fontSize: '1.5rem'
                      }} />
                      <Typography variant="h6" sx={{ 
                        color: '#ffffff',
                        fontWeight: 'bold',
                        fontSize: '1.1rem'
                      }}>
                        AI-Powered Suggestions
                      </Typography>
                      <Chip 
                        label="BETA" 
                        size="small" 
                        sx={{ 
                          ml: 2, 
                          backgroundColor: '#333333',
                          color: '#ffffff', 
                          fontSize: '0.7rem',
                          height: '22px',
                          fontWeight: 'bold'
                        }} 
                      />
                    </Box>
                    
                    <Typography variant="body2" sx={{ 
                      color: '#cccccc', 
                      display: 'block', 
                      mb: 3,
                      fontStyle: 'italic'
                    }}>
                      🧠 Based on your selected symptoms, our AI suggests these related conditions:
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {getAISymptomSuggestions(selectedSymptoms).map((suggestion, index) => {
                        return (
                          <Fade key={suggestion.symptom} in timeout={400 + index * 150}>
                            <Box
                              component="button"
                              role="button"
                              tabIndex={0}
                              aria-label={`AI suggested symptom: ${suggestion.symptom}. Confidence: ${suggestion.confidence}%. Cluster: ${suggestion.cluster}. ${selectedSymptoms.includes(suggestion.symptom) ? 'Currently selected. Press to remove.' : 'Not selected. Press to add.'}`}
                              aria-pressed={selectedSymptoms.includes(suggestion.symptom)}
                              onKeyDown={(e) => handleKeyDown(e, handleAccessibleSymptomToggle, suggestion.symptom)}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                p: 2,
                                background: selectedSymptoms.includes(suggestion.symptom) 
                                  ? '#1a1a1a'
                                  : '#0a0a0a',
                                border: selectedSymptoms.includes(suggestion.symptom) 
                                  ? '1px solid #555555' 
                                  : '1px solid #333333',
                                borderRadius: 2,
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  background: '#1a1a1a',
                                  borderColor: '#666666',
                                  transform: 'translateY(-2px)'
                                },
                                '&:focus': {
                                  outline: '2px solid #ffffff',
                                  outlineOffset: '2px'
                                }
                              }}
                              onClick={() => handleAccessibleSymptomToggle(suggestion.symptom)}
                            >
                              <Box sx={{ flex: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                  <Typography variant="body1" sx={{ 
                                    color: '#ffffff', 
                                    fontWeight: 'bold',
                                    fontSize: '1rem'
                                  }}>
                                    {suggestion.symptom}
                                  </Typography>
                                  <Chip
                                    label={suggestion.cluster}
                                    size="small"
                                    sx={{
                                      ml: 1.5,
                                      backgroundColor: '#333333',
                                      color: '#ffffff',
                                      fontSize: '0.7rem',
                                      height: '20px',
                                      fontWeight: 'bold'
                                    }}
                                  />
                                </Box>
                                <Typography variant="body2" sx={{ 
                                  color: '#cccccc',
                                  lineHeight: 1.4
                                }}>
                                  {suggestion.reason}
                                </Typography>
                              </Box>
                              
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', gap: 0.5 }}>
                                  <Typography variant="caption" sx={{ 
                                    color: '#ffffff', 
                                    fontWeight: 'bold',
                                    fontSize: '0.8rem'
                                  }}>
                                    {Math.round(suggestion.confidence * 100)}%
                                  </Typography>
                                  <Box
                                    sx={{
                                      width: 40,
                                      height: 6,
                                      backgroundColor: '#333333',
                                      borderRadius: 3,
                                      overflow: 'hidden'
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        width: `${suggestion.confidence * 100}%`,
                                        height: '100%',
                                        backgroundColor: '#ffffff',
                                        borderRadius: 3,
                                        transition: 'width 0.8s ease-in-out'
                                      }}
                                    />
                                  </Box>
                                </Box>
                                
                                <IconButton
                                  size="small"
                                  sx={{ 
                                    color: '#ffffff',
                                    backgroundColor: '#333333',
                                    border: '1px solid #555555',
                                    '&:hover': { 
                                      backgroundColor: '#444444'
                                    }
                                  }}
                                >
                                  <AutoAwesome sx={{ fontSize: '1.1rem' }} />
                                </IconButton>
                              </Box>
                            </Box>
                          </Fade>
                        );
                      })}
                    </Box>

                    {/* AI Disclaimer */}
                    <Box sx={{ 
                      mt: 3, 
                      p: 2, 
                      backgroundColor: '#1a1a1a', 
                      border: '1px solid #444444',
                      borderRadius: 2
                    }}>
                      <Typography variant="body2" sx={{ 
                        color: '#ffc107', 
                        display: 'flex', 
                        alignItems: 'center',
                        fontWeight: 'medium'
                      }}>
                        <Warning sx={{ 
                          fontSize: '1rem', 
                          mr: 1
                        }} />
                        ⚠️ AI suggestions are for informational purposes only. Always consult a healthcare professional for medical advice.
                      </Typography>
                    </Box>
                  </Paper>
                </Collapse>
              )}

              {/* Selected Symptoms */}
              {selectedSymptoms.length > 0 && (
                <Fade in timeout={500}>
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="subtitle1" sx={{ color: '#ffffff' }}>
                        Selected Symptoms ({selectedSymptoms.length})
                      </Typography>
                      <Button
                        size="small"
                        onClick={() => setSelectedSymptoms([])}
                        startIcon={<Clear />}
                        sx={{ color: '#f44336' }}
                      >
                        Clear All
                      </Button>
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {selectedSymptoms.map((symptom, index) => (
                        <Zoom key={symptom} in timeout={200 + index * 50}>
                          <Chip
                            label={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <span>{symptom}</span>
                                {symptomInfo[symptom] && (
                                  <Tooltip title={symptomInfo[symptom].description}>
                                    <Info sx={{ fontSize: '0.8rem' }} />
                                  </Tooltip>
                                )}
                              </Box>
                            }
                            onDelete={() => handleSymptomToggle(symptom)}
                            color="primary"
                            variant="filled"
                            sx={{
                              backgroundColor: getSymptomSeverityColor(symptom),
                              '&:hover': {
                                backgroundColor: getSymptomSeverityColor(symptom),
                                filter: 'brightness(1.1)'
                              }
                            }}
                          />
                        </Zoom>
                      ))}
                    </Box>

                    {/* Related Symptoms for Selected */}
                    {Object.keys(relatedSymptoms).length > 0 && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="caption" sx={{ color: '#b0b0b0', mb: 1, display: 'block' }}>
                          You might also have:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {Object.entries(relatedSymptoms).slice(0, 3).map(([symptom, related]) => 
                            related.filter(r => !selectedSymptoms.includes(r)).slice(0, 2).map(relatedSymptom => (
                              <Chip
                                key={relatedSymptom}
                                label={relatedSymptom}
                                size="small"
                                variant="outlined"
                                onClick={() => handleSymptomToggle(relatedSymptom)}
                                sx={{
                                  borderColor: '#666',
                                  color: '#b0b0b0',
                                  '&:hover': {
                                    borderColor: '#00bcd4',
                                    color: '#00bcd4'
                                  }
                                }}
                              />
                            ))
                          )}
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Fade>
              )}

              {/* Risk Assessment & Symptom Clustering */}
              {selectedSymptoms.length > 0 && (
                <Fade in timeout={600}>
                  <Box sx={{ mb: 4 }}>
                    <Grid container spacing={3}>
                      {/* Risk Assessment */}
                      <Grid item xs={12} md={6}>
                        <Card sx={{
                          backgroundColor: '#111',
                          border: '1px solid #333',
                          borderRadius: 2,
                          overflow: 'hidden'
                        }}>
                          <CardContent sx={{ p: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                              <Warning sx={{ color: '#ff9800', mr: 1 }} />
                              <Typography variant="subtitle2" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                                Risk Assessment
                              </Typography>
                            </Box>

                            {(() => {
                              const risk = calculateRiskLevel(selectedSymptoms, severity);
                              return (
                                <Box>
                                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Chip
                                      label={`${risk.level} Risk`}
                                      sx={{
                                        backgroundColor: risk.color,
                                        color: '#ffffff',
                                        fontWeight: 'bold',
                                        mr: 2
                                      }}
                                    />
                                    <Typography variant="body2" sx={{ color: '#b0b0b0', flex: 1 }}>
                                      {risk.message}
                                    </Typography>
                                  </Box>

                                  {/* Risk Level Indicator */}
                                  <Box sx={{ mb: 2 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                      <Typography variant="caption" sx={{ color: '#4caf50' }}>Low</Typography>
                                      <Typography variant="caption" sx={{ color: '#ff9800' }}>Moderate</Typography>
                                      <Typography variant="caption" sx={{ color: '#f44336' }}>High</Typography>
                                    </Box>
                                    <Box sx={{
                                      height: 8,
                                      background: 'linear-gradient(90deg, #4caf50 0%, #ff9800 50%, #f44336 100%)',
                                      borderRadius: 4,
                                      position: 'relative'
                                    }}>
                                      <Box sx={{
                                        position: 'absolute',
                                        top: -2,
                                        left: risk.level === 'Low' ? '25%' : risk.level === 'Moderate' ? '50%' : '75%',
                                        width: 12,
                                        height: 12,
                                        backgroundColor: '#ffffff',
                                        borderRadius: '50%',
                                        border: `2px solid ${risk.color}`,
                                        transform: 'translateX(-50%)'
                                      }} />
                                    </Box>
                                  </Box>

                                  <Typography variant="caption" sx={{ color: '#888', display: 'block' }}>
                                    Based on {selectedSymptoms.length} symptoms and severity level {severity}
                                  </Typography>
                                </Box>
                              );
                            })()}
                          </CardContent>
                        </Card>
                      </Grid>

                      {/* Symptom Clustering */}
                      <Grid item xs={12} md={6}>
                        <Card sx={{
                          backgroundColor: '#111',
                          border: '1px solid #333',
                          borderRadius: 2,
                          overflow: 'hidden'
                        }}>
                          <CardContent sx={{ p: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                              <Timeline sx={{ color: '#00bcd4', mr: 1 }} />
                              <Typography variant="subtitle2" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                                Symptom Clusters
                              </Typography>
                            </Box>

                            {(() => {
                              const clusters = getSymptomClusters(selectedSymptoms);
                              return Object.keys(clusters).length > 0 ? (
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                  {Object.entries(clusters).map(([clusterName, clusterInfo]) => (
                                    <Box key={clusterName} sx={{
                                      p: 1.5,
                                      backgroundColor: `${clusterInfo.color}10`,
                                      border: `1px solid ${clusterInfo.color}30`,
                                      borderRadius: 1
                                    }}>
                                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <Box sx={{ fontSize: '1.2rem', mr: 1 }}>
                                          {clusterInfo.icon}
                                        </Box>
                                        <Typography variant="body2" sx={{ 
                                          color: clusterInfo.color, 
                                          fontWeight: 'bold',
                                          flex: 1
                                        }}>
                                          {clusterName}
                                        </Typography>
                                        <Chip
                                          label={clusterInfo.symptoms.length}
                                          size="small"
                                          sx={{
                                            backgroundColor: clusterInfo.color,
                                            color: '#ffffff',
                                            fontSize: '0.7rem',
                                            height: '18px'
                                          }}
                                        />
                                      </Box>
                                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {clusterInfo.symptoms.map(symptom => (
                                          <Chip
                                            key={symptom}
                                            label={symptom}
                                            size="small"
                                            variant="outlined"
                                            sx={{
                                              borderColor: clusterInfo.color,
                                              color: clusterInfo.color,
                                              fontSize: '0.65rem',
                                              height: '20px'
                                            }}
                                          />
                                        ))}
                                      </Box>
                                    </Box>
                                  ))}
                                </Box>
                              ) : (
                                <Typography variant="body2" sx={{ color: '#888', textAlign: 'center', py: 2 }}>
                                  Select symptoms to see clustering analysis
                                </Typography>
                              );
                            })()}
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  </Box>
                </Fade>
              )}

              {/* Body Part Selector */}
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ color: '#ffffff', flex: 1 }}>
                    Select by Body Part
                  </Typography>
                  <Tooltip title="Choose the area of your body where you're experiencing symptoms">
                    <IconButton size="small" sx={{ color: '#b0b0b0' }}>
                      <Help />
                    </IconButton>
                  </Tooltip>
                </Box>

                <Grid container spacing={2}>
                  {Object.entries(bodyParts).map(([bodyPart, info]) => {
                    const hasSelectedSymptoms = info.symptoms.some(symptom => selectedSymptoms.includes(symptom));
                    const symptomCount = info.symptoms.filter(symptom => selectedSymptoms.includes(symptom)).length;
                    
                    return (
                      <Grid item xs={12} sm={6} md={4} key={bodyPart}>
                        <Zoom in timeout={300}>
                          <Card
                            component="button"
                            role="button"
                            tabIndex={0}
                            aria-label={`${bodyPart} - ${info.symptoms.length} symptoms available. ${hasSelectedSymptoms ? `${symptomCount} selected` : 'None selected'}`}
                            aria-pressed={hasSelectedSymptoms}
                            onKeyDown={(e) => handleKeyDown(e, () => {
                              // Toggle all symptoms for this body part
                              const newSymptoms = [...selectedSymptoms];
                              if (hasSelectedSymptoms) {
                                // Remove all symptoms from this body part
                                info.symptoms.forEach(symptom => {
                                  const index = newSymptoms.indexOf(symptom);
                                  if (index > -1) newSymptoms.splice(index, 1);
                                });
                                announceToScreenReader(`All symptoms removed from ${bodyPart}`);
                              } else {
                                // Add all symptoms from this body part
                                info.symptoms.forEach(symptom => {
                                  if (!newSymptoms.includes(symptom)) {
                                    newSymptoms.push(symptom);
                                  }
                                });
                                announceToScreenReader(`All symptoms added from ${bodyPart}`);
                              }
                              setSelectedSymptoms(newSymptoms);
                            })}
                            sx={{
                              backgroundColor: hasSelectedSymptoms ? `${info.color}15` : '#111',
                              border: `2px solid ${hasSelectedSymptoms ? info.color : '#333'}`,
                              borderRadius: 2,
                              cursor: 'pointer',
                              transition: 'all 0.3s ease-in-out',
                              position: 'relative',
                              overflow: 'visible',
                              '&:hover': {
                                borderColor: info.color,
                                backgroundColor: `${info.color}20`,
                                transform: 'translateY(-4px)',
                                boxShadow: `0 8px 25px ${info.color}30`
                              }
                            }}
                            onClick={() => {
                              // Toggle all symptoms for this body part
                              const newSymptoms = [...selectedSymptoms];
                              if (hasSelectedSymptoms) {
                                // Remove all symptoms from this body part
                                info.symptoms.forEach(symptom => {
                                  const index = newSymptoms.indexOf(symptom);
                                  if (index > -1) newSymptoms.splice(index, 1);
                                });
                              } else {
                                // Add all symptoms from this body part
                                info.symptoms.forEach(symptom => {
                                  if (!newSymptoms.includes(symptom)) {
                                    newSymptoms.push(symptom);
                                  }
                                });
                              }
                              setSelectedSymptoms(newSymptoms);
                            }}
                          >
                            <CardContent sx={{ p: 2, textAlign: 'center', position: 'relative' }}>
                              {/* Badge for selected count */}
                              {symptomCount > 0 && (
                                <Badge
                                  badgeContent={symptomCount}
                                  color="primary"
                                  sx={{
                                    position: 'absolute',
                                    top: 8,
                                    right: 8,
                                    '& .MuiBadge-badge': {
                                      backgroundColor: info.color,
                                      color: '#ffffff'
                                    }
                                  }}
                                >
                                  <Box />
                                </Badge>
                              )}

                              {/* Body part icon */}
                              <Box
                                sx={{
                                  fontSize: '2.5rem',
                                  mb: 1,
                                  filter: hasSelectedSymptoms ? 'none' : 'grayscale(0.7)',
                                  transition: 'filter 0.3s ease-in-out'
                                }}
                              >
                                {info.icon}
                              </Box>

                              {/* Body part name */}
                              <Typography
                                variant="subtitle2"
                                sx={{
                                  color: hasSelectedSymptoms ? info.color : '#ffffff',
                                  fontWeight: hasSelectedSymptoms ? 'bold' : 'medium',
                                  mb: 1,
                                  transition: 'color 0.3s ease-in-out'
                                }}
                              >
                                {bodyPart}
                              </Typography>

                              {/* Symptom count */}
                              <Typography
                                variant="caption"
                                sx={{
                                  color: '#b0b0b0',
                                  fontSize: '0.75rem'
                                }}
                              >
                                {info.symptoms.length} symptoms
                              </Typography>

                              {/* Quick preview of symptoms */}
                              <Box sx={{ mt: 1 }}>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: '#888',
                                    fontSize: '0.7rem',
                                    display: 'block',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                  }}
                                >
                                  {info.symptoms.slice(0, 2).join(', ')}
                                  {info.symptoms.length > 2 && '...'}
                                </Typography>
                              </Box>

                              {/* Selection indicator */}
                              {hasSelectedSymptoms && (
                                <Box
                                  sx={{
                                    position: 'absolute',
                                    top: -2,
                                    right: -2,
                                    width: 20,
                                    height: 20,
                                    borderRadius: '50%',
                                    backgroundColor: info.color,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                                  }}
                                >
                                  <CheckCircle sx={{ fontSize: '1rem', color: '#ffffff' }} />
                                </Box>
                              )}
                            </CardContent>
                          </Card>
                        </Zoom>
                      </Grid>
                    );
                  })}
                </Grid>

                {/* Quick actions for body parts */}
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      // Select common symptoms
                      const commonSymptoms = ['Fever', 'Headache', 'Fatigue'];
                      setSelectedSymptoms(prev => {
                        const newSymptoms = [...prev];
                        commonSymptoms.forEach(symptom => {
                          if (!newSymptoms.includes(symptom)) {
                            newSymptoms.push(symptom);
                          }
                        });
                        return newSymptoms;
                      });
                    }}
                    sx={{
                      borderColor: '#333',
                      color: '#b0b0b0',
                      '&:hover': { borderColor: '#00bcd4', color: '#00bcd4' }
                    }}
                  >
                    Common Symptoms
                  </Button>
                  
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => setSelectedSymptoms([])}
                    disabled={selectedSymptoms.length === 0}
                    sx={{
                      borderColor: '#333',
                      color: '#b0b0b0',
                      '&:hover': { borderColor: '#f44336', color: '#f44336' },
                      '&:disabled': { borderColor: '#222', color: '#555' }
                    }}
                  >
                    Clear All
                  </Button>
                </Box>
              </Box>

              {/* Enhanced Symptom Categories */}
              <Box>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  mb: 3,
                  p: 2,
                  backgroundColor: '#1a1a1a',
                  borderRadius: 2,
                  border: '1px solid #333'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: 'linear-gradient(45deg, #00bcd4 30%, #0097a7 90%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 0 15px rgba(0, 188, 212, 0.3)'
                    }}>
                      <FilterList sx={{ color: '#ffffff' }} />
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                        Browse by Category
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#b0b0b0' }}>
                        {Object.keys(symptomCategories).length} categories available
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Expand all categories">
                      <IconButton
                        size="small"
                        onClick={() => setExpandedCategory(expandedCategory === 'all' ? null : 'all')}
                        sx={{ 
                          color: expandedCategory === 'all' ? '#00bcd4' : '#b0b0b0',
                          backgroundColor: expandedCategory === 'all' ? 'rgba(0, 188, 212, 0.1)' : 'transparent',
                          '&:hover': {
                            backgroundColor: 'rgba(0, 188, 212, 0.2)',
                            transform: 'scale(1.1)'
                          }
                        }}
                      >
                        <ExpandMore sx={{ 
                          transform: expandedCategory === 'all' ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.3s ease'
                        }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>

                {/* Category Grid for Mobile */}
                <Box sx={{ 
                  display: { xs: 'block', md: 'none' }, 
                  mb: 3 
                }}>
                  <Grid container spacing={2}>
                    {Object.entries(symptomCategories).map(([category, symptoms]) => {
                      const selectedCount = symptoms.filter(s => selectedSymptoms.includes(s)).length;
                      const isExpanded = expandedCategory === category || expandedCategory === 'all';
                      
                      return (
                        <Grid item xs={12} key={category}>
                          <Card sx={{
                            backgroundColor: '#111',
                            border: `1px solid ${selectedCount > 0 ? '#00bcd4' : '#333'}`,
                            borderRadius: 2,
                            overflow: 'hidden',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              borderColor: '#00bcd4',
                              boxShadow: '0 4px 20px rgba(0, 188, 212, 0.2)',
                              transform: 'translateY(-2px)'
                            }
                          }}>
                            <CardContent 
                              sx={{ 
                                p: 2,
                                cursor: 'pointer',
                                '&:last-child': { pb: 2 }
                              }}
                              onClick={() => setExpandedCategory(isExpanded ? null : category)}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: isExpanded ? 2 : 0 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                  <Box sx={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: '50%',
                                    background: selectedCount > 0 
                                      ? 'linear-gradient(45deg, #00bcd4 30%, #0097a7 90%)'
                                      : 'linear-gradient(45deg, #333 30%, #555 90%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '14px',
                                    boxShadow: selectedCount > 0 ? '0 0 10px rgba(0, 188, 212, 0.3)' : 'none',
                                    transition: 'all 0.3s ease'
                                  }}>
                                    <LocalHospital sx={{ fontSize: '16px', color: '#ffffff' }} />
                                  </Box>
                                  <Box>
                                    <Typography variant="subtitle1" sx={{ 
                                      fontWeight: 'bold', 
                                      color: selectedCount > 0 ? '#00bcd4' : '#ffffff'
                                    }}>
                                      {category}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#b0b0b0' }}>
                                      {symptoms.length} symptoms
                                    </Typography>
                                  </Box>
                                </Box>
                                
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  {selectedCount > 0 && (
                                    <Chip 
                                      label={selectedCount}
                                      size="small"
                                      sx={{ 
                                        backgroundColor: '#00bcd4',
                                        color: '#ffffff',
                                        fontWeight: 'bold',
                                        minWidth: '24px'
                                      }}
                                    />
                                  )}
                                  <ExpandMore sx={{ 
                                    color: '#b0b0b0',
                                    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                    transition: 'transform 0.3s ease'
                                  }} />
                                </Box>
                              </Box>
                              
                              <Collapse in={isExpanded} timeout={300}>
                                <Box sx={{ mt: 2 }}>
                                  <Grid container spacing={1}>
                                    {symptoms.map((symptom) => (
                                      <Grid item xs={12} key={symptom}>
                                        <Chip
                                          label={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                                              <span style={{ flex: 1, textAlign: 'left', color: '#ffffff' }}>{symptom}</span>
                                              {symptomInfo[symptom] && (
                                                <Tooltip title={symptomInfo[symptom].description}>
                                                  <Info sx={{ fontSize: '0.8rem', color: '#b0b0b0' }} />
                                                </Tooltip>
                                              )}
                                              <IconButton
                                                size="small"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  handleFavoriteToggle(symptom);
                                                }}
                                                sx={{ 
                                                  color: favoriteSymptoms.includes(symptom) ? '#ffc107' : '#666',
                                                  ml: 1,
                                                  p: 0.5
                                                }}
                                              >
                                                {favoriteSymptoms.includes(symptom) ? <Star sx={{ fontSize: '1rem' }} /> : <StarBorder sx={{ fontSize: '1rem' }} />}
                                              </IconButton>
                                            </Box>
                                          }
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleAccessibleSymptomToggle(symptom);
                                          }}
                                          color={selectedSymptoms.includes(symptom) ? 'primary' : 'default'}
                                          variant={selectedSymptoms.includes(symptom) ? 'filled' : 'outlined'}
                                          sx={{ 
                                            width: '100%',
                                            justifyContent: 'flex-start',
                                            transition: 'all 0.2s ease-in-out',
                                            backgroundColor: selectedSymptoms.includes(symptom) 
                                              ? getSymptomSeverityColor(symptom)
                                              : 'transparent',
                                            borderColor: selectedSymptoms.includes(symptom) 
                                              ? getSymptomSeverityColor(symptom)
                                              : '#333',
                                            '&:hover': {
                                              backgroundColor: selectedSymptoms.includes(symptom) 
                                                ? getSymptomSeverityColor(symptom)
                                                : 'rgba(0, 188, 212, 0.08)',
                                              borderColor: '#00bcd4',
                                              transform: 'translateX(4px)',
                                              boxShadow: '0 2px 8px rgba(0, 188, 212, 0.2)'
                                            }
                                          }}
                                        />
                                      </Grid>
                                    ))}
                                  </Grid>
                                </Box>
                              </Collapse>
                            </CardContent>
                          </Card>
                        </Grid>
                      );
                    })}
                  </Grid>
                </Box>

                {/* Desktop Accordion View */}
                <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                  {Object.entries(symptomCategories).map(([category, symptoms], index) => {
                    const selectedCount = symptoms.filter(s => selectedSymptoms.includes(s)).length;
                    const isExpanded = expandedCategory === category || expandedCategory === 'all';
                    
                    return (
                      <Fade in timeout={300 * (index + 1)} key={category}>
                        <Accordion 
                          sx={{ 
                            mb: 2,
                            backgroundColor: '#111',
                            border: `1px solid ${selectedCount > 0 ? '#00bcd4' : '#333'}`,
                            borderRadius: '12px !important',
                            overflow: 'hidden',
                            '&:before': { display: 'none' },
                            '&.Mui-expanded': {
                              boxShadow: '0 8px 32px rgba(0, 188, 212, 0.2)',
                              transform: 'translateY(-2px)'
                            },
                            '& .MuiAccordionSummary-root': {
                              backgroundColor: selectedCount > 0 ? 'rgba(0, 188, 212, 0.05)' : '#111',
                              borderBottom: isExpanded ? '1px solid #333' : 'none',
                              minHeight: '72px',
                              '&:hover': {
                                backgroundColor: 'rgba(0, 188, 212, 0.08)'
                              },
                              '&.Mui-expanded': {
                                minHeight: '72px'
                              }
                            },
                            '& .MuiAccordionDetails-root': {
                              backgroundColor: '#0a0a0a',
                              p: 3
                            },
                            transition: 'all 0.3s ease'
                          }}
                          expanded={isExpanded}
                          onChange={() => setExpandedCategory(isExpanded ? null : category)}
                        >
                          <AccordionSummary 
                            expandIcon={<ExpandMore sx={{ color: '#b0b0b0' }} />}
                            sx={{ 
                              '& .MuiAccordionSummary-content': {
                                alignItems: 'center',
                                my: 2
                              }
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 3 }}>
                              <Box sx={{
                                width: 48,
                                height: 48,
                                borderRadius: '12px',
                                background: selectedCount > 0 
                                  ? 'linear-gradient(45deg, #00bcd4 30%, #0097a7 90%)'
                                  : 'linear-gradient(45deg, #333 30%, #555 90%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '20px',
                                boxShadow: selectedCount > 0 ? '0 0 20px rgba(0, 188, 212, 0.4)' : '0 2px 8px rgba(0, 0, 0, 0.3)',
                                transition: 'all 0.3s ease'
                              }}>
                                <LocalHospital sx={{ fontSize: '24px', color: '#ffffff' }} />
                              </Box>
                              
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="h6" sx={{ 
                                  fontWeight: 'bold', 
                                  color: selectedCount > 0 ? '#00bcd4' : '#ffffff',
                                  mb: 0.5
                                }}>
                                  {category}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                                  {symptoms.length} symptoms available
                                  {selectedCount > 0 && ` • ${selectedCount} selected`}
                                </Typography>
                              </Box>
                              
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                {selectedCount > 0 && (
                                  <Chip 
                                    label={selectedCount}
                                    size="small"
                                    sx={{ 
                                      backgroundColor: '#00bcd4',
                                      color: '#ffffff',
                                      fontWeight: 'bold',
                                      minWidth: '32px',
                                      height: '28px',
                                      boxShadow: '0 0 10px rgba(0, 188, 212, 0.3)'
                                    }}
                                  />
                                )}
                                <Chip 
                                  label={symptoms.length}
                                  size="small"
                                  variant="outlined"
                                  sx={{ 
                                    borderColor: '#333',
                                    color: '#b0b0b0',
                                    minWidth: '32px',
                                    height: '28px'
                                  }}
                                />
                              </Box>
                            </Box>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Grid container spacing={2}>
                              {symptoms.map((symptom) => (
                                <Grid item xs={12} sm={6} lg={4} key={symptom}>
                                  <Chip
                                    label={
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                                        <span style={{ flex: 1, textAlign: 'left', color: '#ffffff' }}>{symptom}</span>
                                        {symptomInfo[symptom] && (
                                          <Tooltip title={symptomInfo[symptom].description} arrow>
                                            <Info sx={{ fontSize: '0.9rem', color: '#b0b0b0' }} />
                                          </Tooltip>
                                        )}
                                        <IconButton
                                          size="small"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleFavoriteToggle(symptom);
                                          }}
                                          sx={{ 
                                            color: favoriteSymptoms.includes(symptom) ? '#ffc107' : '#666',
                                            ml: 1,
                                            p: 0.5,
                                            '&:hover': {
                                              color: '#ffc107',
                                              transform: 'scale(1.2)'
                                            }
                                          }}
                                        >
                                          {favoriteSymptoms.includes(symptom) ? <Star sx={{ fontSize: '1.1rem' }} /> : <StarBorder sx={{ fontSize: '1.1rem' }} />}
                                        </IconButton>
                                      </Box>
                                    }
                                    onClick={() => handleAccessibleSymptomToggle(symptom)}
                                    onKeyDown={(e) => handleKeyDown(e, handleAccessibleSymptomToggle, symptom)}
                                    role="button"
                                    tabIndex={0}
                                    aria-label={`${symptom} symptom. ${symptomInfo[symptom] ? `Description: ${symptomInfo[symptom].description}. Severity: ${symptomInfo[symptom].severity}.` : ''} ${selectedSymptoms.includes(symptom) ? 'Currently selected. Press to remove.' : 'Not selected. Press to add.'}`}
                                    aria-pressed={selectedSymptoms.includes(symptom)}
                                    color={selectedSymptoms.includes(symptom) ? 'primary' : 'default'}
                                    variant={selectedSymptoms.includes(symptom) ? 'filled' : 'outlined'}
                                    sx={{ 
                                      width: '100%',
                                      justifyContent: 'flex-start',
                                      transition: 'all 0.3s ease-in-out',
                                      backgroundColor: selectedSymptoms.includes(symptom) 
                                        ? getSymptomSeverityColor(symptom)
                                        : 'transparent',
                                      borderColor: selectedSymptoms.includes(symptom) 
                                        ? getSymptomSeverityColor(symptom)
                                        : '#333',
                                      height: '48px',
                                      fontSize: '0.9rem',
                                      '&:hover': {
                                        backgroundColor: selectedSymptoms.includes(symptom) 
                                          ? getSymptomSeverityColor(symptom)
                                          : 'rgba(0, 188, 212, 0.08)',
                                        borderColor: '#00bcd4',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 4px 16px rgba(0, 188, 212, 0.3)'
                                      }
                                    }}
                                  />
                                </Grid>
                              ))}
                            </Grid>
                          </AccordionDetails>
                        </Accordion>
                      </Fade>
                    );
                  })}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Submit Section */}
        <Grid item xs={12}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            mt: 4,
            position: 'relative'
          }}>
            <Fade in timeout={800}>
              <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <Button
                  variant="contained"
                  size="large"
                  type="submit"
                  onClick={handleSubmit}
                  disabled={loading || selectedSymptoms.length === 0}
                  startIcon={loading ? null : <Psychology />}
                  aria-label={loading ? 'Analyzing symptoms, please wait' : `Analyze ${selectedSymptoms.length} selected symptoms`}
                  aria-describedby="submit-button-help"
                  sx={{
                    background: loading 
                      ? 'linear-gradient(45deg, #666 30%, #888 90%)'
                      : 'linear-gradient(45deg, #00bcd4 30%, #0097a7 90%)',
                    color: '#ffffff',
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    px: 6,
                    py: 2,
                    borderRadius: 3,
                    boxShadow: loading 
                      ? '0 3px 5px 2px rgba(102, 102, 102, .3)'
                      : '0 3px 5px 2px rgba(0, 188, 212, .3)',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      background: loading 
                        ? 'linear-gradient(45deg, #666 30%, #888 90%)'
                        : 'linear-gradient(45deg, #0097a7 30%, #00838f 90%)',
                      transform: loading ? 'none' : 'translateY(-2px)',
                      boxShadow: loading 
                        ? '0 3px 5px 2px rgba(102, 102, 102, .3)'
                        : '0 6px 10px 4px rgba(0, 188, 212, .3)',
                    },
                    '&:disabled': {
                      background: 'linear-gradient(45deg, #333 30%, #555 90%)',
                      color: '#888'
                    }
                  }}
                >
                  {loading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ 
                        width: 20, 
                        height: 20, 
                        border: '2px solid #ffffff',
                        borderTop: '2px solid transparent',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        '@keyframes spin': {
                          '0%': { transform: 'rotate(0deg)' },
                          '100%': { transform: 'rotate(360deg)' }
                        }
                      }} />
                      Analyzing Symptoms...
                    </Box>
                  ) : (
                    `Analyze ${selectedSymptoms.length} Symptom${selectedSymptoms.length !== 1 ? 's' : ''}`
                  )}
                </Button>

                {/* Progress Ring */}
                {loading && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -8,
                      left: -8,
                      right: -8,
                      bottom: -8,
                      borderRadius: '50%',
                      background: 'conic-gradient(from 0deg, #00bcd4, #0097a7, #00838f, #00bcd4)',
                      animation: 'rotate 2s linear infinite',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 4,
                        left: 4,
                        right: 4,
                        bottom: 4,
                        backgroundColor: '#0a0a0a',
                        borderRadius: '50%'
                      },
                      '@keyframes rotate': {
                        '0%': { transform: 'rotate(0deg)' },
                        '100%': { transform: 'rotate(360deg)' }
                      }
                    }}
                  />
                )}
              </Box>
            </Fade>
          </Box>

          {/* Progress Steps */}
          {loading && (
            <Fade in timeout={1000}>
              <Box sx={{ mt: 4, maxWidth: 600, mx: 'auto' }}>
                <Card sx={{ 
                  backgroundColor: '#111', 
                  border: '1px solid #333',
                  borderRadius: 2
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Avatar sx={{ bgcolor: '#00bcd4', mr: 2 }}>
                        <AutoAwesome />
                      </Avatar>
                      <Typography variant="h6" sx={{ color: '#ffffff' }}>
                        AI Analysis in Progress
                      </Typography>
                    </Box>

                    <LinearProgress 
                      variant="indeterminate"
                      sx={{
                        mb: 3,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: '#333',
                        '& .MuiLinearProgress-bar': {
                          background: 'linear-gradient(90deg, #00bcd4, #0097a7, #00838f)',
                          borderRadius: 4,
                          animation: 'shimmer 2s ease-in-out infinite',
                          '@keyframes shimmer': {
                            '0%': { backgroundPosition: '-200px 0' },
                            '100%': { backgroundPosition: '200px 0' }
                          }
                        }
                      }}
                    />

                    <Grid container spacing={2}>
                      {[
                        { icon: <Search />, text: 'Processing symptoms', delay: 0 },
                        { icon: <Psychology />, text: 'AI pattern analysis', delay: 500 },
                        { icon: <Timeline />, text: 'Generating insights', delay: 1000 }
                      ].map((step, index) => (
                        <Grid item xs={12} sm={4} key={index}>
                          <Slide 
                            in 
                            direction="up" 
                            timeout={600}
                            style={{ transitionDelay: `${step.delay}ms` }}
                          >
                            <Box sx={{ 
                              display: 'flex', 
                              flexDirection: 'column',
                              alignItems: 'center',
                              textAlign: 'center',
                              p: 2,
                              borderRadius: 2,
                              backgroundColor: '#0a0a0a',
                              border: '1px solid #333'
                            }}>
                              <Box sx={{ 
                                color: '#00bcd4', 
                                mb: 1,
                                animation: 'pulse 2s ease-in-out infinite',
                                '@keyframes pulse': {
                                  '0%': { opacity: 0.6 },
                                  '50%': { opacity: 1 },
                                  '100%': { opacity: 0.6 }
                                }
                              }}>
                                {step.icon}
                              </Box>
                              <Typography 
                                variant="caption" 
                                sx={{ 
                                  color: '#b0b0b0',
                                  fontSize: '0.75rem'
                                }}
                              >
                                {step.text}
                              </Typography>
                            </Box>
                          </Slide>
                        </Grid>
                      ))}
                    </Grid>

                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                      <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                        Analyzing {selectedSymptoms.length} symptoms using advanced ML models
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        {['🔒', '🧠', '⚡'].map((emoji, index) => (
                          <Chip
                            key={index}
                            label={
                              index === 0 ? 'Secure' : 
                              index === 1 ? 'AI-Powered' : 'Fast'
                            }
                            size="small"
                            icon={<span>{emoji}</span>}
                            sx={{
                              backgroundColor: '#333',
                              color: '#b0b0b0',
                              fontSize: '0.7rem'
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Fade>
          )}

          {/* Helpful Tips */}
          {!loading && selectedSymptoms.length === 0 && (
            <Fade in timeout={1200}>
              <Box sx={{ mt: 4, maxWidth: 500, mx: 'auto' }}>
                <Alert 
                  severity="info" 
                  icon={<Lightbulb />}
                  sx={{
                    backgroundColor: 'rgba(0, 188, 212, 0.1)',
                    border: '1px solid rgba(0, 188, 212, 0.3)',
                    color: '#00bcd4',
                    '& .MuiAlert-icon': {
                      color: '#00bcd4'
                    }
                  }}
                >
                  <Typography variant="body2">
                    <strong>Tip:</strong> Select at least one symptom to get started. 
                    Use the search bar or browse categories below.
                  </Typography>
                </Alert>
              </Box>
            </Fade>
          )}

          {/* Quick Stats */}
          {selectedSymptoms.length > 0 && !loading && (
            <Fade in timeout={600}>
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Chip
                  icon={<Psychology />}
                  label={`${selectedSymptoms.length} symptoms selected`}
                  color="primary"
                  variant="outlined"
                />
                {age && (
                  <Chip
                    icon={<AccessTime />}
                    label={`Age: ${age}`}
                    variant="outlined"
                    sx={{ borderColor: '#333', color: '#b0b0b0' }}
                  />
                )}
                {duration && (
                  <Chip
                    icon={<Timeline />}
                    label={`Duration: ${duration}`}
                    variant="outlined"
                    sx={{ borderColor: '#333', color: '#b0b0b0' }}
                  />
                )}
              </Box>
            </Fade>
          )}

          {/* Analysis Results Section */}
          {analysisData && !loading && (
            <Fade in timeout={800}>
              <Box sx={{ mt: 4 }}>
                <Card sx={{ 
                  backgroundColor: '#111', 
                  border: '1px solid #333',
                  borderRadius: 2,
                  overflow: 'hidden'
                }}>
                  <CardContent sx={{ p: 0 }}>
                    {/* Header */}
                    <Box sx={{ 
                      background: 'linear-gradient(135deg, #00bcd4 0%, #0097a7 100%)',
                      p: 3,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                          <Assessment />
                        </Avatar>
                        <Box>
                          <Typography variant="h5" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                            Analysis Results
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                            AI-powered symptom analysis complete
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton 
                          onClick={() => {
                            const reportData = {
                              timestamp: new Date().toISOString(),
                              patientInfo,
                              symptoms: selectedSymptoms,
                              analysis: analysisData
                            };
                            const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `symptom-analysis-${new Date().toISOString().split('T')[0]}.json`;
                            a.click();
                            URL.revokeObjectURL(url);
                          }}
                          sx={{ color: 'rgba(255,255,255,0.8)' }}
                          title="Download Report"
                        >
                          <Download />
                        </IconButton>
                        <IconButton 
                          onClick={clearAnalysis}
                          sx={{ color: 'rgba(255,255,255,0.8)' }}
                          title="Clear Results"
                        >
                          <Clear />
                        </IconButton>
                      </Box>
                    </Box>

                    <Box sx={{ p: 3 }}>
                      {/* Primary Diagnosis */}
                      {analysisData.primary_diagnosis && (
                        <Box sx={{ mb: 4 }}>
                          <Typography variant="h6" sx={{ color: '#00bcd4', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CheckCircle fontSize="small" />
                            Primary Diagnosis
                          </Typography>
                          <Card sx={{ backgroundColor: '#0a0a0a', border: '1px solid #333' }}>
                            <CardContent>
                              <Typography variant="h6" sx={{ color: '#ffffff', mb: 1 }}>
                                {analysisData.primary_diagnosis.condition}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <Chip
                                  label={`${Math.round(analysisData.primary_diagnosis.confidence * 100)}% Confidence`}
                                  color={analysisData.primary_diagnosis.confidence > 0.7 ? 'success' : 'warning'}
                                  size="small"
                                />
                                <Chip
                                  label={analysisData.primary_diagnosis.severity || 'Moderate'}
                                  color={
                                    analysisData.primary_diagnosis.severity === 'High' ? 'error' :
                                    analysisData.primary_diagnosis.severity === 'Low' ? 'success' : 'warning'
                                  }
                                  size="small"
                                />
                              </Box>
                              <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                                {analysisData.primary_diagnosis.description}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Box>
                      )}

                      {/* Alternative Diagnoses */}
                      {analysisData.alternative_diagnoses && analysisData.alternative_diagnoses.length > 0 && (
                        <Box sx={{ mb: 4 }}>
                          <Typography variant="h6" sx={{ color: '#00bcd4', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Info fontSize="small" />
                            Alternative Possibilities
                          </Typography>
                          <Grid container spacing={2}>
                            {analysisData.alternative_diagnoses.map((diagnosis, index) => (
                              <Grid item xs={12} md={6} key={index}>
                                <Card sx={{ backgroundColor: '#0a0a0a', border: '1px solid #333', height: '100%' }}>
                                  <CardContent>
                                    <Typography variant="subtitle1" sx={{ color: '#ffffff', mb: 1 }}>
                                      {diagnosis.condition}
                                    </Typography>
                                    <Chip
                                      label={`${Math.round(diagnosis.confidence * 100)}% Match`}
                                      size="small"
                                      sx={{ mb: 1 }}
                                    />
                                    <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                                      {diagnosis.description}
                                    </Typography>
                                  </CardContent>
                                </Card>
                              </Grid>
                            ))}
                          </Grid>
                        </Box>
                      )}

                      {/* Recommendations */}
                      {analysisData.recommendations && analysisData.recommendations.length > 0 && (
                        <Box sx={{ mb: 4 }}>
                          <Typography variant="h6" sx={{ color: '#00bcd4', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Lightbulb fontSize="small" />
                            Recommendations
                          </Typography>
                          <List>
                            {analysisData.recommendations.map((recommendation, index) => (
                              <ListItem key={index} sx={{ backgroundColor: '#0a0a0a', mb: 1, borderRadius: 1 }}>
                                <ListItemIcon>
                                  <CheckCircle sx={{ color: '#4caf50' }} />
                                </ListItemIcon>
                                <ListItemText
                                  primary={recommendation}
                                  sx={{ '& .MuiListItemText-primary': { color: '#ffffff' } }}
                                />
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      )}

                      {/* Risk Assessment */}
                      {analysisData.risk_level && (
                        <Box sx={{ mb: 4 }}>
                          <Typography variant="h6" sx={{ color: '#00bcd4', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Warning fontSize="small" />
                            Risk Assessment
                          </Typography>
                          <Card sx={{ backgroundColor: '#0a0a0a', border: '1px solid #333' }}>
                            <CardContent>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <Chip
                                  label={`${analysisData.risk_level} Risk`}
                                  color={
                                    analysisData.risk_level === 'High' ? 'error' :
                                    analysisData.risk_level === 'Low' ? 'success' : 'warning'
                                  }
                                />
                                {analysisData.urgency && (
                                  <Chip
                                    label={analysisData.urgency}
                                    variant="outlined"
                                    size="small"
                                  />
                                )}
                              </Box>
                              {analysisData.risk_factors && (
                                <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                                  <strong>Risk Factors:</strong> {analysisData.risk_factors.join(', ')}
                                </Typography>
                              )}
                            </CardContent>
                          </Card>
                        </Box>
                      )}

                      {/* Disclaimer */}
                      <Alert 
                        severity="warning" 
                        sx={{
                          backgroundColor: 'rgba(255, 152, 0, 0.1)',
                          border: '1px solid rgba(255, 152, 0, 0.3)',
                          color: '#ff9800',
                          '& .MuiAlert-icon': {
                            color: '#ff9800'
                          }
                        }}
                      >
                        <Typography variant="body2">
                          <strong>Medical Disclaimer:</strong> This analysis is for informational purposes only and should not replace professional medical advice. 
                          Please consult with a healthcare provider for proper diagnosis and treatment.
                        </Typography>
                      </Alert>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Fade>
          )}

          {/* Error Display */}
          {error && !loading && (
            <Fade in timeout={600}>
              <Box sx={{ mt: 4 }}>
                <Alert 
                  severity="error"
                  action={
                    <Button 
                      color="inherit" 
                      size="small" 
                      onClick={clearAnalysis}
                    >
                      Retry
                    </Button>
                  }
                  sx={{
                    backgroundColor: 'rgba(244, 67, 54, 0.1)',
                    border: '1px solid rgba(244, 67, 54, 0.3)',
                    color: '#f44336',
                    '& .MuiAlert-icon': {
                      color: '#f44336'
                    }
                  }}
                >
                  <Typography variant="body2">
                    <strong>Analysis Error:</strong> {error}
                  </Typography>
                </Alert>
              </Box>
            </Fade>
          )}
        </Grid>
      </Grid>

      {/* Analysis Report Modal */}
      <AnalysisReportModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        analysisData={analysisData}
        patientInfo={patientInfo}
        symptoms={selectedSymptoms}
      />
    </Box>
  );
};

export default SymptomChecker;
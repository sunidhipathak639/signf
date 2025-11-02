import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  LinearProgress,
  Alert
} from '@mui/material';
import {
  LocalHospital,
  Psychology,
  HealthAndSafety
} from '@mui/icons-material';
import SymptomChecker from './SymptomChecker';
import DiagnosisResults from './DiagnosisResults';
import BodyMap from './BodyMap';
import './HealthDiagnostics.css';

const HealthDiagnostics = () => {
  const [activeSection, setActiveSection] = useState('symptom-checker');
  const [diagnosisData, setDiagnosisData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [symptoms, setSymptoms] = useState([]);

  const sections = [
    {
      id: 'symptom-checker',
      title: 'Symptom Checker',
      icon: <LocalHospital />,
      description: 'Interactive symptom analysis with AI-powered insights'
    },
    {
      id: 'diagnosis',
      title: 'AI Diagnosis',
      icon: <Psychology />,
      description: 'Machine learning-powered diagnosis suggestions'
    },
    {
      id: 'body-map',
      title: '3D Body Map',
      icon: <HealthAndSafety />,
      description: 'Interactive body mapping for symptom location'
    }
  ];

  const handleSymptomSubmit = async (selectedSymptoms) => {
    setLoading(true);
    setSymptoms(selectedSymptoms);
    
    try {
      // TODO: Replace with actual API call to ML backend
      // const response = await fetch('/api/diagnose', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ symptoms: selectedSymptoms })
      // });
      // const diagnosisData = await response.json();
      
      // For now, show a message that diagnosis is not available without real data
      setDiagnosisData({
        message: 'AI Diagnosis requires real symptom data and backend integration.',
        status: 'pending_implementation'
      });
      setActiveSection('diagnosis');
    } catch (error) {
      console.error('Diagnosis error:', error);
      setDiagnosisData({
        message: 'Error processing diagnosis request.',
        status: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'symptom-checker':
        return (
          <SymptomChecker 
            onSubmit={handleSymptomSubmit}
            loading={loading}
          />
        );
      case 'diagnosis':
        // Only show diagnosis if symptoms have been analyzed
        if (!diagnosisData) {
          return (
            <Card sx={{ backgroundColor: '#0a0a0a', border: '1px solid #333' }}>
              <CardContent sx={{ textAlign: 'center', py: 6 }}>
                <Psychology sx={{ fontSize: '4rem', color: '#444', mb: 2 }} />
                <Typography variant="h5" sx={{ color: '#666', mb: 2 }}>
                  AI Diagnosis Not Available
                </Typography>
                <Typography variant="body1" sx={{ color: '#888', mb: 3 }}>
                  Please analyze your symptoms first using the Symptom Checker to enable AI diagnosis.
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => setActiveSection('symptom-checker')}
                  sx={{
                    borderColor: '#00bcd4',
                    color: '#00bcd4',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 188, 212, 0.1)',
                      borderColor: '#00bcd4'
                    }
                  }}
                >
                  Go to Symptom Checker
                </Button>
              </CardContent>
            </Card>
          );
        }
        return (
          <DiagnosisResults 
            data={diagnosisData}
            symptoms={symptoms}
          />
        );
      case 'body-map':
        return <BodyMap />;
      default:
        return <SymptomChecker onSubmit={handleSymptomSubmit} loading={loading} />;
    }
  };

  return (
    <div className="health-diagnostics">
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header Section */}
        <Box textAlign="center" mb={6}>
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 'bold',
              color: '#ffffff',
              mb: 2
            }}
          >
            AI Health Diagnostics
          </Typography>
          <Typography 
            variant="h5" 
            color="text.secondary" 
            sx={{ mb: 4, maxWidth: '800px', mx: 'auto', color: '#b0b0b0' }}
          >
            Advanced healthcare intelligence powered by machine learning for accurate 
            symptom analysis and diagnostic insights
          </Typography>
          
          {loading && (
            <Box sx={{ width: '100%', mb: 2 }}>
              <LinearProgress sx={{ backgroundColor: '#333', '& .MuiLinearProgress-bar': { backgroundColor: '#00bcd4' } }} />
              <Typography variant="body2" sx={{ mt: 1, color: '#b0b0b0' }}>
                Analyzing symptoms with AI...
              </Typography>
            </Box>
          )}
        </Box>

        {/* Navigation Tabs */}
        <Box mb={4}>
          <Grid container spacing={2} justifyContent="center">
            {sections.map((section, index) => {
              const isDiagnosisSection = section.id === 'diagnosis';
              const isDiagnosisDisabled = isDiagnosisSection && !diagnosisData;
              
              return (
                <Grid item xs={12} sm={4} key={section.id}>
                  <Card 
                    sx={{ 
                      cursor: isDiagnosisDisabled ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s ease',
                      backgroundColor: activeSection === section.id ? '#1a1a1a' : '#0a0a0a',
                      border: activeSection === section.id ? '2px solid #00bcd4' : '1px solid #333',
                      opacity: isDiagnosisDisabled ? 0.5 : 1,
                      '&:hover': {
                        backgroundColor: isDiagnosisDisabled ? '#0a0a0a' : '#1a1a1a',
                        borderColor: isDiagnosisDisabled ? '#333' : '#00bcd4'
                      }
                    }}
                    onClick={() => {
                      if (!isDiagnosisDisabled) {
                        setActiveSection(section.id);
                      }
                    }}
                  >
                    <CardContent sx={{ textAlign: 'center', p: { xs: 1.5, sm: 2 } }}>
                      <Box 
                        sx={{ 
                          color: isDiagnosisDisabled ? '#444' : (activeSection === section.id ? '#00bcd4' : '#666'),
                          mb: 1,
                          fontSize: { xs: '1.5rem', sm: '2rem' }
                        }}
                      >
                        {section.icon}
                      </Box>
                      <Typography 
                        variant="h6" 
                        component="h3"
                        sx={{ 
                          color: isDiagnosisDisabled ? '#666' : (activeSection === section.id ? '#ffffff' : '#b0b0b0'),
                          fontWeight: activeSection === section.id ? 600 : 400,
                          fontSize: { xs: '0.9rem', sm: '1.1rem' }
                        }}
                      >
                        {section.title}
                      </Typography>
                      {isDiagnosisDisabled && (
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: '#888',
                            fontSize: '0.7rem',
                            mt: 0.5,
                            display: 'block'
                          }}
                        >
                          Analyze symptoms first
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>
        {/* Active Section Content */}
        <Box>
          {renderActiveSection()}
        </Box>

        {/* Footer Info */}
        <Box mt={6} textAlign="center">
          <Alert severity="info" sx={{ maxWidth: '800px', mx: 'auto' }}>
            <Typography variant="body2">
              <strong>Medical Disclaimer:</strong> This AI diagnostic tool is for informational purposes only 
              and should not replace professional medical advice. Always consult with qualified healthcare 
              providers for accurate diagnosis and treatment.
            </Typography>
          </Alert>
        </Box>
      </Container>
    </div>
  );
};

export default HealthDiagnostics;
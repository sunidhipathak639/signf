import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  Chip,
  Button,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper,
  CircularProgress
} from '@mui/material';
import {
  ExpandMore,
  Psychology,
  Warning,
  CheckCircle,
  LocalHospital,
  Science,
  TrendingUp,
  Assignment,
  Schedule,
  Person
} from '@mui/icons-material';

const DiagnosisResults = ({ data, symptoms }) => {
  const [expandedAccordion, setExpandedAccordion] = useState('primary');

  if (!data) {
    return (
      <Box textAlign="center" py={8}>
        <CircularProgress size={60} sx={{ color: '#00bcd4' }} />
        <Typography variant="h6" sx={{ mt: 2, color: '#ffffff' }}>
          Analyzing your symptoms...
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, color: '#b0b0b0' }}>
          Please wait while our AI processes your information
        </Typography>
      </Box>
    );
  }

  // Handle new data structure for pending implementation or errors
  if (data.status === 'pending_implementation' || data.status === 'error') {
    return (
      <Box textAlign="center" py={8}>
        <Psychology sx={{ fontSize: 60, color: '#00bcd4', mb: 2 }} />
        <Typography variant="h6" sx={{ color: '#ffffff', mb: 2 }}>
          {data.status === 'error' ? 'Diagnosis Error' : 'AI Diagnosis'}
        </Typography>
        <Typography variant="body1" sx={{ color: '#b0b0b0', mb: 3 }}>
          {data.message}
        </Typography>
        {symptoms && symptoms.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" sx={{ color: '#ffffff', mb: 1 }}>
              Selected Symptoms:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
              {symptoms.map((symptom, index) => (
                <Chip 
                  key={index} 
                  label={symptom} 
                  sx={{ 
                    backgroundColor: '#333333', 
                    color: '#00bcd4',
                    border: '1px solid #00bcd4'
                  }} 
                />
              ))}
            </Box>
          </Box>
        )}
      </Box>
    );
  }

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedAccordion(isExpanded ? panel : false);
  };

  const getProbabilityColor = (probability) => {
    if (probability >= 0.8) return '#4caf50';
    if (probability >= 0.6) return '#ff9800';
    if (probability >= 0.4) return '#f44336';
    return '#9e9e9e';
  };

  const getSeverityIcon = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'mild':
        return <CheckCircle sx={{ color: '#4caf50' }} />;
      case 'moderate':
        return <Warning sx={{ color: '#ff9800' }} />;
      case 'severe':
        return <Warning sx={{ color: '#f44336' }} />;
      default:
        return <LocalHospital sx={{ color: '#2196f3' }} />;
    }
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Primary Diagnosis */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Psychology sx={{ color: '#2196f3', mr: 1, fontSize: 28 }} />
                <Typography variant="h5" component="h2">
                  AI Diagnosis Results
                </Typography>
              </Box>

              <Paper 
                elevation={2} 
                sx={{ 
                  p: 3, 
                  mb: 3, 
                  background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                  border: '2px solid #2196f3'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {getSeverityIcon(data.primaryDiagnosis.severity)}
                  <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>
                    Primary Diagnosis: {data.primaryDiagnosis.condition}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Confidence Level: {Math.round(data.primaryDiagnosis.probability * 100)}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={data.primaryDiagnosis.probability * 100}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: 'rgba(33, 150, 243, 0.1)',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: getProbabilityColor(data.primaryDiagnosis.probability),
                        borderRadius: 4
                      }
                    }}
                  />
                </Box>

                <Chip
                  label={`Severity: ${data.primaryDiagnosis.severity}`}
                  color={data.primaryDiagnosis.severity === 'Mild' ? 'success' : 
                         data.primaryDiagnosis.severity === 'Moderate' ? 'warning' : 'error'}
                  variant="filled"
                />
              </Paper>

              {/* Alternative Diagnoses */}
              <Accordion 
                expanded={expandedAccordion === 'alternatives'} 
                onChange={handleAccordionChange('alternatives')}
              >
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="h6">
                    Alternative Diagnoses ({data.alternativeDiagnoses.length})
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    {data.alternativeDiagnoses.map((diagnosis, index) => (
                      <Grid item xs={12} sm={6} key={index}>
                        <Paper elevation={1} sx={{ p: 2 }}>
                          <Typography variant="subtitle1" gutterBottom>
                            {diagnosis.condition}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Confidence: {Math.round(diagnosis.probability * 100)}%
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={diagnosis.probability * 100}
                            sx={{
                              height: 6,
                              borderRadius: 3,
                              backgroundColor: 'rgba(0, 0, 0, 0.1)',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: getProbabilityColor(diagnosis.probability),
                                borderRadius: 3
                              }
                            }}
                          />
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </AccordionDetails>
              </Accordion>

              {/* Treatment Recommendations */}
              <Accordion 
                expanded={expandedAccordion === 'treatment'} 
                onChange={handleAccordionChange('treatment')}
                sx={{ mt: 2 }}
              >
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="h6">
                    Treatment Recommendations
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    {data.recommendations.map((recommendation, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <Assignment sx={{ color: '#4caf50' }} />
                        </ListItemIcon>
                        <ListItemText primary={recommendation} />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>

              {/* Risk Factors */}
              <Accordion 
                expanded={expandedAccordion === 'risk'} 
                onChange={handleAccordionChange('risk')}
                sx={{ mt: 2 }}
              >
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="h6">
                    Risk Factors Considered
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {data.riskFactors.map((factor, index) => (
                      <Chip
                        key={index}
                        label={factor}
                        variant="outlined"
                        color="warning"
                        size="small"
                      />
                    ))}
                  </Box>
                </AccordionDetails>
              </Accordion>
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar Information */}
        <Grid item xs={12} lg={4}>
          {/* Analyzed Symptoms */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Analyzed Symptoms
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {symptoms.symptoms?.map((symptom, index) => (
                  <Chip
                    key={index}
                    label={symptom}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="body2" color="text.secondary">
                <strong>Duration:</strong> {symptoms.duration || 'Not specified'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Severity:</strong> {symptoms.severity}/10
              </Typography>
              {symptoms.age && (
                <Typography variant="body2" color="text.secondary">
                  <strong>Age:</strong> {symptoms.age} years
                </Typography>
              )}
              {symptoms.gender && (
                <Typography variant="body2" color="text.secondary">
                  <strong>Gender:</strong> {symptoms.gender}
                </Typography>
              )}
            </CardContent>
          </Card>

          {/* AI Analysis Info */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Science sx={{ color: '#2196f3', mr: 1 }} />
                <Typography variant="h6">
                  AI Analysis Details
                </Typography>
              </Box>
              
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <TrendingUp sx={{ color: '#4caf50' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Machine Learning Model"
                    secondary="Advanced neural network trained on medical data"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Schedule sx={{ color: '#ff9800' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Analysis Time"
                    secondary="2.3 seconds"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Person sx={{ color: '#9c27b0' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Personalized Results"
                    secondary="Based on your specific symptoms and profile"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Next Steps
              </Typography>
              
              <Button
                fullWidth
                variant="contained"
                startIcon={<LocalHospital />}
                sx={{ mb: 2 }}
                onClick={() => window.open('https://www.healthline.com/find-care', '_blank')}
              >
                Find Healthcare Provider
              </Button>
              
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Assignment />}
                sx={{ mb: 2 }}
              >
                Save Results
              </Button>
              
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Schedule />}
              >
                Schedule Follow-up
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Medical Disclaimer */}
      <Alert severity="warning" sx={{ mt: 3 }}>
        <Typography variant="body2">
          <strong>Important:</strong> This AI diagnosis is for informational purposes only and should not 
          replace professional medical advice. Please consult with a qualified healthcare provider for 
          accurate diagnosis and treatment. If you're experiencing severe symptoms or a medical emergency, 
          seek immediate medical attention.
        </Typography>
      </Alert>
    </Box>
  );
};

export default DiagnosisResults;
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

  // Helper functions defined first
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
      case 'high':
      case 'severe':
        return <Warning sx={{ color: '#f44336', mr: 1 }} />;
      case 'medium':
      case 'moderate':
        return <Warning sx={{ color: '#ff9800', mr: 1 }} />;
      case 'low':
      case 'mild':
        return <CheckCircle sx={{ color: '#4caf50', mr: 1 }} />;
      default:
        return <Psychology sx={{ color: '#2196f3', mr: 1 }} />;
    }
  };

  const renderMLResults = (transformedData) => {
    if (!transformedData.primaryDiagnosis) {
      return (
        <Box textAlign="center" py={8}>
          <Psychology sx={{ fontSize: 60, color: '#00bcd4', mb: 2 }} />
          <Typography variant="h6" sx={{ color: '#ffffff', mb: 2 }}>
            No Clear Diagnosis Found
          </Typography>
          <Typography variant="body1" sx={{ color: '#b0b0b0', mb: 3 }}>
            The AI analysis could not determine a clear diagnosis based on the provided symptoms.
          </Typography>
        </Box>
      );
    }

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
                    {getSeverityIcon(transformedData.primaryDiagnosis.severity)}
                    <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>
                      Primary Diagnosis: {transformedData.primaryDiagnosis.condition}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Confidence Level: {Math.round(transformedData.primaryDiagnosis.probability * 100)}%
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={transformedData.primaryDiagnosis.probability * 100}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: 'rgba(33, 150, 243, 0.1)',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: getProbabilityColor(transformedData.primaryDiagnosis.probability),
                          borderRadius: 4,
                        },
                      }}
                    />
                  </Box>

                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {transformedData.primaryDiagnosis.description}
                  </Typography>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    <Chip 
                      label={`Severity: ${transformedData.primaryDiagnosis.severity}`}
                      color="primary"
                      size="small"
                    />
                    <Chip 
                      label={`Risk Level: ${transformedData.riskAssessment?.level || 'Unknown'}`}
                      color={transformedData.riskAssessment?.level === 'High' ? 'error' : 
                             transformedData.riskAssessment?.level === 'Medium' ? 'warning' : 'success'}
                      size="small"
                    />
                  </Box>
                </Paper>

                {/* Alternative Diagnoses */}
                {transformedData.alternativeDiagnoses && transformedData.alternativeDiagnoses.length > 0 && (
                  <Accordion 
                    expanded={expandedAccordion === 'alternatives'} 
                    onChange={handleAccordionChange('alternatives')}
                    sx={{ mb: 2 }}
                  >
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography variant="h6">
                        Alternative Diagnoses ({transformedData.alternativeDiagnoses.length})
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={2}>
                        {transformedData.alternativeDiagnoses.map((diagnosis, index) => (
                          <Grid item xs={12} sm={6} key={index}>
                            <Paper elevation={1} sx={{ p: 2 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                {getSeverityIcon(diagnosis.severity)}
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                  {diagnosis.condition}
                                </Typography>
                              </Box>
                              <Typography variant="body2" color="text.secondary" gutterBottom>
                                Confidence: {Math.round(diagnosis.probability * 100)}%
                              </Typography>
                              <LinearProgress
                                variant="determinate"
                                value={diagnosis.probability * 100}
                                sx={{
                                  height: 6,
                                  borderRadius: 3,
                                  mb: 1,
                                  backgroundColor: 'rgba(0, 0, 0, 0.1)',
                                  '& .MuiLinearProgress-bar': {
                                    backgroundColor: getProbabilityColor(diagnosis.probability),
                                    borderRadius: 3,
                                  },
                                }}
                              />
                              <Typography variant="body2">
                                {diagnosis.description}
                              </Typography>
                            </Paper>
                          </Grid>
                        ))}
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                )}

                {/* Analysis Details */}
                <Accordion 
                  expanded={expandedAccordion === 'analysis'} 
                  onChange={handleAccordionChange('analysis')}
                  sx={{ mb: 2 }}
                >
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="h6">Detailed Analysis</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={3}>
                      {/* Analyzed Symptoms */}
                      <Grid item xs={12} md={6}>
                        <Card variant="outlined">
                          <CardContent>
                            <Typography variant="h6" gutterBottom>
                              <Science sx={{ mr: 1, verticalAlign: 'middle' }} />
                              Analyzed Symptoms
                            </Typography>
                            <List dense>
                              {transformedData.analyzedSymptoms?.map((symptom, index) => (
                                <ListItem key={index}>
                                  <ListItemIcon>
                                    <CheckCircle sx={{ color: '#4caf50', fontSize: 20 }} />
                                  </ListItemIcon>
                                  <ListItemText 
                                    primary={symptom.name || symptom}
                                    secondary={symptom.relevance ? `Relevance: ${symptom.relevance}` : null}
                                  />
                                </ListItem>
                              )) || symptoms?.map((symptom, index) => (
                                <ListItem key={index}>
                                  <ListItemIcon>
                                    <CheckCircle sx={{ color: '#4caf50', fontSize: 20 }} />
                                  </ListItemIcon>
                                  <ListItemText primary={symptom} />
                                </ListItem>
                              ))}
                            </List>
                          </CardContent>
                        </Card>
                      </Grid>

                      {/* AI Analysis Info */}
                      <Grid item xs={12} md={6}>
                        <Card variant="outlined">
                          <CardContent>
                            <Typography variant="h6" gutterBottom>
                              <TrendingUp sx={{ mr: 1, verticalAlign: 'middle' }} />
                              AI Analysis Info
                            </Typography>
                            <List dense>
                              <ListItem>
                                <ListItemText 
                                  primary="Analysis Method"
                                  secondary={transformedData.analysisMethod || "Advanced ML Algorithm"}
                                />
                              </ListItem>
                              <ListItem>
                                <ListItemText 
                                  primary="Confidence Score"
                                  secondary={`${Math.round((transformedData.primaryDiagnosis?.probability || 0) * 100)}%`}
                                />
                              </ListItem>
                              <ListItem>
                                <ListItemText 
                                  primary="Processing Time"
                                  secondary={transformedData.processingTime || "< 1 second"}
                                />
                              </ListItem>
                              <ListItem>
                                <ListItemText 
                                  primary="Analysis ID"
                                  secondary={transformedData.analysisId || "N/A"}
                                />
                              </ListItem>
                            </List>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </CardContent>
            </Card>
          </Grid>

          {/* Risk Assessment & Next Steps */}
          <Grid item xs={12} lg={4}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <Warning sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Risk Assessment
                </Typography>
                
                {transformedData.riskAssessment && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Risk Level: {transformedData.riskAssessment.level}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={transformedData.riskAssessment.score * 100}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        mb: 2,
                        backgroundColor: 'rgba(0, 0, 0, 0.1)',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: transformedData.riskAssessment.level === 'High' ? '#f44336' :
                                         transformedData.riskAssessment.level === 'Medium' ? '#ff9800' : '#4caf50',
                          borderRadius: 4,
                        },
                      }}
                    />
                    <Typography variant="body2">
                      {transformedData.riskAssessment.description}
                    </Typography>
                  </Box>
                )}

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" gutterBottom>
                  <LocalHospital sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Recommended Actions
                </Typography>
                
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Person />}
                  sx={{ mb: 2, backgroundColor: '#2196f3' }}
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

  // Main component logic
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
        {data.error_details && (
          <Typography variant="body2" sx={{ color: '#ff6b6b', mb: 3, fontFamily: 'monospace' }}>
            {data.error_details}
          </Typography>
        )}
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

  // Handle successful ML predictions
  if (data.status === 'success' && data.predictions) {
    // Transform ML backend data to component format
    const transformedData = {
      primaryDiagnosis: data.predictions[0] ? {
        condition: data.predictions[0].condition || data.predictions[0].disease,
        probability: data.predictions[0].confidence || data.predictions[0].probability,
        severity: data.predictions[0].severity || 'Moderate',
        description: data.predictions[0].description || 'No description available'
      } : null,
      alternativeDiagnoses: data.predictions.slice(1).map(pred => ({
        condition: pred.condition || pred.disease,
        probability: pred.confidence || pred.probability,
        severity: pred.severity || 'Moderate',
        description: pred.description || 'No description available'
      })),
      riskAssessment: data.risk_assessment ? {
        level: data.risk_assessment.level,
        score: data.risk_assessment.score,
        description: data.risk_assessment.description
      } : null,
      analyzedSymptoms: data.analyzed_symptoms,
      patientFactors: data.patient_factors,
      timestamp: data.timestamp,
      analysisId: data.analysis_id
    };

    return renderMLResults(transformedData);
  }

  // Handle legacy data format (if any)
  return (
    <Box textAlign="center" py={8}>
      <Psychology sx={{ fontSize: 60, color: '#00bcd4', mb: 2 }} />
      <Typography variant="h6" sx={{ color: '#ffffff', mb: 2 }}>
        Processing Results...
      </Typography>
      <Typography variant="body1" sx={{ color: '#b0b0b0' }}>
        Please wait while we process your diagnosis results.
      </Typography>
    </Box>
  );
};

export default DiagnosisResults;
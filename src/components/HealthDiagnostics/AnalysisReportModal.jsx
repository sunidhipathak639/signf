import React, { useRef, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  LinearProgress,
  Alert,
  IconButton,
  Paper,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  useMediaQuery,
  Fade,
  CircularProgress
} from '@mui/material';
import {
  Close,
  Download,
  LocalHospital,
  Warning,
  Info,
  CheckCircle,
  Person,
  CalendarToday,
  AccessTime,
  Assessment,
  TrendingUp,
  HealthAndSafety,
  Psychology,
  Lightbulb,
  ExpandMore,
  Print,
  Share
} from '@mui/icons-material';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const AnalysisReportModal = ({ open, onClose, analysisData, patientInfo, symptoms }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const reportRef = useRef(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Get age-specific recommendations
  const getAgeSpecificRecommendations = (age, diagnosis) => {
    const ageGroup = age < 18 ? 'pediatric' : age < 65 ? 'adult' : 'senior';
    
    const recommendations = {
      pediatric: [
        'Consult with a pediatrician for proper evaluation',
        'Monitor symptoms closely and maintain a symptom diary',
        'Ensure adequate rest and hydration',
        'Consider parental supervision for medication if prescribed',
        'Schedule regular follow-ups as recommended by healthcare provider'
      ],
      adult: [
        'Schedule an appointment with your primary care physician',
        'Maintain a healthy lifestyle with proper diet and exercise',
        'Monitor symptoms and seek immediate care if they worsen',
        'Follow prescribed treatment plans consistently',
        'Consider stress management techniques if applicable'
      ],
      senior: [
        'Consult with your geriatrician or primary care physician',
        'Review current medications for potential interactions',
        'Consider mobility and fall prevention measures',
        'Ensure regular health screenings and check-ups',
        'Maintain social connections and mental health support'
      ]
    };

    return recommendations[ageGroup] || recommendations.adult;
  };

  // Get risk level color and icon
  const getRiskLevelDisplay = (riskLevel) => {
    const riskLevels = {
      low: { color: 'success', icon: <CheckCircle />, text: 'Low Risk' },
      moderate: { color: 'warning', icon: <Warning />, text: 'Moderate Risk' },
      high: { color: 'error', icon: <Warning />, text: 'High Risk' }
    };
    return riskLevels[riskLevel?.toLowerCase()] || riskLevels.moderate;
  };

  // Generate PDF from the modal content
  const generatePDF = async () => {
    if (!reportRef.current) return;

    // Check if patient name is provided, if not prompt for it
    let patientName = patientInfo?.name;
    if (!patientName || patientName.trim() === '' || patientName === 'Not Provided') {
      patientName = prompt('Please enter the patient name for the PDF report:');
      if (!patientName || patientName.trim() === '') {
        alert('Patient name is required to generate the PDF report.');
        return;
      }
    }

    setIsGeneratingPDF(true);
    try {
      // Create canvas from the report content
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: reportRef.current.scrollWidth,
        height: reportRef.current.scrollHeight
      });

      // Calculate PDF dimensions
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      let position = 0;

      // Add the image to PDF
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add new pages if content is longer than one page
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Generate filename with patient name and timestamp
      const timestamp = new Date().toISOString().split('T')[0];
      const sanitizedName = patientName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
      const filename = `health-analysis-${sanitizedName}-${timestamp}.pdf`;
      
      // Download the PDF
      pdf.save(filename);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (!analysisData) return null;

  const riskDisplay = getRiskLevelDisplay(analysisData.riskAssessment?.level);
  const ageRecommendations = getAgeSpecificRecommendations(patientInfo?.age, analysisData.primaryDiagnosis);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      fullScreen={fullScreen}
      PaperProps={{
        sx: {
          borderRadius: fullScreen ? 0 : 2,
          maxHeight: '95vh'
        }
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 2
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Assessment />
          <Typography variant="h6" component="div">
            SIGNF Health Analysis Report
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            onClick={generatePDF}
            disabled={isGeneratingPDF}
            sx={{ color: 'white' }}
            title="Download PDF Report"
          >
            {isGeneratingPDF ? <CircularProgress size={24} color="inherit" /> : <Download />}
          </IconButton>
          <IconButton onClick={onClose} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Box ref={reportRef} sx={{ p: 3, backgroundColor: '#fafafa' }}>
          {/* SIGNF Company Header */}
          <Box sx={{ textAlign: 'center', mb: 3, pb: 2, borderBottom: '2px solid #e0e0e0' }}>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 'bold', 
                color: '#1976d2',
                mb: 1,
                letterSpacing: '0.1em'
              }}
            >
              SIGNF
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#666',
                fontWeight: 'medium'
              }}
            >
              Health Diagnostics Report
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#999',
                mt: 1
              }}
            >
              Advanced AI-Powered Healthcare Analysis
            </Typography>
          </Box>

          {/* Header Section */}
          <Paper elevation={2} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <Person />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" color="primary">
                      Patient Information
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Generated on {new Date().toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">Patient Name</Typography>
                    <Typography variant="h6">{patientInfo?.name || 'Not Provided'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Age</Typography>
                    <Typography variant="h6">{patientInfo?.age || 'N/A'} years</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Gender</Typography>
                    <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
                      {patientInfo?.gender || 'N/A'}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar sx={{ bgcolor: riskDisplay.color + '.main' }}>
                    {riskDisplay.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" color={riskDisplay.color + '.main'}>
                      Risk Assessment
                    </Typography>
                    <Typography variant="h5" color={riskDisplay.color + '.main'}>
                      {riskDisplay.text}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {analysisData.riskAssessment?.description || 'Risk assessment based on reported symptoms'}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* Symptoms Section */}
          <Card elevation={2} sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <HealthAndSafety color="primary" />
                Reported Symptoms
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                {symptoms?.map((symptom, index) => (
                  <Chip
                    key={index}
                    label={symptom}
                    variant="outlined"
                    color="primary"
                    size="small"
                  />
                ))}
              </Box>
            </CardContent>
          </Card>

          {/* Primary Diagnosis */}
          <Card elevation={2} sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocalHospital color="primary" />
                Primary Diagnosis
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="h5" color="primary" gutterBottom>
                  {analysisData.primaryDiagnosis?.condition || 'Condition Assessment'}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" color="text.secondary">Confidence Level</Typography>
                    <LinearProgress
                      variant="determinate"
                      value={analysisData.primaryDiagnosis?.confidence || 75}
                      sx={{ height: 8, borderRadius: 4, mt: 1 }}
                    />
                  </Box>
                  <Typography variant="h6" color="primary">
                    {analysisData.primaryDiagnosis?.confidence || 75}%
                  </Typography>
                </Box>
                <Typography variant="body1" paragraph>
                  {analysisData.primaryDiagnosis?.description || 'Based on the reported symptoms, this appears to be the most likely condition.'}
                </Typography>
                <Chip
                  label={`Severity: ${analysisData.primaryDiagnosis?.severity || 'Moderate'}`}
                  color={analysisData.primaryDiagnosis?.severity === 'High' ? 'error' : 
                         analysisData.primaryDiagnosis?.severity === 'Low' ? 'success' : 'warning'}
                  variant="filled"
                />
              </Box>
            </CardContent>
          </Card>

          {/* Alternative Diagnoses */}
          {analysisData.alternativeDiagnoses && analysisData.alternativeDiagnoses.length > 0 && (
            <Card elevation={2} sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Psychology color="primary" />
                  Alternative Possibilities
                </Typography>
                <List>
                  {analysisData.alternativeDiagnoses.map((diagnosis, index) => (
                    <ListItem key={index} divider={index < analysisData.alternativeDiagnoses.length - 1}>
                      <ListItemIcon>
                        <TrendingUp color="secondary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={diagnosis.condition}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Confidence: {diagnosis.confidence}%
                            </Typography>
                            <Typography variant="body2">
                              {diagnosis.description}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          )}

          {/* Age-Specific Recommendations */}
          <Card elevation={2} sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Lightbulb color="primary" />
                Age-Specific Recommendations ({patientInfo?.age || 'N/A'} years old)
              </Typography>
              <List>
                {ageRecommendations.map((recommendation, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <CheckCircle color="success" />
                    </ListItemIcon>
                    <ListItemText primary={recommendation} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

          {/* General Recommendations */}
          {analysisData.recommendations && analysisData.recommendations.length > 0 && (
            <Card elevation={2} sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Lightbulb color="primary" />
                  General Recommendations
                </Typography>
                <List>
                  {analysisData.recommendations.map((recommendation, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <CheckCircle color="success" />
                      </ListItemIcon>
                      <ListItemText primary={recommendation} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          )}

          {/* Medical Disclaimer */}
          <Alert severity="warning" sx={{ mt: 3 }}>
            <Typography variant="body2">
              <strong>Medical Disclaimer:</strong> This analysis is for informational purposes only and should not replace professional medical advice. 
              Always consult with a qualified healthcare provider for proper diagnosis and treatment. 
              If you are experiencing a medical emergency, please seek immediate medical attention or call emergency services.
            </Typography>
          </Alert>

          {/* Report Footer */}
          <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider', textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Report generated on {new Date().toLocaleString()} | SIGNF Health Analysis System v1.0
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
              Powered by SIGNF - Advanced AI Healthcare Technology
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
        <Button
          onClick={generatePDF}
          variant="contained"
          startIcon={isGeneratingPDF ? <CircularProgress size={20} /> : <Download />}
          disabled={isGeneratingPDF}
          sx={{ mr: 1 }}
        >
          {isGeneratingPDF ? 'Generating PDF...' : 'Download PDF Report'}
        </Button>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AnalysisReportModal;
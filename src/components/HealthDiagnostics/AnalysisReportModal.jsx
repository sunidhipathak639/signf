import React, { useRef, useState, forwardRef } from 'react';
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
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  LinearProgress,
  Alert,
  IconButton,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  useMediaQuery,
  Slide,
  CircularProgress
} from '@mui/material';
import {
  Close,
  Download,
  LocalHospital,
  Warning,
  CheckCircle,
  Person,
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
  const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

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

  const getRiskLevelDisplay = (riskLevel) => {
    const riskLevels = {
      low: { color: 'success', icon: <CheckCircle />, text: 'Low Risk' },
      moderate: { color: 'warning', icon: <Warning />, text: 'Moderate Risk' },
      high: { color: 'error', icon: <Warning />, text: 'High Risk' }
    };
    return riskLevels[riskLevel?.toLowerCase()] || riskLevels.moderate;
  };

  const generatePDF = async () => {
    if (!reportRef.current) return;
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
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#0d1117',
        width: reportRef.current.scrollWidth,
        height: reportRef.current.scrollHeight
      });
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      const pdf = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      const timestamp = new Date().toISOString().split('T')[0];
      const sanitizedName = patientName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
      const filename = `health-analysis-${sanitizedName}-${timestamp}.pdf`;
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
  const confidencePercent = (() => {
    const val = analysisData.primaryDiagnosis?.confidence;
    if (val == null) return 75;
    return val <= 1 ? Math.round(val * 100) : Math.round(val);
  })();
  const handlePrint = () => {
    window.print();
  };
  const handleShare = async () => {
    const title = 'SIGNF Health Analysis Report';
    const text = 'Health analysis report generated by SIGNF.';
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch (e) {}
    } else {
      try {
        const reportData = { timestamp: new Date().toISOString(), patientInfo, symptoms, analysis: analysisData };
        const blob = new Blob([JSON.stringify(reportData)], { type: 'application/json' });
        const linkUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = linkUrl;
        a.download = `health-analysis-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(linkUrl);
      } catch (e) {}
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      fullScreen={fullScreen}
      TransitionComponent={Transition}
      aria-labelledby="analysis-report-title"
      aria-describedby="analysis-report-description"
      PaperProps={{
        sx: {
          borderRadius: fullScreen ? 0 : 16,
          maxHeight: '92vh',
          boxShadow: '0 10px 24px rgba(0,0,0,0.35)',
          backgroundColor: '#0d1117',
          color: '#ffffff',
          border: '1px solid #30363d'
        }
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#0d1117',
          color: '#ffffff',
          py: 2,
          borderBottom: '1px solid #30363d'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Assessment />
          <Typography id="analysis-report-title" variant="h6" component="div" sx={{ color: '#ffffff' }}>
            SIGNF Health Analysis Report
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            onClick={generatePDF}
            disabled={isGeneratingPDF}
            sx={{ color: '#ffffff' }}
            title="Download PDF Report"
          >
            {isGeneratingPDF ? <CircularProgress size={24} color="inherit" /> : <Download />}
          </IconButton>
          <IconButton onClick={handlePrint} sx={{ color: '#ffffff' }} title="Print">
            <Print />
          </IconButton>
          <IconButton onClick={handleShare} sx={{ color: '#ffffff' }} title="Share">
            <Share />
          </IconButton>
          <IconButton onClick={onClose} sx={{ color: '#ffffff' }}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0, backgroundColor: '#0d1117' }}>
        <Box ref={reportRef} sx={{ p: { xs: 2, md: 3 }, backgroundColor: '#0d1117', color: '#ffffff' }}>
          <Box sx={{ textAlign: 'center', mb: 2, pb: 2, borderBottom: '1px solid #30363d' }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, color: '#ffffff', mb: 1, letterSpacing: '0.03em' }}
            >
              SIGNF
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: '#ffffff' }}
              id="analysis-report-description"
            >
              Health Diagnostics Report
            </Typography>
          </Box>
          <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, mb: 3, backgroundColor: '#0d1117', border: '1px solid #30363d' }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar sx={{ bgcolor: '#161b22', color: '#ffffff' }}>
                    <Person />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 600 }}>
                      Patient Information
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#ffffff' }}>
                      Generated on {new Date().toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="body2" sx={{ color: '#ffffff' }}>Patient Name</Typography>
                    <Typography variant="h6" sx={{ color: '#ffffff' }}>{patientInfo?.name || 'Not Provided'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" sx={{ color: '#ffffff' }}>Age</Typography>
                    <Typography variant="h6" sx={{ color: '#ffffff' }}>{patientInfo?.age || 'N/A'} years</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" sx={{ color: '#ffffff' }}>Gender</Typography>
                    <Typography variant="h6" sx={{ textTransform: 'capitalize', color: '#ffffff' }}>
                      {patientInfo?.gender || 'N/A'}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar sx={{ bgcolor: '#161b22', color: '#ffffff' }}>
                    {riskDisplay.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 600 }}>
                      Risk Assessment
                    </Typography>
                    <Typography variant="h5" sx={{ color: '#ffffff', fontWeight: 700 }}>
                      {riskDisplay.text}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ color: '#ffffff' }}>
                  {analysisData.riskAssessment?.description || 'Risk assessment based on reported symptoms'}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
          
          <Card elevation={0} variant="outlined" sx={{ mb: 3, backgroundColor: '#0d1117', borderColor: '#30363d' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#ffffff' }}>
                <HealthAndSafety sx={{ color: '#58a6ff' }} />
                Reported Symptoms
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                {symptoms?.map((symptom, index) => (
                  <Chip
                    key={index}
                    label={symptom}
                    variant="outlined"
                    sx={{ borderColor: '#30363d', color: '#ffffff' }}
                    size="small"
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
          
          <Card elevation={0} variant="outlined" sx={{ mb: 3, backgroundColor: '#0d1117', borderColor: '#30363d' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#ffffff' }}>
                <LocalHospital sx={{ color: '#58a6ff' }} />
                Primary Diagnosis
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="h5" sx={{ color: '#ffffff', fontWeight: 700 }} gutterBottom>
                  {analysisData.primaryDiagnosis?.condition || 'Condition Assessment'}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ color: '#ffffff' }}>Confidence Level</Typography>
                    <LinearProgress
                      variant="determinate"
                      value={confidencePercent}
                      sx={{ height: 8, borderRadius: 4, mt: 1, bgcolor: '#161b22', '& .MuiLinearProgress-bar': { backgroundColor: '#58a6ff' } }}
                    />
                  </Box>
                  <Typography variant="h6" sx={{ color: '#58a6ff', fontWeight: 600 }}>
                    {confidencePercent}%
                  </Typography>
                </Box>
                <Typography variant="body1" paragraph sx={{ color: '#ffffff' }}>
                  {analysisData.primaryDiagnosis?.description || 'Based on the reported symptoms, this appears to be the most likely condition.'}
                </Typography>
                <Chip
                  label={`Severity: ${analysisData.primaryDiagnosis?.severity || 'Moderate'}`}
                  variant="outlined"
                  sx={{
                    borderColor:
                      analysisData.primaryDiagnosis?.severity === 'High' ? '#ef4444' :
                      analysisData.primaryDiagnosis?.severity === 'Low' ? '#22c55e' : '#f59e0b',
                    color:
                      analysisData.primaryDiagnosis?.severity === 'High' ? '#ef4444' :
                      analysisData.primaryDiagnosis?.severity === 'Low' ? '#22c55e' : '#f59e0b'
                  }}
                />
              </Box>
            </CardContent>
          </Card>
          
          {analysisData.alternativeDiagnoses && analysisData.alternativeDiagnoses.length > 0 && (
            <Card elevation={0} variant="outlined" sx={{ mb: 3, backgroundColor: '#0d1117', borderColor: '#30363d' }}>
              <CardContent>
                <Accordion sx={{ backgroundColor: 'transparent', border: 'none', boxShadow: 'none' }}>
                  <AccordionSummary expandIcon={<ExpandMore sx={{ color: '#ffffff' }} />}>
                    <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#ffffff' }}>
                      <Psychology sx={{ color: '#58a6ff' }} />
                      Alternative Possibilities
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List>
                      {analysisData.alternativeDiagnoses.map((diagnosis, index) => (
                        <ListItem key={index} divider={index < analysisData.alternativeDiagnoses.length - 1}>
                          <ListItemIcon>
                            <TrendingUp sx={{ color: '#58a6ff' }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={diagnosis.condition}
                            primaryTypographyProps={{ sx: { color: '#ffffff' } }}
                            secondary={
                              <Box>
                                <Typography variant="body2" sx={{ color: '#ffffff' }}>
                                  Confidence: {Math.round((diagnosis.confidence <= 1 ? diagnosis.confidence * 100 : diagnosis.confidence))}%
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#ffffff' }}>
                                  {diagnosis.description}
                                </Typography>
                              </Box>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
              </CardContent>
            </Card>
          )}
          
          <Card elevation={0} variant="outlined" sx={{ mb: 3, backgroundColor: '#0d1117', borderColor: '#30363d' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#ffffff' }}>
                <Lightbulb sx={{ color: '#58a6ff' }} />
                Age-Specific Recommendations ({patientInfo?.age || 'N/A'})
              </Typography>
              <List>
                {ageRecommendations.map((recommendation, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <CheckCircle sx={{ color: '#22c55e' }} />
                    </ListItemIcon>
                    <ListItemText primary={recommendation} primaryTypographyProps={{ sx: { color: '#ffffff' } }} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
          
          {analysisData.recommendations && analysisData.recommendations.length > 0 && (
            <Card elevation={0} variant="outlined" sx={{ mb: 3, backgroundColor: '#0d1117', borderColor: '#30363d' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#ffffff' }}>
                  <Lightbulb sx={{ color: '#58a6ff' }} />
                  General Recommendations
                </Typography>
                <List>
                  {analysisData.recommendations.map((recommendation, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <CheckCircle sx={{ color: '#22c55e' }} />
                      </ListItemIcon>
                      <ListItemText primary={recommendation} primaryTypographyProps={{ sx: { color: '#ffffff' } }} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          )}
          
          <Alert severity="warning" sx={{ mt: 3, backgroundColor: '#161b22', color: '#ffffff', border: '1px solid #f59e0b40' }}>
            <Typography variant="body2" sx={{ color: '#ffffff' }}>
              <strong>Medical Disclaimer:</strong> This analysis is for informational purposes only and should not replace professional medical advice. 
              Always consult with a qualified healthcare provider for proper diagnosis and treatment. 
              If you are experiencing a medical emergency, please seek immediate medical attention or call emergency services.
            </Typography>
          </Alert>
          
          <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #30363d', textAlign: 'center' }}>
            <Typography variant="body2" sx={{ mb: 1, color: '#ffffff' }}>
              Report generated on {new Date().toLocaleString()} | SIGNF Health Analysis System v1.0
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '0.75rem', color: '#ffffff' }}>
              Powered by SIGNF - Advanced AI Healthcare Technology
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, backgroundColor: '#0d1117', borderTop: '1px solid #30363d' }}>
        <Button
          onClick={generatePDF}
          variant="contained"
          startIcon={isGeneratingPDF ? <CircularProgress size={20} /> : <Download />}
          disabled={isGeneratingPDF}
          sx={{ mr: 1, backgroundColor: '#58a6ff', color: '#ffffff', '&:hover': { backgroundColor: '#1f6feb' } }}
        >
          {isGeneratingPDF ? 'Generating PDF...' : 'Download PDF Report'}
        </Button>
        <Button onClick={handleShare} variant="outlined" startIcon={<Share />} sx={{ mr: 1, borderColor: '#ffffff40', color: '#ffffff', '&:hover': { borderColor: '#ffffff80', backgroundColor: '#0d1117' } }}>
          Share
        </Button>
        <Button onClick={handlePrint} variant="outlined" startIcon={<Print />} sx={{ mr: 1, borderColor: '#ffffff40', color: '#ffffff', '&:hover': { borderColor: '#ffffff80', backgroundColor: '#0d1117' } }}>
          Print
        </Button>
        <Button onClick={onClose} variant="outlined" sx={{ borderColor: '#ffffff40', color: '#ffffff', '&:hover': { borderColor: '#ffffff80', backgroundColor: '#0d1117' } }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AnalysisReportModal;
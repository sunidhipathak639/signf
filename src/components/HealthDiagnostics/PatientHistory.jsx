import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot
} from '@mui/lab';
import {
  ExpandMore,
  LocalHospital,
  Medication,
  Vaccines,
  Psychology,
  Assignment,
  Warning,
  CheckCircle,
  Add,
  Edit,
  Delete,
  Timeline as TimelineIcon,
  Person,
  People,
  Science
} from '@mui/icons-material';

const PatientHistory = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [expandedAccordion, setExpandedAccordion] = useState('timeline');

  // Mock patient history data
  const patientHistory = {
    personalInfo: {
      name: 'John Doe',
      age: 35,
      gender: 'Male',
      bloodType: 'O+',
      allergies: ['Penicillin', 'Shellfish'],
      emergencyContact: 'Jane Doe - (555) 123-4567'
    },
    medicalHistory: [
      {
        id: 1,
        date: '2024-01-15',
        type: 'diagnosis',
        title: 'Hypertension Diagnosis',
        description: 'Diagnosed with stage 1 hypertension during routine checkup',
        provider: 'Dr. Smith',
        severity: 'moderate',
        status: 'ongoing'
      },
      {
        id: 2,
        date: '2023-11-20',
        type: 'procedure',
        title: 'Annual Physical Exam',
        description: 'Comprehensive physical examination with blood work',
        provider: 'Dr. Johnson',
        severity: 'low',
        status: 'completed'
      },
      {
        id: 3,
        date: '2023-09-10',
        type: 'vaccination',
        title: 'Flu Vaccination',
        description: 'Annual influenza vaccination administered',
        provider: 'Nurse Williams',
        severity: 'low',
        status: 'completed'
      },
      {
        id: 4,
        date: '2023-06-05',
        type: 'medication',
        title: 'Lisinopril Prescribed',
        description: 'Started on ACE inhibitor for blood pressure management',
        provider: 'Dr. Smith',
        severity: 'moderate',
        status: 'ongoing'
      },
      {
        id: 5,
        date: '2023-03-12',
        type: 'diagnosis',
        title: 'Seasonal Allergies',
        description: 'Diagnosed with seasonal allergic rhinitis',
        provider: 'Dr. Brown',
        severity: 'low',
        status: 'managed'
      }
    ],
    familyHistory: [
      { condition: 'Diabetes Type 2', relation: 'Father', age: 'Diagnosed at 45' },
      { condition: 'Heart Disease', relation: 'Grandfather (Paternal)', age: 'Diagnosed at 60' },
      { condition: 'Breast Cancer', relation: 'Mother', age: 'Diagnosed at 52' },
      { condition: 'Hypertension', relation: 'Both Parents', age: 'Multiple ages' }
    ],
    currentMedications: [
      { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', purpose: 'Blood pressure' },
      { name: 'Multivitamin', dosage: '1 tablet', frequency: 'Once daily', purpose: 'General health' },
      { name: 'Omega-3', dosage: '1000mg', frequency: 'Twice daily', purpose: 'Heart health' }
    ],
    riskFactors: [
      { factor: 'Family History of Heart Disease', risk: 'High', modifiable: false },
      { factor: 'Sedentary Lifestyle', risk: 'Medium', modifiable: true },
      { factor: 'Stress Level', risk: 'Medium', modifiable: true },
      { factor: 'Diet Quality', risk: 'Low', modifiable: true }
    ]
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'diagnosis':
        return <LocalHospital sx={{ color: '#f44336' }} />;
      case 'medication':
        return <Medication sx={{ color: '#2196f3' }} />;
      case 'vaccination':
        return <Vaccines sx={{ color: '#4caf50' }} />;
      case 'procedure':
        return <Assignment sx={{ color: '#ff9800' }} />;
      default:
        return <LocalHospital sx={{ color: '#9e9e9e' }} />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return '#f44336';
      case 'moderate':
        return '#ff9800';
      case 'low':
        return '#4caf50';
      default:
        return '#9e9e9e';
    }
  };

  const getRiskColor = (risk) => {
    switch (risk.toLowerCase()) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedAccordion(isExpanded ? panel : false);
  };

  const filteredHistory = selectedCategory === 'all' 
    ? patientHistory.medicalHistory 
    : patientHistory.medicalHistory.filter(item => item.type === selectedCategory);

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Patient Overview */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Person sx={{ color: '#2196f3', mr: 1 }} />
                <Typography variant="h6">
                  Patient Information
                </Typography>
              </Box>
              
              <Typography variant="body1" gutterBottom>
                <strong>{patientHistory.personalInfo.name}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Age: {patientHistory.personalInfo.age} | Gender: {patientHistory.personalInfo.gender}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Blood Type: {patientHistory.personalInfo.bloodType}
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle2" gutterBottom>
                Known Allergies
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {patientHistory.personalInfo.allergies.map((allergy, index) => (
                  <Chip
                    key={index}
                    label={allergy}
                    color="error"
                    variant="outlined"
                    size="small"
                  />
                ))}
              </Box>
              
              <Typography variant="body2" color="text.secondary">
                <strong>Emergency Contact:</strong><br />
                {patientHistory.personalInfo.emergencyContact}
              </Typography>
            </CardContent>
          </Card>

          {/* Current Medications */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Medication sx={{ color: '#2196f3', mr: 1 }} />
                <Typography variant="h6">
                  Current Medications
                </Typography>
              </Box>
              
              <List dense>
                {patientHistory.currentMedications.map((med, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemText
                      primary={med.name}
                      secondary={`${med.dosage} - ${med.frequency} (${med.purpose})`}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

          {/* Risk Factors */}
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Warning sx={{ color: '#ff9800', mr: 1 }} />
                <Typography variant="h6">
                  Risk Factors
                </Typography>
              </Box>
              
              {patientHistory.riskFactors.map((risk, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2">
                      {risk.factor}
                    </Typography>
                    <Chip
                      label={risk.risk}
                      color={getRiskColor(risk.risk)}
                      size="small"
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {risk.modifiable ? 'Modifiable' : 'Non-modifiable'}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Medical History Timeline */}
        <Grid item xs={12} md={8}>
          {/* Category Filter */}
          <Box sx={{ mb: 3 }}>
            <Button
              variant={selectedCategory === 'all' ? 'contained' : 'outlined'}
              onClick={() => setSelectedCategory('all')}
              sx={{ mr: 1, mb: 1 }}
            >
              All
            </Button>
            <Button
              variant={selectedCategory === 'diagnosis' ? 'contained' : 'outlined'}
              onClick={() => setSelectedCategory('diagnosis')}
              sx={{ mr: 1, mb: 1 }}
            >
              Diagnoses
            </Button>
            <Button
              variant={selectedCategory === 'medication' ? 'contained' : 'outlined'}
              onClick={() => setSelectedCategory('medication')}
              sx={{ mr: 1, mb: 1 }}
            >
              Medications
            </Button>
            <Button
              variant={selectedCategory === 'procedure' ? 'contained' : 'outlined'}
              onClick={() => setSelectedCategory('procedure')}
              sx={{ mr: 1, mb: 1 }}
            >
              Procedures
            </Button>
            <Button
              variant={selectedCategory === 'vaccination' ? 'contained' : 'outlined'}
              onClick={() => setSelectedCategory('vaccination')}
              sx={{ mr: 1, mb: 1 }}
            >
              Vaccinations
            </Button>
          </Box>

          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Medical History Timeline
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={() => setOpenDialog(true)}
                >
                  Add Entry
                </Button>
              </Box>

              <Timeline>
                {filteredHistory.map((item, index) => (
                  <TimelineItem key={item.id}>
                    <TimelineSeparator>
                      <TimelineDot sx={{ bgcolor: getSeverityColor(item.severity) }}>
                        {getTypeIcon(item.type)}
                      </TimelineDot>
                      {index < filteredHistory.length - 1 && <TimelineConnector />}
                    </TimelineSeparator>
                    <TimelineContent>
                      <Card variant="outlined" sx={{ mb: 2 }}>
                        <CardContent sx={{ pb: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                            <Typography variant="h6" component="h3">
                              {item.title}
                            </Typography>
                            <Chip
                              label={item.status}
                              color={item.status === 'ongoing' ? 'warning' : 
                                     item.status === 'completed' ? 'success' : 'default'}
                              size="small"
                            />
                          </Box>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {new Date(item.date).toLocaleDateString()} • {item.provider}
                          </Typography>
                          <Typography variant="body2">
                            {item.description}
                          </Typography>
                        </CardContent>
                      </Card>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
            </CardContent>
          </Card>

          {/* Family History */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <People sx={{ color: '#2196f3', mr: 1 }} />
                <Typography variant="h6">
                  Family Medical History
                </Typography>
              </Box>
              
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Condition</TableCell>
                      <TableCell>Relation</TableCell>
                      <TableCell>Age at Diagnosis</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {patientHistory.familyHistory.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.condition}</TableCell>
                        <TableCell>{item.relation}</TableCell>
                        <TableCell>{item.age}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          {/* AI Analysis */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Science sx={{ color: '#2196f3', mr: 1 }} />
                <Typography variant="h6">
                  AI Health Pattern Analysis
                </Typography>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Alert severity="info" sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      <strong>Cardiovascular Risk:</strong> Elevated due to family history and current hypertension. 
                      Regular monitoring recommended.
                    </Typography>
                  </Alert>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Alert severity="success" sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      <strong>Medication Adherence:</strong> Good compliance with prescribed medications. 
                      Continue current regimen.
                    </Typography>
                  </Alert>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      <strong>Preventive Care:</strong> Due for annual physical and blood work. 
                      Schedule appointment soon.
                    </Typography>
                  </Alert>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Alert severity="info" sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      <strong>Lifestyle Factors:</strong> Consider increasing physical activity and 
                      stress management techniques.
                    </Typography>
                  </Alert>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add Entry Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Medical History Entry</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Title"
            margin="normal"
            placeholder="e.g., Annual Checkup"
          />
          <TextField
            fullWidth
            label="Description"
            margin="normal"
            multiline
            rows={3}
            placeholder="Detailed description of the medical event"
          />
          <TextField
            fullWidth
            label="Provider"
            margin="normal"
            placeholder="Healthcare provider name"
          />
          <TextField
            fullWidth
            label="Date"
            type="date"
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setOpenDialog(false)}>
            Add Entry
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PatientHistory;
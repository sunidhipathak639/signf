// Demo data for AI Health Diagnostics features
export const demoPatientData = {
  personalInfo: {
    age: 35,
    gender: 'Female',
    height: '5\'6"',
    weight: '140 lbs',
    bloodType: 'O+',
    emergencyContact: 'John Doe - (555) 123-4567'
  },
  
  currentMedications: [
    {
      name: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Once daily',
      startDate: '2023-01-15',
      prescribedBy: 'Dr. Smith'
    },
    {
      name: 'Metformin',
      dosage: '500mg',
      frequency: 'Twice daily',
      startDate: '2022-08-20',
      prescribedBy: 'Dr. Johnson'
    }
  ],
  
  medicalHistory: [
    {
      date: '2023-11-15',
      type: 'Diagnosis',
      description: 'Hypertension',
      provider: 'Dr. Smith',
      category: 'Cardiovascular'
    },
    {
      date: '2023-09-10',
      type: 'Procedure',
      description: 'Annual Physical Exam',
      provider: 'Dr. Smith',
      category: 'Preventive'
    },
    {
      date: '2023-06-22',
      type: 'Lab Result',
      description: 'Blood Panel - Normal',
      provider: 'LabCorp',
      category: 'Laboratory'
    },
    {
      date: '2022-12-05',
      type: 'Diagnosis',
      description: 'Type 2 Diabetes',
      provider: 'Dr. Johnson',
      category: 'Endocrine'
    }
  ],
  
  familyHistory: [
    {
      relation: 'Mother',
      condition: 'Diabetes Type 2',
      ageOfOnset: 55,
      status: 'Managed'
    },
    {
      relation: 'Father',
      condition: 'Hypertension',
      ageOfOnset: 48,
      status: 'Managed'
    },
    {
      relation: 'Maternal Grandmother',
      condition: 'Heart Disease',
      ageOfOnset: 72,
      status: 'Deceased'
    }
  ],
  
  riskFactors: [
    'Family history of diabetes',
    'Sedentary lifestyle',
    'Stress levels',
    'Age factor (35+)'
  ]
};

export const demoHealthMetrics = {
  vitalSigns: {
    heartRate: [72, 75, 68, 70, 73, 69, 71],
    bloodPressure: {
      systolic: [120, 118, 122, 119, 121, 117, 120],
      diastolic: [80, 78, 82, 79, 81, 77, 80]
    },
    temperature: [98.6, 98.4, 98.7, 98.5, 98.6, 98.3, 98.5],
    oxygenSaturation: [98, 99, 97, 98, 99, 98, 98]
  },
  
  trends: {
    weight: [140, 139, 141, 140, 138, 139, 140],
    bmi: [22.5, 22.3, 22.7, 22.5, 22.2, 22.3, 22.5],
    sleepHours: [7.5, 8, 6.5, 7, 8.5, 7, 7.5],
    stepsDaily: [8500, 9200, 7800, 8900, 10200, 8100, 8700]
  },
  
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  
  healthScore: {
    overall: 85,
    cardiovascular: 88,
    metabolic: 82,
    mental: 87,
    physical: 84
  },
  
  aiInsights: [
    {
      category: 'Cardiovascular Health',
      insight: 'Your heart rate variability shows good cardiovascular fitness. Continue regular exercise.',
      recommendation: 'Maintain current activity level of 150+ minutes moderate exercise per week.',
      priority: 'Medium'
    },
    {
      category: 'Sleep Quality',
      insight: 'Sleep patterns show some inconsistency. Aim for 7-9 hours nightly.',
      recommendation: 'Establish a consistent bedtime routine and limit screen time before bed.',
      priority: 'High'
    },
    {
      category: 'Physical Activity',
      insight: 'Daily step count is within healthy range but could be improved.',
      recommendation: 'Try to increase daily steps to 10,000+ for optimal health benefits.',
      priority: 'Low'
    }
  ]
};

export const demoSymptoms = [
  // Common symptoms with categories
  { name: 'Headache', category: 'Neurological', severity: 'Mild' },
  { name: 'Fatigue', category: 'General', severity: 'Moderate' },
  { name: 'Fever', category: 'General', severity: 'High' },
  { name: 'Cough', category: 'Respiratory', severity: 'Mild' },
  { name: 'Shortness of breath', category: 'Respiratory', severity: 'High' },
  { name: 'Chest pain', category: 'Cardiovascular', severity: 'High' },
  { name: 'Nausea', category: 'Gastrointestinal', severity: 'Moderate' },
  { name: 'Dizziness', category: 'Neurological', severity: 'Moderate' },
  { name: 'Joint pain', category: 'Musculoskeletal', severity: 'Mild' },
  { name: 'Skin rash', category: 'Dermatological', severity: 'Mild' },
  { name: 'Sore throat', category: 'Respiratory', severity: 'Mild' },
  { name: 'Abdominal pain', category: 'Gastrointestinal', severity: 'Moderate' },
  { name: 'Back pain', category: 'Musculoskeletal', severity: 'Moderate' },
  { name: 'Muscle weakness', category: 'Musculoskeletal', severity: 'Moderate' },
  { name: 'Vision problems', category: 'Neurological', severity: 'High' },
  { name: 'Hearing loss', category: 'Neurological', severity: 'High' },
  { name: 'Memory issues', category: 'Neurological', severity: 'High' },
  { name: 'Anxiety', category: 'Mental Health', severity: 'Moderate' },
  { name: 'Depression', category: 'Mental Health', severity: 'High' },
  { name: 'Insomnia', category: 'Sleep', severity: 'Moderate' }
];

export const demoDiagnosisResults = {
  predictions: [
    {
      diagnosis: 'Upper Respiratory Infection',
      probability: 0.85,
      confidence: 'High',
      description: 'Common viral infection affecting the upper respiratory tract including nose, throat, and sinuses.',
      icd10: 'J06.9'
    },
    {
      diagnosis: 'Seasonal Allergies',
      probability: 0.65,
      confidence: 'Medium',
      description: 'Allergic reaction to environmental allergens such as pollen, dust, or pet dander.',
      icd10: 'J30.9'
    },
    {
      diagnosis: 'Viral Syndrome',
      probability: 0.45,
      confidence: 'Low',
      description: 'General viral illness with systemic symptoms.',
      icd10: 'B34.9'
    }
  ],
  
  riskLevel: 'Low',
  analyzedSymptoms: ['Runny nose', 'Sore throat', 'Mild headache', 'Fatigue'],
  
  treatmentRecommendations: [
    {
      type: 'Self-Care',
      description: 'Rest, hydration, and over-the-counter symptom relief',
      priority: 'High',
      duration: '7-10 days'
    },
    {
      type: 'Medication',
      description: 'Decongestants and pain relievers as needed',
      priority: 'Medium',
      duration: 'As needed'
    },
    {
      type: 'Follow-up',
      description: 'See healthcare provider if symptoms worsen or persist beyond 10 days',
      priority: 'Low',
      duration: 'If needed'
    }
  ],
  
  emergencySigns: [
    'Difficulty breathing or shortness of breath',
    'High fever (>103°F/39.4°C)',
    'Severe headache with neck stiffness',
    'Chest pain or pressure',
    'Persistent vomiting'
  ],
  
  aiAnalysis: {
    confidence: 'High',
    modelVersion: 'HealthAI v2.1',
    processingTime: '1.2 seconds',
    dataPoints: 15,
    riskFactors: ['Age', 'Symptom combination', 'Duration'],
    recommendations: 'Monitor symptoms and seek care if worsening'
  }
};

// API endpoint configurations for demo
export const apiEndpoints = {
  base: process.env.NODE_ENV === 'production' 
    ? 'https://your-api-domain.com/api' 
    : 'http://localhost:5000/api',
  
  health: '/health',
  symptoms: '/symptoms',
  diagnose: '/diagnose',
  riskAssessment: '/risk-assessment',
  treatmentRecommendations: '/treatment-recommendations'
};

// Utility functions for demo
export const generateMockApiResponse = (endpoint, data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: data,
        timestamp: new Date().toISOString(),
        endpoint: endpoint
      });
    }, 1000 + Math.random() * 2000); // Simulate API delay
  });
};

export const formatHealthScore = (score) => {
  if (score >= 90) return { level: 'Excellent', color: '#4CAF50' };
  if (score >= 80) return { level: 'Good', color: '#8BC34A' };
  if (score >= 70) return { level: 'Fair', color: '#FFC107' };
  if (score >= 60) return { level: 'Poor', color: '#FF9800' };
  return { level: 'Critical', color: '#F44336' };
};
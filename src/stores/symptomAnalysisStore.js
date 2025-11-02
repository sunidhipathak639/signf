import { create } from 'zustand';

const useSymptomAnalysisStore = create((set, get) => ({
  // Analysis state
  analysisData: null,
  isAnalyzing: false,
  analysisError: null,
  analysisHistory: [],

  // Symptom data
  currentSymptoms: [],
  patientInfo: {
    age: null,
    gender: '',
    duration: '',
    severity: 1
  },

  // Actions
  setCurrentSymptoms: (symptoms) => set({ currentSymptoms: symptoms }),
  
  setPatientInfo: (info) => set((state) => ({
    patientInfo: { ...state.patientInfo, ...info }
  })),

  startAnalysis: () => set({ isAnalyzing: true, analysisError: null }),

  setAnalysisData: (data) => set((state) => ({
    analysisData: data,
    isAnalyzing: false,
    analysisError: null,
    analysisHistory: [
      {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        symptoms: state.currentSymptoms,
        patientInfo: state.patientInfo,
        results: data
      },
      ...state.analysisHistory.slice(0, 9) // Keep last 10 analyses
    ]
  })),

  setAnalysisError: (error) => set({
    analysisError: error,
    isAnalyzing: false
  }),

  clearAnalysis: () => set({
    analysisData: null,
    analysisError: null,
    isAnalyzing: false
  }),

  // Analysis function
  analyzeSymptoms: async () => {
    const { currentSymptoms, patientInfo, startAnalysis, setAnalysisData, setAnalysisError } = get();
    
    if (!currentSymptoms.length) {
      setAnalysisError('Please select at least one symptom');
      return;
    }

    startAnalysis();

    try {
      // Prepare symptom data for backend
      const symptomData = {
        symptoms: currentSymptoms,
        duration: patientInfo.duration,
        severity: patientInfo.severity,
        age: patientInfo.age,
        gender: patientInfo.gender,
        timestamp: new Date().toISOString()
      };

      // Call the backend API
      const response = await fetch('http://localhost:5000/api/diagnose', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(symptomData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const diagnosisData = await response.json();
      
      // Process and set the analysis data
      const processedData = {
        predictions: diagnosisData.predictions || [],
        risk_level: diagnosisData.risk_level || 'Unknown',
        analyzed_symptoms: diagnosisData.analyzed_symptoms || currentSymptoms,
        patient_factors: diagnosisData.patient_factors || [],
        timestamp: diagnosisData.timestamp,
        analysis_id: diagnosisData.analysis_id,
        status: 'success',
        confidence_score: diagnosisData.predictions?.[0]?.confidence || 0,
        recommendations: diagnosisData.recommendations || []
      };

      setAnalysisData(processedData);
    } catch (error) {
      console.error('Analysis error:', error);
      setAnalysisError(`Analysis failed: ${error.message}`);
    }
  },

  // Utility functions
  getAnalysisById: (id) => {
    const { analysisHistory } = get();
    return analysisHistory.find(analysis => analysis.id === id);
  },

  deleteAnalysisHistory: (id) => set((state) => ({
    analysisHistory: state.analysisHistory.filter(analysis => analysis.id !== id)
  })),

  clearAllHistory: () => set({ analysisHistory: [] })
}));

export default useSymptomAnalysisStore;
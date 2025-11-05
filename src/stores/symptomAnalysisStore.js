import { create } from 'zustand';

const useSymptomAnalysisStore = create((set, get) => ({
  analysisData: null,
  isAnalyzing: false,
  analysisError: null,
  analysisHistory: [],
  loading: false,
  error: null,
  currentSymptoms: [],
  patientInfo: {
    age: null,
    gender: '',
    duration: '',
    severity: 1
  },
  setCurrentSymptoms: (symptoms) => set({ currentSymptoms: symptoms }),
  setPatientInfo: (info) => set((state) => ({
    patientInfo: { ...state.patientInfo, ...info }
  })),
  startAnalysis: () => set({ isAnalyzing: true, loading: true, analysisError: null, error: null }),
  setAnalysisData: (data) => set((state) => ({
    analysisData: data,
    isAnalyzing: false,
    loading: false,
    analysisError: null,
    error: null,
    analysisHistory: [
      {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        symptoms: state.currentSymptoms,
        patientInfo: state.patientInfo,
        results: data
      },
      ...state.analysisHistory.slice(0, 9)
    ]
  })),
  setAnalysisError: (errorMessage) => set({
    analysisError: errorMessage,
    error: errorMessage,
    isAnalyzing: false,
    loading: false
  }),
  clearAnalysis: () => set({
    analysisData: null,
    analysisError: null,
    error: null,
    isAnalyzing: false,
    loading: false
  }),
  analyzeSymptoms: async (symptomDataArg) => {
    const { currentSymptoms, patientInfo, startAnalysis, setAnalysisData, setAnalysisError } = get();
    const sourceData = symptomDataArg && Array.isArray(symptomDataArg.symptoms) ? symptomDataArg : {
      symptoms: currentSymptoms,
      duration: patientInfo.duration,
      severity: patientInfo.severity,
      age: patientInfo.age,
      gender: patientInfo.gender,
      timestamp: new Date().toISOString()
    };
    if (!sourceData.symptoms || sourceData.symptoms.length === 0) {
      const msg = 'Please select at least one symptom';
      setAnalysisError(msg);
      throw new Error(msg);
    }
    startAnalysis();
    try {
      const response = await fetch('http://localhost:5000/api/diagnose', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(sourceData)
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const diagnosisData = await response.json();
      const processedData = {
        primaryDiagnosis: diagnosisData.predictions?.[0]
          ? {
              condition: diagnosisData.predictions[0].condition || diagnosisData.predictions[0].disease,
              confidence: diagnosisData.predictions[0].confidence || diagnosisData.predictions[0].probability || 0,
              severity: diagnosisData.predictions[0].severity || 'Moderate',
              description: diagnosisData.predictions[0].description || ''
            }
          : null,
        alternativeDiagnoses: (diagnosisData.predictions || []).slice(1).map((pred) => ({
          condition: pred.condition || pred.disease,
          confidence: pred.confidence || pred.probability || 0,
          severity: pred.severity || 'Moderate',
          description: pred.description || ''
        })),
        riskAssessment: diagnosisData.risk_assessment
          ? {
              level: diagnosisData.risk_assessment.level,
              score: diagnosisData.risk_assessment.score,
              description: diagnosisData.risk_assessment.description
            }
          : { level: diagnosisData.risk_level || 'Unknown' },
        analyzedSymptoms: diagnosisData.analyzed_symptoms || sourceData.symptoms,
        patientFactors: diagnosisData.patient_factors || [],
        timestamp: diagnosisData.timestamp,
        analysisId: diagnosisData.analysis_id,
        status: 'success',
        confidenceScore: diagnosisData.predictions?.[0]?.confidence || diagnosisData.predictions?.[0]?.probability || 0,
        recommendations: diagnosisData.recommendations || []
      };
      setAnalysisData(processedData);
      return processedData;
    } catch (error) {
      setAnalysisError(`Analysis failed: ${error.message}`);
      throw error;
    }
  },
  getAnalysisById: (id) => {
    const { analysisHistory } = get();
    return analysisHistory.find((analysis) => analysis.id === id);
  },
  deleteAnalysisHistory: (id) => set((state) => ({
    analysisHistory: state.analysisHistory.filter((analysis) => analysis.id !== id)
  })),
  clearAllHistory: () => set({ analysisHistory: [] })
}));

export default useSymptomAnalysisStore;
import numpy as np
import random
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class SimpleHealthDiagnosisML:
    def __init__(self):
        self.medical_knowledge = self._load_medical_knowledge()
        logger.info("Simple ML engine initialized successfully")
    
    def _load_medical_knowledge(self):
        """Load enhanced medical knowledge base with comprehensive symptom mapping"""
        return {
            'diseases': {
                'Common Cold': {
                    'symptoms': ['runny_nose', 'sneezing', 'cough', 'sore_throat', 'congestion', 'mild_headache', 'fatigue', 'low_grade_fever'],
                    'severity': 'Mild',
                    'confidence_base': 0.8,
                    'description': 'Viral upper respiratory infection with typical cold symptoms'
                },
                'Influenza (Flu)': {
                    'symptoms': ['fever', 'chills', 'body_aches', 'fatigue', 'headache', 'cough', 'sore_throat', 'muscle_pain', 'weakness'],
                    'severity': 'Moderate',
                    'confidence_base': 0.85,
                    'description': 'Viral infection affecting the respiratory system with systemic symptoms'
                },
                'Migraine': {
                    'symptoms': ['severe_headache', 'nausea', 'vomiting', 'sensitivity_to_light', 'sensitivity_to_sound', 'visual_disturbances', 'dizziness'],
                    'severity': 'Severe',
                    'confidence_base': 0.9,
                    'description': 'Neurological condition causing intense headaches with associated symptoms'
                },
                'Tension Headache': {
                    'symptoms': ['headache', 'neck_pain', 'shoulder_tension', 'mild_nausea', 'fatigue', 'irritability', 'concentration_problems'],
                    'severity': 'Mild',
                    'confidence_base': 0.75,
                    'description': 'Most common type of headache caused by muscle tension and stress'
                },
                'Gastroenteritis': {
                    'symptoms': ['nausea', 'vomiting', 'diarrhea', 'abdominal_pain', 'cramping', 'fever', 'dehydration', 'loss_of_appetite'],
                    'severity': 'Moderate',
                    'confidence_base': 0.8,
                    'description': 'Inflammation of the stomach and intestines, often called stomach flu'
                },
                'Allergic Reaction': {
                    'symptoms': ['rash', 'itching', 'hives', 'swelling', 'runny_nose', 'sneezing', 'watery_eyes', 'difficulty_breathing'],
                    'severity': 'Mild',
                    'confidence_base': 0.85,
                    'description': 'Immune system response to allergens causing various symptoms'
                },
                'Anxiety Disorder': {
                    'symptoms': ['anxiety', 'worry', 'restlessness', 'fatigue', 'concentration_problems', 'irritability', 'muscle_tension', 'sleep_problems', 'panic_attacks'],
                    'severity': 'Moderate',
                    'confidence_base': 0.8,
                    'description': 'Mental health condition characterized by excessive worry and physical symptoms'
                },
                'Depression': {
                    'symptoms': ['sadness', 'loss_of_interest', 'fatigue', 'sleep_problems', 'appetite_changes', 'concentration_problems', 'feelings_of_worthlessness', 'irritability'],
                    'severity': 'Moderate',
                    'confidence_base': 0.75,
                    'description': 'Mental health disorder affecting mood, thoughts, and daily functioning'
                },
                'Hypertension': {
                    'symptoms': ['headache', 'dizziness', 'shortness_of_breath', 'chest_pain', 'fatigue', 'blurred_vision', 'nosebleeds'],
                    'severity': 'Moderate',
                    'confidence_base': 0.7,
                    'description': 'High blood pressure that can lead to serious health complications'
                },
                'Asthma': {
                    'symptoms': ['wheezing', 'shortness_of_breath', 'chest_tightness', 'cough', 'difficulty_breathing', 'fatigue'],
                    'severity': 'Moderate',
                    'confidence_base': 0.9,
                    'description': 'Chronic respiratory condition causing airway inflammation and breathing difficulties'
                },
                'Bronchitis': {
                    'symptoms': ['persistent_cough', 'mucus_production', 'chest_discomfort', 'fatigue', 'shortness_of_breath', 'low_grade_fever'],
                    'severity': 'Moderate',
                    'confidence_base': 0.8,
                    'description': 'Inflammation of the bronchial tubes causing persistent cough and mucus'
                },
                'Pneumonia': {
                    'symptoms': ['fever', 'chills', 'cough', 'shortness_of_breath', 'chest_pain', 'fatigue', 'confusion', 'rapid_breathing'],
                    'severity': 'Severe',
                    'confidence_base': 0.85,
                    'description': 'Serious lung infection that can be life-threatening if untreated'
                },
                'Urinary Tract Infection': {
                    'symptoms': ['frequent_urination', 'burning_sensation', 'cloudy_urine', 'pelvic_pain', 'fever', 'strong_urine_odor', 'blood_in_urine'],
                    'severity': 'Moderate',
                    'confidence_base': 0.85,
                    'description': 'Bacterial infection affecting the urinary system'
                },
                'Acid Reflux (GERD)': {
                    'symptoms': ['heartburn', 'chest_pain', 'difficulty_swallowing', 'regurgitation', 'sour_taste', 'chronic_cough', 'hoarseness'],
                    'severity': 'Mild',
                    'confidence_base': 0.8,
                    'description': 'Condition where stomach acid flows back into the esophagus'
                },
                'Diabetes Type 2': {
                    'symptoms': ['increased_thirst', 'frequent_urination', 'fatigue', 'blurred_vision', 'slow_healing', 'weight_loss', 'increased_hunger'],
                    'severity': 'Moderate',
                    'confidence_base': 0.75,
                    'description': 'Metabolic disorder characterized by high blood sugar levels'
                },
                'Arthritis': {
                    'symptoms': ['joint_pain', 'stiffness', 'swelling', 'reduced_range_of_motion', 'fatigue', 'morning_stiffness'],
                    'severity': 'Moderate',
                    'confidence_base': 0.8,
                    'description': 'Inflammation of joints causing pain and reduced mobility'
                },
                'Fibromyalgia': {
                    'symptoms': ['widespread_pain', 'fatigue', 'sleep_problems', 'memory_problems', 'mood_issues', 'tender_points', 'muscle_stiffness'],
                    'severity': 'Moderate',
                    'confidence_base': 0.7,
                    'description': 'Chronic condition causing widespread musculoskeletal pain and fatigue'
                },
                'Sinusitis': {
                    'symptoms': ['facial_pain', 'nasal_congestion', 'thick_nasal_discharge', 'reduced_sense_of_smell', 'headache', 'fever', 'dental_pain'],
                    'severity': 'Moderate',
                    'confidence_base': 0.85,
                    'description': 'Inflammation of the sinuses causing facial pain and congestion'
                },
                'Thyroid Disorder': {
                    'symptoms': ['fatigue', 'weight_changes', 'mood_changes', 'hair_loss', 'cold_intolerance', 'dry_skin', 'memory_problems'],
                    'severity': 'Moderate',
                    'confidence_base': 0.7,
                    'description': 'Dysfunction of the thyroid gland affecting metabolism and energy'
                },
                'Sleep Apnea': {
                    'symptoms': ['loud_snoring', 'gasping_during_sleep', 'excessive_daytime_sleepiness', 'morning_headaches', 'difficulty_concentrating', 'irritability'],
                    'severity': 'Moderate',
                    'confidence_base': 0.8,
                    'description': 'Sleep disorder characterized by repeated breathing interruptions during sleep'
                }
            }
        }
    
    def predict_diagnosis(self, symptom_data, patient_info=None):
        """Enhanced diagnosis prediction based on rich symptom data and patient information
        
        Args:
            symptom_data: Can be either:
                - List of symptom strings (backward compatibility)
                - Dict with keys: symptoms, duration, severity, age, gender
            patient_info: Optional dict with patient demographic info
        """
        try:
            # Handle both old format (list) and new format (dict)
            if isinstance(symptom_data, list):
                # Old format - simple list of symptoms
                symptoms = symptom_data
                duration = None
                severity = 5  # Default medium severity
                age = patient_info.get('age', 30) if patient_info else 30
                gender = patient_info.get('gender', 'unknown') if patient_info else 'unknown'
            else:
                # New format - rich symptom data object
                symptoms = symptom_data.get('symptoms', [])
                duration = symptom_data.get('duration', None)
                severity = symptom_data.get('severity', 5)
                age = symptom_data.get('age', 30)
                gender = symptom_data.get('gender', 'unknown')
                
                # Override with patient_info if provided
                if patient_info:
                    age = patient_info.get('age', age)
                    gender = patient_info.get('gender', gender)
            
            if not symptoms:
                return {
                    'predictions': [],
                    'risk_level': 'Unknown',
                    'analyzed_symptoms': [],
                    'patient_factors': [],
                    'timestamp': datetime.now().isoformat(),
                    'analysis_id': f"analysis_{random.randint(1000, 9999)}",
                    'status': 'success'
                }
            
            # Normalize symptoms
            normalized_symptoms = [symptom.lower().replace(' ', '_') for symptom in symptoms]
            
            # Calculate matches for each disease
            disease_scores = []
            
            for disease, info in self.medical_knowledge['diseases'].items():
                disease_symptoms = info['symptoms']
                
                # Calculate match score
                matches = sum(1 for symptom in normalized_symptoms if symptom in disease_symptoms)
                total_disease_symptoms = len(disease_symptoms)
                
                if matches > 0:
                    # Calculate confidence based on matches and base confidence
                    match_ratio = matches / max(len(normalized_symptoms), total_disease_symptoms)
                    confidence = info['confidence_base'] * match_ratio
                    
                    # Enhance confidence based on severity and duration
                    severity_multiplier = self._get_severity_multiplier(severity, info['severity'])
                    duration_multiplier = self._get_duration_multiplier(duration, disease)
                    age_multiplier = self._get_age_multiplier(age, disease)
                    
                    # Apply multipliers
                    confidence *= severity_multiplier * duration_multiplier * age_multiplier
                    
                    # Add some randomness to make it more realistic
                    confidence += random.uniform(-0.05, 0.1)
                    confidence = max(0.1, min(0.95, confidence))  # Keep between 0.1 and 0.95
                    
                    disease_scores.append({
                        'condition': disease,
                        'confidence': round(confidence, 3),
                        'severity': info['severity'],
                        'matching_symptoms': [s for s in normalized_symptoms if s in disease_symptoms],
                        'symptom_match_rate': round(matches / total_disease_symptoms, 3),
                        'total_symptoms': total_disease_symptoms,
                        'matched_symptoms_count': matches
                    })
            
            # Sort by confidence
            disease_scores.sort(key=lambda x: x['confidence'], reverse=True)
            
            # Prepare response
            predictions = disease_scores[:5]  # Top 5 predictions
            
            # Enhanced risk level calculation
            risk_level = self._calculate_risk_level(predictions, severity, age, duration)
            
            # Enhanced patient factors analysis
            patient_factors = self._analyze_patient_factors({
                'age': age,
                'gender': gender,
                'severity': severity,
                'duration': duration
            })
            
            return {
                'predictions': predictions,
                'risk_level': risk_level,
                'analyzed_symptoms': symptoms,
                'patient_factors': patient_factors,
                'symptom_analysis': {
                    'total_symptoms': len(symptoms),
                    'severity_score': severity,
                    'duration': duration,
                    'age_factor': age,
                    'gender_factor': gender
                },
                'timestamp': datetime.now().isoformat(),
                'analysis_id': f"analysis_{random.randint(1000, 9999)}",
                'status': 'success'
            }
            
        except Exception as e:
            logger.error(f"Prediction error: {str(e)}")
            return {
                'error': str(e),
                'status': 'error',
                'predictions': [],
                'risk_level': 'Unknown',
                'analyzed_symptoms': symptoms if 'symptoms' in locals() else [],
                'patient_factors': []
            }
    
    def _analyze_patient_factors(self, patient_info):
        """Enhanced analysis of patient demographic and symptom factors"""
        factors = []
        
        age = patient_info.get('age', 30)
        gender = patient_info.get('gender', 'unknown')
        severity = patient_info.get('severity', 5)
        duration = patient_info.get('duration', None)
        
        # Age-based factors
        if age < 18:
            factors.append('Pediatric patient - consider age-appropriate conditions')
        elif age > 65:
            factors.append('Elderly patient - higher risk for chronic conditions')
        elif age > 40:
            factors.append('Middle-aged patient - monitor for lifestyle-related conditions')
        
        # Gender-based factors
        if gender == 'female':
            factors.append('Female patient - consider gender-specific conditions')
        elif gender == 'male':
            factors.append('Male patient - consider gender-specific conditions')
        
        # Severity-based factors
        if severity >= 8:
            factors.append('High severity symptoms - consider urgent medical attention')
        elif severity >= 6:
            factors.append('Moderate severity symptoms - monitor closely')
        elif severity <= 3:
            factors.append('Mild symptoms - may resolve with rest and care')
        
        # Duration-based factors
        if duration:
            if duration >= 14:
                factors.append('Chronic symptoms (>2 weeks) - consider underlying conditions')
            elif duration >= 7:
                factors.append('Persistent symptoms (>1 week) - monitor progression')
            elif duration <= 2:
                factors.append('Acute onset - consider immediate causes')
        
        return factors
    
    def _get_severity_multiplier(self, symptom_severity, disease_severity):
        """Calculate multiplier based on symptom severity matching disease severity"""
        severity_map = {'Mild': 3, 'Moderate': 6, 'Severe': 9}
        disease_level = severity_map.get(disease_severity, 5)
        
        # Higher match if symptom severity aligns with typical disease severity
        diff = abs(symptom_severity - disease_level)
        if diff <= 1:
            return 1.2
        elif diff <= 3:
            return 1.0
        else:
            return 0.8
    
    def _get_duration_multiplier(self, duration, disease_name):
        """Calculate multiplier based on symptom duration"""
        if duration is None:
            return 1.0
        
        # Acute conditions are more likely with short duration
        acute_conditions = ['Common Cold', 'Flu', 'Gastroenteritis', 'Allergic Reaction']
        chronic_conditions = ['Hypertension', 'Anxiety']
        
        if disease_name in acute_conditions:
            return 1.3 if duration <= 7 else 0.7
        elif disease_name in chronic_conditions:
            return 1.3 if duration >= 14 else 0.8
        else:
            return 1.0
    
    def _get_age_multiplier(self, age, disease_name):
        """Calculate multiplier based on age-disease correlation"""
        # Age-related disease likelihood
        if disease_name == 'Hypertension' and age > 40:
            return 1.2
        elif disease_name == 'Common Cold' and age < 65:
            return 1.1
        elif disease_name == 'Anxiety' and 20 <= age <= 50:
            return 1.1
        else:
            return 1.0
    
    def _calculate_risk_level(self, predictions, severity, age, duration):
        """Enhanced risk level calculation based on multiple factors"""
        if not predictions:
            return 'Low'
        
        top_confidence = predictions[0]['confidence']
        base_risk = 'Low'
        
        if top_confidence > 0.8:
            base_risk = 'High'
        elif top_confidence > 0.6:
            base_risk = 'Moderate'
        
        # Escalate risk based on other factors
        risk_factors = 0
        
        if severity >= 8:
            risk_factors += 2
        elif severity >= 6:
            risk_factors += 1
        
        if age > 65 or age < 5:
            risk_factors += 1
        
        if duration and duration >= 14:
            risk_factors += 1
        
        # Adjust risk level
        if risk_factors >= 3:
            return 'High'
        elif risk_factors >= 2 and base_risk != 'Low':
            return 'High'
        elif risk_factors >= 1 and base_risk == 'Low':
            return 'Moderate'
        
        return base_risk

# Create global instance
simple_ml_engine = SimpleHealthDiagnosisML()
import numpy as np
import pandas as pd
import tensorflow as tf
from sklearn.preprocessing import LabelEncoder, StandardScaler, MultiLabelBinarizer
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import joblib
import json
import logging
from datetime import datetime
import warnings
warnings.filterwarnings('ignore')

logger = logging.getLogger(__name__)

class AdvancedHealthDiagnosisML:
    """Advanced ML system for health diagnosis with multiple models and ensemble methods"""
    
    def __init__(self):
        self.models = {}
        self.encoders = {}
        self.scalers = {}
        self.medical_knowledge = self._load_medical_knowledge()
        self.symptom_embeddings = {}
        self.initialize_models()
    
    def _load_medical_knowledge(self):
        """Load comprehensive medical knowledge base"""
        return {
            'diseases': {
                'Common Cold': {
                    'symptoms': ['runny_nose', 'sneezing', 'sore_throat', 'mild_fever', 'cough'],
                    'severity': 'mild',
                    'duration': '7-10 days',
                    'treatment': ['rest', 'fluids', 'decongestants'],
                    'complications': ['sinusitis', 'ear_infection']
                },
                'Influenza': {
                    'symptoms': ['high_fever', 'body_aches', 'fatigue', 'headache', 'cough'],
                    'severity': 'moderate',
                    'duration': '1-2 weeks',
                    'treatment': ['antivirals', 'rest', 'fluids', 'fever_reducers'],
                    'complications': ['pneumonia', 'bronchitis']
                },
                'Migraine': {
                    'symptoms': ['severe_headache', 'nausea', 'light_sensitivity', 'sound_sensitivity'],
                    'severity': 'moderate_to_severe',
                    'duration': '4-72 hours',
                    'treatment': ['triptans', 'nsaids', 'rest_in_dark_room'],
                    'complications': ['medication_overuse_headache']
                },
                'Hypertension': {
                    'symptoms': ['headache', 'dizziness', 'chest_pain', 'shortness_of_breath'],
                    'severity': 'varies',
                    'duration': 'chronic',
                    'treatment': ['ace_inhibitors', 'lifestyle_changes', 'diet_modification'],
                    'complications': ['heart_disease', 'stroke', 'kidney_disease']
                },
                'Diabetes Type 2': {
                    'symptoms': ['increased_thirst', 'frequent_urination', 'fatigue', 'blurred_vision'],
                    'severity': 'chronic',
                    'duration': 'lifelong',
                    'treatment': ['metformin', 'lifestyle_changes', 'blood_sugar_monitoring'],
                    'complications': ['neuropathy', 'retinopathy', 'nephropathy']
                },
                'Anxiety Disorder': {
                    'symptoms': ['excessive_worry', 'restlessness', 'fatigue', 'difficulty_concentrating'],
                    'severity': 'varies',
                    'duration': 'chronic_if_untreated',
                    'treatment': ['therapy', 'ssris', 'lifestyle_changes'],
                    'complications': ['depression', 'substance_abuse']
                },
                'Pneumonia': {
                    'symptoms': ['fever', 'cough_with_phlegm', 'chest_pain', 'shortness_of_breath'],
                    'severity': 'moderate_to_severe',
                    'duration': '1-3 weeks',
                    'treatment': ['antibiotics', 'rest', 'fluids', 'oxygen_therapy'],
                    'complications': ['respiratory_failure', 'sepsis']
                },
                'Gastroenteritis': {
                    'symptoms': ['nausea', 'vomiting', 'diarrhea', 'abdominal_cramps'],
                    'severity': 'mild_to_moderate',
                    'duration': '1-3 days',
                    'treatment': ['fluids', 'electrolytes', 'bland_diet'],
                    'complications': ['dehydration', 'electrolyte_imbalance']
                }
            },
            'symptom_categories': {
                'respiratory': ['cough', 'shortness_of_breath', 'chest_pain', 'wheezing'],
                'gastrointestinal': ['nausea', 'vomiting', 'diarrhea', 'abdominal_pain'],
                'neurological': ['headache', 'dizziness', 'confusion', 'memory_loss'],
                'cardiovascular': ['chest_pain', 'palpitations', 'shortness_of_breath'],
                'musculoskeletal': ['joint_pain', 'muscle_pain', 'stiffness', 'weakness'],
                'dermatological': ['rash', 'itching', 'swelling', 'discoloration'],
                'psychological': ['anxiety', 'depression', 'mood_changes', 'sleep_disturbances']
            },
            'risk_factors': {
                'age_related': {
                    'pediatric': ['0-17', ['developmental_disorders', 'infectious_diseases']],
                    'adult': ['18-64', ['lifestyle_diseases', 'occupational_hazards']],
                    'elderly': ['65+', ['chronic_diseases', 'medication_interactions']]
                },
                'gender_specific': {
                    'male': ['cardiovascular_disease', 'prostate_issues'],
                    'female': ['reproductive_health', 'osteoporosis', 'autoimmune_disorders']
                },
                'lifestyle': ['smoking', 'alcohol', 'sedentary', 'poor_diet', 'stress']
            }
        }
    
    def initialize_models(self):
        """Initialize multiple ML models for ensemble prediction"""
        logger.info("Initializing advanced ML models...")
        
        # Generate synthetic training data
        X_train, y_train, symptom_names = self._generate_training_data()
        
        # Initialize encoders and scalers
        self.encoders['symptoms'] = MultiLabelBinarizer()
        self.scalers['features'] = StandardScaler()
        
        # Prepare features
        X_encoded = self.encoders['symptoms'].fit_transform(X_train)
        X_scaled = self.scalers['features'].fit_transform(X_encoded)
        
        # Initialize multiple models
        self.models['random_forest'] = RandomForestClassifier(
            n_estimators=200, 
            max_depth=15, 
            random_state=42,
            class_weight='balanced'
        )
        
        self.models['gradient_boosting'] = GradientBoostingClassifier(
            n_estimators=100,
            learning_rate=0.1,
            max_depth=6,
            random_state=42
        )
        
        # Train models
        for name, model in self.models.items():
            model.fit(X_scaled, y_train)
            logger.info(f"Trained {name} model")
        
        # Initialize neural network
        self._initialize_neural_network(X_scaled.shape[1], len(set(y_train)))
        
        self.symptom_names = symptom_names
        logger.info("All models initialized successfully")
    
    def _generate_training_data(self):
        """Generate comprehensive synthetic training data"""
        np.random.seed(42)
        
        diseases = list(self.medical_knowledge['diseases'].keys())
        all_symptoms = set()
        
        # Collect all symptoms
        for disease_info in self.medical_knowledge['diseases'].values():
            all_symptoms.update(disease_info['symptoms'])
        
        symptom_names = list(all_symptoms)
        n_samples = 5000
        
        X_train = []
        y_train = []
        
        for _ in range(n_samples):
            # Select a random disease
            disease = np.random.choice(diseases)
            disease_info = self.medical_knowledge['diseases'][disease]
            
            # Generate symptoms for this disease
            primary_symptoms = disease_info['symptoms']
            
            # Add primary symptoms with high probability
            patient_symptoms = []
            for symptom in primary_symptoms:
                if np.random.random() > 0.2:  # 80% chance of having primary symptoms
                    patient_symptoms.append(symptom)
            
            # Add some random symptoms with low probability
            other_symptoms = [s for s in symptom_names if s not in primary_symptoms]
            for symptom in np.random.choice(other_symptoms, size=min(3, len(other_symptoms)), replace=False):
                if np.random.random() > 0.9:  # 10% chance of having unrelated symptoms
                    patient_symptoms.append(symptom)
            
            X_train.append(patient_symptoms)
            y_train.append(disease)
        
        return X_train, y_train, symptom_names
    
    def _initialize_neural_network(self, input_dim, output_dim):
        """Initialize TensorFlow neural network"""
        self.models['neural_network'] = tf.keras.Sequential([
            tf.keras.layers.Dense(256, activation='relu', input_shape=(input_dim,)),
            tf.keras.layers.Dropout(0.3),
            tf.keras.layers.Dense(128, activation='relu'),
            tf.keras.layers.Dropout(0.2),
            tf.keras.layers.Dense(64, activation='relu'),
            tf.keras.layers.Dense(output_dim, activation='softmax')
        ])
        
        self.models['neural_network'].compile(
            optimizer='adam',
            loss='sparse_categorical_crossentropy',
            metrics=['accuracy']
        )
        
        # Create dummy training for the neural network
        X_dummy = np.random.random((1000, input_dim))
        y_dummy = np.random.randint(0, output_dim, 1000)
        
        self.models['neural_network'].fit(
            X_dummy, y_dummy,
            epochs=50,
            batch_size=32,
            verbose=0
        )
    
    def predict_diagnosis(self, symptoms, patient_info):
        """Advanced diagnosis prediction using ensemble methods"""
        try:
            # Prepare input features
            symptom_vector_2d = self._prepare_symptom_vector(symptoms)
            symptom_vector_1d = symptom_vector_2d[0]  # Extract 1D version for traditional ML models
            
            # Get predictions from all models
            predictions = {}
            
            # Traditional ML models (need 1D array)
            for name, model in self.models.items():
                if name != 'neural_network':
                    if hasattr(model, 'predict_proba'):
                        probs = model.predict_proba([symptom_vector_1d])[0]
                        predictions[name] = {
                            'probabilities': probs,
                            'classes': model.classes_
                        }
            
            # Neural network prediction (needs 2D array)
            if 'neural_network' in self.models:
                nn_probs = self.models['neural_network'].predict(symptom_vector_2d, verbose=0)[0]
                predictions['neural_network'] = {
                    'probabilities': nn_probs,
                    'classes': list(self.medical_knowledge['diseases'].keys())
                }
            
            # Ensemble prediction
            ensemble_result = self._ensemble_predictions(predictions)
            
            # Risk assessment
            risk_assessment = self._assess_risk(symptoms, patient_info)
            
            # Treatment recommendations
            treatment_recommendations = self._get_treatment_recommendations(
                ensemble_result['top_diagnoses']
            )
            
            return {
                'ensemble_predictions': ensemble_result,
                'individual_model_predictions': predictions,
                'risk_assessment': risk_assessment,
                'treatment_recommendations': treatment_recommendations,
                'confidence_score': ensemble_result['confidence'],
                'analyzed_symptoms': symptoms,
                'patient_factors': self._analyze_patient_factors(patient_info)
            }
            
        except Exception as e:
            logger.error(f"Error in advanced diagnosis prediction: {str(e)}")
            raise
    
    def _prepare_symptom_vector(self, symptoms):
        """Convert symptoms to feature vector"""
        # Convert symptoms to the format expected by the model
        symptom_list = [symptom.lower().replace(' ', '_') for symptom in symptoms]
        
        # Create binary vector
        symptom_vector = np.zeros(len(self.symptom_names))
        for i, symptom in enumerate(self.symptom_names):
            if symptom in symptom_list:
                symptom_vector[i] = 1
        
        # Scale the vector and keep it as 2D array for neural network compatibility
        symptom_vector_2d = self.scalers['features'].transform([symptom_vector])
        
        return symptom_vector_2d
    
    def _ensemble_predictions(self, predictions):
        """Combine predictions from multiple models using ensemble methods"""
        if not predictions:
            return {'top_diagnoses': [], 'confidence': 0}
        
        # Weighted ensemble (you can adjust weights based on model performance)
        model_weights = {
            'random_forest': 0.4,
            'gradient_boosting': 0.3,
            'neural_network': 0.3
        }
        
        # Get all unique classes
        all_classes = set()
        for pred in predictions.values():
            all_classes.update(pred['classes'])
        all_classes = list(all_classes)
        
        # Calculate weighted average probabilities
        ensemble_probs = np.zeros(len(all_classes))
        total_weight = 0
        
        for model_name, pred in predictions.items():
            if model_name in model_weights:
                weight = model_weights[model_name]
                total_weight += weight
                
                for i, class_name in enumerate(all_classes):
                    if class_name in pred['classes']:
                        class_idx = list(pred['classes']).index(class_name)
                        ensemble_probs[i] += weight * pred['probabilities'][class_idx]
        
        # Normalize probabilities
        if total_weight > 0:
            ensemble_probs /= total_weight
        
        # Get top 3 diagnoses
        top_indices = np.argsort(ensemble_probs)[-3:][::-1]
        top_diagnoses = []
        
        for idx in top_indices:
            if ensemble_probs[idx] > 0.01:  # Only include if probability > 1%
                diagnosis = all_classes[idx]
                probability = ensemble_probs[idx]
                
                top_diagnoses.append({
                    'diagnosis': diagnosis,
                    'probability': float(probability),
                    'confidence': self._get_confidence_level(probability),
                    'medical_info': self.medical_knowledge['diseases'].get(diagnosis, {})
                })
        
        # Calculate overall confidence
        max_prob = max(ensemble_probs) if len(ensemble_probs) > 0 else 0
        confidence = min(max_prob * 100, 95)  # Cap at 95%
        
        return {
            'top_diagnoses': top_diagnoses,
            'confidence': float(confidence),
            'ensemble_probabilities': ensemble_probs.tolist(),
            'class_names': all_classes
        }
    
    def _get_confidence_level(self, probability):
        """Convert probability to confidence level"""
        if probability > 0.7:
            return 'High'
        elif probability > 0.4:
            return 'Medium'
        else:
            return 'Low'
    
    def _assess_risk(self, symptoms, patient_info):
        """Comprehensive risk assessment"""
        risk_factors = {
            'immediate_risk': 'Low',
            'chronic_risk': 'Low',
            'complications_risk': 'Low',
            'factors': []
        }
        
        age = patient_info.get('age', 0)
        gender = patient_info.get('gender', '').lower()
        medical_history = patient_info.get('medical_history', [])
        
        # Age-based risk
        if age > 65:
            risk_factors['chronic_risk'] = 'Medium'
            risk_factors['factors'].append('Advanced age increases chronic disease risk')
        
        # Symptom-based immediate risk
        high_risk_symptoms = [
            'chest_pain', 'severe_headache', 'difficulty_breathing',
            'high_fever', 'severe_abdominal_pain', 'confusion'
        ]
        
        symptom_text = ' '.join(symptoms).lower()
        for risk_symptom in high_risk_symptoms:
            if risk_symptom.replace('_', ' ') in symptom_text:
                risk_factors['immediate_risk'] = 'High'
                risk_factors['factors'].append(f'Presence of {risk_symptom.replace("_", " ")} requires immediate attention')
                break
        
        # Medical history risk
        high_risk_conditions = ['diabetes', 'hypertension', 'heart_disease', 'cancer']
        for condition in medical_history:
            if any(risk_cond in condition.lower() for risk_cond in high_risk_conditions):
                risk_factors['complications_risk'] = 'Medium'
                risk_factors['factors'].append(f'History of {condition} increases complication risk')
        
        return risk_factors
    
    def _get_treatment_recommendations(self, top_diagnoses):
        """Generate treatment recommendations based on diagnoses"""
        recommendations = {
            'immediate_care': [],
            'medications': [],
            'lifestyle_changes': [],
            'follow_up': []
        }
        
        for diagnosis_info in top_diagnoses:
            diagnosis = diagnosis_info['diagnosis']
            medical_info = diagnosis_info.get('medical_info', {})
            
            treatments = medical_info.get('treatment', [])
            
            for treatment in treatments:
                if any(keyword in treatment for keyword in ['emergency', 'immediate', 'urgent']):
                    recommendations['immediate_care'].append(treatment)
                elif any(keyword in treatment for keyword in ['medication', 'drug', 'antibiotic']):
                    recommendations['medications'].append(treatment)
                elif any(keyword in treatment for keyword in ['lifestyle', 'diet', 'exercise']):
                    recommendations['lifestyle_changes'].append(treatment)
                else:
                    recommendations['follow_up'].append(treatment)
        
        # Remove duplicates
        for key in recommendations:
            recommendations[key] = list(set(recommendations[key]))
        
        # Add general recommendations
        recommendations['follow_up'].append('Consult with healthcare provider for proper diagnosis')
        recommendations['lifestyle_changes'].extend(['Adequate rest', 'Stay hydrated', 'Monitor symptoms'])
        
        return recommendations
    
    def _analyze_patient_factors(self, patient_info):
        """Analyze patient-specific factors"""
        factors = []
        
        age = patient_info.get('age', 0)
        gender = patient_info.get('gender', '').lower()
        
        # Age factors
        if age < 18:
            factors.append('Pediatric considerations apply - dosing and treatment may differ')
        elif age > 65:
            factors.append('Elderly patient - increased risk of complications and drug interactions')
        
        # Gender factors
        if gender == 'female':
            factors.append('Consider pregnancy status and hormonal factors')
        elif gender == 'male':
            factors.append('Consider male-specific health risks')
        
        return factors
    
    def get_symptom_insights(self, symptoms):
        """Get detailed insights about symptoms"""
        insights = []
        
        for symptom in symptoms:
            symptom_key = symptom.lower().replace(' ', '_')
            
            # Find which category this symptom belongs to
            for category, category_symptoms in self.medical_knowledge['symptom_categories'].items():
                if symptom_key in category_symptoms:
                    insights.append({
                        'symptom': symptom,
                        'category': category,
                        'related_systems': self._get_related_systems(category),
                        'urgency_level': self._assess_symptom_urgency(symptom_key)
                    })
                    break
        
        return insights
    
    def _get_related_systems(self, category):
        """Get body systems related to symptom category"""
        system_mapping = {
            'respiratory': ['Lungs', 'Airways', 'Chest'],
            'gastrointestinal': ['Stomach', 'Intestines', 'Liver'],
            'neurological': ['Brain', 'Nervous System', 'Spinal Cord'],
            'cardiovascular': ['Heart', 'Blood Vessels', 'Circulation'],
            'musculoskeletal': ['Muscles', 'Bones', 'Joints'],
            'dermatological': ['Skin', 'Hair', 'Nails'],
            'psychological': ['Mental Health', 'Cognitive Function']
        }
        return system_mapping.get(category, ['General'])
    
    def _assess_symptom_urgency(self, symptom):
        """Assess urgency level of individual symptoms"""
        urgent_symptoms = [
            'chest_pain', 'difficulty_breathing', 'severe_headache',
            'high_fever', 'confusion', 'severe_abdominal_pain'
        ]
        
        moderate_symptoms = [
            'persistent_cough', 'moderate_fever', 'dizziness',
            'nausea', 'fatigue', 'joint_pain'
        ]
        
        if symptom in urgent_symptoms:
            return 'High'
        elif symptom in moderate_symptoms:
            return 'Medium'
        else:
            return 'Low'

# Global instance
advanced_ml_engine = AdvancedHealthDiagnosisML()
from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pandas as pd
from datetime import datetime
import logging
import os
from werkzeug.exceptions import BadRequest
from simple_ml import simple_ml_engine
import warnings
warnings.filterwarnings('ignore')

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize ML engine
try:
    logger.info("Simple ML engine initialized successfully")
    ml_engine = simple_ml_engine
except Exception as e:
    logger.error(f"Failed to initialize ML engine: {str(e)}")
    ml_engine = None

# Medical knowledge base
MEDICAL_KNOWLEDGE = {
    'symptoms': {
        'headache': {
            'common_causes': ['Tension', 'Migraine', 'Dehydration', 'Stress'],
            'red_flags': ['Sudden severe headache', 'Headache with fever', 'Vision changes'],
            'self_care': ['Rest', 'Hydration', 'Over-the-counter pain relief']
        },
        'fever': {
            'common_causes': ['Infection', 'Inflammation', 'Heat exhaustion'],
            'red_flags': ['High fever >103°F', 'Persistent fever', 'Difficulty breathing'],
            'self_care': ['Rest', 'Fluids', 'Fever reducers', 'Cool compress']
        },
        'chest_pain': {
            'common_causes': ['Muscle strain', 'Acid reflux', 'Anxiety'],
            'red_flags': ['Severe crushing pain', 'Pain radiating to arm', 'Shortness of breath'],
            'self_care': ['Seek immediate medical attention for severe symptoms']
        }
    },
    'treatments': {
        'Common Cold': {
            'medications': ['Decongestants', 'Pain relievers', 'Cough suppressants'],
            'lifestyle': ['Rest', 'Fluids', 'Humidifier', 'Saltwater gargle'],
            'duration': '7-10 days'
        },
        'Migraine': {
            'medications': ['Triptans', 'NSAIDs', 'Anti-nausea medications'],
            'lifestyle': ['Dark quiet room', 'Cold compress', 'Regular sleep schedule'],
            'duration': '4-72 hours'
        },
        'Hypertension': {
            'medications': ['ACE inhibitors', 'Diuretics', 'Beta blockers'],
            'lifestyle': ['Low sodium diet', 'Regular exercise', 'Weight management'],
            'duration': 'Chronic condition requiring ongoing management'
        }
    }
}

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'version': '1.0.0'
    })

@app.route('/api/symptoms', methods=['GET'])
def get_symptoms():
    """Get list of available symptoms"""
    symptoms_by_category = {
        'General': ['Fever', 'Fatigue', 'Weakness', 'Weight Loss', 'Weight Gain'],
        'Head & Neck': ['Headache', 'Dizziness', 'Sore Throat', 'Runny Nose', 'Vision Problems'],
        'Respiratory': ['Cough', 'Shortness of Breath', 'Chest Pain', 'Wheezing'],
        'Gastrointestinal': ['Nausea', 'Vomiting', 'Diarrhea', 'Constipation', 'Abdominal Pain'],
        'Musculoskeletal': ['Joint Pain', 'Muscle Pain', 'Back Pain', 'Stiffness'],
        'Neurological': ['Memory Loss', 'Confusion', 'Numbness', 'Tingling'],
        'Skin': ['Rash', 'Itching', 'Swelling', 'Bruising'],
        'Psychological': ['Anxiety', 'Depression', 'Insomnia', 'Mood Changes']
    }
    
    return jsonify({
        'symptoms_by_category': symptoms_by_category,
        'total_symptoms': sum(len(symptoms) for symptoms in symptoms_by_category.values())
    })

@app.route('/api/diagnose', methods=['POST'])
def diagnose():
    """Analyze symptoms and provide diagnosis suggestions with enhanced data handling"""
    try:
        data = request.get_json()
        
        if not data:
            raise BadRequest("No data provided")
        
        # Debug logging to understand the incoming data format
        logger.info(f"Received data keys: {list(data.keys())}")
        logger.info(f"Data structure: {type(data)}")
        
        # Handle both old format (just symptoms) and new format (rich symptom data)
        if 'symptoms' in data:
            symptoms = data.get('symptoms', [])
            
            # Check if symptoms is a list
            if not isinstance(symptoms, list):
                raise BadRequest("Symptoms must be a list")
            
            # Check if this is the new rich format from SymptomChecker
            if any(key in data for key in ['duration', 'severity', 'age', 'gender']):
                # New rich format - pass entire data object
                symptom_data = data
                patient_info = data.get('patient_info', {})
                logger.info("Using rich symptom data format")
            else:
                # Old simple format - just symptoms list
                symptom_data = symptoms
                patient_info = data.get('patient_info', {})
                logger.info("Using simple symptom data format")
        else:
            raise BadRequest("Invalid data format - symptoms required")
        
        if not symptoms:
            raise BadRequest("No symptoms provided")
        
        logger.info(f"Processing diagnosis request with {len(symptoms)} symptoms: {symptoms}")
        logger.info(f"Symptom data type: {'rich' if isinstance(symptom_data, dict) else 'simple'}")
        
        # Use ML engine for diagnosis
        if ml_engine:
            result = ml_engine.predict_diagnosis(symptom_data, patient_info)
            
            # Ensure we have the required fields for frontend
            if 'status' not in result:
                result['status'] = 'success'
            
            # Add enhanced metadata
            if 'analysis_id' not in result:
                result['analysis_id'] = f"DIAG_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
            
            if 'timestamp' not in result:
                result['timestamp'] = datetime.now().isoformat()
                
        else:
            # Enhanced fallback diagnosis
            result = {
                'predictions': [
                    {
                        'condition': 'General Health Assessment Needed',
                        'confidence': 0.75,
                        'severity': 'Moderate',
                        'matching_symptoms': symptoms[:3],  # Show first 3 symptoms
                        'description': 'Based on reported symptoms, a comprehensive health evaluation is recommended.',
                        'symptom_match_rate': 0.8,
                        'total_symptoms': len(symptoms),
                        'matched_symptoms_count': min(3, len(symptoms))
                    }
                ],
                'risk_level': 'Moderate',
                'analyzed_symptoms': symptoms,
                'patient_factors': [
                    'Multiple symptoms reported - comprehensive evaluation recommended',
                    'Consider consulting healthcare provider for proper diagnosis'
                ],
                'symptom_analysis': {
                    'total_symptoms': len(symptoms),
                    'severity_score': data.get('severity', 5),
                    'duration': data.get('duration', 'Unknown'),
                    'age_factor': data.get('age', 'Unknown'),
                    'gender_factor': data.get('gender', 'Unknown')
                },
                'status': 'success',
                'timestamp': datetime.now().isoformat(),
                'analysis_id': f"DIAG_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
            }
        
        logger.info(f"Diagnosis completed successfully - {len(result.get('predictions', []))} predictions generated")
        return jsonify(result)
        
    except BadRequest as e:
        logger.warning(f"Bad request in diagnose: {str(e)}")
        return jsonify({'error': str(e), 'status': 'error'}), 400
    except Exception as e:
        logger.error(f"Error in diagnose endpoint: {str(e)}")
        return jsonify({
            'error': 'Internal server error', 
            'status': 'error',
            'predictions': [],
            'risk_level': 'Unknown'
        }), 500

@app.route('/api/risk-assessment', methods=['POST'])
def risk_assessment():
    """Assess health risks based on patient data"""
    try:
        data = request.get_json()
        
        if not data:
            raise BadRequest("No data provided")
        
        patient_info = data.get('patient_info', {})
        symptoms = data.get('symptoms', [])
        medical_history = data.get('medical_history', [])
        
        # Use ML engine for risk assessment
        if ml_engine:
            result = ml_engine.assess_risk(patient_info, symptoms, medical_history)
        else:
            # Fallback risk assessment
            result = {
                'overall_risk': 'Medium',
                'risk_factors': ['Age-related factors', 'Symptom-based assessment'],
                'recommendations': ['Regular health checkups', 'Lifestyle modifications'],
                'risk_score': 0.6
            }
        
        result['timestamp'] = datetime.now().isoformat()
        result['assessment_id'] = f"RISK_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        logger.info("Risk assessment completed")
        return jsonify(result)
        
    except BadRequest as e:
        logger.warning(f"Bad request in risk assessment: {str(e)}")
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        logger.error(f"Error in risk assessment: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/treatment-recommendations', methods=['POST'])
def treatment_recommendations():
    """Get treatment recommendations based on diagnosis"""
    try:
        data = request.get_json()
        
        if not data:
            raise BadRequest("No data provided")
        
        diagnosis = data.get('diagnosis', '')
        patient_info = data.get('patient_info', {})
        symptoms = data.get('symptoms', [])
        
        if not diagnosis:
            raise BadRequest("Diagnosis is required")
        
        # Use ML engine for treatment recommendations
        if ml_engine:
            result = ml_engine.get_treatment_recommendations(diagnosis, patient_info, symptoms)
        else:
            # Fallback treatment recommendations
            result = {
                'treatments': [
                    {
                        'type': 'General Care',
                        'description': 'Rest and hydration',
                        'priority': 'High',
                        'duration': '3-7 days'
                    }
                ],
                'lifestyle_recommendations': ['Adequate rest', 'Proper nutrition', 'Regular exercise'],
                'follow_up': 'Consult healthcare provider if symptoms persist',
                'emergency_signs': ['Severe worsening of symptoms', 'Difficulty breathing', 'Chest pain']
            }
        
        result['timestamp'] = datetime.now().isoformat()
        result['recommendation_id'] = f"TREAT_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        logger.info(f"Treatment recommendations generated for: {diagnosis}")
        return jsonify(result)
        
    except BadRequest as e:
        logger.warning(f"Bad request in treatment recommendations: {str(e)}")
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        logger.error(f"Error in treatment recommendations: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

# Error handlers

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('DEBUG', 'False').lower() == 'true'
    
    logger.info(f"Starting Health Diagnostics API on port {port}")
    app.run(host='0.0.0.0', port=port, debug=debug)
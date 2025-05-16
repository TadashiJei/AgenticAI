#!/usr/bin/env python
"""
Flask API for DefensysAI models.
"""
import os
import json
import numpy as np
import pandas as pd
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename

# Import model modules
# These will be available after running convert_notebooks.py
try:
    from models.phishing_detection.model import Model as PhishingModel
    from models.phishing_detection.preprocessor import Preprocessor as PhishingPreprocessor
    
    from models.malware_detection.model import Model as MalwareModel
    from models.malware_detection.preprocessor import Preprocessor as MalwarePreprocessor
    
    from models.network_security.model import Model as NetworkModel
    from models.network_security.preprocessor import Preprocessor as NetworkPreprocessor
    
    MODELS_AVAILABLE = True
except ImportError:
    print("Warning: Model modules not found. Run convert_notebooks.py first.")
    MODELS_AVAILABLE = False

app = Flask(__name__)

# Configuration
UPLOAD_FOLDER = 'uploads'
MODEL_FOLDER = 'saved_models'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(MODEL_FOLDER, exist_ok=True)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max upload

# Initialize models
phishing_model = None
malware_model = None
network_model = None

def load_models():
    """Load all models from saved files."""
    global phishing_model, malware_model, network_model
    
    if not MODELS_AVAILABLE:
        return False
    
    # Initialize phishing detection model
    phishing_model = PhishingModel()
    phishing_model_path = os.path.join(MODEL_FOLDER, 'phishing_model.pkl')
    if os.path.exists(phishing_model_path):
        phishing_model.load(phishing_model_path)
    
    # Initialize malware detection model
    malware_model = MalwareModel()
    malware_model_path = os.path.join(MODEL_FOLDER, 'malware_model.h5')
    if os.path.exists(malware_model_path):
        malware_model.load(malware_model_path)
    
    # Initialize network security model
    network_model = NetworkModel()
    network_model_path = os.path.join(MODEL_FOLDER, 'network_model.pkl')
    if os.path.exists(network_model_path):
        network_model.load(network_model_path)
    
    return True

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        'status': 'healthy',
        'models_available': MODELS_AVAILABLE,
        'phishing_model': phishing_model is not None,
        'malware_model': malware_model is not None,
        'network_model': network_model is not None
    })

@app.route('/api/phishing/detect', methods=['POST'])
def detect_phishing():
    """Detect phishing URLs."""
    if not MODELS_AVAILABLE or phishing_model is None:
        return jsonify({'error': 'Phishing detection model not available'}), 503
    
    # Get URL from request
    data = request.get_json()
    if not data or 'url' not in data:
        return jsonify({'error': 'URL is required'}), 400
    
    url = data['url']
    
    # Preprocess the URL
    preprocessor = PhishingPreprocessor()
    features = preprocessor.preprocess({'url': url})
    
    # Make prediction
    try:
        prediction = phishing_model.predict(features)
        probability = float(np.max(prediction))
        is_phishing = bool(np.argmax(prediction))
        
        return jsonify({
            'url': url,
            'is_phishing': is_phishing,
            'confidence': probability,
            'status': 'success'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/malware/detect', methods=['POST'])
def detect_malware():
    """Detect malware from uploaded file or system metrics."""
    if not MODELS_AVAILABLE or malware_model is None:
        return jsonify({'error': 'Malware detection model not available'}), 503
    
    # Check if file is part of the request
    if 'file' in request.files:
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Extract features from file
        preprocessor = MalwarePreprocessor()
        features = preprocessor.preprocess_file(filepath)
        
        # Clean up the file
        os.remove(filepath)
    else:
        # Get system metrics from request
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        preprocessor = MalwarePreprocessor()
        features = preprocessor.preprocess(data)
    
    # Make prediction
    try:
        prediction = malware_model.predict(features)
        probability = float(np.max(prediction))
        is_malware = bool(np.argmax(prediction))
        
        return jsonify({
            'is_malware': is_malware,
            'confidence': probability,
            'status': 'success'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/network/analyze', methods=['POST'])
def analyze_network():
    """Analyze network traffic for security threats."""
    if not MODELS_AVAILABLE or network_model is None:
        return jsonify({'error': 'Network security model not available'}), 503
    
    # Get network data from request
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    # Preprocess the network data
    preprocessor = NetworkPreprocessor()
    features = preprocessor.preprocess(data)
    
    # Make prediction
    try:
        prediction = network_model.predict(features)
        probability = float(np.max(prediction))
        is_attack = bool(np.argmax(prediction))
        
        return jsonify({
            'is_attack': is_attack,
            'confidence': probability,
            'status': 'success'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/train', methods=['POST'])
def train_models():
    """Train or retrain models with new data."""
    if not MODELS_AVAILABLE:
        return jsonify({'error': 'Model modules not available'}), 503
    
    data = request.get_json()
    if not data or 'model_type' not in data:
        return jsonify({'error': 'Model type is required'}), 400
    
    model_type = data['model_type']
    training_data_path = data.get('training_data_path')
    
    if not training_data_path or not os.path.exists(training_data_path):
        return jsonify({'error': 'Valid training data path is required'}), 400
    
    try:
        if model_type == 'phishing':
            # Train phishing model
            global phishing_model
            phishing_model = PhishingModel()
            
            # Load and preprocess data
            preprocessor = PhishingPreprocessor()
            training_data = pd.read_csv(training_data_path)
            X, y = preprocessor.preprocess(training_data)
            
            # Train model
            phishing_model.train(X, y)
            
            # Save model
            phishing_model.save(os.path.join(MODEL_FOLDER, 'phishing_model.pkl'))
            
        elif model_type == 'malware':
            # Train malware model
            global malware_model
            malware_model = MalwareModel()
            
            # Load and preprocess data
            preprocessor = MalwarePreprocessor()
            training_data = pd.read_csv(training_data_path)
            X, y = preprocessor.preprocess(training_data)
            
            # Train model
            malware_model.train(X, y)
            
            # Save model
            malware_model.save(os.path.join(MODEL_FOLDER, 'malware_model.h5'))
            
        elif model_type == 'network':
            # Train network security model
            global network_model
            network_model = NetworkModel()
            
            # Load and preprocess data
            preprocessor = NetworkPreprocessor()
            training_data = pd.read_csv(training_data_path)
            X, y = preprocessor.preprocess(training_data)
            
            # Train model
            network_model.train(X, y)
            
            # Save model
            network_model.save(os.path.join(MODEL_FOLDER, 'network_model.pkl'))
            
        else:
            return jsonify({'error': f'Unknown model type: {model_type}'}), 400
        
        return jsonify({
            'status': 'success',
            'message': f'{model_type} model trained successfully'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Try to load models on startup
    load_models()
    
    # Start the Flask app
    app.run(debug=True, host='0.0.0.0', port=5000)

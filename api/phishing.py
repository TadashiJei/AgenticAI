import json
import sys
import os
import numpy as np
from http.server import BaseHTTPRequestHandler

# Add parent directory to path so we can import our model modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import model modules (these will be available after running convert_notebooks.py)
try:
    from models.phishing_detection.model import Model as PhishingModel
    from models.phishing_detection.preprocessor import Preprocessor as PhishingPreprocessor
    
    MODELS_AVAILABLE = True
except ImportError:
    MODELS_AVAILABLE = False

# Load model (this will be executed once when the serverless function is initialized)
phishing_model = None
if MODELS_AVAILABLE:
    phishing_model = PhishingModel()
    model_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 
                             'saved_models', 'phishing_model.pkl')
    if os.path.exists(model_path):
        phishing_model.load(model_path)

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        # Check if model is available
        if not MODELS_AVAILABLE or phishing_model is None:
            self.send_response(503)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            response = {'error': 'Phishing detection model not available'}
            self.wfile.write(json.dumps(response).encode())
            return
        
        # Get request body
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        
        try:
            data = json.loads(post_data)
            
            # Check if URL is provided
            if 'url' not in data:
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                response = {'error': 'URL is required'}
                self.wfile.write(json.dumps(response).encode())
                return
            
            url = data['url']
            
            # Preprocess the URL
            preprocessor = PhishingPreprocessor()
            features = preprocessor.preprocess({'url': url})
            
            # Make prediction
            prediction = phishing_model.predict(features)
            probability = float(np.max(prediction))
            is_phishing = bool(np.argmax(prediction))
            
            # Send response
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            
            response = {
                'url': url,
                'is_phishing': is_phishing,
                'confidence': probability,
                'status': 'success'
            }
            
            self.wfile.write(json.dumps(response).encode())
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            response = {'error': str(e)}
            self.wfile.write(json.dumps(response).encode())
    
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        
        response = {
            'service': 'phishing detection',
            'status': 'available' if MODELS_AVAILABLE and phishing_model is not None else 'unavailable',
            'usage': 'Send a POST request with JSON body containing a "url" field'
        }
        
        self.wfile.write(json.dumps(response).encode())

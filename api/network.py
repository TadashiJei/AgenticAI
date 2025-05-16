import json
import sys
import os
import numpy as np
from http.server import BaseHTTPRequestHandler

# Add parent directory to path so we can import our model modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import model modules (these will be available after running convert_notebooks.py)
try:
    from models.network_security.model import Model as NetworkModel
    from models.network_security.preprocessor import Preprocessor as NetworkPreprocessor
    
    MODELS_AVAILABLE = True
except ImportError:
    MODELS_AVAILABLE = False

# Load model (this will be executed once when the serverless function is initialized)
network_model = None
if MODELS_AVAILABLE:
    network_model = NetworkModel()
    model_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 
                             'saved_models', 'network_model.pkl')
    if os.path.exists(model_path):
        network_model.load(model_path)

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        # Check if model is available
        if not MODELS_AVAILABLE or network_model is None:
            self.send_response(503)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            response = {'error': 'Network security model not available'}
            self.wfile.write(json.dumps(response).encode())
            return
        
        # Get request body
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        
        try:
            data = json.loads(post_data)
            
            # Check if network data is provided
            if not data or 'network_data' not in data:
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                response = {'error': 'Network data is required'}
                self.wfile.write(json.dumps(response).encode())
                return
            
            network_data = data['network_data']
            
            # Preprocess the network data
            preprocessor = NetworkPreprocessor()
            features = preprocessor.preprocess(network_data)
            
            # Make prediction
            prediction = network_model.predict(features)
            probability = float(np.max(prediction))
            is_attack = bool(np.argmax(prediction))
            
            # Send response
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            
            response = {
                'is_attack': is_attack,
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
            'service': 'network security analysis',
            'status': 'available' if MODELS_AVAILABLE and network_model is not None else 'unavailable',
            'usage': 'Send a POST request with JSON body containing a "network_data" field'
        }
        
        self.wfile.write(json.dumps(response).encode())

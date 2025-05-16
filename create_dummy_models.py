#!/usr/bin/env python
"""
Create dummy model files for testing the DefensysAI API endpoints.
This script creates simple trained models and saves them to the saved_models directory.
"""
import os
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split

# Import our model modules
from models.phishing_detection.model import Model as PhishingModel
from models.phishing_detection.preprocessor import Preprocessor as PhishingPreprocessor

from models.malware_detection.model import Model as MalwareModel
from models.malware_detection.preprocessor import Preprocessor as MalwarePreprocessor

from models.network_security.model import Model as NetworkModel
from models.network_security.preprocessor import Preprocessor as NetworkPreprocessor

def create_phishing_model():
    """Create and save a dummy phishing detection model."""
    print("Creating phishing detection model...")
    
    # Create dummy dataset
    urls = [
        "google.com", "facebook.com", "amazon.com", "microsoft.com", "apple.com",
        "g00gle.com", "faceb00k.com", "amaz0n.com", "micr0s0ft.com", "appl3.com"
    ]
    
    # First 5 are legitimate, last 5 are phishing
    labels = [0, 0, 0, 0, 0, 1, 1, 1, 1, 1]
    
    # Create a DataFrame
    data = pd.DataFrame({'url': urls, 'label': labels})
    
    # Split into features and target
    X = data['url']
    y = data['label']
    
    # Create and train the model
    model = PhishingModel()
    model.train(X, y)
    
    # Save the model
    os.makedirs('saved_models', exist_ok=True)
    model.save('saved_models/phishing_model.pkl')
    
    print("Phishing detection model created and saved.")

def create_malware_model():
    """Create and save a dummy malware detection model."""
    print("Creating malware detection model...")
    
    # Create dummy dataset with 35 features
    n_samples = 100
    n_features = 35
    
    # Generate random features
    X = np.random.randn(n_samples, n_features)
    
    # Generate random labels (0 for benign, 1 for malware)
    y = np.random.randint(0, 2, size=n_samples)
    
    # Create a DataFrame
    feature_names = [f'feature_{i}' for i in range(n_features)]
    data = pd.DataFrame(X, columns=feature_names)
    
    # Create and train the model
    model = MalwareModel()
    model.train(X, y, epochs=5, batch_size=10)  # Use fewer epochs for quick training
    
    # Save the model
    os.makedirs('saved_models', exist_ok=True)
    model.save('saved_models/malware_model.h5')
    
    print("Malware detection model created and saved.")

def create_network_security_model():
    """Create and save a dummy network security model."""
    print("Creating network security model...")
    
    # Create dummy dataset
    n_samples = 100
    
    # Generate random features for network traffic (only numeric features for simplicity)
    data = {
        'packet_size': np.random.randint(64, 1500, size=n_samples),
        'duration': np.random.uniform(0.1, 10.0, size=n_samples),
        'packets_count': np.random.randint(1, 100, size=n_samples),
        'bytes_transferred': np.random.randint(100, 10000, size=n_samples),
        'window_size': np.random.choice([1024, 2048, 4096, 8192], size=n_samples),
        'ttl': np.random.randint(32, 255, size=n_samples),
        'response_time': np.random.uniform(0.01, 1.0, size=n_samples),
        # Convert IPs to numeric values directly
        'src_ip_numeric': np.random.randint(0, 2**32, size=n_samples),
        'dst_ip_numeric': np.random.randint(0, 2**32, size=n_samples)
    }
    
    # Create DataFrame
    df = pd.DataFrame(data)
    
    # Generate random labels (0 for normal, 1 for attack)
    y = np.random.randint(0, 2, size=n_samples)
    
    # Create and train the model directly with numeric features
    # Skip the preprocessor for simplicity
    model = NetworkModel()
    
    # Modify the pipeline to use only the classifier without preprocessing
    from sklearn.ensemble import RandomForestClassifier
    model.pipeline = RandomForestClassifier(n_estimators=50, random_state=42)
    model.pipeline.fit(df, y)
    model.model_ready = True
    
    # Save the model
    os.makedirs('saved_models', exist_ok=True)
    model.save('saved_models/network_model.pkl')
    
    print("Network security model created and saved.")

if __name__ == '__main__':
    print("Creating dummy models for testing...")
    
    try:
        create_phishing_model()
    except Exception as e:
        print(f"Error creating phishing model: {e}")
    
    try:
        create_malware_model()
    except Exception as e:
        print(f"Error creating malware model: {e}")
    
    try:
        create_network_security_model()
    except Exception as e:
        print(f"Error creating network security model: {e}")
    
    print("Done creating dummy models.")

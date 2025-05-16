#!/usr/bin/env python
"""
Evaluate the accuracy of the trained models.
This script loads the saved models and evaluates them on test data.
"""
import os
import numpy as np
import pandas as pd
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, classification_report

# Import our model modules
from models.phishing_detection.model import Model as PhishingModel
from models.phishing_detection.preprocessor import Preprocessor as PhishingPreprocessor

from models.malware_detection.model import Model as MalwareModel
from models.malware_detection.preprocessor import Preprocessor as MalwarePreprocessor

from models.network_security.model import Model as NetworkModel
from models.network_security.preprocessor import Preprocessor as NetworkPreprocessor

def evaluate_phishing_model():
    """Evaluate the phishing detection model."""
    print("\n===== Phishing Detection Model Evaluation =====")
    
    # Check if model exists
    model_path = 'saved_models/phishing_model.pkl'
    if not os.path.exists(model_path):
        print(f"Model file not found at {model_path}")
        return
    
    # Load the model
    model = PhishingModel()
    model.load(model_path)
    
    # Create test data (similar to what we used for training but with different examples)
    urls = [
        "linkedin.com", "twitter.com", "github.com", "reddit.com", "netflix.com",
        "l1nkedin.com", "tw1tter.com", "g1thub.com", "redd1t.com", "netfl1x.com"
    ]
    
    # First 5 are legitimate, last 5 are phishing
    labels = [0, 0, 0, 0, 0, 1, 1, 1, 1, 1]
    
    # Create a DataFrame
    data = pd.DataFrame({'url': urls, 'label': labels})
    
    # Split into features and target
    X = data['url']
    y = data['label']
    
    # Preprocess the data
    preprocessor = PhishingPreprocessor()
    X_processed = preprocessor.preprocess(data)
    
    # Make predictions
    y_probs = model.predict(X_processed)
    y_pred = np.argmax(y_probs, axis=1)
    
    # Calculate metrics
    accuracy = accuracy_score(y, y_pred)
    precision = precision_score(y, y_pred, average='binary')
    recall = recall_score(y, y_pred, average='binary')
    f1 = f1_score(y, y_pred, average='binary')
    
    print(f"Accuracy: {accuracy:.4f}")
    print(f"Precision: {precision:.4f}")
    print(f"Recall: {recall:.4f}")
    print(f"F1 Score: {f1:.4f}")
    print("\nClassification Report:")
    print(classification_report(y, y_pred, target_names=['Legitimate', 'Phishing']))

def evaluate_malware_model():
    """Evaluate the malware detection model."""
    print("\n===== Malware Detection Model Evaluation =====")
    
    # Check if model exists
    model_path = 'saved_models/malware_model.h5'
    if not os.path.exists(model_path):
        print(f"Model file not found at {model_path}")
        return
    
    # Load the model
    model = MalwareModel()
    model.load(model_path)
    
    # Create test data
    n_samples = 50
    n_features = 35
    
    # Generate random features
    X = np.random.randn(n_samples, n_features)
    
    # Generate random labels (0 for benign, 1 for malware)
    y = np.random.randint(0, 2, size=n_samples)
    
    # Make predictions
    y_probs = model.predict(X)
    y_pred = np.argmax(y_probs, axis=1)
    
    # Calculate metrics
    accuracy = accuracy_score(y, y_pred)
    precision = precision_score(y, y_pred, average='binary')
    recall = recall_score(y, y_pred, average='binary')
    f1 = f1_score(y, y_pred, average='binary')
    
    print(f"Accuracy: {accuracy:.4f}")
    print(f"Precision: {precision:.4f}")
    print(f"Recall: {recall:.4f}")
    print(f"F1 Score: {f1:.4f}")
    print("\nClassification Report:")
    print(classification_report(y, y_pred, target_names=['Benign', 'Malware']))

def evaluate_network_model():
    """Evaluate the network security model."""
    print("\n===== Network Security Model Evaluation =====")
    
    # Check if model exists
    model_path = 'saved_models/network_model.pkl'
    if not os.path.exists(model_path):
        print(f"Model file not found at {model_path}")
        return
    
    # Load the model
    model = NetworkModel()
    model.load(model_path)
    
    # Create test data
    n_samples = 50
    
    # Generate random features for network traffic (numeric features only)
    data = {
        'packet_size': np.random.randint(64, 1500, size=n_samples),
        'duration': np.random.uniform(0.1, 10.0, size=n_samples),
        'packets_count': np.random.randint(1, 100, size=n_samples),
        'bytes_transferred': np.random.randint(100, 10000, size=n_samples),
        'window_size': np.random.choice([1024, 2048, 4096, 8192], size=n_samples),
        'ttl': np.random.randint(32, 255, size=n_samples),
        'response_time': np.random.uniform(0.01, 1.0, size=n_samples),
        'src_ip_numeric': np.random.randint(0, 2**32, size=n_samples),
        'dst_ip_numeric': np.random.randint(0, 2**32, size=n_samples)
    }
    
    # Create DataFrame
    df = pd.DataFrame(data)
    
    # Generate random labels (0 for normal, 1 for attack)
    y = np.random.randint(0, 2, size=n_samples)
    
    # Make predictions
    y_probs = model.predict(df)
    y_pred = np.argmax(y_probs, axis=1)
    
    # Calculate metrics
    accuracy = accuracy_score(y, y_pred)
    precision = precision_score(y, y_pred, average='binary')
    recall = recall_score(y, y_pred, average='binary')
    f1 = f1_score(y, y_pred, average='binary')
    
    print(f"Accuracy: {accuracy:.4f}")
    print(f"Precision: {precision:.4f}")
    print(f"Recall: {recall:.4f}")
    print(f"F1 Score: {f1:.4f}")
    print("\nClassification Report:")
    print(classification_report(y, y_pred, target_names=['Normal', 'Attack']))

if __name__ == '__main__':
    print("Evaluating model accuracy...")
    
    try:
        evaluate_phishing_model()
    except Exception as e:
        print(f"Error evaluating phishing model: {e}")
    
    try:
        evaluate_malware_model()
    except Exception as e:
        print(f"Error evaluating malware model: {e}")
    
    try:
        evaluate_network_model()
    except Exception as e:
        print(f"Error evaluating network model: {e}")
    
    print("\nEvaluation complete.")

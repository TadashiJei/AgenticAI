import numpy as np
import pandas as pd
import pickle
import os
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split

class Model:
    def __init__(self):
        """Initialize the phishing detection model."""
        self.model = Pipeline([
            ('tfidf', TfidfVectorizer(max_features=5000)),
            ('scaler', StandardScaler(with_mean=False)),  # TF-IDF produces sparse matrices
            ('classifier', RandomForestClassifier(n_estimators=100, random_state=42))
        ])
        self.model_ready = False

    def train(self, X, y):
        """Train the phishing detection model.
        
        Args:
            X: Features dataframe or array
            y: Target labels
            
        Returns:
            self: The trained model instance
        """
        print(f"Training phishing detection model with {len(X)} samples")
        
        # Convert URLs to strings if they're in a DataFrame
        if isinstance(X, pd.DataFrame) and 'url' in X.columns:
            X = X['url'].astype(str)
        
        # Fit the model
        self.model.fit(X, y)
        self.model_ready = True
        
        return self

    def predict(self, X):
        """Make predictions with the phishing detection model.
        
        Args:
            X: Features to predict on
            
        Returns:
            np.array: Prediction probabilities for each class
        """
        if not self.model_ready:
            raise ValueError("Model has not been trained or loaded yet")
        
        # Convert URLs to strings if they're in a DataFrame
        if isinstance(X, pd.DataFrame) and 'url' in X.columns:
            X = X['url'].astype(str)
        elif isinstance(X, dict) and 'url' in X:
            X = [X['url']]
        
        # Get prediction probabilities
        try:
            probs = self.model.predict_proba(X)
            return probs
        except Exception as e:
            print(f"Error in prediction: {e}")
            # Return a safe default if prediction fails
            return np.array([[0.99, 0.01]])  # [safe, phishing]

    def evaluate(self, X, y):
        """Evaluate the model on test data.
        
        Args:
            X: Test features
            y: True labels
            
        Returns:
            float: Accuracy score
        """
        if not self.model_ready:
            raise ValueError("Model has not been trained or loaded yet")
        
        # Convert URLs to strings if they're in a DataFrame
        if isinstance(X, pd.DataFrame) and 'url' in X.columns:
            X = X['url'].astype(str)
        
        return self.model.score(X, y)

    def save(self, path):
        """Save the model to disk.
        
        Args:
            path: Path to save the model to
        """
        # Create directory if it doesn't exist
        os.makedirs(os.path.dirname(path), exist_ok=True)
        
        with open(path, 'wb') as f:
            pickle.dump(self.model, f)
        
        print(f"Model saved to {path}")

    def load(self, path):
        """Load the model from disk.
        
        Args:
            path: Path to load the model from
        """
        if not os.path.exists(path):
            raise FileNotFoundError(f"Model file not found at {path}")
        
        with open(path, 'rb') as f:
            self.model = pickle.load(f)
        
        self.model_ready = True
        print(f"Model loaded from {path}")

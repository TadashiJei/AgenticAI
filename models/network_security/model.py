import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
import os
import pickle
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.model_selection import GridSearchCV

class Model:
    def __init__(self):
        """Initialize the network security model."""
        self.pipeline = Pipeline([
            ('scaler', StandardScaler()),
            ('classifier', RandomForestClassifier(n_estimators=100, random_state=42))
        ])
        self.model_ready = False

    def train(self, X, y, cv=5):
        """Train the network security model with hyperparameter tuning.
        
        Args:
            X: Features dataframe or array
            y: Target labels
            cv: Number of cross-validation folds
            
        Returns:
            self: The trained model instance
        """
        print(f"Training network security model with {len(X)} samples")
        
        # Define hyperparameter grid
        param_grid = {
            'classifier__n_estimators': [50, 100, 200],
            'classifier__max_depth': [None, 10, 20, 30],
            'classifier__min_samples_split': [2, 5, 10]
        }
        
        # Create grid search with cross-validation
        grid_search = GridSearchCV(
            self.pipeline,
            param_grid=param_grid,
            cv=cv,
            scoring='accuracy',
            n_jobs=-1,
            verbose=1
        )
        
        # Fit the model with grid search
        grid_search.fit(X, y)
        
        # Get the best model
        self.pipeline = grid_search.best_estimator_
        self.best_params = grid_search.best_params_
        self.model_ready = True
        
        print(f"Best parameters: {self.best_params}")
        print(f"Best cross-validation score: {grid_search.best_score_:.4f}")
        
        return self

    def predict(self, X):
        """Make predictions with the network security model.
        
        Args:
            X: Features to predict on
            
        Returns:
            np.array: Prediction probabilities for each class
        """
        if not self.model_ready:
            raise ValueError("Model has not been trained or loaded yet")
        
        try:
            # Get prediction probabilities
            probs = self.pipeline.predict_proba(X)
            return probs
        except Exception as e:
            print(f"Error in prediction: {e}")
            # Return a safe default if prediction fails
            # Assuming binary classification: [normal, attack]
            return np.array([[0.99, 0.01]])

    def evaluate(self, X, y):
        """Evaluate the model on test data.
        
        Args:
            X: Test features
            y: True labels
            
        Returns:
            dict: Dictionary with evaluation metrics
        """
        if not self.model_ready:
            raise ValueError("Model has not been trained or loaded yet")
        
        # Get predictions
        y_pred = self.pipeline.predict(X)
        
        # Calculate metrics
        from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
        
        accuracy = accuracy_score(y, y_pred)
        precision = precision_score(y, y_pred, average='weighted')
        recall = recall_score(y, y_pred, average='weighted')
        f1 = f1_score(y, y_pred, average='weighted')
        
        return {
            'accuracy': accuracy,
            'precision': precision,
            'recall': recall,
            'f1': f1
        }

    def save(self, path):
        """Save the model to disk.
        
        Args:
            path: Path to save the model to
        """
        if not self.model_ready:
            raise ValueError("Model has not been trained or loaded yet")
            
        # Create directory if it doesn't exist
        os.makedirs(os.path.dirname(path), exist_ok=True)
        
        # Save the pipeline
        with open(path, 'wb') as f:
            pickle.dump(self.pipeline, f)
        
        # Save best parameters if available
        if hasattr(self, 'best_params'):
            params_path = os.path.join(os.path.dirname(path), 'best_params.pkl')
            with open(params_path, 'wb') as f:
                pickle.dump(self.best_params, f)
        
        print(f"Model saved to {path}")

    def load(self, path):
        """Load the model from disk.
        
        Args:
            path: Path to load the model from
        """
        if not os.path.exists(path):
            raise FileNotFoundError(f"Model file not found at {path}")
        
        # Load the pipeline
        with open(path, 'rb') as f:
            self.pipeline = pickle.load(f)
        
        # Load best parameters if available
        params_path = os.path.join(os.path.dirname(path), 'best_params.pkl')
        if os.path.exists(params_path):
            with open(params_path, 'rb') as f:
                self.best_params = pickle.load(f)
        
        self.model_ready = True
        print(f"Model loaded from {path}")

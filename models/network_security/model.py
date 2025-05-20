import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
import numpy as np
import pandas as pd
import json
import joblib
from datetime import datetime
from typing import Dict, Any, Optional, Union, List

from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
import os

# Constants
MODEL_VERSION = "1.0.0"
MODEL_METADATA_FILENAME = "model_metadata.json"
MODEL_FILENAME = "model.pkl"
SCALER_FILENAME = "scaler.pkl"

class Model:
    """Network Security Model using RandomForest classifier.
    
    This model is designed to detect network security threats based on network traffic features,
    using a RandomForest classifier with hyperparameter tuning for optimal performance.
    """
    
    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()
        self.pipeline = None
        self._model_cache = {}
        self.metadata = {
            "version": MODEL_VERSION,
            "created_at": None,
            "updated_at": None,
            "accuracy": None,
            "precision": None,
            "recall": None,
            "f1_score": None,
            "features": None,
            "architecture": "random_forest",
            "hyperparameters": None
        }
    
    def train(self, X, y, perform_grid_search=True, n_jobs=-1, cv=5, random_state=42):
        """Train the network security model with hyperparameter tuning.
        
        Args:
            X: Features for training (DataFrame or numpy array)
            y: Target labels (0 for normal, 1 for attack)
            perform_grid_search: Whether to perform hyperparameter tuning
            n_jobs: Number of parallel jobs for grid search
            cv: Number of cross-validation folds
            random_state: Random seed for reproducibility
            
        Returns:
            self: Trained model instance
        """
        # Store feature names if available
        if hasattr(X, 'columns'):
            self.metadata["features"] = list(X.columns)
        
        # Scale features
        X_scaled = self.scaler.fit_transform(X)
        
        # Set up the model
        if perform_grid_search:
            # Define hyperparameter grid
            param_grid = {
                'n_estimators': [100, 200, 500],
                'max_depth': [None, 10, 20, 30],
                'min_samples_split': [2, 5, 10],
                'min_samples_leaf': [1, 2, 4],
                'class_weight': [None, 'balanced']
            }
            
            # Create base model
            base_model = RandomForestClassifier(random_state=random_state)
            
            # Perform grid search
            grid_search = GridSearchCV(
                estimator=base_model,
                param_grid=param_grid,
                cv=cv,
                n_jobs=n_jobs,
                scoring='f1',
                verbose=1
            )
            
            # Fit the grid search
            grid_search.fit(X_scaled, y)
            
            # Get best model
            self.model = grid_search.best_estimator_
            
            # Store best hyperparameters
            self.metadata["hyperparameters"] = grid_search.best_params_
            print(f"Best hyperparameters: {grid_search.best_params_}")
        else:
            # Use default hyperparameters
            self.model = RandomForestClassifier(
                n_estimators=200,
                max_depth=20,
                min_samples_split=5,
                min_samples_leaf=2,
                class_weight='balanced',
                random_state=random_state,
                n_jobs=n_jobs
            )
            
            # Train the model
            self.model.fit(X_scaled, y)
            
            # Store hyperparameters
            self.metadata["hyperparameters"] = {
                'n_estimators': 200,
                'max_depth': 20,
                'min_samples_split': 5,
                'min_samples_leaf': 2,
                'class_weight': 'balanced'
            }
        
        # Create pipeline for prediction
        self.pipeline = Pipeline([
            ('classifier', self.model)
        ])
        
        # Update metadata
        self.metadata["created_at"] = datetime.now().isoformat()
        self.metadata["updated_at"] = datetime.now().isoformat()
        
        # Evaluate on training data
        train_pred = self.model.predict(X_scaled)
        self.metadata["accuracy"] = float(accuracy_score(y, train_pred))
        self.metadata["precision"] = float(precision_score(y, train_pred, average='weighted'))
        self.metadata["recall"] = float(recall_score(y, train_pred, average='weighted'))
        self.metadata["f1_score"] = float(f1_score(y, train_pred, average='weighted'))
        
        # Clear prediction cache
        self._model_cache = {}
        
        return self
    
    def predict(self, X, use_cache=True, return_probabilities=False):
        """Make predictions on new data.
        
        Args:
            X: Features for prediction
            use_cache: Whether to use prediction cache
            return_probabilities: Whether to return class probabilities
            
        Returns:
            NumPy array of predictions (0 for normal, 1 for attack) or probabilities
        """
        if self.model is None:
            raise ValueError('Model not trained or loaded yet')
        
        # Check cache if enabled
        if use_cache and hasattr(X, '__hash__') and X.__hash__ is not None:
            cache_key = hash(X.tobytes()) if hasattr(X, 'tobytes') else None
            if cache_key in self._model_cache:
                return self._model_cache[cache_key]
        
        # Scale features
        X_scaled = self.scaler.transform(X)
        
        # Make predictions
        if return_probabilities:
            predictions = self.model.predict_proba(X_scaled)
        else:
            predictions = self.model.predict(X_scaled)
        
        # Cache result if enabled
        if use_cache and hasattr(X, '__hash__') and X.__hash__ is not None:
            cache_key = hash(X.tobytes()) if hasattr(X, 'tobytes') else None
            if cache_key is not None:
                self._model_cache[cache_key] = predictions
        
        return predictions
    
    def predict_with_details(self, X):
        """Make predictions with detailed information.
        
        Args:
            X: Features for prediction
            
        Returns:
            List of dictionaries with prediction details
        """
        if self.model is None:
            raise ValueError('Model not trained or loaded yet')
        
        # Scale features
        X_scaled = self.scaler.transform(X)
        
        # Get predictions and probabilities
        probabilities = self.model.predict_proba(X_scaled)
        predictions = self.model.predict(X_scaled)
        
        # Format results
        results = []
        for i, (pred, probs) in enumerate(zip(predictions, probabilities)):
            result = {
                "is_attack": bool(pred),
                "confidence": float(probs[int(pred)]),  # Probability of predicted class
                "attack_probability": float(probs[1]) if len(probs) > 1 else float(pred),  # Probability of being an attack
                "normal_probability": float(probs[0]) if len(probs) > 1 else 1.0 - float(pred),  # Probability of being normal
                "prediction_source": "model"
            }
            results.append(result)
        
        return results
    
    def get_feature_importance(self, top_n=None):
        """Get feature importance from the trained model.
        
        Args:
            top_n: Number of top features to return (None for all)
            
        Returns:
            Dictionary mapping feature names to importance scores
        """
        if self.model is None:
            raise ValueError('Model not trained or loaded yet')
        
        # Get feature importance
        importance = self.model.feature_importances_
        
        # Get feature names
        if self.metadata["features"] is not None:
            feature_names = self.metadata["features"]
        else:
            feature_names = [f"feature_{i}" for i in range(len(importance))]
        
        # Create dictionary of feature importance
        importance_dict = {name: float(imp) for name, imp in zip(feature_names, importance)}
        
        # Sort by importance
        importance_dict = dict(sorted(importance_dict.items(), key=lambda x: x[1], reverse=True))
        
        # Return top N if specified
        if top_n is not None and top_n < len(importance_dict):
            return dict(list(importance_dict.items())[:top_n])
        
        return importance_dict

    def load(self, path):
        """Load model from disk.
        
        Args:
            path: Path to model directory or file
            
        Returns:
            self: Model instance with loaded model
        """
        if os.path.isdir(path):
            # Load from directory
            model_path = os.path.join(path, MODEL_FILENAME)
            scaler_path = os.path.join(path, SCALER_FILENAME)
            metadata_path = os.path.join(path, MODEL_METADATA_FILENAME)
            
            # Load model
            self.model = joblib.load(model_path)
            
            # Load scaler if exists
            if os.path.exists(scaler_path):
                self.scaler = joblib.load(scaler_path)
            
            # Create pipeline
            self.pipeline = Pipeline([('classifier', self.model)])
            
            # Load metadata if exists
            if os.path.exists(metadata_path):
                with open(metadata_path, 'r') as f:
                    self.metadata = json.load(f)
        else:
            # Load single file (legacy mode)
            self.model = joblib.load(path)
            
            # Create pipeline
            self.pipeline = Pipeline([('classifier', self.model)])
        
        # Clear prediction cache
        self._model_cache = {}
        
        return self

    def save(self, path):
        """Save model to disk.
        
        Args:
            path: Directory path to save the model
            
        Returns:
            str: Path where model was saved
        """
        if self.model is None:
            raise ValueError("Model not trained or loaded yet")
        
        # Create directory if it doesn't exist
        os.makedirs(path, exist_ok=True)
        
        # Update metadata
        self.metadata["updated_at"] = datetime.now().isoformat()
        
        # Save model
        model_path = os.path.join(path, MODEL_FILENAME)
        joblib.dump(self.model, model_path)
        
        # Save scaler
        scaler_path = os.path.join(path, SCALER_FILENAME)
        joblib.dump(self.scaler, scaler_path)
        
        # Save metadata
        metadata_path = os.path.join(path, MODEL_METADATA_FILENAME)
        with open(metadata_path, 'w') as f:
            json.dump(self.metadata, f, indent=2)
        
        return path
    
    def update_metrics(self, accuracy=None, precision=None, recall=None, f1_score=None):
        """Update model performance metrics.
        
        Args:
            accuracy: Accuracy score
            precision: Precision score
            recall: Recall score
            f1_score: F1 score
            
        Returns:
            self: Model instance with updated metadata
        """
        if accuracy is not None:
            self.metadata["accuracy"] = accuracy
        if precision is not None:
            self.metadata["precision"] = precision
        if recall is not None:
            self.metadata["recall"] = recall
        if f1_score is not None:
            self.metadata["f1_score"] = f1_score
            
        self.metadata["updated_at"] = datetime.now().isoformat()
        return self
    
    def clear_cache(self):
        """Clear the prediction cache."""
        self._model_cache = {}
    
    def get_version(self):
        """Get the model version.
        
        Returns:
            str: Version string
        """
        return self.metadata["version"]
    
    def streaming_predict(self, data_generator, batch_size=100):
        """Make predictions on streaming data.
        
        Args:
            data_generator: Generator yielding batches of feature data
            batch_size: Size of internal batches for processing
            
        Yields:
            Batches of predictions
        """
        if self.model is None:
            raise ValueError('Model not trained or loaded yet')
        
        buffer = []
        for data in data_generator:
            buffer.append(data)
            
            if len(buffer) >= batch_size:
                # Convert buffer to array and predict
                X_batch = np.array(buffer)
                
                # Reshape if necessary (handle 3D data)
                if len(X_batch.shape) == 3:
                    orig_shape = X_batch.shape
                    X_batch = X_batch.reshape(-1, X_batch.shape[-1])
                    
                # Scale the features
                X_scaled = self.scaler.transform(X_batch)
                
                # Make predictions
                predictions = self.model.predict(X_scaled)
                
                # Clear buffer
                buffer = []
                
                yield predictions
        
        # Process remaining items in buffer
        if buffer:
            X_batch = np.array(buffer)
            
            # Reshape if necessary (handle 3D data)
            if len(X_batch.shape) == 3:
                orig_shape = X_batch.shape
                X_batch = X_batch.reshape(-1, X_batch.shape[-1])
                
            # Scale the features
            X_scaled = self.scaler.transform(X_batch)
            
            # Make predictions
            predictions = self.model.predict(X_scaled)
            yield predictions

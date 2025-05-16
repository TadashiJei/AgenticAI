import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline

class Preprocessor:
    def __init__(self):
        """Initialize the network security preprocessor."""
        # Define the expected columns and their types
        self.numeric_features = [
            'packet_size', 'duration', 'packets_count', 'bytes_transferred',
            'window_size', 'ttl', 'response_time'
        ]
        
        self.categorical_features = [
            'protocol', 'service', 'flag', 'state'
        ]
        
        # Create transformers for preprocessing
        self.preprocessor = ColumnTransformer(
            transformers=[
                ('num', StandardScaler(), self.numeric_features),
                ('cat', OneHotEncoder(handle_unknown='ignore'), self.categorical_features)
            ],
            remainder='passthrough'
        )

    def preprocess(self, data):
        """Preprocess the input data for network security analysis.
        
        Args:
            data: Input data, can be a dictionary with network metrics or a DataFrame
            
        Returns:
            Preprocessed data ready for the model
        """
        if isinstance(data, dict):
            # Single network flow in a dictionary
            return self._preprocess_dict(data)
        
        elif isinstance(data, pd.DataFrame):
            # DataFrame with multiple network flows
            return self._preprocess_dataframe(data)
        
        else:
            # Assume it's already preprocessed
            return data
    
    def _preprocess_dict(self, data):
        """Preprocess a single dictionary of network metrics."""
        # Create a DataFrame with a single row
        df = pd.DataFrame([data])
        
        # Apply feature engineering
        features = self.feature_engineering(df)
        
        return features
    
    def _preprocess_dataframe(self, data):
        """Preprocess a DataFrame of network metrics."""
        # Apply feature engineering
        features = self.feature_engineering(data)
        
        return features

    def feature_engineering(self, data):
        """Extract and normalize features for network security analysis.
        
        Args:
            data: DataFrame with raw network metrics
            
        Returns:
            DataFrame with engineered features
        """
        # Create a copy to avoid modifying the original data
        df = data.copy()
        
        # Ensure all required columns exist
        for col in self.numeric_features + self.categorical_features:
            if col not in df.columns:
                if col in self.numeric_features:
                    df[col] = 0  # Default value for numeric features
                else:
                    df[col] = 'unknown'  # Default value for categorical features
        
        # Handle IP addresses (convert to numeric representation)
        if 'src_ip' in df.columns:
            df['src_ip_numeric'] = df['src_ip'].apply(self._ip_to_numeric)
        
        if 'dst_ip' in df.columns:
            df['dst_ip_numeric'] = df['dst_ip'].apply(self._ip_to_numeric)
        
        # Create derived features
        if 'packet_size' in df.columns and 'packets_count' in df.columns:
            df['total_bytes'] = df['packet_size'] * df['packets_count']
        
        if 'duration' in df.columns and 'packets_count' in df.columns:
            df['packets_per_second'] = df['packets_count'] / (df['duration'] + 0.1)  # Avoid division by zero
        
        # Apply the preprocessing pipeline
        try:
            # Fit the preprocessor if it hasn't been fit yet
            features = self.preprocessor.fit_transform(df)
            return features
        except Exception as e:
            print(f"Error in feature engineering: {e}")
            # Return a simplified version if preprocessing fails
            return df[self.numeric_features].fillna(0).values
    
    def _ip_to_numeric(self, ip):
        """Convert an IP address to a numeric value."""
        try:
            # Handle IPv4 addresses
            if isinstance(ip, str):
                parts = ip.split('.')
                if len(parts) == 4:
                    return sum(int(part) * (256 ** (3-i)) for i, part in enumerate(parts))
            # Return a default value for invalid IPs
            return 0
        except:
            return 0

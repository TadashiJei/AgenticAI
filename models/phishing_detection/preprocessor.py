import numpy as np
import pandas as pd
import re
from urllib.parse import urlparse

class Preprocessor:
    def __init__(self):
        """Initialize the phishing detection preprocessor."""
        pass

    def preprocess(self, data):
        """Preprocess the input data for phishing detection.
        
        Args:
            data: Input data, can be a DataFrame or a dictionary with a 'url' key
            
        Returns:
            Preprocessed data ready for the model
        """
        if isinstance(data, dict) and 'url' in data:
            # Single URL in a dictionary
            url = data['url']
            features = self.extract_url_features(url)
            return [features]  # Return as a list for the model
        
        elif isinstance(data, pd.DataFrame) and 'url' in data.columns:
            # DataFrame with URLs
            return data['url'].apply(self.extract_url_features).tolist()
        
        else:
            # Assume it's already preprocessed or a list of URLs
            return data

    def feature_engineering(self, data):
        """Extract features from URLs for phishing detection.
        
        Args:
            data: DataFrame with a 'url' column
            
        Returns:
            DataFrame with extracted features
        """
        if not isinstance(data, pd.DataFrame):
            data = pd.DataFrame({'url': data} if isinstance(data, str) else {'url': [data]})
        
        # Apply feature extraction to each URL
        features = data['url'].apply(self.extract_url_features)
        
        return features
    
    def extract_url_features(self, url):
        """Extract features from a single URL.
        
        Args:
            url: URL string
            
        Returns:
            str: Processed URL with extracted features
        """
        # For simplicity, we'll just return the URL itself
        # In a production system, you would extract various features like:
        # - Domain length
        # - Number of subdomains
        # - Presence of suspicious keywords
        # - TLD type
        # - Use of URL shorteners
        # - etc.
        
        # Basic cleaning
        url = str(url).strip().lower()
        
        # Add some basic feature extraction here if needed
        # For now, we'll just return the URL as the model will use TF-IDF
        return url

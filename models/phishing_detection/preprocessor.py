import re
import numpy as np
import pandas as pd
from urllib.parse import urlparse
import tldextract

class Preprocessor:
    """Preprocessor for phishing detection model.
    
    Extracts URL features for phishing detection, including lexical features, 
    domain-based features, and path-based features. These features are used 
    to identify potential phishing URLs with high accuracy.
    """
    
    def __init__(self):
        self.feature_columns = [
            'url_length',
            'domain_length',
            'path_length',
            'domain_token_count',
            'path_token_count',
            'has_ip_address',
            'has_at_symbol',
            'has_double_slash',
            'has_dash_in_domain',
            'has_multiple_subdomains',
            'is_https',
            'domain_to_path_ratio',
            'digit_count',
            'digit_to_letter_ratio',
            'special_char_count'
        ]
    
    def preprocess(self, data):
        """Preprocess URL data for model input.
        
        Args:
            data: Dictionary or DataFrame containing 'url' field
            
        Returns:
            DataFrame with extracted features ready for model input
        """
        # Handle different input formats
        if isinstance(data, dict):
            # Single URL as dictionary
            if 'url' in data:
                df = pd.DataFrame([data])
            else:
                raise ValueError("Input dictionary must contain 'url' key")
        elif isinstance(data, pd.DataFrame):
            # DataFrame with multiple URLs
            if 'url' not in data.columns:
                raise ValueError("Input DataFrame must contain 'url' column")
            df = data.copy()
        elif isinstance(data, str):
            # Single URL as string
            df = pd.DataFrame([{'url': data}])
        else:
            raise ValueError("Input must be a string, dictionary with 'url' key, or DataFrame with 'url' column")
        
        # Extract features
        return self.feature_engineering(df)
    
    def feature_engineering(self, data):
        """Extract features from URL data.
        
        Args:
            data: DataFrame containing 'url' column
            
        Returns:
            DataFrame with extracted features
        """
        df = data.copy()
        
        # Apply feature extraction to each URL
        features = pd.DataFrame()
        features['url_length'] = df['url'].apply(len)
        features['domain_length'] = df['url'].apply(self._get_domain_length)
        features['path_length'] = df['url'].apply(self._get_path_length)
        features['domain_token_count'] = df['url'].apply(self._get_domain_token_count)
        features['path_token_count'] = df['url'].apply(self._get_path_token_count)
        features['has_ip_address'] = df['url'].apply(self._has_ip_address)
        features['has_at_symbol'] = df['url'].apply(lambda x: 1 if '@' in x else 0)
        features['has_double_slash'] = df['url'].apply(lambda x: 1 if '//' in x.split('://')[1] else 0)
        features['has_dash_in_domain'] = df['url'].apply(self._has_dash_in_domain)
        features['has_multiple_subdomains'] = df['url'].apply(self._has_multiple_subdomains)
        features['is_https'] = df['url'].apply(lambda x: 1 if x.startswith('https') else 0)
        features['domain_to_path_ratio'] = features['domain_length'] / (features['path_length'] + 1)
        features['digit_count'] = df['url'].apply(lambda x: sum(c.isdigit() for c in x))
        features['digit_to_letter_ratio'] = df['url'].apply(self._get_digit_to_letter_ratio)
        features['special_char_count'] = df['url'].apply(lambda x: sum(not c.isalnum() for c in x))
        
        # Ensure all feature columns exist (required for model input consistency)
        for col in self.feature_columns:
            if col not in features.columns:
                features[col] = 0
                
        # Return only the needed features in the correct order
        return features[self.feature_columns]
    
    def _get_domain_length(self, url):
        """Calculate domain length."""
        try:
            domain = urlparse(url).netloc
            return len(domain)
        except:
            return 0
    
    def _get_path_length(self, url):
        """Calculate path length."""
        try:
            path = urlparse(url).path
            return len(path)
        except:
            return 0
    
    def _get_domain_token_count(self, url):
        """Count tokens in domain."""
        try:
            domain = urlparse(url).netloc
            return len(re.split('\W+', domain))
        except:
            return 0
    
    def _get_path_token_count(self, url):
        """Count tokens in path."""
        try:
            path = urlparse(url).path
            return len(re.split('\W+', path))
        except:
            return 0
    
    def _has_ip_address(self, url):
        """Check if URL contains an IP address."""
        pattern = re.compile(
            '((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)')
        match = pattern.search(url)
        return 1 if match else 0
    
    def _has_dash_in_domain(self, url):
        """Check if domain contains dashes."""
        try:
            domain = urlparse(url).netloc
            return 1 if '-' in domain else 0
        except:
            return 0
    
    def _has_multiple_subdomains(self, url):
        """Check if URL has multiple subdomains."""
        try:
            extract = tldextract.extract(url)
            subdomain = extract.subdomain
            return 1 if subdomain.count('.') >= 1 else 0
        except:
            return 0
    
    def _get_digit_to_letter_ratio(self, url):
        """Calculate ratio of digits to letters."""
        digits = sum(c.isdigit() for c in url)
        letters = sum(c.isalpha() for c in url)
        return digits / (letters + 1)  # Adding 1 to avoid division by zero

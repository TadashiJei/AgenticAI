"""
PhishTank API client for enhancing phishing detection capabilities.

This module provides functionality to check URLs against the PhishTank database,
which is a community-driven database of phishing websites.
"""
import os
import time
import json
import hashlib
import requests
from urllib.parse import quote
from typing import Dict, Any, Optional, Tuple

# PhishTank API constants
PHISHTANK_API_URL = "https://checkurl.phishtank.com/checkurl/"
PHISHTANK_CACHE_DIR = "phishtank_cache"
CACHE_EXPIRY = 3600  # 1 hour in seconds

class PhishTankClient:
    """Client for interacting with the PhishTank API."""
    
    def __init__(self, api_key: Optional[str] = None, cache_dir: Optional[str] = None):
        """Initialize the PhishTank client.
        
        Args:
            api_key: PhishTank API key (optional, rate limits apply without key)
            cache_dir: Directory to store cache files (defaults to 'phishtank_cache')
        """
        self.api_key = api_key or os.environ.get("PHISHTANK_API_KEY")
        self.cache_dir = cache_dir or PHISHTANK_CACHE_DIR
        
        # Create cache directory if it doesn't exist
        os.makedirs(self.cache_dir, exist_ok=True)
    
    def check_url(self, url: str, use_cache: bool = True) -> Dict[str, Any]:
        """Check if a URL is in the PhishTank database.
        
        Args:
            url: URL to check
            use_cache: Whether to use cached results if available
            
        Returns:
            Dictionary with PhishTank information, including 'in_database' and 'phishing'
        """
        # Check cache first if enabled
        if use_cache:
            cached_result = self._get_from_cache(url)
            if cached_result:
                return cached_result
        
        # If not in cache or cache disabled, query API
        try:
            result = self._query_api(url)
            
            # Cache result if successful
            if use_cache and result:
                self._save_to_cache(url, result)
            
            return result
        except Exception as e:
            # Fallback to offline check if API fails
            return {
                "url": url,
                "in_database": False,
                "phishing": False,
                "verified": False,
                "from_cache": False,
                "error": str(e)
            }
    
    def _query_api(self, url: str) -> Dict[str, Any]:
        """Query the PhishTank API for a URL.
        
        Args:
            url: URL to check
            
        Returns:
            Response data from PhishTank
        """
        headers = {
            "User-Agent": "DefensysAI Phishing Detector",
            "Accept": "application/json"
        }
        
        data = {
            "url": url,
            "format": "json"
        }
        
        if self.api_key:
            data["app_key"] = self.api_key
        
        response = requests.post(
            PHISHTANK_API_URL,
            headers=headers,
            data=data,
            timeout=10  # 10 second timeout
        )
        
        if response.status_code != 200:
            raise Exception(f"PhishTank API error: {response.status_code}")
        
        response_data = response.json()
        
        # Format the response in a consistent way
        return {
            "url": url,
            "in_database": response_data.get("results", {}).get("in_database", False),
            "phishing": response_data.get("results", {}).get("phish", False),
            "verified": response_data.get("results", {}).get("verified", False),
            "verification_time": response_data.get("results", {}).get("verification_time", ""),
            "from_cache": False
        }
    
    def _get_cache_path(self, url: str) -> str:
        """Get the cache file path for a URL.
        
        Args:
            url: URL to get cache path for
            
        Returns:
            Path to cache file
        """
        # Create a unique filename based on the URL
        url_hash = hashlib.md5(url.encode()).hexdigest()
        return os.path.join(self.cache_dir, f"{url_hash}.json")
    
    def _get_from_cache(self, url: str) -> Optional[Dict[str, Any]]:
        """Get a URL check result from cache if available and not expired.
        
        Args:
            url: URL to get from cache
            
        Returns:
            Cached result or None if not found or expired
        """
        cache_path = self._get_cache_path(url)
        
        if not os.path.exists(cache_path):
            return None
        
        try:
            with open(cache_path, 'r') as f:
                cached_data = json.load(f)
            
            # Check if cache is expired
            if time.time() - cached_data.get("cache_time", 0) > CACHE_EXPIRY:
                return None
            
            # Add cache flag
            cached_data["from_cache"] = True
            return cached_data
        except:
            return None
    
    def _save_to_cache(self, url: str, data: Dict[str, Any]) -> None:
        """Save a URL check result to cache.
        
        Args:
            url: URL that was checked
            data: Response data to cache
        """
        cache_path = self._get_cache_path(url)
        
        # Add cache timestamp
        cache_data = data.copy()
        cache_data["cache_time"] = time.time()
        
        with open(cache_path, 'w') as f:
            json.dump(cache_data, f)
    
    def clear_cache(self) -> int:
        """Clear all cached results.
        
        Returns:
            Number of cache files removed
        """
        count = 0
        for filename in os.listdir(self.cache_dir):
            if filename.endswith(".json"):
                os.remove(os.path.join(self.cache_dir, filename))
                count += 1
        return count

class PhishTankEnricher:
    """Enricher that enhances phishing detection with PhishTank data."""
    
    def __init__(self, api_key: Optional[str] = None):
        """Initialize the PhishTank enricher.
        
        Args:
            api_key: PhishTank API key (optional)
        """
        self.client = PhishTankClient(api_key)
    
    def enrich_prediction(self, url: str, model_prediction: float) -> Dict[str, Any]:
        """Enrich a model prediction with PhishTank data.
        
        Args:
            url: URL that was checked
            model_prediction: Model's prediction probability
            
        Returns:
            Enhanced prediction with PhishTank data
        """
        # Get PhishTank data
        phishtank_data = self.client.check_url(url)
        
        # Combine model prediction with PhishTank data
        result = {
            "url": url,
            "model_prediction": {
                "is_phishing": model_prediction > 0.5,
                "confidence": float(model_prediction)
            },
            "phishtank": {
                "checked": True,
                "in_database": phishtank_data.get("in_database", False),
                "is_phishing": phishtank_data.get("phishing", False),
                "verified": phishtank_data.get("verified", False),
                "from_cache": phishtank_data.get("from_cache", False)
            }
        }
        
        # Combine the results for a final verdict
        if phishtank_data.get("in_database", False) and phishtank_data.get("phishing", False):
            # If PhishTank confirms it's phishing, trust it
            final_verdict = True
            confidence = max(0.95, float(model_prediction))  # At least 95% confidence
        elif phishtank_data.get("in_database", False) and not phishtank_data.get("phishing", False):
            # If PhishTank says it's safe and verified, reduce model confidence
            if phishtank_data.get("verified", False):
                final_verdict = model_prediction > 0.8  # Higher threshold to override PhishTank
                confidence = float(model_prediction) * 0.8  # Reduce confidence
            else:
                final_verdict = model_prediction > 0.6
                confidence = float(model_prediction) * 0.9
        else:
            # Just use model prediction
            final_verdict = model_prediction > 0.5
            confidence = float(model_prediction)
        
        result["final_verdict"] = {
            "is_phishing": final_verdict,
            "confidence": confidence
        }
        
        return result

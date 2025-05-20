"""
Version management for DefensysAI models.

This module provides functionality for tracking model versions,
managing model artifacts, and implementing semantic versioning.
"""
import os
import json
import re
import shutil
from datetime import datetime
from typing import Dict, List, Optional, Tuple

# Constants
VERSION_FILE = "versions.json"
MODEL_TYPES = ["phishing_detection", "malware_detection", "network_security"]
VERSION_PATTERN = re.compile(r'^(\d+)\.(\d+)\.(\d+)$')  # Semantic version pattern

class VersionManager:
    """Manager for model versioning and artifact management."""
    
    def __init__(self, models_dir: str):
        """Initialize the version manager.
        
        Args:
            models_dir: Root directory for all model artifacts
        """
        self.models_dir = models_dir
        self.versions_file = os.path.join(models_dir, VERSION_FILE)
        self.versions = self._load_versions()
    
    def _load_versions(self) -> Dict:
        """Load version information from disk."""
        if os.path.exists(self.versions_file):
            with open(self.versions_file, 'r') as f:
                return json.load(f)
        else:
            # Initialize with empty version history for each model type
            return {
                model_type: {
                    "current": None,
                    "history": []
                } for model_type in MODEL_TYPES
            }
    
    def _save_versions(self):
        """Save version information to disk."""
        with open(self.versions_file, 'w') as f:
            json.dump(self.versions, f, indent=2)
    
    def get_current_version(self, model_type: str) -> Optional[str]:
        """Get the current version for a model type.
        
        Args:
            model_type: Type of model (e.g., "phishing_detection")
            
        Returns:
            Current version string or None if no version exists
        """
        self._validate_model_type(model_type)
        return self.versions[model_type]["current"]
    
    def get_version_history(self, model_type: str) -> List[Dict]:
        """Get version history for a model type.
        
        Args:
            model_type: Type of model (e.g., "phishing_detection")
            
        Returns:
            List of version history entries
        """
        self._validate_model_type(model_type)
        return self.versions[model_type]["history"]
    
    def register_version(self, model_type: str, version: str, 
                          metrics: Dict, model_path: str) -> str:
        """Register a new model version.
        
        Args:
            model_type: Type of model (e.g., "phishing_detection")
            version: Semantic version string (x.y.z)
            metrics: Performance metrics dictionary
            model_path: Path to the model artifacts
            
        Returns:
            Version string of the registered model
        """
        self._validate_model_type(model_type)
        self._validate_version_string(version)
        
        # Create version archive directory
        version_dir = os.path.join(self.models_dir, model_type, f"v{version}")
        os.makedirs(version_dir, exist_ok=True)
        
        # Copy model artifacts
        if os.path.isdir(model_path):
            for item in os.listdir(model_path):
                src_path = os.path.join(model_path, item)
                dst_path = os.path.join(version_dir, item)
                if os.path.isfile(src_path):
                    shutil.copy2(src_path, dst_path)
        else:
            # Single file model
            shutil.copy2(model_path, os.path.join(version_dir, os.path.basename(model_path)))
        
        # Update version information
        timestamp = datetime.now().isoformat()
        history_entry = {
            "version": version,
            "timestamp": timestamp,
            "metrics": metrics,
            "path": version_dir
        }
        
        # Add to history
        self.versions[model_type]["history"].append(history_entry)
        
        # Set as current version
        self.versions[model_type]["current"] = version
        
        # Save changes
        self._save_versions()
        
        return version
    
    def get_next_version(self, model_type: str, 
                         update_type: str = "patch") -> str:
        """Calculate the next version based on semantic versioning.
        
        Args:
            model_type: Type of model (e.g., "phishing_detection") 
            update_type: Type of update ("major", "minor", or "patch")
            
        Returns:
            Next version string
        """
        self._validate_model_type(model_type)
        current = self.get_current_version(model_type)
        
        if current is None:
            # First version
            return "0.1.0"
        
        # Parse current version
        match = VERSION_PATTERN.match(current)
        if not match:
            raise ValueError(f"Invalid current version format: {current}")
        
        major, minor, patch = map(int, match.groups())
        
        if update_type == "major":
            return f"{major + 1}.0.0"
        elif update_type == "minor":
            return f"{major}.{minor + 1}.0"
        else:  # patch
            return f"{major}.{minor}.{patch + 1}"
    
    def get_model_path(self, model_type: str, 
                      version: Optional[str] = None) -> str:
        """Get the path to model artifacts.
        
        Args:
            model_type: Type of model (e.g., "phishing_detection")
            version: Specific version to get (defaults to current)
            
        Returns:
            Path to model artifacts
        """
        self._validate_model_type(model_type)
        
        if version is None:
            version = self.get_current_version(model_type)
            if version is None:
                raise ValueError(f"No versions exist for {model_type}")
        
        # Find version in history
        for entry in self.versions[model_type]["history"]:
            if entry["version"] == version:
                return entry["path"]
        
        raise ValueError(f"Version {version} not found for {model_type}")
    
    def _validate_model_type(self, model_type: str):
        """Validate model type."""
        if model_type not in MODEL_TYPES:
            raise ValueError(f"Invalid model type: {model_type}. "
                            f"Must be one of {MODEL_TYPES}")
    
    def _validate_version_string(self, version: str):
        """Validate semantic version string."""
        if not VERSION_PATTERN.match(version):
            raise ValueError(f"Invalid version format: {version}. "
                            f"Must be in format x.y.z")
    
    def compare_versions(self, v1: str, v2: str) -> int:
        """Compare two version strings.
        
        Args:
            v1: First version string
            v2: Second version string
            
        Returns:
            -1 if v1 < v2, 0 if v1 == v2, 1 if v1 > v2
        """
        self._validate_version_string(v1)
        self._validate_version_string(v2)
        
        v1_parts = list(map(int, v1.split('.')))
        v2_parts = list(map(int, v2.split('.')))
        
        for i in range(3):
            if v1_parts[i] < v2_parts[i]:
                return -1
            elif v1_parts[i] > v2_parts[i]:
                return 1
        
        return 0  # Versions are equal

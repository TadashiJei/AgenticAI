"""
Model Loader Utility
-------------------
Handles loading, caching, and management of ML models for the API.
"""
import os
import time
import logging
import threading
from typing import Dict, Any, Optional

# Import model classes
from models.phishing_detection.model import Model as PhishingModel
from models.malware_detection.model import Model as MalwareModel
from models.network_security.model import Model as NetworkModel

# Configure logging
logger = logging.getLogger("defensys-api.model-loader")

# Default model paths
MODEL_PATH_ENV = "DEFENSYS_MODEL_PATH"
DEFAULT_MODEL_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "models")

# Model cache with timestamps for automatic reloading
model_cache = {
    "phishing": {"model": None, "loaded_at": 0, "lock": threading.Lock()},
    "malware": {"model": None, "loaded_at": 0, "lock": threading.Lock()},
    "network": {"model": None, "loaded_at": 0, "lock": threading.Lock()},
}

# Cache TTL in seconds (refresh model every 1 hour by default)
MODEL_CACHE_TTL = int(os.environ.get("MODEL_CACHE_TTL", 3600))

def get_model_path(model_type: str) -> str:
    """Get the path to a specific model based on environment settings."""
    base_path = os.environ.get(MODEL_PATH_ENV, DEFAULT_MODEL_PATH)
    
    model_paths = {
        "phishing": os.path.join(base_path, "phishing_detection", "trained_models"),
        "malware": os.path.join(base_path, "malware_detection", "trained_models"),
        "network": os.path.join(base_path, "network_security", "trained_models"),
    }
    
    if model_type not in model_paths:
        raise ValueError(f"Unknown model type: {model_type}")
    
    return model_paths[model_type]

def load_model(model_type: str, force_reload: bool = False) -> Any:
    """
    Load a model from disk or return from cache if available.
    
    Args:
        model_type: Type of model to load ("phishing", "malware", or "network")
        force_reload: Whether to force reload the model even if cached
        
    Returns:
        Loaded model instance
    """
    if model_type not in model_cache:
        raise ValueError(f"Unknown model type: {model_type}")
    
    cache_entry = model_cache[model_type]
    
    # Check if we need to reload (model not loaded, force reload, or TTL expired)
    current_time = time.time()
    needs_reload = (cache_entry["model"] is None or 
                    force_reload or 
                    (current_time - cache_entry["loaded_at"]) > MODEL_CACHE_TTL)
    
    # If model is already loaded and doesn't need reload, return it
    if not needs_reload:
        logger.debug(f"Using cached {model_type} model")
        return cache_entry["model"]
    
    # Acquire lock to prevent multiple threads from loading the same model
    if not cache_entry["lock"].acquire(blocking=False):
        # If another thread is already loading, wait for it to finish
        logger.debug(f"Waiting for {model_type} model to be loaded by another thread")
        cache_entry["lock"].acquire()
        cache_entry["lock"].release()
        return cache_entry["model"]
    
    try:
        # Load the model based on model type
        logger.info(f"Loading {model_type} model (force_reload={force_reload})")
        model_path = get_model_path(model_type)
        
        start_time = time.time()
        
        if model_type == "phishing":
            model = PhishingModel()
        elif model_type == "malware":
            model = MalwareModel()
        elif model_type == "network":
            model = NetworkModel()
        
        # Check if model files exist
        if not os.path.exists(model_path) or len(os.listdir(model_path)) == 0:
            logger.warning(f"{model_type} model files not found at {model_path}, using demonstration mode")
            # Create demonstration model
            if model_type == "phishing":
                logger.info("Creating demonstration phishing model")
                # For demo mode, we'll use a pre-initialized model that returns sensible defaults
                model.metadata = {
                    "version": "demo-1.0.0",
                    "created_at": time.strftime("%Y-%m-%dT%H:%M:%S"),
                    "updated_at": time.strftime("%Y-%m-%dT%H:%M:%S"),
                    "is_demo": True,
                    "accuracy": 0.95,  # Fictional metrics
                    "precision": 0.96,
                    "recall": 0.94
                }
                # Initialize with a simple pipeline that can handle prediction calls
                from sklearn.ensemble import RandomForestClassifier
                from sklearn.pipeline import Pipeline
                model.model = RandomForestClassifier(n_estimators=10)
                model.pipeline = Pipeline([("classifier", model.model)])
            elif model_type == "malware":
                logger.info("Creating demonstration malware model")
                model.metadata = {"version": "demo-1.0.0", "is_demo": True}
            elif model_type == "network":
                logger.info("Creating demonstration network model")
                model.metadata = {"version": "demo-1.0.0", "is_demo": True}
            
            # Create model directory for future saves
            os.makedirs(model_path, exist_ok=True)
        else:
            # Load model from disk if files exist
            model.load(model_path)
        
        # Update cache
        cache_entry["model"] = model
        cache_entry["loaded_at"] = current_time
        cache_entry["is_demo"] = model.metadata.get("is_demo", False)
        
        load_time = time.time() - start_time
        logger.info(f"Loaded {model_type} model in {load_time:.2f} seconds")
        
        return model
    except Exception as e:
        logger.error(f"Error loading {model_type} model: {str(e)}", exc_info=True)
        raise
    finally:
        # Release lock
        cache_entry["lock"].release()

def get_phishing_model(force_reload: bool = False) -> PhishingModel:
    """Get the phishing detection model."""
    return load_model("phishing", force_reload)

def get_malware_model(force_reload: bool = False) -> MalwareModel:
    """Get the malware detection model."""
    return load_model("malware", force_reload)

def get_network_model(force_reload: bool = False) -> NetworkModel:
    """Get the network security model."""
    return load_model("network", force_reload)

def reload_all_models() -> None:
    """Reload all models from disk."""
    for model_type in model_cache.keys():
        load_model(model_type, force_reload=True)

def get_model_info(model_type: str = None) -> Dict[str, Any]:
    """
    Get information about loaded models.
    
    Args:
        model_type: Type of model to get info for, or None for all models
        
    Returns:
        Dictionary with model information
    """
    if model_type is not None:
        if model_type not in model_cache:
            raise ValueError(f"Unknown model type: {model_type}")
        
        cache_entry = model_cache[model_type]
        model = cache_entry["model"]
        
        if model is None:
            return {
                "status": "not_loaded",
                "type": model_type,
            }
        
        return {
            "status": "loaded",
            "type": model_type,
            "loaded_at": cache_entry["loaded_at"],
            "version": model.get_version() if hasattr(model, "get_version") else "unknown",
            "metadata": model.metadata if hasattr(model, "metadata") else {},
        }
    
    # Get info for all models
    result = {}
    for model_type in model_cache.keys():
        result[model_type] = get_model_info(model_type)
    
    return result

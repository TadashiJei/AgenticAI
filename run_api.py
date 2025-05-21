#!/usr/bin/env python3
"""
DefensysAI API Server
--------------------
Runner script for the DefensysAI API server.
"""
import os
import sys
import logging
import uvicorn
from api.main import app

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler("api.log")
    ]
)
logger = logging.getLogger("defensys-api-runner")

# Default configuration
DEFAULT_HOST = "127.0.0.1"
DEFAULT_PORT = 8000

def main():
    """Run the DefensysAI API server"""
    # Get host and port from environment variables or use defaults
    host = os.environ.get("DEFENSYS_API_HOST", DEFAULT_HOST)
    port = int(os.environ.get("DEFENSYS_API_PORT", DEFAULT_PORT))
    
    # Log startup information
    logger.info(f"Starting DefensysAI API server on {host}:{port}")
    logger.info(f"API documentation available at http://{host}:{port}/api/docs")
    
    # Run the server
    uvicorn.run(
        "api.main:app",
        host=host,
        port=port,
        reload=True,
        log_level="info"
    )

if __name__ == "__main__":
    main()

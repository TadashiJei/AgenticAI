"""
Phishing Detection API Endpoint
------------------------------
API endpoint for phishing detection using the DefensysAI phishing model.
"""
import time
import logging
from typing import Dict, Any, Optional, List
from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks, Query, Path
from pydantic import AnyHttpUrl

from api.models.schemas import (
    PhishingDetectionRequest,
    PhishingDetectionResponse,
    ErrorResponse
)
from api.utils.model_loader import get_phishing_model
from models.phishing_detection.model import Model as PhishingModel

# Configure logging
logger = logging.getLogger("defensys-api.phishing")

# Create router
router = APIRouter()

def get_threat_level(score: float) -> str:
    """Convert phishing score to threat level"""
    if score >= 0.9:
        return "Critical"
    elif score >= 0.7:
        return "High"
    elif score >= 0.4:
        return "Medium"
    else:
        return "Low"

@router.post(
    "/analyze",
    response_model=PhishingDetectionResponse,
    responses={
        400: {"model": ErrorResponse, "description": "Bad request"},
        500: {"model": ErrorResponse, "description": "Internal server error"}
    },
    summary="Analyze a URL for phishing indicators",
    description="Analyze a URL for phishing indicators using machine learning and optionally verify against PhishTank database."
)
async def analyze_url(
    request: PhishingDetectionRequest,
    background_tasks: BackgroundTasks
):
    """
    Analyze a URL for phishing characteristics.
    
    This endpoint uses machine learning to analyze the URL structure and characteristics
    to determine if it's likely to be a phishing URL. It can also verify against the
    PhishTank database for known phishing sites.
    """
    start_time = time.time()
    url = str(request.url)
    
    try:
        # Get the phishing model
        model = get_phishing_model()
        
        # Make direct predictions using the local model only
        predictions = model.predict(X=[None], original_urls=[url])
        prediction = predictions[0]
        
        # Get detailed analysis if requested
        analysis = None
        if request.detailed_analysis:
            # Extract URL features and get feature importance
            features = model.extract_features(url)
            
            # Get feature importance (top 10 features)
            importance = {}
            if hasattr(model, "get_feature_importance"):
                importance = model.get_feature_importance(top_n=10)
            
            analysis = {
                "features": features,
                "feature_importance": importance,
                "url_length": len(url),
                "suspicious_terms": model.contains_suspicious_terms(url),
                "entropy": model.calculate_url_entropy(url) if hasattr(model, "calculate_url_entropy") else None,
            }
        
        # Calculate detection time
        detection_time = time.time() - start_time
        
        # Create response
        response = PhishingDetectionResponse(
            status="success",
            message="URL analysis completed",
            url=url,
            is_phishing=prediction["is_phishing"],
            confidence=prediction["confidence"],
            threat_level=get_threat_level(prediction["confidence"]),
            analysis=analysis,
            detection_time=detection_time
        )
        
        # Log prediction in background
        background_tasks.add_task(
            logger.info,
            f"Phishing prediction: URL={url}, is_phishing={prediction['is_phishing']}, confidence={prediction['confidence']:.4f}"
        )
        
        return response
        
    except Exception as e:
        logger.error(f"Error analyzing URL {url}: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Error analyzing URL: {str(e)}"
        )

@router.get(
    "/batch",
    response_model=List[PhishingDetectionResponse],
    responses={
        400: {"model": ErrorResponse, "description": "Bad request"},
        500: {"model": ErrorResponse, "description": "Internal server error"}
    },
    summary="Batch analyze multiple URLs",
    description="Analyze multiple URLs in a single request for efficient processing."
)
async def batch_analyze(
    urls: List[AnyHttpUrl] = Query(..., description="URLs to analyze"),
    detailed_analysis: bool = Query(False, description="Whether to include detailed analysis")
):
    """
    Analyze multiple URLs in a single request.
    
    This endpoint is optimized for analyzing multiple URLs efficiently.
    It uses the same model and verification options as the single URL endpoint.
    """
    if len(urls) > 50:
        raise HTTPException(
            status_code=400,
            detail="Maximum of 50 URLs can be analyzed in a single batch request"
        )
    
    results = []
    
    for url in urls:
        # Create a single request and use the analyze_url endpoint
        request = PhishingDetectionRequest(
            url=url,
            detailed_analysis=detailed_analysis
        )
        
        try:
            # Reuse the analyze_url function for each URL
            result = await analyze_url(request, BackgroundTasks())
            results.append(result)
        except HTTPException as e:
            # If one URL fails, add error response but continue with others
            logger.warning(f"Error analyzing URL {url} in batch: {str(e)}")
            results.append(
                PhishingDetectionResponse(
                    status="error",
                    message=f"Error analyzing URL: {str(e)}",
                    url=str(url),
                    is_phishing=False,
                    confidence=0.0,
                    threat_level="Unknown",
                    detection_time=0.0
                )
            )
    
    return results

@router.get(
    "/check/{url:path}",
    response_model=PhishingDetectionResponse,
    responses={
        400: {"model": ErrorResponse, "description": "Bad request"},
        500: {"model": ErrorResponse, "description": "Internal server error"}
    },
    summary="Quick check URL for phishing",
    description="Simplified endpoint to check if a URL is a phishing site."
)
async def quick_check(
    url: str = Path(..., description="URL to check (can be path-encoded)")
):
    """
    Quick check if a URL is a phishing site.
    
    This is a simplified endpoint that takes a URL path parameter and returns
    a quick assessment of whether it's a phishing URL.
    """
    try:
        # Convert URL string to HttpUrl for validation
        from pydantic import AnyHttpUrl, ValidationError
        
        try:
            # Validate URL
            validated_url = AnyHttpUrl(url)
        except ValidationError:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid URL format: {url}"
            )
        
        # Create a request object and use the analyze_url function
        request = PhishingDetectionRequest(
            url=validated_url,
            detailed_analysis=False
        )
        
        return await analyze_url(request, BackgroundTasks())
        
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        logger.error(f"Error in quick check for URL {url}: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Error checking URL: {str(e)}"
        )

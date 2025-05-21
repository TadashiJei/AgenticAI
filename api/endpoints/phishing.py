"""
Phishing Detection API Endpoint
------------------------------
API endpoint for phishing detection using the DefensysAI phishing model.
"""
import time
import logging
from typing import Dict, Any, Optional, List, Union
from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks, Query, Path, Request
from pydantic import AnyHttpUrl
from starlette.concurrency import run_in_threadpool

# Import API components
from api.models.schemas import (
    PhishingDetectionRequest,
    PhishingDetectionResponse,
    ErrorResponse
)
from api.utils.model_loader import get_phishing_model
from models.phishing_detection.model import Model as PhishingModel

# Import optimization & configuration utilities
from api.utils.optimization import cache_response, cleanup_cache, get_resource_config
from api.utils.preprocessing import normalize_url, extract_url_features
from api.config import MAX_BATCH_SIZE, FEATURE_FLAGS

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
        429: {"model": ErrorResponse, "description": "Rate limit exceeded"},
        500: {"model": ErrorResponse, "description": "Internal server error"}
    },
    summary="Analyze a URL for phishing indicators",
    description="Analyze a URL for phishing indicators using machine learning with optimized performance."
)
@cache_response(ttl=300)  # Cache responses for 5 minutes
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
    
    # Normalize URL to improve cache hits
    normalized_url = normalize_url(url)
    
    try:
        # Run prediction in threadpool to avoid blocking the event loop
        async def predict():
            # Get the phishing model
            model = get_phishing_model()
            
            # Extract features from the URL using common preprocessing
            preprocessed_features = extract_url_features(normalized_url)
            
            # Make direct predictions using the local model only
            predictions = await run_in_threadpool(
                lambda: model.predict(X=[preprocessed_features], original_urls=[normalized_url])
            )
            return predictions[0]
        
        # Run prediction
        prediction = await predict()
        
        # Get detailed analysis if requested (also run in threadpool)
        analysis = None
        if request.detailed_analysis:
            async def get_detailed_analysis():
                # Get model again to ensure we have it in this thread
                model = get_phishing_model()
                
                # Extract URL features using common preprocessing utility
                features = await run_in_threadpool(
                    lambda: model.extract_features(normalized_url)
                )
                
                # Get feature importance (top 10 features)
                importance = {}
                if hasattr(model, "get_feature_importance"):
                    importance = await run_in_threadpool(
                        lambda: model.get_feature_importance(top_n=10)
                    )
                
                # Get suspicious terms detection
                suspicious_terms = await run_in_threadpool(
                    lambda: model.contains_suspicious_terms(normalized_url)
                )
                
                # Calculate entropy if available
                entropy = None
                if hasattr(model, "calculate_url_entropy"):
                    entropy = await run_in_threadpool(
                        lambda: model.calculate_url_entropy(normalized_url)
                    )
                
                return {
                    "features": features,
                    "feature_importance": importance,
                    "url_length": len(normalized_url),
                    "suspicious_terms": suspicious_terms,
                    "entropy": entropy,
                    "normalized_url": normalized_url != url  # Indicate if URL was normalized
                }
            
            # Get detailed analysis
            analysis = await get_detailed_analysis()
        
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
        429: {"model": ErrorResponse, "description": "Rate limit exceeded"},
        500: {"model": ErrorResponse, "description": "Internal server error"}
    },
    summary="Batch analyze multiple URLs",
    description="Analyze multiple URLs in a single request with optimized parallel processing."
)
@cache_response(ttl=600)  # Cache batch results for 10 minutes
async def batch_analyze(
    urls: List[AnyHttpUrl] = Query(..., description="URLs to analyze"),
    detailed_analysis: bool = Query(False, description="Whether to include detailed analysis")
):
    """
    Analyze multiple URLs in a single request.
    
    This endpoint is optimized for analyzing multiple URLs efficiently with parallel processing.
    It uses the same model and preprocessing as the single URL endpoint.
    """
    # Get max batch size from configuration
    if len(urls) > MAX_BATCH_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"Maximum of {MAX_BATCH_SIZE} URLs can be analyzed in a single batch request"
        )
    
    # Process URLs in parallel using asyncio.gather for better performance
    import asyncio
    
    async def process_single_url(url):
        # Create a request object
        request = PhishingDetectionRequest(
            url=url,
            detailed_analysis=detailed_analysis
        )
        
        try:
            # Use the analyze_url function but bypass its caching
            # to avoid double-caching (batch endpoint already has its own cache)
            bt = BackgroundTasks()
            result = await analyze_url.__wrapped__(request, bt)
            return result
        except Exception as e:
            # If one URL fails, add error response but continue with others
            logger.warning(f"Error analyzing URL {url} in batch: {str(e)}")
            return PhishingDetectionResponse(
                status="error",
                message=f"Error analyzing URL: {str(e)}",
                url=str(url),
                is_phishing=False,
                confidence=0.0,
                threat_level="Unknown",
                detection_time=0.0
            )
    
    # Process all URLs in parallel
    start_time = time.time()
    results = await asyncio.gather(*[process_single_url(url) for url in urls])
    
    # Log batch processing time
    total_time = time.time() - start_time
    logger.info(f"Batch processed {len(urls)} URLs in {total_time:.2f} seconds")
    
    return results

@router.get(
    "/check/{url:path}",
    response_model=PhishingDetectionResponse,
    responses={
        400: {"model": ErrorResponse, "description": "Bad request"},
        429: {"model": ErrorResponse, "description": "Rate limit exceeded"},
        500: {"model": ErrorResponse, "description": "Internal server error"}
    },
    summary="Quick check URL for phishing",
    description="Optimized endpoint to quickly check if a URL is a phishing site."
)
@cache_response(ttl=3600)  # Cache quick check results for 1 hour (longer cache for simpler endpoint)
async def quick_check(
    url: str = Path(..., description="URL to check (can be path-encoded)"),
    request: Request = None
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

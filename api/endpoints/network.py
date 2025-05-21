"""
Network Security API Endpoint
----------------------------
API endpoint for network traffic analysis using the DefensysAI network security model.
"""
import time
import logging
import asyncio
from typing import Dict, Any, Optional, List, Generator
from fastapi import (
    APIRouter, 
    HTTPException, 
    Depends, 
    BackgroundTasks, 
    Request,
    WebSocket,
    WebSocketDisconnect,
    Query
)
from fastapi.responses import StreamingResponse
import pandas as pd
import numpy as np
import json

from api.models.schemas import (
    NetworkSecurityRequest,
    NetworkSecurityResponse,
    NetworkTrafficEntry,
    ThreatInfo,
    ErrorResponse
)
from api.utils.model_loader import get_network_model
from models.network_security.model import Model as NetworkModel
from models.network_security.preprocessor import Preprocessor as NetworkPreprocessor

# Configure logging
logger = logging.getLogger("defensys-api.network")

# Create router
router = APIRouter()

# Initialize preprocessor
network_preprocessor = NetworkPreprocessor()

def get_threat_level(score: float) -> str:
    """Convert threat score to threat level"""
    if score >= 0.9:
        return "Critical"
    elif score >= 0.7:
        return "High"
    elif score >= 0.4:
        return "Medium"
    else:
        return "Low"

def analyze_traffic_entries(
    traffic: List[NetworkTrafficEntry], 
    detection_mode: str
) -> Dict[str, Any]:
    """
    Analyze network traffic entries and detect potential threats.
    
    Args:
        traffic: List of network traffic entries
        detection_mode: Detection sensitivity mode
        
    Returns:
        Analysis results with threat information
    """
    start_time = time.time()
    
    # Convert traffic entries to DataFrame
    df = pd.DataFrame([entry.dict() for entry in traffic])
    
    # Get the network security model
    model = get_network_model()
    
    # Preprocess the traffic data
    features = network_preprocessor.preprocess(df)
    
    # Adjust detection thresholds based on mode
    threshold_map = {
        "normal": 0.7,      # Only high confidence predictions
        "sensitive": 0.5,   # Medium confidence predictions
        "aggressive": 0.3   # More aggressive detection
    }
    detection_threshold = threshold_map.get(detection_mode, 0.7)
    
    # Get detailed predictions
    predictions = model.predict_with_details(features)
    
    # Find attacks and gather threat information
    threats = []
    attack_indices = []
    
    for i, pred in enumerate(predictions):
        # Check if prediction confidence exceeds threshold
        if pred["is_attack"] and pred["confidence"] >= detection_threshold:
            attack_indices.append(i)
            
            # Get information about the affected IPs
            src_ip = traffic[i].src_ip
            dst_ip = traffic[i].dst_ip
            
            # Determine threat type (simplified for now)
            if traffic[i].protocol == "TCP" and "syn_flag_count" in df.columns and df["syn_flag_count"].iloc[i] > 5:
                threat_type = "Port Scan"
            elif traffic[i].bytes_out > 100000 and traffic[i].bytes_in < 1000:
                threat_type = "Data Exfiltration"
            elif traffic[i].protocol == "ICMP" and traffic[i].packets_out > 100:
                threat_type = "ICMP Flood"
            else:
                threat_type = "Suspicious Traffic"
            
            # Create a threat info object
            threat = ThreatInfo(
                threat_type=threat_type,
                confidence=pred["confidence"],
                severity=get_threat_level(pred["confidence"]),
                affected_ips=[src_ip, dst_ip],
                description=f"Detected {threat_type.lower()} from {src_ip} to {dst_ip}",
                recommendation="Monitor this traffic and consider blocking if suspicious"
            )
            
            threats.append(threat)
    
    # Calculate summary statistics for the traffic
    traffic_summary = {
        "total_entries": len(traffic),
        "total_threats": len(threats),
        "threat_percentage": len(threats) / len(traffic) * 100 if traffic else 0,
        "detection_mode": detection_mode,
        "detection_threshold": detection_threshold,
        "protocols": df["protocol"].value_counts().to_dict() if "protocol" in df.columns else {},
        "total_traffic_bytes": int(df["bytes_in"].sum() + df["bytes_out"].sum()) if "bytes_in" in df.columns and "bytes_out" in df.columns else 0,
        "unique_source_ips": df["src_ip"].nunique() if "src_ip" in df.columns else 0,
        "unique_destination_ips": df["dst_ip"].nunique() if "dst_ip" in df.columns else 0
    }
    
    # Calculate analysis time
    analysis_time = time.time() - start_time
    
    # Return the analysis results
    return {
        "analyzed_entries": len(traffic),
        "threats_detected": len(threats),
        "analysis_time": analysis_time,
        "threats": threats,
        "traffic_summary": traffic_summary
    }

@router.post(
    "/analyze",
    response_model=NetworkSecurityResponse,
    responses={
        400: {"model": ErrorResponse, "description": "Bad request"},
        500: {"model": ErrorResponse, "description": "Internal server error"}
    },
    summary="Analyze network traffic for security threats",
    description="Analyze network traffic data for potential security threats and anomalies."
)
async def analyze_network_traffic(
    request: NetworkSecurityRequest,
    background_tasks: BackgroundTasks
):
    """
    Analyze network traffic for security threats.
    
    This endpoint accepts network traffic data and analyzes it for security
    threats and anomalies using machine learning.
    """
    try:
        # Analyze the traffic
        results = analyze_traffic_entries(request.traffic, request.detection_mode)
        
        # Create response
        response = NetworkSecurityResponse(
            status="success",
            message="Network traffic analysis completed",
            analyzed_entries=results["analyzed_entries"],
            threats_detected=results["threats_detected"],
            analysis_time=results["analysis_time"],
            threats=results["threats"],
            traffic_summary=results["traffic_summary"]
        )
        
        # Log results in background
        background_tasks.add_task(
            logger.info,
            f"Network analysis: {results['threats_detected']} threats detected in {results['analyzed_entries']} entries"
        )
        
        return response
        
    except Exception as e:
        logger.error(f"Error analyzing network traffic: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Error analyzing network traffic: {str(e)}"
        )

@router.post(
    "/stream",
    responses={
        200: {"content": {"application/json": {}}, "description": "Stream of analysis results"},
        400: {"model": ErrorResponse, "description": "Bad request"},
        500: {"model": ErrorResponse, "description": "Internal server error"}
    },
    summary="Stream analysis of network traffic",
    description="Stream analysis results as network traffic is processed in real-time."
)
async def stream_analysis(
    request: NetworkSecurityRequest
):
    """
    Stream analysis of network traffic.
    
    This endpoint accepts network traffic data and streams analysis results
    as the data is processed. This is useful for real-time monitoring.
    """
    try:
        # Convert traffic entries to DataFrame
        df = pd.DataFrame([entry.dict() for entry in request.traffic])
        
        # Get the network security model
        model = get_network_model()
        
        # Batch size for processing
        batch_size = 10
        
        # Preprocess the traffic data
        features = network_preprocessor.preprocess(df)
        
        # Define async generator for streaming results
        async def generate_results():
            """Generate streaming results for network analysis"""
            # Split data into batches
            total_entries = len(features)
            batch_count = (total_entries + batch_size - 1) // batch_size
            
            threats_detected = 0
            start_time = time.time()
            
            # Process each batch
            for i in range(batch_count):
                # Get batch slice
                start_idx = i * batch_size
                end_idx = min((i + 1) * batch_size, total_entries)
                batch_features = features.iloc[start_idx:end_idx]
                
                # Get predictions for batch
                batch_predictions = model.predict_with_details(batch_features)
                
                # Process predictions
                batch_results = []
                for j, pred in enumerate(batch_predictions):
                    entry_idx = start_idx + j
                    if entry_idx < len(request.traffic):
                        entry = request.traffic[entry_idx]
                        
                        if pred["is_attack"]:
                            threats_detected += 1
                            
                            # Create result entry
                            result = {
                                "entry_id": entry_idx,
                                "src_ip": entry.src_ip,
                                "dst_ip": entry.dst_ip,
                                "is_threat": True,
                                "confidence": pred["confidence"],
                                "threat_level": get_threat_level(pred["confidence"]),
                                "timestamp": time.time()
                            }
                            
                            batch_results.append(result)
                
                # If threats were detected in this batch, yield them
                if batch_results:
                    # Yield JSON-encoded batch results
                    yield json.dumps({
                        "batch": i + 1,
                        "total_batches": batch_count,
                        "threats_in_batch": len(batch_results),
                        "total_threats_detected": threats_detected,
                        "results": batch_results
                    }) + "\\n"
                
                # Add a small delay to simulate real-time processing
                await asyncio.sleep(0.1)
            
            # Yield summary at the end
            analysis_time = time.time() - start_time
            yield json.dumps({
                "summary": {
                    "total_entries": total_entries,
                    "total_threats": threats_detected,
                    "analysis_time": analysis_time,
                    "detection_mode": request.detection_mode,
                    "completed": True
                }
            }) + "\\n"
                    
        # Return streaming response
        return StreamingResponse(
            generate_results(),
            media_type="application/json",
            headers={"X-Accel-Buffering": "no"}  # Disable buffering for NGINX
        )
        
    except Exception as e:
        logger.error(f"Error streaming network analysis: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Error streaming network analysis: {str(e)}"
        )

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """
    WebSocket endpoint for real-time network traffic analysis.
    
    This endpoint accepts network traffic data via WebSocket and sends
    analysis results in real-time. This is useful for interactive dashboards
    and monitoring tools.
    """
    await websocket.accept()
    
    try:
        # Get the network security model
        model = get_network_model()
        
        # Keep connection open and process messages
        while True:
            # Receive JSON data
            data = await websocket.receive_text()
            
            try:
                # Parse message
                message = json.loads(data)
                
                # Check message type
                if message.get("type") == "traffic":
                    # Parse traffic entries
                    try:
                        traffic_data = message.get("data", [])
                        traffic = [NetworkTrafficEntry(**entry) for entry in traffic_data]
                        detection_mode = message.get("detection_mode", "normal")
                        
                        # Analyze traffic
                        start_time = time.time()
                        df = pd.DataFrame([entry.dict() for entry in traffic])
                        features = network_preprocessor.preprocess(df)
                        predictions = model.predict_with_details(features)
                        
                        # Find threats
                        threats = []
                        for i, pred in enumerate(predictions):
                            if pred["is_attack"] and i < len(traffic):
                                # Get information about the affected IPs
                                src_ip = traffic[i].src_ip
                                dst_ip = traffic[i].dst_ip
                                
                                # Add to threats
                                threats.append({
                                    "entry_id": i,
                                    "src_ip": src_ip,
                                    "dst_ip": dst_ip,
                                    "confidence": pred["confidence"],
                                    "threat_level": get_threat_level(pred["confidence"])
                                })
                        
                        # Send response
                        await websocket.send_json({
                            "type": "analysis",
                            "analyzed_entries": len(traffic),
                            "threats_detected": len(threats),
                            "analysis_time": time.time() - start_time,
                            "threats": threats
                        })
                        
                    except Exception as e:
                        # Send error response
                        await websocket.send_json({
                            "type": "error",
                            "message": f"Error analyzing traffic: {str(e)}"
                        })
                
                elif message.get("type") == "ping":
                    # Ping-pong to keep connection alive
                    await websocket.send_json({
                        "type": "pong",
                        "timestamp": time.time()
                    })
                
                else:
                    # Unknown message type
                    await websocket.send_json({
                        "type": "error",
                        "message": "Unknown message type"
                    })
                    
            except json.JSONDecodeError:
                # Invalid JSON
                await websocket.send_json({
                    "type": "error",
                    "message": "Invalid JSON data"
                })
            except Exception as e:
                # Other errors
                logger.error(f"WebSocket error: {str(e)}", exc_info=True)
                await websocket.send_json({
                    "type": "error",
                    "message": f"Error: {str(e)}"
                })
                
    except WebSocketDisconnect:
        logger.info("WebSocket client disconnected")
    except Exception as e:
        logger.error(f"WebSocket error: {str(e)}", exc_info=True)

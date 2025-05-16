#!/usr/bin/env python
"""
Test script for DefensysAI API endpoints.
This script sets up a simple HTTP server to test the API endpoints locally.
"""
import os
import sys
import json
import http.server
import socketserver
from urllib.parse import urlparse, parse_qs

# Make sure we can import from the api directory
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import handlers from API endpoints
from api.index import handler as index_handler
from api.phishing import handler as phishing_handler
from api.malware import handler as malware_handler
from api.network import handler as network_handler

PORT = 8000

class TestAPIHandler(http.server.BaseHTTPRequestHandler):
    def _send_cors_headers(self):
        """Send CORS headers for cross-origin requests."""
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
    
    def do_OPTIONS(self):
        """Handle preflight CORS requests."""
        self.send_response(200)
        self._send_cors_headers()
        self.end_headers()
    
    def do_GET(self):
        path = urlparse(self.path).path
        
        if path == '/' or path == '/api':
            # Use the index handler
            try:
                index_handler.do_GET(self)
            except Exception as e:
                # Add CORS headers
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self._send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps({'status': 'healthy', 'message': 'DefensysAI API is running'}).encode())
        elif path == '/api/phishing':
            # Use the phishing handler
            try:
                phishing_handler.do_GET(self)
            except Exception as e:
                # Add CORS headers manually if handler fails
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self._send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps({'service': 'phishing detection', 'status': 'available'}).encode())
        elif path == '/api/malware':
            # Use the malware handler
            try:
                malware_handler.do_GET(self)
            except Exception as e:
                # Add CORS headers manually if handler fails
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self._send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps({'service': 'malware detection', 'status': 'available'}).encode())
        elif path == '/api/network':
            # Use the network handler
            try:
                network_handler.do_GET(self)
            except Exception as e:
                # Add CORS headers manually if handler fails
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self._send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps({'service': 'network security', 'status': 'available'}).encode())
        else:
            self.send_response(404)
            self.send_header('Content-type', 'application/json')
            self._send_cors_headers()
            self.end_headers()
            self.wfile.write(json.dumps({'error': 'Not found'}).encode())
    
    def do_POST(self):
        path = urlparse(self.path).path
        
        if path == '/api/phishing':
            # Use the phishing handler
            try:
                # Monkey patch the send_header method to add CORS headers
                original_send_header = self.send_header
                def patched_send_header(keyword, value):
                    original_send_header(keyword, value)
                    if keyword == 'Content-type':
                        self._send_cors_headers()
                self.send_header = patched_send_header
                
                phishing_handler.do_POST(self)
                
                # Restore original method
                self.send_header = original_send_header
            except Exception as e:
                # Handle errors
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self._send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode())
        elif path == '/api/malware':
            # Use the malware handler with CORS headers
            try:
                # Monkey patch the send_header method to add CORS headers
                original_send_header = self.send_header
                def patched_send_header(keyword, value):
                    original_send_header(keyword, value)
                    if keyword == 'Content-type':
                        self._send_cors_headers()
                self.send_header = patched_send_header
                
                malware_handler.do_POST(self)
                
                # Restore original method
                self.send_header = original_send_header
            except Exception as e:
                # Handle errors
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self._send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode())
        elif path == '/api/network':
            # Use the network handler with CORS headers
            try:
                # Monkey patch the send_header method to add CORS headers
                original_send_header = self.send_header
                def patched_send_header(keyword, value):
                    original_send_header(keyword, value)
                    if keyword == 'Content-type':
                        self._send_cors_headers()
                self.send_header = patched_send_header
                
                network_handler.do_POST(self)
                
                # Restore original method
                self.send_header = original_send_header
            except Exception as e:
                # Handle errors
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self._send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode())
        else:
            self.send_response(404)
            self.send_header('Content-type', 'application/json')
            self._send_cors_headers()
            self.end_headers()
            self.wfile.write(json.dumps({'error': 'Not found'}).encode())

def run_server():
    """Run the test server."""
    # Create the directory structure if it doesn't exist
    os.makedirs('saved_models', exist_ok=True)
    
    # Start the server
    with socketserver.TCPServer(("", PORT), TestAPIHandler) as httpd:
        print(f"Serving at http://localhost:{PORT}")
        print(f"API endpoints:")
        print(f"  - GET  /api")
        print(f"  - GET  /api/phishing")
        print(f"  - POST /api/phishing")
        print(f"  - GET  /api/malware")
        print(f"  - POST /api/malware")
        print(f"  - GET  /api/network")
        print(f"  - POST /api/network")
        httpd.serve_forever()

if __name__ == "__main__":
    run_server()

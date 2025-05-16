/**
 * DefensysAI Client Integration Example
 * 
 * This file demonstrates how to integrate with the DefensysAI API endpoints
 * from a JavaScript client application.
 */

// Base URL for the API (replace with your actual Vercel deployment URL)
const API_BASE_URL = 'https://defensys-ai.vercel.app/api';

/**
 * Check if a URL is a phishing attempt
 * @param {string} url - The URL to check
 * @returns {Promise} - Promise resolving to the API response
 */
async function checkPhishing(url) {
  try {
    const response = await fetch(`${API_BASE_URL}/phishing`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error checking phishing:', error);
    throw error;
  }
}

/**
 * Scan a file for malware
 * @param {File} file - The file object to scan
 * @returns {Promise} - Promise resolving to the API response
 */
async function scanFileForMalware(file) {
  try {
    // Convert file to base64
    const fileData = await fileToBase64(file);
    
    const response = await fetch(`${API_BASE_URL}/malware`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ file_data: fileData }),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error scanning file:', error);
    throw error;
  }
}

/**
 * Analyze network traffic for security threats
 * @param {Object} networkData - Network traffic data
 * @returns {Promise} - Promise resolving to the API response
 */
async function analyzeNetworkTraffic(networkData) {
  try {
    const response = await fetch(`${API_BASE_URL}/network`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ network_data: networkData }),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error analyzing network traffic:', error);
    throw error;
  }
}

/**
 * Helper function to convert a file to base64
 * @param {File} file - The file to convert
 * @returns {Promise<string>} - Promise resolving to base64 string
 */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
}

/**
 * Example usage in a React component
 */
/*
import React, { useState } from 'react';

function SecurityScanner() {
  const [url, setUrl] = useState('');
  const [urlResult, setUrlResult] = useState(null);
  const [file, setFile] = useState(null);
  const [fileResult, setFileResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleUrlCheck = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await checkPhishing(url);
      setUrlResult(result);
    } catch (error) {
      console.error('Error:', error);
      setUrlResult({ error: 'Failed to check URL' });
    }
    setIsLoading(false);
  };
  
  const handleFileUpload = (e) => {
    setFile(e.target.files[0]);
  };
  
  const handleFileScan = async (e) => {
    e.preventDefault();
    if (!file) return;
    
    setIsLoading(true);
    try {
      const result = await scanFileForMalware(file);
      setFileResult(result);
    } catch (error) {
      console.error('Error:', error);
      setFileResult({ error: 'Failed to scan file' });
    }
    setIsLoading(false);
  };
  
  return (
    <div className="security-scanner">
      <h2>DefensysAI Security Scanner</h2>
      
      <div className="phishing-scanner">
        <h3>Phishing URL Scanner</h3>
        <form onSubmit={handleUrlCheck}>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL to check"
            required
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Checking...' : 'Check URL'}
          </button>
        </form>
        
        {urlResult && (
          <div className="result">
            <h4>Result:</h4>
            {urlResult.error ? (
              <p className="error">{urlResult.error}</p>
            ) : (
              <div>
                <p className={urlResult.is_phishing ? 'danger' : 'safe'}>
                  {urlResult.is_phishing ? '⚠️ Phishing detected!' : '✅ URL is safe'}
                </p>
                <p>Confidence: {(urlResult.confidence * 100).toFixed(2)}%</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="malware-scanner">
        <h3>Malware File Scanner</h3>
        <form onSubmit={handleFileScan}>
          <input
            type="file"
            onChange={handleFileUpload}
            required
          />
          <button type="submit" disabled={isLoading || !file}>
            {isLoading ? 'Scanning...' : 'Scan File'}
          </button>
        </form>
        
        {fileResult && (
          <div className="result">
            <h4>Result:</h4>
            {fileResult.error ? (
              <p className="error">{fileResult.error}</p>
            ) : (
              <div>
                <p className={fileResult.is_malware ? 'danger' : 'safe'}>
                  {fileResult.is_malware ? '⚠️ Malware detected!' : '✅ File is safe'}
                </p>
                <p>Confidence: {(fileResult.confidence * 100).toFixed(2)}%</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SecurityScanner;
*/

// Export the functions for use in your application
export {
  checkPhishing,
  scanFileForMalware,
  analyzeNetworkTraffic
};

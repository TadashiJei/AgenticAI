# DefensysAI - ML Security Models Integration

This repository contains the machine learning models and API endpoints for the DefensysAI security system, which includes:

1. **Phishing Detection** - Identifies potential phishing URLs
2. **Malware Detection** - Scans files and system metrics for malware
3. **Network Security** - Analyzes network traffic for security threats

## Project Structure

```
DefensysAI/
├── api/                      # Vercel serverless API endpoints
│   ├── index.py              # Main API entry point
│   ├── phishing.py           # Phishing detection endpoint
│   ├── malware.py            # Malware detection endpoint
│   └── network.py            # Network security endpoint
├── models/                   # ML model modules (generated from notebooks)
│   ├── phishing_detection/   # Phishing detection model
│   ├── malware_detection/    # Malware detection model
│   └── network_security/     # Network security model
├── saved_models/             # Trained model files
├── components/               # Original Jupyter notebooks
│   └── model/                # ML model notebooks
├── convert_notebooks.py      # Script to convert notebooks to Python modules
├── client-integration.js     # Example client-side integration
├── requirements.txt          # Python dependencies
└── vercel.json               # Vercel deployment configuration
```

## Integration Steps

### 1. Convert Notebooks to Production Code

First, convert the Jupyter notebooks to Python modules:

```bash
python convert_notebooks.py
```

This will create the `models` directory with structured Python modules for each security model.

### 2. Deploy to Vercel

The project is configured for Vercel deployment:

1. Install the Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy the project:
   ```bash
   vercel
   ```

4. For production deployment:
   ```bash
   vercel --prod
   ```

### 3. Client-Side Integration

The `client-integration.js` file provides example functions for integrating with the API endpoints:

```javascript
// Import the client functions
import { checkPhishing, scanFileForMalware, analyzeNetworkTraffic } from './client-integration.js';

// Check a URL for phishing
checkPhishing('https://example.com')
  .then(result => {
    if (result.is_phishing) {
      console.log('Warning: Phishing detected!');
    } else {
      console.log('URL is safe');
    }
  });

// Scan a file for malware
const fileInput = document.getElementById('file-input');
fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  const result = await scanFileForMalware(file);
  
  if (result.is_malware) {
    console.log('Warning: Malware detected!');
  } else {
    console.log('File is safe');
  }
});

// Analyze network traffic
const networkData = {
  // Network traffic data
};
analyzeNetworkTraffic(networkData)
  .then(result => {
    if (result.is_attack) {
      console.log('Warning: Network attack detected!');
    } else {
      console.log('Network traffic is normal');
    }
  });
```

## API Endpoints

### Phishing Detection

**Endpoint:** `/api/phishing`

**Method:** POST

**Request Body:**
```json
{
  "url": "https://example.com"
}
```

**Response:**
```json
{
  "url": "https://example.com",
  "is_phishing": false,
  "confidence": 0.98,
  "status": "success"
}
```

### Malware Detection

**Endpoint:** `/api/malware`

**Method:** POST

**Request Body:**
```json
{
  "file_data": "base64_encoded_file_data"
}
```

or

```json
{
  "metrics": {
    // System metrics
  }
}
```

**Response:**
```json
{
  "is_malware": false,
  "confidence": 0.99,
  "status": "success"
}
```

### Network Security

**Endpoint:** `/api/network`

**Method:** POST

**Request Body:**
```json
{
  "network_data": {
    // Network traffic data
  }
}
```

**Response:**
```json
{
  "is_attack": false,
  "confidence": 0.97,
  "status": "success"
}
```

## Performance Considerations

- The first request to each serverless function may experience cold start latency
- For production use with high traffic, consider using Vercel's Enterprise plan for better performance
- Large file uploads should be handled with care, as serverless functions have execution time limits

## Security Considerations

- API endpoints should be protected with authentication for production use
- Consider implementing rate limiting to prevent abuse
- Sensitive data should be encrypted in transit and at rest
- Regularly update the ML models with new training data to maintain accuracy

## Troubleshooting

If you encounter issues with the deployment:

1. Check the Vercel logs for error messages
2. Ensure all dependencies are correctly specified in `requirements.txt`
3. Verify that the model files are correctly saved and accessible
4. For large models, consider using model compression techniques to meet serverless size limits

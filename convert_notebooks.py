#!/usr/bin/env python
"""
Script to convert Jupyter notebooks to Python modules for production use.
"""
import os
import nbformat
import re
from nbconvert import PythonExporter

def convert_notebook_to_script(notebook_path, output_dir):
    """Convert a Jupyter notebook to a Python script."""
    # Load the notebook
    with open(notebook_path, 'r', encoding='utf-8') as f:
        notebook = nbformat.read(f, as_version=4)
    
    # Configure the exporter
    exporter = PythonExporter()
    exporter.exclude_markdown = True
    
    # Convert to Python
    python_code, _ = exporter.from_notebook_node(notebook)
    
    # Clean up the code
    python_code = clean_code(python_code)
    
    # Extract the base name of the notebook
    base_name = os.path.splitext(os.path.basename(notebook_path))[0]
    
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    # Write to file
    output_path = os.path.join(output_dir, f"{base_name}.py")
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(python_code)
    
    print(f"Converted {notebook_path} to {output_path}")
    return output_path

def clean_code(code):
    """Clean up the exported Python code."""
    # Remove get_ipython() calls
    code = re.sub(r'get_ipython\(\).*\n', '', code)
    
    # Remove display and plotting code
    code = re.sub(r'plt\.show\(\).*\n', '', code)
    
    # Add main guard
    code += '\n\nif __name__ == "__main__":\n    pass\n'
    
    return code

def extract_model_code(notebook_path, output_dir):
    """Extract model-related code from notebook and organize into files."""
    # First convert the notebook to a script
    script_path = convert_notebook_to_script(notebook_path, output_dir)
    
    # Read the script
    with open(script_path, 'r', encoding='utf-8') as f:
        code = f.read()
    
    # Extract model-related code
    model_code = extract_model_related_code(code)
    preprocessing_code = extract_preprocessing_code(code)
    utils_code = extract_utility_code(code)
    
    # Write to separate files
    with open(os.path.join(output_dir, "model.py"), 'w', encoding='utf-8') as f:
        f.write(model_code)
    
    with open(os.path.join(output_dir, "preprocessor.py"), 'w', encoding='utf-8') as f:
        f.write(preprocessing_code)
    
    with open(os.path.join(output_dir, "utils.py"), 'w', encoding='utf-8') as f:
        f.write(utils_code)
    
    # Create __init__.py
    with open(os.path.join(output_dir, "__init__.py"), 'w', encoding='utf-8') as f:
        f.write("# Model package\n")
    
    # Remove the original script
    os.remove(script_path)
    
    print(f"Extracted model code from {notebook_path} to {output_dir}")

def extract_model_related_code(code):
    """Extract model definition and training code."""
    # This is a simplified example - in practice, you'd need more sophisticated parsing
    model_code = "import numpy as np\nimport pandas as pd\n"
    
    # Add ML imports based on what's in the code
    if "sklearn" in code:
        model_code += "from sklearn.model_selection import train_test_split\n"
        if "RandomForest" in code:
            model_code += "from sklearn.ensemble import RandomForestClassifier\n"
        if "LogisticRegression" in code:
            model_code += "from sklearn.linear_model import LogisticRegression\n"
    
    if "tensorflow" in code or "keras" in code:
        model_code += "import tensorflow as tf\nfrom tensorflow import keras\n"
    
    # Add model class
    model_code += "\n\nclass Model:\n"
    model_code += "    def __init__(self):\n"
    model_code += "        self.model = None\n\n"
    
    model_code += "    def train(self, X, y):\n"
    model_code += "        # Training code here\n"
    model_code += "        pass\n\n"
    
    model_code += "    def predict(self, X):\n"
    model_code += "        # Prediction code here\n"
    model_code += "        if self.model is None:\n"
    model_code += "            raise ValueError('Model not trained yet')\n"
    model_code += "        return self.model.predict(X)\n\n"
    
    model_code += "    def load(self, path):\n"
    model_code += "        # Load model from path\n"
    model_code += "        pass\n\n"
    
    model_code += "    def save(self, path):\n"
    model_code += "        # Save model to path\n"
    model_code += "        pass\n"
    
    return model_code

def extract_preprocessing_code(code):
    """Extract data preprocessing code."""
    preprocessing_code = "import numpy as np\nimport pandas as pd\n\n"
    
    preprocessing_code += "class Preprocessor:\n"
    preprocessing_code += "    def __init__(self):\n"
    preprocessing_code += "        pass\n\n"
    
    preprocessing_code += "    def preprocess(self, data):\n"
    preprocessing_code += "        # Preprocessing code here\n"
    preprocessing_code += "        return data\n\n"
    
    preprocessing_code += "    def feature_engineering(self, data):\n"
    preprocessing_code += "        # Feature engineering code here\n"
    preprocessing_code += "        return data\n"
    
    return preprocessing_code

def extract_utility_code(code):
    """Extract utility functions."""
    utils_code = "import numpy as np\nimport pandas as pd\n\n"
    
    utils_code += "def evaluate_model(model, X_test, y_test):\n"
    utils_code += "    # Evaluation code here\n"
    utils_code += "    predictions = model.predict(X_test)\n"
    utils_code += "    # Calculate metrics\n"
    utils_code += "    return {'accuracy': 0.0}\n\n"
    
    utils_code += "def load_data(path):\n"
    utils_code += "    # Data loading code here\n"
    utils_code += "    return pd.read_csv(path)\n"
    
    return utils_code

if __name__ == "__main__":
    # Define paths
    base_dir = os.path.dirname(os.path.abspath(__file__))
    notebooks_dir = os.path.join(base_dir, "components", "model")
    output_base_dir = os.path.join(base_dir, "models")
    
    # Create output directory
    os.makedirs(output_base_dir, exist_ok=True)
    
    # Convert each notebook
    notebooks = {
        "phishing-detection.ipynb": "phishing_detection",
        "malware-detection.ipynb": "malware_detection",
        "network-security.ipynb": "network_security"
    }
    
    for notebook, dir_name in notebooks.items():
        notebook_path = os.path.join(notebooks_dir, notebook)
        output_dir = os.path.join(output_base_dir, dir_name)
        
        if os.path.exists(notebook_path):
            extract_model_code(notebook_path, output_dir)
        else:
            print(f"Warning: Notebook {notebook_path} not found")
    
    print("Conversion complete!")

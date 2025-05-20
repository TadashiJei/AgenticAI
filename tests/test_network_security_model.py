import os
import sys
import pandas as pd
import numpy as np
import unittest
from datetime import datetime

# Add parent directory to path to import modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import models
from models.network_security.model import Model
from models.network_security.preprocessor import Preprocessor

class TestNetworkSecurityModel(unittest.TestCase):
    """Test cases for the network security model and preprocessor"""
    
    def setUp(self):
        """Set up test environment before each test"""
        # Create model and preprocessor instances
        self.model = Model()
        self.preprocessor = Preprocessor()
        
        # Create sample data
        self.sample_data = self._create_sample_data()
        
    def _create_sample_data(self):
        """Create sample network traffic data for testing"""
        # Create sample data with typical network flow features
        data = []
        
        # Normal traffic samples
        for i in range(20):
            data.append({
                'src_ip': f'192.168.1.{i % 10 + 1}',
                'dst_ip': f'192.168.1.{(i + 5) % 10 + 1}',
                'src_port': 49152 + i,
                'dst_port': 80 if i % 3 == 0 else (443 if i % 3 == 1 else 8080),
                'protocol': 'TCP',
                'bytes_in': 1200 + i * 100,
                'bytes_out': 15000 + i * 500,
                'packets_in': 5 + i,
                'packets_out': 12 + i,
                'start_time': 1600000000,
                'end_time': 1600000000 + 30 + i,
                'tcp_flags': {'SYN': 1, 'ACK': 10, 'PSH': 8, 'FIN': 2}
            })
        
        # Add some attack patterns (port scan)
        for i in range(5):
            data.append({
                'src_ip': '10.0.0.99',
                'dst_ip': '192.168.1.1',
                'src_port': 31337,
                'dst_port': 1000 + i * 10,  # Scanning different ports
                'protocol': 'TCP',
                'bytes_in': 60,
                'bytes_out': 40,
                'packets_in': 1,
                'packets_out': 1,
                'start_time': 1600001000,
                'end_time': 1600001002,
                'tcp_flags': {'SYN': 1, 'ACK': 0, 'PSH': 0, 'FIN': 0}
            })
        
        # Add some unusual traffic (data exfiltration)
        for i in range(5):
            data.append({
                'src_ip': '192.168.1.5',
                'dst_ip': '203.0.113.100',
                'src_port': 49200,
                'dst_port': 8080,
                'protocol': 'TCP',
                'bytes_in': 200,
                'bytes_out': 50000 + i * 10000,  # Large outbound data
                'packets_in': 3,
                'packets_out': 30 + i * 5,
                'start_time': 1600002000,
                'end_time': 1600002060,
                'tcp_flags': {'SYN': 1, 'ACK': 20, 'PSH': 25, 'FIN': 2}
            })
        
        return pd.DataFrame(data)
    
    def test_preprocessor(self):
        """Test the network security preprocessor"""
        # Test feature engineering
        features = self.preprocessor.feature_engineering(self.sample_data)
        
        # Check that features have been generated correctly
        self.assertIsInstance(features, pd.DataFrame)
        self.assertEqual(len(features), len(self.sample_data))
        
        # Check that all expected feature columns exist
        for col in self.preprocessor.feature_columns:
            self.assertIn(col, features.columns)
        
        # Test fit and transform
        self.preprocessor.fit(self.sample_data)
        transformed_features = self.preprocessor.transform(self.sample_data)
        
        # Check that transformed features have the same shape
        self.assertEqual(transformed_features.shape, features.shape)
        
        # Check fit_transform
        fit_transformed = self.preprocessor.fit_transform(self.sample_data)
        self.assertEqual(fit_transformed.shape, features.shape)
        
        # Test handling different input formats
        dict_data = self.sample_data.iloc[0].to_dict()
        dict_features = self.preprocessor.preprocess(dict_data)
        self.assertEqual(len(dict_features), 1)
        
        list_data = self.sample_data.iloc[0:2].to_dict('records')
        list_features = self.preprocessor.preprocess(list_data)
        self.assertEqual(len(list_features), 2)
        
        # Test save and load
        test_path = "/tmp/network_preprocessor_test.pkl"
        self.preprocessor.save(test_path)
        loaded_preprocessor = Preprocessor()
        loaded_preprocessor.load(test_path)
        
        # Check that loaded preprocessor works correctly
        loaded_features = loaded_preprocessor.transform(self.sample_data)
        self.assertEqual(loaded_features.shape, features.shape)
        
        # Clean up
        if os.path.exists(test_path):
            os.remove(test_path)
    
    def test_model_training(self):
        """Test the network security model training process"""
        # Preprocess data for training
        X = self.preprocessor.feature_engineering(self.sample_data)
        
        # Create target labels (for testing purposes, mark data exfiltration and port scans as attacks)
        y = np.zeros(len(self.sample_data))
        y[20:] = 1  # Attack samples
        
        # Train model without grid search (for faster testing)
        self.model.train(X, y, perform_grid_search=False)
        
        # Check model has been trained
        self.assertIsNotNone(self.model.model)
        
        # Test model metadata
        self.assertIsNotNone(self.model.metadata["accuracy"])
        self.assertIsNotNone(self.model.metadata["precision"])
        self.assertIsNotNone(self.model.metadata["recall"])
        self.assertIsNotNone(self.model.metadata["f1_score"])
        
        # Test model prediction
        predictions = self.model.predict(X)
        self.assertEqual(len(predictions), len(y))
        
        # Test prediction with probabilities
        probabilities = self.model.predict(X, return_probabilities=True)
        self.assertEqual(probabilities.shape[0], len(y))
        self.assertEqual(probabilities.shape[1], 2)  # Binary classification
        
        # Test prediction with details
        detailed_predictions = self.model.predict_with_details(X)
        self.assertEqual(len(detailed_predictions), len(y))
        self.assertIn("is_attack", detailed_predictions[0])
        self.assertIn("confidence", detailed_predictions[0])
        
        # Test feature importance
        importance = self.model.get_feature_importance()
        self.assertGreater(len(importance), 0)
        
        # Test top N feature importance
        top_importance = self.model.get_feature_importance(top_n=5)
        self.assertLessEqual(len(top_importance), 5)
        
        # Test save and load
        test_dir = "/tmp/network_model_test"
        self.model.save(test_dir)
        
        # Check saved files exist
        self.assertTrue(os.path.exists(os.path.join(test_dir, "model.pkl")))
        self.assertTrue(os.path.exists(os.path.join(test_dir, "scaler.pkl")))
        self.assertTrue(os.path.exists(os.path.join(test_dir, "model_metadata.json")))
        
        # Load model
        loaded_model = Model()
        loaded_model.load(test_dir)
        
        # Check loaded model performance
        loaded_predictions = loaded_model.predict(X)
        np.testing.assert_array_equal(predictions, loaded_predictions)
        
        # Clean up
        import shutil
        if os.path.exists(test_dir):
            shutil.rmtree(test_dir)
    
    def test_streaming_predict(self):
        """Test streaming prediction functionality"""
        # Preprocess data for training
        X = self.preprocessor.feature_engineering(self.sample_data)
        
        # Create target labels
        y = np.zeros(len(self.sample_data))
        y[20:] = 1  # Attack samples
        
        # Train model
        self.model.train(X, y, perform_grid_search=False)
        
        # Test streaming prediction with a generator
        def data_generator():
            for i in range(0, len(X), 3):
                yield X.iloc[i:i+3].values
        
        # Collect streaming predictions
        all_predictions = []
        for batch_preds in self.model.streaming_predict(data_generator()):
            all_predictions.extend(batch_preds)
        
        # Check predictions match regular predictions
        regular_predictions = self.model.predict(X)
        self.assertEqual(len(all_predictions), len(regular_predictions))

if __name__ == '__main__':
    unittest.main()

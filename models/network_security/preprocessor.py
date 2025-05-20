import os
import numpy as np
import pandas as pd
import ipaddress
import re
import struct
import socket
import json
import pickle
import scipy.stats as stats
from typing import Dict, List, Union, Optional, Any, Tuple
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from collections import Counter, defaultdict

class Preprocessor:
    """Preprocessor for network security model.
    
    Extracts and normalizes features from network traffic data for security analysis,
    including traffic patterns, protocol information, and statistical features.
    """
    
    def __init__(self):
        self.feature_columns = [
            # Flow-based features
            'flow_duration', 'flow_bytes_per_sec', 'flow_packets_per_sec',
            'flow_avg_packet_size', 'flow_bytes_in', 'flow_bytes_out',
            'flow_packets_in', 'flow_packets_out', 'flow_iat_mean',
            'flow_iat_std', 'flow_iat_max', 'flow_iat_min',
            'active_time', 'idle_time',
            
            # Packet-based features
            'packet_size_mean', 'packet_size_std', 'packet_size_min',
            'packet_size_max', 'packet_len_variance',
            
            # Flag-based features
            'fin_flag_count', 'syn_flag_count', 'rst_flag_count',
            'psh_flag_count', 'ack_flag_count', 'urg_flag_count',
            'fin_flag_rate', 'syn_flag_rate', 'rst_flag_rate',
            
            # Protocol and port features
            'is_tcp', 'is_udp', 'is_icmp', 'is_http', 'is_https',
            'is_dns', 'is_ssh', 'is_smtp', 'is_ftp', 'is_irc',
            'source_port_is_wellknown', 'dest_port_is_wellknown',
            
            # Address-based features
            'src_ip_is_private', 'dst_ip_is_private',
            'ip_same_subnet', 'ip_communication_count',
            
            # Anomaly detection features
            'entropy_src_port', 'entropy_dst_port', 'entropy_packet_size',
            'total_entropy', 'fragment_count', 'avg_fragment_size',
            'port_scan_probability', 'protocol_anomaly_score'
        ]
        
        # Initialize preprocessing components
        self.scaler = StandardScaler()
        self.port_encoder = OneHotEncoder(sparse_output=False, handle_unknown='ignore')
        self.preprocessor_trained = False
        self.ip_address_counter = Counter()
        self.port_counter = Counter()
        self.known_benign_flows = set()
        
        # Constants for feature extraction
        self.well_known_ports = set(range(1, 1024))
        self.known_service_ports = {
            80: 'http', 443: 'https', 53: 'dns', 22: 'ssh',
            25: 'smtp', 21: 'ftp', 6667: 'irc', 5222: 'xmpp'
        }
    
    def preprocess(self, data):
        """Preprocess network traffic data for model input.
        
        Args:
            data: DataFrame, file path, or raw packet data to process
            
        Returns:
            DataFrame with extracted features ready for model input
        """
        # Handle different input formats
        if isinstance(data, pd.DataFrame):
            return self.feature_engineering(data)
        elif isinstance(data, str) and os.path.exists(data):
            # Load from file based on extension
            if data.endswith('.csv'):
                df = pd.read_csv(data)
            elif data.endswith('.pcap'):
                df = self._process_pcap(data)
            elif data.endswith('.json'):
                with open(data, 'r') as f:
                    raw_data = json.load(f)
                df = pd.DataFrame(raw_data)
            else:
                raise ValueError(f"Unsupported file format: {data}")
            
            return self.feature_engineering(df)
        elif isinstance(data, dict) or isinstance(data, list):
            # Convert dict/list to DataFrame
            df = pd.DataFrame(data) if isinstance(data, list) else pd.DataFrame([data])
            return self.feature_engineering(df)
        else:
            raise ValueError("Input must be a DataFrame, file path, or dictionary/list of network data")
    
    def _process_pcap(self, pcap_file: str) -> pd.DataFrame:
        """Process a PCAP file and extract flow records.
        
        Args:
            pcap_file: Path to PCAP file
            
        Returns:
            DataFrame with flow records
        """
        # This is a placeholder for actual PCAP processing logic
        # In a real implementation, you would use libraries like dpkt, scapy, or pyshark
        # to parse PCAP files and extract flow information
        
        # Mock flow data for demonstration
        flows = [
            {
                'src_ip': '192.168.1.100', 'dst_ip': '10.0.0.1',
                'src_port': 49152, 'dst_port': 80,
                'protocol': 'TCP', 
                'bytes_in': 1200, 'bytes_out': 15000,
                'packets_in': 5, 'packets_out': 12,
                'start_time': 1600000000, 'end_time': 1600000030,
                'tcp_flags': {'SYN': 1, 'ACK': 12, 'PSH': 10, 'FIN': 2}
            }
        ]
        
        # Convert to DataFrame
        return pd.DataFrame(flows)
    
    def feature_engineering(self, data):
        """Extract and engineer features from network traffic data.
        
        Args:
            data: DataFrame containing network traffic flow data
            
        Returns:
            DataFrame with extracted features
        """
        # Make a copy to avoid modifying original data
        df = data.copy()
        
        # Initialize result DataFrame
        features = pd.DataFrame()
        
        # Calculate flow features
        if {'start_time', 'end_time'}.issubset(df.columns):
            features['flow_duration'] = df['end_time'] - df['start_time']
        else:
            features['flow_duration'] = 30  # Default value
        
        # Bytes and packets features
        if {'bytes_in', 'bytes_out'}.issubset(df.columns):
            features['flow_bytes_in'] = df['bytes_in']
            features['flow_bytes_out'] = df['bytes_out']
            features['flow_bytes_per_sec'] = (df['bytes_in'] + df['bytes_out']) / features['flow_duration'].clip(lower=0.1)
        else:
            features['flow_bytes_in'] = 0
            features['flow_bytes_out'] = 0
            features['flow_bytes_per_sec'] = 0
        
        if {'packets_in', 'packets_out'}.issubset(df.columns):
            features['flow_packets_in'] = df['packets_in']
            features['flow_packets_out'] = df['packets_out']
            features['flow_packets_per_sec'] = (df['packets_in'] + df['packets_out']) / features['flow_duration'].clip(lower=0.1)
            
            total_packets = df['packets_in'] + df['packets_out']
            total_bytes = df['bytes_in'] + df['bytes_out']
            features['flow_avg_packet_size'] = total_bytes / total_packets.clip(lower=1)
        else:
            features['flow_packets_in'] = 0
            features['flow_packets_out'] = 0
            features['flow_packets_per_sec'] = 0
            features['flow_avg_packet_size'] = 0
        
        # Inter-arrival time features - we don't have actual packet timestamps, so using defaults
        features['flow_iat_mean'] = 0.1
        features['flow_iat_std'] = 0.05
        features['flow_iat_max'] = 0.5
        features['flow_iat_min'] = 0.01
        features['active_time'] = features['flow_duration'] * 0.8
        features['idle_time'] = features['flow_duration'] * 0.2
        
        # Packet size features - we don't have actual packet sizes, so using estimated values
        if {'bytes_in', 'bytes_out', 'packets_in', 'packets_out'}.issubset(df.columns):
            avg_packet_size = features['flow_avg_packet_size']
            features['packet_size_mean'] = avg_packet_size
            features['packet_size_std'] = avg_packet_size * 0.3
            features['packet_size_min'] = avg_packet_size * 0.5
            features['packet_size_max'] = avg_packet_size * 1.5
            features['packet_len_variance'] = (features['packet_size_std'] ** 2)
        else:
            features['packet_size_mean'] = 0
            features['packet_size_std'] = 0
            features['packet_size_min'] = 0
            features['packet_size_max'] = 0
            features['packet_len_variance'] = 0
        
        # Process TCP flags if available
        if 'tcp_flags' in df.columns:
            # Extract flags from dictionary or parse from string format
            features['fin_flag_count'] = df['tcp_flags'].apply(lambda x: x.get('FIN', 0) if isinstance(x, dict) else 0)
            features['syn_flag_count'] = df['tcp_flags'].apply(lambda x: x.get('SYN', 0) if isinstance(x, dict) else 0)
            features['rst_flag_count'] = df['tcp_flags'].apply(lambda x: x.get('RST', 0) if isinstance(x, dict) else 0)
            features['psh_flag_count'] = df['tcp_flags'].apply(lambda x: x.get('PSH', 0) if isinstance(x, dict) else 0)
            features['ack_flag_count'] = df['tcp_flags'].apply(lambda x: x.get('ACK', 0) if isinstance(x, dict) else 0)
            features['urg_flag_count'] = df['tcp_flags'].apply(lambda x: x.get('URG', 0) if isinstance(x, dict) else 0)
            
            # Calculate flag rates
            total_flags = features[['fin_flag_count', 'syn_flag_count', 'rst_flag_count', 
                                    'psh_flag_count', 'ack_flag_count', 'urg_flag_count']].sum(axis=1)
            total_flags = total_flags.clip(lower=1)  # Avoid division by zero
            
            features['fin_flag_rate'] = features['fin_flag_count'] / total_flags
            features['syn_flag_rate'] = features['syn_flag_count'] / total_flags
            features['rst_flag_rate'] = features['rst_flag_count'] / total_flags
        else:
            # Default values for TCP flags
            flag_columns = ['fin_flag_count', 'syn_flag_count', 'rst_flag_count', 
                           'psh_flag_count', 'ack_flag_count', 'urg_flag_count',
                           'fin_flag_rate', 'syn_flag_rate', 'rst_flag_rate']
            for col in flag_columns:
                features[col] = 0
        
        # Protocol features
        if 'protocol' in df.columns:
            features['is_tcp'] = df['protocol'].apply(lambda x: 1 if str(x).upper() == 'TCP' else 0)
            features['is_udp'] = df['protocol'].apply(lambda x: 1 if str(x).upper() == 'UDP' else 0)
            features['is_icmp'] = df['protocol'].apply(lambda x: 1 if str(x).upper() == 'ICMP' else 0)
        else:
            features['is_tcp'] = 1  # Default to TCP
            features['is_udp'] = 0
            features['is_icmp'] = 0
        
        # Process port information
        if {'src_port', 'dst_port'}.issubset(df.columns):
            # Known service detection
            features['is_http'] = df.apply(lambda x: 1 if x['dst_port'] == 80 or x['src_port'] == 80 else 0, axis=1)
            features['is_https'] = df.apply(lambda x: 1 if x['dst_port'] == 443 or x['src_port'] == 443 else 0, axis=1)
            features['is_dns'] = df.apply(lambda x: 1 if x['dst_port'] == 53 or x['src_port'] == 53 else 0, axis=1)
            features['is_ssh'] = df.apply(lambda x: 1 if x['dst_port'] == 22 or x['src_port'] == 22 else 0, axis=1)
            features['is_smtp'] = df.apply(lambda x: 1 if x['dst_port'] == 25 or x['src_port'] == 25 else 0, axis=1)
            features['is_ftp'] = df.apply(lambda x: 1 if x['dst_port'] == 21 or x['src_port'] == 21 else 0, axis=1)
            features['is_irc'] = df.apply(lambda x: 1 if x['dst_port'] == 6667 or x['src_port'] == 6667 else 0, axis=1)
            
            # Well-known port checks
            features['source_port_is_wellknown'] = df['src_port'].apply(lambda x: 1 if x < 1024 else 0)
            features['dest_port_is_wellknown'] = df['dst_port'].apply(lambda x: 1 if x < 1024 else 0)
            
            # Port entropy - calculate if we have enough samples
            if len(df) > 5:
                src_ports = df['src_port'].astype(str).tolist()
                dst_ports = df['dst_port'].astype(str).tolist()
                features['entropy_src_port'] = self._calculate_entropy(src_ports)
                features['entropy_dst_port'] = self._calculate_entropy(dst_ports)
                
                # Detect potential port scanning
                features['port_scan_probability'] = self._calculate_port_scan_probability(df)
            else:
                features['entropy_src_port'] = 0
                features['entropy_dst_port'] = 0
                features['port_scan_probability'] = 0
        else:
            # Default values for port-related features
            for col in ['is_http', 'is_https', 'is_dns', 'is_ssh', 'is_smtp', 'is_ftp', 'is_irc',
                        'source_port_is_wellknown', 'dest_port_is_wellknown',
                        'entropy_src_port', 'entropy_dst_port', 'port_scan_probability']:
                features[col] = 0
        
        # Process IP information
        if {'src_ip', 'dst_ip'}.issubset(df.columns):
            # IP type features
            features['src_ip_is_private'] = df['src_ip'].apply(self._is_private_ip)
            features['dst_ip_is_private'] = df['dst_ip'].apply(self._is_private_ip)
            
            # Same subnet check
            features['ip_same_subnet'] = df.apply(lambda x: 1 if self._is_same_subnet(x['src_ip'], x['dst_ip']) else 0, axis=1)
            
            # IP communication count - how often we've seen this IP pair
            ip_pairs = df.apply(lambda x: (x['src_ip'], x['dst_ip']), axis=1)
            for pair in ip_pairs:
                self.ip_address_counter[pair] += 1
            features['ip_communication_count'] = ip_pairs.apply(lambda x: self.ip_address_counter[x])
            
            # Calculate packet size entropy for anomaly detection
            if 'flow_avg_packet_size' in features.columns:
                packet_sizes = features['flow_avg_packet_size'].astype(str).tolist()
                features['entropy_packet_size'] = self._calculate_entropy(packet_sizes)
            else:
                features['entropy_packet_size'] = 0
            
            # Calculate total entropy across multiple features
            features['total_entropy'] = (features['entropy_src_port'] + 
                                         features['entropy_dst_port'] + 
                                         features['entropy_packet_size']) / 3
        else:
            # Default values for IP-related features
            for col in ['src_ip_is_private', 'dst_ip_is_private', 'ip_same_subnet',
                        'ip_communication_count', 'entropy_packet_size', 'total_entropy']:
                features[col] = 0
        
        # Fragmentation features - default values since we don't have actual packet data
        features['fragment_count'] = 0
        features['avg_fragment_size'] = 0
        
        # Protocol anomaly score (higher values indicate anomalous behavior)
        features['protocol_anomaly_score'] = np.abs(features['entropy_dst_port'] - 2) + \
                                            (features['syn_flag_rate'] * 5) + \
                                            (features['rst_flag_rate'] * 5) - \
                                            (features['dest_port_is_wellknown'] * 0.5)
        features['protocol_anomaly_score'] = features['protocol_anomaly_score'].clip(lower=0, upper=10)
        
        # Ensure all feature columns exist
        for col in self.feature_columns:
            if col not in features.columns:
                features[col] = 0
        
        # Normalize numeric features if preprocessor is trained
        if self.preprocessor_trained:
            numeric_features = features[self.feature_columns].select_dtypes(include=['int64', 'float64']).columns
            features[numeric_features] = self.scaler.transform(features[numeric_features])
        
        # Return only the needed columns in the correct order
        return features[self.feature_columns]
    
    def fit(self, data):
        """Fit the preprocessor on training data.
        
        Args:
            data: DataFrame containing network traffic data
            
        Returns:
            self: Fitted preprocessor instance
        """
        # Extract features
        features = self.feature_engineering(data)
        
        # Fit scaler on numeric features
        numeric_features = features.select_dtypes(include=['int64', 'float64']).columns
        self.scaler.fit(features[numeric_features])
        
        # Mark as trained
        self.preprocessor_trained = True
        
        return self
    
    def transform(self, data):
        """Transform data using fitted preprocessor.
        
        Args:
            data: DataFrame containing network traffic data
            
        Returns:
            DataFrame with transformed features
        """
        if not self.preprocessor_trained:
            raise ValueError("Preprocessor must be fit before transform")
        
        return self.preprocess(data)
    
    def fit_transform(self, data):
        """Fit preprocessor and transform data.
        
        Args:
            data: DataFrame containing network traffic data
            
        Returns:
            DataFrame with transformed features
        """
        self.fit(data)
        return self.transform(data)
    
    def _calculate_entropy(self, values):
        """Calculate Shannon entropy of a list of values.
        
        Args:
            values: List of values to calculate entropy for
            
        Returns:
            Entropy value (higher means more random/diverse)
        """
        if not values:
            return 0
        
        # Count occurrences
        counter = Counter(values)
        total = len(values)
        
        # Calculate entropy
        entropy = 0
        for count in counter.values():
            probability = count / total
            entropy -= probability * np.log2(probability)
        
        return entropy
    
    def _is_private_ip(self, ip_str):
        """Check if IP address is private.
        
        Args:
            ip_str: IP address string
            
        Returns:
            True if private IP, False otherwise
        """
        try:
            ip = ipaddress.ip_address(ip_str)
            return ip.is_private
        except ValueError:
            return False
    
    def _is_same_subnet(self, ip1_str, ip2_str, mask=24):
        """Check if two IPs are in the same subnet.
        
        Args:
            ip1_str: First IP address string
            ip2_str: Second IP address string
            mask: Subnet mask (default /24)
            
        Returns:
            True if same subnet, False otherwise
        """
        try:
            ip1 = ipaddress.ip_address(ip1_str)
            ip2 = ipaddress.ip_address(ip2_str)
            network = ipaddress.ip_network(f"{ip1_str}/{mask}", strict=False)
            return ip2 in network
        except ValueError:
            return False
    
    def _calculate_port_scan_probability(self, df):
        """Calculate probability of a port scan.
        
        Args:
            df: DataFrame with network flow data
            
        Returns:
            Probability score (0-1) of port scanning behavior
        """
        # Simple heuristic: large number of different ports to same destination IP
        # with low bytes transferred and SYN flags
        if len(df) <= 1 or not {'src_ip', 'dst_ip', 'dst_port'}.issubset(df.columns):
            return 0
        
        # Group by source and destination IP
        grouped = df.groupby(['src_ip', 'dst_ip'])
        
        # For each IP pair, calculate port scan probability
        port_scan_scores = []
        for _, group in grouped:
            # Count unique destination ports
            unique_dst_ports = group['dst_port'].nunique()
            
            # Check for syn packets if available
            has_syn_flags = 'tcp_flags' in group.columns and \
                          any(group['tcp_flags'].apply(lambda x: x.get('SYN', 0) > 0 if isinstance(x, dict) else False))
            
            # Check for low bytes transferred
            low_bytes = 'bytes_out' in group.columns and (group['bytes_out'] < 100).mean() > 0.7
            
            # Calculate score based on number of unique ports and other factors
            if unique_dst_ports > 10:
                score = min(1.0, unique_dst_ports / 100)
                if has_syn_flags:
                    score += 0.2
                if low_bytes:
                    score += 0.2
                port_scan_scores.append(min(1.0, score))
            else:
                port_scan_scores.append(0)
        
        # Return maximum score across all IP pairs
        return max(port_scan_scores) if port_scan_scores else 0
    
    def save(self, path):
        """Save the preprocessor to disk.
        
        Args:
            path: Path to save the preprocessor
            
        Returns:
            Path where preprocessor was saved
        """
        # Create directory if it doesn't exist
        os.makedirs(os.path.dirname(path), exist_ok=True)
        
        # Save preprocessor
        with open(path, 'wb') as f:
            pickle.dump({
                'scaler': self.scaler,
                'port_encoder': self.port_encoder,
                'preprocessor_trained': self.preprocessor_trained,
                'ip_address_counter': self.ip_address_counter,
                'feature_columns': self.feature_columns
            }, f)
        
        return path
    
    def load(self, path):
        """Load preprocessor from disk.
        
        Args:
            path: Path to load the preprocessor from
            
        Returns:
            self: Loaded preprocessor instance
        """
        with open(path, 'rb') as f:
            data = pickle.load(f)
            
            self.scaler = data['scaler']
            self.port_encoder = data['port_encoder']
            self.preprocessor_trained = data['preprocessor_trained']
            self.ip_address_counter = data['ip_address_counter']
            self.feature_columns = data['feature_columns']
        
        return self

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Activity, AlertTriangle, ArrowRight, CheckCircle2, Shield, 
  Network, Wifi, WifiOff, Zap, Server, HardDrive, FileWarning, 
  TrendingUp, RefreshCw
} from "lucide-react"

interface TrafficData {
  timestamp: string;
  source_ip: string;
  destination_ip: string;
  protocol: string;
  port: number;
  bytes: number;
  packets: number;
  duration: number;
  is_malicious: boolean;
  confidence_score: number;
  threat_type?: string;
  classification?: string;
}

interface NetworkStats {
  total_traffic: number;
  active_connections: number;
  alerts_today: number;
  threat_level: 'low' | 'medium' | 'high' | 'critical';
  protocols: Record<string, number>; // protocol -> count
  top_talkers: Array<{ip: string, bytes: number, packets: number, connections: number}>;
}

export default function NetworkMonitoring() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [trafficData, setTrafficData] = useState<TrafficData[]>([]);
  const [networkStats, setNetworkStats] = useState<NetworkStats | null>(null);
  const [recentAlerts, setRecentAlerts] = useState<TrafficData[]>([]);
  
  useEffect(() => {
    // Fetch initial data when component mounts
    fetchNetworkData();
  }, []);
  
  // Fetch network data from API
  const fetchNetworkData = async () => {
    setIsLoading(true);
    
    try {
      // Fetch network traffic data
      const trafficResponse = await fetch('/api/network/traffic', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("authToken") || sessionStorage.getItem("authToken")}`
        }
      });
      
      if (!trafficResponse.ok) {
        throw new Error('Failed to fetch network traffic data');
      }
      
      const trafficData = await trafficResponse.json();
      setTrafficData(trafficData.data || []);
      
      // Fetch network stats
      const statsResponse = await fetch('/api/network/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("authToken") || sessionStorage.getItem("authToken")}`
        }
      });
      
      if (!statsResponse.ok) {
        throw new Error('Failed to fetch network stats');
      }
      
      const statsData = await statsResponse.json();
      setNetworkStats(statsData);
      
      // Fetch recent alerts
      const alertsResponse = await fetch('/api/network/alerts', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("authToken") || sessionStorage.getItem("authToken")}`
        }
      });
      
      if (!alertsResponse.ok) {
        throw new Error('Failed to fetch network alerts');
      }
      
      const alertsData = await alertsResponse.json();
      setRecentAlerts(alertsData.alerts || []);
      
    } catch (error) {
      console.error('Error fetching network data:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Toggle real-time monitoring
  const toggleMonitoring = () => {
    if (isMonitoring) {
      setIsMonitoring(false);
      // Clear any WebSocket connections or polling here
    } else {
      setIsMonitoring(true);
      
      // In a real implementation, we would connect to the WebSocket endpoint here
      toast({
        title: 'Monitoring Started',
        description: 'Real-time network monitoring has been activated.',
      });
      
      // Simulate incoming data for demo purposes
      const interval = setInterval(() => {
        // Add some simulated traffic data
        setTrafficData(prev => {
          const newData: TrafficData = {
            timestamp: new Date().toISOString(),
            source_ip: `192.168.1.${Math.floor(Math.random() * 254) + 1}`,
            destination_ip: `10.0.0.${Math.floor(Math.random() * 254) + 1}`,
            protocol: ['TCP', 'UDP', 'HTTP', 'HTTPS'][Math.floor(Math.random() * 4)],
            port: [80, 443, 22, 53, 8080][Math.floor(Math.random() * 5)],
            bytes: Math.floor(Math.random() * 100000),
            packets: Math.floor(Math.random() * 100),
            duration: Math.random() * 10,
            is_malicious: Math.random() > 0.8,
            confidence_score: Math.floor(Math.random() * 100),
          };
          
          // If malicious, add threat type
          if (newData.is_malicious) {
            newData.threat_type = ['Port Scan', 'DDoS', 'Brute Force', 'Data Exfiltration'][Math.floor(Math.random() * 4)];
            newData.classification = ['Suspicious', 'Malicious', 'Unknown'][Math.floor(Math.random() * 3)];
            
            // Add to alerts if highly confident
            if (newData.confidence_score > 70) {
              setRecentAlerts(prev => [newData, ...prev].slice(0, 5));
            }
          }
          
          return [newData, ...prev].slice(0, 50); // Keep only most recent 50 entries
        });
        
        // Update network stats
        setNetworkStats(prev => {
          if (!prev) return null;
          
          return {
            ...prev,
            active_connections: Math.floor(Math.random() * 50) + prev.active_connections,
            total_traffic: prev.total_traffic + Math.floor(Math.random() * 10000),
            alerts_today: recentAlerts.length,
            threat_level: recentAlerts.length > 10 ? 'critical' : recentAlerts.length > 5 ? 'high' : 'medium'
          };
        });
        
      }, 3000);
      
      // Cleanup function
      return () => clearInterval(interval);
    }
  };
  
  // Format bytes to human-readable format
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  // Get threat level badge
  const getThreatBadge = (threatLevel: string) => {
    switch (threatLevel.toLowerCase()) {
      case 'critical':
        return <Badge className="bg-red-500/20 text-red-500">Critical</Badge>;
      case 'high':
        return <Badge className="bg-orange-500/20 text-orange-500">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-500/20 text-yellow-500">Medium</Badge>;
      case 'low':
        return <Badge className="bg-green-500/20 text-green-500">Low</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-500">Unknown</Badge>;
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Network Status Panel */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className={`h-3 w-3 rounded-full ${isMonitoring ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
          <h3 className="text-lg font-medium text-white">
            Network Status: <span className={isMonitoring ? 'text-green-500' : 'text-red-500'}>
              {isMonitoring ? 'Monitoring Active' : 'Monitoring Inactive'}
            </span>
          </h3>
        </div>
        <Button 
          onClick={toggleMonitoring}
          className={isMonitoring 
            ? "bg-red-900/30 text-red-400 hover:bg-red-900/50 hover:text-red-300 border border-red-900/50" 
            : "bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700"
          }
        >
          <Network className="h-4 w-4 mr-2" />
          {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
        </Button>
      </div>
      
      {/* Network Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-gray-800 bg-black/60 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Traffic Volume</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-full rounded-md bg-gray-800" />
            ) : (
              <div className="flex items-center">
                <Zap className="h-5 w-5 text-cyan-400 mr-2" />
                <p className="text-2xl font-bold text-white">{networkStats ? formatBytes(networkStats.total_traffic) : '0 B'}</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="border-gray-800 bg-black/60 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Active Connections</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-full rounded-md bg-gray-800" />
            ) : (
              <div className="flex items-center">
                <Server className="h-5 w-5 text-purple-400 mr-2" />
                <p className="text-2xl font-bold text-white">{networkStats ? networkStats.active_connections : '0'}</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="border-gray-800 bg-black/60 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Alerts Today</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-full rounded-md bg-gray-800" />
            ) : (
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-orange-400 mr-2" />
                <p className="text-2xl font-bold text-white">{networkStats ? networkStats.alerts_today : '0'}</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="border-gray-800 bg-black/60 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Threat Level</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-full rounded-md bg-gray-800" />
            ) : (
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-red-400 mr-2" />
                <p className="text-xl font-bold text-white">{networkStats ? getThreatBadge(networkStats.threat_level) : getThreatBadge('low')}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Main content area with tabs */}
      <Tabs defaultValue="traffic" className="w-full">
        <TabsList className="grid grid-cols-3 mb-6 bg-gray-900/60 border border-gray-800 rounded-lg p-1">
          <TabsTrigger
            value="traffic"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-purple-600/20 data-[state=active]:text-white data-[state=active]:border-cyan-400"
          >
            Live Traffic
          </TabsTrigger>
          <TabsTrigger
            value="alerts"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-purple-600/20 data-[state=active]:text-white data-[state=active]:border-cyan-400"
          >
            Security Alerts
          </TabsTrigger>
          <TabsTrigger
            value="insights"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-purple-600/20 data-[state=active]:text-white data-[state=active]:border-cyan-400"
          >
            Network Insights
          </TabsTrigger>
        </TabsList>
        
        {/* Live Traffic Tab */}
        <TabsContent value="traffic" className="mt-0">
          <Card className="border-gray-800 bg-black/60 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-lg font-medium text-cyan-400 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Live Network Traffic
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchNetworkData}
                disabled={isLoading}
                className="border-gray-700 text-gray-400 hover:text-white hover:border-gray-600"
              >
                <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-900/60">
                      <tr className="text-left text-xs text-gray-400">
                        <th className="px-4 py-3 font-medium">Time</th>
                        <th className="px-4 py-3 font-medium">Source</th>
                        <th className="px-4 py-3 font-medium">Destination</th>
                        <th className="px-4 py-3 font-medium">Protocol</th>
                        <th className="px-4 py-3 font-medium">Port</th>
                        <th className="px-4 py-3 font-medium">Size</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {isLoading ? (
                        Array(5).fill(0).map((_, i) => (
                          <tr key={i} className="bg-black/30">
                            <td className="px-4 py-3"><Skeleton className="h-4 w-20 bg-gray-800" /></td>
                            <td className="px-4 py-3"><Skeleton className="h-4 w-24 bg-gray-800" /></td>
                            <td className="px-4 py-3"><Skeleton className="h-4 w-24 bg-gray-800" /></td>
                            <td className="px-4 py-3"><Skeleton className="h-4 w-16 bg-gray-800" /></td>
                            <td className="px-4 py-3"><Skeleton className="h-4 w-12 bg-gray-800" /></td>
                            <td className="px-4 py-3"><Skeleton className="h-4 w-16 bg-gray-800" /></td>
                            <td className="px-4 py-3"><Skeleton className="h-4 w-20 bg-gray-800" /></td>
                          </tr>
                        ))
                      ) : trafficData.length > 0 ? (
                        trafficData.map((item, index) => (
                          <tr key={index} className={item.is_malicious ? "bg-red-900/10" : "bg-black/30"}>
                            <td className="px-4 py-2 text-xs text-gray-300">{new Date(item.timestamp).toLocaleTimeString()}</td>
                            <td className="px-4 py-2 text-xs font-medium text-white">{item.source_ip}</td>
                            <td className="px-4 py-2 text-xs text-gray-300">{item.destination_ip}</td>
                            <td className="px-4 py-2 text-xs text-gray-300">{item.protocol}</td>
                            <td className="px-4 py-2 text-xs text-gray-300">{item.port}</td>
                            <td className="px-4 py-2 text-xs text-gray-300">{formatBytes(item.bytes)}</td>
                            <td className="px-4 py-2">
                              {item.is_malicious ? (
                                <Badge className="bg-red-500/20 text-red-500">Suspicious</Badge>
                              ) : (
                                <Badge className="bg-green-500/20 text-green-500">Normal</Badge>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                            No traffic data available. Start monitoring or refresh the page.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Security Alerts Tab */}
        <TabsContent value="alerts" className="mt-0">
          <Card className="border-gray-800 bg-black/60 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-lg font-medium text-cyan-400 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Security Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isLoading ? (
                  Array(3).fill(0).map((_, i) => (
                    <div key={i} className="p-4 border border-gray-800 rounded-md bg-gray-900/30">
                      <div className="flex justify-between mb-2">
                        <Skeleton className="h-6 w-40 bg-gray-800" />
                        <Skeleton className="h-6 w-20 bg-gray-800" />
                      </div>
                      <Skeleton className="h-4 w-full bg-gray-800 mb-2" />
                      <Skeleton className="h-4 w-3/4 bg-gray-800" />
                    </div>
                  ))
                ) : recentAlerts.length > 0 ? (
                  recentAlerts.map((alert, index) => (
                    <div 
                      key={index} 
                      className="p-4 border border-gray-800 rounded-md bg-red-900/10"
                    >
                      <div className="flex justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <FileWarning className="h-5 w-5 text-red-500" />
                          <h4 className="font-medium text-white">{alert.threat_type || 'Unknown Threat'}</h4>
                        </div>
                        <Badge variant="outline" className="text-red-500 border-red-500/50">
                          {alert.confidence_score}% Confidence
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400 mb-1">
                        Suspicious traffic from {alert.source_ip} to {alert.destination_ip} on port {alert.port}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-xs text-gray-500">{new Date(alert.timestamp).toLocaleString()}</p>
                        <Button size="sm" variant="outline" className="h-7 px-2 border-gray-700 text-cyan-400 hover:text-cyan-300 hover:border-gray-600">
                          Investigate <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium text-white mb-2">No Security Alerts</h3>
                    <p className="text-sm text-gray-400">
                      Your network is currently not showing any suspicious activity.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Network Insights Tab */}
        <TabsContent value="insights" className="mt-0">
          <Card className="border-gray-800 bg-black/60 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-lg font-medium text-cyan-400 flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Network Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Protocol Distribution */}
                <div className="border border-gray-800 rounded-md p-4 bg-gray-900/30">
                  <h4 className="text-sm font-medium text-gray-400 mb-3">Protocol Distribution</h4>
                  {isLoading ? (
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full bg-gray-800" />
                      <Skeleton className="h-4 w-full bg-gray-800" />
                      <Skeleton className="h-4 w-full bg-gray-800" />
                      <Skeleton className="h-4 w-full bg-gray-800" />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-400">TCP</span>
                          <span className="text-xs text-gray-400">45%</span>
                        </div>
                        <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-800">
                          <div className="h-full bg-gradient-to-r from-cyan-500 to-cyan-600 transition-all" style={{ width: '45%' }} />
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-400">UDP</span>
                          <span className="text-xs text-gray-400">30%</span>
                        </div>
                        <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-800">
                          <div className="h-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all" style={{ width: '30%' }} />
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-400">HTTP</span>
                          <span className="text-xs text-gray-400">15%</span>
                        </div>
                        <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-800">
                          <div className="h-full bg-gradient-to-r from-pink-500 to-pink-600 transition-all" style={{ width: '15%' }} />
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-400">HTTPS</span>
                          <span className="text-xs text-gray-400">10%</span>
                        </div>
                        <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-800">
                          <div className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all" style={{ width: '10%' }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Top Talkers */}
                <div className="border border-gray-800 rounded-md p-4 bg-gray-900/30">
                  <h4 className="text-sm font-medium text-gray-400 mb-3">Top Network Talkers</h4>
                  {isLoading ? (
                    <div className="space-y-3">
                      <Skeleton className="h-6 w-full bg-gray-800" />
                      <Skeleton className="h-6 w-full bg-gray-800" />
                      <Skeleton className="h-6 w-full bg-gray-800" />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                        <div>
                          <p className="text-sm font-medium text-white">192.168.1.105</p>
                          <p className="text-xs text-gray-400">45 connections</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-cyan-400">{formatBytes(1024576 * 6)}</p>
                          <p className="text-xs text-gray-400">250 packets</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                        <div>
                          <p className="text-sm font-medium text-white">10.0.0.15</p>
                          <p className="text-xs text-gray-400">32 connections</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-cyan-400">{formatBytes(1024576 * 4)}</p>
                          <p className="text-xs text-gray-400">180 packets</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium text-white">172.16.0.5</p>
                          <p className="text-xs text-gray-400">18 connections</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-cyan-400">{formatBytes(1024576 * 2)}</p>
                          <p className="text-xs text-gray-400">120 packets</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

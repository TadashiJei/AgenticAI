"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { BarChart3, PieChart, Activity, AlertTriangle, Shield, Network, FileWarning, ArrowRight, Check, X, Link as LinkIcon, ExternalLink, Globe, Clock, Cpu } from "lucide-react"

// Form schema for URL validation
const urlCheckSchema = z.object({
  url: z.string().url("Please enter a valid URL including http:// or https://"),
});

type UrlCheckFormValues = z.infer<typeof urlCheckSchema>;

interface PhishingResult {
  url: string;
  is_phishing: boolean;
  confidence_score: number;
  threat_level: string;
  analysis: {
    domain_age_days?: number;
    suspicious_keywords?: boolean;
    tls_certificate_valid?: boolean;
    misleading_domain?: boolean;
    suspicious_redirects?: boolean;
    blacklisted?: boolean;
    similar_to_known_phishing?: boolean;
  };
  time_analyzed: string;
}

export default function ThreatAnalysis() {
  const { toast } = useToast();
  const [isChecking, setIsChecking] = useState(false);
  const [phishingResult, setPhishingResult] = useState<PhishingResult | null>(null);
  const [recentScans, setRecentScans] = useState<PhishingResult[]>([]);

  const form = useForm<UrlCheckFormValues>({
    resolver: zodResolver(urlCheckSchema),
    defaultValues: {
      url: "",
    },
  });

  async function onSubmit(values: UrlCheckFormValues) {
    setIsChecking(true);
    
    try {
      // Call the phishing detection API
      const response = await fetch("/api/phishing/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("authToken") || sessionStorage.getItem("authToken")}`
        },
        body: JSON.stringify({
          url: values.url,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze URL. Please try again.");
      }

      const data = await response.json();
      setPhishingResult(data);
      
      // Add to recent scans
      setRecentScans(prev => [data, ...prev].slice(0, 5));

      // Reset form
      form.reset();
    } catch (error) {
      console.error("URL check error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
      });
    } finally {
      setIsChecking(false);
    }
  }
  
  // Helper function to determine color based on confidence score
  const getConfidenceColor = (score: number) => {
    if (score >= 80) return "text-red-500 border-red-500/50";
    if (score >= 60) return "text-orange-500 border-orange-500/50";
    if (score >= 40) return "text-yellow-500 border-yellow-500/50";
    return "text-green-500 border-green-500/50";
  };
  
  // Helper function to determine status badge
  const getStatusBadge = (threatLevel: string) => {
    switch (threatLevel.toLowerCase()) {
      case "critical":
        return <Badge className="bg-red-500/20 text-red-500 hover:bg-red-500/20">Critical</Badge>;
      case "high":
        return <Badge className="bg-orange-500/20 text-orange-500 hover:bg-orange-500/20">High</Badge>;
      case "medium":
        return <Badge className="bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/20">Medium</Badge>;
      case "low":
        return <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/20">Low</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-500 hover:bg-gray-500/20">Unknown</Badge>;
    }
  };
  return (
    <div className="space-y-6">
      {/* URL Phishing Check Tool */}
      <Card className="border-gray-800 bg-black/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl font-medium text-cyan-400 flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Phishing URL Scanner
          </CardTitle>
          <CardDescription className="text-gray-400">
            Check if a URL is potentially malicious or connected to phishing campaigns.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex space-x-2">
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center">
                        <LinkIcon className="mr-2 h-4 w-4 text-gray-400" />
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="https://example.com"
                            className="bg-gray-900/60 border-gray-700 text-white placeholder:text-gray-500 focus:border-cyan-400 focus:ring-cyan-400/20"
                            disabled={isChecking}
                          />
                        </FormControl>
                      </div>
                      <FormMessage className="text-red-400 text-xs mt-1" />
                    </FormItem>
                  )}
                />
              </div>
              <Button 
                type="submit" 
                disabled={isChecking}
                className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700"
              >
                {isChecking ? "Analyzing..." : "Check URL"}
              </Button>
            </div>
          </form>

          {isChecking && (
            <div className="mt-4 p-4 border border-gray-800 rounded-md bg-gray-900/30">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-400">Analyzing URL...</p>
                <Skeleton className="h-4 w-4 rounded-full bg-gray-700" />
              </div>
              <div className="relative h-1 w-full overflow-hidden rounded-full bg-gray-800">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-purple-600 transition-all"
                  style={{ width: '45%' }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <Skeleton className="h-12 w-full rounded-md bg-gray-800" />
                <Skeleton className="h-12 w-full rounded-md bg-gray-800" />
                <Skeleton className="h-12 w-full rounded-md bg-gray-800" />
                <Skeleton className="h-12 w-full rounded-md bg-gray-800" />
              </div>
            </div>
          )}

          {phishingResult && !isChecking && (
            <div className="mt-4 border border-gray-800 rounded-md overflow-hidden">
              <div className={`p-4 ${phishingResult.is_phishing ? 'bg-red-900/20' : 'bg-green-900/20'}`}>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium text-white">{new URL(phishingResult.url).hostname}</h3>
                    <p className="text-sm text-gray-400 flex items-center">
                      <Globe className="inline mr-1 h-3 w-3" />
                      {phishingResult.url}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <div className={`h-10 w-10 rounded-full ${phishingResult.is_phishing ? 'bg-red-500/20' : 'bg-green-500/20'} flex items-center justify-center`}>
                      {phishingResult.is_phishing ? (
                        <X className="h-5 w-5 text-red-500" />
                      ) : (
                        <Check className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-900/40 border-t border-gray-800">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <p className="text-sm text-gray-400">Threat Level:</p>
                      {getStatusBadge(phishingResult.threat_level)}
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm text-gray-400">Confidence Score:</p>
                      <Badge variant="outline" className={getConfidenceColor(phishingResult.confidence_score)}>
                        {phishingResult.confidence_score}/100
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm text-gray-400">Time Analyzed:</p>
                      <p className="text-sm text-gray-300 flex items-center">
                        <Clock className="inline mr-1 h-3 w-3" />
                        {new Date(phishingResult.time_analyzed).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {phishingResult.analysis.domain_age_days !== undefined && (
                      <div className="flex justify-between">
                        <p className="text-sm text-gray-400">Domain Age:</p>
                        <p className="text-sm text-gray-300">{phishingResult.analysis.domain_age_days} days</p>
                      </div>
                    )}
                    {phishingResult.analysis.suspicious_keywords !== undefined && (
                      <div className="flex justify-between">
                        <p className="text-sm text-gray-400">Suspicious Keywords:</p>
                        <Badge className={phishingResult.analysis.suspicious_keywords ? "bg-red-500/20 text-red-500" : "bg-green-500/20 text-green-500"}>
                          {phishingResult.analysis.suspicious_keywords ? "Detected" : "Not Detected"}
                        </Badge>
                      </div>
                    )}
                    {phishingResult.analysis.blacklisted !== undefined && (
                      <div className="flex justify-between">
                        <p className="text-sm text-gray-400">Blacklisted:</p>
                        <Badge className={phishingResult.analysis.blacklisted ? "bg-red-500/20 text-red-500" : "bg-green-500/20 text-green-500"}>
                          {phishingResult.analysis.blacklisted ? "Yes" : "No"}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-800">
                  <p className="text-sm text-gray-400 mb-2">Verdict:</p>
                  <p className="text-sm text-gray-300">
                    {phishingResult.is_phishing 
                      ? "This URL shows characteristics commonly associated with phishing websites. Proceed with extreme caution."
                      : "This URL appears to be legitimate based on our analysis. However, always remain vigilant."}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Threat Heatmap */}
        <Card className="border-gray-800 bg-black/60 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-lg font-medium text-cyan-400 flex items-center gap-2">
              <Network className="h-5 w-5" />
              Threat Heatmap
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-gray-900/60 rounded-md border border-gray-800 flex items-center justify-center p-4">
              <div className="w-full h-full relative">
                {/* World map outline with glowing dots */}
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                  <span className="text-sm">Interactive world map showing threat origins</span>
                </div>

                {/* Sample threat points */}
                <div
                  className="absolute h-3 w-3 rounded-full bg-red-500 animate-pulse"
                  style={{ top: "30%", left: "20%" }}
                ></div>
                <div
                  className="absolute h-3 w-3 rounded-full bg-red-500 animate-pulse"
                  style={{ top: "40%", left: "80%" }}
                ></div>
                <div
                  className="absolute h-3 w-3 rounded-full bg-orange-500 animate-pulse"
                  style={{ top: "60%", left: "50%" }}
                ></div>
                <div
                  className="absolute h-3 w-3 rounded-full bg-yellow-500 animate-pulse"
                  style={{ top: "25%", left: "60%" }}
                ></div>
                <div
                  className="absolute h-3 w-3 rounded-full bg-red-500 animate-pulse"
                  style={{ top: "70%", left: "30%" }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Threat Timeline */}
        <Card className="border-gray-800 bg-black/60 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-lg font-medium text-cyan-400 flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Threat Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 h-6 w-6 rounded-full bg-red-500/20 flex items-center justify-center">
                  <AlertTriangle className="h-3 w-3 text-red-500" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">Brute Force Attack</h4>
                    <Badge variant="outline" className="text-red-500 border-red-500/50">
                      Critical
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-400">Multiple failed login attempts from IP 192.168.1.45</p>
                  <p className="text-xs text-gray-500">Today, 14:22:36</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1 h-6 w-6 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <FileWarning className="h-3 w-3 text-orange-500" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">Suspicious File Detected</h4>
                    <Badge variant="outline" className="text-orange-500 border-orange-500/50">
                      High
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-400">Malicious JavaScript payload in email attachment</p>
                  <p className="text-xs text-gray-500">Today, 12:15:09</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1 h-6 w-6 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <Shield className="h-3 w-3 text-yellow-500" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">Phishing Attempt</h4>
                    <Badge variant="outline" className="text-yellow-500 border-yellow-500/50">
                      Medium
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-400">Email with suspicious link to fake login page</p>
                  <p className="text-xs text-gray-500">Today, 09:47:22</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Severity Distribution */}
        <Card className="border-gray-800 bg-black/60 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-lg font-medium text-cyan-400 flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Severity Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <div className="relative h-48 w-48">
                {/* Pie chart visualization */}
                <div className="absolute inset-0 rounded-full border-8 border-red-500 opacity-20"></div>
                <div
                  className="absolute inset-0 rounded-full border-8 border-transparent border-t-orange-500 border-r-orange-500 opacity-20"
                  style={{ transform: "rotate(45deg)" }}
                ></div>
                <div
                  className="absolute inset-0 rounded-full border-8 border-transparent border-b-yellow-500 border-l-yellow-500 opacity-20"
                  style={{ transform: "rotate(45deg)" }}
                ></div>

                <div className="absolute inset-4 bg-black/80 rounded-full flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-3xl font-bold text-white">73</span>
                    <p className="text-xs text-gray-400">Total Threats</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <span className="text-sm">Critical (42%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                <span className="text-sm">High (35%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                <span className="text-sm">Medium (23%)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Threat Correlation Graph */}
        <Card className="border-gray-800 bg-black/60 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-lg font-medium text-cyan-400 flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Threat Correlation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-gray-900/60 rounded-md border border-gray-800 flex items-center justify-center p-4">
              <div className="w-full h-full relative">
                {/* Node-link graph visualization */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-full h-full">
                    {/* Nodes */}
                    <div
                      className="absolute h-8 w-8 rounded-full bg-red-500/20 border border-red-500 flex items-center justify-center text-xs"
                      style={{ top: "30%", left: "20%" }}
                    >
                      <span>P1</span>
                    </div>
                    <div
                      className="absolute h-8 w-8 rounded-full bg-orange-500/20 border border-orange-500 flex items-center justify-center text-xs"
                      style={{ top: "50%", left: "40%" }}
                    >
                      <span>L1</span>
                    </div>
                    <div
                      className="absolute h-8 w-8 rounded-full bg-yellow-500/20 border border-yellow-500 flex items-center justify-center text-xs"
                      style={{ top: "70%", left: "70%" }}
                    >
                      <span>D1</span>
                    </div>

                    {/* Edges with arrows */}
                    <svg className="absolute inset-0 w-full h-full" style={{ zIndex: -1 }}>
                      <defs>
                        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                          <polygon points="0 0, 10 3.5, 0 7" fill="#9333ea" />
                        </marker>
                      </defs>
                      <line
                        x1="25%"
                        y1="32%"
                        x2="38%"
                        y2="48%"
                        stroke="#9333ea"
                        strokeWidth="2"
                        markerEnd="url(#arrowhead)"
                      />
                      <line
                        x1="42%"
                        y1="52%"
                        x2="68%"
                        y2="68%"
                        stroke="#9333ea"
                        strokeWidth="2"
                        markerEnd="url(#arrowhead)"
                      />
                    </svg>

                    {/* Legend */}
                    <div className="absolute bottom-0 left-0 text-xs text-gray-400">
                      <div className="flex items-center gap-1">
                        <span>P: Phishing</span>
                        <ArrowRight className="h-3 w-3" />
                        <span>L: Lateral Movement</span>
                        <ArrowRight className="h-3 w-3" />
                        <span>D: Data Exfiltration</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Threats Table */}
      <Card className="border-gray-800 bg-black/60 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-lg font-medium text-cyan-400 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Active Threats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-800">
                <TableHead className="text-gray-400">Source</TableHead>
                <TableHead className="text-gray-400">Vector</TableHead>
                <TableHead className="text-gray-400">Risk Score</TableHead>
                <TableHead className="text-gray-400">Status</TableHead>
                <TableHead className="text-gray-400 text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="border-gray-800">
                <TableCell className="font-medium">192.168.1.45</TableCell>
                <TableCell>Brute Force</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-red-500 border-red-500/50">
                    92/100
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className="bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/20">Investigating</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <button className="text-cyan-400 hover:text-cyan-300 text-sm">View Details</button>
                </TableCell>
              </TableRow>
              <TableRow className="border-gray-800">
                <TableCell className="font-medium">email-server.local</TableCell>
                <TableCell>Malicious Attachment</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-orange-500 border-orange-500/50">
                    78/100
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className="bg-red-500/20 text-red-500 hover:bg-red-500/20">Active</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <button className="text-cyan-400 hover:text-cyan-300 text-sm">View Details</button>
                </TableCell>
              </TableRow>
              <TableRow className="border-gray-800">
                <TableCell className="font-medium">user.smith@company.com</TableCell>
                <TableCell>Phishing</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-yellow-500 border-yellow-500/50">
                    65/100
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/20">Contained</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <button className="text-cyan-400 hover:text-cyan-300 text-sm">View Details</button>
                </TableCell>
              </TableRow>
              <TableRow className="border-gray-800">
                <TableCell className="font-medium">web-app-01.local</TableCell>
                <TableCell>SQL Injection</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-red-500 border-red-500/50">
                    89/100
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className="bg-purple-500/20 text-purple-500 hover:bg-purple-500/20">Mitigating</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <button className="text-cyan-400 hover:text-cyan-300 text-sm">View Details</button>
                </TableCell>
              </TableRow>
              <TableRow className="border-gray-800">
                <TableCell className="font-medium">10.0.0.123</TableCell>
                <TableCell>Lateral Movement</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-orange-500 border-orange-500/50">
                    76/100
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className="bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/20">Investigating</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <button className="text-cyan-400 hover:text-cyan-300 text-sm">View Details</button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="border-gray-800 bg-black/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl font-medium text-cyan-400 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Recent URL Scans
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-800">
                <TableHead className="text-gray-400">URL</TableHead>
                <TableHead className="text-gray-400">Type</TableHead>
                <TableHead className="text-gray-400">Severity</TableHead>
                <TableHead className="text-gray-400">Status</TableHead>
                <TableHead className="text-gray-400 text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentScans.length > 0 ? (
                recentScans.map((scan, index) => (
                  <TableRow key={index} className="border-gray-800">
                    <TableCell className="font-medium truncate max-w-[150px]" title={scan.url}>
                      {new URL(scan.url).hostname}
                    </TableCell>
                    <TableCell>Phishing Check</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getConfidenceColor(scan.confidence_score)}>
                        {scan.confidence_score}/100
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(scan.threat_level)}
                    </TableCell>
                    <TableCell className="text-right">
                      <a 
                        href={scan.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center justify-end"
                      >
                        <span className="mr-1">Visit</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                    No URL scans performed yet. Use the scanner above to check suspicious URLs.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { BarChart3, PieChart, Activity, AlertTriangle, Shield, Network, FileWarning, ArrowRight } from "lucide-react"

export default function ThreatAnalysis() {
  return (
    <div className="space-y-6">
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
    </div>
  )
}

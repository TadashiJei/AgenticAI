"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Download, FileText } from "lucide-react"

// Mock data
const timelineEvents = [
  { time: "08:42:15", event: "Initial Access", details: "Phishing email opened", severity: "Medium" },
  { time: "08:43:22", event: "Execution", details: "Malicious attachment executed", severity: "High" },
  { time: "08:45:37", event: "Persistence", details: "Registry key modified", severity: "High" },
  { time: "08:47:51", event: "Privilege Escalation", details: "Local admin rights obtained", severity: "Critical" },
  { time: "08:52:14", event: "Defense Evasion", details: "Security service disabled", severity: "Critical" },
  { time: "09:01:33", event: "Credential Access", details: "Password hash extraction", severity: "Critical" },
  { time: "09:12:45", event: "Lateral Movement", details: "RDP to finance server", severity: "High" },
  {
    time: "09:23:18",
    event: "Data Exfiltration",
    details: "Encrypted data transfer to external IP",
    severity: "Critical",
  },
]

const affectedSystems = [
  { id: "WS001", name: "Workstation-Marketing-01", status: "Compromised" },
  { id: "WS014", name: "Workstation-Finance-03", status: "Compromised" },
  { id: "SRV002", name: "FileServer-01", status: "Compromised" },
  { id: "SRV005", name: "DatabaseServer-02", status: "At Risk" },
  { id: "WS022", name: "Workstation-HR-05", status: "At Risk" },
]

const complianceImpact = [
  { standard: "GDPR", status: "Violated", details: "Personal data breach" },
  { standard: "PCI DSS", status: "Violated", details: "Cardholder data exposed" },
  { standard: "HIPAA", status: "Not Applicable", details: "No healthcare data involved" },
  { standard: "SOX", status: "At Risk", details: "Financial reporting integrity" },
  { standard: "ISO 27001", status: "Violated", details: "Security controls bypassed" },
]

export function ForensicsAI() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Forensics AI Dashboard</h2>
          <p className="text-gray-400">Reconstruct attack timelines, provide incident reports, and support root cause analysis</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="outline" className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-900/20 hover:text-cyan-300">
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
          <Button variant="outline" className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-900/20 hover:text-cyan-300">
            <Download className="mr-2 h-4 w-4" />
            Export Evidence
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-black/40 border-cyan-500/30 shadow-[0_0_10px_rgba(0,255,255,0.1)] md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center">
              <Clock className="mr-2 h-5 w-5 text-cyan-400" />
              Incident Timeline View
            </CardTitle>
            <CardDescription>Drag-scrollable timeline showing multi-step attack paths</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {timelineEvents.map((event, index) => (
                <div key={index} className="relative pl-6 pb-8">
                  <div className="absolute left-0 top-0 h-full">
                    <div className="h-full w-0.5 bg-cyan-500/30"></div>
                  </div>
                  <div className="absolute left-0 top-1 -ml-1.5">
                    <div className={`h-3 w-3 rounded-full border-2 ${
                      event.severity === "Critical" ? "bg-red-500 border-red-500/50" :
                      event.severity === "High" ? "bg-orange-500 border-orange-500/50" :
                      "bg-yellow-500 border-yellow-500/50"
                    }`}></div>
                  </div>
                  <div className="flex items-center mb-1">
                    <span className="text-xs text-cyan-400 font-mono mr-2">{event.time}</span>
                    <Badge className={
                      event.severity === "Critical" ? "bg-red-900/20 text-red-400 hover:bg-red-900/30 border-red-500/30" :
                      event.severity === "High" ? "bg-orange-900/20 text-orange-400 hover:bg-orange-900/30 border-orange-500/30" :
                      "bg-yellow-900/20 text-yellow-400 hover:bg-yellow-900/30 border-yellow-500/30"
                    }>
                      {event.severity}
                    </Badge>
                  </div>
                  <h4 className="text-sm font-medium text-white">{event.event}</h4>
                  <p className="text-xs text-gray-400">{event.details}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <Card className="bg-black/40 border-cyan-500/30 shadow-[0_0_10px_rgba(0,255,255,0.1)]">
            <CardHeader className="pb-2">
              <CardTitle className="
\

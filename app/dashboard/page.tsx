import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GridBackground } from "@/components/grid-background"
import Sidebar from "@/components/dashboard/sidebar"
import ThreatAnalysis from "@/components/dashboard/threat-analysis"
import MalwarePrediction from "@/components/dashboard/malware-prediction"
import ForensicsAI from "@/components/dashboard/forensics-ai"
import NetworkMonitoring from "@/components/dashboard/network-monitoring"

export default function DashboardPage() {
  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      <GridBackground className="opacity-30" />

      <div className="flex h-screen">
        <Sidebar />

        <main className="flex-1 overflow-auto p-6">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600">
              DefenSys.ai Dashboard
            </h1>

            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-64 px-4 py-2 rounded-md bg-gray-900/60 border border-gray-700 text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20"
                />
              </div>

              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700">
                  <span className="text-sm font-medium">JD</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Jane Doe</p>
                  <p className="text-xs text-gray-400">Admin</p>
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="threat-analysis" className="w-full">
            <TabsList className="grid grid-cols-4 mb-8 bg-gray-900/60 border border-gray-800 rounded-lg p-1">
              <TabsTrigger
                value="threat-analysis"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-purple-600/20 data-[state=active]:text-white data-[state=active]:border-cyan-400"
              >
                Threat Analysis
              </TabsTrigger>
              <TabsTrigger
                value="malware-prediction"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-purple-600/20 data-[state=active]:text-white data-[state=active]:border-cyan-400"
              >
                Malware Prediction
              </TabsTrigger>
              <TabsTrigger
                value="forensics-ai"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-purple-600/20 data-[state=active]:text-white data-[state=active]:border-cyan-400"
              >
                Forensics AI
              </TabsTrigger>
              <TabsTrigger
                value="network-monitoring"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-purple-600/20 data-[state=active]:text-white data-[state=active]:border-cyan-400"
              >
                Network Monitoring
              </TabsTrigger>
            </TabsList>

            <TabsContent value="threat-analysis" className="mt-0">
              <ThreatAnalysis />
            </TabsContent>

            <TabsContent value="malware-prediction" className="mt-0">
              <MalwarePrediction />
            </TabsContent>

            <TabsContent value="forensics-ai" className="mt-0">
              <ForensicsAI />
            </TabsContent>

            <TabsContent value="network-monitoring" className="mt-0">
              <NetworkMonitoring />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}

"use client"

import { motion } from "framer-motion"
import { Shield, Bell, Cpu, FileText, Zap, Lock, BarChart, Layers, Radar, Brain, Eye } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { GridBackground } from "@/components/grid-background"
import { GlitchEffect } from "@/components/glitch-effect"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function FeaturesPage() {
  const coreFeatures = [
    {
      title: "Threat Detection",
      description: "Real-time scanning and monitoring of your digital infrastructure",
      icon: <Radar className="h-10 w-10 text-orange-500" />,
      color: "from-orange-500 to-red-500",
    },
    {
      title: "Threat Analysis",
      description: "AI-powered assessment and classification of potential security threats",
      icon: <Brain className="h-10 w-10 text-blue-500" />,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Automated Response",
      description: "Autonomous mitigation actions tailored to your business needs",
      icon: <Shield className="h-10 w-10 text-purple-500" />,
      color: "from-purple-500 to-pink-500",
    },
  ]

  const additionalFeatures = [
    {
      title: "Real-time Alerts",
      description: "Instant notifications about potential security threats via your preferred channels",
      icon: <Bell className="h-8 w-8 text-orange-500" />,
    },
    {
      title: "Personalized Reporting",
      description: "Detailed security reports tailored to your business needs and compliance requirements",
      icon: <FileText className="h-8 w-8 text-blue-500" />,
    },
    {
      title: "Industry-Specific Agents",
      description: "Security agents tailored to your industry's unique challenges and requirements",
      icon: <Cpu className="h-8 w-8 text-purple-500" />,
    },
    {
      title: "Performance Optimization",
      description: "Lightweight agents that won't slow down your systems or network",
      icon: <Zap className="h-8 w-8 text-green-500" />,
    },
    {
      title: "End-to-End Encryption",
      description: "Secure communication between all components of the DefenSys.ai platform",
      icon: <Lock className="h-8 w-8 text-cyan-500" />,
    },
    {
      title: "Security Analytics",
      description: "Advanced analytics to identify patterns and improve your security posture",
      icon: <BarChart className="h-8 w-8 text-orange-500" />,
    },
  ]

  const upcomingFeatures = [
    {
      title: "Voice-Based AI Support",
      description: "Interact with your security system using natural language voice commands",
      icon: <Layers className="h-8 w-8 text-blue-500" />,
      eta: "Q3 2025",
    },
    {
      title: "Predictive Defense",
      description: "AI-powered prediction of potential attacks before they happen",
      icon: <Eye className="h-8 w-8 text-purple-500" />,
      eta: "Q4 2025",
    },
  ]

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <GridBackground />
      <GlitchEffect />

      <div className="relative z-10">
        <Navigation />

        <div className="container mx-auto px-4 pt-20">
          <PageHeader
            title="Features"
            description="Explore the powerful capabilities of DefenSys.ai"
            gradient="from-orange-400 to-red-500"
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mt-16 text-center"
          >
            <h2 className="text-2xl font-orbitron font-bold text-white mb-2">Core Technology</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-orange-500 to-red-500 mx-auto mb-8"></div>
            <p className="text-gray-300 max-w-2xl mx-auto mb-8">
              Our three-stage approach to cybersecurity provides comprehensive protection for your business.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {coreFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                <Card className="bg-black/50 border border-gray-800 backdrop-blur-sm overflow-hidden h-full group">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="p-3 rounded-lg bg-black/50 border border-gray-800 w-fit mb-4 group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-orbitron font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-300 font-mono text-sm mb-4 flex-grow">{feature.description}</p>
                  </CardContent>
                  <div
                    className={`h-1 w-0 bg-gradient-to-r ${feature.color} transition-all duration-500 group-hover:w-full`}
                  ></div>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-black/60 border border-cyan-500/20 rounded-xl p-6 backdrop-blur-sm mb-16"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-orbitron font-bold text-white mb-6">How It Works</h2>
                <div className="space-y-4 text-gray-300">
                  <p>
                    DefenSys.ai uses a modular, agent-based architecture that continuously monitors your digital
                    infrastructure for threats, analyzes potential security issues, and responds automatically to
                    protect your business.
                  </p>
                  <p>
                    Our AI-powered system learns from each interaction, continuously improving its ability to detect and
                    respond to new and evolving threats. This adaptive approach ensures that your protection remains
                    effective against the latest cybersecurity challenges.
                  </p>
                  <p>
                    The lightweight agents can be deployed across your existing infrastructure with minimal setup,
                    providing enterprise-grade protection without the need for specialized hardware or extensive
                    configuration.
                  </p>
                </div>

                <div className="mt-6">
                  <Button className="bg-cyan-500 hover:bg-cyan-600 text-white font-mono">
                    <Shield className="mr-2 h-4 w-4" />
                    Request a Demo
                  </Button>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.15),transparent_70%)]"></div>
                <div className="relative h-full flex items-center justify-center">
                  <div className="w-full max-w-md">
                    <div className="bg-black/70 border border-gray-800 rounded-lg p-4 mb-4 transform hover:scale-105 transition-transform">
                      <div className="flex items-center mb-2">
                        <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
                        <div className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></div>
                        <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      </div>
                      <div className="font-mono text-xs text-green-400 mb-1">&gt; Initializing DefenSys.ai...</div>
                      <div className="font-mono text-xs text-green-400 mb-1">&gt; Scanning network...</div>
                      <div className="font-mono text-xs text-green-400 mb-1">&gt; Analyzing traffic patterns...</div>
                      <div className="font-mono text-xs text-orange-400 mb-1">&gt; Suspicious activity detected</div>
                      <div className="font-mono text-xs text-blue-400 mb-1">&gt; Analyzing threat...</div>
                      <div className="font-mono text-xs text-purple-400 mb-1">&gt; Deploying countermeasures...</div>
                      <div className="font-mono text-xs text-green-400">&gt; Threat neutralized</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-black/70 border border-gray-800 rounded-lg p-3 transform hover:scale-105 transition-transform">
                        <div className="flex items-center justify-center">
                          <div className="h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                          <span className="text-xs font-mono text-green-400">System Protected</span>
                        </div>
                      </div>
                      <div className="bg-black/70 border border-gray-800 rounded-lg p-3 transform hover:scale-105 transition-transform">
                        <div className="flex items-center justify-center">
                          <div className="h-2 w-2 rounded-full bg-blue-500 mr-2 animate-pulse"></div>
                          <span className="text-xs font-mono text-blue-400">Learning Mode</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl font-orbitron font-bold text-white mb-2">Additional Features</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-8"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {additionalFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 + index * 0.1 }}
                className="group"
              >
                <Card className="bg-black/50 border border-gray-800 backdrop-blur-sm overflow-hidden h-full hover:border-cyan-500/30 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-black/50 border border-gray-800 group-hover:scale-110 transition-transform">
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-orbitron font-bold text-white mb-2">{feature.title}</h3>
                        <p className="text-gray-300 text-sm">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                  <div className="h-0.5 w-0 bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500 group-hover:w-full"></div>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="bg-black/60 border border-purple-500/20 rounded-xl p-6 backdrop-blur-sm mb-20"
          >
            <h2 className="text-2xl font-orbitron font-bold text-white mb-6 text-center">Coming Soon</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {upcomingFeatures.map((feature, index) => (
                <div
                  key={feature.title}
                  className="bg-black/70 border border-gray-800 rounded-lg p-6 relative overflow-hidden group"
                >
                  <div className="absolute top-3 right-3 bg-purple-500/20 text-purple-400 text-xs font-mono px-2 py-1 rounded-full">
                    {feature.eta}
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-black/50 border border-gray-800 group-hover:scale-110 transition-transform">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-orbitron font-bold text-white mb-2">{feature.title}</h3>
                      <p className="text-gray-300 text-sm">{feature.description}</p>
                    </div>
                  </div>
                  <div className="h-0.5 w-0 bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 group-hover:w-full absolute bottom-0 left-0"></div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-300 max-w-2xl mx-auto mb-6">
                We're constantly innovating and developing new features to enhance your cybersecurity protection. Stay
                tuned for these exciting additions to the DefenSys.ai platform.
              </p>

              <Button variant="outline" className="border-purple-500 text-purple-500 hover:bg-purple-500/10 font-mono">
                Join Our Beta Program
              </Button>
            </div>
          </motion.div>
        </div>

        <Footer />
      </div>
    </main>
  )
}

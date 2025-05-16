"use client"

import { motion } from "framer-motion"
import {
  Calendar,
  Check,
  Clock,
  Star,
  Zap,
  Shield,
  Cpu,
  Globe,
  Lock,
  Radar,
  Brain,
  BarChart,
  Mic,
  Eye,
  RefreshCw,
} from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { GridBackground } from "@/components/grid-background"
import { GlitchEffect } from "@/components/glitch-effect"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function RoadmapPage() {
  const roadmapItems = [
    {
      quarter: "Q2 2025",
      status: "current",
      features: [
        {
          title: "Launch of DefenSys.ai Core Platform",
          description: "Initial release of our autonomous AI-driven protection system for MSMEs",
          completed: true,
          icon: <Shield className="h-6 w-6 text-orange-500" />,
        },
        {
          title: "Basic Threat Detection & Analysis",
          description: "Real-time scanning and AI-powered assessment of security threats",
          completed: true,
          icon: <Radar className="h-6 w-6 text-blue-500" />,
        },
        {
          title: "Automated Response System",
          description: "First iteration of our autonomous mitigation actions",
          completed: false,
          icon: <Zap className="h-6 w-6 text-purple-500" />,
        },
      ],
    },
    {
      quarter: "Q3 2025",
      status: "upcoming",
      features: [
        {
          title: "Enhanced AI Analysis Engine",
          description: "Improved threat classification and prioritization capabilities",
          completed: false,
          icon: <Brain className="h-6 w-6 text-cyan-500" />,
        },
        {
          title: "Industry-Specific Security Agents",
          description: "Specialized protection for healthcare, finance, and retail sectors",
          completed: false,
          icon: <Cpu className="h-6 w-6 text-green-500" />,
        },
        {
          title: "Advanced Reporting Dashboard",
          description: "Comprehensive security insights and visualization tools",
          completed: false,
          icon: <BarChart className="h-6 w-6 text-orange-500" />,
        },
      ],
    },
    {
      quarter: "Q4 2025",
      status: "upcoming",
      features: [
        {
          title: "Voice-Based AI Support",
          description: "Natural language interaction with your security system",
          completed: false,
          icon: <Mic className="h-6 w-6 text-blue-500" />,
        },
        {
          title: "Global Threat Intelligence Network",
          description: "Shared security insights across the DefenSys.ai ecosystem",
          completed: false,
          icon: <Globe className="h-6 w-6 text-purple-500" />,
        },
        {
          title: "Advanced Encryption Framework",
          description: "Enhanced data protection for sensitive information",
          completed: false,
          icon: <Lock className="h-6 w-6 text-cyan-500" />,
        },
      ],
    },
    {
      quarter: "Q1 2026",
      status: "upcoming",
      features: [
        {
          title: "Predictive Defense System",
          description: "AI-powered prediction of potential attacks before they happen",
          completed: false,
          icon: <Eye className="h-6 w-6 text-orange-500" />,
        },
        {
          title: "Quantum-Resistant Encryption",
          description: "Future-proof security against quantum computing threats",
          completed: false,
          icon: <Shield className="h-6 w-6 text-green-500" />,
        },
        {
          title: "Autonomous Security Optimization",
          description: "Self-improving system that adapts to your changing security needs",
          completed: false,
          icon: <RefreshCw className="h-6 w-6 text-blue-500" />,
        },
      ],
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
            title="Product Roadmap"
            description="Our vision for the future of DefenSys.ai"
            gradient="from-green-400 to-cyan-500"
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mt-16 text-center max-w-2xl mx-auto"
          >
            <p className="text-gray-300 mb-8">
              We're constantly innovating and improving DefenSys.ai to provide the best possible protection for your
              business. Here's what we're working on and what you can expect in the coming months.
            </p>
          </motion.div>

          <div className="relative mb-20">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-gradient-to-b from-cyan-500/50 via-purple-500/50 to-transparent"></div>

            {roadmapItems.map((item, index) => (
              <motion.div
                key={item.quarter}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="mb-16 relative"
              >
                {/* Quarter indicator */}
                <div className="absolute left-1/2 transform -translate-x-1/2 -top-6 bg-black/80 border border-cyan-500/30 rounded-full px-4 py-2 z-10">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-cyan-400" />
                    <span className="font-mono text-cyan-400">{item.quarter}</span>
                    {item.status === "current" && (
                      <span className="bg-green-500/20 text-green-400 text-xs font-mono px-2 py-0.5 rounded-full">
                        CURRENT
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
                  {item.features.map((feature, featureIndex) => (
                    <Card
                      key={feature.title}
                      className={`bg-black/50 border ${
                        feature.completed ? "border-green-500/30" : "border-gray-800"
                      } backdrop-blur-sm overflow-hidden h-full group hover:border-cyan-500/30 transition-colors`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div
                            className={`p-2 rounded-lg bg-black/50 border ${
                              feature.completed ? "border-green-500/30" : "border-gray-800"
                            } group-hover:scale-110 transition-transform`}
                          >
                            {feature.icon}
                          </div>
                          <div>
                            <div className="flex items-center mb-2">
                              <h3 className="text-lg font-orbitron font-bold text-white">{feature.title}</h3>
                              {feature.completed && (
                                <div className="ml-2 p-1 rounded-full bg-green-500/20">
                                  <Check className="h-4 w-4 text-green-500" />
                                </div>
                              )}
                            </div>
                            <p className="text-gray-300 text-sm">{feature.description}</p>
                            <div className="mt-4 flex items-center">
                              {feature.completed ? (
                                <span className="text-green-400 text-sm font-mono flex items-center">
                                  <Check className="h-4 w-4 mr-1" /> Completed
                                </span>
                              ) : (
                                <span className="text-cyan-400 text-sm font-mono flex items-center">
                                  <Clock className="h-4 w-4 mr-1" /> In progress
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="bg-black/60 border border-cyan-500/20 rounded-xl p-6 backdrop-blur-sm mb-20"
          >
            <h2 className="text-2xl font-orbitron font-bold text-white mb-6 text-center">Help Shape Our Roadmap</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-gray-300 mb-4">
                  We believe in building products that truly meet our users' needs. Your feedback is invaluable in
                  helping us prioritize features and improvements.
                </p>
                <p className="text-gray-300 mb-6">
                  Have a feature request or suggestion? We'd love to hear from you! Submit your ideas through our
                  feedback portal or join our community discussions.
                </p>
                <Button className="bg-cyan-500 hover:bg-cyan-600 text-white font-mono">
                  <Star className="mr-2 h-4 w-4" />
                  Submit Feature Request
                </Button>
              </div>

              <div className="bg-black/70 border border-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-orbitron font-bold text-white mb-4">Top Requested Features</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="p-1.5 rounded-lg bg-black/50 border border-gray-800 mr-2">
                        <Zap className="h-4 w-4 text-orange-500" />
                      </div>
                      <span className="text-gray-300">Mobile Application</span>
                    </div>
                    <span className="bg-orange-500/20 text-orange-400 text-xs font-mono px-2 py-0.5 rounded-full">
                      Planned
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="p-1.5 rounded-lg bg-black/50 border border-gray-800 mr-2">
                        <Shield className="h-4 w-4 text-blue-500" />
                      </div>
                      <span className="text-gray-300">Multi-factor Authentication</span>
                    </div>
                    <span className="bg-green-500/20 text-green-400 text-xs font-mono px-2 py-0.5 rounded-full">
                      In Progress
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="p-1.5 rounded-lg bg-black/50 border border-gray-800 mr-2">
                        <Globe className="h-4 w-4 text-purple-500" />
                      </div>
                      <span className="text-gray-300">Threat Intelligence Sharing</span>
                    </div>
                    <span className="bg-purple-500/20 text-purple-400 text-xs font-mono px-2 py-0.5 rounded-full">
                      Considering
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <Footer />
      </div>
    </main>
  )
}

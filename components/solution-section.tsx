"use client"

import { motion } from "framer-motion"
import { Radar, Brain, Shield, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function SolutionSection() {
  const agents = [
    {
      title: "Threat Detection Agent",
      description: "Real-time scanning and monitoring of your digital infrastructure",
      icon: <Radar className="h-10 w-10 text-orange-500" />,
      color: "from-orange-500 to-red-500",
    },
    {
      title: "Analysis Agent",
      description: "Prioritizes & classifies threats using advanced AI algorithms",
      icon: <Brain className="h-10 w-10 text-blue-500" />,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Response Agent",
      description: "Auto-mitigation with adaptive actions tailored to your business",
      icon: <Shield className="h-10 w-10 text-purple-500" />,
      color: "from-purple-500 to-pink-500",
    },
  ]

  return (
    <section id="solution" className="min-h-screen py-20 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.15),transparent_70%)]"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-orbitron font-bold mb-4 bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
            The Solution
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-orange-500 to-red-500 mx-auto mb-6"></div>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Our modular agent-based architecture provides comprehensive protection through a three-stage process:
            detection, analysis, and response.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {agents.map((agent, index) => (
            <motion.div
              key={agent.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="bg-black/50 border border-gray-800 backdrop-blur-sm overflow-hidden h-full group">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="p-3 rounded-lg bg-black/50 border border-gray-800 w-fit mb-4">{agent.icon}</div>
                  <h3 className="text-xl font-orbitron font-bold text-white mb-2">{agent.title}</h3>
                  <p className="text-gray-300 font-mono text-sm mb-4 flex-grow">{agent.description}</p>
                  <div className="mt-auto">
                    <div className="flex items-center text-sm font-mono text-cyan-400 group-hover:text-white transition-colors">
                      <span>Learn more</span>
                      <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </CardContent>
                <div
                  className={`h-1 w-0 bg-gradient-to-r ${agent.color} transition-all duration-500 group-hover:w-full`}
                ></div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-black/60 border border-orange-500/20 rounded-xl p-6 backdrop-blur-sm"
        >
          <h3 className="text-2xl font-orbitron font-bold text-white mb-6 text-center">Defense Flow Architecture</h3>

          <div className="relative py-10">
            {/* Neural Network Animation */}
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <div className="w-full h-full max-w-3xl mx-auto">
                <svg viewBox="0 0 800 200" className="w-full h-full">
                  <path
                    d="M100,100 C200,50 300,150 400,100 C500,50 600,150 700,100"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="2"
                    className="animate-pulse"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#f97316" />
                      <stop offset="50%" stopColor="#0ea5e9" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            {/* Flow Diagram */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
              <div className="bg-black/70 border border-orange-500/30 rounded-lg p-4 text-center w-full md:w-64">
                <Radar className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                <h4 className="font-mono text-orange-400 text-sm mb-1">Detection</h4>
                <p className="text-gray-400 text-xs">Continuous monitoring of network traffic and system behavior</p>
              </div>

              <div className="hidden md:block">
                <ArrowRight className="h-6 w-6 text-cyan-500 animate-pulse" />
              </div>
              <div className="block md:hidden">
                <ArrowRight className="h-6 w-6 text-cyan-500 animate-pulse transform rotate-90" />
              </div>

              <div className="bg-black/70 border border-blue-500/30 rounded-lg p-4 text-center w-full md:w-64">
                <Brain className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <h4 className="font-mono text-blue-400 text-sm mb-1">Analysis</h4>
                <p className="text-gray-400 text-xs">AI-powered threat assessment and classification</p>
              </div>

              <div className="hidden md:block">
                <ArrowRight className="h-6 w-6 text-cyan-500 animate-pulse" />
              </div>
              <div className="block md:hidden">
                <ArrowRight className="h-6 w-6 text-cyan-500 animate-pulse transform rotate-90" />
              </div>

              <div className="bg-black/70 border border-purple-500/30 rounded-lg p-4 text-center w-full md:w-64">
                <Shield className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <h4 className="font-mono text-purple-400 text-sm mb-1">Response</h4>
                <p className="text-gray-400 text-xs">Automated mitigation and adaptive defense actions</p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-300 font-mono text-sm">
              Our agent-based architecture allows for modular deployment and continuous learning, adapting to your
              specific security needs and evolving threats.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

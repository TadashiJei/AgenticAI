"use client"

import { motion } from "framer-motion"
import { FileText, Bell, Mic, Cpu, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function FeaturesSection() {
  const features = [
    {
      title: "Personalized Reporting",
      description: "Detailed security reports tailored to your business needs",
      icon: <FileText className="h-10 w-10 text-orange-500" />,
      color: "from-orange-500 to-red-500",
    },
    {
      title: "Real-time Alerts",
      description: "Instant notifications about potential security threats",
      icon: <Bell className="h-10 w-10 text-blue-500" />,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Voice-Based AI Support",
      description: "Coming soon: Interact with your security system using voice commands",
      icon: <Mic className="h-10 w-10 text-purple-500" />,
      color: "from-purple-500 to-pink-500",
      comingSoon: true,
    },
    {
      title: "Industry-Specific Agents",
      description: "Security agents tailored to your industry's unique challenges",
      icon: <Cpu className="h-10 w-10 text-green-500" />,
      color: "from-green-500 to-emerald-500",
    },
  ]

  return (
    <section id="features" className="min-h-screen py-20 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.15),transparent_70%)]"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-orbitron font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Features & Product
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mb-6"></div>
          <p className="text-gray-300 max-w-2xl mx-auto">
            DefenSys.ai combines powerful features to provide comprehensive protection for your business.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <Card className="bg-black/50 border border-gray-800 backdrop-blur-sm overflow-hidden h-full relative">
                {feature.comingSoon && (
                  <div className="absolute top-3 right-3 bg-purple-500 text-white text-xs font-mono px-2 py-1 rounded-full">
                    SOON
                  </div>
                )}
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="p-3 rounded-lg bg-black/50 border border-gray-800 w-fit mb-4 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-orbitron font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-300 font-mono text-sm mb-4 flex-grow">{feature.description}</p>
                  <div className="mt-auto">
                    <div className="flex items-center text-sm font-mono text-cyan-400 group-hover:text-white transition-colors">
                      <span>Learn more</span>
                      <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </CardContent>
                <div
                  className={`h-1 w-0 bg-gradient-to-r ${feature.color} transition-all duration-500 group-hover:w-full`}
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
          className="bg-black/60 border border-purple-500/20 rounded-xl p-6 backdrop-blur-sm"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-orbitron font-bold text-white mb-4">How It Works</h3>
              <div className="space-y-4 text-gray-300">
                <p>
                  DefenSys.ai deploys as a lightweight agent on your existing infrastructure, requiring minimal setup
                  and configuration.
                </p>
                <p>
                  Our system continuously monitors your network traffic, system behavior, and potential vulnerabilities,
                  using AI to identify and respond to threats in real-time.
                </p>
                <p>
                  Unlike traditional security solutions that require constant human oversight, DefenSys.ai operates
                  autonomously, alerting you only when necessary and providing clear, actionable information.
                </p>
              </div>

              <div className="mt-6">
                <div className="flex items-center text-sm font-mono text-cyan-400 hover:text-white transition-colors cursor-pointer group">
                  <span>View technical specifications</span>
                  <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 rounded-full border border-purple-500/20 animate-pulse"></div>
                <div
                  className="absolute w-48 h-48 rounded-full border border-blue-500/20 animate-pulse"
                  style={{ animationDelay: "500ms" }}
                ></div>
                <div
                  className="absolute w-32 h-32 rounded-full border border-orange-500/20 animate-pulse"
                  style={{ animationDelay: "1000ms" }}
                ></div>
              </div>

              <div className="relative flex items-center justify-center h-full">
                <div className="bg-black/80 border border-gray-800 rounded-lg p-6 backdrop-blur-sm max-w-xs">
                  <div className="flex items-center mb-4">
                    <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  </div>

                  <div className="font-mono text-xs text-green-400 mb-2">&gt; Initializing DefenSys.ai...</div>
                  <div className="font-mono text-xs text-green-400 mb-2">&gt; Scanning network...</div>
                  <div className="font-mono text-xs text-green-400 mb-2">&gt; Analyzing traffic patterns...</div>
                  <div className="font-mono text-xs text-orange-400 mb-2">&gt; Suspicious activity detected</div>
                  <div className="font-mono text-xs text-blue-400 mb-2">&gt; Analyzing threat...</div>
                  <div className="font-mono text-xs text-purple-400 mb-2">&gt; Deploying countermeasures...</div>
                  <div className="font-mono text-xs text-green-400">&gt; Threat neutralized</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

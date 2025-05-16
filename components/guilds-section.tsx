"use client"

import { motion } from "framer-motion"
import { Shield, Search, Eye } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function GuildsSection() {
  const guilds = [
    {
      title: "DataShield AI",
      description: "Firewall logic & encryption for comprehensive data protection",
      icon: <Shield className="h-10 w-10 text-orange-500" />,
      color: "from-orange-500 to-red-500",
      logs: ["Encrypting sensitive data...", "Firewall rules updated", "Blocking suspicious IP: 192.168.1.x"],
    },
    {
      title: "Recon AI",
      description: "Packet inspection & anomaly detection to identify threats",
      icon: <Search className="h-10 w-10 text-blue-500" />,
      color: "from-blue-500 to-cyan-500",
      logs: ["Scanning network packets...", "Anomaly detected in HTTP traffic", "Analyzing pattern signatures..."],
    },
    {
      title: "Sentinel AI",
      description: "Intrusion prediction and proactive defense mechanisms",
      icon: <Eye className="h-10 w-10 text-purple-500" />,
      color: "from-purple-500 to-pink-500",
      logs: [
        "Monitoring system activity...",
        "Predicting potential attack vectors",
        "Hardening vulnerable endpoints...",
      ],
    },
  ]

  return (
    <section id="guilds" className="min-h-screen py-20 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(14,165,233,0.15),transparent_70%)]"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-orbitron font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            DefenSys Guilds
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto mb-6"></div>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Specialized AI modules working together to provide comprehensive protection for your business.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {guilds.map((guild, index) => (
            <motion.div
              key={guild.title}
              initial={{ opacity: 0, y: 50, rotateY: 10 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="perspective-1000"
            >
              <div className="relative group transform transition-transform duration-500 hover:scale-105 hover:rotate-y-10">
                <Card className="bg-black/50 border border-gray-800 backdrop-blur-sm overflow-hidden h-full">
                  <CardContent className="p-6">
                    <div className="p-3 rounded-lg bg-black/50 border border-gray-800 w-fit mb-4">{guild.icon}</div>
                    <h3 className="text-xl font-orbitron font-bold text-white mb-2">{guild.title}</h3>
                    <p className="text-gray-300 font-mono text-sm mb-4">{guild.description}</p>

                    <div className="mt-6 bg-black/70 border border-gray-800 rounded-md p-3">
                      <div className="text-xs font-mono text-gray-400 mb-2">LIVE LOG FEED</div>
                      <div className="space-y-2">
                        {guild.logs.map((log, i) => (
                          <div
                            key={i}
                            className="text-xs font-mono text-cyan-400 flex items-center"
                            style={{ animationDelay: `${i * 0.5}s` }}
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                            {log}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <div className={`h-1 w-full bg-gradient-to-r ${guild.color}`}></div>
                </Card>

                {/* Glow effect */}
                <div
                  className={`absolute -inset-0.5 bg-gradient-to-r ${guild.color} rounded-lg blur opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
                ></div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-black/60 border border-cyan-500/20 rounded-xl p-6 backdrop-blur-sm"
        >
          <h3 className="text-2xl font-orbitron font-bold text-white mb-6 text-center">Guild Synergy</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-gray-300 mb-4">
                DefenSys Guilds are specialized AI modules that work together to provide comprehensive protection for
                your business. Each Guild has a specific focus and expertise, but they share information and coordinate
                responses for maximum effectiveness.
              </p>
              <p className="text-gray-300">
                As threats evolve, our Guilds adapt and learn, continuously improving their detection and response
                capabilities. This modular approach allows us to rapidly deploy updates and new capabilities without
                disrupting your security posture.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/70 border border-gray-800 rounded-lg p-4">
                <h4 className="font-mono text-cyan-400 text-sm mb-2">Shared Intelligence</h4>
                <p className="text-gray-400 text-sm">
                  Guilds share threat intelligence to improve detection and response across the system.
                </p>
              </div>

              <div className="bg-black/70 border border-gray-800 rounded-lg p-4">
                <h4 className="font-mono text-cyan-400 text-sm mb-2">Continuous Learning</h4>
                <p className="text-gray-400 text-sm">
                  Each Guild learns from experience, improving its capabilities over time.
                </p>
              </div>

              <div className="bg-black/70 border border-gray-800 rounded-lg p-4">
                <h4 className="font-mono text-cyan-400 text-sm mb-2">Modular Deployment</h4>
                <p className="text-gray-400 text-sm">
                  Deploy only the Guilds you need, with the ability to add more as your needs evolve.
                </p>
              </div>

              <div className="bg-black/70 border border-gray-800 rounded-lg p-4">
                <h4 className="font-mono text-cyan-400 text-sm mb-2">Coordinated Response</h4>
                <p className="text-gray-400 text-sm">
                  Guilds coordinate their actions for a comprehensive response to threats.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

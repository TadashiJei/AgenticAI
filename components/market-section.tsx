"use client"

import { motion } from "framer-motion"
import { PieChart, Building, TrendingUp, AlertTriangle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function MarketSection() {
  const stats = [
    { label: "MSMEs Globally", value: "400M+", icon: <Building className="h-6 w-6 text-blue-500" /> },
    { label: "Annual Cyber Attacks", value: "2.5M+", icon: <AlertTriangle className="h-6 w-6 text-orange-500" /> },
    { label: "Market Growth", value: "15.3%", icon: <TrendingUp className="h-6 w-6 text-green-500" /> },
  ]

  return (
    <section id="market" className="min-h-screen py-20 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(14,165,233,0.15),transparent_70%)]"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-orbitron font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Market & Mission
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-6"></div>
          <p className="text-gray-300 max-w-2xl mx-auto">
            We're on a mission to protect the backbone of the global economy: Micro, Small, and Medium Enterprises
            (MSMEs).
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-black/50 border border-gray-800 rounded-lg p-6 backdrop-blur-sm"
            >
              <div className="flex items-center mb-4">
                <div className="p-2 rounded-lg bg-black/50 border border-gray-800 mr-3">{stat.icon}</div>
                <h3 className="text-lg font-orbitron font-bold text-white">{stat.label}</h3>
              </div>
              <div className="font-mono text-3xl text-cyan-400 font-bold">{stat.value}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card className="bg-black/50 border border-cyan-500/30 backdrop-blur-sm overflow-hidden h-full">
              <CardContent className="p-6">
                <h3 className="text-xl font-orbitron font-bold text-white mb-4 flex items-center">
                  <span className="p-2 rounded-lg bg-black/50 border border-gray-800 mr-3">
                    <Building className="h-5 w-5 text-orange-500" />
                  </span>
                  Why MSMEs?
                </h3>
                <div className="space-y-4 text-gray-300">
                  <p>
                    MSMEs represent over 90% of businesses worldwide but lack the resources for enterprise-grade
                    cybersecurity.
                  </p>
                  <p>
                    These businesses are increasingly targeted by cybercriminals who see them as vulnerable entry points
                    to larger supply chains.
                  </p>
                  <p>
                    DefenSys.ai bridges this security gap with affordable, autonomous protection tailored specifically
                    for small business needs.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card className="bg-black/50 border border-cyan-500/30 backdrop-blur-sm overflow-hidden h-full">
              <CardContent className="p-6">
                <h3 className="text-xl font-orbitron font-bold text-white mb-4 flex items-center">
                  <span className="p-2 rounded-lg bg-black/50 border border-gray-800 mr-3">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                  </span>
                  The Unseen Crisis
                </h3>
                <div className="space-y-4 text-gray-300">
                  <p>60% of small businesses that suffer a major cyber attack close within 6 months.</p>
                  <p>
                    The average cost of a data breach for small businesses exceeds $200,000 - enough to bankrupt many
                    operations.
                  </p>
                  <p>
                    Traditional security solutions are either too complex, too expensive, or require specialized staff
                    that MSMEs cannot afford.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-black/60 border border-blue-500/20 rounded-xl p-6 backdrop-blur-sm"
        >
          <h3 className="text-2xl font-orbitron font-bold text-white mb-6 text-center">TAM-SAM-SOM</h3>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="relative">
              <div className="w-48 h-48 rounded-full border-4 border-blue-500/30 flex items-center justify-center">
                <div className="w-36 h-36 rounded-full border-4 border-cyan-500/30 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full border-4 border-orange-500/30 flex items-center justify-center">
                    <PieChart className="h-10 w-10 text-orange-500" />
                  </div>
                </div>
              </div>

              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 border border-blue-500/30 rounded-full px-4 py-1">
                <span className="text-xs font-mono text-blue-400">TAM: $68B</span>
              </div>

              <div className="absolute top-1/2 left-full -translate-y-1/2 translate-x-2 bg-black/80 border border-cyan-500/30 rounded-full px-4 py-1">
                <span className="text-xs font-mono text-cyan-400">SAM: $22B</span>
              </div>

              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-black/80 border border-orange-500/30 rounded-full px-4 py-1">
                <span className="text-xs font-mono text-orange-400">SOM: $5B</span>
              </div>
            </div>

            <div className="max-w-md">
              <div className="space-y-4 text-gray-300">
                <p>
                  <span className="text-blue-400 font-mono">TAM:</span> The global cybersecurity market for businesses
                  of all sizes.
                </p>
                <p>
                  <span className="text-cyan-400 font-mono">SAM:</span> The cybersecurity market specifically for MSMEs
                  worldwide.
                </p>
                <p>
                  <span className="text-orange-400 font-mono">SOM:</span> Our initial target market of MSMEs in key
                  industries and regions.
                </p>
                <p className="pt-2 border-t border-gray-800">
                  DefenSys.ai is positioned to capture a significant portion of this market by offering an affordable,
                  autonomous solution that requires minimal technical expertise to deploy and maintain.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

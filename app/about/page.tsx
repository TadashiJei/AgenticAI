"use client"

import { motion } from "framer-motion"
import { Shield, Code, Cpu, Users, Building, Globe, Award } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { GridBackground } from "@/components/grid-background"
import { GlitchEffect } from "@/components/glitch-effect"
import { PageHeader } from "@/components/page-header"

export default function AboutPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <GridBackground />
      <GlitchEffect />

      <div className="relative z-10">
        <Navigation />

        <div className="container mx-auto px-4 pt-20">
          <PageHeader
            title="About DefenSys.ai"
            description="Our mission is to democratize cybersecurity for small and medium enterprises worldwide."
            gradient="from-orange-400 to-red-500"
          />

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-black/60 border border-orange-500/20 rounded-xl p-6 backdrop-blur-sm"
            >
              <h2 className="text-2xl font-orbitron font-bold text-white mb-4">Our Story</h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  DefenSys.ai was born from a vision to democratize cybersecurity for small and medium enterprises. In a
                  world where cyber threats are constantly evolving, we saw that MSMEs were being left vulnerable due to
                  lack of resources and expertise.
                </p>
                <p>
                  Founded by Andrea Faith B. Alimorong and Java Jay J. Bartolome, DefenSys.ai combines cutting-edge AI
                  technology with a deep understanding of cybersecurity challenges faced by small businesses.
                </p>
                <p>
                  Our autonomous AI-driven protection system embodies SDG 9: Industry, Innovation, and Infrastructure by
                  fortifying digital resilience for small businesses globally.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.15),transparent_70%)]"></div>
              <div className="relative h-full flex items-center justify-center">
                <div className="grid grid-cols-2 gap-4 w-full">
                  <div className="bg-black/70 border border-gray-800 rounded-lg p-4 flex flex-col items-center text-center transform hover:scale-105 transition-transform">
                    <Shield className="h-8 w-8 text-orange-500 mb-2" />
                    <h4 className="font-mono text-cyan-400 text-sm mb-1">Protection</h4>
                    <p className="text-gray-400 text-sm">Autonomous defense against evolving threats</p>
                  </div>
                  <div className="bg-black/70 border border-gray-800 rounded-lg p-4 flex flex-col items-center text-center transform hover:scale-105 transition-transform">
                    <Cpu className="h-8 w-8 text-blue-500 mb-2" />
                    <h4 className="font-mono text-cyan-400 text-sm mb-1">Innovation</h4>
                    <p className="text-gray-400 text-sm">AI-driven security for modern enterprises</p>
                  </div>
                  <div className="bg-black/70 border border-gray-800 rounded-lg p-4 flex flex-col items-center text-center transform hover:scale-105 transition-transform">
                    <Users className="h-8 w-8 text-purple-500 mb-2" />
                    <h4 className="font-mono text-cyan-400 text-sm mb-1">Accessibility</h4>
                    <p className="text-gray-400 text-sm">Making security accessible to all businesses</p>
                  </div>
                  <div className="bg-black/70 border border-gray-800 rounded-lg p-4 flex flex-col items-center text-center transform hover:scale-105 transition-transform">
                    <Code className="h-8 w-8 text-green-500 mb-2" />
                    <h4 className="font-mono text-cyan-400 text-sm mb-1">Expertise</h4>
                    <p className="text-gray-400 text-sm">Built by security experts for real-world challenges</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-16 bg-black/60 border border-cyan-500/20 rounded-xl p-6 backdrop-blur-sm"
          >
            <h2 className="text-2xl font-orbitron font-bold text-white mb-6 text-center">Our Vision & Mission</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-black/70 border border-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-orbitron font-bold text-white mb-4 flex items-center">
                  <Globe className="h-6 w-6 text-orange-500 mr-2" />
                  Vision
                </h3>
                <p className="text-gray-300">
                  A world where every business, regardless of size, has access to enterprise-grade cybersecurity
                  protection, enabling them to innovate and grow without fear of cyber threats.
                </p>
              </div>

              <div className="bg-black/70 border border-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-orbitron font-bold text-white mb-4 flex items-center">
                  <Award className="h-6 w-6 text-blue-500 mr-2" />
                  Mission
                </h3>
                <p className="text-gray-300">
                  To democratize cybersecurity by providing autonomous, AI-driven protection that is affordable,
                  accessible, and effective for MSMEs worldwide, empowering them to focus on their core business.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-16 mb-20 bg-black/60 border border-purple-500/20 rounded-xl p-6 backdrop-blur-sm"
          >
            <h2 className="text-2xl font-orbitron font-bold text-white mb-6 text-center">Global Impact</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-black/70 border border-gray-800 rounded-lg p-6 transform hover:scale-105 transition-transform">
                <h3 className="text-xl font-orbitron font-bold text-white mb-4 flex items-center">
                  <Building className="h-6 w-6 text-orange-500 mr-2" />
                  Economic Resilience
                </h3>
                <p className="text-gray-300">
                  By protecting MSMEs from cyber attacks, we help prevent financial losses and business closures,
                  contributing to economic stability and growth.
                </p>
              </div>

              <div className="bg-black/70 border border-gray-800 rounded-lg p-6 transform hover:scale-105 transition-transform">
                <h3 className="text-xl font-orbitron font-bold text-white mb-4 flex items-center">
                  <Shield className="h-6 w-6 text-blue-500 mr-2" />
                  Digital Trust
                </h3>
                <p className="text-gray-300">
                  We build trust in digital ecosystems by ensuring that businesses can operate securely online,
                  facilitating digital transformation and innovation.
                </p>
              </div>

              <div className="bg-black/70 border border-gray-800 rounded-lg p-6 transform hover:scale-105 transition-transform">
                <h3 className="text-xl font-orbitron font-bold text-white mb-4 flex items-center">
                  <Globe className="h-6 w-6 text-purple-500 mr-2" />
                  Global Reach
                </h3>
                <p className="text-gray-300">
                  Our solutions are designed to work across different regions and industries, addressing the unique
                  cybersecurity challenges faced by businesses worldwide.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <Footer />
      </div>
    </main>
  )
}

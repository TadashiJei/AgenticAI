"use client"

import { motion } from "framer-motion"
import { User, Code, Cpu, Shield } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function AboutSection() {
  const teamMembers = [
    {
      name: "Andrea Faith B. Alimorong",
      role: "Developer",
      quote: "We are the system.",
      icon: <User className="h-10 w-10 text-orange-500" />,
    },
    {
      name: "Java Jay J. Bartolome",
      role: "Developer",
      quote: "Built by builders who refused to stay silent.",
      icon: <Code className="h-10 w-10 text-blue-500" />,
    },
  ]

  return (
    <section id="about" className="min-h-screen py-20 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.15),transparent_70%)]"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-orbitron font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            About Us
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="bg-black/50 border border-cyan-500/30 backdrop-blur-sm overflow-hidden group">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-black/50 border border-gray-800">{member.icon}</div>
                    <div>
                      <h3 className="text-xl font-orbitron font-bold text-white mb-1">{member.name}</h3>
                      <p className="text-cyan-400 font-mono text-sm mb-4">{member.role}</p>
                      <blockquote className="border-l-2 border-orange-500 pl-4 italic text-gray-300 font-mono">
                        &quot;{member.quote}&quot;
                      </blockquote>
                    </div>
                  </div>
                </CardContent>
                <div className="h-1 w-0 bg-gradient-to-r from-orange-500 to-blue-500 transition-all duration-500 group-hover:w-full"></div>
              </Card>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-orbitron font-bold text-white mb-4">Our Mission</h3>
              <p className="text-gray-300 mb-4">
                DefenSys.ai was born from a vision to democratize cybersecurity for small and medium enterprises. We
                believe that every business, regardless of size, deserves enterprise-grade protection against evolving
                cyber threats.
              </p>
              <p className="text-gray-300">
                Our autonomous AI-driven protection system embodies SDG 9: Industry, Innovation, and Infrastructure by
                fortifying digital resilience for small businesses globally.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/70 border border-gray-800 rounded-lg p-4 flex flex-col items-center text-center">
                <Shield className="h-8 w-8 text-orange-500 mb-2" />
                <h4 className="font-mono text-cyan-400 text-sm mb-1">Protection</h4>
                <p className="text-gray-400 text-sm">Autonomous defense against evolving threats</p>
              </div>
              <div className="bg-black/70 border border-gray-800 rounded-lg p-4 flex flex-col items-center text-center">
                <Cpu className="h-8 w-8 text-blue-500 mb-2" />
                <h4 className="font-mono text-cyan-400 text-sm mb-1">Innovation</h4>
                <p className="text-gray-400 text-sm">AI-driven security for the modern enterprise</p>
              </div>
              <div className="bg-black/70 border border-gray-800 rounded-lg p-4 flex flex-col items-center text-center col-span-2">
                <Code className="h-8 w-8 text-purple-500 mb-2" />
                <h4 className="font-mono text-cyan-400 text-sm mb-1">Hacktivators</h4>
                <p className="text-gray-400 text-sm">
                  A hacker-engineer collective building the future of cybersecurity
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

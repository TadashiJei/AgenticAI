"use client"

import { motion } from "framer-motion"
import { User, Code } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { GridBackground } from "@/components/grid-background"
import { GlitchEffect } from "@/components/glitch-effect"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent } from "@/components/ui/card"

export default function TeamPage() {
  const founders = [
    {
      name: "Andrea Faith B. Alimorong",
      role: "Developer",
      bio: "With expertise in frontend development and UI/UX design, Andrea leads the development of DefenSys.ai's user interface and experience.",
      quote: "We are the system.",
      icon: <User className="h-10 w-10 text-orange-500" />,
    },
    {
      name: "Java Jay J. Bartolome",
      role: "Developer",
      bio: "Java combines deep technical knowledge with creative problem-solving to implement the backend systems and APIs that power DefenSys.ai.",
      quote: "Built by builders who refused to stay silent.",
      icon: <Code className="h-10 w-10 text-blue-500" />,
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
            title="Our Team"
            description="Meet the hackers, engineers, and visionaries behind DefenSys.ai"
            gradient="from-blue-400 to-purple-500"
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mt-16 text-center"
          >
            <h2 className="text-2xl font-orbitron font-bold text-white mb-2">Founders</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-orange-500 to-blue-500 mx-auto mb-8"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {founders.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                <Card className="bg-black/50 border border-cyan-500/30 backdrop-blur-sm overflow-hidden group hover:border-cyan-500/60 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-black/50 border border-gray-800 group-hover:border-cyan-500/30 transition-colors">
                        {member.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-orbitron font-bold text-white mb-1">{member.name}</h3>
                        <p className="text-cyan-400 font-mono text-sm mb-4">{member.role}</p>
                        <p className="text-gray-300 mb-4">{member.bio}</p>
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
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="bg-black/60 border border-blue-500/20 rounded-xl p-6 backdrop-blur-sm mb-20"
          >
            <h2 className="text-2xl font-orbitron font-bold text-white mb-6 text-center">Join Our Team</h2>

            <div className="text-center max-w-2xl mx-auto">
              <p className="text-gray-300 mb-6">
                We're always looking for talented individuals who are passionate about cybersecurity and want to make a
                difference for small and medium businesses worldwide.
              </p>

              <div className="inline-flex items-center justify-center relative group cursor-pointer">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                <button className="relative px-8 py-3 bg-black rounded-lg leading-none flex items-center">
                  <span className="text-cyan-400 group-hover:text-cyan-300 transition duration-200 font-mono">
                    Contact us about opportunities
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        <Footer />
      </div>
    </main>
  )
}

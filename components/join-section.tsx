"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Terminal, Send, DiscIcon as Discord, MessageSquare, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export function JoinSection() {
  const [commandInput, setCommandInput] = useState("")
  const [commandHistory, setCommandHistory] = useState<string[]>([
    "> Welcome to DefenSys.ai Terminal",
    "> Enter your details to join the network",
  ])

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!commandInput.trim()) return

    setCommandHistory([...commandHistory, `$ ${commandInput}`])

    // Simulate response based on input
    setTimeout(() => {
      let response = ""

      if (commandInput.toLowerCase().includes("help")) {
        response = "> Available commands: join, about, contact"
      } else if (commandInput.toLowerCase().includes("join")) {
        response = "> Please provide your handle, email, and reason for joining"
      } else if (commandInput.toLowerCase().includes("@")) {
        response = "> Thank you for your interest! We'll be in touch soon."
      } else {
        response = "> Command processed. Type 'help' for available commands."
      }

      setCommandHistory((prev) => [...prev, response])
    }, 500)

    setCommandInput("")
  }

  return (
    <section id="join" className="min-h-screen py-20 relative">
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
            Join the Network
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto mb-6"></div>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Become part of the DefenSys.ai community and help shape the future of cybersecurity for MSMEs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-black/60 border border-cyan-500/20 rounded-xl p-6 backdrop-blur-sm"
          >
            <h3 className="text-xl font-orbitron font-bold text-white mb-6 flex items-center">
              <Terminal className="h-5 w-5 mr-2 text-cyan-400" />
              Command Terminal
            </h3>

            <div className="bg-black/80 border border-gray-800 rounded-lg p-4 h-64 overflow-y-auto mb-4 font-mono text-sm">
              {commandHistory.map((cmd, index) => (
                <div key={index} className={`mb-2 ${cmd.startsWith("$") ? "text-orange-400" : "text-cyan-400"}`}>
                  {cmd}
                </div>
              ))}
            </div>

            <form onSubmit={handleCommandSubmit} className="flex gap-2">
              <Input
                type="text"
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                placeholder="enter command..."
                className="bg-black/50 border-gray-800 font-mono text-cyan-400"
              />
              <Button
                type="submit"
                variant="outline"
                size="icon"
                className="border-cyan-500 text-cyan-500 hover:bg-cyan-500/10"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-black/60 border border-cyan-500/20 rounded-xl p-6 backdrop-blur-sm"
          >
            <h3 className="text-xl font-orbitron font-bold text-white mb-6">Sign Up Form</h3>

            <form className="space-y-4">
              <div>
                <label htmlFor="handle" className="block text-sm font-mono text-gray-400 mb-1">
                  Handle / Username
                </label>
                <Input
                  id="handle"
                  type="text"
                  placeholder="your_handle"
                  className="bg-black/50 border-gray-800 font-mono"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-mono text-gray-400 mb-1">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@domain.xyz"
                  className="bg-black/50 border-gray-800 font-mono"
                />
              </div>

              <div>
                <label htmlFor="reason" className="block text-sm font-mono text-gray-400 mb-1">
                  Why you want to join...
                </label>
                <Textarea
                  id="reason"
                  placeholder="I'm interested in DefenSys.ai because..."
                  className="bg-black/50 border-gray-800 font-mono resize-none h-24"
                />
              </div>

              <Button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-mono">
                ENGAGE
              </Button>
            </form>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-black/50 border border-gray-800 rounded-lg p-6 backdrop-blur-sm text-center group hover:border-purple-500/30 transition-colors">
            <Discord className="h-10 w-10 text-purple-500 mx-auto mb-4" />
            <h3 className="text-lg font-orbitron font-bold text-white mb-2">Discord Community</h3>
            <p className="text-gray-300 text-sm mb-4">
              Join our Discord server to connect with other security enthusiasts and get real-time support.
            </p>
            <Button variant="outline" className="border-purple-500 text-purple-500 hover:bg-purple-500/10 font-mono">
              Join Discord
            </Button>
          </div>

          <div className="bg-black/50 border border-gray-800 rounded-lg p-6 backdrop-blur-sm text-center group hover:border-blue-500/30 transition-colors">
            <MessageSquare className="h-10 w-10 text-blue-500 mx-auto mb-4" />
            <h3 className="text-lg font-orbitron font-bold text-white mb-2">Telegram Channel</h3>
            <p className="text-gray-300 text-sm mb-4">
              Subscribe to our Telegram channel for news, updates, and security alerts.
            </p>
            <Button variant="outline" className="border-blue-500 text-blue-500 hover:bg-blue-500/10 font-mono">
              Join Telegram
            </Button>
          </div>

          <div className="bg-black/50 border border-gray-800 rounded-lg p-6 backdrop-blur-sm text-center group hover:border-orange-500/30 transition-colors">
            <Mail className="h-10 w-10 text-orange-500 mx-auto mb-4" />
            <h3 className="text-lg font-orbitron font-bold text-white mb-2">Newsletter</h3>
            <p className="text-gray-300 text-sm mb-4">
              Subscribe to our newsletter for monthly security insights and product updates.
            </p>
            <div className="flex gap-2">
              <Input type="email" placeholder="email@domain.xyz" className="bg-black/50 border-gray-800 font-mono" />
              <Button
                variant="outline"
                size="icon"
                className="border-orange-500 text-orange-500 hover:bg-orange-500/10"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

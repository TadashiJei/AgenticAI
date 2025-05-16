"use client"

import { motion } from "framer-motion"
import { Github, Linkedin, Twitter, Youtube, Shield } from "lucide-react"

export function Footer() {
  const socialLinks = [
    { icon: <Github className="h-5 w-5" />, href: "#", label: "GitHub" },
    { icon: <Linkedin className="h-5 w-5" />, href: "#", label: "LinkedIn" },
    { icon: <Twitter className="h-5 w-5" />, href: "#", label: "Twitter" },
    { icon: <Youtube className="h-5 w-5" />, href: "#", label: "YouTube" },
  ]

  return (
    <footer className="py-12 relative">
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <div className="flex items-center justify-center mb-4">
              <Shield className="h-10 w-10 text-orange-500 mr-2" />
              <span className="text-2xl font-orbitron font-bold bg-gradient-to-r from-orange-500 to-blue-500 bg-clip-text text-transparent">
                DefenSys.ai
              </span>
            </div>

            <div className="text-center font-mono text-gray-400 mb-6">
              <p className="text-sm">CODE. CREATE. CONQUER.</p>
              <p className="text-sm">DEFEND. DISRUPT. DEFENSYS.AI</p>
            </div>

            <div className="flex justify-center space-x-4">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="p-2 rounded-full bg-black/50 border border-gray-800 text-gray-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-colors group"
                  aria-label={link.label}
                >
                  <div className="transform group-hover:scale-110 transition-transform">{link.icon}</div>
                </a>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 w-full max-w-4xl mb-8">
            <div>
              <h4 className="text-sm font-orbitron font-bold text-white mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <a href="/features" className="text-sm text-gray-400 hover:text-cyan-400 transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="/pricing" className="text-sm text-gray-400 hover:text-cyan-400 transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="/documentation" className="text-sm text-gray-400 hover:text-cyan-400 transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="/roadmap" className="text-sm text-gray-400 hover:text-cyan-400 transition-colors">
                    Roadmap
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-orbitron font-bold text-white mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a href="/about" className="text-sm text-gray-400 hover:text-cyan-400 transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="/team" className="text-sm text-gray-400 hover:text-cyan-400 transition-colors">
                    Team
                  </a>
                </li>
                <li>
                  <a href="/contact" className="text-sm text-gray-400 hover:text-cyan-400 transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-orbitron font-bold text-white mb-4">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <a href="/blog" className="text-sm text-gray-400 hover:text-cyan-400 transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="/guides" className="text-sm text-gray-400 hover:text-cyan-400 transition-colors">
                    Guides
                  </a>
                </li>
                <li>
                  <a href="/events" className="text-sm text-gray-400 hover:text-cyan-400 transition-colors">
                    Events
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-orbitron font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <a href="/legal/privacy" className="text-sm text-gray-400 hover:text-cyan-400 transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="/legal/terms" className="text-sm text-gray-400 hover:text-cyan-400 transition-colors">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="/legal/security" className="text-sm text-gray-400 hover:text-cyan-400 transition-colors">
                    Security
                  </a>
                </li>
                <li>
                  <a href="/legal/compliance" className="text-sm text-gray-400 hover:text-cyan-400 transition-colors">
                    Compliance
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 w-full text-center">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} DefenSys.ai by Hacktivators. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, MapPin, Phone, Send, MessageSquare, Globe } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { GridBackground } from "@/components/grid-background"
import { GlitchEffect } from "@/components/glitch-effect"
import { PageHeader } from "@/components/page-header"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      setFormState({
        name: "",
        email: "",
        subject: "",
        message: "",
      })

      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false)
      }, 5000)
    }, 1500)
  }

  const offices = [
    {
      location: "Manila, Philippines",
      address: "Cyber Tower, BGC, Taguig City",
      phone: "+63 2 8123 4567",
      email: "ph@defensys.ai",
      icon: <MapPin className="h-6 w-6 text-orange-500" />,
    },
    {
      location: "San Francisco, USA",
      address: "101 Tech Avenue, San Francisco, CA",
      phone: "+1 415 555 7890",
      email: "us@defensys.ai",
      icon: <MapPin className="h-6 w-6 text-blue-500" />,
    },
    {
      location: "Singapore",
      address: "Cyber Hub, 42 Innovation Road",
      phone: "+65 6123 4567",
      email: "sg@defensys.ai",
      icon: <MapPin className="h-6 w-6 text-purple-500" />,
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
            title="Contact Us"
            description="Get in touch with our team for inquiries, support, or partnerships"
            gradient="from-cyan-400 to-blue-500"
          />

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-black/60 border border-cyan-500/20 rounded-xl p-6 backdrop-blur-sm"
            >
              <h2 className="text-2xl font-orbitron font-bold text-white mb-6">Send Us a Message</h2>

              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 text-green-400 font-mono text-center"
                >
                  <p>Message sent successfully! We'll get back to you soon.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-mono text-gray-400 mb-1">
                      Your Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      required
                      type="text"
                      placeholder="John Doe"
                      className="bg-black/50 border-gray-800 font-mono"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-mono text-gray-400 mb-1">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      name="email"
                      value={formState.email}
                      onChange={handleChange}
                      required
                      type="email"
                      placeholder="you@example.com"
                      className="bg-black/50 border-gray-800 font-mono"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-mono text-gray-400 mb-1">
                      Subject
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formState.subject}
                      onChange={handleChange}
                      required
                      type="text"
                      placeholder="How can we help?"
                      className="bg-black/50 border-gray-800 font-mono"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-mono text-gray-400 mb-1">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formState.message}
                      onChange={handleChange}
                      required
                      placeholder="Tell us more about your inquiry..."
                      className="bg-black/50 border-gray-800 font-mono resize-none h-32"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-mono relative overflow-hidden group"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    {isSubmitting ? (
                      <div className="flex items-center justify-center relative z-10">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        <span>Sending...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center relative z-10">
                        <Send className="mr-2 h-4 w-4" />
                        <span>Send Message</span>
                      </div>
                    )}
                  </Button>
                </form>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="bg-black/60 border border-orange-500/20 rounded-xl p-6 backdrop-blur-sm mb-8">
                <h2 className="text-2xl font-orbitron font-bold text-white mb-6">Get in Touch</h2>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="p-2 rounded-lg bg-black/50 border border-gray-800 mr-3">
                      <Mail className="h-5 w-5 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-orbitron font-bold text-white">Email</h3>
                      <p className="text-gray-300 font-mono">info@defensys.ai</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="p-2 rounded-lg bg-black/50 border border-gray-800 mr-3">
                      <Phone className="h-5 w-5 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-orbitron font-bold text-white">Phone</h3>
                      <p className="text-gray-300 font-mono">+1 (888) DEFENSYS</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="p-2 rounded-lg bg-black/50 border border-gray-800 mr-3">
                      <MessageSquare className="h-5 w-5 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-orbitron font-bold text-white">Live Chat</h3>
                      <p className="text-gray-300 font-mono">Available 24/7 on our website</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="p-2 rounded-lg bg-black/50 border border-gray-800 mr-3">
                      <Globe className="h-5 w-5 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-orbitron font-bold text-white">Social Media</h3>
                      <div className="flex space-x-2 mt-1">
                        <a
                          href="#"
                          className="p-1.5 rounded-full bg-black/50 border border-gray-800 text-gray-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                          </svg>
                        </a>
                        <a
                          href="#"
                          className="p-1.5 rounded-full bg-black/50 border border-gray-800 text-gray-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                          </svg>
                        </a>
                        <a
                          href="#"
                          className="p-1.5 rounded-full bg-black/50 border border-gray-800 text-gray-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                          </svg>
                        </a>
                        <a
                          href="#"
                          className="p-1.5 rounded-full bg-black/50 border border-gray-800 text-gray-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                            <rect x="2" y="9" width="4" height="12"></rect>
                            <circle cx="4" cy="4" r="2"></circle>
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-black/60 border border-purple-500/20 rounded-xl p-6 backdrop-blur-sm">
                <h2 className="text-2xl font-orbitron font-bold text-white mb-6">Response Time</h2>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 font-mono">General Inquiries</span>
                    <span className="text-cyan-400 font-mono">24-48 hours</span>
                  </div>
                  <div className="h-px bg-gray-800"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 font-mono">Technical Support</span>
                    <span className="text-cyan-400 font-mono">12-24 hours</span>
                  </div>
                  <div className="h-px bg-gray-800"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 font-mono">Security Incidents</span>
                    <span className="text-cyan-400 font-mono">1-4 hours</span>
                  </div>
                  <div className="h-px bg-gray-800"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 font-mono">Sales</span>
                    <span className="text-cyan-400 font-mono">24 hours</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-20"
          >
            <h2 className="text-2xl font-orbitron font-bold text-white mb-6 text-center">Global Offices</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {offices.map((office, index) => (
                <motion.div
                  key={office.location}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                >
                  <Card className="bg-black/50 border border-gray-800 backdrop-blur-sm overflow-hidden h-full group hover:border-cyan-500/30 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-2 rounded-lg bg-black/50 border border-gray-800 group-hover:scale-110 transition-transform">
                          {office.icon}
                        </div>
                        <div>
                          <h3 className="text-lg font-orbitron font-bold text-white mb-2">{office.location}</h3>
                          <div className="space-y-1 text-sm">
                            <p className="text-gray-300">{office.address}</p>
                            <p className="text-gray-300 font-mono">{office.phone}</p>
                            <p className="text-cyan-400 font-mono">{office.email}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <div className="h-0.5 w-0 bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500 group-hover:w-full"></div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <Footer />
      </div>
    </main>
  )
}

"use client"

import { motion } from "framer-motion"
import {
  Book,
  FileText,
  Shield,
  ArrowRight,
  Download,
  ExternalLink,
  Mail,
  BarChart,
  Laptop,
  Users,
  File,
  Clock,
} from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { GridBackground } from "@/components/grid-background"
import { GlitchEffect } from "@/components/glitch-effect"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function GuidesPage() {
  const featuredGuides = [
    {
      title: "Getting Started with DefenSys.ai",
      description: "A comprehensive guide to setting up and configuring DefenSys.ai for your business",
      level: "Beginner",
      time: "15 min",
      icon: <Book className="h-10 w-10 text-cyan-500" />,
      color: "border-cyan-500/30",
    },
    {
      title: "Advanced Threat Response Configuration",
      description: "Learn how to customize automated responses for different types of security threats",
      level: "Advanced",
      time: "25 min",
      icon: <Shield className="h-10 w-10 text-orange-500" />,
      color: "border-orange-500/30",
    },
    {
      title: "Security Best Practices for MSMEs",
      description: "Essential cybersecurity practices every small and medium business should implement",
      level: "Intermediate",
      time: "20 min",
      icon: <FileText className="h-10 w-10 text-purple-500" />,
      color: "border-purple-500/30",
    },
  ]

  const quickGuides = [
    {
      title: "Setting Up Email Alerts",
      description: "Configure email notifications for security events",
      time: "5 min",
      icon: <Mail className="h-6 w-6 text-cyan-500" />,
    },
    {
      title: "Interpreting Security Reports",
      description: "Understanding the data in your security reports",
      time: "8 min",
      icon: <BarChart className="h-6 w-6 text-orange-500" />,
    },
    {
      title: "Adding New Devices",
      description: "How to add and secure new devices in your network",
      time: "6 min",
      icon: <Laptop className="h-6 w-6 text-purple-500" />,
    },
    {
      title: "User Access Management",
      description: "Managing user permissions and access controls",
      time: "7 min",
      icon: <Users className="h-6 w-6 text-green-500" />,
    },
  ]

  const resources = [
    {
      title: "Cybersecurity Checklist",
      description: "A comprehensive checklist for securing your business",
      type: "PDF",
      icon: <FileText className="h-6 w-6 text-orange-500" />,
    },
    {
      title: "Threat Response Playbook",
      description: "Step-by-step guide for responding to common threats",
      type: "PDF",
      icon: <FileText className="h-6 w-6 text-cyan-500" />,
    },
    {
      title: "Security Policy Templates",
      description: "Customizable templates for your security policies",
      type: "ZIP",
      icon: <File className="h-6 w-6 text-purple-500" />,
    },
  ]

  const videoTutorials = [
    {
      title: "DefenSys.ai Dashboard Overview",
      duration: "8:24",
      thumbnail: "/placeholder.svg?height=150&width=300",
    },
    {
      title: "Configuring Automated Responses",
      duration: "12:37",
      thumbnail: "/placeholder.svg?height=150&width=300",
    },
    {
      title: "Analyzing Security Incidents",
      duration: "10:15",
      thumbnail: "/placeholder.svg?height=150&width=300",
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
            title="Guides & Resources"
            description="Learn how to get the most out of DefenSys.ai"
            gradient="from-blue-400 to-cyan-500"
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mt-16 text-center max-w-2xl mx-auto"
          >
            <p className="text-gray-300 mb-8">
              Browse our collection of guides, tutorials, and resources to help you implement effective cybersecurity
              practices and make the most of DefenSys.ai.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-orbitron font-bold text-white mb-6">Featured Guides</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredGuides.map((guide, index) => (
                <motion.div
                  key={guide.title}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                >
                  <Card
                    className={`bg-black/50 ${guide.color} backdrop-blur-sm overflow-hidden h-full group hover:border-opacity-60 transition-colors`}
                  >
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="p-3 rounded-lg bg-black/50 border border-gray-800 w-fit mb-4 group-hover:scale-110 transition-transform duration-300">
                        {guide.icon}
                      </div>
                      <h3 className="text-xl font-orbitron font-bold text-white mb-2">{guide.title}</h3>
                      <p className="text-gray-300 text-sm mb-4 flex-grow">{guide.description}</p>

                      <div className="flex items-center justify-between mb-4">
                        <span className="bg-black/50 border border-gray-800 text-gray-300 text-xs font-mono px-2 py-1 rounded">
                          {guide.level}
                        </span>
                        <span className="text-cyan-400 text-sm font-mono flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {guide.time}
                        </span>
                      </div>

                      <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-mono group/btn">
                        <span>Read Guide</span>
                        <ArrowRight className="ml-2 h-4 w-4 transform group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <Tabs defaultValue="quick-guides" className="mb-16">
            <TabsList className="bg-black/50 border border-gray-800 backdrop-blur-sm mx-auto w-fit">
              <TabsTrigger
                value="quick-guides"
                className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 font-mono"
              >
                Quick Guides
              </TabsTrigger>
              <TabsTrigger
                value="resources"
                className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400 font-mono"
              >
                Downloadable Resources
              </TabsTrigger>
              <TabsTrigger
                value="videos"
                className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400 font-mono"
              >
                Video Tutorials
              </TabsTrigger>
            </TabsList>

            <TabsContent value="quick-guides" className="mt-6">
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {quickGuides.map((guide, index) => (
                    <Card
                      key={guide.title}
                      className="bg-black/50 border border-gray-800 backdrop-blur-sm overflow-hidden group hover:border-cyan-500/30 transition-colors"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="p-2 rounded-lg bg-black/50 border border-gray-800 group-hover:scale-110 transition-transform">
                            {guide.icon}
                          </div>
                          <div className="flex-grow">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-lg font-orbitron font-bold text-white group-hover:text-cyan-400 transition-colors">
                                {guide.title}
                              </h3>
                              <span className="text-cyan-400 text-xs font-mono flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {guide.time}
                              </span>
                            </div>
                            <p className="text-gray-300 text-sm">{guide.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="resources" className="mt-6">
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {resources.map((resource, index) => (
                    <Card
                      key={resource.title}
                      className="bg-black/50 border border-gray-800 backdrop-blur-sm overflow-hidden group hover:border-orange-500/30 transition-colors"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center mb-4">
                          <div className="p-2 rounded-lg bg-black/50 border border-gray-800 mr-3 group-hover:scale-110 transition-transform">
                            {resource.icon}
                          </div>
                          <span className="bg-orange-500/20 text-orange-400 text-xs font-mono px-2 py-1 rounded">
                            {resource.type}
                          </span>
                        </div>
                        <h3 className="text-lg font-orbitron font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">
                          {resource.title}
                        </h3>
                        <p className="text-gray-300 text-sm mb-4">{resource.description}</p>
                        <Button
                          variant="outline"
                          className="w-full border-orange-500 text-orange-500 hover:bg-orange-500/10 font-mono group/btn"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          <span>Download</span>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="videos" className="mt-6">
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {videoTutorials.map((video, index) => (
                    <div
                      key={video.title}
                      className="bg-black/50 border border-gray-800 rounded-lg overflow-hidden group hover:border-purple-500/30 transition-colors"
                    >
                      <div className="relative">
                        <img
                          src={video.thumbnail || "/placeholder.svg"}
                          alt={video.title}
                          className="w-full h-auto object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-16 h-16 rounded-full bg-purple-500/80 flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-white"
                            >
                              <polygon points="5 3 19 12 5 21 5 3"></polygon>
                            </svg>
                          </div>
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs font-mono px-2 py-1 rounded">
                          {video.duration}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-orbitron font-bold text-white group-hover:text-purple-400 transition-colors">
                          {video.title}
                        </h3>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="bg-black/60 border border-cyan-500/20 rounded-xl p-6 backdrop-blur-sm mb-20"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-orbitron font-bold text-white mb-4">Can't Find What You Need?</h2>
                <p className="text-gray-300 mb-6">
                  Our documentation covers most common questions and scenarios, but if you need additional assistance,
                  our support team is here to help.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button className="bg-cyan-500 hover:bg-cyan-600 text-white font-mono">Contact Support</Button>
                  <Button variant="outline" className="border-cyan-500 text-cyan-500 hover:bg-cyan-500/10 font-mono">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Visit Knowledge Base
                  </Button>
                </div>
              </div>

              <div className="bg-black/70 border border-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-orbitron font-bold text-white mb-4">Request a Guide</h3>
                <p className="text-gray-300 mb-4">
                  Is there a specific topic you'd like us to cover? Let us know and we'll consider it for our next
                  guide.
                </p>
                <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-mono">
                  Suggest a Topic
                </Button>
              </div>
            </div>
          </motion.div>
        </div>

        <Footer />
      </div>
    </main>
  )
}

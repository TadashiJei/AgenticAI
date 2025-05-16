"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Book, FileText, Code, Terminal, Search, ChevronRight, ExternalLink } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { GridBackground } from "@/components/grid-background"
import { GlitchEffect } from "@/components/glitch-effect"
import { PageHeader } from "@/components/page-header"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DocumentationPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle search functionality
    console.log("Searching for:", searchQuery)
  }

  const docCategories = [
    {
      title: "Getting Started",
      icon: <Book className="h-6 w-6 text-cyan-500" />,
      docs: [
        { title: "Introduction to DefenSys.ai", path: "#" },
        { title: "Quick Start Guide", path: "#" },
        { title: "System Requirements", path: "#" },
        { title: "Installation", path: "#" },
        { title: "First-time Setup", path: "#" },
      ],
    },
    {
      title: "User Guides",
      icon: <FileText className="h-6 w-6 text-orange-500" />,
      docs: [
        { title: "Dashboard Overview", path: "#" },
        { title: "Alert Management", path: "#" },
        { title: "Reporting", path: "#" },
        { title: "User Management", path: "#" },
        { title: "Security Policies", path: "#" },
      ],
    },
    {
      title: "API Reference",
      icon: <Code className="h-6 w-6 text-purple-500" />,
      docs: [
        { title: "Authentication", path: "#" },
        { title: "Endpoints", path: "#" },
        { title: "Rate Limits", path: "#" },
        { title: "Error Handling", path: "#" },
        { title: "Webhooks", path: "#" },
      ],
    },
    {
      title: "Integrations",
      icon: <Terminal className="h-6 w-6 text-green-500" />,
      docs: [
        { title: "SIEM Integration", path: "#" },
        { title: "Slack Integration", path: "#" },
        { title: "Microsoft Teams Integration", path: "#" },
        { title: "Email Integration", path: "#" },
        { title: "Custom Webhooks", path: "#" },
      ],
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
            title="Documentation"
            description="Comprehensive guides and references for DefenSys.ai"
            gradient="from-purple-400 to-pink-500"
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mt-16 max-w-2xl mx-auto"
          >
            <form onSubmit={handleSearch} className="relative mb-12">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-black/50 border-gray-800 pl-10 font-mono focus:border-purple-500/50"
              />
              <Button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 bg-purple-500 hover:bg-purple-600 text-white font-mono py-0"
              >
                Search
              </Button>
            </form>
          </motion.div>

          <Tabs defaultValue="guides" className="mb-16">
            <TabsList className="bg-black/50 border border-gray-800 backdrop-blur-sm mx-auto w-fit">
              <TabsTrigger
                value="guides"
                className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400 font-mono"
              >
                Guides
              </TabsTrigger>
              <TabsTrigger
                value="api"
                className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 font-mono"
              >
                API Reference
              </TabsTrigger>
              <TabsTrigger
                value="examples"
                className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400 font-mono"
              >
                Examples
              </TabsTrigger>
              <TabsTrigger
                value="faq"
                className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400 font-mono"
              >
                FAQ
              </TabsTrigger>
            </TabsList>

            <TabsContent value="guides" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {docCategories.map((category, index) => (
                  <motion.div
                    key={category.title}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  >
                    <Card className="bg-black/50 border border-gray-800 backdrop-blur-sm overflow-hidden h-full group hover:border-purple-500/30 transition-colors">
                      <CardContent className="p-6">
                        <div className="flex items-center mb-4">
                          <div className="p-2 rounded-lg bg-black/50 border border-gray-800 mr-3">{category.icon}</div>
                          <h3 className="text-xl font-orbitron font-bold text-white">{category.title}</h3>
                        </div>

                        <ul className="space-y-2">
                          {category.docs.map((doc, i) => (
                            <li key={i}>
                              <a
                                href={doc.path}
                                className="flex items-center text-gray-300 hover:text-purple-400 transition-colors group/link"
                              >
                                <ChevronRight className="h-4 w-4 text-gray-500 group-hover/link:text-purple-400 transition-colors mr-2" />
                                <span>{doc.title}</span>
                              </a>
                            </li>
                          ))}
                        </ul>

                        <div className="mt-4 pt-4 border-t border-gray-800">
                          <a
                            href="#"
                            className="flex items-center text-purple-400 hover:text-purple-300 transition-colors text-sm font-mono"
                          >
                            <span>View all {category.title.toLowerCase()}</span>
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </a>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="api" className="mt-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-black/60 border border-cyan-500/20 rounded-xl p-6 backdrop-blur-sm"
              >
                <h2 className="text-2xl font-orbitron font-bold text-white mb-6">API Reference</h2>

                <div className="mb-6">
                  <div className="bg-black/70 border border-gray-800 rounded-lg p-4 font-mono text-sm mb-4">
                    <div className="flex items-center text-gray-400 mb-2">
                      <span className="text-cyan-400">BASE URL:</span>
                      <span className="ml-2">https://api.defensys.ai/v1</span>
                    </div>
                    <div className="flex items-center text-gray-400">
                      <span className="text-cyan-400">Authentication:</span>
                      <span className="ml-2">Bearer Token</span>
                    </div>
                  </div>

                  <p className="text-gray-300 mb-6">
                    The DefenSys.ai API allows you to integrate our security features into your existing systems and
                    workflows. Our RESTful API provides endpoints for managing alerts, devices, users, and more.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-black/70 border border-gray-800 rounded-lg p-4 hover:border-cyan-500/30 transition-colors">
                      <h3 className="text-lg font-orbitron font-bold text-white mb-2">Authentication</h3>
                      <p className="text-gray-300 text-sm mb-3">
                        Learn how to authenticate with the DefenSys.ai API using API keys and tokens.
                      </p>
                      <a
                        href="#"
                        className="flex items-center text-cyan-400 hover:text-cyan-300 transition-colors text-sm font-mono"
                      >
                        <span>View documentation</span>
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </div>

                    <div className="bg-black/70 border border-gray-800 rounded-lg p-4 hover:border-cyan-500/30 transition-colors">
                      <h3 className="text-lg font-orbitron font-bold text-white mb-2">Endpoints</h3>
                      <p className="text-gray-300 text-sm mb-3">
                        Explore the available API endpoints and their parameters, responses, and examples.
                      </p>
                      <a
                        href="#"
                        className="flex items-center text-cyan-400 hover:text-cyan-300 transition-colors text-sm font-mono"
                      >
                        <span>View documentation</span>
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <Button className="bg-cyan-500 hover:bg-cyan-600 text-white font-mono">
                    <Code className="mr-2 h-4 w-4" />
                    API Documentation
                  </Button>
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="examples" className="mt-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-black/60 border border-orange-500/20 rounded-xl p-6 backdrop-blur-sm"
              >
                <h2 className="text-2xl font-orbitron font-bold text-white mb-6">Code Examples</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-black/70 border border-gray-800 rounded-lg p-4">
                    <h3 className="text-lg font-orbitron font-bold text-white mb-3">JavaScript</h3>
                    <div className="bg-black/90 rounded-lg p-4 font-mono text-sm text-gray-300 overflow-x-auto">
                      <pre>
                        {`// Initialize the DefenSys.ai client
const defensys = new DefenSysClient({
  apiKey: 'your-api-key',
  region: 'us-east-1'
});

// Get active threats
defensys.threats.list({ status: 'active' })
  .then(threats => {
    console.log(\`Found \${threats.length} active threats\`);
  })
  .catch(error => {
    console.error('Error fetching threats:', error);
  });`}
                      </pre>
                    </div>
                  </div>

                  <div className="bg-black/70 border border-gray-800 rounded-lg p-4">
                    <h3 className="text-lg font-orbitron font-bold text-white mb-3">Python</h3>
                    <div className="bg-black/90 rounded-lg p-4 font-mono text-sm text-gray-300 overflow-x-auto">
                      <pre>
                        {`# Initialize the DefenSys.ai client
from defensys import DefenSysClient

client = DefenSysClient(
    api_key="your-api-key",
    region="us-east-1"
)

# Get active threats
try:
    threats = client.threats.list(status="active")
    print(f"Found {len(threats)} active threats")
except Exception as e:
    print(f"Error fetching threats: {e}")`}
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white font-mono">
                    <Book className="mr-2 h-4 w-4" />
                    View All Examples
                  </Button>
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="faq" className="mt-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-black/60 border border-green-500/20 rounded-xl p-6 backdrop-blur-sm"
              >
                <h2 className="text-2xl font-orbitron font-bold text-white mb-6">Frequently Asked Questions</h2>

                <div className="space-y-4 mb-6">
                  <div className="bg-black/70 border border-gray-800 rounded-lg p-4 hover:border-green-500/30 transition-colors">
                    <h3 className="text-lg font-orbitron font-bold text-white mb-2">How do I reset my API key?</h3>
                    <p className="text-gray-300">
                      You can reset your API key from the DefenSys.ai dashboard. Go to Settings &gt; API Keys and click
                      the "Reset" button next to your current API key. Note that this will invalidate your existing key
                      immediately.
                    </p>
                  </div>

                  <div className="bg-black/70 border border-gray-800 rounded-lg p-4 hover:border-green-500/30 transition-colors">
                    <h3 className="text-lg font-orbitron font-bold text-white mb-2">
                      What programming languages are supported?
                    </h3>
                    <p className="text-gray-300">
                      We provide official client libraries for JavaScript, Python, Go, and Ruby. However, since our API
                      is RESTful, you can use any language that can make HTTP requests.
                    </p>
                  </div>

                  <div className="bg-black/70 border border-gray-800 rounded-lg p-4 hover:border-green-500/30 transition-colors">
                    <h3 className="text-lg font-orbitron font-bold text-white mb-2">
                      How do I report a bug in the documentation?
                    </h3>
                    <p className="text-gray-300">
                      If you find an issue in our documentation, please email docs@defensys.ai with the details of the
                      problem. Include the URL of the page with the issue and a description of what's incorrect.
                    </p>
                  </div>

                  <div className="bg-black/70 border border-gray-800 rounded-lg p-4 hover:border-green-500/30 transition-colors">
                    <h3 className="text-lg font-orbitron font-bold text-white mb-2">
                      Are there limits to the API requests?
                    </h3>
                    <p className="text-gray-300">
                      Yes, API rate limits depend on your subscription plan. The Starter plan allows 100 requests per
                      minute, Professional allows 500 requests per minute, and Enterprise has custom limits based on
                      your needs.
                    </p>
                  </div>
                </div>

                <div className="text-center">
                  <Button className="bg-green-500 hover:bg-green-600 text-white font-mono">
                    <FileText className="mr-2 h-4 w-4" />
                    View All FAQs
                  </Button>
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="bg-black/60 border border-purple-500/20 rounded-xl p-6 backdrop-blur-sm mb-20"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-orbitron font-bold text-white mb-4">Need Help?</h2>
                <p className="text-gray-300 mb-6">
                  Our documentation covers most common questions and scenarios, but if you need additional assistance,
                  our support team is here to help.
                </p>
                <Button className="bg-purple-500 hover:bg-purple-600 text-white font-mono">Contact Support</Button>
              </div>

              <div className="bg-black/70 border border-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-orbitron font-bold text-white mb-4">Developer Community</h3>
                <p className="text-gray-300 mb-4">
                  Join our developer community to connect with other DefenSys.ai users, share knowledge, and get help
                  from experienced developers.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="outline" className="border-cyan-500 text-cyan-500 hover:bg-cyan-500/10 font-mono">
                    Join Discord
                  </Button>
                  <Button
                    variant="outline"
                    className="border-orange-500 text-orange-500 hover:bg-orange-500/10 font-mono"
                  >
                    GitHub Discussions
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <Footer />
      </div>
    </main>
  )
}

"use client"

import { motion } from "framer-motion"
import { Calendar, Clock, User, Tag, ArrowRight, Search } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { GridBackground } from "@/components/grid-background"
import { GlitchEffect } from "@/components/glitch-effect"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function BlogPage() {
  const featuredPost = {
    title: "The Rising Threat of Ransomware for Small Businesses",
    excerpt:
      "Small businesses are increasingly becoming targets for ransomware attacks. Learn how to protect your organization with these essential security measures.",
    date: "May 10, 2025",
    readTime: "8 min read",
    author: "Andrea Faith B. Alimorong",
    tags: ["Ransomware", "MSME", "Security"],
    image: "/placeholder.svg?height=400&width=800",
  }

  const recentPosts = [
    {
      title: "5 Essential Cybersecurity Practices for Remote Teams",
      excerpt:
        "With remote work becoming the norm, securing your distributed workforce is more important than ever. Discover the key practices to keep your team safe.",
      date: "May 5, 2025",
      readTime: "6 min read",
      author: "Java Jay J. Bartolome",
      tags: ["Remote Work", "Best Practices"],
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      title: "Understanding Zero-Day Vulnerabilities",
      excerpt:
        "Zero-day vulnerabilities represent some of the most dangerous security threats. Learn what they are and how AI-driven security can help protect against them.",
      date: "April 28, 2025",
      readTime: "5 min read",
      author: "Maya Rodriguez",
      tags: ["Zero-Day", "Vulnerabilities"],
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      title: "The Role of AI in Modern Cybersecurity",
      excerpt:
        "Artificial intelligence is revolutionizing how we approach cybersecurity. Explore how AI-driven solutions are changing the security landscape.",
      date: "April 20, 2025",
      readTime: "7 min read",
      author: "Raj Patel",
      tags: ["AI", "Innovation"],
      image: "/placeholder.svg?height=200&width=400",
    },
  ]

  const categories = [
    { name: "Threat Intelligence", count: 12 },
    { name: "Best Practices", count: 8 },
    { name: "Industry News", count: 6 },
    { name: "Product Updates", count: 5 },
    { name: "Case Studies", count: 4 },
  ]

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <GridBackground />
      <GlitchEffect />

      <div className="relative z-10">
        <Navigation />

        <div className="container mx-auto px-4 pt-20">
          <PageHeader
            title="Blog"
            description="Insights, updates, and resources from the DefenSys.ai team"
            gradient="from-orange-400 to-red-500"
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mt-16 max-w-2xl mx-auto mb-12"
          >
            <form className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search articles..."
                className="bg-black/50 border-gray-800 pl-10 font-mono focus:border-orange-500/50"
              />
              <Button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 bg-orange-500 hover:bg-orange-600 text-white font-mono py-0"
              >
                Search
              </Button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-orbitron font-bold text-white mb-6">Featured Article</h2>

            <Card className="bg-black/50 border border-orange-500/30 backdrop-blur-sm overflow-hidden group hover:border-orange-500/60 transition-colors">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="relative overflow-hidden">
                    <img
                      src={featuredPost.image || "/placeholder.svg"}
                      alt={featuredPost.title}
                      className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
                    <div className="absolute top-4 left-4 bg-orange-500/90 text-white text-xs font-mono px-2 py-1 rounded">
                      FEATURED
                    </div>
                  </div>
                  <div className="p-6 flex flex-col">
                    <div className="flex items-center text-sm text-gray-400 mb-3">
                      <div className="flex items-center mr-4">
                        <Calendar className="h-4 w-4 mr-1 text-orange-500" />
                        <span>{featuredPost.date}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-orange-500" />
                        <span>{featuredPost.readTime}</span>
                      </div>
                    </div>

                    <h3 className="text-2xl font-orbitron font-bold text-white mb-3 group-hover:text-orange-400 transition-colors">
                      {featuredPost.title}
                    </h3>

                    <p className="text-gray-300 mb-4 flex-grow">{featuredPost.excerpt}</p>

                    <div className="flex items-center text-sm text-gray-400 mb-4">
                      <User className="h-4 w-4 mr-1 text-orange-500" />
                      <span>By {featuredPost.author}</span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {featuredPost.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-black/50 border border-gray-800 text-gray-300 text-xs font-mono px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <Button className="w-fit bg-orange-500 hover:bg-orange-600 text-white font-mono group/btn">
                      <span>Read Article</span>
                      <ArrowRight className="ml-2 h-4 w-4 transform group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="md:col-span-2"
            >
              <h2 className="text-2xl font-orbitron font-bold text-white mb-6">Recent Articles</h2>

              <div className="grid grid-cols-1 gap-6">
                {recentPosts.map((post, index) => (
                  <Card
                    key={post.title}
                    className="bg-black/50 border border-gray-800 backdrop-blur-sm overflow-hidden group hover:border-cyan-500/30 transition-colors"
                  >
                    <CardContent className="p-0">
                      <div className="grid grid-cols-1 md:grid-cols-3">
                        <div className="relative overflow-hidden">
                          <img
                            src={post.image || "/placeholder.svg"}
                            alt={post.title}
                            className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="p-6 md:col-span-2 flex flex-col">
                          <div className="flex items-center text-sm text-gray-400 mb-3">
                            <div className="flex items-center mr-4">
                              <Calendar className="h-4 w-4 mr-1 text-cyan-500" />
                              <span>{post.date}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1 text-cyan-500" />
                              <span>{post.readTime}</span>
                            </div>
                          </div>

                          <h3 className="text-xl font-orbitron font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                            {post.title}
                          </h3>

                          <p className="text-gray-300 text-sm mb-3 flex-grow">{post.excerpt}</p>

                          <div className="flex items-center text-sm text-gray-400 mb-3">
                            <User className="h-4 w-4 mr-1 text-cyan-500" />
                            <span>By {post.author}</span>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {post.tags.map((tag) => (
                              <span
                                key={tag}
                                className="bg-black/50 border border-gray-800 text-gray-300 text-xs font-mono px-2 py-1 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-8 text-center">
                <Button variant="outline" className="border-cyan-500 text-cyan-500 hover:bg-cyan-500/10 font-mono">
                  View All Articles
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="bg-black/60 border border-gray-800 rounded-xl p-6 backdrop-blur-sm mb-6">
                <h3 className="text-xl font-orbitron font-bold text-white mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category.name} className="flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center">
                        <Tag className="h-4 w-4 text-cyan-500 mr-2" />
                        <span className="text-gray-300 group-hover:text-cyan-400 transition-colors">
                          {category.name}
                        </span>
                      </div>
                      <span className="bg-black/50 border border-gray-800 text-gray-400 text-xs font-mono px-2 py-1 rounded-full">
                        {category.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-black/60 border border-gray-800 rounded-xl p-6 backdrop-blur-sm">
                <h3 className="text-xl font-orbitron font-bold text-white mb-4">Subscribe</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Stay updated with the latest cybersecurity insights and DefenSys.ai news.
                </p>
                <form className="space-y-3">
                  <Input
                    type="email"
                    placeholder="Your email address"
                    className="bg-black/50 border-gray-800 font-mono"
                  />
                  <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-mono">Subscribe</Button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>

        <Footer />
      </div>
    </main>
  )
}

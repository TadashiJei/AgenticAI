"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, Clock, MapPin, Users, Filter, ChevronRight, ExternalLink } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { GridBackground } from "@/components/grid-background"
import { GlitchEffect } from "@/components/glitch-effect"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function EventsPage() {
  const [filter, setFilter] = useState("all")

  const upcomingEvents = [
    {
      title: "DefenSys.ai Launch Event",
      date: "June 15, 2025",
      time: "10:00 AM - 2:00 PM",
      location: "Virtual Event",
      description:
        "Join us for the official launch of DefenSys.ai, featuring demos, Q&A, and special offers for early adopters.",
      type: "virtual",
      attendees: 342,
    },
    {
      title: "Cybersecurity for MSMEs Workshop",
      date: "July 8, 2025",
      time: "1:00 PM - 4:00 PM",
      location: "Tech Hub, Manila",
      description: "A hands-on workshop focused on practical cybersecurity measures for small businesses.",
      type: "in-person",
      attendees: 75,
    },
    {
      title: "Threat Intelligence Webinar",
      date: "July 22, 2025",
      time: "11:00 AM - 12:30 PM",
      location: "Virtual Event",
      description: "Learn about the latest cybersecurity threats and how to protect your business from them.",
      type: "virtual",
      attendees: 210,
    },
    {
      title: "DefenSys.ai User Conference",
      date: "August 15-16, 2025",
      time: "9:00 AM - 5:00 PM",
      location: "Grand Hyatt, Singapore",
      description:
        "A two-day conference featuring keynotes, workshops, and networking opportunities for DefenSys.ai users.",
      type: "in-person",
      attendees: 150,
    },
  ]

  const pastEvents = [
    {
      title: "Pre-launch Webinar",
      date: "May 5, 2025",
      time: "11:00 AM - 12:30 PM",
      location: "Virtual Event",
      description: "An introduction to DefenSys.ai and its capabilities for protecting small businesses.",
      type: "virtual",
      recording: true,
    },
    {
      title: "Hacktivators Meetup",
      date: "April 22, 2025",
      time: "6:00 PM - 9:00 PM",
      location: "Innovation Hub, Makati",
      description: "A gathering of the Hacktivators community to discuss the future of cybersecurity for MSMEs.",
      type: "in-person",
      recording: false,
    },
    {
      title: "AI in Cybersecurity Panel",
      date: "April 10, 2025",
      time: "2:00 PM - 3:30 PM",
      location: "Virtual Event",
      description: "A panel discussion on the role of AI in modern cybersecurity solutions.",
      type: "virtual",
      recording: true,
    },
  ]

  const filteredUpcomingEvents =
    filter === "all" ? upcomingEvents : upcomingEvents.filter((event) => event.type === filter)

  const filteredPastEvents = filter === "all" ? pastEvents : pastEvents.filter((event) => event.type === filter)

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <GridBackground />
      <GlitchEffect />

      <div className="relative z-10">
        <Navigation />

        <div className="container mx-auto px-4 pt-20">
          <PageHeader
            title="Events & Initiatives"
            description="Join us at our upcoming events to learn more about DefenSys.ai"
            gradient="from-purple-400 to-pink-500"
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mt-16 flex flex-col md:flex-row justify-between items-center gap-4 mb-8"
          >
            <div className="w-full md:w-auto">
              <div className="flex items-center">
                <Filter className="h-5 w-5 text-purple-500 mr-2" />
                <span className="text-gray-300 mr-3">Filter by:</span>
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-[180px] bg-black/50 border-gray-800">
                    <SelectValue placeholder="Event Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border-gray-800">
                    <SelectItem value="all">All Events</SelectItem>
                    <SelectItem value="virtual">Virtual</SelectItem>
                    <SelectItem value="in-person">In-Person</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="w-full md:w-auto">
              <form className="relative">
                <Input
                  type="text"
                  placeholder="Search events..."
                  className="w-full md:w-[300px] bg-black/50 border-gray-800 pl-10 font-mono"
                />
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
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </form>
            </div>
          </motion.div>

          <Tabs defaultValue="upcoming" className="mb-16">
            <TabsList className="bg-black/50 border border-gray-800 backdrop-blur-sm mx-auto w-fit">
              <TabsTrigger
                value="upcoming"
                className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400 font-mono"
              >
                Upcoming Events
              </TabsTrigger>
              <TabsTrigger
                value="past"
                className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 font-mono"
              >
                Past Events
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredUpcomingEvents.map((event, index) => (
                  <motion.div
                    key={event.title}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="bg-black/50 border border-purple-500/30 backdrop-blur-sm overflow-hidden group hover:border-purple-500/60 transition-colors">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-xl font-orbitron font-bold text-white group-hover:text-purple-400 transition-colors">
                            {event.title}
                          </h3>
                          <div
                            className={`px-3 py-1 rounded-full text-xs font-mono ${
                              event.type === "virtual"
                                ? "bg-blue-500/20 text-blue-400"
                                : "bg-green-500/20 text-green-400"
                            }`}
                          >
                            {event.type === "virtual" ? "VIRTUAL" : "IN-PERSON"}
                          </div>
                        </div>

                        <p className="text-gray-300 mb-4">{event.description}</p>

                        <div className="space-y-3 mb-4">
                          <div className="flex items-center text-gray-300">
                            <Calendar className="h-4 w-4 mr-2 text-purple-400" />
                            <span className="text-sm font-mono">{event.date}</span>
                          </div>

                          <div className="flex items-center text-gray-300">
                            <Clock className="h-4 w-4 mr-2 text-purple-400" />
                            <span className="text-sm font-mono">{event.time}</span>
                          </div>

                          <div className="flex items-center text-gray-300">
                            <MapPin className="h-4 w-4 mr-2 text-purple-400" />
                            <span className="text-sm font-mono">{event.location}</span>
                          </div>

                          <div className="flex items-center text-gray-300">
                            <Users className="h-4 w-4 mr-2 text-purple-400" />
                            <span className="text-sm font-mono">{event.attendees} attending</span>
                          </div>
                        </div>

                        <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white font-mono">
                          Register Now
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {filteredUpcomingEvents.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-400">No {filter} events found. Please check back later.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="past" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredPastEvents.map((event, index) => (
                  <motion.div
                    key={event.title}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="bg-black/50 border border-cyan-500/30 backdrop-blur-sm overflow-hidden group hover:border-cyan-500/60 transition-colors">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-xl font-orbitron font-bold text-white group-hover:text-cyan-400 transition-colors">
                            {event.title}
                          </h3>
                          <div
                            className={`px-3 py-1 rounded-full text-xs font-mono ${
                              event.type === "virtual"
                                ? "bg-blue-500/20 text-blue-400"
                                : "bg-green-500/20 text-green-400"
                            }`}
                          >
                            {event.type === "virtual" ? "VIRTUAL" : "IN-PERSON"}
                          </div>
                        </div>

                        <p className="text-gray-300 mb-4">{event.description}</p>

                        <div className="space-y-3 mb-4">
                          <div className="flex items-center text-gray-300">
                            <Calendar className="h-4 w-4 mr-2 text-cyan-400" />
                            <span className="text-sm font-mono">{event.date}</span>
                          </div>

                          <div className="flex items-center text-gray-300">
                            <Clock className="h-4 w-4 mr-2 text-cyan-400" />
                            <span className="text-sm font-mono">{event.time}</span>
                          </div>

                          <div className="flex items-center text-gray-300">
                            <MapPin className="h-4 w-4 mr-2 text-cyan-400" />
                            <span className="text-sm font-mono">{event.location}</span>
                          </div>
                        </div>

                        {event.recording ? (
                          <Button className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-mono">
                            Watch Recording
                          </Button>
                        ) : (
                          <Button variant="outline" className="w-full border-gray-700 text-gray-400 font-mono" disabled>
                            No Recording Available
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {filteredPastEvents.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-400">No past {filter} events found.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="bg-black/60 border border-purple-500/20 rounded-xl p-6 backdrop-blur-sm mb-16"
          >
            <h2 className="text-2xl font-orbitron font-bold text-white mb-6 text-center">Countdown to Launch</h2>

            <div className="flex justify-center mb-8">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="bg-black/70 border border-purple-500/30 rounded-lg w-20 h-20 flex items-center justify-center text-3xl font-mono text-purple-400 animate-pulse">
                    32
                  </div>
                  <span className="text-xs font-mono text-gray-400 mt-2">DAYS</span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="bg-black/70 border border-purple-500/30 rounded-lg w-20 h-20 flex items-center justify-center text-3xl font-mono text-purple-400">
                    14
                  </div>
                  <span className="text-xs font-mono text-gray-400 mt-2">HOURS</span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="bg-black/70 border border-purple-500/30 rounded-lg w-20 h-20 flex items-center justify-center text-3xl font-mono text-purple-400">
                    22
                  </div>
                  <span className="text-xs font-mono text-gray-400 mt-2">MINUTES</span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="bg-black/70 border border-purple-500/30 rounded-lg w-20 h-20 flex items-center justify-center text-3xl font-mono text-purple-400">
                    37
                  </div>
                  <span className="text-xs font-mono text-gray-400 mt-2">SECONDS</span>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-gray-300 max-w-2xl mx-auto mb-6">
                Join us for the official launch of DefenSys.ai, where we'll showcase our full suite of cybersecurity
                solutions for MSMEs. Register now to secure your spot and receive exclusive early access benefits.
              </p>

              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-mono px-8 py-6 h-auto">
                REGISTER FOR LAUNCH EVENT
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20"
          >
            <div className="bg-black/60 border border-cyan-500/20 rounded-xl p-6 backdrop-blur-sm">
              <h2 className="text-2xl font-orbitron font-bold text-white mb-6">Host Your Own Event</h2>
              <p className="text-gray-300 mb-6">
                Are you interested in hosting a cybersecurity event for your organization or community? We offer speaker
                sessions, workshops, and training programs tailored to your needs.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-cyan-500 mr-2 shrink-0" />
                  <span className="text-gray-300">Expert speakers on cybersecurity topics</span>
                </div>
                <div className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-cyan-500 mr-2 shrink-0" />
                  <span className="text-gray-300">Hands-on workshops for your team</span>
                </div>
                <div className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-cyan-500 mr-2 shrink-0" />
                  <span className="text-gray-300">Customized training programs</span>
                </div>
                <div className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-cyan-500 mr-2 shrink-0" />
                  <span className="text-gray-300">Virtual or in-person options available</span>
                </div>
              </div>
              <Button className="bg-cyan-500 hover:bg-cyan-600 text-white font-mono">Request an Event</Button>
            </div>

            <div className="bg-black/60 border border-orange-500/20 rounded-xl p-6 backdrop-blur-sm">
              <h2 className="text-2xl font-orbitron font-bold text-white mb-6">Community Initiatives</h2>
              <p className="text-gray-300 mb-6">
                We're committed to building a safer digital world for everyone. Learn about our community initiatives
                and how you can get involved.
              </p>
              <div className="space-y-4">
                <div className="bg-black/70 border border-gray-800 rounded-lg p-4 hover:border-orange-500/30 transition-colors group">
                  <h3 className="text-lg font-orbitron font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">
                    MSME Security Education Program
                  </h3>
                  <p className="text-gray-300 text-sm mb-3">
                    Free cybersecurity training for small businesses in underserved communities.
                  </p>
                  <a
                    href="#"
                    className="flex items-center text-orange-400 hover:text-orange-300 transition-colors text-sm font-mono"
                  >
                    <span>Learn more</span>
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </div>

                <div className="bg-black/70 border border-gray-800 rounded-lg p-4 hover:border-orange-500/30 transition-colors group">
                  <h3 className="text-lg font-orbitron font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">
                    Cybersecurity Scholarship Fund
                  </h3>
                  <p className="text-gray-300 text-sm mb-3">
                    Supporting the next generation of cybersecurity professionals.
                  </p>
                  <a
                    href="#"
                    className="flex items-center text-orange-400 hover:text-orange-300 transition-colors text-sm font-mono"
                  >
                    <span>Learn more</span>
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
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

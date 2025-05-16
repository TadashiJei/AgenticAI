"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, Clock, MapPin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function EventsSection() {
  const [activeTab, setActiveTab] = useState("upcoming")

  const events = {
    upcoming: [
      {
        title: "DefenSys Launch Event",
        date: "June 15, 2025",
        time: "10:00 AM - 2:00 PM",
        location: "Virtual Event",
        description:
          "Join us for the official launch of DefenSys.ai, featuring demos, Q&A, and special offers for early adopters.",
      },
      {
        title: "Cybersecurity for MSMEs Workshop",
        date: "July 8, 2025",
        time: "1:00 PM - 4:00 PM",
        location: "Tech Hub, Manila",
        description: "A hands-on workshop focused on practical cybersecurity measures for small businesses.",
      },
    ],
    live: [
      {
        title: "Live Threat Hunting Demo",
        date: "Today",
        time: "Ongoing",
        location: "Virtual Event",
        description: "Watch our security experts demonstrate real-time threat hunting techniques using DefenSys.ai.",
      },
    ],
    completed: [
      {
        title: "Pre-launch Webinar",
        date: "May 5, 2025",
        time: "11:00 AM - 12:30 PM",
        location: "Virtual Event",
        description: "An introduction to DefenSys.ai and its capabilities for protecting small businesses.",
      },
      {
        title: "Hacktivators Meetup",
        date: "April 22, 2025",
        time: "6:00 PM - 9:00 PM",
        location: "Innovation Hub, Makati",
        description: "A gathering of the Hacktivators community to discuss the future of cybersecurity for MSMEs.",
      },
    ],
  }

  return (
    <section id="events" className="min-h-screen py-20 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(249,115,22,0.15),transparent_70%)]"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-orbitron font-bold mb-4 bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
            Events & Initiatives
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-orange-500 to-red-500 mx-auto mb-6"></div>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Join us at our upcoming events to learn more about DefenSys.ai and connect with our community.
          </p>
        </motion.div>

        <Tabs defaultValue="upcoming" className="mb-16">
          <TabsList className="bg-black/50 border border-gray-800 backdrop-blur-sm">
            <TabsTrigger
              value="upcoming"
              className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400 font-mono"
              onClick={() => setActiveTab("upcoming")}
            >
              UPCOMING OPS
            </TabsTrigger>
            <TabsTrigger
              value="live"
              className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400 font-mono"
              onClick={() => setActiveTab("live")}
            >
              LIVE INTEL
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400 font-mono"
              onClick={() => setActiveTab("completed")}
            >
              COMPLETED MISSIONS
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {events.upcoming.map((event, index) => (
                <motion.div
                  key={event.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <EventCard event={event} type="upcoming" />
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="live" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {events.live.map((event, index) => (
                <motion.div
                  key={event.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <EventCard event={event} type="live" />
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {events.completed.map((event, index) => (
                <motion.div
                  key={event.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <EventCard event={event} type="completed" />
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-black/60 border border-orange-500/20 rounded-xl p-6 backdrop-blur-sm"
        >
          <h3 className="text-2xl font-orbitron font-bold text-white mb-6 text-center">Countdown to Launch</h3>

          <div className="flex justify-center mb-8">
            <CountdownTimer targetDate="2025-06-15T10:00:00" />
          </div>

          <div className="text-center">
            <p className="text-gray-300 max-w-2xl mx-auto mb-6">
              Join us for the official launch of DefenSys.ai, where we'll showcase our full suite of cybersecurity
              solutions for MSMEs. Register now to secure your spot and receive exclusive early access benefits.
            </p>

            <button className="bg-orange-500 hover:bg-orange-600 text-white font-mono px-6 py-3 rounded-md transition-colors">
              REGISTER FOR LAUNCH EVENT
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function EventCard({ event, type }: { event: any; type: string }) {
  const borderColor =
    type === "upcoming" ? "border-orange-500/30" : type === "live" ? "border-blue-500/30" : "border-purple-500/30"

  const badgeColor =
    type === "upcoming"
      ? "bg-orange-500/20 text-orange-400"
      : type === "live"
        ? "bg-blue-500/20 text-blue-400"
        : "bg-purple-500/20 text-purple-400"

  return (
    <Card
      className={`bg-black/50 border ${borderColor} backdrop-blur-sm overflow-hidden h-full group hover:scale-[1.02] transition-transform duration-300`}
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-orbitron font-bold text-white">{event.title}</h3>
          <div className={`px-3 py-1 rounded-full text-xs font-mono ${badgeColor}`}>
            {type === "upcoming" ? "UPCOMING" : type === "live" ? "LIVE NOW" : "COMPLETED"}
          </div>
        </div>

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

        <p className="text-gray-300 text-sm">{event.description}</p>

        {type === "upcoming" && (
          <button className="mt-4 w-full bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 font-mono py-2 rounded-md transition-colors text-sm">
            REGISTER
          </button>
        )}

        {type === "live" && (
          <button className="mt-4 w-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 font-mono py-2 rounded-md transition-colors text-sm">
            JOIN NOW
          </button>
        )}

        {type === "completed" && (
          <button className="mt-4 w-full bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 font-mono py-2 rounded-md transition-colors text-sm">
            VIEW RECORDING
          </button>
        )}
      </CardContent>
    </Card>
  )
}

function CountdownTimer({ targetDate }: { targetDate: string }) {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date()
    let timeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    }

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      }
    }

    return timeLeft
  }

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

  // For demo purposes, we'll just show static values
  const staticTimeLeft = {
    days: 32,
    hours: 14,
    minutes: 22,
    seconds: 37,
  }

  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="bg-black/70 border border-orange-500/30 rounded-lg w-20 h-20 flex items-center justify-center text-3xl font-mono text-orange-400">
          {staticTimeLeft.days}
        </div>
        <span className="text-xs font-mono text-gray-400 mt-2">DAYS</span>
      </div>

      <div className="flex flex-col items-center">
        <div className="bg-black/70 border border-orange-500/30 rounded-lg w-20 h-20 flex items-center justify-center text-3xl font-mono text-orange-400">
          {staticTimeLeft.hours}
        </div>
        <span className="text-xs font-mono text-gray-400 mt-2">HOURS</span>
      </div>

      <div className="flex flex-col items-center">
        <div className="bg-black/70 border border-orange-500/30 rounded-lg w-20 h-20 flex items-center justify-center text-3xl font-mono text-orange-400">
          {staticTimeLeft.minutes}
        </div>
        <span className="text-xs font-mono text-gray-400 mt-2">MINUTES</span>
      </div>

      <div className="flex flex-col items-center">
        <div className="bg-black/70 border border-orange-500/30 rounded-lg w-20 h-20 flex items-center justify-center text-3xl font-mono text-orange-400">
          {staticTimeLeft.seconds}
        </div>
        <span className="text-xs font-mono text-gray-400 mt-2">SECONDS</span>
      </div>
    </div>
  )
}

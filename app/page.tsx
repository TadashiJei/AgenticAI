"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { SolutionSection } from "@/components/solution-section"
import { MarketSection } from "@/components/market-section"
import { FeaturesSection } from "@/components/features-section"
import { GuildsSection } from "@/components/guilds-section"
import { EventsSection } from "@/components/events-section"
import { JoinSection } from "@/components/join-section"
import { Footer } from "@/components/footer"
import { Navigation } from "@/components/navigation"
import { GridBackground } from "@/components/grid-background"
import { GlitchEffect } from "@/components/glitch-effect"

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <GridBackground />
      <GlitchEffect />

      <div className="relative z-10">
        <Navigation />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="container mx-auto px-4"
        >
          <HeroSection />
          <AboutSection />
          <SolutionSection />
          <MarketSection />
          <FeaturesSection />
          <GuildsSection />
          <EventsSection />
          <JoinSection />
          <Footer />
        </motion.div>
      </div>
    </main>
  )
}

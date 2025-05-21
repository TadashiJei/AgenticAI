"use client"

import { useEffect, useState, ReactNode } from "react"

interface GlitchEffectProps {
  children: ReactNode;
}

export function GlitchEffect({ children }: GlitchEffectProps) {
  const [glitchActive, setGlitchActive] = useState(false)

  useEffect(() => {
    // Randomly trigger glitch effect
    const triggerGlitch = () => {
      const randomDelay = Math.random() * 10000 + 5000 // Between 5-15 seconds

      setTimeout(() => {
        setGlitchActive(true)

        // Deactivate after a short period
        setTimeout(() => {
          setGlitchActive(false)
          triggerGlitch() // Schedule next glitch
        }, 200)
      }, randomDelay)
    }

    triggerGlitch()

    return () => {
      setGlitchActive(false)
    }
  }, [])

  return (
    <div className="relative">
      {children}
      
      {glitchActive && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <div className="absolute inset-0 bg-cyan-500/5 animate-pulse"></div>
          <div className="absolute top-1/4 left-0 right-0 h-px bg-cyan-400/30 animate-glitch-h-1"></div>
          <div className="absolute top-1/3 left-0 right-0 h-px bg-orange-400/30 animate-glitch-h-2"></div>
          <div className="absolute top-1/2 left-0 right-0 h-px bg-purple-400/30 animate-glitch-h-3"></div>
          <div className="absolute top-2/3 left-0 right-0 h-px bg-cyan-400/30 animate-glitch-h-4"></div>
        </div>
      )}
    </div>
  )
}

"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Shield, Eye, Code } from "lucide-react"

export function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const nodes: { x: number; y: number; vx: number; vy: number; radius: number; color: string }[] = []
    const nodeCount = 50
    const connectionDistance = 150

    // Create nodes
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
        color: i % 3 === 0 ? "#f97316" : i % 3 === 1 ? "#0ea5e9" : "#a855f7",
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]

        // Update position
        node.x += node.vx
        node.y += node.vy

        // Bounce off edges
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1

        // Draw node
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
        ctx.fillStyle = node.color
        ctx.fill()

        // Draw connections
        for (let j = i + 1; j < nodes.length; j++) {
          const otherNode = nodes[j]
          const dx = otherNode.x - node.x
          const dy = otherNode.y - node.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < connectionDistance) {
            ctx.beginPath()
            ctx.moveTo(node.x, node.y)
            ctx.lineTo(otherNode.x, otherNode.y)
            ctx.strokeStyle = `rgba(${node.color === "#f97316" ? "249, 115, 22" : node.color === "#0ea5e9" ? "14, 165, 233" : "168, 85, 247"}, ${1 - distance / connectionDistance})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <section
      id="home"
      className="min-h-screen pt-20 flex flex-col items-center justify-center relative overflow-hidden"
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6"
        >
          <h2 className="text-xl md:text-2xl font-mono text-gray-400 tracking-wider mb-2">DETECT. ANALYZE. RESPOND.</h2>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-orbitron font-bold mb-4 bg-gradient-to-r from-orange-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
            DefenSys.ai
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto">
            Autonomous AI-Driven Protection for MSMEs
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="flex flex-col md:flex-row gap-4 justify-center mt-8"
        >
          <Button
            size="lg"
            className="bg-orange-500 hover:bg-orange-600 text-white font-mono group relative overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <Shield className="mr-2 h-5 w-5 relative z-10" />
            <span className="relative z-10">ENGAGE PROTECTION</span>
          </Button>

          <Button
            size="lg"
            className="bg-blue-500 hover:bg-blue-600 text-white font-mono group relative overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <Eye className="mr-2 h-5 w-5 relative z-10" />
            <span className="relative z-10">EXPLORE DEFENSE FLOW</span>
          </Button>

          <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10 font-mono group">
            <Code className="mr-2 h-5 w-5 group-hover:text-cyan-400 transition-colors" />
            <span className="group-hover:text-cyan-400 transition-colors">MEET THE CREATORS</span>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-16 text-sm font-mono text-gray-500"
        >
          <div className="flex items-center justify-center gap-2">
            <div className="h-1 w-1 rounded-full bg-green-500 animate-pulse"></div>
            <span>SYSTEM ONLINE</span>
            <div className="h-px w-16 bg-gray-700"></div>
            <span>LAST BREACH DETECTED: 4d 13h ago</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

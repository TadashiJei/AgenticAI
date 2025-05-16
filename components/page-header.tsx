"use client"

import { motion } from "framer-motion"

interface PageHeaderProps {
  title: string
  description: string
  gradient: string
}

export function PageHeader({ title, description, gradient }: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center"
    >
      <h1
        className={`text-4xl md:text-5xl font-orbitron font-bold mb-4 bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}
      >
        {title}
      </h1>
      <div className={`h-1 w-20 bg-gradient-to-r ${gradient} mx-auto mb-6`}></div>
      <p className="text-gray-300 max-w-2xl mx-auto">{description}</p>
    </motion.div>
  )
}

"use client"

import { motion } from "framer-motion"
import { Shield, Lock, Server, Database, Users, FileText, Calendar } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { GridBackground } from "@/components/grid-background"
import { GlitchEffect } from "@/components/glitch-effect"
import { PageHeader } from "@/components/page-header"

export default function SecurityPage() {
  const lastUpdated = "May 1, 2025"

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <GridBackground />
      <GlitchEffect />

      <div className="relative z-10">
        <Navigation />

        <div className="container mx-auto px-4 pt-20">
          <PageHeader
            title="Security"
            description="How we protect your data and systems"
            gradient="from-purple-400 to-pink-500"
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mt-8 flex items-center justify-center text-sm text-gray-400 mb-12"
          >
            <Calendar className="h-4 w-4 mr-2 text-purple-400" />
            <span>Last Updated: {lastUpdated}</span>
          </motion.div>

          <div className="max-w-4xl mx-auto mb-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-black/60 border border-purple-500/20 rounded-xl p-6 backdrop-blur-sm mb-8"
            >
              <div className="flex items-start mb-4">
                <div className="p-2 rounded-lg bg-black/50 border border-gray-800 mr-3">
                  <Shield className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <h2 className="text-xl font-orbitron font-bold text-white mb-2">Our Security Commitment</h2>
                  <p className="text-gray-300">
                    At DefenSys.ai, security is at the core of everything we do. We are committed to implementing and
                    maintaining the highest standards of security to protect our customers' data and systems. This
                    document outlines our security practices and measures to provide transparency about how we safeguard
                    your information.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="bg-black/60 border border-purple-500/20 rounded-xl p-6 backdrop-blur-sm mb-8"
            >
              <div className="flex items-start mb-4">
                <div className="p-2 rounded-lg bg-black/50 border border-gray-800 mr-3">
                  <Lock className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <h2 className="text-xl font-orbitron font-bold text-white mb-2">Data Encryption</h2>
                  <p className="text-gray-300 mb-4">We implement strong encryption measures to protect your data:</p>
                  <ul className="space-y-2 text-gray-300 list-disc pl-6">
                    <li>
                      <strong className="text-white">Data in Transit:</strong> All data transmitted between your systems
                      and DefenSys.ai is encrypted using TLS 1.3 with strong cipher suites. This ensures that your data
                      cannot be intercepted or read during transmission.
                    </li>
                    <li>
                      <strong className="text-white">Data at Rest:</strong> All data stored in our systems is encrypted
                      using AES-256 encryption. This includes customer data, security logs, and system configurations.
                    </li>
                    <li>
                      <strong className="text-white">Key Management:</strong> We employ a robust key management system
                      with regular key rotation and strict access controls to protect encryption keys.
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-black/60 border border-purple-500/20 rounded-xl p-6 backdrop-blur-sm mb-8"
            >
              <div className="flex items-start mb-4">
                <div className="p-2 rounded-lg bg-black/50 border border-gray-800 mr-3">
                  <Server className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <h2 className="text-xl font-orbitron font-bold text-white mb-2">Infrastructure Security</h2>
                  <p className="text-gray-300 mb-4">
                    Our infrastructure is designed with security as a fundamental principle:
                  </p>
                  <ul className="space-y-2 text-gray-300 list-disc pl-6">
                    <li>
                      <strong className="text-white">Network Security:</strong> We implement multiple layers of network
                      security, including firewalls, intrusion detection and prevention systems, and network
                      segmentation.
                    </li>
                    <li>
                      <strong className="text-white">Server Hardening:</strong> All servers are hardened according to
                      industry best practices, with unnecessary services disabled and regular security updates applied.
                    </li>
                    <li>
                      <strong className="text-white">Vulnerability Management:</strong> We conduct regular vulnerability
                      scans and penetration tests to identify and remediate potential security issues.
                    </li>
                    <li>
                      <strong className="text-white">Physical Security:</strong> Our infrastructure is hosted in SOC 2
                      Type II certified data centers with 24/7 physical security, biometric access controls, and
                      environmental protections.
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="bg-black/60 border border-purple-500/20 rounded-xl p-6 backdrop-blur-sm mb-8"
            >
              <div className="flex items-start mb-4">
                <div className="p-2 rounded-lg bg-black/50 border border-gray-800 mr-3">
                  <Database className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <h2 className="text-xl font-orbitron font-bold text-white mb-2">Data Protection</h2>
                  <p className="text-gray-300 mb-4">We take comprehensive measures to protect your data:</p>
                  <ul className="space-y-2 text-gray-300 list-disc pl-6">
                    <li>
                      <strong className="text-white">Data Minimization:</strong> We collect and retain only the data
                      necessary to provide our services.
                    </li>
                    <li>
                      <strong className="text-white">Data Segregation:</strong> Customer data is logically segregated to
                      prevent unauthorized access or cross-contamination.
                    </li>
                    <li>
                      <strong className="text-white">Backup and Recovery:</strong> Regular automated backups with
                      encryption and secure off-site storage ensure data availability and integrity.
                    </li>
                    <li>
                      <strong className="text-white">Data Deletion:</strong> When data is no longer needed or upon
                      contract termination, we follow secure data deletion procedures in accordance with industry
                      standards.
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="bg-black/60 border border-purple-500/20 rounded-xl p-6 backdrop-blur-sm mb-8"
            >
              <div className="flex items-start mb-4">
                <div className="p-2 rounded-lg bg-black/50 border border-gray-800 mr-3">
                  <Users className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <h2 className="text-xl font-orbitron font-bold text-white mb-2">Access Controls</h2>
                  <p className="text-gray-300 mb-4">We implement strict access controls to protect your data:</p>
                  <ul className="space-y-2 text-gray-300 list-disc pl-6">
                    <li>
                      <strong className="text-white">Principle of Least Privilege:</strong> Employees are granted the
                      minimum level of access required to perform their job functions.
                    </li>
                    <li>
                      <strong className="text-white">Multi-Factor Authentication:</strong> MFA is required for all
                      access to production systems and customer data.
                    </li>
                    <li>
                      <strong className="text-white">Access Reviews:</strong> Regular reviews of access privileges
                      ensure that access rights remain appropriate as roles change.
                    </li>
                    <li>
                      <strong className="text-white">Secure Authentication:</strong> Strong password policies, session
                      timeouts, and account lockout mechanisms protect against unauthorized access.
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="bg-black/60 border border-purple-500/20 rounded-xl p-6 backdrop-blur-sm"
            >
              <div className="flex items-start mb-4">
                <div className="p-2 rounded-lg bg-black/50 border border-gray-800 mr-3">
                  <FileText className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <h2 className="text-xl font-orbitron font-bold text-white mb-2">Compliance and Certifications</h2>
                  <p className="text-gray-300 mb-4">
                    DefenSys.ai maintains compliance with relevant security standards and regulations:
                  </p>
                  <ul className="space-y-2 text-gray-300 list-disc pl-6">
                    <li>
                      <strong className="text-white">ISO 27001:</strong> We are ISO 27001 certified, demonstrating our
                      commitment to information security management.
                    </li>
                    <li>
                      <strong className="text-white">SOC 2 Type II:</strong> Our annual SOC 2 Type II audit verifies our
                      controls for security, availability, and confidentiality.
                    </li>
                    <li>
                      <strong className="text-white">GDPR Compliance:</strong> We adhere to GDPR requirements for
                      processing and protecting personal data.
                    </li>
                    <li>
                      <strong className="text-white">CCPA Compliance:</strong> We comply with the California Consumer
                      Privacy Act for customers in California.
                    </li>
                    <li>
                      <strong className="text-white">Data Privacy Act of 2012 (Philippines):</strong> We adhere to the
                      requirements of the Data Privacy Act for customers in the Philippines.
                    </li>
                  </ul>
                  <p className="text-gray-300 mt-4">
                    Our security documentation, including certifications and audit reports, is available to customers
                    upon request under NDA.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <Footer />
      </div>
    </main>
  )
}

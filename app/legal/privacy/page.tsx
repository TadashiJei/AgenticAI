"use client"

import { motion } from "framer-motion"
import { Shield, Lock, Eye, FileText, Calendar } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { GridBackground } from "@/components/grid-background"
import { GlitchEffect } from "@/components/glitch-effect"
import { PageHeader } from "@/components/page-header"

export default function PrivacyPage() {
  const lastUpdated = "May 1, 2025"

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <GridBackground />
      <GlitchEffect />

      <div className="relative z-10">
        <Navigation />

        <div className="container mx-auto px-4 pt-20">
          <PageHeader
            title="Privacy Policy"
            description="How we collect, use, and protect your information"
            gradient="from-cyan-400 to-blue-500"
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mt-8 flex items-center justify-center text-sm text-gray-400 mb-12"
          >
            <Calendar className="h-4 w-4 mr-2 text-cyan-400" />
            <span>Last Updated: {lastUpdated}</span>
          </motion.div>

          <div className="max-w-4xl mx-auto mb-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-black/60 border border-cyan-500/20 rounded-xl p-6 backdrop-blur-sm mb-8"
            >
              <div className="flex items-start mb-4">
                <div className="p-2 rounded-lg bg-black/50 border border-gray-800 mr-3">
                  <Shield className="h-6 w-6 text-cyan-500" />
                </div>
                <div>
                  <h2 className="text-xl font-orbitron font-bold text-white mb-2">Introduction</h2>
                  <p className="text-gray-300">
                    At DefenSys.ai, we take your privacy seriously. This Privacy Policy explains how we collect, use,
                    disclose, and safeguard your information when you use our cybersecurity services and visit our
                    website. Please read this policy carefully to understand our practices regarding your personal data
                    and how we will treat it.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="bg-black/60 border border-cyan-500/20 rounded-xl p-6 backdrop-blur-sm mb-8"
            >
              <div className="flex items-start mb-4">
                <div className="p-2 rounded-lg bg-black/50 border border-gray-800 mr-3">
                  <Eye className="h-6 w-6 text-cyan-500" />
                </div>
                <div>
                  <h2 className="text-xl font-orbitron font-bold text-white mb-2">Information We Collect</h2>
                  <p className="text-gray-300 mb-4">
                    We collect several types of information from and about users of our services, including:
                  </p>
                  <ul className="space-y-2 text-gray-300 list-disc pl-6">
                    <li>
                      <strong className="text-white">Personal Information:</strong> Name, email address, phone number,
                      company name, and job title when you register for our services, subscribe to our newsletter, or
                      contact us.
                    </li>
                    <li>
                      <strong className="text-white">Technical Information:</strong> IP address, browser type, operating
                      system, device information, and usage data when you interact with our website and services.
                    </li>
                    <li>
                      <strong className="text-white">Security Data:</strong> Network traffic, system logs, and security
                      events when you use our cybersecurity services. This data is necessary to provide threat detection
                      and protection.
                    </li>
                    <li>
                      <strong className="text-white">Payment Information:</strong> Credit card details or other payment
                      information when you purchase our services. This information is processed securely through our
                      payment processors.
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-black/60 border border-cyan-500/20 rounded-xl p-6 backdrop-blur-sm mb-8"
            >
              <div className="flex items-start mb-4">
                <div className="p-2 rounded-lg bg-black/50 border border-gray-800 mr-3">
                  <FileText className="h-6 w-6 text-cyan-500" />
                </div>
                <div>
                  <h2 className="text-xl font-orbitron font-bold text-white mb-2">How We Use Your Information</h2>
                  <p className="text-gray-300 mb-4">
                    We use the information we collect for various purposes, including:
                  </p>
                  <ul className="space-y-2 text-gray-300 list-disc pl-6">
                    <li>Providing, maintaining, and improving our cybersecurity services</li>
                    <li>Detecting and preventing security threats and vulnerabilities</li>
                    <li>Processing transactions and managing your account</li>
                    <li>Sending you technical notices, updates, and support messages</li>
                    <li>Responding to your comments, questions, and customer service requests</li>
                    <li>
                      Sending you marketing communications about our products, services, and events (you can opt-out at
                      any time)
                    </li>
                    <li>Monitoring and analyzing trends, usage, and activities in connection with our services</li>
                    <li>Complying with legal obligations and enforcing our terms of service</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="bg-black/60 border border-cyan-500/20 rounded-xl p-6 backdrop-blur-sm mb-8"
            >
              <div className="flex items-start mb-4">
                <div className="p-2 rounded-lg bg-black/50 border border-gray-800 mr-3">
                  <Lock className="h-6 w-6 text-cyan-500" />
                </div>
                <div>
                  <h2 className="text-xl font-orbitron font-bold text-white mb-2">Data Security</h2>
                  <p className="text-gray-300 mb-4">
                    We implement appropriate technical and organizational measures to protect your personal information
                    from unauthorized access, disclosure, alteration, and destruction. These measures include:
                  </p>
                  <ul className="space-y-2 text-gray-300 list-disc pl-6">
                    <li>Encryption of sensitive data both in transit and at rest</li>
                    <li>Regular security assessments and penetration testing</li>
                    <li>Access controls and authentication mechanisms</li>
                    <li>Employee training on data protection and security practices</li>
                    <li>Physical and environmental security measures for our infrastructure</li>
                  </ul>
                  <p className="text-gray-300 mt-4">
                    While we strive to use commercially acceptable means to protect your personal information, no method
                    of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute
                    security of your data.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="bg-black/60 border border-cyan-500/20 rounded-xl p-6 backdrop-blur-sm mb-8"
            >
              <h2 className="text-xl font-orbitron font-bold text-white mb-4">International Data Transfers</h2>
              <p className="text-gray-300 mb-4">
                DefenSys.ai operates globally, and your information may be transferred to, stored, and processed in
                countries other than the one in which you reside. These countries may have data protection laws that
                differ from those in your country.
              </p>
              <p className="text-gray-300 mb-4">
                When we transfer your information to other countries, we take appropriate safeguards to ensure that your
                personal data remains protected in accordance with this Privacy Policy and applicable laws. These
                safeguards include:
              </p>
              <ul className="space-y-2 text-gray-300 list-disc pl-6">
                <li>Standard contractual clauses approved by the European Commission</li>
                <li>Data processing agreements with our service providers and partners</li>
                <li>Compliance with regional data protection frameworks</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="bg-black/60 border border-cyan-500/20 rounded-xl p-6 backdrop-blur-sm"
            >
              <h2 className="text-xl font-orbitron font-bold text-white mb-4">Your Rights and Choices</h2>
              <p className="text-gray-300 mb-4">
                Depending on your location, you may have certain rights regarding your personal information, including:
              </p>
              <ul className="space-y-2 text-gray-300 list-disc pl-6">
                <li>The right to access and receive a copy of your personal information</li>
                <li>The right to correct or update your personal information</li>
                <li>The right to request deletion of your personal information</li>
                <li>The right to restrict or object to processing of your personal information</li>
                <li>The right to data portability</li>
                <li>The right to withdraw consent at any time (where processing is based on consent)</li>
              </ul>
              <p className="text-gray-300 mt-4">
                To exercise these rights, please contact us at privacy@defensys.ai. We will respond to your request
                within the timeframe required by applicable law.
              </p>
            </motion.div>
          </div>
        </div>

        <Footer />
      </div>
    </main>
  )
}

"use client"

import { motion } from "framer-motion"
import { FileText, Calendar, Shield, AlertTriangle, Scale } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { GridBackground } from "@/components/grid-background"
import { GlitchEffect } from "@/components/glitch-effect"
import { PageHeader } from "@/components/page-header"

export default function TermsPage() {
  const lastUpdated = "May 1, 2025"

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <GridBackground />
      <GlitchEffect />

      <div className="relative z-10">
        <Navigation />

        <div className="container mx-auto px-4 pt-20">
          <PageHeader
            title="Terms of Service"
            description="Legal terms governing the use of DefenSys.ai"
            gradient="from-orange-400 to-red-500"
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mt-8 flex items-center justify-center text-sm text-gray-400 mb-12"
          >
            <Calendar className="h-4 w-4 mr-2 text-orange-400" />
            <span>Last Updated: {lastUpdated}</span>
          </motion.div>

          <div className="max-w-4xl mx-auto mb-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-black/60 border border-orange-500/20 rounded-xl p-6 backdrop-blur-sm mb-8"
            >
              <div className="flex items-start mb-4">
                <div className="p-2 rounded-lg bg-black/50 border border-gray-800 mr-3">
                  <FileText className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <h2 className="text-xl font-orbitron font-bold text-white mb-2">Agreement to Terms</h2>
                  <p className="text-gray-300">
                    These Terms of Service ("Terms") govern your access to and use of the DefenSys.ai platform and
                    services ("Services"). By accessing or using our Services, you agree to be bound by these Terms. If
                    you do not agree to these Terms, you may not access or use the Services.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="bg-black/60 border border-orange-500/20 rounded-xl p-6 backdrop-blur-sm mb-8"
            >
              <div className="flex items-start mb-4">
                <div className="p-2 rounded-lg bg-black/50 border border-gray-800 mr-3">
                  <Shield className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <h2 className="text-xl font-orbitron font-bold text-white mb-2">Services Description</h2>
                  <p className="text-gray-300 mb-4">
                    DefenSys.ai provides cybersecurity services designed to protect businesses from cyber threats. Our
                    Services include:
                  </p>
                  <ul className="space-y-2 text-gray-300 list-disc pl-6">
                    <li>Threat detection and analysis</li>
                    <li>Automated security response</li>
                    <li>Security monitoring and reporting</li>
                    <li>Security advisory and consultation</li>
                  </ul>
                  <p className="text-gray-300 mt-4">
                    We reserve the right to modify, suspend, or discontinue any part of our Services at any time, with
                    or without notice. We will not be liable to you or any third party for any modification, suspension,
                    or discontinuation of the Services.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-black/60 border border-orange-500/20 rounded-xl p-6 backdrop-blur-sm mb-8"
            >
              <div className="flex items-start mb-4">
                <div className="p-2 rounded-lg bg-black/50 border border-gray-800 mr-3">
                  <AlertTriangle className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <h2 className="text-xl font-orbitron font-bold text-white mb-2">Limitations and Disclaimers</h2>
                  <p className="text-gray-300 mb-4">
                    While we strive to provide effective cybersecurity protection, we cannot guarantee that our Services
                    will:
                  </p>
                  <ul className="space-y-2 text-gray-300 list-disc pl-6">
                    <li>Detect or prevent all security threats or vulnerabilities</li>
                    <li>Be error-free or operate without interruption</li>
                    <li>Meet your specific security requirements or expectations</li>
                  </ul>
                  <p className="text-gray-300 mt-4">
                    THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS
                    OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
                    PARTICULAR PURPOSE, NON-INFRINGEMENT, OR COURSE OF PERFORMANCE.
                  </p>
                  <p className="text-gray-300 mt-4">
                    DefenSys.ai AND ITS AFFILIATES, SERVICE PROVIDERS, AND PARTNERS DO NOT WARRANT THAT: (A) THE
                    SERVICES WILL FUNCTION UNINTERRUPTED, SECURE, OR AVAILABLE AT ANY PARTICULAR TIME OR LOCATION; (B)
                    ANY ERRORS OR DEFECTS WILL BE CORRECTED; (C) THE SERVICES ARE FREE OF VIRUSES OR OTHER HARMFUL
                    COMPONENTS; OR (D) THE RESULTS OF USING THE SERVICES WILL MEET YOUR REQUIREMENTS.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="bg-black/60 border border-orange-500/20 rounded-xl p-6 backdrop-blur-sm mb-8"
            >
              <h2 className="text-xl font-orbitron font-bold text-white mb-4">Your Responsibilities</h2>
              <p className="text-gray-300 mb-4">As a user of our Services, you are responsible for:</p>
              <ul className="space-y-2 text-gray-300 list-disc pl-6">
                <li>Providing accurate and complete information when registering for and using our Services</li>
                <li>
                  Maintaining the confidentiality of your account credentials and notifying us immediately of any
                  unauthorized access or use of your account
                </li>
                <li>
                  Ensuring that your use of our Services complies with all applicable laws, regulations, and industry
                  standards
                </li>
                <li>Implementing appropriate security measures beyond our Services to protect your systems and data</li>
                <li>Regularly backing up your data and maintaining business continuity plans</li>
                <li>
                  Promptly installing updates, patches, and security fixes as recommended by us or your system providers
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="bg-black/60 border border-orange-500/20 rounded-xl p-6 backdrop-blur-sm mb-8"
            >
              <h2 className="text-xl font-orbitron font-bold text-white mb-4">Intellectual Property</h2>
              <p className="text-gray-300 mb-4">
                The Services and all content, features, and functionality thereof, including but not limited to all
                information, software, text, displays, images, video, audio, and the design, selection, and arrangement
                thereof, are owned by DefenSys.ai, its licensors, or other providers of such material and are protected
                by copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights
                laws.
              </p>
              <p className="text-gray-300 mb-4">
                These Terms do not grant you any right, title, or interest in the Services or any content, features, or
                functionality thereof. You may not reproduce, distribute, modify, create derivative works of, publicly
                display, publicly perform, republish, download, store, or transmit any of the material on our Services,
                except as follows:
              </p>
              <ul className="space-y-2 text-gray-300 list-disc pl-6">
                <li>
                  Your computer may temporarily store copies of such materials in RAM incidental to your accessing and
                  viewing those materials
                </li>
                <li>
                  You may store files that are automatically cached by your web browser for display enhancement purposes
                </li>
                <li>
                  You may print or download one copy of a reasonable number of pages of the website for your own
                  personal, non-commercial use and not for further reproduction, publication, or distribution
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="bg-black/60 border border-orange-500/20 rounded-xl p-6 backdrop-blur-sm"
            >
              <div className="flex items-start mb-4">
                <div className="p-2 rounded-lg bg-black/50 border border-gray-800 mr-3">
                  <Scale className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <h2 className="text-xl font-orbitron font-bold text-white mb-2">
                    Governing Law and Dispute Resolution
                  </h2>
                  <p className="text-gray-300 mb-4">
                    These Terms shall be governed by and construed in accordance with the laws of the Philippines,
                    without regard to its conflict of law provisions.
                  </p>
                  <p className="text-gray-300 mb-4">
                    Any dispute arising out of or relating to these Terms or the Services shall be resolved through the
                    following process:
                  </p>
                  <ol className="space-y-2 text-gray-300 list-decimal pl-6">
                    <li>
                      <strong className="text-white">Informal Resolution:</strong> We encourage you to contact us first
                      to seek an informal resolution to any dispute.
                    </li>
                    <li>
                      <strong className="text-white">Mediation:</strong> If informal resolution is unsuccessful, the
                      parties agree to attempt to resolve the dispute through mediation conducted by a mutually agreed
                      upon mediator.
                    </li>
                    <li>
                      <strong className="text-white">Arbitration:</strong> If mediation is unsuccessful, any controversy
                      or claim arising out of or relating to these Terms shall be settled by binding arbitration in
                      accordance with the rules of the Philippine Dispute Resolution Center, Inc. (PDRCI). The
                      arbitration shall take place in Manila, Philippines, in the English language, and the arbitral
                      decision may be enforced in any court.
                    </li>
                  </ol>
                  <p className="text-gray-300 mt-4">
                    For users in the United States, disputes may also be resolved in accordance with the laws of the
                    State of California, without regard to its conflict of law provisions. For users in Asia, disputes
                    may also be resolved in accordance with the laws of Singapore, without regard to its conflict of law
                    provisions.
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

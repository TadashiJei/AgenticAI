"use client"

import { motion } from "framer-motion"
import { CheckSquare, Globe, FileText, Calendar, Shield, AlertTriangle } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { GridBackground } from "@/components/grid-background"
import { GlitchEffect } from "@/components/glitch-effect"
import { PageHeader } from "@/components/page-header"

export default function CompliancePage() {
  const lastUpdated = "May 1, 2025"

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <GridBackground />
      <GlitchEffect />

      <div className="relative z-10">
        <Navigation />

        <div className="container mx-auto px-4 pt-20">
          <PageHeader
            title="Compliance"
            description="Our commitment to regulatory compliance and industry standards"
            gradient="from-green-400 to-cyan-500"
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mt-8 flex items-center justify-center text-sm text-gray-400 mb-12"
          >
            <Calendar className="h-4 w-4 mr-2 text-green-400" />
            <span>Last Updated: {lastUpdated}</span>
          </motion.div>

          <div className="max-w-4xl mx-auto mb-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-black/60 border border-green-500/20 rounded-xl p-6 backdrop-blur-sm mb-8"
            >
              <div className="flex items-start mb-4">
                <div className="p-2 rounded-lg bg-black/50 border border-gray-800 mr-3">
                  <CheckSquare className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <h2 className="text-xl font-orbitron font-bold text-white mb-2">Our Compliance Approach</h2>
                  <p className="text-gray-300">
                    DefenSys.ai is committed to maintaining the highest standards of compliance with relevant laws,
                    regulations, and industry standards. We understand that our customers operate in diverse regulatory
                    environments, and we strive to provide services that help them meet their compliance obligations.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="bg-black/60 border border-green-500/20 rounded-xl p-6 backdrop-blur-sm mb-8"
            >
              <div className="flex items-start mb-4">
                <div className="p-2 rounded-lg bg-black/50 border border-gray-800 mr-3">
                  <Globe className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <h2 className="text-xl font-orbitron font-bold text-white mb-2">Global Compliance Framework</h2>
                  <p className="text-gray-300 mb-4">
                    Our global compliance framework addresses key regulatory requirements in the regions where we
                    operate:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-black/70 border border-gray-800 rounded-lg p-4">
                      <h3 className="text-lg font-orbitron font-bold text-white mb-2">Philippines</h3>
                      <ul className="space-y-2 text-gray-300 list-disc pl-6">
                        <li>Data Privacy Act of 2012 (DPA)</li>
                        <li>National Privacy Commission (NPC) Guidelines</li>
                        <li>Cybercrime Prevention Act of 2012</li>
                        <li>Electronic Commerce Act of 2000</li>
                      </ul>
                    </div>
                    <div className="bg-black/70 border border-gray-800 rounded-lg p-4">
                      <h3 className="text-lg font-orbitron font-bold text-white mb-2">United States</h3>
                      <ul className="space-y-2 text-gray-300 list-disc pl-6">
                        <li>California Consumer Privacy Act (CCPA)</li>
                        <li>Health Insurance Portability and Accountability Act (HIPAA)</li>
                        <li>Federal Information Security Modernization Act (FISMA)</li>
                        <li>State Data Breach Notification Laws</li>
                      </ul>
                    </div>
                    <div className="bg-black/70 border border-gray-800 rounded-lg p-4">
                      <h3 className="text-lg font-orbitron font-bold text-white mb-2">Asia-Pacific</h3>
                      <ul className="space-y-2 text-gray-300 list-disc pl-6">
                        <li>Singapore Personal Data Protection Act (PDPA)</li>
                        <li>Japan Act on Protection of Personal Information (APPI)</li>
                        <li>Australia Privacy Act</li>
                        <li>Hong Kong Personal Data (Privacy) Ordinance</li>
                      </ul>
                    </div>
                    <div className="bg-black/70 border border-gray-800 rounded-lg p-4">
                      <h3 className="text-lg font-orbitron font-bold text-white mb-2">Europe</h3>
                      <ul className="space-y-2 text-gray-300 list-disc pl-6">
                        <li>General Data Protection Regulation (GDPR)</li>
                        <li>Network and Information Systems (NIS) Directive</li>
                        <li>ePrivacy Directive</li>
                        <li>UK Data Protection Act 2018</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-black/60 border border-green-500/20 rounded-xl p-6 backdrop-blur-sm mb-8"
            >
              <div className="flex items-start mb-4">
                <div className="p-2 rounded-lg bg-black/50 border border-gray-800 mr-3">
                  <Shield className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <h2 className="text-xl font-orbitron font-bold text-white mb-2">Certifications and Standards</h2>
                  <p className="text-gray-300 mb-4">
                    DefenSys.ai maintains the following certifications and adheres to these industry standards:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-black/70 border border-gray-800 rounded-lg p-4 hover:border-green-500/30 transition-colors">
                      <h3 className="text-lg font-orbitron font-bold text-white mb-2">ISO/IEC 27001:2013</h3>
                      <p className="text-gray-300 text-sm">
                        International standard for information security management systems (ISMS).
                      </p>
                      <div className="mt-2 flex items-center">
                        <span className="text-green-400 text-xs font-mono px-2 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                          Certified
                        </span>
                      </div>
                    </div>
                    <div className="bg-black/70 border border-gray-800 rounded-lg p-4 hover:border-green-500/30 transition-colors">
                      <h3 className="text-lg font-orbitron font-bold text-white mb-2">SOC 2 Type II</h3>
                      <p className="text-gray-300 text-sm">
                        Audit of controls relevant to security, availability, and confidentiality.
                      </p>
                      <div className="mt-2 flex items-center">
                        <span className="text-green-400 text-xs font-mono px-2 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                          Certified
                        </span>
                      </div>
                    </div>
                    <div className="bg-black/70 border border-gray-800 rounded-lg p-4 hover:border-green-500/30 transition-colors">
                      <h3 className="text-lg font-orbitron font-bold text-white mb-2">NIST Cybersecurity Framework</h3>
                      <p className="text-gray-300 text-sm">
                        Framework for improving critical infrastructure cybersecurity.
                      </p>
                      <div className="mt-2 flex items-center">
                        <span className="text-green-400 text-xs font-mono px-2 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                          Compliant
                        </span>
                      </div>
                    </div>
                    <div className="bg-black/70 border border-gray-800 rounded-lg p-4 hover:border-green-500/30 transition-colors">
                      <h3 className="text-lg font-orbitron font-bold text-white mb-2">PCI DSS</h3>
                      <p className="text-gray-300 text-sm">
                        Payment Card Industry Data Security Standard for organizations that handle credit cards.
                      </p>
                      <div className="mt-2 flex items-center">
                        <span className="text-yellow-400 text-xs font-mono px-2 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20">
                          In Progress
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="bg-black/60 border border-green-500/20 rounded-xl p-6 backdrop-blur-sm mb-8"
            >
              <h2 className="text-xl font-orbitron font-bold text-white mb-4">Compliance Documentation</h2>
              <p className="text-gray-300 mb-4">
                We provide the following documentation to help our customers meet their compliance requirements:
              </p>
              <div className="space-y-4">
                <div className="bg-black/70 border border-gray-800 rounded-lg p-4 hover:border-green-500/30 transition-colors">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-green-500 mr-2" />
                    <h3 className="text-lg font-orbitron font-bold text-white">Security and Compliance Whitepaper</h3>
                  </div>
                  <p className="text-gray-300 text-sm mt-2">
                    Detailed information about our security controls, compliance measures, and data protection
                    practices.
                  </p>
                </div>
                <div className="bg-black/70 border border-gray-800 rounded-lg p-4 hover:border-green-500/30 transition-colors">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-green-500 mr-2" />
                    <h3 className="text-lg font-orbitron font-bold text-white">Data Processing Addendum (DPA)</h3>
                  </div>
                  <p className="text-gray-300 text-sm mt-2">
                    Legal agreement that addresses GDPR and other data protection requirements for our customers.
                  </p>
                </div>
                <div className="bg-black/70 border border-gray-800 rounded-lg p-4 hover:border-green-500/30 transition-colors">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-green-500 mr-2" />
                    <h3 className="text-lg font-orbitron font-bold text-white">Audit Reports and Certifications</h3>
                  </div>
                  <p className="text-gray-300 text-sm mt-2">
                    Copies of our ISO 27001 certificate, SOC 2 Type II report, and other compliance documentation
                    (available under NDA).
                  </p>
                </div>
                <div className="bg-black/70 border border-gray-800 rounded-lg p-4 hover:border-green-500/30 transition-colors">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-green-500 mr-2" />
                    <h3 className="text-lg font-orbitron font-bold text-white">Vendor Risk Assessment Questionnaire</h3>
                  </div>
                  <p className="text-gray-300 text-sm mt-2">
                    Pre-completed security and compliance questionnaire to streamline your vendor assessment process.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="bg-black/60 border border-green-500/20 rounded-xl p-6 backdrop-blur-sm"
            >
              <div className="flex items-start mb-4">
                <div className="p-2 rounded-lg bg-black/50 border border-gray-800 mr-3">
                  <AlertTriangle className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <h2 className="text-xl font-orbitron font-bold text-white mb-2">Compliance Monitoring and Updates</h2>
                  <p className="text-gray-300 mb-4">
                    We maintain an active compliance monitoring program to ensure ongoing adherence to relevant
                    regulations and standards:
                  </p>
                  <ul className="space-y-2 text-gray-300 list-disc pl-6">
                    <li>
                      <strong className="text-white">Regulatory Tracking:</strong> Our legal and compliance teams
                      continuously monitor changes in regulations across our operating regions.
                    </li>
                    <li>
                      <strong className="text-white">Regular Assessments:</strong> We conduct internal and external
                      assessments of our compliance posture on a quarterly basis.
                    </li>
                    <li>
                      <strong className="text-white">Compliance Training:</strong> All employees receive regular
                      training on relevant compliance requirements and their responsibilities.
                    </li>
                    <li>
                      <strong className="text-white">Audit Program:</strong> Our comprehensive audit program includes
                      regular internal audits and annual third-party assessments.
                    </li>
                  </ul>
                  <p className="text-gray-300 mt-4">
                    For specific compliance inquiries or to request compliance documentation, please contact our
                    compliance team at compliance@defensys.ai.
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

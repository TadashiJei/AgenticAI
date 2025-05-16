"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check, Shield, Zap, Star, HelpCircle } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { GridBackground } from "@/components/grid-background"
import { GlitchEffect } from "@/components/glitch-effect"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

export default function PricingPage() {
  const [annual, setAnnual] = useState(false)

  const toggleBilling = () => {
    setAnnual(!annual)
  }

  const plans = [
    {
      name: "Starter",
      description: "Essential protection for small businesses",
      price: annual ? 99 : 129,
      period: annual ? "/year" : "/month",
      discount: annual ? "Save $450" : null,
      features: [
        "Threat Detection & Analysis",
        "Basic Automated Response",
        "Email Alerts",
        "Monthly Security Reports",
        "5 Endpoints",
        "Email Support",
      ],
      icon: <Shield className="h-6 w-6 text-cyan-500" />,
      color: "border-cyan-500/30",
      buttonColor: "bg-cyan-500 hover:bg-cyan-600",
      popular: false,
    },
    {
      name: "Professional",
      description: "Advanced protection for growing businesses",
      price: annual ? 199 : 249,
      period: annual ? "/year" : "/month",
      discount: annual ? "Save $600" : null,
      features: [
        "Everything in Starter",
        "Advanced Automated Response",
        "Real-time Alerts (Email, SMS)",
        "Weekly Security Reports",
        "25 Endpoints",
        "Priority Support",
        "Security Consultation (Quarterly)",
      ],
      icon: <Zap className="h-6 w-6 text-orange-500" />,
      color: "border-orange-500/30",
      buttonColor: "bg-orange-500 hover:bg-orange-600",
      popular: true,
    },
    {
      name: "Enterprise",
      description: "Comprehensive protection for larger organizations",
      price: annual ? 399 : 499,
      period: annual ? "/year" : "/month",
      discount: annual ? "Save $1,200" : null,
      features: [
        "Everything in Professional",
        "Custom Response Workflows",
        "Multi-channel Alerts",
        "Custom Reporting",
        "Unlimited Endpoints",
        "24/7 Priority Support",
        "Security Consultation (Monthly)",
        "Dedicated Account Manager",
      ],
      icon: <Star className="h-6 w-6 text-purple-500" />,
      color: "border-purple-500/30",
      buttonColor: "bg-purple-500 hover:bg-purple-600",
      popular: false,
    },
  ]

  const faqs = [
    {
      question: "How does the pricing work?",
      answer:
        "Our pricing is based on a subscription model with different tiers to suit businesses of various sizes. You can choose to pay monthly or annually, with annual billing providing significant savings.",
    },
    {
      question: "Can I upgrade or downgrade my plan?",
      answer:
        "Yes, you can upgrade or downgrade your plan at any time. When upgrading, you'll be charged the prorated difference. When downgrading, the new rate will apply at the start of your next billing cycle.",
    },
    {
      question: "Is there a free trial?",
      answer:
        "Yes, we offer a 14-day free trial of our Professional plan so you can experience the full capabilities of DefenSys.ai before making a commitment.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards, PayPal, and bank transfers for annual plans. Enterprise customers can also arrange for invoicing.",
    },
    {
      question: "Do you offer custom pricing for larger organizations?",
      answer:
        "Yes, for organizations with specific needs or more than 100 employees, we offer custom pricing packages. Please contact our sales team for more information.",
    },
    {
      question: "What happens when my subscription ends?",
      answer:
        "If you choose not to renew your subscription, your protection will continue until the end of your current billing period. After that, your account will be downgraded to our basic monitoring-only mode.",
    },
  ]

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <GridBackground />
      <GlitchEffect />

      <div className="relative z-10">
        <Navigation />

        <div className="container mx-auto px-4 pt-20">
          <PageHeader
            title="Pricing"
            description="Simple, transparent pricing for businesses of all sizes"
            gradient="from-blue-400 to-purple-500"
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mt-16 text-center"
          >
            <div className="flex items-center justify-center space-x-4 mb-12">
              <span className={`text-lg font-mono ${!annual ? "text-white" : "text-gray-400"}`}>Monthly</span>
              <Switch checked={annual} onCheckedChange={toggleBilling} />
              <div className="flex items-center">
                <span className={`text-lg font-mono ${annual ? "text-white" : "text-gray-400"}`}>Annual</span>
                <span className="ml-2 bg-green-500/20 text-green-400 text-xs font-mono px-2 py-1 rounded-full">
                  Save 20%
                </span>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className={`${plan.popular ? "md:-mt-4 md:mb-4" : ""}`}
              >
                <Card
                  className={`bg-black/50 ${
                    plan.popular ? plan.color : "border-gray-800"
                  } backdrop-blur-sm overflow-hidden h-full relative group hover:border-opacity-60 transition-colors`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 left-0 right-0 bg-orange-500 text-white text-xs font-mono py-1 text-center">
                      MOST POPULAR
                    </div>
                  )}
                  <CardContent className={`p-6 ${plan.popular ? "pt-8" : ""}`}>
                    <div className="flex items-center mb-4">
                      <div className={`p-2 rounded-lg bg-black/50 border ${plan.color} mr-3`}>{plan.icon}</div>
                      <h3 className="text-xl font-orbitron font-bold text-white">{plan.name}</h3>
                    </div>
                    <p className="text-gray-300 text-sm mb-6">{plan.description}</p>

                    <div className="mb-6">
                      <div className="flex items-end">
                        <span className="text-3xl font-orbitron font-bold text-white">${plan.price}</span>
                        <span className="text-gray-400 font-mono ml-1">{plan.period}</span>
                      </div>
                      {plan.discount && <span className="text-green-400 text-sm font-mono">{plan.discount}</span>}
                    </div>

                    <div className="space-y-3 mb-6">
                      {plan.features.map((feature, i) => (
                        <div key={i} className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                          <span className="text-gray-300 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="px-6 pb-6 pt-0">
                    <Button className={`w-full ${plan.buttonColor} text-white font-mono`}>Get Started</Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="bg-black/60 border border-cyan-500/20 rounded-xl p-6 backdrop-blur-sm mb-16"
          >
            <h2 className="text-2xl font-orbitron font-bold text-white mb-6 text-center">Enterprise Solutions</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-orbitron font-bold text-white mb-4">Custom Security Solutions</h3>
                <p className="text-gray-300 mb-4">
                  For larger organizations with specific security requirements, we offer tailored solutions that address
                  your unique challenges and integrate with your existing infrastructure.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                    <span className="text-gray-300 text-sm">Custom integration with existing security tools</span>
                  </div>
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                    <span className="text-gray-300 text-sm">Dedicated security team</span>
                  </div>
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                    <span className="text-gray-300 text-sm">Custom reporting and compliance documentation</span>
                  </div>
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                    <span className="text-gray-300 text-sm">Advanced threat hunting and response</span>
                  </div>
                </div>
              </div>

              <div className="bg-black/70 border border-cyan-500/30 rounded-lg p-6">
                <h3 className="text-xl font-orbitron font-bold text-white mb-4">Contact Our Sales Team</h3>
                <p className="text-gray-300 mb-6">
                  Our security experts will work with you to understand your needs and create a custom solution that
                  provides the protection your organization requires.
                </p>
                <Button className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-mono">
                  Schedule a Consultation
                </Button>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mb-20"
          >
            <h2 className="text-2xl font-orbitron font-bold text-white mb-8 text-center">Frequently Asked Questions</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                  className="bg-black/50 border border-gray-800 rounded-lg p-6 hover:border-cyan-500/30 transition-colors"
                >
                  <h3 className="text-lg font-orbitron font-bold text-white mb-3 flex items-center">
                    <HelpCircle className="h-5 w-5 text-cyan-400 mr-2" />
                    {faq.question}
                  </h3>
                  <p className="text-gray-300 text-sm">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <Footer />
      </div>
    </main>
  )
}

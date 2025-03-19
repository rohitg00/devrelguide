'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, BookOpen, Compass, Target, ArrowRight, Download } from 'lucide-react'
import { Button } from './button'
import { Input } from './input'

const researchHighlights = [
  {
    icon: Target,
    title: 'Strategic Framework',
    description: 'Research-backed approaches to DevRel strategy and execution'
  },
  {
    icon: Compass,
    title: 'Industry Insights',
    description: 'Current trends and future directions in Developer Relations'
  },
  {
    icon: BookOpen,
    title: 'Practical Tools',
    description: 'Templates, checklists, and actionable guidelines'
  }
]

const keyBenefits = [
  'Build effective developer engagement strategies',
  'Create measurable DevRel objectives and KPIs',
  'Design impactful developer programs',
  'Improve developer experience and satisfaction',
  'Scale your DevRel initiatives efficiently',
  'Align DevRel with business objectives'
]

export function WhitepaperSection() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    
    try {
      const response = await fetch('/api/store-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Check if error is related to already registered email
        if (data.error === 'This email has already been registered') {
          // Set isSubmitted to true to allow download instead of showing error
          setIsSubmitted(true)
          return
        }
        throw new Error(data.error || 'Failed to submit email')
      }

      setIsSubmitted(true)
    } catch (error) {
      console.error('Error:', error)
      setError(error instanceof Error ? error.message : 'Failed to submit email. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const handleDownload = () => {
    window.location.href = '/content/Developer Relations (DevRel)_ Bridging the Gap Between Developers and Business.html'
  }

  return (
    <section className="py-24 bg-gradient-to-b from-white to-purple-50">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="space-y-8">
              <motion.h2 
                className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                The Complete Developer Relations Guide 2024
              </motion.h2>
              
              <motion.p 
                className="text-xl text-gray-600 dark:text-gray-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                A practical guide that helps you build and scale successful Developer Relations programs. Based on industry best practices and real-world experiences from DevRel practitioners.
              </motion.p>

              {/* Research Highlights */}
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                {researchHighlights.map((highlight) => (
                  <div key={highlight.title} className="flex flex-col items-center text-center p-4">
                    <highlight.icon className="w-8 h-8 text-primary mb-3" />
                    <h3 className="font-semibold mb-2">{highlight.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{highlight.description}</p>
                  </div>
                ))}
              </motion.div>

              {/* Key Benefits */}
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-xl font-semibold">What You'll Learn:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {keyBenefits.map((benefit) => (
                    <div key={benefit} className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                      <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right Column - Download Form */}
            <motion.div 
              className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-semibold mb-4">Download Free Whitepaper</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Get practical insights and strategies to build better developer programs and measure their impact.
              </p>
              
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
                  {error}
                </div>
              )}
              
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Input
                      type="email"
                      placeholder="Enter your business email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full"
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      'Processing...'
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        Get Free Whitepaper
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    )}
                  </Button>
                  <p className="text-sm text-gray-500 text-center">
                    We respect your privacy. No spam, ever.
                  </p>
                </form>
              ) : (
                <div className="space-y-4">
                  <p className="text-green-600">Thank you! Your whitepaper is ready for download.</p>
                  <Button onClick={handleDownload} className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download Whitepaper
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

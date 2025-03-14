'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from './button'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'

export function CTABanner() {
  const [isVisible, setIsVisible] = React.useState(true)

  if (!isVisible) return null

  return (
    <motion.div 
      className="fixed bottom-0 left-0 right-0 md:bottom-4 md:right-4 md:left-auto z-50 p-4 md:p-0"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm mx-auto md:mx-0">
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          aria-label="Close banner"
        >
          <X className="h-4 w-4" />
        </button>
        <p className="text-sm text-gray-600 mb-3 pr-6">
          Looking for expert guidance with your DevRel initiatives?
        </p>
        <Link href="/contact">
          <Button variant="outline" size="sm" className="w-full">
            Explore Consultation Options
          </Button>
        </Link>
      </div>
    </motion.div>
  )
}

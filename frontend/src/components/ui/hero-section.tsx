'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Users, BookOpen, GitBranch, LineChart } from 'lucide-react'
import { Button } from './button'
import Link from 'next/link'

const metrics = [
  {
    icon: Users,
    label: 'Helping Developers',
    value: '50K+',
    color: 'text-blue-500'
  },
  {
    icon: BookOpen,
    label: 'Resources',
    value: '1000+',
    color: 'text-green-500'
  },
  {
    icon: GitBranch,
    label: 'Programs',
    value: '500+',
    color: 'text-purple-500'
  },
  {
    icon: LineChart,
    label: 'Research',
    value: '150+',
    color: 'text-pink-500'
  }
]

export function HeroSection() {
  return (
    <div className="relative overflow-hidden py-20">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-gray-100/50 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      
      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <motion.h1 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Empower Your Developer Relations
          </motion.h1>
          <motion.p 
            className="mt-4 sm:mt-6 text-base sm:text-lg leading-7 sm:leading-8 text-gray-600 px-4 sm:px-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Build stronger developer communities, measure impact, and scale your DevRel initiatives with data-driven insights and proven strategies.
          </motion.p>
          <motion.div 
            className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6 px-4 sm:px-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link href="/visualizations" className="w-full sm:w-auto">
              <Button size="lg" className="rounded-full w-full sm:w-auto">
                View Insights
              </Button>
            </Link>
            <Link href="/resources" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="rounded-full w-full sm:w-auto">
                Browse Resources
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Metrics Grid */}
        <motion.div 
          className="mx-auto mt-12 sm:mt-16 max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 px-4 sm:px-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white/50 backdrop-blur-sm p-6 sm:p-8"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center gap-4">
                <metric.icon className={`h-6 w-6 sm:h-8 sm:w-8 ${metric.color}`} />
                <div>
                  <p className="text-2xl sm:text-3xl font-bold">{metric.value}</p>
                  <p className="text-xs sm:text-sm text-gray-600">{metric.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

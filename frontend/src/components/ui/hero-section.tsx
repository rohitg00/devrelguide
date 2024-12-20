'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Users, BookOpen, GitBranch, LineChart } from 'lucide-react'
import { Button } from './button'

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
    value: '100+',
    color: 'text-green-500'
  },
  {
    icon: GitBranch,
    label: 'Programs',
    value: '50+',
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
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <motion.h1 
            className="text-4xl font-bold tracking-tight sm:text-6xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Empower Your Developer Relations
          </motion.h1>
          <motion.p 
            className="mt-6 text-lg leading-8 text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Build stronger developer communities, measure impact, and scale your DevRel initiatives with data-driven insights and proven strategies.
          </motion.p>
          <motion.div 
            className="mt-10 flex items-center justify-center gap-x-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button size="lg" className="rounded-full">
              View Insights
            </Button>
            <Button size="lg" variant="outline" className="rounded-full">
              Browse Resources
            </Button>
          </motion.div>
        </div>

        {/* Metrics Grid */}
        <motion.div 
          className="mx-auto mt-16 max-w-7xl grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white/50 backdrop-blur-sm p-8"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center gap-4">
                <metric.icon className={`h-8 w-8 ${metric.color}`} />
                <div>
                  <p className="text-3xl font-bold">{metric.value}</p>
                  <p className="text-sm text-gray-600">{metric.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

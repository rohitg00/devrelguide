'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Users, BookOpen, GitBranch, LineChart } from 'lucide-react'
import { Button } from './button'
import Link from 'next/link'
import { AvocadoFallback } from './avocado-fallback'

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
      <div className="absolute inset-0 bg-grid-gray-100/50 dark:bg-grid-gray-900/20 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:[mask-image:radial-gradient(ellipse_at_center,transparent_10%,black)]" />
      
      {/* Dark mode glow effects */}
      <div className="absolute hidden dark:block inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 opacity-70" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 blur-3xl rounded-full translate-y-1/2 -translate-x-1/2 opacity-70" />
      </div>
      
      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          {/* Flex container for headline and avocado */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Text content */}
            <motion.div 
              className="lg:max-w-2xl text-center lg:text-left"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.h1 
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent dark:from-primary/90 dark:to-purple-400 dark:drop-shadow-[0_0_25px_rgba(110,47,213,0.2)]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Empower Your Developer Relations
              </motion.h1>
              <motion.p 
                className="mt-4 sm:mt-6 text-base sm:text-lg leading-7 sm:leading-8 text-gray-600 dark:text-gray-300 px-4 sm:px-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Build stronger developer communities, measure impact, and scale your DevRel initiatives with data-driven insights and proven strategies.
              </motion.p>
              <motion.div 
                className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-x-6 px-4 sm:px-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Link href="/visualizations" className="w-full sm:w-auto">
                  <Button size="lg" className="rounded-full w-full sm:w-auto dark:shadow-[0_0_15px_rgba(110,47,213,0.3)]">
                    View Insights
                  </Button>
                </Link>
                <Link href="/resources" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="rounded-full w-full sm:w-auto dark:border-gray-700 dark:hover:border-purple-500/50 dark:hover:bg-purple-950/30">
                    Browse Resources
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
            
            {/* Avocado component */}
            <motion.div 
              className="w-full lg:w-96 h-96 overflow-visible"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <AvocadoFallback />
            </motion.div>
          </div>
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
              className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-6 sm:p-8 dark:shadow-[0_4px_15px_rgba(0,0,0,0.2)]"
              whileHover={{ 
                scale: 1.02, 
                boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                borderColor: "rgba(110,47,213,0.3)"
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center gap-4">
                <metric.icon className={`h-6 w-6 sm:h-8 sm:w-8 ${metric.color} dark:drop-shadow-[0_0_8px_rgba(110,47,213,0.3)]`} />
                <div>
                  <p className="text-2xl sm:text-3xl font-bold dark:text-white">{metric.value}</p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{metric.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

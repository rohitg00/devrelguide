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
  },
  {
    icon: BookOpen,
    label: 'Resources',
    value: '1000+',
  },
  {
    icon: GitBranch,
    label: 'Programs',
    value: '500+',
  },
  {
    icon: LineChart,
    label: 'Research',
    value: '150+',
  }
]

export function HeroSection() {
  return (
    <div className="relative overflow-hidden py-20">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <motion.div
              className="lg:max-w-2xl text-center lg:text-left"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.h1
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Empower Your{' '}
                <span className="text-primary">Developer</span>{' '}
                Relations
              </motion.h1>
              <motion.p
                className="mt-4 sm:mt-6 text-base sm:text-lg leading-7 sm:leading-8 text-muted-foreground px-4 sm:px-0"
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
                  <Button size="lg" className="w-full sm:w-auto uppercase tracking-wider">
                    View Insights
                  </Button>
                </Link>
                <Link href="/resources" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto uppercase tracking-wider">
                    Browse Resources
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              className="w-full lg:w-96 h-48 sm:h-64 lg:h-96 overflow-visible flex items-center justify-center"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <svg viewBox="0 0 300 300" className="w-full h-full text-foreground" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="30" y="30" width="240" height="240" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1" strokeDasharray="4 4" />
                <circle cx="150" cy="150" r="80" className="stroke-secondary" strokeOpacity="0.4" strokeWidth="1.5" strokeDasharray="1000" strokeDashoffset="1000" style={{ animation: 'drafting-reveal 2s ease-out forwards' }} />
                <circle cx="150" cy="150" r="50" className="stroke-secondary" strokeOpacity="0.25" strokeWidth="1" strokeDasharray="1000" strokeDashoffset="1000" style={{ animation: 'drafting-reveal 2s ease-out forwards', animationDelay: '0.3s' }} />
                <line x1="150" y1="30" x2="150" y2="270" stroke="currentColor" strokeOpacity="0.08" strokeWidth="0.5" />
                <line x1="30" y1="150" x2="270" y2="150" stroke="currentColor" strokeOpacity="0.08" strokeWidth="0.5" />
                <line x1="70" y1="150" x2="150" y2="70" className="stroke-primary" strokeOpacity="0.5" strokeWidth="1.5" strokeDasharray="1000" strokeDashoffset="1000" style={{ animation: 'drafting-reveal 2s ease-out forwards', animationDelay: '0.6s' }} />
                <line x1="150" y1="70" x2="230" y2="150" className="stroke-primary" strokeOpacity="0.5" strokeWidth="1.5" strokeDasharray="1000" strokeDashoffset="1000" style={{ animation: 'drafting-reveal 2s ease-out forwards', animationDelay: '0.8s' }} />
                <line x1="230" y1="150" x2="150" y2="230" className="stroke-primary" strokeOpacity="0.5" strokeWidth="1.5" strokeDasharray="1000" strokeDashoffset="1000" style={{ animation: 'drafting-reveal 2s ease-out forwards', animationDelay: '1s' }} />
                <line x1="150" y1="230" x2="70" y2="150" className="stroke-primary" strokeOpacity="0.5" strokeWidth="1.5" strokeDasharray="1000" strokeDashoffset="1000" style={{ animation: 'drafting-reveal 2s ease-out forwards', animationDelay: '1.2s' }} />
                <circle cx="70" cy="150" r="3" className="fill-secondary" fillOpacity="0.7" style={{ animation: 'coordinate-pulse 2s ease-in-out infinite' }} />
                <circle cx="150" cy="70" r="3" className="fill-secondary" fillOpacity="0.7" style={{ animation: 'coordinate-pulse 2s ease-in-out infinite', animationDelay: '0.3s' }} />
                <circle cx="230" cy="150" r="3" className="fill-secondary" fillOpacity="0.7" style={{ animation: 'coordinate-pulse 2s ease-in-out infinite', animationDelay: '0.6s' }} />
                <circle cx="150" cy="230" r="3" className="fill-secondary" fillOpacity="0.7" style={{ animation: 'coordinate-pulse 2s ease-in-out infinite', animationDelay: '0.9s' }} />
                <text x="150" y="155" textAnchor="middle" fill="currentColor" fillOpacity="0.4" fontSize="10" fontFamily="monospace">DEVREL</text>
              </svg>
            </motion.div>
          </div>
        </div>

        <motion.div
          className="mx-auto mt-12 sm:mt-16 max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 px-4 sm:px-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          {metrics.map((metric) => (
            <motion.div
              key={metric.label}
              className="crosshair-corners relative overflow-hidden border border-border bg-card p-6 sm:p-8"
              whileHover={{ borderColor: "rgba(0,255,255,0.4)" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center gap-4">
                <metric.icon className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground/60" strokeWidth={1} />
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-secondary font-mono">{metric.value}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground font-mono uppercase tracking-wider">{metric.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

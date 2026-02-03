'use client'

import React from 'react'
import { motion } from 'framer-motion'
import {
  BarChart3,
  Users2,
  BookOpen,
  GitBranch,
  Lightbulb,
  TrendingUp
} from 'lucide-react'

const features = [
  {
    icon: BarChart3,
    title: 'Data-Driven Insights',
    description: 'Track and analyze key DevRel metrics to measure community engagement and program success.',
  },
  {
    icon: Users2,
    title: 'Community Building',
    description: 'Tools and strategies to grow and nurture your developer community effectively.',
  },
  {
    icon: BookOpen,
    title: 'Resource Library',
    description: 'Access a curated collection of DevRel resources, guides, and best practices.',
  },
  {
    icon: GitBranch,
    title: 'Program Templates',
    description: 'Ready-to-use templates and frameworks for various DevRel initiatives.',
  },
  {
    icon: Lightbulb,
    title: 'Success Stories',
    description: 'Learn from real-world examples and case studies of successful DevRel programs.',
  },
  {
    icon: TrendingUp,
    title: 'Growth Strategies',
    description: 'Proven strategies to scale your DevRel efforts and maximize impact.',
  }
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export function FeaturesSection() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Everything You Need for{' '}
            <span className="text-primary">DevRel Success</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-mono">
            Comprehensive tools and resources to help you build, measure, and scale your Developer Relations program.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              className="relative group"
              variants={item}
            >
              <div className="crosshair-corners h-full p-8 border border-border bg-card transition-colors duration-300 hover:border-secondary/40">
                <div className="inline-flex p-3 border border-border mb-6">
                  <feature.icon className="w-6 h-6 text-muted-foreground" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

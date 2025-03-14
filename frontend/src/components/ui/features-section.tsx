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
    color: 'bg-blue-500/10 text-blue-500 dark:bg-blue-500/20 dark:text-blue-400'
  },
  {
    icon: Users2,
    title: 'Community Building',
    description: 'Tools and strategies to grow and nurture your developer community effectively.',
    color: 'bg-purple-500/10 text-purple-500 dark:bg-purple-500/20 dark:text-purple-400'
  },
  {
    icon: BookOpen,
    title: 'Resource Library',
    description: 'Access a curated collection of DevRel resources, guides, and best practices.',
    color: 'bg-green-500/10 text-green-500 dark:bg-green-500/20 dark:text-green-400'
  },
  {
    icon: GitBranch,
    title: 'Program Templates',
    description: 'Ready-to-use templates and frameworks for various DevRel initiatives.',
    color: 'bg-orange-500/10 text-orange-500 dark:bg-orange-500/20 dark:text-orange-400'
  },
  {
    icon: Lightbulb,
    title: 'Success Stories',
    description: 'Learn from real-world examples and case studies of successful DevRel programs.',
    color: 'bg-pink-500/10 text-pink-500 dark:bg-pink-500/20 dark:text-pink-400'
  },
  {
    icon: TrendingUp,
    title: 'Growth Strategies',
    description: 'Proven strategies to scale your DevRel efforts and maximize impact.',
    color: 'bg-indigo-500/10 text-indigo-500 dark:bg-indigo-500/20 dark:text-indigo-400'
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
    <section className="py-24 bg-gray-50/50 dark:bg-transparent dark:bg-gradient-to-b dark:from-gray-900/30 dark:to-gray-900/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-4 dark:from-primary/90 dark:to-purple-400 dark:drop-shadow-[0_0_20px_rgba(110,47,213,0.2)]">
            Everything You Need for DevRel Success
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
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
              <div className="h-full p-8 rounded-2xl bg-white dark:bg-gray-900/60 dark:backdrop-blur-md border border-gray-200 dark:border-gray-800 shadow-sm transition-all duration-300 hover:shadow-md dark:hover:border-purple-500/30 dark:hover:shadow-[0_8px_25px_rgba(0,0,0,0.3),0_0_10px_rgba(110,47,213,0.2)]">
                <div className={`inline-flex p-3 rounded-lg ${feature.color} mb-6 dark:shadow-[0_0_20px_rgba(110,47,213,0.1)]`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3 dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

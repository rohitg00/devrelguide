'use client'

import Link from 'next/link'
import { ArrowRight, Calendar, Clock } from 'lucide-react'
import { motion } from 'framer-motion'

const blogPosts = [
  {
    slug: 'mcp-vs-a2a',
    title: 'MCP vs A2A: Understanding Context Protocols for AI Systems',
    description: 'A deep dive into the Model Context Protocol (MCP) and Agent-to-Agent (A2A) protocol — how they differ, where they overlap, and when to use each.',
    date: 'March 24, 2025',
    readTime: '15 min read',
  },
  {
    slug: 'why-devrel-is-needed',
    title: 'Why DevRel is Needed for Your Company: Building Bridges to Developer Communities',
    description: 'DevRel professionals connect companies and developers by giving technical guidance, support, and resources. Learn why DevRel has become essential.',
    date: 'March 24, 2025',
    readTime: '10 min read',
  },
]

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <motion.h1
          className="text-4xl font-bold mb-4 text-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Blog
        </motion.h1>
        <motion.p
          className="text-lg text-muted-foreground mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Insights on Developer Relations, AI protocols, and building developer communities.
        </motion.p>

        <div className="space-y-8">
          {blogPosts.map((post, index) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 * (index + 1) }}
            >
              <Link href={`/blog/${post.slug}`} className="block group">
                <div className="p-6 rounded-xl border border-border bg-card hover:border-secondary transition-all duration-300 hover:shadow-lg">
                  <h2 className="text-xl font-semibold text-foreground group-hover:text-secondary transition-colors mb-3">
                    {post.title}
                  </h2>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {post.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {post.readTime}
                    </span>
                    <span className="ml-auto flex items-center gap-1 text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                      Read more <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </main>
  )
}

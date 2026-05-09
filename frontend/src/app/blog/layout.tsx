import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'DevRel Blog — Developer Relations, AI Agents, and Coding Workflows',
  description: 'Long-form essays on Developer Relations, AI coding agents, MCP, A2A, community building, and the tools shaping modern dev advocacy.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'DevRel Blog — Developer Relations, AI Agents, and Coding Workflows',
    description: 'Essays on DevRel, AI coding agents, and developer experience.',
    url: `${SITE_URL}/blog`,
    type: 'website',
  },
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children
}

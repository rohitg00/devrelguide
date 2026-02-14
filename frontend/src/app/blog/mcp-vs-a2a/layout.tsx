import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MCP vs A2A: The Complete Guide to AI Agent Protocols in 2026',
  description: 'The definitive comparison of MCP and A2A — covering MCP Apps, Streamable HTTP, Google ADK integration, and how these protocols work together.',
  openGraph: {
    title: 'MCP vs A2A: The Complete Guide to AI Agent Protocols in 2026',
    description: 'The definitive comparison of MCP and A2A — covering MCP Apps, Streamable HTTP, Google ADK integration, and how these protocols work together.',
    type: 'article',
    url: 'https://learndevrel.com/blog/mcp-vs-a2a',
    siteName: 'DevRel Guide',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MCP vs A2A: Complete Guide to AI Agent Protocols',
    description: 'The definitive comparison of MCP and A2A — covering MCP Apps, Streamable HTTP, Google ADK integration, and how these protocols work together.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}

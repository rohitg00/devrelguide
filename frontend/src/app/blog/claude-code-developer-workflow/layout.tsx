import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Claude Code: The Hooks, Skills, and MCP Workflow That Ships Production Software',
  description: 'How Claude Code\'s ecosystem of hooks, skills, MCP servers, and persistent memory turns a terminal agent into a complete development workflow.',
  openGraph: {
    title: 'Claude Code: Hooks, Skills, and MCP Workflow',
    description: 'How Claude Code\'s ecosystem of hooks, skills, MCP servers, and persistent memory turns a terminal agent into a complete development workflow.',
    type: 'article',
    url: 'https://learndevrel.com/blog/claude-code-developer-workflow',
    siteName: 'DevRel Guide',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Claude Code: Hooks, Skills, and MCP Workflow',
    description: 'How Claude Code\'s ecosystem of hooks, skills, MCP servers, and persistent memory turns a terminal agent into a complete development workflow.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}

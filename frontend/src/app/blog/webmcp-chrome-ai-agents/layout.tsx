import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'WebMCP: Chrome Just Turned Every Website Into an API for AI Agents',
  description: 'Google and Microsoft shipped WebMCP in Chrome 146 — a new W3C standard that lets websites expose structured tools to AI agents. 89% fewer tokens than screenshots, 980 GitHub stars in 48 hours, and five framework demos already live.',
  openGraph: {
    title: 'WebMCP: Chrome Just Turned Every Website Into an API for AI Agents',
    description: 'Google and Microsoft shipped WebMCP in Chrome 146. Websites expose structured tools to AI agents via navigator.modelContext. 89% fewer tokens, 98% accuracy, and the web becomes agent-native.',
    type: 'article',
    url: 'https://learn.devrelasservice.com/blog/webmcp-chrome-ai-agents',
    siteName: 'DevRel Guide',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WebMCP: Chrome Turned Every Website Into an AI Agent API',
    description: 'Google and Microsoft shipped WebMCP in Chrome 146. Websites expose structured tools to AI agents via navigator.modelContext. 89% fewer tokens, 98% accuracy.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}

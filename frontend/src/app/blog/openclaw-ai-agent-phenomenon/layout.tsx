import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'OpenClaw: From Side Project to 145K GitHub Stars — What Developers Should Know',
  description: 'How an Austrian developer\'s lobster-themed AI agent went from hobby project to global phenomenon in weeks, and what it means for the future of open-source AI agents.',
  openGraph: {
    title: 'OpenClaw: From Side Project to 145K GitHub Stars',
    description: 'How an Austrian developer\'s lobster-themed AI agent went from hobby project to global phenomenon in weeks, and what it means for the future of open-source AI agents.',
    type: 'article',
    url: 'https://learn.devrelasservice.com/blog/openclaw-ai-agent-phenomenon',
    siteName: 'DevRel Guide',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OpenClaw: From Side Project to 145K GitHub Stars',
    description: 'How an Austrian developer\'s lobster-themed AI agent went from hobby project to global phenomenon in weeks, and what it means for the future of open-source AI agents.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'The Ralph Loop: Why a Bash Loop Is the Most Important AI Coding Technique of 2026',
  description: 'Named after Ralph Wiggum, this deliberately simple technique of running coding agents in a loop against specs is reshaping how software gets built.',
  openGraph: {
    title: 'The Ralph Loop: AI Coding\'s Most Important Technique',
    description: 'Named after Ralph Wiggum, this deliberately simple technique of running coding agents in a loop against specs is reshaping how software gets built.',
    type: 'article',
    url: 'https://learndevrel.com/blog/ralph-loop-ai-coding',
    siteName: 'DevRel Guide',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Ralph Loop: AI Coding\'s Most Important Technique',
    description: 'Named after Ralph Wiggum, this deliberately simple technique of running coding agents in a loop against specs is reshaping how software gets built.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}

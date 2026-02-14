import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'OpenCode: The 95K-Star AI Coding Agent Built for the Terminal',
  description: 'With 2.5M monthly developers, 75+ model providers, and zero hype, OpenCode became the quiet workhorse of terminal-based AI-assisted development.',
  openGraph: {
    title: 'OpenCode: 95K Stars, 2.5M Monthly Developers',
    description: 'With 2.5M monthly developers, 75+ model providers, and zero hype, OpenCode became the quiet workhorse of terminal-based AI-assisted development.',
    type: 'article',
    url: 'https://learndevrel.com/blog/opencode-terminal-coding-agent',
    siteName: 'DevRel Guide',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OpenCode: 95K Stars, 2.5M Monthly Developers',
    description: 'With 2.5M monthly developers, 75+ model providers, and zero hype, OpenCode became the quiet workhorse of terminal-based AI-assisted development.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}

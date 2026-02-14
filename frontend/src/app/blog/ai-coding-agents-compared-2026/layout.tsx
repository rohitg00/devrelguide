import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Coding Agents Compared: Claude Code vs OpenCode vs OpenClaw in 2026',
  description: 'A practical comparison of every major AI coding agent — model access, ecosystem depth, privacy, and which workflow fits your team.',
  openGraph: {
    title: 'AI Coding Agents Compared: 2026 Guide',
    description: 'A practical comparison of every major AI coding agent — model access, ecosystem depth, privacy, and which workflow fits your team.',
    type: 'article',
    url: 'https://learndevrel.com/blog/ai-coding-agents-compared-2026',
    siteName: 'DevRel Guide',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Coding Agents Compared: 2026 Guide',
    description: 'A practical comparison of every major AI coding agent — model access, ecosystem depth, privacy, and which workflow fits your team.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}

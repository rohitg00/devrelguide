import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Your AI Agent&apos;s Memory Is Probably Broken. Here Is Why.',
  description: 'Most agent memory layers re-create the same fact six times when you re-import the source. Content-addressed IDs fix it. A walk through the failure mode, the fingerprint pattern, and how Letta, Mem0, and the open-source memory layer agentmemory each handle it.',
  alternates: { canonical: '/blog/content-addressed-memory-for-agents' },
  openGraph: {
    title: 'Your AI Agent&apos;s Memory Is Probably Broken. Here Is Why.',
    description: 'Random IDs duplicate facts on every re-import. Content-addressed memory deduplicates and reinforces. Walkthrough with Letta, Mem0, and agentmemory.',
    type: 'article',
    url: 'https://learndevrel.com/blog/content-addressed-memory-for-agents',
    siteName: 'DevRel Guide',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Your AI Agent&apos;s Memory Is Probably Broken',
    description: 'Random IDs duplicate facts on every re-import. Content-addressed memory deduplicates and reinforces.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}

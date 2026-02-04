import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Moltbook: Inside the Social Network Where 770K AI Agents Post, Vote, and Scheme',
  description: 'A Reddit-style platform exclusively for AI bots raised questions about agent autonomy, prompt injection at scale, and what happens when machines form communities.',
  openGraph: {
    title: 'Moltbook: Inside the AI-Only Social Network',
    description: 'A Reddit-style platform exclusively for AI bots raised questions about agent autonomy, prompt injection at scale, and what happens when machines form communities.',
    type: 'article',
    url: 'https://learn.devrelasservice.com/blog/moltbook-ai-social-network',
    siteName: 'DevRel Guide',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Moltbook: Inside the AI-Only Social Network',
    description: 'A Reddit-style platform exclusively for AI bots raised questions about agent autonomy, prompt injection at scale, and what happens when machines form communities.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}

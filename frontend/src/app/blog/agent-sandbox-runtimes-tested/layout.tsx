import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'I Ran Six Agent Sandbox Runtimes Back to Back. Here Is What Actually Worked.',
  description: 'E2B, Daytona, Modal, Morph, Vercel Sandbox, and Docker sbx — six microVM and gVisor runtimes for AI coding agents, tested on the same workload. Cold-start times, isolation models, persistence, network policies, and the one that surprised me.',
  alternates: { canonical: '/blog/agent-sandbox-runtimes-tested' },
  openGraph: {
    title: 'I Ran Six Agent Sandbox Runtimes Back to Back. Here Is What Actually Worked.',
    description: 'E2B, Daytona, Modal, Morph, Vercel Sandbox, Docker sbx — measured on cold start, isolation, persistence, network policy. Honest writeup, no vendor pitch.',
    type: 'article',
    url: 'https://learndevrel.com/blog/agent-sandbox-runtimes-tested',
    siteName: 'DevRel Guide',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Six Agent Sandbox Runtimes, Tested',
    description: 'E2B, Daytona, Modal, Morph, Vercel Sandbox, Docker sbx — cold start, isolation, persistence, network policy.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}

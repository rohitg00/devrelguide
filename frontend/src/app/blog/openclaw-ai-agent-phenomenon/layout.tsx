import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'OpenClaw: 180K GitHub Stars, a Critical CVE, and Agentic AI\'s Biggest Security Wake-Up Call',
  description: 'From hobby project to 180K stars, CVE-2026-25253, 42K exposed instances, Moltbook\'s 1.5M agents, and the security fallout that redefined agentic AI risk.',
  openGraph: {
    title: 'OpenClaw: 180K Stars, a Critical CVE, and Agentic AI\'s Security Wake-Up Call',
    description: 'From hobby project to 180K stars, CVE-2026-25253, 42K exposed instances, Moltbook\'s 1.5M agents, and the security fallout that redefined agentic AI risk.',
    type: 'article',
    url: 'https://learndevrel.com/blog/openclaw-ai-agent-phenomenon',
    siteName: 'DevRel Guide',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OpenClaw: 180K Stars, a Critical CVE, and Agentic AI\'s Security Wake-Up Call',
    description: 'From hobby project to 180K stars, CVE-2026-25253, 42K exposed instances, Moltbook\'s 1.5M agents, and the security fallout that redefined agentic AI risk.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}

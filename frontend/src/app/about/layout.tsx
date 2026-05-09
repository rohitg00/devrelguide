import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About DevRel Guide',
  description: 'About DevRel Guide — a community-built playbook of Developer Relations resources, programs, and jobs.',
  alternates: { canonical: '/about' },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'DevRel Resources — Articles, Tools, and Learning Material',
  description: 'Curated Developer Relations resources: blog posts, GitHub repositories, learning paths, and tools for developer advocates and community builders.',
  alternates: { canonical: '/resources' },
  openGraph: {
    title: 'DevRel Resources — Articles, Tools, and Learning Material',
    description: 'Curated Developer Relations resources for advocates and community builders.',
    url: '/resources',
    type: 'website',
  },
}

export default function ResourcesLayout({ children }: { children: React.ReactNode }) {
  return children
}

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'DevRel Programs — Templates, Frameworks, and Live Job Listings',
  description: 'Real Developer Relations programs and live DevRel job opportunities scraped from across the industry. Templates, frameworks, and case studies.',
  alternates: { canonical: '/programs' },
  openGraph: {
    title: 'DevRel Programs — Templates, Frameworks, and Live Job Listings',
    description: 'Real DevRel programs and live job opportunities, plus templates and frameworks.',
    url: '/programs',
    type: 'website',
  },
}

export default function ProgramsLayout({ children }: { children: React.ReactNode }) {
  return children
}

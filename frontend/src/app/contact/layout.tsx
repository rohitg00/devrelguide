import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact DevRel Guide',
  description: 'Reach out about Developer Relations programs, contributions, partnerships, or feedback.',
  alternates: { canonical: '/contact' },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}

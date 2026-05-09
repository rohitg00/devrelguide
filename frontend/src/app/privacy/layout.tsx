import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How DevRel Guide handles data and privacy.',
  alternates: { canonical: '/privacy' },
  robots: { index: true, follow: false },
}

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children
}

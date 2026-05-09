import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms governing use of DevRel Guide.',
  alternates: { canonical: '/terms' },
  robots: { index: true, follow: false },
}

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children
}

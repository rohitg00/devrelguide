import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Why DevRel is Needed for Your Company: Building Bridges to Developer Communities',
  description: 'DevRel professionals connect companies and developers by giving technical guidance, support, and resources. Learn why DevRel has become essential.',
  openGraph: {
    title: 'Why DevRel is Needed for Your Company',
    description: 'DevRel professionals connect companies and developers by giving technical guidance, support, and resources. Learn why DevRel has become essential.',
    type: 'article',
    url: 'https://learndevrel.com/blog/why-devrel-is-needed',
    siteName: 'DevRel Guide',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Why DevRel is Needed for Your Company',
    description: 'DevRel professionals connect companies and developers by giving technical guidance, support, and resources. Learn why DevRel has become essential.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}

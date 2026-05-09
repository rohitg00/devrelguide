import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Three Primitives Are Enough: Rebuilding Backends Without Fifty SDKs',
  description: 'Modern backends pull in queues, cron schedulers, pub/sub, HTTP frameworks, state stores, and stream brokers — each with its own SDK and failure mode. A small but growing camp argues that three primitives cover all of it. Here is the case, with code.',
  alternates: { canonical: '/blog/three-primitives-replace-fifty-sdks' },
  openGraph: {
    title: 'Three Primitives Are Enough: Rebuilding Backends Without Fifty SDKs',
    description: 'Workers, functions, triggers — why a tiny primitive set is collapsing the queue/cron/pubsub/HTTP/state/stream stack.',
    type: 'article',
    url: 'https://learndevrel.com/blog/three-primitives-replace-fifty-sdks',
    siteName: 'DevRel Guide',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Three Primitives Are Enough',
    description: 'Workers, functions, triggers — why a tiny primitive set replaces the queue/cron/pubsub/HTTP/state/stream stack.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}

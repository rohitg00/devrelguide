'use client'

import { Button } from '@/components/ui/button'

export default function BuilderError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="crosshair-corners border border-border bg-card p-12 text-center max-w-md">
        <div className="text-primary text-4xl font-mono mb-4">ERR</div>
        <h2 className="text-xl font-mono text-foreground mb-2 uppercase tracking-wider">Builder Error</h2>
        <p className="text-muted-foreground font-mono text-sm mb-6">
          {error.message || 'Failed to load builder'}
        </p>
        <Button onClick={reset} variant="outline">
          Retry
        </Button>
      </div>
    </div>
  )
}

'use client'

import React from 'react'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface VisualizationContainerProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function VisualizationContainer({
  title,
  description,
  children,
  className
}: VisualizationContainerProps) {
  return (
    <ErrorBoundary>
      <Card className={cn("overflow-hidden card-hover", className)}>
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <h3 className="text-2xl font-semibold tracking-tight">{title}</h3>
            {description && (
              <p className="text-muted-foreground">{description}</p>
            )}
          </div>
          <div className="w-full min-h-[400px] relative bg-muted/5 rounded-lg overflow-hidden">
            {children}
          </div>
        </div>
      </Card>
    </ErrorBoundary>
  )
}

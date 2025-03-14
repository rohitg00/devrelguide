'use client'

import React, { useState } from 'react'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface VisualizationContainerProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
  onRetry?: () => void
  isLoading?: boolean
  hasError?: boolean
  errorMessage?: string
}

export function VisualizationContainer({
  title,
  description,
  children,
  className,
  onRetry,
  isLoading = false,
  hasError = false,
  errorMessage = "Failed to load visualization"
}: VisualizationContainerProps) {
  return (
    <ErrorBoundary fallback={
      <VisualizationError 
        title={title} 
        description={description}
        errorMessage="An error occurred rendering this visualization"
        onRetry={onRetry}
      />
    }>
      <Card className={cn("overflow-hidden card-hover", className)}>
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <h3 className="text-2xl font-semibold tracking-tight">{title}</h3>
            {description && (
              <p className="text-muted-foreground">{description}</p>
            )}
          </div>
          <div className="w-full min-h-[400px] relative bg-muted/5 rounded-lg overflow-hidden">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
                <RefreshCw className="w-8 h-8 animate-spin text-primary" />
              </div>
            )}
            {hasError ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <AlertCircle className="w-12 h-12 text-destructive mb-4" />
                <h4 className="text-lg font-medium mb-2">Visualization Error</h4>
                <p className="text-muted-foreground mb-4">{errorMessage}</p>
                {onRetry && (
                  <Button onClick={onRetry} variant="outline">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Retry
                  </Button>
                )}
              </div>
            ) : (
              children
            )}
          </div>
        </div>
      </Card>
    </ErrorBoundary>
  )
}

interface VisualizationErrorProps {
  title: string
  description?: string
  errorMessage: string
  onRetry?: () => void
}

function VisualizationError({ title, description, errorMessage, onRetry }: VisualizationErrorProps) {
  return (
    <Card className="overflow-hidden">
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="text-2xl font-semibold tracking-tight">{title}</h3>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
        <div className="w-full min-h-[400px] flex flex-col items-center justify-center p-6 text-center">
          <AlertCircle className="w-12 h-12 text-destructive mb-4" />
          <h4 className="text-lg font-medium mb-2">Visualization Error</h4>
          <p className="text-muted-foreground mb-4">{errorMessage}</p>
          {onRetry && (
            <Button onClick={onRetry} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}

'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Visualization Error:', error, errorInfo)
    this.setState({ errorInfo })
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="error-container">
          <div className="flex flex-col items-center space-y-3 text-center">
            <svg
              className="h-8 w-8 text-destructive"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h4 className="error-title">
              Unable to load visualization
            </h4>
            <p className="error-message">
              {this.state.error?.message}
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-4 py-2 bg-destructive/5 text-destructive hover:bg-destructive/10 hover:text-destructive/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background"
          >
            Try refreshing the page
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

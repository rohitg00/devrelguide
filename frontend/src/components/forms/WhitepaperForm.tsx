'use client'

import { useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Download } from 'lucide-react'

export function WhitepaperForm() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/store-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Check if error is related to already registered email
        if (data.error === 'This email has already been registered') {
          // Set isSubmitted to true to allow download instead of showing error
          setIsSubmitted(true)
          return
        }
        throw new Error(data.error || 'Failed to submit email')
      }

      setIsSubmitted(true)
    } catch (error) {
      console.error('Error:', error)
      setError(error instanceof Error ? error.message : 'Failed to submit email. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = () => {
    window.location.href = '/content/Developer Relations (DevRel)_ Bridging the Gap Between Developers and Business.html'
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Download DevRel Whitepaper</CardTitle>
        <CardDescription>
          Enter your business email to download our comprehensive whitepaper on Developer Relations
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
            {error}
          </div>
        )}
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Enter your business email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="focus:ring-2 focus:ring-blue-500"
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
              title="Please enter a valid email address"
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Submitting...' : 'Get Whitepaper'}
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <p className="text-green-600">Thank you! Your whitepaper is ready for download.</p>
            <Button onClick={handleDownload} className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Download Whitepaper
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

'use client'

import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Download } from 'lucide-react'

export function WhitepaperForm() {
  const handleDownload = () => {
    window.location.href = '/content/Developer Relations (DevRel)_ Bridging the Gap Between Developers and Business.html'
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Download DevRel Whitepaper</CardTitle>
        <CardDescription>
          Download our comprehensive whitepaper on Developer Relations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button onClick={handleDownload} className="w-full">
            <Download className="mr-2 h-4 w-4" />
            Download Whitepaper
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

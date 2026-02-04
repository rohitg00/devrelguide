'use client'

import { WhitepaperSection } from '@/components/ui/whitepaper-section'
import { WhitepaperForm } from '@/components/forms/WhitepaperForm'

export default function WhitepaperPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <WhitepaperSection />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            The Complete Developer Relations Guide 2024
          </h1>
          <p className="text-xl text-muted-foreground">
            A comprehensive whitepaper on building successful Developer Relations programs
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 md:gap-12 items-start max-w-5xl mx-auto">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">What&apos;s Inside:</h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="text-primary">📚</span>
                <span>Comprehensive overview of Developer Relations</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary">🎯</span>
                <span>Core components and best practices</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary">🌱</span>
                <span>Community building strategies</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary">📊</span>
                <span>Metrics and success measurement</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary">📈</span>
                <span>Career growth and development paths</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary">🔧</span>
                <span>Technical advocacy techniques</span>
              </li>
            </ul>
          </div>
          
          <div>
            <WhitepaperForm />
          </div>
        </div>
      </div>
    </main>
  )
}

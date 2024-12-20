import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { HeroSection } from '@/components/ui/hero-section'
import { FeaturesSection } from '@/components/ui/features-section'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <HeroSection />
      <FeaturesSection />
    </main>
  )
}

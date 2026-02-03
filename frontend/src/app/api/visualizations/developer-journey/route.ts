import { NextResponse } from 'next/server'
import { generateDeveloperJourney } from '@/lib/visualization-generators'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const data = generateDeveloperJourney()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error generating developer journey:', error)
    return NextResponse.json({ error: 'Failed to generate developer journey' }, { status: 500 })
  }
}

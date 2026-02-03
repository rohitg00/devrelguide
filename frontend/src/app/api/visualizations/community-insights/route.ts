import { NextResponse } from 'next/server'
import { generateCommunityInsights } from '@/lib/visualization-generators'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const data = generateCommunityInsights()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error generating community insights:', error)
    return NextResponse.json({ error: 'Failed to generate community insights' }, { status: 500 })
  }
}

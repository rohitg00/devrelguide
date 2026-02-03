import { NextResponse } from 'next/server'
import { generateMetricsFlow } from '@/lib/visualization-generators'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const data = generateMetricsFlow()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error generating metrics flow:', error)
    return NextResponse.json({ error: 'Failed to generate metrics flow' }, { status: 500 })
  }
}

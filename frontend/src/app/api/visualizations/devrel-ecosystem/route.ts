import { NextResponse } from 'next/server'
import { generateDevrelEcosystem } from '@/lib/visualization-generators'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const data = generateDevrelEcosystem()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error generating devrel ecosystem:', error)
    return NextResponse.json({ error: 'Failed to generate devrel ecosystem' }, { status: 500 })
  }
}

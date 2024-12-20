import { NextResponse } from 'next/server'
import { updateDevRelResources } from '@/app/scrapers/devrel'

export async function POST() {
  try {
    const result = await updateDevRelResources()
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error in update resources route:', error)
    return NextResponse.json(
      { error: 'Failed to update resources', detail: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

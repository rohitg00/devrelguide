import { NextResponse } from 'next/server'
import { readJsonData, writeJsonData } from '@/lib/data'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const data = await readJsonData('metrics.json')
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'no-store, must-revalidate' },
    })
  } catch (error) {
    console.error('Error fetching metrics data:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch metrics data' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const existingData = await readJsonData<Record<string, any>>('metrics.json')

    const mergedData = {
      metadata: {
        ...existingData.metadata,
        ...body.metadata,
        lastUpdated: new Date().toISOString(),
      },
      data: {
        ...existingData.data,
        metrics: [...(existingData.data?.metrics || []), ...(body.data?.metrics || [])],
        trends: [...(existingData.data?.trends || []), ...(body.data?.trends || [])],
      },
    }

    await writeJsonData('metrics.json', mergedData)
    return NextResponse.json(mergedData)
  } catch (error) {
    console.error('Error appending metrics data:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to append metrics data' },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

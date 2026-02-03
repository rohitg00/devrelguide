import { NextResponse } from 'next/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
const API_KEY = process.env.API_KEY

export const dynamic = 'force-dynamic'
export const revalidate = 0

function apiHeaders(): Record<string, string> {
  const h: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
  if (API_KEY) h['X-API-Key'] = API_KEY
  return h
}

export async function GET() {
  try {
    const response = await fetch(`${API_URL}/api/visualizations/community-graph`, {
      headers: apiHeaders(),
      cache: 'no-store',
      next: { revalidate: 0 }
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch community graph data' },
        { status: response.status }
      )
    }

    const data = await response.json()

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store, must-revalidate',
      }
    })
  } catch (error) {
    console.error('Community graph request failed:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const existingResponse = await fetch(`${API_URL}/api/visualizations/community-graph`, {
      headers: apiHeaders(),
    })

    if (!existingResponse.ok) {
      throw new Error(`Failed to fetch existing data: ${existingResponse.status}`)
    }

    const existingData = await existingResponse.json()

    const mergedData = {
      ...existingData,
      ...body,
      nodes: [...(existingData.nodes || []), ...(body.nodes || [])],
      edges: [...(existingData.edges || []), ...(body.edges || [])]
    }

    const response = await fetch(`${API_URL}/api/visualizations/community-graph/append`, {
      method: 'POST',
      headers: apiHeaders(),
      body: JSON.stringify(mergedData)
    })

    if (!response.ok) {
      throw new Error(`Failed to append community graph data: ${response.status}`)
    }

    const result = await response.json()

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error appending community graph data:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to append community graph data' },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-API-Key',
    }
  })
}

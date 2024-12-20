import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
const API_USERNAME = process.env.NEXT_PUBLIC_API_USERNAME
const API_PASSWORD = process.env.NEXT_PUBLIC_API_PASSWORD

if (!API_USERNAME || !API_PASSWORD) {
  console.error('API credentials not configured')
  throw new Error('API credentials not configured')
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    console.log('Fetching community graph data from:', `${API_URL}/api/visualizations/community-graph`)
    const response = await fetch(`${API_URL}/api/visualizations/community-graph`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${API_USERNAME}:${API_PASSWORD}`).toString('base64')}`
      },
      credentials: 'omit',
      cache: 'no-store',
      next: { revalidate: 0 }
    })

    if (!response.ok) {
      console.error('Community graph API error:', response.status, response.statusText)
      const errorText = await response.text()
      console.error('Error details:', errorText)
      
      return NextResponse.json(
        { error: 'Failed to fetch community graph data' },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('Community graph data fetched successfully')

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store, must-revalidate',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true'
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
    console.log('Appending community graph data:', body)

    // Get existing data first
    const existingResponse = await fetch(`${API_URL}/api/visualizations/community-graph`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${API_USERNAME}:${API_PASSWORD}`).toString('base64')}`
      },
      credentials: 'omit'
    })

    if (!existingResponse.ok) {
      throw new Error(`Failed to fetch existing data: ${existingResponse.status}`)
    }

    const existingData = await existingResponse.json()

    // Merge new data with existing data
    const mergedData = {
      ...existingData,
      ...body,
      nodes: [...(existingData.nodes || []), ...(body.nodes || [])],
      edges: [...(existingData.edges || []), ...(body.edges || [])]
    }

    // Send merged data to append endpoint
    const response = await fetch(`${API_URL}/api/visualizations/community-graph/append`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${API_USERNAME}:${API_PASSWORD}`).toString('base64')}`
      },
      credentials: 'omit',
      body: JSON.stringify(mergedData)
    })

    if (!response.ok) {
      throw new Error(`Failed to append community graph data: ${response.status}`)
    }

    const result = await response.json()
    console.log('Community graph data appended successfully')

    return NextResponse.json(result, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true'
      }
    })
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
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true'
    }
  })
}

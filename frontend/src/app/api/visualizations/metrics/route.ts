import { NextResponse } from 'next/server'

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
    console.log('Fetching metrics data from:', `${API_URL}/api/visualizations/metrics`)
    const response = await fetch(`${API_URL}/api/visualizations/metrics`, {
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
      console.error('Error response status:', response.status)
      const errorText = await response.text()
      console.error('Error response body:', errorText)
      throw new Error(`Failed to fetch metrics data: ${response.status}`)
    }

    const data = await response.json()
    console.log('Metrics data fetched successfully')

    if (!data.data || !data.metadata) {
      throw new Error('Invalid metrics data format')
    }

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
    console.log('Appending metrics data:', body)

    // Get existing data first
    const existingResponse = await fetch(`${API_URL}/api/visualizations/metrics`, {
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
      metadata: {
        ...existingData.metadata,
        ...body.metadata,
        lastUpdated: new Date().toISOString()
      },
      data: {
        ...existingData.data,
        metrics: [...(existingData.data?.metrics || []), ...(body.data?.metrics || [])],
        trends: [...(existingData.data?.trends || []), ...(body.data?.trends || [])]
      }
    }

    // Send merged data to append endpoint
    const response = await fetch(`${API_URL}/api/visualizations/metrics/append`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${API_USERNAME}:${API_PASSWORD}`).toString('base64')}`
      },
      credentials: 'omit',
      body: JSON.stringify(mergedData)
    })

    if (!response.ok) {
      throw new Error(`Failed to append metrics data: ${response.status}`)
    }

    const result = await response.json()
    console.log('Metrics data appended successfully')

    return NextResponse.json(result, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true'
      }
    })
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
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true'
    }
  })
}

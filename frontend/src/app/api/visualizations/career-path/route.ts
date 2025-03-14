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
    console.log('Fetching career path data from:', `${API_URL}/api/visualizations/career-path`)
    const response = await fetch(`${API_URL}/api/visualizations/career-path`, {
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
      console.error('Career path API error:', response.status, response.statusText)
      const errorText = await response.text()
      console.error('Error details:', errorText)
      
      return NextResponse.json(
        { error: 'Failed to fetch career path data' },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('Career path data fetched successfully')

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
    console.error('Career path request failed:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('Appending career path data:', body)

    // Get existing data first
    const existingResponse = await fetch(`${API_URL}/api/visualizations/career-path`, {
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
      paths: [...(existingData.paths || []), ...(body.paths || [])],
      skills: [...(existingData.skills || []), ...(body.skills || [])]
    }

    // Send merged data to append endpoint
    const response = await fetch(`${API_URL}/api/visualizations/career-path/append`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${API_USERNAME}:${API_PASSWORD}`).toString('base64')}`
      },
      credentials: 'omit',
      body: JSON.stringify(mergedData)
    })

    if (!response.ok) {
      throw new Error(`Failed to append career path data: ${response.status}`)
    }

    const result = await response.json()
    console.log('Career path data appended successfully')

    return NextResponse.json(result, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true'
      }
    })
  } catch (error) {
    console.error('Error appending career path data:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to append career path data' },
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

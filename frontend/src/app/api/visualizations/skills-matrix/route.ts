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
    console.log('Fetching skills matrix data from:', `${API_URL}/api/visualizations/skills-matrix`)
    const response = await fetch(`${API_URL}/api/visualizations/skills-matrix`, {
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
      throw new Error(`Failed to fetch skills matrix data: ${response.status}`)
    }

    const data = await response.json()
    console.log('Skills matrix data fetched successfully')

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
    console.error('Error fetching skills matrix data:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch skills matrix data' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('Appending skills matrix data:', body)

    // Get existing data first
    const existingResponse = await fetch(`${API_URL}/api/visualizations/skills-matrix`, {
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
      skills: [...(existingData.skills || []), ...(body.skills || [])],
      categories: [...(existingData.categories || []), ...(body.categories || [])]
    }

    // Send merged data to append endpoint
    const response = await fetch(`${API_URL}/api/visualizations/skills-matrix/append`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${API_USERNAME}:${API_PASSWORD}`).toString('base64')}`
      },
      credentials: 'omit',
      body: JSON.stringify(mergedData)
    })

    if (!response.ok) {
      throw new Error(`Failed to append skills matrix data: ${response.status}`)
    }

    const result = await response.json()
    console.log('Skills matrix data appended successfully')

    return NextResponse.json(result, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true'
      }
    })
  } catch (error) {
    console.error('Error appending skills matrix data:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to append skills matrix data' },
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

import { NextResponse } from 'next/server'
import { readJsonData, writeJsonData } from '@/lib/data'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const data = await readJsonData('skills_matrix.json')
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'no-store, must-revalidate' },
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
    const existingData = await readJsonData<Record<string, any>>('skills_matrix.json')

    const mergedData = {
      ...existingData,
      ...body,
      skills: [...(existingData.skills || []), ...(body.skills || [])],
      categories: [...(existingData.categories || []), ...(body.categories || [])],
    }

    await writeJsonData('skills_matrix.json', mergedData)
    return NextResponse.json(mergedData)
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
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

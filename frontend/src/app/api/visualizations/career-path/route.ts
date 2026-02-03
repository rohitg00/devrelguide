import { NextResponse } from 'next/server'
import { readJsonData, writeJsonData } from '@/lib/data'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const data = await readJsonData('career_path.json')
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'no-store, must-revalidate' },
    })
  } catch (error) {
    console.error('Career path request failed:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const existingData = await readJsonData<Record<string, any>>('career_path.json')

    const mergedData = {
      ...existingData,
      ...body,
      paths: [...(existingData.paths || []), ...(body.paths || [])],
      skills: [...(existingData.skills || []), ...(body.skills || [])],
    }

    await writeJsonData('career_path.json', mergedData)
    return NextResponse.json(mergedData)
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
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

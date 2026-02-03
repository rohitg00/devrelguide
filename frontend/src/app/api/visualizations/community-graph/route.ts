import { NextResponse } from 'next/server'
import { readJsonData, writeJsonData } from '@/lib/data'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const data = await readJsonData('community_graph.json')
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'no-store, must-revalidate' },
    })
  } catch (error) {
    console.error('Community graph request failed:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const existingData = await readJsonData<Record<string, any>>('community_graph.json')

    const mergedData = {
      ...existingData,
      ...body,
      nodes: [...(existingData.nodes || []), ...(body.nodes || [])],
      edges: [...(existingData.edges || []), ...(body.edges || [])],
    }

    await writeJsonData('community_graph.json', mergedData)
    return NextResponse.json(mergedData)
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
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

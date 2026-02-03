import { NextResponse } from 'next/server'
import { readJsonData, writeJsonData } from '@/lib/data'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const careerPathData = {
  title: "DevRel Career Path",
  level: "root",
  children: [
    {
      title: "Entry Level",
      level: "category",
      children: [
        {
          title: "Junior Developer Advocate",
          level: "Entry",
          children: [
            { title: "Developer Advocate", level: "Mid" },
            { title: "Technical Writer", level: "Mid" },
            { title: "Community Coordinator", level: "Mid" }
          ]
        },
        {
          title: "Associate Technical Writer",
          level: "Entry",
          children: [
            { title: "Technical Writer", level: "Mid" }
          ]
        },
        {
          title: "Community Coordinator",
          level: "Entry",
          children: [
            { title: "Community Manager", level: "Mid" }
          ]
        }
      ]
    },
    {
      title: "Mid Level",
      level: "category",
      children: [
        {
          title: "Developer Advocate",
          level: "Mid",
          children: [
            { title: "Senior Developer Advocate", level: "Senior" },
            { title: "DevRel Program Manager", level: "Senior" }
          ]
        },
        {
          title: "Technical Writer",
          level: "Mid",
          children: [
            { title: "Lead Technical Writer", level: "Senior" }
          ]
        },
        {
          title: "Community Manager",
          level: "Mid",
          children: [
            { title: "Senior Community Manager", level: "Senior" }
          ]
        }
      ]
    },
    {
      title: "Senior Level",
      level: "category",
      children: [
        {
          title: "Senior Developer Advocate",
          level: "Senior",
          children: [
            { title: "DevRel Manager", level: "Leadership" }
          ]
        },
        {
          title: "DevRel Program Manager",
          level: "Senior",
          children: [
            { title: "Head of DevRel", level: "Leadership" }
          ]
        }
      ]
    }
  ]
}

export async function GET() {
  try {
    return NextResponse.json(careerPathData, {
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

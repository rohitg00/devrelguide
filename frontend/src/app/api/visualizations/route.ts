import { NextResponse } from 'next/server'
import type { Resource } from '../../../types/api'

const API_URL = process.env.NEXT_PUBLIC_API_URL || ''

export async function GET() {
  try {
    const [resourcesResponse, jobsResponse] = await Promise.all([
      fetch(`${API_URL}/api/resources`, {
        headers: {
          'Authorization': `Basic ${btoa(`${process.env.NEXT_PUBLIC_API_USERNAME}:${process.env.NEXT_PUBLIC_API_PASSWORD}`)}`,
          'Accept': 'application/json',
        },
        cache: 'no-store',
      }),
      fetch(`${API_URL}/api/jobs`, {
        headers: {
          'Authorization': `Basic ${btoa(`${process.env.NEXT_PUBLIC_API_USERNAME}:${process.env.NEXT_PUBLIC_API_PASSWORD}`)}`,
          'Accept': 'application/json',
        },
        cache: 'no-store',
      })
    ])

    if (!resourcesResponse.ok || !jobsResponse.ok) {
      throw new Error('Failed to fetch visualization data')
    }

    const [resources, jobs] = await Promise.all([
      resourcesResponse.json(),
      jobsResponse.json()
    ])

    // Group resources by type
    const groupedResources = {
      github: resources.filter((r: Resource) => r.type === 'github'),
      blogs: resources.filter((r: Resource) => r.type === 'blog'),
      jobs: Array.isArray(jobs) ? jobs : []
    }

    return NextResponse.json(groupedResources)
  } catch (error) {
    console.error('Error fetching visualization data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch visualization data' },
      { status: 500 }
    )
  }
}

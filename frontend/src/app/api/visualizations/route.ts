import { NextResponse } from 'next/server'
import { readJsonData } from '@/lib/data'
import type { Resource } from '../../../types/api'

export async function GET() {
  try {
    const blogResults = await readJsonData<any[]>('blog_results.json')
    const githubRepos = await readJsonData<any[]>('github_results.json')
    const jobListings = await readJsonData<any[]>('job_results.json')

    const groupedResources = {
      github: githubRepos.map((r: any) => ({ ...r, type: 'github' })),
      blogs: blogResults.map((r: any) => ({ ...r, type: 'blog' })),
      jobs: Array.isArray(jobListings) ? jobListings : [],
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

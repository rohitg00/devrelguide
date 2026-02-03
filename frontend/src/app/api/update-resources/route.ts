import { NextResponse } from 'next/server'
import { readJsonData } from '@/lib/data'

export const dynamic = 'force-dynamic'

export async function POST() {
  try {
    const devrelResources = await readJsonData<Record<string, unknown>>('devrel_resources.json')

    const blogPosts = Array.isArray(devrelResources.blog_posts) ? devrelResources.blog_posts : []
    const githubPrograms = Array.isArray(devrelResources.github_programs) ? devrelResources.github_programs : []
    const jobListings = Array.isArray(devrelResources.job_listings) ? devrelResources.job_listings : []

    return NextResponse.json({
      status: 'success',
      message: 'Resources loaded from local data',
      counts: {
        blog_posts: blogPosts.length,
        github_programs: githubPrograms.length,
        job_listings: jobListings.length,
      },
    })
  } catch (error) {
    console.error('Error in update-resources route:', error)
    return NextResponse.json(
      { error: 'Internal server error', detail: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

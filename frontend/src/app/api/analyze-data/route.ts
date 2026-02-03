import { NextResponse } from 'next/server'
import { readJsonData } from '@/lib/data'

export const dynamic = 'force-dynamic'

export async function POST() {
  try {
    const data = await readJsonData<Record<string, any>>('devrel_resources.json')

    const blogPosts: any[] = data.blog_posts || []
    const validPosts = blogPosts.filter(
      (post: any) => post.title && post.url && post.source
    )

    const programs: any[] = data.github_programs || []
    const validPrograms = programs.filter(
      (prog: any) => prog.name && prog.url && prog.description
    )

    const jobs: any[] = data.job_listings || []
    const validJobs = jobs.filter(
      (job: any) => job.title && job.company && job.url
    )

    return NextResponse.json({
      status: 'success',
      message: 'Data analysis completed successfully',
      data: {
        last_updated: data.last_updated,
        quality_report: {
          blog_posts: {
            total: blogPosts.length,
            valid: validPosts.length,
            sample: blogPosts.slice(0, 3),
          },
          github_programs: {
            total: programs.length,
            valid: validPrograms.length,
          },
          job_listings: {
            total: jobs.length,
            valid: validJobs.length,
          },
        },
      },
    })
  } catch (error) {
    const errorMsg = `Error analyzing data: ${error instanceof Error ? error.message : String(error)}`
    return NextResponse.json({
      status: 'error',
      message: errorMsg,
      data: null,
    }, { status: 500 })
  }
}

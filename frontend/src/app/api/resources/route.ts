import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function GET() {
  try {
    // Read blog posts
    const blogPostsPath = path.join(process.cwd(), '..', 'backend', 'app', 'data', 'blog_posts.json')
    let blogPosts: any[] = []
    try {
      blogPosts = JSON.parse(await fs.readFile(blogPostsPath, 'utf-8'))
    } catch (error) {
      console.warn('Blog posts file not found')
    }

    // Read GitHub repos
    const githubReposPath = path.join(process.cwd(), '..', 'backend', 'app', 'data', 'github_repos.json')
    let githubRepos: any[] = []
    try {
      githubRepos = JSON.parse(await fs.readFile(githubReposPath, 'utf-8'))
    } catch (error) {
      console.warn('GitHub repos file not found')
    }

    // Read DevRel resources
    const devrelResourcesPath = path.join(process.cwd(), '..', 'backend', 'app', 'data', 'devrel_resources.json')
    let devrelResources: any = { github_programs: [], blog_posts: [], job_listings: [] }
    try {
      devrelResources = JSON.parse(await fs.readFile(devrelResourcesPath, 'utf-8'))
    } catch (error) {
      console.warn('DevRel resources file not found')
    }

    // Combine all resources
    const resources = [
      ...blogPosts.map((post: any) => ({
        ...post,
        type: 'blog_post'
      })),
      ...githubRepos.map((repo: any) => ({
        ...repo,
        type: 'github_program'
      })),
      ...devrelResources.github_programs.map((program: any) => ({
        ...program,
        type: 'github_program',
        title: program.name || program.title,
        description: program.description || '',
      })),
      ...devrelResources.blog_posts.map((post: any) => ({
        ...post,
        type: 'blog_post'
      })),
      ...devrelResources.job_listings.map((job: any) => ({
        ...job,
        type: 'job_listing'
      }))
    ]

    // Deduplicate resources by URL
    const seen = new Set()
    const deduplicatedResources = resources.filter((resource: any) => {
      const key = resource.url
      if (seen.has(key)) {
        return false
      }
      seen.add(key)
      return true
    })

    return NextResponse.json({ resources: deduplicatedResources })
  } catch (error) {
    console.error('Error fetching resources:', error)
    return NextResponse.json({ error: 'Failed to fetch resources' }, { status: 500 })
  }
}

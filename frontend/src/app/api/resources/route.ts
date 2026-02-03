import { NextResponse } from 'next/server'
import { readJsonData } from '@/lib/data'

export async function GET() {
  try {
    const blogResults = await readJsonData<any[]>('blog_results.json')
    const blogPosts = await readJsonData<any[]>('blog_posts.json')

    const allBlogPosts = [...blogResults]
    const newBlogUrls = new Set(blogResults.map((post: any) => post.link || post.url))
    for (const oldPost of blogPosts) {
      const oldPostUrl = oldPost.link || oldPost.url
      if (oldPostUrl && !newBlogUrls.has(oldPostUrl)) {
        if (!oldPost.resource_type) oldPost.resource_type = 'blog'
        if (!oldPost.relevance_score) oldPost.relevance_score = 1
        allBlogPosts.push(oldPost)
      }
    }

    const githubRepos = await readJsonData<any[]>('github_results.json')
    const jobListings = await readJsonData<any[]>('job_results.json')

    jobListings.sort((a: any, b: any) => {
      const dateA = a.date || a.added_at || ''
      const dateB = b.date || b.added_at || ''
      return dateB.localeCompare(dateA)
    })

    const resources = [
      ...allBlogPosts.map((post: any) => ({
        ...post,
        url: post.link || post.url,
        type: 'blog_post',
      })),
      ...githubRepos.map((repo: any) => ({
        ...repo,
        type: 'github',
      })),
      ...jobListings.map((job: any) => ({
        ...job,
        type: 'job_listing',
      })),
    ]

    const seen = new Set()
    const deduplicatedResources = resources.filter((resource: any) => {
      const key = resource.url || resource.link
      if (!key || seen.has(key)) return false
      seen.add(key)
      return true
    })

    return NextResponse.json({ resources: deduplicatedResources })
  } catch (error) {
    console.error('Error fetching resources:', error)
    return NextResponse.json({ error: 'Failed to fetch resources' }, { status: 500 })
  }
}

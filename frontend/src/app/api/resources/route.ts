import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function GET() {
  try {
    // Read new blog posts
    const blogPostsPath = path.join(process.cwd(), '..', 'backend', 'app', 'data', 'blog_results.json')
    let blogPosts: any[] = []
    try {
      blogPosts = JSON.parse(await fs.readFile(blogPostsPath, 'utf-8'))
      console.log(`Loaded ${blogPosts.length} blog posts from blog_results.json`)
    } catch (error) {
      console.warn('blog_results.json file not found', error)
    }

    // Read older blog posts from the legacy file that has more entries
    const oldBlogPostsPath = path.join(process.cwd(), '..', 'backend', 'app', 'data', 'blog_posts.json')
    let oldBlogPosts: any[] = []
    try {
      oldBlogPosts = JSON.parse(await fs.readFile(oldBlogPostsPath, 'utf-8'))
      console.log(`Loaded ${oldBlogPosts.length} blog posts from blog_posts.json`)
    } catch (error) {
      console.warn('blog_posts.json file not found', error)
    }

    // Combine new and old blog posts
    const allBlogPosts = [...blogPosts]
    
    // Only add old blog posts that don't have the same URL as a new blog post
    const newBlogUrls = new Set(blogPosts.map(post => post.link || post.url))
    for (const oldPost of oldBlogPosts) {
      const oldPostUrl = oldPost.link || oldPost.url
      if (oldPostUrl && !newBlogUrls.has(oldPostUrl)) {
        // Add any fields needed for consistency
        if (!oldPost.resource_type) oldPost.resource_type = 'blog'
        if (!oldPost.relevance_score) oldPost.relevance_score = 1 // Default relevance score
        
        allBlogPosts.push(oldPost)
      }
    }
    
    console.log(`Combined total of ${allBlogPosts.length} blog posts`)

    // Read GitHub repos
    const githubReposPath = path.join(process.cwd(), '..', 'backend', 'app', 'data', 'github_results.json')
    let githubRepos: any[] = []
    try {
      githubRepos = JSON.parse(await fs.readFile(githubReposPath, 'utf-8'))
      console.log(`Loaded ${githubRepos.length} GitHub repos`)
    } catch (error) {
      console.warn('GitHub repos file not found', error)
    }

    // Read job listings
    const jobListingsPath = path.join(process.cwd(), '..', 'backend', 'app', 'data', 'job_results.json')
    let jobListings: any[] = []
    try {
      jobListings = JSON.parse(await fs.readFile(jobListingsPath, 'utf-8'))
      console.log(`Loaded ${jobListings.length} job listings`)
    } catch (error) {
      console.warn('Job listings file not found', error)
    }

    // Combine all resources
    const resources = [
      ...allBlogPosts.map((post: any) => ({
        ...post,
        // Ensure URL is set from link field for blog posts
        url: post.link || post.url,
        type: 'blog_post'
      })),
      ...githubRepos.map((repo: any) => ({
        ...repo,
        type: 'github'
      })),
      ...jobListings.map((job: any) => ({
        ...job,
        type: 'job_listing'
      }))
    ]

    // Deduplicate resources by URL
    const seen = new Set()
    const deduplicatedResources = resources.filter((resource: any) => {
      // Use URL or link as the key for deduplication
      const key = resource.url || resource.link
      if (!key || seen.has(key)) {
        return false
      }
      seen.add(key)
      return true
    })

    console.log(`Returning ${deduplicatedResources.length} total resources`)
    console.log(`Blog posts: ${deduplicatedResources.filter(r => r.type === 'blog_post').length}`)
    console.log(`GitHub repos: ${deduplicatedResources.filter(r => r.type === 'github').length}`)
    console.log(`Job listings: ${deduplicatedResources.filter(r => r.type === 'job_listing').length}`)

    return NextResponse.json({ resources: deduplicatedResources })
  } catch (error) {
    console.error('Error fetching resources:', error)
    return NextResponse.json({ error: 'Failed to fetch resources' }, { status: 500 })
  }
}

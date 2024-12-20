import axios from 'axios'
import * as cheerio from 'cheerio'
import Parser from 'rss-parser'
import fs from 'fs/promises'
import path from 'path'

const parser = new Parser()

interface Resource {
  title: string
  url: string
  description?: string
  author?: string
  published_date?: string
  type: string
  source?: string
  added_at: string
}

interface DevRelResources {
  github_programs: any[]
  blog_posts: any[]
  job_listings: any[]
}

function cleanHtml(html: string): string {
  // Remove HTML tags while preserving text content
  const $ = cheerio.load(html)
  
  // Replace common elements with appropriate text
  $('h1, h2, h3, h4, h5, h6').each((_, elem) => {
    const $elem = $(elem)
    $elem.replaceWith(`${$elem.text()}\n`)
  })
  
  $('p, div, span').each((_, elem) => {
    const $elem = $(elem)
    $elem.replaceWith(`${$elem.text()} `)
  })
  
  $('br').replaceWith('\n')
  $('li').each((_, elem) => {
    const $elem = $(elem)
    $elem.replaceWith(`• ${$elem.text()}\n`)
  })
  
  // Get text content and clean up whitespace
  let text = $.text()
    .replace(/\s+/g, ' ')
    .replace(/\n\s*\n/g, '\n')
    .trim()
  
  // Decode HTML entities
  text = text.replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
  
  return text
}

const DEVREL_SOURCES = {
  blogs: [
    'https://www.developerrelations.com/feed/',
    'https://devrel.net/feed',
    'https://medium.com/feed/tag/developer-relations',
    'https://www.marythengvall.com/blog?format=rss',
    'https://developerrelations.com/feed',
  ],
  githubTopics: [
    'developer-relations',
    'devrel',
    'developer-advocacy',
    'developer-experience',
    'developer-community',
  ]
}

async function scrapeGitHubRepos(topic: string): Promise<Resource[]> {
  try {
    const url = `https://github.com/topics/${topic}`
    const response = await axios.get(url)
    const $ = cheerio.load(response.data)
    const repos: Resource[] = []

    $('article.border').each((_, element) => {
      const titleElement = $(element).find('h3 a')
      const descriptionElement = $(element).find('div.px-3 > p')
      
      const repoPath = titleElement.last().attr('href')
      if (repoPath) {
        const title = cleanHtml(titleElement.text().trim())
        repos.push({
          title,
          url: `https://github.com${repoPath}`,
          description: descriptionElement.text() ? cleanHtml(descriptionElement.text().trim()) : undefined,
          type: 'github_program',
          source: 'github.com',
          added_at: new Date().toISOString()
        })
      }
    })

    return repos
  } catch (error) {
    console.error(`Error scraping GitHub repos for topic ${topic}:`, error)
    return []
  }
}

async function scrapeRSSFeed(url: string): Promise<Resource[]> {
  try {
    const feed = await parser.parseURL(url)
    return feed.items.map(item => ({
      title: cleanHtml(item.title || 'Untitled'),
      url: item.link || '',
      description: item.contentSnippet || item.content ? cleanHtml(item.contentSnippet || item.content || '') : undefined,
      author: item.creator || item.author,
      published_date: item.pubDate,
      type: 'blog_post',
      source: new URL(url).hostname,
      added_at: new Date().toISOString()
    }))
  } catch (error) {
    console.error(`Error scraping RSS feed ${url}:`, error)
    return []
  }
}

async function readExistingResources(): Promise<DevRelResources> {
  const devrelResourcesPath = path.join(process.cwd(), 'app', 'data', 'devrel_resources.json')
  try {
    const content = await fs.readFile(devrelResourcesPath, 'utf-8')
    const resources = JSON.parse(content)
    
    // Clean HTML in existing resources
    if (resources.github_programs) {
      resources.github_programs = resources.github_programs.map((program: any) => ({
        ...program,
        title: program.title ? cleanHtml(program.title) : program.title,
        description: program.description ? cleanHtml(program.description) : program.description
      }))
    }
    
    if (resources.blog_posts) {
      resources.blog_posts = resources.blog_posts.map((post: any) => ({
        ...post,
        title: post.title ? cleanHtml(post.title) : post.title,
        description: post.description ? cleanHtml(post.description) : post.description
      }))
    }
    
    if (resources.job_listings) {
      resources.job_listings = resources.job_listings.map((job: any) => ({
        ...job,
        title: job.title ? cleanHtml(job.title) : job.title,
        description: job.description ? cleanHtml(job.description) : job.description
      }))
    }
    
    return resources
  } catch (error) {
    return {
      github_programs: [],
      blog_posts: [],
      job_listings: []
    }
  }
}

async function saveResources(resources: Resource[], type: 'blog_posts' | 'github_repos') {
  const filename = type === 'blog_posts' ? 'blog_posts.json' : 'github_repos.json'
  const filepath = path.join(process.cwd(), 'app', 'data', filename)
  
  // Read existing resources
  let existing: Resource[] = []
  try {
    const content = await fs.readFile(filepath, 'utf-8')
    existing = JSON.parse(content)
  } catch (error) {
    // File doesn't exist or is invalid, start fresh
  }

  // Read devrel_resources.json
  const devrelResources = await readExistingResources()
  const additionalResources = type === 'blog_posts' ? 
    devrelResources.blog_posts : 
    devrelResources.github_programs

  // Combine all resources
  const allResources = [...existing, ...resources, ...additionalResources]

  // Deduplicate by URL
  const seen = new Map<string, Resource>()
  allResources.forEach(resource => {
    const key = resource.url
    if (!seen.has(key) || new Date(resource.added_at) > new Date(seen.get(key)!.added_at)) {
      seen.set(key, resource)
    }
  })

  // Save combined resources
  const combined = Array.from(seen.values())
  await fs.writeFile(filepath, JSON.stringify(combined, null, 2))
  
  return {
    total: combined.length,
    new: combined.length - existing.length
  }
}

export async function updateDevRelResources() {
  try {
    // Scrape blog posts
    const blogPromises = DEVREL_SOURCES.blogs.map(url => scrapeRSSFeed(url))
    const blogResults = await Promise.all(blogPromises)
    const blogPosts = blogResults.flat()
    
    // Scrape GitHub repos
    const repoPromises = DEVREL_SOURCES.githubTopics.map(topic => scrapeGitHubRepos(topic))
    const repoResults = await Promise.all(repoPromises)
    const githubRepos = repoResults.flat()
    
    // Save resources
    const blogStats = await saveResources(blogPosts, 'blog_posts')
    const repoStats = await saveResources(githubRepos, 'github_repos')
    
    return {
      status: 'success',
      counts: {
        blogs: blogStats,
        repos: repoStats
      }
    }
  } catch (error) {
    console.error('Error updating DevRel resources:', error)
    throw error
  }
}

import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

function extractLinks(content: string): [string, string][] {
  const regex = /\[([^\]]+)\]\(([^)]+)\)|(?<![\(\[])(https?:\/\/[^\s\)]+)/g
  const links: [string, string][] = []
  let match

  while ((match = regex.exec(content)) !== null) {
    if (match[1] && match[2] && match[2].startsWith('http')) {
      links.push([match[1], match[2]])
    } else if (match[3] && match[3].startsWith('http')) {
      links.push(['', match[3]])
    }
  }

  const seen = new Set<string>()
  return links.filter(([, url]) => {
    if (seen.has(url)) return false
    seen.add(url)
    return true
  })
}

async function checkLink(url: string): Promise<boolean> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)

    const response = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    })

    clearTimeout(timeout)

    if (response.status === 405) {
      const getResponse = await fetch(url, {
        method: 'GET',
        redirect: 'follow',
        signal: AbortSignal.timeout(10000),
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      })
      return getResponse.status < 400
    }

    return response.status < 400
  } catch {
    return false
  }
}

export async function POST() {
  try {
    const readmePath = path.join(process.cwd(), '..', 'README.md')
    let content: string
    try {
      content = await fs.readFile(readmePath, 'utf-8')
    } catch {
      content = await fs.readFile(path.join(process.cwd(), 'README.md'), 'utf-8')
    }

    const links = extractLinks(content)
    const results: { title: string; url: string; status: boolean }[] = []
    const brokenLinks: [string, string][] = []

    for (const [title, url] of links) {
      const status = await checkLink(url)
      results.push({ title, url, status })
      if (!status) brokenLinks.push([title, url])
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    return NextResponse.json({
      status: 'success',
      message: `Link verification completed. Found ${brokenLinks.length} broken links out of ${links.length} total links.`,
      data: {
        total_links: links.length,
        broken_links: brokenLinks.length,
        results,
      },
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: `Error verifying links: ${error instanceof Error ? error.message : String(error)}`,
      data: null,
    }, { status: 500 })
  }
}

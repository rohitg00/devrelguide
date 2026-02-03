import { NextResponse } from 'next/server'
import { marked } from 'marked'
import fs from 'fs/promises'
import path from 'path'

export const dynamic = 'force-dynamic'

export async function POST() {
  try {
    const markdownPath = path.join(process.cwd(), 'public', 'content', 'devrel-whitepaper.md')
    let markdown = await fs.readFile(markdownPath, 'utf-8')

    markdown = markdown.replace(/^---[\s\S]*?---\n/, '')

    const html = await marked(markdown, { gfm: true, breaks: true })

    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Developer Relations (DevRel): Bridging the Gap Between Developers and Business</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; line-height: 1.8; max-width: 860px; margin: 0 auto; padding: 40px 24px; background: #0f172a; color: #e2e8f0; }
h1 { font-size: 2.25em; font-weight: 700; color: #38bdf8; margin-bottom: 0.5em; line-height: 1.3; }
h2 { font-size: 1.6em; font-weight: 600; color: #7dd3fc; margin-top: 2em; margin-bottom: 0.75em; padding-bottom: 0.3em; border-bottom: 1px solid #1e3a5f; }
h3 { font-size: 1.25em; font-weight: 600; color: #bae6fd; margin-top: 1.5em; margin-bottom: 0.5em; }
p { margin-bottom: 1em; color: #cbd5e1; }
a { color: #38bdf8; text-decoration: none; }
a:hover { text-decoration: underline; }
ul, ol { margin-bottom: 1em; padding-left: 1.5em; color: #cbd5e1; }
li { margin-bottom: 0.4em; }
img { max-width: 100%; height: auto; border-radius: 8px; margin: 1.5em 0; }
blockquote { border-left: 3px solid #38bdf8; padding-left: 1em; margin: 1em 0; color: #94a3b8; }
details { margin: 1em 0; background: #1e293b; border-radius: 8px; padding: 1em; }
summary { cursor: pointer; font-weight: 600; color: #7dd3fc; }
@media print { body { background: #fff; color: #1e293b; } h1 { color: #0369a1; } h2 { color: #0284c7; border-color: #e2e8f0; } h3 { color: #0369a1; } p, ul, ol, li { color: #334155; } a { color: #0284c7; } }
</style>
</head>
<body>${html}</body>
</html>`

    const outputPath = path.join(process.cwd(), 'public', 'generated')
    await fs.mkdir(outputPath, { recursive: true })
    await fs.writeFile(path.join(outputPath, 'DevRel-Whitepaper-2024.html'), fullHtml)

    return NextResponse.json({ success: true, format: 'html' })
  } catch (error) {
    console.error('Error generating document:', error)
    return NextResponse.json({ error: 'Failed to generate document' }, { status: 500 })
  }
}

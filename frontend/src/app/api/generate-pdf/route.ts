import { NextResponse } from 'next/server'
import { marked } from 'marked'
import fs from 'fs/promises'
import path from 'path'

export const dynamic = 'force-dynamic'

export async function POST() {
  try {
    const markdownPath = path.join(process.cwd(), 'public', 'content', 'devrel-whitepaper.md')
    const markdown = await fs.readFile(markdownPath, 'utf-8')

    const html = await marked(markdown, { gfm: true, breaks: true })

    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>DevRel Whitepaper</title>
<style>
body { font-family: 'Roboto Mono', monospace; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; background: #003366; color: #fff; }
h1 { font-size: 2em; color: #FF3333; }
h2 { font-size: 1.5em; color: #00FFFF; margin-top: 1.5em; }
h3 { font-size: 1.25em; color: #00FFFF; }
a { color: #00FFFF; }
pre { background: rgba(255,255,255,0.05); padding: 1em; border: 1px solid rgba(255,255,255,0.15); overflow-x: auto; }
code { font-family: 'Roboto Mono', monospace; font-size: 0.9em; }
blockquote { border-left: 3px solid #FF3333; padding-left: 1em; color: rgba(255,255,255,0.7); }
table { width: 100%; border-collapse: collapse; }
th, td { border: 1px solid rgba(255,255,255,0.2); padding: 0.5em; }
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

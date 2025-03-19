import { NextResponse } from 'next/server'
import { mdToPdf } from 'md-to-pdf'
import fs from 'fs/promises'
import path from 'path'

export async function POST() {
  try {
    // Read the markdown file
    const markdownPath = path.join(process.cwd(), 'public', 'content', 'devrel-whitepaper.md')
    const markdown = await fs.readFile(markdownPath, 'utf-8')

    // Create styles file
    const stylesPath = path.join(process.cwd(), 'public', 'generated', 'styles.css')
    const styles = `
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        line-height: 1.6;
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
      }
      h1 { font-size: 2.5em; color: #2563eb; margin-bottom: 1em; }
      h2 { font-size: 2em; color: #1e40af; margin-top: 1.5em; }
      h3 { font-size: 1.5em; color: #1e40af; }
      p { margin-bottom: 1em; }
      ul { margin-bottom: 1em; padding-left: 2em; }
      li { margin-bottom: 0.5em; }
      pre {
        background: #f8fafc;
        padding: 1em;
        border-radius: 5px;
        overflow-x: auto;
        margin: 1em 0;
        border: 1px solid #e2e8f0;
      }
      code {
        font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
        font-size: 0.9em;
        background: #f8fafc;
        padding: 0.2em 0.4em;
        border-radius: 3px;
        border: 1px solid #e2e8f0;
      }
      blockquote {
        border-left: 4px solid #2563eb;
        padding-left: 1em;
        margin: 1em 0;
        color: #475569;
      }
      img {
        max-width: 100%;
        height: auto;
        margin: 1em 0;
        border-radius: 5px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }
      a {
        color: #2563eb;
        text-decoration: none;
      }
      a:hover {
        text-decoration: underline;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin: 1em 0;
      }
      th, td {
        border: 1px solid #e2e8f0;
        padding: 0.5em;
        text-align: left;
      }
      th {
        background: #f8fafc;
      }
    `
    await fs.writeFile(stylesPath, styles)

    // Convert markdown to PDF
    const pdf = await mdToPdf(
      { content: markdown },
      {
        dest: path.join(process.cwd(), 'public', 'generated', 'DevRel-Whitepaper-2024.pdf'),
        stylesheet: [stylesPath],
        css: `pre, code { background: #f8fafc !important; }`,
        pdf_options: {
          format: 'A4',
          margin: {
            top: '30mm',
            right: '20mm',
            bottom: '30mm',
            left: '20mm',
          },
          printBackground: true,
        },
        marked_options: {
          gfm: true,
          breaks: true,
          highlight: null
        }
      }
    )

    // Clean up the styles file
    await fs.unlink(stylesPath)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error generating PDF:', error)
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 })
  }
}

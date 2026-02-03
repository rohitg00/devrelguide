import { NextResponse } from 'next/server'
import { spawn } from 'child_process'
import path from 'path'

export async function POST() {
  try {
    const scriptPath = path.join(process.cwd(), 'scripts', 'scraper', 'devrel_scraper.py')

    return new Promise((resolve) => {
      const pythonProcess = spawn('python3', [scriptPath])

      pythonProcess.stdout.on('data', (data) => {
        console.log(`Scraper output: ${data}`)
      })

      pythonProcess.stderr.on('data', (data) => {
        console.error(`Scraper error: ${data}`)
      })

      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          resolve(NextResponse.json(
            { error: 'Failed to refresh resources' },
            { status: 500 }
          ))
        } else {
          resolve(NextResponse.json(
            { message: 'Resources refreshed successfully' },
            { status: 200 }
          ))
        }
      })
    })
  } catch (error) {
    console.error('Error refreshing resources:', error)
    return NextResponse.json(
      { error: 'Failed to refresh resources' },
      { status: 500 }
    )
  }
}

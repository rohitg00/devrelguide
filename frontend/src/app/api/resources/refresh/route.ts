import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json(
    {
      error: 'Resource scraping is not available via the API.',
      message: 'The scraper needs to be run manually via the Python script. Run: python3 scripts/scraper/devrel_scraper.py',
    },
    { status: 501 }
  )
}

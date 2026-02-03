import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const contentImpactData = [
  {
    type: "Blog Posts",
    views: 24000,
    reactions: 3200,
    shares: 1800,
    conversions: 920,
    engagement: 7900
  },
  {
    type: "Tutorials",
    views: 18500,
    reactions: 4100,
    shares: 2300,
    conversions: 1520,
    engagement: 6200
  },
  {
    type: "Documentation",
    views: 35000,
    reactions: 2100,
    shares: 1200,
    conversions: 2800,
    engagement: 5600
  },
  {
    type: "Videos",
    views: 12000,
    reactions: 3600,
    shares: 2900,
    conversions: 870,
    engagement: 4700
  },
  {
    type: "Social Media",
    views: 38000,
    reactions: 7200,
    shares: 5600,
    conversions: 1300,
    engagement: 9400
  },
  {
    type: "Webinars",
    views: 8500,
    reactions: 2400,
    shares: 1700,
    conversions: 940,
    engagement: 3800
  },
  {
    type: "Podcasts",
    views: 9600,
    reactions: 1900,
    shares: 2200,
    conversions: 680,
    engagement: 3100
  }
]

export async function GET() {
  try {
    return NextResponse.json(contentImpactData)
  } catch (error) {
    console.error('Error serving content impact data:', error)
    return NextResponse.json({ error: 'Failed to serve content impact data' }, { status: 500 })
  }
}

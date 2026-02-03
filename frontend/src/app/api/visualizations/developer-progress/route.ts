import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const data = {
    nodes: [
      { name: 'New Developer', category: 'discovery' },
      { name: 'Resource Explorer', category: 'discovery' },
      { name: 'Documentation Reader', category: 'learning' },
      { name: 'API Practitioner', category: 'learning' },
      { name: 'Community Member', category: 'engagement' },
      { name: 'Forum Participant', category: 'engagement' },
      { name: 'Content Creator', category: 'contribution' },
      { name: 'Code Contributor', category: 'contribution' },
      { name: 'Community Leader', category: 'leadership' },
      { name: 'DevRel Advocate', category: 'leadership' }
    ],
    links: [
      { source: 0, target: 1, value: 100, category: 'discovery' },
      { source: 1, target: 2, value: 85, category: 'learning' },
      { source: 1, target: 3, value: 65, category: 'learning' },
      { source: 2, target: 4, value: 60, category: 'engagement' },
      { source: 3, target: 5, value: 45, category: 'engagement' },
      { source: 4, target: 6, value: 40, category: 'contribution' },
      { source: 5, target: 7, value: 35, category: 'contribution' },
      { source: 6, target: 8, value: 25, category: 'leadership' },
      { source: 7, target: 8, value: 20, category: 'leadership' },
      { source: 8, target: 9, value: 30, category: 'leadership' }
    ]
  }
  return NextResponse.json(data)
}

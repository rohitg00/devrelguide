interface Node {
  id: number
  name: string
  category: string
  size: number
}

interface Link {
  source: number
  target: number
  value: number
}

const communities: Record<string, string[]> = {
  'DevRel Team': ['Developer Advocates', 'Community Managers', 'Technical Writers'],
  'Developer Community': ['Open Source Contributors', 'Enterprise Developers', 'Startup Developers'],
  Content: ['Documentation', 'Tutorials', 'Blog Posts', 'Video Content'],
  Events: ['Conferences', 'Meetups', 'Workshops', 'Hackathons'],
  Platforms: ['GitHub', 'Stack Overflow', 'Discord', 'Twitter'],
}

const crossConnections: [string, string, number][] = [
  ['GitHub', 'Documentation', 0.5],
  ['Stack Overflow', 'Documentation', 0.5],
  ['Twitter', 'Blog Posts', 0.5],
  ['Discord', 'Tutorials', 0.5],
  ['Conferences', 'Developer Advocates', 0.5],
  ['Meetups', 'Community Managers', 0.5],
  ['Workshops', 'Technical Writers', 0.5],
  ['Hackathons', 'Open Source Contributors', 0.5],
]

export function generateCommunityGraph(): { nodes: Node[]; links: Link[] } {
  const nodes: Node[] = []
  const links: Link[] = []
  const nodeMap: Record<string, number> = {}
  let id = 0

  for (const [hub, members] of Object.entries(communities)) {
    nodeMap[hub] = id
    nodes.push({ id, name: hub, category: 'hub', size: 30 })
    id++

    for (const member of members) {
      nodeMap[member] = id
      nodes.push({ id, name: member, category: 'member', size: 20 })
      links.push({ source: nodeMap[hub], target: id, value: 1 })
      id++
    }
  }

  for (const [source, target, weight] of crossConnections) {
    if (source in nodeMap && target in nodeMap) {
      links.push({ source: nodeMap[source], target: nodeMap[target], value: weight })
    }
  }

  return { nodes, links }
}

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

const metrics: Record<string, string[]> = {
  Reach: ['Blog Views', 'Social Media Reach', 'Event Attendance'],
  Engagement: ['GitHub Stars', 'Forum Posts', 'Workshop Participation'],
  Impact: ['Developer Satisfaction', 'Product Adoption', 'Community Growth'],
  Growth: ['New Contributors', 'Documentation Updates', 'API Usage'],
}

const crossRelationships: [string, string, number][] = [
  ['Blog Views', 'GitHub Stars', 0.5],
  ['Social Media Reach', 'Forum Posts', 0.5],
  ['Event Attendance', 'Workshop Participation', 0.7],
  ['GitHub Stars', 'Developer Satisfaction', 0.6],
  ['Forum Posts', 'Community Growth', 0.5],
  ['Workshop Participation', 'Product Adoption', 0.7],
  ['Developer Satisfaction', 'New Contributors', 0.6],
  ['Community Growth', 'Documentation Updates', 0.5],
  ['Product Adoption', 'API Usage', 0.7],
]

export function generateMetricsFlow(): { nodes: Node[]; links: Link[] } {
  const nodes: Node[] = []
  const links: Link[] = []
  const nodeMap: Record<string, number> = {}
  let id = 0

  for (const [category, metricList] of Object.entries(metrics)) {
    nodeMap[category] = id
    nodes.push({ id, name: category, category: 'category', size: 30 })
    id++

    for (const metric of metricList) {
      nodeMap[metric] = id
      nodes.push({ id, name: metric, category: 'metric', size: 20 })
      links.push({ source: nodeMap[category], target: id, value: 1 })
      id++
    }
  }

  for (const [source, target, weight] of crossRelationships) {
    links.push({ source: nodeMap[source], target: nodeMap[target], value: weight })
  }

  return { nodes, links }
}

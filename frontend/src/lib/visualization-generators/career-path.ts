interface CareerLevel {
  roles: string[]
  skills: string[]
  next: string[]
}

const careerPaths: Record<string, CareerLevel> = {
  'Entry Level': {
    roles: ['Technical Writer', 'Developer Support', 'Community Moderator'],
    skills: ['Technical Writing', 'Basic Programming', 'Communication'],
    next: ['Mid Level'],
  },
  'Mid Level': {
    roles: ['Developer Advocate', 'Technical Community Manager', 'Content Developer'],
    skills: ['Public Speaking', 'Content Creation', 'Technical Demos'],
    next: ['Senior Level'],
  },
  'Senior Level': {
    roles: ['Senior Developer Advocate', 'DevRel Program Manager', 'Developer Marketing Manager'],
    skills: ['Strategy Development', 'Team Leadership', 'Program Management'],
    next: ['Leadership'],
  },
  Leadership: {
    roles: ['Head of Developer Relations', 'Director of Developer Experience', 'VP of Developer Ecosystem'],
    skills: ['Executive Communication', 'Strategy', 'Business Development'],
    next: [],
  },
}

export function generateCareerPath() {
  const nodes: { id: number; label: string; category: string; level: number; skills: string[] }[] = []
  const links: { source: number; target: number; value: number }[] = []
  const nodeMap: Record<string, number> = {}
  const levels = Object.keys(careerPaths)
  let nodeId = 0

  for (const level of levels) {
    const details = careerPaths[level]
    const levelNodeId = nodeId
    const levelIndex = levels.indexOf(level)

    nodes.push({
      id: nodeId,
      label: level,
      category: 'level',
      level: levelIndex,
      skills: details.skills,
    })
    nodeMap[level] = levelNodeId
    nodeId++

    for (const role of details.roles) {
      nodes.push({
        id: nodeId,
        label: role,
        category: 'role',
        level: levelIndex,
        skills: details.skills,
      })
      links.push({ source: levelNodeId, target: nodeId, value: 1 })
      nodeId++
    }

    for (const nextLevel of details.next) {
      if (nextLevel in nodeMap) {
        links.push({ source: levelNodeId, target: nodeMap[nextLevel], value: 2 })
      }
    }
  }

  return { nodes, links }
}

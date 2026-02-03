const RESOURCE_CATEGORIES = ['Documentation', 'Tutorials', 'Blog Posts', 'Videos', 'Workshops']
const ENGAGEMENT_TYPES = ['Views', 'Comments', 'Shares', 'Likes']

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomUniform(min: number, max: number): number {
  return min + Math.random() * (max - min)
}

function randomInt(min: number, max: number): number {
  return Math.floor(min + Math.random() * (max - min))
}

export function generateCommunityInsights() {
  const data = Array.from({ length: 20 }, () => {
    const daysAgo = randomInt(0, 30)
    const date = new Date()
    date.setDate(date.getDate() - daysAgo)

    return {
      category: randomChoice(RESOURCE_CATEGORIES),
      engagement_type: randomChoice(ENGAGEMENT_TYPES),
      effectiveness_score: randomUniform(25, 70),
      reach: randomInt(100, 1000),
      timestamp: date.toISOString(),
    }
  })

  return {
    scatter_data: data,
    categories: RESOURCE_CATEGORIES,
    engagement_types: ENGAGEMENT_TYPES,
    summary: {
      total_resources: data.length,
      avg_effectiveness: data.reduce((sum, d) => sum + d.effectiveness_score, 0) / data.length,
      total_reach: data.reduce((sum, d) => sum + d.reach, 0),
      time_range: {
        start: data.reduce((min, d) => (d.timestamp < min ? d.timestamp : min), data[0].timestamp),
        end: data.reduce((max, d) => (d.timestamp > max ? d.timestamp : max), data[0].timestamp),
      },
    },
  }
}

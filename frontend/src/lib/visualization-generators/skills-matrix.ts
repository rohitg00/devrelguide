const roles = [
  'Junior Developer Advocate',
  'Senior Developer Advocate',
  'Technical Community Manager',
  'DevRel Program Manager',
  'Head of Developer Relations',
]

const skillCategories: Record<string, string[]> = {
  Technical: ['Programming', 'API Design', 'Documentation', 'Technical Writing', 'System Architecture'],
  Communication: ['Public Speaking', 'Technical Presentations', 'Blog Writing', 'Social Media', 'Workshop Facilitation'],
  Community: ['Community Building', 'Event Management', 'Developer Support', 'Program Development', 'Metrics & Analytics'],
  Leadership: ['Strategy Development', 'Team Management', 'Budget Planning', 'Stakeholder Management', 'Cross-team Collaboration'],
}

const baseLevels: Record<string, number> = {
  'Junior Developer Advocate': 40,
  'Senior Developer Advocate': 70,
  'Technical Community Manager': 60,
  'DevRel Program Manager': 75,
  'Head of Developer Relations': 85,
}

export function generateSkillsMatrix() {
  const data: { role: string; category: string; skill: string; value: number }[] = []

  for (const role of roles) {
    const base = baseLevels[role]
    for (const [category, skills] of Object.entries(skillCategories)) {
      for (const skill of skills) {
        const variation = Math.floor(Math.random() * 21) - 10
        const value = Math.min(100, Math.max(0, base + variation))
        data.push({ role, category, skill, value })
      }
    }
  }

  const categories = Object.keys(skillCategories)
  const allSkills = Object.values(skillCategories).flat()

  return {
    data,
    roles,
    categories,
    skills: allSkills,
    maxValue: 100,
    minValue: 0,
  }
}

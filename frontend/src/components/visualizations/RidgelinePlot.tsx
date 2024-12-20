'use client'

import React, { useMemo } from 'react'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts'
import { Card } from '../ui/card'

interface SkillMetric {
  date: string
  value: number
  category: string
  proficiency: number
}

interface RidgelineData {
  category: string
  description: string
  data: SkillMetric[]
}

const generateRidgelineData = (): RidgelineData[] => {
  const categories = [
    { name: 'API Development', description: 'RESTful and GraphQL API design' },
    { name: 'Documentation', description: 'Technical writing and docs' },
    { name: 'Community', description: 'Community engagement' },
    { name: 'Content', description: 'Tutorials and guides' },
    { name: 'Support', description: 'Developer assistance' }
  ]
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']

  return categories.map(({ name, description }) => ({
    category: name,
    description,
    data: months.map((month, index) => ({
      date: month,
      value: Math.sin(index / 2) * 15 + Math.random() * 10 + 50,
      category: name,
      proficiency: Math.random() * 20 + 70
    }))
  }))
}

const COLORS = {
  'API Development': '#8B5CF6',
  'Documentation': '#10B981',
  'Community': '#F59E0B',
  'Content': '#EC4899',
  'Support': '#3B82F6'
} as const

export function RidgelinePlot() {
  const data = useMemo(() => generateRidgelineData(), [])
  const [hoveredCategory, setHoveredCategory] = React.useState<string | null>(null)

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-2">Developer Skill Distribution</h3>
      <p className="text-sm text-gray-600 mb-4">
        Distribution of developer skills across different areas over time
      </p>
      <div className="space-y-[-30px]">
        {data.map((categoryData) => (
          <div
            key={categoryData.category}
            className="h-[100px] relative group"
            onMouseEnter={() => setHoveredCategory(categoryData.category)}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={categoryData.data}
                margin={{ top: 10, right: 20, left: 20, bottom: 0 }}
              >
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10 }}
                  stroke="#9CA3AF"
                  tickLine={false}
                />
                <YAxis hide domain={[0, 100]} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={COLORS[categoryData.category as keyof typeof COLORS]}
                  fill={COLORS[categoryData.category as keyof typeof COLORS]}
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload as SkillMetric
                      return (
                        <div className="bg-white p-2 rounded shadow-lg border text-xs">
                          <div className="font-semibold mb-1">{categoryData.category}</div>
                          <div>Date: {data.date}</div>
                          <div>Proficiency: {Math.round(data.proficiency)}%</div>
                        </div>
                      )
                    }
                    return null
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
            {hoveredCategory === categoryData.category && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded shadow-lg border text-xs">
                <div className="font-semibold">{categoryData.category}</div>
                <p className="text-gray-600">{categoryData.description}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-4 mt-6 justify-center">
        {Object.entries(COLORS).map(([category, color]) => (
          <div key={category} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: color }} />
            <span className="text-xs text-gray-700">{category}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}

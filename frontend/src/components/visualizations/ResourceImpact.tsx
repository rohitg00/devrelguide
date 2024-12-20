'use client'

import React from 'react'
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'

interface ResourceData {
  name: string
  engagement: number
  effectiveness: number
  type: string
}

const resourceData: ResourceData[] = [
  // Documentation Resources
  { name: 'API Documentation', engagement: 85, effectiveness: 65, type: 'documentation' },
  { name: 'Getting Started Guide', engagement: 90, effectiveness: 70, type: 'documentation' },
  { name: 'Code Examples', engagement: 75, effectiveness: 68, type: 'documentation' },
  
  // Tutorial Resources
  { name: 'Video Tutorials', engagement: 70, effectiveness: 60, type: 'tutorial' },
  { name: 'Interactive Workshops', engagement: 65, effectiveness: 55, type: 'tutorial' },
  { name: 'Code Labs', engagement: 60, effectiveness: 50, type: 'tutorial' },
  
  // Community Resources
  { name: 'Developer Forum', engagement: 80, effectiveness: 45, type: 'community' },
  { name: 'Discord Channel', engagement: 85, effectiveness: 40, type: 'community' },
  { name: 'GitHub Discussions', engagement: 75, effectiveness: 35, type: 'community' },
  
  // Content Resources
  { name: 'Blog Posts', engagement: 55, effectiveness: 30, type: 'content' },
  { name: 'Case Studies', engagement: 50, effectiveness: 35, type: 'content' },
  { name: 'Technical Articles', engagement: 45, effectiveness: 30, type: 'content' }
]

const ResourceImpact: React.FC = () => {
  return (
    <div className="w-full h-[600px] bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Resource Impact Analysis</h3>
      <p className="text-sm text-gray-600 mb-6">
        Analyze the relationship between resource engagement and effectiveness
      </p>
      <ResponsiveContainer width="100%" height="80%">
        <ScatterChart
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            dataKey="engagement"
            name="Engagement"
            unit="%"
            domain={[0, 100]}
            label={{ value: 'Engagement Score (%)', position: 'bottom', offset: 0 }}
          />
          <YAxis
            type="number"
            dataKey="effectiveness"
            name="Effectiveness"
            unit="%"
            domain={[0, 100]}
            label={{ value: 'Effectiveness Score (%)', angle: -90, position: 'left', offset: 0 }}
          />
          <Tooltip
            cursor={{ strokeDasharray: '3 3' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload as ResourceData
                return (
                  <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                    <p className="font-medium">{data.name}</p>
                    <p className="text-sm text-gray-600">Type: {data.type}</p>
                    <p className="text-sm">Engagement: {data.engagement}%</p>
                    <p className="text-sm">Effectiveness: {data.effectiveness}%</p>
                  </div>
                )
              }
              return null
            }}
          />
          <Legend />
          <Scatter
            name="Documentation"
            data={resourceData.filter(d => d.type === 'documentation')}
            fill="#3B82F6"
          />
          <Scatter
            name="Tutorials"
            data={resourceData.filter(d => d.type === 'tutorial')}
            fill="#10B981"
          />
          <Scatter
            name="Community"
            data={resourceData.filter(d => d.type === 'community')}
            fill="#F59E0B"
          />
          <Scatter
            name="Content"
            data={resourceData.filter(d => d.type === 'content')}
            fill="#8B5CF6"
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}

export default ResourceImpact

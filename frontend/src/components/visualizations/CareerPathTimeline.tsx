'use client'

import React from 'react'
import { Card } from '../ui/card'
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts'

interface CareerMilestone {
  stage: string
  technical: number
  community: number
  content: number
  leadership: number
  impact: number
}

const careerData: CareerMilestone[] = [
  {
    stage: 'Entry',
    technical: 40,
    community: 30,
    content: 50,
    leadership: 20,
    impact: 25
  },
  {
    stage: 'Mid-Level',
    technical: 65,
    community: 60,
    content: 70,
    leadership: 45,
    impact: 55
  },
  {
    stage: 'Senior',
    technical: 85,
    community: 80,
    content: 85,
    leadership: 70,
    impact: 80
  },
  {
    stage: 'Lead',
    technical: 90,
    community: 90,
    content: 90,
    leadership: 85,
    impact: 90
  },
  {
    stage: 'Director',
    technical: 85,
    community: 95,
    content: 90,
    leadership: 95,
    impact: 95
  }
]

const COLORS = {
  technical: '#2196F3',
  community: '#4CAF50',
  content: '#FFC107',
  leadership: '#9C27B0',
  impact: '#FF5722'
}

export function CareerPathTimeline() {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">DevRel Career Evolution</h3>
      <div className="w-full h-screen md:h-[32rem] lg:h-[40rem]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={careerData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="stage" />
            <YAxis domain={[0, 100]} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white p-2 border rounded shadow">
                      <p className="font-semibold">{label} Level</p>
                      {payload.map((entry: any) => (
                        <p
                          key={entry.name}
                          style={{ color: COLORS[entry.name as keyof typeof COLORS] }}
                        >
                          {entry.name}: {entry.value}
                        </p>
                      ))}
                    </div>
                  )
                }
                return null
              }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="technical"
              stackId="1"
              stroke={COLORS.technical}
              fill={COLORS.technical}
              fillOpacity={0.3}
            />
            <Area
              type="monotone"
              dataKey="community"
              stackId="1"
              stroke={COLORS.community}
              fill={COLORS.community}
              fillOpacity={0.3}
            />
            <Area
              type="monotone"
              dataKey="content"
              stackId="1"
              stroke={COLORS.content}
              fill={COLORS.content}
              fillOpacity={0.3}
            />
            <Line
              type="monotone"
              dataKey="leadership"
              stroke={COLORS.leadership}
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="impact"
              stroke={COLORS.impact}
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 text-sm text-gray-600 overflow-hidden">
        <p className="mb-2 line-clamp-2">This visualization shows the evolution of key DevRel competencies across career stages:</p>
        <ul className="list-disc ml-6 mt-2 space-y-1">
          <li className="line-clamp-1">Stacked areas show foundational skills (Technical, Community, Content)</li>
          <li className="line-clamp-1">Lines represent leadership and impact growth</li>
          <li className="line-clamp-1">Each stage shows relative importance of different competencies</li>
          <li className="line-clamp-1">Progression indicates skill development patterns</li>
        </ul>
      </div>
    </Card>
  )
}

export default CareerPathTimeline;

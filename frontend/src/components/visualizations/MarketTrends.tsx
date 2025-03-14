'use client'

import React from 'react'
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Label,
  Cell
} from 'recharts'

interface TrendData {
  category: string
  trend: number
  impact: number
  description: string
}

const marketTrends: TrendData[] = [
  {
    category: 'API-First Development',
    trend: 85,
    impact: 90,
    description: 'Growing focus on API design and documentation'
  },
  {
    category: 'Developer Experience',
    trend: 95,
    impact: 85,
    description: 'Emphasis on tooling and workflow optimization'
  },
  {
    category: 'Community Platforms',
    trend: 75,
    impact: 80,
    description: 'Evolution of community engagement spaces'
  },
  {
    category: 'AI Integration',
    trend: 90,
    impact: 95,
    description: 'AI-powered developer tools and assistance'
  },
  {
    category: 'Open Source',
    trend: 80,
    impact: 85,
    description: 'Increased focus on OSS contribution'
  }
]

const COLORS = {
  high: '#4CAF50',
  medium: '#FFC107',
  low: '#FF5722'
}

const getColor = (impact: number): string => {
  if (impact >= 90) return COLORS.high
  if (impact >= 80) return COLORS.medium
  return COLORS.low
}

const getBubbleSize = (impact: number): number => {
  return Math.max(1000, Math.pow(impact, 2))
}

export function MarketTrends() {
  return (
    <div className="w-full h-[600px] p-4">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 40 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            dataKey="trend"
            name="Trend Strength"
            domain={[60, 100]}
          >
            <Label value="Trend Strength" offset={0} position="bottom" />
          </XAxis>
          <YAxis
            type="number"
            dataKey="impact"
            name="Market Impact"
            domain={[60, 100]}
          >
            <Label value="Market Impact" angle={-90} position="left" />
          </YAxis>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload as TrendData
                return (
                  <div className="bg-white p-2 border rounded shadow">
                    <p className="font-semibold">{data.category}</p>
                    <p>Trend Strength: {data.trend}</p>
                    <p>Market Impact: {data.impact}</p>
                    <p className="text-sm mt-1">{data.description}</p>
                  </div>
                )
              }
              return null
            }}
          />
          <Legend />
          <Scatter
            name="Market Trends"
            data={marketTrends}
            fill="#8884d8"
          >
            {marketTrends.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={getColor(entry.impact)}
                r={Math.sqrt(getBubbleSize(entry.impact) / Math.PI)}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}

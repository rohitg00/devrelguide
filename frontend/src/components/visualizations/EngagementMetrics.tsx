'use client'

import React, { useState } from 'react'
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'
import { VisualizationContainer } from './VisualizationContainer'
import {
  ComposedChart,
  Bar,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Label,
  ReferenceLine
} from 'recharts'

interface EngagementMetric {
  period: string
  activeUsers: number
  contentViews: number
  interactions: number
  satisfaction: number
  retention: number
  trend: number
}

const metricData: EngagementMetric[] = [
  {
    period: 'Q1',
    activeUsers: 1200,
    contentViews: 5000,
    interactions: 800,
    satisfaction: 85,
    retention: 70,
    trend: 65
  },
  {
    period: 'Q2',
    activeUsers: 1800,
    contentViews: 7500,
    interactions: 1200,
    satisfaction: 88,
    retention: 75,
    trend: 78
  },
  {
    period: 'Q3',
    activeUsers: 2500,
    contentViews: 12000,
    interactions: 2000,
    satisfaction: 92,
    retention: 82,
    trend: 85
  },
  {
    period: 'Q4',
    activeUsers: 3800,
    contentViews: 18000,
    interactions: 3200,
    satisfaction: 94,
    retention: 88,
    trend: 92
  }
]

const normalizeValue = (value: number, key: keyof typeof maxValues) => {
  const maxValues = {
    activeUsers: 5000,
    contentViews: 20000,
    interactions: 4000,
    satisfaction: 100,
    retention: 100,
    trend: 100
  } as const;
  return (value / maxValues[key]) * 100;
};

const COLORS = {
  activeUsers: '#2196F3',
  contentViews: '#4CAF50',
  interactions: '#FFC107',
  satisfaction: '#9C27B0',
  retention: '#FF5722',
  trend: '#607D8B'
}

export function EngagementMetrics() {
  const normalizedData = metricData.map(d => ({
    period: d.period,
    activeUsers: normalizeValue(d.activeUsers, 'activeUsers'),
    contentViews: normalizeValue(d.contentViews, 'contentViews'),
    interactions: normalizeValue(d.interactions, 'interactions'),
    satisfaction: d.satisfaction,
    retention: d.retention,
    trend: d.trend,
    raw: {
      activeUsers: d.activeUsers,
      contentViews: d.contentViews,
      interactions: d.interactions,
      satisfaction: d.satisfaction,
      retention: d.retention,
      trend: d.trend
    }
  }))

  return (
    <VisualizationContainer 
      title="Developer Engagement Analytics"
      description="Visualization of key developer engagement metrics over time"
    >
      <div className="w-full h-screen md:h-[32rem] lg:h-[40rem]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={normalizedData} margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis dataKey="period">
              <Label value="Time Period" position="bottom" offset={0} />
            </XAxis>
            <YAxis yAxisId="left" domain={[0, 100]}>
              <Label value="Normalized Score (%)" angle={-90} position="insideLeft" />
            </YAxis>
            <YAxis yAxisId="right" orientation="right" domain={[0, 100]}>
              <Label value="Satisfaction & Retention (%)" angle={90} position="insideRight" />
            </YAxis>

            <Bar
              yAxisId="left"
              dataKey="activeUsers"
              fill={COLORS.activeUsers}
              fillOpacity={0.8}
              stackId="stack"
            />
            <Bar
              yAxisId="left"
              dataKey="contentViews"
              fill={COLORS.contentViews}
              fillOpacity={0.8}
              stackId="stack"
            />
            <Bar
              yAxisId="left"
              dataKey="interactions"
              fill={COLORS.interactions}
              fillOpacity={0.8}
              stackId="stack"
            />

            <Line
              yAxisId="right"
              type="monotone"
              dataKey="satisfaction"
              stroke={COLORS.satisfaction}
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="retention"
              stroke={COLORS.retention}
              strokeWidth={2}
              dot={{ r: 4 }}
            />

            <Area
              yAxisId="right"
              type="monotone"
              dataKey="trend"
              fill={COLORS.trend}
              stroke={COLORS.trend}
              fillOpacity={0.1}
            />

            <ReferenceLine
              y={75}
              yAxisId="right"
              label="Target"
              stroke="#666"
              strokeDasharray="3 3"
            />

            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const raw = payload[0].payload.raw
                  return (
                    <div className="bg-card p-2 border rounded shadow">
                      <p className="font-semibold">{label}</p>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p style={{ color: COLORS.activeUsers }}>
                            Active Users: {raw.activeUsers}
                          </p>
                          <p style={{ color: COLORS.contentViews }}>
                            Content Views: {raw.contentViews}
                          </p>
                          <p style={{ color: COLORS.interactions }}>
                            Interactions: {raw.interactions}
                          </p>
                        </div>
                        <div>
                          <p style={{ color: COLORS.satisfaction }}>
                            Satisfaction: {raw.satisfaction}%
                          </p>
                          <p style={{ color: COLORS.retention }}>
                            Retention: {raw.retention}%
                          </p>
                          <p style={{ color: COLORS.trend }}>
                            Trend: {raw.trend}%
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />
            <Legend />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 text-sm text-muted-foreground overflow-hidden">
        <p className="mb-2 line-clamp-2">This visualization combines multiple engagement metrics in a novel way:</p>
        <ul className="list-disc ml-6 mt-2 space-y-1">
          <li className="line-clamp-1">Stacked bars show growth metrics (normalized)</li>
          <li className="line-clamp-1">Lines track satisfaction and retention</li>
          <li className="line-clamp-1">Shaded area represents overall engagement trend</li>
          <li className="line-clamp-1">Reference line indicates target performance</li>
        </ul>
      </div>
    </VisualizationContainer>
  )
}

export default EngagementMetrics;

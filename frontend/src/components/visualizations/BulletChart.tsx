'use client'

import React from 'react'
import { Card } from '../ui/card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell
} from 'recharts'

interface MetricData {
  title: string
  actual: number
  target: number
  ranges: [number, number, number] // [poor, satisfactory, good]
}

interface ChartDataPoint {
  title: string
  type: 'poor' | 'satisfactory' | 'good' | 'actual'
  value: number
  fill: string
}

const metricsData: MetricData[] = [
  {
    title: 'Documentation Coverage',
    actual: 75,
    target: 85,
    ranges: [30, 60, 100]
  },
  {
    title: 'Community Engagement',
    actual: 65,
    target: 80,
    ranges: [20, 50, 100]
  },
  {
    title: 'API Adoption',
    actual: 85,
    target: 90,
    ranges: [40, 70, 100]
  }
]

const transformDataForBullet = (data: MetricData[]): ChartDataPoint[] => {
  return data.flatMap(metric => [
    {
      title: metric.title,
      type: 'poor',
      value: metric.ranges[0],
      fill: '#e0e0e0'
    },
    {
      title: metric.title,
      type: 'satisfactory',
      value: metric.ranges[1] - metric.ranges[0],
      fill: '#c0c0c0'
    },
    {
      title: metric.title,
      type: 'good',
      value: metric.ranges[2] - metric.ranges[1],
      fill: '#a0a0a0'
    },
    {
      title: metric.title,
      type: 'actual',
      value: metric.actual,
      fill: '#000000'
    }
  ])
}

export function BulletChart() {
  const data = transformDataForBullet(metricsData)

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">DevRel Performance Metrics</h3>
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
          >
            <XAxis type="number" domain={[0, 100]} />
            <YAxis type="category" dataKey="title" />
            <Tooltip />

            {/* Range bars */}
            <Bar dataKey="value" stackId="stack">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>

            {/* Target markers */}
            {metricsData.map((metric, index) => (
              <ReferenceLine
                key={`target-${index}`}
                x={metric.target}
                stroke="#ff4000"
                strokeWidth={2}
                label={{ value: 'Target', position: 'top' }}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}

export default BulletChart;

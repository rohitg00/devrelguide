'use client'

import React, { useRef } from 'react'
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
import { VisualizationContainer } from './VisualizationContainer'
import { useFetchVisualization, fallbackData, useResponsiveVisualizationSize } from '@/lib/visualization-utils'

interface CareerMilestone {
  stage: string
  technical: number
  community: number
  content: number
  leadership: number
  impact: number
}

const COLORS = {
  technical: '#2196F3',
  community: '#4CAF50',
  content: '#FFC107',
  leadership: '#9C27B0',
  impact: '#FF5722'
}

export function CareerPathTimeline() {
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Use our custom hook for fetching data with fallback and error handling
  const { data: careerData, loading, error, retry } = useFetchVisualization<CareerMilestone[]>({
    endpoint: '/api/visualizations/career-path-timeline',
    fallbackData: fallbackData.careerPathTimeline
  })
  
  // Use responsive sizing hook
  const dimensions = useResponsiveVisualizationSize(containerRef)
  
  return (
    <div ref={containerRef} className="w-full h-full min-h-[400px]">
      <VisualizationContainer
        title="DevRel Career Evolution"
        description="Skill progression across different DevRel career stages"
        hasError={!!error}
        isLoading={loading}
        errorMessage={error ? error.message : ''}
        onRetry={retry}
      >
        <div className="w-full h-[400px]">
          {careerData && !loading && (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={careerData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis 
                  dataKey="stage" 
                  tick={{ fill: 'var(--foreground)' }}
                  axisLine={{ stroke: 'var(--border)' }}
                />
                <YAxis 
                  domain={[0, 100]} 
                  tick={{ fill: 'var(--foreground)' }}
                  axisLine={{ stroke: 'var(--border)' }}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-card p-3 shadow-lg rounded-md border border-border">
                          <p className="font-semibold">{label} Level</p>
                          <div className="space-y-1 mt-1">
                            {payload.map((entry: any) => (
                              <p
                                key={entry.name}
                                className="text-sm flex items-center gap-2"
                              >
                                <span 
                                  className="w-3 h-3 rounded-full inline-block"
                                  style={{ backgroundColor: COLORS[entry.name as keyof typeof COLORS] }}
                                ></span>
                                <span className="capitalize">{entry.name}:</span> 
                                <span className="font-medium">{entry.value}</span>
                              </p>
                            ))}
                          </div>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Legend 
                  formatter={(value) => <span className="capitalize">{value}</span>}
                  wrapperStyle={{ paddingTop: '10px' }}
                />
                <Area
                  type="monotone"
                  dataKey="technical"
                  stackId="1"
                  stroke={COLORS.technical}
                  fill={COLORS.technical}
                  fillOpacity={0.3}
                  animationDuration={1000}
                />
                <Area
                  type="monotone"
                  dataKey="community"
                  stackId="1"
                  stroke={COLORS.community}
                  fill={COLORS.community}
                  fillOpacity={0.3}
                  animationDuration={1000}
                  animationBegin={300}
                />
                <Area
                  type="monotone"
                  dataKey="content"
                  stackId="1"
                  stroke={COLORS.content}
                  fill={COLORS.content}
                  fillOpacity={0.3}
                  animationDuration={1000}
                  animationBegin={600}
                />
                <Line
                  type="monotone"
                  dataKey="leadership"
                  stroke={COLORS.leadership}
                  strokeWidth={2}
                  dot={{ r: 4, strokeWidth: 1 }}
                  activeDot={{ r: 6, strokeWidth: 1 }}
                  animationDuration={1000}
                  animationBegin={900}
                />
                <Line
                  type="monotone"
                  dataKey="impact"
                  stroke={COLORS.impact}
                  strokeWidth={2}
                  dot={{ r: 4, strokeWidth: 1 }}
                  activeDot={{ r: 6, strokeWidth: 1 }}
                  animationDuration={1000}
                  animationBegin={1200}
                />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          <p className="mb-2">This visualization shows the evolution of key DevRel competencies across career stages:</p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>Stacked areas show foundational skills (Technical, Community, Content)</li>
            <li>Lines represent leadership and impact growth</li>
            <li>Each stage shows relative importance of different competencies</li>
            <li>Progression indicates skill development patterns</li>
          </ul>
        </div>
      </VisualizationContainer>
    </div>
  )
}

export default CareerPathTimeline;

'use client'

import React, { useState } from 'react'
import * as d3 from 'd3'
import { Card } from '@/components/ui/card'

interface ResourceMetric {
  name: string
  category: string
  engagement: number
  growth: number
  impact: number
  trends: number[]
  comparisons: {
    industry: number
    previous: number
  }
}

const resourceData: ResourceMetric[] = [
  {
    name: 'Technical Documentation',
    category: 'Content',
    engagement: 85,
    growth: 12,
    impact: 90,
    trends: [82, 84, 83, 86, 85],
    comparisons: { industry: 80, previous: 82 }
  },
  {
    name: 'Community Forum',
    category: 'Community',
    engagement: 92,
    growth: 15,
    impact: 88,
    trends: [88, 89, 90, 91, 92],
    comparisons: { industry: 85, previous: 88 }
  },
  {
    name: 'Developer Workshops',
    category: 'Education',
    engagement: 78,
    growth: 8,
    impact: 85,
    trends: [75, 76, 78, 77, 78],
    comparisons: { industry: 75, previous: 76 }
  },
  {
    name: 'API Reference',
    category: 'Technical',
    engagement: 95,
    growth: 5,
    impact: 95,
    trends: [92, 93, 94, 94, 95],
    comparisons: { industry: 90, previous: 92 }
  },
  {
    name: 'Blog Posts',
    category: 'Content',
    engagement: 82,
    growth: 10,
    impact: 80,
    trends: [78, 79, 80, 81, 82],
    comparisons: { industry: 75, previous: 78 }
  }
]

function SparklineCell({ data }: { data: number[] }) {
  const width = 60
  const height = 20
  const margin = { top: 2, right: 2, bottom: 2, left: 2 }

  const xScale = d3.scaleLinear()
    .domain([0, data.length - 1])
    .range([margin.left, width - margin.right])

  const yScale = d3.scaleLinear()
    .domain([d3.min(data) || 0, d3.max(data) || 100])
    .range([height - margin.bottom, margin.top])

  const line = d3.line<number>()
    .x((_, i) => xScale(i))
    .y(d => yScale(d))
    .curve(d3.curveMonotoneX)

  return (
    <svg width={width} height={height} className="inline-block ml-2">
      <path
        d={line(data) || ''}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="text-primary"
      />
    </svg>
  )
}

function getColorForMetric(value: number, type: 'engagement' | 'growth' | 'impact', comparisons?: { industry: number, previous: number }): string {
  const thresholds = {
    engagement: { high: 90, medium: 70, max: 100 },
    growth: { high: 12, medium: 8, max: 15 },
    impact: { high: 90, medium: 70, max: 100 }
  }

  const { high, medium, max } = thresholds[type]

  if (comparisons) {
    const performanceRatio = (value - comparisons.industry) / (max - comparisons.industry)
    return d3.scaleSequential()
      .domain([0, 1])
      .interpolator(performanceRatio > 0 ? d3.interpolateGnBu : d3.interpolateOrRd)(Math.abs(performanceRatio))
  }

  return d3.scaleSequential()
    .domain([0, max])
    .interpolator(d3.interpolateRdYlGn)(value)
}

function MetricCell({ value, type, label, trends, comparisons }: {
  value: number
  type: 'engagement' | 'growth' | 'impact'
  label: string
  trends: number[]
  comparisons: { industry: number, previous: number }
}) {
  const [showTooltip, setShowTooltip] = useState(false)
  const improvement = ((value - comparisons.previous) / comparisons.previous * 100).toFixed(1)
  const vsIndustry = ((value - comparisons.industry) / comparisons.industry * 100).toFixed(1)

  return (
    <td
      className="px-4 py-3 text-sm font-medium relative group"
      style={{ backgroundColor: getColorForMetric(value, type, comparisons) }}
      role="cell"
      aria-label={`${label}: ${value}%`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="flex items-center justify-between">
        <span>{value}%</span>
        <SparklineCell data={trends} />
        {showTooltip && (
          <div className="absolute z-10 bg-white p-3 rounded-lg shadow-lg -top-28 left-1/2 transform -translate-x-1/2 text-xs w-48">
            <div className="font-semibold mb-1">{label}</div>
            <div className="space-y-1">
              <div>Current: {value}%</div>
              <div className={improvement.startsWith('-') ? 'text-red-500' : 'text-green-500'}>
                vs Previous: {improvement}%
              </div>
              <div className={vsIndustry.startsWith('-') ? 'text-red-500' : 'text-green-500'}>
                vs Industry: {vsIndustry}%
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Trend over last 5 periods
            </div>
          </div>
        )}
      </div>
    </td>
  )
}

export function HighlightTable() {
  return (
    <Card className="w-full overflow-hidden">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">DevRel Resource Performance</h3>
        <p className="text-sm text-gray-500 mt-1">
          Interactive metrics with trends and industry comparisons
        </p>
      </div>
      <div className="overflow-x-auto">
        <table
          className="min-w-full divide-y divide-border"
          role="table"
          aria-label="DevRel Resource Metrics"
        >
          <thead>
            <tr className="bg-muted/50">
              <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Resource</th>
              <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Category</th>
              <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Engagement</th>
              <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Growth</th>
              <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Impact</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-background">
            {resourceData.map((resource, idx) => (
              <tr key={idx} className="hover:bg-muted/50 transition-colors">
                <td className="px-4 py-3 text-sm">{resource.name}</td>
                <td className="px-4 py-3 text-sm">{resource.category}</td>
                <MetricCell
                  value={resource.engagement}
                  type="engagement"
                  label="Engagement"
                  trends={resource.trends}
                  comparisons={resource.comparisons}
                />
                <MetricCell
                  value={resource.growth}
                  type="growth"
                  label="Growth"
                  trends={resource.trends}
                  comparisons={resource.comparisons}
                />
                <MetricCell
                  value={resource.impact}
                  type="impact"
                  label="Impact"
                  trends={resource.trends}
                  comparisons={resource.comparisons}
                />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

export default HighlightTable;

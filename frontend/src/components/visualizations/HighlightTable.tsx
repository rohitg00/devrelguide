'use client'

import React, { useState } from 'react'
import { VisualizationContainer } from './VisualizationContainer'

interface ResourceMetric {
  name: string
  category: string
  engagement: number
  growth: number
  impact: number
  trends: {
    engagement: number
    growth: number
    impact: number
  }
  comparisons: {
    industry: number
    target: number
  }
}

const resourceData: ResourceMetric[] = [
  {
    name: 'Documentation',
    category: 'Content',
    engagement: 85,
    growth: 12,
    impact: 78,
    trends: {
      engagement: 5,
      growth: 2,
      impact: 3
    },
    comparisons: {
      industry: 70,
      target: 90
    }
  },
  {
    name: 'API Reference',
    category: 'Technical',
    engagement: 92,
    growth: 8,
    impact: 85,
    trends: {
      engagement: 3,
      growth: -1,
      impact: 2
    },
    comparisons: {
      industry: 80,
      target: 95
    }
  },
  {
    name: 'Blog Posts',
    category: 'Content',
    engagement: 72,
    growth: 15,
    impact: 65,
    trends: {
      engagement: 8,
      growth: 5,
      impact: 7
    },
    comparisons: {
      industry: 65,
      target: 80
    }
  },
  {
    name: 'Sample Code',
    category: 'Technical',
    engagement: 88,
    growth: 10,
    impact: 82,
    trends: {
      engagement: 4,
      growth: 3,
      impact: 5
    },
    comparisons: {
      industry: 75,
      target: 85
    }
  },
  {
    name: 'Tutorials',
    category: 'Educational',
    engagement: 80,
    growth: 18,
    impact: 75,
    trends: {
      engagement: 10,
      growth: 8,
      impact: 6
    },
    comparisons: {
      industry: 68,
      target: 82
    }
  },
  {
    name: 'Community Forum',
    category: 'Community',
    engagement: 65,
    growth: 25,
    impact: 70,
    trends: {
      engagement: 15,
      growth: 12,
      impact: 8
    },
    comparisons: {
      industry: 60,
      target: 75
    }
  }
]

function getColorForMetric(value: number, type: 'engagement' | 'growth' | 'impact'): string {
  const colors = {
    engagement: ['#fee2e2', '#fecaca', '#fca5a5', '#f87171', '#ef4444', '#dc2626', '#b91c1c'],
    growth: ['#dcfce7', '#bbf7d0', '#86efac', '#4ade80', '#22c55e', '#16a34a', '#15803d'],
    impact: ['#dbeafe', '#bfdbfe', '#93c5fd', '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8']
  }

  const index = Math.min(Math.floor(value / 15), 6)
  return colors[type][index]
}

interface MetricCellProps {
  value: number
  type: 'engagement' | 'growth' | 'impact'
  label: string
  trends: {
    engagement: number
    growth: number
    impact: number
  }
  comparisons: {
    industry: number
    target: number
  }
}

function MetricCell({ value, type, label, trends, comparisons }: MetricCellProps) {
  const [showDetails, setShowDetails] = useState(false)
  const trend = trends[type]
  const industry = comparisons.industry
  const target = comparisons.target

  return (
    <td 
      className="p-2 border-t relative cursor-pointer"
      onMouseEnter={() => setShowDetails(true)}
      onMouseLeave={() => setShowDetails(false)}
    >
      <div className="flex items-center">
        <div 
          className="w-3 h-3 rounded-full mr-2" 
          style={{ backgroundColor: getColorForMetric(value, type) }}
        ></div>
        <span>{value}%</span>
        <span className={`ml-2 text-xs ${trend >= 0 ? 'text-secondary' : 'text-destructive'}`}>
          {trend >= 0 ? '↑' : '↓'}{Math.abs(trend)}%
        </span>
      </div>
      
      {showDetails && (
        <div className="absolute z-10 bg-card p-3 rounded-lg shadow-lg border text-xs -mt-1 left-full ml-2 w-48">
          <div className="font-semibold mb-1">{label} Details</div>
          <div className="space-y-2">
            <div>
              <div className="text-muted-foreground">Current Value</div>
              <div className="font-medium">{value}%</div>
            </div>
            <div>
              <div className="text-muted-foreground">Trend (30 days)</div>
              <div className={`font-medium ${trend >= 0 ? 'text-secondary' : 'text-destructive'}`}>
                {trend >= 0 ? '+' : ''}{trend}%
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">Industry Average</div>
              <div className="font-medium">{industry}%</div>
              <div className="w-full bg-muted h-1.5 rounded-full mt-1">
                <div 
                  className="bg-blue-400 h-1.5 rounded-full" 
                  style={{ width: `${industry}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">Target</div>
              <div className="font-medium">{target}%</div>
              <div className="w-full bg-muted h-1.5 rounded-full mt-1">
                <div 
                  className="bg-secondary h-1.5 rounded-full" 
                  style={{ width: `${target}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </td>
  )
}

export function HighlightTable() {
  return (
    <VisualizationContainer
      title="DevRel Metrics Highlight Table"
      description="Visualization of key DevRel metrics with color-coded performance indicators"
    >
      <div className="w-full overflow-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted/50">
              <th className="p-2 text-left font-medium text-muted-foreground">Resource</th>
              <th className="p-2 text-left font-medium text-muted-foreground">Category</th>
              <th className="p-2 text-left font-medium text-muted-foreground">Engagement</th>
              <th className="p-2 text-left font-medium text-muted-foreground">Growth</th>
              <th className="p-2 text-left font-medium text-muted-foreground">Impact</th>
            </tr>
          </thead>
          <tbody>
            {resourceData.map((resource, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-background' : 'bg-muted/20'}>
                <td className="p-2 border-t">{resource.name}</td>
                <td className="p-2 border-t">{resource.category}</td>
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
    </VisualizationContainer>
  )
}

export default HighlightTable;

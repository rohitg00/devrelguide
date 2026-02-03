'use client'

import React, { useEffect, useState } from 'react'
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

interface DataPoint {
  category: string
  engagement_type: string
  effectiveness_score: number
  reach: number
  timestamp: string
}

interface VisualizationData {
  scatter_data: DataPoint[]
  categories: string[]
  engagement_types: string[]
  summary: {
    total_resources: number
    avg_effectiveness: number
    total_reach: number
    time_range: {
      start: string
      end: string
    }
  }
}

const COLORS = {
  'Documentation': '#3B82F6',  // Blue
  'Tutorials': '#10B981',      // Emerald
  'Blog Posts': '#F59E0B',     // Amber
  'Videos': '#8B5CF6',         // Purple
  'Workshops': '#EC4899'       // Pink
}

export function CommunityInsights() {
  const [data, setData] = useState<VisualizationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/visualizations/community-insights')
        if (!response.ok) {
          throw new Error('Failed to fetch community insights data')
        }
        const insightsData = await response.json()
        setData(insightsData)
      } catch (err) {
        console.error('Error fetching community insights data:', err)
        setError(err instanceof Error ? err.message : 'Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="w-full h-[600px] p-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full h-[600px] p-4 flex items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="w-full h-[600px] p-4 flex items-center justify-center">
        <div className="text-muted-foreground">No data available</div>
      </div>
    )
  }

  return (
    <div className="w-full h-[600px] p-4">
      <h2 className="text-xl font-semibold mb-4">Resource Impact Analysis</h2>
      <div className="mb-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card p-4 rounded-lg shadow">
            <p className="text-sm text-muted-foreground">Total Resources</p>
            <p className="text-2xl font-bold">{data.summary.total_resources}</p>
          </div>
          <div className="bg-card p-4 rounded-lg shadow">
            <p className="text-sm text-muted-foreground">Average Effectiveness</p>
            <p className="text-2xl font-bold">{data.summary.avg_effectiveness.toFixed(1)}%</p>
          </div>
          <div className="bg-card p-4 rounded-lg shadow">
            <p className="text-sm text-muted-foreground">Total Reach</p>
            <p className="text-2xl font-bold">{data.summary.total_reach.toLocaleString()}</p>
          </div>
          <div className="bg-card p-4 rounded-lg shadow">
            <p className="text-sm text-muted-foreground">Time Range</p>
            <p className="text-sm font-medium">
              {new Date(data.summary.time_range.start).toLocaleDateString()} - 
              {new Date(data.summary.time_range.end).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <CartesianGrid />
          <XAxis 
            type="number" 
            dataKey="reach" 
            name="Reach"
            unit=" views"
          />
          <YAxis
            type="number"
            dataKey="effectiveness_score"
            name="Effectiveness"
            unit="%"
          />
          <Tooltip 
            cursor={{ strokeDasharray: '3 3' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload as DataPoint
                return (
                  <div className="bg-card p-2 border rounded shadow">
                    <p className="font-semibold">{data.category}</p>
                    <p>Engagement: {data.engagement_type}</p>
                    <p>Effectiveness: {data.effectiveness_score.toFixed(1)}%</p>
                    <p>Reach: {data.reach.toLocaleString()} views</p>
                  </div>
                )
              }
              return null
            }}
          />
          <Legend />
          {data.categories.map((category) => (
            <Scatter
              key={category}
              name={category}
              data={data.scatter_data.filter(d => d.category === category)}
              fill={COLORS[category as keyof typeof COLORS]}
            />
          ))}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}

export default CommunityInsights

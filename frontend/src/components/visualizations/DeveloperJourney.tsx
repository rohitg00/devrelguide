'use client'

import React, { useEffect, useState, Suspense } from 'react'
import dynamic from 'next/dynamic'
import {
  Tooltip,
  Rectangle,
  Layer
} from 'recharts'

// Dynamically import Sankey and ResponsiveContainer with no SSR
const Sankey = dynamic(
  () => import('recharts').then((mod) => mod.Sankey),
  { ssr: false }
)

const ResponsiveContainer = dynamic(
  () => import('recharts').then((mod) => mod.ResponsiveContainer),
  { ssr: false }
)

interface JourneyNode {
  name: string
  value: number
  category: 'discovery' | 'learning' | 'building' | 'contributing' | 'leading'
}

interface JourneyPayload extends JourneyNode {
  x: number
  y: number
  width: number
  height: number
  index: number
}

interface JourneyLink {
  source: number
  target: number
  value: number
}

interface JourneyData {
  nodes: JourneyNode[]
  links: JourneyLink[]
}

const COLORS = {
  discovery: '#3B82F6',  // Blue
  learning: '#10B981',   // Emerald
  building: '#F59E0B',   // Amber
  contributing: '#8B5CF6', // Purple
  leading: '#EC4899'     // Pink
}

const LoadingSpinner = () => (
  <div className="w-full h-[600px] p-4 flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
  </div>
)

const ErrorDisplay = ({ message }: { message: string }) => (
  <div className="w-full h-[600px] p-4 flex items-center justify-center">
    <div className="text-red-500">Error: {message}</div>
  </div>
)

const NoDataDisplay = () => (
  <div className="w-full h-[600px] p-4 flex items-center justify-center">
    <div className="text-gray-500">No data available</div>
  </div>
)

export function DeveloperJourney() {
  const [data, setData] = useState<JourneyData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
        const response = await fetch(`${apiUrl}/api/visualizations/developer-journey`)
        if (!response.ok) {
          throw new Error('Failed to fetch journey data')
        }
        const journeyData = await response.json()
        setData(journeyData)
      } catch (err) {
        console.error('Error fetching journey data:', err)
        setError(err instanceof Error ? err.message : 'Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorDisplay message={error} />
  if (!data) return <NoDataDisplay />

  const renderNode = ({ x, y, width, height, index, payload }: {
    x: number
    y: number
    width: number
    height: number
    index: number
    payload: JourneyPayload
  }) => (
    <Rectangle
      x={x}
      y={y}
      width={width}
      height={height}
      fill={COLORS[payload.category]}
      fillOpacity={0.9}
    >
      <text
        x={x + width / 2}
        y={y + height / 2}
        textAnchor="middle"
        fill="#fff"
        dy=".35em"
        fontSize={12}
      >
        {payload.name}
      </text>
    </Rectangle>
  )

  const renderTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as JourneyNode
      return (
        <div className="bg-white p-2 border rounded shadow">
          <p className="font-semibold">{data.name}</p>
          <p>Category: {data.category}</p>
          <p>Value: {data.value}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="w-full h-[600px] p-4">
      <Suspense fallback={<LoadingSpinner />}>
        <ResponsiveContainer width="100%" height="100%">
          <Sankey
            data={data}
            node={renderNode}
            link={{
              stroke: '#77777777',
              strokeWidth: 2,
              fillOpacity: 0.2
            }}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            nodePadding={50}
            nodeWidth={10}
          >
            <Tooltip content={renderTooltip} />
            <Layer key="custom-layer">
              <text x={20} y={20} fill="#666" fontSize={14}>Developer Journey Flow</text>
            </Layer>
          </Sankey>
        </ResponsiveContainer>
      </Suspense>
    </div>
  )
}

export default DeveloperJourney

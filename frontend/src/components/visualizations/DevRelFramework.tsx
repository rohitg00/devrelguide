'use client'

import React from 'react'
import {
  Treemap,
  ResponsiveContainer,
  Tooltip
} from 'recharts'
import { VisualizationContainer } from './VisualizationContainer'

interface FrameworkNode {
  name: string
  size: number
  category: 'core' | 'support' | 'impact' | 'community' | 'devrel'
  children?: FrameworkNode[]
}

interface TreemapPayload {
  root: FrameworkNode
  depth: number
  x: number
  y: number
  width: number
  height: number
  index: number
  name: string
  category: keyof typeof COLORS
}

const frameworkData: FrameworkNode = {
  name: 'DevRel Framework',
  size: 100,
  category: 'devrel',
  children: [
    {
      name: 'Core Activities',
      size: 40,
      category: 'core',
      children: [
        {
          name: 'Technical Advocacy',
          size: 15,
          category: 'core'
        },
        {
          name: 'Content Creation',
          size: 15,
          category: 'core'
        },
        {
          name: 'Community Building',
          size: 10,
          category: 'core'
        }
      ]
    },
    {
      name: 'Support Activities',
      size: 30,
      category: 'support',
      children: [
        {
          name: 'Documentation',
          size: 10,
          category: 'support'
        },
        {
          name: 'Developer Support',
          size: 10,
          category: 'support'
        },
        {
          name: 'Knowledge Sharing',
          size: 10,
          category: 'support'
        }
      ]
    },
    {
      name: 'Impact Metrics',
      size: 30,
      category: 'impact',
      children: [
        {
          name: 'Adoption Rate',
          size: 10,
          category: 'impact'
        },
        {
          name: 'Community Growth',
          size: 10,
          category: 'impact'
        },
        {
          name: 'Developer Satisfaction',
          size: 10,
          category: 'impact'
        }
      ]
    }
  ]
}

const COLORS = {
  devrel: '#8884d8',
  core: '#82ca9d',
  support: '#ffc658',
  impact: '#ff7c43',
  community: '#a4de6c'
}

export function DevRelFramework() {
  const CustomizedContent = React.memo(({
    root,
    depth,
    x,
    y,
    width,
    height,
    index,
    name,
    category
  }: TreemapPayload) => (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: COLORS[category],
          stroke: '#fff',
          strokeWidth: 2 / (depth + 1e-10),
          strokeOpacity: 1 / (depth + 1e-10)
        }}
      />
      {depth === 1 && (
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          fill="#fff"
          fontSize={14}
        >
          {name}
        </text>
      )}
    </g>
  ))

  return (
    <VisualizationContainer
      title="DevRel Framework Overview"
      description="Hierarchical visualization of the DevRel framework components"
    >
      <div className="w-full aspect-[4/3] min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <Treemap
            data={[frameworkData]}
            dataKey="size"
            aspectRatio={4 / 3}
            stroke="#fff"
            content={CustomizedContent}
          >
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as FrameworkNode
                  return (
                    <div className="bg-white p-2 border rounded shadow">
                      <p className="font-semibold">{data.name}</p>
                      <p>Category: {data.category}</p>
                      <p>Size: {data.size}</p>
                    </div>
                  )
                }
                return null
              }}
            />
          </Treemap>
        </ResponsiveContainer>
      </div>
    </VisualizationContainer>
  )
}

export default DevRelFramework

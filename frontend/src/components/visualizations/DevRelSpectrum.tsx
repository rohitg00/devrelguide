'use client'

import React from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts'
import { VisualizationContainer } from './VisualizationContainer'

interface SpectrumNode {
  id: string
  name: string
  category: 'devrel' | 'community' | 'shared'
  position: number
  connections: string[]
  description: string
}

const spectrumData: SpectrumNode[] = [
  {
    id: 'technical_content',
    name: 'Technical Content',
    category: 'devrel',
    position: 0.1,
    connections: ['documentation', 'tutorials'],
    description: 'Creating technical documentation and guides'
  },
  {
    id: 'documentation',
    name: 'Documentation',
    category: 'shared',
    position: 0.3,
    connections: ['knowledge_sharing'],
    description: 'Maintaining technical documentation'
  },
  {
    id: 'tutorials',
    name: 'Tutorials',
    category: 'shared',
    position: 0.4,
    connections: ['knowledge_sharing'],
    description: 'Creating learning resources'
  },
  {
    id: 'knowledge_sharing',
    name: 'Knowledge Sharing',
    category: 'shared',
    position: 0.5,
    connections: ['community_building'],
    description: 'Facilitating knowledge exchange'
  },
  {
    id: 'community_building',
    name: 'Community Building',
    category: 'shared',
    position: 0.6,
    connections: ['community_management'],
    description: 'Building developer communities'
  },
  {
    id: 'community_management',
    name: 'Community Management',
    category: 'community',
    position: 0.8,
    connections: [],
    description: 'Managing community processes'
  }
]

// Transform data for Recharts
const transformDataForChart = () => {
  const nodes = spectrumData.map(node => ({
    ...node,
    value: node.position * 100,
    color: node.category === 'devrel' ? '#4CAF50' :
           node.category === 'community' ? '#2196F3' : '#FFC107'
  }))

  const connections = spectrumData.flatMap(node =>
    node.connections.map(targetId => {
      const target = spectrumData.find(n => n.id === targetId)
      return target ? {
        source: node.name,
        target: target.name,
        sourcePos: node.position * 100,
        targetPos: target.position * 100
      } : null
    }).filter(Boolean)
  )

  return { nodes, connections }
}

export function DevRelSpectrum() {
  const { nodes, connections } = transformDataForChart()

  return (
    <VisualizationContainer
      title="DevRel Spectrum Analysis"
      description="Interactive visualization showing the spectrum of Developer Relations activities and their interconnections."
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            domain={[0, 100]}
            label={{ value: 'Spectrum Position', position: 'bottom' }}
          />
          <YAxis
            type="number"
            domain={[-10, 10]}
            hide
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const node = nodes.find(n => n.name === payload[0].payload.name)
                if (!node) return null
                return (
                  <div className="tooltip bg-white p-2 border rounded shadow">
                    <p className="text-xs sm:text-sm font-semibold line-clamp-1">{node.name}</p>
                    <p className="text-xs line-clamp-1">Category: {node.category}</p>
                    <p className="text-xs line-clamp-2">{node.description}</p>
                  </div>
                )
              }
              return null
            }}
          />
          <Legend />
          {/* Render connections as lines */}
          {connections.map((conn, i) => (
            <Line
              key={`conn-${i}`}
              type="monotone"
              data={[
                { x: conn.sourcePos, y: 0 },
                { x: conn.targetPos, y: 0 }
              ]}
              dataKey="y"
              stroke="#9E9E9E"
              strokeWidth={1}
              dot={false}
              activeDot={false}
            />
          ))}
          {/* Render nodes as scatter points */}
          {['devrel', 'community', 'shared'].map(category => (
            <Line
              key={category}
              name={category.charAt(0).toUpperCase() + category.slice(1)}
              type="monotone"
              data={nodes.filter(n => n.category === category)}
              dataKey="value"
              stroke={nodes.find(n => n.category === category)?.color}
              dot={{
                r: 6,
                fill: nodes.find(n => n.category === category)?.color,
                strokeWidth: 2,
                stroke: '#fff'
              }}
              label={{
                position: 'top',
                content: (props: any) => (
                  <text
                    x={props.x}
                    y={props.y - 10}
                    fill="#666"
                    textAnchor="middle"
                    fontSize={10}
                  >
                    {props.payload.name}
                  </text>
                )
              }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </VisualizationContainer>
  )
}

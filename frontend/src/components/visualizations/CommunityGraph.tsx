'use client'

import React, { useEffect, useRef, useState } from 'react'
import { select } from 'd3-selection'
import { forceSimulation, forceLink, forceManyBody, forceCenter } from 'd3-force'
import { drag } from 'd3-drag'
import { scaleOrdinal } from 'd3-scale'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import { VisualizationContainer } from './VisualizationContainer'

interface BaseNode {
  id: string;
  name: string;
  category: string;
}

interface SankeyNodeExtra {
  x0?: number;
  x1?: number;
  y0?: number;
  y1?: number;
  value?: number;
  index?: number;
}

interface SankeyNodeType extends BaseNode, SankeyNodeExtra {
  sourceLinks?: any[];
  targetLinks?: any[];
}

interface SankeyLinkType {
  source: SankeyNodeType;
  target: SankeyNodeType;
  value: number;
  width?: number;
  y0?: number;
  y1?: number;
}

interface SankeyData {
  nodes: SankeyNodeType[];
  links: SankeyLinkType[];
}

interface CommunityData {
  nodes: BaseNode[];
  links: {
    source: string;
    target: string;
    value: number;
  }[];
}

function CommunityGraph() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<CommunityData | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/visualizations/community-graph')
        if (!response.ok) {
          throw new Error('Failed to load community graph data')
        }
        const data = await response.json()
        setData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load visualization')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (!data || !svgRef.current) return

    const svg = select(svgRef.current)
    const width = 800
    const height = 600
    const color = scaleOrdinal(['#4285F4', '#34A853', '#FBBC05', '#EA4335'])

    // Clear previous content
    svg.selectAll('*').remove()

    // Create force simulation
    const simulation = forceSimulation(data.nodes)
      .force('link', forceLink(data.links).id((d: any) => d.id))
      .force('charge', forceManyBody().strength(-100))
      .force('center', forceCenter(width / 2, height / 2))

    // Add links
    const link = svg
      .append('g')
      .selectAll('line')
      .data(data.links)
      .join('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', (d: any) => Math.sqrt(d.value))

    // Add nodes
    const node = svg
      .append('g')
      .selectAll('circle')
      .data(data.nodes)
      .join('circle')
      .attr('r', (d: any) => d.size || 5)
      .attr('fill', (d: any) => color(d.category))
      .call(drag(simulation) as any)

    // Add labels
    const label = svg
      .append('g')
      .selectAll('text')
      .data(data.nodes)
      .join('text')
      .text((d: any) => d.name)
      .attr('font-size', 10)
      .attr('dx', 12)
      .attr('dy', 4)

    // Update positions on tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y)

      node
        .attr('cx', (d: any) => d.x)
        .attr('cy', (d: any) => d.y)

      label
        .attr('x', (d: any) => d.x)
        .attr('y', (d: any) => d.y)
    })

    // Cleanup
    return () => {
      simulation.stop()
    }
  }, [data])

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-800">Error: {error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 text-red-600 hover:text-red-800"
        >
          Try refreshing
        </button>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <VisualizationContainer
        title="Community Flow Analysis"
        description="Interactive visualization of community interactions and relationships in Developer Relations."
      >
        <div className="w-full h-[600px] relative">
          <svg ref={svgRef} className="w-full h-full" />
        </div>
      </VisualizationContainer>
    </ErrorBoundary>
  )
}

export default CommunityGraph

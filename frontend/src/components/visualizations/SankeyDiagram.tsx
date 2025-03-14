'use client'

import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { sankey as d3Sankey, sankeyLinkHorizontal } from 'd3-sankey'
import { useResizeObserver } from '@/hooks/useResizeObserver'

interface DevRelNode {
  id: string
  name: string
  category: 'activity' | 'outcome' | 'impact'
}

interface DevRelLink {
  id: string
  source: string
  target: string
  value: number
}

interface DevRelFlow {
  nodes: DevRelNode[]
  links: DevRelLink[]
}

const DEFAULT_DATA: DevRelFlow = {
  nodes: [
    { id: '0', name: 'Content Creation', category: 'activity' },
    { id: '1', name: 'Community Engagement', category: 'activity' },
    { id: '2', name: 'Technical Support', category: 'activity' },
    { id: '3', name: 'Documentation', category: 'outcome' },
    { id: '4', name: 'Developer Education', category: 'outcome' },
    { id: '5', name: 'Community Growth', category: 'outcome' },
    { id: '6', name: 'Developer Success', category: 'impact' },
    { id: '7', name: 'Product Adoption', category: 'impact' },
    { id: '8', name: 'Community Health', category: 'impact' }
  ],
  links: [
    { id: 'l0', source: '0', target: '3', value: 30 },
    { id: 'l1', source: '0', target: '4', value: 25 },
    { id: 'l2', source: '1', target: '5', value: 35 },
    { id: 'l3', source: '1', target: '4', value: 20 },
    { id: 'l4', source: '2', target: '4', value: 15 },
    { id: 'l5', source: '2', target: '5', value: 25 },
    { id: 'l6', source: '3', target: '6', value: 20 },
    { id: 'l7', source: '3', target: '7', value: 15 },
    { id: 'l8', source: '4', target: '6', value: 30 },
    { id: 'l9', source: '4', target: '7', value: 25 },
    { id: 'l10', source: '5', target: '8', value: 40 }
  ]
}

export const SankeyDiagram: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const dimensions = useResizeObserver(wrapperRef)
  const [error, setError] = useState<Error | null>(null)
  const [data] = useState<DevRelFlow>(DEFAULT_DATA)

  useEffect(() => {
    if (!dimensions || !svgRef.current) return

    const { width, height } = dimensions
    const margin = { top: 20, right: 20, bottom: 20, left: 20 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const sankeyGenerator = d3Sankey<DevRelNode, DevRelLink>()
      .nodeId(d => d.id)
      .nodeWidth(15)
      .nodePadding(10)
      .extent([[margin.left, margin.top], [innerWidth, innerHeight]])

    try {
      const { nodes, links } = sankeyGenerator({
        nodes: data.nodes.map(d => ({ ...d })),
        links: data.links.map(d => ({ ...d }))
      })

      const g = svg.append('g')

      // Add links
      g.append('g')
        .selectAll('path')
        .data(links)
        .join('path')
        .attr('d', sankeyLinkHorizontal())
        .attr('stroke', '#ccc')
        .attr('stroke-width', d => Math.max(1, d.width || 0))
        .attr('fill', 'none')
        .attr('opacity', 0.5)

      // Add nodes
      const node = g.append('g')
        .selectAll('rect')
        .data(nodes)
        .join('rect')
        .attr('x', d => d.x0 || 0)
        .attr('y', d => d.y0 || 0)
        .attr('height', d => (d.y1 || 0) - (d.y0 || 0))
        .attr('width', d => (d.x1 || 0) - (d.x0 || 0))
        .attr('fill', d => {
          switch (d.category) {
            case 'activity': return '#8884d8'
            case 'outcome': return '#82ca9d'
            case 'impact': return '#ffc658'
            default: return '#ccc'
          }
        })

      // Add labels
      g.append('g')
        .selectAll('text')
        .data(nodes)
        .join('text')
        .attr('x', d => (d.x0 || 0) - 6)
        .attr('y', d => ((d.y1 || 0) + (d.y0 || 0)) / 2)
        .attr('dy', '0.35em')
        .attr('text-anchor', 'end')
        .text(d => d.name)
        .attr('font-size', '10px')
        .attr('fill', 'currentColor')

    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to render Sankey diagram'))
    }
  }, [dimensions, data])

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>
  }

  return (
    <div ref={wrapperRef} className="w-full h-full">
      <svg ref={svgRef} width="100%" height="100%" />
    </div>
  )
}

export default SankeyDiagram

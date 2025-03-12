'use client'

import React, { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { useResizeObserver } from '@/hooks/useResizeObserver'
import { VisualizationContainer } from './VisualizationContainer'

interface Node {
  id: string
  group: string
  value: number
  type: 'developer' | 'resource' | 'community' | 'platform' | 'activity' | 'content'
  description?: string
}

interface Link {
  source: string
  target: string
  value: number
  type: 'interaction' | 'contribution' | 'learning' | 'mentorship' | 'collaboration'
  description?: string
}

interface GraphData {
  nodes: Node[]
  links: Link[]
}

export const CommunityForceGraph: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const dimensions = useResizeObserver(wrapperRef)

  useEffect(() => {
    if (!dimensions) return

    // Sample data - in production this would come from API
    const data: GraphData = {
      nodes: [
        { id: 'Core Team', group: 'team', type: 'developer', value: 10, description: 'DevRel team members' },
        { id: 'Contributors', group: 'community', type: 'developer', value: 8, description: 'Active community contributors' },
        { id: 'Documentation', group: 'resource', type: 'resource', value: 6, description: 'Technical documentation' },
        { id: 'GitHub', group: 'platform', type: 'platform', value: 7, description: 'Code collaboration platform' },
        { id: 'Discord', group: 'platform', type: 'platform', value: 5, description: 'Community chat platform' },
        { id: 'Events', group: 'activity', type: 'activity', value: 4, description: 'Meetups and conferences' },
        { id: 'Blog Posts', group: 'content', type: 'content', value: 6, description: 'Technical articles' },
        { id: 'Mentors', group: 'team', type: 'developer', value: 7, description: 'Community mentors' },
        { id: 'Learning Resources', group: 'resource', type: 'resource', value: 5, description: 'Educational content' }
      ],
      links: [
        { source: 'Core Team', target: 'Contributors', value: 5, type: 'mentorship', description: 'Guidance and support' },
        { source: 'Contributors', target: 'Documentation', value: 3, type: 'contribution', description: 'Documentation updates' },
        { source: 'Core Team', target: 'Documentation', value: 4, type: 'contribution', description: 'Content creation' },
        { source: 'GitHub', target: 'Contributors', value: 4, type: 'interaction', description: 'Code contributions' },
        { source: 'Discord', target: 'Contributors', value: 3, type: 'interaction', description: 'Community discussions' },
        { source: 'Events', target: 'Contributors', value: 2, type: 'learning', description: 'Knowledge sharing' },
        { source: 'Blog Posts', target: 'Documentation', value: 2, type: 'learning', description: 'Technical guides' },
        { source: 'Mentors', target: 'Contributors', value: 4, type: 'mentorship', description: 'Skills development' },
        { source: 'Learning Resources', target: 'Contributors', value: 3, type: 'learning', description: 'Educational content' }
      ]
    }

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const width = dimensions.width
    const height = dimensions.height

    // Create force simulation
    const simulation = d3.forceSimulation(data.nodes as any)
      .force('link', d3.forceLink(data.links).id((d: any) => d.id))
      .force('charge', d3.forceManyBody().strength(-400))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius((d: any) => Math.sqrt(d.value) * 8))

    // Create arrow markers for different link types
    svg.append('defs').selectAll('marker')
      .data(['interaction', 'contribution', 'learning', 'mentorship', 'collaboration'])
      .join('marker')
      .attr('id', d => `arrow-${d}`)
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 20)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', d => {
        switch (d) {
          case 'interaction': return '#93C5FD'
          case 'contribution': return '#6EE7B7'
          case 'learning': return '#FCA5A5'
          case 'mentorship': return '#A78BFA'
          case 'collaboration': return '#F472B6'
          default: return '#999'
        }
      })

    // Color scales for nodes and links
    const nodeColorScale = d3.scaleOrdinal<string>()
      .domain(['developer', 'resource', 'community', 'platform', 'activity', 'content'])
      .range(['#60A5FA', '#34D399', '#F87171', '#A78BFA', '#F59E0B', '#EC4899'])

    // Create links with arrows
    const link = svg.append('g')
      .selectAll('line')
      .data(data.links)
      .join('line')
      .attr('stroke', (d: any) => {
        switch (d.type) {
          case 'interaction': return '#93C5FD'
          case 'contribution': return '#6EE7B7'
          case 'learning': return '#FCA5A5'
          case 'mentorship': return '#A78BFA'
          case 'collaboration': return '#F472B6'
          default: return '#999'
        }
      })
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', (d: any) => Math.sqrt(d.value) * 2)
      .attr('marker-end', (d: any) => `url(#arrow-${d.type})`)

    // Create node groups
    const nodeGroup = svg.append('g')
      .selectAll('g')
      .data(data.nodes)
      .join('g')
      .call(drag(simulation) as any)

    // Add node circles
    nodeGroup.append('circle')
      .attr('r', (d: any) => Math.sqrt(d.value) * 5)
      .attr('fill', (d: any) => nodeColorScale(d.type))
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)

    // Add node labels
    nodeGroup.append('text')
      .text((d: any) => d.id)
      .attr('font-size', '10px')
      .attr('dx', 12)
      .attr('dy', 4)
      .attr('fill', '#4B5563')

    // Add tooltips
    nodeGroup.append('title')
      .text((d: any) => `${d.id}\nType: ${d.type}\n${d.description}`)

    link.append('title')
      .text((d: any) => `${d.source.id} → ${d.target.id}\nType: ${d.type}\n${d.description}`)

    // Update positions on simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y)

      nodeGroup.attr('transform', (d: any) => `translate(${d.x},${d.y})`)
    })

    // Implement drag behavior
    function drag(simulation: any) {
      function dragstarted(event: any) {
        if (!event.active) simulation.alphaTarget(0.3).restart()
        event.subject.fx = event.subject.x
        event.subject.fy = event.subject.y
      }

      function dragged(event: any) {
        event.subject.fx = event.x
        event.subject.fy = event.y
      }

      function dragended(event: any) {
        if (!event.active) simulation.alphaTarget(0)
        event.subject.fx = null
        event.subject.fy = null
      }

      return d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended)
    }

    // Add zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.5, 5])
      .on('zoom', (event) => {
        const g = svg.select('g')
        g.attr('transform', event.transform)
      })

    svg.call(zoom as any)
      .on('dblclick.zoom', null)

  }, [dimensions])

  return (
    <VisualizationContainer
      title="Community Interaction Network"
      description="Force-directed graph visualization of community interactions and relationships"
    >
      <div ref={wrapperRef} className="w-full h-[600px]">
        <svg ref={svgRef} className="w-full h-full" />
      </div>
    </VisualizationContainer>
  )
}

export default CommunityForceGraph;

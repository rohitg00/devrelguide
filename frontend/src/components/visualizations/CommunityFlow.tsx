'use client'

import React, { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { motion, AnimatePresence } from 'framer-motion'
import { useResizeObserver } from '@/hooks/useResizeObserver'

interface Node {
  id: string
  group: string
  type: 'community' | 'activity' | 'outcome'
  value: number
  description: string
}

interface Link {
  source: string
  target: string
  value: number
  type: string
  description: string
}

interface GraphData {
  nodes: Node[]
  links: Link[]
}

const data: GraphData = {
  nodes: [
    {
      id: "DevRel Community",
      group: "core",
      type: "community",
      value: 100,
      description: "Central hub of Developer Relations activities"
    },
    {
      id: "Technical Content",
      group: "content",
      type: "activity",
      value: 70,
      description: "Documentation, tutorials, and code samples"
    },
    {
      id: "Community Programs",
      group: "programs",
      type: "activity",
      value: 80,
      description: "Structured engagement initiatives"
    },
    {
      id: "Developer Events",
      group: "events",
      type: "activity",
      value: 60,
      description: "Conferences, meetups, and workshops"
    },
    {
      id: "Support Channels",
      group: "support",
      type: "activity",
      value: 75,
      description: "Forums, chat, and issue tracking"
    },
    {
      id: "Learning Resources",
      group: "education",
      type: "outcome",
      value: 65,
      description: "Educational materials and guides"
    },
    {
      id: "Community Growth",
      group: "growth",
      type: "outcome",
      value: 85,
      description: "Expansion and engagement metrics"
    },
    {
      id: "Developer Success",
      group: "success",
      type: "outcome",
      value: 90,
      description: "Developer satisfaction and achievements"
    }
  ],
  links: [
    {
      source: "DevRel Community",
      target: "Technical Content",
      value: 4,
      type: "produces",
      description: "Creates and maintains documentation"
    },
    {
      source: "Technical Content",
      target: "Learning Resources",
      value: 3,
      type: "enables",
      description: "Provides learning materials"
    },
    {
      source: "DevRel Community",
      target: "Community Programs",
      value: 5,
      type: "manages",
      description: "Organizes and runs programs"
    },
    {
      source: "Community Programs",
      target: "Community Growth",
      value: 4,
      type: "drives",
      description: "Increases community engagement"
    },
    {
      source: "DevRel Community",
      target: "Developer Events",
      value: 4,
      type: "organizes",
      description: "Plans and executes events"
    },
    {
      source: "Developer Events",
      target: "Developer Success",
      value: 3,
      type: "promotes",
      description: "Facilitates learning and networking"
    },
    {
      source: "DevRel Community",
      target: "Support Channels",
      value: 5,
      type: "maintains",
      description: "Provides developer assistance"
    },
    {
      source: "Support Channels",
      target: "Developer Success",
      value: 4,
      type: "ensures",
      description: "Resolves issues and queries"
    }
  ]
}

interface TooltipProps {
  x: number
  y: number
  node: Node | Link
}

const Tooltip: React.FC<TooltipProps> = ({ x, y, node }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    className="absolute pointer-events-none bg-card/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-border"
    style={{
      left: x,
      top: y,
      transform: 'translate(-50%, -120%)',
      zIndex: 50,
      maxWidth: '200px'
    }}
  >
    <h3 className="font-semibold text-sm mb-1">{(node as any).id || `${(node as any).source} → ${(node as any).target}`}</h3>
    <p className="text-xs text-muted-foreground">{node.description}</p>
  </motion.div>
)

export const CommunityFlow: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const dimensions = useResizeObserver(wrapperRef)
  const [tooltip, setTooltip] = useState<{ x: number; y: number; node: Node | Link } | null>(null)

  useEffect(() => {
    if (!dimensions || !svgRef.current) return

    const width = dimensions.width
    const height = dimensions.height || 600

    // Clear previous content
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    svg
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height])

    // Define gradients
    const defs = svg.append('defs')
    
    const gradients = {
      community: defs.append('linearGradient')
        .attr('id', 'community-gradient')
        .attr('x1', '0%').attr('y1', '0%')
        .attr('x2', '100%').attr('y2', '100%'),
      activity: defs.append('linearGradient')
        .attr('id', 'activity-gradient')
        .attr('x1', '0%').attr('y1', '0%')
        .attr('x2', '100%').attr('y2', '100%'),
      outcome: defs.append('linearGradient')
        .attr('id', 'outcome-gradient')
        .attr('x1', '0%').attr('y1', '0%')
        .attr('x2', '100%').attr('y2', '100%')
    }

    gradients.community
      .selectAll('stop')
      .data([
        { offset: '0%', color: '#3B82F6' },
        { offset: '100%', color: '#2563EB' }
      ])
      .join('stop')
      .attr('offset', d => d.offset)
      .attr('stop-color', d => d.color)

    gradients.activity
      .selectAll('stop')
      .data([
        { offset: '0%', color: '#10B981' },
        { offset: '100%', color: '#059669' }
      ])
      .join('stop')
      .attr('offset', d => d.offset)
      .attr('stop-color', d => d.color)

    gradients.outcome
      .selectAll('stop')
      .data([
        { offset: '0%', color: '#F59E0B' },
        { offset: '100%', color: '#D97706' }
      ])
      .join('stop')
      .attr('offset', d => d.offset)
      .attr('stop-color', d => d.color)

    // Create force simulation
    const simulation = d3.forceSimulation(data.nodes)
      .force('link', d3.forceLink(data.links).id((d: any) => d.id))
      .force('charge', d3.forceManyBody().strength(-1000))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius((d: any) => Math.sqrt(d.value) * 4))

    // Create links
    const link = svg.append('g')
      .selectAll('line')
      .data(data.links)
      .join('line')
      .attr('stroke', '#94A3B8')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', (d: any) => Math.sqrt(d.value) * 2)

    // Create nodes
    const node = svg.append('g')
      .selectAll('g')
      .data(data.nodes)
      .join('g')
      .call(d3.drag<any, any>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended) as any
      )

    // Add circles to nodes
    node.append('circle')
      .attr('r', (d: any) => Math.sqrt(d.value) * 3)
      .attr('fill', (d: any) => `url(#${d.type}-gradient)`)
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .on('mouseover', function(event: MouseEvent, d: any) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', Math.sqrt(d.value) * 3.5)
        
        setTooltip({ x: event.pageX, y: event.pageY, node: d })
      })
      .on('mouseout', function(event: MouseEvent, d: any) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', Math.sqrt(d.value) * 3)
        
        setTooltip(null)
      })

    // Add labels to nodes
    node.append('text')
      .text((d: any) => d.id)
      .attr('x', 0)
      .attr('y', (d: any) => -Math.sqrt(d.value) * 3 - 5)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('fill', '#4B5563')
      .attr('pointer-events', 'none')

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y)

      node
        .attr('transform', (d: any) => `translate(${d.x},${d.y})`)
    })

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

    return () => {
      simulation.stop()
    }
  }, [dimensions])

  return (
    <div ref={wrapperRef} className="relative w-full h-[600px] bg-gradient-to-b from-card to-muted/30">
      <svg ref={svgRef} className="w-full h-full" />
      <AnimatePresence>
        {tooltip && <Tooltip x={tooltip.x} y={tooltip.y} node={tooltip.node} />}
      </AnimatePresence>
    </div>
  )
}

export default CommunityFlow

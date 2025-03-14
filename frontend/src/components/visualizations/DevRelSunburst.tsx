'use client'

import React, { useRef, useState, useEffect } from 'react'
import * as d3 from 'd3'
import { useResizeObserver } from '@/hooks/useResizeObserver'
import { VisualizationContainer } from './VisualizationContainer'

interface HierarchyNode {
  name: string
  value?: number
  children?: HierarchyNode[]
  description?: string
  type?: 'strategy' | 'community' | 'content' | 'technical' | 'metrics'
  impact?: number
  growth?: number
  engagement?: number
}

function DevRelSunburst() {
  const svgRef = useRef<SVGSVGElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const dimensions = useResizeObserver(wrapperRef)
  const [focusedNode, setFocusedNode] = useState<d3.HierarchyNode<HierarchyNode> | null>(null)

  useEffect(() => {
    if (!dimensions) return

    const data: HierarchyNode = {
      name: "DevRel Framework",
      type: "strategy",
      description: "Comprehensive Developer Relations Strategy",
      children: [
        {
          name: "Community",
          type: "community",
          description: "Building and nurturing developer communities",
          impact: 85,
          growth: 25,
          engagement: 90,
          children: [
            {
              name: "Events",
              type: "community",
              value: 20,
              description: "Developer conferences and meetups",
              impact: 80,
              growth: 20,
              engagement: 85
            },
            {
              name: "Forums",
              type: "community",
              value: 15,
              description: "Online discussion platforms",
              impact: 75,
              growth: 15,
              engagement: 90
            },
            {
              name: "Social",
              type: "community",
              value: 25,
              description: "Social media engagement",
              impact: 85,
              growth: 30,
              engagement: 95
            }
          ]
        },
        {
          name: "Content",
          type: "content",
          description: "Technical content creation and management",
          impact: 90,
          growth: 20,
          engagement: 85,
          children: [
            {
              name: "Documentation",
              type: "content",
              value: 30,
              description: "Technical documentation and guides",
              impact: 95,
              growth: 15,
              engagement: 80
            },
            {
              name: "Tutorials",
              type: "content",
              value: 20,
              description: "Step-by-step learning resources",
              impact: 85,
              growth: 25,
              engagement: 90
            },
            {
              name: "Blog Posts",
              type: "content",
              value: 15,
              description: "Technical articles and insights",
              impact: 80,
              growth: 20,
              engagement: 85
            }
          ]
        },
        {
          name: "Technical",
          type: "technical",
          description: "Technical enablement and support",
          impact: 95,
          growth: 15,
          engagement: 80,
          children: [
            {
              name: "SDK Support",
              type: "technical",
              value: 25,
              description: "Developer tools and SDKs",
              impact: 90,
              growth: 10,
              engagement: 75
            },
            {
              name: "API Design",
              type: "technical",
              value: 20,
              description: "API strategy and implementation",
              impact: 95,
              growth: 15,
              engagement: 80
            },
            {
              name: "Integration",
              type: "technical",
              value: 15,
              description: "Platform integration support",
              impact: 85,
              growth: 20,
              engagement: 85
            }
          ]
        },
        {
          name: "Metrics",
          type: "metrics",
          description: "Performance tracking and analysis",
          impact: 80,
          growth: 30,
          engagement: 75,
          children: [
            {
              name: "Adoption",
              type: "metrics",
              value: 15,
              description: "Developer adoption metrics",
              impact: 85,
              growth: 35,
              engagement: 70
            },
            {
              name: "Engagement",
              type: "metrics",
              value: 20,
              description: "Community engagement tracking",
              impact: 75,
              growth: 25,
              engagement: 85
            },
            {
              name: "Growth",
              type: "metrics",
              value: 25,
              description: "Developer ecosystem growth",
              impact: 80,
              growth: 30,
              engagement: 70
            }
          ]
        }
      ]
    }

    const width = dimensions.width
    const height = dimensions.height
    const radius = Math.min(width, height) / 2

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const g = svg
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`)

    const root = d3.hierarchy(data)
      .sum(d => d.value || 0)
      .sort((a, b) => (b.value || 0) - (a.value || 0))

    const partition = d3.partition()
      .size([2 * Math.PI, radius])

    const arc = d3.arc()
      .startAngle((d: any) => d.x0)
      .endAngle((d: any) => d.x1)
      .innerRadius((d: any) => d.y0)
      .outerRadius((d: any) => d.y1)
      .padAngle(0.02)
      .padRadius(radius / 2)

    const colorScale = d3.scaleOrdinal<string>()
      .domain(['strategy', 'community', 'content', 'technical', 'metrics'])
      .range(['#8B5CF6', '#10B981', '#F59E0B', '#EC4899', '#3B82F6'])

    const paths = g.selectAll('path')
      .data(partition(root).descendants())
      .join('path')
      .attr('d', arc as any)
      .style('fill', (d: any) => {
        const depth = d.depth
        const baseColor = d3.color(colorScale(d.data.type || 'strategy'))
        return baseColor ? baseColor.brighter(depth * 0.2).toString() : '#ccc'
      })
      .style('stroke', '#fff')
      .style('stroke-width', 2)
      .style('opacity', 0.8)
      .on('mouseover', function(event, d: any) {
        d3.select(this)
          .style('opacity', 1)
          .style('cursor', 'pointer')
        setFocusedNode(d)
      })
      .on('mouseout', function() {
        d3.select(this)
          .style('opacity', 0.8)
          .style('cursor', 'default')
        setFocusedNode(null)
      })
      .on('click', (event, d: any) => {
        const transition = svg.transition()
          .duration(750)
          .tween('scale', () => {
            const xd = d3.interpolate(root.x0, d.x0)
            const yd = d3.interpolate(root.y0, d.y0)
            return (t) => { root.x0 = xd(t); root.y0 = yd(t) }
          })

        transition.selectAll('path')
          .attrTween('d', (d: any) => () => arc(d))
      })

    const labels = g.selectAll('text')
      .data(partition(root).descendants())
      .join('text')
      .attr('transform', (d: any) => {
        const x = (d.x0 + d.x1) / 2 * 180 / Math.PI
        const y = (d.y0 + d.y1) / 2
        return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`
      })
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .text((d: any) => d.data.name)
      .style('font-size', '10px')
      .style('fill', '#333')
      .style('opacity', (d: any) => d.x1 - d.x0 > 0.2 ? 1 : 0)

  }, [dimensions])

  return (
    <VisualizationContainer
      title="DevRel Framework Structure"
      description="Interactive visualization of Developer Relations strategy and focus areas."
    >
      <div ref={wrapperRef} className="w-full aspect-square min-h-0">
        <svg ref={svgRef} className="w-full h-full" />
      </div>
      {focusedNode && (
        <div className="mt-4 p-4 bg-muted/5 rounded-lg">
          <h4 className="font-medium text-sm">{focusedNode.data.name}</h4>
          {focusedNode.data.description && (
            <p className="text-sm text-muted-foreground mt-1">{focusedNode.data.description}</p>
          )}
          {focusedNode.data.impact && (
            <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
              <div>Impact: {focusedNode.data.impact}%</div>
              <div>Growth: {focusedNode.data.growth}%</div>
              <div>Engagement: {focusedNode.data.engagement}%</div>
            </div>
          )}
        </div>
      )}
    </VisualizationContainer>
  )
}

export default DevRelSunburst;

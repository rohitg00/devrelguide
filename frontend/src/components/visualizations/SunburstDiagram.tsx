'use client'

import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { useResizeObserver } from '@/hooks/useResizeObserver'
import { VisualizationContainer } from './VisualizationContainer'

interface DevRelActivity {
  name: string
  value: number
  children?: DevRelActivity[]
  category?: 'content' | 'community' | 'technical' | 'impact'
  growth?: number
  trend?: 'increasing' | 'stable' | 'decreasing'
}

const devrelData: DevRelActivity = {
  name: "DevRel Activities",
  value: 100,
  children: [
    {
      name: "Content",
      value: 90,
      category: 'content',
      growth: 15,
      trend: 'increasing',
      children: [
        { name: "Technical Blogs", value: 85, growth: 20, trend: 'increasing' },
        { name: "Documentation", value: 90, growth: 10, trend: 'stable' },
        { name: "Video Content", value: 75, growth: 25, trend: 'increasing' }
      ]
    },
    {
      name: "Community",
      value: 95,
      category: 'community',
      growth: 18,
      trend: 'increasing',
      children: [
        { name: "Forums", value: 80, growth: 15, trend: 'stable' },
        { name: "Events", value: 85, growth: 22, trend: 'increasing' },
        { name: "Social Media", value: 70, growth: 30, trend: 'increasing' }
      ]
    },
    {
      name: "Technical",
      value: 90,
      category: 'technical',
      growth: 12,
      trend: 'stable',
      children: [
        { name: "Issue Resolution", value: 85, growth: 8, trend: 'stable' },
        { name: "Code Reviews", value: 80, growth: 12, trend: 'stable' },
        { name: "SDK Support", value: 75, growth: 15, trend: 'increasing' }
      ]
    }
  ]
}

function SunburstDiagram() {
  const svgRef = useRef<SVGSVGElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!svgRef.current || !wrapperRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const width = wrapperRef.current.clientWidth
    const height = wrapperRef.current.clientHeight
    const radius = Math.min(width, height) / 2

    svg
      .attr('width', width)
      .attr('height', height)

    const g = svg.append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`)

    const hierarchy = d3.hierarchy<DevRelActivity>(devrelData)
    const root = hierarchy
      .sum(d => d.value)
      .sort((a, b) => (b.value || 0) - (a.value || 0))

    const partition = d3.partition<DevRelActivity>()
      .size([2 * Math.PI, radius])

    const arcGenerator = d3.arc<d3.HierarchyRectangularNode<DevRelActivity>>()
      .startAngle(d => d.x0 || 0)
      .endAngle(d => d.x1 || 0)
      .innerRadius(d => d.y0 || 0)
      .outerRadius(d => d.y1 || 0)
      .padAngle(0.02)
      .padRadius(radius / 2)

    const colorScale = d3.scaleOrdinal<string>()
      .domain(['content', 'community', 'technical', 'impact'])
      .range(['#4CAF50', '#2196F3', '#FFC107', '#9C27B0'])

    const opacityScale = d3.scaleLinear()
      .domain([0, 30])
      .range([0.5, 1])

    const paths = g.selectAll<SVGPathElement, d3.HierarchyRectangularNode<DevRelActivity>>('path')
      .data(partition(root).descendants())
      .join('path')
      .attr('d', arcGenerator)
      .style('fill', d => colorScale(d.data.category || 'impact'))
      .style('opacity', d => opacityScale(d.data.growth || 0))
      .style('stroke', 'white')
      .style('stroke-width', 1)

    paths
      .on('mouseover', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .style('opacity', 1)
          .style('cursor', 'pointer')

        const tooltip = d3.select(wrapperRef.current)
          .append('div')
          .attr('class', 'absolute bg-white p-2 rounded shadow-lg pointer-events-none')
          .style('opacity', 0)

        tooltip.html(`
          <div class="font-semibold">${d.data.name}</div>
          <div>Value: ${d.value}</div>
          ${d.data.growth ? `<div>Growth: ${d.data.growth}%</div>` : ''}
          ${d.data.trend ? `<div>Trend: ${d.data.trend}</div>` : ''}
        `)
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 28}px`)
          .transition()
          .duration(200)
          .style('opacity', 1)
      })
      .on('mouseout', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .style('opacity', opacityScale(d.data.growth || 0))

        d3.selectAll('.absolute.bg-white').remove()
      })

    g.selectAll<SVGTextElement, d3.HierarchyRectangularNode<DevRelActivity>>('text')
      .data(partition(root).descendants())
      .join('text')
      .filter(d => ((d.x1 || 0) - (d.x0 || 0)) > 0.2)
      .attr('transform', d => {
        const x = ((d.x0 || 0) + (d.x1 || 0)) / 2 * 180 / Math.PI
        const y = ((d.y0 || 0) + (d.y1 || 0)) / 2
        return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`
      })
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .attr('class', 'text-xs font-medium fill-current')
      .text(d => d.data.name)

  }, [])

  return (
    <VisualizationContainer
      title="DevRel Activity Impact"
      description="Visualization of Developer Relations activities and their impact across different categories."
    >
      <div ref={wrapperRef} className="w-full aspect-square min-h-0 relative">
        <svg ref={svgRef} className="w-full h-full" />
      </div>
    </VisualizationContainer>
  )
}

export default SunburstDiagram

'use client'

import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { HexbinBin } from 'd3-hexbin'
import { useResizeObserver } from '@/hooks/useResizeObserver'

interface ImpactMetric {
  name: string
  value: number
  trend: number
  category: 'engagement' | 'reach' | 'influence'
  submetrics: { name: string; value: number }[]
}

const sampleData: ImpactMetric[] = [
  {
    name: 'Community Growth',
    value: 85,
    trend: 12,
    category: 'engagement',
    submetrics: [
      { name: 'New Members', value: 250 },
      { name: 'Active Contributors', value: 120 },
      { name: 'Event Participation', value: 450 }
    ]
  },
  {
    name: 'Developer Satisfaction',
    value: 92,
    trend: 5,
    category: 'engagement',
    submetrics: [
      { name: 'Documentation Rating', value: 4.5 },
      { name: 'Support Response', value: 4.8 },
      { name: 'Tool Usability', value: 4.3 }
    ]
  },
  {
    name: 'Content Impact',
    value: 78,
    trend: -3,
    category: 'reach',
    submetrics: [
      { name: 'Blog Views', value: 15000 },
      { name: 'Tutorial Completions', value: 3200 },
      { name: 'Resource Downloads', value: 8500 }
    ]
  }
]

export function ImpactMetrics() {
  const svgRef = useRef<SVGSVGElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const dimensions = useResizeObserver(wrapperRef as React.RefObject<HTMLElement>)

  useEffect(() => {
    if (!svgRef.current || !dimensions) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const margin = { top: 40, right: 40, bottom: 40, left: 40 }
    const width = dimensions.width - margin.left - margin.right
    const height = dimensions.height - margin.top - margin.bottom

    const g = svg
      .attr('width', dimensions.width)
      .attr('height', dimensions.height)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    // Create hexagonal grid layout inspired by Evil Martians' visualization patterns
    const hexbin = require('d3-hexbin').hexbin()
      .radius(50)
      .extent([[0, 0], [width, height]])

    // Transform metrics into hexagonal points
    const points = sampleData.flatMap((metric, i) => {
      const angle = (i * 2 * Math.PI) / sampleData.length
      const radius = height / 3
      const x = width / 2 + radius * Math.cos(angle)
      const y = height / 2 + radius * Math.sin(angle)
      return Array.from({ length: Math.ceil(metric.value / 10) }, () => {
        const noise = Math.random() * 20 - 10
        return [x + noise, y + noise] as [number, number]
      })
    })

    // Create hexagonal bins
    const bins = hexbin(points) as HexbinBin<[number, number]>[]

    // Draw hexagonal cells
    const cells = g.selectAll<SVGPathElement, HexbinBin<[number, number]>>('path')
      .data(bins)
      .join('path')
      .attr('d', () => hexbin.hexagon())
      .attr('transform', (d: HexbinBin<[number, number]>) =>
        `translate(${d.x},${d.y})`)
      .attr('fill', (_, i) => {
        const category = sampleData[Math.floor(i / 3)].category
        switch (category) {
          case 'engagement': return '#3B82F6'  // Blue
          case 'reach': return '#10B981'       // Emerald
          case 'influence': return '#F59E0B'   // Amber
          default: return '#94A3B8'           // Slate
        }
      })
      .attr('fill-opacity', (d: HexbinBin<[number, number]>) =>
        Math.min(0.8, d.length / 10))
      .attr('stroke', 'var(--border)')
      .attr('stroke-width', 1)

    // Add metric labels using spiral layout
    const labelSpiral = d3.lineRadial<number>()
      .angle(i => i * 0.5)
      .radius(i => i * 8)

    const labels = g.selectAll('.label')
      .data(sampleData)
      .join('g')
      .attr('class', 'label')
      .attr('transform', (d, i) => {
        const angle = (i * 2 * Math.PI) / sampleData.length
        const radius = height / 3
        return 'translate(' + (width / 2 + radius * Math.cos(angle)) + ',' +
               (height / 2 + radius * Math.sin(angle)) + ')'
      })

    labels.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('class', 'text-sm font-medium')
      .text(d => d.name)

    // Add interactive tooltips
    const tooltip = g.append('g')
      .attr('class', 'tooltip')
      .style('opacity', 0)

    tooltip.append('rect')
      .attr('rx', 4)
      .attr('ry', 4)
      .attr('fill', 'var(--popover)')
      .attr('stroke', 'var(--border)')

    const tooltipText = tooltip.append('text')
      .attr('font-size', '12px')
      .attr('fill', 'currentColor')

    // Add hover interactions
    cells.on('mouseover', (event: MouseEvent, d: HexbinBin<[number, number]>) => {
      const [x, y] = d3.pointer(event, g.node())
      tooltip.style('opacity', 1)
        .attr('transform', `translate(${x + 10},${y - 10})`)

      tooltipText.selectAll('*').remove()
      tooltipText.append('tspan')
        .attr('x', 10)
        .attr('dy', '1.2em')
        .text(`Density: ${d.length}`)

      const bbox = tooltipText.node()?.getBBox()
      if (bbox) {
        tooltip.select('rect')
          .attr('width', bbox.width + 20)
          .attr('height', bbox.height + 20)
      }
    })
    .on('mouseout', () => {
      tooltip.style('opacity', 0)
    })

  }, [dimensions])

  return (
    <div ref={wrapperRef} className="w-full h-[500px]">
      <svg
        ref={svgRef}
        className="w-full h-full"
        style={{ touchAction: 'none' }}
      />
    </div>
  )
}

export default ImpactMetrics;

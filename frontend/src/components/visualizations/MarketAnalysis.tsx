'use client'

import React, { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { useResizeObserver } from '@/hooks/useResizeObserver'

interface MarketTrend {
  category: string
  value: number
  change: number
  impact: 'positive' | 'negative' | 'neutral'
  description?: string
}

const marketData: MarketTrend[] = [
  {
    category: 'Community Engagement',
    value: 85,
    change: 12,
    impact: 'positive',
    description: 'Growing developer community participation and interaction'
  },
  {
    category: 'Technical Content',
    value: 92,
    change: -3,
    impact: 'negative',
    description: 'Slight decrease in technical content engagement'
  },
  {
    category: 'Developer Advocacy',
    value: 78,
    change: 5,
    impact: 'positive',
    description: 'Increased developer advocacy effectiveness'
  },
  {
    category: 'Platform Adoption',
    value: 65,
    change: 8,
    impact: 'positive',
    description: 'Steady growth in platform adoption rates'
  },
  {
    category: 'Documentation Quality',
    value: 88,
    change: -2,
    impact: 'negative',
    description: 'Minor decline in documentation satisfaction'
  }
]

export function MarketAnalysis() {
  const svgRef = useRef<SVGSVGElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const dimensions = useResizeObserver(wrapperRef as React.RefObject<HTMLElement>)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!svgRef.current || !dimensions) return

    try {
      const svg = d3.select(svgRef.current)
      svg.selectAll('*').remove()

      const margin = { top: 40, right: 120, bottom: 40, left: 120 }
      const width = dimensions.width - margin.left - margin.right
      const height = dimensions.height - margin.top - margin.bottom

      const g = svg
        .attr('width', dimensions.width)
        .attr('height', dimensions.height)
        .append('g')
        .attr('transform', `translate(${dimensions.width / 2},${dimensions.height / 2})`)

      // Create radial scale for market trends
      const radius = Math.min(width, height) / 2 - margin.top
      const angleScale = d3.scaleBand<string>()
        .domain(marketData.map(d => d.category))
        .range([0, 2 * Math.PI])
        .padding(0.1)

      const radiusScale = d3.scaleLinear()
        .domain([0, 100])
        .range([0, radius])

      // Create arc generator
      const arc = d3.arc<MarketTrend>()
        .innerRadius(0)
        .outerRadius(d => radiusScale(d.value))
        .startAngle(d => angleScale(d.category) || 0)
        .endAngle(d => (angleScale(d.category) || 0) + (angleScale.bandwidth() || 0))

      // Draw arcs
      const arcs = g.selectAll('.arc')
        .data(marketData)
        .join('path')
        .attr('class', 'arc')
        .attr('d', arc)
        .attr('fill', d => {
          switch (d.impact) {
            case 'positive': return 'var(--success)'
            case 'negative': return 'var(--destructive)'
            default: return 'var(--muted)'
          }
        })
        .attr('opacity', 0.7)
        .attr('stroke', 'var(--border)')
        .attr('stroke-width', 1)

      // Add labels
      const labels = g.selectAll('.label')
        .data(marketData)
        .join('text')
        .attr('class', 'label')
        .attr('transform', d => {
          const angle = (angleScale(d.category) || 0) + (angleScale.bandwidth() || 0) / 2
          const x = (radius + 30) * Math.cos(angle - Math.PI / 2)
          const y = (radius + 30) * Math.sin(angle - Math.PI / 2)
          return `translate(${x},${y})`
        })
        .attr('text-anchor', d => {
          const angle = (angleScale(d.category) || 0) + (angleScale.bandwidth() || 0) / 2
          return angle < Math.PI ? 'start' : 'end'
        })
        .attr('dy', '0.35em')
        .attr('class', 'text-sm font-medium')
        .text(d => d.category)

      // Add tooltips
      const tooltip = g.append('g')
        .attr('class', 'tooltip')
        .style('opacity', 0)
        .attr('pointer-events', 'none')

      tooltip.append('rect')
        .attr('class', 'tooltip-bg')
        .attr('rx', 4)
        .attr('ry', 4)
        .attr('fill', 'var(--popover)')
        .attr('stroke', 'var(--border)')

      const tooltipText = tooltip.append('text')
        .attr('fill', 'currentColor')
        .attr('font-size', '12px')

      // Add hover interactions
      arcs
        .on('mouseover', (event, d) => {
          const [x, y] = d3.pointer(event)
          tooltip
            .style('opacity', 1)
            .attr('transform', `translate(${x},${y - 40})`)

          tooltipText.selectAll('*').remove()
          tooltipText
            .append('tspan')
            .attr('x', 0)
            .attr('dy', '1.2em')
            .attr('text-anchor', 'middle')
            .text(d.description || '')

          const bbox = tooltipText.node()?.getBBox()
          if (bbox) {
            tooltip.select('.tooltip-bg')
              .attr('x', bbox.x - 10)
              .attr('y', bbox.y - 10)
              .attr('width', bbox.width + 20)
              .attr('height', bbox.height + 20)
          }
        })
        .on('mouseout', () => {
          tooltip.style('opacity', 0)
        })

    } catch (error) {
      console.error('Error initializing Market Analysis:', error)
      setError(error as Error)
    }
  }, [dimensions])

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error: {error.message}
      </div>
    )
  }

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

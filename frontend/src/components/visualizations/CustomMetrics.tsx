'use client'

import React, { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { useResizeObserver } from '@/hooks/useResizeObserver'
import { VisualizationContainer } from './VisualizationContainer'

interface MetricData {
  category: string
  value: number
  trend: 'up' | 'down' | 'stable'
  impact: 'high' | 'medium' | 'low'
}

const metricsData: MetricData[] = [
  {
    category: 'Developer Engagement',
    value: 85,
    trend: 'up',
    impact: 'high'
  },
  {
    category: 'Content Reach',
    value: 72,
    trend: 'up',
    impact: 'medium'
  },
  {
    category: 'Community Growth',
    value: 93,
    trend: 'stable',
    impact: 'high'
  },
  {
    category: 'Technical Adoption',
    value: 68,
    trend: 'up',
    impact: 'medium'
  }
]

export function CustomMetrics() {
  const svgRef = useRef<SVGSVGElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const dimensions = useResizeObserver(wrapperRef as React.RefObject<HTMLElement>)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!dimensions || !svgRef.current) return

    try {
      const svg = d3.select(svgRef.current)
      svg.selectAll('*').remove()

      const { width, height } = dimensions
      const margin = { top: 40, right: 40, bottom: 40, left: 60 }
      const innerWidth = width - margin.left - margin.right
      const innerHeight = height - margin.top - margin.bottom

      const g = svg.append('g')
        .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')

      // Create radial scale
      const angleScale = d3.scaleBand()
        .domain(metricsData.map(d => d.category))
        .range([0, 2 * Math.PI])
        .padding(0.1)

      const radiusScale = d3.scaleLinear()
        .domain([0, 100])
        .range([0, Math.min(innerWidth, innerHeight) / 2])

      // Draw arcs
      const arcGenerator = d3.arc<MetricData>()
        .innerRadius(0)
        .outerRadius(d => radiusScale(d.value))
        .startAngle(d => angleScale(d.category) || 0)
        .endAngle(d => (angleScale(d.category) || 0) + (angleScale.bandwidth() || 0))

      // Add arcs
      g.selectAll('path')
        .data(metricsData)
        .join('path')
        .attr('d', arcGenerator)
        .attr('fill', d => {
          switch (d.impact) {
            case 'high': return '#4CAF50'
            case 'medium': return '#FFC107'
            case 'low': return '#FF5722'
            default: return '#9E9E9E'
          }
        })
        .attr('stroke', '#fff')
        .attr('stroke-width', 2)

      // Add labels
      g.selectAll('text')
        .data(metricsData)
        .join('text')
        .attr('transform', d => {
          const angle = (angleScale(d.category) || 0) + (angleScale.bandwidth() || 0) / 2
          const radius = radiusScale(d.value) + 10
          return 'translate(' + Math.sin(angle) * radius + ',' + -Math.cos(angle) * radius + ') rotate(' + ((angle * 180) / Math.PI - 90) + ')'
        })
        .attr('dy', '0.35em')
        .attr('text-anchor', 'middle')
        .text(d => `${d.category}: ${d.value}%`)
        .style('font-size', '12px')
        .style('fill', '#333')

      // Add trend indicators
      g.selectAll('.trend')
        .data(metricsData)
        .join('text')
        .attr('class', 'trend')
        .attr('transform', d => {
          const angle = (angleScale(d.category) || 0) + (angleScale.bandwidth() || 0) / 2
          const radius = radiusScale(d.value) - 20
          return 'translate(' + Math.sin(angle) * radius + ',' + -Math.cos(angle) * radius + ')'
        })
        .attr('dy', '0.35em')
        .attr('text-anchor', 'middle')
        .text(d => {
          switch (d.trend) {
            case 'up': return '↑'
            case 'down': return '↓'
            case 'stable': return '→'
            default: return ''
          }
        })
        .style('font-size', '16px')
        .style('fill', d => {
          switch (d.trend) {
            case 'up': return '#4CAF50'
            case 'down': return '#FF5722'
            case 'stable': return '#2196F3'
            default: return '#9E9E9E'
          }
        })

    } catch (error) {
      console.error('Error initializing Custom Metrics:', error)
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
    <VisualizationContainer 
      title="Custom Metrics Analysis"
      description="Visualization of custom DevRel metrics and their impact"
    >
      <div ref={wrapperRef} className="w-full aspect-[4/3] min-h-0">
        <svg
          ref={svgRef}
          className="w-full h-full"
          style={{ touchAction: 'none' }}
        />
      </div>
    </VisualizationContainer>
  )
}

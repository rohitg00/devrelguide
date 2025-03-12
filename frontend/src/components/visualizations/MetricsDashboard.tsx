'use client'

import React, { useEffect, useRef, useState } from 'react'
import { select } from 'd3-selection'
import { scaleLinear, scaleBand } from 'd3-scale'
import { axisBottom, axisLeft } from 'd3-axis'
import { line, curveBasis } from 'd3-shape'
import { extent } from 'd3-array'
import { format } from 'd3-format'
import { VisualizationContainer } from './VisualizationContainer'
import { useFetchVisualization, fallbackData, useResponsiveVisualizationSize, ensureWithinContainer } from '@/lib/visualization-utils'

interface MetricData {
  timestamp: string;
  engagement: number;
  growth: number;
  satisfaction: number;
}

interface RadialMetric {
  name: string;
  value: number;
  color: string;
}

export function MetricsDashboard() {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const radialRef = useRef<SVGSVGElement>(null)
  
  // Use our custom hook to fetch data with fallback and error handling
  const { data, loading, error, retry } = useFetchVisualization<any>({
    endpoint: '/api/visualizations/metrics',
    fallbackData: fallbackData.metrics
  })
  
  // Use responsive sizing hook
  const { width, height } = useResponsiveVisualizationSize(containerRef, 16/9)

  useEffect(() => {
    if (!svgRef.current || !data || loading) return

    try {
      const svg = select(svgRef.current)
      svg.selectAll('*').remove()

      // Use the containerized dimensions
      const { width: chartWidth, height: chartHeight } = ensureWithinContainer(width, height)
      
      // Set viewBox for SVG to ensure responsiveness
      svg
        .attr('width', chartWidth)
        .attr('height', chartHeight)
        .attr('viewBox', `0 0 ${chartWidth} ${chartHeight}`)
        .attr('preserveAspectRatio', 'xMidYMid meet')

      const margin = { top: 40, right: 30, bottom: 40, left: 50 }
      const innerWidth = chartWidth - margin.left - margin.right
      const innerHeight = chartHeight - margin.top - margin.bottom

      const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`)

      // Use data from our fetch hook, ensuring we have an array to work with
      const timeSeriesData = Array.isArray(data.data) ? data.data : []

      // Create x scale (time)
      const x = scaleBand()
        .domain(timeSeriesData.map(d => d.timestamp))
        .range([0, innerWidth])
        .padding(0.1)

      // Create y scale (metrics)
      const y = scaleLinear()
        .domain([0, 100])
        .range([innerHeight, 0])

      // Add x axis
      g.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0,${innerHeight})`)
        .call(axisBottom(x))
        .selectAll('text')
        .style('font-size', '12px')

      // Add y axis
      g.append('g')
        .attr('class', 'y-axis')
        .call(axisLeft(y).ticks(5).tickFormat(d => `${d}%`))
        .selectAll('text')
        .style('font-size', '12px')

      // Add y axis label
      g.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - margin.left)
        .attr('x', 0 - (innerHeight / 2))
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .style('font-size', '14px')
        .text('Performance (%)')

      // Define line generators for each metric
      const metricKeys = ['engagement', 'growth', 'satisfaction'] as const
      type MetricKey = typeof metricKeys[number]

      const colors: Record<MetricKey, string> = {
        engagement: '#4299E1', // blue
        growth: '#48BB78',     // green
        satisfaction: '#ED64A6' // pink
      }

      const createLinePath = (metric: MetricKey) => {
        return line<MetricData>()
          .x(d => x(d.timestamp)! + x.bandwidth() / 2)
          .y(d => y(d[metric]))
          .curve(curveBasis)
      }

      // Add lines for each metric
      metricKeys.forEach(metric => {
        g.append('path')
          .datum(timeSeriesData)
          .attr('fill', 'none')
          .attr('stroke', colors[metric])
          .attr('stroke-width', 3)
          .attr('d', createLinePath(metric))
      })

      // Add legend
      const legend = g.append('g')
        .attr('font-family', 'sans-serif')
        .attr('font-size', 12)
        .attr('text-anchor', 'start')
        .selectAll('g')
        .data(metricKeys)
        .enter().append('g')
        .attr('transform', (d, i) => `translate(0,${i * 20})`)

      legend.append('rect')
        .attr('x', innerWidth - 19)
        .attr('width', 19)
        .attr('height', 19)
        .attr('fill', d => colors[d])

      legend.append('text')
        .attr('x', innerWidth - 24)
        .attr('y', 9.5)
        .attr('dy', '0.32em')
        .attr('text-anchor', 'end')
        .text(d => d.charAt(0).toUpperCase() + d.slice(1))

      // Add title
      svg.append('text')
        .attr('x', chartWidth / 2)
        .attr('y', margin.top / 2)
        .attr('text-anchor', 'middle')
        .style('font-size', '16px')
        .style('font-weight', 'bold')
        .text('DevRel Performance Metrics Over Time')

    } catch (err) {
      console.error('Error rendering metrics chart:', err)
    }
  }, [data, loading, width, height])

  useEffect(() => {
    if (!radialRef.current || !data || loading) return

    try {
      const svg = select(radialRef.current)
      svg.selectAll('*').remove()

      // Use our responsive dimensions
      const { width: chartWidth, height: chartHeight } = ensureWithinContainer(width / 2, height)

      // Set viewBox for SVG to ensure responsiveness
      svg
        .attr('width', chartWidth)
        .attr('height', chartHeight)
        .attr('viewBox', `0 0 ${chartWidth} ${chartHeight}`)
        .attr('preserveAspectRatio', 'xMidYMid meet')

      const margin = { top: 40, right: 20, bottom: 20, left: 20 }
      const innerWidth = chartWidth - margin.left - margin.right
      const innerHeight = chartHeight - margin.top - margin.bottom
      
      const radius = Math.min(innerWidth, innerHeight) / 2
      
      const g = svg.append('g')
        .attr('transform', `translate(${chartWidth / 2},${chartHeight / 2})`)
      
      // Use radial metrics from our data, with fallback
      const metrics: RadialMetric[] = Array.isArray(data.metrics) ? data.metrics : []
      
      // Create a scale for the radius
      const valueScale = scaleLinear()
        .domain([0, 100])
        .range([0, radius])
      
      // Create a scale for the angles
      const angleScale = scaleBand()
        .domain(metrics.map(d => d.name))
        .range([0, 2 * Math.PI])
        .padding(0.15)
      
      // Draw the circles for reference
      const circles = [25, 50, 75, 100]
      
      circles.forEach(value => {
        g.append('circle')
          .attr('cx', 0)
          .attr('cy', 0)
          .attr('r', valueScale(value))
          .attr('fill', 'none')
          .attr('stroke', '#e2e8f0')
          .attr('stroke-width', 1)
          .attr('stroke-dasharray', '2,2')
        
        g.append('text')
          .attr('x', 0)
          .attr('y', -valueScale(value))
          .attr('dy', '-0.3em')
          .attr('text-anchor', 'middle')
          .attr('font-size', '10px')
          .attr('fill', '#718096')
          .text(`${value}%`)
      })
      
      // Draw a bar for each metric
      metrics.forEach(metric => {
        const angle = angleScale(metric.name) as number
        const barWidth = angleScale.bandwidth()
        
        const path = g.append('path')
          .attr('d', d => {
            const innerRadius = 0
            const outerRadius = valueScale(metric.value)
            const startAngle = angle
            const endAngle = angle + barWidth
            
            const arc = {
              innerRadius,
              outerRadius,
              startAngle,
              endAngle
            }
            
            // Build the arc path
            return `
              M ${innerRadius * Math.cos(startAngle)},${innerRadius * Math.sin(startAngle)}
              L ${outerRadius * Math.cos(startAngle)},${outerRadius * Math.sin(startAngle)}
              A ${outerRadius},${outerRadius} 0 0,1 ${outerRadius * Math.cos(endAngle)},${outerRadius * Math.sin(endAngle)}
              L ${innerRadius * Math.cos(endAngle)},${innerRadius * Math.sin(endAngle)}
              Z
            `
          })
          .attr('fill', metric.color)
          .attr('opacity', 0.8)
        
        // Add label
        const labelRadius = radius + 10
        const labelAngle = angle + barWidth / 2
        
        g.append('text')
          .attr('x', labelRadius * Math.cos(labelAngle))
          .attr('y', labelRadius * Math.sin(labelAngle))
          .attr('dy', '0.35em')
          .attr('transform', `rotate(${(labelAngle * 180 / Math.PI) + (labelAngle > Math.PI ? 180 : 0)}, ${labelRadius * Math.cos(labelAngle)}, ${labelRadius * Math.sin(labelAngle)})`)
          .attr('text-anchor', labelAngle > Math.PI ? 'start' : 'end')
          .attr('font-size', '12px')
          .attr('fill', '#4A5568')
          .text(metric.name)
        
        // Add value label
        const valueRadius = valueScale(metric.value) - 10
        const valueAngle = angle + barWidth / 2
        
        if (metric.value > 15) {
          g.append('text')
            .attr('x', valueRadius * Math.cos(valueAngle))
            .attr('y', valueRadius * Math.sin(valueAngle))
            .attr('dy', '0.35em')
            .attr('transform', `rotate(${(valueAngle * 180 / Math.PI) + (valueAngle > Math.PI && valueAngle < 2 * Math.PI ? 180 : 0)}, ${valueRadius * Math.cos(valueAngle)}, ${valueRadius * Math.sin(valueAngle)})`)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px')
            .attr('font-weight', 'bold')
            .attr('fill', 'white')
            .text(`${metric.value}%`)
        }
      })
      
      // Add title
      svg.append('text')
        .attr('x', chartWidth / 2)
        .attr('y', margin.top / 2)
        .attr('text-anchor', 'middle')
        .style('font-size', '16px')
        .style('font-weight', 'bold')
        .text('Current DevRel Metrics')

    } catch (err) {
      console.error('Error rendering radial chart:', err)
    }
  }, [data, loading, width, height])

  return (
    <div ref={containerRef}>
      <VisualizationContainer 
        title="DevRel Performance Metrics"
        description="Track key performance indicators and metrics over time"
        hasError={!!error}
        isLoading={loading}
        errorMessage={error ? error.message : ''}
        onRetry={retry}
      >
        <div className="flex flex-col md:flex-row">
          <svg ref={svgRef} className="w-full md:w-2/3" />
          <svg ref={radialRef} className="w-full md:w-1/3 mt-6 md:mt-0" />
        </div>
      </VisualizationContainer>
    </div>
  )
}

export default MetricsDashboard;

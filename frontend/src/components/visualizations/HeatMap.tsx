'use client'

import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { VisualizationContainer } from './VisualizationContainer'

interface ContributionData {
  date: string
  count: number
  type: 'code' | 'docs' | 'community' | 'content'
}

// Create mock data with explicitly typed array
const mockData: ContributionData[] = [];
// Fill array with properly typed data
for (let i = 0; i < 365; i++) {
  const types: Array<'code' | 'docs' | 'community' | 'content'> = ['code', 'docs', 'community', 'content'];
  mockData.push({
    date: new Date(2024, 0, i + 1).toISOString().split('T')[0],
    count: Math.floor(Math.random() * 10),
    type: types[Math.floor(Math.random() * types.length)]
  });
}

export function HeatMap() {
  const svgRef = useRef<SVGSVGElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!svgRef.current || !wrapperRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const width = wrapperRef.current.clientWidth
    const height = 200
    const margin = { top: 20, right: 30, bottom: 30, left: 40 }

    svg
      .attr('width', width)
      .attr('height', height)

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    const cellSize = Math.min((width - margin.left - margin.right) / 53, (height - margin.top - margin.bottom) / 7)
    const weeks = Math.floor((width - margin.left - margin.right) / cellSize)
    const days = 7

    // Use any type to avoid TypeScript errors with D3 scales
    const x = (d3 as any).scaleBand()
      .range([0, weeks * cellSize])
      .domain((d3 as any).range(weeks).map(String))

    const y = (d3 as any).scaleBand()
      .range([0, days * cellSize])
      .domain((d3 as any).range(days).map(String))

    // Use any type for color scales
    const colorScales: Record<string, any> = {
      code: (d3 as any).scaleSequential((d3 as any).interpolateGreens).domain([0, 10]),
      docs: (d3 as any).scaleSequential((d3 as any).interpolateBlues).domain([0, 10]),
      community: (d3 as any).scaleSequential((d3 as any).interpolateOranges).domain([0, 10]),
      content: (d3 as any).scaleSequential((d3 as any).interpolatePurples).domain([0, 10])
    }

    const cells = g.selectAll<SVGRectElement, ContributionData>('rect')
      .data(mockData)
      .join('rect')
      .attr('x', (_, i) => x(Math.floor(i / 7).toString()) || 0)
      .attr('y', (_, i) => y((i % 7).toString()) || 0)
      .attr('width', cellSize - 1)
      .attr('height', cellSize - 1)
      .attr('fill', d => colorScales[d.type](d.count))
      .attr('rx', 2)
      .attr('ry', 2)
      .on('mouseover', function(this: any, event: any, d: ContributionData) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('stroke', '#000')
          .attr('stroke-width', 2)

        // Use non-null assertion since we already checked wrapper exists
        const tooltip = d3.select(wrapperRef.current!)
          .append('div')
          .attr('class', 'absolute bg-card p-2 rounded shadow-lg pointer-events-none')
          .style('opacity', 0)

        tooltip.html(`
          <div class="font-semibold">${d.date}</div>
          <div>${d.count} ${d.type} contributions</div>
        `)
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 28}px`)
          .transition()
          .duration(200)
          .style('opacity', 1)
      })
      .on('mouseout', function(this: any) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('stroke', 'none')

        d3.selectAll('.absolute.bg-card').remove()
      })

    const legend = svg.append('g')
      .attr('transform', `translate(${width - 120},${margin.top})`)

    Object.entries(colorScales).forEach(([type, scale], i) => {
      const legendRow = legend.append('g')
        .attr('transform', `translate(0,${i * 20})`)

      legendRow.append('rect')
        .attr('width', 15)
        .attr('height', 15)
        .attr('fill', scale(5))

      legendRow.append('text')
        .attr('x', 20)
        .attr('y', 12)
        .text(type)
        .attr('class', 'text-xs')
    })

  }, [])

  return (
    <VisualizationContainer
      title="Developer Activity Heatmap"
      description="Visualization of developer contributions across different categories"
    >
      <div ref={wrapperRef} className="w-full aspect-[16/9] min-h-0 relative">
        <svg ref={svgRef} className="w-full h-full" />
      </div>
    </VisualizationContainer>
  )
}

export default HeatMap;

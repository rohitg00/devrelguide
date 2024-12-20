'use client'

import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { Card } from '../ui/card'

interface ContributionData {
  date: string
  count: number
  type: 'code' | 'docs' | 'community' | 'content'
}

const mockData: ContributionData[] = Array.from({ length: 365 }, (_, i) => ({
  date: new Date(2024, 0, i + 1).toISOString().split('T')[0],
  count: Math.floor(Math.random() * 10),
  type: ['code', 'docs', 'community', 'content'][Math.floor(Math.random() * 4)]
}))

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

    const x = d3.scaleBand()
      .range([0, weeks * cellSize])
      .domain(d3.range(weeks).map(String))

    const y = d3.scaleBand()
      .range([0, days * cellSize])
      .domain(d3.range(days).map(String))

    const colorScales = {
      code: d3.scaleSequential(d3.interpolateGreens).domain([0, 10]),
      docs: d3.scaleSequential(d3.interpolateBlues).domain([0, 10]),
      community: d3.scaleSequential(d3.interpolateOranges).domain([0, 10]),
      content: d3.scaleSequential(d3.interpolatePurples).domain([0, 10])
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
      .on('mouseover', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('stroke', '#000')
          .attr('stroke-width', 2)

        const tooltip = d3.select(wrapperRef.current)
          .append('div')
          .attr('class', 'absolute bg-white p-2 rounded shadow-lg pointer-events-none')
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
      .on('mouseout', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('stroke', 'none')

        d3.selectAll('.absolute.bg-white').remove()
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
    <Card className="p-4 sm:p-6">
      <h3 className="text-lg font-semibold mb-4">Developer Activity Heatmap</h3>
      <div ref={wrapperRef} className="w-full aspect-[16/9] min-h-0 relative">
        <svg ref={svgRef} className="w-full h-full" />
      </div>
    </Card>
  )
}

export { HeatMap };
export default HeatMap;

'use client'

import React, { useMemo, useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts'
import { VisualizationContainer } from './VisualizationContainer'

interface SkillMetric {
  date: string
  value: number
  category: string
  proficiency: number
}

interface RidgelineData {
  category: string
  description: string
  data: SkillMetric[]
}

const generateRidgelineData = (): RidgelineData[] => {
  const categories = [
    { name: 'API Development', description: 'RESTful and GraphQL API design' },
    { name: 'Documentation', description: 'Technical writing and docs' },
    { name: 'Community', description: 'Community engagement' },
    { name: 'Content', description: 'Tutorials and guides' },
    { name: 'Support', description: 'Developer assistance' }
  ]
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']

  return categories.map(({ name, description }) => ({
    category: name,
    description,
    data: months.map((month, index) => ({
      date: month,
      value: Math.sin(index / 2) * 15 + Math.random() * 10 + 50,
      category: name,
      proficiency: Math.random() * 20 + 70
    }))
  }))
}

const COLORS = {
  'API Development': '#8B5CF6',
  'Documentation': '#10B981',
  'Community': '#F59E0B',
  'Content': '#EC4899',
  'Support': '#3B82F6'
} as const

export function RidgelinePlot() {
  const data = useMemo(() => generateRidgelineData(), [])
  const [hoveredCategory, setHoveredCategory] = React.useState<string | null>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (wrapperRef.current && svgRef.current) {
      const svg = d3.select(svgRef.current)
      const width = wrapperRef.current.clientWidth
      const height = wrapperRef.current.clientHeight

      const xScale = d3.scaleLinear()
        .domain([0, data.length - 1])
        .range([0, width])

      const yScale = d3.scaleLinear()
        .domain([0, 100])
        .range([height, 0])

      svg.selectAll('*').remove()

      const g = svg.append('g')

      data.forEach((categoryData, index) => {
        g.append('path')
          .attr('d', d3.line()
            .x((d, i) => xScale(i))
            .y((d) => yScale(d.value))
            .curve(d3.curveBasis)
          )
          .attr('fill', 'none')
          .attr('stroke', COLORS[categoryData.category as keyof typeof COLORS])
          .attr('stroke-width', 2)
      })

      svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale))
        .selectAll('text')
        .attr('class', 'axis-label')

      svg.append('g')
        .call(d3.axisLeft(yScale))
        .selectAll('text')
        .attr('class', 'axis-label')

      svg.append('text')
        .attr('x', width / 2)
        .attr('y', height + 30)
        .attr('text-anchor', 'middle')
        .attr('class', 'axis-label')
        .text('Time')

      svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -height / 2)
        .attr('y', -30)
        .attr('text-anchor', 'middle')
        .attr('class', 'axis-label')
        .text('Proficiency')

      svg.append('g')
        .attr('class', 'legend')
        .selectAll('rect')
        .data(Object.entries(COLORS))
        .enter()
        .append('rect')
        .attr('x', width + 10)
        .attr('y', (d, i) => i * 20)
        .attr('width', 10)
        .attr('height', 10)
        .attr('fill', (d) => d[1])

      svg.append('text')
        .attr('x', width + 20)
        .attr('y', (d, i) => i * 20 + 10)
        .attr('text-anchor', 'start')
        .attr('class', 'legend-label')
        .text((d) => d[0])

      svg.append('g')
        .attr('class', 'tooltip')
        .attr('fill', 'none')
        .attr('stroke', 'black')
        .attr('stroke-width', 1)

      svg.append('g')
        .attr('class', 'tooltip-content')
        .attr('fill', 'white')
        .attr('stroke', 'none')
        .attr('text-anchor', 'start')

      svg.selectAll('.tooltip')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', (d, i) => xScale(i))
        .attr('cy', (d) => yScale(d.value))
        .attr('r', 5)
        .attr('class', 'tooltip-circle')
        .attr('fill', (d) => COLORS[d.category as keyof typeof COLORS])
        .attr('opacity', 0)

      svg.selectAll('.tooltip-circle')
        .on('mouseover', function(event, d) {
          d3.select(this).attr('opacity', 0.5)
          d3.select('.tooltip')
            .attr('transform', `translate(${event.pageX + 10}, ${event.pageY - 10})`)
          d3.select('.tooltip-content')
            .text(`${d.category}: ${Math.round(d.value)}%`)
        })
        .on('mouseout', function() {
          d3.select(this).attr('opacity', 0)
          d3.select('.tooltip')
            .attr('transform', `translate(0, 0)`)
          d3.select('.tooltip-content')
            .text('')
        })
    }
  }, [data])

  return (
    <VisualizationContainer
      title="Developer Skills Ridgeline Plot"
      description="Visualization of developer skills distribution across different domains"
    >
      <div ref={wrapperRef} className="w-full h-[500px]">
        <svg ref={svgRef} className="w-full h-full" />
      </div>
    </VisualizationContainer>
  )
}

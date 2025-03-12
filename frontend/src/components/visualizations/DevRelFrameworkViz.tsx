'use client'

import React, { useEffect, useRef } from 'react'
import { VisualizationContainer } from './VisualizationContainer'
import * as d3 from 'd3'

interface FrameworkDimension {
  aspect: string
  current: number
  target: number
  industry: number
}

const frameworkData: FrameworkDimension[] = [
  {
    aspect: 'Technical Education',
    current: 65,
    target: 85,
    industry: 75
  },
  {
    aspect: 'Community Building',
    current: 80,
    target: 90,
    industry: 70
  },
  {
    aspect: 'Product Feedback',
    current: 70,
    target: 80,
    industry: 65
  },
  {
    aspect: 'Content Strategy',
    current: 75,
    target: 85,
    industry: 80
  },
  {
    aspect: 'Developer Experience',
    current: 60,
    target: 95,
    industry: 85
  },
  {
    aspect: 'Ecosystem Growth',
    current: 85,
    target: 90,
    industry: 75
  }
]

interface FrameworkLink {
  source: string
  target: string
  strength: number
  type: 'primary' | 'secondary'
}

const frameworkLinks: FrameworkLink[] = [
  { source: 'Technical Education', target: 'Developer Experience', strength: 0.8, type: 'primary' },
  { source: 'Technical Education', target: 'Content Strategy', strength: 0.7, type: 'primary' },
  { source: 'Community Building', target: 'Ecosystem Growth', strength: 0.9, type: 'primary' },
  { source: 'Community Building', target: 'Product Feedback', strength: 0.6, type: 'secondary' },
  { source: 'Product Feedback', target: 'Developer Experience', strength: 0.8, type: 'primary' },
  { source: 'Content Strategy', target: 'Ecosystem Growth', strength: 0.7, type: 'secondary' },
  { source: 'Developer Experience', target: 'Ecosystem Growth', strength: 0.8, type: 'primary' }
]

export function DevRelFrameworkViz() {
  const svgRef = useRef<SVGSVGElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!svgRef.current || !wrapperRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const width = wrapperRef.current.clientWidth
    const height = 600
    const margin = { top: 40, right: 40, bottom: 40, left: 40 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    svg.attr('width', width).attr('height', height)

    const defs = svg.append('defs')

    const filter = defs.append('filter')
      .attr('id', 'glow')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%')

    filter.append('feGaussianBlur')
      .attr('stdDeviation', '2')
      .attr('result', 'coloredBlur')

    const feMerge = filter.append('feMerge')
    feMerge.append('feMergeNode').attr('in', 'coloredBlur')
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic')

    const nodeColorScale = d3.scaleLinear<string>()
      .domain([0, 50, 100])
      .range(['#ff4d4d', '#4dabf7', '#40c057'])

    const linkColorScale = d3.scaleOrdinal<string>()
      .domain(['primary', 'secondary'])
      .range(['rgba(64, 192, 87, 0.6)', 'rgba(73, 80, 246, 0.4)'])

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    const simulation = d3.forceSimulation(frameworkData)
      .force('link', d3.forceLink(frameworkLinks)
        .id(d => (d as any).aspect)
        .distance(d => 150 * (1 - (d as any).strength))
        .strength(d => (d as any).strength))
      .force('charge', d3.forceManyBody().strength(-400))
      .force('center', d3.forceCenter(innerWidth / 2, innerHeight / 2))
      .force('collision', d3.forceCollide().radius(60))

    const links = g.append('g')
      .selectAll('line')
      .data(frameworkLinks)
      .join('line')
      .attr('stroke', d => linkColorScale(d.type))
      .attr('stroke-width', d => d.strength * 4)
      .attr('stroke-dasharray', d => d.type === 'secondary' ? '5,5' : '')
      .style('filter', 'url(#glow)')

    const nodes = g.append('g')
      .selectAll('g')
      .data(frameworkData)
      .join('g')
      .attr('cursor', 'pointer')
      .call(drag(simulation))

    nodes.append('circle')
      .attr('r', d => Math.sqrt(d.current) * 1.5)
      .attr('fill', d => nodeColorScale(d.current))
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .style('filter', 'url(#glow)')

    nodes.append('text')
      .attr('dy', 4)
      .attr('text-anchor', 'middle')
      .attr('class', 'font-semibold text-sm')
      .text(d => d.aspect)
      .style('filter', 'url(#glow)')

    nodes.append('title')
      .text(d => `${d.aspect}\nCurrent: ${d.current}%\nTarget: ${d.target}%\nIndustry: ${d.industry}%`)

    simulation.on('tick', () => {
      links
        .attr('x1', d => (d.source as any).x)
        .attr('y1', d => (d.source as any).y)
        .attr('x2', d => (d.target as any).x)
        .attr('y2', d => (d.target as any).y)

      nodes.attr('transform', d => `translate(${(d as any).x},${(d as any).y})`)
    })

    function drag(simulation: d3.Simulation<any, undefined>) {
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

      return d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended)
    }

  }, [])

  return (
    <VisualizationContainer
      title="DevRel Framework Analysis"
      description="Interactive visualization showing relationships and impact flows between DevRel framework dimensions"
    >
      <div>
        <div ref={wrapperRef} className="w-full h-[600px]">
          <svg ref={svgRef} className="w-full h-full" />
        </div>
        <div className="mt-4 text-sm text-gray-600">
          <p className="mb-2">Framework dimensions represent key aspects of Developer Relations:</p>
          <ul className="list-disc ml-6 space-y-1">
            <li>Node size indicates current performance level</li>
            <li>Node color shows performance (red: low, blue: medium, green: high)</li>
            <li>Solid lines show primary relationships</li>
            <li>Dashed lines show secondary influences</li>
            <li>Line thickness indicates relationship strength</li>
          </ul>
        </div>
      </div>
    </VisualizationContainer>
  )
}

export default DevRelFrameworkViz;

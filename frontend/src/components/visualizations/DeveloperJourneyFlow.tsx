'use client'

import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { VisualizationContainer } from './VisualizationContainer'
import { Card } from '@/components/ui/card'

interface TouchPoint {
  name: string
  type: 'owned' | 'earned'
  stage: number
  impact: number
  category: 'content' | 'community' | 'technical' | 'support'
}

interface JourneyStage {
  name: string
  description: string
  goal: string
  questions: string[]
  touchpoints: TouchPoint[]
}

const journeyStages: JourneyStage[] = [
  {
    name: 'Awareness',
    description: 'Developer discovers and learns about the platform',
    goal: 'Understand what the platform offers',
    questions: [
      'What problem does it solve?',
      'Is it relevant to my needs?',
      'How mature is the platform?'
    ],
    touchpoints: [
      { name: 'Blog Posts', type: 'owned', stage: 0, impact: 80, category: 'content' },
      { name: 'Social Media', type: 'earned', stage: 0, impact: 70, category: 'community' },
      { name: 'Developer Events', type: 'earned', stage: 0, impact: 85, category: 'community' }
    ]
  },
  {
    name: 'Exploration',
    description: 'Developer investigates platform capabilities',
    goal: 'Evaluate technical fit and requirements',
    questions: [
      'How does it integrate?',
      'What are the costs?',
      'How is the documentation?'
    ],
    touchpoints: [
      { name: 'Documentation', type: 'owned', stage: 1, impact: 90, category: 'content' },
      { name: 'Code Samples', type: 'owned', stage: 1, impact: 85, category: 'technical' },
      { name: 'Community Forums', type: 'earned', stage: 1, impact: 75, category: 'community' }
    ]
  },
  {
    name: 'Integration',
    description: 'Developer starts implementing the solution',
    goal: 'Successfully integrate the platform',
    questions: [
      'How do I get started?',
      'Where do I get help?',
      'What are best practices?'
    ],
    touchpoints: [
      { name: 'Technical Support', type: 'owned', stage: 2, impact: 95, category: 'support' },
      { name: 'API Reference', type: 'owned', stage: 2, impact: 90, category: 'technical' },
      { name: 'Stack Overflow', type: 'earned', stage: 2, impact: 80, category: 'community' }
    ]
  },
  {
    name: 'Adoption',
    description: 'Developer uses platform in production',
    goal: 'Achieve business value from platform',
    questions: [
      'How do I optimize usage?',
      'What are others doing?',
      'How do I scale?'
    ],
    touchpoints: [
      { name: 'Case Studies', type: 'owned', stage: 3, impact: 85, category: 'content' },
      { name: 'User Groups', type: 'earned', stage: 3, impact: 80, category: 'community' },
      { name: 'Advanced Guides', type: 'owned', stage: 3, impact: 90, category: 'technical' }
    ]
  },
  {
    name: 'Advocacy',
    description: 'Developer becomes platform champion',
    goal: 'Share success and contribute back',
    questions: [
      'How can I contribute?',
      'Where can I share?',
      'How do I connect with others?'
    ],
    touchpoints: [
      { name: 'Speaking Opportunities', type: 'earned', stage: 4, impact: 90, category: 'community' },
      { name: 'Content Creation', type: 'owned', stage: 4, impact: 85, category: 'content' },
      { name: 'Mentorship Program', type: 'owned', stage: 4, impact: 95, category: 'support' }
    ]
  }
]

const colorScale = d3.scaleOrdinal()
  .domain(['content', 'community', 'technical', 'support'])
  .range(['#4CAF50', '#FFC107', '#9C27B0', '#FF5722'])

export function DeveloperJourneyFlow() {
  const svgRef = useRef<SVGSVGElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!svgRef.current || !wrapperRef.current) return

    const handleResize = () => {
      if (!svgRef.current || !wrapperRef.current) return
      
      const svg = d3.select(svgRef.current)
      svg.selectAll('*').remove()

      const width = wrapperRef.current.clientWidth
      const height = wrapperRef.current.clientHeight || 600 // Fallback height
      const margin = { top: 60, right: 120, bottom: 60, left: 120 }
      const innerWidth = width - margin.left - margin.right
      const innerHeight = height - margin.top - margin.bottom
      
      svg.attr('width', width).attr('height', height)

      const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`)

      const x = d3.scaleLinear()
        .domain([0, journeyStages.length - 1])
        .range([0, innerWidth])

      const y = d3.scaleLinear()
        .domain([0, 100])
        .range([innerHeight, 0])

      const pathData = d3.line<number>()
        .x(d => x(d))
        .y(() => y(50))
        .curve(d3.curveBasis)
        (d3.range(journeyStages.length))

      const gradient = svg.append('defs')
        .append('linearGradient')
        .attr('id', 'journey-gradient')
        .attr('gradientUnits', 'userSpaceOnUse')
        .attr('x1', 0)
        .attr('y1', y(50))
        .attr('x2', innerWidth)
        .attr('y2', y(50))

      gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', '#2196F3')
        .attr('stop-opacity', 0.8)

      gradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', '#4CAF50')
        .attr('stop-opacity', 0.8)

      const path = g.append('path')
        .datum(pathData)
        .attr('class', 'journey-path')
        .attr('d', d => d)
        .attr('stroke', 'url(#journey-gradient)')
        .attr('stroke-width', 6)
        .attr('fill', 'none')
        .attr('stroke-dasharray', function() {
          const length = (this as SVGPathElement).getTotalLength()
          return `${length} ${length}`
        })
        .attr('stroke-dashoffset', function() {
          return (this as SVGPathElement).getTotalLength()
        })

      path.transition()
        .duration(2000)
        .attr('stroke-dashoffset', 0)

      const stages = g.selectAll('.stage')
        .data(journeyStages)
        .join('g')
        .attr('class', 'stage')
        .attr('transform', (_, i) => `translate(${x(i)},${y(50)})`)
        .style('cursor', 'pointer')

      stages.append('circle')
        .attr('r', 16)
        .attr('fill', '#2196F3')
        .attr('stroke', 'white')
        .attr('stroke-width', 3)
        .style('filter', 'url(#glow)')

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
      feMerge.append('feMergeNode')
        .attr('in', 'coloredBlur')
      feMerge.append('feMergeNode')
        .attr('in', 'SourceGraphic')

      stages.append('text')
        .attr('y', -30)
        .attr('text-anchor', 'middle')
        .attr('class', 'font-semibold text-sm')
        .text(d => d.name)
        .style('filter', 'url(#glow)')

      journeyStages.forEach((stage, stageIndex) => {
        const simulation = d3.forceSimulation(stage.touchpoints)
          .force('x', d3.forceX(0).strength(0.1))
          .force('y', d3.forceY(d => d.type === 'owned' ? -60 : 60).strength(0.1))
          .force('collide', d3.forceCollide().radius(30))
          .stop()

        for (let i = 0; i < 120; ++i) simulation.tick()

        const touchpointGroups = g.selectAll(`.touchpoint-${stageIndex}`)
          .data(stage.touchpoints)
          .join('g')
          .attr('class', `touchpoint-${stageIndex}`)
          .attr('transform', (d: any) => `translate(${x(stageIndex) + d.x},${y(50) + d.y})`)
          .style('cursor', 'pointer')
          .on('mouseover', function(event, d) {
            d3.select(this).select('circle')
              .transition()
              .duration(200)
              .attr('r', 12)
              .attr('stroke-width', 3)

            const tooltip = g.append('g')
              .attr('class', 'tooltip')
              .attr('transform', `translate(${x(stageIndex) + (d as any).x},${y(50) + (d as any).y - 40})`)

            tooltip.append('rect')
              .attr('fill', 'white')
              .attr('stroke', colorScale(d.category))
              .attr('rx', 4)
              .attr('ry', 4)
              .attr('width', 120)
              .attr('height', 60)
              .attr('x', -60)
              .attr('y', -30)

            tooltip.append('text')
              .attr('text-anchor', 'middle')
              .attr('y', -15)
              .attr('fill', 'currentColor')
              .text(d.name)

            tooltip.append('text')
              .attr('text-anchor', 'middle')
              .attr('y', 5)
              .attr('fill', 'currentColor')
              .text(`Impact: ${d.impact}%`)

            tooltip.append('text')
              .attr('text-anchor', 'middle')
              .attr('y', 25)
              .attr('fill', 'currentColor')
              .text(`Type: ${d.type}`)
          })
          .on('mouseout', function() {
            d3.select(this).select('circle')
              .transition()
              .duration(200)
              .attr('r', 8)
              .attr('stroke-width', 2)
            g.selectAll('.tooltip').remove()
          })

        touchpointGroups.append('circle')
          .attr('r', 8)
          .attr('fill', d => colorScale(d.category))
          .attr('stroke', d => d.type === 'owned' ? 'white' : '#333')
          .attr('stroke-width', 2)
          .style('filter', 'url(#glow)')

        touchpointGroups.append('text')
          .attr('x', 12)
          .attr('y', 4)
          .attr('class', 'text-xs')
          .text(d => d.name)
      })

      const legend = svg.append('g')
        .attr('transform', `translate(${width - 100},${margin.top})`)

      const categories = ['content', 'community', 'technical', 'support']
      categories.forEach((category, i) => {
        const g = legend.append('g')
          .attr('transform', `translate(0,${i * 25})`)
          .style('cursor', 'pointer')

        g.append('circle')
          .attr('r', 6)
          .attr('fill', colorScale(category))
          .style('filter', 'url(#glow)')

        g.append('text')
          .attr('x', 12)
          .attr('y', 4)
          .attr('class', 'text-xs')
          .text(category.charAt(0).toUpperCase() + category.slice(1))
      })
    }
    
    // Initial render
    handleResize()
    
    // Setup resize handler
    window.addEventListener('resize', handleResize)
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, []) // Only run on mount

  return (
    <VisualizationContainer
      title="Developer Journey Flow"
      description="Interactive visualization of the developer journey through different stages of platform adoption and engagement."
    >
      <div ref={wrapperRef} className="w-full h-[600px]">
        <svg ref={svgRef} className="w-full h-full" />
      </div>
    </VisualizationContainer>
  )
}

export default DeveloperJourneyFlow;

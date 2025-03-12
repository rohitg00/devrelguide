'use client'

import React, { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { VisualizationContainer } from './VisualizationContainer'

interface SkillPoint {
  skill: string
  proficiency: number
  frequency: number
  category: string
  growth: number
  impact: number
  description: string
  prerequisites: string[]
}

const generateBeeswarmData = (): SkillPoint[] => {
  const skills = [
    { name: 'Technical Writing', category: 'Content', description: 'Creating clear and concise documentation', prerequisites: [] },
    { name: 'API Design', category: 'Technical', description: 'Designing RESTful and GraphQL APIs', prerequisites: ['Technical Writing'] },
    { name: 'Community Building', category: 'Community', description: 'Engaging and growing developer communities', prerequisites: [] },
    { name: 'Public Speaking', category: 'Advocacy', description: 'Delivering talks and presentations', prerequisites: ['Community Building'] },
    { name: 'Data Analysis', category: 'Analytics', description: 'Analyzing data to derive insights', prerequisites: [] },
    { name: 'Documentation', category: 'Content', description: 'Maintaining and updating technical documents', prerequisites: ['Technical Writing'] },
    { name: 'Event Planning', category: 'Community', description: 'Organizing developer events and meetups', prerequisites: ['Community Building'] },
    { name: 'Code Reviews', category: 'Technical', description: 'Reviewing code for quality and standards', prerequisites: ['API Design'] },
    { name: 'Social Media', category: 'Advocacy', description: 'Managing social media presence', prerequisites: ['Community Building'] },
    { name: 'Metrics Tracking', category: 'Analytics', description: 'Tracking and reporting on key metrics', prerequisites: ['Data Analysis'] },
    { name: 'SDK Development', category: 'Technical', description: 'Developing software development kits', prerequisites: ['API Design'] },
    { name: 'Content Strategy', category: 'Content', description: 'Planning and executing content strategies', prerequisites: ['Documentation'] },
    { name: 'Workshop Design', category: 'Education', description: 'Creating educational workshops', prerequisites: ['Public Speaking'] },
    { name: 'Video Production', category: 'Content', description: 'Producing video content', prerequisites: ['Content Strategy'] },
    { name: 'Community Metrics', category: 'Analytics', description: 'Analyzing community engagement metrics', prerequisites: ['Metrics Tracking'] }
  ]

  return skills.flatMap((skill) => {
    return Array.from({ length: 10 }, () => {
      const baseValue = Math.random() * 60 + 20
      const jitter = Math.random() * 20 - 10
      return {
        skill: skill.name,
        proficiency: Math.min(Math.max(baseValue + jitter, 0), 100),
        frequency: Math.random() * 100,
        category: skill.category,
        growth: Math.random() * 30 + 10,
        impact: Math.random() * 40 + 50,
        description: skill.description,
        prerequisites: skill.prerequisites || []
      }
    })
  })
}

const colorScale = d3.scaleOrdinal<string>()
  .domain(['Content', 'Technical', 'Community', 'Advocacy', 'Analytics', 'Education'])
  .range(['#8B5CF6', '#10B981', '#F59E0B', '#EC4899', '#3B82F6', '#6366F1'])

export function BeeswarmSkills() {
  const svgRef = useRef<SVGSVGElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [selectedSkill, setSelectedSkill] = useState<SkillPoint | null>(null)

  useEffect(() => {
    if (!svgRef.current || !wrapperRef.current) return

    const data = generateBeeswarmData()
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const margin = { top: 40, right: 120, bottom: 40, left: 120 }
    const width = wrapperRef.current.clientWidth
    const height = 600
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    const x = d3.scaleLinear()
      .domain([0, 100])
      .range([0, innerWidth])

    const y = d3.scaleBand()
      .domain(Array.from(new Set(data.map(d => d.skill))))
      .range([0, innerHeight])
      .padding(0.2)

    const xAxis = g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x))
      .call(g => g.select('.domain').attr('stroke', '#9CA3AF'))
      .call(g => g.selectAll('.tick line').attr('stroke', '#E5E7EB'))

    xAxis.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', 35)
      .attr('fill', 'currentColor')
      .attr('text-anchor', 'middle')
      .text('Proficiency Level')

    const yAxis = g.append('g')
      .call(d3.axisLeft(y))
      .call(g => g.select('.domain').attr('stroke', '#9CA3AF'))
      .call(g => g.selectAll('.tick line').attr('stroke', '#E5E7EB'))

    const simulation = d3.forceSimulation(data)
      .force('x', d3.forceX(d => x(d.proficiency)).strength(1))
      .force('y', d3.forceY(d => y(d.skill)! + y.bandwidth() / 2))
      .force('collide', d3.forceCollide(5))
      .stop()

    for (let i = 0; i < 120; ++i) simulation.tick()

    const points = g.append('g')
      .selectAll('circle')
      .data(data)
      .join('circle')
      .attr('cx', d => d.x!)
      .attr('cy', d => d.y!)
      .attr('r', d => 4 + (d.impact / 30))
      .attr('fill', d => colorScale(d.category))
      .attr('opacity', 0.7)
      .attr('stroke', '#fff')
      .attr('stroke-width', 1)
      .on('mouseover', function(event, d) {
        d3.select(this)
          .attr('r', d => 6 + (d.impact / 30))
          .attr('opacity', 1)
          .attr('stroke-width', 2)
        setSelectedSkill(d)
      })
      .on('mouseout', function() {
        d3.select(this)
          .attr('r', d => 4 + (d.impact / 30))
          .attr('opacity', 0.7)
          .attr('stroke-width', 1)
        setSelectedSkill(null)
      })

    const skillGroups = d3.group(data, d => d.skill)
    skillGroups.forEach((points, skill) => {
      const avgPoints = d3.mean(points, d => d.proficiency)!
      const nextSkill = data.find(d =>
        d.prerequisites?.includes(skill) &&
        d3.mean(skillGroups.get(d.skill)!, d => d.proficiency)! > avgPoints
      )

      if (nextSkill) {
        g.append('path')
          .attr('d', `M${x(avgPoints)},${y(skill)! + y.bandwidth() / 2}
                     L${x(d3.mean(skillGroups.get(nextSkill.skill)!, d => d.proficiency)!)},
                     ${y(nextSkill.skill)! + y.bandwidth() / 2}`)
          .attr('stroke', '#E5E7EB')
          .attr('stroke-width', 1)
          .attr('stroke-dasharray', '4,4')
          .attr('opacity', 0.5)
      }
    })

  }, [])

  return (
    <VisualizationContainer
      title="Developer Skills Distribution"
      description="Beeswarm visualization showing the distribution of developer skills"
    >
      <div ref={wrapperRef} className="w-full h-[500px]">
        <svg ref={svgRef} className="w-full h-full" />
      </div>
    </VisualizationContainer>
  )
}

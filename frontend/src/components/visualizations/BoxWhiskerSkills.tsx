'use client'

import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { VisualizationContainer } from './VisualizationContainer'

interface SkillMetric {
  category: string
  distribution: number[]
  quantiles: {
    min: number
    q1: number
    median: number
    q3: number
    max: number
  }
  density: number[]
}

const generateDensityData = (data: number[]): number[] => {
  const kde = (kernel: (v: number) => number, thresholds: number[], data: number[]) => {
    return thresholds.map(t => [t, d3.mean(data, d => kernel(t - d)) || 0])
  }

  const epanechnikov = (bandwidth: number) => {
    return (x: number) => Math.abs(x /= bandwidth) <= 1 ? 0.75 * (1 - x * x) / bandwidth : 0
  }

  const thresholds = d3.range(0, 100, 1)
  return kde(epanechnikov(7), thresholds, data).map(d => d[1])
}

const skillsData: SkillMetric[] = [
  {
    category: 'Technical Writing',
    distribution: Array.from({ length: 100 }, () =>
      Math.floor(50 + 25 * (Math.random() + Math.random() - 1))
    ),
    quantiles: {
      min: 20,
      q1: 35,
      median: 50,
      q3: 65,
      max: 80
    },
    density: []
  },
  {
    category: 'Community Management',
    distribution: Array.from({ length: 100 }, () =>
      Math.floor(60 + 25 * (Math.random() + Math.random() - 1))
    ),
    quantiles: {
      min: 30,
      q1: 45,
      median: 60,
      q3: 75,
      max: 90
    },
    density: []
  },
  {
    category: 'Public Speaking',
    distribution: Array.from({ length: 100 }, () =>
      Math.floor(55 + 25 * (Math.random() + Math.random() - 1))
    ),
    quantiles: {
      min: 25,
      q1: 40,
      median: 55,
      q3: 70,
      max: 85
    },
    density: []
  }
].map(skill => ({
  ...skill,
  density: generateDensityData(skill.distribution)
}))

export function BoxWhiskerSkills() {
  const svgRef = useRef<SVGSVGElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!svgRef.current || !wrapperRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const width = wrapperRef.current.clientWidth
    const height = wrapperRef.current.clientHeight
    const margin = { top: 40, right: 100, bottom: 40, left: 100 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    const g = svg
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // Scales
    const x = d3.scaleBand()
      .domain(skillsData.map(d => d.category))
      .range([0, innerWidth])
      .padding(0.2)

    const y = d3.scaleLinear()
      .domain([0, 100])
      .range([innerHeight, 0])

    // Add axes
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x))

    g.append('g')
      .call(d3.axisLeft(y))

    // Create violin plots
    const violinWidth = x.bandwidth() / 2

    skillsData.forEach(skill => {
      const xPos = x(skill.category)!
      const violinArea = d3.area()
        .x0(d => xPos + violinWidth - d * violinWidth * 4)
        .x1(d => xPos + violinWidth + d * violinWidth * 4)
        .y((_, i) => y(i))
        .curve(d3.curveCatmullRom)

      // Draw violin shape
      g.append('path')
        .datum(skill.density)
        .attr('d', violinArea)
        .attr('fill', '#8884d8')
        .attr('opacity', 0.6)

      // Add quantile lines
      const quantileColor = '#2c3e50'
      const lineWidth = violinWidth * 1.5

      // Min line
      g.append('line')
        .attr('x1', xPos + violinWidth - lineWidth/2)
        .attr('x2', xPos + violinWidth + lineWidth/2)
        .attr('y1', y(skill.quantiles.min))
        .attr('y2', y(skill.quantiles.min))
        .attr('stroke', quantileColor)
        .attr('stroke-width', 2)

      // Max line
      g.append('line')
        .attr('x1', xPos + violinWidth - lineWidth/2)
        .attr('x2', xPos + violinWidth + lineWidth/2)
        .attr('y1', y(skill.quantiles.max))
        .attr('y2', y(skill.quantiles.max))
        .attr('stroke', quantileColor)
        .attr('stroke-width', 2)

      // Box
      g.append('rect')
        .attr('x', xPos + violinWidth - lineWidth/3)
        .attr('y', y(skill.quantiles.q3))
        .attr('width', lineWidth/1.5)
        .attr('height', y(skill.quantiles.q1) - y(skill.quantiles.q3))
        .attr('fill', 'none')
        .attr('stroke', quantileColor)
        .attr('stroke-width', 2)

      // Median line
      g.append('line')
        .attr('x1', xPos + violinWidth - lineWidth/2)
        .attr('x2', xPos + violinWidth + lineWidth/2)
        .attr('y1', y(skill.quantiles.median))
        .attr('y2', y(skill.quantiles.median))
        .attr('stroke', quantileColor)
        .attr('stroke-width', 2)
    })

  }, [])

  return (
    <VisualizationContainer
      title="Developer Skills Distribution"
      description="Box and whisker plot showing the distribution of developer skills"
    >
      <div ref={wrapperRef} className="w-full h-[600px]">
        <svg ref={svgRef} className="w-full h-full" />
      </div>
    </VisualizationContainer>
  )
}

export default BoxWhiskerSkills;

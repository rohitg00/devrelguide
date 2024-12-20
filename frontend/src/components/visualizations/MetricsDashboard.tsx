'use client'

import React, { useEffect, useRef, useState } from 'react'
import { select } from 'd3-selection'
import { arc } from 'd3-shape'
import { interpolate } from 'd3-interpolate'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import { debounce } from '@/lib/utils'

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
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 })
  const [data, setData] = useState<MetricData[]>([])
  const [error, setError] = useState<Error | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const updateDimensions = () => {
      if (!containerRef.current) return
      const { width: containerWidth } = containerRef.current.getBoundingClientRect()
      const width = Math.max(Math.min(containerWidth * 0.95, 1200), 375)
      const height = Math.min(400, Math.max(width * 0.5, 300))
      setDimensions({ width, height })
    }

    const debouncedUpdateDimensions = debounce(updateDimensions, 250)
    const resizeObserver = new ResizeObserver(debouncedUpdateDimensions)

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
      updateDimensions()
    }

    return () => {
      resizeObserver.disconnect()
    }
  }, [mounted])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/visualizations/metrics', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          credentials: 'same-origin'
        })
        if (!response.ok) throw new Error('Failed to fetch metrics data')
        const data = await response.json()
        setData(data)
      } catch (error) {
        console.error('Error fetching metrics data:', error)
        setError(error as Error)
      }
    }

    if (mounted) fetchData()
  }, [mounted])

  useEffect(() => {
    if (!svgRef.current || !data.length || !mounted) return

    try {
      const svg = select(svgRef.current)
      svg.selectAll('*').remove()

      const margin = { top: 40, right: 30, bottom: 40, left: 50 }
      const width = dimensions.width - margin.left - margin.right
      const height = dimensions.height - margin.top - margin.bottom

      const g = svg
        .attr('width', dimensions.width)
        .attr('height', dimensions.height)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`)

      const metricKeys = ['engagement', 'growth', 'satisfaction'] as const
      type MetricKey = typeof metricKeys[number]

      const metricCards = data.map((d, i) => ({
        name: ['Engagement', 'Growth', 'Satisfaction'][i],
        current: d[metricKeys[i]],
        previous: (data[data.length - 2] || d)[metricKeys[i]],
        color: [`var(--primary)`, `var(--secondary)`, `var(--accent)`][i]
      }))

      const cardWidth = width / 3 - 20
      const cardHeight = height * 0.4
      const progressRadius = Math.min(cardWidth, cardHeight) * 0.25

      const cards = g.selectAll('.metric-card')
        .data(metricCards)
        .join('g')
        .attr('class', 'metric-card')
        .attr('transform', (d, i) => `translate(${i * (cardWidth + 20)},0)`)

      cards.append('rect')
        .attr('width', cardWidth)
        .attr('height', cardHeight)
        .attr('rx', 8)
        .attr('fill', 'var(--card)')
        .attr('stroke', d => d.color)
        .attr('stroke-opacity', 0.2)
        .attr('stroke-width', 2)
        .style('cursor', 'pointer')
        .on('mouseover', function(this: SVGRectElement) {
          select(this)
            .transition()
            .duration(200)
            .attr('stroke-opacity', 0.4)
        })
        .on('mouseout', function(this: SVGRectElement) {
          select(this)
            .transition()
            .duration(200)
            .attr('stroke-opacity', 0.2)
        })

      cards.each(function(this: SVGGElement, d: { name: string; current: number; previous: number; color: string }) {
        const card = select<SVGGElement, typeof d>(this)
        const centerX = cardWidth / 2
        const centerY = cardHeight / 2

        const arcGenerator = arc<any>()
          .innerRadius(progressRadius - 8)
          .outerRadius(progressRadius)
          .startAngle(0)
          .endAngle(Math.PI * 2 * (d.current / 100))

        card.append('circle')
          .attr('cx', centerX)
          .attr('cy', centerY)
          .attr('r', progressRadius)
          .attr('fill', 'none')
          .attr('stroke', d.color)
          .attr('stroke-opacity', 0.1)
          .attr('stroke-width', 8)

        card.append('path')
          .attr('transform', `translate(${centerX},${centerY})`)
          .attr('d', arcGenerator({} as any))
          .attr('fill', d.color)
          .attr('opacity', 0.8)

        const value = card.append('text')
          .attr('x', centerX)
          .attr('y', centerY)
          .attr('text-anchor', 'middle')
          .attr('dy', '0.1em')
          .attr('class', 'text-2xl font-bold')
          .text('0%')

        value.transition()
          .duration(1000)
          .tween('text', function(this: SVGTextElement) {
            const interpolateValue = interpolate(0, d.current)
            return function(t: number) {
              this.textContent = `${Math.round(interpolateValue(t))}%`
            }
          })

        card.append('text')
          .attr('x', centerX)
          .attr('y', centerY + progressRadius + 24)
          .attr('text-anchor', 'middle')
          .attr('class', 'text-sm font-medium')
          .text(d.name)

        const trend = d.current - d.previous
        const trendColor = trend > 0 ? 'var(--success)' : trend < 0 ? 'var(--destructive)' : 'var(--muted)'

        const trendText = card.append('text')
          .attr('x', centerX)
          .attr('y', cardHeight - 20)
          .attr('text-anchor', 'middle')
          .attr('class', 'text-sm')
          .attr('fill', trendColor)
          .text('0%')

        trendText.transition()
          .duration(1000)
          .tween('text', function(this: SVGTextElement) {
            const interpolateTrend = interpolate(0, Math.abs(trend))
            return function(t: number) {
              this.textContent = `${trend > 0 ? '↑' : trend < 0 ? '↓' : '→'} ${Math.round(interpolateTrend(t))}%`
            }
          })
      })

    } catch (error) {
      console.error('Error initializing Metrics Dashboard:', error)
      setError(error as Error)
    }
  }, [dimensions, data, mounted])

  if (error) {
    return (
      <div className="w-full p-4 text-destructive">
        <p>Error initializing Metrics Dashboard: {error.message}</p>
      </div>
    )
  }

  if (!data.length || !mounted) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div ref={containerRef} className="w-full overflow-hidden bg-card rounded-lg">
        <div className="min-w-[375px] w-full px-4 py-6">
          <svg
            ref={svgRef}
            className="w-full h-[400px] touch-none"
            aria-label="Metrics Dashboard Visualization"
            role="img"
          >
            <title>DevRel Metrics Dashboard</title>
            <desc>A visualization showing key DevRel metrics including engagement, growth, and satisfaction trends over time</desc>
          </svg>
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default MetricsDashboard;

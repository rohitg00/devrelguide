'use client';

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { VisualizationContainer } from './VisualizationContainer';

interface DevRelMetric {
  name: string;
  community: number;
  content: number;
  technical: number;
  education: number;
  impact: number;
  satisfaction: number;
  adoption: number;
}

const metricsData: DevRelMetric[] = [
  {
    name: 'Documentation',
    community: 70,
    content: 95,
    technical: 85,
    education: 90,
    impact: 88,
    satisfaction: 85,
    adoption: 78
  },
  {
    name: 'Workshops',
    community: 90,
    content: 75,
    technical: 80,
    education: 95,
    impact: 85,
    satisfaction: 92,
    adoption: 85
  },
  {
    name: 'Open Source',
    community: 85,
    content: 70,
    technical: 95,
    education: 75,
    impact: 90,
    satisfaction: 88,
    adoption: 92
  },
  {
    name: 'Social Media',
    community: 95,
    content: 85,
    technical: 65,
    education: 80,
    impact: 82,
    satisfaction: 78,
    adoption: 75
  },
  {
    name: 'API Support',
    community: 80,
    content: 75,
    technical: 90,
    education: 85,
    impact: 86,
    satisfaction: 82,
    adoption: 88
  }
];

const dimensions = [
  'community',
  'content',
  'technical',
  'education',
  'impact',
  'satisfaction',
  'adoption'
];

export function ParallelCoordinates() {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !wrapperRef.current) return;

    const margin = { top: 30, right: 50, bottom: 30, left: 50 };
    const width = wrapperRef.current.clientWidth;
    const height = 500;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const y = {};
    dimensions.forEach(dimension => {
      y[dimension] = d3.scaleLinear()
        .domain(d3.extent(metricsData, d => d[dimension]) as [number, number])
        .range([innerHeight, 0]);
    });

    const x = d3.scalePoint()
      .range([0, innerWidth])
      .domain(dimensions);

    const backgroundLines = g.append('g')
      .attr('class', 'background-lines')
      .selectAll('path')
      .data(metricsData)
      .join('path')
      .attr('d', d => {
        return d3.line()(dimensions.map(p => [x(p)!, y[p](d[p])]));
      })
      .attr('fill', 'none')
      .attr('stroke', '#ddd')
      .attr('stroke-width', 1)
      .attr('opacity', 0.3);

    const foregroundLines = g.append('g')
      .attr('class', 'foreground-lines')
      .selectAll('path')
      .data(metricsData)
      .join('path')
      .attr('d', d => {
        return d3.line()(dimensions.map(p => [x(p)!, y[p](d[p])]));
      })
      .attr('fill', 'none')
      .attr('stroke', d => d3.interpolateViridis(d.impact / 100))
      .attr('stroke-width', 2)
      .attr('opacity', 0.7);

    const axes = g.selectAll('.dimension')
      .data(dimensions)
      .join('g')
      .attr('class', 'dimension')
      .attr('transform', d => `translate(${x(d)},0)`);

    axes.each(function(d) {
      d3.select(this).call(d3.axisLeft(y[d]));
    });

    axes.append('text')
      .attr('y', -9)
      .attr('text-anchor', 'middle')
      .attr('fill', 'currentColor')
      .text(d => d.charAt(0).toUpperCase() + d.slice(1));

    const brush = d3.brushY()
      .extent([[-8, 0], [8, innerHeight]])
      .on('brush', brushed)
      .on('end', brushEnded);

    axes.append('g')
      .attr('class', 'brush')
      .call(brush);

    function brushed(event) {
      if (!event.selection) return;

      const actives: { dimension: string; extent: [number, number] }[] = [];

      axes.selectAll('.brush')
        .each(function(d) {
          const selection = d3.brushSelection(this as any);
          if (selection) {
            actives.push({
              dimension: d,
              extent: selection.map(y[d].invert) as [number, number]
            });
          }
        });

      if (actives.length === 0) {
        foregroundLines.style('opacity', 0.7);
      } else {
        foregroundLines.style('opacity', d => {
          const isActive = actives.every(active => {
            const value = d[active.dimension];
            return value >= active.extent[1] && value <= active.extent[0];
          });
          return isActive ? 0.7 : 0.1;
        });
      }
    }

    function brushEnded(event) {
      if (!event.selection) {
        foregroundLines.style('opacity', 0.7);
      }
    }

    foregroundLines
      .on('mouseover', function(event, d) {
        d3.select(this)
          .attr('stroke-width', 4)
          .attr('opacity', 1)
          .raise();

        dimensions.forEach(p => {
          g.append('text')
            .attr('class', 'value-label')
            .attr('x', x(p)!)
            .attr('y', y[p](d[p]))
            .attr('dy', -10)
            .attr('text-anchor', 'middle')
            .attr('fill', 'currentColor')
            .text(d[p].toFixed(0));
        });

        g.append('text')
          .attr('class', 'metric-label')
          .attr('x', innerWidth / 2)
          .attr('y', -10)
          .attr('text-anchor', 'middle')
          .attr('fill', 'currentColor')
          .attr('font-weight', 'bold')
          .text(d.name);
      })
      .on('mouseout', function() {
        d3.select(this)
          .attr('stroke-width', 2)
          .attr('opacity', 0.7);

        g.selectAll('.value-label').remove();
        g.selectAll('.metric-label').remove();
      });

  }, []);

  return (
    <VisualizationContainer
      title="Developer Skills Parallel Coordinates"
      description="Multi-dimensional visualization of developer skills across different domains"
    >
      <div ref={wrapperRef} className="w-full h-[500px]">
        <svg ref={svgRef} className="w-full h-full" />
      </div>
    </VisualizationContainer>
  );
}

export default ParallelCoordinates;

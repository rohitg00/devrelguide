'use client'

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useResizeObserver } from '@/hooks/useResizeObserver';

interface BulletData {
  title: string;
  subtitle: string;
  ranges: [number, number, number]; // poor/satisfactory/good
  measures: [number]; // actual value
  markers: [number]; // target value
}

const DEFAULT_DATA: BulletData[] = [
  {
    title: "Community Growth",
    subtitle: "Monthly Active Users",
    ranges: [2000, 4000, 6000],
    measures: [4500],
    markers: [5000]
  },
  {
    title: "Documentation",
    subtitle: "Coverage %",
    ranges: [60, 75, 90],
    measures: [82],
    markers: [85]
  },
  {
    title: "Response Time",
    subtitle: "Hours",
    ranges: [24, 12, 4],
    measures: [6],
    markers: [8]
  },
  {
    title: "Event Engagement",
    subtitle: "Participation Rate",
    ranges: [40, 65, 80],
    measures: [72],
    markers: [75]
  }
];

export const DevRelBulletChart: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dimensions = useResizeObserver(wrapperRef);
  const [data] = useState<BulletData[]>(DEFAULT_DATA);

  useEffect(() => {
    if (!dimensions || !svgRef.current) return;

    const margin = { top: 20, right: 30, bottom: 20, left: 120 };
    const width = dimensions.width - margin.left - margin.right;
    const height = (dimensions.height - margin.top - margin.bottom) / data.length;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg
      .attr('width', dimensions.width)
      .attr('height', dimensions.height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    data.forEach((d, i) => {
      const bulletWidth = d3.scaleLinear()
        .domain([0, Math.max(...d.ranges)])
        .range([0, width]);

      const bulletHeight = height - 20;

      const bullet = g.append('g')
        .attr('class', 'bullet')
        .attr('transform', `translate(0,${i * height + 10})`);

      // Draw the ranges (background)
      bullet.selectAll('rect.range')
        .data(d.ranges)
        .enter()
        .append('rect')
        .attr('class', 'range')
        .attr('width', d => bulletWidth(d))
        .attr('height', bulletHeight)
        .attr('x', 0)
        .attr('fill', (_, i) => ['#f0f0f0', '#e0e0e0', '#d0d0d0'][i]);

      // Draw the measure (actual value)
      bullet.selectAll('rect.measure')
        .data(d.measures)
        .enter()
        .append('rect')
        .attr('class', 'measure')
        .attr('width', d => bulletWidth(d))
        .attr('height', bulletHeight / 3)
        .attr('x', 0)
        .attr('y', bulletHeight / 3)
        .attr('fill', '#4a90e2');

      // Draw the markers (target)
      bullet.selectAll('line.marker')
        .data(d.markers)
        .enter()
        .append('line')
        .attr('class', 'marker')
        .attr('x1', d => bulletWidth(d))
        .attr('x2', d => bulletWidth(d))
        .attr('y1', 0)
        .attr('y2', bulletHeight)
        .attr('stroke', '#000')
        .attr('stroke-width', 2);

      // Add title
      bullet.append('text')
        .attr('class', 'title')
        .attr('x', -10)
        .attr('y', bulletHeight / 2)
        .attr('dy', '0.35em')
        .attr('text-anchor', 'end')
        .text(d.title)
        .attr('font-size', '12px');

      // Add subtitle
      bullet.append('text')
        .attr('class', 'subtitle')
        .attr('x', -10)
        .attr('y', bulletHeight / 2 + 15)
        .attr('text-anchor', 'end')
        .text(d.subtitle)
        .attr('font-size', '10px')
        .attr('fill', '#666');
    });
  }, [dimensions, data]);

  return (
    <div ref={wrapperRef} className="w-full h-full min-h-[300px]">
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
};

export default DevRelBulletChart;

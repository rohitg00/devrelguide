import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useResizeObserver } from '@/hooks/useResizeObserver';

interface MetricsData {
  category: string;
  metric: string;
  value: number;
  change: number;
}

export const MetricsHighlightTable: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dimensions = useResizeObserver(wrapperRef);

  useEffect(() => {
    if (!dimensions) return;

    // Sample data - in production this would come from API
    const data: MetricsData[] = [
      { category: 'Community', metric: 'Active Contributors', value: 450, change: 12 },
      { category: 'Documentation', metric: 'Page Views', value: 25000, change: -5 },
      { category: 'Support', metric: 'Response Time', value: 2.5, change: -15 },
      { category: 'Events', metric: 'Attendance Rate', value: 85, change: 8 },
      { category: 'Content', metric: 'Engagement', value: 68, change: 20 }
    ];

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();


    const margin = { top: 20, right: 30, bottom: 20, left: 120 };
    const width = dimensions.width - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Color scales
    const valueColorScale = d3.scaleSequential()
      .domain([0, d3.max(data, d => d.value) || 100])
      .interpolator(d3.interpolateBlues);

    const changeColorScale = d3.scaleSequential()
      .domain([-20, 20])
      .interpolator(d3.interpolateRdYlGn);

    // Create table structure
    const rows = g.selectAll('.row')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'row')
      .attr('transform', (d, i) => `translate(0,${i * 50})`);

    // Add category text
    rows.append('text')
      .attr('x', -10)
      .attr('y', 30)
      .attr('text-anchor', 'end')
      .text(d => d.category)
      .style('font-weight', 'bold');

    // Add value cells
    rows.append('rect')
      .attr('x', 10)
      .attr('y', 10)
      .attr('width', 120)
      .attr('height', 40)
      .attr('rx', 4)
      .style('fill', d => valueColorScale(d.value));

    // Add value text
    rows.append('text')
      .attr('x', 70)
      .attr('y', 35)
      .attr('text-anchor', 'middle')
      .style('fill', 'white')
      .text(d => d.value);

    // Add change cells
    rows.append('rect')
      .attr('x', 140)
      .attr('y', 10)
      .attr('width', 80)
      .attr('height', 40)
      .attr('rx', 4)
      .style('fill', d => changeColorScale(d.change));

    // Add change text
    rows.append('text')
      .attr('x', 180)
      .attr('y', 35)
      .attr('text-anchor', 'middle')
      .style('fill', 'white')
      .text(d => `${d.change > 0 ? '+' : ''}${d.change}%`);

  }, [dimensions]);

  return (
    <div ref={wrapperRef} style={{ width: '100%', height: '300px' }}>
      <svg ref={svgRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default MetricsHighlightTable;

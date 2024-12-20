import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useResizeObserver } from '@/hooks/useResizeObserver';

interface SkillData {
  skill: string;
  values: number[];
  quartiles: [number, number, number, number, number]; // min, q1, median, q3, max
}

export const SkillDistributionBox: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dimensions = useResizeObserver(wrapperRef);

  useEffect(() => {
    if (!dimensions) return;

    // Sample data - in production this would come from API
    const data: SkillData[] = [
      {
        skill: 'Technical Writing',
        values: [2, 3, 4, 4, 5, 5, 5, 6, 7, 8],
        quartiles: [2, 4, 5, 6, 8]
      },
      {
        skill: 'Public Speaking',
        values: [3, 4, 5, 5, 6, 6, 7, 7, 8, 9],
        quartiles: [3, 5, 6, 7, 9]
      },
      {
        skill: 'API Design',
        values: [1, 2, 3, 4, 4, 5, 6, 7, 7, 8],
        quartiles: [1, 3, 4, 6, 8]
      },
      {
        skill: 'Community Building',
        values: [4, 5, 5, 6, 6, 7, 7, 8, 8, 9],
        quartiles: [4, 5, 6, 7, 9]
      },
      {
        skill: 'Code Examples',
        values: [3, 4, 4, 5, 5, 6, 6, 7, 8, 8],
        quartiles: [3, 4, 5, 6, 8]
      }
    ];

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 40, right: 40, bottom: 40, left: 150 };
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const y = d3.scaleBand()
      .domain(data.map(d => d.skill))
      .range([0, height])
      .padding(0.2);

    const x = d3.scaleLinear()
      .domain([0, 10])
      .range([0, width]);

    // Add Y axis
    g.append('g')
      .call(d3.axisLeft(y))
      .selectAll('text')
      .style('font-size', '12px');

    // Add X axis
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .style('font-size', '12px');

    // Add title
    svg.append('text')
      .attr('x', dimensions.width / 2)
      .attr('y', 25)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text('DevRel Skill Distribution');

    // Box plot elements
    const boxWidth = y.bandwidth();

    // Create box plots
    const boxPlots = g.selectAll('.box-plot')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'box-plot')
      .attr('transform', d => `translate(0,${y(d.skill)})`);

    // Add boxes
    boxPlots.append('rect')
      .attr('x', d => x(d.quartiles[1]))
      .attr('width', d => x(d.quartiles[3]) - x(d.quartiles[1]))
      .attr('height', boxWidth)
      .style('fill', '#69b3a2')
      .style('opacity', 0.7);

    // Add median lines
    boxPlots.append('line')
      .attr('x1', d => x(d.quartiles[2]))
      .attr('x2', d => x(d.quartiles[2]))
      .attr('y1', 0)
      .attr('y2', boxWidth)
      .style('stroke', 'black')
      .style('stroke-width', 2);

    // Add whiskers
    boxPlots.append('line')
      .attr('x1', d => x(d.quartiles[0]))
      .attr('x2', d => x(d.quartiles[1]))
      .attr('y1', boxWidth / 2)
      .attr('y2', boxWidth / 2)
      .style('stroke', 'black');

    boxPlots.append('line')
      .attr('x1', d => x(d.quartiles[3]))
      .attr('x2', d => x(d.quartiles[4]))
      .attr('y1', boxWidth / 2)
      .attr('y2', boxWidth / 2)
      .style('stroke', 'black');

    // Add whisker caps
    boxPlots.append('line')
      .attr('x1', d => x(d.quartiles[0]))
      .attr('x2', d => x(d.quartiles[0]))
      .attr('y1', boxWidth * 0.25)
      .attr('y2', boxWidth * 0.75)
      .style('stroke', 'black');

    boxPlots.append('line')
      .attr('x1', d => x(d.quartiles[4]))
      .attr('x2', d => x(d.quartiles[4]))
      .attr('y1', boxWidth * 0.25)
      .attr('y2', boxWidth * 0.75)
      .style('stroke', 'black');

    // Add individual points (outliers)
    boxPlots.selectAll('.point')
      .data(d => d.values.filter(v => v < d.quartiles[0] || v > d.quartiles[4]))
      .enter()
      .append('circle')
      .attr('class', 'point')
      .attr('cx', d => x(d))
      .attr('cy', boxWidth / 2)
      .attr('r', 4)
      .style('fill', '#69b3a2')
      .style('opacity', 0.7);

  }, [dimensions]);

  return (
    <div ref={wrapperRef} style={{ width: '100%', height: '400px' }}>
      <svg ref={svgRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default SkillDistributionBox;

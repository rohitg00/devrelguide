'use client'

import React, { useEffect, useRef } from 'react'
import { select } from 'd3-selection'
import { scaleLinear, scaleSequential } from 'd3-scale'
import { axisRight, axisBottom, axisLeft } from 'd3-axis'
import { interpolateViridis } from 'd3-scale-chromatic'

interface SkillData {
  role: string;
  category: string;
  skill: string;
  value: number;
}

const mockData = [
  { role: 'Junior DevRel', category: 'Technical', skill: 'Documentation', value: 70 },
  { role: 'Junior DevRel', category: 'Technical', skill: 'Coding', value: 60 },
  { role: 'Junior DevRel', category: 'Communication', skill: 'Writing', value: 75 },
  { role: 'Junior DevRel', category: 'Community', skill: 'Support', value: 65 },
  { role: 'Mid DevRel', category: 'Technical', skill: 'Documentation', value: 80 },
  { role: 'Mid DevRel', category: 'Technical', skill: 'Coding', value: 75 },
  { role: 'Mid DevRel', category: 'Strategy', skill: 'Planning', value: 70 },
  { role: 'Mid DevRel', category: 'Community', skill: 'Events', value: 80 },
  { role: 'Senior DevRel', category: 'Technical', skill: 'Architecture', value: 90 },
  { role: 'Senior DevRel', category: 'Strategy', skill: 'Leadership', value: 85 },
  { role: 'Senior DevRel', category: 'Community', skill: 'Growth', value: 90 },
  { role: 'Lead DevRel', category: 'Strategy', skill: 'Vision', value: 95 },
  { role: 'Lead DevRel', category: 'Management', skill: 'Team', value: 90 },
  { role: 'Lead DevRel', category: 'Business', skill: 'Impact', value: 85 }
];

const SkillsMatrix: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const margin = { top: 50, right: 100, bottom: 100, left: 120 };
    const width = 1000 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    const svg = select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Get unique roles and skills
    const roles = Array.from(new Set(mockData.map(d => d.role)));
    const skills = Array.from(new Set(mockData.map(d => d.skill)));
    const categories = Array.from(new Set(mockData.map(d => d.category)));

    // Create scales
    const x = scaleLinear()
      .domain([0, skills.length])
      .range([0, width]);

    const y = scaleLinear()
      .domain([0, roles.length])
      .range([0, height]);

    const color = scaleSequential(interpolateViridis)
      .domain([0, 100]);

    // Create cells
    const cellHeight = height / roles.length;
    const cellWidth = width / skills.length;

    // Add category headers
    const categoryWidth = width / categories.length;
    categories.forEach((category, i) => {
      svg.append('text')
        .attr('x', i * categoryWidth + categoryWidth / 2)
        .attr('y', -30)
        .attr('text-anchor', 'middle')
        .attr('font-weight', 'bold')
        .attr('fill', '#4A5568')
        .text(category);
    });

    // Create tooltip
    const tooltip = select(containerRef.current)
      .append('div')
      .attr('class', 'absolute hidden bg-card p-2 rounded shadow-lg text-sm')
      .style('pointer-events', 'none');

    // Add cells with hover effects
    mockData.forEach(d => {
      const roleIndex = roles.indexOf(d.role);
      const skillIndex = skills.indexOf(d.skill);

      const cell = svg.append('g')
        .attr('transform', `translate(${skillIndex * cellWidth},${roleIndex * cellHeight})`);

      cell.append('rect')
        .attr('width', cellWidth - 1)
        .attr('height', cellHeight - 1)
        .attr('fill', color(d.value))
        .attr('rx', 4)
        .attr('stroke', '#fff')
        .attr('stroke-width', 2)
        .on('mouseover', (event) => {
          select(event.currentTarget)
            .attr('stroke', '#2D3748')
            .attr('stroke-width', 3);

          tooltip
            .style('left', `${event.pageX + 10}px`)
            .style('top', `${event.pageY - 10}px`)
            .html(`
              <div class="font-medium">${d.role}</div>
              <div class="text-muted-foreground">${d.skill}</div>
              <div class="text-muted-foreground">${d.category}</div>
              <div class="font-bold">${d.value}%</div>
            `)
            .classed('hidden', false);
        })
        .on('mouseout', (event) => {
          select(event.currentTarget)
            .attr('stroke', '#fff')
            .attr('stroke-width', 2);
          
          tooltip.classed('hidden', true);
        });

      // Add value text
      cell.append('text')
        .attr('x', cellWidth / 2)
        .attr('y', cellHeight / 2)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('fill', d.value > 50 ? '#fff' : '#2D3748')
        .attr('font-weight', 'bold')
        .text(d.value);
    });

    // Add role labels
    roles.forEach((role, i) => {
      svg.append('text')
        .attr('x', -10)
        .attr('y', i * cellHeight + cellHeight / 2)
        .attr('text-anchor', 'end')
        .attr('dominant-baseline', 'middle')
        .attr('font-weight', 'medium')
        .attr('fill', '#4A5568')
        .text(role);
    });

    // Add skill labels
    skills.forEach((skill, i) => {
      svg.append('text')
        .attr('x', i * cellWidth + cellWidth / 2)
        .attr('y', height + 20)
        .attr('text-anchor', 'middle')
        .attr('transform', `rotate(45, ${i * cellWidth + cellWidth / 2}, ${height + 20})`)
        .attr('fill', '#4A5568')
        .text(skill);
    });

    // Add legend
    const legendWidth = 200;
    const legendHeight = 20;
    const legend = svg.append('g')
      .attr('transform', `translate(${width + 20}, 0)`);

    const legendScale = scaleLinear()
      .domain([0, 100])
      .range([0, legendHeight]);

    const legendAxis = axisRight(legendScale)
      .ticks(5);

    legend.append('g')
      .call(legendAxis);

    const legendGradient = legend.append('defs')
      .append('linearGradient')
      .attr('id', 'legend-gradient')
      .attr('x1', '0%')
      .attr('y1', '100%')
      .attr('x2', '0%')
      .attr('y2', '0%');

    legendGradient.selectAll('stop')
      .data([0, 0.2, 0.4, 0.6, 0.8, 1])
      .enter()
      .append('stop')
      .attr('offset', d => `${d * 100}%`)
      .attr('stop-color', d => color(d * 100));

    legend.append('rect')
      .attr('width', legendWidth)
      .attr('height', legendHeight)
      .style('fill', 'url(#legend-gradient)');

  }, []);

  return (
    <div ref={containerRef} className="relative w-full bg-card p-6 rounded-xl shadow-lg">
      <div className="text-xl font-semibold mb-4 text-foreground">DevRel Skills Distribution</div>
      <div className="text-sm text-muted-foreground mb-6">
        Explore the distribution of skills across different DevRel roles and categories
      </div>
      <svg
        ref={svgRef}
        className="w-full"
        style={{ minHeight: '600px' }}
      />
    </div>
  );
};

export default SkillsMatrix;

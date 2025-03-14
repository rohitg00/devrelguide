'use client';

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { VisualizationContainer } from './VisualizationContainer';

interface MarketImpactData {
  name: string;
  size: number;
  trend: 'up' | 'down' | 'stable';
  children?: MarketImpactData[];
}

const marketData: MarketImpactData[] = [
  {
    name: 'Developer Experience',
    size: 400,
    trend: 'up',
    children: [
      { name: 'Documentation Quality', size: 150, trend: 'up' },
      { name: 'API Usability', size: 120, trend: 'up' },
      { name: 'SDK Support', size: 130, trend: 'stable' }
    ]
  },
  {
    name: 'Community Engagement',
    size: 300,
    trend: 'stable',
    children: [
      { name: 'Online Forums', size: 100, trend: 'up' },
      { name: 'Virtual Events', size: 120, trend: 'up' },
      { name: 'Social Media', size: 80, trend: 'down' }
    ]
  },
  {
    name: 'Technical Content',
    size: 250,
    trend: 'up',
    children: [
      { name: 'Tutorial Quality', size: 90, trend: 'up' },
      { name: 'Code Examples', size: 80, trend: 'up' },
      { name: 'Blog Posts', size: 80, trend: 'stable' }
    ]
  },
  {
    name: 'Market Adaptation',
    size: 200,
    trend: 'down',
    children: [
      { name: 'Remote Support', size: 80, trend: 'up' },
      { name: 'Digital Events', size: 70, trend: 'down' },
      { name: 'Resource Access', size: 50, trend: 'stable' }
    ]
  }
];

const colorScale = d3.scaleOrdinal()
  .domain(['up', 'down', 'stable'])
  .range(['#4CAF50', '#f44336', '#2196F3']);

export function MarketImpactAnalysis() {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !wrapperRef.current) return;

    const margin = { top: 40, right: 20, bottom: 40, left: 20 };
    const width = wrapperRef.current.clientWidth;
    const height = 600;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const root = d3.hierarchy(
      { name: 'Market Impact', children: marketData }
    )
      .sum(d => d.size)
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    const simulation = d3.forceSimulation(root.descendants().slice(1))
      .force('link', d3.forceLink()
        .id(d => d.id)
        .links(root.links())
        .distance(d => 100 / (d.target.depth || 1))
        .strength(1))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('x', d3.forceX(innerWidth / 2).strength(0.1))
      .force('y', d3.forceY(innerHeight / 2).strength(0.1))
      .force('collision', d3.forceCollide().radius(d => Math.sqrt((d.value || 0) * 100) + 10));

    const link = g.append('g')
      .selectAll('line')
      .data(root.links())
      .join('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', d => Math.sqrt((d.target.value || 0) / 100));

    const node = g.append('g')
      .selectAll('g')
      .data(root.descendants().slice(1))
      .join('g')
      .attr('cursor', 'pointer')
      .call(drag(simulation));

    node.append('circle')
      .attr('r', d => Math.sqrt((d.value || 0) * 100))
      .attr('fill', d => colorScale((d.data as MarketImpactData).trend))
      .attr('fill-opacity', 0.8)
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);

    node.append('text')
      .attr('dy', '.35em')
      .attr('x', d => Math.sqrt((d.value || 0) * 100) + 5)
      .attr('text-anchor', 'start')
      .attr('fill', 'currentColor')
      .style('font-size', '12px')
      .text(d => d.data.name);

    node.append('title')
      .text(d => `${d.data.name}\nImpact: ${d.value}\nTrend: ${(d.data as MarketImpactData).trend}`);

    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x!)
        .attr('y1', d => d.source.y!)
        .attr('x2', d => d.target.x!)
        .attr('y2', d => d.target.y!);

      node
        .attr('transform', d => `translate(${d.x},${d.y})`);
    });

    function drag(simulation: d3.Simulation<d3.SimulationNodeDatum, undefined>) {
      function dragstarted(event: any) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }

      function dragged(event: any) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }

      function dragended(event: any) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }

      return d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended);
    }

    const legend = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top - 20})`);

    ['up', 'down', 'stable'].forEach((trend, i) => {
      const g = legend.append('g')
        .attr('transform', `translate(${i * 100},0)`);

      g.append('circle')
        .attr('r', 6)
        .attr('fill', colorScale(trend));

      g.append('text')
        .attr('x', 10)
        .attr('y', 4)
        .attr('fill', 'currentColor')
        .style('font-size', '12px')
        .text(trend.charAt(0).toUpperCase() + trend.slice(1));
    });

  }, []);

  return (
    <VisualizationContainer
      title="Market Impact Analysis"
      description="Visualization of market impact across different segments"
    >
      <div ref={wrapperRef} className="w-full h-[500px]">
        <svg ref={svgRef} className="w-full h-full" />
      </div>
    </VisualizationContainer>
  );
}

export default MarketImpactAnalysis;

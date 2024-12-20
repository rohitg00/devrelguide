'use client';

import React, { useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import { Selection, BaseType } from 'd3-selection';
import { D3ZoomEvent } from 'd3-zoom';

interface Node extends d3.SimulationNodeDatum {
  id: string;
  group: string;
  value: number;
  x?: number;
  y?: number;
}

interface Link {
  source: string | Node;
  target: string | Node;
  value: number;
}

const generateNetworkData = () => {
  const nodes: Node[] = [
    { id: 'Technical Content', group: 'core', value: 80 },
    { id: 'Community Building', group: 'core', value: 85 },
    { id: 'Developer Experience', group: 'core', value: 75 },
    { id: 'Documentation', group: 'channel', value: 60 },
    { id: 'Social Media', group: 'channel', value: 55 },
    { id: 'Events', group: 'channel', value: 65 },
    { id: 'Open Source', group: 'channel', value: 70 },
    { id: 'Product Adoption', group: 'impact', value: 50 },
    { id: 'Developer Satisfaction', group: 'impact', value: 45 },
    { id: 'Community Growth', group: 'impact', value: 55 },
    { id: 'Technical Feedback', group: 'impact', value: 40 }
  ];

  const links: Link[] = [
    { source: 'Technical Content', target: 'Documentation', value: 5 },
    { source: 'Technical Content', target: 'Social Media', value: 4 },
    { source: 'Community Building', target: 'Events', value: 5 },
    { source: 'Community Building', target: 'Social Media', value: 4 },
    { source: 'Developer Experience', target: 'Open Source', value: 5 },
    { source: 'Developer Experience', target: 'Documentation', value: 4 },
    { source: 'Documentation', target: 'Product Adoption', value: 3 },
    { source: 'Documentation', target: 'Developer Satisfaction', value: 4 },
    { source: 'Social Media', target: 'Community Growth', value: 4 },
    { source: 'Events', target: 'Community Growth', value: 5 },
    { source: 'Events', target: 'Technical Feedback', value: 3 },
    { source: 'Open Source', target: 'Technical Feedback', value: 4 },
    { source: 'Open Source', target: 'Developer Satisfaction', value: 3 }
  ];

  return { nodes, links };
};

const COLORS = {
  core: '#8884d8',
  channel: '#82ca9d',
  impact: '#ffc658'
} as const;

export function NetworkInfluence() {
  const svgRef = useRef<SVGSVGElement>(null);
  const { nodes, links } = useMemo(() => generateNetworkData(), []);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const container = svgRef.current.parentElement;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    svg.selectAll('*').remove();

    const simulation = d3.forceSimulation<Node>(nodes)
      .force('link', d3.forceLink<Node, Link>(links).id(d => d.id))
      .force('charge', d3.forceManyBody<Node>().strength(-200))
      .force('center', d3.forceCenter<Node>(width / 2, height / 2))
      .force('collision', d3.forceCollide<Node>(30));

    const g = svg.append('g');

    const link = g.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', (d: Link) => Math.sqrt(d.value));

    const node = g.append('g')
      .selectAll('g')
      .data(nodes)
      .join('g');

    node.append('circle')
      .attr('r', (d: Node) => Math.sqrt(d.value) * 2)
      .style('fill', (d: Node) => COLORS[d.group as keyof typeof COLORS])
      .style('stroke', '#fff')
      .style('stroke-width', 1.5);

    node.append('text')
      .text((d: Node) => d.id)
      .attr('x', 0)
      .attr('y', (d: Node) => -Math.sqrt(d.value) * 2 - 2)
      .attr('text-anchor', 'middle')
      .style('font-size', (d: Node) => {
        const baseSize = Math.min(8 + Math.sqrt(d.value), 12);
        return `${baseSize}px`;
      })
      .style('fill', '#666')
      .style('pointer-events', 'none');

    node.append('title')
      .text((d: Node) => `${d.id}\nGroup: ${d.group}\nValue: ${d.value}`);

    simulation.on('tick', () => {
      link
        .attr('x1', (d: Link) => (d.source as Node).x || 0)
        .attr('y1', (d: Link) => (d.source as Node).y || 0)
        .attr('x2', (d: Link) => (d.target as Node).x || 0)
        .attr('y2', (d: Link) => (d.target as Node).y || 0);

      node.attr('transform', (d: Node) => `translate(${d.x || 0},${d.y || 0})`);
    });

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 3])
      .on('zoom', (event: D3ZoomEvent<SVGSVGElement, unknown>) => {
        g.attr('transform', event.transform.toString());
      });

    svg.call(zoom);

    return () => {
      simulation.stop();
    };
  }, [nodes, links]);

  return (
    <div className="w-full h-screen max-h-[80vh] min-h-[400px] p-2 sm:p-4">
      <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4">DevRel Influence Network</h3>
      <div className="relative w-full h-full">
        <svg
          ref={svgRef}
          className="w-full h-full"
          style={{ background: '#fff' }}
        />
        <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 bg-white p-2 rounded shadow-lg">
          <div className="text-xs sm:text-sm font-medium mb-1 sm:mb-2">Network Groups</div>
          {Object.entries(COLORS).map(([group, color]) => (
            <div key={group} className="flex items-center gap-1 sm:gap-2 mb-1">
              <div
                className="w-3 h-3 sm:w-4 sm:h-4 rounded"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs sm:text-sm capitalize">{group}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="text-xs sm:text-sm text-gray-600 mt-2 sm:mt-4 text-center">
        Interactive visualization of DevRel influence paths and impact areas
      </div>
    </div>
  );
}

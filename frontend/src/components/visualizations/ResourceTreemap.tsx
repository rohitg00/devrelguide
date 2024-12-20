import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useResizeObserver } from '@/hooks/useResizeObserver';

interface TreemapData {
  name: string;
  value?: number;
  children?: TreemapData[];
}

export const ResourceTreemap: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dimensions = useResizeObserver(wrapperRef);

  useEffect(() => {
    if (!dimensions) return;

    // Sample data - in production this would come from API
    const data: TreemapData = {
      name: "DevRel Guide",
      children: [
        {
          name: "Documentation",
          children: [
            { name: "API Docs", value: 30 },
            { name: "Tutorials", value: 25 },
            { name: "Guides", value: 20 },
            { name: "Examples", value: 15 }
          ]
        },
        {
          name: "Community",
          children: [
            { name: "Forums", value: 20 },
            { name: "Discord", value: 25 },
            { name: "GitHub", value: 30 },
            { name: "Social", value: 15 }
          ]
        },
        {
          name: "Events",
          children: [
            { name: "Conferences", value: 35 },
            { name: "Workshops", value: 25 },
            { name: "Webinars", value: 20 },
            { name: "Meetups", value: 15 }
          ]
        },
        {
          name: "Content",
          children: [
            { name: "Blog Posts", value: 25 },
            { name: "Videos", value: 30 },
            { name: "Podcasts", value: 15 },
            { name: "Newsletters", value: 20 }
          ]
        }
      ]
    };

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = dimensions.width;
    const height = dimensions.height;

    // Create hierarchy and treemap layout
    const root = d3.hierarchy(data)
      .sum(d => d.value || 0)
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    const treemap = d3.treemap<TreemapData>()
      .size([width, height])
      .paddingTop(28)
      .paddingRight(7)
      .paddingInner(3);

    treemap(root);

    // Color scale
    const color = d3.scaleOrdinal(d3.schemeTableau10);

    // Create cells
    const cell = svg
      .selectAll('g')
      .data(root.descendants())
      .join('g')
      .attr('transform', d => `translate(${d.x0},${d.y0})`);

    // Add rectangles
    cell
      .append('rect')
      .attr('width', d => d.x1 - d.x0)
      .attr('height', d => d.y1 - d.y0)
      .attr('fill', d => {
        while (d.depth > 1) d = d.parent!;
        return color(d.data.name);
      })
      .attr('fill-opacity', d => 0.6 + (d.depth * 0.2))
      .style('stroke', '#fff');

    // Add text labels
    cell
      .append('text')
      .attr('x', 4)
      .attr('y', 18)
      .text(d => {
        const width = d.x1 - d.x0;
        const name = d.data.name;
        const value = d.value;
        if (width < 50) return '';
        return `${name} (${value})`;
      })
      .attr('font-size', d => {
        const width = d.x1 - d.x0;
        return Math.min(width / 10, 14) + 'px';
      })
      .style('fill', '#333');

    // Add title for root node
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      .text(data.name);

    // Add interactivity
    cell
      .on('mouseover', function() {
        d3.select(this)
          .select('rect')
          .style('stroke', '#000')
          .style('stroke-width', 2);
      })
      .on('mouseout', function() {
        d3.select(this)
          .select('rect')
          .style('stroke', '#fff')
          .style('stroke-width', 1);
      });

  }, [dimensions]);

  return (
    <div ref={wrapperRef} style={{ width: '100%', height: '500px' }}>
      <svg ref={svgRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default ResourceTreemap;

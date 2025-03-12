import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import * as d3Sankey from 'd3-sankey';
import { VisualizationContainer } from './VisualizationContainer';

interface SankeyNode {
  name: string;
  category: string;
}

interface SankeyLink {
  source: number;
  target: number;
  value: number;
}

interface SankeyData {
  nodes: SankeyNode[];
  links: SankeyLink[];
}

function DeveloperJourneySankey() {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !wrapperRef.current) return;

    const handleResize = () => {
      if (!svgRef.current || !wrapperRef.current) return;
      
      // Sample data - in production this would come from API
      const data: SankeyData = {
        nodes: [
          // Discovery Phase
          { name: "Blog Posts", category: "discovery" },
          { name: "Social Media", category: "discovery" },
          { name: "Search", category: "discovery" },

          // Engagement Phase
          { name: "Documentation", category: "engagement" },
          { name: "Forums", category: "engagement" },
          { name: "GitHub", category: "engagement" },

          // Participation Phase
          { name: "Issues", category: "participation" },
          { name: "Pull Requests", category: "participation" },
          { name: "Discussions", category: "participation" },

          // Contribution Phase
          { name: "Code", category: "contribution" },
          { name: "Content", category: "contribution" },
          { name: "Community", category: "contribution" }
        ],
        links: [
          // Discovery to Engagement
          { source: 0, target: 3, value: 30 },
          { source: 0, target: 4, value: 20 },
          { source: 1, target: 4, value: 25 },
          { source: 1, target: 5, value: 25 },
          { source: 2, target: 3, value: 35 },
          { source: 2, target: 5, value: 15 },

          // Engagement to Participation
          { source: 3, target: 6, value: 25 },
          { source: 3, target: 7, value: 20 },
          { source: 4, target: 7, value: 15 },
          { source: 4, target: 8, value: 30 },
          { source: 5, target: 6, value: 20 },
          { source: 5, target: 8, value: 25 },

          // Participation to Contribution
          { source: 6, target: 9, value: 20 },
          { source: 7, target: 9, value: 15 },
          { source: 7, target: 10, value: 10 },
          { source: 8, target: 10, value: 20 },
          { source: 8, target: 11, value: 25 }
        ]
      };

      const svg = d3.select(svgRef.current);
      svg.selectAll('*').remove();

      const width = wrapperRef.current.clientWidth;
      const height = wrapperRef.current.clientHeight || 500; // Fallback height
      const margin = { top: 20, right: 30, bottom: 20, left: 30 };
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;

      const g = svg
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      // Create Sankey generator
      const sankey = d3Sankey.sankey()
        .nodeWidth(15)
        .nodePadding(10)
        .extent([[0, 0], [innerWidth, innerHeight]]);

      // Generate layout
      const { nodes, links } = sankey({
        nodes: data.nodes.map(d => Object.assign({}, d)),
        links: data.links.map(d => Object.assign({}, d))
      });

      // Color scale for different categories
      const colorScale = d3.scaleOrdinal()
        .domain(['discovery', 'engagement', 'participation', 'contribution'])
        .range(['#66c2a5', '#fc8d62', '#8da0cb', '#e78ac3']);

      // Create links
      const link = g.append('g')
        .selectAll('path')
        .data(links)
        .join('path')
        .attr('d', d3Sankey.sankeyLinkHorizontal())
        .attr('stroke-width', d => Math.max(1, d.width))
        .attr('stroke', d => {
          const sourceNode = nodes[d.source.index];
          return d3.color(colorScale(sourceNode.category))?.darker(0.5) as string;
        })
        .attr('fill', 'none')
        .attr('opacity', 0.5);

      // Add hover effects to links
      link
        .on('mouseover', function() {
          d3.select(this)
            .attr('opacity', 0.8)
            .attr('stroke-width', d => Math.max(1, d.width) + 2);
        })
        .on('mouseout', function() {
          d3.select(this)
            .attr('opacity', 0.5)
            .attr('stroke-width', d => Math.max(1, d.width));
        });

      // Create nodes
      const node = g.append('g')
        .selectAll('rect')
        .data(nodes)
        .join('rect')
        .attr('x', d => d.x0)
        .attr('y', d => d.y0)
        .attr('height', d => d.y1 - d.y0)
        .attr('width', d => d.x1 - d.x0)
        .attr('fill', d => colorScale(d.category))
        .attr('opacity', 0.8);

      // Add hover effects to nodes
      node
        .on('mouseover', function() {
          d3.select(this)
            .attr('opacity', 1);
        })
        .on('mouseout', function() {
          d3.select(this)
            .attr('opacity', 0.8);
        });

      // Add node labels
      g.append('g')
        .selectAll('text')
        .data(nodes)
        .join('text')
        .attr('x', d => d.x0 < innerWidth / 2 ? d.x1 + 6 : d.x0 - 6)
        .attr('y', d => (d.y1 + d.y0) / 2)
        .attr('dy', '0.35em')
        .attr('text-anchor', d => d.x0 < innerWidth / 2 ? 'start' : 'end')
        .text(d => d.name)
        .style('font-size', '10px')
        .style('fill', '#333');

      // Add title
      svg.append('text')
        .attr('x', innerWidth / 2 + margin.left)
        .attr('y', margin.top - 5)
        .attr('text-anchor', 'middle')
        .style('font-size', '16px')
        .style('font-weight', 'bold')
        .text('Developer Journey Flow');
    };
    
    // Initial render
    handleResize();
    
    // Set up resize handler
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Only run on mount

  return (
    <VisualizationContainer
      title="Developer Journey Stages Sankey"
      description="Flow diagram showing the progression of developers through different stages of engagement"
    >
      <div ref={wrapperRef} className="w-full h-full">
        <svg ref={svgRef} className="w-full h-full" />
      </div>
    </VisualizationContainer>
  );
}

export default DeveloperJourneySankey;

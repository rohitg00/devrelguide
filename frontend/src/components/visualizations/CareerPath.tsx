'use client'

import React, { useRef, useEffect } from 'react'
import { select } from 'd3-selection'
import { hierarchy, tree } from 'd3-hierarchy'
import { zoom as d3Zoom } from 'd3-zoom'
import { VisualizationContainer } from './VisualizationContainer'
import { useFetchVisualization, fallbackData, useResponsiveVisualizationSize } from '@/lib/visualization-utils'

interface CareerNode {
  title: string;
  level: string;
  children?: CareerNode[];
}

export function CareerPath() {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  
  // Use our custom hook for fetching data with fallback and error handling
  const { data: careerData, loading, error, retry } = useFetchVisualization<CareerNode>({
    endpoint: '/api/visualizations/career-path',
    fallbackData: fallbackData.careerPath
  })
  
  // Use responsive sizing hook with explicit type parameter
  const dimensions = useResponsiveVisualizationSize<HTMLDivElement>(containerRef, { minHeight: 600 })

  useEffect(() => {
    if (!svgRef.current || !careerData) return;
    
    // Clear any existing content
    select(svgRef.current).selectAll('*').remove();

    const margin = { top: 60, right: 20, bottom: 40, left: 20 };
    const width = dimensions.width || 800;
    const height = dimensions.height || 800;

    const svg = select(svgRef.current)
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', [0, 0, width, height].join(' '))
      .attr('style', 'max-width: 100%; height: auto;')
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Add zoom behavior
    const zoom = d3Zoom()
      .scaleExtent([0.5, 2])
      .on('zoom', (event) => {
        svg.attr('transform', `translate(${margin.left + event.transform.x},${margin.top + event.transform.y}) scale(${event.transform.k})`);
      });

    select(svgRef.current).call(zoom as any);

    // Create the tree layout with more vertical space
    const treeLayout = tree<CareerNode>()
      .size([width - margin.left - margin.right, height - margin.top - margin.bottom])
      .nodeSize([80, 120]); // [horizontal, vertical] spacing

    // Create the hierarchy
    const root = hierarchy(careerData);

    // Generate the tree
    const treeData = treeLayout(root);

    // Create curved links with smoother paths
    const links = svg.append('g')
      .attr('fill', 'none')
      .attr('stroke', '#94A3B8')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 2)
      .selectAll('path')
      .data(treeData.links())
      .join('path')
      .attr('d', d => {
        return `M${d.source.x},${d.source.y}
                C${d.source.x},${(d.source.y + d.target.y) / 2}
                 ${d.target.x},${(d.source.y + d.target.y) / 2}
                 ${d.target.x},${d.target.y}`;
      });

    // Create nodes container with improved styling
    const nodes = svg.append('g')
      .selectAll('g')
      .data(treeData.descendants())
      .join('g')
      .attr('transform', d => `translate(${d.x},${d.y})`);

    // Add node circles with larger size and better styling
    nodes.append('circle')
      .attr('r', 35)
      .attr('fill', d => {
        switch (d.data.level) {
          case 'Entry': return '#BFDBFE';
          case 'Mid': return '#BBF7D0';
          case 'Senior': return '#FEF08A';
          case 'Leadership': return '#FECACA';
          case 'category': return '#F3F4F6';
          default: return '#F9FAFB';
        }
      })
      .attr('stroke', '#64748B')
      .attr('stroke-width', 2)
      .attr('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))');

    // Add node labels with better text wrapping
    const labels = nodes.append('g')
      .attr('class', 'label');

    labels.append('text')
      .attr('dy', '0.31em')
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('font-weight', '500')
      .attr('fill', '#1F2937')
      .each(function(this: SVGTextElement, d) {
        const text = select(this);
        const words = d.data.title.split(/\s+/);
        const lineHeight = 1.2;
        
        words.forEach((word, i) => {
          text.append('tspan')
            .attr('x', 0)
            .attr('dy', i === 0 ? '0em' : `${lineHeight}em`)
            .text(word);
        });
      });

    // Add level badges with better positioning
    nodes.append('g')
      .attr('class', 'level-badge')
      .attr('transform', 'translate(0, 45)')
      .each(function(this: SVGGElement, d) {
        if (d.data.level !== 'category') {
          const badge = select(this);
          
          badge.append('rect')
            .attr('x', -25)
            .attr('y', 0)
            .attr('width', 50)
            .attr('height', 20)
            .attr('rx', 10)
            .attr('fill', () => {
              switch (d.data.level) {
                case 'Entry': return '#3B82F6';
                case 'Mid': return '#10B981';
                case 'Senior': return '#F59E0B';
                case 'Leadership': return '#EF4444';
                default: return '#6B7280';
              }
            })
            .attr('opacity', 0.9);

          badge.append('text')
            .attr('x', 0)
            .attr('y', 14)
            .attr('text-anchor', 'middle')
            .attr('fill', 'white')
            .attr('font-size', '10px')
            .attr('font-weight', '600')
            .text(d.data.level);
        }
      });

  }, [careerData, dimensions.width, dimensions.height]);

  return (
    <div ref={containerRef} className="w-full h-full min-h-[600px]">
      <VisualizationContainer
        title="Developer Relations Career Path"
        description="Explore various career progression paths within Developer Relations"
        hasError={!!error}
        isLoading={loading}
        errorMessage={error ? error.message : ''}
        onRetry={retry}
      >
        <div className="w-full h-full">
          <svg
            ref={svgRef}
            className="w-full h-full"
          />
        </div>
      </VisualizationContainer>
    </div>
  );
}

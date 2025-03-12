'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useResizeObserver } from '@/hooks/useResizeObserver';
import { VisualizationContainer } from './VisualizationContainer';

interface SkillNode {
  name: string;
  value: number;
  children?: SkillNode[];
  connections?: string[];
  progression?: string[];
}

const skillsData: SkillNode = {
  name: 'DevRel Skills',
  children: [
    {
      name: 'Technical',
      children: [
        {
          name: 'API Design',
          value: 85,
          connections: ['Documentation', 'SDK Development'],
          progression: ['Learn REST/GraphQL', 'Design Patterns', 'API Security']
        },
        {
          name: 'Code Review',
          value: 75,
          connections: ['Documentation', 'SDK Development'],
          progression: ['Code Standards', 'Review Process', 'Feedback Methods']
        },
        {
          name: 'Documentation',
          value: 90,
          connections: ['Technical Writing', 'API Design'],
          progression: ['Basic Writing', 'API Docs', 'Interactive Docs']
        },
        {
          name: 'SDK Development',
          value: 80,
          connections: ['API Design', 'Code Review'],
          progression: ['Language Basics', 'SDK Patterns', 'Multi-platform']
        }
      ]
    },
    {
      name: 'Communication',
      children: [
        { name: 'Technical Writing', value: 88 },
        { name: 'Public Speaking', value: 82 },
        { name: 'Workshop Facilitation', value: 78 },
        { name: 'Content Strategy', value: 85 }
      ]
    },
    {
      name: 'Community',
      children: [
        { name: 'Community Building', value: 92 },
        { name: 'Developer Support', value: 86 },
        { name: 'Event Management', value: 80 },
        { name: 'Social Media', value: 75 }
      ]
    },
    {
      name: 'Strategy',
      children: [
        { name: 'Metrics Analysis', value: 88 },
        { name: 'Program Planning', value: 85 },
        { name: 'Partnership Development', value: 82 },
        { name: 'Developer Experience', value: 90 }
      ]
    }
  ]
};

export function TreeMap() {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dimensions = useResizeObserver(wrapperRef as React.RefObject<HTMLElement>);
  const [error, setError] = useState<Error | null>(null);
  const [selectedNode, setSelectedNode] = useState<d3.HierarchyRectangularNode<SkillNode> | null>(null);
  const [zoomState, setZoomState] = useState({ k: 1, x: 0, y: 0 });
  const [hoverData, setHoverData] = useState<{ x: number; y: number; name: string; value: number; connections?: string[] } | null>(null);

  useEffect(() => {
    if (!dimensions || !svgRef.current) return;

    try {
      const svg = d3.select(svgRef.current);
      svg.selectAll('*').remove();

      const { width, height } = dimensions;
      const margin = { top: 40, right: 10, bottom: 10, left: 10 };
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;

      const zoom = d3.zoom<SVGSVGElement, unknown>()
        .scaleExtent([1, 4])
        .on('zoom', (event) => {
          g.attr('transform', event.transform);
          setZoomState({ k: event.transform.k, x: event.transform.x, y: event.transform.y });
        });

      svg.call(zoom);

      const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      const root = d3.hierarchy<SkillNode>(skillsData)
        .sum((d: SkillNode) => d.value || 0)
        .sort((a, b) => (b.value || 0) - (a.value || 0));

      const treemap = d3.treemap<SkillNode>()
        .size([innerWidth, innerHeight])
        .paddingTop(28)
        .paddingRight(7)
        .paddingInner(3);

      treemap(root);

      const colorScale = d3.scaleOrdinal<string>()
        .domain(['Technical', 'Communication', 'Community', 'Strategy'])
        .range([
          d3.interpolateBlues(0.7),
          d3.interpolateGreens(0.7),
          d3.interpolateOranges(0.7),
          d3.interpolatePurples(0.7)
        ]);

      const cell = g.selectAll('g')
        .data(root.descendants())
        .join('g')
        .attr('transform', d => `translate(${d.x0},${d.y0})`);

      cell.append('rect')
        .attr('width', d => d.x1! - d.x0!)
        .attr('height', d => d.y1! - d.y0!)
        .attr('fill', d => {
          const parentColor = d.depth > 1 ? colorScale(d.parent!.data.name) : colorScale(d.data.name);
          return d3.color(parentColor)!.brighter(d.depth * 0.2).toString();
        })
        .attr('stroke', '#fff')
        .attr('stroke-width', d => d.depth === 1 ? 2 : 1)
        .style('cursor', 'pointer')
        .on('mouseover', (event, d) => {
          if (d.depth > 0) {
            setHoverData({
              x: event.pageX,
              y: event.pageY,
              name: d.data.name,
              value: d.value || 0,
              connections: d.data.connections
            });
          }
        })
        .on('mousemove', (event) => {
          if (hoverData) {
            setHoverData({
              ...hoverData,
              x: event.pageX,
              y: event.pageY
            });
          }
        })
        .on('mouseout', () => {
          setHoverData(null);
        })
        .on('click', (event, d) => {
          event.stopPropagation();
          setSelectedNode(selectedNode === d ? null : d);

          if (d.depth > 0) {
            const k = Math.min(innerWidth / (d.x1! - d.x0!), innerHeight / (d.y1! - d.y0!)) * 0.8;
            const x = (innerWidth / 2) - ((d.x0! + d.x1!) / 2) * k;
            const y = (innerHeight / 2) - ((d.y0! + d.y1!) / 2) * k;

            svg.transition().duration(750)
              .call(zoom.transform, d3.zoomIdentity.translate(x, y).scale(k));
          } else {
            svg.transition().duration(750)
              .call(zoom.transform, d3.zoomIdentity);
          }
        });

      const text = cell.append('text')
        .attr('x', 4)
        .attr('y', d => d.depth === 0 ? 8 : 20)
        .attr('fill', '#fff')
        .attr('font-weight', d => d.depth === 0 ? 'bold' : 'normal')
        .attr('font-size', d => d.depth === 0 ? '16px' : '12px');

      text.append('tspan')
        .text(d => d.data.name)
        .attr('x', 4)
        .attr('dy', '1.2em');

      if (selectedNode && selectedNode.data.connections) {
        const connections = g.append('g').attr('class', 'connections');
        selectedNode.data.connections.forEach(targetName => {
          const target = root.descendants().find(n => n.data.name === targetName);
          if (target) {
            connections.append('path')
              .attr('d', () => {
                const sourceX = selectedNode.x0! + (selectedNode.x1! - selectedNode.x0!) / 2;
                const sourceY = selectedNode.y0! + (selectedNode.y1! - selectedNode.y0!) / 2;
                const targetX = target.x0! + (target.x1! - target.x0!) / 2;
                const targetY = target.y0! + (target.y1! - target.y0!) / 2;
                return `M${sourceX},${sourceY}C${sourceX},${(sourceY + targetY) / 2} ${targetX},${(sourceY + targetY) / 2} ${targetX},${targetY}`;
              })
              .attr('stroke', '#fff')
              .attr('stroke-width', 2)
              .attr('fill', 'none')
              .attr('opacity', 0.4);
          }
        });
      }

      if (selectedNode && selectedNode.data.progression) {
        const progression = g.append('g')
          .attr('class', 'progression')
          .attr('transform', `translate(${selectedNode.x0!},${selectedNode.y1! + 10})`);

        progression.selectAll('text')
          .data(selectedNode.data.progression)
          .join('text')
          .attr('x', 0)
          .attr('y', (_, i) => i * 20)
          .attr('fill', '#333')
          .attr('font-size', '10px')
          .attr('class', 'text-xs sm:text-sm font-medium line-clamp-1')
          .style('text-overflow', 'ellipsis')
          .text(d => `→ ${d}`);
      }

    } catch (error) {
      console.error('Error initializing TreeMap:', error);
      setError(error as Error);
    }
  }, [dimensions, selectedNode]);

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error: {error.message}
      </div>
    );
  }

  return (
    <VisualizationContainer
      title="DevRel Skills Ecosystem"
      description="Interactive treemap visualization of Developer Relations skills and their relationships."
    >
      <div ref={wrapperRef} className="w-full h-full relative">
        <svg
          ref={svgRef}
          className="w-full h-full"
          style={{ maxHeight: '800px' }}
        />
        {hoverData && (
          <div
            className="absolute bg-secondary p-3 rounded-md shadow-md text-sm z-10"
            style={{
              top: hoverData.y + 'px',
              left: hoverData.x + 'px',
              transform: 'translate(-50%, -100%)',
              transition: 'all 0.2s ease'
            }}
          >
            <p className="font-medium">{hoverData.name}</p>
            <p className="text-xs text-muted-foreground">Value: {hoverData.value}</p>
            {hoverData.connections && hoverData.connections.length > 0 && (
              <div className="mt-1">
                <p className="text-xs font-medium">Connections:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {hoverData.connections.map((conn) => (
                    <span key={conn} className="px-1.5 py-0.5 bg-primary/10 rounded-full text-xs">
                      {conn}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </VisualizationContainer>
  );
}

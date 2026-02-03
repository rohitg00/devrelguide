"use client";

import React, { useMemo, useEffect, useRef, useState } from 'react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  TooltipProps
} from 'recharts';
import { Card } from '@/components/ui/card';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import * as d3 from 'd3';
import { VisualizationContainer } from './VisualizationContainer';

interface InsightPoint {
  x: number;
  y: number;
  z: number;
  name: string;
  category: string;
  impact: number;
  growth: number;
  engagement: number;
  trend: 'rising' | 'stable' | 'declining';
}

const CATEGORIES = {
  'Technical Content': '#8884d8',
  'Community Resources': '#82ca9d',
  'Educational Materials': '#ffc658',
  'API Documentation': '#ff7300',
  'Developer Tools': '#a4de6c'
} as const;

const TRENDS = {
  rising: '↗',
  stable: '→',
  declining: '↘'
} as const;

const generateInsightData = (): InsightPoint[] => {
  const trends: Array<'rising' | 'stable' | 'declining'> = ['rising', 'stable', 'declining'];

  return Object.keys(CATEGORIES).flatMap(category =>
    Array.from({ length: 4 }, (_, i) => ({
      name: `${category} Resource ${i + 1}`,
      category,
      x: 20 + Math.random() * 60, // Engagement score
      y: 30 + Math.random() * 40, // Effectiveness score
      z: 200 + Math.random() * 800, // Reach
      impact: 40 + Math.random() * 50,
      growth: Math.random() * 100,
      engagement: Math.random() * 1000,
      trend: trends[Math.floor(Math.random() * trends.length)]
    }))
  );
};

export function BubbleInsights() {
  const data = useMemo(() => generateInsightData(), []);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [svg, setSvg] = useState<d3.Selection<SVGSVGElement, unknown, null, undefined>>();

  useEffect(() => {
    if (wrapperRef.current && svgRef.current) {
      const svgElement = d3.select(svgRef.current);
      const width = wrapperRef.current.clientWidth;
      const height = wrapperRef.current.clientHeight;

      const xScale = d3.scaleLinear()
        .domain([0, 100])
        .range([0, width]);

      const yScale = d3.scaleLinear()
        .domain([0, 100])
        .range([height, 0]);

      const zScale = d3.scaleLinear()
        .domain([50, 400])
        .range([height, 0]);

      const colorScale = d3.scaleOrdinal(Object.values(CATEGORIES));

      const svg = svgElement.append('g');
      setSvg(svg);

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', d => xScale(d.x))
        .attr('cy', d => yScale(d.y))
        .attr('r', 5)
        .attr('fill', d => colorScale(d.category))
        .attr('opacity', 0.6);

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 10)
        .attr('fill', 'white')
        .attr('font-size', '12px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('title')
        .text(d => {
          return `
            Category: ${d.category}
            Engagement Score: ${d.x.toFixed(1)}%
            Effectiveness: ${d.y.toFixed(1)}%
            Reach: ${d.z.toFixed(0)}
            Impact Score: ${d.impact.toFixed(1)}
            Growth Rate: ${d.growth.toFixed(1)}% ${TRENDS[d.trend]}
            Total Engagement: ${d.engagement.toFixed(0)}
          `;
        });

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.category)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 20)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 30)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 40)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 50)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 60)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 70)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 80)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 90)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 100)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 110)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 120)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 130)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 140)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 150)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 160)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 170)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 180)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 190)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 200)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 210)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 220)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 230)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 240)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 250)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 260)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 270)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 280)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 290)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 300)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 310)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 320)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 330)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 340)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 350)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 360)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 370)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 380)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 390)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 400)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 410)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 420)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 430)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 440)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 450)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 460)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 470)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 480)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 490)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 500)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 510)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 520)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 530)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 540)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 550)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 560)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 570)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 580)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 590)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 600)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 610)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 620)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 630)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 640)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 650)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 660)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 670)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 680)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 690)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 700)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 710)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 720)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 730)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 740)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 750)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 760)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 770)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 780)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 790)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 800)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 810)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 820)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 830)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 840)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 850)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 860)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 870)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 880)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 890)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 900)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 910)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 920)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 930)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 940)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 950)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 960)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 970)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 980)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 990)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 1000)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 1010)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 1020)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 1030)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 1040)
        .attr('fill', 'white')
        .attr('font-size', '10px');

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('x', d => xScale(d.x) + 10)
        .attr('y', d => yScale(d.y) + 1050)
        .attr('fill', 'white')
        .attr('font-size', '10px');
    }
  }, [data, wrapperRef, svgRef]);

  const CustomTooltip = ({
    active,
    payload
  }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as InsightPoint;
      return (
        <div className="bg-card p-3 border rounded-lg shadow-lg">
          <p className="font-semibold text-foreground">{data.name}</p>
          <div className="space-y-1 mt-2">
            <p>Category: {data.category}</p>
            <p>Engagement Score: {data.x.toFixed(1)}%</p>
            <p>Effectiveness: {data.y.toFixed(1)}%</p>
            <p>Reach: {data.z.toFixed(0)}</p>
            <p>Impact Score: {data.impact.toFixed(1)}</p>
            <p>Growth Rate: {data.growth.toFixed(1)}% {TRENDS[data.trend]}</p>
            <p>Total Engagement: {data.engagement.toFixed(0)}</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <VisualizationContainer
      title="Developer Insights Bubble Chart"
      description="Interactive visualization of developer insights and trends"
    >
      <div className="w-full h-[600px]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis
              type="number"
              dataKey="x"
              name="Impact"
              domain={[0, 100]}
              label={{ value: 'Impact', position: 'bottom', offset: 0 }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="Growth"
              domain={[0, 100]}
              label={{ value: 'Growth', angle: -90, position: 'insideLeft' }}
            />
            <ZAxis
              type="number"
              dataKey="z"
              range={[50, 400]}
              name="Engagement"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {Object.entries(CATEGORIES).map(([category, color]) => (
              <Scatter
                key={category}
                name={category}
                data={data.filter(d => d.category === category)}
                fill={color}
              >
                {data
                  .filter(d => d.category === category)
                  .map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={color}
                      fillOpacity={0.6 + (entry.impact / 200)}
                    />
                  ))}
              </Scatter>
            ))}
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </VisualizationContainer>
  );
}

export default BubbleInsights;

'use client';

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { VisualizationContainer } from './VisualizationContainer';

interface TrendPoint {
  date: string;
  value: number;
  category: string;
}

interface HorizonBand {
  category: string;
  values: number[];
  dates: Date[];
}

const generateTrendData = (): TrendPoint[] => {
  const categories = [
    'Community Engagement',
    'Content Impact',
    'Technical Adoption',
    'Developer Satisfaction'
  ];
  const data: TrendPoint[] = [];
  const now = new Date();

  categories.forEach(category => {
    let baseValue = Math.random() * 50 + 50;
    for (let i = 0; i < 90; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);

      const seasonal = Math.sin((i / 30) * Math.PI) * 15;
      const trend = (i / 90) * 20;
      const noise = (Math.random() - 0.5) * 10;

      baseValue = Math.max(0, Math.min(100,
        baseValue + seasonal + trend + noise
      ));

      data.push({
        date: date.toISOString().split('T')[0],
        value: baseValue,
        category
      });
    }
  });

  return data.sort((a, b) => a.date.localeCompare(b.date));
};

const BANDS = 4;
const OVERLAP = 0.1;

export function HorizonChart() {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !wrapperRef.current) return;

    const data = generateTrendData();
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 30, right: 10, bottom: 30, left: 40 };
    const width = wrapperRef.current.clientWidth;
    const height = 120;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const categories = Array.from(new Set(data.map(d => d.category)));
    const dates = Array.from(new Set(data.map(d => new Date(d.date))));

    const x = d3.scaleTime()
      .domain(d3.extent(dates) as [Date, Date])
      .range([0, innerWidth]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) || 0])
      .range([innerHeight, 0]);

    const colorScales = {
      'Community Engagement': d3.interpolateBlues,
      'Content Impact': d3.interpolateGreens,
      'Technical Adoption': d3.interpolateOranges,
      'Developer Satisfaction': d3.interpolatePurples
    };

    categories.forEach((category, categoryIndex) => {
      const categoryData = data.filter(d => d.category === category);
      const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top + categoryIndex * (height + 20)})`);

      const maxValue = d3.max(categoryData, d => d.value) || 0;
      const bandSize = maxValue / BANDS;
      const colorScale = colorScales[category as keyof typeof colorScales];

      const area = d3.area<TrendPoint>()
        .x(d => x(new Date(d.date)))
        .y0(innerHeight)
        .y1(d => y(d.value))
        .curve(d3.curveBasis);

      for (let band = 0; band < BANDS; band++) {
        const bandData = categoryData.map(d => ({
          ...d,
          value: Math.max(0, Math.min(bandSize, d.value - band * bandSize))
        }));

        g.append('path')
          .datum(bandData)
          .attr('d', area)
          .attr('fill', colorScale((band + 1) / (BANDS + 1)))
          .attr('opacity', 0.7);
      }

      if (categoryIndex === categories.length - 1) {
        g.append('g')
          .attr('transform', `translate(0,${innerHeight})`)
          .call(d3.axisBottom(x).ticks(5));
      }

      g.append('g')
        .call(d3.axisLeft(y).ticks(3));

      g.append('text')
        .attr('x', -margin.left)
        .attr('y', -margin.top / 2)
        .attr('fill', 'currentColor')
        .attr('font-weight', 'medium')
        .text(category);

      const bisect = d3.bisector<TrendPoint, Date>(d => new Date(d.date)).left;

      const focusLine = g.append('line')
        .attr('stroke', 'currentColor')
        .attr('y1', 0)
        .attr('y2', innerHeight)
        .style('opacity', 0);

      const focusText = g.append('text')
        .attr('fill', 'currentColor')
        .attr('font-size', '12px')
        .style('opacity', 0);

      g.append('rect')
        .attr('width', innerWidth)
        .attr('height', innerHeight)
        .attr('fill', 'none')
        .attr('pointer-events', 'all')
        .on('mousemove', (event) => {
          const [mouseX] = d3.pointer(event);
          const x0 = x.invert(mouseX);
          const i = bisect(categoryData, x0, 1);
          const d0 = categoryData[i - 1];
          const d1 = categoryData[i];
          const d = x0.getTime() - new Date(d0.date).getTime() > new Date(d1.date).getTime() - x0.getTime() ? d1 : d0;

          focusLine
            .attr('x1', x(new Date(d.date)))
            .attr('x2', x(new Date(d.date)))
            .style('opacity', 1);

          focusText
            .attr('x', x(new Date(d.date)) + 5)
            .attr('y', y(d.value) - 5)
            .text(`${d.value.toFixed(1)}`)
            .style('opacity', 1);
        })
        .on('mouseleave', () => {
          focusLine.style('opacity', 0);
          focusText.style('opacity', 0);
        });
    });

  }, []);

  return (
    <VisualizationContainer
      title="Developer Engagement Horizon Chart"
      description="Visualization of developer engagement metrics over time"
    >
      <div ref={wrapperRef} className="w-full h-[500px]">
        <svg ref={svgRef} className="w-full h-full" />
      </div>
    </VisualizationContainer>
  );
}

export default HorizonChart;

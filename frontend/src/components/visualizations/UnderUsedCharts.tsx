'use client';

import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

interface MetricPoint {
  name: string;
  value: number;
  category: string;
  impact: number;
}

const metricsData: MetricPoint[] = [
  { name: 'Documentation Views', value: 85, category: 'Content', impact: 0.8 },
  { name: 'GitHub Stars', value: 92, category: 'Community', impact: 0.9 },
  { name: 'Forum Posts', value: 78, category: 'Community', impact: 0.7 },
  { name: 'Workshop Attendance', value: 88, category: 'Education', impact: 0.85 },
  { name: 'API Usage', value: 95, category: 'Technical', impact: 0.95 },
  { name: 'Blog Engagement', value: 82, category: 'Content', impact: 0.75 },
  { name: 'Discord Members', value: 90, category: 'Community', impact: 0.85 },
  { name: 'Code Samples', value: 86, category: 'Technical', impact: 0.8 }
];

const COLORS = {
  Content: '#4CAF50',
  Community: '#2196F3',
  Education: '#FFC107',
  Technical: '#9C27B0'
};

const transformDataForViolin = () => {
  const categories = Array.from(new Set(metricsData.map(d => d.category)));
  const step = 5;
  const points: any[] = [];

  categories.forEach((category) => {
    const metrics = metricsData.filter(d => d.category === category);
    const values = metrics.map(d => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);

    for (let value = min; value <= max; value += step) {
      const density = values.filter(v => v >= value && v < value + step).length / metrics.length;
      points.push({
        category,
        value,
        density: density * 50,
        impact: metrics.reduce((acc, curr) => acc + curr.impact, 0) / metrics.length,
        color: COLORS[category as keyof typeof COLORS]
      });
    }
  });

  return points;
};

export function UnderUsedCharts() {
  const violinData = transformDataForViolin();

  return (
    <div className="w-full h-[600px] p-4">
      <ResponsiveContainer>
        <ComposedChart data={violinData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="value"
            type="number"
            domain={[0, 100]}
            label={{ value: 'Metric Value', position: 'bottom' }}
          />
          <YAxis
            yAxisId="density"
            orientation="left"
            label={{ value: 'Density', angle: -90, position: 'insideLeft' }}
          />
          <YAxis
            yAxisId="impact"
            orientation="right"
            domain={[0, 1]}
            label={{ value: 'Impact Score', angle: 90, position: 'insideRight' }}
          />
          {Array.from(new Set(violinData.map(d => d.category))).map((category) => (
            <Area
              key={category}
              type="monotone"
              dataKey="density"
              data={violinData.filter(d => d.category === category)}
              stroke={COLORS[category as keyof typeof COLORS]}
              fill={COLORS[category as keyof typeof COLORS]}
              fillOpacity={0.6}
              yAxisId="density"
              name={`${category} Distribution`}
            />
          ))}
          <Scatter
            data={metricsData}
            fill="#8884d8"
            yAxisId="impact"
            dataKey="impact"
          >
            {metricsData.map((entry, index) => (
              <cell
                key={`cell-${index}`}
                fill={COLORS[entry.category as keyof typeof COLORS]}
              />
            ))}
          </Scatter>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-white p-2 border rounded shadow">
                    <p className="font-semibold">{data.category}</p>
                    <p>Value: {data.value}</p>
                    {data.impact && <p>Impact: {data.impact.toFixed(2)}</p>}
                    {data.density && <p>Density: {(data.density / 50).toFixed(2)}</p>}
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

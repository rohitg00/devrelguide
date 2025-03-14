'use client';

import React from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  Legend
} from 'recharts';

interface MetricPoint {
  subject: string;
  community: number;
  technical: number;
  content: number;
  strategy: number;
}

const data: MetricPoint[] = [
  {
    subject: 'Documentation',
    community: 80,
    technical: 90,
    content: 95,
    strategy: 70
  },
  {
    subject: 'API Support',
    community: 85,
    technical: 95,
    content: 80,
    strategy: 75
  },
  {
    subject: 'Events',
    community: 95,
    technical: 75,
    content: 85,
    strategy: 90
  },
  {
    subject: 'Education',
    community: 90,
    technical: 85,
    content: 90,
    strategy: 85
  },
  {
    subject: 'Analytics',
    community: 75,
    technical: 80,
    content: 70,
    strategy: 95
  }
];

export function CustomDataViz() {
  return (
    <div className="w-full h-[500px] p-4">
      <h3 className="text-lg font-semibold mb-4">DevRel Impact Radar</h3>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis angle={30} domain={[0, 100]} />
          <Radar
            name="Community Impact"
            dataKey="community"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.6}
          />
          <Radar
            name="Technical Depth"
            dataKey="technical"
            stroke="#82ca9d"
            fill="#82ca9d"
            fillOpacity={0.6}
          />
          <Radar
            name="Content Quality"
            dataKey="content"
            stroke="#ffc658"
            fill="#ffc658"
            fillOpacity={0.6}
          />
          <Radar
            name="Strategic Value"
            dataKey="strategy"
            stroke="#ff7c43"
            fill="#ff7c43"
            fillOpacity={0.6}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white p-2 border rounded shadow">
                    <p className="font-semibold">{label}</p>
                    {payload.map((entry, index) => (
                      <p key={index} style={{ color: entry.color }}>
                        {entry.name}: {entry.value}
                      </p>
                    ))}
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

'use client';

import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

interface MarketMetric {
  year: string;
  communityGrowth: number;
  resourceUsage: number;
  marketImpact: number;
  developmentCycle: number;
}

const data: MarketMetric[] = [
  {
    year: '2020',
    communityGrowth: 30,
    resourceUsage: 40,
    marketImpact: 20,
    developmentCycle: 60
  },
  {
    year: '2021',
    communityGrowth: 45,
    resourceUsage: 55,
    marketImpact: 35,
    developmentCycle: 75
  },
  {
    year: '2022',
    communityGrowth: 65,
    resourceUsage: 70,
    marketImpact: 50,
    developmentCycle: 85
  },
  {
    year: '2023',
    communityGrowth: 80,
    resourceUsage: 85,
    marketImpact: 65,
    developmentCycle: 90
  }
];

export function MarketImpactFlow() {
  return (
    <div className="p-4 sm:p-6">
      <h3 className="text-lg font-semibold mb-4">Market Impact Analysis</h3>
      <div className="w-full aspect-[4/3] min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis dataKey="year" />
            <YAxis />
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
            <Bar
              dataKey="communityGrowth"
              fill="#8884d8"
              name="Community Growth"
            />
            <Bar
              dataKey="resourceUsage"
              fill="#82ca9d"
              name="Resource Usage"
            />
            <Line
              type="monotone"
              dataKey="marketImpact"
              stroke="#ff7300"
              name="Market Impact"
            />
            <Line
              type="monotone"
              dataKey="developmentCycle"
              stroke="#413ea0"
              strokeDasharray="5 5"
              name="Development Cycle"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default MarketImpactFlow;

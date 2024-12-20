"use client";

import React, { useMemo } from 'react';
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

  const CustomTooltip = ({
    active,
    payload
  }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as InsightPoint;
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{data.name}</p>
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
    <Card className="p-4 sm:p-6">
      <h3 className="text-lg font-semibold mb-4">Resource Impact Analysis</h3>
      <div className="w-full aspect-[4/3] min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis
              type="number"
              dataKey="x"
              name="engagement"
              label={{ value: 'Engagement Score (%)', position: 'bottom' }}
              domain={[0, 100]}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="effectiveness"
              label={{ value: 'Effectiveness Score (%)', angle: -90, position: 'left' }}
              domain={[0, 100]}
            />
            <ZAxis
              type="number"
              dataKey="z"
              range={[50, 400]}
              name="reach"
            />
            <Tooltip content={CustomTooltip} />
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
                      key={index}
                      fill={color}
                      fillOpacity={0.6 + (entry.impact / 200)}
                    />
                  ))}
              </Scatter>
            ))}
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export default BubbleInsights;

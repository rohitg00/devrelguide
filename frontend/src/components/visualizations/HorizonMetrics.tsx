"use client";

import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  TooltipProps
} from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { VisualizationContainer } from './VisualizationContainer';

interface MetricPoint {
  date: string;
  engagement: number;
  sentiment: number;
  activity: number;
  baseline: number;
  trend: number;
}

const generateData = (): MetricPoint[] => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
  const baseline = 50;
  return months.map(month => {
    const engagement = Math.floor(Math.random() * 100) + 20;
    const sentiment = Math.floor(Math.random() * 100) + 10;
    const activity = Math.floor(Math.random() * 100) + 30;
    return {
      date: month,
      engagement,
      sentiment,
      activity,
      baseline,
      trend: (engagement + sentiment + activity) / 3
    };
  });
};

export function HorizonMetrics() {
  const data = useMemo(() => generateData(), []);

  const CustomTooltip = ({
    active,
    payload,
    label
  }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card p-3 border rounded-lg shadow-lg">
          <p className="font-semibold text-foreground">{label}</p>
          <div className="space-y-1 mt-2">
            {payload.map((entry, index) => (
              <p
                key={index}
                style={{ color: entry.color }}
                className="flex justify-between"
              >
                <span>{entry.name}:</span>
                <span className="font-medium ml-4">
                  {typeof entry.value === 'number' ? entry.value.toFixed(1) : entry.value}
                </span>
              </p>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <VisualizationContainer
      title="Developer Engagement Horizon"
      description="Visualization of developer engagement metrics over time"
    >
      <div className="w-full aspect-[4/3] min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis
              dataKey="date"
              tick={{ fill: '#666' }}
              axisLine={{ stroke: '#666' }}
            />
            <YAxis
              yAxisId="left"
              orientation="left"
              tick={{ fill: '#666' }}
              axisLine={{ stroke: '#666' }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fill: '#666' }}
              axisLine={{ stroke: '#666' }}
            />
            <Tooltip content={CustomTooltip} />
            <Legend />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="engagement"
              fill="#8884d8"
              stroke="#8884d8"
              fillOpacity={0.3}
              name="Community Engagement"
            />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="sentiment"
              fill="#82ca9d"
              stroke="#82ca9d"
              fillOpacity={0.3}
              name="Developer Sentiment"
            />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="activity"
              fill="#ffc658"
              stroke="#ffc658"
              fillOpacity={0.3}
              name="Platform Activity"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="trend"
              stroke="#ff7300"
              strokeWidth={2}
              dot={false}
              name="Overall Trend"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="baseline"
              stroke="#666"
              strokeDasharray="5 5"
              strokeWidth={1}
              dot={false}
              name="Baseline"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </VisualizationContainer>
  );
}

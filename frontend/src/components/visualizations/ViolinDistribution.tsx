'use client';

import React, { useMemo } from 'react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip } from 'recharts';

interface DataPoint {
  channel: string;
  engagement: number;
  frequency: number;
  size: number;
}

const generateViolinData = (): DataPoint[] => {
  const channels = ['Documentation', 'Forums', 'GitHub', 'Discord', 'Twitter'];
  const data: DataPoint[] = [];

  channels.forEach((channel, channelIndex) => {
    // Generate 20 points for each channel to create violin shape
    for (let i = 0; i < 20; i++) {
      const engagement = Math.random() * 100;
      // Create normal distribution using Box-Muller transform
      const u = 1 - Math.random();
      const v = Math.random();
      const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
      const frequency = Math.exp(-(Math.pow(engagement - 50, 2) / (2 * Math.pow(20, 2)))) * 100;

      data.push({
        channel,
        engagement,
        frequency: Math.max(0, frequency + z * 10),
        size: 20 // Consistent size for all points
      });
    }
  });

  return data;
};

const COLORS = {
  Documentation: '#8884d8',
  Forums: '#82ca9d',
  GitHub: '#ffc658',
  Discord: '#ff7300',
  Twitter: '#a4de6c'
} as const;

export function ViolinDistribution() {
  const data = useMemo(() => generateViolinData(), []);

  return (
    <div className="w-full h-screen max-h-[80vh] min-h-[400px] p-2 sm:p-4">
      <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4">Developer Engagement Distribution</h3>
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <XAxis
            dataKey="channel"
            type="category"
            name="Channel"
            allowDuplicatedCategory={false}
            tick={{ fontSize: '0.75rem' }}
          />
          <YAxis
            dataKey="engagement"
            name="Engagement Level"
            domain={[0, 100]}
            label={{ value: 'Engagement Level', angle: -90, position: 'insideLeft', style: { fontSize: '0.75rem' } }}
            tick={{ fontSize: '0.75rem' }}
          />
          <ZAxis
            dataKey="frequency"
            range={[0, 400]}
            name="Frequency"
          />
          {Object.keys(COLORS).map((channel) => (
            <Scatter
              key={channel}
              name={channel}
              data={data.filter(d => d.channel === channel)}
              fill={COLORS[channel as keyof typeof COLORS]}
            />
          ))}
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload as DataPoint;
                return (
                  <div className="bg-white p-2 border rounded shadow-lg text-xs sm:text-sm">
                    <p className="font-semibold">{data.channel}</p>
                    <p>Engagement Level: {Math.round(data.engagement)}</p>
                    <p>Frequency: {Math.round(data.frequency)}</p>
                  </div>
                );
              }
              return null;
            }}
          />
        </ScatterChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap gap-2 sm:gap-4 mt-2 sm:mt-4 justify-center">
        {Object.entries(COLORS).map(([channel, color]) => (
          <div key={channel} className="flex items-center gap-1 sm:gap-2">
            <div
              className="w-3 h-3 sm:w-4 sm:h-4 rounded"
              style={{ backgroundColor: color }}
            />
            <span className="text-xs sm:text-sm">{channel}</span>
          </div>
        ))}
      </div>
      <div className="text-xs sm:text-sm text-gray-600 mt-2 sm:mt-4 text-center px-2">
        Distribution of developer engagement across different channels,
        showing engagement patterns and frequency density
      </div>
    </div>
  );
}

export default ViolinDistribution;

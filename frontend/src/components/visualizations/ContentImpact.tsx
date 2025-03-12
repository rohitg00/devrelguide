'use client';

import { useMemo } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { useFetchVisualization } from '@/lib/use-fetch-visualization';
import { fallbackData } from '@/lib/visualization-utils';
import { useResponsiveVisualizationSize } from '@/lib/use-responsive-visualization-size';

// Types for custom data
interface ContentItem {
  type: string;
  views: number;
  reactions: number;
  shares: number;
  conversions: number;
  engagement: number;
}

interface ContentImpactProps {
  customData?: ContentItem[];
}

// Sample data for content impact
const sampleData: ContentItem[] = [
  {
    type: "Blog Posts",
    views: 24000,
    reactions: 3200,
    shares: 1800,
    conversions: 920,
    engagement: 7900
  },
  {
    type: "Tutorials",
    views: 18500,
    reactions: 4100,
    shares: 2300,
    conversions: 1520,
    engagement: 6200
  },
  {
    type: "Documentation",
    views: 35000,
    reactions: 2100,
    shares: 1200,
    conversions: 2800,
    engagement: 5600
  },
  {
    type: "Videos",
    views: 12000,
    reactions: 3600,
    shares: 2900,
    conversions: 870,
    engagement: 4700
  },
  {
    type: "Social Media",
    views: 38000,
    reactions: 7200,
    shares: 5600,
    conversions: 1300,
    engagement: 9400
  },
  {
    type: "Webinars",
    views: 8500,
    reactions: 2400,
    shares: 1700,
    conversions: 940,
    engagement: 3800
  },
  {
    type: "Podcasts",
    views: 9600,
    reactions: 1900,
    shares: 2200,
    conversions: 680,
    engagement: 3100
  }
];

// Define the keys we want to display in the chart
const dataKeys = ['views', 'reactions', 'shares', 'conversions', 'engagement'];

// Define colors for metrics
const metricColors = {
  views: 'hsl(210, 70%, 50%)',
  reactions: 'hsl(40, 70%, 50%)',
  shares: 'hsl(120, 60%, 50%)',
  conversions: 'hsl(340, 70%, 50%)',
  engagement: 'hsl(275, 70%, 50%)'
};

export function ContentImpact({ customData }: ContentImpactProps) {
  const { data, loading, error } = useFetchVisualization<ContentItem[]>(
    '/api/visualizations/content-impact',
    customData || sampleData // Use customData if provided, otherwise use sampleData
  );

  const { containerRef } = useResponsiveVisualizationSize({
    defaultWidth: 800,
    defaultHeight: 500,
    minWidth: 300,
    minHeight: 300,
    aspectRatio: 16/9,
  });

  // Process data into the format needed for visualization
  // Ensure all values are positive to avoid rendering issues
  const processedData = useMemo(() => {
    if (!data || !data.length) return [];
    
    return data.map(item => {
      // Ensure all values are positive numbers
      const ensurePositive = (value: number) => Math.max(1, value || 0);
      
      return {
        type: item.type || 'Unknown',
        views: ensurePositive(item.views),
        reactions: ensurePositive(item.reactions),
        shares: ensurePositive(item.shares),
        conversions: ensurePositive(item.conversions),
        engagement: ensurePositive(item.engagement),
        // Add a normalized engagement score (0-100) for easier comparison
        engagementScore: Math.round((ensurePositive(item.engagement) / ensurePositive(item.views)) * 100)
      };
    });
  }, [data]);

  // Get the color for a specific metric
  const getMetricColor = (id: string | undefined) => {
    if (!id) return 'gray';
    return metricColors[id as keyof typeof metricColors] || 'gray';
  };

  if (loading) return <div className="h-full flex items-center justify-center"><p>Loading content impact visualization...</p></div>;
  if (error) return <div className="h-full flex items-center justify-center"><p className="text-red-500">Error loading data</p></div>;
  if (!processedData.length) return <div className="h-full flex items-center justify-center"><p>No data available for visualization</p></div>;

  return (
    <div ref={containerRef} className="w-full h-full flex flex-col" style={{ minHeight: '400px' }}>
      <div className="flex-grow" style={{ minHeight: '350px' }}>
        <ResponsiveBar
          data={processedData}
          keys={dataKeys}
          indexBy="type"
          margin={{ top: 50, right: 130, bottom: 80, left: 80 }}
          padding={0.3}
          groupMode="grouped"
          layout="vertical"
          valueScale={{ type: 'linear' }}
          indexScale={{ type: 'band', round: true }}
          colors={({ id }) => getMetricColor(id)}
          borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -45,
            legend: 'Content Type',
            legendPosition: 'middle',
            legendOffset: 60
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Count',
            legendPosition: 'middle',
            legendOffset: -60,
            format: value => 
              value >= 1000 ? `${Math.round(value / 1000)}k` : value.toString()
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor={{ from: 'color', modifiers: [['darker', 3]] }}
          legends={[
            {
              dataFrom: 'keys',
              anchor: 'bottom-right',
              direction: 'column',
              justify: false,
              translateX: 120,
              translateY: 0,
              itemsSpacing: 2,
              itemWidth: 100,
              itemHeight: 20,
              itemDirection: 'left-to-right',
              itemOpacity: 0.85,
              symbolSize: 20,
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemOpacity: 1
                  }
                }
              ]
            }
          ]}
          role="application"
          ariaLabel="Content Impact Visualization"
          tooltip={({ id, value, color, indexValue }) => {
            if (!id || !indexValue) return null;
            return (
              <div className="bg-white p-2 shadow-lg rounded-md border text-xs">
                <strong>{indexValue}: {id}</strong>
                <div style={{ color }}>Value: {value ? value.toLocaleString() : '0'}</div>
                {id === 'engagement' && (
                  <div>
                    Engagement rate: {Math.round((value / (processedData.find(d => d.type === indexValue)?.views || 1)) * 100)}%
                  </div>
                )}
              </div>
            );
          }}
        />
      </div>
    </div>
  );
}

export default ContentImpact; 
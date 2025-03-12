"use client";

import React, { useMemo } from 'react';
import { ResponsiveContainer, Sankey, Tooltip, TooltipProps } from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { VisualizationContainer } from './VisualizationContainer';
import { useFetchVisualization, fallbackData } from '@/lib/visualization-utils';

interface Node {
  name: string;
  category: string;
}

interface Link {
  source: number;
  target: number;
  value: number;
  category: string;
}

interface SankeyData {
  nodes: Node[];
  links: Link[];
}

type SankeyNode = Node & {
  depth?: number;
};

type SankeyLink = Link & {
  source?: SankeyNode;
  target?: SankeyNode;
};

type CategoryColors = {
  [K in 'discovery' | 'learning' | 'engagement' | 'contribution' | 'leadership']: string;
};

// More vibrant category colors for better visibility
const CATEGORIES: CategoryColors = {
  discovery: '#8764FF',   // Brighter purple
  learning: '#00C49F',    // Brighter teal
  engagement: '#FFC658',  // Amber (kept the same)
  contribution: '#FF5733', // Brighter orange
  leadership: '#7CDA24'   // Brighter green
};

const generateSankeyData = (): SankeyData => ({
  nodes: [
    { name: 'New Developer', category: 'discovery' },
    { name: 'Resource Explorer', category: 'discovery' },
    { name: 'Documentation Reader', category: 'learning' },
    { name: 'API Practitioner', category: 'learning' },
    { name: 'Community Member', category: 'engagement' },
    { name: 'Forum Participant', category: 'engagement' },
    { name: 'Content Creator', category: 'contribution' },
    { name: 'Code Contributor', category: 'contribution' },
    { name: 'Community Leader', category: 'leadership' },
    { name: 'DevRel Advocate', category: 'leadership' }
  ],
  links: [
    { source: 0, target: 1, value: 100, category: 'discovery' },
    { source: 1, target: 2, value: 85, category: 'learning' },
    { source: 1, target: 3, value: 65, category: 'learning' },
    { source: 2, target: 4, value: 60, category: 'engagement' },
    { source: 3, target: 5, value: 45, category: 'engagement' },
    { source: 4, target: 6, value: 40, category: 'contribution' },
    { source: 5, target: 7, value: 35, category: 'contribution' },
    { source: 6, target: 8, value: 25, category: 'leadership' },
    { source: 7, target: 8, value: 20, category: 'leadership' },
    { source: 8, target: 9, value: 30, category: 'leadership' }
  ]
});

export function DeveloperProgressFlow() {
  // Use API data with fallback to static data if the API fails
  const { data: apiData, loading, error, retry } = useFetchVisualization<SankeyData>({
    endpoint: '/api/visualizations/developer-progress',
    fallbackData: fallbackData.developerProgress
  });

  // Use either API data or generate static data if no API data
  const data = useMemo(() => apiData || generateSankeyData(), [apiData]);

  const CustomTooltip = ({
    active,
    payload
  }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length) {
      // Safely accessing payload with type checking
      const payloadItem = payload[0];
      if (!payloadItem || !payloadItem.payload) return null;
      
      const linkData = payloadItem.payload as SankeyLink;
      if (!linkData.source || !linkData.target) return null;
      
      const sourceNode = linkData.source as SankeyNode;
      const targetNode = linkData.target as SankeyNode;
      const value = payloadItem.value;
      const category = linkData.category;

      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">Developer Journey Stage</p>
          <div className="space-y-1 mt-2">
            <p>From: {sourceNode.name}</p>
            <p>To: {targetNode.name}</p>
            <p>Phase: {category.charAt(0).toUpperCase() + category.slice(1)}</p>
            <p>Flow Strength: {value}</p>
            <p className="text-sm text-gray-600 mt-1">
              {value}% of developers progress through this path
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const getCategoryColor = (category: string): string => {
    return category in CATEGORIES 
      ? CATEGORIES[category as keyof CategoryColors] 
      : '#cccccc';
  };

  return (
    <VisualizationContainer
      title="Developer Progress Stages"
      description="Visualization of developer progression stages and transitions between different levels of engagement"
      hasError={!!error}
      isLoading={loading}
      errorMessage={error ? error.message : ''}
      onRetry={retry}
    >
      <div className="w-full h-[500px]">
        <ResponsiveContainer width="100%" height="100%">
          <Sankey
            data={data}
            nodeWidth={20}
            nodePadding={30}
            margin={{ top: 20, right: 30, bottom: 20, left: 30 }}
            link={
              {
                stroke: '#000',  // Black border for better visibility
                strokeOpacity: 0.2,
                fill: '#000',
                fillOpacity: 0.12,
                style: {
                  stroke: (entry: any) => getCategoryColor(entry.category),
                  fill: (entry: any) => getCategoryColor(entry.category),
                  fillOpacity: 0.8,
                  strokeOpacity: 0.5,
                  strokeWidth: 1
                }
              } as any
            }
            node={
              {
                stroke: '#000',
                strokeWidth: 1,
                strokeOpacity: 0.3,
                style: {
                  fill: (entry: any) => getCategoryColor(entry.category),
                  fillOpacity: 0.9,  // More opaque for better visibility
                  stroke: '#000',
                  strokeWidth: 1
                }
              } as any
            }
          >
            <Tooltip content={<CustomTooltip />} />
          </Sankey>
        </ResponsiveContainer>
        <div className="flex flex-wrap gap-4 mt-4 justify-center">
          {Object.entries(CATEGORIES).map(([category, color]) => (
            <div key={category} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded border border-gray-300"
                style={{ backgroundColor: color }}
              />
              <span className="text-sm capitalize">
                {category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </VisualizationContainer>
  );
}

export default DeveloperProgressFlow;

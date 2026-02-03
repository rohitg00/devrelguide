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
  const data = useMemo(() => {
    const d = apiData || generateSankeyData();
    return d && d.nodes && d.links ? d : generateSankeyData();
  }, [apiData]);

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
        <div className="bg-card p-3 border rounded-lg shadow-lg">
          <p className="font-semibold text-foreground">Developer Journey Stage</p>
          <div className="space-y-1 mt-2">
            <p>From: {sourceNode.name}</p>
            <p>To: {targetNode.name}</p>
            <p>Phase: {category.charAt(0).toUpperCase() + category.slice(1)}</p>
            <p>Flow Strength: {value}</p>
            <p className="text-sm text-muted-foreground mt-1">
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
      <div className="flex flex-col space-y-4">
        {/* Legend displayed at the top for better visibility */}
        <div className="bg-muted/50 p-3 rounded-lg border border-border">
          <h4 className="font-semibold text-center mb-2">Journey Stages Legend</h4>
          <div className="flex flex-wrap gap-3 justify-center">
            {Object.entries(CATEGORIES).map(([category, color]) => (
              <div key={category} className="flex items-center gap-1 px-2 py-1 bg-card rounded shadow-sm">
                <div
                  className="w-4 h-4 rounded border border-border"
                  style={{ backgroundColor: color }}
                />
                <span className="text-sm font-medium capitalize">
                  {category}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Visualization */}
        <div className="w-full h-[400px] relative">
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
          
          {/* Overlay node labels */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <div className="absolute left-[5%] top-[45%] transform -translate-y-1/2 bg-card/80 p-1 rounded text-xs">
              New Developer
            </div>
            <div className="absolute right-[5%] bottom-[35%] transform -translate-y-1/2 bg-card/80 p-1 rounded text-xs">
              DevRel Advocate
            </div>
          </div>
        </div>
        
        {/* Explanation section */}
        <div className="bg-muted/50 p-4 rounded-lg border border-border">
          <h4 className="font-semibold text-foreground mb-2 text-center">How to Read This Visualization</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="flex items-center gap-2">
                <span className="bg-blue-500 w-4 h-4 inline-block"></span>
                <strong>Blue Bars:</strong> Developer stages in the journey
              </p>
              <p className="flex items-center gap-2">
                <span className="bg-gradient-to-r from-purple-500 to-green-500 w-8 h-2 inline-block"></span>
                <strong>Colored Flows:</strong> Developer transitions between stages
              </p>
              <p className="flex items-center gap-2">
                <span className="font-mono">100 → 85</span>
                <strong>Numbers:</strong> Percentage of developers following each path
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm">
                <strong>Starting Point:</strong> The journey begins with 100% of new developers
              </p>
              <p className="text-sm">
                <strong>Flow Thickness:</strong> Thicker flows indicate more common paths
              </p>
              <p className="text-sm italic">
                Hover over any flow to see detailed transition information
              </p>
            </div>
          </div>
        </div>
        
        {/* Node names legend */}
        <div className="bg-card p-3 rounded-lg border border-border">
          <h5 className="font-medium text-center mb-2 text-sm">Developer Stages</h5>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 text-xs">
            {(data.nodes || []).map((node, index) => (
              <div key={index} className="flex items-center gap-1">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: getCategoryColor(node.category) }}
                ></div>
                <span>{node.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </VisualizationContainer>
  );
}

export default DeveloperProgressFlow;

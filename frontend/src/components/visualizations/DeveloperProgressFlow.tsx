"use client";

import React, { useMemo } from 'react';
import { ResponsiveContainer, Sankey, Tooltip, TooltipProps } from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

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

type SankeyLink = Omit<Link, 'source' | 'target'> & {
  source: SankeyNode;
  target: SankeyNode;
};

type CategoryColors = {
  [K in 'discovery' | 'learning' | 'engagement' | 'contribution' | 'leadership']: string;
};

const CATEGORIES: CategoryColors = {
  discovery: '#8884d8',
  learning: '#82ca9d',
  engagement: '#ffc658',
  contribution: '#ff7300',
  leadership: '#a4de6c'
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
  const data = useMemo(() => generateSankeyData(), []);

  const CustomTooltip = ({
    active,
    payload
  }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length) {
      const sourceNode = payload[0].payload.source;
      const targetNode = payload[0].payload.target;
      const value = payload[0].value;
      const category = payload[0].payload.category;

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

  const getCategoryColor = (category: keyof CategoryColors): string => {
    return CATEGORIES[category] || '#cccccc';
  };

  return (
    <div className="w-full h-[600px] p-4">
      <h3 className="text-lg font-semibold mb-4">Developer Journey Flow</h3>
      <ResponsiveContainer width="100%" height="100%">
        <Sankey
          data={data}
          nodeWidth={15}
          nodePadding={20}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          link={{
            stroke: '#cccccc',
            strokeOpacity: (entry: any) => entry.category === 'discovery' ? 0.7 : 0.5,
            fill: '#cccccc',
            fillOpacity: (entry: any) => entry.category === 'discovery' ? 0.7 : 0.5,
            style: {
              stroke: (entry: any) => getCategoryColor(entry.category),
              fill: (entry: any) => getCategoryColor(entry.category)
            }
          }}
          node={{
            fill: '#cccccc',
            style: {
              fill: (entry: any) => getCategoryColor(entry.category)
            }
          }}
        >
          <Tooltip content={CustomTooltip} />
        </Sankey>
      </ResponsiveContainer>
      <div className="flex flex-wrap gap-4 mt-4 justify-center">
        {Object.entries(CATEGORIES).map(([category, color]) => (
          <div key={category} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: color }}
            />
            <span className="text-sm capitalize">
              {category}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DeveloperProgressFlow;

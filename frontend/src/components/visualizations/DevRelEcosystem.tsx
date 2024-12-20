'use client';

import React, { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  Sankey,
  Tooltip
} from 'recharts';

interface Node {
  id: number;
  name: string;
  fullName: string;
  type: 'category' | 'activity' | 'component';
  size: number;
  order: number;
}

interface Link {
  source: number;
  target: number;
  value: number;
}

interface EcosystemData {
  nodes: Node[];
  links: Link[];
}

const categoryColors = {
  category: '#3B82F6',    // Blue
  activity: '#10B981',    // Green
  component: '#8B5CF6'    // Purple
};

const DevRelEcosystem: React.FC = () => {
  const [ecosystemData, setEcosystemData] = useState<EcosystemData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const response = await fetch(`${apiUrl}/api/visualizations/devrel-ecosystem`);
        if (!response.ok) {
          throw new Error('Failed to fetch ecosystem data');
        }
        const data = await response.json();
        setEcosystemData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-[600px] bg-white p-6 rounded-xl shadow-lg flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[600px] bg-white p-6 rounded-xl shadow-lg flex items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!ecosystemData) {
    return (
      <div className="w-full h-[600px] bg-white p-6 rounded-xl shadow-lg flex items-center justify-center">
        <div className="text-gray-500">No data available</div>
      </div>
    );
  }

  return (
    <div className="w-full h-[600px] bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">DevRel Framework Ecosystem</h3>
      <p className="text-sm text-gray-600 mb-6">
        Explore the interconnected components of the Developer Relations framework
      </p>
      <ResponsiveContainer width="100%" height="80%">
        <Sankey
          data={ecosystemData}
          node={{
            nodePadding: 50,
            nodeWidth: 10,
            fill: (node: any) => categoryColors[node.type] || '#94A3B8'
          }}
          link={{
            stroke: '#cbd5e1',
            strokeWidth: 2,
            strokeOpacity: 0.2,
            fill: '#cbd5e1',
            fillOpacity: 0.2
          }}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const node = payload[0].payload;
                return (
                  <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                    <p className="font-medium">{node.fullName || node.name}</p>
                    <p className="text-sm text-gray-600">Type: {node.type}</p>
                    {node.value && (
                      <p className="text-sm">Flow Value: {node.value}</p>
                    )}
                  </div>
                );
              }
              return null;
            }}
          />
        </Sankey>
      </ResponsiveContainer>
    </div>
  );
};

export default DevRelEcosystem;

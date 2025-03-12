'use client';

import React, { useRef } from 'react';
import { ResponsiveContainer, Treemap, Tooltip } from 'recharts';
import { VisualizationContainer } from './VisualizationContainer';
import { useFetchVisualization, fallbackData, useResponsiveVisualizationSize } from '@/lib/visualization-utils';

interface CareerNode {
  name: string;
  size: number;
  category: string;
  skills: string[];
  level: 'Entry' | 'Mid' | 'Senior' | 'Lead';
}

const COLORS: Record<string, string> = {
  Content: '#8884d8',
  Engagement: '#82ca9d',
  Education: '#ffc658',
  Technical: '#ff7c43',
  Leadership: '#8dd1e1',
  default: '#b0bec5'
};

export function CareerPathway() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Use our custom hook for fetching data with fallback and error handling
  const { data, loading, error, retry } = useFetchVisualization<CareerNode[]>({
    endpoint: '/api/visualizations/career-pathway',
    fallbackData: fallbackData.careerPathway
  });
  
  // Use responsive sizing hook
  const dimensions = useResponsiveVisualizationSize(containerRef);
  
  // Custom rendering for treemap nodes
  const CustomizedContent = (props: any) => {
    const { x, y, width, height, depth, name, category, level } = props;
    
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          style={{
            fill: COLORS[category] || COLORS.default,
            stroke: '#fff',
            strokeWidth: 2,
            strokeOpacity: 1,
            fillOpacity: 0.8,
          }}
        />
        {width > 30 && height > 30 && (
          <>
            <text
              x={x + width / 2}
              y={y + height / 2 - 7}
              textAnchor="middle"
              fill="#fff"
              fontSize={10}
              fontWeight="bold"
            >
              {name}
            </text>
            <text
              x={x + width / 2}
              y={y + height / 2 + 7}
              textAnchor="middle"
              fill="#fff"
              fontSize={8}
            >
              {level}
            </text>
          </>
        )}
      </g>
    );
  };

  return (
    <div ref={containerRef} className="w-full h-full min-h-[300px]">
      <VisualizationContainer
        title="DevRel Career Pathways"
        description="Various career focus areas in Developer Relations"
        hasError={!!error}
        isLoading={loading}
        errorMessage={error ? error.message : ''}
        onRetry={retry}
      >
        <div className="w-full h-[350px]">
          {data && !loading && (
            <ResponsiveContainer width="100%" height="100%">
              <Treemap
                data={data}
                dataKey="size"
                aspectRatio={4 / 3}
                stroke="#fff"
                fill="#8884d8"
                content={<CustomizedContent />}
              >
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload as CareerNode;
                      return (
                        <div className="bg-card p-3 shadow-lg rounded-md border border-border">
                          <p className="font-medium">{data.name}</p>
                          <p className="text-sm text-muted-foreground">Level: {data.level}</p>
                          <p className="text-sm text-muted-foreground">Category: {data.category}</p>
                          <p className="font-medium mt-2 text-sm">Key Skills:</p>
                          <ul className="list-disc list-inside text-xs text-muted-foreground">
                            {data.skills.map((skill, index) => (
                              <li key={index}>{skill}</li>
                            ))}
                          </ul>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </Treemap>
            </ResponsiveContainer>
          )}
        </div>
      </VisualizationContainer>
    </div>
  );
}

export default CareerPathway;

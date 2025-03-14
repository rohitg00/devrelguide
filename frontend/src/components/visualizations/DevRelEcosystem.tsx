'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { ResponsiveSankey } from '@nivo/sankey';
import { Typography } from '@/components/ui/typography';
import { useFetchVisualization } from '@/lib/use-fetch-visualization';
import { fallbackData } from '@/lib/visualization-utils';
import { useResponsiveVisualizationSize } from '@/lib/use-responsive-visualization-size';

// Types for custom data
interface CustomNode {
  id: string;
  name: string;
  pillar: string;
  value: number;
}

interface CustomLink {
  source: string;
  target: string;
  value: number;
}

interface CustomData {
  nodes: CustomNode[];
  links: CustomLink[];
}

interface DevRelEcosystemProps {
  customData?: CustomData;
}

// Type for processed ecosystem data
interface EcosystemData {
  nodes: Array<{
    id: string | number;
    name: string;
    pillar?: string;
    value?: number;
  }>;
  links: Array<{
    source: string | number;
    target: string | number;
    value?: number;
  }>;
}

export function DevRelEcosystem({ customData }: DevRelEcosystemProps) {
  const { data, loading, error } = useFetchVisualization<EcosystemData>(
    '/api/visualizations/devrel-ecosystem',
    fallbackData.devrelEcosystem
  );

  const { containerRef, width, height } = useResponsiveVisualizationSize({
    defaultWidth: 800,
    defaultHeight: 500,
    minWidth: 300,
    minHeight: 300,
    maxWidth: 1600,
    maxHeight: 800,
    aspectRatio: 16 / 9,
  });

  // Use customData if provided, otherwise use fetched data
  const displayData = customData || data;

  // Define color mapping for categories
  const categoryColors = {
    community: '#8764FF',
    content: '#00C49F', 
    product: '#FF5733',
    ecosystem: '#7CDA24',
    default: '#AAAAAA'
  };

  // Process data for the Nivo Sankey chart
  const processedData = useMemo(() => {
    if (!displayData?.nodes?.length) return { nodes: [], links: [] };

    // Format nodes for Nivo
    const nodes = displayData.nodes.map(node => ({
      id: node.id.toString(),
      nodeColor: categoryColors[node.pillar as keyof typeof categoryColors] || categoryColors.default,
      label: node.name,
      category: node.pillar || 'community'
    }));
    
    // Format links for Nivo
    const links = displayData.links
      .filter(link => 
        nodes.some(node => node.id === link.source.toString()) && 
        nodes.some(node => node.id === link.target.toString())
      )
      .map(link => ({
        source: link.source.toString(),
        target: link.target.toString(),
        value: link.value || 1,
      }));
    
    const result = { nodes, links };
    console.log("DevRelEcosystem - processed data:", result);
    return result;
  }, [displayData, categoryColors]);

  // Debug logs
  console.log("DevRelEcosystem - dimensions:", { width, height });
  console.log("DevRelEcosystem - raw data:", displayData);

  if (loading) return <div className="h-full flex items-center justify-center"><p>Loading ecosystem visualization...</p></div>;
  if (error) return <div className="h-full flex items-center justify-center"><p className="text-red-500">Error: {error}</p></div>;
  if (!processedData.nodes.length) return <div className="h-full flex items-center justify-center"><p>No data available for visualization</p></div>;

  return (
    <div ref={containerRef} className="w-full h-full flex flex-col">
      <div className="flex-grow" style={{ minHeight: '500px', height: '500px' }}>
        <ResponsiveSankey
          data={processedData}
          margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
          align="justify"
          colors={(node) => node.nodeColor || categoryColors.default}
          nodeOpacity={1}
          nodeHoverOthersOpacity={0.35}
          nodeThickness={18}
          nodeSpacing={24}
          nodeBorderWidth={0}
          nodeBorderRadius={3}
          linkOpacity={0.5}
          linkHoverOthersOpacity={0.1}
          linkContract={1}
          enableLinkGradient={true}
          labelPosition="outside"
          labelOrientation="horizontal"
          labelPadding={16}
          labelTextColor={{ from: 'color', modifiers: [['darker', 1]] }}
          animate={true}
          motionConfig="gentle"
          nodeTooltip={({ node }) => (
            <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200">
              <p className="font-semibold text-sm">{node.label}</p>
              <p className="text-xs text-gray-600">Category: <span className="font-medium">{node.category}</span></p>
            </div>
          )}
          linkTooltip={({ link }) => (
            <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200">
              <p className="font-semibold text-sm">Connection</p>
              <p className="text-xs text-gray-600">From: <span className="font-medium">{link.source.label}</span></p>
              <p className="text-xs text-gray-600">To: <span className="font-medium">{link.target.label}</span></p>
              <p className="text-xs text-gray-600">Strength: <span className="font-medium">{link.value}</span></p>
            </div>
          )}
        />
      </div>
      
      <div className="mt-3 flex flex-wrap gap-3 justify-center">
        {Object.entries(categoryColors).filter(([key]) => key !== 'default').map(([category, color]) => (
          <div key={category} className="inline-flex items-center">
            <div 
              className="w-4 h-4 rounded-full mr-1 border border-gray-200" 
              style={{ backgroundColor: color }}
            />
            <span className="text-xs font-medium capitalize">{category}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DevRelEcosystem;

'use client'

import React, { useRef, useMemo } from 'react'
import { ResponsiveTreeMap } from '@nivo/treemap'
import { useFetchVisualization } from '@/lib/use-fetch-visualization'
import { getFallbackData } from '@/lib/visualization-utils'
import { useResponsiveVisualizationSize } from '@/lib/use-responsive-visualization-size'

// Type definitions for visualization
interface JourneyNode {
  id: string
  name: string
  value: number
  children?: JourneyNode[]
}

interface CustomData {
  name: string
  children: JourneyNode[]
}

// Type definitions for incoming data from customizer
interface JourneyStep {
  id: string;
  stepId: string;
  title: string;
  description: string;
  metrics: {
    engagement: number;
    conversion: number;
    satisfaction: number;
  };
  content: string[];
}

interface JourneyData {
  stages: JourneyStep[];
}

interface DeveloperJourneyProps {
  customData?: JourneyData;
  showLabels?: boolean;
}

// Sample data for the developer journey
const sampleData: JourneyData = {
  stages: [
    {
      id: "awareness-1",
      stepId: "awareness",
      title: "Discovery",
      description: "Developers discover your product through various channels",
      metrics: {
        engagement: 70,
        conversion: 30,
        satisfaction: 60
      },
      content: [
        "Blog posts",
        "Social media",
        "Developer events",
        "Word of mouth"
      ]
    },
    {
      id: "evaluation-1",
      stepId: "evaluation",
      title: "Evaluation",
      description: "Developers evaluate if your product meets their needs",
      metrics: {
        engagement: 60,
        conversion: 40,
        satisfaction: 55
      },
      content: [
        "Documentation",
        "Tutorials",
        "Sample code",
        "Community forums"
      ]
    },
    {
      id: "activation-1",
      stepId: "activation",
      title: "Getting Started",
      description: "Developers begin using your product for the first time",
      metrics: {
        engagement: 50,
        conversion: 60,
        satisfaction: 70
      },
      content: [
        "Quickstart guides",
        "Interactive demos",
        "Setup wizards",
        "Video walkthroughs"
      ]
    },
    {
      id: "usage-1",
      stepId: "usage",
      title: "Regular Usage",
      description: "Developers use your product as part of their workflow",
      metrics: {
        engagement: 80,
        conversion: 75,
        satisfaction: 75
      },
      content: [
        "API references",
        "Advanced tutorials",
        "Use case examples",
        "Support channels"
      ]
    },
    {
      id: "advocacy-1",
      stepId: "advocacy",
      title: "Advocacy",
      description: "Developers become advocates for your product",
      metrics: {
        engagement: 90,
        conversion: 85,
        satisfaction: 90
      },
      content: [
        "Community contributions",
        "Speaking at events",
        "Creating content",
        "Referring others"
      ]
    }
  ]
};

// Color mapping for journey steps
const colorMapping = {
  'awareness': '#FF6F61',   // Coral red
  'evaluation': '#6B5B95',  // Purple
  'activation': '#88B04B',  // Green
  'usage': '#FCBF49',       // Yellow
  'advocacy': '#51DACF',    // Teal
  'other': '#5D5C61'        // Gray
};

// Transform customizer data to treemap data
function transformToTreemapData(data: JourneyData): CustomData {
  return {
    name: "Developer Journey",
    children: data.stages.map(stage => {
      // Calculate the average score for sizing
      const avgMetric = (stage.metrics.engagement + stage.metrics.conversion + stage.metrics.satisfaction) / 3;
      
      return {
        id: stage.id,
        name: stage.title,
        value: avgMetric,
        stepType: stage.stepId,
        data: {
          description: stage.description,
          metrics: stage.metrics,
          content: stage.content
        }
      };
    })
  };
}

// Get node color based on id (which contains step type)
function getNodeColor(id: string, data: JourneyData): string {
  const step = data.stages.find(s => s.id === id);
  if (!step) return colorMapping['other'];
  return colorMapping[step.stepId as keyof typeof colorMapping] || colorMapping['other'];
}

export function DeveloperJourney({ customData, showLabels = true }: DeveloperJourneyProps) {
  // Fetch data if no custom data is provided
  const { data: fetchedData, error, loading } = useFetchVisualization<JourneyData>(
    '/api/visualizations/developer-journey',
    sampleData
  );
  const { containerRef, width, height } = useResponsiveVisualizationSize();
  
  // Use custom data if provided, otherwise use fetched data
  const data = customData || fetchedData || sampleData;
  
  // Transform data for treemap
  const treeMapData = useMemo(() => transformToTreemapData(data), [data]);
  
  return (
    <div ref={containerRef} className="w-full h-full relative">
      {loading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : error ? (
        <div className="absolute inset-0 flex items-center justify-center text-red-500">
          Error loading data
        </div>
      ) : (
        <ResponsiveTreeMap
          data={treeMapData}
          identity="id"
          value="value"
          valueFormat=".2f"
          margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
          labelSkipSize={12}
          labelTextColor={{ from: 'color', modifiers: [['darker', 3]] }}
          parentLabelTextColor={{ from: 'color', modifiers: [['darker', 3]] }}
          borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
          nodeOpacity={1}
          borderWidth={2}
          colors={(node) => getNodeColor(node.id as string, data)}
          label={showLabels ? (node) => `${node.data.name}` : undefined}
          tooltip={({ node }) => (
            <div className="bg-white p-2 shadow-lg rounded-md border border-gray-200 max-w-xs">
              <div className="font-bold">{node.data.name}</div>
              <div className="text-sm text-gray-600">{(node.data as any).data?.description}</div>
              {(node.data as any).data?.metrics && (
                <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <div className="font-semibold">Engagement</div>
                    <div>{(node.data as any).data.metrics.engagement}%</div>
                  </div>
                  <div>
                    <div className="font-semibold">Conversion</div>
                    <div>{(node.data as any).data.metrics.conversion}%</div>
                  </div>
                  <div>
                    <div className="font-semibold">Satisfaction</div>
                    <div>{(node.data as any).data.metrics.satisfaction}%</div>
                  </div>
                </div>
              )}
              {(node.data as any).data?.content && (
                <div className="mt-2">
                  <div className="font-semibold text-xs">Key Components:</div>
                  <ul className="list-disc list-inside text-xs">
                    {(node.data as any).data.content.map((item: string, i: number) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        />
      )}
      
      <div className="absolute bottom-2 right-2 bg-white bg-opacity-80 rounded-md p-2 shadow-sm">
        <div className="text-xs font-medium mb-1">Journey Stages:</div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1">
          {Object.entries(colorMapping).slice(0, 5).map(([stage, color]) => (
            <div key={stage} className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-1" 
                style={{ backgroundColor: color }}
              />
              <span className="text-xs capitalize">{stage}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DeveloperJourney

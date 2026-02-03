'use client'

import { useMemo, useState, useRef, useEffect, useCallback } from 'react'
import { Network } from '@nivo/network'
import { useFetchVisualization } from '@/lib/use-fetch-visualization'
import { getFallbackData } from '@/lib/visualization-utils'
import { useResponsiveVisualizationSize } from '@/lib/use-responsive-visualization-size'

// Types for custom data
interface CustomNode {
  id: string;
  name: string;
  group: string;
  size?: number;
}

interface CustomLink {
  source: string;
  target: string;
  value?: number;
}

interface CustomData {
  nodes: CustomNode[];
  links: CustomLink[];
}

interface CommunityGraphProps {
  customData?: CustomData;
}

// Sample data for the community graph
const sampleData = {
  nodes: [
    { id: "1", name: "Your Organization", group: "center", size: 20 },
    { id: "2", name: "Community A", group: "community", size: 15 },
    { id: "3", name: "Community B", group: "community", size: 12 },
    { id: "4", name: "Partner X", group: "partner", size: 10 },
    { id: "5", name: "Partner Y", group: "partner", size: 8 },
    { id: "6", name: "Developer Z", group: "developer", size: 6 },
    { id: "7", name: "Developer Q", group: "developer", size: 5 },
    { id: "8", name: "OSS Project", group: "project", size: 9 }
  ],
  links: [
    { source: "1", target: "2", value: 5 },
    { source: "1", target: "3", value: 4 },
    { source: "1", target: "4", value: 3 },
    { source: "1", target: "5", value: 2 },
    { source: "2", target: "6", value: 1 },
    { source: "2", target: "7", value: 1 },
    { source: "3", target: "7", value: 1 },
    { source: "3", target: "8", value: 2 },
    { source: "4", target: "8", value: 2 },
    { source: "6", target: "8", value: 1 }
  ]
};

// Define types for processed network data
interface ProcessedNode {
  id: string;
  radius: number;
  color: string;
  borderColor: string;
  borderWidth: number;
  name: string;
  group: string;
  shortLabel: string;
}

interface ProcessedLink {
    source: string;
    target: string;
  distance: number;
  color: string;
  thickness: number;
}

interface ProcessedNetworkData {
  nodes: ProcessedNode[];
  links: ProcessedLink[];
}

// Function to get node color based on group
function getNodeColor(group: string): string {
  const colorMap: { [key: string]: string } = {
    'center': '#FF6F61',     // Coral red
    'community': '#6B5B95',  // Purple
    'partner': '#88B04B',    // Green
    'developer': '#FCBF49',  // Yellow
    'project': '#51DACF'     // Teal
  };
  return colorMap[group] || '#999999'; // Default gray
}

// Function to process the data for the visualization
function processData(data: any): ProcessedNetworkData {
  return {
    nodes: (data.nodes || []).map((node: any) => {
      const name = node.name || '';
      let shortLabel = '';
      if (name.includes(' ')) {
        shortLabel = name.split(' ').map((word: string) => word.charAt(0)).join('').toUpperCase();
      } else {
        shortLabel = name.substring(0, Math.min(3, name.length)).toUpperCase();
      }
      return {
        id: String(node.id),
        radius: (node.size || 10) * 1.5,
        color: getNodeColor(node.group || node.category || ''),
        borderColor: '#ffffff',
        borderWidth: 2,
        name: name,
        group: node.group || node.category || '',
        shortLabel
      };
    }),
    links: (data.links || []).map((link: any) => ({
      source: String(link.source),
      target: String(link.target),
      distance: Math.max(15, 25 / (link.value || 1)),
      color: '#aaaaaa',
      thickness: Math.max(1, (link.value || 1) * 0.8)
    }))
  };
}

export function CommunityGraph({ customData }: CommunityGraphProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const { containerRef, width, height } = useResponsiveVisualizationSize();
  
  // Fetch data from API or use fallback
  const { data: fetchedData, error, loading } = useFetchVisualization<CustomData>(
    '/api/visualizations/community-graph',
    sampleData
  );
  
  // Use customData if provided, otherwise use fetched data
  const data = customData || fetchedData || sampleData;
  
  // Process the data for visualization
  const processedData = useMemo(() => processData(data), [data]);
  
  // State for node positions (for labels)
  const [nodePositions, setNodePositions] = useState<{[key: string]: {x: number, y: number}}>({});
  // State for zoom level
  const [zoomLevel, setZoomLevel] = useState(1);
  // State for highlighted node
  const [highlightedNode, setHighlightedNode] = useState<string | null>(null);
  
  // Function to capture node positions from the network
  const captureNodePositions = useCallback(() => {
    const networkNodes = document.querySelectorAll('.nivo-network-node');
    const positions: {[key: string]: {x: number, y: number}} = {};
    
    networkNodes.forEach((node) => {
      const nodeId = node.getAttribute('data-node-id');
      if (nodeId) {
        const rect = node.getBoundingClientRect();
        const containerRect = containerRef.current?.getBoundingClientRect();
        
        if (containerRect) {
          // Calculate position relative to the container
          positions[nodeId] = {
            x: rect.left - containerRect.left + rect.width / 2,
            y: rect.top - containerRect.top + rect.height / 2
          };
        }
      }
    });
    
    setNodePositions(positions);
  }, [containerRef]);
  
  // Capture node positions after the network renders
  useEffect(() => {
    const timer = setTimeout(captureNodePositions, 1000);
    return () => clearTimeout(timer);
  }, [processedData, width, height, captureNodePositions]);

  // Add debug logging
  console.log('CommunityGraph rendering with data:', data);
  console.log('Processed network data:', processedData);
  console.log('Container dimensions:', { width, height });

    return (
    <div ref={containerRef} className="w-full h-full relative">
      {loading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
        </div>
      ) : error ? (
        <div className="absolute inset-0 flex items-center justify-center text-red-500">
          Error loading data
        </div>
      ) : (
        <div className="w-full h-full relative">
          {/* Zoom controls */}
          <div className="absolute top-2 right-2 z-10 flex flex-col gap-1">
            <button
              className="bg-card/80 hover:bg-card p-1 rounded shadow"
              onClick={() => setZoomLevel(prev => Math.min(prev + 0.1, 2))}
            >
              +
            </button>
            <button
              className="bg-card/80 hover:bg-card p-1 rounded shadow"
              onClick={() => setZoomLevel(prev => Math.max(prev - 0.1, 0.5))}
            >
              -
            </button>
        <button
              className="bg-card/80 hover:bg-card p-1 rounded shadow text-xs"
              onClick={() => setZoomLevel(1)}
        >
              Reset
        </button>
      </div>
          
          {/* Network visualization */}
          <div className="w-full h-full overflow-hidden">
            <div style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center', transition: 'transform 0.3s ease' }}>
              <Network
                data={processedData}
                width={width}
                height={height}
                margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
                linkDistance={(e) => (e as any).distance}
                centeringStrength={0.4}
                repulsivity={10}
                iterations={200}
                nodeColor={(n) => n.color}
                nodeBorderColor={(n) => (n as any).borderColor}
                nodeBorderWidth={(n) => (n as any).borderWidth}
                linkThickness={(link) => (link as any).thickness}
                linkColor={(link) => (link as any).color}
                motionConfig="gentle"
                nodeSize={(n) => n.radius}
                activeNodeSize={(n) => n.radius * 1.5}
                animate={true}
                isInteractive={true}
                onClick={(node) => {
                  if (node) {
                    setHighlightedNode(highlightedNode === node.id ? null : node.id);
                  }
                }}
                nodeTooltip={({ node }) => {
                  // Cast the node to our type
                  const typedNode = node as unknown as ProcessedNode;
                  const connections = data.links.filter(link => 
                    link.source === typedNode.id || link.target === typedNode.id
                  );
                  
                  return (
                    <div className="bg-card p-3 shadow-lg rounded-md border text-sm">
                      <strong className="text-base">{typedNode.name}</strong>
                      <div className="mt-1">Group: <span className="font-medium capitalize">{typedNode.group}</span></div>
                      <div>Connections: {connections.length}</div>
                      {connections.length > 0 && (
                        <div className="mt-1 text-xs text-muted-foreground">
                          Connected to: {connections.map(link => {
                            const connectedId = link.source === typedNode.id ? link.target : link.source;
                            const connectedNode = data.nodes.find(n => n.id === connectedId);
                            return connectedNode?.name;
                          }).join(', ')}
                        </div>
                      )}
                      <div className="mt-2 text-xs text-secondary">Click to focus</div>
                    </div>
                  );
                }}
                linkBlendMode="multiply"
              />
              
              {/* Node Labels Overlay */}
              <div className="absolute inset-0 pointer-events-none">
                <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
                  {Object.entries(nodePositions).map(([nodeId, position]) => {
                    const node = processedData.nodes.find(n => n.id === nodeId);
                    if (!node) return null;

  return (
                      <text
                        key={nodeId}
                        x={position.x}
                        y={position.y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        style={{
                          fontSize: '10px',
                          fontWeight: 'bold',
                          fill: '#fff',
                          pointerEvents: 'none'
                        }}
                      >
                        {node.shortLabel}
                      </text>
                    );
                  })}
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="absolute bottom-2 right-2 bg-card/90 rounded-md p-3 shadow-md">
        <div className="text-sm font-medium mb-2">Legend:</div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          {['center', 'community', 'partner', 'developer', 'project'].map(group => (
            <div key={group} className="flex items-center">
              <div 
                className="w-4 h-4 rounded-full mr-2" 
                style={{ backgroundColor: getNodeColor(group) }}
              />
              <span className="text-sm capitalize">{group}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Add a note about the labels */}
      <div className="absolute bottom-2 left-2 bg-card/90 rounded-md p-2 shadow-md text-xs">
        <p>Node labels show initials. Hover for full details.</p>
      </div>
    </div>
  );
}

export default CommunityGraph;

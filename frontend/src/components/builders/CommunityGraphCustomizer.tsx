'use client';

import { useState, useRef, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Edit, Download } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CommunityGraph } from '../visualizations/CommunityGraph';
import { toPng } from '@/lib/export-image';
import { Badge } from '@/components/ui/badge';

// Types for community graph data
interface CommunityNode {
  id: string;
  name: string;
  group: string;
  size: number;
}

interface CommunityLink {
  source: string;
  target: string;
  value: number;
}

interface CommunityData {
  nodes: CommunityNode[];
  links: CommunityLink[];
}

// Initial sample data for community graph
const initialData: CommunityData = {
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

// Available node groups and their colors
const nodeGroups = [
  { id: 'center', name: 'Center', color: '#FF6F61' },
  { id: 'community', name: 'Community', color: '#6B5B95' },
  { id: 'partner', name: 'Partner', color: '#88B04B' },
  { id: 'developer', name: 'Developer', color: '#FCBF49' },
  { id: 'project', name: 'Project', color: '#51DACF' }
];

export function CommunityGraphCustomizer() {
  const [data, setData] = useState<CommunityData>(initialData);
  const [editingNode, setEditingNode] = useState<CommunityNode | null>(null);
  const [editingLink, setEditingLink] = useState<CommunityLink | null>(null);
  const [nodeDialogOpen, setNodeDialogOpen] = useState(false);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('nodes');
  const [newNodeName, setNewNodeName] = useState('');
  const [newNodeGroup, setNewNodeGroup] = useState('community');
  const [newNodeSize, setNewNodeSize] = useState(10);
  const [newLinkSource, setNewLinkSource] = useState('');
  const [newLinkTarget, setNewLinkTarget] = useState('');
  const [newLinkValue, setNewLinkValue] = useState(1);
  const [jsonData, setJsonData] = useState('');
  const [jsonError, setJsonError] = useState('');
  const visualizationRef = useRef<HTMLDivElement>(null);

  // Update JSON when data changes
  useEffect(() => {
    setJsonData(JSON.stringify(data, null, 2));
  }, [data]);

  // Handle adding a new node
  const handleAddNode = () => {
    if (!newNodeName.trim()) return;
    
    const newId = Date.now().toString();
    const newNode: CommunityNode = {
      id: newId,
      name: newNodeName,
      group: newNodeGroup,
      size: newNodeSize
    };
    
    setData(prev => ({
      ...prev,
      nodes: [...prev.nodes, newNode]
    }));
    
    setNewNodeName('');
    setNewNodeGroup('community');
    setNewNodeSize(10);
    setNodeDialogOpen(false);
  };

  // Handle editing a node
  const handleEditNode = () => {
    if (!editingNode || !newNodeName.trim()) return;
    
    setData(prev => ({
      ...prev,
      nodes: prev.nodes.map(node => 
        node.id === editingNode.id 
          ? { ...node, name: newNodeName, group: newNodeGroup, size: newNodeSize }
          : node
      )
    }));
    
    setEditingNode(null);
    setNodeDialogOpen(false);
  };

  // Handle deleting a node
  const handleDeleteNode = (id: string) => {
    setData(prev => ({
      nodes: prev.nodes.filter(node => node.id !== id),
      links: prev.links.filter(link => link.source !== id && link.target !== id)
    }));
  };

  // Handle adding a new link
  const handleAddLink = () => {
    if (!newLinkSource || !newLinkTarget) return;
    
    const newLink: CommunityLink = {
      source: newLinkSource,
      target: newLinkTarget,
      value: newLinkValue
    };
    
    setData(prev => ({
      ...prev,
      links: [...prev.links, newLink]
    }));
    
    setNewLinkSource('');
    setNewLinkTarget('');
    setNewLinkValue(1);
    setLinkDialogOpen(false);
  };

  // Handle editing a link
  const handleEditLink = () => {
    if (!editingLink) return;
    
    setData(prev => ({
      ...prev,
      links: prev.links.map(link => 
        link.source === editingLink.source && link.target === editingLink.target 
          ? { ...link, source: newLinkSource, target: newLinkTarget, value: newLinkValue }
          : link
      )
    }));
    
    setEditingLink(null);
    setLinkDialogOpen(false);
  };

  // Handle deleting a link
  const handleDeleteLink = (source: string, target: string) => {
    setData(prev => ({
      ...prev,
      links: prev.links.filter(link => 
        !(link.source === source && link.target === target)
      )
    }));
  };

  // Handle importing data from JSON
  const handleImportJSON = () => {
    try {
      const parsed = JSON.parse(jsonData);
      
      // Validate the structure
      if (!parsed.nodes || !Array.isArray(parsed.nodes) || 
          !parsed.links || !Array.isArray(parsed.links)) {
        throw new Error('Invalid JSON structure. Must contain nodes and links arrays.');
      }
      
      // Validate nodes
      for (const node of parsed.nodes) {
        if (!node.id || !node.name || !node.group) {
          throw new Error('Invalid node structure. Each node must have id, name, and group properties.');
        }
      }
      
      // Validate links
      for (const link of parsed.links) {
        if (!link.source || !link.target) {
          throw new Error('Invalid link structure. Each link must have source and target properties.');
        }
      }
      
      setData(parsed);
      setJsonError('');
    } catch (error) {
      setJsonError(error instanceof Error ? error.message : 'Invalid JSON format');
    }
  };

  // Handle exporting to PNG
  const handleExportPNG = async () => {
    if (!visualizationRef.current) return;
    
    try {
      const canvas = await toPng(visualizationRef.current, {
        backgroundColor: '#003366',
        scale: 2
      });
      
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = 'community-graph.png';
      link.click();
    } catch (error) {
      console.error('Failed to export image:', error);
    }
  };

  // Reset to initial data
  const handleReset = () => {
    setData(initialData);
  };

  // Open edit node dialog
  const openEditNodeDialog = (node: CommunityNode) => {
    setEditingNode(node);
    setNewNodeName(node.name);
    setNewNodeGroup(node.group);
    setNewNodeSize(node.size);
    setNodeDialogOpen(true);
  };

  // Open edit link dialog
  const openEditLinkDialog = (link: CommunityLink) => {
    setEditingLink(link);
    setNewLinkSource(link.source);
    setNewLinkTarget(link.target);
    setNewLinkValue(link.value);
    setLinkDialogOpen(true);
  };

  // Get node name by ID
  const getNodeName = (id: string) => {
    const node = data.nodes.find(n => n.id === id);
    return node ? node.name : id;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left side: Configuration */}
      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="nodes">Nodes</TabsTrigger>
            <TabsTrigger value="links">Links</TabsTrigger>
            <TabsTrigger value="json">JSON Data</TabsTrigger>
          </TabsList>
          
          <TabsContent value="nodes" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Community Nodes</h3>
              <Dialog open={nodeDialogOpen} onOpenChange={setNodeDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => {
                    setEditingNode(null);
                    setNewNodeName('');
                    setNewNodeGroup('community');
                    setNewNodeSize(10);
                  }}>
                    <Plus className="mr-2 h-4 w-4" /> Add Node
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingNode ? 'Edit Node' : 'Add New Node'}</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="nodeName">Node Name</Label>
                      <Input
                        id="nodeName"
                        value={newNodeName}
                        onChange={(e) => setNewNodeName(e.target.value)}
                        placeholder="e.g., Community Group"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="nodeGroup">Group</Label>
                      <Select
                        value={newNodeGroup}
                        onValueChange={setNewNodeGroup}
                      >
                        <SelectTrigger id="nodeGroup">
                          <SelectValue placeholder="Select a group" />
                        </SelectTrigger>
                        <SelectContent>
                          {nodeGroups.map(group => (
                            <SelectItem key={group.id} value={group.id}>
                              <div className="flex items-center">
                                <div 
                                  className="w-3 h-3 rounded-full mr-2" 
                                  style={{ backgroundColor: group.color }}
                                />
                                {group.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="nodeSize">Size (1-30)</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="nodeSize"
                          type="number"
                          min={1}
                          max={30}
                          value={newNodeSize}
                          onChange={(e) => setNewNodeSize(parseInt(e.target.value) || 10)}
                        />
                        <div className="w-6 h-6 rounded-full border" 
                          style={{ 
                            width: `${Math.min(30, Math.max(10, newNodeSize))}px`, 
                            height: `${Math.min(30, Math.max(10, newNodeSize))}px`,
                            backgroundColor: nodeGroups.find(g => g.id === newNodeGroup)?.color || 'gray'
                          }} 
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setNodeDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={editingNode ? handleEditNode : handleAddNode}>
                      {editingNode ? 'Save Changes' : 'Add Node'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="overflow-y-auto max-h-[500px] border rounded-md">
              {data.nodes.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">No nodes added yet</div>
              ) : (
                <div className="divide-y">
                  {data.nodes.map(node => (
                    <div key={node.id} className="p-3 flex items-center justify-between hover:bg-muted/50">
                      <div className="flex items-center">
                        <div 
                          className="rounded-full mr-3 border border-border" 
                          style={{ 
                            width: `${Math.min(24, Math.max(12, node.size/2))}px`, 
                            height: `${Math.min(24, Math.max(12, node.size/2))}px`,
                            backgroundColor: nodeGroups.find(g => g.id === node.group)?.color || 'gray'
                          }} 
                        />
                        <div>
                          <div className="font-medium">{node.name}</div>
                          <div className="text-xs text-muted-foreground">
                            <Badge variant="outline" className="mr-1">
                              {nodeGroups.find(g => g.id === node.group)?.name || node.group}
                            </Badge>
                            Size: {node.size}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => openEditNodeDialog(node)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteNode(node.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="links" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Connection Links</h3>
              <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => {
                    setEditingLink(null);
                    setNewLinkSource('');
                    setNewLinkTarget('');
                    setNewLinkValue(1);
                  }}>
                    <Plus className="mr-2 h-4 w-4" /> Add Link
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingLink ? 'Edit Link' : 'Add New Link'}</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="linkSource">Source Node</Label>
                      <Select
                        value={newLinkSource}
                        onValueChange={setNewLinkSource}
                      >
                        <SelectTrigger id="linkSource">
                          <SelectValue placeholder="Select source node" />
                        </SelectTrigger>
                        <SelectContent>
                          {data.nodes.map(node => (
                            <SelectItem key={node.id} value={node.id}>
                              {node.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="linkTarget">Target Node</Label>
                      <Select
                        value={newLinkTarget}
                        onValueChange={setNewLinkTarget}
                      >
                        <SelectTrigger id="linkTarget">
                          <SelectValue placeholder="Select target node" />
                        </SelectTrigger>
                        <SelectContent>
                          {data.nodes
                            .filter(node => node.id !== newLinkSource)
                            .map(node => (
                              <SelectItem key={node.id} value={node.id}>
                                {node.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="linkValue">Connection Strength (1-10)</Label>
                      <Input
                        id="linkValue"
                        type="number"
                        min={1}
                        max={10}
                        value={newLinkValue}
                        onChange={(e) => setNewLinkValue(parseInt(e.target.value) || 1)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setLinkDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={editingLink ? handleEditLink : handleAddLink}
                      disabled={!newLinkSource || !newLinkTarget}
                    >
                      {editingLink ? 'Save Changes' : 'Add Link'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="overflow-y-auto max-h-[500px] border rounded-md">
              {data.links.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">No links added yet</div>
              ) : (
                <div className="divide-y">
                  {data.links.map(link => (
                    <div key={`${link.source}-${link.target}`} className="p-3 flex items-center justify-between hover:bg-muted/50">
                      <div>
                        <div className="font-medium">
                          {getNodeName(link.source)} → {getNodeName(link.target)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Strength: {link.value}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => openEditLinkDialog(link)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteLink(link.source, link.target)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="json" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">JSON Data</h3>
              <Button onClick={handleImportJSON}>Import</Button>
            </div>
            
            {jsonError && (
              <Alert variant="destructive">
                <AlertDescription>{jsonError}</AlertDescription>
              </Alert>
            )}
            
            <Textarea
              value={jsonData}
              onChange={(e) => setJsonData(e.target.value)}
              className="min-h-[400px] font-mono text-sm"
              placeholder="Paste your JSON data here"
            />
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={handleReset}>
            Reset to Default
          </Button>
          <Button variant="outline" onClick={handleExportPNG}>
            <Download className="mr-2 h-4 w-4" /> Export PNG
          </Button>
        </div>
      </div>
      
      {/* Right side: Preview */}
      <div className="border rounded-lg p-4 bg-card">
        <h3 className="text-lg font-semibold mb-4">Preview</h3>
        <div className="h-[500px]" ref={visualizationRef}>
          <CommunityGraph customData={data} />
        </div>
      </div>
    </div>
  );
}

export default CommunityGraphCustomizer; 
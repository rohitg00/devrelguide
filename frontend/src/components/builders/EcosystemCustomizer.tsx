'use client';

import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Save, Download, Copy, Edit, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DevRelEcosystem } from '../visualizations/DevRelEcosystem';
import { toPng } from '@/lib/export-image';
import { fallbackData } from '@/lib/visualization-utils';
import { Badge } from '@/components/ui/badge';

// Types for our data
interface EcosystemNode {
  id: string;
  name: string;
  pillar: string;
  value: number;
}

interface EcosystemLink {
  source: string;
  target: string;
  value: number;
}

interface EcosystemData {
  nodes: EcosystemNode[];
  links: EcosystemLink[];
}

// Initial sample data based on fallback data
const initialData: EcosystemData = {
  nodes: [
    { id: "1", name: "Community Management", pillar: "community", value: 80 },
    { id: "2", name: "Developer Education", pillar: "content", value: 75 },
    { id: "3", name: "Technical Support", pillar: "product", value: 70 },
    { id: "4", name: "Ecosystem Partnerships", pillar: "ecosystem", value: 65 },
    { id: "5", name: "Developer Feedback", pillar: "community", value: 60 },
    { id: "6", name: "Documentation", pillar: "content", value: 55 }
  ],
  links: [
    { source: "1", target: "2", value: 5 },
    { source: "1", target: "5", value: 7 },
    { source: "2", target: "3", value: 4 },
    { source: "2", target: "6", value: 8 },
    { source: "3", target: "4", value: 3 },
    { source: "5", target: "4", value: 2 },
    { source: "6", target: "4", value: 6 }
  ]
};

// Pillars and their colors
const pillars = [
  { id: 'community', name: 'Community', color: '#8764FF' },
  { id: 'content', name: 'Content', color: '#00C49F' },
  { id: 'product', name: 'Product', color: '#FF5733' },
  { id: 'ecosystem', name: 'Ecosystem', color: '#7CDA24' }
];

export function EcosystemCustomizer() {
  const [data, setData] = useState<EcosystemData>(initialData);
  const [editingNode, setEditingNode] = useState<EcosystemNode | null>(null);
  const [editingLink, setEditingLink] = useState<EcosystemLink | null>(null);
  const [nodeDialogOpen, setNodeDialogOpen] = useState(false);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('nodes');
  const [newNodeName, setNewNodeName] = useState('');
  const [newNodePillar, setNewNodePillar] = useState('community');
  const [newNodeValue, setNewNodeValue] = useState(50);
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
    const newNode: EcosystemNode = {
      id: newId,
      name: newNodeName,
      pillar: newNodePillar,
      value: newNodeValue
    };
    
    setData(prev => ({
      ...prev,
      nodes: [...prev.nodes, newNode]
    }));
    
    setNewNodeName('');
    setNewNodePillar('community');
    setNewNodeValue(50);
    setNodeDialogOpen(false);
  };

  // Handle editing a node
  const handleEditNode = () => {
    if (!editingNode || !newNodeName.trim()) return;
    
    setData(prev => ({
      ...prev,
      nodes: prev.nodes.map(node => 
        node.id === editingNode.id 
          ? { ...node, name: newNodeName, pillar: newNodePillar, value: newNodeValue }
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
    
    const newLink: EcosystemLink = {
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
        if (!node.id || !node.name || !node.pillar) {
          throw new Error('Invalid node structure. Each node must have id, name, and pillar properties.');
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
      link.download = 'devrel-ecosystem.png';
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
  const openEditNodeDialog = (node: EcosystemNode) => {
    setEditingNode(node);
    setNewNodeName(node.name);
    setNewNodePillar(node.pillar);
    setNewNodeValue(node.value);
    setNodeDialogOpen(true);
  };

  // Open edit link dialog
  const openEditLinkDialog = (link: EcosystemLink) => {
    setEditingLink(link);
    setNewLinkSource(link.source);
    setNewLinkTarget(link.target);
    setNewLinkValue(link.value);
    setLinkDialogOpen(true);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Control Panel */}
      <Card className="p-6 border-2 shadow-md">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">DevRel Ecosystem Builder</span>
        </h3>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-3 bg-muted/30">
            <TabsTrigger value="nodes" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">Nodes</TabsTrigger>
            <TabsTrigger value="links" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">Links</TabsTrigger>
            <TabsTrigger value="json" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">JSON Data</TabsTrigger>
          </TabsList>
          
          {/* Nodes Tab */}
          <TabsContent value="nodes" className="mt-4">
            <div className="flex justify-between mb-4 items-center">
              <h4 className="text-lg font-medium text-primary">Ecosystem Nodes</h4>
              <Dialog open={nodeDialogOpen} onOpenChange={setNodeDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    size="sm" 
                    className="bg-primary hover:bg-primary/90"
                    onClick={() => {
                      setEditingNode(null);
                      setNewNodeName('');
                      setNewNodePillar('community');
                      setNewNodeValue(50);
                    }}
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add Node
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>{editingNode ? 'Edit Node' : 'Add New Node'}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="node-name">Node Name</Label>
                      <Input 
                        id="node-name" 
                        value={newNodeName} 
                        onChange={e => setNewNodeName(e.target.value)} 
                        placeholder="Enter node name"
                        className="focus-visible:ring-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="node-pillar">Pillar/Category</Label>
                      <Select value={newNodePillar} onValueChange={setNewNodePillar}>
                        <SelectTrigger className="focus-visible:ring-primary">
                          <SelectValue placeholder="Select a pillar" />
                        </SelectTrigger>
                        <SelectContent>
                          {pillars.map(pillar => (
                            <SelectItem key={pillar.id} value={pillar.id}>
                              <div className="flex items-center">
                                <div 
                                  className="w-3 h-3 rounded-full mr-2" 
                                  style={{ backgroundColor: pillar.color }}
                                />
                                {pillar.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="node-size">Size (Importance)</Label>
                      <div className="flex items-center gap-4">
                        <Input 
                          id="node-size" 
                          type="range" 
                          min="10" 
                          max="100" 
                          value={newNodeValue} 
                          onChange={e => setNewNodeValue(parseInt(e.target.value))} 
                          className="w-full accent-primary"
                        />
                        <span className="w-10 text-center font-medium">{newNodeValue}</span>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setNodeDialogOpen(false)}>Cancel</Button>
                    <Button 
                      onClick={editingNode ? handleEditNode : handleAddNode}
                      className="bg-primary hover:bg-primary/90"
                    >
                      {editingNode ? 'Save Changes' : 'Add Node'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-muted-foreground/30">
              {data.nodes.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                  <p className="text-muted-foreground">No nodes added yet</p>
                  <p className="text-sm text-muted-foreground/60 mt-1">Use the 'Add Node' button to create nodes</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {data.nodes.map(node => (
                    <div 
                      key={node.id} 
                      className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 transition-colors shadow-sm"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-4 h-4 rounded-full flex-shrink-0 border border-border shadow-sm" 
                          style={{ backgroundColor: pillars.find(p => p.id === node.pillar)?.color }}
                        />
                        <div>
                          <span className="font-medium block">{node.name}</span>
                          <div className="flex items-center mt-1">
                            <Badge variant="outline" className="text-xs font-normal">
                              {pillars.find(p => p.id === node.pillar)?.name}
                            </Badge>
                            <Badge variant="outline" className="ml-2 text-xs font-normal">
                              Size: {node.value}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                          onClick={() => openEditNodeDialog(node)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-red-500"
                          onClick={() => handleDeleteNode(node.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Links Tab */}
          <TabsContent value="links" className="mt-4">
            <div className="flex justify-between mb-4 items-center">
              <h4 className="text-lg font-medium text-primary">Node Connections</h4>
              <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    size="sm"
                    className="bg-primary hover:bg-primary/90"
                    onClick={() => {
                      setEditingLink(null);
                      setNewLinkSource('');
                      setNewLinkTarget('');
                      setNewLinkValue(1);
                    }}
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add Connection
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>{editingLink ? 'Edit Connection' : 'Add New Connection'}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="link-source">Source Node</Label>
                      <Select value={newLinkSource} onValueChange={setNewLinkSource}>
                        <SelectTrigger className="focus-visible:ring-primary">
                          <SelectValue placeholder="Select source node" />
                        </SelectTrigger>
                        <SelectContent>
                          {data.nodes.map(node => (
                            <SelectItem key={node.id} value={node.id}>
                              <div className="flex items-center">
                                <div 
                                  className="w-3 h-3 rounded-full mr-2" 
                                  style={{ backgroundColor: pillars.find(p => p.id === node.pillar)?.color }}
                                />
                                {node.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="link-target">Target Node</Label>
                      <Select value={newLinkTarget} onValueChange={setNewLinkTarget}>
                        <SelectTrigger className="focus-visible:ring-primary">
                          <SelectValue placeholder="Select target node" />
                        </SelectTrigger>
                        <SelectContent>
                          {data.nodes.map(node => (
                            <SelectItem key={node.id} value={node.id} disabled={node.id === newLinkSource}>
                              <div className="flex items-center">
                                <div 
                                  className="w-3 h-3 rounded-full mr-2" 
                                  style={{ backgroundColor: pillars.find(p => p.id === node.pillar)?.color }}
                                />
                                {node.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="link-strength">Connection Strength</Label>
                      <div className="flex items-center gap-4">
                        <Input 
                          id="link-strength" 
                          type="range" 
                          min="1" 
                          max="10" 
                          value={newLinkValue} 
                          onChange={e => setNewLinkValue(parseInt(e.target.value))} 
                          className="w-full accent-primary"
                        />
                        <span className="w-10 text-center font-medium">{newLinkValue}</span>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setLinkDialogOpen(false)}>Cancel</Button>
                    <Button 
                      onClick={editingLink ? handleEditLink : handleAddLink}
                      className="bg-primary hover:bg-primary/90"
                      disabled={!newLinkSource || !newLinkTarget || newLinkSource === newLinkTarget}
                    >
                      {editingLink ? 'Save Changes' : 'Add Connection'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-muted-foreground/30">
              {data.links.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                  <p className="text-muted-foreground">No connections added yet</p>
                  <p className="text-sm text-muted-foreground/60 mt-1">Use the 'Add Connection' button to create links between nodes</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {data.links.map((link, index) => {
                    const sourceNode = data.nodes.find(n => n.id === link.source);
                    const targetNode = data.nodes.find(n => n.id === link.target);
                    
                    if (!sourceNode || !targetNode) return null;
                    
                    return (
                      <div 
                        key={`${link.source}-${link.target}-${index}`} 
                        className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 transition-colors shadow-sm"
                      >
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: pillars.find(p => p.id === sourceNode.pillar)?.color }}
                          />
                          <span className="font-medium">{sourceNode.name}</span>
                          <svg className="h-4 w-4 text-muted-foreground/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14m-7-7l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: pillars.find(p => p.id === targetNode.pillar)?.color }}
                          />
                          <span className="font-medium">{targetNode.name}</span>
                          <Badge variant="outline" className="ml-2 text-xs font-normal">
                            Strength: {link.value}
                          </Badge>
                        </div>
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                            onClick={() => openEditLinkDialog(link)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-red-500"
                            onClick={() => handleDeleteLink(link.source, link.target)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* JSON Tab */}
          <TabsContent value="json" className="mt-4">
            <div className="mb-4">
              <h4 className="text-lg font-medium text-primary mb-2">Raw JSON Data</h4>
              <Textarea 
                className="font-mono text-sm h-[300px] border-2 focus-visible:ring-primary" 
                value={jsonData} 
                onChange={e => setJsonData(e.target.value)}
              />
              {jsonError && (
                <Alert variant="destructive" className="mt-3">
                  <AlertDescription>{jsonError}</AlertDescription>
                </Alert>
              )}
              <div className="flex justify-end mt-4 space-x-2">
                <Button 
                  variant="outline" 
                  onClick={handleImportJSON}
                  className="border-primary text-primary hover:bg-primary/10"
                >
                  Import JSON
                </Button>
                <Button 
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/10"
                  onClick={() => {
                    navigator.clipboard.writeText(jsonData);
                  }}
                >
                  <Copy className="w-4 h-4 mr-1" /> Copy
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex flex-wrap gap-3 justify-between mt-6 pt-4 border-t">
          <Button 
            variant="outline" 
            onClick={handleReset}
            className="border-border"
          >
            Reset to Default
          </Button>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={handleExportPNG}
              className="border-primary text-primary hover:bg-primary/10"
            >
              <Download className="w-4 h-4 mr-2" /> Export PNG
            </Button>
            <Button className="bg-primary hover:bg-primary/90">
              <Save className="w-4 h-4 mr-2" /> Save Visualization
            </Button>
          </div>
        </div>
      </Card>
      
      {/* Visualization Preview */}
      <Card className="p-6 border-2 shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-primary">Preview</h3>
        <div 
          ref={visualizationRef} 
          className="bg-card rounded-lg border-2 p-4 h-[500px] overflow-hidden shadow-inner"
        >
          <DevRelEcosystem customData={data} />
        </div>
      </Card>
    </div>
  );
} 
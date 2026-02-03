'use client';

import { useState, useRef, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Edit, Download, ArrowUp, ArrowDown } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DeveloperJourney } from '../visualizations/DeveloperJourney';
import { toPng } from '@/lib/export-image';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

// Types for developer journey data
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

// Initial sample data for developer journey
const initialData: JourneyData = {
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

// Available step types and their colors
const stepTypes = [
  { id: 'awareness', name: 'Awareness', color: '#FF6F61' },
  { id: 'evaluation', name: 'Evaluation', color: '#6B5B95' },
  { id: 'activation', name: 'Activation', color: '#88B04B' },
  { id: 'usage', name: 'Usage', color: '#FCBF49' },
  { id: 'advocacy', name: 'Advocacy', color: '#51DACF' },
  { id: 'other', name: 'Other', color: '#5D5C61' }
];

export function DeveloperJourneyCustomizer() {
  const [data, setData] = useState<JourneyData>(initialData);
  const [editingStep, setEditingStep] = useState<JourneyStep | null>(null);
  const [activeTab, setActiveTab] = useState('steps');
  const [stepDialogOpen, setStepDialogOpen] = useState(false);
  const [newStepTitle, setNewStepTitle] = useState('');
  const [newStepDescription, setNewStepDescription] = useState('');
  const [newStepType, setNewStepType] = useState('awareness');
  const [newStepEngagement, setNewStepEngagement] = useState(50);
  const [newStepConversion, setNewStepConversion] = useState(50);
  const [newStepSatisfaction, setNewStepSatisfaction] = useState(50);
  const [newStepContent, setNewStepContent] = useState(['']);
  const [jsonData, setJsonData] = useState('');
  const [jsonError, setJsonError] = useState('');
  const [showLabels, setShowLabels] = useState(true);
  const visualizationRef = useRef<HTMLDivElement>(null);

  // Update JSON when data changes
  useEffect(() => {
    setJsonData(JSON.stringify(data, null, 2));
  }, [data]);

  // Handle adding a new step
  const handleAddStep = () => {
    if (!newStepTitle.trim()) return;
    
    const newId = `${newStepType}-${Date.now()}`;
    const newStep: JourneyStep = {
      id: newId,
      stepId: newStepType,
      title: newStepTitle,
      description: newStepDescription,
      metrics: {
        engagement: newStepEngagement,
        conversion: newStepConversion,
        satisfaction: newStepSatisfaction
      },
      content: newStepContent.filter(item => item.trim() !== '')
    };
    
    setData(prev => ({
      ...prev,
      stages: [...prev.stages, newStep]
    }));
    
    resetStepForm();
    setStepDialogOpen(false);
  };

  // Handle editing a step
  const handleEditStep = () => {
    if (!editingStep || !newStepTitle.trim()) return;
    
    setData(prev => ({
      ...prev,
      stages: prev.stages.map(step => 
        step.id === editingStep.id 
          ? {
              ...step,
              stepId: newStepType,
              title: newStepTitle,
              description: newStepDescription,
              metrics: {
                engagement: newStepEngagement,
                conversion: newStepConversion,
                satisfaction: newStepSatisfaction
              },
              content: newStepContent.filter(item => item.trim() !== '')
            }
          : step
      )
    }));
    
    resetStepForm();
    setEditingStep(null);
    setStepDialogOpen(false);
  };

  // Handle deleting a step
  const handleDeleteStep = (id: string) => {
    setData(prev => ({
      ...prev,
      stages: prev.stages.filter(step => step.id !== id)
    }));
  };

  // Reset the step form
  const resetStepForm = () => {
    setNewStepTitle('');
    setNewStepDescription('');
    setNewStepType('awareness');
    setNewStepEngagement(50);
    setNewStepConversion(50);
    setNewStepSatisfaction(50);
    setNewStepContent(['']);
  };

  // Handle importing data from JSON
  const handleImportJSON = () => {
    try {
      const parsed = JSON.parse(jsonData);
      
      // Validate the structure
      if (!parsed.stages || !Array.isArray(parsed.stages)) {
        throw new Error('Invalid JSON structure. Must contain a stages array.');
      }
      
      // Validate steps
      for (const step of parsed.stages) {
        if (!step.id || !step.stepId || !step.title || !step.description || 
            !step.metrics || !step.content || !Array.isArray(step.content)) {
          throw new Error('Invalid step structure. Each step must have id, stepId, title, description, metrics, and content properties.');
        }
        
        if (!step.metrics.engagement || !step.metrics.conversion || !step.metrics.satisfaction) {
          throw new Error('Invalid metrics structure. Each metrics object must have engagement, conversion, and satisfaction properties.');
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
      link.download = 'developer-journey.png';
      link.click();
    } catch (error) {
      console.error('Failed to export image:', error);
    }
  };

  // Reset to initial data
  const handleReset = () => {
    setData(initialData);
  };

  // Open edit step dialog
  const openEditStepDialog = (step: JourneyStep) => {
    setEditingStep(step);
    setNewStepTitle(step.title);
    setNewStepDescription(step.description);
    setNewStepType(step.stepId);
    setNewStepEngagement(step.metrics.engagement);
    setNewStepConversion(step.metrics.conversion);
    setNewStepSatisfaction(step.metrics.satisfaction);
    setNewStepContent(step.content.length > 0 ? [...step.content] : ['']);
    setStepDialogOpen(true);
  };

  // Add a new content item
  const addContentItem = () => {
    setNewStepContent([...newStepContent, '']);
  };

  // Update a content item
  const updateContentItem = (index: number, value: string) => {
    const updatedContent = [...newStepContent];
    updatedContent[index] = value;
    setNewStepContent(updatedContent);
  };

  // Remove a content item
  const removeContentItem = (index: number) => {
    if (newStepContent.length === 1) {
      setNewStepContent(['']);
      return;
    }
    const updatedContent = newStepContent.filter((_, i) => i !== index);
    setNewStepContent(updatedContent);
  };

  // Move a step up in the order
  const moveStepUp = (index: number) => {
    if (index === 0) return;
    
    const updatedStages = [...data.stages];
    const temp = updatedStages[index];
    updatedStages[index] = updatedStages[index - 1];
    updatedStages[index - 1] = temp;
    
    setData({ ...data, stages: updatedStages });
  };

  // Move a step down in the order
  const moveStepDown = (index: number) => {
    if (index === data.stages.length - 1) return;
    
    const updatedStages = [...data.stages];
    const temp = updatedStages[index];
    updatedStages[index] = updatedStages[index + 1];
    updatedStages[index + 1] = temp;
    
    setData({ ...data, stages: updatedStages });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left side: Configuration */}
      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="steps">Journey Steps</TabsTrigger>
            <TabsTrigger value="json">JSON Data</TabsTrigger>
          </TabsList>
          
          <TabsContent value="steps" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Developer Journey Steps</h3>
              <Dialog open={stepDialogOpen} onOpenChange={setStepDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => {
                    setEditingStep(null);
                    resetStepForm();
                  }}>
                    <Plus className="mr-2 h-4 w-4" /> Add Step
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingStep ? 'Edit Step' : 'Add New Step'}</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="stepTitle">Step Title</Label>
                      <Input
                        id="stepTitle"
                        value={newStepTitle}
                        onChange={(e) => setNewStepTitle(e.target.value)}
                        placeholder="e.g., Product Discovery"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="stepDescription">Description</Label>
                      <Textarea
                        id="stepDescription"
                        value={newStepDescription}
                        onChange={(e) => setNewStepDescription(e.target.value)}
                        placeholder="Describe this step in the journey"
                        rows={2}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="stepType">Step Type</Label>
                      <Select
                        value={newStepType}
                        onValueChange={setNewStepType}
                      >
                        <SelectTrigger id="stepType">
                          <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                        <SelectContent>
                          {stepTypes.map(type => (
                            <SelectItem key={type.id} value={type.id}>
                              <div className="flex items-center">
                                <div 
                                  className="w-3 h-3 rounded-full mr-2" 
                                  style={{ backgroundColor: type.color }}
                                />
                                {type.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-3">
                      <Label>Metrics</Label>
                      <div className="grid gap-2">
                        <Label htmlFor="engagement" className="text-xs">
                          Engagement: {newStepEngagement}%
                        </Label>
                        <Input
                          id="engagement"
                          type="range"
                          min={0}
                          max={100}
                          value={newStepEngagement}
                          onChange={(e) => setNewStepEngagement(parseInt(e.target.value))}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="conversion" className="text-xs">
                          Conversion: {newStepConversion}%
                        </Label>
                        <Input
                          id="conversion"
                          type="range"
                          min={0}
                          max={100}
                          value={newStepConversion}
                          onChange={(e) => setNewStepConversion(parseInt(e.target.value))}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="satisfaction" className="text-xs">
                          Satisfaction: {newStepSatisfaction}%
                        </Label>
                        <Input
                          id="satisfaction"
                          type="range"
                          min={0}
                          max={100}
                          value={newStepSatisfaction}
                          onChange={(e) => setNewStepSatisfaction(parseInt(e.target.value))}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <Label>Content Items</Label>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={addContentItem}
                          type="button"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      {newStepContent.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            value={item}
                            onChange={(e) => updateContentItem(index, e.target.value)}
                            placeholder="Content item"
                          />
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => removeContentItem(index)}
                            type="button"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setStepDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={editingStep ? handleEditStep : handleAddStep}>
                      {editingStep ? 'Save Changes' : 'Add Step'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="flex items-center space-x-2 pb-2">
              <Switch 
                id="show-labels" 
                checked={showLabels} 
                onCheckedChange={setShowLabels} 
              />
              <Label htmlFor="show-labels">Show Labels</Label>
            </div>
            
            <div className="overflow-y-auto max-h-[500px] border rounded-md">
              {data.stages.length === 0 ? (
                <div className="p-4 text-center text-gray-500">No steps added yet</div>
              ) : (
                <div className="divide-y">
                  {data.stages.map((step, index) => (
                    <div key={step.id} className="p-3 hover:bg-gray-50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div 
                            className="w-4 h-4 rounded-full mr-3" 
                            style={{ 
                              backgroundColor: stepTypes.find(t => t.id === step.stepId)?.color || 'gray'
                            }} 
                          />
                          <div>
                            <div className="font-medium">{step.title}</div>
                            <div className="text-xs text-gray-500">
                              <Badge variant="outline" className="mr-1">
                                {stepTypes.find(t => t.id === step.stepId)?.name || step.stepId}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => moveStepUp(index)}
                            disabled={index === 0}
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => moveStepDown(index)}
                            disabled={index === data.stages.length - 1}
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => openEditStepDialog(step)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteStep(step.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-sm ml-7 mb-2">{step.description}</div>
                      <div className="flex flex-wrap gap-2 ml-7 mb-2">
                        <Badge variant="secondary">
                          Engagement: {step.metrics.engagement}%
                        </Badge>
                        <Badge variant="secondary">
                          Conversion: {step.metrics.conversion}%
                        </Badge>
                        <Badge variant="secondary">
                          Satisfaction: {step.metrics.satisfaction}%
                        </Badge>
                      </div>
                      <div className="ml-7 text-xs text-gray-600">
                        <div className="font-medium mb-1">Content:</div>
                        <ul className="list-disc list-inside space-y-1">
                          {step.content.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
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
      <div className="border rounded-lg p-4 bg-white">
        <h3 className="text-lg font-semibold mb-4">Preview</h3>
        <div className="h-[500px]" ref={visualizationRef}>
          <DeveloperJourney 
            customData={data} 
            showLabels={showLabels}
          />
        </div>
      </div>
    </div>
  );
}

export default DeveloperJourneyCustomizer; 
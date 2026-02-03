'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BarChart, PieChart, LineChart, Settings, Download, Info, Upload, DatabaseIcon, FileUp, FileText, HelpCircle, AlertCircle, Github } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function ContentImpactBuilder() {
  const [visualizationType, setVisualizationType] = useState('bar');
  const [timeRange, setTimeRange] = useState('90days');
  const [engagementThreshold, setEngagementThreshold] = useState(40);
  const [contentTypes, setContentTypes] = useState({
    blog: true,
    docs: true,
    videos: true,
    tutorials: true,
    social: true
  });
  
  const [activeTab, setActiveTab] = useState('data-import');
  const [dataSource, setDataSource] = useState('upload');
  const [isDataImported, setIsDataImported] = useState(false);

  const handleContentTypeChange = (type) => {
    setContentTypes({
      ...contentTypes,
      [type]: !contentTypes[type]
    });
  };

  const handleDataImport = () => {
    // In a real implementation, this would process the data
    setIsDataImported(true);
    setActiveTab('visualization');
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/builder">
            <Button variant="ghost" size="sm" className="mb-2">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Builders
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Content Impact Builder</h1>
          <p className="text-muted-foreground mt-1">
            Measure and analyze the performance and impact of your content across different channels and audience segments.
          </p>
        </div>
        <Badge variant="outline" className="text-sm bg-yellow-50 text-yellow-800 border-yellow-300">
          Beta
        </Badge>
      </div>
      
      <div className="grid grid-cols-12 gap-6">
        {/* Left sidebar - Controls */}
        <div className="col-span-12 md:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Analysis Settings</CardTitle>
              <CardDescription>Configure your content impact analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Visualization Type</Label>
                <Select value={visualizationType} onValueChange={setVisualizationType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pie">Pie Chart</SelectItem>
                    <SelectItem value="bar">Bar Chart</SelectItem>
                    <SelectItem value="line">Line Chart</SelectItem>
                    <SelectItem value="heatmap">Engagement Heatmap</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Time Range</Label>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30days">Last 30 Days</SelectItem>
                    <SelectItem value="90days">Last 90 Days</SelectItem>
                    <SelectItem value="6months">Last 6 Months</SelectItem>
                    <SelectItem value="12months">Last 12 Months</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Content Types to Analyze</Label>
                <div className="space-y-2 pt-2">
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="blog" 
                      checked={contentTypes.blog}
                      onChange={() => handleContentTypeChange('blog')}
                      className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                    />
                    <Label htmlFor="blog">Blog Posts</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="docs" 
                      checked={contentTypes.docs}
                      onChange={() => handleContentTypeChange('docs')}
                      className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                    />
                    <Label htmlFor="docs">Documentation</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="videos" 
                      checked={contentTypes.videos}
                      onChange={() => handleContentTypeChange('videos')}
                      className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                    />
                    <Label htmlFor="videos">Videos</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="tutorials" 
                      checked={contentTypes.tutorials}
                      onChange={() => handleContentTypeChange('tutorials')}
                      className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                    />
                    <Label htmlFor="tutorials">Tutorials</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="social" 
                      checked={contentTypes.social}
                      onChange={() => handleContentTypeChange('social')}
                      className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                    />
                    <Label htmlFor="social">Social Media</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="engagement-threshold">Engagement Level Threshold ({engagementThreshold}%)</Label>
                <Input 
                  id="engagement-threshold" 
                  type="range" 
                  min="0" 
                  max="100" 
                  step="10" 
                  value={engagementThreshold}
                  onChange={(e) => setEngagementThreshold(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Low</span>
                  <span>High</span>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-border">
                <div className="flex items-center text-sm text-blue-600 mb-2">
                  <HelpCircle className="h-4 w-4 mr-1" />
                  <span>Data requirements</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Your data should include content types, dates, views, engagement metrics, and conversion rates.
                  <a href="#" className="block text-blue-600 mt-1 hover:underline">View data format guide</a>
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg">Data Sources</CardTitle>
              <CardDescription>Connect your content platforms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium flex items-center">
                    <FileUp className="h-4 w-4 mr-2" />
                    CSV Upload
                  </span>
                  <Button variant="outline" size="sm" className="text-xs">Choose File</Button>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium flex items-center">
                    <DatabaseIcon className="h-4 w-4 mr-2" />
                    Google Analytics
                  </span>
                  <Button variant="outline" size="sm" className="text-xs">Connect</Button>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium flex items-center">
                    <DatabaseIcon className="h-4 w-4 mr-2" />
                    Github
                  </span>
                  <Button variant="outline" size="sm" className="text-xs">Connect</Button>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium flex items-center">
                    <DatabaseIcon className="h-4 w-4 mr-2" />
                    YouTube Analytics
                  </span>
                  <Button variant="outline" size="sm" className="text-xs">Connect</Button>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium flex items-center">
                    <DatabaseIcon className="h-4 w-4 mr-2" />
                    Twitter Analytics
                  </span>
                  <Button variant="outline" size="sm" className="text-xs">Connect</Button>
                </div>
                <div className="border-t border-border mt-3 pt-3">
                  <Button className="w-full" onClick={handleDataImport}>
                    Generate Analysis
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main content - Analysis & Visualization Area */}
        <div className="col-span-12 md:col-span-9 space-y-4">
          <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Content Performance Analysis</CardTitle>
                <CardDescription>Analyze your content's reach and impact</CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button variant="ghost" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Info className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="data-import">Data Import</TabsTrigger>
                  <TabsTrigger value="visualization" disabled={!isDataImported}>Visualization</TabsTrigger>
                  <TabsTrigger value="insights" disabled={!isDataImported}>Insights</TabsTrigger>
                </TabsList>
                
                <TabsContent value="data-import">
                  <div className="h-96 flex flex-col items-center justify-center border rounded-md bg-muted/50 p-8">
                    <div className="text-center max-w-md">
                      <div className="bg-blue-50 rounded-full p-4 inline-block mb-4">
                        <Upload className="h-8 w-8 text-blue-500" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">Import Your Content Analytics Data</h3>
                      <p className="text-muted-foreground mb-6">
                        Connect data sources or upload your content analytics data to visualize performance and generate insights.
                      </p>
                      
                      <div className="space-y-4">
                        <div className="border border-border rounded-md p-4 flex flex-col items-center">
                          <FileText className="h-6 w-6 text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground mb-2">Upload a CSV file with your content analytics data</p>
                          <div className="relative w-full">
                            <Input type="file" accept=".csv" className="cursor-pointer" />
                          </div>
                          <a href="#" className="text-xs text-blue-600 mt-2 hover:underline">Download sample template</a>
                        </div>
                        
                        <div className="text-center">
                          <span className="text-sm text-muted-foreground">Or</span>
                        </div>
                        
                        <div className="space-y-2">
                          <Button variant="outline" className="w-full justify-start">
                            <DatabaseIcon className="mr-2 h-4 w-4" /> Connect to Google Analytics
                          </Button>
                          <Button variant="outline" className="w-full justify-start">
                            <DatabaseIcon className="mr-2 h-4 w-4" /> Connect to Github Insights
                          </Button>
                        </div>
                        
                        <Button className="w-full" onClick={handleDataImport}>
                          Process Data
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="visualization">
                  {isDataImported ? (
                    <div className="h-96 border rounded-md bg-white">
                      <div className="p-4 h-full flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-muted-foreground mb-2">Your data visualization will appear here</p>
                          {visualizationType === 'bar' && <BarChart className="w-16 h-16 mx-auto text-muted-foreground" />}
                          {visualizationType === 'pie' && <PieChart className="w-16 h-16 mx-auto text-muted-foreground" />}
                          {visualizationType === 'line' && <LineChart className="w-16 h-16 mx-auto text-muted-foreground" />}
                          <p className="mt-2 text-muted-foreground text-sm">Customize visualization settings in the left panel</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-96 flex items-center justify-center border rounded-md bg-muted/50">
                      <div className="text-center">
                        <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">Please import your data first</p>
                      </div>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="insights">
                  {isDataImported ? (
                    <div className="h-96 border rounded-md p-4 overflow-auto">
                      <div className="space-y-4">
                        <div className="p-3 bg-muted/50 border border-border rounded-md">
                          <h4 className="font-medium text-foreground mb-1">Insights Generated Based on Your Data</h4>
                          <p className="text-sm text-muted-foreground">Once your data is processed, AI-powered insights about your content performance will appear here.</p>
                        </div>
                        
                        <div className="flex items-center justify-center h-64 border border-dashed border-border rounded-md">
                          <div className="text-center">
                            <HelpCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                            <p className="text-muted-foreground">Insights will be generated from your data</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-96 flex items-center justify-center border rounded-md bg-muted/50">
                      <div className="text-center">
                        <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">Please import your data first</p>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <div className="text-xs text-muted-foreground flex items-center">
                <Info className="h-3 w-3 mr-1" />
                Connect multiple data sources for comprehensive content impact analysis across platforms
              </div>
            </CardFooter>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Key Metrics</CardTitle>
                <CardDescription>Summary of content performance</CardDescription>
              </CardHeader>
              <CardContent>
                {isDataImported ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Avg. Engagement Rate</span>
                      <span className="font-medium">Will show your data</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total Content Views</span>
                      <span className="font-medium">Will show your data</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Avg. Conversion Rate</span>
                      <span className="font-medium">Will show your data</span>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-muted-foreground text-sm">Import data to see metrics</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Top Content</CardTitle>
                <CardDescription>Best performing content</CardDescription>
              </CardHeader>
              <CardContent>
                {isDataImported ? (
                  <div className="space-y-2">
                    <p className="text-muted-foreground text-sm">Your top performing content will be listed here based on your imported data</p>
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-muted-foreground text-sm">Import data to see top content</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Improvement Areas</CardTitle>
                <CardDescription>Content that needs attention</CardDescription>
              </CardHeader>
              <CardContent>
                {isDataImported ? (
                  <div className="space-y-2">
                    <p className="text-muted-foreground text-sm">This section will highlight content that could be improved based on your data analysis</p>
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-muted-foreground text-sm">Import data to see improvement areas</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 
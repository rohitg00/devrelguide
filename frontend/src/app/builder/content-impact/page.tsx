'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BarChart, PieChart, LineChart, Settings, Download, Info } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function ContentImpactBuilder() {
  const [visualizationType, setVisualizationType] = useState('pie');
  const [timeRange, setTimeRange] = useState('90days');

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
          <p className="text-gray-600 mt-1">
            Visualize the performance and impact of your content across different channels and audience segments.
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
              <CardTitle className="text-lg">Visualization Settings</CardTitle>
              <CardDescription>Customize your content impact view</CardDescription>
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
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Content Types</Label>
                <div className="space-y-2 pt-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="blog" defaultChecked />
                    <Label htmlFor="blog">Blog Posts</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="docs" defaultChecked />
                    <Label htmlFor="docs">Documentation</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="videos" defaultChecked />
                    <Label htmlFor="videos">Videos</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="tutorials" defaultChecked />
                    <Label htmlFor="tutorials">Tutorials</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="social" defaultChecked />
                    <Label htmlFor="social">Social Media</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Engagement Level Threshold</Label>
                <Slider defaultValue={[40]} max={100} step={10} />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Low</span>
                  <span>High</span>
                </div>
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
                  <span className="text-sm font-medium">Google Analytics</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700">Connected</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">GitHub</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700">Connected</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">YouTube</span>
                  <Button variant="outline" size="sm" className="text-xs">Connect</Button>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Twitter</span>
                  <Button variant="outline" size="sm" className="text-xs">Connect</Button>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Custom CSV</span>
                  <Button variant="outline" size="sm" className="text-xs">Upload</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main content - Visualization */}
        <div className="col-span-12 md:col-span-9 space-y-4">
          <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Content Performance</CardTitle>
                <CardDescription>Visualizing impact across channels</CardDescription>
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
              <Tabs defaultValue="visualization" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="visualization">Visualization</TabsTrigger>
                  <TabsTrigger value="data">Data Table</TabsTrigger>
                  <TabsTrigger value="insights">Insights</TabsTrigger>
                </TabsList>
                <TabsContent value="visualization">
                  <div className="h-96 flex items-center justify-center border rounded-md bg-gray-50">
                    {visualizationType === 'pie' && (
                      <div className="flex flex-col items-center">
                        <PieChart className="w-32 h-32 text-primary mb-4" />
                        <p className="text-sm text-gray-500">Content Impact Distribution</p>
                      </div>
                    )}
                    {visualizationType === 'bar' && (
                      <div className="flex flex-col items-center">
                        <BarChart className="w-32 h-32 text-primary mb-4" />
                        <p className="text-sm text-gray-500">Content Performance by Type</p>
                      </div>
                    )}
                    {visualizationType === 'line' && (
                      <div className="flex flex-col items-center">
                        <LineChart className="w-32 h-32 text-primary mb-4" />
                        <p className="text-sm text-gray-500">Content Engagement Trends</p>
                      </div>
                    )}
                    {visualizationType === 'heatmap' && (
                      <div className="flex flex-col items-center">
                        <div className="grid grid-cols-7 gap-1 mb-4">
                          {Array(28).fill(0).map((_, i) => (
                            <div key={i} className={`w-6 h-6 rounded-sm bg-primary opacity-${(i % 10) * 10}`}></div>
                          ))}
                        </div>
                        <p className="text-sm text-gray-500">Content Engagement Heatmap</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="data">
                  <div className="h-96 border rounded-md overflow-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b bg-gray-50">
                          <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Content Type</th>
                          <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Views</th>
                          <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Engagement</th>
                          <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Conversion</th>
                          <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Avg. Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-2 px-4">Blog Posts</td>
                          <td className="py-2 px-4">12,456</td>
                          <td className="py-2 px-4">32%</td>
                          <td className="py-2 px-4">4.8%</td>
                          <td className="py-2 px-4">3:45</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 px-4">Documentation</td>
                          <td className="py-2 px-4">34,212</td>
                          <td className="py-2 px-4">56%</td>
                          <td className="py-2 px-4">8.2%</td>
                          <td className="py-2 px-4">7:12</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 px-4">Videos</td>
                          <td className="py-2 px-4">5,789</td>
                          <td className="py-2 px-4">62%</td>
                          <td className="py-2 px-4">9.5%</td>
                          <td className="py-2 px-4">4:32</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 px-4">Tutorials</td>
                          <td className="py-2 px-4">8,901</td>
                          <td className="py-2 px-4">71%</td>
                          <td className="py-2 px-4">12.3%</td>
                          <td className="py-2 px-4">14:22</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-4">Social Media</td>
                          <td className="py-2 px-4">48,231</td>
                          <td className="py-2 px-4">18%</td>
                          <td className="py-2 px-4">2.1%</td>
                          <td className="py-2 px-4">1:05</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
                <TabsContent value="insights">
                  <div className="h-96 border rounded-md p-4 overflow-auto">
                    <div className="space-y-4">
                      <div className="p-3 bg-blue-50 border border-blue-100 rounded-md">
                        <h4 className="font-medium text-blue-800 mb-1">Top Performing Content</h4>
                        <p className="text-sm text-blue-600">Your API reference documentation and "Getting Started" tutorials are generating the highest engagement rates.</p>
                      </div>
                      <div className="p-3 bg-green-50 border border-green-100 rounded-md">
                        <h4 className="font-medium text-green-800 mb-1">Growth Opportunity</h4>
                        <p className="text-sm text-green-600">Video content has the highest conversion rate but lowest reach. Consider increasing production of video tutorials.</p>
                      </div>
                      <div className="p-3 bg-yellow-50 border border-yellow-100 rounded-md">
                        <h4 className="font-medium text-yellow-800 mb-1">Content Gap</h4>
                        <p className="text-sm text-yellow-600">There appears to be insufficient intermediate-level content. Users are dropping off between beginner and advanced materials.</p>
                      </div>
                      <div className="p-3 bg-purple-50 border border-purple-100 rounded-md">
                        <h4 className="font-medium text-purple-800 mb-1">Audience Insight</h4>
                        <p className="text-sm text-purple-600">Content optimized for mobile devices sees 43% higher engagement than desktop-only optimized content.</p>
                      </div>
                      <div className="p-3 bg-red-50 border border-red-100 rounded-md">
                        <h4 className="font-medium text-red-800 mb-1">Action Required</h4>
                        <p className="text-sm text-red-600">Social media content has high reach but low conversion. Review and update your call-to-actions in these materials.</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Audience Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center py-3">
                  <div className="text-4xl font-bold text-primary mb-1">78%</div>
                  <p className="text-sm text-gray-500">Avg. Engagement Rate</p>
                  <div className="flex items-center mt-2 text-green-600 text-sm">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 4V12M8 4L5 7M8 4L11 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="ml-1">12% vs previous period</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Content Reach</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center py-3">
                  <div className="text-4xl font-bold text-primary mb-1">109,588</div>
                  <p className="text-sm text-gray-500">Total Content Views</p>
                  <div className="flex items-center mt-2 text-green-600 text-sm">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 4V12M8 4L5 7M8 4L11 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="ml-1">18% vs previous period</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Conversion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center py-3">
                  <div className="text-4xl font-bold text-primary mb-1">7.3%</div>
                  <p className="text-sm text-gray-500">Avg. Conversion Rate</p>
                  <div className="flex items-center mt-2 text-red-600 text-sm">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 12V4M8 12L5 9M8 12L11 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="ml-1">2% vs previous period</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 
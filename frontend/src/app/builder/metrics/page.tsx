'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BarChart2, LineChart, PieChart, Activity, Plus, Edit, MoreHorizontal, Download, RefreshCw, ChevronDown, Calendar, Users, FileText, Github } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function MetricsDashboardBuilder() {
  const [timeRange, setTimeRange] = useState('90days');
  const [chartOption, setChartOption] = useState('view');

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/builder">
            <Button variant="ghost" size="sm" className="mb-2">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Builders
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Metrics Dashboard Builder</h1>
          <p className="text-gray-600 mt-1">
            Create a customizable dashboard with your most important DevRel KPIs and metrics.
          </p>
        </div>
        <Badge variant="outline" className="text-sm bg-yellow-50 text-yellow-800 border-yellow-300">
          Beta
        </Badge>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
              <SelectItem value="12months">Last 12 Months</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="gap-1">
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Download className="h-4 w-4" /> Export
          </Button>
          <Button className="gap-1">
            <Plus className="h-4 w-4" /> Add Widget
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-12 gap-6">
        {/* Top row metrics */}
        <div className="col-span-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Total Developers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-3xl font-bold">24,892</div>
                  <div className="flex items-center text-green-600 text-sm">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 4V12M8 4L5 7M8 4L11 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="ml-1">14%</span>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-1">vs previous period</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Active Contributors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-3xl font-bold">3,756</div>
                  <div className="flex items-center text-green-600 text-sm">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 4V12M8 4L5 7M8 4L11 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="ml-1">8%</span>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-1">vs previous period</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Documentation Views</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-3xl font-bold">152,489</div>
                  <div className="flex items-center text-green-600 text-sm">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 4V12M8 4L5 7M8 4L11 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="ml-1">23%</span>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-1">vs previous period</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">API Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-3xl font-bold">3.4M</div>
                  <div className="flex items-center text-red-600 text-sm">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 12V4M8 12L5 9M8 12L11 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="ml-1">2%</span>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-1">vs previous period</div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Main charts */}
        <div className="col-span-12 md:col-span-8">
          <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Developer Engagement Trends</CardTitle>
                <CardDescription>Activity across all platforms</CardDescription>
              </div>
              <div className="flex space-x-1">
                <Button variant="ghost" size="sm" onClick={() => setChartOption('edit')} title="Edit Chart">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setChartOption('download')} title="Download">
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setChartOption('fullscreen')} title="View Fullscreen">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center border rounded-md bg-gray-50">
                <div className="w-full p-4">
                  <div className="h-60 relative">
                    {/* Line chart visualization */}
                    <LineChart className="w-20 h-20 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gray-200"></div>
                    <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-gray-200"></div>
                    {/* X-axis labels */}
                    <div className="absolute bottom-[-20px] left-0 right-0 flex justify-between text-xs text-gray-500">
                      <span>Jan</span>
                      <span>Feb</span>
                      <span>Mar</span>
                      <span>Apr</span>
                      <span>May</span>
                      <span>Jun</span>
                      <span>Jul</span>
                      <span>Aug</span>
                      <span>Sep</span>
                    </div>
                    {/* Y-axis labels */}
                    <div className="absolute left-[-35px] top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500">
                      <span>100K</span>
                      <span>75K</span>
                      <span>50K</span>
                      <span>25K</span>
                      <span>0</span>
                    </div>
                  </div>
                  <div className="flex justify-center mt-6 space-x-4">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                      <span className="text-xs text-gray-600">Documentation</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                      <span className="text-xs text-gray-600">Github</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-xs text-gray-600">Forums</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
                      <span className="text-xs text-gray-600">Discord</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base">New Developers</CardTitle>
                <Select value="options" onValueChange={(value) => console.log(value)}>
                  <SelectTrigger className="w-8 h-8 p-0 border-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="edit">Edit</SelectItem>
                    <SelectItem value="download">Download</SelectItem>
                    <SelectItem value="fullscreen">View Fullscreen</SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent>
                <div className="h-60 flex items-center justify-center border rounded-md bg-gray-50">
                  <div className="w-full p-4 relative">
                    <BarChart2 className="w-16 h-16 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gray-200"></div>
                    <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-gray-200"></div>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm">Month-over-month growth</div>
                  <div className="text-sm font-bold text-green-600">+16.8%</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base">Geographic Distribution</CardTitle>
                <Select value="options" onValueChange={(value) => console.log(value)}>
                  <SelectTrigger className="w-8 h-8 p-0 border-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="edit">Edit</SelectItem>
                    <SelectItem value="download">Download</SelectItem>
                    <SelectItem value="fullscreen">View Fullscreen</SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent>
                <div className="h-60 flex items-center justify-center border rounded-md bg-gray-50">
                  <div className="w-full p-4 relative">
                    <PieChart className="w-16 h-16 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm">Top region</div>
                  <div className="text-sm font-bold">North America (42%)</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="col-span-12 md:col-span-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>DevRel Activity</CardTitle>
              <CardDescription>Last 90 days</CardDescription>
            </CardHeader>
            <CardContent className="px-2">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md">
                  <div className="flex items-center">
                    <div className="rounded-full bg-blue-100 p-2 mr-3">
                      <Activity className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium">Conferences</div>
                      <div className="text-sm text-gray-500">6 events</div>
                    </div>
                  </div>
                  <div className="text-xl font-bold">24</div>
                </div>
                
                <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md">
                  <div className="flex items-center">
                    <div className="rounded-full bg-purple-100 p-2 mr-3">
                      <Activity className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-medium">Workshops</div>
                      <div className="text-sm text-gray-500">12 events</div>
                    </div>
                  </div>
                  <div className="text-xl font-bold">36</div>
                </div>
                
                <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md">
                  <div className="flex items-center">
                    <div className="rounded-full bg-green-100 p-2 mr-3">
                      <Activity className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium">Blog Posts</div>
                      <div className="text-sm text-gray-500">28 articles</div>
                    </div>
                  </div>
                  <div className="text-xl font-bold">48</div>
                </div>
                
                <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md">
                  <div className="flex items-center">
                    <div className="rounded-full bg-yellow-100 p-2 mr-3">
                      <Activity className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div>
                      <div className="font-medium">Webinars</div>
                      <div className="text-sm text-gray-500">8 sessions</div>
                    </div>
                  </div>
                  <div className="text-xl font-bold">16</div>
                </div>
                
                <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md">
                  <div className="flex items-center">
                    <div className="rounded-full bg-red-100 p-2 mr-3">
                      <Activity className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <div className="font-medium">Forums</div>
                      <div className="text-sm text-gray-500">104 responses</div>
                    </div>
                  </div>
                  <div className="text-xl font-bold">104</div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button variant="outline" className="w-full">View All Activities</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Top Content</CardTitle>
              <CardDescription>Most viewed in last 90 days</CardDescription>
            </CardHeader>
            <CardContent className="px-2">
              <div className="space-y-3">
                <div className="flex justify-between p-2 hover:bg-gray-50 rounded-md">
                  <div className="text-sm font-medium">Getting Started Guide</div>
                  <div className="text-sm font-bold">24,532</div>
                </div>
                <div className="flex justify-between p-2 hover:bg-gray-50 rounded-md">
                  <div className="text-sm font-medium">API Reference</div>
                  <div className="text-sm font-bold">18,245</div>
                </div>
                <div className="flex justify-between p-2 hover:bg-gray-50 rounded-md">
                  <div className="text-sm font-medium">Authentication Tutorial</div>
                  <div className="text-sm font-bold">12,678</div>
                </div>
                <div className="flex justify-between p-2 hover:bg-gray-50 rounded-md">
                  <div className="text-sm font-medium">Migration Guide</div>
                  <div className="text-sm font-bold">8,932</div>
                </div>
                <div className="flex justify-between p-2 hover:bg-gray-50 rounded-md">
                  <div className="text-sm font-medium">Best Practices</div>
                  <div className="text-sm font-bold">7,645</div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button variant="outline" className="w-full">View All Content</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
} 
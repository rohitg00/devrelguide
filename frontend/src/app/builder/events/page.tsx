'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, BarChart2, PieChart, Download, Settings, Filter, MapPin, Users, Zap, BarChart, LineChart, ChevronDown, Plus } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export default function EventImpactBuilder() {
  const [eventType, setEventType] = useState('all');
  const [timeframe, setTimeframe] = useState('12months');
  const [metric, setMetric] = useState('attendance');

  const [regions, setRegions] = useState({
    na: true,
    eu: true,
    apac: true,
    latam: true
  });

  const [formats, setFormats] = useState({
    inperson: true,
    virtual: true,
    hybrid: true
  });

  const handleRegionChange = (region: string) => {
    setRegions({
      ...regions,
      [region]: !regions[region as keyof typeof regions]
    });
  };

  const handleFormatChange = (format: string) => {
    setFormats({
      ...formats,
      [format]: !formats[format as keyof typeof formats]
    });
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
          <h1 className="text-3xl font-bold">Event Impact Builder</h1>
          <p className="text-muted-foreground mt-1">
            Measure and display the impact of your developer events, workshops, and conferences.
          </p>
        </div>
        <Badge variant="outline" className="text-sm bg-yellow-50 text-yellow-800 border-yellow-300">
          Beta
        </Badge>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left sidebar */}
        <div className="w-full md:w-1/3 lg:w-1/4 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Event Filters</CardTitle>
              <CardDescription>Configure visualization parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Event Type</Label>
                <Select value={eventType} onValueChange={setEventType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Events</SelectItem>
                    <SelectItem value="conference">Conferences</SelectItem>
                    <SelectItem value="workshop">Workshops</SelectItem>
                    <SelectItem value="hackathon">Hackathons</SelectItem>
                    <SelectItem value="webinar">Webinars</SelectItem>
                    <SelectItem value="meetup">Meetups</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Timeframe</Label>
                <Select value={timeframe} onValueChange={setTimeframe}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3months">Last 3 Months</SelectItem>
                    <SelectItem value="6months">Last 6 Months</SelectItem>
                    <SelectItem value="12months">Last 12 Months</SelectItem>
                    <SelectItem value="ytd">Year to Date</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Primary Metric</Label>
                <Select value={metric} onValueChange={setMetric}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select metric" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="attendance">Attendance</SelectItem>
                    <SelectItem value="satisfaction">Satisfaction</SelectItem>
                    <SelectItem value="leads">New Leads</SelectItem>
                    <SelectItem value="adoption">Product Adoption</SelectItem>
                    <SelectItem value="roi">ROI</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="h-px bg-muted my-4"></div>

              <div>
                <h3 className="text-sm font-medium mb-2">Regions</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="region-na" 
                      checked={regions.na}
                      onChange={() => handleRegionChange('na')}
                      className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                    />
                    <Label htmlFor="region-na">North America</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="region-eu" 
                      checked={regions.eu}
                      onChange={() => handleRegionChange('eu')}
                      className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                    />
                    <Label htmlFor="region-eu">Europe</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="region-apac" 
                      checked={regions.apac}
                      onChange={() => handleRegionChange('apac')}
                      className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                    />
                    <Label htmlFor="region-apac">Asia Pacific</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="region-latam" 
                      checked={regions.latam}
                      onChange={() => handleRegionChange('latam')}
                      className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                    />
                    <Label htmlFor="region-latam">Latin America</Label>
                  </div>
                </div>
              </div>

              <div className="h-px bg-muted my-4"></div>

              <div>
                <h3 className="text-sm font-medium mb-2">Format</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="format-inperson" 
                      checked={formats.inperson}
                      onChange={() => handleFormatChange('inperson')}
                      className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                    />
                    <Label htmlFor="format-inperson">In-Person</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="format-virtual" 
                      checked={formats.virtual}
                      onChange={() => handleFormatChange('virtual')}
                      className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                    />
                    <Label htmlFor="format-virtual">Virtual</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="format-hybrid" 
                      checked={formats.hybrid}
                      onChange={() => handleFormatChange('hybrid')}
                      className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                    />
                    <Label htmlFor="format-hybrid">Hybrid</Label>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2 border-t pt-4">
              <Button variant="outline" size="sm" className="flex-1">Reset</Button>
              <Button size="sm" className="flex-1">Apply</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Recent Events</CardTitle>
              <CardDescription>Last 3 events</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="rounded-md border p-3 hover:bg-muted/50">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">DevCon 2023</div>
                    <div className="text-xs text-muted-foreground mt-1 flex items-center">
                      <Calendar className="h-3 w-3 mr-1" /> Jun 12-14, 2023
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 flex items-center">
                      <MapPin className="h-3 w-3 mr-1" /> San Francisco, CA
                    </div>
                  </div>
                  <Badge>Conference</Badge>
                </div>
                <div className="flex items-center gap-4 mt-2 text-xs">
                  <div className="flex items-center">
                    <Users className="h-3 w-3 mr-1 text-blue-600" />
                    <span>876</span>
                  </div>
                  <div className="flex items-center">
                    <Zap className="h-3 w-3 mr-1 text-yellow-600" />
                    <span>92%</span>
                  </div>
                </div>
              </div>

              <div className="rounded-md border p-3 hover:bg-muted/50">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">API Workshop</div>
                    <div className="text-xs text-muted-foreground mt-1 flex items-center">
                      <Calendar className="h-3 w-3 mr-1" /> May 28, 2023
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 flex items-center">
                      <MapPin className="h-3 w-3 mr-1" /> Virtual
                    </div>
                  </div>
                  <Badge>Workshop</Badge>
                </div>
                <div className="flex items-center gap-4 mt-2 text-xs">
                  <div className="flex items-center">
                    <Users className="h-3 w-3 mr-1 text-blue-600" />
                    <span>214</span>
                  </div>
                  <div className="flex items-center">
                    <Zap className="h-3 w-3 mr-1 text-yellow-600" />
                    <span>88%</span>
                  </div>
                </div>
              </div>

              <div className="rounded-md border p-3 hover:bg-muted/50">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">Spring Hackathon</div>
                    <div className="text-xs text-muted-foreground mt-1 flex items-center">
                      <Calendar className="h-3 w-3 mr-1" /> Apr 15-16, 2023
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 flex items-center">
                      <MapPin className="h-3 w-3 mr-1" /> London, UK
                    </div>
                  </div>
                  <Badge>Hackathon</Badge>
                </div>
                <div className="flex items-center gap-4 mt-2 text-xs">
                  <div className="flex items-center">
                    <Users className="h-3 w-3 mr-1 text-blue-600" />
                    <span>149</span>
                  </div>
                  <div className="flex items-center">
                    <Zap className="h-3 w-3 mr-1 text-yellow-600" />
                    <span>95%</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button variant="ghost" size="sm" className="w-full flex items-center justify-center">
                View All Events <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Main content */}
        <div className="flex-1 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-medium">Event Performance Overview</h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1">
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button size="sm" className="gap-1">
                <Plus className="h-4 w-4" />
                Add Event
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-3xl font-bold">42</div>
                  <div className="flex items-center text-secondary text-sm">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 4V12M8 4L5 7M8 4L11 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="ml-1">+8</span>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">vs previous year</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Attendees</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-3xl font-bold">8,942</div>
                  <div className="flex items-center text-secondary text-sm">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 4V12M8 4L5 7M8 4L11 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="ml-1">+24%</span>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">vs previous year</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Satisfaction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-3xl font-bold">91%</div>
                  <div className="flex items-center text-secondary text-sm">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 4V12M8 4L5 7M8 4L11 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="ml-1">+3%</span>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">vs previous year</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Impact Analysis</CardTitle>
                  <CardDescription>Event performance over time</CardDescription>
                </div>
                <Select defaultValue="attendance">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select metric" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="attendance">Attendance</SelectItem>
                    <SelectItem value="satisfaction">Satisfaction</SelectItem>
                    <SelectItem value="leads">New Leads</SelectItem>
                    <SelectItem value="roi">ROI</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="chart" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="chart">Chart</TabsTrigger>
                  <TabsTrigger value="map">Geographic</TabsTrigger>
                  <TabsTrigger value="table">Table</TabsTrigger>
                </TabsList>
                
                <TabsContent value="chart">
                  <div className="h-80 flex items-center justify-center border rounded-md bg-muted/50">
                    <div className="w-full p-6 relative">
                      {/* Chart visualization */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <BarChart2 className="w-24 h-24 text-primary opacity-10" />
                      </div>
                      
                      <div className="absolute bottom-6 left-16 right-6 top-6">
                        {/* Mock bar chart */}
                        <div className="flex h-full items-end justify-between">
                          <div className="flex flex-col items-center">
                            <div className="bg-primary w-12 rounded-t-sm" style={{ height: '40%' }}></div>
                            <span className="text-xs mt-1">Q1</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="bg-primary w-12 rounded-t-sm" style={{ height: '60%' }}></div>
                            <span className="text-xs mt-1">Q2</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="bg-primary w-12 rounded-t-sm" style={{ height: '75%' }}></div>
                            <span className="text-xs mt-1">Q3</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="bg-primary w-12 rounded-t-sm" style={{ height: '90%' }}></div>
                            <span className="text-xs mt-1">Q4</span>
                          </div>
                        </div>
                        
                        {/* Y axis */}
                        <div className="absolute left-[-30px] top-0 bottom-0 flex flex-col justify-between text-xs text-muted-foreground">
                          <span>3000</span>
                          <span>2250</span>
                          <span>1500</span>
                          <span>750</span>
                          <span>0</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="map">
                  <div className="h-80 border rounded-md bg-muted/50 p-4">
                    <div className="flex h-full flex-col">
                      <div className="text-xs text-muted-foreground mb-2">Event attendance by region</div>
                      <div className="flex-1 relative">
                        {/* World map placeholder */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <MapPin className="w-16 h-16 text-primary opacity-10" />
                        </div>
                        
                        {/* Region markers */}
                        <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
                          <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-xs font-bold">
                            NA
                          </div>
                          <div className="absolute top-0 left-0 animate-ping bg-blue-500 rounded-full w-10 h-10 opacity-75"></div>
                          <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs font-medium">3,412</div>
                        </div>
                        
                        <div className="absolute top-1/4 right-1/3 transform -translate-x-1/2 -translate-y-1/2">
                          <div className="bg-secondary text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold">
                            EU
                          </div>
                          <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs font-medium">2,845</div>
                        </div>
                        
                        <div className="absolute top-1/2 right-1/4 transform -translate-x-1/2 -translate-y-1/2">
                          <div className="bg-purple-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold">
                            AP
                          </div>
                          <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs font-medium">1,987</div>
                        </div>
                        
                        <div className="absolute bottom-1/4 left-1/3 transform -translate-x-1/2 -translate-y-1/2">
                          <div className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                            LA
                          </div>
                          <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs font-medium">698</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="table">
                  <div className="border rounded-md overflow-auto h-80">
                    <table className="min-w-full divide-y divide-border">
                      <thead className="bg-muted/50">
                        <tr>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Event Name</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Location</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Attendees</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Satisfaction</th>
                        </tr>
                      </thead>
                      <tbody className="bg-background divide-y divide-border">
                        <tr>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">DevCon 2023</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">Jun 12-14, 2023</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">Conference</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">San Francisco, CA</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">876</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">92%</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">API Workshop</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">May 28, 2023</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">Workshop</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">Virtual</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">214</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">88%</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">Spring Hackathon</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">Apr 15-16, 2023</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">Hackathon</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">London, UK</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">149</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">95%</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">Developer Meetup</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">Mar 22, 2023</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">Meetup</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">Berlin, Germany</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">86</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">90%</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">Mobile Dev Summit</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">Feb 8-9, 2023</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">Conference</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">Tokyo, Japan</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">543</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">89%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Event Type Breakdown</CardTitle>
                <CardDescription>Distribution by event format</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-64">
                  <div className="relative w-48 h-48">
                    {/* Pie chart visualization */}
                    <PieChart className="w-48 h-48 text-primary opacity-10 absolute top-0 left-0" />
                    
                    <div className="absolute inset-0 rounded-full border-[25px] border-blue-500 border-r-transparent border-b-transparent border-l-transparent rotate-0"></div>
                    <div className="absolute inset-0 rounded-full border-[25px] border-secondary border-t-transparent border-b-transparent border-l-transparent rotate-0"></div>
                    <div className="absolute inset-0 rounded-full border-[25px] border-purple-500 border-t-transparent border-r-transparent border-l-transparent rotate-0"></div>
                    <div className="absolute inset-0 rounded-full border-[25px] border-yellow-500 border-t-transparent border-r-transparent border-b-transparent rotate-0"></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
                    <span>Conferences (35%)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-secondary mr-1"></div>
                    <span>Workshops (25%)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-purple-500 mr-1"></div>
                    <span>Hackathons (20%)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
                    <span>Meetups/Webinars (20%)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Impact Metrics</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">New Leads Generated</span>
                      <span className="text-sm font-medium">1,245</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                      <span>Target: 1,600</span>
                      <span>78%</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Product Adoption</span>
                      <span className="text-sm font-medium">34%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-secondary h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                      <span>Target: 40%</span>
                      <span>85%</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Content Engagement</span>
                      <span className="text-sm font-medium">72%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '90%' }}></div>
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                      <span>Target: 80%</span>
                      <span>90%</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Average ROI</span>
                      <span className="text-sm font-medium">327%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '95%' }}></div>
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                      <span>Target: 300%</span>
                      <span>109%</span>
                    </div>
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
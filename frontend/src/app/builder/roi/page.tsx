'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, DollarSign, BarChart, TrendingUp, Calculator, Settings, Download, Info, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

export default function ROIBuilder() {
  const [selectedTab, setSelectedTab] = useState('inputs');
  const [timeframe, setTimeframe] = useState('1year');
  const [discountRate, setDiscountRate] = useState(10);

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/builder">
            <Button variant="ghost" size="sm" className="mb-2">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Builders
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Program ROI Builder</h1>
          <p className="text-muted-foreground mt-1">
            Build a visualization that demonstrates the return on investment of your DevRel initiatives.
          </p>
        </div>
        <Badge variant="outline" className="text-sm bg-yellow-50 text-yellow-800 border-yellow-300">
          Beta
        </Badge>
      </div>
      
      <div className="grid grid-cols-12 gap-6">
        {/* Left sidebar - Controls */}
        <div className="col-span-12 md:col-span-4">
          <Card>
            <CardHeader>
              <CardTitle>ROI Calculator</CardTitle>
              <CardDescription>Define your investment parameters</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="inputs">Inputs</TabsTrigger>
                  <TabsTrigger value="costs">Costs</TabsTrigger>
                  <TabsTrigger value="benefits">Benefits</TabsTrigger>
                </TabsList>
                
                <TabsContent value="inputs" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="project-name">DevRel Initiative Name</Label>
                    <Input id="project-name" placeholder="e.g., Developer Conference Series" defaultValue="Developer Advocacy Program" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="timeframe">ROI Timeframe</Label>
                    <Select value={timeframe} onValueChange={setTimeframe}>
                      <SelectTrigger id="timeframe">
                        <SelectValue placeholder="Select timeframe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3months">3 Months</SelectItem>
                        <SelectItem value="6months">6 Months</SelectItem>
                        <SelectItem value="1year">1 Year</SelectItem>
                        <SelectItem value="2years">2 Years</SelectItem>
                        <SelectItem value="3years">3 Years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select defaultValue="usd">
                      <SelectTrigger id="currency">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="usd">USD ($)</SelectItem>
                        <SelectItem value="eur">EUR (€)</SelectItem>
                        <SelectItem value="gbp">GBP (£)</SelectItem>
                        <SelectItem value="jpy">JPY (¥)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="discount-rate">Discount Rate ({discountRate}%)</Label>
                    <div className="flex items-center gap-4">
                      <Input 
                        id="discount-rate-range" 
                        type="range" 
                        min="0" 
                        max="20" 
                        step="0.5" 
                        value={discountRate}
                        onChange={(e) => setDiscountRate(Number(e.target.value))}
                        className="flex-1"
                      />
                      <Input 
                        id="discount-rate" 
                        className="w-16" 
                        value={discountRate}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          if (!isNaN(value) && value >= 0 && value <= 20) {
                            setDiscountRate(value);
                          }
                        }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Used to calculate Net Present Value (NPV)</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="costs" className="space-y-4 mt-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-md font-medium">Program Costs</h3>
                      <Button variant="ghost" size="sm" className="h-8 gap-1">
                        <Plus className="h-4 w-4" /> Add Cost
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="border p-3 rounded-md">
                        <div className="flex items-center justify-between mb-2">
                          <Label>Personnel</Label>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-12 gap-2">
                          <div className="col-span-8">
                            <Input defaultValue="Developer Advocates (3 FTEs)" />
                          </div>
                          <div className="col-span-4">
                            <Input defaultValue="360000" className="font-mono" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="border p-3 rounded-md">
                        <div className="flex items-center justify-between mb-2">
                          <Label>Events</Label>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-12 gap-2">
                          <div className="col-span-8">
                            <Input defaultValue="Conference Sponsorships" />
                          </div>
                          <div className="col-span-4">
                            <Input defaultValue="120000" className="font-mono" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="border p-3 rounded-md">
                        <div className="flex items-center justify-between mb-2">
                          <Label>Content</Label>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-12 gap-2">
                          <div className="col-span-8">
                            <Input defaultValue="Documentation & Content Creation" />
                          </div>
                          <div className="col-span-4">
                            <Input defaultValue="80000" className="font-mono" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="border p-3 rounded-md">
                        <div className="flex items-center justify-between mb-2">
                          <Label>Tools</Label>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-12 gap-2">
                          <div className="col-span-8">
                            <Input defaultValue="Community & Analytics Tools" />
                          </div>
                          <div className="col-span-4">
                            <Input defaultValue="40000" className="font-mono" />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between pt-2 border-t">
                      <div className="font-medium">Total Costs</div>
                      <div className="font-bold">$600,000</div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="benefits" className="space-y-4 mt-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-md font-medium">Program Benefits</h3>
                      <Button variant="ghost" size="sm" className="h-8 gap-1">
                        <Plus className="h-4 w-4" /> Add Benefit
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="border p-3 rounded-md">
                        <div className="flex items-center justify-between mb-2">
                          <Label>Direct Revenue</Label>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-12 gap-2">
                          <div className="col-span-8">
                            <Input defaultValue="New Customer Acquisition" />
                          </div>
                          <div className="col-span-4">
                            <Input defaultValue="450000" className="font-mono" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="border p-3 rounded-md">
                        <div className="flex items-center justify-between mb-2">
                          <Label>Customer Success</Label>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-12 gap-2">
                          <div className="col-span-8">
                            <Input defaultValue="Reduced Support Costs" />
                          </div>
                          <div className="col-span-4">
                            <Input defaultValue="120000" className="font-mono" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="border p-3 rounded-md">
                        <div className="flex items-center justify-between mb-2">
                          <Label>Product</Label>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-12 gap-2">
                          <div className="col-span-8">
                            <Input defaultValue="Community Contributions" />
                          </div>
                          <div className="col-span-4">
                            <Input defaultValue="200000" className="font-mono" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="border p-3 rounded-md">
                        <div className="flex items-center justify-between mb-2">
                          <Label>Retention</Label>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-12 gap-2">
                          <div className="col-span-8">
                            <Input defaultValue="Increased Customer Loyalty" />
                          </div>
                          <div className="col-span-4">
                            <Input defaultValue="350000" className="font-mono" />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between pt-2 border-t">
                      <div className="font-medium">Total Benefits</div>
                      <div className="font-bold">$1,120,000</div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <Button variant="outline">Reset</Button>
              <Button>Calculate ROI</Button>
            </CardFooter>
          </Card>
        </div>

        {/* Main content - Visualization */}
        <div className="col-span-12 md:col-span-8 space-y-6">
          <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>ROI Analysis</CardTitle>
                <CardDescription>Developer Advocacy Program (1 Year)</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="gap-1">
                  <Download className="h-4 w-4" /> Export
                </Button>
                <Button variant="ghost" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="mb-2">
                        <div className="rounded-full bg-secondary/10 p-3">
                          <Calculator className="h-6 w-6 text-secondary" />
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground mb-1">ROI</div>
                      <div className="text-3xl font-bold text-secondary">86.7%</div>
                      <div className="text-xs text-muted-foreground mt-1">Net Benefit: $520,000</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="mb-2">
                        <div className="rounded-full bg-blue-100 p-3">
                          <DollarSign className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground mb-1">NPV</div>
                      <div className="text-3xl font-bold text-blue-600">$472,727</div>
                      <div className="text-xs text-muted-foreground mt-1">Discount Rate: 10%</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="mb-2">
                        <div className="rounded-full bg-purple-100 p-3">
                          <TrendingUp className="h-6 w-6 text-purple-600" />
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground mb-1">Payback Period</div>
                      <div className="text-3xl font-bold text-purple-600">6.4 mo</div>
                      <div className="text-xs text-muted-foreground mt-1">Break-even point</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="h-80 border rounded-md bg-muted/50 p-6 mb-4">
                <div className="flex flex-col h-full">
                  <div className="flex justify-between mb-2">
                    <h3 className="font-medium text-sm">Cumulative Cash Flow</h3>
                    <div className="flex items-center text-sm space-x-4">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-destructive mr-2"></div>
                        <span>Costs</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-secondary mr-2"></div>
                        <span>Benefits</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                        <span>Net</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 relative">
                    <div className="absolute inset-0">
                      {/* Bar chart visualization */}
                      <BarChart className="w-20 h-20 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />

                      {/* X-axis */}
                      <div className="absolute bottom-0 left-10 right-0 h-[1px] bg-muted"></div>
                      <div className="absolute bottom-[-20px] left-10 right-0 flex justify-between text-xs text-muted-foreground">
                        <span>Q1</span>
                        <span>Q2</span>
                        <span>Q3</span>
                        <span>Q4</span>
                      </div>
                      
                      {/* Y-axis */}
                      <div className="absolute top-0 bottom-0 left-10 w-[1px] bg-muted"></div>
                      <div className="absolute top-0 bottom-0 left-0 flex flex-col justify-between text-xs text-muted-foreground">
                        <span>$1.2M</span>
                        <span>$800K</span>
                        <span>$400K</span>
                        <span>$0</span>
                        <span>-$400K</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium text-sm mb-3">Cost Breakdown</h3>
                  <div className="h-44 flex items-center justify-center">
                    <div className="relative w-32 h-32">
                      <div className="absolute inset-0 rounded-full border-8 border-blue-500 border-r-transparent border-b-transparent rotate-45"></div>
                      <div className="absolute inset-0 rounded-full border-8 border-secondary border-l-transparent border-b-transparent rotate-[135deg]"></div>
                      <div className="absolute inset-0 rounded-full border-8 border-yellow-500 border-l-transparent border-t-transparent rotate-[225deg]"></div>
                      <div className="absolute inset-0 rounded-full border-8 border-destructive border-r-transparent border-t-transparent rotate-[315deg]"></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mr-1"></div>
                      <span>Personnel (60%)</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-secondary mr-1"></div>
                      <span>Events (20%)</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></div>
                      <span>Content (13%)</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-destructive mr-1"></div>
                      <span>Tools (7%)</span>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <h3 className="font-medium text-sm mb-3">Benefit Breakdown</h3>
                  <div className="h-44 flex items-center justify-center">
                    <div className="relative w-32 h-32">
                      <div className="absolute inset-0 rounded-full border-8 border-purple-500 border-r-transparent border-b-transparent rotate-45"></div>
                      <div className="absolute inset-0 rounded-full border-8 border-indigo-500 border-l-transparent border-b-transparent rotate-[135deg]"></div>
                      <div className="absolute inset-0 rounded-full border-8 border-pink-500 border-l-transparent border-t-transparent rotate-[225deg]"></div>
                      <div className="absolute inset-0 rounded-full border-8 border-orange-500 border-r-transparent border-t-transparent rotate-[315deg]"></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-purple-500 mr-1"></div>
                      <span>New Customers (40%)</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-indigo-500 mr-1"></div>
                      <span>Reduced Support (11%)</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-pink-500 mr-1"></div>
                      <span>Contributions (18%)</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-orange-500 mr-1"></div>
                      <span>Retention (31%)</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>ROI Sensitivity Analysis</CardTitle>
                <CardDescription>Impact of varying input parameters</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center border rounded-md bg-muted/50">
                  <div className="w-full p-4 relative">
                    <TrendingUp className="w-16 h-16 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-muted"></div>
                    <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-muted"></div>
                  </div>
                </div>
                <div className="mt-4 text-sm">
                  <p className="text-muted-foreground">This sensitivity analysis shows how changes in key parameters affect the overall ROI. The steeper the line, the more sensitive the ROI is to that factor.</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">Customer Acquisition +/-20%</Badge>
                    <Badge variant="outline" className="bg-secondary/10 text-secondary">Personnel Costs +/-15%</Badge>
                    <Badge variant="outline" className="bg-purple-50 text-purple-700">Event Costs +/-30%</Badge>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Discount Rate +/-5%</Badge>
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
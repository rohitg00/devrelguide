'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Network, MessageSquare, Search, Download, Settings, RefreshCw, Users, Github, Twitter, Globe, MessageCircle, Share2 } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export default function CommunityEngagementBuilder() {
  const [timeRange, setTimeRange] = useState('90days');
  const [viewMode, setViewMode] = useState('overview');
  const [engagementThreshold, setEngagementThreshold] = useState(30);
  const [platforms, setPlatforms] = useState({
    github: true,
    discourse: true,
    slack: true,
    twitter: true,
    stackoverflow: true
  });
  const [activityTypes, setActivityTypes] = useState({
    questions: true,
    discussions: true,
    contributions: true,
    mentions: true
  });

  const handlePlatformChange = (platform) => {
    setPlatforms({
      ...platforms,
      [platform]: !platforms[platform]
    });
  };

  const handleActivityTypeChange = (type) => {
    setActivityTypes({
      ...activityTypes,
      [type]: !activityTypes[type]
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
          <h1 className="text-3xl font-bold">Community Engagement Builder</h1>
          <p className="text-gray-600 mt-1">
            Track and visualize community engagement patterns across various platforms and activities.
          </p>
        </div>
        <Badge variant="outline" className="text-sm bg-yellow-50 text-yellow-800 border-yellow-300">
          Beta
        </Badge>
      </div>
      
      <div className="grid grid-cols-12 gap-6">
        {/* Left sidebar */}
        <div className="col-span-12 md:col-span-3 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Engagement Settings</CardTitle>
              <CardDescription>Configure your community view</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Time Range</Label>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7days">Last 7 Days</SelectItem>
                    <SelectItem value="30days">Last 30 Days</SelectItem>
                    <SelectItem value="90days">Last 90 Days</SelectItem>
                    <SelectItem value="6months">Last 6 Months</SelectItem>
                    <SelectItem value="12months">Last 12 Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>View Mode</Label>
                <Select value={viewMode} onValueChange={setViewMode}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select view" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="overview">Overview</SelectItem>
                    <SelectItem value="network">Network Graph</SelectItem>
                    <SelectItem value="timeline">Timeline</SelectItem>
                    <SelectItem value="heatmap">Activity Heatmap</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-2 space-y-2">
                <Label>Platforms</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="platform-github" 
                      checked={platforms.github}
                      onChange={() => handlePlatformChange('github')}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <Label htmlFor="platform-github" className="flex items-center">
                      <Github className="h-4 w-4 mr-2" />
                      GitHub
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="platform-discourse" 
                      checked={platforms.discourse}
                      onChange={() => handlePlatformChange('discourse')}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <Label htmlFor="platform-discourse" className="flex items-center">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Discourse
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="platform-slack" 
                      checked={platforms.slack}
                      onChange={() => handlePlatformChange('slack')}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <Label htmlFor="platform-slack" className="flex items-center">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Slack
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="platform-twitter" 
                      checked={platforms.twitter}
                      onChange={() => handlePlatformChange('twitter')}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <Label htmlFor="platform-twitter" className="flex items-center">
                      <Twitter className="h-4 w-4 mr-2" />
                      Twitter
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="platform-stackoverflow" 
                      checked={platforms.stackoverflow}
                      onChange={() => handlePlatformChange('stackoverflow')}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <Label htmlFor="platform-stackoverflow" className="flex items-center">
                      <Globe className="h-4 w-4 mr-2" />
                      Stack Overflow
                    </Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <Label>Activity Types</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="type-questions" 
                      checked={activityTypes.questions}
                      onChange={() => handleActivityTypeChange('questions')}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <Label htmlFor="type-questions">Questions</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="type-discussions" 
                      checked={activityTypes.discussions}
                      onChange={() => handleActivityTypeChange('discussions')}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <Label htmlFor="type-discussions">Discussions</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="type-contributions" 
                      checked={activityTypes.contributions}
                      onChange={() => handleActivityTypeChange('contributions')}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <Label htmlFor="type-contributions">Contributions</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="type-mentions" 
                      checked={activityTypes.mentions}
                      onChange={() => handleActivityTypeChange('mentions')}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <Label htmlFor="type-mentions">Mentions</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="engagement-threshold">Engagement Threshold ({engagementThreshold}%)</Label>
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
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Low</span>
                  <span>High</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <Button variant="outline" size="sm">Reset</Button>
              <Button size="sm">Apply Filters</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Community Search</CardTitle>
              <CardDescription>Find specific community members</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input placeholder="Search users or topics" className="pl-8" />
              </div>
              <div className="mt-4 space-y-2">
                <div className="text-sm font-medium">Top Influencers</div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-xs text-blue-700 font-bold mr-2">J</div>
                      <span className="text-sm">janedev</span>
                    </div>
                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">92</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center text-xs text-purple-700 font-bold mr-2">D</div>
                      <span className="text-sm">devsmith</span>
                    </div>
                    <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">78</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center text-xs text-green-700 font-bold mr-2">T</div>
                      <span className="text-sm">techguru</span>
                    </div>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">65</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main content area */}
        <div className="col-span-12 md:col-span-9 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-medium">Community Engagement Analysis</h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1">
                <RefreshCw className="h-4 w-4" /> Refresh
              </Button>
              <Button variant="outline" size="sm" className="gap-1">
                <Download className="h-4 w-4" /> Export
              </Button>
              <Button variant="outline" size="sm" className="gap-1">
                <Settings className="h-4 w-4" /> Settings
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Community Network</CardTitle>
              <CardDescription>Visualization of relationships and interactions</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="graph" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="graph">Network Graph</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                  <TabsTrigger value="platforms">Platforms</TabsTrigger>
                  <TabsTrigger value="members">Members</TabsTrigger>
                </TabsList>
                <TabsContent value="graph">
                  <div className="h-96 border rounded-md bg-gray-50 flex items-center justify-center">
                    <div className="relative w-full h-full">
                      {/* Network graph visualization */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Network className="w-24 h-24 text-primary opacity-20" />
                      </div>
                      
                      {/* Central node */}
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-primary/10 border-4 border-primary flex items-center justify-center">
                        <Users className="h-8 w-8 text-primary" />
                      </div>
                      
                      {/* GitHub node */}
                      <div className="absolute top-1/4 left-1/4 w-12 h-12 rounded-full bg-gray-100 border-2 border-gray-300 flex items-center justify-center">
                        <Github className="h-6 w-6 text-gray-700" />
                      </div>
                      <div className="absolute top-[28%] left-[32%] w-24 h-[2px] bg-gray-300 rotate-45"></div>
                      
                      {/* Discourse node */}
                      <div className="absolute top-1/4 right-1/4 w-12 h-12 rounded-full bg-blue-100 border-2 border-blue-300 flex items-center justify-center">
                        <MessageCircle className="h-6 w-6 text-blue-700" />
                      </div>
                      <div className="absolute top-[28%] right-[32%] w-24 h-[2px] bg-blue-300 -rotate-45"></div>
                      
                      {/* Slack node */}
                      <div className="absolute bottom-1/4 left-1/4 w-12 h-12 rounded-full bg-green-100 border-2 border-green-300 flex items-center justify-center">
                        <MessageSquare className="h-6 w-6 text-green-700" />
                      </div>
                      <div className="absolute bottom-[28%] left-[32%] w-24 h-[2px] bg-green-300 -rotate-45"></div>
                      
                      {/* Twitter node */}
                      <div className="absolute bottom-1/4 right-1/4 w-12 h-12 rounded-full bg-purple-100 border-2 border-purple-300 flex items-center justify-center">
                        <Twitter className="h-6 w-6 text-purple-700" />
                      </div>
                      <div className="absolute bottom-[28%] right-[32%] w-24 h-[2px] bg-purple-300 rotate-45"></div>
                      
                      {/* Small nodes */}
                      {Array(12).fill(0).map((_, i) => (
                        <div key={i} 
                             className={`absolute w-4 h-4 rounded-full bg-gray-${200 + (i % 3) * 100} border border-gray-400`}
                             style={{
                               top: `${Math.random() * 80 + 10}%`,
                               left: `${Math.random() * 80 + 10}%`,
                               transform: 'translate(-50%, -50%)'
                             }}></div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="activity">
                  <div className="h-96 border rounded-md overflow-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b bg-gray-50">
                          <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Activity</th>
                          <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Platform</th>
                          <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">User</th>
                          <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Date</th>
                          <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Engagement</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-2 px-4">Issue Comment</td>
                          <td className="py-2 px-4 flex items-center">
                            <Github className="h-4 w-4 mr-1" /> GitHub
                          </td>
                          <td className="py-2 px-4">janedev</td>
                          <td className="py-2 px-4">Yesterday</td>
                          <td className="py-2 px-4">
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100">High</Badge>
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 px-4">Forum Post</td>
                          <td className="py-2 px-4 flex items-center">
                            <MessageCircle className="h-4 w-4 mr-1" /> Discourse
                          </td>
                          <td className="py-2 px-4">techguru</td>
                          <td className="py-2 px-4">2 days ago</td>
                          <td className="py-2 px-4">
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100">High</Badge>
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 px-4">Channel Discussion</td>
                          <td className="py-2 px-4 flex items-center">
                            <MessageSquare className="h-4 w-4 mr-1" /> Slack
                          </td>
                          <td className="py-2 px-4">devsmith</td>
                          <td className="py-2 px-4">3 days ago</td>
                          <td className="py-2 px-4">
                            <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Medium</Badge>
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 px-4">Tweet Mention</td>
                          <td className="py-2 px-4 flex items-center">
                            <Twitter className="h-4 w-4 mr-1" /> Twitter
                          </td>
                          <td className="py-2 px-4">codemaster</td>
                          <td className="py-2 px-4">5 days ago</td>
                          <td className="py-2 px-4">
                            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Low</Badge>
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2 px-4">Pull Request</td>
                          <td className="py-2 px-4 flex items-center">
                            <Github className="h-4 w-4 mr-1" /> GitHub
                          </td>
                          <td className="py-2 px-4">openhacker</td>
                          <td className="py-2 px-4">1 week ago</td>
                          <td className="py-2 px-4">
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100">High</Badge>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
                <TabsContent value="platforms">
                  <div className="h-96 border rounded-md p-4 overflow-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <div className="flex items-center">
                            <Github className="h-5 w-5 mr-2" />
                            <CardTitle className="text-base">GitHub</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Issues</span>
                              <span className="font-medium">42</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Pull Requests</span>
                              <span className="font-medium">23</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Stars</span>
                              <span className="font-medium">347</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Forks</span>
                              <span className="font-medium">98</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <div className="flex items-center">
                            <MessageCircle className="h-5 w-5 mr-2" />
                            <CardTitle className="text-base">Discourse</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Topics</span>
                              <span className="font-medium">124</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Posts</span>
                              <span className="font-medium">789</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Users</span>
                              <span className="font-medium">456</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Categories</span>
                              <span className="font-medium">12</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <div className="flex items-center">
                            <MessageSquare className="h-5 w-5 mr-2" />
                            <CardTitle className="text-base">Slack</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Members</span>
                              <span className="font-medium">1,256</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Active Users</span>
                              <span className="font-medium">642</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Messages (90d)</span>
                              <span className="font-medium">9,734</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Channels</span>
                              <span className="font-medium">24</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <div className="flex items-center">
                            <Twitter className="h-5 w-5 mr-2" />
                            <CardTitle className="text-base">Twitter</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Followers</span>
                              <span className="font-medium">12.4K</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Mentions</span>
                              <span className="font-medium">427</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Impressions</span>
                              <span className="font-medium">256.8K</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Engagement Rate</span>
                              <span className="font-medium">2.7%</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="members">
                  <div className="h-96 border rounded-md overflow-auto">
                    <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="border rounded-md p-3 hover:bg-gray-50">
                        <div className="flex items-center mb-2">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-sm text-blue-700 font-bold mr-2">J</div>
                          <div>
                            <div className="font-medium">janedev</div>
                            <div className="text-xs text-gray-500">Active Contributor</div>
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 space-x-2">
                          <span className="flex items-center"><Github className="h-3 w-3 mr-1" />24</span>
                          <span className="flex items-center"><MessageCircle className="h-3 w-3 mr-1" />36</span>
                          <span className="flex items-center"><MessageSquare className="h-3 w-3 mr-1" />19</span>
                        </div>
                      </div>
                      
                      <div className="border rounded-md p-3 hover:bg-gray-50">
                        <div className="flex items-center mb-2">
                          <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-sm text-purple-700 font-bold mr-2">D</div>
                          <div>
                            <div className="font-medium">devsmith</div>
                            <div className="text-xs text-gray-500">Community Leader</div>
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 space-x-2">
                          <span className="flex items-center"><Github className="h-3 w-3 mr-1" />18</span>
                          <span className="flex items-center"><MessageCircle className="h-3 w-3 mr-1" />42</span>
                          <span className="flex items-center"><MessageSquare className="h-3 w-3 mr-1" />31</span>
                        </div>
                      </div>
                      
                      <div className="border rounded-md p-3 hover:bg-gray-50">
                        <div className="flex items-center mb-2">
                          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-sm text-green-700 font-bold mr-2">T</div>
                          <div>
                            <div className="font-medium">techguru</div>
                            <div className="text-xs text-gray-500">Moderator</div>
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 space-x-2">
                          <span className="flex items-center"><Github className="h-3 w-3 mr-1" />12</span>
                          <span className="flex items-center"><MessageCircle className="h-3 w-3 mr-1" />54</span>
                          <span className="flex items-center"><Twitter className="h-3 w-3 mr-1" />28</span>
                        </div>
                      </div>
                      
                      <div className="border rounded-md p-3 hover:bg-gray-50">
                        <div className="flex items-center mb-2">
                          <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center text-sm text-red-700 font-bold mr-2">C</div>
                          <div>
                            <div className="font-medium">codemaster</div>
                            <div className="text-xs text-gray-500">Regular User</div>
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 space-x-2">
                          <span className="flex items-center"><Github className="h-3 w-3 mr-1" />8</span>
                          <span className="flex items-center"><Twitter className="h-3 w-3 mr-1" />45</span>
                          <span className="flex items-center"><MessageSquare className="h-3 w-3 mr-1" />12</span>
                        </div>
                      </div>
                      
                      <div className="border rounded-md p-3 hover:bg-gray-50">
                        <div className="flex items-center mb-2">
                          <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center text-sm text-yellow-700 font-bold mr-2">O</div>
                          <div>
                            <div className="font-medium">openhacker</div>
                            <div className="text-xs text-gray-500">Core Contributor</div>
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 space-x-2">
                          <span className="flex items-center"><Github className="h-3 w-3 mr-1" />32</span>
                          <span className="flex items-center"><MessageCircle className="h-3 w-3 mr-1" />16</span>
                          <span className="flex items-center"><MessageSquare className="h-3 w-3 mr-1" />7</span>
                        </div>
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
                <CardTitle className="text-lg">Total Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center py-4">
                  <div className="text-4xl font-bold text-primary mb-1">12,456</div>
                  <p className="text-sm text-gray-500">Total interactions</p>
                  <div className="flex items-center mt-2 text-green-600 text-sm">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 4V12M8 4L5 7M8 4L11 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="ml-1">24% vs previous period</span>
                  </div>
                </div>
                <div className="h-1 w-full bg-gray-200 mt-2">
                  <div className="h-1 bg-primary" style={{ width: '68%' }}></div>
                </div>
                <div className="flex justify-between mt-1 text-xs text-gray-500">
                  <span>Target: 18,000</span>
                  <span>68%</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Active Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center py-4">
                  <div className="text-4xl font-bold text-primary mb-1">3,245</div>
                  <p className="text-sm text-gray-500">Unique contributors</p>
                  <div className="flex items-center mt-2 text-green-600 text-sm">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 4V12M8 4L5 7M8 4L11 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="ml-1">12% vs previous period</span>
                  </div>
                </div>
                <div className="h-1 w-full bg-gray-200 mt-2">
                  <div className="h-1 bg-primary" style={{ width: '54%' }}></div>
                </div>
                <div className="flex justify-between mt-1 text-xs text-gray-500">
                  <span>Target: 6,000</span>
                  <span>54%</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Avg. Response Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center py-4">
                  <div className="text-4xl font-bold text-primary mb-1">4.2h</div>
                  <p className="text-sm text-gray-500">Across all platforms</p>
                  <div className="flex items-center mt-2 text-green-600 text-sm">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 4V12M8 4L5 7M8 4L11 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="ml-1">18% vs previous period</span>
                  </div>
                </div>
                <div className="h-1 w-full bg-gray-200 mt-2">
                  <div className="h-1 bg-green-500" style={{ width: '82%' }}></div>
                </div>
                <div className="flex justify-between mt-1 text-xs text-gray-500">
                  <span>Target: 5.0h</span>
                  <span>82%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 
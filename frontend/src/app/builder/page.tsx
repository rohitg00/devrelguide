'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Network, BarChart, GitBranch, PieChart, Activity, TrendingUp, Users, Zap, MessageSquare, LineChart, Share2, Target, PanelTop } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function BuilderHome() {
  const builders = [
    {
      title: 'DevRel Ecosystem',
      description: 'Build a visual representation of your DevRel ecosystem showing the relationships between different entities in your developer community.',
      icon: <Network className="w-10 h-10 text-primary" />,
      link: '/builder/ecosystem'
    },
    {
      title: 'Community Graph',
      description: 'Create a network graph showing the connections between different communities, partners, and developers in your ecosystem.',
      icon: <GitBranch className="w-10 h-10 text-primary" />,
      link: '/builder/community'
    },
    {
      title: 'Developer Journey',
      description: 'Map out the stages of your developer journey with metrics for engagement, conversion, and satisfaction at each step.',
      icon: <BarChart className="w-10 h-10 text-primary" />,
      link: '/builder/journey'
    },
    {
      title: 'Content Impact',
      description: 'Visualize the performance and impact of your content across different channels and audience segments.',
      icon: <PieChart className="w-10 h-10 text-primary" />,
      link: '/builder/content-impact'
    },
    {
      title: 'Metrics Dashboard',
      description: 'Create a customizable dashboard with your most important DevRel KPIs and metrics.',
      icon: <Activity className="w-10 h-10 text-primary" />,
      link: '/builder/metrics'
    },
    {
      title: 'Program ROI',
      description: 'Build a visualization that demonstrates the return on investment of your DevRel initiatives.',
      icon: <TrendingUp className="w-10 h-10 text-primary" />,
      link: '/builder/roi'
    },
    {
      title: 'Community Engagement',
      description: 'Track and visualize community engagement patterns across various platforms and activities.',
      icon: <Users className="w-10 h-10 text-primary" />,
      link: '/builder/engagement'
    },
    {
      title: 'Event Impact',
      description: 'Measure and display the impact of your developer events, workshops, and conferences.',
      icon: <Zap className="w-10 h-10 text-primary" />,
      link: '/builder/events'
    }
  ];

  const comingSoonBuilders = [
    {
      title: 'Developer Feedback',
      description: 'Analyze and visualize feedback from your developer community to identify trends and areas for improvement.',
      icon: <MessageSquare className="w-10 h-10 text-gray-400" />
    },
    {
      title: 'Adoption Funnel',
      description: 'Track how developers move through your product adoption funnel from awareness to advocacy.',
      icon: <LineChart className="w-10 h-10 text-gray-400" />
    },
    {
      title: 'Ecosystem Health',
      description: 'Monitor the overall health of your developer ecosystem with composite metrics.',
      icon: <Share2 className="w-10 h-10 text-gray-400" />
    },
    {
      title: 'Strategic Alignment',
      description: 'Visualize how your DevRel initiatives align with overall business objectives and strategy.',
      icon: <Target className="w-10 h-10 text-gray-400" />
    },
    {
      title: 'Resource Allocation',
      description: 'Analyze and optimize how your DevRel resources are allocated across different initiatives.',
      icon: <PanelTop className="w-10 h-10 text-gray-400" />
    }
  ];

  return (
    <div className="container mx-auto py-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">DevRel Visualization Builder</h1>
          <p className="text-xl text-gray-600">
            Create customized visualizations to represent your developer relations program.
          </p>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
          {builders.map((builder, index) => (
            <Card key={index} className="flex flex-col">
              <CardHeader>
                <div className="mb-4">{builder.icon}</div>
                <CardTitle>{builder.title}</CardTitle>
                <CardDescription>{builder.description}</CardDescription>
              </CardHeader>
              <CardFooter className="mt-auto">
                <Link href={builder.link} className="w-full">
                  <Button className="w-full">
                    Open Builder <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        <h2 className="text-2xl font-bold mb-6 text-center">Coming Soon</h2>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {comingSoonBuilders.map((builder, index) => (
            <Card key={index} className="flex flex-col bg-muted/30">
              <CardHeader>
                <div className="flex justify-between items-center mb-4">
                  {builder.icon}
                  <Badge variant="outline" className="bg-gray-100">Coming Soon</Badge>
                </div>
                <CardTitle className="text-gray-600">{builder.title}</CardTitle>
                <CardDescription>{builder.description}</CardDescription>
              </CardHeader>
              <CardFooter className="mt-auto">
                <Button className="w-full" disabled>
                  Open Builder <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-500 mb-4">
            Looking for more customization options? Let us know what you need!
          </p>
          <p className="text-sm text-gray-400">
            All visualizations can be exported as images or embedded in your documentation.
          </p>
        </div>
      </div>
    </div>
  );
} 
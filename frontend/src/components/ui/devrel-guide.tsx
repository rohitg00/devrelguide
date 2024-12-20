'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs'
import { ScrollArea } from './scroll-area'
import { ChevronRight } from 'lucide-react'

const sections = [
  {
    id: 'introduction',
    title: '1. Introduction to Developer Relations (DevRel)',
    emoji: '🌟',
    content: {
      overview: 'Developer Relations (DevRel) bridges the gap between technology companies and developer communities, fostering meaningful connections and driving platform adoption through education, support, and advocacy.',
      details: [
        'Historical Evolution of DevRel',
        'Core Principles and Values',
        'Industry Best Practices',
        'Current Trends and Future Directions',
        'DevRel vs Traditional Marketing'
      ],
      keyPoints: [
        'Building trust through authentic engagement',
        'Creating value for the developer community',
        'Measuring success through developer satisfaction',
        'Balancing technical depth with accessibility',
        'Fostering open source collaboration'
      ]
    }
  },
  {
    id: 'role',
    title: '2. The Role of DevRel Professionals',
    emoji: '👥',
    content: {
      overview: 'DevRel professionals act as bridges between developers and companies, combining technical expertise with communication skills to drive platform adoption and community growth.',
      details: [
        'Developer Advocacy Programs',
        'Technical Content Strategy',
        'Community Leadership',
        'Product Development Cycle',
        'Cross-functional Collaboration'
      ],
      keyPoints: [
        'Championing developer experience',
        'Building developer empathy',
        'Driving technical innovation',
        'Creating educational resources',
        'Facilitating community discussions'
      ]
    }
  },
  {
    id: 'skills',
    title: '3. Skills and Qualities for Success',
    emoji: '💡',
    content: {
      overview: 'Success in DevRel requires a unique combination of technical expertise, communication abilities, and interpersonal skills, along with a deep understanding of both developer needs and business objectives.',
      details: [
        'Technical Architecture Design',
        'API Design Principles',
        'Content Strategy Development',
        'Community Growth Tactics',
        'Analytics and Metrics'
      ],
      keyPoints: [
        'Empathy and active listening',
        'Technical problem-solving',
        'Clear communication at all levels',
        'Project and time management',
        'Adaptability and continuous learning'
      ]
    }
  },
  {
    id: 'impact',
    title: '4. Impact on Business Growth',
    emoji: '📈',
    content: {
      overview: 'DevRel drives business growth by fostering a thriving developer ecosystem, accelerating platform adoption, and creating sustainable competitive advantages through community engagement.',
      details: [
        'Developer Journey Optimization',
        'Platform Growth Metrics',
        'Community Health Indicators',
        'ROI Measurement Models',
        'Long-term Value Creation'
      ],
      keyPoints: [
        'Reduced support costs through self-service',
        'Increased developer retention',
        'Accelerated feature adoption',
        'Enhanced product feedback loop',
        'Strengthened market positioning'
      ]
    }
  },
  {
    id: 'best-practices',
    title: '5. Best Practices and Strategies',
    emoji: '🎯',
    content: {
      overview: 'Successful DevRel programs follow established best practices while remaining flexible enough to adapt to changing developer needs and industry trends.',
      details: [
        'Documentation Excellence',
        'Community Engagement Models',
        'Content Distribution Channels',
        'Feedback Collection Systems',
        'Success Measurement Framework'
      ],
      keyPoints: [
        'Regular community check-ins',
        'Data-driven decision making',
        'Consistent content calendar',
        'Proactive issue resolution',
        'Scalable support systems'
      ]
    }
  }
]

export function DevRelGuide() {
  return (
    <div className="space-y-6 container mx-auto py-6">
      <Card className="border-none shadow-none bg-transparent">
        <CardHeader>
          <CardTitle className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Developer Relations Guide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-lg">
            A comprehensive guide to Developer Relations, exploring the essential aspects of building and maintaining successful developer programs.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        {sections.map((section) => (
          <Card key={section.id} className="overflow-hidden">
            <CardHeader className="border-b bg-muted/50">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <span>{section.emoji}</span>
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="w-full grid grid-cols-3 mb-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="details">Key Areas</TabsTrigger>
                  <TabsTrigger value="points">Action Items</TabsTrigger>
                </TabsList>
                <div className="min-h-[150px] max-h-[300px]">
                  <ScrollArea className="h-full rounded-md border p-4">
                    <TabsContent value="overview" className="mt-0 mb-0">
                      <p className="text-lg leading-relaxed">{section.content.overview}</p>
                    </TabsContent>
                    <TabsContent value="details" className="mt-0 mb-0">
                      <ul className="space-y-3">
                        {section.content.details.map((detail, index) => (
                          <li key={index} className="flex items-center gap-2 text-base">
                            <ChevronRight className="h-4 w-4 text-primary flex-shrink-0" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </TabsContent>
                    <TabsContent value="points" className="mt-0 mb-0">
                      <ul className="space-y-3">
                        {section.content.keyPoints.map((point, index) => (
                          <li key={index} className="flex items-center gap-2 text-base">
                            <ChevronRight className="h-4 w-4 text-primary flex-shrink-0" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </TabsContent>
                  </ScrollArea>
                </div>
              </Tabs>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

'use client'

import React, { Suspense, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { 
  CareerPath,
  CommunityGraph,
  SkillsMatrix,
  MetricsDashboard,
  HorizonChart,
  BubbleInsights,
  DeveloperProgressFlow,
  CareerPathway,
  MarketImpactFlow,
  DevRelEcosystem,
  SankeyDiagram,
  ViolinDistribution,
  DeveloperJourney,
  ImpactMetrics,
  BoxWhiskerSkills,
  HighlightTable,
  HeatMap,
  ParallelCoordinates,
  DeveloperJourneyFlow,
  DevRelFrameworkViz,
  MarketImpactAnalysis,
  BulletChart,
  CareerPathTimeline,
  EngagementMetrics,
  MetricsHighlightTable,
  CommunityForceGraph,
  DevRelSunburst,
  SkillDistributionBox,
  DevRelBulletChart,
  ResourceTreemap,
  DeveloperJourneySankey
} from '@/components/visualizations'
import { VisualizationContainer } from '@/components/visualizations/VisualizationContainer'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center aspect-[4/3] bg-muted/5 rounded-lg">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        <p className="text-sm text-muted-foreground">Loading visualization...</p>
      </div>
    </div>
  )
}

const visualizations = [
  {
    id: 'career-path',
    title: 'Career Path Analysis',
    component: CareerPath,
    description: 'Explore career progression paths in Developer Relations'
  },
  {
    id: 'community-network',
    title: 'Community Network',
    component: CommunityGraph,
    description: 'Analyze community connections and interactions'
  },
  {
    id: 'skills-matrix',
    title: 'Skills Distribution',
    component: SkillsMatrix,
    description: 'View the distribution of skills across different DevRel roles'
  },
  {
    id: 'metrics-dashboard',
    title: 'Performance Metrics',
    component: MetricsDashboard,
    description: 'Track key performance indicators and metrics'
  },
  {
    title: 'Engagement Trends',
    component: HorizonChart,
    description: 'Analyze engagement trends over time'
  },
  {
    title: 'Community Insights',
    component: BubbleInsights,
    description: 'Gain insights into community dynamics and interactions'
  },
  {
    title: 'Developer Journey',
    component: DeveloperProgressFlow,
    description: 'Explore the developer journey and progression paths'
  },
  {
    title: 'Career Progression',
    component: CareerPathway,
    description: 'Analyze career progression paths and trends'
  },
  {
    title: 'Market Impact',
    component: MarketImpactFlow,
    description: 'Assess market impact and trends'
  },
  {
    title: 'DevRel Ecosystem',
    component: DevRelEcosystem,
    description: 'Explore the DevRel ecosystem and its components'
  },
  {
    title: 'Developer Flow',
    component: SankeyDiagram,
    description: 'Analyze developer flow and progression paths'
  },
  {
    title: 'Skills Distribution',
    component: ViolinDistribution,
    description: 'View the distribution of skills across different DevRel roles'
  },
  {
    title: 'Developer Journey Map',
    component: DeveloperJourney,
    description: 'Explore the developer journey and progression paths'
  },
  {
    title: 'Impact Analysis',
    component: ImpactMetrics,
    description: 'Assess impact and trends'
  },
  {
    title: 'Skills Analysis',
    component: BoxWhiskerSkills,
    description: 'Analyze skills and trends'
  },
  {
    title: 'Key Metrics',
    component: HighlightTable,
    description: 'Track key performance indicators and metrics'
  },
  {
    title: 'Activity Heatmap',
    component: HeatMap,
    description: 'Analyze activity and engagement trends'
  },
  {
    title: 'Skills Correlation',
    component: ParallelCoordinates,
    description: 'Analyze skills correlation and trends'
  },
  {
    title: 'Developer Journey Flow',
    component: DeveloperJourneyFlow,
    description: 'Explore the developer journey and progression paths'
  },
  {
    title: 'DevRel Framework',
    component: DevRelFrameworkViz,
    description: 'Explore the DevRel framework and its components'
  },
  {
    title: 'Market Impact Analysis',
    component: MarketImpactAnalysis,
    description: 'Assess market impact and trends'
  },
  {
    title: 'Performance Metrics',
    component: BulletChart,
    description: 'Track key performance indicators and metrics'
  },
  {
    title: 'Career Timeline',
    component: CareerPathTimeline,
    description: 'Explore career progression paths and timelines'
  },
  {
    title: 'Engagement Analysis',
    component: EngagementMetrics,
    description: 'Analyze engagement trends and metrics'
  },
  {
    title: 'Metrics Overview',
    component: MetricsHighlightTable,
    description: 'Track key performance indicators and metrics'
  },
  {
    title: 'Community Network',
    component: CommunityForceGraph,
    description: 'Analyze community connections and interactions'
  },
  {
    title: 'DevRel Overview',
    component: DevRelSunburst,
    description: 'Explore the DevRel ecosystem and its components'
  },
  {
    title: 'Skills Distribution',
    component: SkillDistributionBox,
    description: 'View the distribution of skills across different DevRel roles'
  },
  {
    title: 'Performance Metrics',
    component: DevRelBulletChart,
    description: 'Track key performance indicators and metrics'
  },
  {
    title: 'Resource Overview',
    component: ResourceTreemap,
    description: 'Explore resource allocation and trends'
  },
  {
    title: 'Developer Journey',
    component: DeveloperJourneySankey,
    description: 'Explore the developer journey and progression paths'
  }
]

export default function VisualizationsPage() {
  const searchParams = useSearchParams()
  const vizParam = searchParams.get('viz')
  
  // Find the index of the visualization to show based on the URL parameter
  const findVisualizationIndex = (vizId: string | null) => {
    if (!vizId) return 0
    const index = visualizations.findIndex(v => v.id === vizId)
    return index >= 0 ? index : 0
  }
  
  const [currentIndex, setCurrentIndex] = useState(findVisualizationIndex(vizParam))
  
  // Update the current index when the URL parameter changes
  useEffect(() => {
    setCurrentIndex(findVisualizationIndex(vizParam))
  }, [vizParam])
  
  const nextVisualization = () => {
    setCurrentIndex((prev) => (prev + 1) % visualizations.length)
  }
  
  const previousVisualization = () => {
    setCurrentIndex((prev) => (prev - 1 + visualizations.length) % visualizations.length)
  }

  const CurrentVisualization = visualizations[currentIndex].component

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl gradient-text">
          DevRel Visualizations
        </h1>
        <p className="text-xl text-muted-foreground max-w-[800px]">
          Explore interactive visualizations that provide insights into Developer Relations trends, metrics, and community dynamics
        </p>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={previousVisualization}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">
          {currentIndex + 1} of {visualizations.length} - {visualizations[currentIndex].title}
        </span>
        <Button
          variant="ghost"
          onClick={nextVisualization}
          className="flex items-center gap-2"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Current Visualization */}
      <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold">{visualizations[currentIndex].title}</h2>
          <p className="text-muted-foreground">{visualizations[currentIndex].description}</p>
        </div>
        <div className="p-6 pt-0">
          <Suspense fallback={<LoadingFallback />}>
            <VisualizationContainer>
              <CurrentVisualization />
            </VisualizationContainer>
          </Suspense>
        </div>
      </div>
    </div>
  )
}

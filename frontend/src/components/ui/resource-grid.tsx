'use client'

import React from 'react'
import { Resource, ResourceCard } from '@/components/ui/resource-card'
import { Card } from '@/components/ui/card'

interface ResourceGridProps {
  resources: Resource[]
  type?: 'github_program' | 'blog_post' | 'job_listing'
}

export function ResourceGrid({ resources, type }: ResourceGridProps) {
  const filteredResources = type ? resources.filter(r => r.type === type) : resources

  if (filteredResources.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">
          No {type ? type.replace('_', ' ') : 'resources'} found
        </p>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredResources.map((resource, index) => (
        <ResourceCard key={`${resource.url}-${index}`} resource={resource} />
      ))}
    </div>
  )
}

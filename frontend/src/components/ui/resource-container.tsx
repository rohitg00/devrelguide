'use client'

import React, { useState, useEffect } from 'react'
import { ResourceCard } from './resource-card'
import { Button } from './button'
import { Loader2, RefreshCw } from 'lucide-react'
import { Alert, AlertDescription } from './alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs'
import type { Resource } from '@/types/api'

interface GroupedResources {
  github_programs: Resource[]
  blog_posts: Resource[]
  job_listings: Resource[]
}

export function ResourceContainer() {
  const [resources, setResources] = useState<GroupedResources>({ github_programs: [], blog_posts: [], job_listings: [] })
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('blog_posts')

  const fetchResources = async () => {
    try {
      const response = await fetch('/api/resources')
      if (!response.ok) {
        throw new Error('Failed to fetch resources')
      }
      
      const data = await response.json()
      const newResources = data.resources || []
      
      // Group resources by type
      const grouped = newResources.reduce((acc: GroupedResources, resource: Resource) => {
        const type = categorizeResource(resource)
        acc[type].push(resource)
        return acc
      }, { github_programs: [], blog_posts: [], job_listings: [] })

      setResources(grouped)
      setError(null)
    } catch (err) {
      console.error('Error fetching resources:', err)
      setError('Failed to fetch resources. Please try again.')
    } finally {
      setLoading(false)
      setUpdating(false)
    }
  }

  const categorizeResource = (resource: Resource) => {
    const type = (resource.type || '').toLowerCase()
    const url = (resource.url || '').toLowerCase()
    const title = (resource.title || '').toLowerCase()
    const description = (resource.description || '').toLowerCase()

    if (type.includes('github') || type.includes('repository') || url.includes('github.com')) {
      return 'github_programs'
    }

    if (
      type.includes('job') || type.includes('career') ||
      url.includes('jobs') || url.includes('careers') ||
      title.includes('job') || title.includes('career') ||
      description.includes('hiring') || description.includes('position')
    ) {
      return 'job_listings'
    }

    return 'blog_posts'
  }

  const handleRefresh = async () => {
    setUpdating(true)
    await fetchResources()
  }

  useEffect(() => {
    fetchResources()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Resources</h2>
        <Button onClick={handleRefresh} disabled={updating}>
          <RefreshCw className={`h-4 w-4 mr-2 ${updating ? 'animate-spin' : ''}`} />
          {updating ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="blog_posts">
            Blog Posts ({resources.blog_posts.length})
          </TabsTrigger>
          <TabsTrigger value="github_programs">
            GitHub Programs ({resources.github_programs.length})
          </TabsTrigger>
          <TabsTrigger value="job_listings">
            Job Listings ({resources.job_listings.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="blog_posts" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {resources.blog_posts.map((resource, index) => (
              <ResourceCard key={`${resource.url}-${index}`} resource={resource} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="github_programs" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {resources.github_programs.map((resource, index) => (
              <ResourceCard key={`${resource.url}-${index}`} resource={resource} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="job_listings" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {resources.job_listings.map((resource, index) => (
              <ResourceCard key={`${resource.url}-${index}`} resource={resource} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

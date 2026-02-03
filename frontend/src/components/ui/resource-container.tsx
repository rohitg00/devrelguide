'use client'

import React, { useState, useEffect } from 'react'
import { ResourceCard } from './resource-card'
import { Button } from './button'
import { Loader2, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react'
import { Alert, AlertDescription } from './alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs'
import type { Resource } from '@/types/api'

interface GroupedResources {
  github_programs: Resource[]
  blog_posts: Resource[]
  job_listings: Resource[]
}

// Number of items to show per page
const ITEMS_PER_PAGE = 12

export function ResourceContainer() {
  const [resources, setResources] = useState<GroupedResources>({ github_programs: [], blog_posts: [], job_listings: [] })
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('blog_posts')
  
  // Pagination state for each tab
  const [currentPage, setCurrentPage] = useState<Record<string, number>>({
    blog_posts: 1,
    github_programs: 1,
    job_listings: 1
  })

  const fetchResources = async () => {
    try {
      const response = await fetch('/api/resources')
      if (!response.ok) {
        throw new Error('Failed to fetch resources')
      }
      
      const data = await response.json()
      const newResources = data.resources || []
      
      console.log(`Received ${newResources.length} resources from API`)
      
      // Group resources by type
      const grouped = newResources.reduce((acc: GroupedResources, resource: Resource) => {
        const type = categorizeResource(resource)
        acc[type].push(resource)
        return acc
      }, { github_programs: [], blog_posts: [], job_listings: [] })

      // Sort blog posts by date (newest first) and then by relevance score
      grouped.blog_posts.sort((a, b) => {
        // First by relevance score (higher first)
        const relevanceA = a.relevance_score || 0
        const relevanceB = b.relevance_score || 0
        if (relevanceB !== relevanceA) return relevanceB - relevanceA
        
        // Then by date (newest first)
        const dateA = a.date || a.published_date || a.added_at || ''
        const dateB = b.date || b.published_date || b.added_at || ''
        return dateB.localeCompare(dateA)
      })

      console.log(`Grouped resources: ${grouped.blog_posts.length} blogs, ${grouped.github_programs.length} GitHub, ${grouped.job_listings.length} jobs`)
      
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
    const url = (resource.url || resource.link || '').toLowerCase()

    // First check the explicit type
    if (type === 'job_listing') {
      return 'job_listings'
    }
    
    if (type === 'blog_post' || type === 'blog') {
      return 'blog_posts'
    }

    // Then check GitHub repos
    if (type.includes('github') || type.includes('repository') || url.includes('github.com')) {
      return 'github_programs'
    }

    // Check for job listings from common job sites
    if (url.includes('linkedin.com/jobs') || 
        url.includes('careers.') || 
        url.includes('/jobs/') || 
        url.includes('greenhouse.io') || 
        url.includes('lever.co')) {
      return 'job_listings'
    }

    // Check for blog posts from common blog platforms
    if (url.includes('medium.com') ||
        url.includes('dev.to') ||
        url.includes('blog.') ||
        url.includes('/blog/') ||
        resource.resource_type === 'blog') {
      return 'blog_posts'
    }

    // Default to blog posts
    return 'blog_posts'
  }

  const handleRefresh = async () => {
    try {
      setUpdating(true)
      await fetchResources()
    } catch (err) {
      console.error('Error refreshing resources:', err)
    } finally {
      setUpdating(false)
    }
  }

  // Get current items for pagination
  const getCurrentPageItems = (tabName: string) => {
    const items = resources[tabName as keyof GroupedResources] || []
    const page = currentPage[tabName] || 1
    
    const startIndex = (page - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    
    return items.slice(startIndex, endIndex)
  }
  
  // Get total pages for a tab
  const getTotalPages = (tabName: string) => {
    const items = resources[tabName as keyof GroupedResources] || []
    return Math.ceil(items.length / ITEMS_PER_PAGE) || 1
  }
  
  // Handle page change
  const handlePageChange = (tabName: string, pageNumber: number) => {
    setCurrentPage(prev => ({
      ...prev,
      [tabName]: pageNumber
    }))
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

      <Tabs value={activeTab} onValueChange={(value) => {
        setActiveTab(value)
        // Reset to page 1 when changing tabs
        setCurrentPage(prev => ({...prev, [value]: 1}))
      }}>
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
            {getCurrentPageItems('blog_posts').map((resource, index) => (
              <ResourceCard key={`${resource.url || resource.link}-${index}`} resource={resource} />
            ))}
          </div>
          
          {/* Pagination controls */}
          {getTotalPages('blog_posts') > 1 && (
            <div className="flex justify-center items-center mt-6 gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handlePageChange('blog_posts', Math.max(1, currentPage.blog_posts - 1))}
                disabled={currentPage.blog_posts <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              
              <span className="mx-4 text-sm">
                Page {currentPage.blog_posts} of {getTotalPages('blog_posts')}
              </span>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handlePageChange('blog_posts', Math.min(getTotalPages('blog_posts'), currentPage.blog_posts + 1))}
                disabled={currentPage.blog_posts >= getTotalPages('blog_posts')}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="github_programs" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {getCurrentPageItems('github_programs').map((resource, index) => (
              <ResourceCard key={`${resource.url || resource.link}-${index}`} resource={resource} />
            ))}
          </div>
          
          {/* Pagination controls */}
          {getTotalPages('github_programs') > 1 && (
            <div className="flex justify-center items-center mt-6 gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handlePageChange('github_programs', Math.max(1, currentPage.github_programs - 1))}
                disabled={currentPage.github_programs <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              
              <span className="mx-4 text-sm">
                Page {currentPage.github_programs} of {getTotalPages('github_programs')}
              </span>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handlePageChange('github_programs', Math.min(getTotalPages('github_programs'), currentPage.github_programs + 1))}
                disabled={currentPage.github_programs >= getTotalPages('github_programs')}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="job_listings" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {getCurrentPageItems('job_listings').map((resource, index) => (
              <ResourceCard key={`${resource.url || resource.link}-${index}`} resource={resource} />
            ))}
          </div>
          
          {/* Pagination controls */}
          {getTotalPages('job_listings') > 1 && (
            <div className="flex justify-center items-center mt-6 gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handlePageChange('job_listings', Math.max(1, currentPage.job_listings - 1))}
                disabled={currentPage.job_listings <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              
              <span className="mx-4 text-sm">
                Page {currentPage.job_listings} of {getTotalPages('job_listings')}
              </span>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handlePageChange('job_listings', Math.min(getTotalPages('job_listings'), currentPage.job_listings + 1))}
                disabled={currentPage.job_listings >= getTotalPages('job_listings')}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

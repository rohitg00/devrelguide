'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { Button } from './button'
import { ExternalLink, Star, Calendar, Tag, User, Building, MapPin, GitFork, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Resource } from '@/types/api'
import DOMPurify from 'isomorphic-dompurify'

interface ResourceCardProps {
  resource: Resource
  className?: string
}

const htmlEntities: { [key: string]: string } = {
  '&lt;': '<',
  '&gt;': '>',
  '&amp;': '&',
  '&quot;': '"',
  '&#39;': "'",
  '&nbsp;': ' ',
  '&ndash;': '–',
  '&mdash;': '—',
  '&bull;': '•',
  '&hellip;': '…'
}

export function ResourceCard({ resource, className }: ResourceCardProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch (e) {
      return dateString
    }
  }

  const decodeAndSanitize = (html?: string) => {
    if (!html) return ''
    try {
      // First decode common HTML entities
      let decoded = html
      Object.entries(htmlEntities).forEach(([entity, char]) => {
        decoded = decoded.replace(new RegExp(entity, 'g'), char)
      })

      // Then use DOMParser for any remaining HTML entities
      decoded = new DOMParser().parseFromString(decoded, 'text/html').body.textContent || ''

      // Finally sanitize the content
      return DOMPurify.sanitize(decoded)
    } catch (e) {
      return html
    }
  }

  return (
    <Card 
      className={cn(
        'w-full h-full flex flex-col overflow-hidden group transition-all duration-300',
        'hover:shadow-lg hover:scale-[1.02]',
        resource.type === 'github' 
          ? 'bg-[#2A332C] hover:border-[#83C167] text-white'
          : 'bg-gradient-to-br from-white to-[#F7F9F7] hover:border-[#83C167]',
        'dark:from-gray-900 dark:to-gray-800',
        className
      )}
    >
      <CardHeader className={cn(
        "space-y-2 flex-shrink-0 p-4 sm:p-6 pb-2",
        resource.type === 'github' && "border-b border-[#3D4D40]"
      )}>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className={cn(
            "text-base sm:text-lg line-clamp-2 font-semibold break-words max-w-[calc(100%-2.5rem)]",
            resource.type === 'github' ? 'text-[#B4D5A7]' : 'text-foreground'
          )}>
            {decodeAndSanitize(resource.title || resource.name || 'Untitled Resource')}
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "flex-shrink-0 h-8 w-8 opacity-70 hover:opacity-100 transition-opacity",
              resource.type === 'github' ? 'hover:text-[#83C167]' : 'hover:text-[#568C3F]'
            )}
            asChild
          >
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${resource.title || resource.name || 'resource'}`}
              className="flex items-center justify-center"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 text-sm">
          {resource.type === 'github' && (
            <>
              {resource.stars !== undefined && (
                <span className="flex items-center gap-1 min-w-0 bg-[#3D4D40] text-[#B4D5A7] px-2 py-0.5 rounded-full">
                  <Star className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="truncate">{resource.stars.toLocaleString()}</span>
                </span>
              )}
              {resource.author && (
                <span className="flex items-center gap-1 min-w-0 bg-[#3D4D40] text-[#B4D5A7] px-2 py-0.5 rounded-full">
                  <User className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="truncate">{resource.author}</span>
                </span>
              )}
              {resource.language && (
                <span className="flex items-center gap-1 min-w-0 bg-[#3D4D40] text-[#B4D5A7] px-2 py-0.5 rounded-full">
                  <span className="h-2 w-2 rounded-full bg-[#83C167]" />
                  <span className="truncate">{resource.language}</span>
                </span>
              )}
              {resource.forks_count !== undefined && (
                <span className="flex items-center gap-1 min-w-0 bg-[#3D4D40] text-[#B4D5A7] px-2 py-0.5 rounded-full">
                  <GitFork className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="truncate">{resource.forks_count.toLocaleString()}</span>
                </span>
              )}
              {resource.open_issues_count !== undefined && (
                <span className="flex items-center gap-1 min-w-0 bg-[#3D4D40] text-[#B4D5A7] px-2 py-0.5 rounded-full">
                  <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="truncate">{resource.open_issues_count.toLocaleString()}</span>
                </span>
              )}
              {resource.updated_at && (
                <span className="flex items-center gap-1 min-w-0 bg-[#3D4D40] text-[#B4D5A7] px-2 py-0.5 rounded-full">
                  <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="truncate">Updated {formatDate(resource.updated_at)}</span>
                </span>
              )}
            </>
          )}

          {resource.type === 'blog_post' && (
            <>
              {resource.source && (
                <span className="flex items-center gap-1 min-w-0 bg-[#EDF3EB] text-[#568C3F] px-2 py-0.5 rounded-full">
                  <Tag className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="truncate">{resource.source}</span>
                </span>
              )}
              {(resource.date || resource.published_date) && (
                <span className="flex items-center gap-1 min-w-0 bg-[#EDF3EB] text-[#568C3F] px-2 py-0.5 rounded-full">
                  <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="truncate">{formatDate(resource.date || resource.published_date)}</span>
                </span>
              )}
            </>
          )}

          {(resource.type === 'job' || resource.type === 'job_listing') && (
            <>
              {resource.company && (
                <span className="flex items-center gap-1 min-w-0 bg-[#EDF3EB] text-[#568C3F] px-2 py-0.5 rounded-full">
                  <Building className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="truncate">{resource.company}</span>
                </span>
              )}
              {resource.location && (
                <span className="flex items-center gap-1 min-w-0 bg-[#EDF3EB] text-[#568C3F] px-2 py-0.5 rounded-full">
                  <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="truncate">{resource.location}</span>
                </span>
              )}
            </>
          )}
        </div>
      </CardHeader>

      <CardContent className={cn(
        "flex-grow p-4 sm:p-6 pt-2",
        resource.type === 'github' ? 'text-gray-300' : ''
      )}>
        {resource.description || resource.excerpt ? (
          <p className={cn(
            "text-sm line-clamp-3 mb-4",
            resource.type === 'github' ? 'text-gray-300' : 'text-muted-foreground'
          )}>
            {decodeAndSanitize(resource.description || resource.excerpt)}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground italic">No description available</p>
        )}

        {resource.tags && resource.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {resource.tags.map((tag, index) => (
              <span
                key={index}
                className={cn(
                  "text-xs px-2 py-0.5 rounded-full",
                  resource.type === 'github' 
                    ? 'bg-[#3D4D40] text-[#B4D5A7]'
                    : 'bg-[#EDF3EB] text-[#568C3F]'
                )}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

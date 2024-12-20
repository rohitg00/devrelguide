'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { Button } from './button'
import { ExternalLink, Star, Calendar, Tag, User, Building, MapPin } from 'lucide-react'
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
    <Card className={cn('w-full h-full flex flex-col overflow-hidden group hover:shadow-lg transition-all', className)}>
      <CardHeader className="space-y-2 flex-shrink-0 p-4 sm:p-6">
        <CardTitle className="text-base sm:text-lg flex items-start justify-between gap-2">
          <span className="line-clamp-2 font-semibold break-words text-foreground max-w-[calc(100%-2.5rem)]">
            {decodeAndSanitize(resource.title || resource.name || 'Untitled Resource')}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="flex-shrink-0 h-8 w-8 opacity-70 hover:opacity-100 transition-opacity"
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
        </CardTitle>

        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
          {resource.type === 'github' && (
            <>
              {resource.stars !== undefined && (
                <span className="flex items-center gap-1 min-w-0">
                  <Star className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="truncate">{resource.stars.toLocaleString()}</span>
                </span>
              )}
              {resource.author && (
                <span className="flex items-center gap-1 min-w-0">
                  <User className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="truncate">{resource.author}</span>
                </span>
              )}
            </>
          )}

          {resource.type === 'blog' && (
            <>
              {resource.author && (
                <span className="flex items-center gap-1 min-w-0">
                  <User className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="truncate">{resource.author}</span>
                </span>
              )}
              {(resource.date || resource.published_date) && (
                <span className="flex items-center gap-1 min-w-0">
                  <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="truncate">{formatDate(resource.date || resource.published_date)}</span>
                </span>
              )}
            </>
          )}

          {(resource.type === 'job' || resource.type === 'job_listing') && (
            <>
              {resource.company && (
                <span className="flex items-center gap-1 min-w-0">
                  <Building className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="truncate">{resource.company}</span>
                </span>
              )}
              {resource.location && (
                <span className="flex items-center gap-1 min-w-0">
                  <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="truncate">{resource.location}</span>
                </span>
              )}
            </>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-grow p-4 sm:p-6 pt-0">
        {resource.description && (
          <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
            {decodeAndSanitize(resource.description)}
          </p>
        )}

        {resource.tags && resource.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {resource.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-0.5 text-xs rounded-full bg-muted text-muted-foreground truncate max-w-[150px]"
              >
                <Tag className="h-3 w-3 mr-1 flex-shrink-0" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { Button } from './button'
import { ExternalLink, Star, Calendar, Tag, User, Building, MapPin, GitFork, AlertCircle, Globe, LaptopIcon, Clock, CheckCircle2 } from 'lucide-react'
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

// Common DevRel skills to look for in job descriptions
const commonDevRelSkills = [
  'public speaking', 'technical writing', 'content creation', 'developer experience',
  'community management', 'community building', 'event management', 'documentation',
  'open source', 'open-source', 'github', 'git', 'advocacy', 'outreach',
  'javascript', 'python', 'go', 'java', 'rust', 'c#', 'typescript', 'react', 'node',
  'communication', 'marketing', 'social media', 'analytics', 'metrics', 'kpis',
  'product management', 'program management', 'teaching', 'training', 'workshop',
  'video creation', 'video editing', 'podcast', 'twitch', 'live streaming',
  'sdk', 'api', 'developer tools', 'sdk development', 'api design', 'hackathon',
  'meetup', 'conference', 'webinar', 'blogging'
]

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

  const getMonthPosted = (dateString?: string) => {
    if (!dateString) return ''
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short'
      })
    } catch (e) {
      return ''
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

  // Extract country from location
  const extractCountry = (location?: string) => {
    if (!location) return '';
    
    // Common location formats: "City, Country", "Remote, Country", "City, State, Country"
    const parts = location.split(',').map(part => part.trim());
    if (parts.length > 0) {
      // Usually the country is the last part
      return parts[parts.length - 1];
    }
    return location;
  }

  // Extract city from location
  const extractCity = (location?: string) => {
    if (!location) return '';
    
    // Common location formats: "City, Country", "Remote, Country", "City, State, Country"
    const parts = location.split(',').map(part => part.trim());
    if (parts.length > 0) {
      // Usually the city is the first part
      return parts[0];
    }
    return location;
  }

  // Check if job is remote
  const isRemote = (resource: Resource) => {
    const location = (resource.location || '').toLowerCase();
    const description = (resource.description || '').toLowerCase();
    const title = (resource.title || '').toLowerCase();
    
    return location.includes('remote') || 
           description.includes('remote') || 
           description.includes('work from home') || 
           description.includes('work from anywhere') ||
           description.includes('remote-first') ||
           description.includes('fully remote') ||
           title.includes('remote');
  }

  // Extract skills from job description
  const extractSkills = (description?: string) => {
    if (!description) return [];
    
    const descLower = description.toLowerCase();
    return commonDevRelSkills.filter(skill => 
      descLower.includes(skill.toLowerCase())
    ).slice(0, 4); // Get top 4 skills
  }

  // Guess skills from job title when description is missing
  const guessSkillsFromTitle = (title?: string) => {
    if (!title) return [];
    
    const titleLower = title.toLowerCase();
    const results = commonDevRelSkills.filter(skill => 
      titleLower.includes(skill.toLowerCase())
    );
    
    // Add default skills based on the role type
    if (results.length < 2) {
      if (titleLower.includes('advocate')) {
        results.push('public speaking', 'content creation');
      } else if (titleLower.includes('relations')) {
        results.push('community management', 'developer experience');
      } else if (titleLower.includes('evangelist')) {
        results.push('public speaking', 'technical writing');
      } else if (titleLower.includes('content')) {
        results.push('content creation', 'technical writing');
      } else if (titleLower.includes('community')) {
        results.push('community management', 'community building');
      }
    }
    
    return results.slice(0, 4);
  }

  return (
    <Card 
      className={cn(
        'w-full h-full flex flex-col overflow-hidden group transition-all duration-300',
        'hover:shadow-lg hover:scale-[1.02]',
        'bg-card hover:border-secondary',
        className
      )}
    >
      <CardHeader className={cn(
        "space-y-2 flex-shrink-0 p-4 sm:p-6 pb-2",
        resource.type === 'github' && "border-b border-border"
      )}>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base sm:text-lg line-clamp-2 font-semibold break-words max-w-[calc(100%-2.5rem)] text-foreground">
            {decodeAndSanitize(resource.title || resource.name || 'Untitled Resource')}
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="flex-shrink-0 h-8 w-8 opacity-70 hover:opacity-100 transition-opacity hover:text-secondary"
            asChild
          >
            <a
              href={resource.url || resource.link}
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
                <span className="flex items-center gap-1 min-w-0 bg-primary/90 text-primary-foreground px-2 py-0.5 rounded-full">
                  <Star className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="truncate">{resource.stars.toLocaleString()}</span>
                </span>
              )}
              {resource.author && (
                <span className="flex items-center gap-1 min-w-0 bg-primary/90 text-primary-foreground px-2 py-0.5 rounded-full">
                  <User className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="truncate">{resource.author}</span>
                </span>
              )}
              {resource.language && (
                <span className="flex items-center gap-1 min-w-0 bg-primary/90 text-primary-foreground px-2 py-0.5 rounded-full">
                  <span className="h-2 w-2 rounded-full bg-secondary" />
                  <span className="truncate">{resource.language}</span>
                </span>
              )}
              {resource.forks_count !== undefined && (
                <span className="flex items-center gap-1 min-w-0 bg-primary/90 text-primary-foreground px-2 py-0.5 rounded-full">
                  <GitFork className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="truncate">{resource.forks_count.toLocaleString()}</span>
                </span>
              )}
              {resource.open_issues_count !== undefined && (
                <span className="flex items-center gap-1 min-w-0 bg-primary/90 text-primary-foreground px-2 py-0.5 rounded-full">
                  <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="truncate">{resource.open_issues_count.toLocaleString()}</span>
                </span>
              )}
              {resource.updated_at && (
                <span className="flex items-center gap-1 min-w-0 bg-primary/90 text-primary-foreground px-2 py-0.5 rounded-full">
                  <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="truncate">Updated {formatDate(resource.updated_at)}</span>
                </span>
              )}
            </>
          )}

          {resource.type === 'blog_post' && (
            <>
              {resource.source && (
                <span className="flex items-center gap-1 min-w-0 bg-primary/90 text-primary-foreground px-2 py-0.5 rounded-full">
                  <Tag className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="truncate">{resource.source}</span>
                </span>
              )}
              {(resource.date || resource.published_date) && (
                <span className="flex items-center gap-1 min-w-0 bg-primary/90 text-primary-foreground px-2 py-0.5 rounded-full">
                  <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="truncate">{formatDate(resource.date || resource.published_date)}</span>
                </span>
              )}
            </>
          )}

          {(resource.type === 'job' || resource.type === 'job_listing') && (
            <>
              {resource.company && (
                <span className="flex items-center gap-1 min-w-0 bg-primary/90 text-primary-foreground px-2 py-0.5 rounded-full">
                  <Building className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="truncate">{resource.company}</span>
                </span>
              )}
              
              {/* Show country extracted from location */}
              {resource.location && (
                <span className="flex items-center gap-1 min-w-0 bg-primary/90 text-primary-foreground px-2 py-0.5 rounded-full">
                  <Globe className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="truncate">{extractCountry(resource.location)}</span>
                </span>
              )}
              
              {/* Show remote status */}
              {isRemote(resource) && (
                <span className="flex items-center gap-1 min-w-0 bg-primary/90 text-primary-foreground px-2 py-0.5 rounded-full">
                  <LaptopIcon className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="truncate">Remote</span>
                </span>
              )}
              
              {/* Show month posted */}
              {(resource.date || resource.published_date || resource.added_at) && (
                <span className="flex items-center gap-1 min-w-0 bg-primary/90 text-primary-foreground px-2 py-0.5 rounded-full">
                  <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="truncate">{getMonthPosted(resource.date || resource.published_date || resource.added_at)}</span>
                </span>
              )}
            </>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-grow p-4 sm:p-6 pt-2">
        {resource.description || resource.excerpt ? (
          <p className="text-sm line-clamp-3 mb-4 text-muted-foreground">
            {decodeAndSanitize(resource.description || resource.excerpt)}
          </p>
        ) : (
          (resource.type === 'job' || resource.type === 'job_listing') ? (
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">{resource.company}</span> is hiring for this DevRel position
                {resource.location && ` in ${extractCity(resource.location)}`}.
                {isRemote(resource) && ' This position supports remote work.'}
              </p>
              <p className="text-xs text-muted-foreground mt-2 italic">
                Visit the job posting for full details.
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">No description available</p>
          )
        )}

        {/* For job listings, show extracted skills if no tags are present */}
        {(resource.type === 'job' || resource.type === 'job_listing') && (
          <>
            {resource.tags && resource.tags.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {resource.tags.slice(0, 4).map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs px-2 py-0.5 rounded-full bg-secondary/10 text-secondary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {(extractSkills(resource.description).length > 0 ? 
                  extractSkills(resource.description) : 
                  guessSkillsFromTitle(resource.title)
                ).map((skill, index) => (
                  <span
                    key={index}
                    className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-primary/90 text-primary-foreground"
                  >
                    <CheckCircle2 className="h-3 w-3 flex-shrink-0" />
                    {skill.charAt(0).toUpperCase() + skill.slice(1)}
                  </span>
                ))}
              </div>
            )}
          </>
        )}

        {/* For non-job listings, show tags if present */}
        {resource.type !== 'job' && resource.type !== 'job_listing' && resource.tags && resource.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {resource.tags.map((tag, index) => (
              <span
                key={index}
                className={cn(
                  "text-xs px-2 py-0.5 rounded-full",
                  resource.type === 'github' 
                    ? 'bg-secondary/10 text-secondary'
                    : 'bg-secondary/10 text-secondary'
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

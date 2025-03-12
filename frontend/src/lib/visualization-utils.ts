import { useEffect, useState, useCallback } from 'react'

// Default timeout for fetching data (in milliseconds)
const FETCH_TIMEOUT = 8000

// Type for fetching visualization data
export interface FetchVisualizationOptions {
  endpoint: string
  fallbackData?: any
  timeout?: number
}

// Check if API is available (for development purposes)
const isApiAvailable = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  // If no API URL is set or it's set to a localhost port that's not the same as the frontend,
  // assume the API is not available
  if (!apiUrl || (apiUrl.includes('localhost:8001') && window.location.port !== '8001')) {
    console.log('API server appears to be unavailable, using fallback data')
    return false
  }
  return true
}

// Hook for fetching visualization data with fallback and timeout
export function useFetchVisualization<T>({ 
  endpoint, 
  fallbackData, 
  timeout = FETCH_TIMEOUT 
}: FetchVisualizationOptions) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  // Function to handle retrying fetch
  const retryFetch = () => {
    setRetryCount(prev => prev + 1)
    setLoading(true)
    setError(null)
  }

  useEffect(() => {
    let isMounted = true
    let timeoutId: NodeJS.Timeout

    const fetchData = async () => {
      // If API is not available and we have fallback data, use it immediately
      if (!isApiAvailable() && fallbackData) {
        setData(fallbackData)
        setLoading(false)
        setError(null)
        return
      }

      // Clear any existing timeout
      if (timeoutId) clearTimeout(timeoutId)
      
      // Set up a new timeout
      timeoutId = setTimeout(() => {
        if (isMounted) {
          console.warn(`Fetch timeout for ${endpoint}`)
          if (fallbackData) {
            setData(fallbackData)
            setLoading(false)
            setError(null) // Clear any error when using fallback data
          } else {
            setError(new Error(`Request timeout after ${timeout}ms`))
            setLoading(false)
          }
        }
      }, timeout)

      try {
        // Get API URL from environment variable or use default
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || ''
        
        // Add the API URL if the endpoint doesn't start with http
        const fullUrl = endpoint.startsWith('http') 
          ? endpoint 
          : `${apiUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`
        
        console.log(`Fetching data from: ${fullUrl}`)
        
        const response = await fetch(fullUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          credentials: 'same-origin'
        })

        // Clear the timeout since we got a response
        clearTimeout(timeoutId)

        if (!isMounted) return

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`)
        }

        const result = await response.json()
        setData(result)
        setError(null)
      } catch (err) {
        if (!isMounted) return
        console.error(`Error fetching data from ${endpoint}:`, err)
        
        // Always use fallback data if available, and clear the error state
        if (fallbackData) {
          console.log(`Using fallback data for ${endpoint}`)
          setData(fallbackData)
          setError(null) // Don't show error when fallback is used
        } else {
          setError(err instanceof Error ? err : new Error('An unknown error occurred'))
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      isMounted = false
      clearTimeout(timeoutId)
    }
  }, [endpoint, timeout, retryCount, fallbackData])

  return { data, loading, error, retry: retryFetch }
}

// Fallback data for different visualizations
export const fallbackData = {
  metrics: {
    data: [
      { timestamp: '2023-01', engagement: 75, growth: 62, satisfaction: 80 },
      { timestamp: '2023-02', engagement: 78, growth: 65, satisfaction: 82 },
      { timestamp: '2023-03', engagement: 82, growth: 68, satisfaction: 84 },
      { timestamp: '2023-04', engagement: 85, growth: 72, satisfaction: 86 },
      { timestamp: '2023-05', engagement: 89, growth: 75, satisfaction: 87 },
      { timestamp: '2023-06', engagement: 92, growth: 79, satisfaction: 88 },
    ],
    metrics: [
      { name: 'Community Growth', value: 78, color: '#4299E1' },
      { name: 'Developer Satisfaction', value: 85, color: '#48BB78' },
      { name: 'Content Engagement', value: 92, color: '#ED64A6' },
      { name: 'Event Attendance', value: 68, color: '#F6AD55' },
      { name: 'Documentation Usage', value: 75, color: '#9F7AEA' }
    ]
  },
  communityGraph: {
    nodes: [
      { id: 'devrel', name: 'DevRel Team', category: 'hub' },
      { id: 'developers', name: 'Developers', category: 'hub' },
      { id: 'advocates', name: 'Developer Advocates', category: 'team' },
      { id: 'community', name: 'Community Managers', category: 'team' },
      { id: 'content', name: 'Content Creators', category: 'team' },
      { id: 'opensource', name: 'Open Source Devs', category: 'community' },
      { id: 'enterprise', name: 'Enterprise Devs', category: 'community' },
      { id: 'startup', name: 'Startup Devs', category: 'community' },
    ],
    links: [
      { source: 'devrel', target: 'advocates', value: 5 },
      { source: 'devrel', target: 'community', value: 3 },
      { source: 'devrel', target: 'content', value: 4 },
      { source: 'advocates', target: 'opensource', value: 3 },
      { source: 'advocates', target: 'enterprise', value: 2 },
      { source: 'community', target: 'opensource', value: 2 },
      { source: 'community', target: 'startup', value: 3 },
      { source: 'content', target: 'enterprise', value: 2 },
      { source: 'content', target: 'startup', value: 2 },
    ]
  },
  careerPath: {
    title: "DevRel Career Path",
    level: "root",
    children: [
      {
        title: "Entry Level",
        level: "category",
        children: [
          {
            title: "Junior Developer Advocate",
            level: "Entry",
            children: [
              { title: "Developer Advocate", level: "Mid" },
              { title: "Technical Writer", level: "Mid" },
              { title: "Community Coordinator", level: "Mid" }
            ]
          },
          {
            title: "Associate Technical Writer",
            level: "Entry",
            children: [
              { title: "Technical Writer", level: "Mid" }
            ]
          },
          {
            title: "Community Coordinator",
            level: "Entry",
            children: [
              { title: "Community Manager", level: "Mid" }
            ]
          }
        ]
      },
      {
        title: "Mid Level",
        level: "category",
        children: [
          {
            title: "Developer Advocate",
            level: "Mid",
            children: [
              { title: "Senior Developer Advocate", level: "Senior" },
              { title: "DevRel Program Manager", level: "Senior" }
            ]
          },
          {
            title: "Technical Writer",
            level: "Mid",
            children: [
              { title: "Lead Technical Writer", level: "Senior" }
            ]
          },
          {
            title: "Community Manager",
            level: "Mid",
            children: [
              { title: "Senior Community Manager", level: "Senior" }
            ]
          }
        ]
      },
      {
        title: "Senior Level",
        level: "category",
        children: [
          {
            title: "Senior Developer Advocate",
            level: "Senior",
            children: [
              { title: "DevRel Manager", level: "Leadership" }
            ]
          },
          {
            title: "DevRel Program Manager",
            level: "Senior",
            children: [
              { title: "Head of DevRel", level: "Leadership" }
            ]
          }
        ]
      }
    ]
  },
  careerPathway: [
    {
      name: 'Technical Writing',
      size: 100,
      category: 'Content',
      skills: ['Documentation', 'API Reference', 'Tutorials'],
      level: 'Entry'
    },
    {
      name: 'Community Management',
      size: 120,
      category: 'Engagement',
      skills: ['Forum Moderation', 'Event Planning', 'User Support'],
      level: 'Entry'
    },
    {
      name: 'Developer Education',
      size: 150,
      category: 'Education',
      skills: ['Workshop Creation', 'Video Content', 'Code Examples'],
      level: 'Mid'
    },
    {
      name: 'Technical Advocacy',
      size: 180,
      category: 'Technical',
      skills: ['Public Speaking', 'Demo Development', 'Technical Blog Posts'],
      level: 'Mid'
    },
    {
      name: 'Strategy & Analytics',
      size: 200,
      category: 'Leadership',
      skills: ['Metrics Analysis', 'Program Planning', 'Stakeholder Management'],
      level: 'Senior'
    },
    {
      name: 'DevRel Leadership',
      size: 250,
      category: 'Leadership',
      skills: ['Team Management', 'Budget Planning', 'Program Direction'],
      level: 'Lead'
    }
  ],
  careerPathTimeline: [
    {
      stage: 'Entry',
      technical: 40,
      community: 30,
      content: 50,
      leadership: 20,
      impact: 25
    },
    {
      stage: 'Mid-Level',
      technical: 65,
      community: 60,
      content: 70,
      leadership: 45,
      impact: 55
    },
    {
      stage: 'Senior',
      technical: 85,
      community: 80,
      content: 85,
      leadership: 70,
      impact: 80
    },
    {
      stage: 'Lead',
      technical: 90,
      community: 90,
      content: 90,
      leadership: 85,
      impact: 90
    },
    {
      stage: 'Director',
      technical: 85,
      community: 95,
      content: 90,
      leadership: 95,
      impact: 95
    }
  ],
  developerJourney: {
    nodes: [
      { name: 'Discovery', value: 20, category: 'discovery' },
      { name: 'Documentation', value: 15, category: 'learning' },
      { name: 'Tutorials', value: 12, category: 'learning' },
      { name: 'Sample Code', value: 8, category: 'building' },
      { name: 'Q&A Forums', value: 10, category: 'building' },
      { name: 'Issue Reports', value: 7, category: 'contributing' },
      { name: 'Pull Requests', value: 5, category: 'contributing' },
      { name: 'Advocacy', value: 3, category: 'leading' }
    ],
    links: [
      { source: 0, target: 1, value: 15 },
      { source: 0, target: 2, value: 12 },
      { source: 1, target: 3, value: 8 },
      { source: 2, target: 4, value: 10 },
      { source: 3, target: 5, value: 7 },
      { source: 4, target: 6, value: 5 },
      { source: 5, target: 7, value: 2 },
      { source: 6, target: 7, value: 3 }
    ]
  },
  developerProgress: {
    nodes: [
      { name: 'New Developer', category: 'discovery' },
      { name: 'Resource Explorer', category: 'discovery' },
      { name: 'Documentation Reader', category: 'learning' },
      { name: 'API Practitioner', category: 'learning' },
      { name: 'Community Member', category: 'engagement' },
      { name: 'Forum Participant', category: 'engagement' },
      { name: 'Content Creator', category: 'contribution' },
      { name: 'Code Contributor', category: 'contribution' },
      { name: 'Community Leader', category: 'leadership' },
      { name: 'DevRel Advocate', category: 'leadership' }
    ],
    links: [
      { source: 0, target: 1, value: 100, category: 'discovery' },
      { source: 1, target: 2, value: 85, category: 'learning' },
      { source: 1, target: 3, value: 65, category: 'learning' },
      { source: 2, target: 4, value: 60, category: 'engagement' },
      { source: 3, target: 5, value: 45, category: 'engagement' },
      { source: 4, target: 6, value: 40, category: 'contribution' },
      { source: 5, target: 7, value: 35, category: 'contribution' },
      { source: 6, target: 8, value: 25, category: 'leadership' },
      { source: 7, target: 8, value: 20, category: 'leadership' },
      { source: 8, target: 9, value: 30, category: 'leadership' }
    ]
  },
  devrelEcosystem: {
    nodes: [
      { id: 'community', name: 'Community', category: 'pillar' },
      { id: 'education', name: 'Education', category: 'pillar' },
      { id: 'support', name: 'Support', category: 'pillar' },
      { id: 'feedback', name: 'Feedback', category: 'pillar' },
      { id: 'forums', name: 'Forums', category: 'activity', pillar: 'community' },
      { id: 'events', name: 'Events', category: 'activity', pillar: 'community' },
      { id: 'docs', name: 'Documentation', category: 'activity', pillar: 'education' },
      { id: 'tutorials', name: 'Tutorials', category: 'activity', pillar: 'education' },
      { id: 'helpdesk', name: 'Help Desk', category: 'activity', pillar: 'support' },
      { id: 'stackoverflow', name: 'Stack Overflow', category: 'activity', pillar: 'support' },
      { id: 'github', name: 'GitHub Issues', category: 'activity', pillar: 'feedback' },
      { id: 'surveys', name: 'Surveys', category: 'activity', pillar: 'feedback' },
    ],
    links: [
      { source: 'community', target: 'forums', value: 5 },
      { source: 'community', target: 'events', value: 8 },
      { source: 'education', target: 'docs', value: 10 },
      { source: 'education', target: 'tutorials', value: 7 },
      { source: 'support', target: 'helpdesk', value: 6 },
      { source: 'support', target: 'stackoverflow', value: 9 },
      { source: 'feedback', target: 'github', value: 8 },
      { source: 'feedback', target: 'surveys', value: 5 },
    ]
  },
}

interface ResponsiveConfig {
  aspectRatio?: number;
  minHeight?: number;
}

export function useResponsiveVisualizationSize<T extends HTMLElement>(
  ref: React.RefObject<T | null>, 
  config: number | ResponsiveConfig = 16/9
) {
  const aspectRatio = typeof config === 'number' ? config : (config.aspectRatio || 16/9);
  const minHeight = typeof config === 'number' ? undefined : config.minHeight;

  const [dimensions, setDimensions] = useState({ width: 800, height: 450 })

  const updateDimensions = useCallback(() => {
    if (ref.current) {
      const width = ref.current.clientWidth
      let height = width / aspectRatio
      
      // Apply minimum height if specified
      if (minHeight && height < minHeight) {
        height = minHeight
      }
      
      setDimensions({ width, height })
    }
  }, [ref, aspectRatio, minHeight])

  useEffect(() => {
    // Initial update
    updateDimensions()

    // Update on resize with debounce
    const handleResize = debounce(updateDimensions, 250)
    window.addEventListener('resize', handleResize)
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [updateDimensions]) // Only depend on the memoized update function

  return dimensions
}

// Simple debounce function
function debounce(fn: Function, ms = 300) {
  let timeoutId: ReturnType<typeof setTimeout>
  return function(this: any, ...args: any[]) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn.apply(this, args), ms)
  }
}

// Utility to ensure charts stay within their containers
export function ensureWithinContainer(width: number, height: number, maxWidth = 1200, maxHeight = 800) {
  return {
    width: Math.min(width, maxWidth),
    height: Math.min(height, maxHeight)
  }
}

// Utility function to fallback to sample data when fetched data is null
export function getFallbackData<T>(fetchedData: T | null, sampleData: T): T {
  return fetchedData || sampleData;
} 
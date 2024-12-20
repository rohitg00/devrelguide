export interface TimelineItem {
  date: string;
  engagement: number;
}

export interface MetricItem {
  name: string;
  value: number;
  change: number;
}

export interface MetricsResponse {
  metrics: MetricItem[];
  timeline: TimelineItem[];
}

export interface MetricsData {
  month: string;
  engagement: number;
  growth: number;
  satisfaction: number;
  [key: string]: string | number;
}

export interface Resource {
  title?: string;
  name?: string;
  url: string;
  description?: string;
  type: 'github_program' | 'github' | 'blog_post' | 'blog' | 'job_listing' | 'job';
  date?: string;
  published_date?: string;
  last_updated?: string;
  tags?: string[];
  stars?: number;
  author?: string;
  company?: string;
  location?: string;
}

export interface ResourcesResponse {
  github: Resource[];
  blogs: Resource[];
  jobs: Resource[];
}

export interface ApiError {
  error: string;
  status?: number;
}

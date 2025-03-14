import os
import json
import time
import logging
import asyncio
import aiohttp
import requests
import feedparser
import urllib.parse
from typing import List, Dict, Optional, Any
from datetime import datetime, timedelta
from bs4 import BeautifulSoup
from pathlib import Path
import traceback

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class DevRelScraper:
    """Scraper for DevRel resources including GitHub programs, blog posts, and job listings."""

    def __init__(self, timeout: aiohttp.ClientTimeout = None):
        """Initialize the DevRel scraper."""
        self.timeout = timeout or aiohttp.ClientTimeout(total=120, connect=30, sock_read=30)
        self.headers = {
            'Accept': 'application/vnd.github.v3+json',  # Updated to use GitHub API v3
            'Accept-Language': 'en-US,en;q=0.5',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Connection': 'keep-alive'
        }
        
        # Add GitHub API token if available
        # First check environment variable directly, then try to load from .env file
        github_token = os.environ.get('GITHUB_TOKEN')
        
        logger.info("Looking for GitHub token...")
        
        # If no token in environment, try to load from .env file
        if not github_token:
            logger.info("No GitHub token found in environment variables, checking .env file")
            try:
                # Try multiple possible locations for the .env file
                possible_paths = [
                    os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), '.env'),  # /backend/.env
                    os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), '.env'),  # Root .env
                    '.env',  # Current directory
                ]
                
                env_path = None
                for path in possible_paths:
                    logger.info(f"Checking for .env file at: {path}")
                    if os.path.exists(path):
                        env_path = path
                        logger.info(f"Found .env file at: {path}")
                        break
                
                if env_path:
                    with open(env_path, 'r') as env_file:
                        env_content = env_file.read()
                        logger.debug(f"Read env file content (length: {len(env_content)})")
                        
                        # Try multiple approaches to extract the token
                        if 'GITHUB_TOKEN' in env_content:
                            logger.debug("Found GITHUB_TOKEN in env file content")
                            
                            # Method 1: Parse line by line
                            for line in env_content.splitlines():
                                line = line.strip()
                                if line and not line.startswith('#') and 'GITHUB_TOKEN' in line:
                                    logger.debug(f"Found line with GITHUB_TOKEN: {line[:15]}...")
                                    
                                    # Extract token using split
                                    parts = line.split('=', 1)
                                    if len(parts) == 2:
                                        token_value = parts[1].strip()
                                        # Remove any quotes
                                        token_value = token_value.strip('"').strip("'")
                                        
                                        # Check if the token looks valid (non-empty and not just whitespace)
                                        if token_value and not token_value.isspace():
                                            github_token = token_value
                                            logger.info(f"Successfully extracted GitHub token (length: {len(github_token)})")
                                            break
                        else:
                            logger.warning("GITHUB_TOKEN not found in .env file content")
                else:
                    logger.warning("No .env file found in any expected location")
            except Exception as e:
                logger.error(f"Error loading GitHub token from .env file: {str(e)}")
        else:
            logger.info(f"GitHub token found in environment variables (length: {len(github_token)})")
        
        if github_token:
            # Clean the token - sometimes GitHub tokens might have newlines or other unwanted characters
            github_token = github_token.strip()
            # Log some token details for debugging (safely)
            if len(github_token) > 10:
                logger.info(f"Token starts with: {github_token[:5]}... and ends with: ...{github_token[-5:]}")
                logger.info(f"Token length: {len(github_token)}")
            
            if github_token:
                self.headers['Authorization'] = f'token {github_token}'
                logger.info("GitHub API authentication configured successfully")
            else:
                logger.warning("GitHub token was found but appears to be empty")
        else:
            logger.warning("No GitHub token found. API rate limits will be restricted.")
        
        self.data_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data')
        self._ensure_data_directory()

    def _ensure_data_directory(self):
        """Ensure the data directory exists."""
        os.makedirs(self.data_dir, exist_ok=True)

    async def _safe_request(self, session: aiohttp.ClientSession, url: str, timeout: int = 30) -> Dict:
        """Make a safe HTTP request with timeout and error handling."""
        try:
            # Add additional debugging for GitHub API calls
            if 'api.github.com' in url:
                auth_header = self.headers.get('Authorization', 'None')
                masked_header = 'None' if auth_header == 'None' else f"{auth_header.split(' ')[0]} {'*' * 10}"
                logger.debug(f"GitHub API request to {url} with auth: {masked_header}")
                
            async with session.get(url, timeout=aiohttp.ClientTimeout(total=timeout)) as response:
                if response.status == 200:
                    return await response.json()
                elif response.status == 403:
                    # Check if this is a rate limit issue
                    remaining = response.headers.get('X-RateLimit-Remaining')
                    reset_time = response.headers.get('X-RateLimit-Reset')
                    
                    if remaining == '0' and reset_time:
                        reset_datetime = datetime.fromtimestamp(int(reset_time))
                        wait_time = (reset_datetime - datetime.now()).total_seconds()
                        logger.error(f"GitHub API rate limit exceeded. Resets in {wait_time:.0f} seconds at {reset_datetime}")
                    else:
                        logger.error(f"Access forbidden for URL: {url}")
                    return {}
                elif response.status == 404:
                    logger.error(f"Resource not found at URL: {url}")
                    return {}
                else:
                    logger.error(f"HTTP {response.status} error for URL: {url}")
                    return {}
        except asyncio.TimeoutError:
            logger.error(f"Request timed out for URL: {url}")
            return {}
        except aiohttp.ClientError as e:
            logger.error(f"Client error for URL {url}: {str(e)}")
            return {}
        except json.JSONDecodeError as e:
            logger.error(f"JSON decode error for URL {url}: {str(e)}")
            return {}
        except Exception as e:
            logger.error(f"Unexpected error for URL {url}: {str(e)}")
            return {}

    async def get_github_devrel_programs(self) -> List[Dict]:
        """Get DevRel programs and resources from GitHub."""
        resources = []
        # Reduce the number of search terms to minimize API calls
        search_terms = [
            'awesome+devrel', 
            'devrel+resources',
            '"developer+relations"+handbook',
            'developer+experience+resources'
        ]

        async with aiohttp.ClientSession(headers=self.headers) as session:
            for term in search_terms:
                try:
                    # Check if we're hitting rate limits
                    try:
                        rate_limit_url = 'https://api.github.com/rate_limit'
                        rate_limit_data = await self._safe_request(session, rate_limit_url)
                        
                        if rate_limit_data and 'resources' in rate_limit_data:
                            core_limit = rate_limit_data['resources']['core']
                            search_limit = rate_limit_data['resources']['search']
                            
                            logger.info(f"GitHub API rate limits - Core: {core_limit['remaining']}/{core_limit['limit']}, "
                                       f"Search: {search_limit['remaining']}/{search_limit['limit']}")
                            
                            if search_limit['remaining'] < 3:
                                reset_time = datetime.fromtimestamp(search_limit['reset'])
                                wait_seconds = (reset_time - datetime.now()).total_seconds() + 10
                                
                                if wait_seconds > 0:
                                    logger.warning(f"GitHub search rate limit nearly exhausted. Waiting {wait_seconds:.0f} seconds until reset.")
                                    await asyncio.sleep(wait_seconds)
                    except Exception as e:
                        logger.error(f"Error checking rate limits: {str(e)}")
                    
                    # Make the search request with exponential backoff
                    max_retries = 3
                    retry_delay = 2
                    
                    for attempt in range(max_retries):
                        url = f'https://api.github.com/search/repositories?q={term}+in:name,description,readme&sort=stars&order=desc'
                        data = await self._safe_request(session, url)
                        
                        if data and 'items' in data:
                            repos = data.get('items', [])
                            total_count = data.get('total_count', 0)
                            logger.info(f"Found {total_count} repositories for term: {term}")
                            
                            # Process only the top repositories to reduce API calls
                            for repo in repos[:5]:  # Reduced from 10 to 5
                                # Validate repository data
                                if not all(key in repo for key in ['name', 'html_url', 'description', 'stargazers_count']):
                                    logger.warning(f"Skipping repository with incomplete data: {repo.get('name', 'unknown')}")
                                    continue

                                # Check for minimum stars to ensure quality
                                if repo['stargazers_count'] < 10:  # Increased threshold from 5 to 10
                                    continue

                                # Use the stargazers_count from the search result instead of making another API call
                                stargazers_count = repo['stargazers_count']

                                resources.append({
                                    'name': repo['name'],
                                    'url': repo['html_url'],
                                    'description': repo['description'] or '',
                                    'stars': stargazers_count,
                                    'language': repo.get('language', ''),
                                    'topics': repo.get('topics', []),
                                    'last_updated': repo.get('updated_at', ''),
                                    'source': 'github',
                                    'search_term': term,
                                    'type': 'repository'
                                })

                            # Successfully got data, break the retry loop
                            break
                        elif attempt < max_retries - 1:
                            # If we got a rate limit error, wait with exponential backoff
                            delay = retry_delay * (2 ** attempt)
                            logger.warning(f"GitHub API request failed, retrying in {delay} seconds...")
                            await asyncio.sleep(delay)
                        else:
                            logger.error(f"GitHub API request failed after {max_retries} attempts")

                    # Use a longer delay between search terms to avoid rate limits
                    await asyncio.sleep(5)
                except Exception as e:
                    logger.error(f"Error fetching GitHub data for term {term}: {str(e)}")
                    if 'rate limit' in str(e).lower():
                        logger.warning("Rate limit reached, waiting 60 seconds...")
                        await asyncio.sleep(60)
                    continue

        # Remove duplicates while preserving order
        seen = set()
        unique_resources = []
        for resource in resources:
            if resource['url'] not in seen:
                seen.add(resource['url'])
                unique_resources.append(resource)

        # Sort repositories by star count in descending order
        unique_resources.sort(key=lambda x: x.get('stars', 0), reverse=True)
        
        logger.info(f"Found {len(unique_resources)} unique DevRel resources on GitHub")
        
        # Save to file
        self.save_resources('github_programs', unique_resources)
        return unique_resources

    def get_devrel_blog_posts(self) -> List[Dict]:
        """Get blog posts from various DevRel sources using RSS/Atom feeds."""
        blog_posts = []
        logging.info("Starting blog post collection")

        # DevRel.net RSS feed
        logging.info("Fetching DevRel.net RSS feed")
        try:
            feed = feedparser.parse('https://devrel.net/feed')
            if feed.entries:
                logging.info(f"Found {len(feed.entries)} posts from DevRel.net")
                for entry in feed.entries[:20]:  # Get latest 20 posts
                    blog_posts.append({
                        'title': entry.title,
                        'url': entry.link,
                        'source': 'devrel.net',
                        'published_date': entry.published if hasattr(entry, 'published') else '',
                        'excerpt': entry.summary if hasattr(entry, 'summary') else '',
                        'type': 'blog_post'
                    })
            else:
                logging.warning("No entries found in DevRel.net RSS feed")
        except Exception as e:
            logging.error(f"Error fetching DevRel.net RSS: {str(e)}")

        # Various DevRel blogs - try multiple feed URLs
        logging.info("Fetching various DevRel blog feeds")
        feed_urls = [
            'https://dev.to/feed',
            'https://medium.com/feed/tag/developer-advocacy',
            'https://medium.com/feed/tag/developer-relations',
            'https://medium.com/feed/tag/devrel',
            'https://medium.com/feed/tag/developer-experience',
            'https://developerrelations.com/feed',
            'https://developerrelations.com/rss',
            'https://developerrelations.com/atom',
            'https://developerrelations.com/rss.xml'
        ]

        for feed_url in feed_urls:
            try:
                feed = feedparser.parse(feed_url)
                if feed.entries:
                    logging.info(f"Found {len(feed.entries)} posts from DevRel blogs at {feed_url}")
                    for entry in feed.entries[:20]:
                        blog_posts.append({
                            'title': entry.title,
                            'url': entry.link,
                            'source': feed_url.split('/')[2],
                            'published_date': entry.published if hasattr(entry, 'published') else '',
                            'excerpt': entry.summary if hasattr(entry, 'summary') else '',
                            'type': 'blog_post'
                        })
                    break  # Found working feed, no need to try others
                else:
                    logging.warning(f"No entries found in feed: {feed_url}")
            except Exception as e:
                logging.warning(f"Error fetching feed {feed_url}: {str(e)}")

        # Developer Relations blog - try multiple feed URLs
        logging.info("Fetching Developer Relations blog feed")
        feed_urls = [
            'https://developerrelations.com/feed',
            'https://developerrelations.com/rss',
            'https://developerrelations.com/atom',
            'https://developerrelations.com/rss.xml'
        ]

        for feed_url in feed_urls:
            try:
                feed = feedparser.parse(feed_url)
                if feed.entries:
                    logging.info(f"Found {len(feed.entries)} posts from Developer Relations blog at {feed_url}")
                    for entry in feed.entries[:20]:
                        blog_posts.append({
                            'title': entry.title,
                            'url': entry.link,
                            'source': 'developerrelations.com',
                            'published_date': entry.published if hasattr(entry, 'published') else '',
                            'excerpt': entry.summary if hasattr(entry, 'summary') else '',
                            'type': 'blog_post'
                        })
                    break  # Found working feed, no need to try others
                else:
                    logging.warning(f"No entries found in feed: {feed_url}")
            except Exception as e:
                logging.warning(f"Error fetching feed {feed_url}: {str(e)}")

        logging.info(f"Completed blog post collection. Total posts found: {len(blog_posts)}")
        return blog_posts

    async def get_github_programs_async(self, session: aiohttp.ClientSession) -> List[Dict]:
        """Fetch GitHub programs asynchronously with timeout."""
        try:
            logger.info("Starting GitHub programs fetch")
            tasks = [
                self._safe_request(session, f'https://api.github.com/search/repositories?q={query}&sort=stars&order=desc')
                for query in [
                    'developer+relations+program',
                    'devrel+program',
                    'developer+advocacy',
                    'developer+community'
                ]
            ]

            # Wait for all requests with timeout
            results = await asyncio.gather(*tasks, return_exceptions=True)

            all_programs = []
            for result in results:
                if isinstance(result, Exception):
                    logger.error(f"Error in GitHub request: {str(result)}")
                    continue

                if isinstance(result, dict) and 'items' in result:
                    for repo in result['items']:
                        program = {
                            'name': repo['full_name'],
                            'url': repo['html_url'],
                            'description': repo.get('description', ''),
                            'stars': repo.get('stargazers_count', 0),
                            'language': repo.get('language', ''),
                            'topics': repo.get('topics', []),
                            'last_updated': repo.get('updated_at', '')
                        }
                        if program not in all_programs:  # Avoid duplicates
                            all_programs.append(program)

            logger.info(f"Successfully fetched {len(all_programs)} GitHub programs")
            return all_programs

        except asyncio.TimeoutError:
            logger.error(f"GitHub programs fetch timed out after {self.timeout.total} seconds")
            return []
        except Exception as e:
            logger.error(f"Error in get_github_programs_async: {str(e)}")
            return []

    async def get_blog_posts_async(self, session: aiohttp.ClientSession) -> list:
        """
        Get blog posts from feeds
        """
        logger.info("Fetching blog posts")
        results = []
        
        # DevRel-specific terms to search for
        devrel_terms = [
            "devrel", "developer relations", "developer advocacy", "developer experience", 
            "community", "developer marketing", "developer advocate"
        ]
        
        # List of known good DevRel-specific RSS/Atom feeds that actually work
        devrel_feeds = [
            # Direct API endpoints that usually work better
            "https://api.rss2json.com/v1/api.json?rss_url=https://dev.to/feed/tag/devrel",
            "https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/tag/developer-relations",
            "https://api.rss2json.com/v1/api.json?rss_url=https://developerrelations.com/feed",
            "https://api.rss2json.com/v1/api.json?rss_url=https://devrel.net/feed",
            "https://api.rss2json.com/v1/api.json?rss_url=https://hackernoon.com/feed/tagged/developer-relations"
        ]
        
        # Popular tech blogs to check for DevRel content (will be filtered by keywords)
        tech_blogs = [
            "https://api.rss2json.com/v1/api.json?rss_url=https://techcrunch.com/feed",
            "https://api.rss2json.com/v1/api.json?rss_url=https://feeds.feedburner.com/thenextweb"
        ]
        
        # Combine the two lists, but we'll track which feeds are DevRel-specific
        all_feeds = [(feed, True) for feed in devrel_feeds] + [(feed, False) for feed in tech_blogs]
        successful_feeds = 0
        failed_feeds = 0

        # Process each feed
        for feed_url, is_devrel_specific in all_feeds:
            try:
                logger.info(f"Fetching feed from {feed_url}")
                
                # Try to fetch with increased timeout
                async with session.get(feed_url, headers=self.headers, timeout=aiohttp.ClientTimeout(total=60)) as response:
                    if response.status != 200:
                        logger.warning(f"Failed to fetch feed from {feed_url}, status code: {response.status}")
                        failed_feeds += 1
                        continue
                    
                    try:
                        data = await response.json()
                        items = data.get('items', [])
                    except Exception as e:
                        logger.error(f"Error parsing JSON from {feed_url}: {str(e)}")
                        failed_feeds += 1
                        continue
                
                # Process items
                for item in items:
                    # Skip items without titles or links
                    if not item.get('title') or not item.get('link'):
                        continue
                    
                    title = item.get('title', '')
                    description = item.get('description', '')
                    link = item.get('link', '')
                    pub_date = item.get('pubDate', '')
                    
                    # Parse and format the publication date
                    try:
                        if pub_date:
                            # Handle multiple date formats
                            try:
                                dt = datetime.fromisoformat(pub_date.replace('Z', '+00:00').replace(' ', 'T'))
                            except ValueError:
                                # Try with dateutil parser as fallback
                                from dateutil import parser
                                dt = parser.parse(pub_date)
                            formatted_date = dt.strftime('%Y-%m-%d %H:%M:%S')
                        else:
                            formatted_date = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                    except Exception:
                        # If date parsing fails, use current date
                        formatted_date = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                    
                    # Calculate relevance score
                    relevance_score = sum(1 for term in devrel_terms if term.lower() in f"{title} {description}".lower())
                    
                    # For DevRel-specific feeds, include all items
                    # For general tech blogs, only include items with a relevance score > 0
                    if is_devrel_specific or relevance_score > 0:
                        # Create a blog post dictionary
                        blog_post = {
                            "title": title,
                            "description": self._clean_html(description),
                            "link": link,
                            "date": formatted_date,
                            "source": feed_url,
                            "resource_type": "blog",
                            "relevance_score": relevance_score
                        }
                        results.append(blog_post)
                
                successful_feeds += 1
                
            except Exception as e:
                logger.error(f"Error fetching blog posts from {feed_url}: {str(e)}")
                failed_feeds += 1
        
        # Remove duplicates based on URL
        unique_results = []
        seen_urls = set()
        for post in results:
            if post['link'] not in seen_urls:
                seen_urls.add(post['link'])
                unique_results.append(post)
        
        # Sort by relevance score (highest first) and then by date (newest first)
        sorted_results = sorted(
            unique_results, 
            key=lambda x: (-x.get('relevance_score', 0), x.get('date', '0000-00-00')), 
            reverse=True
        )
        
        logger.info(f"Successfully fetched {len(sorted_results)} blog posts from {successful_feeds} feeds. {failed_feeds} feeds failed.")
        return sorted_results

    async def get_job_listings_async(self) -> List[Dict]:
        """Get job listings from various sources asynchronously."""
        try:
            logger.info("Starting job listings fetch")
            async with aiohttp.ClientSession(timeout=self.timeout) as session:
                # Add headers to avoid rate limiting
                headers = {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
                session._default_headers = headers

                # DevRel-specific keywords for filtering
                devrel_keywords = [
                    'developer relations', 'devrel', 'developer advocate',
                    'developer advocacy', 'technical evangelist', 'developer evangelist',
                    'developer experience', 'dx engineer', 'developer education',
                    'community manager', 'api evangelist', 'community advocate',
                    'community evangelist', 'developer community'
                ]

                # Keywords that indicate a role is NOT a DevRel position
                negative_keywords = [
                    'account executive', 'sales development', 'business developer',
                    'finance analyst', 'graphic designer', 'production designer',
                    'solutions engineer', 'engineering manager', 'product manager',
                    'program manager', 'talent acquisition', 'recruiter', 'billing',
                    'machine learning engineer', 'principal engineer', 'data scientist',
                    'analytics', 'platform engineer', 'software engineer', 'swe',
                    'frontend', 'backend', 'full stack', 'fullstack', 'full-stack',
                    'devops', 'sre', 'reliability', 'security engineer', 'sales manager',
                    'sales representative', 'business development', 'enterprise',
                    'account manager', 'customer success', 'support engineer',
                    'product designer', 'ui designer', 'ux designer', 'data engineer',
                    'infrastructure', 'network engineer', 'systems engineer',
                    'qa engineer', 'quality assurance', 'technical writer',
                    'content writer', 'marketing manager', 'growth manager',
                    'operations manager', 'project coordinator', 'scrum master',
                    'agile coach', 'business analyst', 'financial analyst',
                    'hr manager', 'recruiter', 'talent specialist', 'office manager',
                    'executive assistant', 'administrative', 'coordinator',
                    'business operations', 'sales operations', 'revenue operations'
                ]

                # Companies known for having dedicated DevRel teams
                devrel_focused_companies = {
                    'stripe', 'twilio', 'github', 'google', 'microsoft',
                    'aws', 'digitalocean', 'netlify', 'vercel', 'mongodb',
                    'hashicorp', 'docker', 'gitlab', 'atlassian', 'auth0',
                    'postman', 'datadog', 'elastic', 'contentful', 'shopify'
                }

                # Fetch jobs from different sources
                tasks = [
                    self._parse_linkedin_jobs(session, 'https://www.linkedin.com/jobs/developer-relations-jobs'),
                    asyncio.sleep(2),
                    self._parse_linkedin_jobs(session, 'https://www.linkedin.com/jobs/developer-advocate-jobs'),
                    asyncio.sleep(2),
                    self._parse_linkedin_jobs(session, 'https://www.linkedin.com/jobs/technical-evangelist-jobs'),
                    self._parse_lever_jobs(session, 'https://jobs.lever.co/search?team=Developer%20Relations'),
                    # Use the jobs/search endpoint for Greenhouse
                    self._parse_greenhouse_jobs(session, 'https://boards-api.greenhouse.io/v1/boards/stripe/jobs?content=true'),
                    self._parse_greenhouse_jobs(session, 'https://boards-api.greenhouse.io/v1/boards/twilio/jobs?content=true')
                ]

                results = await asyncio.gather(*tasks, return_exceptions=True)
                all_jobs = []

                for result in results:
                    if isinstance(result, Exception):
                        logger.error(f"Error in job fetch: {str(result)}")
                        continue
                    if isinstance(result, list):
                        all_jobs.extend(result)

                # Filter for DevRel jobs and transform
                devrel_jobs = []
                for job in all_jobs:
                    title = job.get('title', '')
                    company = job.get('company', '')
                    description = job.get('description', '')

                    # Skip if it's a non-DevRel job from a major tech company
                    if company.lower() in {'stripe', 'twilio'} and not any(keyword in title.lower() for keyword in {
                        'developer relations', 'devrel', 'developer advocate', 'developer advocacy',
                        'technical evangelist', 'developer evangelist', 'developer experience',
                        'dx engineer', 'developer education', 'community manager',
                        'api evangelist', 'community advocate', 'community evangelist',
                        'developer community'
                    }):
                        continue

                    # Use the filtering method
                    if self._is_devrel_job(title, description, company):
                        devrel_jobs.append({
                            'title': job.get('title', 'Untitled Position'),
                            'url': job.get('url', ''),
                            'description': job.get('description', ''),
                            'type': 'job_listing',
                            'company': job.get('company', 'Unknown Company'),
                            'source': job.get('source', 'Unknown Source'),
                            'date': job.get('date', datetime.now().strftime('%Y-%m-%d')),
                            'locations': job.get('locations', ['Remote/Unspecified'])
                        })

                logger.info(f"Found {len(devrel_jobs)} DevRel job listings after filtering")
                return devrel_jobs

        except Exception as e:
            logger.error(f"Error in get_job_listings_async: {str(e)}")
            return []

    async def _parse_linkedin_jobs(self, session: aiohttp.ClientSession, url: str) -> List[Dict]:
        """Parse LinkedIn job listings."""
        try:
            async with session.get(url, headers=self.headers) as response:
                if response.status == 200:
                    text = await response.text()
                    soup = BeautifulSoup(text, 'html.parser')
                    jobs = []

                    for job in soup.find_all('div', {'class': 'base-card'}):
                        try:
                            title_elem = job.find('h3', {'class': 'base-search-card__title'})
                            company_elem = job.find('h4', {'class': 'base-search-card__subtitle'})
                            location_elem = job.find('span', {'class': 'job-search-card__location'})
                            link_elem = job.find('a', {'class': 'base-card__full-link'})

                            if title_elem and link_elem:
                                jobs.append({
                                    'title': title_elem.get_text(strip=True),
                                    'company': company_elem.get_text(strip=True) if company_elem else '',
                                    'location': location_elem.get_text(strip=True) if location_elem else '',
                                    'url': link_elem.get('href', ''),
                                    'source': 'linkedin',
                                    'type': 'job_listing'
                                })
                        except Exception as e:
                            logger.warning(f"Error parsing LinkedIn job: {str(e)}")
                            continue

                    return jobs
                else:
                    logger.warning(f"LinkedIn request failed with status {response.status}")
                    return []
        except Exception as e:
            logger.error(f"Error fetching LinkedIn jobs: {str(e)}")
            return []

    async def _parse_lever_jobs(self, session: aiohttp.ClientSession, url: str) -> List[Dict]:
        """Parse Lever DevRel job listings."""
        try:
            async with session.get(url, headers=self.headers) as response:
                if response.status == 200:
                    text = await response.text()
                    soup = BeautifulSoup(text, 'html.parser')
                    jobs = []
                    job_cards = soup.find_all('div', {'class': 'posting'})

                    for card in job_cards:
                        try:
                            title = card.find('h5')
                            company = card.find('div', {'class': 'posting-company'})
                            location = card.find('span', {'class': 'location'})
                            link = card.find('a', {'class': 'posting-btn-submit'})

                            if title and link:
                                jobs.append({
                                    'title': title.text.strip(),
                                    'company': company.text.strip() if company else '',
                                    'location': location.text.strip() if location else '',
                                    'url': link['href'],
                                    'type': 'job_listing',
                                    'source': 'lever'
                                })
                        except Exception as e:
                            logger.error(f"Error parsing Lever job card: {str(e)}")
                            continue

                    return jobs
                return []
        except Exception as e:
            logger.error(f"Error parsing Lever jobs: {str(e)}")
            return []

    async def _parse_greenhouse_jobs(self, session: aiohttp.ClientSession, url: str) -> List[Dict]:
        """Parse Greenhouse DevRel job listings."""
        try:
            async with session.get(url) as response:
                if response.status != 200:
                    logger.error(f"HTTP {response.status} error for URL: {url}")
                    return []

                data = await response.json()
                jobs = []

                # Extract company name from URL
                company = url.split('/boards/')[1].split('/')[0] if '/boards/' in url else 'Unknown'

                # Parse jobs from the Greenhouse API response
                job_list = data.get('jobs', [])
                for job in job_list:
                    title = job.get('title', '')
                    description = job.get('content', '')
                    location = job.get('location', {}).get('name', '')
                    job_url = job.get('absolute_url', '')

                    # Only add jobs that pass the DevRel filtering criteria
                    if self._is_devrel_job(title, description, company):
                        jobs.append({
                            'title': title,
                            'company': company,
                            'url': job_url,
                            'description': description,
                            'locations': [location] if location else [],
                            'source': 'greenhouse',
                            'date': datetime.now().strftime('%Y-%m-%d')
                        })

        except Exception as e:
            logger.error(f"Error parsing Greenhouse jobs: {str(e)}")
            return []

        return jobs

    def _is_devrel_job(self, title: str, description: str, company: str) -> bool:
        """
        Check if a job posting is a Developer Relations role.
        Uses strict filtering for certain companies and checks for negative keywords.
        """
        title = title.lower()
        description = description.lower() if description else ""
        company = company.lower().strip() if company else ""

        # Exclude all jobs from these companies
        excluded_companies = {'stripe', 'twilio'}
        if company in excluded_companies or any(company.startswith(excluded) for excluded in excluded_companies):
            return False

        # Negative keywords that indicate non-DevRel roles
        negative_keywords = {
            'account executive', 'sales development', 'business developer',
            'finance analyst', 'graphic designer', 'production designer',
            'solutions engineer', 'engineering manager', 'product manager',
            'program manager', 'talent acquisition', 'recruiter', 'billing',
            'machine learning engineer', 'principal engineer', 'data scientist',
            'analytics', 'platform engineer', 'software engineer', 'swe',
            'frontend', 'backend', 'full stack', 'fullstack', 'full-stack',
            'devops', 'sre', 'reliability', 'security engineer', 'sales manager',
            'sales representative', 'business development', 'enterprise',
            'account manager', 'customer success', 'support engineer',
            'product designer', 'ui designer', 'ux designer', 'data engineer',
            'infrastructure', 'network engineer', 'systems engineer',
            'qa engineer', 'quality assurance', 'technical writer',
            'content writer', 'marketing manager', 'growth manager',
            'operations manager', 'project coordinator', 'scrum master',
            'agile coach', 'business analyst', 'financial analyst',
            'hr manager', 'recruiter', 'talent specialist', 'office manager',
            'executive assistant', 'administrative', 'coordinator',
            'business operations', 'sales operations', 'revenue operations'
        }

        # DevRel title keywords (must be in title)
        title_keywords = {
            'developer relations', 'devrel', 'developer advocate',
            'developer advocacy', 'technical evangelist', 'developer evangelist',
            'developer experience', 'dx engineer', 'developer education',
            'community manager', 'api evangelist', 'community advocate',
            'community evangelist', 'developer community', 'developer programs',
            'developer success', 'developer outreach', 'developer engagement',
            'developer ecosystem', 'developer platform', 'api advocate',
            'platform advocate', 'product educator', 'technical community',
            'dev community', 'dev rel', 'dev advocate', 'dx advocate',
            'dx manager', 'dx lead', 'devrel lead', 'devrel manager',
            'developer relations lead', 'developer relations manager',
            'developer advocate lead', 'developer advocate manager'
        }

        # Companies requiring strict title-only filtering
        strict_filtering_companies = {
            'stripe', 'twilio', 'microsoft', 'google', 'amazon', 'meta',
            'apple', 'netflix', 'uber', 'lyft', 'airbnb', 'twitter',
            'linkedin', 'adobe', 'salesforce', 'oracle', 'ibm', 'github',
            'gitlab', 'atlassian', 'hashicorp', 'digitalocean', 'mongodb',
            'elastic', 'datadog', 'snowflake', 'confluent', 'databricks',
            'new relic', 'dynatrace', 'splunk', 'okta', 'auth0', 'twitch',
            'roblox', 'unity', 'epic games', 'ea', 'activision', 'ubisoft'
        }

        # For major tech companies, only accept if DevRel keywords are in the title
        if company in strict_filtering_companies:
            return any(keyword in title for keyword in title_keywords)

        # For other companies, also check description
        description_keywords = {
            'developer community', 'developer ecosystem', 'api documentation',
            'technical content', 'developer education', 'developer experience',
            'developer engagement', 'developer success', 'developer outreach',
            'developer advocacy', 'developer evangelism', 'devrel',
            'developer platform', 'developer tools', 'sdk', 'api platform',
            'developer portal', 'developer hub', 'developer network',
            'developer program', 'developer relations', 'developer support',
            'technical community', 'api strategy', 'developer strategy'
        }

        # Check title first, then description
        return (
            any(keyword in title for keyword in title_keywords) or
            (description and any(keyword in description for keyword in description_keywords))
        )

    async def scrape_all(self) -> Dict[str, Any]:
        """Scrape DevRel GitHub programs, blogs, and job listings."""
        try:
            logger.info("Starting DevRel resource scraping")
            
            async with aiohttp.ClientSession(headers=self.headers, timeout=self.timeout) as session:
                # Run all scraping tasks concurrently
                github_programs_task = self.get_github_programs_async(session)
                blog_posts_task = self.get_blog_posts_async(session)
                job_listings_task = self.get_job_listings_async()
                
                # Gather results
                github_programs, blog_posts, job_listings = await asyncio.gather(
                    github_programs_task,
                    blog_posts_task,
                    job_listings_task
                )
                
                logger.info(f"Scraped resources: {len(github_programs)} GitHub programs, {len(blog_posts)} blog posts, {len(job_listings)} job listings")
                
                # Append results
                resources = await self.append_resources({
                    "github_programs": github_programs,
                    "blog_posts": blog_posts,
                    "job_listings": job_listings
                })
                
                return resources
                
        except Exception as e:
            logger.error(f"Error in scrape_all: {str(e)}")
            return {
                "error": str(e),
                "github_programs": [],
                "blog_posts": [],
                "job_listings": []
            }

    def _load_existing_resources(self) -> Dict:
        """Load existing resources from JSON files."""
        resources = {
            'github_programs': [],
            'blog_posts': [],
            'job_listings': []
        }

        file_mapping = {
            'github_programs': 'github_results.json',
            'blog_posts': 'blog_results.json',
            'job_listings': 'job_results.json'
        }

        for resource_type, filename in file_mapping.items():
            file_path = os.path.join(self.data_dir, filename)
            try:
                if os.path.exists(file_path):
                    with open(file_path, 'r') as f:
                        data = json.load(f)
                        if resource_type == 'job_listings':
                            # Migrate existing job listings to new format
                            job_dict = {}
                            for job in data:
                                key = (job.get('company', ''), job.get('title', ''))
                                if key not in job_dict:
                                    if 'location' in job and 'locations' not in job:
                                        job['locations'] = [job['location']]
                                        job.pop('location', None)
                                    job_dict[key] = job
                                else:
                                    existing_job = job_dict[key]
                                    if 'location' in job:
                                        locations = set(existing_job.get('locations', []))
                                        locations.add(job['location'])
                                        existing_job['locations'] = sorted(list(locations))
                            resources[resource_type] = sorted(
                                job_dict.values(),
                                key=lambda x: x.get('added_at', ''),
                                reverse=True
                            )
                        else:
                            resources[resource_type] = data
                    logger.info(f"Loaded {len(resources[resource_type])} existing {resource_type}")
            except Exception as e:
                logger.error(f"Error loading {filename}: {str(e)}")
                resources[resource_type] = []

        return resources

    def _normalize_string(self, s: str) -> str:
        """Normalize a string for comparison by removing special characters and converting to lowercase."""
        if not s:
            return ''
        # Remove special characters and convert to lowercase
        return ''.join(c.lower() for c in s if c.isalnum())

    def _get_job_key(self, job: Dict) -> tuple:
        """Get a normalized key for job deduplication."""
        company = self._normalize_string(job.get('company', ''))
        title = self._normalize_string(job.get('title', ''))
        return (company, title)

    async def append_resources(self, new_resources: Dict[str, List[Dict]]) -> Dict[str, List[Dict]]:
        """
        Append resources to existing data with 2-month filtering.
        
        Args:
            new_resources: Dictionary containing new resources to append
            
        Returns:
            Dictionary with combined resources
        """
        try:
            # Load existing resources
            existing_resources = self._load_existing_resources()
            
            # Set the current timestamp for newly added resources
            timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            
            # Create output structure
            result = {
                'github_programs': [],
                'blog_posts': [],
                'job_listings': []
            }
            
            # Calculate date 2 months ago for filtering
            two_months_ago = datetime.now() - timedelta(days=60)
            
            # Helper function to add a timestamp to resources
            def add_timestamp(resources, resource_type):
                for resource in resources:
                    if 'added_at' not in resource:
                        resource['added_at'] = timestamp
                    if 'resource_type' not in resource:
                        resource['resource_type'] = resource_type
                return resources
            
            # Process GitHub programs
            github_programs = add_timestamp(new_resources.get('github_programs', []), 'github')
            existing_github = existing_resources.get('github_programs', [])
            
            # Merge GitHub programs
            all_github = github_programs + existing_github
            github_dict = {}
            
            for program in all_github:
                key = program.get('url', '')  # Use url as key, not html_url
                if key and key not in github_dict:
                    github_dict[key] = program
            
            result['github_programs'] = sorted(
                github_dict.values(),
                key=lambda x: int(x.get('stars', 0)) if x.get('stars') else 0,  # Handle None values
                reverse=True
            )
            logger.info(f"Added {len(github_programs)} new GitHub repositories, total: {len(result['github_programs'])}")
            
            # Process blog posts - CRITICAL FIX: Keep existing blogs even if no new ones are fetched
            blog_posts = add_timestamp(new_resources.get('blog_posts', []), 'blog')
            existing_blogs = existing_resources.get('blog_posts', [])
            
            # IMPORTANT: If no new blog posts were fetched but we have existing ones, use existing
            if len(blog_posts) == 0 and len(existing_blogs) > 0:
                logger.warning("No new blog posts fetched but found existing ones - preserving existing blog posts")
                result['blog_posts'] = existing_blogs
                logger.info(f"Preserved {len(existing_blogs)} existing blog posts")
            else:
                # Normal merge with blog post relevance score handling
                all_blogs = blog_posts + existing_blogs
                blog_dict = {}
                
                for post in all_blogs:
                    key = post.get('link', '')
                    if not key:
                        continue
                        
                    if key not in blog_dict:
                        blog_dict[key] = post
                    elif key in blog_dict:
                        # If we already have this post, keep the one with higher relevance score
                        existing_score = blog_dict[key].get('relevance_score', 0)
                        new_score = post.get('relevance_score', 0)
                        if new_score > existing_score:
                            blog_dict[key] = post
                
                result['blog_posts'] = sorted(
                    blog_dict.values(),
                    key=lambda x: (-x.get('relevance_score', 0), x.get('date', '0000-00-00')),
                    reverse=True
                )
                logger.info(f"Added {len(blog_posts)} new blog posts, total: {len(result['blog_posts'])}")
            
            # Process job listings with 2-month filtering
            job_listings = add_timestamp(new_resources.get('job_listings', []), 'job')
            existing_jobs = existing_resources.get('job_listings', [])
            
            # Merge job listings
            all_jobs = job_listings + existing_jobs
            job_dict = {}
            filtered_count = 0
            
            for job in all_jobs:
                # Check if job is from within the last 2 months
                job_date_str = job.get('date', job.get('added_at', ''))
                if job_date_str:
                    try:
                        job_date = datetime.strptime(job_date_str, '%Y-%m-%d %H:%M:%S')
                        if job_date < two_months_ago:
                            filtered_count += 1
                            continue  # Skip jobs older than 2 months
                    except ValueError:
                        # If date parsing fails, try another format
                        try:
                            job_date = datetime.strptime(job_date_str, '%Y-%m-%d')
                            if job_date < two_months_ago:
                                filtered_count += 1
                                continue  # Skip jobs older than 2 months
                        except ValueError:
                            # Keep the job if we can't parse the date
                            pass
                
                # Use company and title as a unique key
                key = (job.get('company', ''), job.get('title', ''))
                if key and key not in job_dict:
                    # Normalize location field
                    if 'location' in job and 'locations' not in job:
                        job['locations'] = [job['location']]
                        job.pop('location', None)
                    job_dict[key] = job
                elif key in job_dict:
                    # If already exists, combine locations
                    existing_job = job_dict[key]
                    if 'location' in job:
                        locations = set(existing_job.get('locations', []))
                        locations.add(job['location'])
                        existing_job['locations'] = sorted(list(locations))
            
            result['job_listings'] = sorted(
                job_dict.values(),
                key=lambda x: x.get('added_at', ''),
                reverse=True
            )
            logger.info(f"Added {len(job_listings)} new job listings, filtered out {filtered_count} older than 2 months, total: {len(result['job_listings'])}")
            
            # Save results to disk
            await self._save_results(result)
            
            return result
        
        except Exception as e:
            logger.error(f"Error in append_resources: {str(e)}")
            traceback.print_exc()  # Print full traceback for better debugging
            # EMERGENCY RECOVERY: Return existing resources in case of error
            logger.warning("Error occurred during resource processing - returning existing resources")
            return existing_resources
    
    async def _save_results(self, results: Dict[str, List[Dict]]):
        """Save results to disk."""
        try:
            # Save GitHub results - fix filename
            github_path = os.path.join(self.data_dir, 'github_results.json')
            with open(github_path, 'w', encoding='utf-8') as f:
                json.dump(results['github_programs'], f, indent=2)
            
            # Save blog posts - ensure using the correct filename
            blogs_path = os.path.join(self.data_dir, 'blog_results.json')
            with open(blogs_path, 'w', encoding='utf-8') as f:
                json.dump(results['blog_posts'], f, indent=2)
            
            # Save job listings
            jobs_path = os.path.join(self.data_dir, 'job_results.json')
            with open(jobs_path, 'w', encoding='utf-8') as f:
                json.dump(results['job_listings'], f, indent=2)
            
            logger.info(f"Successfully saved results to disk: {github_path}, {blogs_path}, {jobs_path}")
        except Exception as e:
            logger.error(f"Error saving results to disk: {str(e)}")
            raise

    def save_resources(self, resources_type: str, resources: list):
        """Save resources to a JSON file."""
        file_path = os.path.join(self.data_dir, f'{resources_type}_results.json')
        
        # Load existing resources
        existing_resources = []
        if os.path.exists(file_path):
            with open(file_path, 'r') as f:
                existing_resources = json.load(f)
                
        logger.info(f"Loaded {len(existing_resources)} existing {resources_type}")
        
        # Add new resources
        existing_urls = {r['url'] for r in existing_resources}
        new_resources = [r for r in resources if r['url'] not in existing_urls]
        logger.info(f"Added {len(new_resources)} new {resources_type}")
        
        # Combine all resources
        all_resources = existing_resources + new_resources
        
        # Save all resources
        with open(file_path, 'w') as f:
            json.dump(all_resources, f, indent=2)

    async def get_devrel_job_listings(self):
        """Get DevRel job listings using the async implementation."""
        try:
            logger.info("Starting DevRel job listings fetch using async implementation")
            return await self.get_job_listings_async()
        except Exception as e:
            logger.error(f"Error in get_devrel_job_listings: {str(e)}")
            return []

    def _clean_html(self, html_text):
        """Clean HTML content by removing tags and unnecessary whitespace."""
        if not html_text:
            return ""
        
        try:
            # Use BeautifulSoup to remove HTML tags
            soup = BeautifulSoup(html_text, 'html.parser')
            text = soup.get_text(separator=' ', strip=True)
            
            # Remove extra whitespace
            text = ' '.join(text.split())
            
            # Truncate if too long (to prevent excessively large descriptions)
            if len(text) > 1000:
                text = text[:997] + "..."
                
            return text
        except Exception as e:
            logger.error(f"Error cleaning HTML: {str(e)}")
            # Return a cleaned version of the original without BeautifulSoup
            text = html_text.replace('<', ' <').replace('>', '> ')
            return ' '.join(text.split())[:1000]

def main():
    """Main function to run the scraper and save results."""
    try:
        logger.info("Starting scraper from main function")
        # Create a new event loop to run the async code
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
        # Run the scrape_all method in the event loop
        scraper = DevRelScraper()
        try:
            result = loop.run_until_complete(scraper.scrape_all())
            if result:
                logger.info("Scraping completed successfully")
            else:
                logger.error("Scraping encountered errors")
        finally:
            # Always close the loop
            loop.close()
    except Exception as e:
        logger.error(f"Error in main function: {str(e)}")

if __name__ == '__main__':
    main()

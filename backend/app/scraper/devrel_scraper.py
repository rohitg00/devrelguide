import os
import json
import time
import logging
import asyncio
import aiohttp
import requests
import feedparser
from typing import List, Dict, Optional, Any
from datetime import datetime
from bs4 import BeautifulSoup
from pathlib import Path

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
        github_token = os.environ.get('GITHUB_TOKEN')  # Use environ.get() to check current environment
        if github_token:
            self.headers['Authorization'] = f'Bearer {github_token}'  # Updated to use Bearer token
            logger.info("Using GitHub API authentication")
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
            async with session.get(url, timeout=aiohttp.ClientTimeout(total=timeout)) as response:
                if response.status == 200:
                    return await response.json()
                elif response.status == 403:
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
        search_terms = [
            'awesome+devrel', 'awesome+"developer+relations"',
            'devrel+resources', 'devrel+guide',
            '"developer+relations"+handbook',
            '"developer+advocacy"+guide',
            'devrel+community+building',
            'developer+experience+framework'
        ]

        async with aiohttp.ClientSession(headers=self.headers) as session:
            for term in search_terms:
                try:
                    url = f'https://api.github.com/search/repositories?q={term}+in:name,description,readme&sort=stars&order=desc'
                    data = await self._safe_request(session, url)

                    if data:
                        repos = data.get('items', [])
                        total_count = data.get('total_count', 0)
                        logger.info(f"Found {total_count} repositories for term: {term}")

                        for repo in repos[:10]:  # Get top 10 repos per search term
                            # Validate repository data
                            if not all(key in repo for key in ['name', 'html_url', 'description', 'stargazers_count']):
                                logger.warning(f"Skipping repository with incomplete data: {repo.get('name', 'unknown')}")
                                continue

                            # Check for minimum stars to ensure quality
                            if repo['stargazers_count'] < 5:
                                continue

                            # Get detailed repo info to ensure accurate stargazer count
                            repo_url = f"https://api.github.com/repos/{repo['full_name']}"
                            detailed_repo = await self._safe_request(session, repo_url)
                            
                            if detailed_repo:
                                stargazers_count = detailed_repo.get('stargazers_count', repo['stargazers_count'])
                            else:
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

                    # Respect GitHub API rate limits
                    await asyncio.sleep(2)
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

    async def get_github_programs_async(self, timeout=30):
        """Fetch GitHub programs asynchronously with timeout."""
        try:
            logger.info("Starting GitHub programs fetch")
            async with aiohttp.ClientSession() as session:
                tasks = []
                for query in [
                    'developer+relations+program',
                    'devrel+program',
                    'developer+advocacy',
                    'developer+community'
                ]:
                    url = f'https://api.github.com/search/repositories?q={query}&sort=stars&order=desc'
                    tasks.append(self._safe_request(session, url))

                # Wait for all requests with timeout
                results = await asyncio.gather(*tasks, return_exceptions=True)

                all_programs = []
                for result in results:
                    if isinstance(result, Exception):
                        logger.error(f"Error in GitHub request: {str(result)}")
                        continue

                    if result and 'items' in result:
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
            logger.error(f"GitHub programs fetch timed out after {timeout} seconds")
            return []
        except Exception as e:
            logger.error(f"Error in get_github_programs_async: {str(e)}")
            return []

    async def get_blog_posts_async(self, timeout=30):
        """Fetch blog posts asynchronously with timeout."""
        try:
            logger.info("Starting blog posts fetch")
            async with aiohttp.ClientSession() as session:
                tasks = []
                blog_urls = [
                    'https://api.rss2json.com/v1/api.json?rss_url=https://devrel.net/feed',
                    'https://api.rss2json.com/v1/api.json?rss_url=https://www.developeradvocates.net/feed'
                ]

                for url in blog_urls:
                    tasks.append(self._safe_request(session, url))

                # Wait for all requests with timeout
                results = await asyncio.gather(*tasks, return_exceptions=True)

                all_posts = []
                for result in results:
                    if isinstance(result, Exception):
                        logger.error(f"Error in blog request: {str(result)}")
                        continue

                    if result and 'items' in result:
                        for post in result['items']:
                            blog_post = {
                                'title': post.get('title', ''),
                                'url': post.get('link', ''),
                                'description': post.get('description', ''),
                                'author': post.get('author', ''),
                                'published_date': post.get('pubDate', '')
                            }
                            if blog_post not in all_posts:  # Avoid duplicates
                                all_posts.append(blog_post)

                logger.info(f"Successfully fetched {len(all_posts)} blog posts")
                return all_posts

        except asyncio.TimeoutError:
            logger.error(f"Blog posts fetch timed out after {timeout} seconds")
            return []
        except Exception as e:
            logger.error(f"Error in get_blog_posts_async: {str(e)}")
            return []

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

    async def scrape_all_async(self):
        """Scrape all resources asynchronously."""
        try:
            logger.info("Starting async resource scraping")

            # Create tasks for all resource types
            tasks = [
                self.get_github_devrel_programs(),
                self.get_blog_posts_async(),
                self.get_job_listings_async()  # Use get_job_listings_async directly
            ]

            # Wait for all tasks to complete
            results = await asyncio.gather(*tasks, return_exceptions=True)

            # Process results and handle any exceptions
            github_programs = []
            blog_posts = []
            job_listings = []

            for i, result in enumerate(results):
                if isinstance(result, Exception):
                    logger.error(f"Error in async scraping task {i}: {str(result)}")
                    continue

                if i == 0:  # GitHub programs
                    github_programs = result or []
                elif i == 1:  # Blog posts
                    blog_posts = result or []
                elif i == 2:  # Job listings
                    job_listings = result or []

            # Load existing resources
            existing = self._load_existing_resources()

            # Append new resources
            updated = self.append_resources({
                'github_programs': github_programs,
                'blog_posts': blog_posts,
                'job_listings': job_listings
            }, existing)

            logger.info(f"Resource counts - GitHub: {len(updated['github_programs'])}, "
                       f"Blogs: {len(updated['blog_posts'])}, Jobs: {len(updated['job_listings'])}")

            return updated

        except Exception as e:
            logger.error(f"Error in scrape_all_async: {str(e)}")
            return self._load_existing_resources()

    def scrape_all(self):
        """Synchronous wrapper for async scraping."""
        try:
            # Create a new event loop instead of getting the current one
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            
            try:
                # Run scraping
                results = loop.run_until_complete(self.scrape_all_async())
            finally:
                # Always close the loop to prevent warnings
                loop.close()
            
            # Load existing resources
            existing = self._load_existing_resources()
            
            # Merge new resources with existing ones
            merged = self.append_resources(results, existing)
            
            # Save GitHub results
            github_path = os.path.join(self.data_dir, 'github_results.json')
            with open(github_path, 'w', encoding='utf-8') as f:
                json.dump(merged['github_programs'], f, indent=2)
            
            # Save blog posts
            blogs_path = os.path.join(self.data_dir, 'blog_results.json')
            with open(blogs_path, 'w', encoding='utf-8') as f:
                json.dump(merged['blog_posts'], f, indent=2)
            
            # Save job listings
            jobs_path = os.path.join(self.data_dir, 'job_results.json')
            with open(jobs_path, 'w', encoding='utf-8') as f:
                # Deduplicate one final time before saving
                job_dict = {}
                for job in merged['job_listings']:
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
                
                # Convert back to list and sort by added_at
                final_jobs = sorted(
                    job_dict.values(),
                    key=lambda x: x.get('added_at', ''),
                    reverse=True
                )
                json.dump(final_jobs, f, indent=2)
            
            return merged
            
        except Exception as e:
            logger.error(f"Error in scrape_all: {str(e)}")
            return self._load_existing_resources()

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

    def append_resources(self, new_resources: Dict, existing_resources: Dict) -> Dict:
        """Append new resources to existing ones without duplicates."""
        merged = existing_resources.copy()

        for resource_type in ['github_programs', 'blog_posts', 'job_listings']:
            if resource_type not in merged:
                merged[resource_type] = []

            if resource_type in new_resources:
                # Add timestamp to new resources
                current_time = datetime.utcnow().isoformat()
                for resource in new_resources[resource_type]:
                    if not resource.get('added_at'):  # Only add timestamp if not already present
                        resource['added_at'] = current_time

                if resource_type == 'job_listings':
                    # For job listings, deduplicate based on normalized company and title
                    job_dict = {}
                    
                    # First process existing jobs
                    for job in merged[resource_type]:
                        key = self._get_job_key(job)
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
                                job.pop('location', None)
                    
                    # Then process new jobs
                    for job in new_resources[resource_type]:
                        key = self._get_job_key(job)
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
                                job.pop('location', None)
                    
                    # Convert back to list and sort
                    merged[resource_type] = sorted(
                        job_dict.values(),
                        key=lambda x: x.get('added_at', ''),
                        reverse=True
                    )
                else:
                    # For other resource types, deduplicate based on URL
                    existing_urls = {r.get('url', '') for r in merged[resource_type]}
                    new_items = [
                        r for r in new_resources[resource_type]
                        if r.get('url', '') and r.get('url', '') not in existing_urls
                    ]
                    merged[resource_type].extend(new_items)
                    
                    # Sort GitHub programs by stars, others by added_at
                    if resource_type == 'github_programs':
                        merged[resource_type].sort(
                            key=lambda x: x.get('stars', 0),
                            reverse=True
                        )
                    else:
                        merged[resource_type].sort(
                            key=lambda x: x.get('added_at', ''),
                            reverse=True
                        )
                
                logger.info(f"Added {len(new_items if resource_type != 'job_listings' else new_resources[resource_type])} new {resource_type}")

        return merged

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

def main():
    """Main function to run the scraper and save results."""
    scraper = DevRelScraper()
    success = scraper.scrape_all()

    if success:
        logger.info("Scraping completed successfully")
    else:
        logger.error("Scraping encountered errors")

if __name__ == '__main__':
    main()

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
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Connection': 'keep-alive'
        }
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

    def get_github_devrel_programs(self) -> List[Dict]:
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

        # First, search for general DevRel resources
        for term in search_terms:
            try:
                url = f'https://api.github.com/search/repositories?q={term}+in:name,description,readme&sort=stars&order=desc'
                response = self._safe_request(url)

                if response and response.ok:
                    data = response.json()
                    repos = data.get('items', [])
                    total_count = data.get('total_count', 0)
                    logging.info(f"Found {total_count} repositories for term: {term}")

                    for repo in repos[:10]:  # Get top 10 repos per search term
                        # Validate repository data
                        if not all(key in repo for key in ['name', 'html_url', 'description', 'stargazers_count']):
                            logging.warning(f"Skipping repository with incomplete data: {repo.get('name', 'unknown')}")
                            continue

                        # Check for minimum stars to ensure quality
                        if repo['stargazers_count'] < 5:
                            continue

                        resources.append({
                            'name': repo['name'],
                            'url': repo['html_url'],
                            'description': repo['description'] or '',
                            'stars': repo['stargazers_count'],
                            'source': 'github',
                            'search_term': term,
                            'type': 'repository',
                            'topics': repo.get('topics', []),
                            'last_updated': repo.get('updated_at', ''),
                            'language': repo.get('language', '')
                        })

                else:
                    logging.warning(f"Failed to fetch GitHub results for term {term}")

                # Respect GitHub API rate limits
                time.sleep(2)
            except Exception as e:
                logging.error(f"Error fetching GitHub data for term {term}: {str(e)}")
                if 'rate limit' in str(e).lower():
                    logging.warning("Rate limit reached, waiting 60 seconds...")
                    time.sleep(60)
                continue

        # Remove duplicates while preserving order
        seen = set()
        unique_resources = []
        for resource in resources:
            if resource['url'] not in seen:
                seen.add(resource['url'])
                unique_resources.append(resource)

        logging.info(f"Found {len(unique_resources)} unique DevRel resources on GitHub")
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

        # Mary Thengvall's blog - try multiple feed URLs
        logging.info("Fetching Mary Thengvall's blog feed")
        feed_urls = [
            'https://www.marythengvall.com/blog?format=rss',
            'https://www.marythengvall.com/blog?format=atom',
            'https://www.marythengvall.com/feed',
            'https://www.marythengvall.com/rss.xml'
        ]

        for feed_url in feed_urls:
            try:
                feed = feedparser.parse(feed_url)
                if feed.entries:
                    logging.info(f"Found {len(feed.entries)} posts from Mary Thengvall's blog at {feed_url}")
                    for entry in feed.entries[:20]:
                        blog_posts.append({
                            'title': entry.title,
                            'url': entry.link,
                            'source': 'marythengvall.com',
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
                # DevRel Keywords for Filtering
                devrel_keywords = [
                    'developer relations', 'devrel', 'developer advocate',
                    'developer advocacy', 'developer community', 'technical evangelist',
                    'developer experience', 'dx', 'developer education',
                    'developer marketing', 'api evangelist'
                ]

                # Fetch jobs from different sources
                tasks = [
                    self._parse_linkedin_jobs(session, 'https://www.linkedin.com/jobs/developer-relations-jobs'),
                    self._parse_lever_jobs(session, 'https://jobs.lever.co/search?team=Developer%20Relations'),
                    self._parse_greenhouse_jobs(session, 'https://boards.greenhouse.io/search?query=developer+relations')
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
                    if any(keyword in job.get('title', '').lower() or
                          keyword in job.get('description', '').lower()
                          for keyword in devrel_keywords):
                        devrel_jobs.append({
                            'title': job.get('title', 'Untitled Position'),
                            'url': job.get('url', ''),
                            'description': job.get('description', ''),
                            'type': 'job_listing',
                            'company': job.get('company', 'Unknown Company'),
                            'location': job.get('location', 'Remote/Unspecified'),
                            'date': job.get('date', datetime.now().strftime('%Y-%m-%d'))
                        })

                logger.info(f"Found {len(devrel_jobs)} DevRel job listings")
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
            async with session.get(url, headers=self.headers) as response:
                if response.status == 200:
                    text = await response.text()
                    soup = BeautifulSoup(text, 'html.parser')
                    jobs = []
                    job_cards = soup.find_all('div', {'class': 'opening'})

                    for card in job_cards:
                        try:
                            title = card.find('a', {'class': 'opening-title'})
                            company = card.find('div', {'class': 'company-name'})
                            location = card.find('span', {'class': 'location'})

                            if title:
                                jobs.append({
                                    'title': title.text.strip(),
                                    'company': company.text.strip() if company else '',
                                    'location': location.text.strip() if location else '',
                                    'url': f"https://boards.greenhouse.io{title['href']}" if title.get('href') else '',
                                    'type': 'job_listing',
                                    'source': 'greenhouse'
                                })
                        except Exception as e:
                            logger.error(f"Error parsing Greenhouse job card: {str(e)}")
                            continue

                    return jobs
                return []
        except Exception as e:
            logger.error(f"Error parsing Greenhouse jobs: {str(e)}")
            return []

    async def scrape_all_async(self):
        """Scrape all resources asynchronously."""
        try:
            logger.info("Starting async resource scraping")

            # Create tasks for all resource types
            tasks = [
                self.get_github_programs_async(),
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

    def scrape_all(self) -> bool:
        """Synchronous wrapper for async scraping."""
        return asyncio.run(self.scrape_all_async())

    async def get_devrel_job_listings(self):
        """Get DevRel job listings using the async implementation."""
        try:
            logger.info("Starting DevRel job listings fetch using async implementation")
            return await self.get_job_listings_async()
        except Exception as e:
            logger.error(f"Error in get_devrel_job_listings: {str(e)}")
            return []

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
                        resources[resource_type] = json.load(f)
                    logger.info(f"Loaded {len(resources[resource_type])} existing {resource_type}")
            except Exception as e:
                logger.error(f"Error loading {filename}: {str(e)}")
                # Continue with empty list if file can't be loaded
                resources[resource_type] = []

        return resources

    def append_resources(self, new_resources: Dict, existing_resources: Dict) -> Dict:
        """Append new resources to existing ones without duplicates."""
        merged = existing_resources.copy()

        for resource_type in ['github_programs', 'blog_posts', 'job_listings']:
            if resource_type not in merged:
                merged[resource_type] = []

            if resource_type in new_resources:
                # Create unique identifier based on URL
                existing_urls = {item.get('url') for item in merged[resource_type]}

                # Only append items with new URLs
                new_items = [
                    item for item in new_resources[resource_type]
                    if item.get('url') and item['url'] not in existing_urls
                ]

                # Add timestamp for tracking
                for item in new_items:
                    item['added_at'] = datetime.utcnow().isoformat()

                merged[resource_type].extend(new_items)

                # Save the updated resources
                output_file = os.path.join(
                    self.data_dir,
                    f"{resource_type.replace('_programs', '_results')}.json"
                )
                with open(output_file, 'w') as f:
                    json.dump(merged[resource_type], f, indent=2)

                logger.info(f"Appended {len(new_items)} new items to {resource_type}")

        return merged

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

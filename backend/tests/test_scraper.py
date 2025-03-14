import sys
import os
import logging
import pytest
import asyncio
from pathlib import Path

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Add the parent directory to Python path to allow imports
sys.path.append(str(Path(__file__).parent.parent))

@pytest.mark.asyncio
async def test_scraper():
    """Test the DevRelScraper functionality independently."""
    try:
        from app.scraper.devrel_scraper import DevRelScraper

        logger.info("Initializing DevRelScraper...")
        scraper = DevRelScraper()

        # Test GitHub programs scraping
        logger.info("Testing GitHub programs scraping...")
        github_results = await scraper.get_github_programs_async()
        logger.info(f"Found {len(github_results)} GitHub programs")
        assert len(github_results) > 0

        # Test blog posts scraping
        logger.info("Testing blog posts scraping...")
        blog_results = await scraper.get_blog_posts_async()
        logger.info(f"Found {len(blog_results)} blog posts")
        assert len(blog_results) > 0

        # Test job listings scraping (using test mode)
        logger.info("Testing job listings scraping...")
        job_results = await scraper.get_job_listings_async(test_mode=True)
        logger.info(f"Found {len(job_results)} job listings")
        assert len(job_results) > 0
        assert job_results[0]['type'] == 'job_listing'
        assert 'title' in job_results[0]
        assert 'company' in job_results[0]
        assert 'location' in job_results[0]
        assert 'url' in job_results[0]

    except Exception as e:
        logger.error(f"Error testing scraper: {str(e)}")
        assert False

if __name__ == "__main__":
    pytest.main([__file__])

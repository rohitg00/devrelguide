#!/usr/bin/env python3
"""
Automated script to periodically update DevRel resources.
This script runs the scraper and updates the data files with new information.
"""

import os
import sys
import json
import logging
import time
from datetime import datetime
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, TimeoutError

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Import scraper using absolute import
from app.scraper.devrel_scraper import DevRelScraper

async def update_resources():
    """Update DevRel resources by running the scraper and saving results."""
    try:
        logger.info("Initializing DevRelScraper...")
        # Initialize scraper
        scraper = DevRelScraper()

        # Run scraping process with detailed progress tracking
        logger.info("Starting GitHub programs scraping...")
        try:
            github_resources = await scraper.get_github_programs_async()
            logger.info(f"Found {len(github_resources)} GitHub DevRel programs")
        except Exception as e:
            logger.error(f"Error fetching GitHub resources: {str(e)}")
            github_resources = []

        logger.info("Starting blog posts scraping...")
        try:
            blog_posts = await scraper.get_blog_posts_async()
            logger.info(f"Found {len(blog_posts)} blog posts")
        except Exception as e:
            logger.error(f"Error fetching blog posts: {str(e)}")
            blog_posts = []

        logger.info("Starting job listings scraping...")
        try:
            job_listings = await scraper.get_job_listings_async()
            logger.info(f"Found {len(job_listings)} job listings")
        except Exception as e:
            logger.error(f"Error fetching job listings: {str(e)}")
            job_listings = []

        # Combine all resources
        all_resources = {
            'github_programs': github_resources,
            'blog_posts': blog_posts,
            'job_listings': job_listings,
            'last_updated': datetime.now().isoformat()
        }

        # Save to JSON file
        output_dir = Path(__file__).parent.parent / 'data'
        output_dir.mkdir(exist_ok=True)
        output_file = output_dir / 'devrel_resources.json'

        with open(output_file, 'w') as f:
            json.dump(all_resources, f, indent=2)

        logger.info(f"Resources saved to {output_file}")
        logger.info("Resources updated successfully")

        return {
            "status": "success",
            "message": "Resources updated successfully",
            "data": {
                "github_programs": len(github_resources),
                "blog_posts": len(blog_posts),
                "job_listings": len(job_listings),
                "output_file": str(output_file)
            }
        }
    except Exception as e:
        error_msg = f"Error updating resources: {str(e)}"
        logger.error(error_msg)
        return {
            "status": "error",
            "message": error_msg,
            "data": None
        }

if __name__ == "__main__":
    import asyncio
    asyncio.run(update_resources())

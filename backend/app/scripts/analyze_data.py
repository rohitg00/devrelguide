#!/usr/bin/env python3
"""
Analyze scraped DevRel resources data to verify quality and completeness.
"""

import json
import sys
from pathlib import Path
from typing import Dict, List
from pprint import pprint

def load_data() -> Dict:
    """Load the scraped data from JSON file."""
    data_path = Path(__file__).parent.parent / 'data' / 'devrel_resources.json'
    try:
        with open(data_path, 'r') as f:
            return json.load(f)
    except Exception as e:
        raise Exception(f'Error reading data: {e}')

def check_data_quality(data: Dict) -> Dict:
    """Check the quality of scraped data."""
    # Check blog posts
    blog_posts = data.get('blog_posts', [])
    valid_posts = [post for post in blog_posts
                  if all(post.get(field) for field in ['title', 'url', 'source'])]

    # Check GitHub programs
    programs = data.get('github_programs', [])
    valid_programs = [prog for prog in programs
                     if all(prog.get(field) for field in ['name', 'url', 'description'])]

    # Check job listings
    jobs = data.get('job_listings', [])
    valid_jobs = [job for job in jobs
                 if all(job.get(field) for field in ['title', 'company', 'url'])]

    return {
        'blog_posts': {
            'total': len(blog_posts),
            'valid': len(valid_posts),
            'sample': blog_posts[:3] if blog_posts else []
        },
        'github_programs': {
            'total': len(programs),
            'valid': len(valid_programs)
        },
        'job_listings': {
            'total': len(jobs),
            'valid': len(valid_jobs)
        }
    }

def analyze_data():
    """Analyze and return information about the scraped data."""
    try:
        data = load_data()
        quality_report = check_data_quality(data)

        return {
            "status": "success",
            "message": "Data analysis completed successfully",
            "data": {
                "last_updated": data.get('last_updated'),
                "quality_report": quality_report
            }
        }
    except Exception as e:
        error_msg = f"Error analyzing data: {str(e)}"
        return {
            "status": "error",
            "message": error_msg,
            "data": None
        }

if __name__ == '__main__':
    result = analyze_data()
    pprint(result)

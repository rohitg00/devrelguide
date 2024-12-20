#!/usr/bin/env python3
import re
import requests
from urllib.parse import urlparse
import sys
import time
import logging
from pathlib import Path

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def extract_links(markdown_file):
    """Extract all URLs from markdown file."""
    with open(markdown_file, "r") as f:
        content = f.read()

    # Find URLs in markdown links and plain URLs
    urls = re.findall(r"\[([^\]]+)\]\(([^)]+)\)|(?<![\(\[])(https?://[^\s\)]+)", content)

    # Flatten and clean the URLs
    links = []
    for match in urls:
        if isinstance(match, tuple):
            if match[1].startswith("http"):
                links.append((match[0], match[1]))
        else:
            if match.startswith("http"):
                links.append(("", match))

    return list(set(links))

def check_link(title, url):
    """Check if a URL is accessible."""
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }
        response = requests.head(url, allow_redirects=True, timeout=10, headers=headers)
        if response.status_code == 405:  # Method not allowed, try GET
            response = requests.get(url, allow_redirects=True, timeout=10, headers=headers)

        status = response.status_code < 400
        if status:
            logger.info(f"✓ {title or url} ({url})")
        else:
            logger.error(f"✗ {title or url} ({url}) - Status: {response.status_code}")
        return status
    except Exception as e:
        logger.error(f"✗ {title or url} ({url}) - Error: {str(e)}")
        return False

def verify_links():
    """Main function to verify links."""
    try:
        readme_path = Path(__file__).parent.parent / "README.md"
        links = extract_links(str(readme_path))
        logger.info(f"Found {len(links)} unique links to check")

        broken_links = []
        results = []

        for title, url in links:
            status = check_link(title, url)
            results.append({
                "title": title,
                "url": url,
                "status": status
            })
            if not status:
                broken_links.append((title, url))
            time.sleep(1)  # Rate limiting

        return {
            "status": "success",
            "message": f"Link verification completed. Found {len(broken_links)} broken links out of {len(links)} total links.",
            "data": {
                "total_links": len(links),
                "broken_links": len(broken_links),
                "results": results
            }
        }
    except Exception as e:
        error_msg = f"Error verifying links: {str(e)}"
        logger.error(error_msg)
        return {
            "status": "error",
            "message": error_msg,
            "data": None
        }

if __name__ == "__main__":
    verify_links()

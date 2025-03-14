#!/usr/bin/env python3

import logging
from scraper.devrel_scraper import DevRelScraper
from collections import Counter
import json
import os
from datetime import datetime
import re

def analyze_blog_content(content):
    if not content:
        return 0
    if len(content) < 100:
        return 0
    devrel_keywords = ['developer relations', 'devrel', 'developer advocacy', 'community',
                      'documentation', 'technical writing', 'developer experience']
    keyword_count = sum(1 for keyword in devrel_keywords if keyword.lower() in content.lower())
    return keyword_count

def analyze_blog_posts(posts):
    if not posts:
        return "No blog posts found."

    analysis = []
    analysis.append(f"\nTotal blog posts found: {len(posts)}")

    sources = Counter(post['source'] for post in posts)
    analysis.append("\nPosts by source:")
    for source, count in sources.items():
        analysis.append(f"- {source}: {count} posts")

    valid_dates = []
    invalid_dates = 0
    for post in posts:
        try:
            date_str = post['published_date']
            for fmt in ['%a, %d %b %Y %H:%M:%S %z', '%Y-%m-%d', '%a, %d %b %Y %H:%M:%S GMT']:
                try:
                    date = datetime.strptime(date_str, fmt)
                    valid_dates.append(date)
                    break
                except ValueError:
                    continue
            else:
                invalid_dates += 1
        except (KeyError, TypeError):
            invalid_dates += 1

    if valid_dates:
        analysis.append(f"\nDate analysis:")
        analysis.append(f"- Valid dates: {len(valid_dates)}")
        analysis.append(f"- Invalid/missing dates: {invalid_dates}")
        analysis.append(f"- Date range: {min(valid_dates).strftime('%Y-%m-%d')} to {max(valid_dates).strftime('%Y-%m-%d')}")

    quality_scores = []
    for post in posts:
        excerpt = post.get('excerpt', '')
        score = analyze_blog_content(excerpt)
        quality_scores.append(score)

    if quality_scores:
        analysis.append(f"\nContent quality analysis:")
        analysis.append(f"- Average DevRel keyword matches: {sum(quality_scores)/len(quality_scores):.1f}")
        analysis.append(f"- Posts with high relevance (3+ keywords): {sum(1 for s in quality_scores if s >= 3)}")

    analysis.append("\nSample of recent posts by source:")
    for source in sources:
        source_posts = [p for p in posts if p['source'] == source]
        sorted_posts = sorted(source_posts, key=lambda x: x.get('published_date', ''), reverse=True)

        analysis.append(f"\n{source}:")
        for post in sorted_posts[:3]:
            analysis.append(f"- {post['title']}")
            analysis.append(f"  Published: {post.get('published_date', 'Unknown date')}")
            analysis.append(f"  URL: {post['url']}")
            if post.get('excerpt'):
                analysis.append(f"  Excerpt: {post['excerpt'][:100]}...")

    return "\n".join(analysis)

def main():
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s'
    )

    logging.info("Starting blog scraper test")
    scraper = DevRelScraper()

    blog_posts = scraper.get_devrel_blog_posts()

    analysis = analyze_blog_posts(blog_posts)
    print(analysis)

    os.makedirs('data', exist_ok=True)
    with open('data/blog_results.json', 'w') as f:
        json.dump(blog_posts, f, indent=2)
    logging.info("Results saved to data/blog_results.json")

if __name__ == "__main__":
    main()

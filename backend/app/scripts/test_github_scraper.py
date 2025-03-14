#!/usr/bin/env python3

import logging
from scraper.devrel_scraper import DevRelScraper
from collections import Counter
import json
import os

def analyze_github_results(results):
    """Analyze the quality of GitHub results."""
    if not results:
        return "No GitHub results found."

    analysis = []
    analysis.append(f"\nTotal GitHub repositories found: {len(results)}")

    # Analyze stars
    stars = [repo['stars'] for repo in results]
    analysis.append(f"Star statistics:")
    analysis.append(f"- Average stars: {sum(stars)/len(stars):.1f}")
    analysis.append(f"- Max stars: {max(stars)}")
    analysis.append(f"- Min stars: {min(stars)}")

    # Analyze search terms
    search_terms = Counter(repo['search_term'] for repo in results)
    analysis.append("\nResults by search term:")
    for term, count in search_terms.most_common():
        analysis.append(f"- {term}: {count} repos")

    # Analyze languages
    languages = Counter(repo['language'] for repo in results if repo['language'])
    analysis.append("\nTop programming languages:")
    for lang, count in languages.most_common(5):
        analysis.append(f"- {lang}: {count} repos")

    # Sample of top repositories
    analysis.append("\nTop 5 repositories by stars:")
    for repo in sorted(results, key=lambda x: x['stars'], reverse=True)[:5]:
        analysis.append(f"\n- {repo['name']}")
        analysis.append(f"  Stars: {repo['stars']}")
        analysis.append(f"  Description: {repo['description'][:100]}...")
        analysis.append(f"  URL: {repo['url']}")
        analysis.append(f"  Language: {repo['language']}")
        if repo['topics']:
            analysis.append(f"  Topics: {', '.join(repo['topics'][:5])}")

    return "\n".join(analysis)

def main():
    # Configure logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s'
    )

    # Initialize scraper and test GitHub functionality
    logging.info("Starting GitHub scraper test")
    scraper = DevRelScraper()

    # Get GitHub results
    github_results = scraper.get_github_devrel_programs()

    # Analyze and print results
    analysis = analyze_github_results(github_results)
    print(analysis)

    # Save results for further analysis
    os.makedirs('data', exist_ok=True)
    with open('data/github_results.json', 'w') as f:
        json.dump(github_results, f, indent=2)
    logging.info("Results saved to data/github_results.json")

if __name__ == "__main__":
    main()

import sys
import os
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Add the parent directory to Python path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from scraper.devrel_scraper import DevRelScraper

def test_scraper():
    """Test the scraper and create initial visualization of results."""
    # Initialize and run scraper
    scraper = DevRelScraper(rate_limit_delay=1.0)
    results_df = scraper.scrape_all()

    # Save raw results
    results_df.to_csv('devrel_resources_raw.csv', index=False)

    # Create a simple visualization of sources distribution
    plt.figure(figsize=(10, 6))
    source_counts = results_df['source'].value_counts()
    sns.barplot(x=source_counts.values, y=source_counts.index)
    plt.title('DevRel Resources by Source')
    plt.xlabel('Number of Resources')
    plt.tight_layout()
    plt.savefig('resources_distribution.png')

    # Print summary statistics
    print("\nSummary of scraped resources:")
    print("-" * 40)
    print(f"Total resources found: {len(results_df)}")
    print("\nResources by source:")
    print(source_counts)
    print("\nResource types:")
    print(results_df['type'].value_counts())

if __name__ == '__main__':
    test_scraper()

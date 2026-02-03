#!/usr/bin/env python3
"""
Script to generate all DevRel visualizations.
This script coordinates the generation of all visualization components.
"""

import os
import sys
import logging
from pathlib import Path

# Add parent directory to Python path for imports
sys.path.append(str(Path(__file__).parent.parent))

from visualizations.career_path import generate_career_path
from visualizations.community_graph import generate_community_graph
from visualizations.metrics_dashboard import generate_metrics_dashboard
from visualizations.skills_matrix import generate_skills_matrix

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def ensure_output_directory():
    """Ensure the static/visualizations directory exists."""
    output_dir = Path(__file__).parent.parent / 'static' / 'visualizations'
    output_dir.mkdir(parents=True, exist_ok=True)
    return output_dir

def generate_all_visualizations():
    """Generate all visualizations and save them to the output directory."""
    try:
        output_dir = ensure_output_directory()
        logger.info(f"Generating visualizations in {output_dir}")

        # Generate each visualization with explicit output directory
        generate_career_path(output_dir=str(output_dir))
        generate_community_graph(output_dir=str(output_dir))
        generate_metrics_dashboard(output_dir=str(output_dir))
        generate_skills_matrix(output_dir=str(output_dir))

        logger.info("All visualizations generated successfully")
        return True
    except Exception as e:
        logger.error(f"Error generating visualizations: {str(e)}")
        return False

def main():
    """Main function to run the visualization generation process."""
    success = generate_all_visualizations()
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()

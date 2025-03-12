#!/usr/bin/env python3
"""
Utility script to check if visualization files exist and generate them if needed.
This helps ensure that the visualization data is always available for the frontend.
"""

import os
import sys
import logging
from pathlib import Path
import json

# Add parent directories to Python path for imports
current_dir = Path(__file__).parent
sys.path.append(str(current_dir.parent.parent))
sys.path.append(str(current_dir.parent))

from generate_visualizations import generate_all_visualizations

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def check_visualizations():
    """
    Check if visualization files exist and generate them if needed.
    Returns True if visualizations are ready, False otherwise.
    """
    # Define the visualization files that should exist
    visualization_files = [
        'career_path.json',
        'community_graph.json',
        'metrics_dashboard.json',
        'skills_matrix.json'
    ]
    
    # Check if all visualization files exist
    output_dir = Path(current_dir.parent.parent) / 'static' / 'visualizations'
    all_exist = True
    
    for viz_file in visualization_files:
        file_path = output_dir / viz_file
        if not file_path.exists():
            logger.warning(f"Visualization file {viz_file} not found")
            all_exist = False
    
    # If any files are missing, generate all visualizations
    if not all_exist:
        logger.info("Some visualization files are missing, generating them now...")
        result = generate_all_visualizations()
        return result
    
    logger.info("All visualization files exist")
    return True

def main():
    """Main function to check and generate visualizations if needed."""
    result = check_visualizations()
    sys.exit(0 if result else 1)

if __name__ == "__main__":
    main() 
import os
import sys
import logging
from pathlib import Path
import plotly.io as pio
from career_path import CareerPathVisualizer
from metrics_dashboard import DevRelMetricsDashboard
from community_graph import CommunityGraphVisualizer
from skills_matrix import SkillsMatrixVisualizer

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def ensure_output_directory():
    output_dir = os.path.join(os.path.dirname(__file__), '..', 'static', 'visualizations')
    os.makedirs(output_dir, exist_ok=True)
    return output_dir

def configure_kaleido():
    try:
        pio.kaleido.scope.chromium_args = tuple([
            '--no-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--disable-software-rasterizer',
        ])
        logger.info("Kaleido backend configured successfully")
    except Exception as e:
        logger.error(f"Error configuring Kaleido: {e}")
        raise

def generate_visualization(visualizer, name, output_dir):
    html_path = os.path.join(output_dir, f'{name}.html')
    png_path = os.path.join(output_dir, f'{name}.png')

    try:
        logger.info(f"Generating {name} visualization...")

        # Create the figure first
        if hasattr(visualizer, 'create_career_path_diagram'):
            fig = visualizer.create_career_path_diagram()
        elif hasattr(visualizer, 'create_dashboard'):
            fig = visualizer.create_dashboard()
        elif hasattr(visualizer, 'create_network_visualization'):
            fig = visualizer.create_network_visualization()
        elif hasattr(visualizer, 'create_skills_matrix'):
            fig = visualizer.create_skills_matrix()

        # Save HTML version
        logger.info(f"Saving HTML for {name}...")
        fig.write_html(html_path, include_plotlyjs=True, full_html=True)

        # Save PNG version with detailed error handling
        logger.info(f"Saving PNG for {name}...")
        try:
            fig.write_image(png_path, width=1200, height=800, scale=2)
            logger.info(f"Successfully saved PNG for {name}")
        except Exception as png_error:
            logger.error(f"Error saving PNG for {name}: {str(png_error)}")
            logger.error(f"PNG error type: {type(png_error)}")
            raise

        if not os.path.exists(html_path):
            logger.error(f"Failed to generate HTML for {name}")
        if not os.path.exists(png_path):
            logger.error(f"Failed to generate PNG for {name}")

        logger.info(f"Successfully generated {name} visualization")
    except Exception as e:
        logger.error(f"Error generating {name} visualization: {str(e)}")
        logger.error(f"Error type: {type(e)}")
        raise

def generate_all_visualizations():
    output_dir = ensure_output_directory()

    try:
        configure_kaleido()

        visualizations = [
            (CareerPathVisualizer(), 'career_path'),
            (DevRelMetricsDashboard(), 'metrics_dashboard'),
            (CommunityGraphVisualizer(), 'community_network'),
            (SkillsMatrixVisualizer(), 'skills_matrix')
        ]

        for visualizer, name in visualizations:
            generate_visualization(visualizer, name, output_dir)

        logger.info("\nAll visualizations generated successfully!")

    except Exception as e:
        logger.error(f"Error in visualization generation: {e}")
        sys.exit(1)

if __name__ == '__main__':
    generate_all_visualizations()

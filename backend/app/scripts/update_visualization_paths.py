import os
from pathlib import Path

def update_visualization_paths():
    """Update visualization file paths to use absolute paths."""
    # Get absolute path to static directory
    static_dir = Path(__file__).parent.parent / 'static' / 'visualizations'
    static_dir.mkdir(parents=True, exist_ok=True)

    # Update visualization paths
    for vis_file in ['career_path.py', 'community_graph.py', 'metrics_dashboard.py', 'skills_matrix.py']:
        vis_path = Path(__file__).parent.parent / 'visualizations' / vis_file
        with open(vis_path, 'r') as f:
            content = f.read()

        # Replace relative paths with absolute paths
        content = content.replace('static/visualizations', str(static_dir))

        with open(vis_path, 'w') as f:
            f.write(content)

    print('Updated visualization paths successfully')

if __name__ == '__main__':
    update_visualization_paths()

import json
import os

class CareerPathVisualizer:
    """Creates an interactive career path visualization for DevRel roles."""

    def __init__(self):
        self.career_paths = {
            "Entry Level": {
                "roles": ["Technical Writer", "Developer Support", "Community Moderator"],
                "skills": ["Technical Writing", "Basic Programming", "Communication"],
                "next": ["Mid Level"]
            },
            "Mid Level": {
                "roles": ["Developer Advocate", "Technical Community Manager", "Content Developer"],
                "skills": ["Public Speaking", "Content Creation", "Technical Demos"],
                "next": ["Senior Level"]
            },
            "Senior Level": {
                "roles": ["Senior Developer Advocate", "DevRel Program Manager", "Developer Marketing Manager"],
                "skills": ["Strategy Development", "Team Leadership", "Program Management"],
                "next": ["Leadership"]
            },
            "Leadership": {
                "roles": ["Head of Developer Relations", "Director of Developer Experience", "VP of Developer Ecosystem"],
                "skills": ["Executive Communication", "Strategy", "Business Development"],
                "next": []
            }
        }

    def generate_visualization_data(self):
        """Generate D3.js compatible visualization data."""
        nodes = []
        links = []
        node_id = 0
        node_map = {}

        # Create nodes for each level and role
        for level, details in self.career_paths.items():
            level_node_id = node_id
            nodes.append({
                "id": node_id,
                "label": level,
                "category": "level",
                "level": list(self.career_paths.keys()).index(level),
                "skills": details["skills"]
            })
            node_map[level] = level_node_id
            node_id += 1

            # Add role nodes
            for role in details["roles"]:
                nodes.append({
                    "id": node_id,
                    "label": role,
                    "category": "role",
                    "level": list(self.career_paths.keys()).index(level),
                    "skills": details["skills"]
                })
                # Link role to level
                links.append({
                    "source": level_node_id,
                    "target": node_id,
                    "value": 1
                })
                node_id += 1

            # Add connections to next level
            for next_level in details["next"]:
                if next_level in node_map:
                    links.append({
                        "source": level_node_id,
                        "target": node_map[next_level],
                        "value": 2
                    })

        return {
            "nodes": nodes,
            "links": links
        }

def generate_career_path(output_dir=None):
    """Generate and save the career path visualization.
    
    Args:
        output_dir (str): Directory to save the visualization. If None, uses default.
    """
    try:
        if output_dir is None:
            output_dir = os.path.join(os.path.dirname(__file__), 'output')
        
        os.makedirs(output_dir, exist_ok=True)
        
        visualizer = CareerPathVisualizer()
        data = visualizer.generate_visualization_data()
        
        output_file = os.path.join(output_dir, 'career_path.json')
        with open(output_file, 'w') as f:
            json.dump(data, f)
            
        return True
    except Exception as e:
        print(f"Error generating career path visualization: {str(e)}")
        return False

def main():
    """Main function to generate the visualization."""
    success = generate_career_path()
    if not success:
        print("Failed to generate career path visualization")

if __name__ == '__main__':
    main()

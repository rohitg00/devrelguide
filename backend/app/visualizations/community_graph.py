import networkx as nx
import json
import os

class CommunityGraphVisualizer:
    """Creates an interactive network graph visualization of DevRel community connections."""

    def __init__(self):
        self.G = nx.Graph()
        self.communities = {
            'DevRel Team': ['Developer Advocates', 'Community Managers', 'Technical Writers'],
            'Developer Community': ['Open Source Contributors', 'Enterprise Developers', 'Startup Developers'],
            'Content': ['Documentation', 'Tutorials', 'Blog Posts', 'Video Content'],
            'Events': ['Conferences', 'Meetups', 'Workshops', 'Hackathons'],
            'Platforms': ['GitHub', 'Stack Overflow', 'Discord', 'Twitter']
        }
        self._build_graph()

    def _build_graph(self):
        """Build the network graph structure."""
        # Add main community hubs
        for hub in self.communities.keys():
            self.G.add_node(hub, node_type='hub', size=30)

            # Add community members and connect to hub
            for member in self.communities[hub]:
                self.G.add_node(member, node_type='member', size=20)
                self.G.add_edge(hub, member, weight=1)

        # Add cross-connections between related nodes
        self._add_cross_connections()

    def _add_cross_connections(self):
        """Add connections between related nodes across communities."""
        # Connect platforms to content
        self.G.add_edge('GitHub', 'Documentation', weight=0.5)
        self.G.add_edge('Stack Overflow', 'Documentation', weight=0.5)
        self.G.add_edge('Twitter', 'Blog Posts', weight=0.5)
        self.G.add_edge('Discord', 'Tutorials', weight=0.5)

        # Connect events to community members
        self.G.add_edge('Conferences', 'Developer Advocates', weight=0.5)
        self.G.add_edge('Meetups', 'Community Managers', weight=0.5)
        self.G.add_edge('Workshops', 'Technical Writers', weight=0.5)
        self.G.add_edge('Hackathons', 'Open Source Contributors', weight=0.5)

    def generate_visualization_data(self):
        """Generate D3.js compatible visualization data."""
        nodes = []
        node_map = {}
        
        # Create nodes list with indices
        for i, (node, attrs) in enumerate(self.G.nodes(data=True)):
            node_map[node] = i
            nodes.append({
                "id": i,
                "name": node,
                "category": attrs.get('node_type', 'member'),
                "size": attrs.get('size', 20)
            })
        
        # Create links using node indices
        links = []
        for source, target, attrs in self.G.edges(data=True):
            links.append({
                "source": node_map[source],
                "target": node_map[target],
                "value": attrs.get('weight', 1)
            })
        
        return {
            "nodes": nodes,
            "links": links
        }

def generate_community_graph(output_dir=None):
    """Generate and save the community graph visualization.
    
    Args:
        output_dir (str): Directory to save the visualization. If None, uses default.
    """
    try:
        if output_dir is None:
            output_dir = os.path.join(os.path.dirname(__file__), 'output')
        
        os.makedirs(output_dir, exist_ok=True)
        
        visualizer = CommunityGraphVisualizer()
        data = visualizer.generate_visualization_data()
        
        output_file = os.path.join(output_dir, 'community_graph.json')
        with open(output_file, 'w') as f:
            json.dump(data, f)
            
        return True
    except Exception as e:
        print(f"Error generating community graph visualization: {str(e)}")
        return False

def main():
    """Main function to generate the visualization."""
    success = generate_community_graph()
    if not success:
        print("Failed to generate community graph visualization")

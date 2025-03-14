import networkx as nx
import json
import os

class MetricsFlowVisualizer:
    """Creates an interactive visualization of DevRel metrics and their relationships."""

    def __init__(self):
        self.G = nx.DiGraph()
        self.metrics = {
            'Reach': ['Blog Views', 'Social Media Reach', 'Event Attendance'],
            'Engagement': ['GitHub Stars', 'Forum Posts', 'Workshop Participation'],
            'Impact': ['Developer Satisfaction', 'Product Adoption', 'Community Growth'],
            'Growth': ['New Contributors', 'Documentation Updates', 'API Usage']
        }
        self._build_graph()

    def _build_graph(self):
        """Build the metrics flow graph structure."""
        # Add main metric categories
        for category in self.metrics.keys():
            self.G.add_node(category, node_type='category', size=30)

            # Add individual metrics and connect to category
            for metric in self.metrics[category]:
                self.G.add_node(metric, node_type='metric', size=20)
                self.G.add_edge(category, metric, weight=1)

        # Add cross-category relationships
        self._add_relationships()

    def _add_relationships(self):
        """Add relationships between metrics across categories."""
        relationships = [
            ('Blog Views', 'GitHub Stars', 0.5),
            ('Social Media Reach', 'Forum Posts', 0.5),
            ('Event Attendance', 'Workshop Participation', 0.7),
            ('GitHub Stars', 'Developer Satisfaction', 0.6),
            ('Forum Posts', 'Community Growth', 0.5),
            ('Workshop Participation', 'Product Adoption', 0.7),
            ('Developer Satisfaction', 'New Contributors', 0.6),
            ('Community Growth', 'Documentation Updates', 0.5),
            ('Product Adoption', 'API Usage', 0.7)
        ]

        for source, target, weight in relationships:
            self.G.add_edge(source, target, weight=weight)

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
                "category": attrs.get('node_type', 'metric'),
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

class DevRelEcosystemVisualizer:
    """Creates visualization data for the DevRel ecosystem."""

    def __init__(self):
        self.ecosystem_data = {
            'nodes': [
                # Core Activities
                {'id': 0, 'name': 'Documentation', 'fullName': 'Documentation & Content', 'type': 'category', 'size': 40, 'order': 0},
                {'id': 1, 'name': 'Community', 'fullName': 'Community Building', 'type': 'category', 'size': 40, 'order': 0},
                {'id': 2, 'name': 'Education', 'fullName': 'Developer Education', 'type': 'category', 'size': 40, 'order': 0},
                
                # Activities
                {'id': 3, 'name': 'API Docs', 'fullName': 'API Documentation', 'type': 'activity', 'size': 30, 'order': 1},
                {'id': 4, 'name': 'Tutorials', 'fullName': 'Developer Tutorials', 'type': 'activity', 'size': 30, 'order': 1},
                {'id': 5, 'name': 'Forums', 'fullName': 'Developer Forums', 'type': 'activity', 'size': 30, 'order': 1},
                {'id': 6, 'name': 'Events', 'fullName': 'Developer Events', 'type': 'activity', 'size': 30, 'order': 1},
                {'id': 7, 'name': 'Training', 'fullName': 'Developer Training', 'type': 'activity', 'size': 30, 'order': 1},
                {'id': 8, 'name': 'Workshops', 'fullName': 'Technical Workshops', 'type': 'activity', 'size': 30, 'order': 1},
                
                # Components
                {'id': 9, 'name': 'Reference', 'fullName': 'API Reference', 'type': 'component', 'size': 20, 'order': 2},
                {'id': 10, 'name': 'Guides', 'fullName': 'Implementation Guides', 'type': 'component', 'size': 20, 'order': 2},
                {'id': 11, 'name': 'Support', 'fullName': 'Community Support', 'type': 'component', 'size': 20, 'order': 2},
                {'id': 12, 'name': 'Networking', 'fullName': 'Developer Networking', 'type': 'component', 'size': 20, 'order': 2},
                {'id': 13, 'name': 'Resources', 'fullName': 'Learning Resources', 'type': 'component', 'size': 20, 'order': 2},
                {'id': 14, 'name': 'Projects', 'fullName': 'Hands-on Projects', 'type': 'component', 'size': 20, 'order': 2}
            ],
            'links': [
                # Documentation flows
                {'source': 0, 'target': 3, 'value': 30},
                {'source': 0, 'target': 4, 'value': 25},
                {'source': 3, 'target': 9, 'value': 20},
                {'source': 3, 'target': 10, 'value': 15},
                {'source': 4, 'target': 10, 'value': 15},
                
                # Community flows
                {'source': 1, 'target': 5, 'value': 30},
                {'source': 1, 'target': 6, 'value': 25},
                {'source': 5, 'target': 11, 'value': 20},
                {'source': 5, 'target': 12, 'value': 15},
                {'source': 6, 'target': 12, 'value': 20},
                
                # Education flows
                {'source': 2, 'target': 7, 'value': 30},
                {'source': 2, 'target': 8, 'value': 25},
                {'source': 7, 'target': 13, 'value': 20},
                {'source': 7, 'target': 14, 'value': 15},
                {'source': 8, 'target': 14, 'value': 20},
                
                # Cross-category flows
                {'source': 4, 'target': 7, 'value': 10},
                {'source': 6, 'target': 8, 'value': 10},
                {'source': 5, 'target': 13, 'value': 10}
            ]
        }

    def generate_visualization_data(self):
        """Generate visualization data for the frontend."""
        return self.ecosystem_data

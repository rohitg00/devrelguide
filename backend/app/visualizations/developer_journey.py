import networkx as nx

class DeveloperJourneyVisualizer:
    """Creates an interactive visualization of developer journey stages."""

    def __init__(self):
        self.journey_data = {
            'nodes': [
                # Discovery Phase
                {'name': 'Documentation Overview', 'category': 'discovery', 'value': 100},
                {'name': 'API Reference', 'category': 'discovery', 'value': 95},
                {'name': 'Getting Started Guide', 'category': 'discovery', 'value': 90},
                {'name': 'Quick Start Tutorials', 'category': 'discovery', 'value': 85},
                
                # Learning Phase
                {'name': 'Interactive Tutorials', 'category': 'learning', 'value': 80},
                {'name': 'Code Examples', 'category': 'learning', 'value': 75},
                {'name': 'Video Guides', 'category': 'learning', 'value': 70},
                {'name': 'Developer Workshops', 'category': 'learning', 'value': 65},
                
                # Building Phase
                {'name': 'Sample Projects', 'category': 'building', 'value': 60},
                {'name': 'Integration Guides', 'category': 'building', 'value': 55},
                {'name': 'API Implementation', 'category': 'building', 'value': 50},
                {'name': 'Testing Tools', 'category': 'building', 'value': 45},
                
                # Contributing Phase
                {'name': 'Issue Reporting', 'category': 'contributing', 'value': 40},
                {'name': 'Pull Requests', 'category': 'contributing', 'value': 35},
                {'name': 'Code Reviews', 'category': 'contributing', 'value': 30},
                {'name': 'Documentation Updates', 'category': 'contributing', 'value': 25},
                
                # Leading Phase
                {'name': 'Community Leadership', 'category': 'leading', 'value': 20},
                {'name': 'Technical Talks', 'category': 'leading', 'value': 15},
                {'name': 'Mentoring', 'category': 'leading', 'value': 10},
                {'name': 'Open Source Projects', 'category': 'leading', 'value': 5}
            ],
            'links': [
                # Discovery to Learning Links
                {'source': 0, 'target': 4, 'value': 50},  # Documentation Overview -> Interactive Tutorials
                {'source': 1, 'target': 5, 'value': 45},  # API Reference -> Code Examples
                {'source': 2, 'target': 6, 'value': 40},  # Getting Started Guide -> Video Guides
                {'source': 3, 'target': 7, 'value': 35},  # Quick Start Tutorials -> Developer Workshops
                
                # Learning to Building Links
                {'source': 4, 'target': 8, 'value': 40},  # Interactive Tutorials -> Sample Projects
                {'source': 5, 'target': 9, 'value': 35},  # Code Examples -> Integration Guides
                {'source': 6, 'target': 10, 'value': 30}, # Video Guides -> API Implementation
                {'source': 7, 'target': 11, 'value': 25}, # Developer Workshops -> Testing Tools
                
                # Building to Contributing Links
                {'source': 8, 'target': 12, 'value': 30}, # Sample Projects -> Issue Reporting
                {'source': 9, 'target': 13, 'value': 25}, # Integration Guides -> Pull Requests
                {'source': 10, 'target': 14, 'value': 20}, # API Implementation -> Code Reviews
                {'source': 11, 'target': 15, 'value': 15}, # Testing Tools -> Documentation Updates
                
                # Contributing to Leading Links
                {'source': 12, 'target': 16, 'value': 20}, # Issue Reporting -> Community Leadership
                {'source': 13, 'target': 17, 'value': 15}, # Pull Requests -> Technical Talks
                {'source': 14, 'target': 18, 'value': 10}, # Code Reviews -> Mentoring
                {'source': 15, 'target': 19, 'value': 5},  # Documentation Updates -> Open Source Projects
                
                # Cross-phase Connections
                {'source': 1, 'target': 10, 'value': 20},  # API Reference -> API Implementation
                {'source': 5, 'target': 13, 'value': 15},  # Code Examples -> Pull Requests
                {'source': 7, 'target': 17, 'value': 10},  # Developer Workshops -> Technical Talks
                {'source': 14, 'target': 18, 'value': 5},  # Code Reviews -> Mentoring
                
                # Additional Discovery Links
                {'source': 0, 'target': 1, 'value': 40},  # Documentation Overview -> API Reference
                {'source': 0, 'target': 2, 'value': 35},  # Documentation Overview -> Getting Started Guide
                {'source': 0, 'target': 3, 'value': 30},  # Documentation Overview -> Quick Start Tutorials
                
                # Additional Learning Links
                {'source': 4, 'target': 5, 'value': 25},  # Interactive Tutorials -> Code Examples
                {'source': 5, 'target': 6, 'value': 20},  # Code Examples -> Video Guides
                {'source': 6, 'target': 7, 'value': 15},  # Video Guides -> Developer Workshops
                
                # Additional Building Links
                {'source': 8, 'target': 9, 'value': 20},  # Sample Projects -> Integration Guides
                {'source': 9, 'target': 10, 'value': 15}, # Integration Guides -> API Implementation
                {'source': 10, 'target': 11, 'value': 10}, # API Implementation -> Testing Tools
                
                # Additional Contributing Links
                {'source': 12, 'target': 13, 'value': 15}, # Issue Reporting -> Pull Requests
                {'source': 13, 'target': 14, 'value': 10}, # Pull Requests -> Code Reviews
                {'source': 14, 'target': 15, 'value': 5},  # Code Reviews -> Documentation Updates
                
                # Additional Leading Links
                {'source': 16, 'target': 17, 'value': 10}, # Community Leadership -> Technical Talks
                {'source': 17, 'target': 18, 'value': 8},  # Technical Talks -> Mentoring
                {'source': 18, 'target': 19, 'value': 5}   # Mentoring -> Open Source Projects
            ]
        }

    def generate_visualization_data(self):
        """Generate visualization data for the frontend."""
        return self.journey_data

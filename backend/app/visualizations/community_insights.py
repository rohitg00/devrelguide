import random
from datetime import datetime, timedelta

class CommunityInsightsVisualizer:
    """Creates an interactive visualization of community insights."""

    def __init__(self):
        self.resource_categories = ['Documentation', 'Tutorials', 'Blog Posts', 'Videos', 'Workshops']
        self.engagement_types = ['Views', 'Comments', 'Shares', 'Likes']
        self._generate_sample_data()

    def _generate_sample_data(self):
        """Generate sample data for resource impact analysis."""
        self.data = []
        
        # Generate 20 data points
        for _ in range(20):
            category = random.choice(self.resource_categories)
            engagement = random.choice(self.engagement_types)
            
            data_point = {
                'category': category,
                'engagement_type': engagement,
                'effectiveness_score': random.uniform(25, 70),  # Score between 25-70%
                'reach': random.randint(100, 1000),
                'timestamp': (datetime.now() - timedelta(days=random.randint(0, 30))).isoformat()
            }
            self.data.append(data_point)

    def generate_visualization_data(self):
        """Generate visualization data for the frontend."""
        return {
            'scatter_data': self.data,
            'categories': self.resource_categories,
            'engagement_types': self.engagement_types,
            'summary': {
                'total_resources': len(self.data),
                'avg_effectiveness': sum(d['effectiveness_score'] for d in self.data) / len(self.data),
                'total_reach': sum(d['reach'] for d in self.data),
                'time_range': {
                    'start': min(d['timestamp'] for d in self.data),
                    'end': max(d['timestamp'] for d in self.data)
                }
            }
        }

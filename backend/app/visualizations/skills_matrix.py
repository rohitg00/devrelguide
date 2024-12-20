import numpy as np
import json
import os

class SkillsMatrixVisualizer:
    """Creates an interactive skills matrix visualization for DevRel roles."""

    def __init__(self):
        self.roles = [
            'Junior Developer Advocate',
            'Senior Developer Advocate',
            'Technical Community Manager',
            'DevRel Program Manager',
            'Head of Developer Relations'
        ]

        self.skill_categories = {
            'Technical': [
                'Programming',
                'API Design',
                'Documentation',
                'Technical Writing',
                'System Architecture'
            ],
            'Communication': [
                'Public Speaking',
                'Technical Presentations',
                'Blog Writing',
                'Social Media',
                'Workshop Facilitation'
            ],
            'Community': [
                'Community Building',
                'Event Management',
                'Developer Support',
                'Program Development',
                'Metrics & Analytics'
            ],
            'Leadership': [
                'Strategy Development',
                'Team Management',
                'Budget Planning',
                'Stakeholder Management',
                'Cross-team Collaboration'
            ]
        }

        # Generate skill levels for each role (0-100)
        self.skill_levels = self._generate_skill_levels()

    def _generate_skill_levels(self):
        """Generate realistic skill level requirements for each role."""
        base_levels = {
            'Junior Developer Advocate': 40,
            'Senior Developer Advocate': 70,
            'Technical Community Manager': 60,
            'DevRel Program Manager': 75,
            'Head of Developer Relations': 85
        }
        
        levels = {}
        for role in self.roles:
            role_levels = {}
            base = base_levels[role]
            for category, skills in self.skill_categories.items():
                for skill in skills:
                    # Add some randomness while keeping levels reasonable
                    variation = np.random.randint(-10, 10)
                    level = min(100, max(0, base + variation))
                    role_levels[skill] = level
            levels[role] = role_levels
        
        return levels

    def generate_visualization_data(self):
        """Generate D3.js compatible visualization data."""
        data = []
        
        # Convert the data into a format suitable for a heatmap
        for role in self.roles:
            for category, skills in self.skill_categories.items():
                for skill in skills:
                    data.append({
                        "role": role,
                        "category": category,
                        "skill": skill,
                        "value": self.skill_levels[role][skill]
                    })
        
        # Get unique categories and skills for the axes
        categories = list(self.skill_categories.keys())
        all_skills = []
        for skills in self.skill_categories.values():
            all_skills.extend(skills)
        
        return {
            "data": data,
            "roles": self.roles,
            "categories": categories,
            "skills": all_skills,
            "maxValue": 100,
            "minValue": 0
        }

    def save_matrix(self, output_file='skills_matrix.json'):
        """Save the skills matrix visualization data to a JSON file."""
        try:
            data = self.generate_visualization_data()

            # Save JSON version
            with open(output_file, 'w') as f:
                json.dump(data, f, indent=4)

            return True
        except Exception as e:
            print(f"Error saving matrix: {e}")
            return False

def generate_skills_matrix(output_dir='/home/ubuntu/devrel-website/backend/app/static/visualizations'):
    """Create and save the skills matrix visualization."""
    visualizer = SkillsMatrixVisualizer()
    visualizer.save_matrix(os.path.join(output_dir, 'skills_matrix.json'))

def main():
    """Create and save the skills matrix visualization."""
    visualizer = SkillsMatrixVisualizer()
    visualizer.save_matrix()

if __name__ == '__main__':
    main()

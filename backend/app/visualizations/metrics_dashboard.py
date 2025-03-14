import plotly.graph_objects as go
from plotly.subplots import make_subplots
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import os

class DevRelMetricsDashboard:
    """Creates an interactive dashboard for DevRel metrics visualization."""

    def __init__(self):
        self.metrics_data = self._generate_metrics_data()

    def _generate_metrics_data(self):
        """Generate realistic metrics data."""
        dates = pd.date_range(start='2023-01-01', end='2024-01-01', freq='M')
        
        # Community Growth - Steady growth with occasional spikes
        base_growth = np.linspace(1000, 5000, len(dates))
        noise = np.random.normal(0, 100, len(dates))
        spikes = np.zeros(len(dates))
        spikes[[3, 7, 11]] = 500  # Spikes during major events/releases
        community_growth = base_growth + noise + spikes
        
        # Engagement Rate - Percentage between 15-25%
        engagement_base = np.ones(len(dates)) * 20
        engagement_noise = np.random.normal(0, 2, len(dates))
        engagement_rate = engagement_base + engagement_noise
        
        # Content Views - Exponential growth
        content_base = np.exp(np.linspace(8.5, 9.5, len(dates)))
        content_noise = np.random.normal(0, content_base * 0.05, len(dates))
        content_views = content_base + content_noise
        
        # Developer Satisfaction - Score out of 100
        satisfaction_base = np.ones(len(dates)) * 85
        satisfaction_trend = np.linspace(0, 5, len(dates))  # Slight improvement over time
        satisfaction_noise = np.random.normal(0, 2, len(dates))
        developer_satisfaction = satisfaction_base + satisfaction_trend + satisfaction_noise
        
        # Event Attendance - Monthly events
        attendance_base = np.ones(len(dates)) * 200
        attendance_trend = np.linspace(0, 100, len(dates))  # Growing attendance
        attendance_noise = np.random.normal(0, 20, len(dates))
        event_attendance = attendance_base + attendance_trend + attendance_noise
        
        # GitHub Activity - Stars, PRs, Issues
        github_base = np.linspace(500, 2000, len(dates))
        github_noise = np.random.normal(0, 50, len(dates))
        github_activity = github_base + github_noise
        
        return {
            'dates': dates.strftime('%Y-%m-%d').tolist(),
            'metrics': {
                'community_growth': {
                    'label': 'Community Members',
                    'data': community_growth.astype(int).tolist(),
                    'color': '#1f77b4'
                },
                'engagement_rate': {
                    'label': 'Engagement Rate (%)',
                    'data': engagement_rate.round(1).tolist(),
                    'color': '#2ca02c'
                },
                'content_views': {
                    'label': 'Content Views',
                    'data': content_views.astype(int).tolist(),
                    'color': '#ff7f0e'
                },
                'developer_satisfaction': {
                    'label': 'Developer Satisfaction',
                    'data': developer_satisfaction.round(1).tolist(),
                    'color': '#d62728'
                },
                'event_attendance': {
                    'label': 'Event Attendance',
                    'data': event_attendance.astype(int).tolist(),
                    'color': '#9467bd'
                },
                'github_activity': {
                    'label': 'GitHub Activity',
                    'data': github_activity.astype(int).tolist(),
                    'color': '#8c564b'
                }
            }
        }

    def generate_visualization_data(self):
        """Generate visualization data compatible with the frontend."""
        return self.metrics_data

    def create_dashboard(self):
        """Generate an interactive metrics dashboard."""
        # Create figure with secondary y-axis
        fig = make_subplots(
            rows=3, cols=2,
            subplot_titles=(
                'Community Growth', 'Engagement Rate (%)',
                'Content Views', 'Developer Satisfaction Score',
                'Event Attendance', 'GitHub Stars'
            ),
            vertical_spacing=0.12,
            horizontal_spacing=0.1
        )

        # Add traces for each metric
        fig.add_trace(
            go.Scatter(x=self.metrics_data['dates'], y=self.metrics_data['metrics']['community_growth']['data'],
                      name=self.metrics_data['metrics']['community_growth']['label'], line=dict(color=self.metrics_data['metrics']['community_growth']['color'])),
            row=1, col=1
        )

        fig.add_trace(
            go.Scatter(x=self.metrics_data['dates'], y=self.metrics_data['metrics']['engagement_rate']['data'],
                      name=self.metrics_data['metrics']['engagement_rate']['label'], line=dict(color=self.metrics_data['metrics']['engagement_rate']['color'])),
            row=1, col=2
        )

        fig.add_trace(
            go.Scatter(x=self.metrics_data['dates'], y=self.metrics_data['metrics']['content_views']['data'],
                      name=self.metrics_data['metrics']['content_views']['label'], line=dict(color=self.metrics_data['metrics']['content_views']['color'])),
            row=2, col=1
        )

        fig.add_trace(
            go.Scatter(x=self.metrics_data['dates'], y=self.metrics_data['metrics']['developer_satisfaction']['data'],
                      name=self.metrics_data['metrics']['developer_satisfaction']['label'], line=dict(color=self.metrics_data['metrics']['developer_satisfaction']['color'])),
            row=2, col=2
        )

        fig.add_trace(
            go.Bar(x=self.metrics_data['dates'], y=self.metrics_data['metrics']['event_attendance']['data'],
                  name=self.metrics_data['metrics']['event_attendance']['label'], marker_color=self.metrics_data['metrics']['event_attendance']['color']),
            row=3, col=1
        )

        fig.add_trace(
            go.Scatter(x=self.metrics_data['dates'], y=self.metrics_data['metrics']['github_activity']['data'],
                      name=self.metrics_data['metrics']['github_activity']['label'], line=dict(color=self.metrics_data['metrics']['github_activity']['color'])),
            row=3, col=2
        )

        # Update layout
        fig.update_layout(
            height=900,
            width=1200,
            title_text="DevRel Metrics Dashboard",
            showlegend=True,
            template="plotly_white",
            annotations=[
                dict(
                    text="Interactive DevRel Metrics Dashboard showing key performance indicators over time.",
                    xref="paper",
                    yref="paper",
                    x=0,
                    y=1.1,
                    showarrow=False,
                    font=dict(size=12)
                )
            ]
        )

        # Update axes labels and format
        fig.update_xaxes(title_text="Date", gridcolor='lightgray')
        fig.update_yaxes(title_text="Count", gridcolor='lightgray')

        # Add hover templates
        for i in fig.data:
            i.hovertemplate = "%{y:,.0f}<br>Date: %{x|%B %Y}<extra></extra>"

        return fig

    def save_dashboard(self, output_file='metrics_dashboard.html'):
        """Save the metrics dashboard to HTML and PNG files."""
        try:
            fig = self.create_dashboard()

            # Save HTML version
            fig.write_html(output_file, include_plotlyjs=True, full_html=True)

            # Save PNG version
            png_file = os.path.splitext(output_file)[0] + '.png'
            fig.write_image(
                png_file,
                width=1200,
                height=900,
                scale=2  # Higher resolution
            )

            return True
        except Exception as e:
            print(f"Error saving dashboard: {e}")
            return False

def generate_metrics_dashboard(output_dir='/home/ubuntu/devrel-website/backend/app/static/visualizations'):
    """Create and save the metrics dashboard."""
    dashboard = DevRelMetricsDashboard()
    dashboard.save_dashboard(os.path.join(output_dir, 'metrics_dashboard.html'))

def main():
    """Create and save the metrics dashboard."""
    generate_metrics_dashboard()

if __name__ == '__main__':
    main()

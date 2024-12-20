from fastapi import APIRouter, HTTPException
from ...visualizations.community_insights import CommunityInsightsVisualizer

router = APIRouter()

@router.get("/community-insights")
async def get_community_insights():
    """Get community insights visualization data."""
    try:
        visualizer = CommunityInsightsVisualizer()
        data = visualizer.generate_visualization_data()
        return data
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating community insights visualization: {str(e)}"
        )

from fastapi import APIRouter, HTTPException
from ...visualizations.community_graph import CommunityGraphVisualizer
import os

router = APIRouter()

@router.get("/community-graph")
async def get_community_graph():
    """Get community graph visualization data."""
    try:
        visualizer = CommunityGraphVisualizer()
        data = visualizer.generate_visualization_data()
        return data
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating community graph visualization: {str(e)}"
        )

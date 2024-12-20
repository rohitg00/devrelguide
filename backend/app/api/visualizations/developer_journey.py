from fastapi import APIRouter, HTTPException
from ...visualizations.developer_journey import DeveloperJourneyVisualizer

router = APIRouter()

@router.get("/developer-journey")
async def get_developer_journey():
    """Get developer journey visualization data."""
    try:
        visualizer = DeveloperJourneyVisualizer()
        data = visualizer.generate_visualization_data()
        return data
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating developer journey visualization: {str(e)}"
        )

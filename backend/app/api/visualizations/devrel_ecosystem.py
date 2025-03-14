from fastapi import APIRouter, HTTPException
from ...visualizations.devrel_ecosystem import DevRelEcosystemVisualizer

router = APIRouter()

@router.get("/devrel-ecosystem")
async def get_devrel_ecosystem():
    """Get DevRel ecosystem visualization data."""
    try:
        visualizer = DevRelEcosystemVisualizer()
        data = visualizer.generate_visualization_data()
        return data
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating DevRel ecosystem visualization: {str(e)}"
        )

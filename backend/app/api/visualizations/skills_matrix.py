from fastapi import APIRouter, HTTPException
from ...visualizations.skills_matrix import SkillsMatrixVisualizer

router = APIRouter()

@router.get("/skills-matrix")
async def get_skills_matrix():
    """Get skills matrix visualization data."""
    try:
        visualizer = SkillsMatrixVisualizer()
        data = visualizer.generate_visualization_data()
        return data
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating skills matrix visualization: {str(e)}"
        )

from fastapi import APIRouter, HTTPException
from ...visualizations.career_path import CareerPathVisualizer
import os

router = APIRouter()

@router.get("/career-path")
async def get_career_path():
    """Get career path visualization data."""
    try:
        visualizer = CareerPathVisualizer()
        data = visualizer.generate_visualization_data()
        return data
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating career path visualization: {str(e)}"
        )

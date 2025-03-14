from fastapi import APIRouter, HTTPException
from ...visualizations.metrics_flow import MetricsFlowVisualizer

router = APIRouter()

@router.get("/metrics-flow")
async def get_metrics_flow():
    """Get metrics flow visualization data."""
    try:
        visualizer = MetricsFlowVisualizer()
        data = visualizer.generate_visualization_data()
        return data
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating metrics flow visualization: {str(e)}"
        )

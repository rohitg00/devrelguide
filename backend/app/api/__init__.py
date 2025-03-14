from fastapi import APIRouter
from .visualizations.career_path import router as career_path_router
from .visualizations.community_graph import router as community_graph_router
from .visualizations.metrics_flow import router as metrics_flow_router
from .visualizations.skills_matrix import router as skills_matrix_router
from .visualizations.developer_journey import router as developer_journey_router
from .visualizations.community_insights import router as community_insights_router
from .visualizations.devrel_ecosystem import router as devrel_ecosystem_router

api_router = APIRouter()

# Register visualization routes
api_router.include_router(career_path_router, prefix="/visualizations", tags=["visualizations"])
api_router.include_router(community_graph_router, prefix="/visualizations", tags=["visualizations"])
api_router.include_router(metrics_flow_router, prefix="/visualizations", tags=["visualizations"])
api_router.include_router(skills_matrix_router, prefix="/visualizations", tags=["visualizations"])
api_router.include_router(developer_journey_router, prefix="/visualizations", tags=["visualizations"])
api_router.include_router(community_insights_router, prefix="/visualizations", tags=["visualizations"])
api_router.include_router(devrel_ecosystem_router, prefix="/visualizations", tags=["visualizations"])

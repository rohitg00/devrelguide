from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
import sys
import os
import asyncio
from pathlib import Path
from typing import Dict, Optional
from pydantic import BaseModel
import logging
from concurrent.futures import ThreadPoolExecutor, TimeoutError
import functools
import json
from datetime import datetime, timedelta
from cachetools import TTLCache
from .models.visualization_data import (
    VisualizationData, MetricPoint, SkillUpdate,
    CommunityNode, CareerPathNode
)
from .api import api_router

# Configure logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Import script functions
from .scripts.update_resources import update_resources
from .scripts.analyze_data import analyze_data
from .scripts.verify_links import verify_links
from .scripts.generate_visualizations import generate_all_visualizations
from .scraper.devrel_scraper import DevRelScraper

# Create FastAPI app
app = FastAPI(title="DevRel Whitepaper API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*", "Authorization", "Content-Type"],  # Add Authorization to allowed headers
)

# Register API routes
app.include_router(api_router, prefix="/api")

# Initialize cache with 1-hour TTL
app.state.resources_cache = TTLCache(maxsize=100, ttl=3600)
app.state.jobs_cache = TTLCache(maxsize=100, ttl=3600)

# Set up required directories
static_path = Path(__file__).parent / "static"
data_path = Path(__file__).parent / "data"
static_path.mkdir(exist_ok=True)
data_path.mkdir(exist_ok=True)
app.mount("/static", StaticFiles(directory=str(static_path)), name="static")

# Add startup event to check for visualization files
@app.on_event("startup")
async def startup_event():
    """Check for visualization files on startup and generate them if needed."""
    try:
        # Import here to avoid circular imports
        from .scripts.utils.check_visualizations import check_visualizations
        logger.info("Checking visualization files on startup...")
        
        # Run in a separate thread to avoid blocking startup
        loop = asyncio.get_event_loop()
        result = await loop.run_in_executor(None, check_visualizations)
        
        if result:
            logger.info("Visualization files are ready")
        else:
            logger.warning("Failed to prepare visualization files")
    except Exception as e:
        logger.error(f"Error checking visualization files: {str(e)}")

class ScriptResponse(BaseModel):
    status: str
    message: str
    data: Dict | None = None

@app.get("/healthz")
async def healthz():
    return {"status": "ok"}

@app.get("/api/content")
async def get_content():
    try:
        readme_path = Path(__file__).parent / "README.md"
        if not readme_path.exists():
            raise HTTPException(status_code=404, detail="Content file not found")

        with open(readme_path, "r", encoding="utf-8") as f:
            content = f.read()
            # Update image paths to use static URL
            content = content.replace('](', '](/static/')
        return JSONResponse(content={"content": content})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def run_with_timeout(func, timeout=30):
    """Run a function with a timeout."""
    try:
        # If func is already a coroutine object, await it directly
        if asyncio.iscoroutinefunction(func):
            return await asyncio.wait_for(func(), timeout=timeout)
        elif asyncio.iscoroutine(func):
            return await asyncio.wait_for(func, timeout=timeout)
        else:
            # For regular functions, run in executor
            loop = asyncio.get_event_loop()
            return await asyncio.wait_for(loop.run_in_executor(None, func), timeout=timeout)
    except asyncio.TimeoutError:
        logger.error(f"Operation timed out after {timeout} seconds")
        raise TimeoutError(f"Operation timed out after {timeout} seconds")

@app.get("/api/resources")
async def get_resources() -> JSONResponse:
    """Get all DevRel resources with caching and timeout handling."""
    try:
        logger.info("Starting resource collection process")

        # Check cache first
        if hasattr(app.state, 'resources_cache'):
            cache_key = "all_resources"
            cached_data = app.state.resources_cache.get(cache_key)
            if cached_data:
                logger.info("Returning cached resources")
                return JSONResponse(content=cached_data)

        scraper = DevRelScraper()
        all_resources = []

        # Get GitHub resources with timeout
        try:
            logger.info("Fetching GitHub resources...")
            github_resources = await run_with_timeout(
                scraper.get_github_programs_async,
                timeout=60  # Increased timeout
            )
            logger.info(f"Successfully fetched {len(github_resources)} GitHub resources")

            # Transform GitHub resources
            transformed_github = [{
                'title': resource['name'],
                'url': resource['url'],
                'description': resource.get('description', ''),
                'type': 'github',
                'stars': resource.get('stars', 0),
                'last_updated': resource.get('last_updated', '')
            } for resource in github_resources]
            all_resources.extend(transformed_github)

        except TimeoutError:
            logger.error("GitHub resources fetch timed out")
        except Exception as e:
            logger.error(f"Error fetching GitHub resources: {str(e)}")

        # Get blog posts with timeout
        try:
            logger.info("Fetching blog posts...")
            blog_posts = await run_with_timeout(
                scraper.get_blog_posts_async,
                timeout=60  # Increased timeout
            )
            logger.info(f"Successfully fetched {len(blog_posts)} blog posts")

            # Transform blog posts
            transformed_blogs = [{
                'title': post['title'],
                'url': post['url'],
                'description': post.get('description', ''),
                'type': 'blog',
                'author': post.get('author', ''),
                'published_date': post.get('published_date', '')
            } for post in blog_posts]
            all_resources.extend(transformed_blogs)

        except TimeoutError:
            logger.error("Blog posts fetch timed out")
        except Exception as e:
            logger.error(f"Error fetching blog posts: {str(e)}")

        # Get job listings with timeout
        try:
            logger.info("Fetching job listings...")
            job_listings = await run_with_timeout(
                scraper.get_job_listings_async,
                timeout=60  # Increased timeout
            )
            logger.info(f"Successfully fetched {len(job_listings)} job listings")

            # Transform job listings
            transformed_jobs = [{
                'title': job.get('title', 'Untitled Position'),
                'url': job.get('url', ''),
                'description': job.get('description', ''),
                'type': 'job_listing',
                'company': job.get('company', ''),
                'location': job.get('location', ''),
                'date': job.get('date', '')
            } for job in job_listings]
            all_resources.extend(transformed_jobs)

        except TimeoutError:
            logger.error("Job listings fetch timed out")
        except Exception as e:
            logger.error(f"Error fetching job listings: {str(e)}")

        if not all_resources:
            logger.warning("No resources were fetched from any source")
            return JSONResponse(
                content={"error": "No resources available"},
                status_code=404
            )

        # Cache the results
        if hasattr(app.state, 'resources_cache'):
            app.state.resources_cache["all_resources"] = all_resources
            logger.info(f"Successfully collected and cached {len(all_resources)} total resources")

        return JSONResponse(content=all_resources)

    except Exception as e:
        logger.error(f"Error in get_resources endpoint: {str(e)}")
        return JSONResponse(
            content={"error": "Failed to fetch resources"},
            status_code=500
        )

@app.get("/api/jobs")
async def get_jobs() -> JSONResponse:
    """Get job listings."""
    try:
        logger.info("Starting job listings fetch")
        scraper = DevRelScraper()
        jobs = await scraper.get_job_listings_async()  # Use the async implementation directly

        if not jobs:
            logger.warning("No job listings found")
            return JSONResponse(
                content={"jobs": []}
            )

        logger.info(f"Successfully fetched {len(jobs)} job listings")
        return JSONResponse(content={"jobs": jobs})

    except Exception as e:
        logger.error(f"Error fetching job listings: {str(e)}")
        return JSONResponse(
            content={"error": f"Failed to fetch job listings: {str(e)}"},
            status_code=500
        )

@app.post("/api/resources/update")
async def update_resources():
    """Update all resources including jobs."""
    try:
        logger.info("Starting resource update process")
        scraper = DevRelScraper()

        # Load existing resources first
        existing_resources = scraper._load_existing_resources()
        logger.info(f"Loaded existing resources: {sum(len(resources) for resources in existing_resources.values())} total items")

        # Scrape new resources
        new_resources = await scraper.scrape_all_async()
        logger.info(f"Scraped new resources: {sum(len(resources) for resources in new_resources.values())} total items")

        # Append new resources to existing ones
        merged_resources = scraper.append_resources(new_resources, existing_resources)
        logger.info(f"Merged resources: {sum(len(resources) for resources in merged_resources.values())} total items")

        # Clear the cache to ensure fresh data on next request
        if hasattr(app.state, 'resources_cache'):
            app.state.resources_cache.clear()
            logger.info("Cleared resources cache")

        # Return success response with resource counts
        return JSONResponse(content={
            "status": "success",
            "message": "Resources updated successfully",
            "counts": {
                resource_type: len(resources)
                for resource_type, resources in merged_resources.items()
            }
        })

    except Exception as e:
        logger.error(f"Error updating resources: {str(e)}")
        return JSONResponse(
            content={"error": f"Failed to update resources: {str(e)}"},
            status_code=500
        )

@app.get("/api/visualizations/metrics")
async def get_metrics():
    """Get DevRel metrics data."""
    try:
        data_path = Path(__file__).parent / "data" / "metrics.json"
        viz_data = VisualizationData(str(data_path))
        return JSONResponse(content=viz_data.get_data())
    except Exception as e:
        logger.error(f"Error fetching metrics: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch metrics: {str(e)}"
        )

@app.post("/api/visualizations/metrics/append")
async def append_metric(metric: MetricPoint):
    """Append new metric data."""
    try:
        data_path = Path(__file__).parent / "data" / "metrics.json"
        viz_data = VisualizationData(str(data_path))
        viz_data.append_metric(metric)
        return JSONResponse(content={"message": "Metric appended successfully"})
    except Exception as e:
        logger.error(f"Error appending metric: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to append metric: {str(e)}"
        )

@app.get("/api/visualizations/career-path")
async def get_career_path():
    """Get DevRel career path data."""
    try:
        data_path = Path(__file__).parent / "data" / "career_path.json"
        viz_data = VisualizationData(str(data_path))
        return JSONResponse(content=viz_data.get_data())
    except Exception as e:
        logger.error(f"Error fetching career path: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch career path: {str(e)}"
        )

@app.post("/api/visualizations/career-path/append")
async def append_career_path(node: CareerPathNode):
    """Append new career path node."""
    try:
        data_path = Path(__file__).parent / "data" / "career_path.json"
        viz_data = VisualizationData(str(data_path))
        viz_data.append_career_path_node(node)
        return JSONResponse(content={"message": "Career path node appended successfully"})
    except Exception as e:
        logger.error(f"Error appending career path node: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to append career path node: {str(e)}"
        )

@app.get("/api/visualizations/community-graph")
async def get_community_graph():
    """Get DevRel community graph data."""
    try:
        data_path = Path(__file__).parent / "data" / "community_graph.json"
        viz_data = VisualizationData(str(data_path))
        return JSONResponse(content=viz_data.get_data())
    except Exception as e:
        logger.error(f"Error fetching community graph: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch community graph: {str(e)}"
        )

@app.post("/api/visualizations/community-graph/append")
async def append_community_node(node: CommunityNode):
    """Append new community graph node."""
    try:
        data_path = Path(__file__).parent / "data" / "community_graph.json"
        viz_data = VisualizationData(str(data_path))
        viz_data.append_community_node(node)
        return JSONResponse(content={"message": "Community node appended successfully"})
    except Exception as e:
        logger.error(f"Error appending community node: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to append community node: {str(e)}"
        )

@app.get("/api/visualizations/skills-matrix")
async def get_skills_matrix():
    """Get DevRel skills matrix data."""
    try:
        data_path = Path(__file__).parent / "data" / "skills_matrix.json"
        viz_data = VisualizationData(str(data_path))
        return JSONResponse(content=viz_data.get_data())
    except Exception as e:
        logger.error(f"Error fetching skills matrix: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch skills matrix: {str(e)}"
        )

@app.post("/api/visualizations/skills-matrix/append")
async def append_skill_update(skill: SkillUpdate):
    """Append new skill update."""
    try:
        data_path = Path(__file__).parent / "data" / "skills_matrix.json"
        viz_data = VisualizationData(str(data_path))
        viz_data.append_skill(skill)
        return JSONResponse(content={"message": "Skill update appended successfully"})
    except Exception as e:
        logger.error(f"Error appending skill update: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to append skill update: {str(e)}"
        )

@app.get("/api/visualizations/metrics-flow")
async def get_metrics_flow():
    """Get metrics flow visualization data."""
    try:
        from .visualizations.metrics_flow import MetricsFlowVisualizer
        visualizer = MetricsFlowVisualizer()
        data = visualizer.generate_visualization_data()
        return JSONResponse(content=data)
    except Exception as e:
        logger.error(f"Error generating metrics flow visualization: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error generating metrics flow visualization: {str(e)}"
        )

@app.get("/api/visualizations/developer-journey")
async def get_developer_journey():
    """Get developer journey visualization data."""
    try:
        from .visualizations.developer_journey import DeveloperJourneyVisualizer
        visualizer = DeveloperJourneyVisualizer()
        data = visualizer.generate_visualization_data()
        return JSONResponse(content=data)
    except Exception as e:
        logger.error(f"Error generating developer journey visualization: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error generating developer journey visualization: {str(e)}"
        )

@app.get("/api/visualizations/community-insights")
async def get_community_insights():
    """Get community insights visualization data."""
    try:
        from .visualizations.community_insights import CommunityInsightsVisualizer
        visualizer = CommunityInsightsVisualizer()
        data = visualizer.generate_visualization_data()
        return JSONResponse(content=data)
    except Exception as e:
        logger.error(f"Error generating community insights visualization: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error generating community insights visualization: {str(e)}"
        )

@app.post("/api/analyze-data")
async def run_analyze_data() -> ScriptResponse:
    try:
        result = await analyze_data()
        return ScriptResponse(
            status=result["status"],
            message=result["message"],
            data=result["data"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/verify-links")
async def run_verify_links() -> ScriptResponse:
    try:
        result = await verify_links()
        return ScriptResponse(
            status=result["status"],
            message=result["message"],
            data=result["data"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/visualizations/generate")
async def generate_visualizations() -> ScriptResponse:
    """Generate all visualization data files."""
    try:
        result = await run_with_timeout(generate_all_visualizations, timeout=60)
        if result:
            return ScriptResponse(
                status="success",
                message="Visualizations generated successfully",
                data={"generated": True}
            )
        else:
            return ScriptResponse(
                status="error",
                message="Failed to generate visualizations",
                data={"generated": False}
            )
    except Exception as e:
        logger.error(f"Error in visualization generation: {str(e)}")
        return ScriptResponse(
            status="error",
            message=f"Error in visualization generation: {str(e)}",
            data=None
        )

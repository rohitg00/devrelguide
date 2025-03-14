import pytest
import requests
import logging
import sys
import time
from typing import Dict, List, Optional

logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@pytest.fixture
def endpoint():
    return '/api/resources'

def test_single_request(endpoint: str, timeout: int = 30) -> Optional[Dict]:
    """Test a single endpoint with timeout."""
    try:
        logger.info(f"Testing endpoint: {endpoint}")
        start_time = time.time()
        response = requests.get(f'http://localhost:8000{endpoint}', timeout=timeout)
        duration = time.time() - start_time

        logger.info(f"Request to {endpoint} took {duration:.2f} seconds")

        if response.status_code == 200:
            data = response.json()
            logger.info(f"Successfully received response from {endpoint}")
            return data
        else:
            logger.error(f"Error: Status code {response.status_code} from {endpoint}")
            logger.error(f"Response: {response.text}")
            return None

    except requests.Timeout:
        logger.error(f"Request to {endpoint} timed out after {timeout} seconds")
        return None
    except Exception as e:
        logger.error(f"Error testing {endpoint}: {str(e)}")
        return None

def test_resources_endpoint(endpoint):
    """Test the resources endpoint with individual timeouts."""
    logger.info("Starting resource endpoint tests...")

    result = test_single_request(endpoint)
    if result is not None:
        if isinstance(result, list):
            # Consider partial success if we got any resources
            if len(result) > 0:
                logger.info(f"Successfully retrieved {len(result)} resources")
                assert True
            else:
                logger.warning("Retrieved empty resource list")
                assert False
        else:
            assert True
    else:
        assert False

    # Count resources by type if we have results
    if result and isinstance(result, list):
        resource_types = {}
        for resource in result:
            resource_type = resource.get('type', 'unknown')
            resource_types[resource_type] = resource_types.get(resource_type, 0) + 1

        logger.info("Resource counts by type:")
        for rtype, count in resource_types.items():
            logger.info(f"- {rtype}: {count}")

if __name__ == "__main__":
    pytest.main([__file__])

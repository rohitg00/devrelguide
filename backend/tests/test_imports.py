"""
Test file to verify imports are working correctly.
"""
import logging
import pytest

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_imports():
    try:
        from app.scripts.update_resources import update_resources
        from app.scraper.devrel_scraper import DevRelScraper
        logger.info("Successfully imported update_resources and DevRelScraper")

        # Test instantiation
        scraper = DevRelScraper()
        logger.info("Successfully instantiated DevRelScraper")

        assert True
    except Exception as e:
        logger.error(f"Import error: {str(e)}")
        assert False

if __name__ == "__main__":
    pytest.main([__file__])

from setuptools import setup, find_packages

setup(
    name="devrel-resources",
    version="0.1.0",
    packages=find_packages(),
    python_requires=">=3.11",
    install_requires=[
        "fastapi",
        "uvicorn",
        "aiohttp",
        "cachetools",
        "beautifulsoup4",
        "feedparser",
        "networkx>=3.2.1",
    ],
)

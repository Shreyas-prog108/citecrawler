from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import os

app = FastAPI(title="Citecrawler API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    """API root endpoint"""
    return {
        "message": "CiteCrawler API is running!",
        "version": "1.0.0",
        "status": "operational",
        "endpoints": {
            "search": "/search?q=your_query",
            "health": "/health",
            "test": "/api/test"
        }
    }

@app.get("/search")
async def search_papers(
    q: str = Query(..., description="Search query", min_length=1),
    top_k: int = Query(5, ge=1, le=50, description="Number of results per page"),
    page: int = Query(1, ge=1, description="Page number"),
    source: Optional[str] = Query(None, description="Filter by source")
):
    """Search papers - returns mock data for now"""
    try:
        print(f"🔍 Search query: '{q}' | top_k: {top_k} | page: {page}")
        
        # Return mock data
        mock_results = [
            {
                "id": f"paper-{i}",
                "title": f"Sample paper about {q} - Result {i}",
                "link": f"https://arxiv.org/abs/example{i}",
                "abstract": f"This is a sample paper about {q} with detailed abstract content. This paper discusses various aspects of {q} and provides insights into the field.",
                "source": "papers",
                "score": 0.95 - (i * 0.1),
                "row_id": f"row-{i}"
            }
            for i in range(1, min(top_k + 1, 6))
        ]
        
        return {
            "results": mock_results,
            "total": len(mock_results),
            "page": page,
            "top_k": top_k,
            "query": q,
            "has_more": False,
            "note": "Mock data - simplified for deployment"
        }
        
    except Exception as e:
        print(f"❌ Search error: {str(e)}")
        return {
            "error": f"Search failed: {str(e)}",
            "results": [],
            "total": 0
        }

@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {
        "api": "healthy",
        "status": "operational",
        "version": "1.0.0",
        "timestamp": "2025-01-04"
    }

@app.get("/api/test")
async def test():
    """Simple test endpoint"""
    return {
        "response": "Test successful!",
        "service": "CiteCrawler API",
        "status": "operational",
        "version": "1.0.0"
    }

# Vercel serverless handler - REQUIRED for deployment
handler = app
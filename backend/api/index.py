from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pinecone import Pinecone
from typing import Optional, List
from dotenv import load_dotenv
import os
import requests

load_dotenv()

app = FastAPI(title="Citecrawler API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Lazy initialization
_pc = None
_index = None

def get_pinecone():
    """Initialize Pinecone client"""
    global _pc, _index
    
    if _pc is None:
        api_key = os.getenv('PINECONE_API_KEY') or os.getenv('pinecone_api_key')
        if not api_key:
            raise HTTPException(status_code=503, detail="PINECONE_API_KEY not set")
        
        index_name = os.getenv("INDEX_NAME", "papers-index")
        _pc = Pinecone(api_key=api_key)
        _index = _pc.Index(index_name)
        print(f"✅ Pinecone initialized - Index: {index_name}")
    
    return _pc, _index

def generate_embeddings(text: str) -> List[float]:
    """
    Generate embeddings using Hugging Face Inference API
    Free tier available - no torch needed!
    """
    HF_API_KEY = os.getenv("HUGGINGFACE_API_KEY")
    
    if not HF_API_KEY:
        print("⚠️ No HUGGINGFACE_API_KEY found, using fallback")
        # Fallback: Return a dummy vector (replace with your dimension)
        return [0.0] * 384
    
    API_URL = "https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2"
    headers = {"Authorization": f"Bearer {HF_API_KEY}"}
    
    try:
        response = requests.post(
            API_URL, 
            headers=headers, 
            json={"inputs": text, "options": {"wait_for_model": True}},
            timeout=10
        )
        response.raise_for_status()
        embeddings = response.json()
        
        # Handle different response formats
        if isinstance(embeddings, list):
            if isinstance(embeddings[0], list):
                return embeddings[0]
            return embeddings
        
        raise ValueError("Unexpected embedding format")
        
    except Exception as e:
        print(f"❌ Embedding generation failed: {e}")
        return [0.0] * 384

# Request/Response models
class QueryRequest(BaseModel):
    question: str
    image: Optional[str] = None

class SearchResult(BaseModel):
    id: str
    title: str
    link: str
    abstract: str
    source: str
    score: float
    row_id: str

@app.get("/")
async def root():
    """API root endpoint with available endpoints"""
    return {
        "message": "CiteCrawler API is running!",
        "version": "1.0.0",
        "endpoints": {
            "search": "/search?q=your_query&top_k=5&page=1",
            "health": "/health",
            "test": "/api/test",
            "docs": "/docs"
        },
        "status": "operational"
    }

@app.get("/search")
async def search_papers(
    q: str = Query(..., description="Search query", min_length=1),
    top_k: int = Query(5, ge=1, le=50, description="Number of results per page"),
    page: int = Query(1, ge=1, description="Page number"),
    source: Optional[str] = Query(None, description="Filter by source")
):
    """
    Search papers in Pinecone index using semantic search
    
    Parameters:
    - q: Search query text
    - top_k: Number of results per page (1-50)
    - page: Page number (starts at 1)
    - source: Optional filter by source (e.g., 'arxiv', 'papers')
    
    Returns:
    - results: List of matching papers
    - total: Total results found
    - page: Current page
    - top_k: Results per page
    - has_more: Boolean indicating if more results exist
    """
    try:
        pc, index = get_pinecone()
        
        print(f"🔍 Search query: '{q}' | top_k: {top_k} | page: {page}")
        
        # Generate embedding for the query
        query_embedding = generate_embeddings(q)
        
        # Calculate pagination
        start_idx = (page - 1) * top_k
        query_top_k = min(100, start_idx + top_k + 10)
        
        # Build query parameters
        query_params = {
            "vector": query_embedding,
            "top_k": query_top_k,
            "include_metadata": True
        }
        
        # Add filter if source specified
        if source:
            query_params["filter"] = {"source": source}
        
        # Query Pinecone
        res = index.query(**query_params)
        
        # Format results
        all_results = []
        for m in res.get("matches", []):
            metadata = m.get("metadata", {})
            all_results.append({
                "id": m.get("id", ""),
                "title": metadata.get("title", "No title"),
                "link": metadata.get("link", ""),
                "abstract": metadata.get("abstract", "No abstract available"),
                "source": metadata.get("source", "unknown"),
                "score": round(m.get("score", 0.0), 4),
                "row_id": metadata.get("row_id", "")
            })
        
        # Apply pagination
        end_idx = start_idx + top_k
        paginated_results = all_results[start_idx:end_idx]
        
        print(f"✅ Found {len(all_results)} results, returning {len(paginated_results)}")
        
        return {
            "results": paginated_results,
            "total": len(all_results),
            "page": page,
            "top_k": top_k,
            "query": q,
            "has_more": end_idx < len(all_results)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Search error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")

@app.get("/health")
def health_check():
    """
    Health check endpoint
    Returns API status and Pinecone connection status
    """
    status = {
        "api": "healthy",
        "pinecone": False,
        "huggingface": bool(os.getenv("HUGGINGFACE_API_KEY")),
        "timestamp": "2025-10-04"
    }
    
    try:
        pc, index = get_pinecone()
        stats = index.describe_index_stats()
        status["pinecone"] = True
        status["index_stats"] = {
            "total_vectors": stats.get("total_vector_count", 0),
            "dimension": stats.get("dimension", 0)
        }
    except Exception as e:
        status["pinecone_error"] = str(e)
    
    return status

@app.get("/api/test")
async def test():
    """Simple test endpoint"""
    return {
        "response": "Test successful!",
        "service": "CiteCrawler API",
        "status": "operational",
        "version": "1.0.0"
    }


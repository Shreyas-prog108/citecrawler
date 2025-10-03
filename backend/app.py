from fastapi import FastAPI, Query, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from fastapi.responses import JSONResponse
import os
import json
from scrape import scrape_all
from pinecone_utils import init_pinecone
from sentence_transformers import SentenceTransformer


app = FastAPI(title="Citecrawler API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Pinecone and model
index = init_pinecone()
model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

def embed_texts(texts):
    """Embed texts using the sentence transformer model"""
    return model.encode(texts)

@app.get("/scrape")
def scrape_endpoint(keywords: List[str]=Query(...,description="Keywords to search for")):
    output_file="papers.json"
    scrape_all(keywords)
    if os.path.exists(output_file):
        with open(output_file,"r",encoding="utf-8") as f:
            data=json.load(f)
        return JSONResponse(content=data)
    return JSONResponse(content={"error":"No data found."},status_code=404)

@app.get("/search")
def search_endpoint(q: str = Query(...), top_k: int = 5, page: int = 1, source: Optional[str] = None):
    """Search across papers using semantic search"""
    try:
        # Embed the query
        emb = embed_texts([q])[0]
        
        # Calculate pagination
        start_idx = (page - 1) * top_k
        end_idx = start_idx + top_k
        
        # Get more results to support pagination
        query_top_k = min(100, start_idx + top_k + 10)  # Get extra results for pagination
        
        # Prepare query for Pinecone
        query = {
            "vector": emb.tolist(),
            "top_k": query_top_k,
            "include_metadata": True
        }
        
        # Query Pinecone
        res = index.query(**query)
        
        # Format results
        all_results = [
            {
                "id": m["id"],
                "title": m["metadata"]["title"],
                "link": m["metadata"].get("link", ""),
                "abstract": m["metadata"].get("abstract", ""),
                "source": m["metadata"].get("source", "papers"),
                "score": m["score"],
                "row_id": m["metadata"].get("row_id", "")
            }
            for m in res["matches"]
        ]
        
        # Apply pagination
        paginated_results = all_results[start_idx:end_idx]
        
        return paginated_results
        
    except Exception as e:
        print(f"Search error: {str(e)}")
        return JSONResponse(
            content={"error": f"Search failed: {str(e)}"}, 
            status_code=500
        )

@app.get("/")
def root():
    return {"message": "CiteCrawler API is running!", "docs": "/docs"}
from fastapi import FastAPI, Query
from typing import List
from fastapi.responses import JSONResponse
import os
import json
from scrape import scrape_all

app = FastAPI()

@app.get("/scrape")
def scrape_endpoint(keywords: List[str]=Query(...,description="Keywords to search for")):
    output_file="papers.json"
    scrape_all(keywords)
    if os.path.exists(output_file):
        with open(output_file,"r",encoding="utf-8") as f:
            data=json.load(f)
        return JSONResponse(content=data)
    return JSONResponse(content={"error":"No data found."},status_code=404)

keywords = [
    # Core fields
    "machine learning",
    "deep learning",
    "artificial intelligence",
    "data science",
    "computer vision",
    "natural language processing",
    "reinforcement learning",
    "supervised learning",
    "unsupervised learning",
    "transfer learning",
    "representation learning",
    "semi-supervised learning",

    # Application areas
    "speech recognition",
    "image processing",
    "object detection",
    "generative models",
    "recommender systems",
    "anomaly detection",
    "time series forecasting",
    "robotics",
    "bioinformatics",
    "medical imaging",

    # Trending topics
    "large language models",
    "generative adversarial networks",
    "graph neural networks",
    "explainable AI",
    "federated learning",
    "self-supervised learning",
    "multi-modal learning",
    "edge AI",
    "AI ethics",

    # Other useful keywords
    "pattern recognition",
    "feature selection",
    "dimensionality reduction",
    "clustering",
    "classification",
    "regression",
    "optimization",
    "neural networks",
    "convolutional neural networks",
    "recurrent neural networks",
    "transformers"
]

scrape_all(keywords)

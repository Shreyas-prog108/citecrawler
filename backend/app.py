from fastapi import FastAPI, Query, BackgroundTasks
from typing import List
from fastapi.responses import JSONResponse
import os
import json
from scrape import scrape_all

app = FastAPI()

# Removed @app.on_event("startup") and related background task code

@app.get("/scrape")
def scrape_endpoint(keywords: List[str]=Query(...,description="Keywords to search for")):
    output_file="papers.json"
    scrape_all(keywords)
    if os.path.exists(output_file):
        with open(output_file,"r",encoding="utf-8") as f:
            data=json.load(f)
        return JSONResponse(content=data)
    return JSONResponse(content={"error":"No data found."},status_code=404)
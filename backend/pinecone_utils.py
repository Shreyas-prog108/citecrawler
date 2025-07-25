import os
import json
from dotenv import load_dotenv
from pinecone import Pinecone
from sentence_transformers import SentenceTransformer
load_dotenv()

def init_pinecone():
    PINECONE_API_KEY = os.getenv("PINECONE_API_KEY", "YOUR_PINECONE_API_KEY")
    INDEX_NAME = "papers-index"
    pc = Pinecone(api_key=PINECONE_API_KEY)
    index = pc.Index(INDEX_NAME)
    return index

def upsert_papers(json_path="datastorage/all_papers.json", batch_size=100):
    index = init_pinecone()
    model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
    with open(json_path) as f:
        papers = json.load(f)
    batch = []
    for i, paper in enumerate(papers):
        paper_id = f"paper-{i}"
        text = paper['title']
        vector = model.encode(text).tolist()
        batch.append({
            "id": paper_id,
            "values": vector,
            "metadata": {
                "title": paper['title'],
                "link": paper['link'],
                "keyword": paper['keyword']
            }
        })
        if len(batch) == batch_size or i == len(papers) - 1:
            index.upsert(batch)
            print(f"Upserted {i+1} papers...")
            batch = []
    print("Upsert complete!")

if __name__ == "__main__":
    upsert_papers()
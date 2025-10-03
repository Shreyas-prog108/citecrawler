import os
import json
from dotenv import load_dotenv
from pinecone import Pinecone
from sentence_transformers import SentenceTransformer
load_dotenv()

# Global variables for easy access
index = None
model = None

def init_pinecone():
    global index, model
    PINECONE_API_KEY = os.getenv("PINECONE_API_KEY", "YOUR_PINECONE_API_KEY")
    INDEX_NAME = "papers-index"
    pc = Pinecone(api_key=PINECONE_API_KEY)
    index = pc.Index(INDEX_NAME)
    model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
    return index

def embed_texts(texts):
    """Embed texts using the sentence transformer model"""
    global model
    if model is None:
        model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
    return model.encode(texts)

def upsert_papers(json_path="datastorage/all_papers.json", batch_size=100):
    index = init_pinecone()
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
                "keyword": paper['keyword'],
                "source": "papers"  # Add source field
            }
        })
        if len(batch) == batch_size or i == len(papers) - 1:
            index.upsert(batch)
            print(f"Upserted {i+1} papers...")
            batch = []
    print("Upsert complete!")

if __name__ == "__main__":
    upsert_papers()
import os
from qdrant_client import QdrantClient
from app.core.config import settings

try:
    qdrant_client = QdrantClient(
        host=settings.QDRANT_HOST or "localhost",
        port=settings.QDRANT_PORT,
        timeout=2.0
    )
except Exception as e:
    print(f"Qdrant server unavailable ({e}), falling back to embedded local Qdrant storage.")
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    storage_path = os.path.join(base_dir, "uploads", "qdrant_db")
    os.makedirs(storage_path, exist_ok=True)
    qdrant_client = QdrantClient(path=storage_path)
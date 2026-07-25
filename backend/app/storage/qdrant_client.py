import os
from qdrant_client import QdrantClient
from app.core.config import settings

qdrant_host = getattr(settings, "QDRANT_HOST", "")

if qdrant_host and qdrant_host not in ["localhost", "127.0.0.1"]:
    try:
        qdrant_client = QdrantClient(
            host=qdrant_host,
            port=settings.QDRANT_PORT,
            timeout=3.0,
            check_compatibility=False
        )
    except Exception as e:
        print(f"Remote Qdrant host ({qdrant_host}) connection failed ({e}), using embedded Qdrant.")
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        storage_path = os.path.join(base_dir, "uploads", "qdrant_db")
        os.makedirs(storage_path, exist_ok=True)
        qdrant_client = QdrantClient(path=storage_path)
else:
    # Use local embedded storage when running without external Qdrant cluster
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    storage_path = os.path.join(base_dir, "uploads", "qdrant_db")
    os.makedirs(storage_path, exist_ok=True)
    qdrant_client = QdrantClient(path=storage_path)
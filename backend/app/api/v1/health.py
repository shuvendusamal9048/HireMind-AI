from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession
from app.storage.minio_client import minio_client
from app.storage.qdrant_client import qdrant_client
from app.db.session import get_db

router = APIRouter()


@router.get("/health")
async def health(
    db: AsyncSession = Depends(get_db)
):
    postgres_status = False
    minio_status = False
    qdrant_status = False

    # PostgreSQL Check
    try:
        await db.execute(text("SELECT 1"))
        postgres_status = True
    except Exception:
        postgres_status = False

    # MinIO Check
    try:
        minio_client.list_buckets()
        minio_status = True
    except Exception:
        minio_status = False

    # Qdrant Check
    try:
        qdrant_client.get_collections()
        qdrant_status = True
    except Exception:
        qdrant_status = False

    overall_status = (
        postgres_status
        and minio_status
        and qdrant_status
    )

    return {
        "status": "healthy" if overall_status else "unhealthy",
        "services": {
            "postgres": postgres_status,
            "minio": minio_status,
            "qdrant": qdrant_status
        }
    }
import uuid
import os

from datetime import timedelta

from minio import Minio

from app.core.config import settings


client = Minio(
    settings.MINIO_ENDPOINT,
    access_key=settings.MINIO_ACCESS_KEY,
    secret_key=settings.MINIO_SECRET_KEY,
    secure=False
)


def upload_resume(file):
    extension = os.path.splitext(file.filename)[1]
    filename = f"{uuid.uuid4()}{extension}"

    # Try uploading to MinIO
    try:
        if not client.bucket_exists(settings.MINIO_BUCKET):
            client.make_bucket(settings.MINIO_BUCKET)

        client.put_object(
            bucket_name=settings.MINIO_BUCKET,
            object_name=filename,
            data=file.file,
            length=-1,
            part_size=10 * 1024 * 1024,
            content_type=file.content_type
        )

        url = client.presigned_get_object(
            settings.MINIO_BUCKET,
            filename,
            expires=timedelta(days=7)
        )

        return {
            "filename": filename,
            "url": url
        }
    except Exception as e:
        print(f"MinIO unavailable ({e}), using local file storage fallback.")

        # Local storage fallback
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        upload_dir = os.path.join(base_dir, "uploads", "resumes")
        os.makedirs(upload_dir, exist_ok=True)

        file_path = os.path.join(upload_dir, filename)
        file.file.seek(0)
        with open(file_path, "wb") as f:
            f.write(file.file.read())

        return {
            "filename": filename,
            "url": f"/uploads/resumes/{filename}"
        }
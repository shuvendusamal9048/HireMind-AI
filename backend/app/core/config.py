from pathlib import Path

from pydantic_settings import BaseSettings

ROOT_DIR = Path(__file__).resolve().parents[3]


class Settings(BaseSettings):
    APP_NAME: str = "HireMind AI"
    APP_ENV: str = "development"

    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: int = 5432
    POSTGRES_DB: str = "hiremind_db"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "12345"

    JWT_SECRET_KEY: str = "supersecret"
    JWT_ALGORITHM: str = "HS256"

    MINIO_ENDPOINT: str = "localhost:9000"
    MINIO_ACCESS_KEY: str = "minioadmin"
    MINIO_SECRET_KEY: str = "minioadmin"
    MINIO_BUCKET: str = "resumes"

    QDRANT_HOST: str = "localhost"
    QDRANT_PORT: int = 6333

    GEMINI_API_KEY: str = ""

    MAIL_USERNAME: str = ""
    MAIL_PASSWORD: str = ""

    class Config:
        env_file = str(ROOT_DIR / ".env")
        env_file_encoding = "utf-8"
        extra = "ignore"


settings = Settings()
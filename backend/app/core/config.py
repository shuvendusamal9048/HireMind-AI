from pathlib import Path

from pydantic_settings import BaseSettings

ROOT_DIR = Path(__file__).resolve().parents[3]


class Settings(BaseSettings):
    APP_NAME: str
    APP_ENV: str

    POSTGRES_HOST: str
    POSTGRES_PORT: int
    POSTGRES_DB: str
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str

    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str

    MINIO_ENDPOINT: str
    MINIO_ACCESS_KEY: str
    MINIO_SECRET_KEY: str

    QDRANT_HOST: str
    QDRANT_PORT: int

    class Config:
        env_file = str(ROOT_DIR / ".env")


settings = Settings()
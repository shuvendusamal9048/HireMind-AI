FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install
COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source code and set up upload directories
COPY backend /app/backend
RUN mkdir -p /app/backend/uploads/resumes

# Set working directory to backend
WORKDIR /app/backend
ENV PYTHONPATH=/app/backend

# Expose port
EXPOSE 8000

# Run uvicorn server via python module
CMD ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

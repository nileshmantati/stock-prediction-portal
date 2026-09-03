# ─── Stage 1: Base image ───────────────────────────────────────────
FROM python:3.12-slim AS base

# System dependencies needed by numpy, matplotlib, h5py (Keras)
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    g++ \
    libhdf5-dev \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python dependencies first (layer caching)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ─── Stage 2: Production image ─────────────────────────────────────
FROM base AS production

COPY . .

# Collect static files
RUN python manage.py collectstatic --noinput || true

EXPOSE 8000

# Run migrations then start gunicorn
CMD ["sh", "-c", "python manage.py migrate && gunicorn predictions_portal.wsgi:application --bind 0.0.0.0:${PORT:-8000} --workers 1 --threads 2 --timeout 300 --access-logfile - --error-logfile -"]

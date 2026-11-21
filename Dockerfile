# ========================================================
# Dockerfile: Aplikasi Surat Pengantar PKL
# Instansi : SMKN 1 FYJ Channel
# Multi-runtime lightweight production container
# ========================================================

FROM python:3.11-alpine

LABEL maintainer="SMKN 1 FYJ Channel"
LABEL description="Aplikasi Surat Pengantar PKL Terpadu Multi-Page Application"

WORKDIR /app

# Install sqlite3 runtime and tools
RUN apk add --no-cache sqlite bash curl

# Copy application files into container
COPY . /app

# Ensure proper executable permissions
RUN chmod +x /app/app.py 2>/dev/null || true

# Expose default HTTP port
EXPOSE 8000

# Mount volumes for persistent database and media assets
VOLUME ["/app/database", "/app/assets"]

# Container Healthcheck to verify HTTP server responsiveness
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8000/api/status || exit 1

# Start Python SQLite HTTP Server
CMD ["python", "app.py", "8000"]

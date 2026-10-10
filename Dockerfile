# Small Linux image with the same Python version as local dev
FROM python:3.11-slim

# Lambda Web Adapter: translates Lambda events into normal HTTP requests,
# so FastAPI runs on Lambda without code changes
COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.8.4 /lambda-adapter /opt/extensions/lambda-adapter

# PORT: where the adapter looks for the app
# READINESS_CHECK_PATH: adapter waits for 200 here before sending traffic
# PYTHONUNBUFFERED: logs go out immediately (visible in CloudWatch)
# PYTHONDONTWRITEBYTECODE: no .pyc files in the image
# HOME=/tmp: Lambda filesystem is read-only except /tmp; Prophet writes temp files
ENV PORT=8080 \
    AWS_LWA_READINESS_CHECK_PATH=/health \
    PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    HOME=/tmp

WORKDIR /app

# Dependencies first, code later: Docker caches this layer,
# so a code change does not reinstall packages (seconds instead of minutes)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Backend only; frontend goes to S3, secrets come from env at runtime
COPY app/ ./app/

# Same command as local dev, without --reload
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
# backend/Dockerfile
ARG PYTHON_VERSION=3.9.1
FROM python:${PYTHON_VERSION}

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["python", "main.py"]

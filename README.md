# Traffic Sentinel - Analytics Microservice

A containerized microservice for ingesting high-volume API traffic logs, storing them efficiently, and visualizing system health metrics through a dashboard.

# 🐳 Build & Run with Docker

This application is fully containerized and can be built and run locally using **Docker Compose**. No manual installation of Node.js, PostgreSQL, or frontend dependencies is required.

---

## ✅ Prerequisites

Ensure the following are installed and running on your system:

* **Docker Desktop** (v20.10 or higher)
* **Docker Compose** (v2.0 or higher)

Verify installation:

```bash
docker --version
docker compose version
```

---

## 📥 Clone the Repository

```bash
git clone <repository-url>
cd traffic-sentinel
```

---

## 🔧 Environment Setup

The project includes a preconfigured `.env.example` file with working default values.

Create your local environment file:

```bash
cp .env.example .env
```

> ℹ️ The `.env` file is gitignored for security.
> You can use the default values as-is or customize them if needed.

---

## ▶️ Build & Start the Application

From the project root directory, run:

```bash
docker-compose up --build
```

This command will:

* Build Docker images for all services
* Start the backend, frontend, database, nginx proxy, and simulator
* Automatically set up networking and volumes

⏳ The first build may take a few minutes.

---

## 🌐 Access the Application

Once all containers are running:

* **Dashboard:** [http://localhost](http://localhost)
* **API Base URL:** [http://localhost/api](http://localhost/api)
* **Health Check:** [http://localhost/health](http://localhost/health)

---

## 🧪 Verify Running Services

Check container status:

```bash
docker-compose ps
```

Check logs:

```bash
docker-compose logs -f
```

Health check:

```bash
curl http://localhost/health
```

---

## ⏹️ Stop the Application

Stop all running containers:

```bash
docker-compose down
```

Stop containers and remove all persisted data (including database volumes):

```bash
docker-compose down -v
```

---

## 📌 Notes

* All services communicate through an internal Docker network.
* Only **Nginx (port 80)** is exposed externally.
* Database data persists across restarts unless volumes are removed.
* The built-in simulator automatically generates traffic for testing analytics.

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/logs` | Ingest single log event |
| POST | `/api/logs/batch` | Ingest batch of log events (max 1000) |
| GET | `/api/logs/recent` | Retrieve logs with pagination and filters |
| GET | `/api/logs/services` | Get list of available service names |
| GET | `/api/analytics/summary` | Get aggregated metrics |
| GET | `/api/analytics/timeseries` | Get time-series data |
| GET | `/api/analytics/detailed` | Get comprehensive analytics (includes status distribution, top services, etc.) |
| GET | `/health` | Health check endpoint |

### Authentication
All `/api/*` endpoints require an API key in the header:
```
x-api-key: your-api-key
```

### Example: Ingest Log Event
```bash
curl -X POST http://localhost/api/logs \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-api-key" \
  -d '{
    "service_name": "user-service",
    "timestamp": "2025-01-15T10:30:00Z",
    "status_code": 200,
    "latency_ms": 45,
    "origin_ip": "192.168.1.100"
  }'
```

### Example: Ingest Batch Log Events
```bash
curl -X POST http://localhost/api/logs/batch \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-api-key" \
  -d '[
    {
      "service_name": "user-service",
      "timestamp": "2025-01-15T10:30:00Z",
      "status_code": 200,
      "latency_ms": 45,
      "origin_ip": "192.168.1.100"
    },
    {
      "service_name": "api-service",
      "timestamp": "2025-01-15T10:30:01Z",
      "status_code": 201,
      "latency_ms": 120,
      "origin_ip": "192.168.1.101"
    }
  ]'
```

### Example: Get Logs with Filters
```bash
curl -X GET "http://localhost/api/logs/recent?page=1&limit=10&serviceName=user-service&statusCode=2xx" \
  -H "x-api-key: your-api-key"
```

### Example: Get Analytics Summary
```bash
curl -X GET "http://localhost/api/analytics/summary?startTime=2025-01-15T00:00:00Z&endTime=2025-01-15T23:59:59Z" \
  -H "x-api-key: your-api-key"
```

## 🏗️ Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Nginx     │────▶│   Backend   │────▶│  PostgreSQL │
│   (Proxy)   │     │   (Node.js) │     │ (TimescaleDB)│
└─────────────┘     └─────────────┘     └─────────────┘
       │                   ▲
       │                   │
       ▼                   │
┌─────────────┐     ┌─────────────┐
│  Frontend   │     │  Simulator  │
│   (React)   │     │ (Load Gen)  │
└─────────────┘     └─────────────┘
```

## 🐳 Services

| Service | Port | Description |
|---------|------|-------------|
| nginx | 80 | Reverse proxy & static file server |
| backend | 4000 | REST API server (internal) |
| frontend | 80 | React dashboard (internal) |
| database | 5432 | PostgreSQL with TimescaleDB (internal) |
| simulator | - | Traffic generator |

## 📁 Project Structure

```
traffic-sentinel/
├── backend/          # Node.js REST API
├── frontend/         # React dashboard
├── simulator/        # Traffic generator
├── database/         # SQL initialization scripts
├── nginx/            # Reverse proxy configuration
└── docker-compose.yml
```

---

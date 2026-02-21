# CardioTwin Backend Documentation

## Table of Contents

-   [Overview](#overview)
-   [Project Structure](#project-structure)
-   [Installation](#installation)
-   [Configuration](#configuration)
-   [API Endpoints](#api-endpoints)
-   [Biometric Scoring System](#biometric-scoring-system)
-   [Database](#database)
-   [Error Handling](#error-handling)
-   [Testing](#testing)

## Overview

CardioTwin is a FastAPI-based backend that processes real-time biometric data from ESP32 devices, calculates cardiovascular health scores, and provides predictive health insights.

**Tech Stack:** FastAPI, Python 3.8+, SQLite/PostgreSQL, SQLAlchemy

**Base URL:** `https://cardiotwin.azurewebsites.net`

## Project Structure

```
fastapi_project/
├── app/
│   ├── main.py              # Application entry point
│   ├── config.py            # Configuration settings
│   ├── models/              # Database models
│   ├── schemas/             # Pydantic schemas
│   ├── routers/             # API endpoints (session, reading, score, predict)
│   ├── services/            # Business logic (scoring, baseline, prediction)
│   └── utils/               # Utility functions
├── tests/
├── requirements.txt
└── README.md
```

## Installation

```bash
git clone <repository-url>
cd fastapi_project
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # Linux/Mac
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Configuration

Set in `.env` file:

| Variable               | Description                  | Default              |
| ---------------------- | ---------------------------- | -------------------- |
| `DATABASE_URL`         | Database connection string   | `sqlite:///./app.db` |
| `DEBUG`                | Enable debug mode            | `False`              |
| `CALIBRATION_READINGS` | Readings needed for baseline | `15`                 |
| `READING_INTERVAL_MS`  | Expected reading interval    | `2000`               |

## API Endpoints

| Method | Endpoint                    | Description                         |
| ------ | --------------------------- | ----------------------------------- |
| `POST` | `/api/session/start`        | Start a new measurement session     |
| `POST` | `/api/reading`              | Submit biometric reading from ESP32 |
| `GET`  | `/api/score/{session_id}`   | Get latest score for session        |
| `GET`  | `/api/history/{session_id}` | Get score history for charts        |
| `POST` | `/api/predict`              | Get risk projection                 |

## Biometric Scoring System

### Health Zones

| Zone      | Label           | Score Range |
| --------- | --------------- | ----------- |
| 🟢 GREEN  | Thriving        | 70-100      |
| 🟡 YELLOW | Caution         | 50-69       |
| 🟠 ORANGE | Elevated Risk   | 30-49       |
| 🔴 RED    | Critical Strain | 0-29        |

### Measured Parameters

| Parameter   | Unit | Normal Range |
| ----------- | ---- | ------------ |
| Heart Rate  | bpm  | 60-100       |
| HRV         | ms   | 20-70        |
| SpO2        | %    | 95-100       |
| Temperature | °C   | 36.1-37.2    |

### Calibration

-   **Readings Required:** 15 readings @ 2s intervals (~30 seconds)
-   Establishes baseline for resting BPM, HRV, SpO2, and temperature

## Database

```bash
alembic upgrade head                              # Run migrations
alembic revision --autogenerate -m "message"      # Create migration
```

## Error Handling

```json
{ "detail": "Error message", "status_code": 400 }
```

| Code  | Description           |
| ----- | --------------------- |
| `200` | Success               |
| `201` | Created               |
| `400` | Bad Request           |
| `404` | Not Found             |
| `422` | Validation Error      |
| `500` | Internal Server Error |

## Testing

```bash
pytest                          # Run all tests
pytest --cov=app tests/         # Run with coverage
pytest tests/test_main.py       # Run specific file
```

## Development

```bash
black app/ && isort app/        # Format code
flake8 app/                     # Lint code
```

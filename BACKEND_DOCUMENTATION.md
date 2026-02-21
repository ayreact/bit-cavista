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

---

## Overview

CardioTwin is a FastAPI-based backend application that processes real-time biometric data from ESP32 devices, calculates cardiovascular health scores, and provides predictive health insights.

**Tech Stack:**

-   **Framework:** FastAPI
-   **Language:** Python 3.8+
-   **Database:** SQLite/PostgreSQL (configurable)
-   **ORM:** SQLAlchemy
-   **Hosting:** Azure Web Services

**Base URL:**

```
https://cardiotwin.azurewebsites.net
```

---

## Project Structure

```
fastapi_project/
├── app/
│   ├── __init__.py
│   ├── main.py              # Application entry point
│   ├── config.py            # Configuration settings
│   ├── models/              # Database models
│   ├── schemas/             # Pydantic schemas
│   ├── routers/
│   │   ├── session.py       # Session management endpoints
│   │   ├── reading.py       # Biometric reading endpoints
│   │   ├── score.py         # Score retrieval endpoints
│   │   └── predict.py       # Prediction endpoints
│   ├── services/
│   │   ├── scoring.py       # Health score calculation
│   │   ├── baseline.py      # Baseline calibration
│   │   └── prediction.py    # Risk projection logic
│   └── utils/               # Utility functions
├── tests/                   # Test files
├── docs/                    # Documentation
├── requirements.txt         # Dependencies
└── README.md
```

---

## Installation

### Prerequisites

-   Python 3.8 or higher
-   pip (Python package manager)
-   Virtual environment (recommended)

### Steps

1. **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd fastapi_project
    ```

2. **Create virtual environment:**

    ```bash
    python -m venv venv
    ```

3. **Activate virtual environment:**

    - Windows:
        ```bash
        venv\Scripts\activate
        ```
    - Linux/Mac:
        ```bash
        source venv/bin/activate
        ```

4. **Install dependencies:**

    ```bash
    pip install -r requirements.txt
    ```

5. **Run the application:**
    ```bash
    uvicorn app.main:app --reload
    ```

---

## Configuration

Environment variables can be set in a `.env` file:

| Variable               | Description                  | Default              |
| ---------------------- | ---------------------------- | -------------------- |
| `DATABASE_URL`         | Database connection string   | `sqlite:///./app.db` |
| `DEBUG`                | Enable debug mode            | `False`              |
| `HOST`                 | Server host                  | `0.0.0.0`            |
| `PORT`                 | Server port                  | `8000`               |
| `CALIBRATION_READINGS` | Readings needed for baseline | `15`                 |
| `READING_INTERVAL_MS`  | Expected reading interval    | `2000`               |

---

## API Endpoints

### Base URL

```
https://cardiotwin.azurewebsites.net
```

### Endpoints Overview

| Method | Endpoint                    | Description                         |
| ------ | --------------------------- | ----------------------------------- |
| `POST` | `/api/session/start`        | Start a new measurement session     |
| `POST` | `/api/reading`              | Submit biometric reading from ESP32 |
| `GET`  | `/api/score/{session_id}`   | Get latest score for session        |
| `GET`  | `/api/history/{session_id}` | Get score history for charts        |
| `POST` | `/api/predict`              | Get risk projection                 |

---

## Biometric Scoring System

### Health Zones

| Zone   | Label           | Emoji | Score Range |
| ------ | --------------- | ----- | ----------- |
| GREEN  | Thriving        | 🟢    | 70-100      |
| YELLOW | Caution         | 🟡    | 50-69       |
| ORANGE | Elevated Risk   | 🟠    | 30-49       |
| RED    | Critical Strain | 🔴    | 0-29        |

### Measured Parameters

| Parameter        | Unit      | Normal Range |
| ---------------- | --------- | ------------ |
| Heart Rate (BPM) | beats/min | 60-100       |
| HRV              | ms        | 20-70        |
| SpO2             | %         | 95-100       |
| Temperature      | °C        | 36.1-37.2    |

### Calibration Process

-   **Readings Required:** 15 readings
-   **Reading Interval:** Every 2 seconds
-   **Calibration Time:** ~30 seconds

During calibration, the system collects baseline measurements to establish:

-   Resting BPM
-   Resting HRV
-   Normal SpO2
-   Normal Temperature

---

## Database

### Migrations

Run database migrations:

```bash
alembic upgrade head
```

Create new migration:

```bash
alembic revision --autogenerate -m "migration message"
```

---

## Error Handling

### Standard Error Response

```json
{
    "detail": "Error message",
    "status_code": 400
}
```

### HTTP Status Codes

| Code  | Description           |
| ----- | --------------------- |
| `200` | Success               |
| `201` | Created               |
| `400` | Bad Request           |
| `401` | Unauthorized          |
| `403` | Forbidden             |
| `404` | Not Found             |
| `422` | Validation Error      |
| `500` | Internal Server Error |

---

## Testing

### Run all tests:

```bash
pytest
```

### Run with coverage:

```bash
pytest --cov=app tests/
```

### Run specific test file:

```bash
pytest tests/test_main.py
```

---

## Development

### Code Formatting

```bash
black app/
isort app/
```

### Linting

```bash
flake8 app/
```

---

## Contact

For questions or issues, please open an issue in the repository.

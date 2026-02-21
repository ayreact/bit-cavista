# CardioTwin API Reference

**Base URL:** `https://cardiotwin.azurewebsites.net`

---

## Session Endpoints

### POST /api/session/start

Starts a new measurement session.

**Request Body:**

```json
{
    "session_id": "demo",
    "user_phone": "+2348012345678"
}
```

**Response (200):**

```json
{
    "status": "session_started",
    "session_id": "demo"
}
```

---

## Reading Endpoints

### POST /api/reading

Receives biometric reading from ESP32. Called every 2 seconds during measurement.

**Request Body:**

```json
{
    "bpm": 72,
    "hrv": 42.3,
    "spo2": 98.1,
    "temperature": 36.4,
    "timestamp": 45000,
    "session_id": "demo"
}
```

**Response (Calibrating Phase):**

```json
{
    "status": "calibrating",
    "readings_collected": 8,
    "readings_needed": 15,
    "alert": false
}
```

**Response (Scored Phase):**

```json
{
    "status": "scored",
    "score": 86.2,
    "zone": "GREEN",
    "zone_label": "Thriving",
    "zone_emoji": "🟢",
    "alert": false,
    "nudge_sent": false,
    "components": {
        "heart_rate": { "value": 72, "score": 95.2 },
        "hrv": { "value": 42.3, "score": 88.1 },
        "spo2": { "value": 98.1, "score": 100.0 },
        "temperature": { "value": 36.4, "score": 93.5 }
    },
    "baseline": {
        "resting_bpm": 71.5,
        "resting_hrv": 43.1,
        "normal_spo2": 98.0,
        "normal_temp": 36.35
    }
}
```

---

## Score Endpoints

### GET /api/score/{session_id}

Returns the latest score for frontend polling.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `session_id` | string | Session identifier |

**Response (200):**

```json
{
    "score": 86.2,
    "zone": "GREEN",
    "zone_label": "Thriving",
    "zone_emoji": "🟢",
    "components": {
        "heart_rate": { "value": 72, "score": 95.2 },
        "hrv": { "value": 42.3, "score": 88.1 },
        "spo2": { "value": 98.1, "score": 100.0 },
        "temperature": { "value": 36.4, "score": 93.5 }
    }
}
```

---

### GET /api/history/{session_id}

Returns all scores for chart rendering.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `session_id` | string | Session identifier |

**Response (200):**

```json
[
  {
    "timestamp": "2024-01-15T10:30:00Z",
    "score": 86.2,
    "zone": "GREEN",
    "components": { ... }
  },
  {
    "timestamp": "2024-01-15T10:30:02Z",
    "score": 85.8,
    "zone": "GREEN",
    "components": { ... }
  }
]
```

---

## Prediction Endpoints

### POST /api/predict

What-if risk projection based on current biometric trends.

**Request Body:**

```json
{
    "session_id": "demo",
    "days": 90
}
```

**Response (200):**

```json
{
    "current_score": 41.0,
    "projected_score": 35.2,
    "projected_resting_hr_increase_bpm": 6.8,
    "current_risk_category": "Elevated Risk",
    "projected_risk_category": "Critical Strain",
    "disclaimer": "Statistical projection only. Not a medical diagnosis."
}
```

---

## Data Types Reference

### Reading Object

| Field         | Type    | Description                            |
| ------------- | ------- | -------------------------------------- |
| `bpm`         | float   | Heart rate in beats per minute         |
| `hrv`         | float   | Heart rate variability in milliseconds |
| `spo2`        | float   | Blood oxygen saturation percentage     |
| `temperature` | float   | Body temperature in Celsius            |
| `timestamp`   | integer | Milliseconds since session start       |
| `session_id`  | string  | Session identifier                     |

### Component Score Object

| Field   | Type  | Description              |
| ------- | ----- | ------------------------ |
| `value` | float | Measured value           |
| `score` | float | Calculated score (0-100) |

### Baseline Object

| Field         | Type  | Description                 |
| ------------- | ----- | --------------------------- |
| `resting_bpm` | float | Baseline resting heart rate |
| `resting_hrv` | float | Baseline HRV                |
| `normal_spo2` | float | Baseline SpO2               |
| `normal_temp` | float | Baseline temperature        |

---

## Health Zones

| Zone                      | Score Range | Description                     |
| ------------------------- | ----------- | ------------------------------- |
| 🟢 GREEN (Thriving)       | 70-100      | Optimal cardiovascular health   |
| 🟡 YELLOW (Caution)       | 50-69       | Minor concerns, monitor closely |
| 🟠 ORANGE (Elevated Risk) | 30-49       | Significant risk indicators     |
| 🔴 RED (Critical Strain)  | 0-29        | Immediate attention recommended |

---

## Error Responses

### 400 Bad Request

```json
{
    "detail": "Invalid session_id"
}
```

### 404 Not Found

```json
{
    "detail": "Session not found"
}
```

### 422 Validation Error

```json
{
    "detail": [
        {
            "loc": ["body", "bpm"],
            "msg": "field required",
            "type": "value_error.missing"
        }
    ]
}
```

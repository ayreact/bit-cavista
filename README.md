# CardioTwin API Documentation

## 7. API Contract

All endpoints are served from:  
**Base URL:** `https://cardiotwin.azurewebsites.net`

---

## Endpoints

### **POST** `/api/session/start`
Starts a new measurement session.

**Request:**
```json
{
  "session_id": "demo",
  "user_phone": "+2348012345678"
}
```

**Response:**
```json
{
  "status": "session_started",
  "session_id": "demo"
}
```

---

### **POST** `/api/reading`
Receives biometric readings from ESP32. Called every 2 seconds.

**Request:**
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

**Response (Calibrating):**
```json
{
  "status": "calibrating",
  "readings_collected": 8,
  "readings_needed": 15,
  "alert": false
}
```

**Response (Scored):**
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

### **GET** `/api/score/{session_id}`
Returns the latest score for frontend polling.

**Response:**
```json
{
  "status": "scored",
  "score": 86.2,
  "zone": "GREEN",
  "zone_label": "Thriving",
  "zone_emoji": "🟢",
  "alert": false
}
```

---

### **GET** `/api/history/{session_id}`
Returns all scores for chart rendering. Array of score objects with timestamps.

**Response:**
```json
[
  {
    "timestamp": "2026-02-21T15:13:05.017000",
    "score": 86.2,
    "zone": "GREEN",
    "zone_label": "Thriving",
    "zone_emoji": "🟢"
  },
  {
    "timestamp": "2026-02-21T15:15:05.017000",
    "score": 84.5,
    "zone": "YELLOW",
    "zone_label": "Moderate Strain",
    "zone_emoji": "🟡"
  }
]
```

---

### **POST** `/api/predict`
What-if risk projection.

**Request:**
```json
{
  "session_id": "demo",
  "days": 90
}
```

**Response:**
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

## Notes
- All timestamps are in ISO 8601 format unless otherwise specified.
- The `status` field in responses indicates the current state of the session or reading.
- The `disclaimer` in the `/api/predict` endpoint highlights that the projection is not a medical diagnosis.
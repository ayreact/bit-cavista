export type { Vitals, Patient, Alert };

interface Vitals {
    heartRate: number;
    hrv: number;
    spO2: number;
    skinTemp: number;
    score: number;
    trend: 'Optimized' | 'Stable' | 'Improving' | 'Declining';
}

interface Patient {
    id: string;
    name: string;
    age: number;
    gender: string;
    condition: string;
    roomNumber: string;
    currentVitals: Vitals;
    history: Array<{ time: string; score: number }>;
    riskForecast: number;
    status: 'Critical' | 'Stable' | 'Discharged';
}

interface Alert {
    id: string;
    patientId?: string;
    message: string;
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    timestamp: string;
    isRead: boolean;
}

export const mockPatients: Patient[] = [
    {
        id: "P-1001",
        name: "Sarah Jenkins",
        age: 45,
        gender: "Female",
        condition: "Post-op Cardiac Recovery",
        roomNumber: "ICU-A1",
        status: "Stable",
        currentVitals: {
            heartRate: 72,
            hrv: 42.3,
            spO2: 98.1,
            skinTemp: 36.4,
            score: 86,
            trend: 'Optimized'
        },
        riskForecast: 2.4,
        history: Array.from({ length: 24 }).map((_, i) => ({
            time: `${i}:00`,
            score: 75 + Math.random() * 20
        }))
    },
    {
        id: "P-1002",
        name: "Michael Chen",
        age: 62,
        gender: "Male",
        condition: "Arrhythmia Observation",
        roomNumber: "WARD-B4",
        status: "Critical",
        currentVitals: {
            heartRate: 110,
            hrv: 22.1,
            spO2: 94.5,
            skinTemp: 37.8,
            score: 45,
            trend: 'Declining'
        },
        riskForecast: 15.8,
        history: Array.from({ length: 24 }).map((_, i) => ({
            time: `${i}:00`,
            score: 60 - Math.random() * 25
        }))
    },
    {
        id: "P-1003",
        name: "Elena Rodriguez",
        age: 38,
        gender: "Female",
        condition: "Routine Monitoring",
        roomNumber: "WARD-C2",
        status: "Stable",
        currentVitals: {
            heartRate: 65,
            hrv: 55.4,
            spO2: 99.0,
            skinTemp: 36.6,
            score: 95,
            trend: 'Improving'
        },
        riskForecast: 1.1,
        history: Array.from({ length: 24 }).map((_, i) => ({
            time: `${i}:00`,
            score: 85 + Math.random() * 10
        }))
    }
];

export const mockAlerts: Alert[] = [
    {
        id: "A-001",
        patientId: "P-1002",
        message: "Elevated Heart Rate Detected",
        severity: "High",
        timestamp: "10 mins ago",
        isRead: false
    },
    {
        id: "A-002",
        message: "System Maintenance Scheduled",
        severity: "Low",
        timestamp: "1 hour ago",
        isRead: true
    },
    {
        id: "A-003",
        patientId: "P-1001",
        message: "Skin Temp slightly elevated from baseline",
        severity: "Medium",
        timestamp: "2 hours ago",
        isRead: false
    }
];

export const systemStatus = {
    activeSessions: 42,
    engineVersion: "v4.2.0-clinical-alpha",
    uptime: "99.99%"
};

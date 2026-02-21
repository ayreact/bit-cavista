import { useEffect, useState } from "react";
import { api } from "../services/api"; const ZONE_COLORS: Record<string, string> = {
    GREEN: "#22C55E",
    YELLOW: "#FACC15",
    ORANGE: "#F97316",
    RED: "#EF4444",
};

const ZONE_LABELS: Record<string, string> = {
    GREEN: "Thriving",
    YELLOW: "Mild Strain",
    ORANGE: "Elevated Risk",
    RED: "Critical Strain",
};

export default function DemoPage() {
    const [score, setScore] = useState(0);
    const [displayScore, setDisplayScore] = useState(0);
    const [zone, setZone] = useState("GREEN");
    const [alert, setAlert] = useState(false);

    // Count up animation
    useEffect(() => {
        if (displayScore < score) {
            const timer = setTimeout(() => {
                setDisplayScore((prev) => Math.min(prev + 1, score));
            }, 20);
            return () => clearTimeout(timer);
        }
    }, [displayScore, score]);

    // Poll API every 2 seconds
    useEffect(() => {
        const poll = async () => {
            try {
                const data = await api.getScore("demo");
                if (data.score) {
                    setScore(Math.round(data.score));
                    setZone(data.zone || "GREEN");
                    setAlert(data.alert || false);
                }
            } catch (err) {
                console.log("Polling error:", err);
            }
        };
        poll();
        const interval = setInterval(poll, 2000);
        return () => clearInterval(interval);
    }, []);

    const color = ZONE_COLORS[zone] || "#22C55E";
    const label = ZONE_LABELS[zone] || "Thriving";

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center"
            style={{ backgroundColor: "#0F172A" }}
        >
            {/* Alert Banner */}
            {alert && (
                <div
                    className="w-full text-center py-4 text-white text-2xl font-bold animate-pulse"
                    style={{ backgroundColor: "#EF4444" }}
                >
                    ⚠️ ALERT — Risk Detected! Check WhatsApp.
                </div>
            )}

            {/* Logo */}
            <h1 className="text-white text-3xl font-bold mb-2 tracking-widest uppercase">
                CardioTwin AI
            </h1>
            <p className="text-slate-400 text-lg mb-12">
                Your Heart's Early Warning System
            </p>

            {/* Score Circle */}
            <div
                className="rounded-full flex flex-col items-center justify-center"
                style={{
                    width: 320,
                    height: 320,
                    border: `12px solid ${color}`,
                    boxShadow: `0 0 60px ${color}, 0 0 120px ${color}40`,
                    transition: "all 0.3s ease-in-out",
                }}
            >
                <span
                    className="font-bold"
                    style={{ fontSize: 96, color: color, lineHeight: 1 }}
                >
                    {displayScore}
                </span>
                <span className="text-slate-400 text-xl mt-2">CardioTwin Score</span>
            </div>

            {/* Zone Label */}
            <div
                className="mt-8 px-8 py-3 rounded-full text-2xl font-bold"
                style={{
                    backgroundColor: `${color}20`,
                    color: color,
                    border: `2px solid ${color}`,
                    transition: "all 0.3s ease-in-out",
                }}
            >
                {zone === "GREEN" && "🟢"}
                {zone === "YELLOW" && "🟡"}
                {zone === "ORANGE" && "🟠"}
                {zone === "RED" && "🔴"} {label}
            </div>

            {/* Footer */}
            <p className="text-slate-600 text-sm mt-16">
                Wellness screening tool only — not a medical diagnosis
            </p>
        </div>
    );
}

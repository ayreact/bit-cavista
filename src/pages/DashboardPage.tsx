import { useState, useEffect } from 'react';
import { Activity, Bell, Heart, ThermometerSun, Wind, BrainCircuit, Camera, ArrowLeftRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import { api } from '../services/api';
import type { PredictionResponse } from '../services/api';

export interface Vitals {
    heartRate: number;
    hrv: number;
    spO2: number;
    skinTemp: number;
    score: number;
    trend: 'Improving' | 'Stable' | 'Declining';
}

export default function DashboardPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const sessionId = searchParams.get('session_id');

    const [activeView, setActiveView] = useState<'overview' | 'settings'>('overview');

    const defaultVitals: Vitals = {
        heartRate: 0,
        hrv: 0,
        spO2: 100,
        skinTemp: 36.5,
        score: 0,
        trend: 'Stable'
    };

    const [liveVitals, setLiveVitals] = useState<Vitals>(defaultVitals);
    const [liveHistory, setLiveHistory] = useState<{ time: string, score: number }[]>([]);
    const [prediction, setPrediction] = useState<PredictionResponse | null>(null);

    // Initial load check
    useEffect(() => {
        if (!sessionId) {
            navigate('/');
        }
    }, [sessionId, navigate]);


    // Polling Score API
    useEffect(() => {
        if (activeView !== 'overview' || !sessionId) return;

        const pollScore = async () => {
            try {
                const data = await api.getScore(sessionId);
                setLiveVitals(prev => ({
                    ...prev,
                    heartRate: data.components.heart_rate.value,
                    hrv: data.components.hrv.value,
                    spO2: data.components.spo2.value,
                    skinTemp: data.components.temperature.value,
                    score: Math.round(data.score),
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    trend: data.zone_label as any,
                }));
            } catch (err) {
                console.error("Failed to poll score, using mock data", err);
                // Graceful fallback mock data
                setLiveVitals({
                    heartRate: 62 + Math.floor(Math.random() * 5),
                    hrv: 58 + Math.floor(Math.random() * 4),
                    spO2: 98 + Math.floor(Math.random() * 2),
                    skinTemp: 36.4 + (Math.random() * 0.4),
                    score: 94,
                    trend: 'Improving'
                });
            }
        };

        const interval = setInterval(pollScore, 2000);
        pollScore(); // Initial fetch
        return () => clearInterval(interval);
    }, [activeView, sessionId]);

    // Fetch History and Prediction when component mounts or view changes
    useEffect(() => {
        if (activeView !== 'overview' || !sessionId) return;

        const fetchDetails = async () => {
            // Fetch History
            try {
                const histData = await api.getHistory(sessionId);
                const mappedHistory = histData.map(h => {
                    const date = new Date(h.timestamp);
                    return {
                        time: `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`,
                        score: h.score
                    };
                });

                if (mappedHistory.length > 0) {
                    setLiveHistory(mappedHistory);
                } else {
                    throw new Error("Empty history array");
                }
            } catch (err) {
                console.error("Failed to fetch history, using mock data", err);
                const mockHistory = Array.from({ length: 24 }).map((_, i) => {
                    const hour = new Date();
                    hour.setHours(hour.getHours() - (24 - i));
                    return {
                        time: `${hour.getHours().toString().padStart(2, '0')}:00`,
                        score: 65 + Math.floor(Math.sin(i / 4) * 10) + (i * 1.5)
                    };
                });
                setLiveHistory(mockHistory);
            }

            // Fetch Prediction
            try {
                const predData = await api.getPrediction({ session_id: sessionId, days: 90 });
                setPrediction(predData);
            } catch (err) {
                console.error("Failed to fetch prediction, using mock data", err);
                setPrediction({
                    current_score: 94,
                    projected_score: 98.2,
                    projected_resting_hr_increase_bpm: -2,
                    current_risk_category: 'Low',
                    projected_risk_category: 'Optimal',
                    disclaimer: 'Mock Disclaimer'
                });
            }
        };

        fetchDetails();
    }, [activeView, sessionId]);

    return (
        <div className="bg-background-light text-background-dark h-screen overflow-hidden font-display flex flex-col">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-50 w-full border-b border-primary/10 bg-white/95 backdrop-blur-md shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
                <div className="w-full px-6 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="text-primary bg-primary/10 p-2 rounded-xl">
                            <Activity className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight">CardioTwin <span className="text-primary italic font-serif">AI</span></h1>
                        </div>
                    </Link>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20 shadow-sm">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            <span className="text-xs font-bold uppercase tracking-wider text-primary">Live Status</span>
                        </div>
                        <div className="h-8 w-[1px] bg-background-dark/10"></div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setActiveView('settings')}
                                className="p-2 bg-background-light hover:bg-primary/10 rounded-xl transition-colors text-background-dark/60 hover:text-primary relative shadow-sm border border-transparent hover:border-primary/20"
                            >
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
                            </button>
                            <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-primary/20 shadow-sm">
                                <img
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWXOkTJMP_6l_TFoYjjjmGFjdU6zuDygl_fyTXXnHnGQmH6D8Uea5Vsepca75gCDkc4FztOnI9hV-AAFUzuWPquePJvfdmd9Z7VVjfd-a6IMk9m0SLbuTvSu_s-en5fL3C0vrE89DgKJaOrAZMcefaritp3iJbH1TFSZZTJCMYQFCQSbvXn8mXYKTLbpbniUh_Tld86lZN6eMTc_9F7X-DcwFKoeqNB8khRla_bbGvXdmGtr55EjrWULm-3ln3lE35aD04nOukHAw"
                                    alt="Medical professional"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                <Sidebar activeView={activeView} setActiveView={setActiveView} />

                <main className="flex-1 overflow-y-auto p-6 md:p-8">
                    {activeView === 'overview' && (
                        <div className="space-y-6 max-w-7xl mx-auto">
                            <div className="flex items-end justify-between mb-8">
                                <div>
                                    <h2 className="text-3xl font-extrabold flex items-center gap-3 tracking-tight">
                                        CardioTwin <span className="italic font-serif text-primary font-normal">User</span>
                                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider bg-emerald-100 text-emerald-600 border border-emerald-200 shadow-sm">
                                            Active
                                        </span>
                                    </h2>
                                    <p className="text-background-dark/60 mt-1 font-medium">Session: {sessionId} • General Monitoring</p>
                                </div>
                                <button className="bg-white hover:bg-background-light text-background-dark transition-colors px-5 py-2.5 rounded-xl text-sm font-bold border border-primary/20 shadow-[0_4px_15px_rgb(0,0,0,0.03)] flex items-center justify-center gap-2">
                                    Generate Report
                                </button>
                            </div>

                            {/* Main Dashboard Grid */}
                            <div className="grid grid-cols-12 gap-6">

                                {/* Left Section: Score Gauge */}
                                <div className="col-span-12 xl:col-span-4 flex flex-col gap-6">
                                    <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-primary/10 hover:shadow-[0_8px_30px_rgba(33,196,93,0.1)] transition-all p-8 flex flex-col items-center justify-center relative overflow-hidden h-full min-h-[400px]">
                                        <div className="absolute inset-0 bg-primary/5 opacity-30 pointer-events-none"></div>

                                        <div className="relative w-64 h-64 rounded-full border-[12px] border-background-light flex items-center justify-center shadow-[0_0_40px_rgba(33,196,93,0.05)] bg-white z-10">
                                            <div className="absolute inset-0 rounded-full border-[12px] border-primary border-t-transparent -rotate-45 transition-transform duration-1000 ease-in-out" style={{ transform: `rotate(${(liveVitals.score / 100) * 360 - 225}deg)` }}></div>
                                            <div className="text-center">
                                                <span className="text-7xl font-black text-background-dark tracking-tighter">{liveVitals.score}</span>
                                                <p className="text-primary font-bold text-lg uppercase tracking-widest mt-1">{liveVitals.trend}</p>
                                            </div>
                                        </div>

                                        <div className="mt-8 w-full z-10">
                                            <div className="flex justify-between items-center mb-3">
                                                <span className="text-sm font-bold text-background-dark/70 uppercase tracking-wider">AI Health Insights</span>
                                                <span className="text-xs text-primary font-bold bg-primary/10 px-2 py-1 rounded-md">Just Now</span>
                                            </div>
                                            <div className="bg-background-light border border-primary/10 p-5 rounded-2xl shadow-sm">
                                                <p className="text-sm leading-relaxed text-background-dark/80 font-medium">
                                                    {liveVitals.score > 80
                                                        ? "Current biometric alignment suggests peak cardiovascular recovery. Vitals are stabilizing well above baseline."
                                                        : "Warning indicators present. Slight arrhythmias observed during sleep cycle. Continuous monitoring strongly advised."
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Section: Biometric Grid */}
                                <div className="col-span-12 xl:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Heart Rate */}
                                    <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-primary/10 hover:shadow-[0_8px_30px_rgba(33,196,93,0.1)] transition-all p-6 relative group">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="p-3 bg-rose-50 rounded-2xl text-rose-500 shadow-sm border border-rose-100">
                                                <Heart className="w-6 h-6 animate-pulse" />
                                            </div>
                                            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded uppercase tracking-tighter border border-primary/20">Live</span>
                                        </div>
                                        <h3 className="text-background-dark/60 text-sm font-bold uppercase tracking-wider">Heart Rate</h3>
                                        <div className="flex items-baseline gap-2 mt-1">
                                            <span className="text-4xl font-black text-background-dark tabular-nums tracking-tighter">{liveVitals.heartRate}</span>
                                            <span className="text-background-dark/50 text-lg font-medium">BPM</span>
                                        </div>
                                        <div className="mt-4 h-12 w-full flex items-end gap-1">
                                            {liveHistory.slice(-12).map((h, i) => (
                                                <div key={i} className="flex-1 bg-rose-200 hover:bg-rose-400 transition-colors rounded-t-sm" style={{ height: `${(h.score / 100) * 100}%` }}></div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* HRV */}
                                    <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-primary/10 hover:shadow-[0_8px_30px_rgba(33,196,93,0.1)] transition-all p-6 relative group">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="p-3 bg-blue-50 rounded-2xl text-blue-500 border border-blue-100 shadow-sm">
                                                <Activity className="w-6 h-6" />
                                            </div>
                                            <span className="text-[10px] font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded uppercase tracking-tighter border border-blue-200">Variability</span>
                                        </div>
                                        <h3 className="text-background-dark/60 text-sm font-bold uppercase tracking-wider">HRV (Stress)</h3>
                                        <div className="flex items-baseline gap-2 mt-1">
                                            <span className="text-4xl font-black text-background-dark tabular-nums tracking-tighter">{liveVitals.hrv}</span>
                                            <span className="text-background-dark/50 text-lg font-medium">ms</span>
                                        </div>
                                        <div className="mt-4 h-12 w-full flex items-end gap-1">
                                            {liveHistory.slice(-12).reverse().map((h, i) => (
                                                <div key={i} className="flex-1 bg-blue-200 hover:bg-blue-400 transition-colors rounded-t-sm" style={{ height: `${((100 - h.score) / 100) * 100}%` }}></div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* SpO2 */}
                                    <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-primary/10 hover:shadow-[0_8px_30px_rgba(33,196,93,0.1)] transition-all p-6 relative group">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="p-3 bg-cyan-50 rounded-2xl text-cyan-500 border border-cyan-100 shadow-sm">
                                                <Wind className="w-6 h-6" />
                                            </div>
                                            <span className="text-[10px] font-bold text-cyan-700 bg-cyan-100 px-2 py-0.5 rounded uppercase tracking-tighter border border-cyan-200">Saturation</span>
                                        </div>
                                        <h3 className="text-background-dark/60 text-sm font-bold uppercase tracking-wider">SpO2</h3>
                                        <div className="flex items-baseline gap-2 mt-1">
                                            <span className="text-4xl font-black text-background-dark tabular-nums tracking-tighter">{liveVitals.spO2}</span>
                                            <span className="text-background-dark/50 text-lg font-medium">%</span>
                                        </div>
                                        <div className="mt-4 flex items-center justify-center h-12">
                                            <div className="w-full">
                                                <div className="h-3 w-full bg-background-light rounded-full overflow-hidden border border-background-dark/5">
                                                    <div className="h-full bg-cyan-500 transition-all duration-1000 rounded-full" style={{ width: `${liveVitals.spO2}%` }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Skin Temp */}
                                    <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-primary/10 hover:shadow-[0_8px_30px_rgba(33,196,93,0.1)] transition-all p-6 relative group">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="p-3 bg-orange-50 rounded-2xl text-orange-500 border border-orange-100 shadow-sm">
                                                <ThermometerSun className="w-6 h-6" />
                                            </div>
                                            <span className="text-[10px] font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded uppercase tracking-tighter border border-orange-200">Surface</span>
                                        </div>
                                        <h3 className="text-background-dark/60 text-sm font-bold uppercase tracking-wider">Skin Temp</h3>
                                        <div className="flex items-baseline gap-2 mt-1">
                                            <span className="text-4xl font-black text-background-dark tabular-nums tracking-tighter">{liveVitals.skinTemp}</span>
                                            <span className="text-background-dark/50 text-lg font-medium">°C</span>
                                        </div>
                                        <div className="mt-4 flex items-center gap-3 h-12">
                                            <span className="text-xs text-background-dark/40 font-mono font-bold">35.0</span>
                                            <div className="flex-1 h-3 bg-background-light rounded-full border border-background-dark/5 relative">
                                                <div
                                                    className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-orange-500 rounded-full border-2 border-white shadow-sm transition-all duration-1000"
                                                    style={{ left: `calc(${((liveVitals.skinTemp - 35) / (40 - 35)) * 100}% - 10px)` }}
                                                ></div>
                                            </div>
                                            <span className="text-xs text-background-dark/40 font-mono font-bold">40.0</span>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* Real-time Chart Section */}
                            <div className="grid grid-cols-12 gap-6 pb-12">
                                <div className="col-span-12 xl:col-span-8">
                                    <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-primary/10 hover:shadow-[0_8px_30px_rgba(33,196,93,0.1)] transition-all p-6 h-full min-h-[400px] flex flex-col">
                                        <div className="flex justify-between items-center mb-6">
                                            <h3 className="text-lg font-extrabold text-background-dark tracking-tight">Continuous Recovery Score <span className="text-background-dark/50 font-medium font-sans text-sm tracking-normal">(24h)</span></h3>
                                            <div className="flex gap-2">
                                                <button className="px-4 py-2 text-xs font-bold rounded-lg bg-primary text-white shadow-sm hover:bg-primary/90 transition-colors">24H</button>
                                                <button className="px-4 py-2 text-xs font-bold rounded-lg bg-background-light text-background-dark/60 hover:bg-background-light/80 hover:text-background-dark transition-colors">7D</button>
                                            </div>
                                        </div>

                                        <div className="w-full flex-1 min-h-[300px]">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart data={liveHistory} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                                    <defs>
                                                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#21c45d" stopOpacity={0.4} />
                                                            <stop offset="95%" stopColor="#21c45d" stopOpacity={0} />
                                                        </linearGradient>
                                                    </defs>
                                                    <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                                    <Tooltip
                                                        contentStyle={{ backgroundColor: '#ffffff', borderColor: 'rgba(33,196,93,0.2)', borderRadius: '1rem', boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}
                                                        itemStyle={{ color: '#21c45d', fontWeight: 'bold' }}
                                                    />
                                                    <Area
                                                        type="monotone"
                                                        dataKey="score"
                                                        stroke="#21c45d"
                                                        strokeWidth={3}
                                                        fillOpacity={1}
                                                        fill="url(#colorScore)"
                                                    />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </div>

                                {/* What-If Projection Panel */}
                                <div className="col-span-12 xl:col-span-4 flex flex-col pt-0">
                                    <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-primary/10 hover:shadow-[0_8px_30px_rgba(33,196,93,0.1)] transition-all p-8 flex-1 relative overflow-hidden">
                                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none z-0"></div>

                                        <h3 className="text-lg font-extrabold flex items-center gap-3 mb-8 text-background-dark tracking-tight relative z-10">
                                            <div className="p-2 bg-primary/10 rounded-xl">
                                                <BrainCircuit className="w-5 h-5 text-primary" />
                                            </div>
                                            Predictive Modeling
                                        </h3>

                                        <div className="space-y-8 flex-1 relative z-10">
                                            <div className="group">
                                                <div className="flex justify-between text-xs font-bold text-background-dark/60 mb-3 uppercase tracking-wider">
                                                    <span>Target Sleep</span>
                                                    <span className="text-primary font-black group-hover:scale-110 transition-transform">8.0 hrs</span>
                                                </div>
                                                <input type="range" defaultValue={8} min={4} max={12} step={0.5} className="w-full h-2 bg-background-light rounded-lg appearance-none cursor-pointer accent-primary hover:accent-primary/80 transition-all border border-background-dark/5" />
                                            </div>

                                            <div className="group">
                                                <div className="flex justify-between text-xs font-bold text-background-dark/60 mb-3 uppercase tracking-wider">
                                                    <span>Target Activity</span>
                                                    <span className="text-primary font-black group-hover:scale-110 transition-transform">Moderate</span>
                                                </div>
                                                <input type="range" defaultValue={50} min={0} max={100} className="w-full h-2 bg-background-light rounded-lg appearance-none cursor-pointer accent-primary hover:accent-primary/80 transition-all border border-background-dark/5" />
                                            </div>

                                            <div className="p-6 bg-background-light rounded-2xl border border-primary/10 mt-8 relative z-10 shadow-sm">
                                                <h4 className="text-[10px] font-bold text-background-dark/50 uppercase tracking-widest mb-1">AI 90-Day Event Risk</h4>
                                                <div className="flex items-center gap-4 mt-2">
                                                    <div className="flex-1">
                                                        <p className="text-4xl font-black text-primary tabular-nums tracking-tighter">
                                                            {prediction ? prediction.projected_score.toFixed(1) : '...'}%
                                                        </p>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-1">
                                                        {prediction ? (
                                                            <>
                                                                <span className={`text-[10px] font-bold px-2 py-1 rounded-md border ${prediction.projected_score > prediction.current_score
                                                                    ? 'text-emerald-700 bg-emerald-100 border-emerald-200'
                                                                    : 'text-rose-700 bg-rose-100 border-rose-200'
                                                                    }`}>
                                                                    {prediction.projected_score > prediction.current_score ? '↑' : '↓'} {Math.abs(prediction.projected_score - prediction.current_score).toFixed(1)}% Change
                                                                </span>
                                                                <span className="text-[10px] font-medium text-background-dark/50 text-right">{prediction.projected_risk_category}</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <span className="text-[10px] font-bold text-background-dark/60 bg-background-dark/5 px-2 py-1 rounded-md border border-background-dark/10">Calculating...</span>
                                                                <span className="text-[10px] font-medium text-background-dark/50 text-right">Based on simulation</span>
                                                            </>
                                                        )}

                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 mt-8 relative z-10">
                                            <button className="flex items-center justify-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary font-bold py-3.5 rounded-xl text-sm transition-all border border-primary/20 shadow-sm">
                                                <Camera className="w-4 h-4" />
                                                Log State
                                            </button>
                                            <button className="flex items-center justify-center gap-2 bg-white hover:bg-background-light text-background-dark font-bold py-3.5 rounded-xl text-sm transition-all border border-background-dark/10 shadow-sm hover:shadow-md">
                                                <ArrowLeftRight className="w-4 h-4" />
                                                Compare
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeView === 'settings' && (
                        <div className="h-full flex items-center justify-center text-background-dark/50 max-w-7xl mx-auto">
                            <div className="text-center">
                                <Bell className="w-16 h-16 mx-auto mb-4 opacity-20" />
                                <h2 className="text-xl font-bold text-background-dark/60">Settings Configuration</h2>
                                <p className="mtn-2 text-sm font-medium">System configuration view coming soon.</p>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

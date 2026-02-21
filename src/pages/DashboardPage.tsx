import { useState } from 'react';
import { Activity, Bell, Heart, ThermometerSun, Wind, BrainCircuit, Camera, ArrowLeftRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import PatientsView from '../components/dashboard/PatientsView';
import AlertsView from '../components/dashboard/AlertsView';
import { mockPatients, systemStatus } from '../data/mockData';
import type { Patient } from '../data/mockData';

export default function DashboardPage() {
    const [activeView, setActiveView] = useState<'overview' | 'patients' | 'alerts' | 'settings'>('overview');
    const [selectedPatientId, setSelectedPatientId] = useState<string | null>(mockPatients[0].id);

    const currentPatient = mockPatients.find(p => p.id === selectedPatientId) || mockPatients[0];
    const { currentVitals, history, riskForecast } = currentPatient;

    const handleSelectPatient = (patient: Patient) => {
        setSelectedPatientId(patient.id);
        setActiveView('overview');
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen font-display flex flex-col">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-50 w-full border-b border-primary/10 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md">
                <div className="w-full px-6 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="text-primary">
                            <Activity className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight">CardioTwin <span className="text-primary">AI</span></h1>
                        </div>
                    </Link>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            <span className="text-xs font-bold uppercase tracking-wider text-primary">Live Status</span>
                        </div>
                        <div className="h-8 w-[1px] bg-slate-700"></div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setActiveView('alerts')}
                                className="p-2 hover:bg-primary/10 rounded-lg transition-colors text-slate-400 hover:text-primary relative"
                            >
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border border-background-dark"></span>
                            </button>
                            <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-primary/30">
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
                                    <h2 className="text-3xl font-bold flex items-center gap-3">
                                        {currentPatient.name}
                                        <span className={`text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider ${currentPatient.status === 'Critical' ? 'bg-rose-500/20 text-rose-500' :
                                            currentPatient.status === 'Stable' ? 'bg-emerald-500/20 text-emerald-500' :
                                                'bg-slate-500/20 text-slate-400'
                                            }`}>
                                            {currentPatient.status}
                                        </span>
                                    </h2>
                                    <p className="text-slate-400 mt-1">ID: {currentPatient.id} • {currentPatient.condition} • {currentPatient.roomNumber}</p>
                                </div>
                                <button className="bg-slate-800 hover:bg-slate-700 transition-colors px-4 py-2 rounded-lg text-sm font-semibold border border-primary/20">
                                    Generate Report
                                </button>
                            </div>

                            {/* Main Dashboard Grid */}
                            <div className="grid grid-cols-12 gap-6">

                                {/* Left Section: Score Gauge */}
                                <div className="col-span-12 xl:col-span-4 flex flex-col gap-6">
                                    <div className="glass-panel p-8 rounded-xl flex flex-col items-center justify-center relative overflow-hidden h-full min-h-[400px]">
                                        <div className="absolute inset-0 bg-primary/5 opacity-20 pointer-events-none"></div>

                                        <div className="relative w-64 h-64 rounded-full border-[12px] border-slate-800 flex items-center justify-center shadow-[0_0_40px_rgba(var(--color-primary),0.1)]">
                                            <div className="absolute inset-0 rounded-full border-[12px] border-primary border-t-transparent -rotate-45 transition-transform duration-1000 ease-in-out" style={{ transform: `rotate(${(currentVitals.score / 100) * 360 - 225}deg)` }}></div>
                                            <div className="text-center">
                                                <span className="text-7xl font-black text-white tracking-tighter">{currentVitals.score}</span>
                                                <p className="text-primary font-bold text-lg uppercase tracking-widest mt-2">{currentVitals.trend}</p>
                                            </div>
                                        </div>

                                        <div className="mt-8 w-full">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm font-medium text-slate-400">AI Health Insights</span>
                                                <span className="text-xs text-primary font-bold">Updated Just Now</span>
                                            </div>
                                            <div className="bg-primary/10 border border-primary/20 p-4 rounded-lg">
                                                <p className="text-sm leading-relaxed text-slate-200">
                                                    {currentVitals.score > 80
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
                                    <div className="glass-panel p-6 rounded-xl relative group hover:border-primary/40 transition-colors">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="p-2 bg-rose-500/20 rounded-lg text-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)]">
                                                <Heart className="w-5 h-5 animate-pulse" />
                                            </div>
                                            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded uppercase tracking-tighter">Live</span>
                                        </div>
                                        <h3 className="text-slate-400 text-sm font-medium">Heart Rate</h3>
                                        <div className="flex items-baseline gap-2 mt-1">
                                            <span className="text-4xl font-bold text-white tabular-nums">{currentVitals.heartRate}</span>
                                            <span className="text-slate-500 text-lg">BPM</span>
                                        </div>
                                        <div className="mt-4 h-12 w-full flex items-end gap-1">
                                            {history.slice(-12).map((h, i) => (
                                                <div key={i} className="flex-1 bg-rose-500/40 rounded-t-sm" style={{ height: `${(h.score / 100) * 100}%` }}></div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* HRV */}
                                    <div className="glass-panel p-6 rounded-xl relative group hover:border-primary/40 transition-colors">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="p-2 bg-blue-500/20 rounded-lg text-blue-500">
                                                <Activity className="w-5 h-5" />
                                            </div>
                                            <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded uppercase tracking-tighter">Variability</span>
                                        </div>
                                        <h3 className="text-slate-400 text-sm font-medium">HRV (Stress)</h3>
                                        <div className="flex items-baseline gap-2 mt-1">
                                            <span className="text-4xl font-bold text-white tabular-nums">{currentVitals.hrv}</span>
                                            <span className="text-slate-500 text-lg">ms</span>
                                        </div>
                                        <div className="mt-4 h-12 w-full flex items-end gap-1">
                                            {history.slice(-12).reverse().map((h, i) => (
                                                <div key={i} className="flex-1 bg-blue-500/40 rounded-t-sm" style={{ height: `${((100 - h.score) / 100) * 100}%` }}></div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* SpO2 */}
                                    <div className="glass-panel p-6 rounded-xl relative group hover:border-primary/40 transition-colors">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="p-2 bg-cyan-500/20 rounded-lg text-cyan-500">
                                                <Wind className="w-5 h-5" />
                                            </div>
                                            <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded uppercase tracking-tighter">Saturation</span>
                                        </div>
                                        <h3 className="text-slate-400 text-sm font-medium">SpO2</h3>
                                        <div className="flex items-baseline gap-2 mt-1">
                                            <span className="text-4xl font-bold text-white tabular-nums">{currentVitals.spO2}</span>
                                            <span className="text-slate-500 text-lg">%</span>
                                        </div>
                                        <div className="mt-4 flex items-center justify-center h-12">
                                            <div className="w-full px-2">
                                                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                                    <div className="h-full bg-cyan-500 transition-all duration-1000" style={{ width: `${currentVitals.spO2}%` }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Skin Temp */}
                                    <div className="glass-panel p-6 rounded-xl relative group hover:border-primary/40 transition-colors">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="p-2 bg-orange-500/20 rounded-lg text-orange-500">
                                                <ThermometerSun className="w-5 h-5" />
                                            </div>
                                            <span className="text-[10px] font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded uppercase tracking-tighter">Surface</span>
                                        </div>
                                        <h3 className="text-slate-400 text-sm font-medium">Skin Temp</h3>
                                        <div className="flex items-baseline gap-2 mt-1">
                                            <span className="text-4xl font-bold text-white tabular-nums">{currentVitals.skinTemp}</span>
                                            <span className="text-slate-500 text-lg">°C</span>
                                        </div>
                                        <div className="mt-4 flex items-center gap-2 h-12">
                                            <span className="text-xs text-slate-500 font-mono">35.0°C</span>
                                            <div className="flex-1 h-1.5 bg-slate-800 rounded-full relative">
                                                <div
                                                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-orange-500 rounded-full border-2 border-background-dark shadow-[0_0_10px_rgba(249,115,22,0.5)] transition-all duration-1000"
                                                    style={{ left: `${((currentVitals.skinTemp - 35) / (40 - 35)) * 100}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-xs text-slate-500 font-mono">40.0°C</span>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* Real-time Chart Section */}
                            <div className="grid grid-cols-12 gap-6 pb-12">
                                <div className="col-span-12 xl:col-span-8">
                                    <div className="glass-panel p-6 rounded-xl h-full min-h-[400px] flex flex-col">
                                        <div className="flex justify-between items-center mb-6">
                                            <h3 className="text-lg font-bold">Continuous Recovery Score (24h)</h3>
                                            <div className="flex gap-2">
                                                <button className="px-3 py-1.5 text-xs font-bold rounded bg-primary text-background-dark shadow-[0_0_10px_rgba(var(--color-primary),0.3)]">24H</button>
                                                <button className="px-3 py-1.5 text-xs font-bold rounded bg-slate-800 text-slate-400 hover:bg-slate-700 transition-colors">7D</button>
                                            </div>
                                        </div>

                                        <div className="w-full flex-1 min-h-[300px]">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart data={history} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                                    <defs>
                                                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="rgb(var(--color-primary))" stopOpacity={0.8} />
                                                            <stop offset="95%" stopColor="rgb(var(--color-primary))" stopOpacity={0} />
                                                        </linearGradient>
                                                    </defs>
                                                    <XAxis dataKey="time" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                                                    <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                                    <Tooltip
                                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgb(var(--color-primary)/0.2)', borderRadius: '0.5rem' }}
                                                        itemStyle={{ color: 'rgb(var(--color-primary))', fontWeight: 'bold' }}
                                                    />
                                                    <Area
                                                        type="monotone"
                                                        dataKey="score"
                                                        stroke="rgb(var(--color-primary))"
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
                                    <div className="glass-panel p-6 rounded-xl flex-1 border-primary/20 bg-gradient-to-br from-background-dark to-slate-900/50 relative overflow-hidden">
                                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

                                        <h3 className="text-lg font-bold flex items-center gap-2 mb-6">
                                            <BrainCircuit className="w-5 h-5 text-primary" />
                                            Predictive Modeling
                                        </h3>

                                        <div className="space-y-8 flex-1">
                                            <div className="group">
                                                <div className="flex justify-between text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">
                                                    <span>Target Sleep</span>
                                                    <span className="text-primary font-bold group-hover:scale-110 transition-transform">8.0 hrs</span>
                                                </div>
                                                <input type="range" defaultValue={8} min={4} max={12} step={0.5} className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary hover:accent-primary-light transition-all" />
                                            </div>

                                            <div className="group">
                                                <div className="flex justify-between text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">
                                                    <span>Target Activity</span>
                                                    <span className="text-primary font-bold group-hover:scale-110 transition-transform">Moderate</span>
                                                </div>
                                                <input type="range" defaultValue={50} min={0} max={100} className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary hover:accent-primary-light transition-all" />
                                            </div>

                                            <div className="p-5 bg-black/40 rounded-xl border border-primary/10 mt-6 backdrop-blur-sm relative z-10">
                                                <h4 className="text-sm font-bold text-slate-300 mb-1">AI 90-Day Event Risk</h4>
                                                <div className="flex items-center gap-4 mt-3">
                                                    <div className="flex-1">
                                                        <p className="text-4xl font-black text-primary drop-shadow-[0_0_8px_rgba(var(--color-primary),0.5)] tabular-nums">{riskForecast}%</p>
                                                    </div>
                                                    <div className="flex flex-col items-end">
                                                        <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded border border-emerald-400/20">↓ 1.2% Improvement</span>
                                                        <span className="text-[10px] text-slate-500 mt-1 text-right">Based on simulation</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 mt-8">
                                            <button className="flex items-center justify-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary font-bold py-3 rounded-lg text-sm transition-all border border-primary/30">
                                                <Camera className="w-4 h-4" />
                                                Log State
                                            </button>
                                            <button className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-lg text-sm transition-all border border-slate-600">
                                                <ArrowLeftRight className="w-4 h-4" />
                                                Compare
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeView === 'patients' && (
                        <div className="h-full max-w-7xl mx-auto">
                            <PatientsView
                                onSelectPatient={handleSelectPatient}
                                selectedPatientId={selectedPatientId}
                            />
                        </div>
                    )}

                    {activeView === 'alerts' && (
                        <div className="h-full max-w-7xl mx-auto">
                            <AlertsView />
                        </div>
                    )}

                    {activeView === 'settings' && (
                        <div className="h-full flex items-center justify-center text-slate-500 max-w-7xl mx-auto">
                            <div className="text-center">
                                <Bell className="w-16 h-16 mx-auto mb-4 opacity-20" />
                                <h2 className="text-xl font-bold text-slate-400">Settings Configuration</h2>
                                <p className="mt-2 text-sm">System configuration view coming soon.</p>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            <footer className="w-full border-t border-primary/10 bg-background-dark/80 px-6 py-4 mt-auto">
                <div className="flex justify-between items-center text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                    <div>© {new Date().getFullYear()} CardioTwin Medical Systems.</div>
                    <div className="flex gap-4">
                        <span>Engine: {systemStatus.engineVersion}</span>
                        <span>Uptime: {systemStatus.uptime}</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}

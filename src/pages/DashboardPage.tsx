import { Activity, Bell, Heart, ThermometerSun, Wind, BrainCircuit, Camera, ArrowLeftRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen font-display">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-50 w-full border-b border-primary/10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
                <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
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
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Session Timer</span>
                            <span className="text-lg font-mono font-bold text-primary">00:42:15</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="p-2 hover:bg-primary/10 rounded-lg transition-colors text-slate-400 hover:text-primary">
                                <Bell className="w-5 h-5" />
                            </button>
                            <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-primary/30">
                                <img
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWXOkTJMP_6l_TFoYjjjmGFjdU6zuDygl_fyTXXnHnGQmH6D8Uea5Vsepca75gCDkc4FztOnI9hV-AAFUzuWPquePJvfdmd9Z7VVjfd-a6IMk9m0SLbuTvSu_s-en5fL3C0vrE89DgKJaOrAZMcefaritp3iJbH1TFSZZTJCMYQFCQSbvXn8mXYKTLbpbniUh_Tld86lZN6eMTc_9F7X-DcwFKoeqNB8khRla_bbGvXdmGtr55EjrWULm-3ln3lE35aD04nOukHAw"
                                    alt="Portrait of a medical professional"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-[1440px] mx-auto p-6 space-y-6">
                {/* Main Dashboard Grid */}
                <div className="grid grid-cols-12 gap-6">

                    {/* Left Section: Score Gauge */}
                    <div className="col-span-12 lg:col-span-5 xl:col-span-4 flex flex-col gap-6">
                        <div className="glass-panel p-8 rounded-xl flex flex-col items-center justify-center relative overflow-hidden h-full min-h-[400px]">
                            <div className="absolute inset-0 bg-primary/5 opacity-20 pointer-events-none"></div>

                            {/* Gauge Mockup */}
                            <div className="relative w-64 h-64 rounded-full border-[12px] border-slate-800 flex items-center justify-center">
                                <div className="absolute inset-0 rounded-full border-[12px] border-primary border-t-transparent rotate-45"></div>
                                <div className="text-center">
                                    <span className="text-7xl font-black text-white tracking-tighter">86</span>
                                    <p className="text-primary font-bold text-lg uppercase tracking-widest mt-2">Thriving</p>
                                </div>
                            </div>

                            <div className="mt-8 w-full">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-slate-400">AI Health Insights</span>
                                    <span className="text-xs text-primary font-bold">Optimized</span>
                                </div>
                                <div className="bg-primary/10 border border-primary/20 p-4 rounded-lg">
                                    <p className="text-sm leading-relaxed text-slate-200">
                                        Your current biometric alignment suggests peak cardiovascular recovery. HRV levels are 12% above your 7-day baseline.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Section: Biometric Grid */}
                    <div className="col-span-12 lg:col-span-7 xl:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">

                        {/* Heart Rate */}
                        <div className="glass-panel p-6 rounded-xl relative group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-rose-500/20 rounded-lg text-rose-500">
                                    <Heart className="w-5 h-5" />
                                </div>
                                <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded uppercase tracking-tighter">Stable</span>
                            </div>
                            <h3 className="text-slate-400 text-sm font-medium">Heart Rate</h3>
                            <div className="flex items-baseline gap-2 mt-1">
                                <span className="text-4xl font-bold text-white">72</span>
                                <span className="text-slate-500 text-lg">BPM</span>
                            </div>

                            <div className="mt-4 h-12 w-full bg-slate-800/50 rounded flex items-end gap-1 px-1 py-1">
                                {/* Mock Sparkline */}
                                <div className="flex-1 bg-primary/40 h-1/2 rounded-t-sm"></div>
                                <div className="flex-1 bg-primary/60 h-2/3 rounded-t-sm"></div>
                                <div className="flex-1 bg-primary/40 h-1/3 rounded-t-sm"></div>
                                <div className="flex-1 bg-primary/50 h-3/4 rounded-t-sm"></div>
                                <div className="flex-1 bg-primary/70 h-1/2 rounded-t-sm"></div>
                                <div className="flex-1 bg-primary h-5/6 rounded-t-sm"></div>
                                <div className="flex-1 bg-primary/40 h-1/2 rounded-t-sm"></div>
                            </div>
                        </div>

                        {/* HRV */}
                        <div className="glass-panel p-6 rounded-xl relative group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-blue-500/20 rounded-lg text-blue-500">
                                    <Activity className="w-5 h-5" />
                                </div>
                                <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded uppercase tracking-tighter">Improving</span>
                            </div>
                            <h3 className="text-slate-400 text-sm font-medium">HRV (Stress)</h3>
                            <div className="flex items-baseline gap-2 mt-1">
                                <span className="text-4xl font-bold text-white">42.3</span>
                                <span className="text-slate-500 text-lg">ms</span>
                            </div>
                            <div className="mt-4 h-12 w-full bg-slate-800/50 rounded flex items-end gap-1 px-1 py-1">
                                <div className="flex-1 bg-primary/30 h-1/4 rounded-t-sm"></div>
                                <div className="flex-1 bg-primary/40 h-2/4 rounded-t-sm"></div>
                                <div className="flex-1 bg-primary/50 h-3/4 rounded-t-sm"></div>
                                <div className="flex-1 bg-primary/60 h-2/4 rounded-t-sm"></div>
                                <div className="flex-1 bg-primary/70 h-4/5 rounded-t-sm"></div>
                                <div className="flex-1 bg-primary h-full rounded-t-sm"></div>
                                <div className="flex-1 bg-primary/80 h-3/4 rounded-t-sm"></div>
                            </div>
                        </div>

                        {/* SpO2 */}
                        <div className="glass-panel p-6 rounded-xl relative group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-cyan-500/20 rounded-lg text-cyan-500">
                                    <Wind className="w-5 h-5" />
                                </div>
                                <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded uppercase tracking-tighter">Optimal</span>
                            </div>
                            <h3 className="text-slate-400 text-sm font-medium">Oxygen Saturation</h3>
                            <div className="flex items-baseline gap-2 mt-1">
                                <span className="text-4xl font-bold text-white">98.1</span>
                                <span className="text-slate-500 text-lg">%</span>
                            </div>
                            <div className="mt-4 h-12 w-full bg-slate-800/50 rounded flex items-center justify-center">
                                <div className="w-full px-4">
                                    <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary w-[98%]"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Skin Temp */}
                        <div className="glass-panel p-6 rounded-xl relative group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-orange-500/20 rounded-lg text-orange-500">
                                    <ThermometerSun className="w-5 h-5" />
                                </div>
                                <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded uppercase tracking-tighter">Normal</span>
                            </div>
                            <h3 className="text-slate-400 text-sm font-medium">Skin Temp</h3>
                            <div className="flex items-baseline gap-2 mt-1">
                                <span className="text-4xl font-bold text-white">36.4</span>
                                <span className="text-slate-500 text-lg">°C</span>
                            </div>
                            <div className="mt-4 flex items-center gap-2">
                                <span className="text-xs text-slate-500">Avg: 36.6°C</span>
                                <div className="flex-1 h-1 bg-slate-800 rounded-full relative">
                                    <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-primary rounded-full border-2 border-background-dark"></div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Real-time Chart Section */}
                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-12 lg:col-span-8">
                        <div className="glass-panel p-6 rounded-xl h-full min-h-[350px]">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold">Score Trend (24h)</h3>
                                <div className="flex gap-2">
                                    <button className="px-3 py-1 text-xs font-bold rounded bg-primary text-background-dark">Live</button>
                                    <button className="px-3 py-1 text-xs font-bold rounded bg-slate-800 text-slate-400">1W</button>
                                    <button className="px-3 py-1 text-xs font-bold rounded bg-slate-800 text-slate-400">1M</button>
                                </div>
                            </div>

                            <div className="w-full h-64 relative bg-slate-900/40 rounded-lg border border-primary/5 flex items-end px-4 py-8 overflow-hidden">
                                {/* Simulated Chart Grid */}
                                <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 pointer-events-none opacity-10">
                                    {Array.from({ length: 24 }).map((_, i) => (
                                        <div key={i} className={`border-primary ${i % 6 !== 5 ? 'border-r' : ''} ${i < 18 ? 'border-b' : ''}`}></div>
                                    ))}
                                </div>

                                {/* SVG Line Chart Mockup */}
                                <svg className="w-full h-full text-primary" preserveAspectRatio="none" viewBox="0 0 100 100">
                                    <path d="M0,80 Q10,75 20,85 T40,60 T60,50 T80,30 T100,20" fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke"></path>
                                    <path d="M0,80 Q10,75 20,85 T40,60 T60,50 T80,30 T100,20 V100 H0 Z" fill="currentColor" fillOpacity="0.1" vectorEffect="non-scaling-stroke"></path>
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* What-If Projection Panel */}
                    <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                        <div className="glass-panel p-6 rounded-xl flex-1 border-primary/20">
                            <h3 className="text-lg font-bold flex items-center gap-2 mb-6">
                                <BrainCircuit className="w-5 h-5 text-primary" />
                                What-If Projection
                            </h3>

                            <div className="space-y-6">
                                <div>
                                    <div className="flex justify-between text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">
                                        <span>Sleep Duration</span>
                                        <span className="text-primary font-bold">8.5 hrs</span>
                                    </div>
                                    <input type="range" className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary" />
                                </div>

                                <div>
                                    <div className="flex justify-between text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">
                                        <span>Exercise Intensity</span>
                                        <span className="text-primary font-bold">High</span>
                                    </div>
                                    <input type="range" className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary" />
                                </div>

                                <div className="p-4 bg-background-dark/50 rounded-lg border border-primary/10 mt-6">
                                    <h4 className="text-sm font-bold text-white mb-1">90-Day Risk Forecast</h4>
                                    <div className="flex items-center gap-4 mt-3">
                                        <div className="flex-1">
                                            <p className="text-[10px] text-slate-500 uppercase font-bold">CV Event Risk</p>
                                            <p className="text-2xl font-black text-primary">2.4%</p>
                                        </div>
                                        <div className="w-16 h-16 rounded-full border-4 border-primary/20 flex items-center justify-center">
                                            <span className="text-xs font-bold text-primary">-1.2%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mt-8">
                                <button className="flex items-center justify-center gap-2 bg-primary text-background-dark font-bold py-2.5 rounded-lg text-sm transition-transform active:scale-95">
                                    <Camera className="w-4 h-4" />
                                    Snapshot
                                </button>
                                <button className="flex items-center justify-center gap-2 bg-slate-800 text-white font-bold py-2.5 rounded-lg text-sm transition-transform active:scale-95">
                                    <ArrowLeftRight className="w-4 h-4" />
                                    Before/After
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="max-w-[1440px] mx-auto px-6 py-12 mt-12 border-t border-primary/5">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    <div className="max-w-2xl">
                        <p className="text-xs text-slate-500 leading-relaxed uppercase font-semibold tracking-wide">Medical Disclaimer</p>
                        <p className="text-[10px] text-slate-600 mt-2 leading-relaxed">
                            CardioTwin AI provides data monitoring and health estimations based on proprietary algorithms. This dashboard is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Do not disregard professional medical advice or delay in seeking it because of something you have read on this dashboard.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">System Engine</p>
                            <p className="text-xs text-primary font-mono mt-1">v4.2.0-clinical-alpha</p>
                        </div>
                    </div>
                </div>

                <div className="mt-12 text-center text-[10px] text-slate-700 font-medium">
                    © {new Date().getFullYear()} CardioTwin Medical Systems. All Rights Reserved. Protected by AI Regulation Framework.
                </div>
            </footer>
        </div>
    );
}

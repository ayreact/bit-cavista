import { Shield, Lock, Verified } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { api } from '../services/api';

export default function LandingPage() {
    const navigate = useNavigate();
    const [phone, setPhone] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleStart = async () => {
        if (!phone.trim()) {
            alert('Please enter your WhatsApp number.');
            return;
        }
        setIsLoading(true);
        try {
            const sessionId = `session-${Date.now()}`;
            await api.startSession({ session_id: sessionId, user_id: `+234${phone.trim()}` });
            navigate(`/dashboard?session_id=${sessionId}`);
        } catch (err) {
            console.error('Session start failed:', err);
            // Fallback for resilient UI demo
            navigate(`/dashboard?session_id=session-${Date.now()}`);
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <>
            <main className="relative overflow-hidden pt-16 pb-24 lg:pt-32 lg:pb-40 bg-white">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-10 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary blur-[120px] rounded-full"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-primary blur-[100px] rounded-full"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="flex flex-col gap-8">
                            <div className="space-y-4">
                                <h1 className="text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-background-dark">
                                    Your Heart’s <span className="text-primary italic font-serif">Early Warning</span> System
                                </h1>
                                <p className="text-lg lg:text-xl text-background-dark/70 max-w-xl leading-relaxed font-light">
                                    Real-time cardiometabolic risk scoring designed to prevent heart disease before it starts. Get instant AI-driven assessments directly on WhatsApp.
                                </p>
                            </div>

                            <div className="bg-white border border-primary/20 p-2 rounded-2xl max-w-lg shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-background-dark/5">
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <div className="flex items-center bg-background-light rounded-xl flex-1 px-4">
                                        <div className="flex items-center gap-2 text-sm font-semibold pr-3 border-r border-primary/20 text-background-dark">
                                            <span className="text-xl">🇳🇬</span>
                                            <span>+234</span>
                                        </div>
                                        <input
                                            type="tel"
                                            className="bg-transparent border-none focus:outline-none w-full text-background-dark placeholder:text-background-dark/40 ml-3 font-medium"
                                            placeholder="WhatsApp Number"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                        />
                                    </div>
                                    <button
                                        onClick={handleStart}
                                        disabled={isLoading}
                                        className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer shadow-lg shadow-primary/20 disabled:opacity-50"
                                    >
                                        {isLoading ? 'Starting...' : 'Start Screening'}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 text-xs text-background-dark/60 font-medium">
                                <div className="flex items-center gap-1">
                                    <Verified className="w-4 h-4 text-primary" />
                                    HIPAA Compliant
                                </div>
                                <div className="flex items-center gap-1">
                                    <Lock className="w-4 h-4 text-primary" />
                                    End-to-End Encrypted
                                </div>
                            </div>
                        </div>

                        {/* Replace dark image with a cleaner, white-based abstract visualization */}
                        <div className="relative lg:block hidden">
                            <div className="absolute -inset-4 bg-primary/10 blur-3xl rounded-full opacity-50"></div>
                            <div className="relative rounded-3xl overflow-hidden bg-white border border-primary/10 p-2 shadow-[0_20px_50px_-12px_rgba(33,196,93,0.1)] aspect-[4/3] flex flex-col pt-6">
                                <div className="px-6 flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <Shield className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-background-dark text-sm">Active Monitoring</h4>
                                            <p className="text-xs text-background-dark/50">CardioTwin Analysis</p>
                                        </div>
                                    </div>
                                    <div className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
                                        Optimized
                                    </div>
                                </div>

                                <div className="flex-1 bg-background-light rounded-2xl mx-2 mb-2 p-6 flex flex-col justify-end relative overflow-hidden">
                                    <svg className="absolute top-1/2 left-0 w-full h-32 -translate-y-1/2 text-primary/10" preserveAspectRatio="none" viewBox="0 0 100 100">
                                        <path d="M0,50 Q25,20 50,50 T100,50" fill="none" stroke="currentColor" strokeWidth="2" />
                                        <path d="M0,60 Q30,90 60,60 T100,60" fill="none" stroke="currentColor" strokeWidth="1" className="text-primary/5" />
                                    </svg>

                                    <div className="bg-white p-4 rounded-xl shadow-sm relative z-10 w-full max-w-xs ml-auto border border-primary/10">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-semibold text-background-dark/60 uppercase">Health Score</span>
                                            <span className="text-lg font-bold text-primary">94</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-background-light rounded-full overflow-hidden">
                                            <div className="h-full bg-primary w-[94%] rounded-full shadow-[0_0_10px_rgba(33,196,93,0.5)]"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* How It Works / Patient Benefits */}
            <section id="how-it-works" className="py-24 bg-background-light relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-primary font-bold text-sm uppercase tracking-[0.2em] mb-4">Patient-Centric Care</h2>
                        <h3 className="text-4xl md:text-5xl font-extrabold text-background-dark tracking-tight">Your Health, Simplified</h3>
                        <p className="mt-4 text-background-dark/70 max-w-2xl mx-auto text-lg font-light">
                            We transform complex clinical data into simple, actionable steps delivered right to your phone.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Benefit 1 */}
                        <div className="group relative p-8 rounded-3xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(33,196,93,0.1)] hover:border-primary/20 transition-all duration-300 transform hover:-translate-y-1 border border-transparent">
                            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform shadow-sm">
                                <span className="material-symbols-outlined text-3xl">favorite</span>
                            </div>
                            <h4 className="text-xl font-bold text-background-dark mb-3">Holistic Monitoring</h4>
                            <p className="text-background-dark/70 leading-relaxed font-light">
                                Seamlessly connect your wearables and lab results for a complete picture of your heart health without the medical jargon.
                            </p>
                        </div>

                        {/* Benefit 2 */}
                        <div className="group relative p-8 rounded-3xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(33,196,93,0.1)] hover:border-primary/20 transition-all duration-300 transform hover:-translate-y-1 border border-transparent">
                            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform shadow-sm">
                                <span className="material-symbols-outlined text-3xl">insights</span>
                            </div>
                            <h4 className="text-xl font-bold text-background-dark mb-3">Personalized Insights</h4>
                            <p className="text-background-dark/70 leading-relaxed font-light">
                                Receive a clear, easy-to-understand health score that tells you exactly where you stand and what it means for your future.
                            </p>
                        </div>

                        {/* Benefit 3 */}
                        <div className="group relative p-8 rounded-3xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(33,196,93,0.1)] hover:border-primary/20 transition-all duration-300 transform hover:-translate-y-1 border border-transparent">
                            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform shadow-sm">
                                <span className="material-symbols-outlined text-3xl">sms</span>
                            </div>
                            <h4 className="text-xl font-bold text-background-dark mb-3">WhatsApp Guidance</h4>
                            <p className="text-background-dark/70 leading-relaxed font-light">
                                Get gentle nudges, diet tips, and activity reminders directly on WhatsApp. Like having a personal cardiologist in your pocket.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Security & Trust */}
            <section id="security" className="py-24 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col lg:flex-row gap-16 items-center">
                        <div className="flex-1 space-y-8">
                            <h2 className="text-4xl font-extrabold text-background-dark">
                                Your Health Data is <span className="text-primary italic font-serif">Sovereign</span>
                            </h2>
                            <p className="text-lg text-background-dark/70 leading-relaxed font-light">
                                We believe health data privacy is a fundamental right. CardioTwin AI utilizes enterprise-grade encryption to ensure only you and your chosen providers can access your heart twin profile.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="flex items-start gap-4 p-4 rounded-2xl bg-background-light">
                                    <Shield className="w-8 h-8 text-primary shrink-0" />
                                    <div>
                                        <h5 className="font-bold text-background-dark mb-1">Bank-Level Security</h5>
                                        <p className="text-sm text-background-dark/60 font-light">AES-256 bit encryption for all your health data.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-4 rounded-2xl bg-background-light">
                                    <Lock className="w-8 h-8 text-primary shrink-0" />
                                    <div>
                                        <h5 className="font-bold text-background-dark mb-1">Zero Third-Party</h5>
                                        <p className="text-sm text-background-dark/60 font-light">Your data is never sold to insurance companies.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 w-full max-w-lg">
                            <div className="relative rounded-[2rem] bg-white p-8 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] overflow-hidden border border-background-light border-2">
                                <div className="absolute top-0 right-0 p-6 opacity-5">
                                    <Shield className="w-32 h-32 text-background-dark" />
                                </div>

                                <div className="relative space-y-6 z-10">
                                    <div className="flex items-center gap-4 border-b border-background-light pb-6">
                                        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm">
                                            <Verified className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <div className="text-xs text-primary font-bold uppercase tracking-widest mb-1">Privacy Protocol</div>
                                            <div className="text-background-dark font-bold text-lg">HIPAA Compliant</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-4 rounded-xl bg-background-light border border-white">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                                            <span className="text-sm font-semibold text-background-dark">End-to-End Encryption</span>
                                        </div>
                                        <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-md">ACTIVE</span>
                                    </div>

                                    <div className="pt-4 text-sm text-background-dark/60 font-medium italic border-l-2 border-primary/40 pl-4">
                                        "CardioTwin AI has transformed how we handle preventive patient data in our clinic securely and transparently."
                                        <div className="mt-2 text-xs font-bold text-background-dark not-italic">— Dr. Amara Okafor, Cardiologist</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-32 bg-background-light relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <div className="bg-white p-12 md:p-16 rounded-[3rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] border border-white border-2 relative overflow-hidden">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-background-dark mb-6 tracking-tight">
                            Start Your Journey to a <br className="hidden sm:block" /> <span className="text-primary italic font-serif">Stronger Heart</span> Today
                        </h2>
                        <p className="text-background-dark/70 mb-10 text-lg md:text-xl max-w-2xl mx-auto font-light">
                            Join thousands of people who are taking proactive control of their cardiovascular health with simple, personalized guidance.
                        </p>

                        <div className="flex flex-col items-center gap-6">
                            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-lg">
                                <div className="flex items-center bg-background-light rounded-xl flex-1 px-4 border border-transparent focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all shadow-inner">
                                    <div className="flex items-center gap-2 text-sm font-semibold pr-3 border-r border-background-dark/10 text-background-dark">
                                        <span className="text-xl">🇳🇬</span>
                                        <span>+234</span>
                                    </div>
                                    <input
                                        type="tel"
                                        className="bg-transparent border-none focus:outline-none w-full text-background-dark placeholder:text-background-dark/40 ml-3 py-4 font-medium"
                                        placeholder="WhatsApp Number"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>
                                <button
                                    onClick={handleStart}
                                    disabled={isLoading}
                                    className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all cursor-pointer text-lg disabled:opacity-50"
                                >
                                    {isLoading ? 'Starting...' : 'Start Screening'}
                                </button>
                            </div>
                            <p className="text-xs text-background-dark/50 font-medium">
                                By starting, you agree to our <a href="#" className="underline hover:text-primary transition-colors">Terms of Service</a> and <a href="#" className="underline hover:text-primary transition-colors">Privacy Policy</a>.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

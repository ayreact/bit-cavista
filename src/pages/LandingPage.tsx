import { Shield, Lock, ArrowRight, Verified, Fingerprint } from 'lucide-react';

export default function LandingPage() {
    return (
        <>
            <main className="relative overflow-hidden pt-16 pb-24 lg:pt-32 lg:pb-40">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-20 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/30 blur-[120px] rounded-full"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-primary/20 blur-[100px] rounded-full"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="flex flex-col gap-8">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider w-fit">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                </span>
                                Live AI Diagnostics
                            </div>

                            <div className="space-y-4">
                                <h1 className="text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight text-slate-900 dark:text-white">
                                    Your Heart’s <span className="text-primary">Early Warning</span> System
                                </h1>
                                <p className="text-lg lg:text-xl text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
                                    Real-time cardiometabolic risk scoring designed to prevent heart disease before it starts. Get instant AI-driven assessments directly on WhatsApp.
                                </p>
                            </div>

                            {/* WhatsApp Input Group */}
                            <div className="glass-panel-light p-2 rounded-xl max-w-lg shadow-2xl">
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <div className="flex items-center bg-white/5 dark:bg-background-dark/50 rounded-lg border border-primary/10 px-3">
                                        <div className="flex items-center gap-2 text-sm font-semibold pr-2 border-r border-primary/10 text-white">
                                            <span className="text-xl">🇳🇬</span>
                                            <span>+234</span>
                                        </div>
                                        <input
                                            type="tel"
                                            className="bg-transparent border-none focus:ring-0 w-full text-slate-900 dark:text-white placeholder:text-slate-500"
                                            placeholder="WhatsApp Number"
                                        />
                                    </div>
                                    <button className="bg-primary hover:bg-primary/90 text-background-dark px-8 py-4 rounded-lg font-black text-base transition-all flex items-center justify-center gap-2 whitespace-nowrap">
                                        Start Screening
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
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

                        <div className="relative lg:block hidden">
                            <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full opacity-30"></div>
                            <div className="relative rounded-2xl overflow-hidden border border-primary/20 shadow-2xl aspect-[4/3]">
                                <img
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDaZIVZVVWMvwPIFI9zbmaL9S5zKGkBPjT3kLGZ-nDpLpVHIbuyTCHCR7YKiZIa7Y9O6ZbmiDRg5TT9qR8LCLdZByL-YyIS5cEs5Pc4TrQA8mnomAjb2KB8RF6Sl52u3-G_1vllXh5HeP0ZpZJr-TqOptTXoM621McRuTr2eTxj2ovoR6jyfk4avf-8dLR7PIdR_D51AuStOFTss0YJKixwt9C0HvVp-n3qAEZisgnCG6Ij-RkUDSINoPVQ1Lfu0BwxGvq0TfuxYGE"
                                    alt="AI Medical Interface"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent"></div>

                                <div className="absolute bottom-6 left-6 right-6 glass-panel-light p-4 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-bold text-primary uppercase">Real-time Analysis</span>
                                        <span className="text-xs text-slate-400">CardioTwin AI v2.4</span>
                                    </div>
                                    <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary w-[88%] rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Stats Section */}
            <section id="impact" className="py-12 border-y border-primary/10 bg-primary/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="text-3xl font-black text-slate-900 dark:text-white mb-1">99.9%</div>
                            <div className="text-xs font-bold text-primary uppercase tracking-widest">Clinical Accuracy</div>
                        </div>
                        <div className="text-center border-l-0 md:border-l border-primary/10">
                            <div className="text-3xl font-black text-slate-900 dark:text-white mb-1">1M+</div>
                            <div className="text-xs font-bold text-primary uppercase tracking-widest">Data Points</div>
                        </div>
                        <div className="text-center border-l-0 md:border-l border-primary/10">
                            <div className="text-3xl font-black text-slate-900 dark:text-white mb-1">50k+</div>
                            <div className="text-xs font-bold text-primary uppercase tracking-widest">Lives Monitored</div>
                        </div>
                        <div className="text-center border-l-0 md:border-l border-primary/10">
                            <div className="text-3xl font-black text-slate-900 dark:text-white mb-1">&lt;30s</div>
                            <div className="text-xs font-bold text-primary uppercase tracking-widest">Analysis Time</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="py-24 bg-background-light dark:bg-background-dark relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-primary font-bold text-sm uppercase tracking-[0.2em] mb-4">The Methodology</h2>
                        <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">Sense, Score, Nudge</h3>
                        <p className="mt-4 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            Our proprietary AI framework provides a seamless path from raw physiological data to actionable health interventions.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Step 1 */}
                        <div className="group relative p-8 rounded-2xl bg-white/5 border border-primary/10 hover:border-primary/40 transition-all duration-300">
                            <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-4xl">sensors</span>
                            </div>
                            <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Sense</h4>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                Integration of health data and real-time vitals from wearables, lab reports, and user-reported symptoms.
                            </p>
                            <div className="mt-6 flex items-center text-primary text-sm font-bold">
                                Learn more <ArrowRight className="w-4 h-4 ml-1" />
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="group relative p-8 rounded-2xl bg-white/5 border border-primary/10 hover:border-primary/40 transition-all duration-300">
                            <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-4xl">analytics</span>
                            </div>
                            <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Score</h4>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                Instant AI-driven risk assessment calculating your personalized cardiometabolic score using 500+ biomarkers.
                            </p>
                            <div className="mt-6 flex items-center text-primary text-sm font-bold">
                                View clinical data <ArrowRight className="w-4 h-4 ml-1" />
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="group relative p-8 rounded-2xl bg-white/5 border border-primary/10 hover:border-primary/40 transition-all duration-300">
                            <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-4xl">notification_important</span>
                            </div>
                            <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Nudge</h4>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                Actionable, personalized health interventions and alerts delivered directly via WhatsApp to guide your daily choices.
                            </p>
                            <div className="mt-6 flex items-center text-primary text-sm font-bold">
                                Sample interventions <ArrowRight className="w-4 h-4 ml-1" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Security & Trust */}
            <section id="security" className="py-24 bg-primary/5 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-16 items-center">
                        <div className="flex-1 space-y-8">
                            <h2 className="text-4xl font-black text-slate-900 dark:text-white">
                                Your Health Data is <span className="text-primary">Sovereign</span>
                            </h2>
                            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                                We believe health data privacy is a fundamental right. CardioTwin AI utilizes blockchain-grade encryption and decentralized storage to ensure only you and your chosen providers can access your heart twin profile.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex items-start gap-3">
                                    <Shield className="w-6 h-6 text-primary mt-1" />
                                    <div>
                                        <h5 className="font-bold text-slate-900 dark:text-white">End-to-End Encryption</h5>
                                        <p className="text-sm text-slate-500">AES-256 bit security for all data transmissions.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Lock className="w-6 h-6 text-primary mt-1" />
                                    <div>
                                        <h5 className="font-bold text-slate-900 dark:text-white">Zero Third-Party Access</h5>
                                        <p className="text-sm text-slate-500">We never sell your data to insurance companies.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 w-full max-w-lg">
                            <div className="relative rounded-3xl bg-background-dark p-8 border border-primary/20 shadow-2xl overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Lock className="w-24 h-24" />
                                </div>

                                <div className="relative space-y-6">
                                    <div className="flex items-center gap-4 border-b border-primary/10 pb-4">
                                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                            <Fingerprint className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="text-xs text-primary font-bold uppercase tracking-wider">Privacy Protocol</div>
                                            <div className="text-white font-bold">Active Shield Enabled</div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="h-2 w-full bg-primary/10 rounded-full overflow-hidden">
                                            <div className="h-full bg-primary w-3/4 animate-pulse"></div>
                                        </div>
                                        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                                            <span>ENCRYPTING_BIO_STREAM</span>
                                            <span>SECURE_LINK_OK</span>
                                        </div>
                                    </div>

                                    <div className="text-xs text-slate-400 italic">
                                        "CardioTwin AI has transformed how we handle preventive patient data in clinical settings." - Dr. Amara Okafor, Cardiologist
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="glass-panel-light p-12 rounded-[2rem] border border-primary/30 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent"></div>

                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">
                            Start Your Journey to a <span className="text-primary">Stronger Heart</span> Today
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 mb-10 text-lg">
                            Join thousands of people who are taking proactive control of their cardiovascular health.
                        </p>

                        <div className="flex flex-col items-center gap-6">
                            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                                <input
                                    type="tel"
                                    className="flex-1 bg-white/5 border border-primary/20 rounded-lg px-4 py-4 focus:ring-primary focus:border-primary text-slate-900 dark:text-white"
                                    placeholder="+234 WhatsApp Number"
                                />
                                <button className="bg-primary hover:bg-primary/90 text-background-dark px-8 py-4 rounded-lg font-black transition-all">
                                    Free Screening
                                </button>
                            </div>
                            <p className="text-xs text-slate-500">
                                By starting, you agree to our Terms of Service and Privacy Policy.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

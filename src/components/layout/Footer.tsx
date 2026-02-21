import { Heart, Globe, Rss } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="py-12 border-t border-primary/10 bg-background-light dark:bg-background-dark/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-2 text-primary opacity-80 grayscale hover:grayscale-0 transition-all">
                        <Heart className="w-6 h-6 fill-primary stroke-primary" />
                        <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                            CardioTwin<span className="text-primary">AI</span>
                        </span>
                    </div>
                    <div className="flex gap-8 text-sm font-medium text-slate-500">
                        <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-primary transition-colors">Contact Support</a>
                        <a href="#" className="hover:text-primary transition-colors">API Docs</a>
                    </div>
                    <div className="flex gap-4">
                        <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-primary/10 flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-all">
                            <Globe className="w-5 h-5" />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-primary/10 flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-all">
                            <Rss className="w-5 h-5" />
                        </a>
                    </div>
                </div>
                <div className="mt-8 text-center text-xs text-slate-500 font-medium">
                    © {new Date().getFullYear()} CardioTwin AI Healthcare Solutions. All rights reserved.
                </div>
            </div>
        </footer>
    );
}

import { Heart } from 'lucide-react';

export default function Navbar() {
    return (
        <nav className="sticky top-0 z-50 w-full border-b border-primary/10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    <div className="flex items-center gap-2 text-primary">
                        <Heart className="w-8 h-8 fill-primary stroke-primary" />
                        <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                            CardioTwin<span className="text-primary">AI</span>
                        </span>
                    </div>
                    <div className="hidden md:flex items-center gap-8">
                        <a href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">How It Works</a>
                        <a href="#security" className="text-sm font-medium hover:text-primary transition-colors">Security</a>
                        <a href="#impact" className="text-sm font-medium hover:text-primary transition-colors">Our Impact</a>
                        <button className="bg-primary hover:bg-primary/90 text-background-dark px-6 py-2.5 rounded-lg font-bold text-sm transition-all shadow-lg shadow-primary/20">
                            Get Started
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}

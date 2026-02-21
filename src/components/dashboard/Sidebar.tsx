import { Settings, LayoutDashboard, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SidebarProps {
    activeView: 'overview' | 'settings';
    setActiveView: (view: 'overview' | 'settings') => void;
}

export default function Sidebar({ activeView, setActiveView }: SidebarProps) {
    const navItems = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'settings', label: 'Settings', icon: Settings },
    ] as const;

    return (
        <aside className="w-64 h-[calc(100vh-4rem)] border-r border-primary/10 bg-background-light/50 dark:bg-background-dark/50 flex flex-col sticky top-16">
            <div className="p-6 flex-1">
                <nav className="space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeView === item.id;

                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveView(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                                    ? 'bg-primary text-background-dark shadow-[0_0_15px_rgba(var(--color-primary),0.3)] font-semibold'
                                    : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800/50'
                                    }`}
                            >
                                <Icon className={`w-5 h-5 ${isActive ? 'text-background-dark' : ''}`} />
                                {item.label}
                            </button>
                        );
                    })}
                </nav>
            </div>

            <div className="p-6 border-t border-primary/10">
                <Link to="/" className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-rose-500/80 hover:text-rose-500 hover:bg-rose-500/10 transition-colors">
                    <LogOut className="w-5 h-5" />
                    <span>Exit Dashboard</span>
                </Link>
            </div>
        </aside>
    );
}

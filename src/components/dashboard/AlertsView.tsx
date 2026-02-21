import { useState } from 'react';
import { mockAlerts, type Alert } from '../../data/mockData';
import { Bell, AlertTriangle, Info, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function AlertsView() {
    const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);

    const markAsRead = (id: string) => {
        setAlerts(alerts.map(a => a.id === id ? { ...a, isRead: true } : a));
    };

    const getSeverityIcon = (severity: string) => {
        switch (severity) {
            case 'Critical': return <ShieldAlert className="w-5 h-5 text-rose-500" />;
            case 'High': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
            case 'Medium': return <Bell className="w-5 h-5 text-blue-500" />;
            default: return <Info className="w-5 h-5 text-slate-500" />;
        }
    };

    const unreadCount = alerts.filter(a => !a.isRead).length;

    return (
        <div className="flex flex-col h-full space-y-6 max-w-4xl">
            <div className="flex justify-between items-center">
                <div>
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-bold">System Alerts</h2>
                        {unreadCount > 0 && (
                            <span className="bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                {unreadCount} New
                            </span>
                        )}
                    </div>
                    <p className="text-slate-400 text-sm mt-1">Review patient alerts and system notifications.</p>
                </div>

                <button
                    onClick={() => setAlerts(alerts.map(a => ({ ...a, isRead: true })))}
                    className="text-sm text-primary hover:text-primary-light transition-colors"
                >
                    Mark all as read
                </button>
            </div>

            <div className="space-y-4">
                {alerts.map((alert) => (
                    <div
                        key={alert.id}
                        className={`glass-panel p-5 rounded-xl border transition-all ${alert.isRead
                            ? 'border-primary/5 opacity-70 bg-background-dark/30'
                            : 'border-primary/20 bg-primary/5 shadow-lg relative overflow-hidden'
                            }`}
                    >
                        {!alert.isRead && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                        )}

                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-background-dark/50 rounded-lg">
                                {getSeverityIcon(alert.severity)}
                            </div>

                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h3 className={`font-bold ${alert.isRead ? 'text-slate-300' : 'text-white'}`}>
                                        {alert.message}
                                    </h3>
                                    <span className="text-xs text-slate-500 font-mono">{alert.timestamp}</span>
                                </div>

                                <div className="mt-2 flex items-center gap-3">
                                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded tracking-wider ${alert.severity === 'Critical' ? 'bg-rose-500/20 text-rose-500' :
                                        alert.severity === 'High' ? 'bg-amber-500/20 text-amber-500' :
                                            alert.severity === 'Medium' ? 'bg-blue-500/20 text-blue-500' :
                                                'bg-slate-500/20 text-slate-400'
                                        }`}>
                                        {alert.severity}
                                    </span>
                                    {alert.patientId && (
                                        <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded font-mono">
                                            Patient: {alert.patientId}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {!alert.isRead && (
                                <button
                                    onClick={() => markAsRead(alert.id)}
                                    className="p-2 text-slate-400 hover:text-primary transition-colors tooltip-trigger"
                                    title="Mark as read"
                                >
                                    <CheckCircle2 className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    </div>
                ))}

                {alerts.length === 0 && (
                    <div className="text-center p-12 glass-panel rounded-xl border-primary/10">
                        <Bell className="w-12 h-12 text-slate-600 mx-auto mb-4 opacity-50" />
                        <p className="text-slate-400 font-medium">No alerts to display.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

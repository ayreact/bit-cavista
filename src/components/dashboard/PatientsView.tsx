import { useState } from 'react';
import { mockPatients } from '../../data/mockData';
import type { Patient } from '../../data/mockData';
import { Search, Filter, Activity } from 'lucide-react';

interface PatientsViewProps {
    onSelectPatient: (patient: Patient) => void;
    selectedPatientId: string | null;
}

export default function PatientsView({ onSelectPatient, selectedPatientId }: PatientsViewProps) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredPatients = mockPatients.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col h-full space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">Patient Roster</h2>
                    <p className="text-slate-400 text-sm mt-1">Manage and monitor your active patients.</p>
                </div>

                <div className="flex gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search patients..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-slate-900/50 border border-primary/20 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors w-64 text-slate-200"
                        />
                    </div>
                    <button className="flex items-center gap-2 bg-slate-800 text-slate-300 px-4 py-2 rounded-lg text-sm hover:bg-slate-700 transition-colors border border-primary/10">
                        <Filter className="w-4 h-4" />
                        Filter
                    </button>
                </div>
            </div>

            <div className="glass-panel rounded-xl overflow-hidden flex-1 border-primary/20">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-primary/10 bg-black/20">
                                <th className="p-4 text-xs uppercase tracking-wider text-slate-400 font-semibold">Patient</th>
                                <th className="p-4 text-xs uppercase tracking-wider text-slate-400 font-semibold">Status</th>
                                <th className="p-4 text-xs uppercase tracking-wider text-slate-400 font-semibold">Condition</th>
                                <th className="p-4 text-xs uppercase tracking-wider text-slate-400 font-semibold">Room</th>
                                <th className="p-4 text-xs uppercase tracking-wider text-slate-400 font-semibold">Last Score</th>
                                <th className="p-4 text-xs uppercase tracking-wider text-slate-400 font-semibold">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-primary/5">
                            {filteredPatients.map(patient => (
                                <tr
                                    key={patient.id}
                                    className={`hover:bg-primary/5 transition-colors cursor-pointer ${selectedPatientId === patient.id ? 'bg-primary/10 border-l-4 border-l-primary' : ''}`}
                                    onClick={() => onSelectPatient(patient)}
                                >
                                    <td className="p-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-200">{patient.name}</span>
                                            <span className="text-xs text-slate-500">{patient.id} • {patient.age}yo {patient.gender}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${patient.status === 'Stable' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                                            patient.status === 'Critical' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' :
                                                'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                                            }`}>
                                            {patient.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-slate-300">{patient.condition}</td>
                                    <td className="p-4 text-sm font-mono text-slate-400">{patient.roomNumber}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-lg font-bold ${patient.currentVitals.score > 80 ? 'text-emerald-400' : patient.currentVitals.score > 60 ? 'text-amber-400' : 'text-rose-400'}`}>
                                                {patient.currentVitals.score}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onSelectPatient(patient);
                                            }}
                                            className="text-primary hover:text-primary-light p-2 hover:bg-primary/10 rounded transition-colors"
                                        >
                                            <Activity className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {filteredPatients.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-slate-500">
                                        No patients found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

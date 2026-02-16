import React from 'react';
import { ClinicalNote } from '../types';

interface NotesViewProps {
    notes: ClinicalNote[];
}

export const NotesView: React.FC<NotesViewProps> = ({ notes }) => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-100">Clinical Notes</h2>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm text-slate-200 transition-colors">
                        <i className="fas fa-download mr-2"></i> Export All
                    </button>
                </div>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
                {notes.length === 0 ? (
                    <div className="text-center p-12 text-slate-500 border border-slate-800 rounded-xl border-dashed">
                        No clinical notes found. Complete a session to generate one.
                    </div>
                ) : (
                    notes.map((note) => (
                        <div key={note.id} className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden hover:border-emerald-500/30 transition-all">
                            <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-900/30">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${note.type === 'Crisis' ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
                                    <span className="font-semibold text-slate-200">{note.date}</span>
                                    <span className="px-2 py-0.5 rounded text-xs bg-slate-700 text-slate-300 border border-slate-600">
                                        {note.type}
                                    </span>
                                </div>
                                <button className="text-slate-400 hover:text-white"><i className="fas fa-ellipsis-h"></i></button>
                            </div>
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-emerald-500 uppercase tracking-wider block mb-1">Subjective</label>
                                        <p className="text-sm text-slate-300 leading-relaxed">{note.subjective}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-emerald-500 uppercase tracking-wider block mb-1">Objective</label>
                                        <p className="text-sm text-slate-300 leading-relaxed">{note.objective}</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-emerald-500 uppercase tracking-wider block mb-1">Assessment</label>
                                        <p className="text-sm text-slate-300 leading-relaxed">{note.assessment}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-emerald-500 uppercase tracking-wider block mb-1">Plan</label>
                                        <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{note.plan}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 bg-emerald-900/10 border-t border-slate-700">
                                <span className="text-xs font-bold text-slate-500 uppercase mr-2">Summary:</span>
                                <span className="text-sm text-emerald-400 italic">{note.summary}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

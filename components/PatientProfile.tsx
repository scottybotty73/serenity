import React from 'react';
import { ClinicalProfile } from '../types';

interface PatientProfileProps {
  profile: ClinicalProfile;
}

export const PatientProfile: React.FC<PatientProfileProps> = ({ profile }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full overflow-y-auto pr-2">
      {/* Left Column: Key Stats */}
      <div className="space-y-6">
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center text-2xl text-slate-300">
              {profile.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100">{profile.name}</h2>
              <p className="text-sm text-slate-400">{profile.age} years old</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Diagnosis</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {profile.diagnosis.map((d, i) => (
                  <span key={i} className="px-2 py-1 bg-red-500/10 text-red-400 rounded text-xs border border-red-500/20">
                    {d}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Medications</label>
              <ul className="mt-2 space-y-1">
                {profile.medications.map((m, i) => (
                  <li key={i} className="text-sm text-slate-300 flex items-center gap-2">
                    <i className="fas fa-pills text-emerald-500/50"></i> {m}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
          <h3 className="font-semibold text-slate-100 mb-4 flex items-center gap-2">
            <i className="fas fa-chart-line text-cyan-400"></i> Progress (GAD-7)
          </h3>
          <div className="flex items-end gap-2 h-32 mt-4">
            {/* Mock Chart Bars */}
            <div className="flex-1 bg-slate-700/30 rounded-t relative group">
                <div className="absolute bottom-0 w-full bg-emerald-500/20 h-[80%] rounded-t group-hover:bg-emerald-500/30 transition-colors"></div>
            </div>
            <div className="flex-1 bg-slate-700/30 rounded-t relative group">
                <div className="absolute bottom-0 w-full bg-emerald-500/20 h-[60%] rounded-t group-hover:bg-emerald-500/30 transition-colors"></div>
            </div>
            <div className="flex-1 bg-slate-700/30 rounded-t relative group">
                <div className="absolute bottom-0 w-full bg-emerald-500/20 h-[40%] rounded-t group-hover:bg-emerald-500/30 transition-colors"></div>
            </div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-slate-500">
            <span>Sep</span>
            <span>Oct</span>
            <span>Nov</span>
          </div>
        </div>
      </div>

      {/* Middle Column: Key People & Trauma */}
      <div className="space-y-6">
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <h3 className="font-semibold text-slate-100 mb-4 flex items-center gap-2">
                <i className="fas fa-users text-purple-400"></i> Key People
            </h3>
            <div className="space-y-3">
                {profile.keyPeople.map((p, i) => (
                    <div key={i} className="p-3 bg-slate-900/50 rounded-lg border border-slate-700/50">
                        <div className="flex justify-between items-start">
                            <span className="font-medium text-slate-200">{p.name}</span>
                            <span className="text-xs bg-slate-700 px-2 py-0.5 rounded text-slate-400">{p.relation}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 italic">"{p.dynamic}"</p>
                    </div>
                ))}
            </div>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
             <h3 className="font-semibold text-slate-100 mb-4 flex items-center gap-2">
                <i className="fas fa-history text-orange-400"></i> Clinical Timeline
            </h3>
            <div className="relative border-l-2 border-slate-700 ml-2 space-y-6 pl-4">
                <div className="relative">
                    <span className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-slate-600 ring-4 ring-slate-800"></span>
                    <p className="text-xs text-slate-500">2 months ago</p>
                    <p className="text-sm text-slate-300">Started new job at TechCorp</p>
                </div>
                <div className="relative">
                    <span className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-orange-500 ring-4 ring-slate-800"></span>
                    <p className="text-xs text-slate-500">1 month ago</p>
                    <p className="text-sm text-slate-300">Panic attack during team meeting</p>
                </div>
            </div>
        </div>
      </div>

      {/* Right Column: Recent Notes */}
      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 h-full">
         <h3 className="font-semibold text-slate-100 mb-4 flex items-center gap-2">
            <i className="fas fa-file-medical text-emerald-400"></i> Recent SOAP Notes
        </h3>
        <div className="space-y-4">
            <div className="p-4 bg-slate-900/50 rounded-lg border-l-4 border-emerald-500">
                <div className="text-xs text-slate-500 mb-1">Oct 24, 2023</div>
                <div className="space-y-2">
                    <div>
                        <span className="text-xs font-bold text-emerald-500 block">S (Subjective)</span>
                        <p className="text-xs text-slate-400">"Feeling overwhelmed by the presentation."</p>
                    </div>
                    <div>
                        <span className="text-xs font-bold text-emerald-500 block">A (Assessment)</span>
                        <p className="text-xs text-slate-400">Anxiety spikes related to performance. Avoiding preparation behavior noted.</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

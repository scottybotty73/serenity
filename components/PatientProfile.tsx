import React from 'react';
import { ClinicalProfile } from '../types';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface PatientProfileProps {
  profile: ClinicalProfile;
}

// Mock historical data for the chart
const PROGRESS_DATA = [
  { date: 'Sep 1', score: 18, severity: 'Severe' },
  { date: 'Sep 15', score: 15, severity: 'Severe' },
  { date: 'Oct 1', score: 14, severity: 'Moderate' },
  { date: 'Oct 15', score: 12, severity: 'Moderate' },
  { date: 'Oct 24', score: 10, severity: 'Moderate' },
];

export const PatientProfile: React.FC<PatientProfileProps> = ({ profile }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full overflow-y-auto pr-2 pb-8">
      {/* Left Column: Key Stats */}
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
                <i className="fas fa-chart-line text-cyan-400"></i> Anxiety Progression (GAD-7)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={PROGRESS_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} domain={[0, 21]} />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                        itemStyle={{ color: '#10b981' }}
                    />
                    <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Middle Column: Key People & Trauma */}
      <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                    <i className="fas fa-users text-purple-400"></i> Key People
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {profile.keyPeople.map((p, i) => (
                    <div key={i} className="p-3 bg-slate-900/50 rounded-lg border border-slate-700/50">
                        <div className="flex justify-between items-start">
                            <span className="font-medium text-slate-200">{p.name}</span>
                            <span className="text-xs bg-slate-700 px-2 py-0.5 rounded text-slate-400">{p.relation}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 italic">"{p.dynamic}"</p>
                    </div>
                ))}
            </CardContent>
        </Card>

        <Card>
             <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                    <i className="fas fa-history text-orange-400"></i> Clinical Timeline
                </CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
        </Card>
      </div>

      {/* Right Column: Recent Notes */}
      <Card className="h-full">
         <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
                <i className="fas fa-file-medical text-emerald-400"></i> Recent SOAP Notes
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
            <div className="p-4 bg-slate-900/50 rounded-lg border-l-4 border-slate-600">
                <div className="text-xs text-slate-500 mb-1">Oct 17, 2023</div>
                <div className="space-y-2">
                    <div>
                        <span className="text-xs font-bold text-slate-500 block">S (Subjective)</span>
                        <p className="text-xs text-slate-400">"Wife doesn't understand the pressure."</p>
                    </div>
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
};

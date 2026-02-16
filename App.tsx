import React, { useState, useEffect } from 'react';
import { APP_NAME } from './constants';
import { AppState, Message, ClinicalProfile, ClinicalNote, Appointment } from './types';
import { ChatInterface } from './components/ChatInterface';
import { PatientProfile } from './components/PatientProfile';
import { ScheduleView } from './components/ScheduleView';
import { NotesView } from './components/NotesView';
import { StorageService } from './services/storage';
import { generateMorningBriefing } from './services/ai';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    view: 'DASHBOARD',
    isAwake: false,
    activePatientId: '1'
  });

  const [messages, setMessages] = useState<Message[]>([]);
  const [profile, setProfile] = useState<ClinicalProfile | null>(null);
  const [notes, setNotes] = useState<ClinicalNote[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [wakingUp, setWakingUp] = useState(false);
  const [briefing, setBriefing] = useState<string>("Wake me up to analyze the daily schedule.");

  // Load Data on Mount
  useEffect(() => {
    setMessages(StorageService.getMessages());
    setProfile(StorageService.getProfile());
    setNotes(StorageService.getNotes());
    setAppointments(StorageService.getAppointments());
  }, []);

  const handleWakeUp = async () => {
    setWakingUp(true);
    
    // Use AI to generate real briefing based on stored data
    if (profile) {
        const aiBriefing = await generateMorningBriefing(appointments, profile);
        setBriefing(aiBriefing);
    }

    setTimeout(() => {
      setState(prev => ({ ...prev, isAwake: true }));
      setWakingUp(false);
    }, 1500);
  };

  const renderContent = () => {
    if (!profile) return <div>Loading...</div>;

    switch (state.view) {
      case 'CHAT':
        return (
            <ChatInterface 
                messages={messages} 
                profile={profile}
                onSendMessage={(msg) => setMessages(prev => [...prev, msg])}
                onUpdateProfile={(p) => setProfile(p)}
            />
        );
      case 'PROFILE':
        return <PatientProfile profile={profile} />;
      case 'SCHEDULE':
        return <ScheduleView />;
      case 'NOTES':
        return <NotesView notes={notes} />;
      case 'DASHBOARD':
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Status Card */}
            <div className="col-span-full bg-gradient-to-r from-slate-800 to-slate-900 p-8 rounded-2xl border border-slate-700 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
              <div className="relative z-10 flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold text-slate-100 mb-2">
                    {state.isAwake ? "Online & Monitoring" : "Agent Sleeping"}
                  </h2>
                  <p className="text-slate-400 max-w-xl leading-relaxed">
                    {briefing}
                  </p>
                </div>
                {!state.isAwake ? (
                  <button 
                    onClick={handleWakeUp}
                    disabled={wakingUp}
                    className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
                  >
                    {wakingUp ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-power-off"></i>}
                    {wakingUp ? "Booting..." : "Wake Up Agent"}
                  </button>
                ) : (
                  <div className="flex flex-col items-end gap-2">
                    <span className="flex items-center gap-2 text-emerald-400 font-mono bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                      SYSTEM ACTIVE
                    </span>
                    <span className="text-xs text-slate-500">Next cycle: 14:00 PM</span>
                  </div>
                )}
              </div>
            </div>

            {/* Upcoming Schedule */}
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-slate-100">Today's Schedule</h3>
                <span className="text-xs bg-slate-700 px-2 py-1 rounded text-slate-300">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
              <div className="space-y-4">
                {appointments.slice(0,4).map(apt => (
                  <div key={apt.id} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-800 hover:border-emerald-500/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="text-center min-w-[60px]">
                        <span className="block text-sm font-bold text-slate-200">{apt.time.split(' ')[0]}</span>
                        <span className="block text-xs text-slate-500">{apt.time.split(' ')[1]}</span>
                      </div>
                      <div>
                        <div className="font-medium text-slate-200">{apt.patientName}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-1">
                          <i className={`fas ${apt.platform === 'Telegram' ? 'fa-paper-plane' : apt.platform === 'Voice' ? 'fa-microphone' : 'fa-laptop'}`}></i>
                          {apt.platform}
                        </div>
                      </div>
                    </div>
                    {apt.status === 'UPCOMING' && (
                      <button className="p-2 text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors">
                        <i className="fas fa-play"></i>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
              <h3 className="font-semibold text-slate-100 mb-6">Therapist Tools</h3>
              <div className="grid grid-cols-2 gap-4">
                <button 
                    onClick={() => setState(s => ({...s, view: 'NOTES'}))}
                    className="p-4 bg-slate-700/50 hover:bg-slate-700 rounded-xl text-left transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <i className="fas fa-book-medical"></i>
                  </div>
                  <span className="text-sm font-medium text-slate-200">Review Notes</span>
                </button>
                <button 
                    onClick={() => StorageService.clearAll()}
                    className="p-4 bg-slate-700/50 hover:bg-slate-700 rounded-xl text-left transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <i className="fas fa-trash-alt"></i>
                  </div>
                  <span className="text-sm font-medium text-slate-200">Reset Data</span>
                </button>
                <button className="p-4 bg-slate-700/50 hover:bg-slate-700 rounded-xl text-left transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <i className="fas fa-clipboard-list"></i>
                  </div>
                  <span className="text-sm font-medium text-slate-200">Assign Homework</span>
                </button>
                <button className="p-4 bg-slate-700/50 hover:bg-slate-700 rounded-xl text-left transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <i className="fas fa-newspaper"></i>
                  </div>
                  <span className="text-sm font-medium text-slate-200">Psych News</span>
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500/30">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <i className="fas fa-brain text-slate-900 text-sm"></i>
          </div>
          <h1 className="text-xl font-bold text-slate-100 tracking-tight">{APP_NAME}</h1>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <NavButton 
            active={state.view === 'DASHBOARD'} 
            onClick={() => setState(s => ({...s, view: 'DASHBOARD'}))}
            icon="fa-columns" 
            label="Dashboard" 
          />
          <NavButton 
            active={state.view === 'CHAT'} 
            onClick={() => setState(s => ({...s, view: 'CHAT'}))}
            icon="fa-comments" 
            label="Live Session" 
            badge="1"
          />
          <NavButton 
            active={state.view === 'SCHEDULE'} 
            onClick={() => setState(s => ({...s, view: 'SCHEDULE'}))}
            icon="fa-calendar-alt" 
            label="Schedule" 
          />
           <NavButton 
            active={state.view === 'NOTES'} 
            onClick={() => setState(s => ({...s, view: 'NOTES'}))}
            icon="fa-file-medical" 
            label="Clinical Notes" 
          />
          <div className="pt-4 mt-4 border-t border-slate-800">
            <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Patients</p>
            <NavButton 
                active={state.view === 'PROFILE'} 
                onClick={() => setState(s => ({...s, view: 'PROFILE'}))}
                icon="fa-user-circle" 
                label={profile?.name || "Patient"} 
            />
          </div>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <img src="https://ui-avatars.com/api/?name=Dr+AI&background=10b981&color=fff" className="w-8 h-8 rounded-full" alt="Profile" />
            <div className="flex-1">
              <div className="text-sm font-medium text-slate-200">Dr. Serenity</div>
              <div className="text-xs text-slate-500">v2.4.0 (Gemini Pro)</div>
            </div>
            <i className="fas fa-cog text-slate-500 hover:text-slate-300 cursor-pointer"></i>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden flex flex-col">
        {/* Top Bar */}
        <header className="h-16 bg-slate-900/50 backdrop-blur border-b border-slate-800 flex items-center justify-between px-8">
          <div className="flex items-center gap-4 text-sm text-slate-400">
             <span className="flex items-center gap-2">
               <span className={`w-2 h-2 rounded-full ${state.isAwake ? 'bg-emerald-500' : 'bg-orange-500'}`}></span>
               {state.isAwake ? 'Agent Active' : 'Agent Sleeping'}
             </span>
             <span className="w-px h-4 bg-slate-700"></span>
             <span>{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-4">
             <button className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                <i className="fas fa-bell"></i>
             </button>
             <button className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                <i className="fas fa-search"></i>
             </button>
          </div>
        </header>

        {/* Content View */}
        <div className="flex-1 p-8 overflow-y-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: string; label: string; badge?: string }> = ({ active, onClick, icon, label, badge }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
      active 
        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
    }`}
  >
    <div className="flex items-center gap-3">
      <i className={`fas ${icon} w-5 text-center`}></i>
      <span className="font-medium text-sm">{label}</span>
    </div>
    {badge && (
      <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold">
        {badge}
      </span>
    )}
  </button>
);

export default App;

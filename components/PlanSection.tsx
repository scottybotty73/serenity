import React from 'react';

interface PlanSectionProps {
  title: string;
  children: React.ReactNode;
  icon: string;
  isOpen: boolean;
  onToggle: () => void;
}

export const PlanSection: React.FC<PlanSectionProps> = ({ title, children, icon, isOpen, onToggle }) => {
  return (
    <div className="mb-4 border border-slate-700 rounded-lg bg-slate-800/50 overflow-hidden transition-all duration-300">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-700/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
            <i className={`fas ${icon}`}></i>
          </div>
          <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
        </div>
        <i className={`fas fa-chevron-down transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} text-slate-400`}></i>
      </button>
      
      <div 
        className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="p-4 pt-0 text-slate-300 leading-relaxed border-t border-slate-700/50 mt-2">
           {children}
        </div>
      </div>
    </div>
  );
};
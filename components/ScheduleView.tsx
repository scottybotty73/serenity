import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { MOCK_APPOINTMENTS } from '../mockData';

export const ScheduleView: React.FC = () => {
  // Generate days for the current month view (Mock: October 2023)
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
  const startDayOffset = 6; // Starts on Sunday (mock)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Schedule</h2>
          <p className="text-slate-400">Manage therapy sessions and availability</p>
        </div>
        <Button>
          <i className="fas fa-plus mr-2"></i> New Appointment
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
            <CardTitle>October 2023</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="icon"><i className="fas fa-chevron-left"></i></Button>
              <Button variant="outline" size="icon"><i className="fas fa-chevron-right"></i></Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-4 mb-4 text-center">
               {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                 <div key={d} className="text-sm font-medium text-slate-500">{d}</div>
               ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
               {/* Empty slots for start offset */}
               {Array.from({ length: startDayOffset }).map((_, i) => (
                 <div key={`empty-${i}`} className="h-24 bg-transparent"></div>
               ))}
               {/* Days */}
               {daysInMonth.map(day => {
                 const apt = MOCK_APPOINTMENTS.find(a => a.status === 'UPCOMING' && day === 24); // Mock logic
                 const isToday = day === 24;
                 return (
                   <div 
                      key={day} 
                      className={`h-24 border rounded-lg p-2 transition-all relative group cursor-pointer
                        ${isToday ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-700 bg-slate-900/50 hover:bg-slate-800'}
                      `}
                   >
                     <span className={`text-sm ${isToday ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}>{day}</span>
                     {isToday && (
                       <div className="mt-2 text-xs bg-emerald-500 text-slate-900 p-1 rounded font-medium truncate">
                         09:00 Alex T.
                       </div>
                     )}
                   </div>
                 )
               })}
            </div>
          </CardContent>
        </Card>

        {/* Sidebar: Upcoming & Requests */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pending Requests</CardTitle>
              <CardDescription>2 patients requesting slots</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center">
                     <i className="fas fa-user"></i>
                   </div>
                   <div>
                     <div className="text-sm font-medium text-slate-200">Mike Ross</div>
                     <div className="text-xs text-slate-500">Voice Session</div>
                   </div>
                </div>
                <Button size="sm" variant="outline"><i className="fas fa-check"></i></Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">
                     <i className="fas fa-user"></i>
                   </div>
                   <div>
                     <div className="text-sm font-medium text-slate-200">Sarah J.</div>
                     <div className="text-xs text-slate-500">Intake</div>
                   </div>
                </div>
                <Button size="sm" variant="outline"><i className="fas fa-check"></i></Button>
              </div>
            </CardContent>
          </Card>
          
           <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
               <div className="p-4 bg-slate-900/50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-emerald-400">12</div>
                  <div className="text-xs text-slate-500">Hours This Week</div>
               </div>
               <div className="p-4 bg-slate-900/50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-400">4</div>
                  <div className="text-xs text-slate-500">New Patients</div>
               </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

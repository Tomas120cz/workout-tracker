import React from 'react';
import { 
  LayoutDashboard, 
  Dumbbell, 
  UtensilsCrossed, 
  LineChart, 
  Flame, 
  Calculator,
  Activity
} from 'lucide-react';

export default function Navigation({ 
  activeTab, 
  setActiveTab, 
  isWorkoutActive, 
  activeWorkoutDuration,
  onOpenPlateCalculator 
}) {
  const navItems = [
    { id: 'dashboard', label: 'Přehled', icon: LayoutDashboard },
    { 
      id: 'workout', 
      label: 'Trénink', 
      icon: Dumbbell,
      isWorkoutTab: true
    },
    { id: 'nutrition', label: 'Výživa & Tělo', icon: UtensilsCrossed },
    { id: 'analytics', label: 'Statistiky', icon: LineChart },
  ];

  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-40 glass-header px-4 py-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
              <Activity className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-base sm:text-lg text-slate-900">LIFTOFF</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-200">
                  System
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">Hypertrofie & Síla</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 glass-subcard p-1 rounded-2xl shadow-xs">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-white/95 text-blue-600 shadow-sm border border-white font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <Icon className="w-4 h-4 stroke-[2]" />
                  <span>{item.label}</span>
                  {item.isWorkoutTab && isWorkoutActive && (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Badges & Plate Calculator */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenPlateCalculator}
              title="Kalkulačka kotoučů"
              className="glass-button px-3 py-1.5 rounded-xl text-slate-700 hover:text-blue-600 transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
            >
              <Calculator className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">Kotouče</span>
            </button>

            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-subcard text-slate-700 text-xs font-medium">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>6 týdnů</span>
            </div>

            {isWorkoutActive && (
              <button
                onClick={() => setActiveTab('workout')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl glass-badge-blue font-bold text-xs cursor-pointer hover:bg-blue-100/90 transition shadow-xs"
              >
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                <span>{activeWorkoutDuration || 'Trénink běží'}</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass-bottom-nav px-3 py-2">
        <div className="grid grid-cols-4 gap-1 max-w-md mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer ${
                  isActive
                    ? 'text-blue-600 bg-blue-50/80 font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <div className="relative">
                  <Icon className="w-5 h-5 stroke-[2]" />
                  {item.isWorkoutTab && isWorkoutActive && (
                    <span className="absolute -top-1 -right-1 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                    </span>
                  )}
                </div>
                <span className="text-[10px] mt-1 tracking-tight">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

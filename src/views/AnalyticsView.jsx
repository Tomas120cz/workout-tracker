import React, { useState } from 'react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  BarChart3, 
  Trophy, 
  Layers
} from 'lucide-react';
import { INITIAL_PROGRESSION_DATA } from '../data/initialData';

export default function AnalyticsView({ personalRecords, userProfile }) {
  const [selectedLift, setSelectedLift] = useState('bench');

  const liftsConfig = {
    bench: { name: 'Bench Press', color: '#2563eb', current1RM: 135, start1RM: 120 },
    squat: { name: 'Dřep (Squat)', color: '#0284c7', current1RM: 185, start1RM: 165 },
    deadlift: { name: 'Mrtvý tah (Deadlift)', color: '#4f46e5', current1RM: 220, start1RM: 200 },
    ohp: { name: 'Overhead Press (OHP)', color: '#d97706', current1RM: 85, start1RM: 75 },
  };

  const currentLiftConfig = liftsConfig[selectedLift];
  const deltaKg = currentLiftConfig.current1RM - currentLiftConfig.start1RM;
  const deltaPct = Math.round((deltaKg / currentLiftConfig.start1RM) * 1000) / 10;

  const chartData = INITIAL_PROGRESSION_DATA.history1RM.map(item => ({
    month: item.month,
    weight: item[selectedLift],
    volume: item.volume
  }));

  const bigThreeTotal = (personalRecords.find(p => p.id === 'ex_bench')?.current1RM || 135) +
                        (personalRecords.find(p => p.id === 'ex_squat')?.current1RM || 185) +
                        (personalRecords.find(p => p.id === 'ex_deadlift')?.current1RM || 220);

  return (
    <div className="space-y-6 pb-28 max-w-7xl mx-auto px-4 sm:px-6 pt-5 animate-fadeIn">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <span>Statistiky & Progrese</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Vývoj silových maxim (1RM) a celkového objemu.
          </p>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl glass-panel">
          <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Big 3 Total (S+B+D)</span>
            <span className="text-lg font-bold font-mono-num text-slate-900">
              {bigThreeTotal} kg
            </span>
          </div>
        </div>
      </div>

      {/* 1. Silová křivka 1RM */}
      <div className="glass-panel rounded-2xl p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
              Silová křivka
            </span>
            <h2 className="text-base font-bold text-slate-900 mt-1">
              Progrese 1RM: {currentLiftConfig.name}
            </h2>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {Object.entries(liftsConfig).map(([key, cfg]) => (
              <button
                key={key}
                onClick={() => setSelectedLift(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
                  selectedLift === key
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cfg.name}
              </button>
            ))}
          </div>
        </div>

        {/* Metriky */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] text-slate-500 font-medium block">Aktuální 1RM</span>
            <span className="text-xl font-bold font-mono-num text-slate-900">
              {currentLiftConfig.current1RM} <span className="text-xs text-slate-400 font-normal">kg</span>
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] text-slate-500 font-medium block">Růst (6 měsíců)</span>
            <span className="text-xl font-bold font-mono-num text-emerald-700">
              +{deltaKg} kg
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] text-slate-500 font-medium block">Procentuální růst</span>
            <span className="text-xl font-bold font-mono-num text-blue-700">
              +{deltaPct}%
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] text-slate-500 font-medium block">Relativní síla</span>
            <span className="text-xl font-bold font-mono-num text-slate-800">
              {(currentLiftConfig.current1RM / (userProfile?.currentWeight || 84.8)).toFixed(2)}× <span className="text-xs text-slate-400 font-normal">BW</span>
            </span>
          </div>
        </div>

        {/* Graf 1RM */}
        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="lightChartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={currentLiftConfig.color} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={currentLiftConfig.color} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis 
                stroke="#94a3b8" 
                fontSize={11} 
                domain={['dataMin - 5', 'dataMax + 5']}
                tickLine={false}
                tickFormatter={(val) => `${val}kg`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  borderColor: '#cbd5e1', 
                  borderRadius: '10px',
                  color: '#0f172a',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                }}
                formatter={(val) => [`${val} kg (1RM)`, currentLiftConfig.name]}
              />
              <Area 
                type="monotone" 
                dataKey="weight" 
                stroke={currentLiftConfig.color} 
                strokeWidth={2.5}
                fillOpacity={1} 
                fill="url(#lightChartGrad)"
                dot={{ fill: currentLiftConfig.color, r: 3 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid: 2. Objem & Hypertrofie */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Celkový objem */}
        <div className="glass-panel rounded-2xl p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900">Měsíční objem</h3>
                <p className="text-xs text-slate-500">Zvednutá tonáž</p>
              </div>
            </div>

            <span className="text-xs font-bold font-mono-num text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
              21.5 tun
            </span>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis 
                  stroke="#94a3b8" 
                  fontSize={11} 
                  tickLine={false}
                  tickFormatter={(val) => `${(val / 1000).toFixed(0)}t`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    borderColor: '#cbd5e1', 
                    borderRadius: '8px',
                    color: '#0f172a'
                  }}
                  formatter={(val) => [`${val.toLocaleString()} kg (${(val / 1000).toFixed(1)} tun)`, 'Objem']}
                />
                <Bar dataKey="volume" radius={[6, 6, 0, 0]}>
                  {chartData.map((_, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index === chartData.length - 1 ? '#2563eb' : '#cbd5e1'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hypertrofický objem partií */}
        <div className="glass-panel rounded-2xl p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900">Objem na partii</h3>
                <p className="text-xs text-slate-500">Pracovní série za týden</p>
              </div>
            </div>

            <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
              Cíl: 10–20 sérií
            </span>
          </div>

          <div className="space-y-2.5 pt-1">
            {INITIAL_PROGRESSION_DATA.muscleVolume.map((item) => {
              const pct = Math.min(100, Math.round((item.currentSets / item.targetMax) * 100));
              const isOptimal = item.currentSets >= item.targetMin && item.currentSets <= item.targetMax;

              return (
                <div key={item.muscle} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-800">{item.muscle}</span>
                    <div className="flex items-center gap-1.5 font-mono-num text-[11px]">
                      <span className={`font-bold ${isOptimal ? 'text-blue-700' : 'text-amber-700'}`}>
                        {item.currentSets} sérií
                      </span>
                      <span className="text-slate-400">
                        (cíl: {item.targetMin}–{item.targetMax})
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isOptimal ? 'bg-blue-600' : 'bg-amber-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

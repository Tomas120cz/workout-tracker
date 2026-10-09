import React, { useState } from 'react';
import { X, Calculator, Plus, Minus } from 'lucide-react';
import { calculatePlates } from '../utils/formulas';

export default function PlateCalculatorModal({ 
  initialWeight = 100, 
  isOpen, 
  onClose 
}) {
  const [targetWeight, setTargetWeight] = useState(initialWeight || 100);
  const [barWeight, setBarWeight] = useState(20);

  if (!isOpen) return null;

  const result = calculatePlates(targetWeight, barWeight);

  const PLATE_COLORS = {
    25: { bg: 'bg-red-600', text: 'text-white', border: 'border-red-500', height: 'h-24' },
    20: { bg: 'bg-blue-600', text: 'text-white', border: 'border-blue-500', height: 'h-22' },
    15: { bg: 'bg-amber-500', text: 'text-white', border: 'border-amber-400', height: 'h-20' },
    10: { bg: 'bg-emerald-600', text: 'text-white', border: 'border-emerald-500', height: 'h-16' },
    5: { bg: 'bg-slate-200', text: 'text-slate-800', border: 'border-slate-300', height: 'h-13' },
    2.5: { bg: 'bg-slate-700', text: 'text-white', border: 'border-slate-800', height: 'h-11' },
    1.25: { bg: 'bg-slate-400', text: 'text-white', border: 'border-slate-500', height: 'h-9' },
  };

  const adjustWeight = (delta) => {
    setTargetWeight(prev => Math.max(barWeight, Math.round((prev + delta) * 10) / 10));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white/95 border border-slate-200 rounded-2xl w-full max-w-lg p-5 sm:p-6 shadow-2xl relative text-slate-800 backdrop-blur-xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">Kalkulačka kotoučů</h3>
              <p className="text-xs text-slate-500">Rozpis pro olympijskou osu</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Váha */}
        <div className="my-5 flex flex-col items-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Cílová váha
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => adjustWeight(-5)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
            >
              <Minus className="w-4 h-4" />
            </button>
            <div className="flex items-baseline gap-1 bg-slate-50 px-5 py-2 rounded-xl border border-slate-200 min-w-[140px] justify-center">
              <input
                type="number"
                step="2.5"
                value={targetWeight}
                onChange={(e) => setTargetWeight(parseFloat(e.target.value) || 0)}
                className="w-20 text-2xl font-black font-mono-num text-center bg-transparent focus:outline-none text-slate-900"
              />
              <span className="text-xs font-bold text-slate-500">kg</span>
            </div>
            <button
              onClick={() => adjustWeight(5)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-1.5 mt-3">
            {[60, 80, 100, 120, 140, 160, 180].map((w) => (
              <button
                key={w}
                onClick={() => setTargetWeight(w)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition cursor-pointer ${
                  targetWeight === w 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {w} kg
              </button>
            ))}
          </div>
        </div>

        {/* Volba osy */}
        <div className="flex items-center justify-between px-3.5 py-2 bg-slate-50 rounded-xl border border-slate-200 mb-4">
          <span className="text-xs text-slate-600 font-medium">Váha samotné osy:</span>
          <div className="flex gap-1.5">
            {[20, 15].map((bw) => (
              <button
                key={bw}
                onClick={() => setBarWeight(bw)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition cursor-pointer ${
                  barWeight === bw 
                    ? 'bg-white text-slate-900 border border-slate-200 shadow-2xs' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {bw} kg {bw === 20 ? '(standard)' : '(dámská)'}
              </button>
            ))}
          </div>
        </div>

        {/* Výsledek */}
        <div className="p-3.5 rounded-xl bg-blue-50/80 border border-blue-200 text-center mb-4">
          <span className="text-[11px] text-blue-700 uppercase tracking-wider font-semibold">
            Naložit na každou stranu:
          </span>
          <div className="text-2xl font-black font-mono-num text-blue-700 mt-0.5">
            {result.perSideWeight} kg
          </div>
        </div>

        {/* Schéma osy */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-4 overflow-x-auto">
          <div className="flex items-center justify-start min-w-[260px] h-28 pl-4">
            <div className="w-6 h-16 bg-slate-400 rounded-l-md border-r-2 border-slate-500 flex items-center justify-center">
              <span className="text-[8px] font-bold text-white -rotate-90">OSA</span>
            </div>
            
            <div className="flex items-center gap-1 bg-slate-200/50 p-1.5 rounded-r-lg border border-slate-300">
              {result.platesPerSide.length === 0 ? (
                <div className="text-xs text-slate-500 italic px-3">Pouze prázdná osa</div>
              ) : (
                result.platesPerSide.map(({ plate, count }) => (
                  Array.from({ length: count }).map((_, i) => {
                    const style = PLATE_COLORS[plate] || { bg: 'bg-slate-400', text: 'text-white', border: 'border-slate-500', height: 'h-14' };
                    return (
                      <div
                        key={`${plate}-${i}`}
                        className={`w-5 ${style.height} ${style.bg} ${style.text} border ${style.border} rounded-sm flex items-center justify-center font-bold text-[9px] shadow-2xs`}
                        title={`${plate} kg`}
                      >
                        <span className="-rotate-90">{plate}</span>
                      </div>
                    );
                  })
                ))
              )}
            </div>
          </div>
        </div>

        {/* Rozpis kotoučů */}
        <div className="grid grid-cols-2 gap-2">
          {result.platesPerSide.map(({ plate, count }) => (
            <div key={plate} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs">
              <span className="font-semibold text-slate-800">{plate} kg kotouč</span>
              <span className="font-bold text-blue-700 font-mono-num">{count}× / stranu</span>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition cursor-pointer"
        >
          Hotovo
        </button>
      </div>
    </div>
  );
}

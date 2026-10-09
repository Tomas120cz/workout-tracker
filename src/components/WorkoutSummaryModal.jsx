import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Clock, Weight, Flame, CheckCircle2 } from 'lucide-react';
import { soundEffects } from '../utils/audio';

export default function WorkoutSummaryModal({
  summary,
  isOpen,
  onClose,
  onSaveAndExit
}) {
  useEffect(() => {
    if (isOpen) {
      soundEffects.playPRCelebration();
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#2563eb', '#38bdf8', '#0ea5e9', '#64748b']
        });
      } catch {
        // Ignore
      }
    }
  }, [isOpen]);

  if (!isOpen || !summary) return null;

  const { workoutName, durationFormatted, totalVolume, totalSets, personalRecords = [] } = summary;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white/95 border border-slate-200 rounded-2xl w-full max-w-md p-6 shadow-2xl relative text-slate-800 text-center backdrop-blur-xl">
        {/* Top badge */}
        <div className="mx-auto w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center mb-3 text-blue-600">
          <Trophy className="w-6 h-6 stroke-[2]" />
        </div>

        <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100">
          Trénink dokončen
        </span>

        <h2 className="text-xl font-bold text-slate-900 mt-2 mb-0.5">{workoutName || 'Trénink'}</h2>
        <p className="text-xs text-slate-500 mb-5">Progresivní přetížení úspěšně splněno.</p>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2.5 mb-4 text-left">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium mb-1">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span>Doba</span>
            </div>
            <div className="text-base font-bold font-mono-num text-slate-900">
              {durationFormatted || '45m'}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium mb-1">
              <Weight className="w-3.5 h-3.5 text-blue-600" />
              <span>Objem</span>
            </div>
            <div className="text-base font-bold font-mono-num text-slate-900">
              {Math.round(totalVolume).toLocaleString()} <span className="text-xs text-slate-500">kg</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium mb-1">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>Série</span>
            </div>
            <div className="text-base font-bold font-mono-num text-slate-900">
              {totalSets || 0}
            </div>
          </div>
        </div>

        {/* PRs */}
        {personalRecords && personalRecords.length > 0 && (
          <div className="mb-4 p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-left">
            <div className="flex items-center gap-1.5 text-amber-800 font-semibold text-xs mb-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-600" />
              <span>Nový osobní rekord (1RM)</span>
            </div>
            <div className="space-y-1">
              {personalRecords.map((pr, i) => (
                <div key={i} className="flex justify-between items-center text-xs">
                  <span className="text-slate-800">{pr.exercise}</span>
                  <span className="font-mono-num font-bold text-amber-900">
                    {pr.weight} kg × {pr.reps} (1RM {pr.calc1RM} kg)
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <button
            onClick={onSaveAndExit}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Uložit a pokračovat</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-2 rounded-lg text-slate-500 hover:text-slate-800 text-xs font-medium transition cursor-pointer"
          >
            Zavřít
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Timer, Plus, Play, Pause, X, Volume2, VolumeX } from 'lucide-react';
import { soundEffects } from '../utils/audio';

export default function RestTimerFloating({ 
  timerState, 
  setTimerState 
}) {
  const [soundEnabled, setSoundEnabled] = useState(true);

  const { active, timeLeft, totalDuration, exerciseName, setNumber } = timerState;

  useEffect(() => {
    let interval = null;
    if (active && timeLeft > 0) {
      interval = setInterval(() => {
        setTimerState(prev => {
          if (!prev.active) return prev;
          const nextTime = prev.timeLeft - 1;

          if (soundEnabled && nextTime > 0 && nextTime <= 3) {
            soundEffects.playBeep(700, 0.08);
          }

          if (nextTime <= 0) {
            if (soundEnabled) {
              soundEffects.playRestComplete();
            }
            return {
              ...prev,
              active: false,
              timeLeft: 0,
              finishedJustNow: true
            };
          }

          return { ...prev, timeLeft: nextTime };
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [active, timeLeft, soundEnabled, setTimerState]);

  if (!active && timeLeft === 0 && !timerState.finishedJustNow) {
    return null;
  }

  const progress = totalDuration > 0 ? Math.max(0, Math.min(100, ((totalDuration - timeLeft) / totalDuration) * 100)) : 0;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  const addTime = (secs) => {
    setTimerState(prev => ({
      ...prev,
      timeLeft: Math.max(0, prev.timeLeft + secs),
      totalDuration: Math.max(prev.totalDuration, prev.timeLeft + secs),
      active: true,
      finishedJustNow: false
    }));
  };

  const togglePlay = () => {
    setTimerState(prev => ({ ...prev, active: !prev.active }));
  };

  const closeTimer = () => {
    setTimerState({
      active: false,
      timeLeft: 0,
      totalDuration: 0,
      exerciseName: '',
      setNumber: 0,
      finishedJustNow: false
    });
  };

  return (
    <div className="fixed z-50 transition-all duration-300 bottom-16 sm:bottom-6 left-3 right-3 sm:left-auto sm:right-6 sm:w-96">
      <div className={`rounded-2xl border shadow-xl backdrop-blur-xl transition-all ${
        timerState.finishedJustNow
          ? 'bg-blue-50/95 border-blue-400'
          : 'bg-white/95 border-slate-200'
      }`}>
        {/* Progress line */}
        <div className="w-full bg-slate-100 h-1 rounded-t-2xl overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ${
              timerState.finishedJustNow ? 'bg-blue-600 w-full' : 'bg-blue-600'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="p-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${
                timerState.finishedJustNow 
                  ? 'bg-blue-600 text-white' 
                  : active 
                    ? 'bg-blue-50 text-blue-600 border border-blue-200'
                    : 'bg-slate-100 text-slate-500'
              }`}>
                <Timer className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold font-mono-num tracking-tight text-slate-900">
                    {timerState.finishedJustNow ? 'Čas vypršel' : formattedTime}
                  </span>
                  {exerciseName && (
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                      Série {setNumber}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 truncate max-w-[170px]">
                  {exerciseName || 'Pauza mezi sériemi'}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => addTime(30)}
                className="px-2 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition flex items-center gap-0.5 cursor-pointer"
                title="Přidat 30s"
              >
                <Plus className="w-3 h-3 text-blue-600" />
                <span>30s</span>
              </button>

              <button
                onClick={togglePlay}
                className="p-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition cursor-pointer"
                title={active ? 'Pauza' : 'Spustit'}
              >
                {active ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              </button>

              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 transition cursor-pointer"
                title={soundEnabled ? 'Ztlumit' : 'Zapnout zvuk'}
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={closeTimer}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 transition cursor-pointer"
                title="Zavřít"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

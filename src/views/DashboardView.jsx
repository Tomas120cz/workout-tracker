import React from 'react';
import { 
  Play, 
  TrendingUp, 
  Trophy, 
  Utensils, 
  Calendar, 
  ChevronRight, 
  Dumbbell,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { WORKOUT_TEMPLATES } from '../data/initialData';

export default function DashboardView({
  userProfile,
  weekSummary,
  nutritionToday,
  personalRecords,
  onStartTemplate,
  onStartEmptyWorkout,
  setActiveTab
}) {
  const calPercent = Math.min(100, Math.round((nutritionToday.calories / nutritionToday.targetCalories) * 100));
  const calRemaining = Math.max(0, nutritionToday.targetCalories - nutritionToday.calories);
  const benchPR = personalRecords.find(p => p.id === 'ex_bench') || personalRecords[0];

  return (
    <div className="space-y-6 pb-24 max-w-7xl mx-auto px-4 sm:px-6 pt-5 animate-fadeIn">
      {/* Clean Welcome Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-7 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider glass-badge-blue px-2.5 py-0.5 rounded-lg">
                {userProfile.currentPhase}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Váha: <strong className="text-slate-800 font-mono-num">{userProfile.currentWeight} kg</strong>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Přehled tréninku
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-lg">
              Sledování progresivního přetížení a výživy pro svalový růst.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onStartTemplate(WORKOUT_TEMPLATES[0])}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Spustit Push A</span>
            </button>

            <button
              onClick={onStartEmptyWorkout}
              className="glass-button px-4 py-2.5 rounded-xl text-slate-700 font-semibold text-xs transition flex items-center gap-2 cursor-pointer"
            >
              <Dumbbell className="w-3.5 h-3.5 text-slate-500" />
              <span>Volný trénink</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: 3 Main Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* 1. Týdenní mikrocyklus */}
        <div className="glass-panel rounded-3xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50/90 border border-blue-200/60 flex items-center justify-center text-blue-600 shadow-2xs">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Aktuální týden</h3>
                  <p className="text-[11px] text-slate-500">Splněné tréninky</p>
                </div>
              </div>
              <span className="text-xs font-bold font-mono-num glass-badge-blue px-2.5 py-0.5 rounded-lg">
                {weekSummary.workoutsDone} / {weekSummary.workoutsTarget}
              </span>
            </div>

            {/* Dny v týdnu */}
            <div className="grid grid-cols-7 gap-1.5 mb-4">
              {weekSummary.days.map((d, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col items-center py-2 px-1 rounded-xl border text-center transition ${
                    d.done
                      ? 'bg-blue-50/90 border-blue-200 text-blue-700 shadow-2xs'
                      : 'glass-subcard text-slate-400'
                  }`}
                  title={`${d.day}: ${d.name}`}
                >
                  <span className="text-[10px] font-semibold">{d.day}</span>
                  {d.done ? (
                    <CheckCircle2 className="w-3.5 h-3.5 mt-1 text-blue-600" />
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2" />
                  )}
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-2xl glass-subcard flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-500 block">Zvednutý objem</span>
                <span className="text-base font-bold font-mono-num text-slate-900">
                  {(weekSummary.totalVolumeKg / 1000).toFixed(1)} <span className="text-xs font-normal text-slate-500">tun</span>
                </span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-500 block">Streak</span>
                <span className="text-xs font-bold text-slate-700 font-mono-num">
                  {weekSummary.streakWeeks} týdnů
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('workout')}
            className="w-full mt-4 py-2.5 rounded-xl glass-button text-slate-700 text-xs font-semibold transition flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>Tréninkový deník</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 2. Denní příjem kalorií */}
        <div className="glass-panel rounded-3xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-50/90 border border-amber-200/60 flex items-center justify-center text-amber-600 shadow-2xs">
                  <Utensils className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Denní kalorie</h3>
                  <p className="text-[11px] text-slate-500">{nutritionToday.surplusNote}</p>
                </div>
              </div>
              <span className="text-xs font-bold font-mono-num text-slate-600">
                {calPercent}%
              </span>
            </div>

            <div className="flex items-baseline justify-between mb-2">
              <div>
                <span className="text-2xl font-black font-mono-num text-slate-900">
                  {nutritionToday.calories.toLocaleString()}
                </span>
                <span className="text-xs text-slate-500 ml-1.5">/ {nutritionToday.targetCalories} kcal</span>
              </div>
              <span className="text-xs font-semibold text-slate-600 font-mono-num">
                {calRemaining > 0 ? `zbývá ${calRemaining} kcal` : 'Cíl splněn'}
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 bg-slate-200/70 rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-300 shadow-xs"
                style={{ width: `${calPercent}%` }}
              />
            </div>

            {/* Makra */}
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2.5 rounded-2xl glass-subcard text-center">
                <span className="text-[10px] text-slate-500 font-medium block">Bílkoviny</span>
                <span className="text-xs font-bold font-mono-num text-slate-900">
                  {nutritionToday.protein}g
                </span>
                <span className="text-[9px] text-slate-400 block">/ {nutritionToday.targetProtein}g</span>
              </div>

              <div className="p-2.5 rounded-2xl glass-subcard text-center">
                <span className="text-[10px] text-slate-500 font-medium block">Sacharidy</span>
                <span className="text-xs font-bold font-mono-num text-slate-900">
                  {nutritionToday.carbs}g
                </span>
                <span className="text-[9px] text-slate-400 block">/ {nutritionToday.targetCarbs}g</span>
              </div>

              <div className="p-2.5 rounded-2xl glass-subcard text-center">
                <span className="text-[10px] text-slate-500 font-medium block">Tuky</span>
                <span className="text-xs font-bold font-mono-num text-slate-900">
                  {nutritionToday.fats}g
                </span>
                <span className="text-[9px] text-slate-400 block">/ {nutritionToday.targetFats}g</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('nutrition')}
            className="w-full mt-4 py-2.5 rounded-xl glass-button text-slate-700 text-xs font-semibold transition flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>Upravit výživu</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 3. Klíčový 1RM Rekord (Bench Press) */}
        {benchPR && (
          <div className="glass-panel rounded-3xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50/90 border border-emerald-200/60 flex items-center justify-center text-emerald-600 shadow-2xs">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Hlavní 1RM rekord</h3>
                    <p className="text-[11px] text-slate-500">{benchPR.exercise}</p>
                  </div>
                </div>
                
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-lg glass-badge-emerald text-xs font-semibold font-mono-num">
                  <TrendingUp className="w-3.5 h-3.5" />
                  +{benchPR.growthKg} kg (+{benchPR.growthPct}%)
                </span>
              </div>

              <div className="p-3.5 rounded-2xl glass-subcard my-2">
                <div className="text-[11px] text-slate-500 font-medium">Odhad 1RM maxima</div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-black font-mono-num text-slate-900">
                    {benchPR.current1RM}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">kg</span>
                  <span className="text-[11px] text-slate-400 ml-auto">
                    minulý měsíc: {benchPR.lastMonth1RM} kg
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                  <span>Nejlepší série:</span>
                  <strong className="font-mono-num text-slate-800">{benchPR.bestSet}</strong>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('analytics')}
              className="w-full mt-4 py-2.5 rounded-xl glass-button text-slate-700 text-xs font-semibold transition flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>Všechny statistiky</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Další klíčové cviky */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
          Ostatní silové standardy (1RM)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {personalRecords.filter(pr => pr.id !== 'ex_bench').map((pr) => (
            <div 
              key={pr.id}
              className="glass-panel glass-panel-hover rounded-2xl p-4 transition"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-slate-900">{pr.exercise}</span>
                <span className="text-[11px] font-semibold font-mono-num glass-badge-emerald px-2 py-0.5 rounded-md">
                  +{pr.growthKg} kg (+{pr.growthPct}%)
                </span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold font-mono-num text-slate-900">{pr.current1RM}</span>
                <span className="text-xs text-slate-500">kg 1RM</span>
                <span className="text-[11px] text-slate-400 ml-auto">před měsícem {pr.lastMonth1RM} kg</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1 truncate">
                Záznam: {pr.bestSet}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Šablony */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
          Tréninkové šablony
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {WORKOUT_TEMPLATES.map((tpl) => (
            <div
              key={tpl.id}
              className="glass-panel glass-panel-hover rounded-3xl p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-lg glass-badge-blue">
                    {tpl.split}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1 font-mono-num">
                    <Clock className="w-3 h-3" />
                    {tpl.estimatedTime}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-base">
                  {tpl.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {tpl.exercises.length} cviků • pracovní série
                </p>
              </div>

              <button
                onClick={() => onStartTemplate(tpl)}
                className="w-full mt-4 py-2.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-semibold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Začít trénink</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

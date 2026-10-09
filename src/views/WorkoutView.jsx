import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Plus, 
  Trash2, 
  Check, 
  Timer, 
  Clock, 
  Dumbbell, 
  CheckCircle2, 
  Calculator, 
  History,
  Activity
} from 'lucide-react';
import { calculate1RM } from '../utils/formulas';
import ExerciseSelectorModal from '../components/ExerciseSelectorModal';
import PlateCalculatorModal from '../components/PlateCalculatorModal';
import ExerciseAnimationModal from '../components/ExerciseAnimationModal';
import { WORKOUT_TEMPLATES, EXERCISE_LIBRARY } from '../data/initialData';

export default function WorkoutView({
  activeWorkout,
  setActiveWorkout,
  onFinishWorkout,
  onCancelWorkout,
  customExercises,
  onAddCustomExercise,
  triggerRestTimer,
  workoutHistory = []
}) {
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [selectedPlateWeight, setSelectedPlateWeight] = useState(null);
  const [selectedAnimationExercise, setSelectedAnimationExercise] = useState(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    let timer = null;
    if (activeWorkout) {
      const startTime = activeWorkout.startTime || Date.now();
      const initialElapsed = Math.floor((Date.now() - startTime) / 1000);
      setElapsedSeconds(initialElapsed > 0 ? initialElapsed : 0);

      timer = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    } else {
      setElapsedSeconds(0);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [activeWorkout]);

  // Pokud není aktivní žádný trénink
  if (!activeWorkout) {
    return (
      <div className="space-y-6 pb-24 max-w-5xl mx-auto px-4 sm:px-6 pt-5 animate-fadeIn">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2">
              <Dumbbell className="w-6 h-6 text-blue-600" />
              <span>Tréninkový deník</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Vyber si šablonu nebo začni prázdný trénink.
            </p>
          </div>

          <button
            onClick={() => {
              setActiveWorkout({
                id: `workout_${Date.now()}`,
                name: 'Volný trénink',
                startTime: Date.now(),
                exercises: []
              });
            }}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Zahájit volný trénink</span>
          </button>
        </div>

        {/* Šablony */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Doporučené šablony
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {WORKOUT_TEMPLATES.map((tpl) => (
              <div
                key={tpl.id}
                className="glass-panel rounded-2xl p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100">
                      {tpl.split}
                    </span>
                    <span className="text-xs text-slate-400 font-mono-num">{tpl.estimatedTime}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    {tpl.name}
                  </h3>
                  <div className="mt-3 space-y-1.5">
                    {tpl.exercises.map((item, idx) => {
                      const exObj = EXERCISE_LIBRARY.find(e => e.id === item.exerciseId);
                      return (
                        <div key={idx} className="text-xs text-slate-600 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                          <span className="truncate">{exObj?.name || 'Cvik'}</span>
                          <span className="text-slate-400 ml-auto font-mono-num text-[11px]">{item.sets.length} sérií</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <button
                  onClick={() => {
                    const loadedExercises = tpl.exercises.map(item => {
                      const exObj = EXERCISE_LIBRARY.find(e => e.id === item.exerciseId) || { name: 'Cvik', category: 'Ostatní' };
                      return {
                        id: `item_${Date.now()}_${Math.random()}`,
                        exerciseId: item.exerciseId,
                        name: exObj.name,
                        category: exObj.category,
                        restSeconds: exObj.category === 'Nohy' || item.exerciseId === 'ex_deadlift' || item.exerciseId === 'ex_bench' ? 180 : 90,
                        sets: item.sets.map((s, sIdx) => ({
                          id: `set_${Date.now()}_${sIdx}`,
                          type: 'N',
                          prev: `${s.weight} kg × ${s.reps}`,
                          weight: s.weight,
                          reps: s.reps,
                          rpe: s.rpe || 8.5,
                          completed: false
                        }))
                      };
                    });

                    setActiveWorkout({
                      id: `workout_${Date.now()}`,
                      name: tpl.name,
                      startTime: Date.now(),
                      exercises: loadedExercises
                    });
                  }}
                  className="w-full mt-5 py-2.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-semibold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Spustit šablonu</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Historie tréninků */}
        {workoutHistory.length > 0 && (
          <div className="space-y-3 pt-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <History className="w-4 h-4 text-slate-400" />
              <span>Historie tréninků</span>
            </h2>
            <div className="space-y-2">
              {workoutHistory.map((h) => (
                <div key={h.id} className="glass-panel rounded-xl p-3.5 flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm">{h.workoutName}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {h.date} • {h.durationFormatted} • {h.totalSets} sérií
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold font-mono-num text-blue-600 text-sm">
                      {Math.round(h.totalVolume).toLocaleString()} kg
                    </span>
                    <span className="block text-[10px] text-slate-400">objem</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- AKTIVNÍ TRÉNINK ---
  let liveCompletedSets = 0;
  let liveTotalSets = 0;
  let liveTotalVolume = 0;

  activeWorkout.exercises.forEach(ex => {
    ex.sets.forEach(s => {
      liveTotalSets++;
      if (s.completed) {
        liveCompletedSets++;
        liveTotalVolume += (parseFloat(s.weight) || 0) * (parseInt(s.reps, 10) || 0);
      }
    });
  });

  const formatStopwatch = (totalSecs) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleAddExercise = (selectedEx) => {
    const newEx = {
      id: `ex_item_${Date.now()}`,
      exerciseId: selectedEx.id,
      name: selectedEx.name,
      category: selectedEx.category,
      restSeconds: selectedEx.category === 'Nohy' || selectedEx.id.includes('bench') || selectedEx.id.includes('deadlift') ? 180 : 90,
      sets: [
        {
          id: `set_${Date.now()}_1`,
          type: 'N',
          prev: '100 kg × 8',
          weight: 100,
          reps: 8,
          rpe: 8,
          completed: false
        }
      ]
    };

    setActiveWorkout(prev => ({
      ...prev,
      exercises: [...prev.exercises, newEx]
    }));
  };

  const handleRemoveExercise = (exId) => {
    setActiveWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.filter(e => e.id !== exId)
    }));
  };

  const handleAddSet = (exId) => {
    setActiveWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.map(ex => {
        if (ex.id !== exId) return ex;
        const lastSet = ex.sets[ex.sets.length - 1];
        const newSet = {
          id: `set_${Date.now()}_${Math.random()}`,
          type: 'N',
          prev: lastSet ? `${lastSet.weight} kg × ${lastSet.reps}` : '—',
          weight: lastSet ? lastSet.weight : 80,
          reps: lastSet ? lastSet.reps : 8,
          rpe: lastSet ? lastSet.rpe : 8,
          completed: false
        };
        return { ...ex, sets: [...ex.sets, newSet] };
      })
    }));
  };

  const handleRemoveSet = (exId, setId) => {
    setActiveWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.map(ex => {
        if (ex.id !== exId) return ex;
        return {
          ...ex,
          sets: ex.sets.filter(s => s.id !== setId)
        };
      })
    }));
  };

  const handleUpdateSet = (exId, setId, field, value) => {
    setActiveWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.map(ex => {
        if (ex.id !== exId) return ex;
        return {
          ...ex,
          sets: ex.sets.map(s => {
            if (s.id !== setId) return s;
            return { ...s, [field]: value };
          })
        };
      })
    }));
  };

  const handleToggleComplete = (ex, s, sIdx) => {
    const nextCompleted = !s.completed;
    handleUpdateSet(ex.id, s.id, 'completed', nextCompleted);

    if (nextCompleted) {
      triggerRestTimer({
        duration: ex.restSeconds || 90,
        exerciseName: ex.name,
        setNumber: sIdx + 1
      });
    }
  };

  return (
    <div className="space-y-6 pb-28 max-w-4xl mx-auto px-3 sm:px-6 pt-3 animate-fadeIn">
      {/* Sticky Header Bar */}
      <div className="sticky top-16 z-30 p-3 sm:p-4 rounded-2xl glass-panel shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center justify-between w-full sm:w-auto gap-4">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
            <div>
              <input
                type="text"
                value={activeWorkout.name}
                onChange={(e) => setActiveWorkout(prev => ({ ...prev, name: e.target.value }))}
                className="font-bold text-slate-900 text-sm sm:text-base bg-transparent focus:outline-none focus:border-b border-blue-500 max-w-[200px]"
              />
              <div className="flex items-center gap-2 text-xs text-slate-500 font-mono-num">
                <span className="flex items-center gap-1 text-blue-700 font-semibold">
                  <Clock className="w-3.5 h-3.5" />
                  {formatStopwatch(elapsedSeconds)}
                </span>
                <span>•</span>
                <span>Objem: <strong className="text-slate-800">{Math.round(liveTotalVolume)} kg</strong></span>
                <span>•</span>
                <span>Série: <strong className="text-slate-800">{liveCompletedSets}/{liveTotalSets}</strong></span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={onCancelWorkout}
            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-red-600 text-xs font-semibold transition cursor-pointer"
          >
            Zrušit
          </button>

          <button
            onClick={() => onFinishWorkout(activeWorkout, formatStopwatch(elapsedSeconds), liveTotalVolume, liveCompletedSets)}
            className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Dokončit trénink</span>
          </button>
        </div>
      </div>

      {/* Cviky v tréninku */}
      {activeWorkout.exercises.length === 0 ? (
        <div className="p-8 sm:p-12 text-center rounded-2xl glass-panel my-8">
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
            <Dumbbell className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-base font-bold text-slate-900">V tréninku zatím nemáš žádné cviky</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5">
            Klikni na tlačítko níže a přidej svůj první cvik.
          </p>
          <button
            onClick={() => setShowExerciseModal(true)}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition shadow-xs inline-flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Přidat cvik</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {activeWorkout.exercises.map((ex, exIdx) => (
            <div
              key={ex.id}
              className="rounded-2xl glass-panel overflow-hidden transition-all"
            >
              {/* Exercise Header */}
              <div className="p-4 bg-slate-50/70 border-b border-slate-200/80 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono-num font-bold text-blue-600">
                      #{exIdx + 1}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                      {ex.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                      {ex.category}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Timer className="w-3 h-3 text-slate-400" />
                      Pauza: {ex.restSeconds || 90}s
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setSelectedAnimationExercise(ex)}
                    title="Zobrazit animaci techniky a biomechaniku"
                    className="p-1.5 rounded-lg bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Activity className="w-3.5 h-3.5 text-blue-600" />
                    <span className="hidden sm:inline">Technika</span>
                  </button>

                  <button
                    onClick={() => {
                      const newRest = ex.restSeconds === 90 ? 120 : ex.restSeconds === 120 ? 180 : 90;
                      setActiveWorkout(prev => ({
                        ...prev,
                        exercises: prev.exercises.map(e => e.id === ex.id ? { ...e, restSeconds: newRest } : e)
                      }));
                    }}
                    title="Změnit pauzu"
                    className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-mono-num flex items-center gap-1 cursor-pointer"
                  >
                    <Timer className="w-3.5 h-3.5 text-blue-600" />
                    <span>{ex.restSeconds || 90}s</span>
                  </button>

                  <button
                    onClick={() => handleRemoveExercise(ex.id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-600 text-slate-400 transition cursor-pointer"
                    title="Odstranit cvik"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Table of Sets */}
              <div className="p-3 sm:p-4">
                <div className="grid grid-cols-12 gap-1.5 sm:gap-2 px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  <span className="col-span-1 text-center">Set</span>
                  <span className="col-span-2 hidden sm:block text-center">Předchozí</span>
                  <span className="col-span-4 sm:col-span-3 text-center">Kg</span>
                  <span className="col-span-3 sm:col-span-2 text-center">Reps</span>
                  <span className="col-span-2 hidden sm:block text-center">RPE</span>
                  <span className="col-span-4 sm:col-span-2 text-center">Stav</span>
                </div>

                <div className="space-y-1.5 mt-1">
                  {ex.sets.map((s, sIdx) => (
                    <div
                      key={s.id}
                      className={`grid grid-cols-12 gap-1.5 sm:gap-2 items-center p-2 rounded-xl transition-all ${
                        s.completed
                          ? 'bg-blue-50/90 border border-blue-200 shadow-2xs'
                          : 'glass-subcard hover:bg-white/75'
                      }`}
                    >
                      {/* Set Number */}
                      <div className="col-span-1 text-center">
                        <span className={`w-5 h-5 rounded-md inline-flex items-center justify-center text-xs font-bold font-mono-num ${
                          s.completed ? 'bg-blue-600 text-white shadow-2xs' : 'bg-slate-200/80 text-slate-700'
                        }`}>
                          {sIdx + 1}
                        </span>
                      </div>

                      {/* Prev */}
                      <div className="col-span-2 hidden sm:block text-center text-xs font-mono-num text-slate-400 truncate">
                        {s.prev || '—'}
                      </div>

                      {/* Kg */}
                      <div className="col-span-4 sm:col-span-3 flex items-center justify-center gap-1">
                        <input
                          type="number"
                          step="0.5"
                          value={s.weight}
                          onChange={(e) => handleUpdateSet(ex.id, s.id, 'weight', e.target.value)}
                          className="w-16 sm:w-20 glass-input rounded-lg py-1 px-1.5 text-center font-mono-num font-bold text-slate-900 text-sm focus:outline-none"
                        />
                        <button
                          onClick={() => setSelectedPlateWeight(parseFloat(s.weight) || 100)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-white/80 transition cursor-pointer"
                          title="Spočítat kotouče"
                        >
                          <Calculator className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Reps */}
                      <div className="col-span-3 sm:col-span-2 flex items-center justify-center">
                        <input
                          type="number"
                          value={s.reps}
                          onChange={(e) => handleUpdateSet(ex.id, s.id, 'reps', e.target.value)}
                          className="w-14 sm:w-16 glass-input rounded-lg py-1 px-1.5 text-center font-mono-num font-bold text-slate-900 text-sm focus:outline-none"
                        />
                      </div>

                      {/* RPE */}
                      <div className="col-span-2 hidden sm:flex items-center justify-center">
                        <select
                          value={s.rpe || 8}
                          onChange={(e) => handleUpdateSet(ex.id, s.id, 'rpe', parseFloat(e.target.value))}
                          className="glass-input rounded-lg py-1 px-1.5 text-xs font-mono-num text-slate-700 focus:outline-none cursor-pointer"
                        >
                          {[6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10].map(val => (
                            <option key={val} value={val}>@{val}</option>
                          ))}
                        </select>
                      </div>

                      {/* Checkbox */}
                      <div className="col-span-4 sm:col-span-2 flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleToggleComplete(ex, s, sIdx)}
                          className={`flex-1 max-w-[75px] py-1.5 rounded-lg font-semibold text-xs flex items-center justify-center gap-1 transition cursor-pointer ${
                            s.completed
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200'
                          }`}
                        >
                          <Check className={`w-3.5 h-3.5 ${s.completed ? 'text-white' : 'text-slate-400'}`} />
                          <span className="text-[11px]">{s.completed ? 'Hotovo' : 'Splnit'}</span>
                        </button>

                        {ex.sets.length > 1 && (
                          <button
                            onClick={() => handleRemoveSet(ex.id, s.id)}
                            className="p-1 text-slate-300 hover:text-red-500 transition cursor-pointer"
                            title="Smazat sérii"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-200/80">
                  <button
                    onClick={() => handleAddSet(ex.id)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-blue-600 text-xs font-semibold transition flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Přidat sérii</span>
                  </button>

                  <span className="text-[11px] text-slate-400 font-mono-num">
                    {ex.sets.filter(s => s.completed).length} z {ex.sets.length} sérií
                  </span>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={() => setShowExerciseModal(true)}
            className="w-full py-3.5 rounded-2xl border border-dashed border-slate-300 hover:border-blue-400 bg-white/60 hover:bg-white text-slate-600 hover:text-blue-600 font-semibold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Přidat další cvik</span>
          </button>
        </div>
      )}

      <ExerciseSelectorModal
        isOpen={showExerciseModal}
        onClose={() => setShowExerciseModal(false)}
        onSelectExercise={handleAddExercise}
        customExercises={customExercises}
        onAddCustomExercise={onAddCustomExercise}
      />

      <PlateCalculatorModal
        initialWeight={selectedPlateWeight || 100}
        isOpen={selectedPlateWeight !== null}
        onClose={() => setSelectedPlateWeight(null)}
      />

      <ExerciseAnimationModal
        exercise={selectedAnimationExercise}
        isOpen={selectedAnimationExercise !== null}
        onClose={() => setSelectedAnimationExercise(null)}
      />
    </div>
  );
}

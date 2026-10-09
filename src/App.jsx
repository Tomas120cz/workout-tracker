import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import DashboardView from './views/DashboardView';
import WorkoutView from './views/WorkoutView';
import NutritionView from './views/NutritionView';
import AnalyticsView from './views/AnalyticsView';
import RestTimerFloating from './components/RestTimerFloating';
import PlateCalculatorModal from './components/PlateCalculatorModal';
import WorkoutSummaryModal from './components/WorkoutSummaryModal';

import { 
  INITIAL_USER_PROFILE, 
  INITIAL_PERSONAL_RECORDS, 
  INITIAL_NUTRITION_TODAY, 
  INITIAL_WEIGHT_HISTORY,
  INITIAL_WEEK_SUMMARY,
  WORKOUT_TEMPLATES,
  EXERCISE_LIBRARY
} from './data/initialData';
import { getStorageItem, setStorageItem, clearStorageData } from './utils/storage';
import { calculate1RM } from './utils/formulas';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const [userProfile, setUserProfile] = useState(() => 
    getStorageItem('liftoff_profile', INITIAL_USER_PROFILE)
  );

  const [personalRecords, setPersonalRecords] = useState(() => 
    getStorageItem('liftoff_prs', INITIAL_PERSONAL_RECORDS)
  );

  const [nutritionToday, setNutritionToday] = useState(() => 
    getStorageItem('liftoff_nutrition', INITIAL_NUTRITION_TODAY)
  );

  const [weightHistory, setWeightHistory] = useState(() => 
    getStorageItem('liftoff_weight_history', INITIAL_WEIGHT_HISTORY)
  );

  const [weekSummary, setWeekSummary] = useState(() => 
    getStorageItem('liftoff_week_summary', INITIAL_WEEK_SUMMARY)
  );

  const [workoutHistory, setWorkoutHistory] = useState(() => 
    getStorageItem('liftoff_workout_history', [
      {
        id: 'h_1',
        workoutName: 'Upper Hypertrophy (Včera)',
        date: '08.10.2026',
        durationFormatted: '58 min',
        totalVolume: 16400,
        totalSets: 18,
      },
      {
        id: 'h_2',
        workoutName: 'Legs & Core (Předevčírem)',
        date: '06.10.2026',
        durationFormatted: '72 min',
        totalVolume: 19800,
        totalSets: 20,
      }
    ])
  );

  const [customExercises, setCustomExercises] = useState(() => 
    getStorageItem('liftoff_custom_exercises', [])
  );

  const [activeWorkout, setActiveWorkout] = useState(() => 
    getStorageItem('liftoff_active_workout', null)
  );

  const [timerState, setTimerState] = useState({
    active: false,
    timeLeft: 0,
    totalDuration: 0,
    exerciseName: '',
    setNumber: 0,
    finishedJustNow: false
  });

  const [isPlateModalOpen, setIsPlateModalOpen] = useState(false);
  const [plateModalWeight, setPlateModalWeight] = useState(100);
  const [workoutSummary, setWorkoutSummary] = useState(null);

  useEffect(() => { setStorageItem('liftoff_profile', userProfile); }, [userProfile]);
  useEffect(() => { setStorageItem('liftoff_prs', personalRecords); }, [personalRecords]);
  useEffect(() => { setStorageItem('liftoff_nutrition', nutritionToday); }, [nutritionToday]);
  useEffect(() => { setStorageItem('liftoff_weight_history', weightHistory); }, [weightHistory]);
  useEffect(() => { setStorageItem('liftoff_week_summary', weekSummary); }, [weekSummary]);
  useEffect(() => { setStorageItem('liftoff_workout_history', workoutHistory); }, [workoutHistory]);
  useEffect(() => { setStorageItem('liftoff_custom_exercises', customExercises); }, [customExercises]);
  useEffect(() => { setStorageItem('liftoff_active_workout', activeWorkout); }, [activeWorkout]);

  const handleStartTemplate = (tpl) => {
    const loadedExercises = tpl.exercises.map(item => {
      const exObj = EXERCISE_LIBRARY.find(e => e.id === item.exerciseId) || { name: 'Cvik', category: 'Ostatní' };
      return {
        id: `item_${Date.now()}_${Math.random()}`,
        exerciseId: item.exerciseId,
        name: exObj.name,
        category: exObj.category,
        restSeconds: exObj.category === 'Nohy' || item.exerciseId === 'ex_bench' || item.exerciseId === 'ex_deadlift' ? 180 : 90,
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
    setActiveTab('workout');
  };

  const handleStartEmptyWorkout = () => {
    setActiveWorkout({
      id: `workout_${Date.now()}`,
      name: 'Volný trénink',
      startTime: Date.now(),
      exercises: []
    });
    setActiveTab('workout');
  };

  const triggerRestTimer = ({ duration, exerciseName, setNumber }) => {
    setTimerState({
      active: true,
      timeLeft: duration || 90,
      totalDuration: duration || 90,
      exerciseName: exerciseName || 'Odpočinek',
      setNumber: setNumber || 1,
      finishedJustNow: false
    });
  };

  const handleFinishWorkout = (workout, durationFormatted, totalVolume, completedSetsCount) => {
    const detectedPRs = [];

    workout.exercises.forEach(ex => {
      ex.sets.forEach(s => {
        if (s.completed) {
          const calc1RM = calculate1RM(s.weight, s.reps);
          const existingPR = personalRecords.find(p => p.id === ex.exerciseId);

          if (existingPR && calc1RM > existingPR.current1RM) {
            detectedPRs.push({
              exercise: ex.name,
              weight: s.weight,
              reps: s.reps,
              calc1RM
            });
            setPersonalRecords(prev => prev.map(p => {
              if (p.id === ex.exerciseId) {
                const growth = Math.round((calc1RM - p.current1RM) * 10) / 10;
                const growthPct = Math.round((growth / p.current1RM) * 1000) / 10;
                return {
                  ...p,
                  current1RM: calc1RM,
                  growthKg: growth,
                  growthPct: growthPct,
                  bestSet: `${s.weight} kg × ${s.reps} reps`,
                  dateAchieved: new Date().toISOString().split('T')[0]
                };
              }
              return p;
            }));
          }
        }
      });
    });

    setWorkoutSummary({
      workoutName: workout.name,
      durationFormatted,
      totalVolume,
      totalSets: completedSetsCount,
      personalRecords: detectedPRs,
      savedWorkout: {
        id: workout.id,
        workoutName: workout.name,
        date: new Date().toLocaleDateString('cs-CZ', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        durationFormatted,
        totalVolume,
        totalSets: completedSetsCount
      }
    });
  };

  const handleSaveAndExitSummary = () => {
    if (workoutSummary?.savedWorkout) {
      setWorkoutHistory(prev => [workoutSummary.savedWorkout, ...prev]);
      setWeekSummary(prev => ({
        ...prev,
        workoutsDone: Math.min(prev.workoutsTarget, prev.workoutsDone + 1),
        totalVolumeKg: prev.totalVolumeKg + (workoutSummary.totalVolume || 0)
      }));
    }

    setActiveWorkout(null);
    setTimerState({
      active: false,
      timeLeft: 0,
      totalDuration: 0,
      exerciseName: '',
      setNumber: 0,
      finishedJustNow: false
    });
    setWorkoutSummary(null);
    setActiveTab('dashboard');
  };

  const handleCancelWorkout = () => {
    if (window.confirm('Opravdu chceš zrušit probíhající trénink? Data nebudou uložena.')) {
      setActiveWorkout(null);
      setTimerState({
        active: false,
        timeLeft: 0,
        totalDuration: 0,
        exerciseName: '',
        setNumber: 0,
        finishedJustNow: false
      });
    }
  };

  const handleResetToDemoData = () => {
    if (window.confirm('Obnovit výchozí data?')) {
      clearStorageData();
      setUserProfile(INITIAL_USER_PROFILE);
      setPersonalRecords(INITIAL_PERSONAL_RECORDS);
      setNutritionToday(INITIAL_NUTRITION_TODAY);
      setWeightHistory(INITIAL_WEIGHT_HISTORY);
      setWeekSummary(INITIAL_WEEK_SUMMARY);
      setActiveWorkout(null);
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-800 flex flex-col font-sans selection:bg-blue-500/20 selection:text-blue-700 relative overflow-x-hidden">
      {/* Ambient Glassmorphism Gradient Light Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blue-400/25 blur-[100px]" />
        <div className="absolute top-1/3 -right-20 w-[450px] h-[450px] rounded-full bg-sky-300/30 blur-[120px]" />
        <div className="absolute bottom-20 left-1/4 w-[500px] h-[500px] rounded-full bg-indigo-300/20 blur-[120px]" />
        <div className="absolute -bottom-20 right-10 w-80 h-80 rounded-full bg-cyan-300/25 blur-[90px]" />
      </div>

      {/* Navigation */}
      <div className="relative z-40">
        <Navigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isWorkoutActive={!!activeWorkout}
          onOpenPlateCalculator={() => {
            setPlateModalWeight(100);
            setIsPlateModalOpen(true);
          }}
        />
      </div>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto relative z-10">
        {activeTab === 'dashboard' && (
          <DashboardView
            userProfile={userProfile}
            weekSummary={weekSummary}
            nutritionToday={nutritionToday}
            personalRecords={personalRecords}
            onStartTemplate={handleStartTemplate}
            onStartEmptyWorkout={handleStartEmptyWorkout}
            setActiveTab={setActiveTab}
            onOpenPlateCalculator={() => {
              setPlateModalWeight(100);
              setIsPlateModalOpen(true);
            }}
          />
        )}

        {activeTab === 'workout' && (
          <WorkoutView
            activeWorkout={activeWorkout}
            setActiveWorkout={setActiveWorkout}
            onFinishWorkout={handleFinishWorkout}
            onCancelWorkout={handleCancelWorkout}
            customExercises={customExercises}
            onAddCustomExercise={(newEx) => setCustomExercises(prev => [...prev, newEx])}
            triggerRestTimer={triggerRestTimer}
            onOpenPlateCalculatorWithWeight={(w) => {
              setPlateModalWeight(w);
              setIsPlateModalOpen(true);
            }}
            workoutHistory={workoutHistory}
          />
        )}

        {activeTab === 'nutrition' && (
          <NutritionView
            nutritionToday={nutritionToday}
            setNutritionToday={setNutritionToday}
            weightHistory={weightHistory}
            setWeightHistory={setWeightHistory}
            userProfile={userProfile}
            setUserProfile={setUserProfile}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView
            personalRecords={personalRecords}
            userProfile={userProfile}
          />
        )}
      </main>

      {/* Floating Rest Timer */}
      <RestTimerFloating
        timerState={timerState}
        setTimerState={setTimerState}
      />

      {/* Plate Calculator */}
      <PlateCalculatorModal
        initialWeight={plateModalWeight}
        isOpen={isPlateModalOpen}
        onClose={() => setIsPlateModalOpen(false)}
      />

      {/* Summary Modal */}
      <WorkoutSummaryModal
        summary={workoutSummary}
        isOpen={workoutSummary !== null}
        onClose={() => setWorkoutSummary(null)}
        onSaveAndExit={handleSaveAndExitSummary}
      />

      {/* Footer */}
      <footer className="hidden sm:block py-4 border-t border-slate-200/80 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <span>LIFTOFF — Minimalist Strength & Hypertrophy Tracker</span>
          <button
            onClick={handleResetToDemoData}
            className="hover:text-slate-600 underline transition cursor-pointer text-[11px]"
          >
            Obnovit výchozí data
          </button>
        </div>
      </footer>
    </div>
  );
}

import React, { useState } from 'react';
import { 
  Utensils, 
  Scale, 
  Calculator, 
  Plus, 
  Trash2, 
  Check, 
  TrendingUp
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { calculateMacros } from '../utils/formulas';

export default function NutritionView({
  nutritionToday,
  setNutritionToday,
  weightHistory,
  setWeightHistory,
  userProfile,
  setUserProfile
}) {
  const [calcWeight, setCalcWeight] = useState(userProfile.currentWeight || 84.8);
  const [calcHeight, setCalcHeight] = useState(userProfile.height || 182);
  const [calcAge, setCalcAge] = useState(userProfile.age || 26);
  const [calcActivity, setCalcActivity] = useState(1.55);
  const [calcPhase, setCalcPhase] = useState('lean_bulk');
  const [calcSuccessBanner, setCalcSuccessBanner] = useState(false);

  const [showMealForm, setShowMealForm] = useState(false);
  const [mealName, setMealName] = useState('');
  const [mealCalories, setMealCalories] = useState('');
  const [mealProtein, setMealProtein] = useState('');
  const [mealCarbs, setMealCarbs] = useState('');
  const [mealFats, setMealFats] = useState('');

  const [inputWeight, setInputWeight] = useState(userProfile.currentWeight || 84.8);
  const [weightLoggedSuccess, setWeightLoggedSuccess] = useState(false);

  const calculated = calculateMacros({
    weight: calcWeight,
    height: calcHeight,
    age: calcAge,
    activityMultiplier: calcActivity,
    surplusMode: calcPhase
  });

  const applyMacroTarget = () => {
    const phaseLabel = calcPhase === 'lean_bulk' 
      ? 'Objem (+300 kcal)' 
      : calcPhase === 'aggressive_bulk' 
        ? 'Agresivní objem (+500 kcal)' 
        : 'Udržování (0 kcal)';

    const surplusText = calcPhase === 'lean_bulk'
      ? '+300 kcal pro hypertrofii'
      : calcPhase === 'aggressive_bulk'
        ? '+500 kcal kalorický přebytek'
        : 'Udržovací fáze';

    setUserProfile(prev => ({
      ...prev,
      currentWeight: calcWeight,
      height: calcHeight,
      age: calcAge,
      currentPhase: phaseLabel,
      calorieTarget: calculated.targetCalories,
      proteinTarget: calculated.proteinGrams,
      carbsTarget: calculated.carbsGrams,
      fatsTarget: calculated.fatsGrams,
    }));

    setNutritionToday(prev => ({
      ...prev,
      targetCalories: calculated.targetCalories,
      targetProtein: calculated.proteinGrams,
      targetCarbs: calculated.carbsGrams,
      targetFats: calculated.fatsGrams,
      surplusNote: surplusText
    }));

    setCalcSuccessBanner(true);
    setTimeout(() => setCalcSuccessBanner(false), 2500);
  };

  const handleAddMeal = (e) => {
    e.preventDefault();
    const cals = parseInt(mealCalories, 10) || 0;
    const prot = parseInt(mealProtein, 10) || 0;
    const carb = parseInt(mealCarbs, 10) || 0;
    const fat = parseInt(mealFats, 10) || 0;

    const newMeal = {
      id: `meal_${Date.now()}`,
      name: mealName.trim() || 'Jídlo',
      calories: cals,
      protein: prot,
      carbs: carb,
      fats: fat,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setNutritionToday(prev => ({
      ...prev,
      calories: prev.calories + cals,
      protein: prev.protein + prot,
      carbs: prev.carbs + carb,
      fats: prev.fats + fat,
      meals: [newMeal, ...prev.meals]
    }));

    setMealName('');
    setMealCalories('');
    setMealProtein('');
    setMealCarbs('');
    setMealFats('');
    setShowMealForm(false);
  };

  const handleDeleteMeal = (mealId) => {
    const meal = nutritionToday.meals.find(m => m.id === mealId);
    if (!meal) return;

    setNutritionToday(prev => ({
      ...prev,
      calories: Math.max(0, prev.calories - meal.calories),
      protein: Math.max(0, prev.protein - meal.protein),
      carbs: Math.max(0, prev.carbs - meal.carbs),
      fats: Math.max(0, prev.fats - meal.fats),
      meals: prev.meals.filter(m => m.id !== mealId)
    }));
  };

  const handleLogWeight = (e) => {
    e.preventDefault();
    const val = parseFloat(inputWeight) || 0;
    if (val <= 0) return;

    const todayStr = new Date().toLocaleDateString('cs-CZ', { day: '2-digit', month: '2-digit' });
    const lastWeights = weightHistory.slice(-4).map(w => w.weight);
    lastWeights.push(val);
    const avg = Math.round((lastWeights.reduce((a, b) => a + b, 0) / lastWeights.length) * 10) / 10;

    const newEntry = {
      date: todayStr,
      weight: val,
      movingAvg: avg
    };

    setWeightHistory(prev => [...prev, newEntry]);
    setUserProfile(prev => ({ ...prev, currentWeight: val }));
    setWeightLoggedSuccess(true);
    setTimeout(() => setWeightLoggedSuccess(false), 2000);
  };

  const startWeight = weightHistory.length > 0 ? weightHistory[0].weight : 83.2;
  const currentWeight = weightHistory.length > 0 ? weightHistory[weightHistory.length - 1].weight : 84.8;
  const totalWeightGain = Math.round((currentWeight - startWeight) * 10) / 10;

  return (
    <div className="space-y-6 pb-28 max-w-7xl mx-auto px-4 sm:px-6 pt-5 animate-fadeIn">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2">
          <Utensils className="w-6 h-6 text-blue-600" />
          <span>Výživa a Tělo</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Kalkulace makroživin pro svalový růst a sledování váhy.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEVÝ SLOUPEC: Dnešní příjem & Tělesná váha */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* 1. Dnešní příjem */}
          <div className="glass-panel rounded-2xl p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                  {nutritionToday.surplusNote}
                </span>
                <h2 className="text-base font-bold text-slate-900 mt-1">Dnešní příjem</h2>
              </div>
              <button
                onClick={() => setShowMealForm(!showMealForm)}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Přidat jídlo</span>
              </button>
            </div>

            {/* Kalorický box */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 mb-4">
              <div className="flex justify-between items-baseline mb-1.5">
                <span className="text-xs text-slate-500 font-medium">
                  Kalorie
                </span>
                <span className="text-xs font-bold font-mono-num text-slate-700">
                  {Math.round((nutritionToday.calories / nutritionToday.targetCalories) * 100)}%
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black font-mono-num text-slate-900">
                  {nutritionToday.calories.toLocaleString()}
                </span>
                <span className="text-slate-400 text-xs font-medium">/ {nutritionToday.targetCalories} kcal</span>
                <span className="ml-auto text-xs font-semibold text-blue-600">
                  Zbývá: {Math.max(0, nutritionToday.targetCalories - nutritionToday.calories)} kcal
                </span>
              </div>

              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mt-3">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (nutritionToday.calories / nutritionToday.targetCalories) * 100)}%` }}
                />
              </div>
            </div>

            {/* Makra */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-left">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-semibold text-slate-700">Bílkoviny</span>
                  <span className="text-[10px] text-slate-400 font-mono-num">
                    {Math.round((nutritionToday.protein / nutritionToday.targetProtein) * 100)}%
                  </span>
                </div>
                <div className="text-lg font-bold font-mono-num text-slate-900">
                  {nutritionToday.protein} <span className="text-xs text-slate-400 font-normal">/ {nutritionToday.targetProtein}g</span>
                </div>
                <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden mt-2">
                  <div 
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${Math.min(100, (nutritionToday.protein / nutritionToday.targetProtein) * 100)}%` }}
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-left">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-semibold text-slate-700">Sacharidy</span>
                  <span className="text-[10px] text-slate-400 font-mono-num">
                    {Math.round((nutritionToday.carbs / nutritionToday.targetCarbs) * 100)}%
                  </span>
                </div>
                <div className="text-lg font-bold font-mono-num text-slate-900">
                  {nutritionToday.carbs} <span className="text-xs text-slate-400 font-normal">/ {nutritionToday.targetCarbs}g</span>
                </div>
                <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden mt-2">
                  <div 
                    className="h-full bg-sky-500 rounded-full"
                    style={{ width: `${Math.min(100, (nutritionToday.carbs / nutritionToday.targetCarbs) * 100)}%` }}
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-left">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-semibold text-slate-700">Tuky</span>
                  <span className="text-[10px] text-slate-400 font-mono-num">
                    {Math.round((nutritionToday.fats / nutritionToday.targetFats) * 100)}%
                  </span>
                </div>
                <div className="text-lg font-bold font-mono-num text-slate-900">
                  {nutritionToday.fats} <span className="text-xs text-slate-400 font-normal">/ {nutritionToday.targetFats}g</span>
                </div>
                <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden mt-2">
                  <div 
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${Math.min(100, (nutritionToday.fats / nutritionToday.targetFats) * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Form na jídlo */}
            {showMealForm && (
              <form onSubmit={handleAddMeal} className="mt-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 animate-fadeIn">
                <h4 className="font-semibold text-xs text-slate-800">Přidat položku</h4>
                <input
                  type="text"
                  placeholder="Název jídla..."
                  value={mealName}
                  onChange={(e) => setMealName(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                  required
                />
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-500 block mb-0.5">Kcal</label>
                    <input
                      type="number"
                      placeholder="kcal"
                      value={mealCalories}
                      onChange={(e) => setMealCalories(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-900 font-mono-num focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 block mb-0.5">Bílkoviny (g)</label>
                    <input
                      type="number"
                      placeholder="g"
                      value={mealProtein}
                      onChange={(e) => setMealProtein(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-900 font-mono-num focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 block mb-0.5">Sacharidy (g)</label>
                    <input
                      type="number"
                      placeholder="g"
                      value={mealCarbs}
                      onChange={(e) => setMealCarbs(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-900 font-mono-num focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 block mb-0.5">Tuky (g)</label>
                    <input
                      type="number"
                      placeholder="g"
                      value={mealFats}
                      onChange={(e) => setMealFats(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-900 font-mono-num focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="submit"
                    className="flex-1 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition cursor-pointer"
                  >
                    Uložit
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowMealForm(false)}
                    className="px-3 py-1.5 rounded-lg bg-slate-200 text-slate-600 text-xs font-semibold cursor-pointer"
                  >
                    Zrušit
                  </button>
                </div>
              </form>
            )}

            {/* Seznam jídel */}
            <div className="mt-4 space-y-1.5">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Zapsaná jídla ({nutritionToday.meals.length})
              </span>
              {nutritionToday.meals.map((meal) => (
                <div
                  key={meal.id}
                  className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/90 flex items-center justify-between"
                >
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-900 truncate">{meal.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono-num">{meal.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono-num mt-0.5">
                      <span className="text-slate-800 font-bold">{meal.calories} kcal</span>
                      <span>•</span>
                      <span>{meal.protein}g B</span>
                      <span>•</span>
                      <span>{meal.carbs}g S</span>
                      <span>•</span>
                      <span>{meal.fats}g T</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteMeal(meal.id)}
                    className="p-1 rounded text-slate-400 hover:text-red-500 transition cursor-pointer"
                    title="Odstranit"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Záznam tělesné váhy & graf */}
          <div className="glass-panel rounded-2xl p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                  <Scale className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Vývoj váhy</h3>
                  <p className="text-xs text-slate-500">Změna: +{totalWeightGain} kg za měsíc</p>
                </div>
              </div>

              <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 font-mono-num">
                +0.35 kg / týden
              </span>
            </div>

            <form onSubmit={handleLogWeight} className="flex items-center gap-2 mb-4 p-2 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-600 font-medium px-1">Ranní váha:</span>
              <input
                type="number"
                step="0.1"
                value={inputWeight}
                onChange={(e) => setInputWeight(e.target.value)}
                className="w-18 bg-white border border-slate-200 rounded-lg px-2 py-1 text-center font-mono-num font-bold text-slate-900 text-xs focus:outline-none focus:border-blue-500"
              />
              <span className="text-xs text-slate-500">kg</span>
              <button
                type="submit"
                className="ml-auto px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition cursor-pointer"
              >
                Uložit
              </button>
            </form>

            {weightLoggedSuccess && (
              <div className="p-2 mb-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-1.5 animate-fadeIn">
                <Check className="w-3.5 h-3.5" /> Váha uložena
              </div>
            )}

            <div className="h-52 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weightHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis 
                    stroke="#94a3b8" 
                    fontSize={11} 
                    domain={['dataMin - 0.5', 'dataMax + 0.5']}
                    tickLine={false}
                    tickFormatter={(val) => `${val}kg`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#ffffff', 
                      borderColor: '#cbd5e1', 
                      borderRadius: '8px',
                      color: '#0f172a',
                      fontSize: '12px',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                    }}
                    formatter={(val, name) => [`${val} kg`, name === 'weight' ? 'Váha' : '7-denní trend']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="#2563eb" 
                    strokeWidth={2} 
                    dot={{ fill: '#2563eb', r: 3 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="movingAvg" 
                    stroke="#059669" 
                    strokeWidth={1.5} 
                    strokeDasharray="3 3"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* PRAVÝ SLOUPEC: Kalkulačka maker */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel rounded-2xl p-5 sm:p-6">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                <Calculator className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">Kalkulačka maker</h3>
                <p className="text-xs text-slate-500">Mifflin-St Jeor výpočet</p>
              </div>
            </div>

            {calcSuccessBanner && (
              <div className="p-2.5 mb-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-1.5 animate-fadeIn">
                <Check className="w-3.5 h-3.5" />
                Nový cíl byl uložen.
              </div>
            )}

            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] font-semibold text-slate-600 block mb-0.5">Váha (kg)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={calcWeight}
                    onChange={(e) => setCalcWeight(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-900 font-mono-num font-bold focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-600 block mb-0.5">Výška (cm)</label>
                  <input
                    type="number"
                    value={calcHeight}
                    onChange={(e) => setCalcHeight(parseInt(e.target.value, 10) || 0)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-900 font-mono-num font-bold focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-600 block mb-0.5">Věk</label>
                  <input
                    type="number"
                    value={calcAge}
                    onChange={(e) => setCalcAge(parseInt(e.target.value, 10) || 0)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-900 font-mono-num font-bold focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-600 block mb-0.5">Aktivita</label>
                <select
                  value={calcActivity}
                  onChange={(e) => setCalcActivity(parseFloat(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value={1.375}>Lehká (1-3 tréninky)</option>
                  <option value={1.55}>Střední (4-5 tréninků)</option>
                  <option value={1.725}>Vysoká (6 tréninků)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-600 block mb-1">Cíl</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'lean_bulk', label: 'Lean Bulk', delta: '+300 kcal' },
                    { id: 'aggressive_bulk', label: 'Objem', delta: '+500 kcal' },
                    { id: 'maintenance', label: 'Udržování', delta: '0 kcal' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setCalcPhase(p.id)}
                      className={`py-1.5 px-1 rounded-lg text-center border transition cursor-pointer ${
                        calcPhase === p.id
                          ? 'bg-blue-50 border-blue-300 text-blue-700 font-semibold'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-xs block">{p.label}</span>
                      <span className="text-[9px] text-slate-400 font-mono-num">{p.delta}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Vypočtené hodnoty */}
            <div className="mt-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">TDEE výdej:</span>
                <span className="font-mono-num font-semibold text-slate-800">{calculated.tdee} kcal</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Přebytek:</span>
                <span className="font-mono-num font-semibold text-blue-700">+{calculated.surplus} kcal</span>
              </div>
              
              <div className="pt-2 border-t border-slate-200 flex items-baseline justify-between">
                <span className="text-xs font-semibold text-slate-700">Doporučený cíl</span>
                <span className="text-xl font-black font-mono-num text-slate-900">
                  {calculated.targetCalories} <span className="text-xs text-slate-400 font-normal">kcal/den</span>
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2">
                <div className="p-2 rounded-lg bg-white border border-slate-200 text-center">
                  <span className="text-[9px] text-slate-500 font-medium block">Bílkoviny</span>
                  <span className="text-xs font-bold font-mono-num text-slate-900">{calculated.proteinGrams}g</span>
                </div>
                <div className="p-2 rounded-lg bg-white border border-slate-200 text-center">
                  <span className="text-[9px] text-slate-500 font-medium block">Sacharidy</span>
                  <span className="text-xs font-bold font-mono-num text-slate-900">{calculated.carbsGrams}g</span>
                </div>
                <div className="p-2 rounded-lg bg-white border border-slate-200 text-center">
                  <span className="text-[9px] text-slate-500 font-medium block">Tuky</span>
                  <span className="text-xs font-bold font-mono-num text-slate-900">{calculated.fatsGrams}g</span>
                </div>
              </div>
            </div>

            <button
              onClick={applyMacroTarget}
              className="w-full mt-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition cursor-pointer shadow-2xs"
            >
              Uložit jako denní cíl
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

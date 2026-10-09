import React, { useState } from 'react';
import { X, Search, Plus, Dumbbell, Activity } from 'lucide-react';
import { EXERCISE_LIBRARY } from '../data/initialData';
import ExerciseAnimationModal from './ExerciseAnimationModal';

export default function ExerciseSelectorModal({ 
  isOpen, 
  onClose, 
  onSelectExercise,
  customExercises = [],
  onAddCustomExercise
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Vše');
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customCategory, setCustomCategory] = useState('Hrudník');
  const [previewExercise, setPreviewExercise] = useState(null);

  if (!isOpen) return null;

  const categories = ['Vše', 'Hrudník', 'Záda', 'Nohy', 'Ramena', 'Paže'];
  const allExercises = [...EXERCISE_LIBRARY, ...customExercises];

  const filtered = allExercises.filter(ex => {
    const matchesCategory = selectedCategory === 'Vše' || ex.category === selectedCategory;
    const matchesSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (ex.target && ex.target.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleCreateCustom = (e) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const newEx = {
      id: `custom_${Date.now()}`,
      name: customName.trim(),
      category: customCategory,
      equipment: 'Vlastní',
      target: 'Vlastní cvik'
    };

    onAddCustomExercise(newEx);
    onSelectExercise(newEx);
    setCustomName('');
    setShowAddCustom(false);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
        <div className="bg-white/95 border border-slate-200 rounded-2xl w-full max-w-lg max-h-[85vh] flex flex-col shadow-2xl relative text-slate-800 overflow-hidden backdrop-blur-xl">
          {/* Header */}
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                <Dumbbell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">Přidat cvik</h3>
                <p className="text-xs text-slate-500">Výběr z knihovny s animacemi</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Vyhledávání */}
          <div className="p-3.5 space-y-2.5 border-b border-slate-200 bg-slate-50/60">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Hledat cvik..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-2xs"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Seznam cviků */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
            {filtered.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                Žádný cvik nenalezen.
              </div>
            ) : (
              filtered.map((ex) => (
                <div
                  key={ex.id}
                  className="w-full p-2.5 rounded-xl bg-white border border-slate-200/90 hover:border-blue-300 hover:bg-blue-50/40 transition group flex items-center justify-between"
                >
                  <button
                    onClick={() => {
                      onSelectExercise(ex);
                      onClose();
                    }}
                    className="flex-1 text-left min-w-0 pr-2 cursor-pointer"
                  >
                    <div className="font-semibold text-slate-900 text-xs sm:text-sm group-hover:text-blue-700 truncate">
                      {ex.name}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                        {ex.category}
                      </span>
                      <span className="text-[10px] text-slate-400 truncate max-w-[200px]">
                        {ex.target}
                      </span>
                    </div>
                  </button>

                  <div className="flex items-center gap-1.5">
                    {/* Tlačítko náhledu animace */}
                    <button
                      onClick={() => setPreviewExercise(ex)}
                      title="Zobrazit animaci a techniku"
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-100 text-slate-500 hover:text-blue-700 transition cursor-pointer text-xs"
                    >
                      <Activity className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        onSelectExercise(ex);
                        onClose();
                      }}
                      title="Přidat do tréninku"
                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-blue-600 hover:text-white flex items-center justify-center text-slate-600 transition cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Vlastní cvik */}
          <div className="p-3 border-t border-slate-200 bg-slate-50/80">
            {!showAddCustom ? (
              <button
                onClick={() => setShowAddCustom(true)}
                className="w-full py-2 rounded-xl border border-dashed border-slate-300 hover:border-blue-400 text-slate-500 hover:text-blue-600 text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Vytvořit vlastní cvik</span>
              </button>
            ) : (
              <form onSubmit={handleCreateCustom} className="space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Název cviku..."
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="col-span-2 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                    autoFocus
                  />
                  <select
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="Hrudník">Hrudník</option>
                    <option value="Záda">Záda</option>
                    <option value="Nohy">Nohy</option>
                    <option value="Ramena">Ramena</option>
                    <option value="Paže">Paže</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition cursor-pointer"
                  >
                    Uložit
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddCustom(false)}
                    className="px-3 py-1.5 rounded-lg bg-slate-200 text-slate-600 text-xs font-semibold cursor-pointer"
                  >
                    Zrušit
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <ExerciseAnimationModal
        exercise={previewExercise}
        isOpen={previewExercise !== null}
        onClose={() => setPreviewExercise(null)}
      />
    </>
  );
}

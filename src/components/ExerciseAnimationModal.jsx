import React, { useState } from 'react';
import { X, Play, Pause, RotateCcw, Activity, ShieldCheck, Target, Info } from 'lucide-react';

export const EXERCISE_GUIDES = {
  ex_bench: {
    name: 'Bench Press (Velká činka)',
    category: 'Hrudník',
    primaryMuscle: 'Velký prsní sval (Pectoralis Major)',
    secondaryMuscles: 'Přední delty, Triceps',
    tempo: '3-1-X-0 (3s kontrolované spouštění, 1s pauza na hrudníku, explozivní tlak)',
    cues: [
      'Lopatky stáhni k sobě a dolů do lavičky (retrakce a deprese).',
      'Lokty drž v úhlu 45° až 70° od těla, nevykláněj je do 90°.',
      'Dráha činky není kolmá, ale mírná křivka: ze stojanu na spodní prsa a zpět nad ramena.',
      'Zatlač chodidly do podlahy pro stabilní leg drive.'
    ],
    animationType: 'bench'
  },
  ex_squat: {
    name: 'Dřep s velkou činkou (Squat)',
    category: 'Nohy',
    primaryMuscle: 'Kvadricepsy, Velký hýžďový sval (Gluteus Maximus)',
    secondaryMuscles: 'Hamstringy, Vzpřimovače trupu, Střed těla (Core)',
    tempo: '3-1-1-0 (3s kontrolovaný sestup do hloubky, dynamický výpon nahoru)',
    cues: [
      'Hluboký nádech do břicha (bracing přes Valsalvův manévr) před zahájením pohybu.',
      'Kolena směřují ve stejném úhlu jako špičky nohou.',
      'Hloubka: záhyb kyčle musí klesnout na nebo mírně pod úroveň horní hrany kolene.',
      'Těžiště činky zůstává po celou dobu přesně nad středem chodidla.'
    ],
    animationType: 'squat'
  },
  ex_deadlift: {
    name: 'Mrtvý tah (Deadlift)',
    category: 'Záda',
    primaryMuscle: 'Zadní řetězec, Vzpřimovače páteře, Glutes',
    secondaryMuscles: 'Latissimus Dorsi, Trapézy, Předloktí (úchop)',
    tempo: 'X-1-2-0 (Výbušný tah, 1s lockout, 2s kontrolované spuštění)',
    cues: [
      'Činka je v kontaktu s holeněmi v ose nad středem chodidla.',
      'Aktivuj laty (představ si, že chceš zlomit osu kolem holení).',
      'Tlač podlahu nohama pryč, neškubej zády.',
      'V horní pozici zatni hýždě, nezakláněj se v bedrech.'
    ],
    animationType: 'deadlift'
  },
  ex_ohp: {
    name: 'Overhead Press (OHP)',
    category: 'Ramena',
    primaryMuscle: 'Přední a boční delty (Deltoideus)',
    secondaryMuscles: 'Triceps, Horní část prsou, Serratus anterior',
    tempo: '2-1-X-0 (2s kontrolovaný pokles pod bradu, explozivní výtlak)',
    cues: [
      'Zatni zadek a břicho pro eliminaci prohnutí v bedrech.',
      'V počátku dráhy mírně uhni hlavou vzad, jakmile činka mine čelo, hlava se vrací do neutrálu.',
      'V lockoutu tlač ramena aktivně nahoru (shrug up).',
      'Lokty směřují mírně dopředu, ne do stran.'
    ],
    animationType: 'ohp'
  },
  ex_pullups: {
    name: 'Shyby (Pull-ups)',
    category: 'Záda',
    primaryMuscle: 'Široký sval zádový (Lats)',
    secondaryMuscles: 'Biceps, Rombické svaly, Střed těla',
    tempo: '2-1-1-1 (1s kontrakce nahoře s bradou nad hrazdou, 2s protažení)',
    cues: [
      'Začni z plného vyvěšení (dead hang) se stažením lopatek dolů.',
      'Přitahuj lokty směrem k bokům, ne rukama k ramenům.',
      'Udržuj pevné břicho a nohy lehce před tělem (hollow body).'
    ],
    animationType: 'pullup'
  },
  ex_incline_db: {
    name: 'Šikmý tlak s jednoručkami',
    category: 'Hrudník',
    primaryMuscle: 'Klavikulární hlava prsního svalu (Horní prsa)',
    secondaryMuscles: 'Přední delty, Triceps',
    tempo: '3-1-1-0',
    cues: [
      'Lavička nastavena na sklon 30° až 45°.',
      'V dolní fázi hluboké protažení bez vytočení ramen.',
      'V horní fázi netřískat činkami o sebe, udržovat napětí na prsních svalech.'
    ],
    animationType: 'bench'
  }
};

export default function ExerciseAnimationModal({
  exercise,
  isOpen,
  onClose
}) {
  const [isPlaying, setIsPlaying] = useState(true);

  if (!isOpen || !exercise) return null;

  const guide = EXERCISE_GUIDES[exercise.exerciseId || exercise.id] || {
    name: exercise.name,
    category: exercise.category || 'Silový trénink',
    primaryMuscle: 'Cílová svalová skupina',
    secondaryMuscles: 'Stabilizační svaly',
    tempo: '3-0-1-0 (kontrolovaná negativní fáze)',
    cues: [
      'Udržuj správnou biomechanickou dráhu po celou dobu série.',
      'Soustřeď se na mysl-svalové propojení (mind-muscle connection).',
      'Dýchej pravidelně a stabilizuj střed těla.'
    ],
    animationType: 'bench'
  };

  const animType = guide.animationType || 'bench';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white/95 border border-slate-200 rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl relative text-slate-800 overflow-hidden backdrop-blur-xl">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
              Technika & Biomechanika
            </span>
            <h3 className="font-bold text-base text-slate-900 mt-1">{guide.name}</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* Vektorové biomechanické animační plátno */}
          <div className="relative rounded-xl bg-slate-50 border border-slate-200 p-4 flex flex-col items-center justify-center overflow-hidden">
            <div className="w-full flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-medium text-[11px] text-slate-500">Animovaný pohyb:</span>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-2 py-1 rounded-md bg-white border border-slate-200 text-slate-600 hover:text-blue-600 text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
              >
                {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-current" />}
                <span>{isPlaying ? 'Pauza' : 'Spustit'}</span>
              </button>
            </div>

            {/* SVG Interactive Animation Engine */}
            <div className="w-full h-56 flex items-center justify-center relative">
              
              {/* BENCH PRESS ANIMACE */}
              {animType === 'bench' && (
                <svg viewBox="0 0 300 200" className="w-full h-full max-w-[280px]">
                  {/* Bench Lavička */}
                  <rect x="40" y="130" width="220" height="12" rx="4" fill="#94a3b8" />
                  <rect x="60" y="142" width="10" height="40" fill="#64748b" />
                  <rect x="230" y="142" width="10" height="40" fill="#64748b" />

                  {/* Stojan vzadu */}
                  <line x1="80" y1="60" x2="80" y2="140" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" />
                  <line x1="72" y1="70" x2="88" y2="70" stroke="#94a3b8" strokeWidth="4" />

                  {/* Tělo cvičence na lavičce */}
                  <circle cx="80" cy="115" r="14" fill="#3b82f6" opacity="0.9" /> {/* Hlava */}
                  <path d="M94 122 Q150 115 190 125" stroke="#2563eb" strokeWidth="18" strokeLinecap="round" fill="none" /> {/* Trup */}
                  <path d="M190 125 L215 150 L240 180" stroke="#1d4ed8" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" /> {/* Nohy */}

                  {/* Pohyblivá osa činky + paže (CSS Animation) */}
                  <g className={isPlaying ? 'animate-bench-press' : ''}>
                    {/* Paže */}
                    <path d="M130 118 L140 85" stroke="#1e40af" strokeWidth="8" strokeLinecap="round" />
                    <path d="M140 85 L145 55" stroke="#1e40af" strokeWidth="7" strokeLinecap="round" />

                    {/* Činka */}
                    <line x1="50" y1="52" x2="240" y2="52" stroke="#475569" strokeWidth="5" strokeLinecap="round" />
                    {/* Kotouče */}
                    <rect x="52" y="30" width="8" height="44" rx="2" fill="#ef4444" />
                    <rect x="61" y="35" width="6" height="34" rx="2" fill="#3b82f6" />
                    <rect x="225" y="35" width="6" height="34" rx="2" fill="#3b82f6" />
                    <rect x="232" y="30" width="8" height="44" rx="2" fill="#ef4444" />
                  </g>

                  {/* Biomechanická křivka dráhy (J-curve) */}
                  <path d="M145 52 Q143 75 140 102" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" fill="none" />
                  <circle cx="140" cy="102" r="3" fill="#0284c7" />
                </svg>
              )}

              {/* SQUAT ANIMACE */}
              {animType === 'squat' && (
                <svg viewBox="0 0 300 200" className="w-full h-full max-w-[280px]">
                  {/* Podlaha */}
                  <line x1="30" y1="185" x2="270" y2="185" stroke="#cbd5e1" strokeWidth="4" />
                  <text x="150" y="197" textAnchor="middle" fontSize="10" fill="#94a3b8">Střed chodidla</text>

                  {/* Dynamický dřepař */}
                  <g className={isPlaying ? 'animate-squat-drop' : ''}>
                    {/* Hlava */}
                    <circle cx="150" cy="50" r="12" fill="#3b82f6" />
                    {/* Trup */}
                    <line x1="150" y1="62" x2="145" y2="115" stroke="#2563eb" strokeWidth="16" strokeLinecap="round" />
                    {/* Stehna */}
                    <line x1="145" y1="115" x2="165" y2="148" stroke="#1d4ed8" strokeWidth="12" strokeLinecap="round" />
                    {/* Lýtka */}
                    <line x1="165" y1="148" x2="150" y2="182" stroke="#1e40af" strokeWidth="10" strokeLinecap="round" />

                    {/* Činka na trapézech */}
                    <line x1="70" y1="65" x2="230" y2="65" stroke="#475569" strokeWidth="6" strokeLinecap="round" />
                    <rect x="75" y="42" width="10" height="46" rx="2" fill="#ef4444" />
                    <rect x="215" y="42" width="10" height="46" rx="2" fill="#ef4444" />
                  </g>

                  {/* Vertikální osa dráhy činky */}
                  <line x1="150" y1="35" x2="150" y2="175" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" />
                </svg>
              )}

              {/* DEADLIFT ANIMACE */}
              {animType === 'deadlift' && (
                <svg viewBox="0 0 300 200" className="w-full h-full max-w-[280px]">
                  {/* Podlaha */}
                  <line x1="30" y1="185" x2="270" y2="185" stroke="#cbd5e1" strokeWidth="4" />

                  {/* Deadlifter animace */}
                  <g className={isPlaying ? 'animate-deadlift-lift' : ''}>
                    <circle cx="130" cy="55" r="12" fill="#3b82f6" />
                    <line x1="130" y1="67" x2="140" y2="115" stroke="#2563eb" strokeWidth="16" strokeLinecap="round" />
                    <line x1="140" y1="115" x2="155" y2="150" stroke="#1d4ed8" strokeWidth="12" strokeLinecap="round" />
                    <line x1="155" y1="150" x2="150" y2="182" stroke="#1e40af" strokeWidth="10" strokeLinecap="round" />
                    {/* Paže natažené dolů */}
                    <line x1="130" y1="75" x2="160" y2="140" stroke="#1e3a8a" strokeWidth="7" strokeLinecap="round" />

                    {/* Činka */}
                    <line x1="80" y1="140" x2="240" y2="140" stroke="#475569" strokeWidth="6" strokeLinecap="round" />
                    <rect x="85" y="115" width="10" height="50" rx="2" fill="#ef4444" />
                    <rect x="225" y="115" width="10" height="50" rx="2" fill="#ef4444" />
                  </g>
                </svg>
              )}

              {/* OHP ANIMACE */}
              {animType === 'ohp' && (
                <svg viewBox="0 0 300 200" className="w-full h-full max-w-[280px]">
                  {/* Podlaha */}
                  <line x1="40" y1="185" x2="260" y2="185" stroke="#cbd5e1" strokeWidth="4" />

                  {/* Tělo liftera vestoje */}
                  <circle cx="150" cy="70" r="12" fill="#3b82f6" />
                  <line x1="150" y1="82" x2="150" y2="135" stroke="#2563eb" strokeWidth="16" strokeLinecap="round" />
                  <line x1="150" y1="135" x2="140" y2="182" stroke="#1d4ed8" strokeWidth="11" strokeLinecap="round" />
                  <line x1="150" y1="135" x2="160" y2="182" stroke="#1d4ed8" strokeWidth="11" strokeLinecap="round" />

                  {/* Činka pohybující se nad hlavu */}
                  <g className={isPlaying ? 'animate-ohp-press' : ''}>
                    <line x1="150" y1="80" x2="150" y2="35" stroke="#1e3a8a" strokeWidth="7" strokeLinecap="round" />
                    <line x1="70" y1="35" x2="230" y2="35" stroke="#475569" strokeWidth="6" strokeLinecap="round" />
                    <rect x="75" y="15" width="8" height="40" rx="2" fill="#ef4444" />
                    <rect x="217" y="15" width="8" height="40" rx="2" fill="#ef4444" />
                  </g>
                </svg>
              )}

              {/* PULLUP ANIMACE */}
              {animType === 'pullup' && (
                <svg viewBox="0 0 300 200" className="w-full h-full max-w-[280px]">
                  {/* Hrazda nahoře */}
                  <line x1="30" y1="30" x2="270" y2="30" stroke="#475569" strokeWidth="8" strokeLinecap="round" />

                  {/* Tělo shybujícího cvičence */}
                  <g className={isPlaying ? 'animate-pullup-rise' : ''}>
                    <circle cx="150" cy="75" r="12" fill="#3b82f6" />
                    <line x1="150" y1="87" x2="150" y2="135" stroke="#2563eb" strokeWidth="16" strokeLinecap="round" />
                    <line x1="150" y1="135" x2="145" y2="175" stroke="#1d4ed8" strokeWidth="11" strokeLinecap="round" />
                    {/* Paže držící hrazdu */}
                    <line x1="150" y1="82" x2="120" y2="30" stroke="#1e3a8a" strokeWidth="7" strokeLinecap="round" />
                    <line x1="150" y1="82" x2="180" y2="30" stroke="#1e3a8a" strokeWidth="7" strokeLinecap="round" />
                  </g>
                </svg>
              )}
            </div>
            
            <span className="text-[10px] text-slate-400 mt-1">Sleduj trajektorii dráhy činky a úhel těla</span>
          </div>

          {/* Anatomie & Zapojené svaly */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
              <Target className="w-4 h-4 text-blue-600" />
              <span>Svalové zapojení</span>
            </div>
            <div className="text-xs text-slate-700">
              <span className="text-slate-400 block text-[11px]">Hlavní sval (Prime mover):</span>
              <strong className="text-slate-900 font-semibold">{guide.primaryMuscle}</strong>
            </div>
            <div className="text-xs text-slate-700">
              <span className="text-slate-400 block text-[11px]">Sekundární / stabilizátory:</span>
              <span className="text-slate-600">{guide.secondaryMuscles}</span>
            </div>
            <div className="text-xs text-slate-700 pt-1 border-t border-slate-200">
              <span className="text-slate-400 block text-[11px]">Doporučené tempo pro hypertrofii:</span>
              <span className="font-mono-num font-semibold text-blue-700">{guide.tempo}</span>
            </div>
          </div>

          {/* Klíčové technické pokyny */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Klíčové pokyny (Cues)</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-600 list-disc list-inside">
              {guide.cues.map((cue, idx) => (
                <li key={idx} className="leading-relaxed">
                  <span className="text-slate-700">{cue}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition cursor-pointer"
          >
            Rozumím technice
          </button>
        </div>
      </div>
    </div>
  );
}

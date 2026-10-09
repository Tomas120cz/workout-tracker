// Výchozí data pro aplikaci LIFTOFF (pokročilý silový a hypertrofický trénink)

export const EXERCISE_LIBRARY = [
  // Hrudník
  { id: 'ex_bench', name: 'Bench Press (Velká činka)', category: 'Hrudník', equipment: 'Činka', target: 'Prsní svaly, triceps, přední delty' },
  { id: 'ex_incline_db', name: 'Šikmý tlak s jednoručkami', category: 'Hrudník', equipment: 'Jednoručky', target: 'Horní část prsou' },
  { id: 'ex_dips', name: 'Kliky na bradlech (Dips)', category: 'Hrudník', equipment: 'Vlastní váha', target: 'Spodní prsa, triceps' },
  { id: 'ex_cable_fly', name: 'Rozpažování na kladkách', category: 'Hrudník', equipment: 'Kladka', target: 'Izolace prsou' },
  
  // Záda
  { id: 'ex_deadlift', name: 'Mrtvý tah (Deadlift)', category: 'Záda', equipment: 'Činka', target: 'Celý zadní řetězec, vzpřimovače' },
  { id: 'ex_barbell_row', name: 'Přítahy velké činky v předklonu', category: 'Záda', equipment: 'Činka', target: 'Široký sval zádový, mezilopatkové svaly' },
  { id: 'ex_pullups', name: 'Shyby s nadhmatem / přidanou vahou', category: 'Záda', equipment: 'Vlastní váha', target: 'Lats, biceps' },
  { id: 'ex_lat_pulldown', name: 'Stahování horní kladky na hrudník', category: 'Záda', equipment: 'Kladka', target: 'Široký sval zádový' },
  { id: 'ex_chest_supported_row', name: 'Přítahy s oporou hrudníku', category: 'Záda', equipment: 'Jednoručky / Stroj', target: 'Střední část zad' },

  // Nohy - Kvadricepsy & Hýždě
  { id: 'ex_squat', name: 'Dřep s velkou činkou (Squat)', category: 'Nohy', equipment: 'Činka', target: 'Kvadricepsy, hýždě, střed těla' },
  { id: 'ex_front_squat', name: 'Přední dřep (Front Squat)', category: 'Nohy', equipment: 'Činka', target: 'Kvadricepsy, vzpřímený trup' },
  { id: 'ex_leg_press', name: 'Leg Press 45°', category: 'Nohy', equipment: 'Stroj', target: 'Kvadricepsy, glutes' },
  { id: 'ex_hack_squat', name: 'Hack Squat', category: 'Nohy', equipment: 'Stroj', target: 'Hypertrofie kvadricepsů' },
  { id: 'ex_leg_ext', name: 'Předkopávání na stroji', category: 'Nohy', equipment: 'Stroj', target: 'Izolace kvadricepsů' },

  // Nohy - Hamstringy & Lýtka
  { id: 'ex_rdl', name: 'Rumunský mrtvý tah (RDL)', category: 'Nohy', equipment: 'Činka', target: 'Hamstringy, hýždě' },
  { id: 'ex_leg_curl', name: 'Zakopávání vleže / vsedě', category: 'Nohy', equipment: 'Stroj', target: 'Izolace hamstringů' },
  { id: 'ex_calf_raise', name: 'Výpony na lýtka vestoje', category: 'Nohy', equipment: 'Stroj', target: 'Gastrocnemius' },

  // Ramena
  { id: 'ex_ohp', name: 'Tlak nad hlavu (Overhead Press / OHP)', category: 'Ramena', equipment: 'Činka', target: 'Přední a boční delty, triceps' },
  { id: 'ex_seated_db_press', name: 'Tlaky s jednoručkami vsedě', category: 'Ramena', equipment: 'Jednoručky', target: 'Ramena' },
  { id: 'ex_lateral_raise', name: 'Upažování s jednoručkami / na kladce', category: 'Ramena', equipment: 'Jednoručky', target: 'Boční delty (širší ramena)' },
  { id: 'ex_face_pull', name: 'Face Pulls na horní kladce', category: 'Ramena', equipment: 'Kladka', target: 'Zadní delty, rotátory' },

  // Paže
  { id: 'ex_barbell_curl', name: 'Bicepsový zdvih s EZ činkou', category: 'Paže', equipment: 'EZ činka', target: 'Biceps brachii' },
  { id: 'ex_incline_curl', name: 'Šikmé bicepsové zdvihy', category: 'Paže', equipment: 'Jednoručky', target: 'Dlouhá hlava bicepsu' },
  { id: 'ex_skullcrusher', name: 'French Press / Skullcrushers', category: 'Paže', equipment: 'EZ činka', target: 'Dlouhá hlava tricepsu' },
  { id: 'ex_tricep_pushdown', name: 'Tricepsové stahování kladky', category: 'Paže', equipment: 'Kladka', target: 'Laterální hlava tricepsu' },
];

export const WORKOUT_TEMPLATES = [
  {
    id: 'tpl_push',
    name: 'Push A (Hrudník, Přední/Boční Delty, Triceps)',
    split: 'Push',
    estimatedTime: '65 min',
    exercises: [
      { exerciseId: 'ex_bench', sets: [{ weight: 105, reps: 6, rpe: 8.5 }, { weight: 105, reps: 6, rpe: 9 }, { weight: 100, reps: 8, rpe: 9.5 }] },
      { exerciseId: 'ex_incline_db', sets: [{ weight: 36, reps: 8, rpe: 8 }, { weight: 36, reps: 8, rpe: 8.5 }, { weight: 34, reps: 10, rpe: 9 }] },
      { exerciseId: 'ex_dips', sets: [{ weight: 20, reps: 8, rpe: 8.5 }, { weight: 20, reps: 7, rpe: 9 }] },
      { exerciseId: 'ex_lateral_raise', sets: [{ weight: 14, reps: 12, rpe: 9 }, { weight: 14, reps: 12, rpe: 9.5 }, { weight: 12, reps: 15, rpe: 10 }] },
      { exerciseId: 'ex_skullcrusher', sets: [{ weight: 42.5, reps: 10, rpe: 8.5 }, { weight: 42.5, reps: 9, rpe: 9 }] },
    ]
  },
  {
    id: 'tpl_pull',
    name: 'Pull A (Záda, Zadní Delty, Biceps)',
    split: 'Pull',
    estimatedTime: '70 min',
    exercises: [
      { exerciseId: 'ex_deadlift', sets: [{ weight: 180, reps: 5, rpe: 8 }, { weight: 190, reps: 4, rpe: 8.5 }, { weight: 180, reps: 5, rpe: 9 }] },
      { exerciseId: 'ex_pullups', sets: [{ weight: 15, reps: 6, rpe: 8 }, { weight: 15, reps: 6, rpe: 8.5 }, { weight: 0, reps: 10, rpe: 9 }] },
      { exerciseId: 'ex_barbell_row', sets: [{ weight: 85, reps: 8, rpe: 8 }, { weight: 85, reps: 8, rpe: 8.5 }, { weight: 80, reps: 10, rpe: 9 }] },
      { exerciseId: 'ex_face_pull', sets: [{ weight: 32, reps: 15, rpe: 8.5 }, { weight: 32, reps: 15, rpe: 9 }] },
      { exerciseId: 'ex_barbell_curl', sets: [{ weight: 40, reps: 8, rpe: 8.5 }, { weight: 40, reps: 8, rpe: 9 }] },
    ]
  },
  {
    id: 'tpl_legs',
    name: 'Legs Hypertrophy (Kvadricepsy, Hamstringy, Lýtka)',
    split: 'Legs',
    estimatedTime: '75 min',
    exercises: [
      { exerciseId: 'ex_squat', sets: [{ weight: 140, reps: 6, rpe: 8 }, { weight: 145, reps: 5, rpe: 8.5 }, { weight: 140, reps: 6, rpe: 9 }] },
      { exerciseId: 'ex_rdl', sets: [{ weight: 120, reps: 8, rpe: 8 }, { weight: 120, reps: 8, rpe: 8.5 }, { weight: 120, reps: 8, rpe: 9 }] },
      { exerciseId: 'ex_hack_squat', sets: [{ weight: 110, reps: 10, rpe: 9 }, { weight: 110, reps: 10, rpe: 9.5 }] },
      { exerciseId: 'ex_leg_curl', sets: [{ weight: 55, reps: 12, rpe: 9 }, { weight: 55, reps: 11, rpe: 9.5 }] },
      { exerciseId: 'ex_calf_raise', sets: [{ weight: 80, reps: 15, rpe: 9 }, { weight: 80, reps: 14, rpe: 9.5 }] },
    ]
  }
];

export const INITIAL_USER_PROFILE = {
  name: 'Alex Vance',
  currentWeight: 84.8,
  targetWeight: 88.0,
  height: 182,
  age: 26,
  experienceLevel: 'Pokročilý (4+ roky silového tréninku)',
  trainingSplit: 'Push / Pull / Legs (5× týdně)',
  currentPhase: 'Objemová hypertrofie (+350 kcal)',
  calorieTarget: 3450,
  proteinTarget: 195, // g
  carbsTarget: 440,   // g
  fatsTarget: 85,     // g
};

export const INITIAL_PERSONAL_RECORDS = [
  {
    id: 'ex_bench',
    exercise: 'Bench Press',
    current1RM: 135, // kg
    lastMonth1RM: 130,
    growthKg: 5,
    growthPct: 3.8,
    dateAchieved: '2026-10-04',
    bestSet: '117.5 kg × 5 reps',
  },
  {
    id: 'ex_squat',
    exercise: 'Dřep (Squat)',
    current1RM: 185,
    lastMonth1RM: 177.5,
    growthKg: 7.5,
    growthPct: 4.2,
    dateAchieved: '2026-10-02',
    bestSet: '160 kg × 5 reps',
  },
  {
    id: 'ex_deadlift',
    exercise: 'Mrtvý tah (Deadlift)',
    current1RM: 220,
    lastMonth1RM: 212.5,
    growthKg: 7.5,
    growthPct: 3.5,
    dateAchieved: '2026-09-28',
    bestSet: '195 kg × 4 reps',
  },
  {
    id: 'ex_ohp',
    exercise: 'Overhead Press (OHP)',
    current1RM: 85,
    lastMonth1RM: 82.5,
    growthKg: 2.5,
    growthPct: 3.0,
    dateAchieved: '2026-10-06',
    bestSet: '75 kg × 5 reps',
  },
];

export const INITIAL_NUTRITION_TODAY = {
  date: '2026-10-09',
  calories: 2780,
  targetCalories: 3450,
  protein: 165,
  targetProtein: 195,
  carbs: 350,
  targetCarbs: 440,
  fats: 68,
  targetFats: 85,
  surplusNote: '+350 kcal cíl pro čistou svalovou hypertrofii',
  meals: [
    { id: 'm1', name: 'Snídaně: Vločky, syrovátkový protein, banán, mandlové máslo', calories: 820, protein: 52, carbs: 105, fats: 20, time: '07:30' },
    { id: 'm2', name: 'Předtréninková svačina: Rýžové chlebíčky, med, hovězí jerky', calories: 430, protein: 32, carbs: 64, fats: 4, time: '11:45' },
    { id: 'm3', name: 'Potréninkový oběd: Hovězí mleté 90%, jasmínová rýže, brokolice', calories: 950, protein: 60, carbs: 120, fats: 22, time: '14:30' },
    { id: 'm4', name: 'Odpolední svačina: Řecký jogurt 0%, lesní plody, vlašské ořechy', calories: 580, protein: 21, carbs: 61, fats: 22, time: '17:15' },
  ]
};

export const INITIAL_WEIGHT_HISTORY = [
  { date: '11.09.', weight: 83.2, movingAvg: 83.3 },
  { date: '15.09.', weight: 83.5, movingAvg: 83.4 },
  { date: '19.09.', weight: 83.7, movingAvg: 83.6 },
  { date: '23.09.', weight: 84.0, movingAvg: 83.8 },
  { date: '27.09.', weight: 84.1, movingAvg: 84.0 },
  { date: '01.10.', weight: 84.3, movingAvg: 84.2 },
  { date: '05.10.', weight: 84.6, movingAvg: 84.4 },
  { date: '09.10.', weight: 84.8, movingAvg: 84.7 },
];

export const INITIAL_PROGRESSION_DATA = {
  // 1RM progrese za posledních 6 měsíců
  history1RM: [
    { month: 'Květen', bench: 120, squat: 165, deadlift: 200, ohp: 75, volume: 16800 },
    { month: 'Červen', bench: 122.5, squat: 170, deadlift: 205, ohp: 77.5, volume: 17900 },
    { month: 'Červenec', bench: 127.5, squat: 172.5, deadlift: 210, ohp: 80, volume: 18400 },
    { month: 'Srpen', bench: 130, squat: 175, deadlift: 212.5, ohp: 80, volume: 19200 },
    { month: 'Září', bench: 132.5, squat: 180, deadlift: 217.5, ohp: 82.5, volume: 20100 },
    { month: 'Říjen (Akt.)', bench: 135, squat: 185, deadlift: 220, ohp: 85, volume: 21450 },
  ],
  // Týdenní hypertrofický objem (počet pracovních sérií na partii)
  muscleVolume: [
    { muscle: 'Hrudník', currentSets: 16, targetMin: 12, targetMax: 20 },
    { muscle: 'Záda', currentSets: 18, targetMin: 14, targetMax: 22 },
    { muscle: 'Kvadricepsy', currentSets: 14, targetMin: 10, targetMax: 18 },
    { muscle: 'Hamstringy', currentSets: 12, targetMin: 10, targetMax: 16 },
    { muscle: 'Ramena', currentSets: 16, targetMin: 12, targetMax: 20 },
    { muscle: 'Triceps', currentSets: 10, targetMin: 8, targetMax: 14 },
    { muscle: 'Biceps', currentSets: 12, targetMin: 8, targetMax: 14 },
  ]
};

export const INITIAL_WEEK_SUMMARY = {
  workoutsDone: 4,
  workoutsTarget: 5,
  totalVolumeKg: 21450,
  streakWeeks: 6,
  days: [
    { day: 'Po', done: true, name: 'Push A' },
    { day: 'Út', done: true, name: 'Pull A' },
    { day: 'St', done: false, name: 'Rest / Regenerace' },
    { day: 'Čt', done: true, name: 'Legs Hypertrophy' },
    { day: 'Pá', done: true, name: 'Upper Strength' },
    { day: 'So', done: false, name: 'Lower Hypertrophy (Plán)' },
    { day: 'Ne', done: false, name: 'Rest' },
  ]
};

// Vědecké a praktické vzorce pro silový trénink a výživu

// Výpočet odhadovaného 1RM (Epley & Brzycki průměr)
export function calculate1RM(weight, reps) {
  const w = parseFloat(weight) || 0;
  const r = parseInt(reps, 10) || 0;
  if (w <= 0 || r <= 0) return 0;
  if (r === 1) return Math.round(w * 10) / 10;
  
  // Epley: w * (1 + r / 30)
  const epley = w * (1 + r / 30);
  // Brzycki: w * (36 / (37 - r))
  const brzycki = r < 37 ? w * (36 / (37 - r)) : epley;
  
  const avg = (epley + brzycki) / 2;
  return Math.round(avg * 10) / 10;
}

// Výpočet kotoučů na olympijskou osu (20 kg osa, váha na každou stranu)
export function calculatePlates(totalWeight, barWeight = 20) {
  const target = Math.max(0, parseFloat(totalWeight) || 0);
  const remainingPerSide = Math.max(0, (target - barWeight) / 2);
  
  const availablePlates = [25, 20, 15, 10, 5, 2.5, 1.25];
  const platesPerSide = [];
  let current = remainingPerSide;

  for (const plate of availablePlates) {
    const count = Math.floor(current / plate);
    if (count > 0) {
      platesPerSide.push({ plate, count });
      current = Math.round((current - count * plate) * 100) / 100;
    }
  }

  return {
    barWeight,
    perSideWeight: Math.round(remainingPerSide * 10) / 10,
    platesPerSide,
    exactMatch: current === 0,
    remainderKg: current * 2
  };
}

// Kalkulačka makroživin a kalorií pro svalovou hypertrofii
export function calculateMacros({
  weight = 84,
  height = 180,
  age = 25,
  gender = 'male',
  activityMultiplier = 1.55, // Středně až vysoce aktivní lifter (4-5 tréninků týdně)
  surplusMode = 'lean_bulk' // 'maintenance', 'lean_bulk' (+300), 'aggressive_bulk' (+500)
}) {
  const w = parseFloat(weight) || 80;
  const h = parseFloat(height) || 180;
  const a = parseInt(age, 10) || 25;

  // Mifflin-St Jeor BMR
  let bmr = 10 * w + 6.25 * h - 5 * a;
  bmr = gender === 'male' ? bmr + 5 : bmr - 161;

  const tdee = Math.round(bmr * parseFloat(activityMultiplier));

  let surplus = 0;
  if (surplusMode === 'lean_bulk') surplus = 300;
  else if (surplusMode === 'aggressive_bulk') surplus = 500;
  else if (surplusMode === 'cut') surplus = -400;

  const targetCalories = Math.round(tdee + surplus);

  // Pro hypertrofii: 2.0 až 2.2g bílkovin na kg tělesné hmotnosti
  const proteinGrams = Math.round(w * 2.2);
  const proteinKcal = proteinGrams * 4;

  // Tuky: cca 0.9 až 1.0g na kg (20-25% celkového příjmu)
  const fatsGrams = Math.round(w * 0.95);
  const fatsKcal = fatsGrams * 9;

  // Zbytek energie ze sacharidů (palivo pro glykogen a těžké tréninky)
  const carbsKcal = Math.max(0, targetCalories - (proteinKcal + fatsKcal));
  const carbsGrams = Math.round(carbsKcal / 4);

  return {
    bmr: Math.round(bmr),
    tdee,
    surplus,
    targetCalories,
    proteinGrams,
    carbsGrams,
    fatsGrams,
    percentages: {
      protein: Math.round((proteinKcal / targetCalories) * 100),
      carbs: Math.round((carbsKcal / targetCalories) * 100),
      fats: Math.round((fatsKcal / targetCalories) * 100)
    }
  };
}

// Formátování sekund na MM:SS
export function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

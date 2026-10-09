// Jednoduchý LocalStorage wrapper s bezpečným fallbackem

export function getStorageItem(key, defaultValue) {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue;
    return JSON.parse(item);
  } catch (err) {
    console.warn(`Chyba čtení z localStorage pro ${key}:`, err);
    return defaultValue;
  }
}

export function setStorageItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Chyba zápisu do localStorage pro ${key}:`, err);
  }
}

export function clearStorageData() {
  try {
    localStorage.clear();
  } catch (err) {
    console.warn('Chyba vymazání localStorage:', err);
  }
}

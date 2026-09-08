// js/core/state.js
//
// Single source of truth for cross-mode state: coins, hints, language,
// and the demining-field progress (cleared area + discovered-threats catalogue).
//
// Persistence: tries localStorage first (works once the game is hosted for
// real, e.g. on GitHub Pages). If localStorage is blocked or unavailable —
// sandboxed preview iframes, private browsing, disabled cookies — it falls
// back to a plain in-memory store automatically. Either way, every other
// module only ever talks to the getters/setters below and never touches
// localStorage directly.

const STORAGE_KEY = 'magUkraineGameState';
const STORAGE_VERSION = 1;

const DEFAULT_STATE = {
  version: STORAGE_VERSION,
  coins: 0,
  hints: 1,                 // one free starter hint, matches the rest of the app
  lang: 'uk',
  clearedArea: 0,            // total safely cleared m² in the demining field
  discoveredThreats: {},     // { threatId: timesFound } — powers the threat catalogue
  fieldsCompleted: 0,        // how many demining-field plots have been fully cleared
  deminers: [                // roster of hired deminers and their PURCHASED upgrade
    { id: 'd1', stamina: 0, equipment: 0, speed: 0 } // levels (not runtime energy/rest state)
  ]
};

/* ---------------------------------------------------------------------
 * Storage adapter
 * ------------------------------------------------------------------- */
function createStorage() {
  try {
    const probeKey = '__mag_storage_probe__';
    window.localStorage.setItem(probeKey, '1');
    window.localStorage.removeItem(probeKey);

    return {
      kind: 'localStorage',
      read() {
        try {
          const raw = window.localStorage.getItem(STORAGE_KEY);
          return raw ? JSON.parse(raw) : null;
        } catch {
          return null;
        }
      },
      write(value) {
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
        } catch {
          // Quota exceeded or storage revoked mid-session — state still
          // lives correctly in memory for the rest of this page load.
        }
      }
    };
  } catch {
    console.warn(
      '[state] localStorage is unavailable — using in-memory state for this session only.'
    );
    let memory = null;
    return {
      kind: 'memory',
      read() { return memory; },
      write(value) { memory = value; }
    };
  }
}

const storage = createStorage();

/* ---------------------------------------------------------------------
 * Load + migrate
 * ------------------------------------------------------------------- */
function loadInitialState() {
  const saved = storage.read();
  if (!saved || saved.version !== STORAGE_VERSION) {
    // No save yet, or it's from an older shape we don't want to trust blindly.
    return { ...DEFAULT_STATE, deminers: structuredClone(DEFAULT_STATE.deminers) };
  }
  return {
    ...DEFAULT_STATE,
    ...saved,
    discoveredThreats: { ...saved.discoveredThreats },
    deminers: Array.isArray(saved.deminers) && saved.deminers.length
      ? saved.deminers.map((d) => ({ ...d }))
      : structuredClone(DEFAULT_STATE.deminers)
  };
}

const state = loadInitialState();

function persist() {
  storage.write(state);
}

/* ---------------------------------------------------------------------
 * Subscriptions — lets UI modules re-render when shared state changes
 * without importing each other directly.
 * ------------------------------------------------------------------- */
const listeners = new Set();

function notify() {
  listeners.forEach((fn) => fn(getStateSnapshot()));
}

/**
 * Subscribe to any state change. Returns an unsubscribe function.
 *   const unsubscribe = onStateChange((s) => console.log(s.coins));
 */
export function onStateChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/* ---------------------------------------------------------------------
 * Coins
 * ------------------------------------------------------------------- */
export function getCoins() {
  return state.coins;
}

export function addCoins(amount) {
  if (amount <= 0) return state.coins;
  state.coins += amount;
  persist();
  notify();
  return state.coins;
}

/** Returns true and deducts if affordable, false (no change) otherwise. */
export function spendCoins(amount) {
  if (amount <= 0 || state.coins < amount) return false;
  state.coins -= amount;
  persist();
  notify();
  return true;
}

/* ---------------------------------------------------------------------
 * Hints
 * ------------------------------------------------------------------- */
export function getHints() {
  return state.hints;
}

export function addHints(amount) {
  if (amount <= 0) return state.hints;
  state.hints += amount;
  persist();
  notify();
  return state.hints;
}

/** Returns true and consumes one hint if available, false otherwise. */
export function useHint() {
  if (state.hints <= 0) return false;
  state.hints -= 1;
  persist();
  notify();
  return true;
}

/* ---------------------------------------------------------------------
 * Language
 * ------------------------------------------------------------------- */
export function getLang() {
  return state.lang;
}

export function setLang(lang) {
  if (lang !== 'uk' && lang !== 'en') return state.lang;
  state.lang = lang;
  persist();
  notify();
  return state.lang;
}

/* ---------------------------------------------------------------------
 * Demining field: cleared area
 * ------------------------------------------------------------------- */
export function getClearedArea() {
  return state.clearedArea;
}

/** squareMetres should be a positive number representing one cleared cell. */
export function addClearedArea(squareMetres) {
  if (squareMetres <= 0) return state.clearedArea;
  state.clearedArea += squareMetres;
  persist();
  notify();
  return state.clearedArea;
}

/* ---------------------------------------------------------------------
 * Demining field: discovered-threats catalogue
 * ------------------------------------------------------------------- */
export function getDiscoveredThreats() {
  return { ...state.discoveredThreats };
}

export function getThreatCount(threatId) {
  return state.discoveredThreats[threatId] || 0;
}

/** Records one more find of this threat type; returns the new count for it. */
export function recordThreatFound(threatId) {
  state.discoveredThreats[threatId] = (state.discoveredThreats[threatId] || 0) + 1;
  persist();
  notify();
  return state.discoveredThreats[threatId];
}

/* ---------------------------------------------------------------------
 * Demining field: completed plots
 * ------------------------------------------------------------------- */
export function getFieldsCompleted() {
  return state.fieldsCompleted;
}

export function incrementFieldsCompleted() {
  state.fieldsCompleted += 1;
  persist();
  notify();
  return state.fieldsCompleted;
}

/* ---------------------------------------------------------------------
 * Demining field: deminer roster (hiring + purchased upgrade levels)
 * ------------------------------------------------------------------- */
const UPGRADE_STAT_CAPS = { stamina: 5, equipment: 3, speed: 5 };

export function getDeminers() {
  return state.deminers.map((d) => ({ ...d }));
}

export function getDeminer(id) {
  const d = state.deminers.find((x) => x.id === id);
  return d ? { ...d } : null;
}

/** Adds a new deminer at level 0 in every stat. Returns the new roster. */
export function hireDeminer() {
  const nextNum = state.deminers.length + 1;
  state.deminers.push({ id: 'd' + nextNum, stamina: 0, equipment: 0, speed: 0 });
  persist();
  notify();
  return getDeminers();
}

/**
 * Increments one stat (stamina/equipment/speed) for one deminer by one
 * level, up to that stat's cap. Returns true if the upgrade was applied,
 * false if the deminer/stat doesn't exist or is already at its cap.
 */
export function upgradeDeminerStat(id, statKey) {
  const cap = UPGRADE_STAT_CAPS[statKey];
  if (cap === undefined) return false;
  const deminer = state.deminers.find((d) => d.id === id);
  if (!deminer || deminer[statKey] >= cap) return false;
  deminer[statKey] += 1;
  persist();
  notify();
  return true;
}

export function getUpgradeStatCap(statKey) {
  return UPGRADE_STAT_CAPS[statKey];
}

/* ---------------------------------------------------------------------
 * Utilities
 * ------------------------------------------------------------------- */

/** Read-only snapshot — safe to hand to UI code or log to the console. */
export function getStateSnapshot() {
  return { ...state, discoveredThreats: { ...state.discoveredThreats } };
}

/** For a future "reset my progress" button; wipes everything back to defaults. */
export function resetState() {
  Object.assign(state, {
    ...DEFAULT_STATE,
    discoveredThreats: {},
    deminers: structuredClone(DEFAULT_STATE.deminers)
  });
  persist();
  notify();
}

/** Exposed only so app.js can show "progress saved locally" vs "this session only". */
export function getStorageKind() {
  return storage.kind; // 'localStorage' | 'memory'
}

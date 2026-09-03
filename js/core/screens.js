// js/core/screens.js
//
// A deliberately tiny navigation layer shared by every mode module.
// Each mode registers the screen ids it owns; showing a screen by id just
// toggles the .active class. This is what lets swipeGame.js, questGame.js
// and deminingField.js call showScreen('screenQuestAge') etc. WITHOUT
// importing each other directly — the only shared contract is a string id,
// which keeps the module graph a simple tree (app.js -> modes -> core)
// instead of a web of cross-imports between modes.

const registeredScreenIds = new Set();

/** Call once per mode, during its init, with the screen ids it renders. */
export function registerScreens(ids) {
  ids.forEach((id) => registeredScreenIds.add(id));
}

/** Shows exactly one registered screen, hides all others. */
export function showScreen(id) {
  if (!registeredScreenIds.has(id)) {
    console.warn(`[screens] "${id}" was never registered via registerScreens() — showing it anyway, but check for a typo.`);
  }
  registeredScreenIds.forEach((sid) => {
    const el = document.getElementById(sid);
    if (!el) return;
    el.classList.toggle('active', sid === id);
  });
}

export function isScreenActive(id) {
  const el = document.getElementById(id);
  return !!el && el.classList.contains('active');
}

export function getActiveScreenId() {
  for (const id of registeredScreenIds) {
    if (isScreenActive(id)) return id;
  }
  return null;
}

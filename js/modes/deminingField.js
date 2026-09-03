// js/modes/deminingField.js
//
// "Полігон розмінування" — Land Release & Threat Awareness simulator.
//
// Design constraints this module deliberately follows (from the brief):
//   - No treasure-hunt framing, no "collecting" dangerous items as a game
//     mechanic. Clearing a cell produces a plain factual report, nothing
//     celebratory about the find itself.
//   - The threat catalogue is a reference/statistics screen, not a
//     "gotta find them all" collection — every entry is visible up front
//     with its educational description, whether or not it's been
//     encountered yet; only the tally number changes.
//   - clearedArea and discoveredThreats persist through state.js, so
//     progress survives across sessions (see state.js's localStorage
//     fallback behaviour).
//
// Owns two screens: screenDeminingField, screenThreatCatalog.
// Public API consumed by app.js:
//   initDeminingField()      — call once, after the DOM is ready
//   startDeminingFormat()    — entry point for the "Land Release" format card
//   refreshDeminingLabels()  — call after a language change

import { getCoins, spendCoins, addClearedArea, getClearedArea, recordThreatFound, getThreatCount } from '../core/state.js';
import { t } from '../core/i18n.js';
import { registerScreens, showScreen, isScreenActive } from '../core/screens.js';

/* ---------------------------------------------------------------------
 * Field configuration
 * ------------------------------------------------------------------- */
const GRID_SIZE = 6;                 // 6x6 = 36 cells per plot
const CELL_AREA_M2 = 25;             // each cleared cell represents 25 m² (a 5m x 5m lane section)
const CLEAR_COST = 5;                // coins spent per cell, matches the hint-shop's base price elsewhere
const CLEAR_PROBABILITY = 0.6;       // 60% of unknown cells hide a threat, 40% come back clear — mirrors
                                      // the real-world fact that not every surveyed plot contains ordnance

/* ---------------------------------------------------------------------
 * Threat reference data — educational, factual, no glorified imagery.
 * Markers are plain coloured dots (a GIS/hazard-map convention), never
 * pictures of the objects themselves.
 * ------------------------------------------------------------------- */
const THREAT_CATALOG = [
  {
    id: 'ppMineBlast', marker: '🔴',
    uk: { name: 'Протипіхотна фугасна міна', desc: 'Спрацьовує від тиску ноги. Деякі корпуси містять мінімум металу, тому не завжди виявляються звичайним металодетектором.' },
    en: { name: 'Anti-personnel blast mine', desc: 'Triggers from foot pressure. Some casings contain very little metal, so they are not always found by a standard metal detector.' }
  },
  {
    id: 'petalMine', marker: '🔴',
    uk: { name: 'Міна ПФМ-1 («пелюстка»)', desc: 'Невелика й пластикова, часто нагадує іграшку чи шматок пластику — тому особливо небезпечна для дітей.' },
    en: { name: 'PFM-1 mine ("petal mine")', desc: 'Small and plastic, often resembling a toy or a scrap of plastic — which makes it especially dangerous for children.' }
  },
  {
    id: 'atMine', marker: '🟠',
    uk: { name: 'Протитанкова міна', desc: 'Розрахована на великий тиск (вагу техніки), тому рідко спрацьовує від людини, але лишається смертельно небезпечною.' },
    en: { name: 'Anti-tank mine', desc: 'Designed to trigger under heavy weight, such as a vehicle, so it rarely detonates from a person\u2019s step but remains lethally dangerous.' }
  },
  {
    id: 'uxoShell', marker: '🟡',
    uk: { name: 'Нерозірваний артилерійський снаряд', desc: 'Не спрацював при пострілі, але лишається чутливим до дотику, тиску чи переміщення.' },
    en: { name: 'Unexploded artillery shell', desc: 'Failed to detonate on impact, but remains sensitive to touch, pressure, or movement.' }
  },
  {
    id: 'clusterSubmunition', marker: '🟣',
    uk: { name: 'Елемент касетного боєприпасу', desc: 'До 10\u201330% суббоєприпасів не спрацьовують одразу й перетворюються на міни-пастки непередбачуваної дії.' },
    en: { name: 'Cluster submunition', desc: 'Up to 10\u201330% of submunitions fail to detonate on impact and become unpredictable mine-like hazards.' }
  },
  {
    id: 'tripwireDevice', marker: '🟤',
    uk: { name: 'Пристрій з розтяжкою', desc: 'Прихований дріт, часто замаскований травою чи листям, з\u2019єднаний із детонатором.' },
    en: { name: 'Tripwire-rigged device', desc: 'A concealed wire, often hidden by grass or leaves, connected to a detonator.' }
  }
];

/* ---------------------------------------------------------------------
 * Session state — the current plot's cell grid is local (a fresh plot
 * every visit); clearedArea/discoveredThreats are cumulative and live
 * in state.js instead.
 * ------------------------------------------------------------------- */
let cells = []; // { status: 'unknown' | 'cleared', outcome: threatId | 'clear' | null }
let working = false;

let dom = {};

/* ---------------------------------------------------------------------
 * Init
 * ------------------------------------------------------------------- */
export function initDeminingField() {
  registerScreens(['screenDeminingField', 'screenThreatCatalog']);
  cacheDom();
  wireListeners();
  generateNewField();
  refreshDeminingLabels();
}

function cacheDom() {
  dom = {
    grid: document.getElementById('dfGrid'),
    coinVal: document.getElementById('dfCoinVal'),
    areaVal: document.getElementById('dfAreaVal'),
    remainingVal: document.getElementById('dfRemainingVal'),
    completeBanner: document.getElementById('dfCompleteBanner'),
    btnNewField: document.getElementById('dfBtnNewField'),
    btnCatalog: document.getElementById('dfBtnCatalog'),
    backFromField: document.getElementById('backFromDeminingField'),
    reportOverlay: document.getElementById('dfReportOverlay'),
    reportCard: document.getElementById('dfReportCard'),
    reportTitle: document.getElementById('dfReportTitle'),
    reportText: document.getElementById('dfReportText'),
    reportClose: document.getElementById('dfReportClose'),
    catalogList: document.getElementById('dfCatalogList'),
    catalogAreaVal: document.getElementById('dfCatalogAreaVal'),
    backFromCatalog: document.getElementById('backFromCatalog')
  };
}

function wireListeners() {
  dom.backFromField.addEventListener('click', () => showScreen('screenFormat'));
  dom.backFromCatalog.addEventListener('click', () => showScreen('screenDeminingField'));
  dom.btnCatalog.addEventListener('click', () => {
    renderCatalog();
    showScreen('screenThreatCatalog');
  });
  dom.btnNewField.addEventListener('click', () => {
    generateNewField();
    renderGrid();
  });
  dom.reportClose.addEventListener('click', () => dom.reportOverlay.classList.remove('show'));
}

/* ---------------------------------------------------------------------
 * Entry point (called by app.js from the format-select screen)
 * ------------------------------------------------------------------- */
export function startDeminingFormat() {
  renderGrid();
  updateStats();
  showScreen('screenDeminingField');
}

/* ---------------------------------------------------------------------
 * Field generation
 * ------------------------------------------------------------------- */
function generateNewField() {
  const total = GRID_SIZE * GRID_SIZE;
  cells = Array.from({ length: total }, () => ({ status: 'unknown', outcome: null }));
}

function pickOutcome() {
  if (Math.random() > CLEAR_PROBABILITY) return 'clear';
  const idx = Math.floor(Math.random() * THREAT_CATALOG.length);
  return THREAT_CATALOG[idx].id;
}

function findThreatById(id) {
  return THREAT_CATALOG.find((th) => th.id === id) || null;
}

/* ---------------------------------------------------------------------
 * Grid rendering + interaction
 * ------------------------------------------------------------------- */
function renderGrid() {
  const lang = t('htmlLang');
  dom.grid.innerHTML = '';
  dom.grid.style.gridTemplateColumns = `repeat(${GRID_SIZE}, 1fr)`;

  cells.forEach((cell, i) => {
    const el = document.createElement('div');
    el.className = 'df-cell ' + (cell.status === 'unknown' ? 'unknown' : (cell.outcome === 'clear' ? 'cleared-safe' : 'cleared-threat'));

    if (cell.status === 'unknown') {
      el.textContent = '';
      el.addEventListener('click', () => onCellClick(i));
    } else if (cell.outcome === 'clear') {
      el.textContent = '✅';
    } else {
      const threat = findThreatById(cell.outcome);
      el.textContent = threat ? threat.marker : '✅';
    }
    dom.grid.appendChild(el);
  });

  const allCleared = cells.every((c) => c.status === 'cleared');
  dom.completeBanner.classList.toggle('show', allCleared);
  dom.btnNewField.style.display = allCleared ? 'block' : 'none';
  updateStats();
}

function updateStats() {
  dom.coinVal.textContent = getCoins();
  dom.areaVal.textContent = getClearedArea();
  const remaining = cells.filter((c) => c.status === 'unknown').length;
  dom.remainingVal.textContent = remaining;
}

function onCellClick(index) {
  if (working) return;
  const cell = cells[index];
  if (cell.status !== 'unknown') return;

  if (!spendCoins(CLEAR_COST)) {
    showReport(t('dfNotEnoughCoinsTitle'), t('dfNotEnoughCoinsText', CLEAR_COST), 'info');
    return;
  }

  working = true;
  updateStats();
  const cellEl = dom.grid.children[index];
  cellEl.classList.add('working');

  setTimeout(() => {
    const outcome = pickOutcome();
    cell.status = 'cleared';
    cell.outcome = outcome;

    addClearedArea(CELL_AREA_M2);
    if (outcome !== 'clear') {
      recordThreatFound(outcome);
    }

    renderGrid();
    working = false;
    showClearanceReport(outcome);
  }, 900);
}

function showClearanceReport(outcome) {
  if (outcome === 'clear') {
    showReport(t('dfReportClearTitle'), t('dfReportClearText'), 'safe');
    return;
  }
  const threat = findThreatById(outcome);
  const lang = t('htmlLang');
  const name = threat ? threat[lang].name : outcome;
  showReport(t('dfReportFoundTitle'), t('dfReportFoundText', name), 'danger');
}

function showReport(title, text, tone) {
  dom.reportCard.className = 'overlay-card ' + (tone === 'danger' ? 'wrong' : tone === 'safe' ? 'correct' : 'info');
  dom.reportTitle.textContent = title;
  dom.reportText.textContent = text;
  dom.reportOverlay.classList.add('show');
}

/* ---------------------------------------------------------------------
 * Threat catalogue / statistics screen
 * ------------------------------------------------------------------- */
function renderCatalog() {
  const lang = t('htmlLang');
  dom.catalogAreaVal.textContent = getClearedArea();
  dom.catalogList.innerHTML = '';

  THREAT_CATALOG.forEach((threat) => {
    const count = getThreatCount(threat.id);
    const el = document.createElement('div');
    el.className = 'df-catalog-item';
    el.innerHTML = `
      <div class="df-catalog-marker">${threat.marker}</div>
      <div class="df-catalog-body">
        <div class="df-catalog-name">${threat[lang].name}</div>
        <div class="df-catalog-desc">${threat[lang].desc}</div>
      </div>
      <div class="df-catalog-count">${count}</div>
    `;
    dom.catalogList.appendChild(el);
  });
}

/* ---------------------------------------------------------------------
 * Language refresh — called by app.js after setLang()
 * ------------------------------------------------------------------- */
export function refreshDeminingLabels() {
  document.getElementById('deminingFieldHeader').textContent = t('deminingFieldHeader');
  document.getElementById('dfAreaLabel').textContent = t('dfAreaLabel');
  document.getElementById('dfRemainingLabel').textContent = t('dfRemainingLabel');
  document.getElementById('dfCompleteText').textContent = t('dfCompleteText');
  dom.btnNewField.textContent = t('dfNewFieldBtn');
  dom.btnCatalog.textContent = t('dfCatalogBtn');
  dom.reportClose.textContent = t('dfReportCloseBtn');
  document.getElementById('threatCatalogHeader').textContent = t('threatCatalogHeader');
  document.getElementById('dfCatalogAreaLabel').textContent = t('dfCatalogAreaLabel');

  if (isScreenActive('screenDeminingField')) renderGrid();
  if (isScreenActive('screenThreatCatalog')) renderCatalog();
}

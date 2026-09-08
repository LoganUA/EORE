// js/modes/deminingField.js
//
// "Полігон розмінування" — Land Release & Threat Awareness simulator.
//
// This mode now runs a small roster of deminers rather than a single
// worker: each deminer is hired, works zones automatically when clicked,
// gets tired (spends "energy") and must rest, and can be upgraded
// individually in three stats:
//   - Stamina   — more energy before resting, and a shorter rest
//   - Equipment — cheaper clearance cost per zone
//   - Speed     — faster clearance (all three phases scale down together)
//
// Owns three screens: screenDeminingField, screenThreatCatalog,
// screenDeminerRoster.
//
// Public API consumed by app.js:
//   initDeminingField()      — call once, after the DOM is ready
//   startDeminingFormat()    — entry point (format card AND the menu shortcut)
//   refreshDeminingLabels()  — call after a language change
//   setAnimationSpeed(mult)  — test hook; scales BOTH work-phase and rest
//                              timing so the test suite runs fast without a
//                              second "fast mode" implementation to maintain.

import {
  getCoins, spendCoins,
  addClearedArea, getClearedArea,
  recordThreatFound, getThreatCount,
  getDeminers, getDeminer, hireDeminer, upgradeDeminerStat, getUpgradeStatCap,
  getFieldsCompleted, incrementFieldsCompleted
} from '../core/state.js';
import { t } from '../core/i18n.js';
import { registerScreens, showScreen, isScreenActive } from '../core/screens.js';

/* ---------------------------------------------------------------------
 * Field configuration
 * ------------------------------------------------------------------- */
const GRID_SIZE = 6;
const ZONE_AREA_M2 = 25;
const THREAT_PROBABILITY = 0.6;
const MAX_DEMINERS = 4; // kept small deliberately so the roster stays legible on a phone screen

/* ---------------------------------------------------------------------
 * Deminer stat formulas — each stat is a small, independently-purchased
 * upgrade track. Levels/caps live in state.js (getUpgradeStatCap); the
 * gameplay EFFECT of each level lives here.
 * ------------------------------------------------------------------- */
const STAMINA_BASE_ENERGY = 3;      // zones a level-0 deminer can clear before resting
const STAMINA_ENERGY_PER_LEVEL = 1; // +1 zone of stamina per level
const REST_BASE_MS = 8000;
const REST_REDUCTION_PER_LEVEL = 1000;
const REST_MIN_MS = 3000;

const EQUIP_BASE_COST = 5;
const EQUIP_REDUCTION_PER_LEVEL = 1;
const EQUIP_MIN_COST = 2;

const SPEED_REDUCTION_PER_LEVEL = 0.13; // each level shaves 13% off every work-phase duration

const UPGRADE_COST_BASE = 12; // upgrade to level N+1 costs UPGRADE_COST_BASE * (N+1)
const HIRE_COST_BASE = 30;    // hiring the (N+1)th deminer costs HIRE_COST_BASE * N
const COMMUNITY_BASE_COST = 25;
const COMMUNITY_COST_PER_FIELD = 10;

function maxEnergyFor(deminer) { return STAMINA_BASE_ENERGY + deminer.stamina * STAMINA_ENERGY_PER_LEVEL; }
function restMsFor(deminer) { return Math.max(REST_MIN_MS, REST_BASE_MS - deminer.stamina * REST_REDUCTION_PER_LEVEL); }
function costFor(deminer) { return Math.max(EQUIP_MIN_COST, EQUIP_BASE_COST - deminer.equipment * EQUIP_REDUCTION_PER_LEVEL); }
function speedMultiplierFor(deminer) { return Math.max(0.25, 1 - deminer.speed * SPEED_REDUCTION_PER_LEVEL); }
function upgradeCostFor(currentLevel) { return UPGRADE_COST_BASE * (currentLevel + 1); }
function hireCostFor(currentCount) { return HIRE_COST_BASE * currentCount; }
function communityCostFor(fieldsCompleted) { return COMMUNITY_BASE_COST + fieldsCompleted * COMMUNITY_COST_PER_FIELD; }

/* ---------------------------------------------------------------------
 * Animation timing (ms at normal speed, before a deminer's own speed
 * multiplier is applied on top). See setAnimationSpeed() for the test hook.
 * ------------------------------------------------------------------- */
let testSpeedMultiplier = 1;
const BASE_TIMING = { walk: 550, vegetation: 500, sweep: 600, reveal: 300 };
function phaseMs(key, deminer) {
  const ms = BASE_TIMING[key] * speedMultiplierFor(deminer) * testSpeedMultiplier;
  return Math.max(10, Math.round(ms));
}
function restMsScaled(deminer) {
  return Math.max(10, Math.round(restMsFor(deminer) * testSpeedMultiplier));
}
function wait(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }

/** Test-only hook — see the file header. Real gameplay never calls this. */
export function setAnimationSpeed(multiplier) {
  testSpeedMultiplier = multiplier;
}

/** Test-only introspection into a deminer's live work/rest state, since
 * that runtime state is intentionally not persisted or otherwise exposed. */
export function __debugRuntimeState(id) {
  const rt = runtime[id];
  return rt ? { state: rt.state, energy: rt.energy } : null;
}

/* ---------------------------------------------------------------------
 * Threat reference data — educational, factual, no glorified imagery.
 * ------------------------------------------------------------------- */
const THREAT_CATALOG = [
  {
    id: 'ppMineBlast',
    uk: { name: 'Протипіхотна фугасна міна', desc: 'Спрацьовує від тиску ноги. Деякі корпуси містять мінімум металу, тому не завжди виявляються звичайним металодетектором.' },
    en: { name: 'Anti-personnel blast mine', desc: 'Triggers from foot pressure. Some casings contain very little metal, so they are not always found by a standard metal detector.' }
  },
  {
    id: 'petalMine',
    uk: { name: 'Міна ПФМ-1 («пелюстка»)', desc: 'Невелика й пластикова, часто нагадує іграшку чи шматок пластику — тому особливо небезпечна для дітей.' },
    en: { name: 'PFM-1 mine ("petal mine")', desc: 'Small and plastic, often resembling a toy or a scrap of plastic — which makes it especially dangerous for children.' }
  },
  {
    id: 'atMine',
    uk: { name: 'Протитанкова міна', desc: 'Розрахована на великий тиск (вагу техніки), тому рідко спрацьовує від людини, але лишається смертельно небезпечною.' },
    en: { name: 'Anti-tank mine', desc: 'Designed to trigger under heavy weight, such as a vehicle, so it rarely detonates from a person\u2019s step but remains lethally dangerous.' }
  },
  {
    id: 'uxoShell',
    uk: { name: 'Нерозірваний артилерійський снаряд', desc: 'Не спрацював при пострілі, але лишається чутливим до дотику, тиску чи переміщення.' },
    en: { name: 'Unexploded artillery shell', desc: 'Failed to detonate on impact, but remains sensitive to touch, pressure, or movement.' }
  },
  {
    id: 'clusterSubmunition',
    uk: { name: 'Елемент касетного боєприпасу', desc: 'До 10\u201330% суббоєприпасів не спрацьовують одразу й перетворюються на міни-пастки непередбачуваної дії.' },
    en: { name: 'Cluster submunition', desc: 'Up to 10\u201330% of submunitions fail to detonate on impact and become unpredictable mine-like hazards.' }
  },
  {
    id: 'tripwireDevice',
    uk: { name: 'Пристрій з розтяжкою', desc: 'Прихований дріт, часто замаскований травою чи листям, з\u2019єднаний із детонатором.' },
    en: { name: 'Tripwire-rigged device', desc: 'A concealed wire, often hidden by grass or leaves, connected to a detonator.' }
  }
];

function findThreatById(id) {
  return THREAT_CATALOG.find((th) => th.id === id) || null;
}

/* ---------------------------------------------------------------------
 * Session state
 * ------------------------------------------------------------------- */
// zone.status: 'vegetated' -> 'cleared'; zone.assigned prevents double-dispatch.
let zones = [];
// Runtime-only per-deminer state (never persisted — only purchased LEVELS
// persist, via state.js). Keyed by deminer id.
// { state:'idle'|'working'|'resting', energy, spriteEl, barEl, restEndAt }
let runtime = {};

let dom = {};

/* ---------------------------------------------------------------------
 * Init
 * ------------------------------------------------------------------- */
export function initDeminingField() {
  registerScreens(['screenDeminingField', 'screenThreatCatalog', 'screenDeminerRoster']);
  cacheDom();
  wireListeners();
  generateNewField();
  syncRuntimeWithRoster();
  refreshDeminingLabels();
}

function cacheDom() {
  dom = {
    fieldWrap: document.getElementById('dfFieldWrap'),
    grid: document.getElementById('dfGrid'),
    coinVal: document.getElementById('dfCoinVal'),
    areaVal: document.getElementById('dfAreaVal'),
    remainingVal: document.getElementById('dfRemainingVal'),
    completeBanner: document.getElementById('dfCompleteBanner'),
    btnNewField: document.getElementById('dfBtnNewField'),
    btnCatalog: document.getElementById('dfBtnCatalog'),
    btnRoster: document.getElementById('dfBtnRoster'),
    backFromField: document.getElementById('backFromDeminingField'),
    reportOverlay: document.getElementById('dfReportOverlay'),
    reportCard: document.getElementById('dfReportCard'),
    reportTitle: document.getElementById('dfReportTitle'),
    reportText: document.getElementById('dfReportText'),
    reportClose: document.getElementById('dfReportClose'),
    catalogList: document.getElementById('dfCatalogList'),
    catalogAreaVal: document.getElementById('dfCatalogAreaVal'),
    backFromCatalog: document.getElementById('backFromCatalog'),
    rosterList: document.getElementById('dfRosterList'),
    btnHire: document.getElementById('dfBtnHire'),
    backFromRoster: document.getElementById('backFromRoster')
  };
}

function wireListeners() {
  dom.backFromField.addEventListener('click', () => showScreen('screenFormat'));
  dom.backFromCatalog.addEventListener('click', () => showScreen('screenDeminingField'));
  dom.backFromRoster.addEventListener('click', () => showScreen('screenDeminingField'));
  dom.btnCatalog.addEventListener('click', () => { renderCatalog(); showScreen('screenThreatCatalog'); });
  dom.btnRoster.addEventListener('click', () => { renderRoster(); showScreen('screenDeminerRoster'); });
  dom.btnNewField.addEventListener('click', onCommunityLiaisonClick);
  dom.btnHire.addEventListener('click', onHireClick);
  dom.reportClose.addEventListener('click', () => dom.reportOverlay.classList.remove('show'));
}

/* ---------------------------------------------------------------------
 * Entry point
 * ------------------------------------------------------------------- */
export function startDeminingFormat() {
  syncRuntimeWithRoster();
  renderField();
  showScreen('screenDeminingField');
}

/* ---------------------------------------------------------------------
 * Field generation
 * ------------------------------------------------------------------- */
function generateNewField() {
  const total = GRID_SIZE * GRID_SIZE;
  zones = Array.from({ length: total }, () => ({ status: 'vegetated', outcome: null, assigned: false }));
}

function pickOutcome() {
  if (Math.random() > THREAT_PROBABILITY) return 'clear';
  return THREAT_CATALOG[Math.floor(Math.random() * THREAT_CATALOG.length)].id;
}

/* ---------------------------------------------------------------------
 * Deminer runtime <-> persisted roster sync
 * ------------------------------------------------------------------- */
function syncRuntimeWithRoster() {
  const roster = getDeminers();
  roster.forEach((d) => {
    if (!runtime[d.id]) {
      runtime[d.id] = { state: 'idle', energy: maxEnergyFor(d), restEndAt: 0, spriteEl: null, barEl: null };
    }
  });
  renderDeminerSprites(roster);
}

function renderDeminerSprites(roster) {
  if (!dom.fieldWrap) return;
  // Remove sprites for deminers that no longer exist (never happens today —
  // there's no "fire" action — but keeps this function correct if that changes.
  Object.keys(runtime).forEach((id) => {
    if (!roster.find((d) => d.id === id) && runtime[id].spriteEl) {
      runtime[id].spriteEl.remove();
      delete runtime[id];
    }
  });

  roster.forEach((d, i) => {
    const rt = runtime[d.id];
    if (rt.spriteEl) return; // already created
    const wrap = document.createElement('div');
    wrap.className = 'df-deminer';
    wrap.innerHTML = `
      <div class="df-deminer-badge">${i + 1}</div>
      <div class="df-deminer-icon">🧑\u200d🔧</div>
      <div class="df-deminer-bar"><div class="df-deminer-bar-fill"></div></div>
    `;
    wrap.style.opacity = '0';
    dom.fieldWrap.appendChild(wrap);
    rt.spriteEl = wrap;
    rt.barEl = wrap.querySelector('.df-deminer-bar-fill');
    updateDeminerBar(d.id);
  });
}

function updateDeminerBar(id) {
  const d = getDeminer(id);
  const rt = runtime[id];
  if (!d || !rt || !rt.barEl) return;
  if (rt.state === 'resting') {
    rt.barEl.parentElement.classList.add('resting');
    const remaining = Math.max(0, rt.restEndAt - Date.now());
    const total = restMsScaled(d);
    const pct = total > 0 ? 100 - (remaining / total) * 100 : 100;
    rt.barEl.style.width = `${Math.min(100, Math.max(0, pct))}%`;
  } else {
    rt.barEl.parentElement.classList.remove('resting');
    const pct = (rt.energy / maxEnergyFor(d)) * 100;
    rt.barEl.style.width = `${pct}%`;
  }
}

/* ---------------------------------------------------------------------
 * Rendering — the field grid is (re)built on load / a new plot; individual
 * zone updates during clearance mutate the existing node in place so CSS
 * transitions can actually animate.
 * ------------------------------------------------------------------- */
function zoneMarkup() {
  return `
    <div class="df-soil"></div>
    <div class="df-grass"></div>
    <div class="df-sweep-line"></div>
    <div class="df-progress"><div class="df-progress-fill"></div></div>
    <div class="df-marker"></div>
    <div class="df-clearmark">\u2713</div>
  `;
}

function renderField() {
  dom.grid.innerHTML = '';
  dom.grid.style.gridTemplateColumns = `repeat(${GRID_SIZE}, 1fr)`;

  zones.forEach((zone, i) => {
    const el = document.createElement('div');
    el.className = 'df-zone';
    el.innerHTML = zoneMarkup();
    applyZoneClasses(el, zone);
    if (zone.status === 'vegetated') {
      el.addEventListener('click', () => onZoneClick(i));
    }
    dom.grid.appendChild(el);
  });

  Object.values(runtime).forEach((rt) => { if (rt.spriteEl) rt.spriteEl.style.opacity = '0'; });
  updateStatsAndCompletion();
}

function applyZoneClasses(el, zone) {
  el.classList.remove('vegetated', 'no-grass', 'sweeping', 'threat-marked', 'clear-marked');
  if (zone.status === 'vegetated') {
    el.classList.add('vegetated');
  } else {
    el.classList.add('no-grass');
    el.classList.add(zone.outcome === 'clear' ? 'clear-marked' : 'threat-marked');
  }
}

function updateStatsAndCompletion() {
  dom.coinVal.textContent = getCoins();
  dom.areaVal.textContent = getClearedArea();
  const remaining = zones.filter((z) => z.status === 'vegetated').length;
  dom.remainingVal.textContent = remaining;

  const allCleared = remaining === 0;
  dom.completeBanner.classList.toggle('show', allCleared);
  dom.btnNewField.style.display = allCleared ? 'block' : 'none';
  if (allCleared) {
    dom.btnNewField.textContent = t('dfCommunityBtn', communityCostFor(getFieldsCompleted()));
  }
}

/* ---------------------------------------------------------------------
 * Deminer sprite movement
 * ------------------------------------------------------------------- */
function positionDeminerAt(id, index) {
  const rt = runtime[id];
  const zoneEl = dom.grid.children[index];
  if (!rt || !rt.spriteEl || !zoneEl) return;
  const zoneRect = zoneEl.getBoundingClientRect();
  const wrapRect = dom.fieldWrap.getBoundingClientRect();
  const size = rt.spriteEl.offsetWidth || 26;

  const left = zoneRect.left - wrapRect.left + zoneRect.width / 2 - size / 2;
  const top = zoneRect.top - wrapRect.top + zoneRect.height / 2 - size / 2;

  rt.spriteEl.style.left = `${left}px`;
  rt.spriteEl.style.top = `${top}px`;
  rt.spriteEl.style.opacity = '1';
}

/* ---------------------------------------------------------------------
 * Deminer selection & work/rest cycle
 * ------------------------------------------------------------------- */
function findIdleDeminerId() {
  const roster = getDeminers();
  for (const d of roster) {
    if (runtime[d.id]?.state === 'idle') return d.id;
  }
  return null;
}

function beginRest(id) {
  const d = getDeminer(id);
  const rt = runtime[id];
  rt.state = 'resting';
  rt.restEndAt = Date.now() + restMsScaled(d);
  updateDeminerBar(id);
  const ms = restMsScaled(d);
  const ticker = setInterval(() => updateDeminerBar(id), 120);
  setTimeout(() => {
    clearInterval(ticker);
    rt.state = 'idle';
    rt.energy = maxEnergyFor(getDeminer(id));
    updateDeminerBar(id);
  }, ms);
}

async function onZoneClick(index) {
  const zone = zones[index];
  if (zone.status !== 'vegetated' || zone.assigned) return;

  const deminerId = findIdleDeminerId();
  if (!deminerId) {
    showReport(t('dfAllBusyTitle'), t('dfAllBusyText'), 'info');
    return;
  }

  const deminer = getDeminer(deminerId);
  const cost = costFor(deminer);
  if (!spendCoins(cost)) {
    showReport(t('dfNotEnoughCoinsTitle'), t('dfNotEnoughCoinsText', cost), 'info');
    return;
  }

  zone.assigned = true;
  updateStatsAndCompletion();
  await runClearanceSequence(deminerId, index);
}

async function runClearanceSequence(deminerId, index) {
  const rt = runtime[deminerId];
  const zone = zones[index];
  const zoneEl = dom.grid.children[index];
  rt.state = 'working';

  // Phase 0 — walk to the zone.
  rt.spriteEl.classList.add('walking');
  positionDeminerAt(deminerId, index);
  await wait(phaseMs('walk', getDeminer(deminerId)));
  rt.spriteEl.classList.remove('walking');

  // Phase 1 — cut vegetation. Phase 2 — sweep. The progress bar spans both.
  const workMs = phaseMs('vegetation', getDeminer(deminerId)) + phaseMs('sweep', getDeminer(deminerId));
  const progressFill = zoneEl.querySelector('.df-progress-fill');
  zoneEl.querySelector('.df-progress').classList.add('show');
  progressFill.style.transition = `width ${workMs}ms linear`;
  requestAnimationFrame(() => { progressFill.style.width = '100%'; });

  rt.spriteEl.classList.add('cutting');
  zoneEl.classList.add('no-grass');
  await wait(phaseMs('vegetation', getDeminer(deminerId)));
  rt.spriteEl.classList.remove('cutting');

  rt.spriteEl.classList.add('sweeping');
  zoneEl.classList.add('sweeping');
  await wait(phaseMs('sweep', getDeminer(deminerId)));
  zoneEl.classList.remove('sweeping');
  rt.spriteEl.classList.remove('sweeping');
  zoneEl.querySelector('.df-progress').classList.remove('show');

  // Phase 3 — resolve and mark.
  const outcome = pickOutcome();
  zone.status = 'cleared';
  zone.outcome = outcome;
  addClearedArea(ZONE_AREA_M2);
  if (outcome !== 'clear') recordThreatFound(outcome);

  zoneEl.classList.add(outcome === 'clear' ? 'clear-marked' : 'threat-marked');
  zoneEl.classList.remove('vegetated');
  await wait(phaseMs('reveal', getDeminer(deminerId)));

  // Spend energy; rest if depleted.
  rt.energy -= 1;
  if (rt.energy <= 0) {
    beginRest(deminerId);
  } else {
    rt.state = 'idle';
    updateDeminerBar(deminerId);
  }

  updateStatsAndCompletion();
  showClearanceReport(outcome);
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
 * New plot via community liaison (paid, once the current plot is fully
 * cleared) — replaces a free "next level" button on purpose: opening
 * access to a new plot of land is itself modeled as real coordination
 * work, not just a victory screen.
 * ------------------------------------------------------------------- */
function onCommunityLiaisonClick() {
  const cost = communityCostFor(getFieldsCompleted());
  if (!spendCoins(cost)) {
    showReport(t('dfNotEnoughCoinsTitle'), t('dfNotEnoughCoinsText', cost), 'info');
    return;
  }
  incrementFieldsCompleted();
  generateNewField();
  renderField();
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
      <div class="df-catalog-marker"></div>
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
 * Deminer roster / upgrades screen
 * ------------------------------------------------------------------- */
const STAT_KEYS = ['stamina', 'equipment', 'speed'];

function renderRoster() {
  const roster = getDeminers();
  dom.rosterList.innerHTML = '';

  roster.forEach((d, i) => {
    const rt = runtime[d.id] || { state: 'idle', energy: maxEnergyFor(d) };
    const el = document.createElement('div');
    el.className = 'df-roster-card';

    const stateLabel = rt.state === 'resting' ? t('dfStateResting') : rt.state === 'working' ? t('dfStateWorking') : t('dfStateIdle');

    const statsHtml = STAT_KEYS.map((key) => {
      const level = d[key];
      const cap = getUpgradeStatCap(key);
      const maxed = level >= cap;
      const cost = upgradeCostFor(level);
      const affordable = getCoins() >= cost;
      return `
        <div class="df-stat-row">
          <div class="df-stat-info">
            <span class="df-stat-label">${t('dfStat_' + key)}</span>
            <span class="df-stat-level">${level}/${cap}</span>
          </div>
          <button class="df-stat-upgrade" data-deminer="${d.id}" data-stat="${key}" ${maxed || !affordable ? 'disabled' : ''}>
            ${maxed ? t('dfStatMaxed') : t('dfUpgradeBtn', cost)}
          </button>
        </div>
      `;
    }).join('');

    el.innerHTML = `
      <div class="df-roster-head">
        <div class="df-roster-icon">🧑\u200d🔧<span class="df-roster-badge">${i + 1}</span></div>
        <div>
          <div class="df-roster-name">${t('dfDeminerName', i + 1)}</div>
          <div class="df-roster-state ${rt.state}">${stateLabel}</div>
        </div>
      </div>
      ${statsHtml}
    `;

    el.querySelectorAll('.df-stat-upgrade').forEach((btn) => {
      btn.addEventListener('click', () => {
        const cost = upgradeCostFor(getDeminer(d.id)[btn.dataset.stat]);
        if (spendCoins(cost)) {
          upgradeDeminerStat(d.id, btn.dataset.stat);
          renderRoster();
          updateStatsAndCompletion();
        }
      });
    });

    dom.rosterList.appendChild(el);
  });

  const hireCost = hireCostFor(roster.length);
  const atMax = roster.length >= MAX_DEMINERS;
  dom.btnHire.textContent = atMax ? t('dfMaxDeminersReached') : t('dfHireBtn', hireCost);
  dom.btnHire.disabled = atMax || getCoins() < hireCost;
}

function onHireClick() {
  const roster = getDeminers();
  if (roster.length >= MAX_DEMINERS) return;
  const cost = hireCostFor(roster.length);
  if (!spendCoins(cost)) {
    showReport(t('dfNotEnoughCoinsTitle'), t('dfNotEnoughCoinsText', cost), 'info');
    return;
  }
  hireDeminer();
  syncRuntimeWithRoster();
  renderRoster();
  updateStatsAndCompletion();
}

/* ---------------------------------------------------------------------
 * Language refresh — called by app.js after setLang()
 * ------------------------------------------------------------------- */
export function refreshDeminingLabels() {
  document.getElementById('deminingFieldHeader').textContent = t('deminingFieldHeader');
  document.getElementById('dfAreaLabel').textContent = t('dfAreaLabel');
  document.getElementById('dfRemainingLabel').textContent = t('dfRemainingLabel');
  document.getElementById('dfCompleteText').textContent = t('dfCompleteText');
  dom.btnCatalog.textContent = t('dfCatalogBtn');
  dom.btnRoster.textContent = t('dfRosterBtn');
  dom.reportClose.textContent = t('dfReportCloseBtn');
  document.getElementById('threatCatalogHeader').textContent = t('threatCatalogHeader');
  document.getElementById('dfCatalogAreaLabel').textContent = t('dfCatalogAreaLabel');
  document.getElementById('deminerRosterHeader').textContent = t('deminerRosterHeader');

  if (isScreenActive('screenDeminingField')) updateStatsAndCompletion();
  if (isScreenActive('screenThreatCatalog')) renderCatalog();
  if (isScreenActive('screenDeminerRoster')) renderRoster();
}

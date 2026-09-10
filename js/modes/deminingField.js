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
  recordThreatFound, getThreatCount, getDiscoveredThreats,
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
 * Threat categories — mirrors the top-level structure used in official
 * ordnance identification guides (aviation bombs, submunitions, mines,
 * shells, rockets, grenades, RPG rounds, drones, fuzes), narrowed down to
 * what's actually relevant to Ukraine. Grouping keeps the reference screen
 * readable instead of one long list of dozens of items.
 * ------------------------------------------------------------------- */
const THREAT_CATEGORIES = [
  { id: 'mines', uk: 'Наземні міни', en: 'Land mines' },
  { id: 'submunitions', uk: 'Касетні суббоєприпаси', en: 'Cluster submunitions' },
  { id: 'shells', uk: 'Снаряди та їх уламки', en: 'Shells & fragments' },
  { id: 'rockets', uk: 'Реактивні снаряди (РСЗВ)', en: 'Rocket artillery (MLRS)' },
  { id: 'grenades', uk: 'Гранати', en: 'Grenades' },
  { id: 'rpg', uk: 'Постріли РПГ', en: 'RPG rounds' },
  { id: 'drones', uk: 'Дрони-камікадзе', en: 'Kamikaze drones' },
  { id: 'fuzes', uk: 'Підривники та детонатори', en: 'Fuzes & detonators' }
];

/* ---------------------------------------------------------------------
 * Threat reference data — educational, factual, no glorified imagery.
 * Content is drawn from public ordnance-safety literature: what each item
 * is, roughly how it activates, why it's dangerous, an approximate safety
 * distance (deliberately general — awareness, not engineering data), and
 * the conflicts it's commonly associated with.
 *
 * `photo` is intentionally left null: the game currently represents every
 * threat with a neutral colour marker (see the CSS "df-catalog-marker"
 * class), not a photograph. If real, rights-cleared reference photos
 * become available later (e.g. from MAG's own materials or an official
 * government safety campaign), drop the image path into this field —
 * renderCatalog() already reads it and will display it automatically.
 * ------------------------------------------------------------------- */
const THREAT_CATALOG = [
  // ---- Наземні міни / Land mines ----
  {
    id: 'ppMineBlast', category: 'mines', photo: null,
    uk: { name: 'Протипіхотна фугасна міна', desc: 'Спрацьовує від тиску ноги — важить це буквально кілька кілограмів. Деякі корпуси майже не містять металу, тому звичайний металодетектор може її не «побачити». Такі міни масово застосовуються від Другої світової війни до сьогодні, включно з війною в Україні.' },
    en: { name: 'Anti-personnel blast mine', desc: 'Triggers from foot pressure — as little as a few kilograms of weight. Some casings contain almost no metal, so a standard detector can miss them. Used from World War II to today, including the war in Ukraine.' }
  },
  {
    id: 'atMine', category: 'mines', photo: null,
    uk: { name: 'Протитанкова міна', desc: 'Розрахована на вагу техніки, тому людина іноді може наступити й не підірвати її — але деякі моделі мають додаткові датчики руху чи нахилу, які реагують і на людей. Використовується від В\u2019єтнамської війни до нинішніх боїв в Україні.' },
    en: { name: 'Anti-tank mine', desc: 'Built to trigger under a vehicle\u2019s weight, so a person may sometimes step on one without setting it off — but some models have extra tilt or motion sensors that react to people too. Used from the Vietnam War through today\u2019s fighting in Ukraine.' }
  },
  {
    id: 'tripwireDevice', category: 'mines', photo: null,
    uk: { name: 'Пристрій з розтяжкою', desc: 'Тонкий, майже непомітний дріт, натягнутий біля землі й замаскований травою чи листям, з\u2019єднаний із детонатором. Досить найлегшого зачеплення ногою. Такий спосіб мінування використовують у більшості збройних конфліктів останніх ста років.' },
    en: { name: 'Tripwire-rigged device', desc: 'A thin, barely visible wire strung near the ground, hidden by grass or leaves and wired to a detonator. The lightest snag with a foot is enough. This method has been used in most armed conflicts of the last century.' }
  },

  // ---- Касетні суббоєприпаси / Cluster submunitions ----
  {
    id: 'petalMine', category: 'submunitions', photo: null,
    uk: { name: 'Міна ПФМ-1 («пелюстка»)', desc: 'Маленька пластикова міна у формі листка, яку скидають одразу сотнями з ракет чи касетних бомб. Через розмір і форму її легко сплутати з іграшкою чи шматком сміття — і саме тому вона особливо небезпечна для дітей. Масово застосовувалась в Афганістані, а тепер і в Україні.' },
    en: { name: 'PFM-1 mine ("petal mine")', desc: 'A small, leaf-shaped plastic mine scattered by the hundreds from rockets or cluster bombs. Its size and shape make it easy to mistake for a toy or a scrap of litter — which is exactly why it\u2019s so dangerous for children. Used extensively in Afghanistan, and now in Ukraine.' }
  },
  {
    id: 'clusterSubmunition', category: 'submunitions', photo: null,
    uk: { name: 'Елемент касетного боєприпасу', desc: 'До 10\u201330% суббоєприпасів не спрацьовують одразу при падінні й перетворюються на міни-пастки непередбачуваної дії — вони можуть здетонувати від найменшого дотику роками потому. Активно застосовуються в Україні з 2022 року.' },
    en: { name: 'Cluster submunition', desc: 'Up to 10\u201330% of submunitions fail to go off on impact and become unpredictable mine-like hazards — they can detonate from the slightest touch years later. Widely used in Ukraine since 2022.' }
  },
  {
    id: 'ptmSubmunition', category: 'submunitions', photo: null,
    uk: { name: 'Протитанковий суббоєприпас', desc: 'Мініатюрна версія протитанкової міни, яку розкидають одразу десятками з ракет над великою площею. Через малий розмір їх складно помітити серед трави чи ґрунту. З\u2019являються в Україні разом із касетними ударами з 2022 року.' },
    en: { name: 'Anti-tank submunition', desc: 'A miniature anti-tank mine scattered by the dozen from rockets over a wide area. Its small size makes it hard to spot in grass or soil. Seen in Ukraine alongside cluster strikes since 2022.' }
  },

  // ---- Снаряди та їх уламки / Shells & fragments ----
  {
    id: 'uxoShell', category: 'shells', photo: null,
    uk: { name: 'Нерозірваний артилерійський снаряд', desc: 'Не спрацював при пострілі чи падінні, але лишається повністю зарядженим і чутливим до дотику, тепла чи навіть різкого руху поруч. При спрацюванні уламки розлітаються на сотні метрів. У Європі досі знаходять і знешкоджують снаряди Першої світової війни.' },
    en: { name: 'Unexploded artillery shell', desc: 'Failed to detonate on firing or impact, but stays fully armed and sensitive to touch, heat, or even a sharp movement nearby. Fragments can travel hundreds of metres if it goes off. Shells from World War I are still being found and disposed of in Europe today.' }
  },
  {
    id: 'mortarMine', category: 'shells', photo: null,
    uk: { name: 'Мінометна міна', desc: 'Менша й легша за артилерійський снаряд, летить по крутій навісній траєкторії. Хвостовик-стабілізатор з додатковим порохом небезпечний навіть окремо від самої міни. Один із найпоширеніших боєприпасів у позиційних боях в Україні з 2014 року.' },
    en: { name: 'Mortar bomb', desc: 'Smaller and lighter than an artillery shell, fired on a steep, arcing path. Its tail-fin stabiliser carries extra propellant charges that are dangerous even separated from the bomb itself. One of the most common munitions in Ukraine\u2019s trench warfare since 2014.' }
  },
  {
    id: 'shellFragment', category: 'shells', photo: null,
    uk: { name: 'Уламок снаряда', desc: 'На вигляд це просто іржавий шматок металу неправильної форми — саме тому його найчастіше й піднімають, не підозрюючи небезпеки. Деякі уламки містять залишки вибухової речовини, здатної спалахнути від удару чи тертя. На око неможливо визначити, чи безпечний конкретний шматок металу.' },
    en: { name: 'Shell fragment', desc: 'It just looks like a rusty, oddly-shaped piece of metal — which is exactly why people pick it up without a second thought. Some fragments still carry explosive residue that can ignite from an impact or friction. There\u2019s no way to tell by eye whether a given piece of metal is safe.' }
  },

  // ---- Реактивні снаряди (РСЗВ) / Rocket artillery (MLRS) ----
  {
    id: 'gradRocket', category: 'rockets', photo: null,
    uk: { name: 'Реактивний снаряд «Град»', desc: 'Некерована ракета калібру 122 мм, яку випускають залпами по кілька десятків одразу. Частина ракет не розривається при падінні й лишається в землі повністю зарядженою. Один із найпоширеніших боєприпасів війни в Україні з 2014 року.' },
    en: { name: '"Grad" rocket', desc: 'An unguided 122mm rocket fired in salvos of dozens at once. Some fail to detonate on impact and remain fully armed in the ground. One of the most common munitions of the war in Ukraine since 2014.' }
  },
  {
    id: 'mlrsCluster', category: 'rockets', photo: null,
    uk: { name: 'Касетна бойова частина РСЗВ', desc: 'Ракети «Ураган» і «Смерч» часто несуть не суцільний заряд, а десятки дрібних суббоєприпасів, які розсіюються над великою площею. Один-єдиний залп може лишити небезпечними уламками цілий гектар поля. Активно фіксується в Україні з 2022 року.' },
    en: { name: 'MLRS cluster warhead', desc: '"Uragan" and "Smerch" rockets often carry dozens of small submunitions instead of one solid charge, scattered across a wide area. A single salvo can leave an entire hectare littered with hazards. Widely documented in Ukraine since 2022.' }
  },

  // ---- Гранати / Grenades ----
  {
    id: 'handGrenade', category: 'grenades', photo: null,
    uk: { name: 'Ручна осколкова граната', desc: 'Активується висмикуванням чеки й падінням запобіжного важеля — вибух стається за кілька секунд. Осколки розлітаються в радіусі 15\u201325 метрів, тому небезпечна навіть для того, хто її кинув. Стандартне озброєння піхоти з часів Другої світової війни.' },
    en: { name: 'Fragmentation hand grenade', desc: 'Activated by pulling the pin and releasing the safety lever — it detonates a few seconds later. Fragments spread up to 15\u201325 metres, making it dangerous even for whoever threw it. Standard infantry equipment since World War II.' }
  },
  {
    id: 'rifleGrenade', category: 'grenades', photo: null,
    uk: { name: 'Рушнична граната', desc: 'Виглядає як звичайна граната з хвостовиком для запуску зі ствола автомата. Летить набагато далі за ручну гранату — до 100\u2013150 метрів, тому й небезпечна зона значно більша. Використовується арміями багатьох країн, включно зі сторонами конфлікту в Україні.' },
    en: { name: 'Rifle grenade', desc: 'Looks like a regular grenade with a tail fin for launching from a rifle barrel. It travels far further than a hand-thrown grenade — up to 100\u2013150 metres — so its danger zone is much larger too. Used by many armies worldwide, including in the war in Ukraine.' }
  },

  // ---- Постріли РПГ / RPG rounds ----
  {
    id: 'rpgRound', category: 'rpg', photo: null,
    uk: { name: 'Постріл РПГ (кумулятивний)', desc: 'Протитанковий заряд, що пробиває броню спрямованим струменем розпеченого металу, а не просто вибуховою хвилею. Якщо постріл не влучив чи не розірвався, він лишається на землі повністю боєздатним. РПГ-7 та його аналоги застосовуються по всьому світу з 1960-х років.' },
    en: { name: 'RPG round (shaped charge)', desc: 'An anti-armour charge that punches through armour with a focused jet of molten metal rather than just a blast wave. If a round misses or fails to detonate, it stays fully live on the ground. The RPG-7 and similar launchers have been used worldwide since the 1960s.' }
  },
  {
    id: 'rpgThermobaric', category: 'rpg', photo: null,
    uk: { name: 'Термобаричний постріл', desc: 'Створює хмару вибухової суміші, яка займається за частку секунди й уражає вибуховою хвилею на значно більшій площі, ніж звичайний заряд. Особливо небезпечний у закритих приміщеннях. Дедалі частіше застосовується в боях за населені пункти в Україні.' },
    en: { name: 'Thermobaric round', desc: 'Releases a cloud of explosive mixture that ignites in a fraction of a second, producing a blast wave over a much wider area than a standard charge. Especially dangerous indoors. Increasingly used in urban fighting in Ukraine.' }
  },

  // ---- Дрони-камікадзе / Kamikaze drones ----
  {
    id: 'kamikazeDrone', category: 'drones', photo: null,
    uk: { name: 'Дрон-камікадзе', desc: 'Безпілотник, який не повертається на базу, а самостійно летить до цілі й вибухає при зіткненні. Часто несе бойову частину вагою в десятки кілограмів, тому уламки можуть розлітатись на сотні метрів. Такі дрони (наприклад, «Шахед»/«Герань») стали одним із символів повітряних атак на Україну з 2022 року.' },
    en: { name: 'Kamikaze drone', desc: 'An uncrewed aircraft that doesn\u2019t return to base — it flies itself into a target and explodes on impact. Warheads can weigh dozens of kilograms, scattering fragments hundreds of metres. Drones like "Shahed"/"Geran" have become a defining feature of air attacks on Ukraine since 2022.' }
  },
  {
    id: 'droneWarhead', category: 'drones', photo: null,
    uk: { name: 'Бойова частина дрона окремо від корпусу', desc: 'Збитий чи впалий дрон часто розвалюється на частини — бойова частина при цьому іноді лишається неушкодженою і повністю небезпечною, навіть окремо від решти корпусу. Її легко сплутати з уламком звичайної електроніки. Такі знахідки фіксують в Україні щодня.' },
    en: { name: 'Drone warhead, separated from the airframe', desc: 'A downed or crashed drone often breaks apart — the warhead can survive intact and fully dangerous even separated from the rest of the airframe. It\u2019s easy to mistake for ordinary electronics debris. Finds like this are reported daily across Ukraine.' }
  },

  // ---- Підривники та детонатори / Fuzes & detonators ----
  {
    id: 'fuzeDetonator', category: 'fuzes', photo: null,
    uk: { name: 'Підривник (детонатор)', desc: 'Невеликий механізм, що ініціює вибух основного заряду, — і саме він найчутливіший до удару, тепла чи тиску серед усіх частин боєприпасу. Може лежати окремо від снаряда чи міни й досі становити смертельну небезпеку. Тип підривника неможливо визначити на око.' },
    en: { name: 'Fuze (detonator)', desc: 'A small mechanism that triggers the main explosive charge — and the single most sensitive part of any munition to shock, heat, or pressure. It can be found separated from the shell or mine it belonged to and remain just as deadly. There\u2019s no way to identify a fuze type by eye.' }
  },
  {
    id: 'initiatorCap', category: 'fuzes', photo: null,
    uk: { name: 'Капсуль-детонатор', desc: 'Найменший і водночас один із найчутливіших елементів у будь-якому боєприпасі — важить лише кілька грамів, але цього достатньо, щоб ініціювати набагато потужніший заряд поруч. Через мініатюрний розмір його часто плутають із дрібним металевим сміттям. Знаходять окремо від боєприпасів практично на всіх колишніх позиціях бойових дій.' },
    en: { name: 'Blasting cap', desc: 'One of the smallest yet most sensitive components in any munition — it weighs only a few grams, but that\u2019s enough to set off a far more powerful charge nearby. Its tiny size means it\u2019s often mistaken for scrap metal. Found separated from munitions at nearly every former combat position.' }
  }
];

function findThreatById(id) {
  return THREAT_CATALOG.find((th) => th.id === id) || null;
}

function threatsByCategory(categoryId) {
  return THREAT_CATALOG.filter((th) => th.category === categoryId);
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
// The most recently discovered threat id, so the catalogue can highlight it
// the next time the player opens that screen. Not persisted — purely a
// same-session "here's what you just found" pointer, not a game mechanic.
let lastFoundThreatId = null;

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
    catalogBadge: document.getElementById('dfCatalogBadge'),
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

  updateCatalogBadge();
}

function updateCatalogBadge() {
  if (!dom.catalogBadge) return;
  const total = Object.values(getDiscoveredThreats()).reduce((a, b) => a + b, 0);
  dom.catalogBadge.textContent = total > 99 ? '99+' : String(total);
  dom.catalogBadge.style.display = total > 0 ? 'inline-flex' : 'none';
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
  if (outcome !== 'clear') lastFoundThreatId = outcome;

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

  THREAT_CATEGORIES.forEach((category) => {
    const items = threatsByCategory(category.id);
    if (!items.length) return;

    const header = document.createElement('div');
    header.className = 'df-catalog-category';
    header.textContent = category[lang];
    dom.catalogList.appendChild(header);

    items.forEach((threat) => {
      const count = getThreatCount(threat.id);
      const discovered = count > 0;
      const el = document.createElement('div');
      el.className = 'df-catalog-item' + (discovered ? '' : ' not-found') + (threat.id === lastFoundThreatId ? ' just-found' : '');

      const photoHtml = threat.photo
        ? `<img class="df-catalog-photo" src="${threat.photo}" alt="${threat[lang].name}">`
        : `<div class="df-catalog-marker"></div>`;

      el.innerHTML = `
        ${photoHtml}
        <div class="df-catalog-body">
          <div class="df-catalog-name">${threat[lang].name}</div>
          <div class="df-catalog-desc">${threat[lang].desc}</div>
        </div>
        <div class="df-catalog-count">${discovered ? count : '\u2014'}</div>
      `;
      dom.catalogList.appendChild(el);
    });
  });

  const justFoundEl = dom.catalogList.querySelector('.just-found');
  if (justFoundEl) {
    justFoundEl.scrollIntoView?.({ block: 'center' });
  }
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
  dom.btnCatalog.querySelector('.df-btn-label').textContent = t('dfCatalogBtn');
  dom.btnRoster.textContent = t('dfRosterBtn');
  dom.reportClose.textContent = t('dfReportCloseBtn');
  document.getElementById('threatCatalogHeader').textContent = t('threatCatalogHeader');
  document.getElementById('dfCatalogAreaLabel').textContent = t('dfCatalogAreaLabel');
  document.getElementById('deminerRosterHeader').textContent = t('deminerRosterHeader');

  updateCatalogBadge();
  if (isScreenActive('screenDeminingField')) updateStatsAndCompletion();
  if (isScreenActive('screenThreatCatalog')) renderCatalog();
  if (isScreenActive('screenDeminerRoster')) renderRoster();
}

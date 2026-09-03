// js/app.js
//
// The only file index.html loads directly (<script type="module" src="js/app.js">).
// Responsibilities, and *only* these:
//   1. Own screenMenu + screenFormat (the two screens above any single mode).
//   2. Initialize every mode module.
//   3. Wire the handful of things that are inherently cross-module and so
//      don't belong inside any single mode file: the language switch, and
//      the two "try the other mode" buttons on each mode's end screen.
//
// Adding a new mode later (see deminingField.js) means: write the mode
// module the same way swipeGame.js/questGame.js are written (it owns its
// own screens, exports an init + start + refreshLabels function), then add
// three lines here — import it, call its init, add its format card. Nothing
// inside the existing modes needs to change.

import { getCoins, setLang, onStateChange } from './core/state.js';
import { t } from './core/i18n.js';
import { registerScreens, showScreen } from './core/screens.js';
import { initSwipeGame, startSwipeFormat, startTrueFalseFormat, refreshSwipeLabels } from './modes/swipeGame.js';
import { initQuestGame, startQuestFormat, refreshQuestLabels } from './modes/questGame.js';
import { initDeminingField, startDeminingFormat, refreshDeminingLabels } from './modes/deminingField.js';

/* ---------------------------------------------------------------------
 * DOM refs (this module's own screens only)
 * ------------------------------------------------------------------- */
const dom = {};

function cacheDom() {
  dom.brandHome = document.getElementById('brandHome');
  dom.brandLabel = document.getElementById('brandLabel');
  dom.langUk = document.getElementById('langUk');
  dom.langEn = document.getElementById('langEn');
  dom.menuCoinVal = document.getElementById('menuCoinVal');
  dom.menuTitle = document.getElementById('menuTitle');
  dom.menuSubtitle = document.getElementById('menuSubtitle');
  dom.btnGoFormat = document.getElementById('btnGoFormat');
  dom.btnGoShop = document.getElementById('btnGoShop');
  dom.backFromFormat = document.getElementById('backFromFormat');
  dom.formatHeader = document.getElementById('formatHeader');
  dom.formatSwipe = document.getElementById('formatSwipe');
  dom.formatSwipeTitle = document.getElementById('formatSwipeTitle');
  dom.formatSwipeDesc = document.getElementById('formatSwipeDesc');
  dom.formatQuest = document.getElementById('formatQuest');
  dom.formatQuestTitle = document.getElementById('formatQuestTitle');
  dom.formatQuestDesc = document.getElementById('formatQuestDesc');
  dom.formatTruth = document.getElementById('formatTruth');
  dom.formatTruthTitle = document.getElementById('formatTruthTitle');
  dom.formatTruthDesc = document.getElementById('formatTruthDesc');
  dom.formatField = document.getElementById('formatField');
  dom.formatFieldTitle = document.getElementById('formatFieldTitle');
  dom.formatFieldDesc = document.getElementById('formatFieldDesc');
  dom.btnSwipeToQuest = document.getElementById('btnSwipeToQuest');
  dom.btnQuestToSwipe = document.getElementById('btnQuestToSwipe');
  dom.questToSwipeLabel = document.getElementById('questToSwipeLabel');
  dom.swipeToQuestLabel = document.getElementById('swipeToQuestLabel');
}

/* ---------------------------------------------------------------------
 * Wiring
 * ------------------------------------------------------------------- */
function wireTopbarAndMenu() {
  dom.brandHome.addEventListener('click', () => showScreen('screenMenu'));
  dom.langUk.addEventListener('click', () => switchLanguage('uk'));
  dom.langEn.addEventListener('click', () => switchLanguage('en'));

  dom.btnGoFormat.addEventListener('click', () => showScreen('screenFormat'));
  dom.btnGoShop.addEventListener('click', () => showScreen('screenShop'));
  dom.backFromFormat.addEventListener('click', () => showScreen('screenMenu'));

  dom.formatSwipe.addEventListener('click', startSwipeFormat);
  dom.formatQuest.addEventListener('click', startQuestFormat);
  dom.formatTruth.addEventListener('click', startTrueFalseFormat);
  dom.formatField.addEventListener('click', startDeminingFormat);
}

/**
 * The two cross-promo buttons live on swipeGame's and questGame's own end
 * screens, but wiring them here — rather than inside either mode module —
 * is what keeps the two modes decoupled from each other. Each mode only
 * needs to know the OTHER mode's public start function, both of which
 * app.js already has in scope.
 */
function wireCrossPromo() {
  if (dom.btnSwipeToQuest) {
    dom.btnSwipeToQuest.addEventListener('click', startQuestFormat);
  }
  if (dom.btnQuestToSwipe) {
    dom.btnQuestToSwipe.addEventListener('click', startSwipeFormat);
  }
}

/** Keeps the coin badge on the main menu correct no matter which mode (or
 * future mode) is the one actually earning/spending the coins. */
function wireCoinBadge() {
  const update = () => { if (dom.menuCoinVal) dom.menuCoinVal.textContent = getCoins(); };
  update();
  onStateChange(update);
}

/* ---------------------------------------------------------------------
 * Language
 * ------------------------------------------------------------------- */
function switchLanguage(lang) {
  setLang(lang);
  refreshAppLabels();
  refreshSwipeLabels();
  refreshQuestLabels();
  refreshDeminingLabels();
}

function refreshAppLabels() {
  const lang = t('htmlLang');
  document.documentElement.setAttribute('lang', lang);
  document.title = t('title');

  dom.langUk.classList.toggle('active', lang === 'uk');
  dom.langEn.classList.toggle('active', lang === 'en');

  dom.brandLabel.textContent = t('brand');
  dom.menuTitle.textContent = t('menuTitle');
  dom.menuSubtitle.textContent = t('menuSubtitle');
  dom.btnGoFormat.textContent = t('startBtn');
  dom.btnGoShop.textContent = t('shopBtnMenu');
  dom.formatHeader.textContent = t('formatHeader');
  dom.formatSwipeTitle.textContent = t('formatSwipeTitle');
  dom.formatSwipeDesc.textContent = t('formatSwipeDesc');
  dom.formatQuestTitle.textContent = t('formatQuestTitle');
  dom.formatQuestDesc.textContent = t('formatQuestDesc');
  dom.formatTruthTitle.textContent = t('formatTruthTitle');
  dom.formatTruthDesc.textContent = t('formatTruthDesc');
  dom.formatFieldTitle.textContent = t('formatFieldTitle');
  dom.formatFieldDesc.textContent = t('formatFieldDesc');

  if (dom.questToSwipeLabel) dom.questToSwipeLabel.textContent = t('questToSwipeLabel');
  if (dom.swipeToQuestLabel) dom.swipeToQuestLabel.textContent = t('swipeToQuestLabel');
}

/* ---------------------------------------------------------------------
 * Boot
 * ------------------------------------------------------------------- */
function boot() {
  registerScreens(['screenMenu', 'screenFormat']);
  cacheDom();

  initSwipeGame();
  initQuestGame();
  initDeminingField();

  wireTopbarAndMenu();
  wireCrossPromo();
  wireCoinBadge();
  refreshAppLabels();

  showScreen('screenMenu');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}

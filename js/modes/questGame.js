// js/modes/questGame.js
//
// Owns five screens: screenQuestAge, screenQuestList, screenStory,
// screenPhone, screenQuestEnd, plus the always-present consequenceOverlay.
//
// Flow: age select -> scenario select -> a chain of story nodes (each a
// STOP-protocol decision point) -> a phone-dial node (call 101) -> end.
// A wrong story choice never ends the run — it shows why it was risky and
// loops back to the same decision point until the person picks correctly.
//
// Public API consumed by app.js:
//   initQuestGame()       — call once, after the DOM is ready
//   startQuestFormat()    — entry point for the "Investigation" format card
//   refreshQuestLabels()  — call after a language change
//
// Like swipeGame.js, this module does NOT wire the cross-mode "try Safe or
// Danger" button on its own end screen — see the note at the bottom.

import { addCoins } from '../core/state.js';
import { t, getAllLevelMeta } from '../core/i18n.js';
import { QUESTS, getQuestIds, getQuestVariant } from '../data/decks.js';
import { registerScreens, showScreen, isScreenActive } from '../core/screens.js';

const QUEST_PERFECT_BONUS = 5;

/* ---------------------------------------------------------------------
 * Session state — local to one quest run, not persisted.
 * ------------------------------------------------------------------- */
let selectedQuestAge = null;
let currentQuestId = null;
let currentNodeId = null;
let questMistakeCount = 0;
let phoneInput = '';

let dom = {};

/* ---------------------------------------------------------------------
 * Init
 * ------------------------------------------------------------------- */
export function initQuestGame() {
  registerScreens(['screenQuestAge', 'screenQuestList', 'screenStory', 'screenPhone', 'screenQuestEnd']);
  cacheDom();
  wireListeners();
  refreshQuestLabels();
}

function cacheDom() {
  dom = {
    questAgeList: document.getElementById('questAgeList'),
    questCardList: document.getElementById('questCardList'),
    backFromQuestAge: document.getElementById('backFromQuestAge'),
    backFromQuestList: document.getElementById('backFromQuestList'),
    backFromStory: document.getElementById('backFromStory'),
    stopTracker: document.getElementById('stopTracker'),
    stopTrackerPhone: document.getElementById('stopTrackerPhone'),
    storyCard: document.getElementById('storyCard'),
    storyText: document.getElementById('storyText'),
    storyOptions: document.getElementById('storyOptions'),
    consequenceOverlay: document.getElementById('consequenceOverlay'),
    consequenceText: document.getElementById('consequenceText'),
    consequenceRetry: document.getElementById('consequenceRetry'),
    phonePrompt: document.getElementById('phonePrompt'),
    phoneDigits: document.getElementById('phoneDigits'),
    phoneDisplay: document.getElementById('phoneDisplay'),
    phoneError: document.getElementById('phoneError'),
    keypad: document.getElementById('keypad'),
    callBtn: document.getElementById('callBtn'),
    callingDots: document.getElementById('callingDots'),
    questEndTitle: document.getElementById('questEndTitle'),
    questEndText: document.getElementById('questEndText'),
    protocolRecap: document.getElementById('protocolRecap'),
    questBonusNote: document.getElementById('questBonusNote'),
    btnQuestEndMenu: document.getElementById('btnQuestEndMenu'),
    btnQuestEndReplay: document.getElementById('btnQuestEndReplay')
  };
}

function wireListeners() {
  dom.backFromQuestAge.addEventListener('click', () => showScreen('screenFormat'));
  dom.backFromQuestList.addEventListener('click', () => showScreen('screenQuestAge'));
  dom.backFromStory.addEventListener('click', () => showScreen('screenQuestList'));
  dom.btnQuestEndMenu.addEventListener('click', () => {
    renderQuestList();
    showScreen('screenQuestList');
  });
  dom.btnQuestEndReplay.addEventListener('click', () => startQuest(currentQuestId));
  dom.consequenceRetry.addEventListener('click', () => dom.consequenceOverlay.classList.remove('show'));
}

/* ---------------------------------------------------------------------
 * Entry point (called by app.js from the format-select screen)
 * ------------------------------------------------------------------- */
export function startQuestFormat() {
  renderQuestAgeList();
  showScreen('screenQuestAge');
}

/* ---------------------------------------------------------------------
 * Age / scenario lists
 * ------------------------------------------------------------------- */
function renderQuestAgeList() {
  dom.questAgeList.innerHTML = '';
  getAllLevelMeta().forEach(({ id, title, desc, icon }) => {
    const el = document.createElement('div');
    el.className = 'level-card';
    el.innerHTML = `<div class="lc-icon">${icon}</div><div><div class="lc-title">${title}</div><div class="lc-desc">${desc}</div></div>`;
    el.addEventListener('click', () => {
      selectedQuestAge = id;
      renderQuestList();
      showScreen('screenQuestList');
    });
    dom.questAgeList.appendChild(el);
  });
}

function renderQuestList() {
  if (!selectedQuestAge) return;
  const lang = t('htmlLang');
  dom.questCardList.innerHTML = '';
  getQuestIds().forEach((id) => {
    const variant = getQuestVariant(id, selectedQuestAge);
    const el = document.createElement('div');
    el.className = 'level-card';
    el.innerHTML = `<div class="lc-icon">${QUESTS[id].icon}</div><div><div class="lc-title">${variant[lang].title}</div><div class="lc-desc">${variant[lang].desc}</div></div>`;
    el.addEventListener('click', () => startQuest(id));
    dom.questCardList.appendChild(el);
  });
}

/* ---------------------------------------------------------------------
 * Core quest loop
 * ------------------------------------------------------------------- */
function activeNodeSet(questId) {
  return getQuestVariant(questId, selectedQuestAge).nodes;
}

function startQuest(id) {
  const lang = t('htmlLang');
  currentQuestId = id;
  questMistakeCount = 0;
  const variant = getQuestVariant(id, selectedQuestAge);
  const firstNodeId = Object.keys(variant.nodes)[0];

  showScreen('screenStory');
  renderStopTracker(0);
  dom.storyText.textContent = variant[lang].intro;
  dom.storyOptions.innerHTML = `<button class="q-opt-btn" id="introContinue"><span class="q-opt-letter">▶</span><span>${t('startQuestBtn')}</span></button>`;
  document.getElementById('introContinue').addEventListener('click', () => renderNode(firstNodeId));
  dom.storyCard.style.animation = 'none';
  void dom.storyCard.offsetWidth;
  dom.storyCard.style.animation = '';
}

function renderStopTracker(activeIndex) {
  const labels = t('stopLabels');
  [dom.stopTracker, dom.stopTrackerPhone].forEach((tracker) => {
    if (!tracker) return;
    tracker.innerHTML = '';
    labels.forEach((label, i) => {
      const el = document.createElement('div');
      el.className = 'q-stop-step';
      if (i < activeIndex) el.classList.add('done');
      else if (i === activeIndex) el.classList.add('active');
      el.textContent = label;
      tracker.appendChild(el);
    });
  });
}

function renderNode(nodeId) {
  const lang = t('htmlLang');
  currentNodeId = nodeId;
  const nodeset = activeNodeSet(currentQuestId);
  const node = nodeset[nodeId];
  const nd = node[lang];

  if (node.type === 'story') {
    showScreen('screenStory');
    renderStopTracker(node.stopIndex);
    dom.storyText.textContent = nd.text;
    dom.storyOptions.innerHTML = '';
    const letters = t('optionLetters');
    nd.options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'q-opt-btn';
      btn.innerHTML = `<span class="q-opt-letter">${letters[i]}</span><span>${opt.label}</span>`;
      btn.addEventListener('click', () => handleChoice(node, opt));
      dom.storyOptions.appendChild(btn);
    });
    dom.storyCard.style.animation = 'none';
    void dom.storyCard.offsetWidth;
    dom.storyCard.style.animation = '';
  } else if (node.type === 'call') {
    showScreen('screenPhone');
    renderStopTracker(node.stopIndex);
    setupPhone(node);
  } else if (node.type === 'end') {
    showScreen('screenQuestEnd');
    renderStopTracker(4);
    dom.questEndTitle.textContent = nd.title;
    dom.questEndText.textContent = nd.text;
    dom.protocolRecap.innerHTML = '';
    t('stopLabels').forEach((label, i) => {
      const el = document.createElement('div');
      el.className = 'q-pr-item';
      el.innerHTML = `<div class="q-pr-num">${i + 1}</div><div class="q-pr-label">${label}</div>`;
      dom.protocolRecap.appendChild(el);
    });

    if (questMistakeCount === 0) {
      addCoins(QUEST_PERFECT_BONUS);
      dom.questBonusNote.textContent = t('questBonusEarned', QUEST_PERFECT_BONUS);
    } else {
      dom.questBonusNote.textContent = t('questBonusMissed', QUEST_PERFECT_BONUS);
    }
    dom.questBonusNote.classList.add('show');
  }
}

function handleChoice(node, opt) {
  if (opt.correct) {
    renderNode(opt.next);
  } else {
    questMistakeCount++;
    dom.consequenceText.textContent = opt.consequence;
    dom.consequenceOverlay.classList.add('show');
  }
}

/* ---------------------------------------------------------------------
 * Phone-dial mechanic
 * ------------------------------------------------------------------- */
function setupPhone(node) {
  const lang = t('htmlLang');
  const nd = node[lang];
  phoneInput = '';
  dom.phonePrompt.textContent = nd.prompt;
  dom.phoneDigits.innerHTML = '&nbsp;';
  dom.phoneError.classList.remove('show');
  dom.callingDots.classList.remove('show');
  dom.callBtn.disabled = true;
  dom.callBtn.style.display = 'flex';

  dom.keypad.innerHTML = '';
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '⌫', '0', 'ok'];
  keys.forEach((k) => {
    const btn = document.createElement('div');
    if (k === 'ok') {
      btn.style.visibility = 'hidden';
      btn.className = 'q-key';
    } else if (k === '⌫') {
      btn.className = 'q-key back';
      btn.textContent = '⌫';
      btn.addEventListener('click', () => {
        phoneInput = phoneInput.slice(0, -1);
        updatePhoneDisplay();
      });
    } else {
      btn.className = 'q-key';
      btn.textContent = k;
      btn.addEventListener('click', () => {
        if (phoneInput.length < 6) {
          phoneInput += k;
          updatePhoneDisplay();
        }
      });
    }
    dom.keypad.appendChild(btn);
  });

  dom.callBtn.onclick = () => attemptCall(node);
  updatePhoneDisplay();
}

function updatePhoneDisplay() {
  dom.phoneDigits.innerHTML = phoneInput.length ? phoneInput : '&nbsp;';
  dom.callBtn.disabled = phoneInput.length === 0;
}

function attemptCall(node) {
  const lang = t('htmlLang');
  const nd = node[lang];
  if (phoneInput === node.correctNumber) {
    dom.phoneError.classList.remove('show');
    dom.callBtn.style.display = 'none';
    dom.callingDots.classList.add('show');
    setTimeout(() => renderNode(node.next), 1100);
  } else {
    dom.phoneError.textContent = nd.wrong[phoneInput] || nd.wrongDefault;
    dom.phoneError.classList.add('show');
    dom.phoneDisplay.classList.remove('shake');
    void dom.phoneDisplay.offsetWidth;
    dom.phoneDisplay.classList.add('shake');
    phoneInput = '';
    updatePhoneDisplay();
  }
}

/* ---------------------------------------------------------------------
 * Language refresh — called by app.js after setLang()
 * ------------------------------------------------------------------- */
export function refreshQuestLabels() {
  document.getElementById('questAgeHeader').textContent = t('questAgeHeader');
  document.getElementById('questListHeader').textContent = t('questListHeader');
  document.getElementById('backToScenariosLabel').textContent = t('backToScenariosLabel');
  document.getElementById('callBtnLabel').textContent = t('callBtnLabel');
  dom.consequenceRetry.textContent = t('consequenceRetryBtn');
  document.getElementById('consequenceTitle').textContent = t('consequenceTitle');
  dom.btnQuestEndMenu.textContent = t('questEndMenuBtn');
  dom.btnQuestEndReplay.textContent = t('questEndReplayBtn');

  renderQuestAgeList();
  if (selectedQuestAge) renderQuestList();

  // If a live quest screen is showing right now, re-render its content
  // in the new language instead of waiting for the next click.
  if (currentQuestId && (isScreenActive('screenStory') || isScreenActive('screenPhone') || isScreenActive('screenQuestEnd'))) {
    renderNode(currentNodeId);
  }
}

/* app.js is expected to additionally wire, once swipeGame.js is also
 * initialized:
 *   document.getElementById('btnQuestToSwipe').addEventListener('click', ...)
 * This module intentionally does not reach into swipeGame.js's screens. */

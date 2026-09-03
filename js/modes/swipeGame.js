// js/modes/swipeGame.js
//
// Owns five screens: screenLevel, screenCount, screenShop, screenGame, screenEnd.
// Drives two flavors of the same card-swiping mechanic:
//   - 'swipe'     — Safe/Danger, age-tiered (child/teen/adult)
//   - 'truefalse' — Truth-or-Myth, one flat pool, no age tier
//
// Public API consumed by app.js:
//   initSwipeGame()        — call once, after the DOM is ready
//   startSwipeFormat()     — entry point for the "Safe or Danger" format card
//   startTrueFalseFormat() — entry point for the "Truth or Myth" format card
//   refreshSwipeLabels()   — call after a language change
//
// NOT wired here (left for app.js, which is the natural place to connect
// two mode modules to each other): the "try Investigation mode" cross-promo
// button on the end screen. See the comment near the bottom of this file.

import {
  getCoins, addCoins, spendCoins,
  getHints, addHints, useHint
} from '../core/state.js';
import { t, getLevelMeta, getAllLevelMeta, COUNT_OPTIONS } from '../core/i18n.js';
import { buildSwipeDeck, buildTrueFalseDeck } from '../data/decks.js';
import { registerScreens, showScreen, isScreenActive } from '../core/screens.js';

const HINT_PRICES = [{ n: 1, price: 5 }, { n: 2, price: 9 }, { n: 3, price: 12 }];
const HINT_INLINE_PRICE = 5;

/* ---------------------------------------------------------------------
 * Session state — local to one playthrough, intentionally NOT in state.js
 * (state.js is for things that persist across sessions/modes; a deck
 * position or the current streak has no meaning once you leave this mode).
 * ------------------------------------------------------------------- */
let gameMode = 'swipe'; // 'swipe' | 'truefalse'
let selectedLevel = null;
let selectedCount = null;
let deck = [];
let idx = 0;
let score = 0;
let streak = 0;
let misses = [];

let currentCardEl = null;
let dragging = false, startX = 0, startY = 0, dx = 0, dy = 0;
let locked = false;

let dom = {};

/* ---------------------------------------------------------------------
 * Init
 * ------------------------------------------------------------------- */
export function initSwipeGame() {
  registerScreens(['screenLevel', 'screenCount', 'screenShop', 'screenGame', 'screenEnd']);
  cacheDom();
  wireListeners();
  refreshSwipeLabels();
}

function cacheDom() {
  dom = {
    levelList: document.getElementById('levelList'),
    countGrid: document.getElementById('countGrid'),
    shopList: document.getElementById('shopList'),
    stage: document.getElementById('stage'),
    progressFill: document.getElementById('progressFill'),
    streakChip: document.getElementById('streakChip'),
    flameIcon: document.getElementById('flameIcon'),
    streakVal: document.getElementById('streakVal'),
    gameCoinVal: document.getElementById('gameCoinVal'),
    menuCoinVal: document.getElementById('menuCoinVal'),
    shopCoinVal: document.getElementById('shopCoinVal'),
    btnHint: document.getElementById('btnHint'),
    hintCountVal: document.getElementById('hintCountVal'),
    btnDanger: document.getElementById('btnDanger'),
    btnSafe: document.getElementById('btnSafe'),
    dangerLabel: document.getElementById('dangerLabel'),
    safeLabel: document.getElementById('safeLabel'),
    feedback: document.getElementById('feedback'),
    feedbackCard: document.getElementById('feedbackCard'),
    feedbackTitle: document.getElementById('feedbackTitle'),
    feedbackText: document.getElementById('feedbackText'),
    feedbackContinue: document.getElementById('feedbackContinue'),
    hintOverlay: document.getElementById('hintOverlay'),
    hintCard: document.getElementById('hintCard'),
    hintTitleEl: document.getElementById('hintTitle'),
    hintText: document.getElementById('hintText'),
    hintClose: document.getElementById('hintClose'),
    hintBuyBtn: document.getElementById('hintBuyBtn'),
    scoreVal: document.getElementById('scoreVal'),
    scoreMax: document.getElementById('scoreMax'),
    scoreLabel: document.getElementById('scoreLabel'),
    scoreTag: document.getElementById('scoreTag'),
    summaryDesc: document.getElementById('summaryDesc'),
    perfectBanner: document.getElementById('perfectBanner'),
    perfectBannerText: document.getElementById('perfectBannerText'),
    coinsEarnedText: document.getElementById('coinsEarnedText'),
    missList: document.getElementById('missList'),
    btnShare: document.getElementById('btnShare'),
    btnDownload: document.getElementById('btnDownload'),
    btnMenuEnd: document.getElementById('btnMenuEnd'),
    btnRestart: document.getElementById('btnRestart'),
    backFromLevel: document.getElementById('backFromLevel'),
    backFromCount: document.getElementById('backFromCount'),
    backFromShop: document.getElementById('backFromShop')
  };
}

function wireListeners() {
  dom.backFromLevel.addEventListener('click', () => showScreen('screenFormat'));
  dom.backFromCount.addEventListener('click', () =>
    showScreen(gameMode === 'truefalse' ? 'screenFormat' : 'screenLevel')
  );
  dom.backFromShop.addEventListener('click', () => showScreen('screenMenu'));

  dom.btnMenuEnd.addEventListener('click', () => {
    renderLevelList();
    showScreen('screenMenu');
  });
  dom.btnRestart.addEventListener('click', () => startGame());

  dom.btnDanger.addEventListener('click', () => { if (!locked) commit(leftValue()); });
  dom.btnSafe.addEventListener('click', () => { if (!locked) commit(rightValue()); });

  document.addEventListener('keydown', (e) => {
    if (!isScreenActive('screenGame') || locked) return;
    if (e.key === 'ArrowLeft') commit(leftValue());
    if (e.key === 'ArrowRight') commit(rightValue());
  });

  dom.feedbackContinue.addEventListener('click', () => {
    dom.feedback.classList.remove('show');
    idx++;
    renderCard();
  });

  dom.btnHint.addEventListener('click', onHintButtonClick);
  dom.hintBuyBtn.addEventListener('click', onHintBuyClick);
  dom.hintClose.addEventListener('click', () => dom.hintOverlay.classList.remove('show'));

  dom.btnShare.addEventListener('click', onShareClick);
  dom.btnDownload.addEventListener('click', onDownloadClick);
}

/* ---------------------------------------------------------------------
 * Entry points (called by app.js from the format-select screen)
 * ------------------------------------------------------------------- */
export function startSwipeFormat() {
  gameMode = 'swipe';
  renderLevelList();
  showScreen('screenLevel');
}

export function startTrueFalseFormat() {
  gameMode = 'truefalse';
  renderCountGrid();
  showScreen('screenCount');
}

/* ---------------------------------------------------------------------
 * Level / count / shop lists
 * ------------------------------------------------------------------- */
function renderLevelList() {
  dom.levelList.innerHTML = '';
  getAllLevelMeta().forEach(({ id, title, desc, icon }) => {
    const el = document.createElement('div');
    el.className = 'level-card';
    el.innerHTML = `<div class="lc-icon">${icon}</div><div><div class="lc-title">${title}</div><div class="lc-desc">${desc}</div></div>`;
    el.addEventListener('click', () => { selectedLevel = id; showScreen('screenCount'); });
    dom.levelList.appendChild(el);
  });
}

function renderCountGrid() {
  dom.countGrid.innerHTML = '';
  COUNT_OPTIONS.forEach((n) => {
    const el = document.createElement('div');
    el.className = 'count-cell';
    el.innerHTML = `<div class="cc-num">${n}</div><div class="cc-label">${t('countUnit')}</div>`;
    el.addEventListener('click', () => { selectedCount = n; startGame(); });
    dom.countGrid.appendChild(el);
  });
}

function renderShopList() {
  const labels = [t('shopItem1'), t('shopItem2'), t('shopItem3')];
  dom.shopList.innerHTML = '';
  HINT_PRICES.forEach((item, i) => {
    const affordable = getCoins() >= item.price;
    const el = document.createElement('div');
    el.className = 'shop-item';
    el.innerHTML = `
      <div class="si-left">
        <div class="si-icon">💡</div>
        <div>
          <div class="si-title">${labels[i]}</div>
          <div class="si-price">🪙 ${item.price}</div>
        </div>
      </div>
      <button class="buybtn" ${affordable ? '' : 'disabled'}>${t('buyBtn')}</button>
    `;
    el.querySelector('.buybtn').addEventListener('click', () => {
      if (spendCoins(item.price)) {
        addHints(item.n);
        updateCoinBadges();
        updateHintUI();
      }
    });
    dom.shopList.appendChild(el);
  });
}

/* ---------------------------------------------------------------------
 * Streak / coin / hint badges
 * ------------------------------------------------------------------- */
function updateStreakUI() {
  dom.streakVal.textContent = streak;
  let level = 0;
  if (streak >= 40) level = 4;
  else if (streak >= 20) level = 3;
  else if (streak >= 10) level = 2;
  else if (streak >= 5) level = 1;
  dom.streakChip.classList.remove('level-0', 'level-1', 'level-2', 'level-3', 'level-4');
  dom.streakChip.classList.add('level-' + level);
  dom.flameIcon.textContent = level >= 1 ? '🔥' : '●';
  dom.streakChip.classList.remove('pop');
  void dom.streakChip.offsetWidth; // force reflow so the pop animation retriggers
  dom.streakChip.classList.add('pop');
}

function updateCoinBadges() {
  const coins = getCoins();
  if (dom.menuCoinVal) dom.menuCoinVal.textContent = coins;
  if (dom.shopCoinVal) dom.shopCoinVal.textContent = coins;
  if (dom.gameCoinVal) dom.gameCoinVal.textContent = coins;
  renderShopList();
}

function updateHintUI() {
  dom.hintCountVal.textContent = getHints();
}

/* ---------------------------------------------------------------------
 * Core game loop
 * ------------------------------------------------------------------- */
function leftValue() { return gameMode === 'truefalse' ? 'false' : 'danger'; }
function rightValue() { return gameMode === 'truefalse' ? 'true' : 'safe'; }

function startGame() {
  deck = gameMode === 'truefalse'
    ? buildTrueFalseDeck(selectedCount)
    : buildSwipeDeck(selectedLevel, selectedCount);
  idx = 0; score = 0; streak = 0; misses = [];
  updateStreakUI();
  updateCoinBadges();
  updateHintUI();
  showScreen('screenGame');
  renderCard();
}

function renderCard() {
  dom.stage.innerHTML = '';
  if (idx >= deck.length) { showEnd(); return; }
  const item = deck[idx];
  const lang = t('htmlLang'); // cheap way to read current lang without a new import
  const stampLeftText = gameMode === 'truefalse' ? t('stampFalse') : t('stampLeft');
  const stampRightText = gameMode === 'truefalse' ? t('stampTrue') : t('stampRight');

  const el = document.createElement('div');
  el.className = 'card';
  el.innerHTML = `
    <div class="stamp left" id="stampLeft">${stampLeftText}</div>
    <div class="stamp right" id="stampRight">${stampRightText}</div>
    <div class="icon">${item.icon}</div>
    <div class="scene">${item[lang].scene}</div>
    <div class="hint">${t('hint')}</div>
  `;
  dom.stage.appendChild(el);
  currentCardEl = el;
  dom.progressFill.style.width = (idx / deck.length * 100) + '%';
  attachDrag(el);
  locked = false;

  dom.dangerLabel.textContent = gameMode === 'truefalse' ? t('falseLabel') : t('dangerLabel');
  dom.safeLabel.textContent = gameMode === 'truefalse' ? t('trueLabel') : t('safeLabel');
}

function attachDrag(el) {
  el.addEventListener('pointerdown', (e) => {
    if (locked) return;
    dragging = true;
    startX = e.clientX; startY = e.clientY;
    el.setPointerCapture(e.pointerId);
  });
  el.addEventListener('pointermove', (e) => {
    if (!dragging || locked) return;
    dx = e.clientX - startX;
    dy = e.clientY - startY;
    el.style.transform = `translate(${dx}px, ${dy}px) rotate(${dx / 18}deg)`;
    const stampLeft = document.getElementById('stampLeft');
    const stampRight = document.getElementById('stampRight');
    const t2 = Math.min(Math.abs(dx) / 80, 1);
    if (dx < 0) { stampLeft.style.opacity = t2; stampRight.style.opacity = 0; }
    else { stampRight.style.opacity = t2; stampLeft.style.opacity = 0; }
  });
  el.addEventListener('pointerup', () => {
    if (!dragging || locked) return;
    dragging = false;
    if (dx < -90) commit(leftValue());
    else if (dx > 90) commit(rightValue());
    else {
      el.style.transition = 'transform .25s ease';
      el.style.transform = 'translate(0,0) rotate(0)';
      setTimeout(() => { if (el) el.style.transition = ''; }, 250);
      document.getElementById('stampLeft').style.opacity = 0;
      document.getElementById('stampRight').style.opacity = 0;
    }
    dx = 0; dy = 0;
  });
}

function commit(choice) {
  locked = true;
  const item = deck[idx];
  const correct = choice === item.answer;
  const lang = t('htmlLang');

  if (currentCardEl) {
    const flyX = choice === leftValue() ? -600 : 600;
    currentCardEl.style.transition = 'transform .35s ease, opacity .35s ease';
    currentCardEl.style.transform = `translate(${flyX}px, ${dy}px) rotate(${flyX / 18}deg)`;
    currentCardEl.style.opacity = '0';
  }

  if (correct) {
    score++;
    streak++;
    addCoins(1);
    updateCoinBadges();
  } else {
    streak = 0;
    misses.push(item);
  }
  updateStreakUI();

  setTimeout(() => {
    dom.feedbackCard.className = 'overlay-card ' + (correct ? 'correct' : 'wrong');
    dom.feedbackTitle.textContent = correct ? t('correctTitle') : t('wrongTitle');
    dom.feedbackText.textContent = item[lang].why;
    dom.feedback.classList.add('show');
  }, 200);
}

/* ---------------------------------------------------------------------
 * Hints
 * ------------------------------------------------------------------- */
function onHintButtonClick() {
  if (!isScreenActive('screenGame') || idx >= deck.length) return;
  const item = deck[idx];
  const lang = t('htmlLang');

  if (useHint()) {
    updateHintUI();
    dom.hintCard.className = 'overlay-card info';
    dom.hintTitleEl.textContent = t('hintTitle');
    dom.hintText.textContent = item[lang].why;
    dom.hintBuyBtn.style.display = 'none';
    dom.hintClose.textContent = t('hintCloseBtn');
    dom.hintClose.className = 'overlay-btn';
  } else if (getCoins() >= HINT_INLINE_PRICE) {
    dom.hintCard.className = 'overlay-card info';
    dom.hintTitleEl.textContent = t('hintTitle');
    dom.hintText.textContent = t('buyHintPrompt', HINT_INLINE_PRICE);
    dom.hintBuyBtn.textContent = t('buyHintConfirmBtn', HINT_INLINE_PRICE);
    dom.hintBuyBtn.style.display = 'inline-block';
    dom.hintClose.textContent = t('cancelBtn');
    dom.hintClose.className = 'overlay-btn secondary';
  } else {
    dom.hintCard.className = 'overlay-card info';
    dom.hintTitleEl.textContent = t('hintTitle');
    dom.hintText.textContent = t('notEnoughCoinsText');
    dom.hintBuyBtn.style.display = 'none';
    dom.hintClose.textContent = t('hintCloseBtn');
    dom.hintClose.className = 'overlay-btn';
  }
  dom.hintOverlay.classList.add('show');
}

function onHintBuyClick() {
  if (getCoins() < HINT_INLINE_PRICE || idx >= deck.length) return;
  if (!spendCoins(HINT_INLINE_PRICE)) return;
  updateCoinBadges();
  const item = deck[idx];
  const lang = t('htmlLang');
  dom.hintText.textContent = item[lang].why;
  dom.hintBuyBtn.style.display = 'none';
  dom.hintClose.textContent = t('hintCloseBtn');
  dom.hintClose.className = 'overlay-btn';
}

/* ---------------------------------------------------------------------
 * End screen
 * ------------------------------------------------------------------- */
function currentModeTitle() {
  return gameMode === 'truefalse' ? t('formatTruthTitle') : getLevelMeta(selectedLevel).title;
}

function renderEndTexts() {
  dom.scoreVal.textContent = score;
  dom.scoreMax.textContent = deck.length;
  dom.scoreLabel.textContent = t('scoreLabel', score, deck.length);
  dom.coinsEarnedText.textContent = t('coinsEarned', score);

  const pct = deck.length ? score / deck.length : 0;
  if (pct === 1) { dom.scoreTag.textContent = t('tagPerfect'); dom.summaryDesc.textContent = t('descPerfect'); }
  else if (pct >= 0.75) { dom.scoreTag.textContent = t('tagGood'); dom.summaryDesc.textContent = t('descGood'); }
  else if (pct >= 0.5) { dom.scoreTag.textContent = t('tagOk'); dom.summaryDesc.textContent = t('descOk'); }
  else { dom.scoreTag.textContent = t('tagRetry'); dom.summaryDesc.textContent = t('descRetry'); }

  if (pct === 1) {
    dom.perfectBanner.classList.add('show');
    dom.perfectBannerText.textContent = t('perfectBannerText');
  } else {
    dom.perfectBanner.classList.remove('show');
  }

  const lang = t('htmlLang');
  dom.missList.innerHTML = '';
  if (misses.length === 0) {
    dom.missList.innerHTML = `<div class="miss-item">${t('noMisses')}</div>`;
  } else {
    misses.forEach((m) => {
      const d = document.createElement('div');
      d.className = 'miss-item';
      d.innerHTML = `<div class="m-icon">${m.icon}</div><div><b>${m[lang].scene}</b>${m[lang].why}</div>`;
      dom.missList.appendChild(d);
    });
  }
}

function showEnd() {
  dom.progressFill.style.width = '100%';
  renderEndTexts();
  showScreen('screenEnd');
}

function onShareClick() {
  const levelTitle = currentModeTitle();
  const text = t('shareText', score, deck.length, levelTitle);
  navigator.clipboard?.writeText(text).then(() => {
    const orig = dom.btnShare.textContent;
    dom.btnShare.textContent = t('shareCopied');
    setTimeout(() => { dom.btnShare.textContent = orig; }, 1400);
  });
}

/* ---------------------------------------------------------------------
 * Downloadable result-card image (canvas)
 * ------------------------------------------------------------------- */
function drawRoundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  const lines = [];
  for (let i = 0; i < words.length; i++) {
    const test = line + words[i] + ' ';
    if (ctx.measureText(test).width > maxWidth && i > 0) {
      lines.push(line.trim());
      line = words[i] + ' ';
    } else {
      line = test;
    }
  }
  lines.push(line.trim());
  lines.forEach((l, i) => ctx.fillText(l, x, y + i * lineHeight));
  return lines.length;
}

function generateResultCard() {
  const lang = t('htmlLang');
  const modeIcon = gameMode === 'truefalse' ? '🤔' : getLevelMeta(selectedLevel).icon;
  const modeTitle = currentModeTitle();
  const pct = deck.length ? score / deck.length : 0;

  const W = 1080, H = 1350;
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');

  const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
  bgGrad.addColorStop(0, '#1d2216');
  bgGrad.addColorStop(1, '#12140f');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = '#e3a72e';
  ctx.beginPath();
  ctx.arc(80, 90, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#f2ede0';
  ctx.font = '700 34px -apple-system, Segoe UI, Roboto, sans-serif';
  ctx.textBaseline = 'middle';
  ctx.fillText('MAG UKRAINE', 108, 92);

  ctx.font = '700 30px -apple-system, Segoe UI, Roboto, sans-serif';
  ctx.fillStyle = '#8a8a78';
  ctx.fillText(modeIcon + '  ' + modeTitle.toUpperCase(), 80, 190);

  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#f2ede0';
  ctx.font = '900 220px -apple-system, Segoe UI, Roboto, sans-serif';
  ctx.fillText(String(score), 80, 520);
  const scoreWidth = ctx.measureText(String(score)).width;
  ctx.font = '700 70px -apple-system, Segoe UI, Roboto, sans-serif';
  ctx.fillStyle = '#8a8a78';
  ctx.fillText('/ ' + deck.length, 80 + scoreWidth + 20, 520);

  ctx.font = '600 32px -apple-system, Segoe UI, Roboto, sans-serif';
  ctx.fillStyle = '#c9c4b6';
  ctx.fillText(t('scoreLabel', score, deck.length), 80, 580);

  const tagText = pct === 1 ? t('tagPerfect') : pct >= 0.75 ? t('tagGood') : pct >= 0.5 ? t('tagOk') : t('tagRetry');
  ctx.font = '800 30px -apple-system, Segoe UI, Roboto, sans-serif';
  const tagW = ctx.measureText(tagText).width + 56;
  ctx.fillStyle = pct === 1 ? '#ff7a3d' : '#e3a72e';
  drawRoundedRect(ctx, 80, 630, tagW, 62, 31);
  ctx.fill();
  ctx.fillStyle = '#1b1f16';
  ctx.textBaseline = 'middle';
  ctx.fillText(tagText, 108, 662);

  ctx.textBaseline = 'alphabetic';
  ctx.font = '400 30px -apple-system, Segoe UI, Roboto, sans-serif';
  ctx.fillStyle = '#c9c4b6';
  const descText = pct === 1 ? t('descPerfect') : pct >= 0.75 ? t('descGood') : pct >= 0.5 ? t('descOk') : t('descRetry');
  wrapCanvasText(ctx, descText, 80, 760, W - 160, 42);

  ctx.font = '700 40px -apple-system, Segoe UI, Roboto, sans-serif';
  ctx.fillStyle = '#f2ede0';
  ctx.fillText('🪙 ' + t('coinsEarned', score), 80, 980);

  ctx.strokeStyle = 'rgba(242,237,224,0.14)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(80, 1080);
  ctx.lineTo(W - 80, 1080);
  ctx.stroke();

  ctx.font = '600 32px -apple-system, Segoe UI, Roboto, sans-serif';
  ctx.fillStyle = '#e3a72e';
  const challengeText = lang === 'uk' ? 'Спробуй побити мій результат 🎯' : 'Can you beat my score? 🎯';
  ctx.fillText(challengeText, 80, 1160);

  ctx.font = '400 26px -apple-system, Segoe UI, Roboto, sans-serif';
  ctx.fillStyle = '#8a8a78';
  ctx.fillText('#EORE #MAGUkraine', 80, 1220);

  return canvas;
}

function onDownloadClick() {
  const canvas = generateResultCard();
  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mag-ukraine-result.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }, 'image/png');
}

/* ---------------------------------------------------------------------
 * Language refresh — called by app.js after setLang()
 * ------------------------------------------------------------------- */
export function refreshSwipeLabels() {
  document.getElementById('levelHeader').textContent = t('levelHeader');
  document.getElementById('countHeader').textContent = t('countHeader');
  document.getElementById('shopHeader').textContent = t('shopHeader');
  document.getElementById('shopNote').textContent = t('shopNote');
  document.getElementById('streakLabel').textContent = t('streakLabel');
  dom.feedbackContinue.textContent = t('continueBtn');
  dom.hintTitleEl.textContent = t('hintTitle');
  dom.hintClose.textContent = t('hintCloseBtn');
  document.getElementById('resultsHeader').textContent = t('resultsHeader');
  dom.btnShare.textContent = t('shareBtn');
  dom.btnDownload.textContent = t('downloadBtn');
  dom.btnRestart.textContent = t('restartBtn');
  dom.btnMenuEnd.textContent = t('menuBtnEnd');

  renderLevelList();
  renderCountGrid();
  renderShopList();

  // If a card or the end screen is on-screen right now, re-render it in
  // the new language rather than waiting for the next interaction.
  if (isScreenActive('screenEnd')) {
    renderEndTexts();
  } else if (currentCardEl && isScreenActive('screenGame')) {
    renderCard();
  }
}

/* app.js is expected to additionally wire, once questGame.js also exists:
 *   document.getElementById('btnSwipeToQuest').addEventListener('click', ...)
 * This module intentionally does not reach into questGame.js's screens. */

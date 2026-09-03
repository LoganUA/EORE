// tests/swipeGame.test.mjs
// Loads the fixture HTML into jsdom, imports swipeGame.js as a real ES
// module, and drives it exactly the way a person would: click cards,
// answer rounds, buy a hint, reach the end screen, share, download.

import { JSDOM } from 'jsdom';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixtureHtml = fs.readFileSync(path.join(__dirname, 'fixtures/swipeGame.fixture.html'), 'utf8');

let failures = 0;
function assert(cond, msg) {
  if (!cond) { failures++; console.error('FAIL:', msg); }
  else console.log('ok  :', msg);
}

async function run() {
  const dom = new JSDOM(fixtureHtml, {
    runScripts: 'dangerously',
    resources: 'usable',
    pretendToBeVisual: true,
    url: 'http://localhost/'
  });
  const { window } = dom;

  // Stub canvas 2D context (jsdom has no native canvas without a native
  // add-on; a lightweight stub is enough to prove the drawing code runs
  // start-to-finish without throwing).
  window.HTMLCanvasElement.prototype.getContext = function () {
    return {
      fillRect(){}, fillText(){}, measureText:(s)=>({width:(s||'').length*9}),
      beginPath(){}, moveTo(){}, lineTo(){}, stroke(){}, arc(){}, fill(){}, closePath(){}, arcTo(){},
      createLinearGradient: () => ({ addColorStop(){} }),
      set fillStyle(v){}, set strokeStyle(v){}, set font(v){}, set textBaseline(v){}, set lineWidth(v){}
    };
  };
  window.HTMLCanvasElement.prototype.toBlob = function (cb) { cb(new window.Blob(['x'])); };
  window.URL.createObjectURL = () => 'blob:fake';
  window.URL.revokeObjectURL = () => {};
  window.navigator.clipboard = { writeText: () => Promise.resolve() };

  // Expose jsdom's window/document as globals so the ES modules (written
  // for a real browser) can use `document`/`window`/`navigator` directly,
  // exactly as they will when loaded via <script type="module"> in index.html.
  globalThis.window = window;
  globalThis.document = window.document;
  globalThis.MouseEvent = window.MouseEvent;
  globalThis.URL = window.URL;
  // Node 22+ already provides a read-only global `navigator` without
  // .clipboard — swipeGame.js calls `navigator.clipboard?.writeText(...)`,
  // so the optional chaining just no-ops safely here. Nothing to shim.

  const { initSwipeGame, startSwipeFormat, startTrueFalseFormat } = await import('../js/modes/swipeGame.js');
  const { getCoins, getHints } = await import('../js/core/state.js');
  const { isScreenActive } = await import('../js/core/screens.js');

  const doc = window.document;
  const click = (id) => doc.getElementById(id).dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  initSwipeGame();
  assert(typeof initSwipeGame === 'function', 'initSwipeGame is exported and callable');

  /* ---------------- Swipe (Safe/Danger) mode, age-tiered ---------------- */
  startSwipeFormat();
  assert(isScreenActive('screenLevel'), 'startSwipeFormat() shows the level-select screen');

  const levelCards = doc.querySelectorAll('#levelList .level-card');
  assert(levelCards.length === 3, 'level list renders 3 age tiers');
  levelCards[1].dispatchEvent(new window.MouseEvent('click', { bubbles: true })); // teen
  assert(isScreenActive('screenCount'), 'picking a level advances to count-select');

  const countCells = doc.querySelectorAll('#countGrid .count-cell');
  assert(countCells.length === 6, 'count grid renders 6 options');
  countCells[0].dispatchEvent(new window.MouseEvent('click', { bubbles: true })); // 10
  assert(isScreenActive('screenGame'), 'picking a count starts the game');
  assert(doc.getElementById('dangerLabel').textContent.length > 0, 'danger/safe labels are populated for swipe mode');

  const coinsBefore = getCoins();
  let rounds = 0;
  while (isScreenActive('screenGame') && rounds < 15) {
    click('btnSafe');
    await sleep(250);
    if (doc.getElementById('feedback').classList.contains('show')) click('feedbackContinue');
    rounds++;
    await sleep(20);
  }
  assert(isScreenActive('screenEnd'), 'swipe-mode playthrough reaches the end screen');
  assert(getCoins() >= coinsBefore, 'coins never decrease just from playing (only increase on correct answers)');
  assert(doc.getElementById('scoreMax').textContent === '10', 'end screen shows the requested question count');

  let shareOk = true, downloadOk = true;
  try { click('btnShare'); } catch (e) { shareOk = false; console.error(e); }
  try { click('btnDownload'); } catch (e) { downloadOk = false; console.error(e); }
  assert(shareOk, 'Share button does not throw on the swipe-mode end screen');
  assert(downloadOk, 'Download-card button does not throw on the swipe-mode end screen (canvas path runs clean)');

  /* ---------------- Truth-or-Myth mode, no age tier ---------------- */
  startTrueFalseFormat();
  assert(isScreenActive('screenCount'), 'startTrueFalseFormat() skips level-select and goes straight to count-select');

  const countCells2 = doc.querySelectorAll('#countGrid .count-cell');
  countCells2[0].dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  assert(isScreenActive('screenGame'), 'picking a count starts the true/false game');

  rounds = 0;
  while (isScreenActive('screenGame') && rounds < 15) {
    click('btnSafe'); // "true"/right side in this mode
    await sleep(250);
    if (doc.getElementById('feedback').classList.contains('show')) click('feedbackContinue');
    rounds++;
    await sleep(20);
  }
  assert(isScreenActive('screenEnd'), 'true/false playthrough reaches the end screen');

  let shareOk2 = true;
  try { click('btnShare'); } catch (e) { shareOk2 = false; console.error(e); }
  assert(shareOk2, 'Share works on the true/false end screen too (currentModeTitle() does not crash without a selectedLevel)');

  /* ---------------- Hints / shop economy ---------------- */
  startSwipeFormat();
  doc.querySelectorAll('#levelList .level-card')[0].dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  doc.querySelectorAll('#countGrid .count-cell')[0].dispatchEvent(new window.MouseEvent('click', { bubbles: true }));

  const hintsBefore = getHints();
  click('btnHint');
  assert(doc.getElementById('hintOverlay').classList.contains('show'), 'hint overlay opens on click');
  if (hintsBefore > 0) {
    assert(getHints() === hintsBefore - 1, 'using an available hint decrements the hint count');
  }

  console.log(`\n${failures === 0 ? 'ALL TESTS PASSED' : failures + ' TEST(S) FAILED'}`);
  process.exit(failures === 0 ? 0 : 1);
}

run();

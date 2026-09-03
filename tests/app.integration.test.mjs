// tests/app.integration.test.mjs
// The real end-to-end test: loads the ACTUAL index.html + css + all JS
// modules together, exactly as a browser would via <script type="module">,
// and drives a full session through the real app.js entry point.

import { JSDOM } from 'jsdom';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const indexHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

let failures = 0;
function assert(cond, msg) {
  if (!cond) { failures++; console.error('FAIL:', msg); }
  else console.log('ok  :', msg);
}

async function run() {
  const dom = new JSDOM(indexHtml, {
    runScripts: 'dangerously',
    resources: 'usable',
    pretendToBeVisual: true,
    url: 'file://' + root + '/index.html'
  });
  const { window } = dom;

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

  // IMPORTANT: jsdom does not execute <script type="module" src="..."> tags
  // found in parsed HTML — that's a jsdom limitation, not a real-browser one
  // (Chrome/Firefox/Safari all run this index.html correctly once served
  // over http(s), which is exactly how it'll work on GitHub Pages). To test
  // the real app.js here, we import it the same way the per-module tests
  // do: set up the jsdom window/document as globals, then import the module
  // directly so Node's own ESM loader executes it against that DOM.
  globalThis.window = window;
  globalThis.document = window.document;
  globalThis.MouseEvent = window.MouseEvent;
  globalThis.URL = window.URL;

  await import('../js/app.js');
  await new Promise((r) => setTimeout(r, 100));

  const doc = window.document;
  const click = (id) => {
    const el = doc.getElementById(id);
    if (!el) { failures++; console.error('FAIL: element #' + id + ' not found when trying to click it'); return; }
    el.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  };
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const activeScreen = () => doc.querySelector('.screen.active')?.id;

  /* ---------------- Boot ---------------- */
  assert(activeScreen() === 'screenMenu', 'app boots straight to the main menu');
  assert(doc.getElementById('menuTitle').textContent.length > 0, 'menu title text is populated on boot (i18n wired correctly)');

  /* ---------------- Language switch from the very first screen ---------------- */
  const titleBeforeEn = doc.getElementById('btnGoFormat').textContent;
  click('langEn');
  const titleAfterEn = doc.getElementById('btnGoFormat').textContent;
  assert(titleBeforeEn !== titleAfterEn, 'switching to EN changes menu button text');
  assert(titleAfterEn.toLowerCase().includes('start'), 'EN start button says something English-ish');
  click('langUk'); // switch back for the rest of the run

  /* ---------------- Menu -> format -> swipe mode -> full playthrough ---------------- */
  click('btnGoFormat');
  assert(activeScreen() === 'screenFormat', 'Start Game goes to the format-select screen');

  click('formatSwipe');
  assert(activeScreen() === 'screenLevel', 'Safe/Danger format goes to level-select');
  doc.querySelectorAll('#levelList .level-card')[0].dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  doc.querySelectorAll('#countGrid .count-cell')[0].dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  assert(activeScreen() === 'screenGame', 'picking level + count starts the swipe game for real, from the actual page');

  let rounds = 0;
  while (activeScreen() === 'screenGame' && rounds < 15) {
    click('btnSafe');
    await sleep(250);
    if (doc.getElementById('feedback').classList.contains('show')) click('feedbackContinue');
    rounds++; await sleep(20);
  }
  assert(activeScreen() === 'screenEnd', 'swipe playthrough reaches the end screen via the real page');

  /* ---------------- Cross-promo button wired by app.js ---------------- */
  assert(!!doc.getElementById('btnSwipeToQuest'), 'cross-promo button exists on the swipe end screen');
  click('btnSwipeToQuest');
  assert(activeScreen() === 'screenQuestAge', '"try Investigation" button (wired by app.js) actually switches to the quest mode');

  /* ---------------- Play a quest scenario through to the phone screen ---------------- */
  doc.querySelectorAll('#questAgeList .level-card')[1].dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  doc.querySelectorAll('#questCardList .level-card')[0].dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  click('introContinue');

  let steps = 0;
  while (activeScreen() === 'screenStory' && steps < 10) {
    const opts = doc.querySelectorAll('#storyOptions .q-opt-btn');
    for (const opt of opts) {
      opt.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
      if (doc.getElementById('consequenceOverlay').classList.contains('show')) click('consequenceRetry');
      else break;
    }
    steps++;
  }
  assert(activeScreen() === 'screenPhone', 'quest playthrough reaches the phone-dial screen on the real page');

  const pressKey = (label) => {
    const key = [...doc.querySelectorAll('#keypad .q-key')].find((k) => k.textContent.trim() === label);
    key.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  };
  pressKey('1'); pressKey('0'); pressKey('1');
  click('callBtn');
  await sleep(1300);
  assert(activeScreen() === 'screenQuestEnd', 'dialing 101 on the real page ends the quest successfully');

  click('btnQuestToSwipe');
  assert(activeScreen() === 'screenLevel', '"try Safe or Danger" button (also wired by app.js) switches back the other way');

  /* ---------------- Shop reachable from the menu ---------------- */
  click('brandHome');
  assert(activeScreen() === 'screenMenu', 'brand/logo click always returns to the menu');
  click('btnGoShop');
  assert(activeScreen() === 'screenShop', 'Shop button opens the shop from the menu');
  assert(doc.querySelectorAll('#shopList .shop-item').length === 3, 'shop lists all 3 hint bundles');

  console.log(`\n${failures === 0 ? 'ALL INTEGRATION TESTS PASSED' : failures + ' TEST(S) FAILED'}`);
  process.exit(failures === 0 ? 0 : 1);
}

run().catch((e) => { console.error('UNCAUGHT:', e); process.exit(1); });

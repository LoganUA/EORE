// tests/deminingField.test.mjs
import { JSDOM } from 'jsdom';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixtureHtml = fs.readFileSync(path.join(__dirname, 'fixtures/deminingField.fixture.html'), 'utf8');

let failures = 0;
function assert(cond, msg) {
  if (!cond) { failures++; console.error('FAIL:', msg); }
  else console.log('ok  :', msg);
}

async function run() {
  const dom = new JSDOM(fixtureHtml, {
    runScripts: 'dangerously', resources: 'usable', pretendToBeVisual: true, url: 'http://localhost/'
  });
  const { window } = dom;
  globalThis.window = window;
  globalThis.document = window.document;
  globalThis.MouseEvent = window.MouseEvent;

  const { initDeminingField, startDeminingFormat } = await import('../js/modes/deminingField.js');
  const { getCoins, addCoins, getClearedArea, getDiscoveredThreats } = await import('../js/core/state.js');
  const { isScreenActive } = await import('../js/core/screens.js');

  const doc = window.document;
  const click = (id) => doc.getElementById(id).dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  initDeminingField();
  startDeminingFormat();
  assert(isScreenActive('screenDeminingField'), 'startDeminingFormat() shows the field screen');

  const cellsEls = () => doc.querySelectorAll('#dfGrid .df-cell');
  assert(cellsEls().length === 36, 'the field renders a 6x6 = 36-cell grid');
  assert([...cellsEls()].every((c) => c.classList.contains('unknown')), 'every cell starts unknown/unexplored');

  /* ---------------- Insufficient coins: click with zero coins ---------------- */
  assert(getCoins() === 0, 'test starts with zero coins (fresh in-memory state)');
  const areaBefore = getClearedArea();
  cellsEls()[0].dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  assert(doc.getElementById('dfReportOverlay').classList.contains('show'), 'clicking a cell with no coins still opens a report (explaining the shortfall)');
  assert(doc.getElementById('dfReportText').textContent.length > 5, 'the insufficient-coins report has explanatory text');
  assert(cellsEls()[0].classList.contains('unknown'), 'the cell stays unknown — no coins were actually charged for a failed attempt');
  assert(getClearedArea() === areaBefore, 'cleared area does not increase when the clearance could not be paid for');
  click('dfReportClose');

  /* ---------------- Fund the player, then clear every cell ---------------- */
  addCoins(5 * 36); // enough for all 36 cells at 5 coins each
  const coinsStart = getCoins();

  let foundCount = 0, clearCount = 0;
  for (let i = 0; i < 36; i++) {
    const cell = cellsEls()[i];
    assert(cell.classList.contains('unknown'), `cell ${i} is still unknown before clearing`);
    cell.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
    await sleep(950); // matches the ~900ms "deminers working" delay
    assert(doc.getElementById('dfReportOverlay').classList.contains('show'), `cell ${i} clearance produced a report`);
    const isClear = doc.getElementById('dfReportTitle').textContent === doc.getElementById('dfReportTitle').textContent && cellsEls()[i].classList.contains('cleared-safe');
    if (isClear) clearCount++; else if (cellsEls()[i].classList.contains('cleared-threat')) foundCount++;
    click('dfReportClose');
  }

  assert(clearCount + foundCount === 36, `every one of the 36 cells resolved to either clear or a threat (${clearCount} clear + ${foundCount} found = 36)`);
  assert(getCoins() === coinsStart - 5 * 36, 'exactly 5 coins were spent per cell, 36 times, no more no less');
  assert(getClearedArea() === areaBefore + 25 * 36, `cleared area grew by exactly 25 m² per cell across all 36 cells (${areaBefore} + 900)`);

  const threats = getDiscoveredThreats();
  const threatTotal = Object.values(threats).reduce((a, b) => a + b, 0);
  assert(threatTotal === foundCount, 'the sum of all recorded threat-type counts matches the number of "found" cells exactly');

  /* ---------------- Full-plot completion state ---------------- */
  assert(doc.getElementById('dfCompleteBanner').classList.contains('show'), 'the "plot fully surveyed" banner appears once every cell is cleared');
  assert(doc.getElementById('dfBtnNewField').style.display !== 'none', '"New plot" button becomes visible once the plot is fully cleared');

  /* ---------------- New plot: resets the grid but NOT the cumulative stats ---------------- */
  const areaAfterFirstPlot = getClearedArea();
  click('dfBtnNewField');
  assert([...cellsEls()].every((c) => c.classList.contains('unknown')), 'starting a new plot resets every cell back to unknown');
  assert(getClearedArea() === areaAfterFirstPlot, 'starting a new plot does NOT reset the cumulative cleared-area statistic');

  /* ---------------- Threat reference / catalogue screen ---------------- */
  click('dfBtnCatalog');
  assert(isScreenActive('screenThreatCatalog'), 'the catalogue button opens the threat-reference screen');
  const catalogItems = doc.querySelectorAll('#dfCatalogList .df-catalog-item');
  assert(catalogItems.length === 6, 'the catalogue lists all 6 reference threat types, regardless of how many were actually found');
  const catalogCountSum = [...doc.querySelectorAll('.df-catalog-count')].reduce((sum, el) => sum + Number(el.textContent), 0);
  assert(catalogCountSum === threatTotal, 'the catalogue\'s displayed counts sum to the true total number of threats found');
  [...catalogItems].forEach((item) => {
    assert(item.querySelector('.df-catalog-desc').textContent.length > 20, 'every catalogue entry has a real educational description, not a placeholder');
  });
  assert(doc.getElementById('dfCatalogAreaVal').textContent === String(getClearedArea()), 'the catalogue screen shows the correct all-time cleared-area figure');

  click('backFromCatalog');
  assert(isScreenActive('screenDeminingField'), 'back button from the catalogue returns to the field screen');

  console.log(`\n${failures === 0 ? 'ALL TESTS PASSED' : failures + ' TEST(S) FAILED'}`);
  process.exit(failures === 0 ? 0 : 1);
}

run().catch((e) => { console.error('UNCAUGHT:', e); process.exit(1); });

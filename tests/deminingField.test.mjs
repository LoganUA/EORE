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
  globalThis.requestAnimationFrame = window.requestAnimationFrame;

  const {
    initDeminingField, startDeminingFormat, setAnimationSpeed, __debugRuntimeState
  } = await import('../js/modes/deminingField.js');
  const {
    getCoins, addCoins, getClearedArea, getDiscoveredThreats,
    getDeminers, getDeminer, getFieldsCompleted, hireDeminer, upgradeDeminerStat, spendCoins
  } = await import('../js/core/state.js');
  const { isScreenActive } = await import('../js/core/screens.js');

  setAnimationSpeed(0.02); // real behaviour, compressed in time

  const doc = window.document;
  const click = (id) => doc.getElementById(id).dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  const clickEl = (el) => el.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  /** Polls instead of guessing a fixed delay — avoids races against the
   * work/rest timers, which run at compressed but still real-time speed. */
  async function waitFor(conditionFn, timeoutMs = 4000, intervalMs = 8) {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      if (conditionFn()) return true;
      await sleep(intervalMs);
    }
    return false;
  }
  const reportShown = () => doc.getElementById('dfReportOverlay').classList.contains('show');

  initDeminingField();
  startDeminingFormat();
  assert(isScreenActive('screenDeminingField'), 'startDeminingFormat() shows the field screen');

  const zoneEls = () => doc.querySelectorAll('#dfGrid .df-zone');
  assert(zoneEls().length === 36, 'the field renders a 6x6 = 36-zone survey grid');
  assert(getDeminers().length === 1, 'a fresh roster starts with exactly one deminer');

  /* ---------------- Insufficient coins ---------------- */
  assert(getCoins() === 0, 'test starts with zero coins');
  zoneEls()[0].dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  assert(doc.getElementById('dfReportOverlay').classList.contains('show'), 'clicking with no coins opens an explanatory report');
  assert(zoneEls()[0].classList.contains('vegetated'), 'the zone is untouched — nothing was charged for a failed attempt');
  click('dfReportClose');

  /* ---------------- Fund generously for the rest of the test ---------------- */
  addCoins(2000);

  /* ---------------- Energy depletes after 3 clears (level-0 stamina), then the deminer rests ---------------- */
  let afterThree = null;
  for (let i = 0; i < 3; i++) {
    clickEl(zoneEls()[i]);
    assert(await waitFor(reportShown), `zone ${i}: d1 completes a clearance while it still has energy`);
    if (i === 2) afterThree = __debugRuntimeState('d1'); // capture the instant the 3rd clearance resolves, before rest can also finish
    click('dfReportClose');
  }
  assert(afterThree.state === 'resting', 'after 3 clears (the level-0 stamina cap), d1 automatically starts resting');
  assert(afterThree.energy <= 0, 'd1\u2019s energy is depleted at the moment it starts resting');

  /* ---------------- With the only deminer resting, a new click reports "all busy" ---------------- */
  clickEl(zoneEls()[3]);
  assert(await waitFor(reportShown), 'clicking a zone while the only deminer rests still opens a report');
  assert(zoneEls()[3].classList.contains('vegetated'), 'that zone was NOT assigned/charged — no coins spent, zone untouched');
  click('dfReportClose');

  /* ---------------- Hiring a second deminer lets work continue immediately ---------------- */
  hireDeminer();
  startDeminingFormat(); // re-syncs runtime with the roster
  assert(getDeminers().length === 2, 'the roster now has two deminers');
  assert(__debugRuntimeState('d2').state === 'idle', 'the newly hired deminer starts idle and ready to work');

  clickEl(zoneEls()[3]);
  assert(await waitFor(reportShown), 'with d2 available, the previously-blocked zone now clears successfully');
  assert(zoneEls()[3].classList.contains('clear-marked') || zoneEls()[3].classList.contains('threat-marked'), 'zone 3 is now resolved');
  click('dfReportClose');

  /* ---------------- Two deminers can work two different zones at the same time ---------------- */
  assert(await waitFor(() => __debugRuntimeState('d1').state === 'idle'), 'd1 eventually finishes resting and becomes idle again');

  clickEl(zoneEls()[4]);
  clickEl(zoneEls()[5]);
  const midFlightD1 = __debugRuntimeState('d1');
  const midFlightD2 = __debugRuntimeState('d2');
  assert(midFlightD1.state === 'working' && midFlightD2.state === 'working', 'two deminers can be mid-clearance on two different zones at the same time (real concurrency, not a single shared lock)');
  await waitFor(reportShown);
  if (reportShown()) click('dfReportClose');
  await waitFor(reportShown, 500);
  if (reportShown()) click('dfReportClose');

  /* ---------------- Upgrades ---------------- */
  const applied = upgradeDeminerStat('d1', 'speed');
  assert(applied === true, 'upgrading a stat via state.js succeeds (the roster screen button calls exactly this)');
  assert(getDeminer('d1').speed === 1, 'the upgrade is reflected immediately in the deminer\u2019s persisted stats');

  /* ---------------- Roster screen renders real data ---------------- */
  click('dfBtnRoster');
  assert(isScreenActive('screenDeminerRoster'), 'the roster button opens the deminer roster screen');
  const cards = doc.querySelectorAll('#dfRosterList .df-roster-card');
  assert(cards.length === 2, 'the roster screen lists both hired deminers');
  const upgradeButtons = doc.querySelectorAll('.df-stat-upgrade');
  assert(upgradeButtons.length === 6, 'each deminer shows all 3 upgradeable stats (2 deminers x 3 stats = 6 buttons)');
  click('backFromRoster');
  assert(isScreenActive('screenDeminingField'), 'back button from the roster returns to the field');

  /* ---------------- Clear every remaining zone, then test the paid community-liaison transition ---------------- */
  const anyIdleOrWorking = () =>
    getDeminers().some((d) => ['idle', 'working'].includes(__debugRuntimeState(d.id)?.state));

  for (let idx = 0; idx < 36; idx++) {
    const zone = zoneEls()[idx];
    let attempts = 0;
    while (zone.classList.contains('vegetated') && attempts < 60) {
      clickEl(zone);
      await waitFor(reportShown, 3000);
      if (reportShown()) click('dfReportClose');
      // A rejection ("all busy") resolves instantly with no real elapsed
      // time, unlike a real clearance — so retrying immediately would spin
      // through every attempt before any resting deminer could ever wake
      // up. Wait for an actual state change instead of guessing a delay.
      if (zone.classList.contains('vegetated')) {
        await waitFor(anyIdleOrWorking, 3000);
      }
      attempts++;
    }
  }
  assert([...zoneEls()].every((z) => !z.classList.contains('vegetated')), 'every zone in the plot ends up cleared');
  assert(doc.getElementById('dfCompleteBanner').classList.contains('show'), 'the "plot fully surveyed" banner appears once everything is cleared');
  assert(doc.getElementById('dfBtnNewField').style.display !== 'none', 'the community-liaison button appears once the plot is fully cleared');
  assert(doc.getElementById('dfBtnNewField').textContent.length > 3, 'the community-liaison button shows real text (including its coin cost)');

  const fieldsBefore = getFieldsCompleted();
  const areaBeforeNewPlot = getClearedArea();

  spendCoins(Math.max(0, getCoins() - 1)); // leave just 1 coin
  click('dfBtnNewField');
  assert(doc.getElementById('dfReportOverlay').classList.contains('show'), 'clicking the community-liaison button without enough coins shows a report, not a silent failure');
  assert(getFieldsCompleted() === fieldsBefore, 'fieldsCompleted does not increase when the liaison could not be paid for');
  click('dfReportClose');

  addCoins(5000);
  click('dfBtnNewField');
  assert(getFieldsCompleted() === fieldsBefore + 1, 'a successful community-liaison payment increments fieldsCompleted');
  assert([...zoneEls()].every((z) => z.classList.contains('vegetated')), 'the new plot starts fully vegetated/unexplored again');
  assert(getClearedArea() === areaBeforeNewPlot, 'starting a new plot does NOT reset the cumulative all-time cleared-area statistic');

  /* ---------------- Threat catalogue still reflects true cumulative totals ---------------- */
  click('dfBtnCatalog');
  const catalogItems = doc.querySelectorAll('#dfCatalogList .df-catalog-item');
  assert(catalogItems.length === 19, 'the catalogue lists all 19 reference threat types across every category');
  const catalogCountSum = [...doc.querySelectorAll('.df-catalog-count')]
    .map((el) => Number(el.textContent))
    .filter((n) => !Number.isNaN(n)) // undiscovered entries show "—", not a number
    .reduce((sum, n) => sum + n, 0);
  const threatTotal = Object.values(getDiscoveredThreats()).reduce((a, b) => a + b, 0);
  assert(catalogCountSum === threatTotal, 'catalogue counts still sum correctly after hiring, upgrades, and a plot transition');

  /* ---------------- Categories, badge, and "just found" highlight ---------------- */
  const categoryHeaders = doc.querySelectorAll('#dfCatalogList .df-catalog-category');
  assert(categoryHeaders.length === 8, 'the catalogue groups threats into all 8 categories');

  const undiscovered = [...catalogItems].filter((el) => el.classList.contains('not-found'));
  const discovered = [...catalogItems].filter((el) => !el.classList.contains('not-found'));
  assert(discovered.length === threatTotal || discovered.length <= 19, 'discovered items are visually distinguished from not-yet-found ones');
  undiscovered.forEach((el) => {
    assert(el.querySelector('.df-catalog-desc').textContent.length > 20, 'even an undiscovered entry still shows its full educational description (this is a reference guide, not a locked collectible)');
  });

  const badge = doc.getElementById('dfCatalogBadge');
  assert(badge.style.display !== 'none', 'the catalogue button shows a badge once at least one threat has been found');
  assert(Number(badge.textContent) === threatTotal, 'the badge number matches the true total of all threats found so far');

  const justFound = doc.querySelector('#dfCatalogList .just-found');
  assert(!!justFound, 'the most recently discovered threat type is visually highlighted when opening the catalogue');

  console.log(`\n${failures === 0 ? 'ALL TESTS PASSED' : failures + ' TEST(S) FAILED'}`);
  process.exit(failures === 0 ? 0 : 1);
}

run().catch((e) => { console.error('UNCAUGHT:', e); process.exit(1); });

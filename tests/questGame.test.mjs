// tests/questGame.test.mjs
import { JSDOM } from 'jsdom';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixtureHtml = fs.readFileSync(path.join(__dirname, 'fixtures/questGame.fixture.html'), 'utf8');

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
  globalThis.window = window;
  globalThis.document = window.document;
  globalThis.MouseEvent = window.MouseEvent;

  const { initQuestGame, startQuestFormat } = await import('../js/modes/questGame.js');
  const { getCoins } = await import('../js/core/state.js');
  const { isScreenActive } = await import('../js/core/screens.js');
  const { QUESTS, getQuestVariant } = await import('../js/data/decks.js');

  const doc = window.document;
  const click = (id) => doc.getElementById(id).dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  initQuestGame();
  assert(typeof initQuestGame === 'function', 'initQuestGame is exported and callable');

  /* ---------------- Navigate to a scenario, teen age ---------------- */
  startQuestFormat();
  assert(isScreenActive('screenQuestAge'), 'startQuestFormat() shows the age-select screen');

  const ageCards = doc.querySelectorAll('#questAgeList .level-card');
  assert(ageCards.length === 3, 'age list renders 3 tiers');
  ageCards[1].dispatchEvent(new window.MouseEvent('click', { bubbles: true })); // teen
  assert(isScreenActive('screenQuestList'), 'picking an age advances to scenario-select');

  const questCards = doc.querySelectorAll('#questCardList .level-card');
  assert(questCards.length === 5, 'scenario list renders all 5 quests');
  questCards[0].dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  assert(isScreenActive('screenStory'), 'picking a scenario shows the intro story screen');

  click('introContinue');
  assert(isScreenActive('screenStory'), 'first real decision node renders on the story screen');

  /* ---------------- Deliberately pick the WRONG option first ---------------- */
  const wrongBtn = doc.querySelectorAll('#storyOptions .q-opt-btn')[0]; // option A is scripted as the wrong one throughout this deck
  wrongBtn.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  assert(doc.getElementById('consequenceOverlay').classList.contains('show'), 'a wrong choice shows the consequence overlay instead of ending the run');
  click('consequenceRetry');
  assert(!doc.getElementById('consequenceOverlay').classList.contains('show'), 'closing the consequence overlay returns control without advancing');
  assert(isScreenActive('screenStory'), 'still on the same decision point after a wrong choice (loop, not dead end)');

  /* ---------------- Now click through with the correct option every time ---------------- */
  let steps = 0;
  while (isScreenActive('screenStory') && steps < 10) {
    const opts = doc.querySelectorAll('#storyOptions .q-opt-btn');
    let advanced = false;
    for (const opt of opts) {
      opt.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
      if (doc.getElementById('consequenceOverlay').classList.contains('show')) {
        click('consequenceRetry'); // that one was wrong, try the next option
      } else {
        advanced = true;
        break;
      }
    }
    assert(advanced, `story step ${steps} eventually accepts a correct option`);
    steps++;
  }
  assert(isScreenActive('screenPhone'), 'after clearing every story step, the phone-dial screen appears');
  assert(doc.querySelectorAll('#keypad .q-key').length === 12, 'phone keypad renders 12 keys (0-9, backspace, spacer)');

  /* ---------------- Dial a WRONG number first, confirm it explains and resets ---------------- */
  const pressKey = (label) => {
    const key = [...doc.querySelectorAll('#keypad .q-key')].find((k) => k.textContent.trim() === label);
    key.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  };
  pressKey('1'); pressKey('0'); pressKey('2'); // wrong: police, not the demining service
  assert(doc.getElementById('phoneDigits').textContent === '102', 'typed digits show up on the phone display');
  click('callBtn');
  assert(doc.getElementById('phoneError').classList.contains('show'), 'dialing 102 shows an explanatory error instead of silently failing');
  assert(doc.getElementById('phoneError').textContent.length > 10, 'the error message actually explains why 102 is wrong');
  assert(doc.getElementById('phoneDigits').textContent.trim() === '', 'the wrong number is cleared so the player can try again');

  /* ---------------- Now dial the correct number ---------------- */
  const coinsBefore = getCoins();
  pressKey('1'); pressKey('0'); pressKey('1');
  click('callBtn');
  await sleep(1300); // the "connecting..." animation delay before advancing
  assert(isScreenActive('screenQuestEnd'), 'dialing 101 correctly ends the quest successfully');
  assert(doc.getElementById('questEndTitle').textContent.length > 0, 'end screen shows a title');
  assert(doc.getElementById('protocolRecap').children.length === 4, 'end screen recaps all 4 STOP-protocol steps');

  // This run had one deliberate mistake, so no perfect-run coin bonus should be paid.
  assert(getCoins() === coinsBefore, 'a run with at least one mistake does NOT earn the perfect-run coin bonus');

  /* ---------------- Second run: adult age, different scenario, ZERO mistakes ---------------- */
  const questIds = Object.keys(QUESTS);
  const secondQuestId = questIds[1];
  startQuestFormat();
  doc.querySelectorAll('#questAgeList .level-card')[2].dispatchEvent(new window.MouseEvent('click', { bubbles: true })); // adult
  doc.querySelectorAll('#questCardList .level-card')[1].dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  click('introContinue');

  // Walk the real data graph so we click the objectively correct option every
  // time, guaranteeing a genuine zero-mistake run (rather than guessing by
  // DOM position, which earlier caused a false failure in this very test).
  const adultNodes = getQuestVariant(secondQuestId, 'adult').nodes;
  let walkNodeId = Object.keys(adultNodes)[0];
  steps = 0;
  while (isScreenActive('screenStory') && steps < 10) {
    const node = adultNodes[walkNodeId];
    const correctIndex = node.uk.options.findIndex((o) => o.correct);
    const correctLabel = node.uk.options[correctIndex].label;
    const opts = [...doc.querySelectorAll('#storyOptions .q-opt-btn')];
    const target = opts.find((el) => el.textContent.includes(correctLabel));
    assert(!!target, `step "${walkNodeId}": found the correct option's button in the DOM by its own label`);
    target.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
    assert(!doc.getElementById('consequenceOverlay').classList.contains('show'), `step "${walkNodeId}": clicking the objectively-correct option never shows the mistake overlay`);
    walkNodeId = node.uk.options[correctIndex].next;
    steps++;
  }
  assert(isScreenActive('screenPhone'), 'second run (adult, zero mistakes) reaches the phone screen');

  const coinsBeforePerfect = getCoins();
  pressKey('1'); pressKey('0'); pressKey('1'); // correct on the first try this time
  click('callBtn');
  await sleep(1300);
  assert(isScreenActive('screenQuestEnd'), 'second run ends successfully');
  assert(getCoins() === coinsBeforePerfect + QUEST_PERFECT_BONUS_FOR_TEST, `a zero-mistake run DOES earn the +${QUEST_PERFECT_BONUS_FOR_TEST} perfect-run coin bonus`);
  assert(doc.getElementById('questBonusNote').textContent.includes(String(QUEST_PERFECT_BONUS_FOR_TEST)), 'the bonus banner text mentions the bonus amount');

  console.log(`\n${failures === 0 ? 'ALL TESTS PASSED' : failures + ' TEST(S) FAILED'}`);
  process.exit(failures === 0 ? 0 : 1);
}

const QUEST_PERFECT_BONUS_FOR_TEST = 5; // mirrors QUEST_PERFECT_BONUS inside questGame.js
run();

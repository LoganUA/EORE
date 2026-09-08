// tests/state.test.mjs
// Focused test for the deminer-roster additions to state.js — the rest of
// state.js (coins/hints/lang/clearedArea/threats) is already exercised
// heavily by swipeGame.test.mjs, questGame.test.mjs and deminingField.test.mjs.

globalThis.window = { localStorage: (() => {
  const store = {};
  return {
    getItem: (k) => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; }
  };
})() };

const {
  getDeminers, getDeminer, hireDeminer, upgradeDeminerStat, getUpgradeStatCap,
  getFieldsCompleted, incrementFieldsCompleted,
  getCoins, addCoins
} = await import('../js/core/state.js');

let failures = 0;
function assert(cond, msg) {
  if (!cond) { failures++; console.error('FAIL:', msg); }
  else console.log('ok  :', msg);
}

/* ---------------- Starting roster ---------------- */
const initial = getDeminers();
assert(initial.length === 1, 'a fresh state starts with exactly one deminer');
assert(initial[0].id === 'd1', 'the first deminer has a stable id (d1)');
assert(initial[0].stamina === 0 && initial[0].equipment === 0 && initial[0].speed === 0, 'the first deminer starts at level 0 in every stat');

/* ---------------- Hiring ---------------- */
const afterHire = hireDeminer();
assert(afterHire.length === 2, 'hireDeminer() adds a second deminer to the roster');
assert(afterHire[1].id === 'd2', 'the second deminer gets a distinct, predictable id');
assert(getDeminer('d2').stamina === 0, 'a newly hired deminer starts at level 0, same as the first');

hireDeminer();
assert(getDeminers().length === 3, 'hiring again correctly appends a third deminer (d3)');

/* ---------------- Upgrading ---------------- */
assert(upgradeDeminerStat('d1', 'speed') === true, 'upgrading a valid stat on a valid deminer succeeds');
assert(getDeminer('d1').speed === 1, 'the upgrade actually persisted the new level');
assert(upgradeDeminerStat('d1', 'speed') === true, 'can upgrade the same stat again');
assert(getDeminer('d1').speed === 2, 'levels accumulate correctly (now level 2)');

assert(upgradeDeminerStat('d2', 'stamina') === true, 'upgrading a DIFFERENT deminer only affects that deminer');
assert(getDeminer('d1').stamina === 0, 'd1\u2019s stamina is untouched by upgrading d2\u2019s stamina');
assert(getDeminer('d2').stamina === 1, 'd2\u2019s stamina increased as expected');

assert(upgradeDeminerStat('does-not-exist', 'speed') === false, 'upgrading a non-existent deminer id fails cleanly (no throw, returns false)');
assert(upgradeDeminerStat('d1', 'not-a-real-stat') === false, 'upgrading an unknown stat key fails cleanly');

/* ---------------- Stat caps ---------------- */
const speedCap = getUpgradeStatCap('speed');
const equipCap = getUpgradeStatCap('equipment');
assert(typeof speedCap === 'number' && speedCap > 0, 'getUpgradeStatCap returns a sane cap for speed');
assert(typeof equipCap === 'number' && equipCap > 0, 'getUpgradeStatCap returns a sane cap for equipment');

for (let i = 0; i < speedCap + 3; i++) upgradeDeminerStat('d1', 'speed');
assert(getDeminer('d1').speed === speedCap, `speed cannot be upgraded past its cap (${speedCap}), even after trying ${speedCap + 3} times`);

/* ---------------- Fields completed ---------------- */
assert(getFieldsCompleted() === 0, 'fieldsCompleted starts at zero');
incrementFieldsCompleted();
incrementFieldsCompleted();
assert(getFieldsCompleted() === 2, 'incrementFieldsCompleted() accumulates correctly');

/* ---------------- Roster persists independently of coins ---------------- */
addCoins(999);
assert(getCoins() === 999, 'sanity check: coins still work normally alongside the new deminer state');
assert(getDeminers().length === 3, 'earning coins does not disturb the deminer roster');

console.log(`\n${failures === 0 ? 'ALL TESTS PASSED' : failures + ' TEST(S) FAILED'}`);
process.exit(failures === 0 ? 0 : 1);

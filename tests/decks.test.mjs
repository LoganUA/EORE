import {
  DECKS, TRUEFALSE_DECK, QUESTS,
  shuffle, buildDeckFromPool, buildSwipeDeck, buildTrueFalseDeck,
  getQuestIds, getQuestVariant
} from '../js/data/decks.js';

let failures = 0;
function assert(cond, msg) {
  if (!cond) { failures++; console.error('FAIL:', msg); }
  else console.log('ok  :', msg);
}

/* ---- Basic shape checks ---- */
assert(['child', 'teen', 'adult'].every(k => Array.isArray(DECKS[k])), 'DECKS has all three age tiers');
assert(DECKS.child.length === 15 && DECKS.teen.length === 15 && DECKS.adult.length === 15, 'each swipe deck has 15 scenarios');
assert(TRUEFALSE_DECK.length === 22, 'TRUEFALSE_DECK has 22 statements');
assert(getQuestIds().length === 5, 'QUESTS has 5 scenario ids');

/* ---- Every DECKS item has uk/en scene+why and a valid answer ---- */
['child', 'teen', 'adult'].forEach(level => {
  DECKS[level].forEach((item, i) => {
    assert(item.answer === 'safe' || item.answer === 'danger', `${level}[${i}] answer is safe/danger`);
    assert(item.uk?.scene && item.uk?.why && item.en?.scene && item.en?.why, `${level}[${i}] has full uk/en text`);
  });
});
TRUEFALSE_DECK.forEach((item, i) => {
  assert(item.answer === 'true' || item.answer === 'false', `truefalse[${i}] answer is true/false`);
});

/* ---- Deck-building helpers ---- */
const shuffled = shuffle([1,2,3,4,5]);
assert(shuffled.length === 5 && [1,2,3,4,5].every(n => shuffled.includes(n)), 'shuffle preserves all elements');

const deck10 = buildSwipeDeck('teen', 10);
assert(deck10.length === 10, 'buildSwipeDeck(teen, 10) returns exactly 10 cards');

const deck30 = buildSwipeDeck('teen', 30); // pool only has 15 -> must wrap without early repeats
assert(deck30.length === 30, 'buildSwipeDeck(teen, 30) returns exactly 30 cards even though pool is smaller');
const firstLapIds = deck30.slice(0, 15).map(c => c.uk.scene);
const uniqueFirstLap = new Set(firstLapIds);
assert(uniqueFirstLap.size === 15, 'first 15 cards of an oversized deck are all distinct (full pool exhausted before repeating)');

const tfDeck = buildTrueFalseDeck(10);
assert(tfDeck.length === 10, 'buildTrueFalseDeck(10) returns exactly 10 cards');

/* ---- Quest graph integrity: every next resolves, every node reachable, every path ends ---- */
getQuestIds().forEach(qid => {
  ['child', 'teen', 'adult'].forEach(age => {
    const variant = getQuestVariant(qid, age);
    assert(!!variant, `${qid}.${age} variant exists`);
    const nodeset = variant.nodes;
    const ids = Object.keys(nodeset);
    const firstId = ids[0];

    ids.forEach(id => {
      const node = nodeset[id];
      if (node.type === 'story') {
        ['uk', 'en'].forEach(l => {
          node[l].options.forEach(opt => {
            if (opt.correct) assert(!!nodeset[opt.next], `${qid}.${age}.${id}[${l}] correct option -> valid next "${opt.next}"`);
            else assert(!!opt.consequence, `${qid}.${age}.${id}[${l}] wrong option has a consequence`);
          });
        });
      } else if (node.type === 'call') {
        assert(!!nodeset[node.next], `${qid}.${age}.${id} call -> valid next "${node.next}"`);
        assert(node.correctNumber === '101', `${qid}.${age}.${id} correctNumber is 101`);
      }
    });

    let visited = new Set(); let queue = [firstId];
    while (queue.length) {
      const cur = queue.shift();
      if (visited.has(cur)) continue;
      visited.add(cur);
      const node = nodeset[cur];
      if (!node) continue;
      if (node.type === 'story') node.uk.options.forEach(o => { if (o.correct) queue.push(o.next); });
      else if (node.type === 'call') queue.push(node.next);
    }
    assert([...visited].some(id => nodeset[id]?.type === 'end'), `${qid}.${age} graph reaches an 'end' node`);
    ids.forEach(id => assert(id === firstId || visited.has(id), `${qid}.${age}.${id} is reachable`));
  });
});

console.log(`\n${failures === 0 ? 'ALL TESTS PASSED' : failures + ' TEST(S) FAILED'}`);
process.exit(failures === 0 ? 0 : 1);

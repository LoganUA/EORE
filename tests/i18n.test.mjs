// Minimal browser shim so state.js's window.localStorage works under plain Node
globalThis.window = { localStorage: (() => {
  const store = {};
  return {
    getItem: (k) => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; }
  };
})() };

const { t, getLevelMeta, getAllLevelMeta, COUNT_OPTIONS } = await import('../js/core/i18n.js');
const { setLang, getLang } = await import('../js/core/state.js');

console.log('--- Plain string ---');
console.log('uk menuTitle:', t('menuTitle'));
setLang('en');
console.log('en menuTitle:', t('menuTitle'));

console.log('--- Function-valued key ---');
console.log('en scoreLabel(8,10):', t('scoreLabel', 8, 10));
setLang('uk');
console.log('uk scoreLabel(8,10):', t('scoreLabel', 8, 10));

console.log('--- Forced-language override ---');
console.log('forced en while lang=uk:', t('menuTitle', 'en'));

console.log('--- Missing key handling ---');
console.log(t('thisKeyDoesNotExist'));

console.log('--- Level meta ---');
console.log(getLevelMeta('teen'));
console.log(getAllLevelMeta().map(l => l.id + ':' + l.title));

console.log('--- COUNT_OPTIONS ---');
console.log(COUNT_OPTIONS);

// js/core/i18n.js
//
// UA/EN dictionaries for every mode, plus a single t(key, ...args) helper
// that reads the active language from state.js. Consumers never touch
// STRINGS directly — always go through t() so language switching is
// automatically consistent everywhere.

import { getLang } from './state.js';

const LEVEL_META = {
  uk:{
    child:{title:"Дитина", desc:"Прості, зрозумілі ситуації для наймолодших", icon:"🧒"},
    teen:{title:"Підліток", desc:"Ситуації з друзями, цікавістю і соцмережами", icon:"🧑"},
    adult:{title:"Дорослий", desc:"Робочі, побутові та сільськогосподарські сценарії", icon:"🧑‍🌾"}
  },
  en:{
    child:{title:"Kid", desc:"Simple, easy-to-follow scenarios for younger kids", icon:"🧒"},
    teen:{title:"Teen", desc:"Situations with friends, curiosity and social media", icon:"🧑"},
    adult:{title:"Adult", desc:"Work, household and farming scenarios", icon:"🧑‍🌾"}
  }
};
const COUNT_OPTIONS = [10,15,20,30,40,50];

const STRINGS = {
  uk:{
    htmlLang:"uk",
    title:"MAG Ukraine — тримай дистанцію",
    brand:"MAG UKRAINE",
    menuTitle:"MAG Ukraine",
    menuSubtitle:"Гра на розпізнавання небезпеки. Тримай дистанцію — заробляй монети.",
    startBtn:"Почати гру",
    shopBtnMenu:"Магазин",
    levelHeader:"Обери рівень",
    countHeader:"Кількість питань",
    countUnit:"питань",
    shopHeader:"Магазин",
    shopNote:"1 монета = 1 правильна відповідь. Підказка одразу показує детальне пояснення до поточної ситуації.",
    shopItem1:"1 підказка", shopItem2:"2 підказки", shopItem3:"3 підказки",
    buyBtn:"Купити",
    streakLabel:"поспіль",
    dangerLabel:"Небезпечно",
    safeLabel:"Безпечно",
    hint:"Свайпни або обери кнопкою",
    stampLeft:"НЕБЕЗПЕЧНО",
    stampRight:"БЕЗПЕЧНО",
    correctTitle:"Правильно",
    wrongTitle:"Було ризиковано",
    continueBtn:"Далі",
    hintTitle:"Підказка",
    hintCloseBtn:"Зрозуміло",
    noHintsText:"Підказок немає. Заглянь у магазин у головному меню — за правильні відповіді ти отримуєш монети.",
    buyHintPrompt:(price)=>`У тебе немає підказок. Купити одну за ${price} монет і одразу побачити пояснення?`,
    buyHintConfirmBtn:(price)=>`Купити (🪙 ${price})`,
    cancelBtn:"Скасувати",
    notEnoughCoinsText:"Монет поки не вистачає. Відповідай правильно, щоб заробити ще, і повертайся за підказкою.",
    resultsHeader:"Результат сесії",
    scoreLabel:(s,m)=>`${s} правильних відповідей із ${m}`,
    tagPerfect:"Ідеальна дистанція",
    tagGood:"Гостре око",
    tagOk:"Непогано, є куди рости",
    tagRetry:"Варто повторити правила",
    descPerfect:"Ти бездоганно відрізняєш небезпечні ситуації від безпечних і завжди обираєш триматися на відстані.",
    descGood:"Ти впевнено розпізнаєш більшість небезпек — лишилось відточити кілька деталей, дивись розбір нижче.",
    descOk:"Базові сигнали небезпеки ти вже вловлюєш, але кілька правил варто повторити ще раз.",
    descRetry:"Поки що складно відрізнити небезпечне від безпечного — рекомендуємо повторити основні правила EORE.",
    coinsEarned:(n)=>`Зароблено монет за сесію: +${n}`,
    noMisses:"Жодного пропуску — усі небезпеки розпізнано правильно.",
    shareBtn:"Копіювати результат",
    shareCopied:"Скопійовано!",
    downloadBtn:"Завантажити картку",
    restartBtn:"Ще раз",
    menuBtnEnd:"Головне меню",
    perfectBannerText:"Ідеальне проходження — жодної помилки! Спробуй ще раз, щоб закріпити знання, або зіграй з іншою кількістю питань.",
    shareText:(s,m,levelTitle)=>`MAG Ukraine: розпізнав ${s}/${m} небезпек на рівні «${levelTitle}». Спробуй побити мій результат! 🎯`,
    formatHeader:"Обери формат гри",
    formatSwipeTitle:"Безпечно чи небезпечно",
    formatSwipeDesc:"Свайп-гра: швидко розпізнавай ризиковані ситуації",
    formatQuestTitle:"Розслідування",
    formatQuestDesc:"Квест з розгалуженим сюжетом і викликом 101",
    formatTruthTitle:"Правда чи Неправда",
    formatTruthDesc:"Перевір, що з цього факт, а що поширений міф",
    formatFieldTitle:"Полігон розмінування",
    formatFieldDesc:"Плати за роботу саперів і дізнавайся, що реально знаходять у ґрунті",
    deminingFieldHeader:"Полігон розмінування",
    dfAreaLabel:"м² очищено всього",
    dfRemainingLabel:"ділянок лишилось",
    dfCompleteText:"Ділянку повністю обстежено. Можна перейти на нову.",
    dfNewFieldBtn:"Нова ділянка",
    dfCatalogBtn:"Довідник загроз",
    dfNotEnoughCoinsTitle:"Недостатньо монет",
    dfNotEnoughCoinsText:(cost)=>`Виклик саперів на цю ділянку коштує ${cost} монет. Заробляй монети в інших режимах гри.`,
    dfReportClearTitle:"Ділянку перевірено",
    dfReportClearText:"Небезпечних предметів не виявлено.",
    dfReportFoundTitle:"Ділянку очищено",
    dfReportFoundText:(name)=>`Виявлено та знищено: ${name}.`,
    dfReportCloseBtn:"Зрозуміло",
    threatCatalogHeader:"Довідник загроз",
    dfCatalogAreaLabel:"м² безпечно очищено за весь час",
    dfCatalogCountLabel:"виявлено разів",
    trueLabel:"Правда",
    falseLabel:"Неправда",
    stampTrue:"ПРАВДА",
    stampFalse:"НЕПРАВДА",
    questListHeader:"Обери сценарій",
    backToScenariosLabel:"До вибору сценарію",
    startQuestBtn:"Розпочати",
    callBtnLabel:"Викликати",
    optionLetters:["А","Б"],
    stopLabels:["Зупинись","Не чіпай","Відійди","Повідом"],
    consequenceTitle:"⚠ Небезпечне рішення",
    consequenceRetryBtn:"Спробувати ще раз",
    questEndMenuBtn:"До сценаріїв",
    questEndReplayBtn:"Пройти ще раз",
    questAgeHeader:"Обери рівень",
    questBonusEarned:(n)=>`Ідеальне проходження — жодної помилки! Бонус: +${n} монет 🪙`,
    questBonusMissed:(n)=>`Були помилки в цьому проходженні. Пройди без жодної помилки, щоб отримати бонус +${n} монет.`,
    questToSwipeLabel:"Спробуй режим «Безпечно чи небезпечно»",
    swipeToQuestLabel:"Спробуй режим «Розслідування»"
  },
  en:{
    htmlLang:"en",
    title:"MAG Ukraine — keep your distance",
    brand:"MAG UKRAINE",
    menuTitle:"MAG Ukraine",
    menuSubtitle:"A hazard-recognition game. Keep your distance — earn coins.",
    startBtn:"Start game",
    shopBtnMenu:"Shop",
    levelHeader:"Choose a level",
    countHeader:"Number of questions",
    countUnit:"questions",
    shopHeader:"Shop",
    shopNote:"1 coin = 1 correct answer. A hint instantly shows a detailed explanation for the current scenario.",
    shopItem1:"1 hint", shopItem2:"2 hints", shopItem3:"3 hints",
    buyBtn:"Buy",
    streakLabel:"streak",
    dangerLabel:"Danger",
    safeLabel:"Safe",
    hint:"Swipe or tap a button",
    stampLeft:"DANGER",
    stampRight:"SAFE",
    correctTitle:"Correct",
    wrongTitle:"That was risky",
    continueBtn:"Next",
    hintTitle:"Hint",
    hintCloseBtn:"Got it",
    noHintsText:"No hints left. Check the shop in the main menu — correct answers earn you coins.",
    buyHintPrompt:(price)=>`You have no hints left. Buy one for ${price} coins and see the explanation right away?`,
    buyHintConfirmBtn:(price)=>`Buy (🪙 ${price})`,
    cancelBtn:"Cancel",
    notEnoughCoinsText:"Not enough coins yet. Answer correctly to earn more, then come back for a hint.",
    resultsHeader:"Session result",
    scoreLabel:(s,m)=>`${s} correct answers out of ${m}`,
    tagPerfect:"Perfect distance",
    tagGood:"Sharp eye",
    tagOk:"Not bad, room to grow",
    tagRetry:"Worth reviewing the basics",
    descPerfect:"You flawlessly tell hazardous situations apart from safe ones and always choose to keep your distance.",
    descGood:"You confidently spot most hazards — just a few details to sharpen, see the breakdown below.",
    descOk:"You're picking up the basic warning signs, but a few rules are worth reviewing again.",
    descRetry:"Telling safe from dangerous is still tricky — we'd recommend reviewing the core EORE rules.",
    coinsEarned:(n)=>`Coins earned this session: +${n}`,
    noMisses:"No misses — every danger correctly spotted.",
    shareBtn:"Copy result",
    shareCopied:"Copied!",
    downloadBtn:"Download card",
    restartBtn:"Play again",
    menuBtnEnd:"Main menu",
    perfectBannerText:"Perfect run — zero mistakes! Play again to lock it in, or try a different question count.",
    shareText:(s,m,levelTitle)=>`MAG Ukraine: spotted ${s}/${m} hazards on the "${levelTitle}" level. Can you beat my score? 🎯`,
    formatHeader:"Choose a game format",
    formatSwipeTitle:"Safe or Danger",
    formatSwipeDesc:"Swipe game: quickly spot risky situations",
    formatQuestTitle:"Investigation",
    formatQuestDesc:"Branching-story quest with a 101 emergency call",
    formatTruthTitle:"Truth or Myth",
    formatTruthDesc:"Test what's fact and what's a common myth",
    formatFieldTitle:"Land Release Field",
    formatFieldDesc:"Pay for deminers to clear ground and see what's really found",
    deminingFieldHeader:"Land Release Field",
    dfAreaLabel:"m² cleared in total",
    dfRemainingLabel:"plots remaining",
    dfCompleteText:"This plot has been fully surveyed. You can move to a new one.",
    dfNewFieldBtn:"New plot",
    dfCatalogBtn:"Threat reference",
    dfNotEnoughCoinsTitle:"Not enough coins",
    dfNotEnoughCoinsText:(cost)=>`Calling in deminers for this plot costs ${cost} coins. Earn coins in the other game modes.`,
    dfReportClearTitle:"Plot surveyed",
    dfReportClearText:"No hazardous items were found.",
    dfReportFoundTitle:"Plot cleared",
    dfReportFoundText:(name)=>`Found and destroyed: ${name}.`,
    dfReportCloseBtn:"Got it",
    threatCatalogHeader:"Threat reference",
    dfCatalogAreaLabel:"m² safely cleared all-time",
    dfCatalogCountLabel:"times found",
    trueLabel:"True",
    falseLabel:"False",
    stampTrue:"TRUE",
    stampFalse:"FALSE",
    questListHeader:"Choose a scenario",
    backToScenariosLabel:"Back to scenarios",
    startQuestBtn:"Begin",
    callBtnLabel:"Call",
    optionLetters:["A","B"],
    stopLabels:["Stop","Don't touch","Move back","Report"],
    consequenceTitle:"⚠ Risky decision",
    consequenceRetryBtn:"Try again",
    questEndMenuBtn:"Back to scenarios",
    questEndReplayBtn:"Play again",
    questAgeHeader:"Choose a level",
    questBonusEarned:(n)=>`Perfect run — zero mistakes! Bonus: +${n} coins 🪙`,
    questBonusMissed:(n)=>`There were mistakes this run. Clear it with zero mistakes to earn the +${n} coin bonus.`,
    questToSwipeLabel:"Try the \"Safe or Danger\" mode",
    swipeToQuestLabel:"Try the \"Investigation\" mode"
  }
};

/* ---------------------------------------------------------------------
 * Translation helper
 * ------------------------------------------------------------------- */

/**
 * t('menuTitle')                     -> plain string, in the current language
 * t('scoreLabel', 8, 10)             -> calls STRINGS[lang].scoreLabel(8, 10)
 * t('scoreLabel', 8, 10, 'en')       -> force a specific language (rare; e.g.
 *                                        building both-language share text)
 *
 * Throws a clear console error (not a silent undefined) if a key is missing,
 * so a typo surfaces immediately during development instead of showing up
 * as blank text in the UI.
 */
export function t(key, ...args) {
  const forcedLang = args.length && (args[args.length - 1] === 'uk' || args[args.length - 1] === 'en')
    ? args.pop()
    : null;
  const lang = forcedLang || getLang();
  const dict = STRINGS[lang];
  const entry = dict ? dict[key] : undefined;

  if (entry === undefined) {
    console.error(`[i18n] Missing translation key "${key}" for language "${lang}".`);
    return `⚠ ${key}`;
  }

  return typeof entry === 'function' ? entry(...args) : entry;
}

/** Returns the LEVEL_META entry (title/desc/icon) for a given age tier. */
export function getLevelMeta(levelId, lang = getLang()) {
  return LEVEL_META[lang][levelId];
}

/** All three age tiers for the current language, in display order. */
export function getAllLevelMeta(lang = getLang()) {
  return ['child', 'teen', 'adult'].map((id) => ({ id, ...LEVEL_META[lang][id] }));
}

export { COUNT_OPTIONS };

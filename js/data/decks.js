// js/data/decks.js
//
// All question/scenario content lives here — the swipe-game card pools
// (three age tiers), the Truth-or-Myth pool, and the full branching-quest
// graphs for the Investigation mode. Pure data, no logic: the mode
// modules (swipeGame.js / questGame.js) import from here and decide
// what to do with it.

export const DECKS = {
child: [
 {icon:"🏡", answer:"safe", uk:{scene:"Граєшся у дворі свого будинку за парканом", why:"Свій двір за парканом — знайоме й безпечне місце для ігор."},
  en:{scene:"Playing in your own yard behind the fence", why:"Your own fenced yard is a familiar, safe place to play."}},
 {icon:"❓", answer:"danger", uk:{scene:"На прогулянці побачив блискучу дивну штучку в траві", why:"Не знайомі блискучі предмети можуть бути небезпечними. Не бери її — поклич дорослого."},
  en:{scene:"On a walk you spot a shiny strange little object in the grass", why:"Unfamiliar shiny objects can be dangerous. Don't pick it up — call an adult."}},
 {icon:"➰", answer:"danger", uk:{scene:"У лісі між кущами натягнута мотузка біля самої землі", why:"Це може бути розтяжка. Зупинись і одразу поклич дорослого."},
  en:{scene:"In the woods a cord is stretched between bushes near the ground", why:"This could be a tripwire. Stop right away and call an adult immediately."}},
 {icon:"🌳", answer:"safe", uk:{scene:"Ідеш знайомою доріжкою в парку разом з мамою", why:"Знайома доріжка поруч з дорослим — це безпечно."},
  en:{scene:"Walking a familiar park path together with your mom", why:"A familiar path with an adult nearby is safe."}},
 {icon:"📦", answer:"danger", uk:{scene:"Друг кличе піти подивитись цікаву коробку на пустирі", why:"Незнайомі місця й предмети можуть бути небезпечними. Не йди сам — розкажи дорослому."},
  en:{scene:"A friend wants you to go check out an interesting box on a vacant lot", why:"Unfamiliar places and objects can be dangerous. Don't go alone — tell an adult."}},
 {icon:"🎡", answer:"safe", uk:{scene:"Граєшся на дитячому майданчику в місті на перерві", why:"Звичний дитячий майданчик у місті — безпечне місце для гри."},
  en:{scene:"Playing at the city playground during break", why:"A familiar city playground is a safe place to play."}},
 {icon:"🪖", answer:"danger", uk:{scene:"На смітнику побачив щось схоже на військову річ і хочеш взяти додому", why:"Військові предмети можуть вибухнути. Не торкайся — розкажи дорослому, де це лежить."},
  en:{scene:"You see something that looks military at the dump and want to take it home", why:"Military-looking objects can explode. Don't touch it — tell an adult exactly where it is."}},
 {icon:"🚲", answer:"safe", uk:{scene:"Катаєшся на велосипеді знайомою вулицею, батьки поруч", why:"Знайома вулиця й дорослі поруч роблять прогулянку безпечною."},
  en:{scene:"Riding your bike on a familiar street with parents nearby", why:"A familiar street with adults nearby makes the ride safe."}},
 {icon:"🖼️", answer:"safe", uk:{scene:"Вчителька показує плакат про небезпечні предмети на уроці", why:"Це просто малюнок для навчання, а не сам небезпечний предмет."},
  en:{scene:"Your teacher shows a poster about dangerous objects in class", why:"It's just a picture for learning, not the dangerous object itself."}},
 {icon:"🧸", answer:"danger", uk:{scene:"У дворі після гучних звуків знайшов щось схоже на іграшку", why:"Після обстрілів такі речі можуть бути насправді небезпечними. Не бери — поклич дорослого."},
  en:{scene:"After loud noises you find something in the yard that looks like a toy", why:"After shelling such things can actually be dangerous. Don't touch it — call an adult."}},
 {icon:"🏫", answer:"safe", uk:{scene:"Ідеш до школи головною дорогою, як завжди", why:"Звична головна дорога до школи — безпечний щоденний маршрут."},
  en:{scene:"Walking to school on the main road, like every day", why:"The usual main road to school is a safe daily route."}},
 {icon:"🌾", answer:"danger", uk:{scene:"Хочеться зрізати шлях через незнайоме поле, щоб швидше додому", why:"Незнайоме поле може бути небезпечним. Йди тільки знайомою дорогою, навіть якщо вона довша."},
  en:{scene:"You want to cut through an unfamiliar field to get home faster", why:"An unfamiliar field can be dangerous. Stick to the known road, even if it takes longer."}},
 {icon:"👵", answer:"safe", uk:{scene:"Ідеш з бабусею стежкою, якою вона ходить щодня", why:"Дорослий, який щодня ходить цим шляхом, знає, що він безпечний."},
  en:{scene:"Walking with grandma on a path she takes every day", why:"An adult who walks this path daily knows it's safe."}},
 {icon:"🕳️", answer:"danger", uk:{scene:"У лісі побачив яму, а на дні щось металеве", why:"Металеві предмети в ямах можуть бути небезпечними. Не заглядай близько — розкажи дорослому."},
  en:{scene:"In the forest you see a pit with something metal at the bottom", why:"Metal objects in pits can be dangerous. Don't get close — tell an adult about it."}},
 {icon:"🛝", answer:"safe", uk:{scene:"Граєшся на шкільному подвір'ї разом з друзями на перерві", why:"Шкільне подвір'я під наглядом дорослих — безпечне місце для ігор."},
  en:{scene:"Playing in the school yard with friends during break", why:"A school yard supervised by adults is a safe place to play."}}
],
teen: [
 {icon:"📸", answer:"danger", uk:{scene:"Друзі пропонують піти сфоткатись біля покинутого блокпоста для соцмереж", why:"Покинуті військові об'єкти можуть бути заміновані. Не йди туди навіть заради фото."},
  en:{scene:"Friends suggest taking photos at an abandoned checkpoint for social media", why:"Abandoned military sites can be mined. Don't go there, even for a photo."}},
 {icon:"🚲", answer:"safe", uk:{scene:"Їдеш на велосипеді асфальтованою вулицею свого мікрорайону", why:"Знайома асфальтована вулиця в районі — безпечний маршрут."},
  en:{scene:"Riding your bike on a paved street in your neighbourhood", why:"A familiar paved street in your area is a safe route."}},
 {icon:"📱", answer:"danger", uk:{scene:"У груповому чаті хтось скидає відео, як розкопує гільзу «на цікаво»", why:"Повторювати такі дії реально небезпечно. Не роби так і попроси інших теж цього не робити."},
  en:{scene:"In a group chat someone posts a video of digging up a shell casing \"for fun\"", why:"Copying this is genuinely dangerous. Don't do it, and encourage others not to either."}},
 {icon:"🌊", answer:"safe", uk:{scene:"Прогулянка набережною в центрі міста ввечері з друзями", why:"Людна набережна в центрі міста — звичне безпечне місце для прогулянок."},
  en:{scene:"An evening walk along the city-centre waterfront with friends", why:"A busy city-centre waterfront is a familiar, safe place to walk."}},
 {icon:"🏞️", answer:"danger", uk:{scene:"Скорочуєш шлях до школи через пустир, яким давно ніхто не ходить", why:"Занедбані пустирі можуть бути небезпечними. Ходи тільки перевіреними маршрутами."},
  en:{scene:"Cutting through a vacant lot nobody uses anymore to save time getting to school", why:"Abandoned vacant lots can be dangerous. Stick to routes people actually use."}},
 {icon:"⚽", answer:"safe", uk:{scene:"Тренування на спортивному майданчику школи після уроків", why:"Звичний шкільний майданчик — безпечне місце для тренувань."},
  en:{scene:"Training at the school sports ground after classes", why:"The familiar school sports ground is a safe place to train."}},
 {icon:"🛖", answer:"danger", uk:{scene:"На дачі в сараї знайшов стару каску, а поруч щось металеве", why:"Такі знахідки можуть бути небезпечними. Не чіпай нічого — скажи дорослим і зателефонуй на 101."},
  en:{scene:"In a shed at the family cottage you find an old helmet with something metal nearby", why:"Finds like this can be dangerous. Don't touch anything — tell an adult and call the hotline."}},
 {icon:"🚌", answer:"safe", uk:{scene:"Їдеш автобусом за звичним маршрутом до сусіднього села", why:"Регулярний автобусний маршрут — перевірений і безпечний спосіб пересування."},
  en:{scene:"Taking the regular bus route to the next village", why:"A regular bus route is a checked, safe way to travel."}},
 {icon:"🕳️", answer:"danger", uk:{scene:"Друг пропонує залізти в покинутий окоп «просто цікаво»", why:"Покинуті військові споруди можуть бути небезпечними всередині. Відмовся й відговори друга."},
  en:{scene:"A friend suggests climbing into an abandoned trench \"just out of curiosity\"", why:"Abandoned military structures can be dangerous inside. Say no and talk your friend out of it too."}},
 {icon:"🧹", answer:"safe", uk:{scene:"Волонтерське прибирання сміття у визначеній безпечній зоні разом з дорослими", why:"Організоване прибирання в перевіреній зоні з дорослими — безпечна активність."},
  en:{scene:"Volunteer litter clean-up in a designated safe zone together with adults", why:"An organised clean-up in a checked zone with adults present is a safe activity."}},
 {icon:"📍", answer:"danger", uk:{scene:"У соцмережах побачив пост з геолокацією «класне місце» біля колишньої лінії фронту", why:"Місця біля колишніх бойових позицій можуть бути небезпечними. Не йди перевіряти особисто."},
  en:{scene:"A social media post with a geotag calls a spot near the former front line \"cool\"", why:"Areas near former combat positions can be dangerous. Don't go check it out yourself."}},
 {icon:"🎸", answer:"safe", uk:{scene:"Заняття в гуртку чи спортзалі після школи", why:"Звичне заняття в приміщенні під наглядом — безпечна активність."},
  en:{scene:"After-school club or gym practice", why:"A regular supervised indoor activity is safe."}},
 {icon:"➰", answer:"danger", uk:{scene:"На прогулянці з друзями в лісосмузі під ногами помітив провід", why:"Провід на землі може бути розтяжкою. Зупинись, попередь друзів і йдіть назад тим самим шляхом."},
  en:{scene:"Walking with friends in a tree line, you notice a wire underfoot", why:"A wire on the ground could be a tripwire. Stop, warn your friends, and retrace your steps."}},
 {icon:"🥕", answer:"safe", uk:{scene:"Допомагаєш батькам на городі в межах обробленої ділянки біля дому", why:"Постійно оброблювана ділянка біля дому — безпечне й знайоме місце."},
  en:{scene:"Helping your parents in the garden plot right by the house", why:"A regularly worked plot next to the house is a safe, familiar place."}},
 {icon:"🏚️", answer:"danger", uk:{scene:"Компанія вирішила зайти в напівзруйнований будинок «подивитись»", why:"Пошкоджені будівлі можуть приховувати небезпечні предмети. Не заходь туди без фахівців."},
  en:{scene:"Your friend group decides to go inside a half-ruined building \"just to look\"", why:"Damaged buildings can hide dangerous objects. Don't enter without specialists."}}
],
adult: [
 {icon:"🥕", answer:"safe", uk:{scene:"Обробляєш город на ділянці, яку родина возделює вже кілька років", why:"Ділянка, яку регулярно обробляють роками, вважається перевіреною й безпечною."},
  en:{scene:"Working a garden plot your family has cultivated for years", why:"A plot worked regularly for years is considered checked and safe."}},
 {icon:"🚜", answer:"danger", uk:{scene:"Під час оранки нового поля трактор наштовхнувся на підозрілий предмет", why:"Негайно зупини роботу, відведи людей і техніку та зателефонуй на 101, не намагаючись дістати предмет."},
  en:{scene:"While ploughing a new field the tractor hits a suspicious object", why:"Stop work immediately, move people and machinery away, and call the hotline — don't try to remove it yourself."}},
 {icon:"🔨", answer:"safe", uk:{scene:"Ремонтуєш паркан на подвір'ї власного будинку", why:"Робота на власному, добре знайомому подвір'ї — безпечна щоденна справа."},
  en:{scene:"Repairing the fence in your own home yard", why:"Work in your own familiar yard is a safe everyday task."}},
 {icon:"🧱", answer:"danger", uk:{scene:"Самостійно розбираєш завали в пошкодженому будинку без саперів", why:"У завалах можуть залишатись невибухлі елементи. Розбирання завалів — робота фахівців, не власноруч."},
  en:{scene:"Clearing rubble in a damaged building yourself, without deminers", why:"Rubble can hide unexploded remnants. Clearing it is a job for specialists, not DIY."}},
 {icon:"🚗", answer:"safe", uk:{scene:"Їдеш на роботу знайомим маршрутом, яким їздиш щодня", why:"Щоденний маршрут з активним рухом — перевірений і безпечний."},
  en:{scene:"Driving to work on the route you take every single day", why:"A daily route with regular traffic is checked and safe."}},
 {icon:"⚠️", answer:"danger", uk:{scene:"Під час городніх робіт на щойно деокупованій території натрапив на боєприпас", why:"Зупини роботу, познач місце здалеку (без наближення) і зателефонуй на 101 чи ДСНС."},
  en:{scene:"While gardening in a newly de-occupied area you come across a piece of ordnance", why:"Stop working, mark the location from a distance without approaching, and call the emergency hotline."}},
 {icon:"🌿", answer:"safe", uk:{scene:"Косиш траву на подвір'ї в межах власного паркану", why:"Робота в межах власної, регулярно доглянутої ділянки — безпечна."},
  en:{scene:"Mowing the lawn within your own fenced property", why:"Work within your own regularly maintained property is safe."}},
 {icon:"🍄", answer:"danger", uk:{scene:"Збираєш гриби чи ягоди в незнайомому лісі, де раніше йшли бої", why:"Ліси в зонах бойових дій можуть бути заміновані. Збирай урожай лише в перевірених і знайомих місцях."},
  en:{scene:"Picking mushrooms or berries in an unfamiliar forest that saw past fighting", why:"Forests in former combat zones can be mined. Only forage in checked, familiar places."}},
 {icon:"🚌", answer:"safe", uk:{scene:"Їдеш на роботу маршрутним автобусом за звичним графіком", why:"Регулярний громадський транспорт — перевірений безпечний спосіб пересування."},
  en:{scene:"Commuting to work on the regular scheduled bus", why:"Regular public transport is a checked, safe way to get around."}},
 {icon:"⚙️", answer:"danger", uk:{scene:"Хочеш розібрати покинуту військову техніку на металобрухт", why:"Покинута техніка може бути заміновою або містити боєприпаси. Не підходь і повідом відповідні служби."},
  en:{scene:"You want to scrap an abandoned military vehicle for metal", why:"Abandoned vehicles can be booby-trapped or hold ordnance. Don't approach — report it to the authorities."}},
 {icon:"🏠", answer:"safe", uk:{scene:"Ремонтуєш дах власного будинку", why:"Робота на власному, безпечному будинку — звична щоденна справа."},
  en:{scene:"Repairing the roof of your own house", why:"Work on your own safe house is a routine everyday task."}},
 {icon:"📦", answer:"danger", uk:{scene:"При переїзді в новий будинок у сараї знайшов ящик з боєприпасами", why:"Нічого не чіпай і не пересувай. Зачини приміщення й негайно зателефонуй у ДСНС."},
  en:{scene:"Moving into a new house, you find a crate of ordnance in the shed", why:"Don't touch or move anything. Close off the area and call the emergency services immediately."}},
 {icon:"🐕", answer:"safe", uk:{scene:"Гуляєш з собакою знайомим маршрутом по вулиці", why:"Звичний маршрут для прогулянок з твариною в межах міста — безпечний."},
  en:{scene:"Walking the dog along your usual street route", why:"A familiar in-town walking route with your pet is safe."}},
 {icon:"🎣", answer:"danger", uk:{scene:"Рибалиш на новому, ще не перевіреному березі річки в прифронтовій зоні", why:"Береги в прифронтових зонах можуть бути заміновані. Обирай тільки відомі й перевірені місця для риболовлі."},
  en:{scene:"Fishing from a new, unchecked riverbank in a former front-line area", why:"Riverbanks in former front-line areas can be mined. Only fish from known, checked spots."}},
 {icon:"🏢", answer:"safe", uk:{scene:"Робочий день в офісі чи магазині в центрі міста", why:"Звичне робоче приміщення в центрі міста — безпечне середовище."},
  en:{scene:"A regular work day at an office or shop in the city centre", why:"A familiar workplace in the city centre is a safe environment."}}
]
};


export const TRUEFALSE_DECK = [
 {icon:"🔍", answer:"true",
  uk:{scene:"Сучасні міни можуть містити мінімум металу, тому металодетектор може їх не побачити",
      why:"Виробники спеціально роблять корпуси таких мін з пластмаси чи дерева, щоб їх складніше було виявити стандартним металошукачем."},
  en:{scene:"Modern mines can contain very little metal, so a metal detector may miss them",
      why:"Manufacturers deliberately make some mine casings from plastic or wood specifically to make them harder to detect with a standard metal detector."}},
 {icon:"⏳", answer:"false",
  uk:{scene:"Якщо міна пролежала в землі багато років, вона втрачає бойову здатність і стає безпечною",
      why:"Насправді все навпаки: вибухівка та детонатори з часом стають лише нестабільнішими й чутливішими, а не безпечнішими."},
  en:{scene:"If a mine has been buried for many years, it loses its explosive power and becomes harmless",
      why:"The opposite is true: over time, explosives and detonators become more unstable and more sensitive, not safer."}},
 {icon:"🍃", answer:"true",
  uk:{scene:"Протипіхотну міну ПФМ-1 («пелюстку») часто плутають з іграшкою чи шматком пластику",
      why:"Її незвичайна форма і невеликий розмір спеціально нагадують побутовий предмет, що робить її особливо небезпечною для дітей."},
  en:{scene:"The PFM-1 anti-personnel mine (\"petal mine\") is often mistaken for a toy or a piece of plastic",
      why:"Its unusual shape and small size resemble an everyday object, which makes it especially dangerous for children."}},
 {icon:"➰", answer:"false",
  uk:{scene:"Розтяжку завжди легко помітити, бо дріт натягнутий на рівні очей і блищить на сонці",
      why:"Дріт розтяжки може бути натягнутий біля самої землі, замаскований травою чи листям, а завтовшки — як волосінь."},
  en:{scene:"A tripwire is always easy to spot because it's stretched at eye level and glints in the sun",
      why:"A tripwire can be strung close to the ground, hidden by grass or leaves, and as thin as fishing line."}},
 {icon:"🎯", answer:"true",
  uk:{scene:"Касетні боєприпаси мають високий відсоток нерозірваних елементів, що перетворюються на міни-пастки",
      why:"Іноді 10-30% і більше суббоєприпасів не спрацьовують одразу і залишаються небезпечними непередбачувано довго."},
  en:{scene:"Cluster munitions have a high failure rate, and the unexploded submunitions become unpredictable mine-like hazards",
      why:"Sometimes 10-30% or more of submunitions don't detonate on impact and remain dangerous for an unpredictable length of time."}},
 {icon:"🚫", answer:"false",
  uk:{scene:"Якщо вистрілити в міну з безпечної відстані, вона вибухне і повністю зникне без загрози довкіллю",
      why:"Стрільба по боєприпасах — порушення правил безпеки: вона може спричинити неконтрольовану детонацію й розліт осколків на велику відстань."},
  en:{scene:"Shooting a mine from a safe distance makes it explode and disappear completely, with no risk to the area",
      why:"Shooting at ordnance breaks basic safety rules — it can trigger an uncontrolled detonation and send fragments flying over a wide area."}},
 {icon:"📡", answer:"true",
  uk:{scene:"Деякі вибухові пристрої реагують не лише на вагу, а й на зміну магнітного поля чи звукові коливання",
      why:"Це один із багатьох типів сенсорів, тому спосіб спрацювання не завжди пов'язаний з прямим тиском чи дотиком."},
  en:{scene:"Some explosive devices react not only to weight, but also to changes in magnetic field or sound vibrations",
      why:"This is just one of several sensor types used, so the trigger isn't always a matter of direct pressure or contact."}},
 {icon:"✋", answer:"true",
  uk:{scene:"Побачивши підозрілий предмет, категорично заборонено наближатися, торкатися, штовхати чи переносити його",
      why:"Будь-яка взаємодія з предметом — навіть обережна — може призвести до спрацювання. Головне правило: не наближайся й не чіпай."},
  en:{scene:"If you spot a suspicious object, you must never approach, touch, nudge, or move it",
      why:"Any interaction with the object — even a careful one — can trigger it. The core rule is: don't approach, don't touch."}},
 {icon:"🏃", answer:"false",
  uk:{scene:"Якщо ви зайшли на мінне поле, найкраще швидко бігти назад по своїх слідах",
      why:"Різкі рухи й кроки збільшують ризик детонації. Потрібно зупинитись і чекати на допомогу, або дуже повільно й обережно відступати слід у слід."},
  en:{scene:"If you've walked into a minefield, the best move is to run back quickly along your own footsteps",
      why:"Sudden movements and steps increase the risk of detonation. You should stop and wait for help, or retreat very slowly, retracing your exact footsteps."}},
 {icon:"📱", answer:"true",
  uk:{scene:"Не можна користуватися мобільними телефонами чи рацією ближче ніж за 100 метрів від підозрілого предмета",
      why:"Радіохвилі теоретично можуть спровокувати спрацювання радіокерованого детонатора, тому краще перестрахуватись і відійти подалі."},
  en:{scene:"You shouldn't use mobile phones or radios within 100 metres of a suspicious object",
      why:"Radio waves can, in theory, trigger a radio-controlled detonator, so it's safer to move further away before using any device."}},
 {icon:"💧", answer:"false",
  uk:{scene:"Якщо закопати міну глибше або засипати водою, вона не спрацює від наступу людини",
      why:"Тиск все одно передається через ґрунт. Ані вода, ані шар землі не зупиняють механічний чи сейсмічний вплив на підривник."},
  en:{scene:"Burying a mine deeper or covering it with water stops it from triggering when someone steps on it",
      why:"Pressure still transfers through the soil. Neither water nor a layer of earth blocks the mechanical or seismic effect on the fuse."}},
 {icon:"🛑", answer:"true",
  uk:{scene:"Правило «Зупинись, не рухайся, відійди тим самим шляхом і зателефонуй 101» — золотий стандарт безпеки",
      why:"Ця послідовність дій мінімізує ризик на кожному етапі й дає фахівцям точну інформацію для реагування."},
  en:{scene:"The rule \"Stop, don't move, retreat the same way you came, and call 101\" is the gold standard for safety",
      why:"This sequence minimises risk at every stage and gives specialists the precise information they need to respond."}},
 {icon:"🐕", answer:"false",
  uk:{scene:"Домашні тварини мають природний інстинкт обходити міни, тож якщо тварина пробігла — там безпечно",
      why:"Тварини не знають принципів роботи мін і самі часто стають жертвами замінованих територій — це не показник безпеки."},
  en:{scene:"Pets have a natural instinct to avoid mines, so if an animal ran through an area, it's safe",
      why:"Animals have no understanding of how mines work and are frequently injured by them themselves — their presence proves nothing about safety."}},
 {icon:"🌿", answer:"true",
  uk:{scene:"Густа трава, зарослі кущі, покинуті будівлі та узбіччя доріг — зони підвищеної небезпеки",
      why:"Це найпоширеніші місця, де маскують вибухонебезпечні предмети, тому саме там варто бути особливо обережним."},
  en:{scene:"Tall grass, dense bushes, abandoned buildings and roadsides are all higher-risk zones",
      why:"These are the most common places where explosive hazards are concealed, so extra caution is warranted there."}},
 {icon:"⚠️", answer:"false",
  uk:{scene:"Якщо на полі немає попереджувальних знаків «Обережно, міни!», територія на 100% безпечна",
      why:"Знаки часто зривають, крадуть, або їх просто не встигли встановити на нових небезпечних ділянках. Відсутність знака нічого не гарантує."},
  en:{scene:"If a field has no \"Danger: mines!\" warning signs, the area is 100% safe",
      why:"Signs are often torn down, stolen, or simply not yet installed on newly hazardous ground. No sign is no guarantee."}},
 {icon:"🚗", answer:"true",
  uk:{scene:"Згорілу техніку та розбиті машини на дорогах і в полях часто навмисно мінують мінами-пастками",
      why:"Знищена техніка приваблює цікавих і мародерів, тому її нерідко цілеспрямовано мінують, розраховуючи саме на це."},
  en:{scene:"Burnt-out vehicles and wrecked cars on roads and in fields are often deliberately booby-trapped",
      why:"Destroyed vehicles attract curious onlookers and looters, so they're frequently mined specifically to target them."}},
 {icon:"🧊", answer:"false",
  uk:{scene:"Взимку міни примерзають до землі й не можуть спрацювати під ногами",
      why:"Зимові умови можуть змінювати чутливість деяких механізмів, але стандартні натискні міни спрацьовують від звичайного тиску чи зрушення снігу."},
  en:{scene:"In winter, mines freeze into the ground and can't be triggered by stepping on them",
      why:"Winter conditions can change the sensitivity of some mechanisms, but standard pressure mines still trigger from normal weight or snow movement."}},
 {icon:"✅", answer:"true",
  uk:{scene:"Безпечна для пересування лише територія, яка пройшла офіційне обстеження чи розмінування ДСНС",
      why:"Тільки сертифіковані оператори й офіційна процедура обстеження дають реальну гарантію безпеки ділянки."},
  en:{scene:"Only land that has passed official survey or clearance by certified deminers is safe to walk on",
      why:"Only certified operators following an official survey procedure can give a genuine safety guarantee for an area."}},
 {icon:"🩹", answer:"true",
  uk:{scene:"Найчастішою причиною смерті при підриві на міні є масивна кровотеча з кінцівок, яку зупиняє турнікет",
      why:"Швидке накладання джгута на кінцівку значно підвищує шанси вижити до прибуття медиків."},
  en:{scene:"The most common cause of death from a mine blast is massive limb bleeding, which a tourniquet can stop",
      why:"Quickly applying a tourniquet to the limb significantly improves the chances of survival until medics arrive."}},
 {icon:"🦶", answer:"false",
  uk:{scene:"Якщо людина наступила на міну, яка не вибухнула одразу, можна акуратно зняти з неї ногу, діючи повільно",
      why:"У жодному разі не можна знімати тиск із пружинного механізму підривника — він може здетонувати саме в момент відпускання."},
  en:{scene:"If someone has stepped on a mine that hasn't gone off yet, they can carefully lift their foot away if they move slowly",
      why:"Never release pressure from a spring-loaded fuse mechanism — it can detonate at the exact moment the pressure is released."}},
 {icon:"📲", answer:"true",
  uk:{scene:"Застосунок «Розмінування України» дозволяє повідомити про знахідку з фото та геоміткою",
      why:"Офіційні платформи ДСНС приймають такі повідомлення й прискорюють реагування фахівців на місці."},
  en:{scene:"The \"Demining Ukraine\" app lets citizens report a find with a photo and a geotag",
      why:"Official DSNS platforms accept these reports and help speed up the response of specialists on the ground."}},
 {icon:"🚜", answer:"false",
  uk:{scene:"Одразу після завершення бойових дій безпечно виїжджати на поля трактором чи комбайном",
      why:"Важка техніка не рятує від вибуху — вона щодня підривається на мінах, а оператори зазнають важких травм без попереднього розмінування полів."},
  en:{scene:"Right after fighting ends, it's safe to drive a tractor or combine harvester into the fields",
      why:"Heavy machinery offers no protection from an explosion — vehicles are destroyed by mines daily, and operators are badly hurt without prior field clearance."}}
];


export const QUESTS = {
  "forest": {
    "icon": "🌲",
    "ageVariants": {
      "child": {
        "uk": {
          "title": "Слід у лісі",
          "desc": "Похід по гриби, який міг піти не так",
          "intro": "Ви з другом Максом пішли по гриби до лісосмуги біля села. Раптом Макс зупиняється і показує пальцем на щось металеве під шаром листя за кілька кроків попереду."
        },
        "en": {
          "title": "Trail in the forest",
          "desc": "A mushroom trip that could've gone wrong",
          "intro": "You and your friend Max went mushroom-picking near a tree line by the village. Suddenly Max stops and points at something metal under the leaves a few steps ahead."
        },
        "nodes": {
          "n1": {
            "type": "story",
            "stopIndex": 0,
            "uk": {
              "text": "«Дивись, що це таке?» — питає Макс і вже готовий зробити крок вперед, щоб роздивитись зблизька. Що ти робиш?",
              "options": [
                {
                  "label": "Кажеш Максу підійти й роздивитись разом",
                  "correct": false,
                  "consequence": "Ви обидва підходите ближче. На щастя, нічого не сталось — але ви щойно порушили перше правило: НЕ наближайся до незнайомого предмета, навіть з цікавості."
                },
                {
                  "label": "Різко зупиняєш Макса й кажеш більше не робити ні кроку",
                  "correct": true,
                  "next": "n2"
                }
              ]
            },
            "en": {
              "text": "\"Look, what is this?\" Max asks, already about to step closer for a better look. What do you do?",
              "options": [
                {
                  "label": "Tell Max to go closer together with you",
                  "correct": false,
                  "consequence": "You both get closer. Nothing happens this time — but you've just broken rule one: don't approach an unfamiliar object, even out of curiosity."
                },
                {
                  "label": "Stop Max immediately and say not to take another step",
                  "correct": true,
                  "next": "n2"
                }
              ]
            }
          },
          "n2": {
            "type": "story",
            "stopIndex": 1,
            "uk": {
              "text": "Макс хоче штовхнути предмет ногою кросівки: «Він же не оживе від цього». Твої дії?",
              "options": [
                {
                  "label": "Дозволяєш — це ж просто кросівка, не рука",
                  "correct": false,
                  "consequence": "Навіть дотик ногою може бути небезпечним. Друге правило: НЕ ЧІПАЙ означає взагалі ніякого дотику."
                },
                {
                  "label": "Забороняєш і пояснюєш, що чіпати не можна нічим",
                  "correct": true,
                  "next": "n3"
                }
              ]
            },
            "en": {
              "text": "Max wants to nudge the object with his sneaker: \"It's not going to do anything.\" What do you do?",
              "options": [
                {
                  "label": "Let him — it's just a sneaker, not a hand",
                  "correct": false,
                  "consequence": "Even touching it with a foot can be dangerous. Rule two: DON'T TOUCH means no touching at all."
                },
                {
                  "label": "Stop him and explain nothing should touch it",
                  "correct": true,
                  "next": "n3"
                }
              ]
            }
          },
          "n3": {
            "type": "story",
            "stopIndex": 2,
            "uk": {
              "text": "Ви обоє стоїте за кілька кроків. Чи можна лишатись тут і просто голосно покликати на допомогу?",
              "options": [
                {
                  "label": "Так, звідси й покличемо",
                  "correct": false,
                  "consequence": "Кілька кроків — це не безпечна відстань. Потрібно відійти набагато далі, перш ніж кликати чи телефонувати кому-небудь."
                },
                {
                  "label": "Ні, спершу треба відійти набагато далі",
                  "correct": true,
                  "next": "childReport"
                }
              ]
            },
            "en": {
              "text": "You're both standing a few steps away. Can you stay here and just shout for help?",
              "options": [
                {
                  "label": "Yes, let's call for help from right here",
                  "correct": false,
                  "consequence": "A few steps away isn't a safe distance. You need to move much further back before shouting or calling anyone."
                },
                {
                  "label": "No, you need to move much further back first",
                  "correct": true,
                  "next": "childReport"
                }
              ]
            }
          },
          "childReport": {
            "type": "call",
            "stopIndex": 3,
            "uk": {
              "prompt": "Ви відійшли на безпечну відстань. Тепер час зателефонувати. Набери номер служби, яка займається піротехнічними знахідками, і натисни «Викликати».",
              "wrong": {
                "102": "Поліція зафіксує виклик, але саму знахідку без спецобладнання не знешкодить — приїдуть однаково сапери ДСНС. Спробуй ще раз.",
                "103": "Швидка допомога працює з травмами, які вже сталися. Обладнання для боєприпасів у неї немає. Спробуй ще раз.",
                "104": "Це номер аварійної газової служби — тут не той випадок. Спробуй ще раз."
              },
              "wrongDefault": "Цей номер не підходить. В Україні про підозрілі боєприпаси повідомляють Державну службу з надзвичайних ситуацій. Спробуй ще раз."
            },
            "en": {
              "prompt": "You have moved to a safe distance. Now it is time to call. Dial the number for the service that handles explosive-ordnance finds, then press \"Call\".",
              "wrong": {
                "102": "Police will log the call, but without special equipment they cant deal with the find itself — DSNS deminers would still be sent. Try again.",
                "103": "Ambulance crews handle injuries that have already happened. They dont carry ordnance-handling equipment. Try again.",
                "104": "Thats the emergency gas-service number — not the right one here. Try again."
              },
              "wrongDefault": "That number isnt right. In Ukraine, suspected ordnance is reported to the State Emergency Service. Try again."
            },
            "correctNumber": "101",
            "next": "end"
          },
          "end": {
            "type": "end",
            "uk": {
              "title": "Розслідування завершено успішно",
              "text": "Ти й Макс залишились неушкодженими, а дорослий отримав точну інформацію й зателефонував саперам. Саме так і працює протокол безпеки для дітей — не наближатись, не чіпати, відійти і швидко покликати дорослого."
            },
            "en": {
              "title": "Investigation successfully completed",
              "text": "You and Max stayed safe, and an adult got precise information and called the deminers. That's exactly how the safety protocol works for kids — don't approach, don't touch, move back, and quickly get an adult."
            }
          }
        }
      },
      "teen": {
        "uk": {
          "title": "Слід у лісі",
          "desc": "Похід по гриби, який міг піти не так",
          "intro": "Ви з другом Максом пішли по гриби до лісосмуги біля села. Раптом Макс зупиняється і показує пальцем на щось металеве під шаром листя за кілька кроків попереду."
        },
        "en": {
          "title": "Trail in the forest",
          "desc": "A mushroom trip that could've gone wrong",
          "intro": "You and your friend Max went mushroom-picking near a tree line by the village. Suddenly Max stops and points at something metal under the leaves a few steps ahead."
        },
        "nodes": {
          "n1": {
            "type": "story",
            "stopIndex": 0,
            "uk": {
              "text": "«Дивись, що це таке?» — питає Макс і вже готовий зробити крок вперед, щоб роздивитись зблизька. Що ти робиш?",
              "options": [
                {
                  "label": "Кажеш Максу підійти й роздивитись разом",
                  "correct": false,
                  "consequence": "Ви обидва підходите ближче. Предмет схожий на елемент боєприпасу. На щастя, нічого не сталось — але ви щойно порушили перше правило: НЕ наближайся до незнайомого предмета, навіть з цікавості."
                },
                {
                  "label": "Різко зупиняєш Макса й кажеш більше не робити ні кроку",
                  "correct": true,
                  "next": "n2"
                }
              ]
            },
            "en": {
              "text": "\"Look, what is this?\" Max asks, already about to step closer for a better look. What do you do?",
              "options": [
                {
                  "label": "Tell Max to go closer together with you",
                  "correct": false,
                  "consequence": "You both get closer. The object looks like part of an explosive munition. Nothing happens this time — but you've just broken rule one: don't approach an unfamiliar object, even out of curiosity."
                },
                {
                  "label": "Stop Max immediately and say not to take another step",
                  "correct": true,
                  "next": "n2"
                }
              ]
            }
          },
          "n2": {
            "type": "story",
            "stopIndex": 1,
            "uk": {
              "text": "Макс дістає з рюкзака палицю: «Давай хоч перевіримо, чи воно металеве, просто постукаю». Твої дії?",
              "options": [
                {
                  "label": "Дозволяєш — це ж просто палиця, не рука",
                  "correct": false,
                  "consequence": "Навіть непрямий контакт — палицею, ногою чи камінцем — може призвести до спрацювання. Друге правило: НЕ ЧІПАЙ означає жодного фізичного контакту, прямого чи опосередкованого."
                },
                {
                  "label": "Забороняєш і пояснюєш, що чіпати не можна навіть палицею",
                  "correct": true,
                  "next": "n3"
                }
              ]
            },
            "en": {
              "text": "Max grabs a stick from his backpack: \"Let's at least check if it's metal, I'll just tap it.\" What do you do?",
              "options": [
                {
                  "label": "Let him — it's just a stick, not a hand",
                  "correct": false,
                  "consequence": "Even indirect contact — a stick, a foot, a pebble — can trigger it. Rule two: DON'T TOUCH means no physical contact at all, direct or indirect."
                },
                {
                  "label": "Stop him and explain you can't touch it even with a stick",
                  "correct": true,
                  "next": "n3"
                }
              ]
            }
          },
          "n3": {
            "type": "story",
            "stopIndex": 2,
            "uk": {
              "text": "Ви обоє стоїте за кілька кроків і фотографуєте предмет на телефон «для доказу». Це нормально?",
              "options": [
                {
                  "label": "Так, фото ж не шкодить, докази знадобляться",
                  "correct": false,
                  "consequence": "Кілька кроків — це не безпечна відстань. Навіть не торкаючись предмета, потрібно відійти щонайменше на 100 метрів, бажано за укриття, перш ніж робити щось далі — зокрема телефонувати."
                },
                {
                  "label": "Ні, потрібно відійти подалі, перш ніж щось робити",
                  "correct": true,
                  "next": "n3fork"
                }
              ]
            },
            "en": {
              "text": "You're both standing a few steps away, photographing the object \"as proof.\" Is that okay?",
              "options": [
                {
                  "label": "Yes, a photo doesn't hurt, and it's useful proof",
                  "correct": false,
                  "consequence": "A few steps away isn't a safe distance. Even without touching it, you need to move back at least 100 metres, ideally behind cover, before doing anything else — including calling for help."
                },
                {
                  "label": "No, you need to move further back before doing anything",
                  "correct": true,
                  "next": "n3fork"
                }
              ]
            }
          },
          "n3fork": {
            "type": "story",
            "stopIndex": 2,
            "uk": {
              "text": "Відійшовши на безпечну відстань, ви домовляєтесь, як точно зафіксувати місце для саперів. Обидва варіанти безпечні — обери свій.",
              "options": [
                {
                  "label": "Рахуєте кроки від найближчої прикметної точки (дерева, стовпа) до предмета",
                  "correct": true,
                  "next": "call1a"
                },
                {
                  "label": "Позначаєте напрямок і приблизну відстань голосом, поки один із вас записує на телефон",
                  "correct": true,
                  "next": "call1b"
                }
              ]
            },
            "en": {
              "text": "Now at a safe distance, you agree on how to pinpoint the spot for the deminers. Both options are safe — pick yours.",
              "options": [
                {
                  "label": "Count your steps from the nearest landmark (a tree, a pole) to the object",
                  "correct": true,
                  "next": "call1a"
                },
                {
                  "label": "Describe the direction and rough distance out loud while one of you records it on the phone",
                  "correct": true,
                  "next": "call1b"
                }
              ]
            }
          },
          "call1a": {
            "type": "call",
            "stopIndex": 3,
            "uk": {
              "prompt": "Маючи точну кількість кроків до орієнтира, час зателефонувати. Набери номер служби, яка займається піротехнічними знахідками, і натисни «Викликати».",
              "wrong": {
                "102": "Поліція зафіксує виклик, але саму знахідку без спецобладнання не знешкодить — приїдуть однаково сапери ДСНС. Спробуй ще раз.",
                "103": "Швидка допомога працює з травмами, які вже сталися. Обладнання для боєприпасів у неї немає. Спробуй ще раз.",
                "104": "Це номер аварійної газової служби — тут не той випадок. Спробуй ще раз."
              },
              "wrongDefault": "Цей номер не підходить. В Україні про підозрілі боєприпаси повідомляють Державну службу з надзвичайних ситуацій. Спробуй ще раз."
            },
            "en": {
              "prompt": "With the exact step count to your landmark noted, it's time to call. Dial the number for the service that handles explosive-ordnance finds, then press \"Call\".",
              "wrong": {
                "102": "Police will log the call, but without special equipment they can't deal with the find itself — DSNS deminers would still be sent. Try again.",
                "103": "Ambulance crews handle injuries that have already happened. They don't carry ordnance-handling equipment. Try again.",
                "104": "That's the emergency gas-service number — not the right one here. Try again."
              },
              "wrongDefault": "That number isn't right. In Ukraine, suspected ordnance is reported to the State Emergency Service. Try again."
            },
            "correctNumber": "101",
            "next": "end"
          },
          "call1b": {
            "type": "call",
            "stopIndex": 3,
            "uk": {
              "prompt": "Маючи записаний орієнтовний напрямок і відстань, час зателефонувати. Набери номер служби, яка займається піротехнічними знахідками, і натисни «Викликати».",
              "wrong": {
                "102": "Поліція зафіксує виклик, але саму знахідку без спецобладнання не знешкодить — приїдуть однаково сапери ДСНС. Спробуй ще раз.",
                "103": "Швидка допомога працює з травмами, які вже сталися. Обладнання для боєприпасів у неї немає. Спробуй ще раз.",
                "104": "Це номер аварійної газової служби — тут не той випадок. Спробуй ще раз."
              },
              "wrongDefault": "Цей номер не підходить. В Україні про підозрілі боєприпаси повідомляють Державну службу з надзвичайних ситуацій. Спробуй ще раз."
            },
            "en": {
              "prompt": "With the direction and rough distance recorded, it's time to call. Dial the number for the service that handles explosive-ordnance finds, then press \"Call\".",
              "wrong": {
                "102": "Police will log the call, but without special equipment they can't deal with the find itself — DSNS deminers would still be sent. Try again.",
                "103": "Ambulance crews handle injuries that have already happened. They don't carry ordnance-handling equipment. Try again.",
                "104": "That's the emergency gas-service number — not the right one here. Try again."
              },
              "wrongDefault": "That number isn't right. In Ukraine, suspected ordnance is reported to the State Emergency Service. Try again."
            },
            "correctNumber": "101",
            "next": "end"
          },
          "end": {
            "type": "end",
            "uk": {
              "title": "Розслідування завершено успішно",
              "text": "Ти й Макс залишились неушкодженими, а сапери отримали точні координати. Саме так і працює протокол безпеки — крок за кроком, без поспіху й без цікавості, що переважає обережність."
            },
            "en": {
              "title": "Investigation successfully completed",
              "text": "You and Max stayed safe, and the deminers got exact coordinates. That's exactly how the safety protocol works — step by step, without rushing, and without curiosity winning over caution."
            }
          }
        }
      },
      "adult": {
        "uk": {
          "title": "Слід у лісі",
          "desc": "Похід по гриби, який міг піти не так",
          "intro": "Ви з другом Максом пішли по гриби до лісосмуги біля села. Раптом Макс зупиняється і показує пальцем на щось металеве під шаром листя за кілька кроків попереду."
        },
        "en": {
          "title": "Trail in the forest",
          "desc": "A mushroom trip that could've gone wrong",
          "intro": "You and your friend Max went mushroom-picking near a tree line by the village. Suddenly Max stops and points at something metal under the leaves a few steps ahead."
        },
        "nodes": {
          "n1": {
            "type": "story",
            "stopIndex": 0,
            "uk": {
              "text": "«Дивись, що це таке?» — питає Макс і вже готовий зробити крок вперед, щоб роздивитись зблизька. Що ти робиш?",
              "options": [
                {
                  "label": "Кажеш Максу підійти й роздивитись разом",
                  "correct": false,
                  "consequence": "Ви обидва підходите ближче. Предмет схожий на елемент боєприпасу. На щастя, нічого не сталось — але ви щойно порушили перше правило: НЕ наближайся до незнайомого предмета, навіть з цікавості."
                },
                {
                  "label": "Різко зупиняєш Макса й кажеш більше не робити ні кроку",
                  "correct": true,
                  "next": "n2"
                }
              ]
            },
            "en": {
              "text": "\"Look, what is this?\" Max asks, already about to step closer for a better look. What do you do?",
              "options": [
                {
                  "label": "Tell Max to go closer together with you",
                  "correct": false,
                  "consequence": "You both get closer. The object looks like part of an explosive munition. Nothing happens this time — but you've just broken rule one: don't approach an unfamiliar object, even out of curiosity."
                },
                {
                  "label": "Stop Max immediately and say not to take another step",
                  "correct": true,
                  "next": "n2"
                }
              ]
            }
          },
          "n2": {
            "type": "story",
            "stopIndex": 1,
            "uk": {
              "text": "Макс дістає з рюкзака палицю: «Давай хоч перевіримо, чи воно металеве, просто постукаю». Твої дії?",
              "options": [
                {
                  "label": "Дозволяєш — це ж просто палиця, не рука",
                  "correct": false,
                  "consequence": "Навіть непрямий контакт — палицею, ногою чи камінцем — може призвести до спрацювання. Друге правило: НЕ ЧІПАЙ означає жодного фізичного контакту, прямого чи опосередкованого."
                },
                {
                  "label": "Забороняєш і пояснюєш, що чіпати не можна навіть палицею",
                  "correct": true,
                  "next": "n3"
                }
              ]
            },
            "en": {
              "text": "Max grabs a stick from his backpack: \"Let's at least check if it's metal, I'll just tap it.\" What do you do?",
              "options": [
                {
                  "label": "Let him — it's just a stick, not a hand",
                  "correct": false,
                  "consequence": "Even indirect contact — a stick, a foot, a pebble — can trigger it. Rule two: DON'T TOUCH means no physical contact at all, direct or indirect."
                },
                {
                  "label": "Stop him and explain you can't touch it even with a stick",
                  "correct": true,
                  "next": "n3"
                }
              ]
            }
          },
          "n3": {
            "type": "story",
            "stopIndex": 2,
            "uk": {
              "text": "Ви обоє стоїте за кілька кроків і фотографуєте предмет на телефон «для доказу». Це нормально?",
              "options": [
                {
                  "label": "Так, фото ж не шкодить, докази знадобляться",
                  "correct": false,
                  "consequence": "Кілька кроків — це не безпечна відстань. Навіть не торкаючись предмета, потрібно відійти щонайменше на 100 метрів, бажано за укриття, перш ніж робити щось далі — зокрема телефонувати."
                },
                {
                  "label": "Ні, потрібно відійти подалі, перш ніж щось робити",
                  "correct": true,
                  "next": "n3fork"
                }
              ]
            },
            "en": {
              "text": "You're both standing a few steps away, photographing the object \"as proof.\" Is that okay?",
              "options": [
                {
                  "label": "Yes, a photo doesn't hurt, and it's useful proof",
                  "correct": false,
                  "consequence": "A few steps away isn't a safe distance. Even without touching it, you need to move back at least 100 metres, ideally behind cover, before doing anything else — including calling for help."
                },
                {
                  "label": "No, you need to move further back before doing anything",
                  "correct": true,
                  "next": "n3fork"
                }
              ]
            }
          },
          "n3fork": {
            "type": "story",
            "stopIndex": 2,
            "uk": {
              "text": "Відійшовши на безпечну відстань, ви домовляєтесь, як точно зафіксувати місце для саперів. Обидва варіанти безпечні — обери свій.",
              "options": [
                {
                  "label": "Рахуєте кроки від найближчої прикметної точки (дерева, стовпа) до предмета",
                  "correct": true,
                  "next": "call1a"
                },
                {
                  "label": "Позначаєте напрямок і приблизну відстань голосом, поки один із вас записує на телефон",
                  "correct": true,
                  "next": "call1b"
                }
              ]
            },
            "en": {
              "text": "Now at a safe distance, you agree on how to pinpoint the spot for the deminers. Both options are safe — pick yours.",
              "options": [
                {
                  "label": "Count your steps from the nearest landmark (a tree, a pole) to the object",
                  "correct": true,
                  "next": "call1a"
                },
                {
                  "label": "Describe the direction and rough distance out loud while one of you records it on the phone",
                  "correct": true,
                  "next": "call1b"
                }
              ]
            }
          },
          "call1a": {
            "type": "call",
            "stopIndex": 3,
            "uk": {
              "prompt": "Маючи точну кількість кроків до орієнтира, час зателефонувати. Набери номер служби, яка займається піротехнічними знахідками, і натисни «Викликати».",
              "wrong": {
                "102": "Поліція зафіксує виклик, але саму знахідку без спецобладнання не знешкодить — приїдуть однаково сапери ДСНС. Спробуй ще раз.",
                "103": "Швидка допомога працює з травмами, які вже сталися. Обладнання для боєприпасів у неї немає. Спробуй ще раз.",
                "104": "Це номер аварійної газової служби — тут не той випадок. Спробуй ще раз."
              },
              "wrongDefault": "Цей номер не підходить. В Україні про підозрілі боєприпаси повідомляють Державну службу з надзвичайних ситуацій. Спробуй ще раз."
            },
            "en": {
              "prompt": "With the exact step count to your landmark noted, it's time to call. Dial the number for the service that handles explosive-ordnance finds, then press \"Call\".",
              "wrong": {
                "102": "Police will log the call, but without special equipment they can't deal with the find itself — DSNS deminers would still be sent. Try again.",
                "103": "Ambulance crews handle injuries that have already happened. They don't carry ordnance-handling equipment. Try again.",
                "104": "That's the emergency gas-service number — not the right one here. Try again."
              },
              "wrongDefault": "That number isn't right. In Ukraine, suspected ordnance is reported to the State Emergency Service. Try again."
            },
            "correctNumber": "101",
            "next": "end"
          },
          "call1b": {
            "type": "call",
            "stopIndex": 3,
            "uk": {
              "prompt": "Маючи записаний орієнтовний напрямок і відстань, час зателефонувати. Набери номер служби, яка займається піротехнічними знахідками, і натисни «Викликати».",
              "wrong": {
                "102": "Поліція зафіксує виклик, але саму знахідку без спецобладнання не знешкодить — приїдуть однаково сапери ДСНС. Спробуй ще раз.",
                "103": "Швидка допомога працює з травмами, які вже сталися. Обладнання для боєприпасів у неї немає. Спробуй ще раз.",
                "104": "Це номер аварійної газової служби — тут не той випадок. Спробуй ще раз."
              },
              "wrongDefault": "Цей номер не підходить. В Україні про підозрілі боєприпаси повідомляють Державну службу з надзвичайних ситуацій. Спробуй ще раз."
            },
            "en": {
              "prompt": "With the direction and rough distance recorded, it's time to call. Dial the number for the service that handles explosive-ordnance finds, then press \"Call\".",
              "wrong": {
                "102": "Police will log the call, but without special equipment they can't deal with the find itself — DSNS deminers would still be sent. Try again.",
                "103": "Ambulance crews handle injuries that have already happened. They don't carry ordnance-handling equipment. Try again.",
                "104": "That's the emergency gas-service number — not the right one here. Try again."
              },
              "wrongDefault": "That number isn't right. In Ukraine, suspected ordnance is reported to the State Emergency Service. Try again."
            },
            "correctNumber": "101",
            "next": "end"
          },
          "end": {
            "type": "end",
            "uk": {
              "title": "Розслідування завершено успішно",
              "text": "Ти й Макс залишились неушкодженими, а сапери отримали точні координати. Саме так і працює протокол безпеки — крок за кроком, без поспіху й без цікавості, що переважає обережність."
            },
            "en": {
              "title": "Investigation successfully completed",
              "text": "You and Max stayed safe, and the deminers got exact coordinates. That's exactly how the safety protocol works — step by step, without rushing, and without curiosity winning over caution."
            }
          }
        }
      }
    }
  },
  "yard": {
    "icon": "🏚️",
    "ageVariants": {
      "child": {
        "uk": {
          "title": "Знахідка на подвір'ї",
          "desc": "Прибирання після негоди приховує несподіванку",
          "intro": "Прибираючи двір після негоди, ви натрапляєте на військовий ящик, напівзасипаний землею біля старого сараю."
        },
        "en": {
          "title": "Find in the yard",
          "desc": "Post-storm cleanup hides a surprise",
          "intro": "While cleaning up the yard after a storm, you come across a military crate, half-buried near the old shed."
        },
        "nodes": {
          "y1": {
            "type": "story",
            "stopIndex": 0,
            "uk": {
              "text": "Сусідська дитина вже підбігає, щоб подивитись зблизька. Твої дії?",
              "options": [
                {
                  "label": "Кажеш, що це, мабуть, просто старий металобрухт, і дозволяєш підійти",
                  "correct": false,
                  "consequence": "Небезпеку не можна оцінювати «на око» — і тим паче дозволяти іншим дітям підходити близько."
                },
                {
                  "label": "Гукаєш дитину, щоб зупинилась і відійшла",
                  "correct": true,
                  "next": "y2"
                }
              ]
            },
            "en": {
              "text": "The neighbour's kid is already running over for a closer look. What do you do?",
              "options": [
                {
                  "label": "Say it's probably just old scrap metal and let them come closer",
                  "correct": false,
                  "consequence": "You can't judge danger by appearance alone — and definitely shouldn't let other kids get close."
                },
                {
                  "label": "Call out for the kid to stop and step back",
                  "correct": true,
                  "next": "y2"
                }
              ]
            }
          },
          "y2": {
            "type": "story",
            "stopIndex": 1,
            "uk": {
              "text": "Хочеться відкрити кришку, щоб зрозуміти, що всередині.",
              "options": [
                {
                  "label": "Обережно піднімаєш кришку — «щоб краще роздивитись»",
                  "correct": false,
                  "consequence": "Ніколи не відкривай і не торкайся знайдених військових предметів, навіть обережно."
                },
                {
                  "label": "Залишаєш ящик у тому ж положенні, не торкаючись",
                  "correct": true,
                  "next": "y3"
                }
              ]
            },
            "en": {
              "text": "You're tempted to lift the lid just to see what's inside.",
              "options": [
                {
                  "label": "Carefully lift the lid \"just to get a better look\"",
                  "correct": false,
                  "consequence": "Never open or touch a found military object, even carefully."
                },
                {
                  "label": "Leave the crate exactly as it is, without touching it",
                  "correct": true,
                  "next": "y3"
                }
              ]
            }
          },
          "y3": {
            "type": "story",
            "stopIndex": 2,
            "uk": {
              "text": "Ти й дитина стоїте за пару кроків від сараю.",
              "options": [
                {
                  "label": "Залишаєтесь чекати тут же — це ж свій двір",
                  "correct": false,
                  "consequence": "Навіть на власному подвір'ї потрібно відійти набагато далі, перш ніж кликати дорослого."
                },
                {
                  "label": "Заводиш дитину в будинок і відходиш подалі від сараю",
                  "correct": true,
                  "next": "childReportYard"
                }
              ]
            },
            "en": {
              "text": "You and the kid are standing a couple of steps from the shed.",
              "options": [
                {
                  "label": "Stay right there and wait — it's your own yard after all",
                  "correct": false,
                  "consequence": "Even in your own yard you need to move much further back before getting an adult."
                },
                {
                  "label": "Bring the kid inside the house and move well away from the shed",
                  "correct": true,
                  "next": "childReportYard"
                }
              ]
            }
          },
          "childReportYard": {
            "type": "call",
            "stopIndex": 3,
            "uk": {
              "prompt": "Ви в будинку, подалі від сараю. Час зателефонувати. Набери номер служби, яка займається піротехнічними знахідками, і натисни «Викликати».",
              "wrong": {
                "102": "Поліція зафіксує виклик, але саму знахідку без спецобладнання не знешкодить — приїдуть однаково сапери ДСНС. Спробуй ще раз.",
                "103": "Швидка допомога працює з травмами, які вже сталися. Обладнання для боєприпасів у неї немає. Спробуй ще раз.",
                "104": "Це номер аварійної газової служби — тут не той випадок. Спробуй ще раз."
              },
              "wrongDefault": "Цей номер не підходить. В Україні про підозрілі боєприпаси повідомляють Державну службу з надзвичайних ситуацій. Спробуй ще раз."
            },
            "en": {
              "prompt": "You are inside the house, away from the shed. Time to call. Dial the number for the service that handles explosive-ordnance finds, then press \"Call\".",
              "wrong": {
                "102": "Police will log the call, but without special equipment they cant deal with the find itself — DSNS deminers would still be sent. Try again.",
                "103": "Ambulance crews handle injuries that have already happened. They dont carry ordnance-handling equipment. Try again.",
                "104": "Thats the emergency gas-service number — not the right one here. Try again."
              },
              "wrongDefault": "That number isnt right. In Ukraine, suspected ordnance is reported to the State Emergency Service. Try again."
            },
            "correctNumber": "101",
            "next": "end"
          },
          "end": {
            "type": "end",
            "uk": {
              "title": "Ситуацію взято під контроль",
              "text": "Ти захистив і себе, і сусідську дитину, а дорослий отримав точну адресу й зателефонував саперам. Свій двір — не виняток із правил."
            },
            "en": {
              "title": "Situation under control",
              "text": "You protected both yourself and the neighbour's kid, and an adult got the exact address and called the deminers. Your own yard is no exception to the rules."
            }
          }
        }
      },
      "teen": {
        "uk": {
          "title": "Знахідка на подвір'ї",
          "desc": "Прибирання після негоди приховує несподіванку",
          "intro": "Прибираючи двір після негоди, ви натрапляєте на військовий ящик, напівзасипаний землею біля старого сараю."
        },
        "en": {
          "title": "Find in the yard",
          "desc": "Post-storm cleanup hides a surprise",
          "intro": "While cleaning up the yard after a storm, you come across a military crate, half-buried near the old shed."
        },
        "nodes": {
          "y1": {
            "type": "story",
            "stopIndex": 0,
            "uk": {
              "text": "Сусідська дитина вже підбігає, щоб подивитись зблизька. Твої дії?",
              "options": [
                {
                  "label": "Кажеш, що це, мабуть, просто старий металобрухт, і дозволяєш підійти",
                  "correct": false,
                  "consequence": "Навіть побутові на вигляд ящики можуть містити боєприпаси. Небезпеку не можна оцінювати «на око» — і тим паче дозволяти дітям підходити близько."
                },
                {
                  "label": "Гукаєш дитину, щоб зупинилась і відійшла",
                  "correct": true,
                  "next": "y2"
                }
              ]
            },
            "en": {
              "text": "The neighbour's kid is already running over for a closer look. What do you do?",
              "options": [
                {
                  "label": "Say it's probably just old scrap metal and let them come closer",
                  "correct": false,
                  "consequence": "Even ordinary-looking crates can hold ordnance. You can't judge danger by appearance alone — and definitely shouldn't let children get close."
                },
                {
                  "label": "Call out for the kid to stop and step back",
                  "correct": true,
                  "next": "y2"
                }
              ]
            }
          },
          "y2": {
            "type": "story",
            "stopIndex": 1,
            "uk": {
              "text": "Хочеться відкрити кришку, щоб зрозуміти, що всередині.",
              "options": [
                {
                  "label": "Обережно піднімаєш кришку — «щоб краще роздивитись»",
                  "correct": false,
                  "consequence": "Будь-яке відкривання, пересування чи навіть обережний дотик може призвести до спрацювання. Ніколи не відкривай і не пересувай знайдені військові предмети."
                },
                {
                  "label": "Залишаєш ящик у тому ж положенні, не торкаючись",
                  "correct": true,
                  "next": "y3"
                }
              ]
            },
            "en": {
              "text": "You're tempted to lift the lid just to see what's inside.",
              "options": [
                {
                  "label": "Carefully lift the lid \"just to get a better look\"",
                  "correct": false,
                  "consequence": "Any opening, moving, or even careful touching can trigger it. Never open or move a found military object."
                },
                {
                  "label": "Leave the crate exactly as it is, without touching it",
                  "correct": true,
                  "next": "y3"
                }
              ]
            }
          },
          "y3": {
            "type": "story",
            "stopIndex": 2,
            "uk": {
              "text": "Ти й дитина стоїте за пару кроків від сараю, обговорюючи, що робити далі.",
              "options": [
                {
                  "label": "Залишаєтесь чекати тут же — це ж свій двір",
                  "correct": false,
                  "consequence": "Навіть на власному подвір'ї потрібна безпечна дистанція — щонайменше 100 метрів або за капітальною стіною, перш ніж телефонувати чи щось вирішувати."
                },
                {
                  "label": "Заводиш дитину в будинок і відходиш подалі від сараю",
                  "correct": true,
                  "next": "y3fork"
                }
              ]
            },
            "en": {
              "text": "You and the kid are standing a couple of steps from the shed, discussing what to do next.",
              "options": [
                {
                  "label": "Stay right there and wait — it's your own yard after all",
                  "correct": false,
                  "consequence": "Even in your own yard you need a safe distance — at least 100 metres, or behind a solid wall, before calling anyone or deciding anything."
                },
                {
                  "label": "Bring the kid inside the house and move well away from the shed",
                  "correct": true,
                  "next": "y3fork"
                }
              ]
            }
          },
          "y3fork": {
            "type": "story",
            "stopIndex": 2,
            "uk": {
              "text": "У будинку, подалі від сараю, ви вирішуєте, як найкраще описати місце саперам. Обидва варіанти безпечні — обери свій.",
              "options": [
                {
                  "label": "Малюєш простеньку схему двору з позначеним сараєм",
                  "correct": true,
                  "next": "call2a"
                },
                {
                  "label": "Фотографуєш сарай здалеку через вікно будинку",
                  "correct": true,
                  "next": "call2b"
                }
              ]
            },
            "en": {
              "text": "Inside the house, away from the shed, you decide how best to describe the spot to the deminers. Both options are safe — pick yours.",
              "options": [
                {
                  "label": "Sketch a simple diagram of the yard marking the shed",
                  "correct": true,
                  "next": "call2a"
                },
                {
                  "label": "Take a photo of the shed from a distance through the house window",
                  "correct": true,
                  "next": "call2b"
                }
              ]
            }
          },
          "call2a": {
            "type": "call",
            "stopIndex": 3,
            "uk": {
              "prompt": "Маючи схему двору напохваті, час зателефонувати. Набери номер служби, яка займається піротехнічними знахідками, і натисни «Викликати».",
              "wrong": {
                "102": "Поліція зафіксує виклик, але саму знахідку без спецобладнання не знешкодить — приїдуть однаково сапери ДСНС. Спробуй ще раз.",
                "103": "Швидка допомога працює з травмами, які вже сталися. Обладнання для боєприпасів у неї немає. Спробуй ще раз.",
                "104": "Це номер аварійної газової служби — тут не той випадок. Спробуй ще раз."
              },
              "wrongDefault": "Цей номер не підходить. В Україні про підозрілі боєприпаси повідомляють Державну службу з надзвичайних ситуацій. Спробуй ще раз."
            },
            "en": {
              "prompt": "With a simple yard diagram ready, it's time to call. Dial the number for the service that handles explosive-ordnance finds, then press \"Call\".",
              "wrong": {
                "102": "Police will log the call, but without special equipment they can't deal with the find itself — DSNS deminers would still be sent. Try again.",
                "103": "Ambulance crews handle injuries that have already happened. They don't carry ordnance-handling equipment. Try again.",
                "104": "That's the emergency gas-service number — not the right one here. Try again."
              },
              "wrongDefault": "That number isn't right. In Ukraine, suspected ordnance is reported to the State Emergency Service. Try again."
            },
            "correctNumber": "101",
            "next": "end"
          },
          "call2b": {
            "type": "call",
            "stopIndex": 3,
            "uk": {
              "prompt": "Маючи фото сараю здалеку, час зателефонувати. Набери номер служби, яка займається піротехнічними знахідками, і натисни «Викликати».",
              "wrong": {
                "102": "Поліція зафіксує виклик, але саму знахідку без спецобладнання не знешкодить — приїдуть однаково сапери ДСНС. Спробуй ще раз.",
                "103": "Швидка допомога працює з травмами, які вже сталися. Обладнання для боєприпасів у неї немає. Спробуй ще раз.",
                "104": "Це номер аварійної газової служби — тут не той випадок. Спробуй ще раз."
              },
              "wrongDefault": "Цей номер не підходить. В Україні про підозрілі боєприпаси повідомляють Державну службу з надзвичайних ситуацій. Спробуй ще раз."
            },
            "en": {
              "prompt": "With a distant photo of the shed ready, it's time to call. Dial the number for the service that handles explosive-ordnance finds, then press \"Call\".",
              "wrong": {
                "102": "Police will log the call, but without special equipment they can't deal with the find itself — DSNS deminers would still be sent. Try again.",
                "103": "Ambulance crews handle injuries that have already happened. They don't carry ordnance-handling equipment. Try again.",
                "104": "That's the emergency gas-service number — not the right one here. Try again."
              },
              "wrongDefault": "That number isn't right. In Ukraine, suspected ordnance is reported to the State Emergency Service. Try again."
            },
            "correctNumber": "101",
            "next": "end"
          },
          "end": {
            "type": "end",
            "uk": {
              "title": "Ситуацію взято під контроль",
              "text": "Ти захистив і себе, і сусідську дитину, а сапери отримали точну адресу. Свій двір — не виняток із правил: протокол безпеки працює скрізь однаково."
            },
            "en": {
              "title": "Situation under control",
              "text": "You protected both yourself and the neighbour's kid, and the deminers got the exact address. Your own yard is no exception to the rules — the safety protocol works the same everywhere."
            }
          }
        }
      },
      "adult": {
        "uk": {
          "title": "Знахідка на подвір'ї",
          "desc": "Прибирання після негоди приховує несподіванку",
          "intro": "Прибираючи двір після негоди, ви натрапляєте на військовий ящик, напівзасипаний землею біля старого сараю."
        },
        "en": {
          "title": "Find in the yard",
          "desc": "Post-storm cleanup hides a surprise",
          "intro": "While cleaning up the yard after a storm, you come across a military crate, half-buried near the old shed."
        },
        "nodes": {
          "y1": {
            "type": "story",
            "stopIndex": 0,
            "uk": {
              "text": "Сусідська дитина вже підбігає, щоб подивитись зблизька. Твої дії?",
              "options": [
                {
                  "label": "Кажеш, що це, мабуть, просто старий металобрухт, і дозволяєш підійти",
                  "correct": false,
                  "consequence": "Навіть побутові на вигляд ящики можуть містити боєприпаси. Небезпеку не можна оцінювати «на око» — і тим паче дозволяти дітям підходити близько."
                },
                {
                  "label": "Гукаєш дитину, щоб зупинилась і відійшла",
                  "correct": true,
                  "next": "y2"
                }
              ]
            },
            "en": {
              "text": "The neighbour's kid is already running over for a closer look. What do you do?",
              "options": [
                {
                  "label": "Say it's probably just old scrap metal and let them come closer",
                  "correct": false,
                  "consequence": "Even ordinary-looking crates can hold ordnance. You can't judge danger by appearance alone — and definitely shouldn't let children get close."
                },
                {
                  "label": "Call out for the kid to stop and step back",
                  "correct": true,
                  "next": "y2"
                }
              ]
            }
          },
          "y2": {
            "type": "story",
            "stopIndex": 1,
            "uk": {
              "text": "Хочеться відкрити кришку, щоб зрозуміти, що всередині.",
              "options": [
                {
                  "label": "Обережно піднімаєш кришку — «щоб краще роздивитись»",
                  "correct": false,
                  "consequence": "Будь-яке відкривання, пересування чи навіть обережний дотик може призвести до спрацювання. Ніколи не відкривай і не пересувай знайдені військові предмети."
                },
                {
                  "label": "Залишаєш ящик у тому ж положенні, не торкаючись",
                  "correct": true,
                  "next": "y3"
                }
              ]
            },
            "en": {
              "text": "You're tempted to lift the lid just to see what's inside.",
              "options": [
                {
                  "label": "Carefully lift the lid \"just to get a better look\"",
                  "correct": false,
                  "consequence": "Any opening, moving, or even careful touching can trigger it. Never open or move a found military object."
                },
                {
                  "label": "Leave the crate exactly as it is, without touching it",
                  "correct": true,
                  "next": "y3"
                }
              ]
            }
          },
          "y3": {
            "type": "story",
            "stopIndex": 2,
            "uk": {
              "text": "Ти й дитина стоїте за пару кроків від сараю, обговорюючи, що робити далі.",
              "options": [
                {
                  "label": "Залишаєтесь чекати тут же — це ж свій двір",
                  "correct": false,
                  "consequence": "Навіть на власному подвір'ї потрібна безпечна дистанція — щонайменше 100 метрів або за капітальною стіною, перш ніж телефонувати чи щось вирішувати."
                },
                {
                  "label": "Заводиш дитину в будинок і відходиш подалі від сараю",
                  "correct": true,
                  "next": "y3fork"
                }
              ]
            },
            "en": {
              "text": "You and the kid are standing a couple of steps from the shed, discussing what to do next.",
              "options": [
                {
                  "label": "Stay right there and wait — it's your own yard after all",
                  "correct": false,
                  "consequence": "Even in your own yard you need a safe distance — at least 100 metres, or behind a solid wall, before calling anyone or deciding anything."
                },
                {
                  "label": "Bring the kid inside the house and move well away from the shed",
                  "correct": true,
                  "next": "y3fork"
                }
              ]
            }
          },
          "y3fork": {
            "type": "story",
            "stopIndex": 2,
            "uk": {
              "text": "У будинку, подалі від сараю, ви вирішуєте, як найкраще описати місце саперам. Обидва варіанти безпечні — обери свій.",
              "options": [
                {
                  "label": "Малюєш простеньку схему двору з позначеним сараєм",
                  "correct": true,
                  "next": "call2a"
                },
                {
                  "label": "Фотографуєш сарай здалеку через вікно будинку",
                  "correct": true,
                  "next": "call2b"
                }
              ]
            },
            "en": {
              "text": "Inside the house, away from the shed, you decide how best to describe the spot to the deminers. Both options are safe — pick yours.",
              "options": [
                {
                  "label": "Sketch a simple diagram of the yard marking the shed",
                  "correct": true,
                  "next": "call2a"
                },
                {
                  "label": "Take a photo of the shed from a distance through the house window",
                  "correct": true,
                  "next": "call2b"
                }
              ]
            }
          },
          "call2a": {
            "type": "call",
            "stopIndex": 3,
            "uk": {
              "prompt": "Маючи схему двору напохваті, час зателефонувати. Набери номер служби, яка займається піротехнічними знахідками, і натисни «Викликати».",
              "wrong": {
                "102": "Поліція зафіксує виклик, але саму знахідку без спецобладнання не знешкодить — приїдуть однаково сапери ДСНС. Спробуй ще раз.",
                "103": "Швидка допомога працює з травмами, які вже сталися. Обладнання для боєприпасів у неї немає. Спробуй ще раз.",
                "104": "Це номер аварійної газової служби — тут не той випадок. Спробуй ще раз."
              },
              "wrongDefault": "Цей номер не підходить. В Україні про підозрілі боєприпаси повідомляють Державну службу з надзвичайних ситуацій. Спробуй ще раз."
            },
            "en": {
              "prompt": "With a simple yard diagram ready, it's time to call. Dial the number for the service that handles explosive-ordnance finds, then press \"Call\".",
              "wrong": {
                "102": "Police will log the call, but without special equipment they can't deal with the find itself — DSNS deminers would still be sent. Try again.",
                "103": "Ambulance crews handle injuries that have already happened. They don't carry ordnance-handling equipment. Try again.",
                "104": "That's the emergency gas-service number — not the right one here. Try again."
              },
              "wrongDefault": "That number isn't right. In Ukraine, suspected ordnance is reported to the State Emergency Service. Try again."
            },
            "correctNumber": "101",
            "next": "end"
          },
          "call2b": {
            "type": "call",
            "stopIndex": 3,
            "uk": {
              "prompt": "Маючи фото сараю здалеку, час зателефонувати. Набери номер служби, яка займається піротехнічними знахідками, і натисни «Викликати».",
              "wrong": {
                "102": "Поліція зафіксує виклик, але саму знахідку без спецобладнання не знешкодить — приїдуть однаково сапери ДСНС. Спробуй ще раз.",
                "103": "Швидка допомога працює з травмами, які вже сталися. Обладнання для боєприпасів у неї немає. Спробуй ще раз.",
                "104": "Це номер аварійної газової служби — тут не той випадок. Спробуй ще раз."
              },
              "wrongDefault": "Цей номер не підходить. В Україні про підозрілі боєприпаси повідомляють Державну службу з надзвичайних ситуацій. Спробуй ще раз."
            },
            "en": {
              "prompt": "With a distant photo of the shed ready, it's time to call. Dial the number for the service that handles explosive-ordnance finds, then press \"Call\".",
              "wrong": {
                "102": "Police will log the call, but without special equipment they can't deal with the find itself — DSNS deminers would still be sent. Try again.",
                "103": "Ambulance crews handle injuries that have already happened. They don't carry ordnance-handling equipment. Try again.",
                "104": "That's the emergency gas-service number — not the right one here. Try again."
              },
              "wrongDefault": "That number isn't right. In Ukraine, suspected ordnance is reported to the State Emergency Service. Try again."
            },
            "correctNumber": "101",
            "next": "end"
          },
          "end": {
            "type": "end",
            "uk": {
              "title": "Ситуацію взято під контроль",
              "text": "Ти захистив і себе, і сусідську дитину, а сапери отримали точну адресу. Свій двір — не виняток із правил: протокол безпеки працює скрізь однаково."
            },
            "en": {
              "title": "Situation under control",
              "text": "You protected both yourself and the neighbour's kid, and the deminers got the exact address. Your own yard is no exception to the rules — the safety protocol works the same everywhere."
            }
          }
        }
      }
    }
  },
  "solo": {
    "icon": "🧭",
    "ageVariants": {
      "child": {
        "uk": {
          "title": "Сам на полі",
          "desc": "Перевіряєш протокол, коли поруч нікого немає",
          "intro": "Ти йдеш звичним шляхом через власне поле, щоб перевірити посіви після негоди. За кілька кроків попереду в борозні щось блищить — метал, наполовину занурений у землю."
        },
        "en": {
          "title": "Alone in the field",
          "desc": "Testing the protocol when no one's around",
          "intro": "You're walking your usual path across your own field to check the crops after a storm. A few steps ahead, something metallic glints in the furrow, half-buried in the ground."
        },
        "nodes": {
          "s1": {
            "type": "story",
            "stopIndex": 0,
            "uk": {
              "text": "Ти йдеш зі старшим родичем полем, коли той відходить на хвилину. Раптом ти сам(а) помічаєш дивний предмет попереду. Що робиш?",
              "options": [
                {
                  "label": "Швиденько підходиш роздивитись, поки нікого немає поруч",
                  "correct": false,
                  "consequence": "Правила безпеки діють однаково, чи хтось поруч, чи ні. Перше правило: ЗУПИНИСЬ, навіть коли поруч нікого немає."
                },
                {
                  "label": "Зупиняєшся на місці й гучно кличеш дорослого",
                  "correct": true,
                  "next": "s2"
                }
              ]
            },
            "en": {
              "text": "You're walking a field with an older relative when they step away for a minute. Suddenly you notice something odd ahead on your own. What do you do?",
              "options": [
                {
                  "label": "Quickly go take a look while no one's around",
                  "correct": false,
                  "consequence": "Safety rules apply the same whether someone's with you or not. Rule one: STOP, even when no one's around."
                },
                {
                  "label": "Stop right where you are and call loudly for the adult",
                  "correct": true,
                  "next": "s2"
                }
              ]
            }
          },
          "s2": {
            "type": "story",
            "stopIndex": 1,
            "uk": {
              "text": "Поки чекаєш на дорослого, з'являється спокуса кинути в предмет камінцем «щоб перевірити».",
              "options": [
                {
                  "label": "Кидаєш невеликий камінець здалеку",
                  "correct": false,
                  "consequence": "Навіть кинутий здалеку камінець може спричинити спрацювання. Правило НЕ ЧІПАЙ означає взагалі ніякого впливу на предмет."
                },
                {
                  "label": "Нічого не кидаєш і просто чекаєш дорослого",
                  "correct": true,
                  "next": "s3"
                }
              ]
            },
            "en": {
              "text": "While waiting for the adult, you're tempted to throw a small stone at the object \"just to check.\"",
              "options": [
                {
                  "label": "Throw a small stone from a distance",
                  "correct": false,
                  "consequence": "Even a stone thrown from a distance can trigger it. The DON'T TOUCH rule means no interaction with the object at all."
                },
                {
                  "label": "Don't throw anything and just wait for the adult",
                  "correct": true,
                  "next": "s3"
                }
              ]
            }
          },
          "s3": {
            "type": "story",
            "stopIndex": 2,
            "uk": {
              "text": "Дорослий ще не повернувся. Чи варто підійти трохи ближче, щоб краще показати йому місце, коли він прийде?",
              "options": [
                {
                  "label": "Підходиш трохи ближче, щоб зручніше було показати",
                  "correct": false,
                  "consequence": "Наближення для «зручності показу» — це той самий ризик. Краще запам'ятати орієнтири здалеку й відійти ще далі."
                },
                {
                  "label": "Відходиш ще далі й запам'ятовуєш орієнтири здалеку",
                  "correct": true,
                  "next": "childReportSolo"
                }
              ]
            },
            "en": {
              "text": "The adult hasn't come back yet. Should you get a little closer so it's easier to show them the spot later?",
              "options": [
                {
                  "label": "Get a little closer so it's easier to point out",
                  "correct": false,
                  "consequence": "Getting closer \"to make it easier to show\" carries the same risk. It's better to memorise landmarks from a distance and move even further back."
                },
                {
                  "label": "Move even further back and memorise landmarks from a distance",
                  "correct": true,
                  "next": "childReportSolo"
                }
              ]
            }
          },
          "childReportSolo": {
            "type": "call",
            "stopIndex": 3,
            "uk": {
              "prompt": "Дорослий поруч, але зателефонувати можеш ти сам(а). Набери номер служби, яка займається піротехнічними знахідками, і натисни «Викликати».",
              "wrong": {
                "102": "Поліція зафіксує виклик, але саму знахідку без спецобладнання не знешкодить — приїдуть однаково сапери ДСНС. Спробуй ще раз.",
                "103": "Швидка допомога працює з травмами, які вже сталися. Обладнання для боєприпасів у неї немає. Спробуй ще раз.",
                "104": "Це номер аварійної газової служби — тут не той випадок. Спробуй ще раз."
              },
              "wrongDefault": "Цей номер не підходить. В Україні про підозрілі боєприпаси повідомляють Державну службу з надзвичайних ситуацій. Спробуй ще раз."
            },
            "en": {
              "prompt": "The adult is nearby, but you can make the call yourself. Dial the number for the service that handles explosive-ordnance finds, then press \"Call\".",
              "wrong": {
                "102": "Police will log the call, but without special equipment they cant deal with the find itself — DSNS deminers would still be sent. Try again.",
                "103": "Ambulance crews handle injuries that have already happened. They dont carry ordnance-handling equipment. Try again.",
                "104": "Thats the emergency gas-service number — not the right one here. Try again."
              },
              "wrongDefault": "That number isnt right. In Ukraine, suspected ordnance is reported to the State Emergency Service. Try again."
            },
            "correctNumber": "101",
            "next": "end"
          },
          "end": {
            "type": "end",
            "uk": {
              "title": "Розслідування завершено успішно",
              "text": "Ти дотримався(лась) протоколу навіть без дорослого поруч у перші хвилини — і це саме те, що рятує життя. Правила безпеки діють завжди однаково."
            },
            "en": {
              "title": "Investigation successfully completed",
              "text": "You followed the protocol even without an adult nearby in those first minutes — and that's exactly what saves lives. Safety rules apply the same way, always."
            }
          }
        }
      },
      "teen": {
        "uk": {
          "title": "Сам на полі",
          "desc": "Перевіряєш протокол, коли поруч нікого немає",
          "intro": "Ти йдеш звичним шляхом через власне поле, щоб перевірити посіви після негоди. За кілька кроків попереду в борозні щось блищить — метал, наполовину занурений у землю."
        },
        "en": {
          "title": "Alone in the field",
          "desc": "Testing the protocol when no one's around",
          "intro": "You're walking your usual path across your own field to check the crops after a storm. A few steps ahead, something metallic glints in the furrow, half-buried in the ground."
        },
        "nodes": {
          "s1": {
            "type": "story",
            "stopIndex": 0,
            "uk": {
              "text": "Нікого поруч немає, тож спокуса підійти й роздивитись зростає — «зайвих очей все одно нема». Що ти робиш?",
              "options": [
                {
                  "label": "Підходиш ближче — адже нікого поруч, хто міг би зупинити",
                  "correct": false,
                  "consequence": "Правила безпеки не залежать від того, чи хтось бачить. Присутність чи відсутність свідків нічого не змінює — ризик той самий. Перше правило: ЗУПИНИСЬ, навіть якщо ти сам(а)."
                },
                {
                  "label": "Зупиняєшся на місці й більше не робиш кроків уперед",
                  "correct": true,
                  "next": "s2"
                }
              ]
            },
            "en": {
              "text": "No one's around, so the temptation to get closer and take a look grows — \"no one will know anyway.\" What do you do?",
              "options": [
                {
                  "label": "Step closer — after all, no one's there to stop you",
                  "correct": false,
                  "consequence": "Safety rules don't depend on whether anyone's watching. Having witnesses or not changes nothing — the risk is identical. Rule one: STOP, even when you're alone."
                },
                {
                  "label": "Stop right where you are and take no more steps forward",
                  "correct": true,
                  "next": "s2"
                }
              ]
            }
          },
          "s2": {
            "type": "story",
            "stopIndex": 1,
            "uk": {
              "text": "Ти міг би носком чобота відкинути землю, щоб краще роздивитись — раз нікого немає, хто скаже, що це нерозумно?",
              "options": [
                {
                  "label": "Обережно розгрібаєш землю носком чобота",
                  "correct": false,
                  "consequence": "Навіть непрямий контакт ногою чи взуттям може спричинити спрацювання. Правило НЕ ЧІПАЙ діє завжди, незалежно від того, наскільки обережним здається дотик."
                },
                {
                  "label": "Залишаєш землю й предмет незайманими",
                  "correct": true,
                  "next": "s3"
                }
              ]
            },
            "en": {
              "text": "You could nudge the dirt aside with your boot to see better — with no one around, who's to say it's a bad idea?",
              "options": [
                {
                  "label": "Carefully clear the dirt with the tip of your boot",
                  "correct": false,
                  "consequence": "Even indirect contact with a foot or boot can cause it to go off. The DON'T TOUCH rule always applies, no matter how careful the contact seems."
                },
                {
                  "label": "Leave the dirt and the object exactly as they are",
                  "correct": true,
                  "next": "s3"
                }
              ]
            }
          },
          "s3": {
            "type": "story",
            "stopIndex": 2,
            "uk": {
              "text": "Ти сам(а), тож хочеться одразу поставити мітку на місці — встромити палицю чи кинути куртку — і йти по допомогу.",
              "options": [
                {
                  "label": "Встромляєш поруч палицю як мітку і йдеш",
                  "correct": false,
                  "consequence": "Наближення, щоб щось позначити на місці — це той самий ризик, що й наближення з цікавості. Запам'ятай орієнтири здалеку (дерево, стовп, борозну) — не підходь, щоб щось залишити поруч."
                },
                {
                  "label": "Запам'ятовуєш орієнтири здалеку й відходиш, не наближаючись",
                  "correct": true,
                  "next": "s3fork"
                }
              ]
            },
            "en": {
              "text": "Being alone, you're tempted to mark the spot right away — plant a stick or drop your jacket — and then go for help.",
              "options": [
                {
                  "label": "Plant a stick nearby as a marker and head off",
                  "correct": false,
                  "consequence": "Approaching to mark the spot carries the same risk as approaching out of curiosity. Memorise landmarks from a distance (a tree, a pole, the furrow line) — don't go closer to leave anything behind."
                },
                {
                  "label": "Memorise landmarks from a distance and back away without approaching",
                  "correct": true,
                  "next": "s3fork"
                }
              ]
            }
          },
          "s3fork": {
            "type": "story",
            "stopIndex": 2,
            "uk": {
              "text": "Відійшовши на безпечну відстань, ти вирішуєш, як точно запам'ятати місце для саперів. Обидва варіанти безпечні — обери свій.",
              "options": [
                {
                  "label": "Рахуєш кроки від межі поля до предмета",
                  "correct": true,
                  "next": "call3a"
                },
                {
                  "label": "Записуєш голосове повідомлення собі з описом орієнтирів",
                  "correct": true,
                  "next": "call3b"
                }
              ]
            },
            "en": {
              "text": "Now at a safe distance, you decide how to precisely remember the spot for the deminers. Both options are safe — pick yours.",
              "options": [
                {
                  "label": "Count your steps from the field boundary to the object",
                  "correct": true,
                  "next": "call3a"
                },
                {
                  "label": "Record a voice memo to yourself describing the landmarks",
                  "correct": true,
                  "next": "call3b"
                }
              ]
            }
          },
          "call3a": {
            "type": "call",
            "stopIndex": 3,
            "uk": {
              "prompt": "Маючи точну кількість кроків від межі поля, час зателефонувати. Набери номер служби, яка займається піротехнічними знахідками, і натисни «Викликати».",
              "wrong": {
                "102": "Поліція зафіксує виклик, але саму знахідку без спецобладнання не знешкодить — приїдуть однаково сапери ДСНС. Спробуй ще раз.",
                "103": "Швидка допомога працює з травмами, які вже сталися. Обладнання для боєприпасів у неї немає. Спробуй ще раз.",
                "104": "Це номер аварійної газової служби — тут не той випадок. Спробуй ще раз."
              },
              "wrongDefault": "Цей номер не підходить. В Україні про підозрілі боєприпаси повідомляють Державну службу з надзвичайних ситуацій. Спробуй ще раз."
            },
            "en": {
              "prompt": "With the exact step count from the field boundary noted, it's time to call. Dial the number for the service that handles explosive-ordnance finds, then press \"Call\".",
              "wrong": {
                "102": "Police will log the call, but without special equipment they can't deal with the find itself — DSNS deminers would still be sent. Try again.",
                "103": "Ambulance crews handle injuries that have already happened. They don't carry ordnance-handling equipment. Try again.",
                "104": "That's the emergency gas-service number — not the right one here. Try again."
              },
              "wrongDefault": "That number isn't right. In Ukraine, suspected ordnance is reported to the State Emergency Service. Try again."
            },
            "correctNumber": "101",
            "next": "end"
          },
          "call3b": {
            "type": "call",
            "stopIndex": 3,
            "uk": {
              "prompt": "Маючи голосовий опис орієнтирів, час зателефонувати. Набери номер служби, яка займається піротехнічними знахідками, і натисни «Викликати».",
              "wrong": {
                "102": "Поліція зафіксує виклик, але саму знахідку без спецобладнання не знешкодить — приїдуть однаково сапери ДСНС. Спробуй ще раз.",
                "103": "Швидка допомога працює з травмами, які вже сталися. Обладнання для боєприпасів у неї немає. Спробуй ще раз.",
                "104": "Це номер аварійної газової служби — тут не той випадок. Спробуй ще раз."
              },
              "wrongDefault": "Цей номер не підходить. В Україні про підозрілі боєприпаси повідомляють Державну службу з надзвичайних ситуацій. Спробуй ще раз."
            },
            "en": {
              "prompt": "With a voice memo of the landmarks ready, it's time to call. Dial the number for the service that handles explosive-ordnance finds, then press \"Call\".",
              "wrong": {
                "102": "Police will log the call, but without special equipment they can't deal with the find itself — DSNS deminers would still be sent. Try again.",
                "103": "Ambulance crews handle injuries that have already happened. They don't carry ordnance-handling equipment. Try again.",
                "104": "That's the emergency gas-service number — not the right one here. Try again."
              },
              "wrongDefault": "That number isn't right. In Ukraine, suspected ordnance is reported to the State Emergency Service. Try again."
            },
            "correctNumber": "101",
            "next": "end"
          },
          "end": {
            "type": "end",
            "uk": {
              "title": "Розслідування завершено успішно",
              "text": "Навіть на самоті, без свідків, ти дотримався(лась) протоколу від першого до останнього кроку — і саме це рятує життя. Правила безпеки не залежать від того, чи хтось дивиться."
            },
            "en": {
              "title": "Investigation successfully completed",
              "text": "Even alone, with no one watching, you followed the protocol from the first step to the last — and that's exactly what saves lives. Safety rules don't depend on whether anyone's watching."
            }
          }
        }
      },
      "adult": {
        "uk": {
          "title": "Сам на полі",
          "desc": "Перевіряєш протокол, коли поруч нікого немає",
          "intro": "Ти йдеш звичним шляхом через власне поле, щоб перевірити посіви після негоди. За кілька кроків попереду в борозні щось блищить — метал, наполовину занурений у землю."
        },
        "en": {
          "title": "Alone in the field",
          "desc": "Testing the protocol when no one's around",
          "intro": "You're walking your usual path across your own field to check the crops after a storm. A few steps ahead, something metallic glints in the furrow, half-buried in the ground."
        },
        "nodes": {
          "s1": {
            "type": "story",
            "stopIndex": 0,
            "uk": {
              "text": "Нікого поруч немає, тож спокуса підійти й роздивитись зростає — «зайвих очей все одно нема». Що ти робиш?",
              "options": [
                {
                  "label": "Підходиш ближче — адже нікого поруч, хто міг би зупинити",
                  "correct": false,
                  "consequence": "Правила безпеки не залежать від того, чи хтось бачить. Присутність чи відсутність свідків нічого не змінює — ризик той самий. Перше правило: ЗУПИНИСЬ, навіть якщо ти сам(а)."
                },
                {
                  "label": "Зупиняєшся на місці й більше не робиш кроків уперед",
                  "correct": true,
                  "next": "s2"
                }
              ]
            },
            "en": {
              "text": "No one's around, so the temptation to get closer and take a look grows — \"no one will know anyway.\" What do you do?",
              "options": [
                {
                  "label": "Step closer — after all, no one's there to stop you",
                  "correct": false,
                  "consequence": "Safety rules don't depend on whether anyone's watching. Having witnesses or not changes nothing — the risk is identical. Rule one: STOP, even when you're alone."
                },
                {
                  "label": "Stop right where you are and take no more steps forward",
                  "correct": true,
                  "next": "s2"
                }
              ]
            }
          },
          "s2": {
            "type": "story",
            "stopIndex": 1,
            "uk": {
              "text": "Ти міг би носком чобота відкинути землю, щоб краще роздивитись — раз нікого немає, хто скаже, що це нерозумно?",
              "options": [
                {
                  "label": "Обережно розгрібаєш землю носком чобота",
                  "correct": false,
                  "consequence": "Навіть непрямий контакт ногою чи взуттям може спричинити спрацювання. Правило НЕ ЧІПАЙ діє завжди, незалежно від того, наскільки обережним здається дотик."
                },
                {
                  "label": "Залишаєш землю й предмет незайманими",
                  "correct": true,
                  "next": "s3"
                }
              ]
            },
            "en": {
              "text": "You could nudge the dirt aside with your boot to see better — with no one around, who's to say it's a bad idea?",
              "options": [
                {
                  "label": "Carefully clear the dirt with the tip of your boot",
                  "correct": false,
                  "consequence": "Even indirect contact with a foot or boot can cause it to go off. The DON'T TOUCH rule always applies, no matter how careful the contact seems."
                },
                {
                  "label": "Leave the dirt and the object exactly as they are",
                  "correct": true,
                  "next": "s3"
                }
              ]
            }
          },
          "s3": {
            "type": "story",
            "stopIndex": 2,
            "uk": {
              "text": "Ти сам(а), тож хочеться одразу поставити мітку на місці — встромити палицю чи кинути куртку — і йти по допомогу.",
              "options": [
                {
                  "label": "Встромляєш поруч палицю як мітку і йдеш",
                  "correct": false,
                  "consequence": "Наближення, щоб щось позначити на місці — це той самий ризик, що й наближення з цікавості. Запам'ятай орієнтири здалеку (дерево, стовп, борозну) — не підходь, щоб щось залишити поруч."
                },
                {
                  "label": "Запам'ятовуєш орієнтири здалеку й відходиш, не наближаючись",
                  "correct": true,
                  "next": "s3fork"
                }
              ]
            },
            "en": {
              "text": "Being alone, you're tempted to mark the spot right away — plant a stick or drop your jacket — and then go for help.",
              "options": [
                {
                  "label": "Plant a stick nearby as a marker and head off",
                  "correct": false,
                  "consequence": "Approaching to mark the spot carries the same risk as approaching out of curiosity. Memorise landmarks from a distance (a tree, a pole, the furrow line) — don't go closer to leave anything behind."
                },
                {
                  "label": "Memorise landmarks from a distance and back away without approaching",
                  "correct": true,
                  "next": "s3fork"
                }
              ]
            }
          },
          "s3fork": {
            "type": "story",
            "stopIndex": 2,
            "uk": {
              "text": "Відійшовши на безпечну відстань, ти вирішуєш, як точно запам'ятати місце для саперів. Обидва варіанти безпечні — обери свій.",
              "options": [
                {
                  "label": "Рахуєш кроки від межі поля до предмета",
                  "correct": true,
                  "next": "call3a"
                },
                {
                  "label": "Записуєш голосове повідомлення собі з описом орієнтирів",
                  "correct": true,
                  "next": "call3b"
                }
              ]
            },
            "en": {
              "text": "Now at a safe distance, you decide how to precisely remember the spot for the deminers. Both options are safe — pick yours.",
              "options": [
                {
                  "label": "Count your steps from the field boundary to the object",
                  "correct": true,
                  "next": "call3a"
                },
                {
                  "label": "Record a voice memo to yourself describing the landmarks",
                  "correct": true,
                  "next": "call3b"
                }
              ]
            }
          },
          "call3a": {
            "type": "call",
            "stopIndex": 3,
            "uk": {
              "prompt": "Маючи точну кількість кроків від межі поля, час зателефонувати. Набери номер служби, яка займається піротехнічними знахідками, і натисни «Викликати».",
              "wrong": {
                "102": "Поліція зафіксує виклик, але саму знахідку без спецобладнання не знешкодить — приїдуть однаково сапери ДСНС. Спробуй ще раз.",
                "103": "Швидка допомога працює з травмами, які вже сталися. Обладнання для боєприпасів у неї немає. Спробуй ще раз.",
                "104": "Це номер аварійної газової служби — тут не той випадок. Спробуй ще раз."
              },
              "wrongDefault": "Цей номер не підходить. В Україні про підозрілі боєприпаси повідомляють Державну службу з надзвичайних ситуацій. Спробуй ще раз."
            },
            "en": {
              "prompt": "With the exact step count from the field boundary noted, it's time to call. Dial the number for the service that handles explosive-ordnance finds, then press \"Call\".",
              "wrong": {
                "102": "Police will log the call, but without special equipment they can't deal with the find itself — DSNS deminers would still be sent. Try again.",
                "103": "Ambulance crews handle injuries that have already happened. They don't carry ordnance-handling equipment. Try again.",
                "104": "That's the emergency gas-service number — not the right one here. Try again."
              },
              "wrongDefault": "That number isn't right. In Ukraine, suspected ordnance is reported to the State Emergency Service. Try again."
            },
            "correctNumber": "101",
            "next": "end"
          },
          "call3b": {
            "type": "call",
            "stopIndex": 3,
            "uk": {
              "prompt": "Маючи голосовий опис орієнтирів, час зателефонувати. Набери номер служби, яка займається піротехнічними знахідками, і натисни «Викликати».",
              "wrong": {
                "102": "Поліція зафіксує виклик, але саму знахідку без спецобладнання не знешкодить — приїдуть однаково сапери ДСНС. Спробуй ще раз.",
                "103": "Швидка допомога працює з травмами, які вже сталися. Обладнання для боєприпасів у неї немає. Спробуй ще раз.",
                "104": "Це номер аварійної газової служби — тут не той випадок. Спробуй ще раз."
              },
              "wrongDefault": "Цей номер не підходить. В Україні про підозрілі боєприпаси повідомляють Державну службу з надзвичайних ситуацій. Спробуй ще раз."
            },
            "en": {
              "prompt": "With a voice memo of the landmarks ready, it's time to call. Dial the number for the service that handles explosive-ordnance finds, then press \"Call\".",
              "wrong": {
                "102": "Police will log the call, but without special equipment they can't deal with the find itself — DSNS deminers would still be sent. Try again.",
                "103": "Ambulance crews handle injuries that have already happened. They don't carry ordnance-handling equipment. Try again.",
                "104": "That's the emergency gas-service number — not the right one here. Try again."
              },
              "wrongDefault": "That number isn't right. In Ukraine, suspected ordnance is reported to the State Emergency Service. Try again."
            },
            "correctNumber": "101",
            "next": "end"
          },
          "end": {
            "type": "end",
            "uk": {
              "title": "Розслідування завершено успішно",
              "text": "Навіть на самоті, без свідків, ти дотримався(лась) протоколу від першого до останнього кроку — і саме це рятує життя. Правила безпеки не залежать від того, чи хтось дивиться."
            },
            "en": {
              "title": "Investigation successfully completed",
              "text": "Even alone, with no one watching, you followed the protocol from the first step to the last — and that's exactly what saves lives. Safety rules don't depend on whether anyone's watching."
            }
          }
        }
      }
    }
  },
  "playground": {
    "icon": "🏗️",
    "ageVariants": {
      "child": {
        "uk": {
          "title": "Таємниця знахідки в кущах",
          "desc": "Гра біля майданчика ховає підозрілу знахідку",
          "intro": "Гуляючи з друзями біля дитячого майданчика за закинутим будівництвом, ти помічаєш у траві яскравий незвичний предмет, схожий на невелику металеву коробочку з дротиками або дивну іграшку."
        },
        "en": {
          "title": "Secret in the bushes",
          "desc": "A playground game hides a suspicious find",
          "intro": "Playing with friends near a playground behind an abandoned construction site, you notice a bright unusual object in the grass — it looks like a small metal box with wires, or a strange toy."
        },
        "nodes": {
          "n1": {
            "type": "story",
            "stopIndex": 0,
            "uk": {
              "text": "Що ти зробиш?",
              "options": [
                {
                  "label": "Підійду ближче і спробую штовхнути її палицею, щоб роздивитися.",
                  "correct": false,
                  "consequence": "Навіть дотик палицею — це вже занадто близько. Спочатку зупинись і не наближайся, а тоді відведи друзів подалі."
                },
                {
                  "label": "Зупинюся, відійду на безпечну відстань і скажу друзям нічого не чіпати.",
                  "correct": true,
                  "next": "n2"
                }
              ]
            },
            "en": {
              "text": "What do you do?",
              "options": [
                {
                  "label": "Get closer and try to nudge it with a stick to look at it.",
                  "correct": false,
                  "consequence": "Even touching it with a stick is already too close. Stop and don't approach first, then move your friends back."
                },
                {
                  "label": "Stop, move to a safe distance, and tell your friends not to touch anything.",
                  "correct": true,
                  "next": "n2"
                }
              ]
            }
          },
          "n2": {
            "type": "story",
            "stopIndex": 1,
            "uk": {
              "text": "Ти відійшов назад на кілька метрів і наказав усім зупинитися. Куди краще відійти, щоб було безпечно?",
              "options": [
                {
                  "label": "Побігти через відкрите поле ближче до дому, щоб швидше всім розповісти.",
                  "correct": false,
                  "consequence": "Відкрите поле не захищає від уламків. Краще використати найближче тверде укриття — стіну, ріг будинку."
                },
                {
                  "label": "Сховатися за найближчу бетонну стіну або відійти за рог сусіднього будинку, де нас не зачепить у разі небезпеки.",
                  "correct": true,
                  "next": "n3"
                }
              ]
            },
            "en": {
              "text": "You've stepped back a few metres and told everyone to stop. Where's the best place to retreat to for safety?",
              "options": [
                {
                  "label": "Run across the open field toward home to tell everyone faster.",
                  "correct": false,
                  "consequence": "An open field gives no protection from fragments. Use the nearest solid cover instead — a wall, the corner of a building."
                },
                {
                  "label": "Hide behind the nearest concrete wall or move around the corner of a nearby building, out of the line of danger.",
                  "correct": true,
                  "next": "n3"
                }
              ]
            }
          },
          "n3": {
            "type": "story",
            "stopIndex": 2,
            "uk": {
              "text": "Ви сховалися за безпечне укриття. Хтось із друзів пропонує повернутися й сфотографувати предмет на телефон. Твої дії?",
              "options": [
                {
                  "label": "Погодитись — швидко збігати й зняти одне фото для доказу.",
                  "correct": false,
                  "consequence": "Навіть швидке повернення — це знову наближення до небезпеки. Фото не варте ризику: важливо просто повідомити дорослих, де саме знахідка."
                },
                {
                  "label": "Ні в якому разі не повертатися, бо небезпечно. Треба повідомити дорослих або зателефонувати в екстрену службу.",
                  "correct": true,
                  "next": "call1"
                }
              ]
            },
            "en": {
              "text": "You're behind safe cover. One of your friends suggests going back to photograph the object on their phone. What do you do?",
              "options": [
                {
                  "label": "Agree — quickly run back and take one photo as proof.",
                  "correct": false,
                  "consequence": "Even a quick trip back means approaching danger again. No photo is worth the risk — just tell an adult exactly where the find is."
                },
                {
                  "label": "Absolutely not go back, it's dangerous. Tell an adult or call the emergency service.",
                  "correct": true,
                  "next": "call1"
                }
              ]
            }
          },
          "call1": {
            "type": "call",
            "stopIndex": 3,
            "uk": {
              "prompt": "Час зателефонувати. Набери номер служби, яка займається піротехнічними знахідками, і натисни «Викликати».",
              "wrong": {
                "102": "Поліція зафіксує виклик, але саму знахідку без спецобладнання не знешкодить — приїдуть однаково сапери ДСНС. Спробуй ще раз.",
                "103": "Швидка допомога працює з травмами, які вже сталися. Обладнання для боєприпасів у неї немає. Спробуй ще раз.",
                "104": "Це номер аварійної газової служби — тут не той випадок. Спробуй ще раз."
              },
              "wrongDefault": "Цей номер не підходить. В Україні про підозрілі боєприпаси повідомляють Державну службу з надзвичайних ситуацій. Спробуй ще раз."
            },
            "en": {
              "prompt": "Time to call for help. Dial the number for the service that handles explosive-ordnance finds, then press \"Call\".",
              "wrong": {
                "102": "Police will log the call, but without special equipment they can't deal with the find itself — DSNS deminers would still be sent. Try again.",
                "103": "Ambulance crews handle injuries that have already happened. They don't carry ordnance-handling equipment. Try again.",
                "104": "That's the emergency gas-service number — not the right one here. Try again."
              },
              "wrongDefault": "That number isn't right. In Ukraine, suspected ordnance is reported to the State Emergency Service. Try again."
            },
            "correctNumber": "101",
            "next": "end"
          },
          "end": {
            "type": "end",
            "uk": {
              "title": "Знахідку виявлено безпечно",
              "text": "Оператору чітко пояснили: «Ми біля старого майданчика знайшли підозрілий предмет, схожий на вибухівку, ніхто не чіпає, чекаємо на безпечній відстані». Саме так і працює протокол — крок за кроком, без поспіху."
            },
            "en": {
              "title": "The find was handled safely",
              "text": "You told the dispatcher clearly: \"We're near the old playground, found a suspicious object that looks like ordnance, nobody's touching it, we're waiting at a safe distance.\" That's exactly how the protocol works — step by step, without rushing."
            }
          }
        }
      },
      "teen": {
        "uk": {
          "title": "Знахідка в лісопосадці біля велосипедної траси",
          "desc": "Велопрогулянка лісосмугою приносить неочікувану зупинку",
          "intro": "Катаючись із другом на велосипедах у лісосмузі, ви з'їжджаєте з протоптаної стежки й натрапляєте на напівзакопаний у землю металевий предмет із залишками дроту та маркуванням."
        },
        "en": {
          "title": "A find in the tree line by the bike trail",
          "desc": "A bike ride through the woods brings an unexpected stop",
          "intro": "Riding bikes with a friend through a tree line, you veer off the worn path and come across a half-buried metal object with wire remnants and markings."
        },
        "nodes": {
          "n1": {
            "type": "story",
            "stopIndex": 0,
            "uk": {
              "text": "Твоя перша реакція?",
              "options": [
                {
                  "label": "Підійти ближче, щоб зняти сторіз для соцмереж та викласти у чат.",
                  "correct": false,
                  "consequence": "Наближення заради контенту — це той самий ризик, що й наближення з цікавості. Жоден кадр не вартий цього."
                },
                {
                  "label": "Зменшити швидкість, зупинитися, не робити різких рухів і попередити товариша шепотом або жестом.",
                  "correct": true,
                  "next": "n2"
                }
              ]
            },
            "en": {
              "text": "Your first reaction?",
              "options": [
                {
                  "label": "Get closer to film a story for social media and post it to the chat.",
                  "correct": false,
                  "consequence": "Getting closer for content is the same risk as getting closer out of curiosity. No shot is worth it."
                },
                {
                  "label": "Slow down, stop, make no sudden moves, and warn your friend with a whisper or a gesture.",
                  "correct": true,
                  "next": "n2"
                }
              ]
            }
          },
          "n2": {
            "type": "story",
            "stopIndex": 1,
            "uk": {
              "text": "Ви зупинилися на безпечній відстані. Що робити далі у цій ситуації?",
              "options": [
                {
                  "label": "Перестрибнути через кущі навколо предмета, щоб скоротити шлях до асфальту.",
                  "correct": false,
                  "consequence": "Рух навколо предмета непередбачуваною траєкторією — додатковий ризик наступити на щось приховане. Завжди повертайся тим самим шляхом, яким прийшов."
                },
                {
                  "label": "Повільно й обережно відійти назад тим самим шляхом, яким приїхали (слід у слід).",
                  "correct": true,
                  "next": "n3"
                }
              ]
            },
            "en": {
              "text": "You've stopped at a safe distance. What do you do next?",
              "options": [
                {
                  "label": "Jump over the bushes around the object to shortcut back to the road.",
                  "correct": false,
                  "consequence": "Moving around the object on an unpredictable path adds risk of stepping on something hidden. Always retrace the exact path you came from."
                },
                {
                  "label": "Slowly and carefully retreat the same way you came (retracing your exact path).",
                  "correct": true,
                  "next": "n3"
                }
              ]
            }
          },
          "n3": {
            "type": "story",
            "stopIndex": 2,
            "uk": {
              "text": "Ви вибралися на безпечне місце на узбіччі дороги. Що заборонено робити біля місця знахідки?",
              "options": [
                {
                  "label": "Зняти відео здалеку на телефон, адже це вже безпечна відстань.",
                  "correct": false,
                  "consequence": "Навіть на «безпечній» відстані користуватись рацією чи гучним пристроєм поруч із боєприпасом небажано. Найкраще — просто відійти ще далі (100+ метрів)."
                },
                {
                  "label": "Користуватися поблизу радіостанціями чи мобільними телефонами (краще відійти на 100+ метрів), а також кидати каміння чи намагатися пересунути предмет.",
                  "correct": true,
                  "next": "call1"
                }
              ]
            },
            "en": {
              "text": "You've reached a safe spot on the roadside. What's forbidden near the find?",
              "options": [
                {
                  "label": "Film a video from a distance since it's already a safe spot.",
                  "correct": false,
                  "consequence": "Even at a \"safe\" distance, using radios or loud devices near ordnance is unwise. It's best to simply move even further back (100+ metres)."
                },
                {
                  "label": "Using radios or mobile phones nearby (better to move 100+ metres away), or throwing stones or trying to move the object.",
                  "correct": true,
                  "next": "call1"
                }
              ]
            }
          },
          "call1": {
            "type": "call",
            "stopIndex": 3,
            "uk": {
              "prompt": "Час повідомити відповідні служби. Набери номер і натисни «Викликати».",
              "wrong": {
                "102": "Поліція зафіксує виклик, але саму знахідку без спецобладнання не знешкодить — приїдуть однаково сапери ДСНС. Спробуй ще раз.",
                "103": "Швидка допомога працює з травмами, які вже сталися. Обладнання для боєприпасів у неї немає. Спробуй ще раз.",
                "104": "Це номер аварійної газової служби — тут не той випадок. Спробуй ще раз."
              },
              "wrongDefault": "Цей номер не підходить. В Україні про підозрілі боєприпаси повідомляють Державну службу з надзвичайних ситуацій. Спробуй ще раз."
            },
            "en": {
              "prompt": "Time to notify the relevant services. Dial the number and press \"Call\".",
              "wrong": {
                "102": "Police will log the call, but without special equipment they can't deal with the find itself — DSNS deminers would still be sent. Try again.",
                "103": "Ambulance crews handle injuries that have already happened. They don't carry ordnance-handling equipment. Try again.",
                "104": "That's the emergency gas-service number — not the right one here. Try again."
              },
              "wrongDefault": "That number isn't right. In Ukraine, suspected ordnance is reported to the State Emergency Service. Try again."
            },
            "correctNumber": "101",
            "next": "end"
          },
          "end": {
            "type": "end",
            "uk": {
              "title": "Ситуацію передано фахівцям",
              "text": "Диспетчеру передали чітку координату в лісосмузі, опис предмета й підтвердили відсутність постраждалих. Обережність і точний маршрут назад — ось що зберегло вас у безпеці."
            },
            "en": {
              "title": "The situation was handed to specialists",
              "text": "You gave the dispatcher a clear location in the tree line, described the object, and confirmed no one was hurt. Caution and retracing your exact route kept you safe."
            }
          }
        }
      },
      "adult": {
        "uk": {
          "title": "Відновлення дачної ділянки після обстрілів",
          "desc": "Перша перевірка городу на деокупованій території",
          "intro": "Ви приїхали на дачу вперше після тривалої відсутності. Заходячи на територію городу, бачите в кутку розритий ґрунт і стирчить невідомий металевий елемент із хвостовиком."
        },
        "en": {
          "title": "Restoring the garden plot after shelling",
          "desc": "The first check of a garden in a de-occupied area",
          "intro": "You've arrived at your dacha for the first time after a long absence. Entering the garden, you notice disturbed soil in the corner with an unidentified metal element with a tail fin sticking out."
        },
        "nodes": {
          "n1": {
            "type": "story",
            "stopIndex": 0,
            "uk": {
              "text": "Ваші дії на першій хвилині?",
              "options": [
                {
                  "label": "Взяти сапку або лопату, щоб обережно підкопати об'єкт і зрозуміти, що це.",
                  "correct": false,
                  "consequence": "Будь-яке копання чи дотик інструментом може спричинити спрацювання. Перше правило незмінне: зупинись і нічого не чіпай, навіть інструментом."
                },
                {
                  "label": "Негайно зупинитися, зафіксувати положення тіла, озирнутися навколо на предмет інших мін-розтяжок під ногами.",
                  "correct": true,
                  "next": "n2"
                }
              ]
            },
            "en": {
              "text": "Your action in the first minute?",
              "options": [
                {
                  "label": "Grab a hoe or shovel to carefully dig around the object and figure out what it is.",
                  "correct": false,
                  "consequence": "Any digging or contact with a tool can trigger it. Rule one still applies: stop and don't touch anything, even with a tool."
                },
                {
                  "label": "Stop immediately, hold your position, and look around your feet for other tripwires or mines.",
                  "correct": true,
                  "next": "n2"
                }
              ]
            }
          },
          "n2": {
            "type": "story",
            "stopIndex": 1,
            "uk": {
              "text": "Ви стоїте на місці, уважно дивитесь під ноги. Як правильно залишити небезпечну зону, якщо розтяжок навколо не видно?",
              "options": [
                {
                  "label": "Побігти навпростець до воріт, щоб швидше зачинити за собою хвіртку.",
                  "correct": false,
                  "consequence": "Біг чи стрибки різко підвищують ризик наступити на щось приховане в землі. Рухайся повільно й точно тим самим слідом, яким прийшов."
                },
                {
                  "label": "Повільно відступати назад слід у слід, не роблячи зайвих рухів, не бігти і не стрибати.",
                  "correct": true,
                  "next": "n3"
                }
              ]
            },
            "en": {
              "text": "You're holding still, watching your footing carefully. How do you correctly leave the danger zone if no tripwires are visible?",
              "options": [
                {
                  "label": "Run straight for the gate to close it behind you faster.",
                  "correct": false,
                  "consequence": "Running or jumping sharply increases the risk of stepping on something hidden underground. Move slowly, retracing your exact footsteps."
                },
                {
                  "label": "Slowly step backward retracing your own footprints, no sudden moves, no running or jumping.",
                  "correct": true,
                  "next": "n3"
                }
              ]
            }
          },
          "n3": {
            "type": "story",
            "stopIndex": 2,
            "uk": {
              "text": "Ви вийшли за межі потенційно замінованої території на безпечний асфальт. Сусід пропонує повернутися з ліхтариком, бо «уже вечоріє і треба закрити ворота». Ваша відповідь?",
              "options": [
                {
                  "label": "Погодитись — сусід же тільки зачинить хвіртку, це недалеко.",
                  "correct": false,
                  "consequence": "Жодний «швидкий» похід на територію не є безпечним, навіть якщо мета здається дрібною. Ділянка залишається закритою для всіх до прибуття фахівців."
                },
                {
                  "label": "Категорична відмова. Ніхто не заходить на ділянку до прибуття саперів. Територію слід позначити підручними засобами (стрічкою, гілками) на безпечній відстані.",
                  "correct": true,
                  "next": "call1"
                }
              ]
            },
            "en": {
              "text": "You're out of the potentially mined area on safe pavement. A neighbour offers to go back with a flashlight since \"it's getting dark and the gate needs closing.\" Your response?",
              "options": [
                {
                  "label": "Agree — the neighbour is only closing the gate, it's not far.",
                  "correct": false,
                  "consequence": "No \"quick\" trip onto the property is safe, even if the goal seems minor. The plot stays off-limits to everyone until specialists arrive."
                },
                {
                  "label": "A firm no. Nobody enters the plot until the deminers arrive. Mark the area with whatever's on hand (tape, branches) from a safe distance.",
                  "correct": true,
                  "next": "call1"
                }
              ]
            }
          },
          "call1": {
            "type": "call",
            "stopIndex": 3,
            "uk": {
              "prompt": "Необхідно викликати спеціалістів. Набери номер і натисни «Викликати».",
              "wrong": {
                "102": "Поліція зафіксує виклик, але саму знахідку без спецобладнання не знешкодить — приїдуть однаково сапери ДСНС. Спробуй ще раз.",
                "103": "Швидка допомога працює з травмами, які вже сталися. Обладнання для боєприпасів у неї немає. Спробуй ще раз.",
                "104": "Це номер аварійної газової служби — тут не той випадок. Спробуй ще раз."
              },
              "wrongDefault": "Цей номер не підходить. В Україні про підозрілі боєприпаси повідомляють Державну службу з надзвичайних ситуацій. Спробуй ще раз."
            },
            "en": {
              "prompt": "Time to call in specialists. Dial the number and press \"Call\".",
              "wrong": {
                "102": "Police will log the call, but without special equipment they can't deal with the find itself — DSNS deminers would still be sent. Try again.",
                "103": "Ambulance crews handle injuries that have already happened. They don't carry ordnance-handling equipment. Try again.",
                "104": "That's the emergency gas-service number — not the right one here. Try again."
              },
              "wrongDefault": "That number isn't right. In Ukraine, suspected ordnance is reported to the State Emergency Service. Try again."
            },
            "correctNumber": "101",
            "next": "end"
          },
          "end": {
            "type": "end",
            "uk": {
              "title": "Ділянку взято під контроль",
              "text": "Диспетчеру передали опис виявленого боєприпасу, точну адресу та підтвердили, що на подвір'я ніхто не заходить, а проїзд для спецтранспорту вільний."
            },
            "en": {
              "title": "The plot is under control",
              "text": "You gave the dispatcher a description of the ordnance, the exact address, and confirmed nobody enters the yard while access stays clear for emergency vehicles."
            }
          }
        }
      }
    }
  },
  "village": {
    "icon": "🌾",
    "ageVariants": {
      "child": {
        "uk": {
          "title": "Незвична знахідка в лісосмузі біля села",
          "desc": "Повертаючись зі збору ягід, натрапляєш на дивний предмет",
          "intro": "Йдучи стежкою з лісу після збору ягід, ти помічаєш у високій траві блискучий предмет, схожий на невелику металеву банку або іграшку, від якої тягнеться тонкий дріт."
        },
        "en": {
          "title": "An unusual find near the village tree line",
          "desc": "Coming back from picking berries, you stumble on something odd",
          "intro": "Walking a forest path back from picking berries, you notice a shiny object in the tall grass — like a small metal can or a toy, with a thin wire trailing from it."
        },
        "nodes": {
          "n1": {
            "type": "story",
            "stopIndex": 0,
            "uk": {
              "text": "Що ти зробиш першочергово?",
              "options": [
                {
                  "label": "Підійду ближче, щоб торкнутися дроту й перевірити, чи міцно він закріплений.",
                  "correct": false,
                  "consequence": "Дріт, що тягнеться від предмета, може бути розтяжкою. Торкатися його не можна навіть обережно — це саме той рух, що спричиняє спрацювання."
                },
                {
                  "label": "Зупинюся на місці, не робитиму кроку вперед і голосно скажу друзям: «Усім назад!».",
                  "correct": true,
                  "next": "n2"
                }
              ]
            },
            "en": {
              "text": "What's the first thing you do?",
              "options": [
                {
                  "label": "Get closer to touch the wire and check how firmly it's attached.",
                  "correct": false,
                  "consequence": "A wire trailing from the object could be a tripwire. Never touch it, even carefully — that's exactly the kind of motion that triggers it."
                },
                {
                  "label": "Stop right where I am, take no step forward, and shout to my friends: \"Everyone back!\"",
                  "correct": true,
                  "next": "n2"
                }
              ]
            }
          },
          "n2": {
            "type": "story",
            "stopIndex": 1,
            "uk": {
              "text": "Ви зупинилися. Що потрібно зробити з мобільним телефоном або годинником-трекером, якщо вони є з собою?",
              "options": [
                {
                  "label": "Увімкнути ліхтарик на телефоні, щоб краще роздивитися предмет у темній траві.",
                  "correct": false,
                  "consequence": "Це означає нахилятися й наближатися заради кращого огляду — а це вже ризик. Найкраще просто відійти, а не намагатись роздивитись детальніше."
                },
                {
                  "label": "Вимкнути звук або повністю вимкнути пристрій, аби раптовий дзвінок не створив зайвих коливань чи не відволік увагу.",
                  "correct": true,
                  "next": "n3"
                }
              ]
            },
            "en": {
              "text": "You've stopped. What should you do with your phone or tracker watch, if you have one?",
              "options": [
                {
                  "label": "Turn on the phone's flashlight to see the object better in the dark grass.",
                  "correct": false,
                  "consequence": "That means leaning in and getting closer for a better look — which is already a risk. It's best to simply back away, not try to inspect it more closely."
                },
                {
                  "label": "Mute it or turn it off completely, so a sudden call doesn't create vibration or distract your attention.",
                  "correct": true,
                  "next": "n3"
                }
              ]
            }
          },
          "n3": {
            "type": "story",
            "stopIndex": 2,
            "uk": {
              "text": "Ви повільно відійшли назад на безпечну відстань (не менше 50-100 метрів). Навколо немає дорослих. Твої подальші дії?",
              "options": [
                {
                  "label": "Почекати на місці, поки хтось із дорослих сам не пройде повз.",
                  "correct": false,
                  "consequence": "Чекати на місці біля небезпечної зони не варто. Краще одразу рухатися до найближчого безпечного будинку чи телефонувати, а не покладатися на випадковість."
                },
                {
                  "label": "Знайти найближчий безпечний будинок або зателефонувати батькам чи одразу на екстрену службу.",
                  "correct": true,
                  "next": "call1"
                }
              ]
            },
            "en": {
              "text": "You've slowly backed away to a safe distance (at least 50-100 metres). There's no adult around. What do you do next?",
              "options": [
                {
                  "label": "Wait where you are until an adult happens to walk by.",
                  "correct": false,
                  "consequence": "Waiting near the danger zone isn't a good idea. It's better to head straight for the nearest safe house or call someone, rather than rely on chance."
                },
                {
                  "label": "Find the nearest safe house, or call your parents or the emergency service directly.",
                  "correct": true,
                  "next": "call1"
                }
              ]
            }
          },
          "call1": {
            "type": "call",
            "stopIndex": 3,
            "uk": {
              "prompt": "Час зателефонувати. Набери номер і натисни «Викликати».",
              "wrong": {
                "102": "Поліція зафіксує виклик, але саму знахідку без спецобладнання не знешкодить — приїдуть однаково сапери ДСНС. Спробуй ще раз.",
                "103": "Швидка допомога працює з травмами, які вже сталися. Обладнання для боєприпасів у неї немає. Спробуй ще раз.",
                "104": "Це номер аварійної газової служби — тут не той випадок. Спробуй ще раз."
              },
              "wrongDefault": "Цей номер не підходить. В Україні про підозрілі боєприпаси повідомляють Державну службу з надзвичайних ситуацій. Спробуй ще раз."
            },
            "en": {
              "prompt": "Time to call for help. Dial the number and press \"Call\".",
              "wrong": {
                "102": "Police will log the call, but without special equipment they can't deal with the find itself — DSNS deminers would still be sent. Try again.",
                "103": "Ambulance crews handle injuries that have already happened. They don't carry ordnance-handling equipment. Try again.",
                "104": "That's the emergency gas-service number — not the right one here. Try again."
              },
              "wrongDefault": "That number isn't right. In Ukraine, suspected ordnance is reported to the State Emergency Service. Try again."
            },
            "correctNumber": "101",
            "next": "end"
          },
          "end": {
            "type": "end",
            "uk": {
              "title": "Допомогу викликано",
              "text": "Диспетчеру чітко назвали орієнтир (наприклад, стару водонапірну вежу), описали знахідку і підтвердили, що всі діти відійшли на безпечну відстань і чекають дорослих."
            },
            "en": {
              "title": "Help was called",
              "text": "You gave the dispatcher a clear landmark (like the old water tower), described the find, and confirmed all the kids had backed off to a safe distance and were waiting for adults."
            }
          }
        }
      },
      "teen": {
        "uk": {
          "title": "Занедбана будівля та сталкерські пригоди",
          "desc": "Прогулянка покинутим комбінатом обертається випробуванням",
          "intro": "Перелазячи через зруйнований паркан старого комбінату, ти бачиш на підлозі розбитого цеху дивний металевий предмет циліндричної форми з якимось маркуванням і залишками крилець."
        },
        "en": {
          "title": "The abandoned building and an urbex adventure",
          "desc": "A walk through a derelict plant turns into a real test",
          "intro": "Climbing through the broken fence of an old industrial plant, you spot a strange cylindrical metal object with markings and fin remnants on the floor of a wrecked workshop."
        },
        "nodes": {
          "n1": {
            "type": "story",
            "stopIndex": 0,
            "uk": {
              "text": "Твоя реакція?",
              "options": [
                {
                  "label": "Дістати смартфон, увімкнути камеру і підійти впритул, щоб зняти ефектне відео для стріму.",
                  "correct": false,
                  "consequence": "Наближення заради відео — один із найпоширеніших і найнебезпечніших сценаріїв необережності. Ризик той самий, незалежно від мети наближення."
                },
                {
                  "label": "Зрозуміти потенційну небезпеку, зупинити товариша подихом або жестом і наказати завмерти.",
                  "correct": true,
                  "next": "n2"
                }
              ]
            },
            "en": {
              "text": "Your reaction?",
              "options": [
                {
                  "label": "Pull out your phone, hit record, and get right up close for a dramatic video for your stream.",
                  "correct": false,
                  "consequence": "Getting closer for a video is one of the most common and dangerous careless moves. The risk is the same, no matter the reason for approaching."
                },
                {
                  "label": "Recognise the potential danger, stop your friend with a gesture or a whisper, and tell them to freeze.",
                  "correct": true,
                  "next": "n2"
                }
              ]
            }
          },
          "n2": {
            "type": "story",
            "stopIndex": 1,
            "uk": {
              "text": "Ви завмерли. Як треба безпечно вийти із самої будівлі, де виявлено підозрілий предмет?",
              "options": [
                {
                  "label": "Побігти через отвір у стіні чи розбиті двері, щоб швидше вискочити назовні.",
                  "correct": false,
                  "consequence": "Різкий біг новим маршрутом через завали підвищує ризик зачепити щось приховане. Вихід — тільки повільно і тим самим шляхом, яким зайшов."
                },
                {
                  "label": "Повільно й акуратно повернутися назад тим самим шляхом, ставлячи ноги виключно туди, де вже стояли (слід у слід), уникаючи будь-яких дотиків до стін чи уламків.",
                  "correct": true,
                  "next": "n3"
                }
              ]
            },
            "en": {
              "text": "You've frozen in place. How do you safely leave the building where the suspicious object was found?",
              "options": [
                {
                  "label": "Run through a gap in the wall or a broken doorway to get outside faster.",
                  "correct": false,
                  "consequence": "Rushing through rubble on a new route raises the risk of catching something hidden. The only way out is slow, and along the exact path you came in."
                },
                {
                  "label": "Slowly and carefully retrace your steps, placing your feet exactly where you already stood, avoiding any contact with walls or debris.",
                  "correct": true,
                  "next": "n3"
                }
              ]
            }
          },
          "n3": {
            "type": "story",
            "stopIndex": 2,
            "uk": {
              "text": "Ви на вулиці, на безпечній відстані від об'єкта. Один із друзів пропонує повернутися пізніше з ліхтариками й оглянути все детальніше, бо «тут точно є цікавий металобрухт». Твоя позиція?",
              "options": [
                {
                  "label": "Погодитись, але тільки якщо піти всі разом і бути обережними.",
                  "correct": false,
                  "consequence": "Кількість людей чи обережність не змінюють ризику — територія з підозрілим предметом закрита для всіх, завжди, до прибуття фахівців."
                },
                {
                  "label": "Сувора заборона. Пояснити другу, що це смертельно небезпечно, а територію треба позначити (наприклад, шматком тканини на гілці неподалік, не підходячи до самої будівлі).",
                  "correct": true,
                  "next": "call1"
                }
              ]
            },
            "en": {
              "text": "You're outside, at a safe distance. One friend suggests coming back later with flashlights for a closer look, since \"there's definitely interesting scrap here.\" Your position?",
              "options": [
                {
                  "label": "Agree, but only if everyone goes together and stays careful.",
                  "correct": false,
                  "consequence": "Numbers or caution don't change the risk — an area with a suspicious object is off-limits to everyone, always, until specialists arrive."
                },
                {
                  "label": "A firm no. Explain to your friend it's deadly dangerous, and mark the area instead (like tying cloth to a branch nearby, without approaching the building).",
                  "correct": true,
                  "next": "call1"
                }
              ]
            }
          },
          "call1": {
            "type": "call",
            "stopIndex": 3,
            "uk": {
              "prompt": "Куди звертаємось? Набери номер і натисни «Викликати».",
              "wrong": {
                "102": "Поліція зафіксує виклик, але саму знахідку без спецобладнання не знешкодить — приїдуть однаково сапери ДСНС. Спробуй ще раз.",
                "103": "Швидка допомога працює з травмами, які вже сталися. Обладнання для боєприпасів у неї немає. Спробуй ще раз.",
                "104": "Це номер аварійної газової служби — тут не той випадок. Спробуй ще раз."
              },
              "wrongDefault": "Цей номер не підходить. В Україні про підозрілі боєприпаси повідомляють Державну службу з надзвичайних ситуацій. Спробуй ще раз."
            },
            "en": {
              "prompt": "Who do you call? Dial the number and press \"Call\".",
              "wrong": {
                "102": "Police will log the call, but without special equipment they can't deal with the find itself — DSNS deminers would still be sent. Try again.",
                "103": "Ambulance crews handle injuries that have already happened. They don't carry ordnance-handling equipment. Try again.",
                "104": "That's the emergency gas-service number — not the right one here. Try again."
              },
              "wrongDefault": "That number isn't right. In Ukraine, suspected ordnance is reported to the State Emergency Service. Try again."
            },
            "correctNumber": "101",
            "next": "end"
          },
          "end": {
            "type": "end",
            "uk": {
              "title": "Об'єкт заблоковано для відвідування",
              "text": "Диспетчеру передали чіткі координати занедбаного підприємства, підтвердили, що вхід заблоковано і ніхто туди більше не заходить."
            },
            "en": {
              "title": "The site is now off-limits",
              "text": "You gave the dispatcher clear coordinates for the derelict plant and confirmed the entrance is blocked and no one else goes in."
            }
          }
        }
      },
      "adult": {
        "uk": {
          "title": "Осінні польові роботи",
          "desc": "Збирання врожаю перериває несподівана знахідка",
          "intro": "Працюючи на полі, ви помічаєте в борозні підозрілий металевий об'єкт (частину снаряда чи касетний елемент), який раніше не зустрічався."
        },
        "en": {
          "title": "Autumn fieldwork",
          "desc": "The harvest is interrupted by an unexpected find",
          "intro": "Working the field, you notice a suspicious metal object in the furrow — part of a shell or a cluster munition element — that wasn't there before."
        },
        "nodes": {
          "n1": {
            "type": "story",
            "stopIndex": 0,
            "uk": {
              "text": "Ваша миттєва дія?",
              "options": [
                {
                  "label": "Зістрибнути з трактора, підійти до знахідки, щоб відкинути її лопатою з колії.",
                  "correct": false,
                  "consequence": "Різкий вихід із техніки і спроба прибрати предмет — прямий ризик спрацювання. Спершу завжди зупинка й пауза, а не дія."
                },
                {
                  "label": "Миттєво зупинити техніку, вимкнути двигун, не виходити з кабіни різко і не робити жодних рухів навколо знахідки.",
                  "correct": true,
                  "next": "n2"
                }
              ]
            },
            "en": {
              "text": "Your instant action?",
              "options": [
                {
                  "label": "Jump off the tractor and go clear it out of the tracks with a shovel.",
                  "correct": false,
                  "consequence": "Jumping out abruptly and trying to move the object is a direct risk of triggering it. Always stop and pause first, not act."
                },
                {
                  "label": "Immediately stop the machine, cut the engine, don't jump out of the cab suddenly, and make no moves around the find.",
                  "correct": true,
                  "next": "n2"
                }
              ]
            }
          },
          "n2": {
            "type": "story",
            "stopIndex": 1,
            "uk": {
              "text": "Ви впевнилися, що трактор зупинено безпечно. Як правильно залишити місце знахідки пішки?",
              "options": [
                {
                  "label": "Скоротити шлях навпростець по необробленому ґрунту до краю поля.",
                  "correct": false,
                  "consequence": "Необроблений ґрунт поза колісним слідом не перевірений і може приховувати ще щось. Рухайся тільки по вже пройденому машиною сліду."
                },
                {
                  "label": "Обережно вийти з іншого боку техніки (протилежного від снаряда), іти назад строго по вже пройденому трактором колісному сліду, де земля вже була перевірена вагою машини.",
                  "correct": true,
                  "next": "n3"
                }
              ]
            },
            "en": {
              "text": "You've made sure the tractor is safely stopped. How do you correctly leave the site on foot?",
              "options": [
                {
                  "label": "Shortcut across untouched soil to the edge of the field.",
                  "correct": false,
                  "consequence": "Untouched soil off the wheel track hasn't been checked and could hide something else. Only move along the track the machine already drove over."
                },
                {
                  "label": "Carefully exit from the other side of the machine (away from the shell), walking back strictly along the tractor's own wheel track, where the ground was already tested by the machine's weight.",
                  "correct": true,
                  "next": "n3"
                }
              ]
            }
          },
          "n3": {
            "type": "story",
            "stopIndex": 2,
            "uk": {
              "text": "Ви вибралися на польову дорогу з твердим покриттям. Інші працівники питають, що сталося, і хочуть підійти ближче до техніки, щоб подивитися. Ваша реакція?",
              "options": [
                {
                  "label": "Дозволити підійти, але попередити, щоб трималися за кілька метрів від трактора.",
                  "correct": false,
                  "consequence": "Кілька метрів — недостатня дистанція. Усіх працівників потрібно тримати на значній відстані від усього поля, не лише від трактора."
                },
                {
                  "label": "Зупинити їх на значній відстані. Заборонити будь-кому наближатися до поля. Позначити місце орієнтиром (наприклад, яскравим прапорцем чи палицею на безпечній дистанції видимості).",
                  "correct": true,
                  "next": "call1"
                }
              ]
            },
            "en": {
              "text": "You've reached the firm field road. Other workers ask what happened and want to get closer to the machine to look. Your response?",
              "options": [
                {
                  "label": "Let them approach, but warn them to stay a few metres from the tractor.",
                  "correct": false,
                  "consequence": "A few metres isn't enough distance. All workers need to stay well back from the entire field, not just the tractor."
                },
                {
                  "label": "Stop them at a significant distance. Forbid anyone from approaching the field. Mark the spot with a landmark (a bright flag or stick, visible from a safe distance).",
                  "correct": true,
                  "next": "call1"
                }
              ]
            }
          },
          "call1": {
            "type": "call",
            "stopIndex": 3,
            "uk": {
              "prompt": "Час оформити виклик служб. Набери номер і натисни «Викликати».",
              "wrong": {
                "102": "Поліція зафіксує виклик, але саму знахідку без спецобладнання не знешкодить — приїдуть однаково сапери ДСНС. Спробуй ще раз.",
                "103": "Швидка допомога працює з травмами, які вже сталися. Обладнання для боєприпасів у неї немає. Спробуй ще раз.",
                "104": "Це номер аварійної газової служби — тут не той випадок. Спробуй ще раз."
              },
              "wrongDefault": "Цей номер не підходить. В Україні про підозрілі боєприпаси повідомляють Державну службу з надзвичайних ситуацій. Спробуй ще раз."
            },
            "en": {
              "prompt": "Time to call the emergency services. Dial the number and press \"Call\".",
              "wrong": {
                "102": "Police will log the call, but without special equipment they can't deal with the find itself — DSNS deminers would still be sent. Try again.",
                "103": "Ambulance crews handle injuries that have already happened. They don't carry ordnance-handling equipment. Try again.",
                "104": "That's the emergency gas-service number — not the right one here. Try again."
              },
              "wrongDefault": "That number isn't right. In Ukraine, suspected ordnance is reported to the State Emergency Service. Try again."
            },
            "correctNumber": "101",
            "next": "end"
          },
          "end": {
            "type": "end",
            "uk": {
              "title": "Поле позначено та безпечне",
              "text": "Диспетчеру передали GPS-координати чи орієнтири поля, повідомили про зупинку сільгосптехніки та наявність вибухонебезпечного предмета в ґрунті."
            },
            "en": {
              "title": "The field is marked and safe",
              "text": "You gave the dispatcher GPS coordinates or field landmarks, reported that farm machinery had stopped, and confirmed the presence of an explosive object in the soil."
            }
          }
        }
      }
    }
  }
};


/* ---------------------------------------------------------------------
 * Deck-building helpers
 * ------------------------------------------------------------------- */

/** Fisher-Yates shuffle — returns a new array, never mutates the input. */
export function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Builds a shuffled deck of exactly `count` cards from a source pool.
 * If `count` exceeds the pool size, the full pool is exhausted (in a fresh
 * shuffle order) before any card repeats — so short pools never repeat
 * a card twice in a row, only once every full lap.
 */
export function buildDeckFromPool(pool, count) {
  if (count <= pool.length) {
    return shuffle(pool).slice(0, count);
  }
  let out = [];
  while (out.length < count) {
    out = out.concat(shuffle(pool));
  }
  return out.slice(0, count);
}

/** Convenience wrapper for the swipe game: builds a deck for one age tier. */
export function buildSwipeDeck(levelId, count) {
  return buildDeckFromPool(DECKS[levelId], count);
}

/** Convenience wrapper for Truth-or-Myth: same mechanism, single flat pool. */
export function buildTrueFalseDeck(count) {
  return buildDeckFromPool(TRUEFALSE_DECK, count);
}

/** All quest ids, in a stable display order (used to render the scenario list). */
export function getQuestIds() {
  return Object.keys(QUESTS);
}

/** The age-specific variant (title/desc/intro/nodes) for one quest + age tier. */
export function getQuestVariant(questId, ageId) {
  return QUESTS[questId].ageVariants[ageId];
}

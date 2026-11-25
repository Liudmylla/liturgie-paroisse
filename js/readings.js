// Таблицы чтений на воскресную литургию (русская практика)
// и разбор ссылок вида "Heb 11:24-26,32-12:2" или "Jn 7:37-52;8:12".
(function () {
  const t = (cs, fr) => ({ cs, fr });

  // Номера книг — как в наборах данных getbible.net (data/bible/*/NN.json).
  const BOOKS = {
    Mt: { nr: 40, gospel: true, cs: "От Матфея святаго Евангелия чтение.", fr: "Lecture du saint Évangile selon saint Matthieu.", abbr: t("Мф", "Mt") },
    Mk: { nr: 41, gospel: true, cs: "От Марка святаго Евангелия чтение.", fr: "Lecture du saint Évangile selon saint Marc.", abbr: t("Мк", "Mc") },
    Lk: { nr: 42, gospel: true, cs: "От Луки святаго Евангелия чтение.", fr: "Lecture du saint Évangile selon saint Luc.", abbr: t("Лк", "Lc") },
    Jn: { nr: 43, gospel: true, cs: "От Иоанна святаго Евангелия чтение.", fr: "Lecture du saint Évangile selon saint Jean.", abbr: t("Ин", "Jn") },
    Acts: { nr: 44, acts: true, cs: "Деяний святых апостол чтение.", fr: "Lecture des Actes des saints apôtres.", abbr: t("Деян", "Ac") },
    Rom: { nr: 45, cs: "К Римляном послания святаго апостола Павла чтение.", fr: "Lecture de l’épître du saint apôtre Paul aux Romains.", abbr: t("Рим", "Rm") },
    "1Cor": { nr: 46, cs: "К Коринфяном первого послания святаго апостола Павла чтение.", fr: "Lecture de la première épître du saint apôtre Paul aux Corinthiens.", abbr: t("1 Кор", "1 Co") },
    "2Cor": { nr: 47, cs: "К Коринфяном второго послания святаго апостола Павла чтение.", fr: "Lecture de la deuxième épître du saint apôtre Paul aux Corinthiens.", abbr: t("2 Кор", "2 Co") },
    Gal: { nr: 48, cs: "К Галатом послания святаго апостола Павла чтение.", fr: "Lecture de l’épître du saint apôtre Paul aux Galates.", abbr: t("Гал", "Ga") },
    Eph: { nr: 49, cs: "К Ефесеом послания святаго апостола Павла чтение.", fr: "Lecture de l’épître du saint apôtre Paul aux Éphésiens.", abbr: t("Еф", "Ep") },
    Phil: { nr: 50, cs: "К Филипписием послания святаго апостола Павла чтение.", fr: "Lecture de l’épître du saint apôtre Paul aux Philippiens.", abbr: t("Флп", "Ph") },
    Col: { nr: 51, cs: "К Колоссаем послания святаго апостола Павла чтение.", fr: "Lecture de l’épître du saint apôtre Paul aux Colossiens.", abbr: t("Кол", "Col") },
    "1Thess": { nr: 52, cs: "К Солуняном первого послания святаго апостола Павла чтение.", fr: "Lecture de la première épître du saint apôtre Paul aux Thessaloniciens.", abbr: t("1 Фес", "1 Th") },
    "2Thess": { nr: 53, cs: "К Солуняном второго послания святаго апостола Павла чтение.", fr: "Lecture de la deuxième épître du saint apôtre Paul aux Thessaloniciens.", abbr: t("2 Фес", "2 Th") },
    "1Tim": { nr: 54, cs: "К Тимофею первого послания святаго апостола Павла чтение.", fr: "Lecture de la première épître du saint apôtre Paul à Timothée.", abbr: t("1 Тим", "1 Tm") },
    "2Tim": { nr: 55, cs: "К Тимофею второго послания святаго апостола Павла чтение.", fr: "Lecture de la deuxième épître du saint apôtre Paul à Timothée.", abbr: t("2 Тим", "2 Tm") },
    Tit: { nr: 56, cs: "К Титу послания святаго апостола Павла чтение.", fr: "Lecture de l’épître du saint apôtre Paul à Tite.", abbr: t("Тит", "Tt") },
    Heb: { nr: 58, cs: "К Евреем послания святаго апостола Павла чтение.", fr: "Lecture de l’épître du saint apôtre Paul aux Hébreux.", abbr: t("Евр", "He") },
    Jas: { nr: 59, cs: "Соборнаго послания Иаковля чтение.", fr: "Lecture de l’épître catholique de saint Jacques.", abbr: t("Иак", "Jc") },
    "1Pet": { nr: 60, cs: "Соборнаго послания Петрова первого чтение.", fr: "Lecture de la première épître catholique de saint Pierre.", abbr: t("1 Пет", "1 P") },
    "2Pet": { nr: 61, cs: "Соборнаго послания Петрова второго чтение.", fr: "Lecture de la deuxième épître catholique de saint Pierre.", abbr: t("2 Пет", "2 P") },
  };

  // "Heb 11:24-26,32-12:2" -> {book, segments:[{ch,from,toCh,to}]}
  function parse(ref) {
    const m = /^(\S+)\s+(.+)$/.exec(ref.trim());
    if (!m || !BOOKS[m[1]]) throw new Error("Неизвестная ссылка: " + ref);
    const segments = [];
    let ch = null;
    for (const part of m[2].split(";")) {
      for (const piece of part.split(",")) {
        const [a, b] = piece.trim().split("-");
        let fromCh = ch, from;
        if (a.includes(":")) [fromCh, from] = a.split(":").map(Number);
        else from = Number(a);
        let toCh = fromCh, to = from;
        if (b) {
          if (b.includes(":")) [toCh, to] = b.split(":").map(Number);
          else to = Number(b);
        }
        segments.push({ ch: fromCh, from, toCh, to });
        ch = toCh;
      }
    }
    return { key: m[1], book: BOOKS[m[1]], segments };
  }

  function label(ref, lang) {
    const p = parse(ref);
    const sep = lang === "cs" ? ", " : " ";
    return p.book.abbr[lang] + sep + ref.replace(/^\S+\s+/, "").replace(/-/g, "–");
  }

  const afterPentecost = {
    1: { apostle: "Heb 11:33-12:2", gospel: "Mt 10:32-33,37-38;19:27-30" },
    2: { apostle: "Rom 2:10-16", gospel: "Mt 4:18-23" },
    3: { apostle: "Rom 5:1-10", gospel: "Mt 6:22-33" },
    4: { apostle: "Rom 6:18-23", gospel: "Mt 8:5-13" },
    5: { apostle: "Rom 10:1-10", gospel: "Mt 8:28-9:1" },
    6: { apostle: "Rom 12:6-14", gospel: "Mt 9:1-8" },
    7: { apostle: "Rom 15:1-7", gospel: "Mt 9:27-35" },
    8: { apostle: "1Cor 1:10-18", gospel: "Mt 14:14-22" },
    9: { apostle: "1Cor 3:9-17", gospel: "Mt 14:22-34" },
    10: { apostle: "1Cor 4:9-16", gospel: "Mt 17:14-23" },
    11: { apostle: "1Cor 9:2-12", gospel: "Mt 18:23-35" },
    12: { apostle: "1Cor 15:1-11", gospel: "Mt 19:16-26" },
    13: { apostle: "1Cor 16:13-24", gospel: "Mt 21:33-42" },
    14: { apostle: "2Cor 1:21-2:4", gospel: "Mt 22:1-14" },
    15: { apostle: "2Cor 4:6-15", gospel: "Mt 22:35-46" },
    16: { apostle: "2Cor 6:1-10", gospel: "Mt 25:14-30" },
    17: { apostle: "2Cor 6:16-7:1", gospel: "Mt 15:21-28" },
    18: { apostle: "2Cor 9:6-11", gospel: "Lk 5:1-11" },
    19: { apostle: "2Cor 11:31-12:9", gospel: "Lk 6:31-36" },
    20: { apostle: "Gal 1:11-19", gospel: "Lk 7:11-16" },
    21: { apostle: "Gal 2:16-20", gospel: "Lk 8:5-15" },
    22: { apostle: "Gal 6:11-18", gospel: "Lk 16:19-31" },
    23: { apostle: "Eph 2:4-10", gospel: "Lk 8:26-39" },
    24: { apostle: "Eph 2:14-22", gospel: "Lk 8:41-56" },
    25: { apostle: "Eph 4:1-6", gospel: "Lk 10:25-37" },
    26: { apostle: "Eph 5:8-19", gospel: "Lk 12:16-21" },
    27: { apostle: "Eph 6:10-17", gospel: "Lk 13:10-17" },
    28: { apostle: "Col 1:12-18", gospel: "Lk 14:16-24" },
    29: { apostle: "Col 3:4-11", gospel: "Lk 17:12-19" },
    30: { apostle: "Col 3:12-16", gospel: "Lk 18:18-27" },
    31: { apostle: "1Tim 1:15-17", gospel: "Lk 18:35-43" },
  };

  function ordinaryTitle(n) {
    if (n === 1) return t("Неделя 1-я по Пятидесятнице, всех святых", "Dimanche de tous les saints (1er après la Pentecôte)");
    if (n === 2) return t("Неделя 2-я по Пятидесятнице, всех святых, в земле Российской просиявших", "2e dimanche après la Pentecôte, tous les saints de la terre russe");
    return t(`Неделя ${n}-я по Пятидесятнице`, `${n}e dimanche après la Pentecôte`);
  }

  const special = {
    beforeExaltation: { title: t("Неделя пред Воздвижением", "Dimanche avant l’Exaltation de la Croix"), readings: { apostle: "Gal 6:11-18", gospel: "Jn 3:13-17" } },
    afterExaltation: { title: t("Неделя по Воздвижении", "Dimanche après l’Exaltation de la Croix"), readings: { apostle: "Gal 2:16-20", gospel: "Mk 8:34-9:1" } },
    forefathers: { title: t("Неделя святых праотец", "Dimanche des saints Ancêtres du Christ"), readings: { apostle: "Col 3:4-11", gospel: "Lk 14:16-24" } },
    fathers: { title: t("Неделя святых отец, пред Рождеством Христовым", "Dimanche des saints Pères, avant la Nativité"), readings: { apostle: "Heb 11:9-10,17-23,32-40", gospel: "Mt 1:1-25" } },
    afterNativity: { title: t("Неделя по Рождестве Христовом", "Dimanche après la Nativité du Christ"), readings: { apostle: "Gal 1:11-19", gospel: "Mt 2:13-23" } },
    beforeTheophany: { title: t("Неделя пред Богоявлением", "Dimanche avant la Théophanie"), readings: { apostle: "2Tim 4:5-8", gospel: "Mk 1:1-8" } },
    afterTheophany: { title: t("Неделя по Богоявлении", "Dimanche après la Théophanie"), readings: { apostle: "Eph 4:7-13", gospel: "Mt 4:12-17" } },
  };

  // Ключ — число дней от Пасхи.
  const movable = {
    "-77": { title: t("Неделя о Закхее", "Dimanche de Zachée"), readings: { apostle: "1Tim 4:9-15", gospel: "Lk 19:1-10" }, complete: true },
    "-70": { title: t("Неделя о мытаре и фарисее", "Dimanche du publicain et du pharisien"), readings: { apostle: "2Tim 3:10-15", gospel: "Lk 18:10-14" } },
    "-63": { title: t("Неделя о блудном сыне", "Dimanche du fils prodigue"), readings: { apostle: "1Cor 6:12-20", gospel: "Lk 15:11-32" } },
    "-56": { title: t("Неделя мясопустная, о Страшном Суде", "Dimanche du Jugement dernier"), readings: { apostle: "1Cor 8:8-9:2", gospel: "Mt 25:31-46" } },
    "-49": { title: t("Неделя сыропустная. Прощеное воскресенье", "Dimanche du pardon"), readings: { apostle: "Rom 13:11-14:4", gospel: "Mt 6:14-21" } },
    "-42": { title: t("Неделя 1-я Великого поста. Торжество Православия", "1er dimanche du Carême, Triomphe de l’Orthodoxie"), readings: { apostle: "Heb 11:24-26,32-12:2", gospel: "Jn 1:43-51" } },
    "-35": { title: t("Неделя 2-я Великого поста, свт. Григория Паламы", "2e dimanche du Carême, saint Grégoire Palamas"), readings: { apostle: "Heb 1:10-2:3", gospel: "Mk 2:1-12" } },
    "-28": { title: t("Неделя 3-я Великого поста, Крестопоклонная", "3e dimanche du Carême, Vénération de la Croix"), readings: { apostle: "Heb 4:14-5:6", gospel: "Mk 8:34-9:1" }, trisagion: "cross" },
    "-21": { title: t("Неделя 4-я Великого поста, прп. Иоанна Лествичника", "4e dimanche du Carême, saint Jean Climaque"), readings: { apostle: "Heb 6:13-20", gospel: "Mk 9:17-31" } },
    "-14": { title: t("Неделя 5-я Великого поста, прп. Марии Египетской", "5e dimanche du Carême, sainte Marie l’Égyptienne"), readings: { apostle: "Heb 9:11-14", gospel: "Mk 10:32-45" } },
    "-7": { title: t("Вход Господень в Иерусалим", "Entrée du Seigneur à Jérusalem (Rameaux)"), readings: { apostle: "Phil 4:4-9", gospel: "Jn 12:1-18" }, useTone: false },
    "0": { title: t("Светлое Христово Воскресение. Пасха", "La sainte Pâque, Résurrection du Christ"), readings: { apostle: "Acts 1:1-8", gospel: "Jn 1:1-17" }, useTone: false, trisagion: "baptized" },
    "7": { title: t("Неделя 2-я по Пасхе, апостола Фомы", "Dimanche de saint Thomas"), readings: { apostle: "Acts 5:12-20", gospel: "Jn 20:19-31" } },
    "14": { title: t("Неделя 3-я по Пасхе, святых жен-мироносиц", "Dimanche des saintes Myrrhophores"), readings: { apostle: "Acts 6:1-7", gospel: "Mk 15:43-16:8" } },
    "21": { title: t("Неделя 4-я по Пасхе, о расслабленном", "Dimanche du Paralytique"), readings: { apostle: "Acts 9:32-42", gospel: "Jn 5:1-15" } },
    "28": { title: t("Неделя 5-я по Пасхе, о самаряныне", "Dimanche de la Samaritaine"), readings: { apostle: "Acts 11:19-26,29-30", gospel: "Jn 4:5-42" } },
    "35": { title: t("Неделя 6-я по Пасхе, о слепом", "Dimanche de l’Aveugle-né"), readings: { apostle: "Acts 16:16-34", gospel: "Jn 9:1-38" } },
    "42": { title: t("Неделя 7-я по Пасхе, святых отец I Вселенского Собора", "Dimanche des Pères du Ier Concile œcuménique"), readings: { apostle: "Acts 20:16-18,28-36", gospel: "Jn 17:1-13" } },
    "49": { title: t("День Святой Троицы. Пятидесятница", "Sainte Pentecôte"), readings: { apostle: "Acts 2:1-11", gospel: "Jn 7:37-52;8:12" }, useTone: false, trisagion: "baptized" },
  };

  // Ключ — месяц*100 + число (новый стиль).
  const fixedFeasts = {
    908: { title: t("Рождество Пресвятой Богородицы", "Nativité de la Mère de Dieu"), readings: { apostle: "Phil 2:5-11", gospel: "Lk 10:38-42;11:27-28" } },
    914: { title: t("Воздвижение Честнаго и Животворящаго Креста Господня", "Exaltation de la précieuse et vivifiante Croix"), readings: { apostle: "1Cor 1:18-24", gospel: "Jn 19:6-11,13-20,25-28,30-35" }, lordsFeast: true, trisagion: "cross" },
    1121: { title: t("Введение во храм Пресвятой Богородицы", "Entrée de la Mère de Dieu au Temple"), readings: { apostle: "Heb 9:1-7", gospel: "Lk 10:38-42;11:27-28" } },
    1225: { title: t("Рождество Господа Бога и Спаса нашего Иисуса Христа", "Nativité de notre Seigneur Jésus-Christ"), readings: { apostle: "Gal 4:4-7", gospel: "Mt 2:1-12" }, lordsFeast: true, trisagion: "baptized" },
    106: { title: t("Святое Богоявление. Крещение Господне", "Sainte Théophanie, Baptême du Seigneur"), readings: { apostle: "Tit 2:11-14;3:4-7", gospel: "Mt 3:13-17" }, lordsFeast: true, trisagion: "baptized" },
    202: { title: t("Сретение Господне", "Rencontre du Seigneur (Présentation au Temple)"), readings: { apostle: "Heb 7:7-17", gospel: "Lk 2:22-40" }, lordsFeast: true },
    325: { title: t("Благовещение Пресвятой Богородицы", "Annonciation de la Mère de Dieu"), readings: { apostle: "Heb 2:11-18", gospel: "Lk 1:24-38" } },
    806: { title: t("Преображение Господне", "Transfiguration du Seigneur"), readings: { apostle: "2Pet 1:10-19", gospel: "Mt 17:1-9" }, lordsFeast: true },
    815: { title: t("Успение Пресвятой Богородицы", "Dormition de la Mère de Dieu"), readings: { apostle: "Phil 2:5-11", gospel: "Lk 10:38-42;11:27-28" } },
  };

  window.READINGS = { BOOKS, parse, label, afterPentecost, ordinaryTitle, special, movable, fixedFeasts };
})();

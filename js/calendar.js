// Церковный календарь: новоюлианский стиль для неподвижных праздников,
// Пасха — по юлианской пасхалии (общая для всего православного мира).
(function () {
  const DAY = 86400000;

  function utc(y, m, d) {
    return new Date(Date.UTC(y, m - 1, d));
  }

  function addDays(date, n) {
    return new Date(date.getTime() + n * DAY);
  }

  function diffDays(a, b) {
    return Math.round((a - b) / DAY);
  }

  function iso(date) {
    return date.toISOString().slice(0, 10);
  }

  function parseIso(s) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || "");
    return m ? utc(+m[1], +m[2], +m[3]) : null;
  }

  // Юлианская пасхалия (Гаусс) + 13 дней разницы: верно для 1900–2099 гг.
  function pascha(year) {
    const a = year % 4, b = year % 7, c = year % 19;
    const d = (19 * c + 15) % 30;
    const e = (2 * a + 4 * b - d + 34) % 7;
    const month = Math.floor((d + e + 114) / 31);
    const day = ((d + e + 114) % 31) + 1;
    return addDays(utc(year, month, day), 13);
  }

  function nextSunday(from) {
    const d = utc(from.getFullYear(), from.getMonth() + 1, from.getDate());
    return addDays(d, (7 - d.getUTCDay()) % 7);
  }

  function md(date) {
    return (date.getUTCMonth() + 1) * 100 + date.getUTCDate();
  }

  function between(date, from, to) {
    const v = md(date);
    return v >= from && v <= to;
  }

  const R = () => window.READINGS;

  // Воскресенья, привязанные к неподвижным праздникам.
  function specialSunday(date) {
    const S = R().special;
    if (between(date, 907, 913)) return S.beforeExaltation;
    if (between(date, 915, 921)) return S.afterExaltation;
    if (between(date, 1211, 1217)) return S.forefathers;
    if (between(date, 1218, 1224)) return S.fathers;
    if (between(date, 1226, 1231)) return S.afterNativity;
    if (between(date, 102, 105)) return S.beforeTheophany;
    if (between(date, 107, 113)) return S.afterTheophany;
    return null;
  }

  function greatFeast(date) {
    return R().fixedFeasts[md(date)] || null;
  }

  function sundayAfterExaltation(year) {
    let d = utc(year, 9, 15);
    while (d.getUTCDay() !== 0) d = addDays(d, 1);
    return d;
  }

  function toneFor(date) {
    let p = pascha(date.getUTCFullYear());
    if (date < p) p = pascha(date.getUTCFullYear() - 1);
    const w = Math.floor(diffDays(date, p) / 7);
    if (w < 1) return null;
    return ((w - 1) % 8) + 1;
  }

  function describe(date, options) {
    options = options || {};
    const year = date.getUTCFullYear();
    const info = {
      date,
      iso: iso(date),
      tone: null,
      title: null,
      readings: null,
      complete: true,
      trisagion: "normal",
      useTone: true,
      notes: [],
    };

    let p = pascha(year);
    let d = diffDays(date, p);

    if (d >= -77 && d <= 56) {
      const entry = R().movable[d];
      if (entry) {
        info.title = entry.title;
        info.readings = entry.readings;
        info.complete = !!entry.complete;
        info.useTone = entry.useTone !== false;
        if (entry.trisagion) info.trisagion = entry.trisagion;
        info.tone = info.useTone ? toneFor(date) : null;
      }
    }

    if (!info.title) {
      if (d < -77) {
        p = pascha(year - 1);
        d = diffDays(date, p);
      }
      const n = Math.floor((d - 49) / 7);
      info.n = n;
      info.tone = toneFor(date);

      let apostleN = n, gospelN = n;
      if (options.lukanJump) {
        const exYear = date.getUTCMonth() >= 8 ? year : year - 1;
        const ex = sundayAfterExaltation(exYear);
        const weeks = Math.floor(diffDays(date, ex) / 7);
        if (weeks >= 1 && weeks <= 14) gospelN = 17 + weeks;
      }

      const table = R().afterPentecost;
      if (apostleN > 31 || gospelN > 31) {
        info.notes.push({
          cs: "Отступка: рядовых чтений не хватает — уточните чтения у настоятеля.",
          fr: "Lectures de remplacement (« otstoupka ») — à vérifier auprès du recteur.",
        });
        info.complete = false;
        if (apostleN > 31) apostleN = 17;
        if (gospelN > 31) gospelN = 17;
      }

      info.title = R().ordinaryTitle(n);
      info.readings = {
        apostle: table[apostleN].apostle,
        gospel: table[gospelN].gospel,
      };

      const special = specialSunday(date);
      if (special) {
        info.title = special.title;
        info.readings = special.readings;
        info.subtitle = R().ordinaryTitle(n);
        info.notes = [];
        // У этих воскресений есть свои тропари (праотцев, отцев, попразднства).
        info.complete = !!special.complete;
      }
    }

    info.tone = info.useTone ? info.tone : null;

    const feast = greatFeast(date);
    if (feast) {
      info.feast = feast;
      info.subtitle = info.title;
      info.title = feast.title;
      info.readings = feast.readings;
      info.complete = false;
      if (feast.trisagion) info.trisagion = feast.trisagion;
      if (feast.lordsFeast) info.useTone = false;
    }

    info.pascha = iso(pascha(year));
    return info;
  }

  window.ChurchCalendar = {
    pascha, nextSunday, describe, iso, parseIso, addDays, toneFor,
  };
})();

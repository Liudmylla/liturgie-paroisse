(function () {
  const Cal = window.ChurchCalendar;
  const Rd = window.READINGS;
  const OCT = window.OCTOECHOS;
  const COMMON = window.COMMON_HYMNS;
  const CFG = window.PARISH;

  const ROLE = {
    deacon: { cs: "Диакон", fr: "Diacre" },
    priest: { cs: "Священник", fr: "Prêtre" },
    choir: { cs: "Хор", fr: "Chœur" },
    reader: { cs: "Чтец", fr: "Lecteur" },
  };

  const t = (cs, fr) => ({ cs, fr });
  const item = (kind, cs, fr, extra) => Object.assign({ kind, cs, fr }, extra || {});
  const variable = (kind, cs, fr, extra) => item(kind, cs, fr, Object.assign({ variable: true }, extra || {}));
  const label = (cs, fr) => item("label", cs, fr, { variable: true });

  // ---------- Настройки отображения ----------
  const prefs = Object.assign(
    { lang: "both", size: 18, theme: "light" },
    JSON.parse(localStorage.getItem("liturgie-prefs") || "{}")
  );
  function savePrefs() {
    localStorage.setItem("liturgie-prefs", JSON.stringify(prefs));
    applyPrefs();
  }
  function applyPrefs() {
    document.body.dataset.lang = prefs.lang;
    document.body.dataset.theme = prefs.theme;
    document.documentElement.style.setProperty("--text-size", prefs.size + "px");
    document.querySelectorAll("[data-set-lang]").forEach((b) => {
      b.setAttribute("aria-pressed", b.dataset.setLang === prefs.lang ? "true" : "false");
    });
  }

  // ---------- Библия ----------
  const bookCache = {};
  function loadBook(lang, nr) {
    const key = lang + nr;
    if (!bookCache[key]) {
      bookCache[key] = fetch(`data/bible/${lang}/${nr}.json`).then((r) => {
        if (!r.ok) throw new Error("Не удалось загрузить книгу " + nr);
        return r.json();
      });
    }
    return bookCache[key];
  }

  async function loadReading(ref) {
    const p = Rd.parse(ref);
    const [cs, fr] = await Promise.all([loadBook("cs", p.book.nr), loadBook("fr", p.book.nr)]);
    const collect = (book) => {
      const out = [];
      for (const s of p.segments) {
        for (let ch = s.ch; ch <= s.toCh; ch++) {
          const verses = book.chapters[ch] || [];
          const from = ch === s.ch ? s.from : 1;
          const to = ch === s.toCh ? s.to : verses.length;
          for (let v = from; v <= to; v++) {
            if (verses[v - 1]) out.push({ ch, v, text: verses[v - 1] });
          }
        }
      }
      return out;
    };
    return { parsed: p, cs: collect(cs), fr: collect(fr) };
  }

  function withIncipit(verses, cs, fr) {
    const lower = (s) => s.charAt(0).toLowerCase() + s.slice(1);
    return {
      cs: verses.cs.map((x, i) => (i === 0 ? Object.assign({}, x, { text: cs + lower(x.text) }) : x)),
      fr: verses.fr.map((x, i) => (i === 0 ? Object.assign({}, x, { text: fr + lower(x.text) }) : x)),
    };
  }

  // ---------- Сборка изменяемых частей ----------
  function fill(text) {
    return text
      .replace(/\{patriarch_prep\}/g, CFG.patriarch.cs_prep)
      .replace(/\{patriarch_gen\}/g, CFG.patriarch.cs_gen)
      .replace(/\{patriarch_fr\}/g, CFG.patriarch.fr)
      .replace(/\{bishop_prep\}/g, CFG.bishop.cs_prep)
      .replace(/\{bishop_gen\}/g, CFG.bishop.cs_gen)
      .replace(/\{bishop_fr\}/g, CFG.bishop.fr);
  }

  function toneLabel(n) {
    return t(`глас ${n}`, `ton ${n}`);
  }

  function buildTroparia(info, ov) {
    const out = [];
    if (ov.troparia) {
      ov.troparia.forEach((x) => {
        if (x.label) out.push(label(x.label.cs, x.label.fr));
        out.push(variable("choir", x.cs, x.fr));
      });
      return out;
    }
    const tone = info.useTone ? info.tone : null;
    const temple = CFG.temple || {};
    const saint = ov.saint;

    if (tone) {
      out.push(label(`Тропарь воскресный, глас ${tone}`, `Tropaire de la Résurrection, ton ${tone}`));
      out.push(variable("choir", OCT[tone].troparion.cs, OCT[tone].troparion.fr));
    }
    if (temple.troparion) {
      out.push(label(`Тропарь храма, глас ${temple.troparion.tone}`, `Tropaire de l’église, ton ${temple.troparion.tone}`));
      out.push(variable("choir", temple.troparion.cs, temple.troparion.fr));
    }
    if (saint && saint.troparion) {
      out.push(label(`Тропарь, глас ${saint.troparion.tone}: ${saint.name.cs}`, `Tropaire, ton ${saint.troparion.tone} : ${saint.name.fr}`));
      out.push(variable("choir", saint.troparion.cs, saint.troparion.fr));
    }

    const templeKontakion = temple.kontakion && { l: t(`Кондак храма, глас ${temple.kontakion.tone}`, `Kondakion de l’église, ton ${temple.kontakion.tone}`), x: temple.kontakion };
    const kontakia = [];
    if (tone) kontakia.push({ l: t(`Кондак воскресный, глас ${tone}`, `Kondakion de la Résurrection, ton ${tone}`), x: OCT[tone].kontakion });
    if (templeKontakion && !temple.theotokos) kontakia.push(templeKontakion);
    if (saint && saint.kontakion) kontakia.push({ l: t(`Кондак, глас ${saint.kontakion.tone}: ${saint.name.cs}`, `Kondakion, ton ${saint.kontakion.tone} : ${saint.name.fr}`), x: saint.kontakion });

    kontakia.forEach((k, i) => {
      if (i === kontakia.length - 1) out.push(variable("rubric", "Слава Отцу и Сыну и Святому Духу.", "Gloire au Père et au Fils et au Saint-Esprit."));
      out.push(label(k.l.cs, k.l.fr));
      out.push(variable("choir", k.x.cs, k.x.fr));
    });
    out.push(variable("rubric", kontakia.length ? "И ныне и присно и во веки веков. Аминь." : "Слава, и ныне.", kontakia.length ? "Maintenant et toujours et aux siècles des siècles. Amen." : "Gloire… Maintenant…"));
    const last = templeKontakion && temple.theotokos
      ? templeKontakion
      : { l: t("Кондак Богородичен, глас 6", "Kondakion de la Mère de Dieu, ton 6"), x: COMMON.theotokosKontakion };
    out.push(label(last.l.cs, last.l.fr));
    out.push(variable("choir", last.x.cs, last.x.fr));
    return out;
  }

  function buildProkeimenon(info, ov) {
    const pk = ov.prokeimenon || (info.useTone && info.tone && Object.assign({ tone: info.tone }, OCT[info.tone].prokeimenon));
    if (!pk) return [variable("rubric", "Прокимен дня — внесите в data/overrides.js.", "Prokimenon du jour — à ajouter dans data/overrides.js.", { missing: true })];
    return [
      variable("reader", `Прокимен, глас ${pk.tone}: ${pk.cs}`, `Prokimenon, ton ${pk.tone} : ${pk.fr}`),
      variable("choir", pk.cs, pk.fr),
      variable("reader", `Стих: ${pk.verse_cs}`, `Verset : ${pk.verse_fr}`),
      variable("choir", pk.cs, pk.fr),
    ];
  }

  function buildAlleluia(info, ov) {
    const al = ov.alleluia || (info.useTone && info.tone && Object.assign({ tone: info.tone }, OCT[info.tone].alleluia));
    if (!al) return [variable("rubric", "Аллилуиарий дня — внесите в data/overrides.js.", "Alléluia du jour — à ajouter dans data/overrides.js.", { missing: true })];
    const out = [
      item("deacon", "Премудрость.", "Sagesse !"),
      variable("reader", `Аллилуиа, глас ${al.tone}.`, `Alléluia, ton ${al.tone}.`),
      variable("choir", "Аллилуиа, аллилуиа, аллилуиа.", "Alléluia, alléluia, alléluia."),
    ];
    al.cs.forEach((v, i) => {
      out.push(variable("reader", "Стих: " + v, "Verset : " + al.fr[i]));
      out.push(variable("choir", "Аллилуиа, аллилуиа, аллилуиа.", "Alléluia, alléluia, alléluia."));
    });
    return out;
  }

  async function buildApostle(ref) {
    try {
      const rd = await loadReading(ref);
      const b = rd.parsed.book;
      const inc = b.acts ? ["Во дни оны, ", "En ces jours-là, "] : ["Братие, ", "Frères, "];
      return [
        variable("reader", b.cs, b.fr),
        item("deacon", "Вонмем.", "Soyons attentifs."),
        variable("reading", null, null, Object.assign({ ref }, withIncipit(rd, inc[0], inc[1]))),
        item("priest", "Мир ти.", "Paix à toi."),
        item("reader", "И духови твоему.", "Et à ton esprit."),
      ];
    } catch (e) {
      return [variable("rubric", "Не удалось загрузить текст Апостола: " + ref, "Impossible de charger l’épître : " + ref, { missing: true })];
    }
  }

  async function buildGospel(ref) {
    try {
      const rd = await loadReading(ref);
      const b = rd.parsed.book;
      return [
        variable("priest", b.cs, b.fr),
        item("choir", "Слава Тебе, Господи, слава Тебе.", "Gloire à toi, Seigneur, gloire à toi."),
        item("deacon", "Вонмем.", "Soyons attentifs."),
        variable("reading", null, null, Object.assign({ ref }, withIncipit(rd, "Во время оно, ", "En ce temps-là, "))),
        item("choir", "Слава Тебе, Господи, слава Тебе.", "Gloire à toi, Seigneur, gloire à toi."),
      ];
    } catch (e) {
      return [variable("rubric", "Не удалось загрузить текст Евангелия: " + ref, "Impossible de charger l’Évangile : " + ref, { missing: true })];
    }
  }

  function buildDismissal(info, ov) {
    const d = ov.saint && (ov.saint.dismissal || t(`святаго ${ov.saint.name.cs}`, `de ${ov.saint.name.fr}`));
    const saint = d ? t(d.cs + ", ", d.fr + ", ") : t("", "");
    if (info.useTone && info.tone) {
      return [variable("priest",
        `Воскресый из мертвых Христос, истинный Бог наш, молитвами Пречистыя Своея Матере, святых славных и всехвальных апостол, ${saint.cs}и всех святых, помилует и спасет нас, яко Благ и Человеколюбец.`,
        `Que celui qui est ressuscité des morts, le Christ notre vrai Dieu, par les prières de sa Mère très pure, des saints, glorieux et illustres apôtres, ${saint.fr}et de tous les saints, ait pitié de nous et nous sauve, car il est bon et ami des hommes.`)];
    }
    return [variable("priest",
      `Христос, истинный Бог наш, молитвами Пречистыя Своея Матере и всех святых, помилует и спасет нас, яко Благ и Человеколюбец.`,
      `Que le Christ notre vrai Dieu, par les prières de sa Mère très pure et de tous les saints, ait pitié de nous et nous sauve, car il est bon et ami des hommes.`)];
  }

  async function buildService(info, ov) {
    const readings = Object.assign({}, info.readings, ov.readings || {});
    const [apostle, gospel] = await Promise.all([buildApostle(readings.apostle), buildGospel(readings.gospel)]);
    const entrance = info.useTone
      ? [variable("choir", COMMON.sundayEntrance.cs, COMMON.sundayEntrance.fr)]
      : [variable("rubric", "Входной стих праздника — внесите в data/overrides.js.", "Verset d’entrée de la fête — à ajouter dans data/overrides.js.", { missing: true })];
    const zad = ov.zadostoinik || COMMON.axion;
    const koin = ov.koinonikon || COMMON.sundayKoinonikon;
    const tri = COMMON.trisagion[info.trisagion] || COMMON.trisagion.normal;

    const slots = {
      entrance,
      troparia: buildTroparia(info, ov),
      trisagion: [variable("choir", tri.cs, tri.fr)],
      prokeimenon: buildProkeimenon(info, ov),
      apostle,
      alleluia: buildAlleluia(info, ov),
      gospel,
      zadostoinik: [variable("choir", zad.cs, zad.fr)],
      koinonikon: [label("Причастен", "Chant de communion"), variable("choir", koin.cs, koin.fr)],
      dismissal: buildDismissal(info, ov),
    };

    const out = [];
    for (const x of window.LITURGY) {
      if (x.kind === "slot") out.push(...(slots[x.name] || []));
      else out.push(Object.assign({}, x, { cs: x.cs && fill(x.cs), fr: x.fr && fill(x.fr) }));
    }
    return { items: out, readings };
  }

  // ---------- Отображение ----------
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const lines = (s) => esc(s).replace(/\n/g, "<br>");

  function cell(lang, x) {
    if (x.kind === "reading") {
      const verses = x[lang].map((v) => `<sup>${v.v}</sup>${esc(v.text)}`).join(" ");
      return `<div class="cell ${lang}" lang="${lang === "cs" ? "cu" : "fr"}"><p class="reading">${verses}</p></div>`;
    }
    const role = ROLE[x.kind] ? `<span class="role">${ROLE[x.kind][lang]}</span>` : "";
    return `<div class="cell ${lang}" lang="${lang === "cs" ? "cu" : "fr"}">${role}<p>${lines(x[lang])}</p></div>`;
  }

  function renderItems(items) {
    return items.map((x) => {
      if (x.kind === "heading") {
        return `<h2 class="row heading" id="${x.id}"><span class="cs">${esc(x.cs)}</span><span class="fr">${esc(x.fr)}</span></h2>`;
      }
      const cls = ["row", x.kind, x.variable ? "variable" : "", x.missing ? "missing" : ""].join(" ");
      return `<div class="${cls}">${cell("cs", x)}${cell("fr", x)}</div>`;
    }).join("");
  }

  function fmtDate(date, locale) {
    return new Intl.DateTimeFormat(locale, { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(date);
  }

  function renderHeader(info, ov, readings) {
    const tone = info.useTone && info.tone ? toneLabel(info.tone) : null;
    const sub = info.subtitle ? `<p class="subtitle"><span class="cs">${esc(info.subtitle.cs)}</span><span class="fr">${esc(info.subtitle.fr)}</span></p>` : "";
    const saint = ov.saint ? `<p class="subtitle"><span class="cs">${esc(ov.saint.name.cs)}</span><span class="fr">${esc(ov.saint.name.fr)}</span></p>` : "";
    const notes = [...info.notes, ov.note].filter(Boolean).map((n) => `<p class="note"><span class="cs">${esc(n.cs)}</span><span class="fr">${esc(n.fr)}</span></p>`).join("");
    const complete = ov.complete !== undefined ? ov.complete : info.complete;
    const warn = complete ? "" : `<p class="warning"><span class="cs">Особый день: тропари, кондаки и другие изменяемые песнопения этого дня ещё не внесены полностью. Регенту — проверить по Минее/Триоди и дополнить в data/overrides.js.</span><span class="fr">Jour particulier : les chants propres de ce jour ne sont pas encore tous saisis. À vérifier et compléter dans data/overrides.js.</span></p>`;
    const refs = `<p class="refs"><span class="cs">Апостол: ${esc(Rd.label(readings.apostle, "cs"))} · Евангелие: ${esc(Rd.label(readings.gospel, "cs"))}</span><span class="fr">Épître : ${esc(Rd.label(readings.apostle, "fr"))} · Évangile : ${esc(Rd.label(readings.gospel, "fr"))}</span></p>`;
    return `
      <p class="parish"><a href="${esc(CFG.website || "#")}"><span class="cs">${esc(CFG.name.cs)}</span><span class="fr">${esc(CFG.name.fr)}</span></a></p>
      <p class="date"><span class="cs">${esc(fmtDate(info.date, "ru-RU"))}</span><span class="fr">${esc(fmtDate(info.date, "fr-FR"))}</span></p>
      <h1><span class="cs">${esc(info.title.cs)}${tone ? ", " + tone.cs : ""}</span><span class="fr">${esc(info.title.fr)}${tone ? ", " + tone.fr : ""}</span></h1>
      ${sub}${saint}${refs}${warn}${notes}`;
  }

  function currentDate() {
    const q = new URLSearchParams(location.search).get("date");
    const d = Cal.parseIso(q);
    if (d) return Cal.addDays(d, (7 - d.getUTCDay()) % 7);
    return Cal.nextSunday(new Date());
  }

  function goTo(date) {
    const url = new URL(location.href);
    url.searchParams.set("date", Cal.iso(date));
    history.pushState(null, "", url);
    render();
  }

  async function render() {
    const date = currentDate();
    const info = Cal.describe(date, { lukanJump: CFG.lukanJump });
    const ov = (window.OVERRIDES || {})[info.iso] || {};
    document.getElementById("date-input").value = info.iso;
    document.getElementById("service").innerHTML = `<p class="loading">Загрузка… / Chargement…</p>`;
    const { items, readings } = await buildService(info, ov);
    document.getElementById("header").innerHTML = renderHeader(info, ov, readings);
    document.getElementById("service").innerHTML = renderItems(items);
    document.title = `${info.title.cs} — ${info.iso}`;
  }

  function bind() {
    document.querySelectorAll("[data-set-lang]").forEach((b) => b.addEventListener("click", () => { prefs.lang = b.dataset.setLang; savePrefs(); }));
    document.getElementById("smaller").addEventListener("click", () => { prefs.size = Math.max(13, prefs.size - 2); savePrefs(); });
    document.getElementById("bigger").addEventListener("click", () => { prefs.size = Math.min(32, prefs.size + 2); savePrefs(); });
    document.getElementById("theme").addEventListener("click", () => { prefs.theme = prefs.theme === "dark" ? "light" : "dark"; savePrefs(); });
    document.getElementById("print").addEventListener("click", () => window.print());
    document.getElementById("prev").addEventListener("click", () => goTo(Cal.addDays(currentDate(), -7)));
    document.getElementById("next").addEventListener("click", () => goTo(Cal.addDays(currentDate(), 7)));
    document.getElementById("today").addEventListener("click", () => goTo(Cal.nextSunday(new Date())));
    document.getElementById("date-input").addEventListener("change", (e) => {
      const d = Cal.parseIso(e.target.value);
      if (d) goTo(d);
    });
    window.addEventListener("popstate", render);
  }

  applyPrefs();
  bind();
  render();
})();

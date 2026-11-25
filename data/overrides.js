// Добавки на конкретные воскресенья: тропарь святого, праздника, объявления.
// Ключ — дата "ГГГГ-ММ-ДД". Всё необязательно.
//
// Пример:
// "2026-12-06": {
//   saint: {
//     name: { cs: "Свт. Николая, архиеп. Мир Ликийских", fr: "Saint Nicolas, archevêque de Myre" },
//     troparion: { tone: 4, cs: "Правило веры и образ кротости...", fr: "Règle de foi, image de douceur..." },
//     kontakion: { tone: 3, cs: "В Мирех, святе...", fr: "À Myre, ô saint..." },
//   },
//   // Заменить песнопения целиком (для праздников и Триоди):
//   troparia: [ { label: { cs: "Тропарь праздника, глас 1", fr: "Tropaire de la fête, ton 1" }, cs: "...", fr: "..." } ],
//   prokeimenon: { tone: 4, cs: "...", verse_cs: "...", fr: "...", verse_fr: "..." },
//   alleluia: { tone: 1, cs: ["..."], fr: ["..."] },
//   zadostoinik: { cs: "...", fr: "..." },
//   koinonikon: { cs: "...", fr: "..." },
//   readings: { apostle: "Heb 13:17-21", gospel: "Lk 6:17-23" },
//   complete: true,
//   note: { cs: "После литургии — молебен.", fr: "Après la Liturgie : office d’intercession." },
// },
window.OVERRIDES = {
  "2026-11-29": {
    saint: {
      name: { cs: "Вмц. Екатерины (перенесено с 25 ноября)", fr: "Sainte grande-martyre Catherine (reportée du 25 novembre)" },
      dismissal: { cs: "святыя великомученицы Екатерины", fr: "de la sainte grande-martyre Catherine" },
      troparion: {
        tone: 4,
        cs: "Добродетельми, яко лучами солнца, неверных мудрования просветила еси, и яко луна всесветлая, во нощи ходящим неверия тьму отгнала еси, и царицу укрепила еси, обличила же еси и мучителя, Богоневестная, блаженная Екатерино; и ко небесному чертогу желательно потекла еси ко Жениху прекрасному Христу, и от Него венцем царским увязеся; Емуже с ангелы предстоящи, моли о нас, творящих честную память твою.",
        fr: "Par tes vertus, comme par les rayons du soleil, tu as éclairé l’esprit des incroyants, et, comme une lune resplendissante, tu as chassé les ténèbres de l’incroyance pour ceux qui marchaient dans la nuit ; tu as fortifié l’impératrice et confondu le tyran, ô bienheureuse Catherine, épouse de Dieu ; tu as couru avec ardeur vers la chambre nuptiale céleste, vers le Christ, le bel Époux, qui t’a couronnée d’un diadème royal ; te tenant devant lui avec les anges, prie pour nous qui célébrons ta vénérable mémoire.",
      },
      kontakion: {
        tone: 2,
        cs: "Лик, боголюбцы, ныне честный составим, всемудрую воспевающе Екатерину: та бо на ристалищи Христа проповеда, и змия попра, риторов разум отвергши.",
        fr: "Amis de Dieu, formons maintenant un chœur vénérable pour chanter la très sage Catherine : dans l’arène, elle a prêché le Christ et terrassé le serpent, réduisant à néant la science des rhéteurs.",
      },
    },
  },
  "2026-12-06": {
    saint: {
      name: { cs: "Свт. Николая, архиеп. Мир Ликийских, чудотворца", fr: "Saint Nicolas, archevêque de Myre en Lycie, thaumaturge" },
      dismissal: { cs: "иже во святых отца нашего Николая, архиепископа Мир Ликийских, чудотворца", fr: "de notre père parmi les saints Nicolas, archevêque de Myre en Lycie, le thaumaturge" },
      troparion: {
        tone: 4,
        cs: "Правило веры и образ кротости, воздержания учителя яви тя стаду твоему яже вещей истина; сего ради стяжал еси смирением высокая, нищетою богатая. Отче священноначальниче Николае, моли Христа Бога спастися душам нашим.",
        fr: "La vérité des choses t’a manifesté à ton troupeau comme règle de foi, image de douceur et maître de tempérance ; c’est pourquoi tu as acquis par l’humilité les hauteurs, et par la pauvreté les richesses. Père et pontife Nicolas, prie le Christ Dieu de sauver nos âmes.",
      },
      kontakion: {
        tone: 3,
        cs: "В Мирех, святе, священнодействитель показался еси: Христово бо, преподобне, Евангелие исполнив, положил еси душу твою о людех твоих и спасл еси неповинныя от смерти; сего ради освятился еси, яко великий таинник Божия благодати.",
        fr: "À Myre, ô saint, tu t’es montré ministre des choses sacrées ; accomplissant l’Évangile du Christ, ô vénérable, tu as donné ta vie pour ton peuple et sauvé de la mort les innocents ; c’est pourquoi tu as été sanctifié comme grand initié de la grâce de Dieu.",
      },
    },
  },
};

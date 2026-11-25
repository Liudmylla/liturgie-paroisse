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
window.OVERRIDES = {};

// Настройки прихода. Здесь меняют названия, имена иерархов и тропарь храма.
window.PARISH = {
  name: { cs: "Православный приход", fr: "Paroisse orthodoxe" },

  // Постоянный адрес сайта: на него ведёт QR-код (см. scripts/make-qr.mjs).
  siteUrl: "https://liudmylla.github.io/liturgie-paroisse/",

  // Имена для ектений и многолетия (падежи для славянского текста).
  patriarch: { cs_prep: "Варфоломее", cs_gen: "Варфоломея", fr: "Bartholomée" },
  bishop: {
    cs_prep: "Высокопреосвященнейшем митрополите нашем Димитрии",
    cs_gen: "Высокопреосвященнейшаго митрополита нашего Димитрия",
    fr: "notre Métropolite Dimitrios",
  },

  // Тропарь и кондак храма. null — не показывать.
  temple: {
    troparion: null, // { tone: 4, cs: "...", fr: "..." }
    kontakion: null,
  },

  // Греческая «лукинская преступка» в евангельских чтениях осенью.
  // В русской практике обычно не соблюдается.
  lukanJump: false,
};

// Настройки прихода. Здесь меняют названия, имена иерархов и тропарь храма.
window.PARISH = {
  name: {
    cs: "Храм Покрова Пресвятой Богородицы и святого Александра Невского · Биарриц",
    fr: "Église de la Protection de la Mère de Dieu et Saint-Alexandre-Nevsky · Biarritz",
  },
  website: "https://www.eglise-orthodoxe-biarritz.com/",

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
  // theotokos: true — храм Богородичный: кондак храма поётся на «И ныне» вместо «Предстательство христиан».
  temple: {
    theotokos: true,
    troparion: {
      tone: 4,
      cs: "Днесь благовернии людие светло празднуем, осеняеми Твоим, Богомати, пришествием, и к Твоему взирающе пречистому образу, умиленно глаголем: покрый нас честным Твоим покровом и избави нас от всякаго зла, молящи Сына Твоего, Христа Бога нашего, спасти души наша.",
      fr: "Aujourd’hui, peuple fidèle, nous célébrons avec éclat la fête, ombragés par ta venue, ô Mère de Dieu ; et, contemplant ta très pure icône, nous te disons avec componction : Couvre-nous de ton précieux voile et délivre-nous de tout mal, en priant ton Fils, le Christ notre Dieu, de sauver nos âmes.",
    },
    kontakion: {
      tone: 3,
      cs: "Дева днесь предстоит в церкви и с лики святых невидимо за ны молится Богу: ангели со архиереи покланяются, апостоли же со пророки ликовствуют, нас бо ради молит Богородица Превечнаго Бога.",
      fr: "La Vierge se tient aujourd’hui dans l’église et, avec les chœurs des saints, prie Dieu invisiblement pour nous ; les anges se prosternent avec les évêques, les apôtres exultent avec les prophètes, car c’est pour nous que la Mère de Dieu prie le Dieu éternel.",
    },
  },

  // Греческая «лукинская преступка» в евангельских чтениях осенью.
  // В русской практике обычно не соблюдается.
  lukanJump: false,
};

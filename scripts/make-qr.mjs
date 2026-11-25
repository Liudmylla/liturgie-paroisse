// Создаёт QR-код и плакат для печати: node scripts/make-qr.mjs
// Адрес берётся из data/config.js (siteUrl).
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import vm from "node:vm";
import QRCode from "qrcode";

const sandbox = { window: {} };
vm.runInNewContext(readFileSync("data/config.js", "utf8"), sandbox);
const { siteUrl, name } = sandbox.window.PARISH;

mkdirSync("qr", { recursive: true });
const svg = await QRCode.toString(siteUrl, { type: "svg", errorCorrectionLevel: "M", margin: 1, color: { dark: "#3b1513", light: "#ffffff" } });
writeFileSync("qr/qr.svg", svg);

writeFileSync("qr/affiche.html", `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<title>QR — ${name.fr}</title>
<style>
  @page { size: A4; margin: 1.5cm; }
  body { font-family: "PT Serif", Georgia, serif; text-align: center; color: #3b1513; margin: 0; }
  .sheet { max-width: 17cm; margin: 0 auto; padding-top: 1cm; }
  h1 { font-weight: normal; font-size: 30pt; margin: 0 0 0.2cm; }
  h2 { font-weight: normal; font-style: italic; font-size: 22pt; margin: 0 0 1cm; color: #6d625a; }
  .qr svg { width: 12cm; height: 12cm; }
  p { font-size: 15pt; margin: 0.3cm 0; }
  .url { font-family: system-ui, sans-serif; font-size: 11pt; color: #6d625a; margin-top: 0.6cm; }
</style>
</head>
<body>
  <div class="sheet">
    <h1>Божественная литургия</h1>
    <h2>Divine Liturgie</h2>
    <div class="qr">${svg}</div>
    <p>Наведите камеру телефона на код — откроется текст сегодняшней службы.</p>
    <p><i>Scannez ce code avec votre téléphone pour suivre l’office du jour.</i></p>
    <p class="url">${siteUrl}</p>
  </div>
</body>
</html>
`);

console.log("Готово: qr/qr.svg и qr/affiche.html →", siteUrl);

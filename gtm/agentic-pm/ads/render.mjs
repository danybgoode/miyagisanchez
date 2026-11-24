// Renders every <section class="ad"> in an ads HTML file to <out>/<id>.png at 2x
// (600px tiles → 1200×1200, wide tiles → 1200×628).
// Usage: PW=/path/to/node_modules/playwright node render.mjs [ads.html] [png-dir]
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PW || 'playwright');
const html = path.resolve(here, process.argv[2] || 'ads.html');
const out = path.resolve(here, process.argv[3] || 'png');

const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 2, viewport: { width: 1400, height: 1000 } });
await page.goto(pathToFileURL(html).href, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
const ids = await page.$$eval('section.ad', (els) => els.map((e) => e.id));
for (const id of ids) {
  await page.locator(`#${id}`).screenshot({ path: path.join(out, `${id}.png`) });
  console.log('rendered', id);
}
await browser.close();

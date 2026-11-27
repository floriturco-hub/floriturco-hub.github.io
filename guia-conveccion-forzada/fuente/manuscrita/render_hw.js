const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const [,, inp, out, png] = process.argv;
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 794, height: 1123 } });
  await p.goto('file://' + path.resolve(inp));
  await p.waitForFunction(() => window.__done === true, null, { timeout: 60000 });
  const over = await p.evaluate(() => window.__over);
  if (over.length) console.log('OVERFLOW:', over.join(' | '));
  const fx = await p.evaluate(() => window.__fixed || []); console.log('tall lines grown:', fx.length);
  const hz = await p.evaluate(() => window.__hz || []); if (hz.length) { console.log('HORIZONTAL OVERFLOW:'); hz.forEach(x => console.log('  ' + x)); }
  if (png) { await p.emulateMedia({ media: 'print' }); }
  await p.pdf({ path: out, preferCSSPageSize: true, printBackground: true });
  await b.close();
  console.log('pdf ok');
})();

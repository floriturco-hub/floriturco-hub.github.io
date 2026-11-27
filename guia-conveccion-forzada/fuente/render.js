const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const [,, inp, out] = process.argv;
  const b = await chromium.launch();
  // viewport = ancho útil de la página (184 mm) para medir como en impresión
  const p = await b.newPage({ viewport: { width: 695, height: 1000 } });
  await p.emulateMedia({ media: 'print' });
  await p.goto('file://' + path.resolve(inp));
  await p.waitForFunction(() => window.__done === true, null, { timeout: 60000 });
  const errs = await p.evaluate(() => window.__errs);
  if (errs.length) { console.log('KATEX ERRORS:'); errs.forEach(e => console.log('  ' + e)); }
  const report = await p.evaluate(() => {
    const fixed = [];
    for (let pass = 0; pass < 3; pass++) {
      document.querySelectorAll('.chapter .katex-display').forEach(d => {
        const html = d.querySelector('.katex-html');
        if (!html) return;
        const avail = d.clientWidth, need = html.scrollWidth;
        if (need > avail + 0.5 && avail > 0) {
          const cur = parseFloat(d.style.fontSize || '100');
          const nf = cur * (avail / need) * 0.985;
          d.style.fontSize = nf + '%';
          if (pass === 0) fixed.push(Math.round(nf) + '% :: ' + d.textContent.slice(0, 50));
        }
      });
    }
    // detectar desbordes restantes (fuera de la portada)
    const over = [];
    document.querySelectorAll('.chapter *').forEach(e => {
      if (e.closest('.katex')) return;
      if (e.scrollWidth > e.clientWidth + 2 && getComputedStyle(e).overflow === 'visible' && e.clientWidth > 0) {
        over.push(e.tagName + '.' + e.className + ' ' + e.scrollWidth + '>' + e.clientWidth + ' :: ' + e.textContent.slice(0, 40));
      }
    });
    return { fixed, over: over.slice(0, 25), nover: over.length };
  });
  console.log('formulas reducidas:', report.fixed.length);
  report.fixed.forEach(f => console.log('  ' + f));
  console.log('desbordes:', report.nover); report.over.forEach(o => console.log('  ' + o));
  await p.pdf({ path: out, preferCSSPageSize: true, printBackground: true, outline: true, tagged: true });
  await b.close();
  console.log('pdf ok');
})();

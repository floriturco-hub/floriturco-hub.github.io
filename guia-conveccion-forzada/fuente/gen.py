# -*- coding: utf-8 -*-
import re, json, sys, os
import content_a as A, content_b as B, content_c as C, content_d as D

pages = {}
if os.path.exists('pages.json'):
    pages = json.load(open('pages.json'))

MACROS = {
    "\\RE": "\\mathrm{Re}", "\\NU": "\\mathrm{Nu}", "\\PR": "\\mathrm{Pr}",
    "\\Qd": "\\dot{Q}", "\\md": "\\dot{m}", "\\Vd": "\\dot{V}", "\\qs": "\\dot{q}_s",
    "\\un": "\\,\\mathrm{#1}",
    "\\Tin": "T_{\\mathrm{in}}", "\\Tout": "T_{\\mathrm{out}}", "\\Vp": "V_{\\mathrm{prom}}", "\\DTln": "\\Delta T_{\\mathrm{ln}}",
}

def sect(color, sid, html):
    return f'<section class="chapter {color}" id="{sid}">{html}</section>'

body = A.cover(pages)
body += sect('gen', 's1', A.ideas())
body += sect('gen', 's2', A.mapa())
body += sect('gen', 's3', A.metodo())
body += sect('ext', 's4', B.externa())
body += sect('int', 's5', B.interna())
body += sect('int', 's6', C.clase())
body += sect('gen', 's7', D.extras())
body += sect('gen', 's9', D.errores())
body += sect('gen', 's10', D.tablas())
body += sect('gen', 's11', D.resumen())

def fix_math(m):
    s = m.group(0)
    return re.sub(r'(\d)\.(\d)', r'\1{,}\2', s)

body = re.sub(r'\\\((.+?)\\\)', fix_math, body, flags=re.S)
body = re.sub(r'\\\[(.+?)\\\]', fix_math, body, flags=re.S)

html = f'''<!doctype html>
<html lang="es"><head><meta charset="utf-8">
<title>Convección forzada · Guía de estudio</title>
<link rel="stylesheet" href="node_modules/katex/dist/katex.min.css">
<link rel="stylesheet" href="styles.css">
<script src="node_modules/katex/dist/katex.min.js"></script>
<script src="node_modules/katex/dist/contrib/auto-render.min.js"></script>
</head><body>
{body}
<script>
document.fonts.ready.then(function() {{
  renderMathInElement(document.body, {{
    delimiters: [{{left: "\\\\[", right: "\\\\]", display: true}}, {{left: "\\\\(", right: "\\\\)", display: false}}],
    macros: {json.dumps(MACROS)},
    throwOnError: false, strict: "ignore"
  }});
  var errs = document.querySelectorAll('.katex-error');
  window.__errs = Array.from(errs).map(function(e) {{ return e.getAttribute('title') + ' :: ' + e.textContent; }});
  setTimeout(function() {{ window.__done = true; }}, 300);
}});
</script>
</body></html>'''
open('guia.html', 'w').write(html)
print('ok', len(html))

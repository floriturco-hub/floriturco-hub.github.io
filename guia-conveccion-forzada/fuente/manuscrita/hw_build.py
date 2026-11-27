import os, sys, subprocess, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import hwlib as H
NM = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'node_modules', '@fontsource') + '/'
GREEK = NM + 'playpen-sans/files/playpen-sans-math-200-normal.woff2'
FONT_FILES = [(NM + 'indie-flower/files/indie-flower-latin-400-normal.woff2', 'U+0000-00FF,U+2013-2026'),
              (NM + 'indie-flower/files/indie-flower-latin-ext-400-normal.woff2', 'U+0100-024F')]
cap, asc, desc = 0.573, 994 / 1024, 500 / 1024
FS = 0.80 * H.CELL / cap
LH = H.PITCH
base = (LH - (asc + desc) * FS) / 2 + asc * FS
TOP = 0.62 * H.CELL + 2 * H.CELL - base
H.CSS = H.CSS.replace('%TOP%', f'{TOP:.3f}').replace('%FS%', f'{FS:.3f}').replace('%LH%', f'{LH:.3f}')
import hw_pages as P
pages = []
for i, fn in enumerate(P.PAGES, 1):
    H.seed(100 + i)
    pages.append(H.page(fn(), num=(i if i > 1 else None)))
html = H.document(pages, FONT_FILES, GREEK, title='Convección forzada · apuntes')
out = sys.argv[1] if len(sys.argv) > 1 else 'apuntes.html'
open(out, 'w').write(html)
print('FS', round(FS, 2), 'TOP', round(TOP, 2), 'pages', len(pages), 'bytes', len(html))

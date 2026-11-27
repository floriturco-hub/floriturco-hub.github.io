# -*- coding: utf-8 -*-
"""Motor de 'apuntes escritos a mano' al estilo Samsung Notes del usuario.

- Hoja cuadriculada (como la de sus apuntes), tintas negra/azul/salmón y resaltador amarillo.
- Texto con fuente manuscrita + variación aleatoria por letra (giro, altura, escala, espaciado).
- Mini-lenguaje de fórmulas: \\frac{}{} ^{} _{} \\sqrt{} \\dot{} letras griegas, \\cdot, \\to ...
- Primitivas SVG con trazo irregular (líneas, flechas, círculos, curvas, rayado).
"""
import math, random, html as _html

# ------------------------------------------------------------------ parámetros
CELL = 5.3            # mm, lado del cuadro (sus apuntes: 9,6 mm; aquí escalado)
PITCH = 2 * CELL      # mm, un renglón cada dos cuadros (como ella/él)
K = '#151515'         # tinta negra
B = '#0028b8'         # tinta azul (medida en sus apuntes)
S = '#ef806c'         # tinta salmón (medida en sus apuntes)
HL = 'rgba(248,235,0,.33)'  # resaltador (medido)
FONT = 'Hand'
NJ = 48               # número de variantes de jitter

rng = random.Random(7)


def seed(n):
    rng.seed(n)


def esc(s):
    return _html.escape(s, quote=False)


# ------------------------------------------------------------------ CSS de jitter
def jitter_css():
    r = random.Random(1234)
    out = []
    for i in range(NJ):
        dy = r.uniform(-0.035, 0.035)
        rot = r.uniform(-3.2, 3.2)
        sc = r.uniform(0.95, 1.05)
        mr = r.uniform(-0.012, 0.03)
        out.append(f'.j{i}{{transform:translateY({dy:.3f}em) rotate({rot:.2f}deg) scale({sc:.3f});margin-right:{mr:.3f}em}}')
    return '\n'.join(out)


SUPS = {'⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '⁻': '-'}
CIRC = {'①': 1, '②': 2, '③': 3, '④': 4, '⑤': 5, '⑥': 6, '⑦': 7, '⑧': 8, '⑨': 9, '⑩': 10}


def _check_svg():
    return ('<svg class="ck" viewBox="0 0 14 12"><path d="M1.5,6.5 L5,10 L12.5,1.5" fill="none" '
            'vector-effect="non-scaling-stroke"/></svg>')


def _box_svg():
    o = [rng.uniform(-0.6, 0.6) for _ in range(4)]
    return (f'<svg class="cb" viewBox="0 0 12 12"><path d="M1.5,{1.5+o[0]:.1f} L10.5,1.5 L{10.5+o[1]:.1f},10.5 L1.5,{10.5+o[2]:.1f} Z" fill="none" '
            f'vector-effect="non-scaling-stroke"/></svg>')


def _ch(c):
    if c == ' ':
        return ' '
    if c == '→':
        return _arrow_svg()
    if c == '✓':
        return _check_svg()
    if c == '☐':
        return _box_svg()
    if c in CIRC:
        return circ(CIRC[c])
    return f'<i class="j{rng.randrange(NJ)}">{esc(c)}</i>'


def _word(w):
    out, i = [], 0
    while i < len(w):
        if w[i] in SUPS:
            j = i
            while j < len(w) and w[j] in SUPS:
                j += 1
            out.append('<span class="sup">' + ''.join(_ch(SUPS[x]) for x in w[i:j]) + '</span>')
            i = j
        else:
            out.append(_ch(w[i])); i += 1
    return ''.join(out)


def hw(text):
    """Texto manuscrito: palabras indivisibles, letras con jitter."""
    words = text.split(' ')
    out = []
    for w in words:
        if not w:
            out.append('')
            continue
        out.append('<span class="w">' + _word(w) + '</span>')
    return ' '.join(out)


# ------------------------------------------------------------------ fórmulas
GREEK = {'nu': 'ν', 'rho': 'ρ', 'mu': 'μ', 'alpha': 'α', 'delta': 'δ', 'Delta': 'Δ', 'varepsilon': 'ε', 'epsilon': 'ε',
         'xi': 'ξ', 'pi': 'π', 'sigma': 'σ', 'eta': 'η', 'tau': 'τ', 'infty': '∞', 'approx': '≈', 'ge': '≥', 'le': '≤',
         'gg': '≫', 'll': '≪', 'pm': '±', 'propto': '∝'}
PLAIN = {'times': '×', 'deg': '°', 'minus': '−', 'lt': '<', 'gt': '>', 'percent': '%'}


class _P:
    def __init__(self, s):
        self.s, self.i = s, 0

    def peek(self):
        return self.s[self.i] if self.i < len(self.s) else ''

    def get(self):
        c = self.peek(); self.i += 1; return c

    def group(self):
        """Lee {…} o un solo token."""
        if self.peek() == '{':
            self.i += 1
            depth, start = 1, self.i
            while self.i < len(self.s) and depth:
                if self.s[self.i] == '{': depth += 1
                elif self.s[self.i] == '}': depth -= 1
                self.i += 1
            return self.s[start:self.i - 1]
        if self.peek() == '\\':
            j = self.i + 1
            while j < len(self.s) and self.s[j].isalpha(): j += 1
            tok = self.s[self.i:j]; self.i = j
            return tok
        return self.get()


def _bar_svg():
    a = rng.uniform(-0.8, 0.8); b = rng.uniform(-0.8, 0.8)
    return (f'<svg class="bar" viewBox="0 0 100 4" preserveAspectRatio="none"><path d="M1,{2+a*0.4:.2f} C35,{2+a:.2f} 65,{2+b:.2f} 99,{2+b*0.3:.2f}" '
            f'vector-effect="non-scaling-stroke"/></svg>')


def _arrow_svg():
    w = rng.uniform(-1, 1)
    return (f'<svg class="ar" viewBox="0 0 30 12"><path d="M2,{6+w*0.4:.1f} C10,{6-w:.1f} 20,{6+w*0.6:.1f} 27,6 M21,2.2 L27.5,6 L21,9.6" '
            f'fill="none" vector-effect="non-scaling-stroke"/></svg>')


def fm(src):
    """Mini-LaTeX → HTML manuscrito."""
    p = _P(src)
    out = []
    while p.i < len(p.s):
        c = p.get()
        if c == '\\':
            j = p.i
            while j < len(p.s) and p.s[j].isalpha(): j += 1
            cmd = p.s[p.i:j]; p.i = j
            if cmd and p.peek() == ' ' and cmd not in ('text',):
                p.i += 1
            if cmd == '':
                c2 = p.get()
                if c2 == ',': out.append('<span class="th"></span>')
                elif c2 == ';': out.append(' ')
                elif c2 == '\\': out.append('<br>')
                else: out.append(_ch(c2))
            elif cmd == 'frac':
                a = p.group(); b = p.group()
                out.append(f'<span class="fr"><span class="nu">{fm(a)}</span>{_bar_svg()}<span class="de">{fm(b)}</span></span>')
            elif cmd == 'sqrt':
                a = p.group()
                out.append(f'<span class="sq"><svg class="rad" viewBox="0 0 14 30" preserveAspectRatio="none"><path d="M1,17 L4,15 L8,28 L13,1" fill="none" vector-effect="non-scaling-stroke"/></svg><span class="sqi">{fm(a)}</span></span>')
            elif cmd == 'dot':
                a = p.group()
                out.append(f'<span class="dt">{fm(a)}</span>')
            elif cmd == 'text':
                out.append(hw(p.group()))
            elif cmd == 'cdot':
                out.append('<span class="md"></span>')
            elif cmd == 'to':
                out.append(_arrow_svg())
            elif cmd in GREEK:
                out.append(f'<span class="gr j{rng.randrange(NJ)}">{GREEK[cmd]}</span>')
            elif cmd in PLAIN:
                out.append(_ch(PLAIN[cmd]))
            elif cmd in ('ln', 'log', 'exp', 'max', 'min'):
                out.append(''.join(_ch(x) for x in cmd))
            elif cmd == 'c':      # color: \c{b}{...}
                col = p.group(); inner = p.group()
                out.append(f'<span class="{col}">{fm(inner)}</span>')
            else:
                out.append(esc('\\' + cmd))
        elif c == '^':
            a = p.group()
            out.append(f'<span class="sup">{fm(a)}</span>')
        elif c == '_':
            a = p.group()
            out.append(f'<span class="sub">{fm(a)}</span>')
        elif c == '{':
            p.i -= 1
            out.append(fm(p.group()))
        elif c == '~':
            out.append('&nbsp;')
        elif c == ' ':
            out.append(' ')
        else:
            out.append(_ch(c))
    return ''.join(out)


def F(src):
    """Fórmula en línea (no se parte)."""
    return f'<span class="f">{fm(src)}</span>'


# ------------------------------------------------------------------ texto enriquecido
def T(s):
    """Texto con fórmulas entre $…$ y énfasis: [b]…[/b] azul, [s]…[/s] salmón, [k]…[/k] negro,
    [h]…[/h] resaltado, [u]…[/u] subrayado a mano."""
    out = []
    i = 0
    tags = {'[b]': '<span class="b">', '[/b]': '</span>', '[s]': '<span class="s">', '[/s]': '</span>',
            '[k]': '<span class="k">', '[/k]': '</span>', '[h]': '<span class="hl">', '[/h]': '</span>',
            '[u]': '<span class="ul">', '[/u]': '</span>'}
    while i < len(s):
        if s[i] == '§':
            j = s.index('§', i + 1)
            out.append(circ(s[i + 1:j])); i = j + 1; continue
        if s[i] == '$':
            j = s.index('$', i + 1)
            out.append(F(s[i + 1:j])); i = j + 1; continue
        hit = None
        for t in tags:
            if s.startswith(t, i):
                hit = t; break
        if hit:
            out.append(tags[hit]); i += len(hit); continue
        j = i
        while j < len(s) and s[j] not in '$§' and not any(s.startswith(t, j) for t in tags):
            j += 1
        out.append(hw(s[i:j])); i = j
    return ''.join(out)


# ------------------------------------------------------------------ bloques
def L(s, cls='', style='', h=None):
    """Un renglón (o párrafo). h = alto fijo en renglones (auto = 2 si hay fracción)."""
    if h is None and '\\frac' in s:
        h = 2
    st = style
    if h:
        st += f';height:{h * PITCH:.2f}mm'
        cls += ' tall'
    st = f' style="{st}"' if st else ''
    inner = f'<div class="in">{T(s)}</div>' if h else T(s)
    return f'<div class="ln {cls}"{st}>{inner}</div>'


def FL(formula, note_txt='', color='s', h=None, w=('1.25fr', '1fr')):
    """Fórmula a la izquierda + anotación de color a la derecha (como en sus apuntes)."""
    if h is None:
        h = 2 if '\\frac' in formula else 1
    left = L(formula, h=h)
    right = (f'<div class="ln tall nt {color}" style="height:{h * PITCH:.2f}mm"><div class="in">{T(note_txt)}</div></div>'
             if note_txt else '')
    return cols(left, right, widths=list(w))


def head(s, mark='×', cls='', hl=False):
    m = f'<span class="mk">{esc(mark)}</span>' if mark else ''
    inner = T(s)
    if hl:
        inner = f'<span class="hl">{inner}</span>'
    return f'<div class="ln hd {cls}">{m}{inner}</div>'


def note(s, color='b', indent=1.0):
    """Anotación con flecha de gancho ↳ (como en sus apuntes)."""
    return (f'<div class="ln nt {color}" style="padding-left:{indent}em">{hook_svg()}{T(s)}</div>')


def hook_svg():
    w = rng.uniform(-0.6, 0.6)
    return (f'<svg class="hk" viewBox="0 0 26 22"><path d="M3,1 C3,{8+w:.1f} 3.5,14 6,15 L22,15 M17,10.5 L22.5,15 L17,19.5" fill="none" '
            f'vector-effect="non-scaling-stroke"/></svg>')


def blank(n=1):
    return f'<div class="sp" style="height:{n * PITCH:.2f}mm"></div>'


def half():
    return f'<div class="sp" style="height:{CELL:.2f}mm"></div>'


def cols(*blocks, widths=None):
    w = widths or ['1fr'] * len(blocks)
    tpl = ' '.join(f'minmax(0,{x})' for x in w)
    return f'<div class="cols" style="grid-template-columns:{tpl}">' + ''.join(f'<div>{b}</div>' for b in blocks) + '</div>'


def rule(color=K, width_pct=100):
    a, b = rng.uniform(-0.7, 0.7), rng.uniform(-0.7, 0.7)
    return (f'<div class="rule" style="width:{width_pct}%"><svg viewBox="0 0 400 6" preserveAspectRatio="none"><path d="M2,{3+a:.2f} C120,{3-a:.2f} 280,{3+b:.2f} 398,{3-b*0.5:.2f}" '
            f'stroke="{color}" vector-effect="non-scaling-stroke"/></svg></div>')


# ------------------------------------------------------------------ SVG a mano
def _j(v, a):
    return v + rng.uniform(-a, a)


def wline(x1, y1, x2, y2, col=K, w=0.9, amp=None, dash=None, extra=''):
    L_ = math.hypot(x2 - x1, y2 - y1) or 1
    amp = amp if amp is not None else min(1.2, 0.012 * L_ + 0.25)
    nx, ny = -(y2 - y1) / L_, (x2 - x1) / L_
    o1, o2 = rng.uniform(-amp, amp), rng.uniform(-amp, amp)
    c1 = (x1 + (x2 - x1) * 0.33 + nx * o1, y1 + (y2 - y1) * 0.33 + ny * o1)
    c2 = (x1 + (x2 - x1) * 0.66 + nx * o2, y1 + (y2 - y1) * 0.66 + ny * o2)
    e = 0.25
    d = (f'M{_j(x1, e):.2f},{_j(y1, e):.2f} C{c1[0]:.2f},{c1[1]:.2f} {c2[0]:.2f},{c2[1]:.2f} '
         f'{_j(x2, e):.2f},{_j(y2, e):.2f}')
    da = f' stroke-dasharray="{dash}"' if dash else ''
    return f'<path d="{d}" fill="none" stroke="{col}" stroke-width="{w}" stroke-linecap="round"{da} {extra}/>'


def head_open(x, y, ang, col=K, w=0.9, size=3.2):
    """Punta de flecha abierta en (x,y) apuntando en ángulo ang (rad)."""
    a1, a2 = ang + math.pi - 0.45, ang + math.pi + 0.45
    s1, s2 = size * rng.uniform(0.85, 1.1), size * rng.uniform(0.85, 1.1)
    return (f'<path d="M{x + s1 * math.cos(a1):.2f},{y + s1 * math.sin(a1):.2f} L{x:.2f},{y:.2f} '
            f'L{x + s2 * math.cos(a2):.2f},{y + s2 * math.sin(a2):.2f}" fill="none" stroke="{col}" stroke-width="{w}" '
            f'stroke-linecap="round" stroke-linejoin="round"/>')


def warrow(x1, y1, x2, y2, col=K, w=0.9, size=3.2, both=False, dash=None):
    s = wline(x1, y1, x2, y2, col, w, dash=dash)
    s += head_open(x2, y2, math.atan2(y2 - y1, x2 - x1), col, w, size)
    if both:
        s += head_open(x1, y1, math.atan2(y1 - y2, x1 - x2), col, w, size)
    return s


def wcurve(pts, col=K, w=0.9, amp=0.4, closed=False, dash=None, fill='none'):
    """Spline Catmull-Rom con ruido por las coordenadas dadas."""
    P = [(_j(x, amp), _j(y, amp)) for x, y in pts]
    if closed:
        P = P + P[:3]
    d = f'M{P[0][0]:.2f},{P[0][1]:.2f}'
    for i in range(len(P) - 1):
        p0 = P[i - 1] if i > 0 else P[i]
        p1, p2 = P[i], P[i + 1]
        p3 = P[i + 2] if i + 2 < len(P) else P[i + 1]
        c1 = (p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6)
        c2 = (p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6)
        d += f' C{c1[0]:.2f},{c1[1]:.2f} {c2[0]:.2f},{c2[1]:.2f} {p2[0]:.2f},{p2[1]:.2f}'
    da = f' stroke-dasharray="{dash}"' if dash else ''
    return f'<path d="{d}" fill="{fill}" stroke="{col}" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round"{da}/>'


def wcircle(cx, cy, r, col=K, w=0.9, fill='none'):
    n = 14
    a0 = rng.uniform(0, 2 * math.pi)
    pts = []
    for i in range(n + 2):
        a = a0 + 2 * math.pi * i / n
        rr = r * (1 + rng.uniform(-0.04, 0.04))
        pts.append((cx + rr * math.cos(a), cy + rr * math.sin(a)))
    return wcurve(pts, col, w, amp=0.05, fill=fill)


def wrect(x, y, wd, ht, col=K, w=0.9, fill=None):
    s = ''
    if fill:
        s += f'<rect x="{x}" y="{y}" width="{wd}" height="{ht}" fill="{fill}" rx="1"/>'
    o = 0.8
    s += wline(x - o * rng.random(), y, x + wd + o * rng.random(), y, col, w)
    s += wline(x + wd, y - o * rng.random(), x + wd, y + ht + o * rng.random(), col, w)
    s += wline(x + wd + o * rng.random(), y + ht, x - o * rng.random(), y + ht, col, w)
    s += wline(x, y + ht + o * rng.random(), x, y - o * rng.random(), col, w)
    return s


def hatch(x0, x1, top, bot, col=B, w=0.7, step=7, slope=0.55):
    """Rayado diagonal entre las curvas top(x) y bot(x) (como sus diagramas)."""
    s = ''
    x = x0 + step * 0.6
    while x < x1 - 2:
        yt, yb = top(x), bot(x)
        if abs(yb - yt) > 2:
            dx = abs(yb - yt) * slope * 0.5
            s += wline(x - dx * 0.5, max(yt, yb) - 0.8, x + dx * 0.5, min(yt, yb) + 0.8, col, w, amp=0.3)
        x += step * rng.uniform(0.85, 1.2)
    return s


def stext(x, y, s, col=K, size=4.2, anchor='start', weight=None):
    """Texto manuscrito dentro de un SVG (con giro y altura variables por letra)."""
    rot = ' '.join(f'{rng.uniform(-3.5, 3.5):.1f}' for _ in s)
    dys, prev = [], 0.0
    for _ in s:
        v = rng.uniform(-0.25, 0.25)
        dys.append(f'{v - prev:.2f}'); prev = v
    return (f'<text x="{x:.2f}" y="{y:.2f}" fill="{col}" font-family="{FONT}" font-size="{size}" text-anchor="{anchor}" '
            f'rotate="{rot}" dy="{" ".join(dys)}">{esc(s)}</text>')


def sgreek(x, y, s, col=K, size=4.2, anchor='start'):
    return (f'<text x="{x:.2f}" y="{y:.2f}" fill="{col}" font-family="HandGreek" font-weight="200" font-size="{size}" '
            f'text-anchor="{anchor}">{esc(s)}</text>')


def svgfig(w_mm, h_lines, body, cls=''):
    """Figura SVG en mm; su alto es múltiplo de renglones para no romper la cuadrícula."""
    h_mm = h_lines * PITCH
    return (f'<div class="fig {cls}" style="height:{h_mm:.2f}mm"><svg viewBox="0 0 {w_mm} {h_mm:.2f}" '
            f'style="width:{w_mm}mm;height:{h_mm:.2f}mm">{body}</svg></div>')


# ------------------------------------------------------------------ página y documento
def grid_svg():
    off = 0.62 * CELL
    return (f'<svg class="grid" viewBox="0 0 210 297" preserveAspectRatio="none">'
            f'<defs><pattern id="g" width="{CELL}" height="{CELL}" patternUnits="userSpaceOnUse" x="0" y="{off:.3f}">'
            f'<path d="M0,0 L{CELL},0 M0,0 L0,{CELL}" stroke="#cbcbcb" stroke-width="0.19" fill="none"/></pattern></defs>'
            f'<rect width="210" height="297" fill="#fcfcfc"/><rect width="210" height="297" fill="url(#g)"/></svg>')


def page(body, overlay='', num=None):
    pg = f'<div class="pg">{hw("- " + str(num) + " -")}</div>' if num else ''
    return (f'<section class="page">{grid_svg()}<div class="content">{body}</div>'
            f'{overlay}{pg}</section>')


def document(pages, font_files, greek_file, title='Apuntes'):
    font_face = ''.join(f"@font-face{{font-family:'{FONT}';src:url('file://{f}');unicode-range:{r};}}" for f, r in font_files)
    css = CSS.replace('%JIT%', jitter_css())
    return (f'<!doctype html><html lang="es"><head><meta charset="utf-8"><title>{title}</title><style>'
            f"{font_face}@font-face{{font-family:'HandGreek';src:url('file://{greek_file}');font-weight:200;}}"
            f'{css}</style></head><body>' + ''.join(pages) +
            '<script>document.fonts.ready.then(()=>{const pitch=' + f'{PITCH * 96 / 25.4:.4f}' + ';const fixed=[];'
            'document.querySelectorAll(".tall").forEach(el=>{const inn=el.querySelector(".in");if(!inn)return;const need=inn.scrollHeight;'
            'if(need>el.clientHeight+1){el.style.height=(Math.ceil((need+2)/pitch)*pitch)+"px";fixed.push(inn.textContent.slice(0,40));}});'
            'window.__fixed=fixed;const hz=[];document.querySelectorAll(".cols > div, .content").forEach(el=>{if(el.scrollWidth>el.clientWidth+2)hz.push(el.textContent.slice(0,50));});window.__hz=hz;const r=[];document.querySelectorAll(".page").forEach((p,i)=>{const c=p.querySelector(".content");'
            'if(c.scrollHeight>c.clientHeight+2)r.push((i+1)+": +"+((c.scrollHeight-c.clientHeight)/3.78).toFixed(1)+"mm");});window.__over=r;window.__done=true;});</script>'
            '</body></html>')


CSS = """
@page { size: 210mm 297mm; margin: 0; }
html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { margin: 0; }
.page { width: 210mm; height: 297mm; position: relative; overflow: hidden; break-after: page; }
.grid { position: absolute; inset: 0; width: 210mm; height: 297mm; }
.content { position: absolute; left: 7.5mm; right: 6mm; top: %TOP%mm; bottom: 5mm; font-family: 'Hand', 'HandGreek';
  font-size: %FS%mm; line-height: %LH%mm; color: #151515; }
.ln { min-height: %LH%mm; }
.tall { display: flex; align-items: center; }
.tall > .in { width: 100%; line-height: 1.25; }
.ln.r .in, .ln.r { text-align: right; }
.content { word-spacing: .14em; }
.pg { position: absolute; right: 9mm; bottom: 6mm; font-family: 'Hand'; font-size: 5mm; color: #ef806c; }
.w { white-space: nowrap; }
i { font-style: normal; display: inline-block; }
%JIT%
.b, .b i { color: #0028b8; } .s, .s i { color: #ef806c; } .k, .k i { color: #151515; }
.b svg path { stroke: #0028b8; } .s svg path { stroke: #ef806c; }
.hl { background: linear-gradient(176deg, transparent 18%, rgba(248,235,0,.34) 18%, rgba(248,235,0,.34) 88%, transparent 88%);
  padding: 0 .25em; margin-left: -.1em; box-decoration-break: clone; -webkit-box-decoration-break: clone; }
.ul { background: linear-gradient(currentColor, currentColor) no-repeat 0 76% / 100% .05em; }
.hd { font-size: 1.12em; }
.mk { display: inline-block; margin-right: .18em; transform: translateY(-.02em) rotate(-4deg); }
.f { white-space: nowrap; }
.th { display: inline-block; width: .16em; }
.gr { font-family: 'HandGreek'; font-weight: 200; font-size: .96em; display: inline-block; }
.sup { font-size: .62em; vertical-align: .62em; line-height: 0; margin-left: .03em; }
.sub { font-size: .62em; vertical-align: -.28em; line-height: 0; margin-left: .02em; }
.fr { display: inline-flex; flex-direction: column; align-items: center; vertical-align: middle; line-height: 1.02;
  margin: 0 .12em; transform: translateY(.06em); }
.fr .nu, .fr .de { padding: 0 .1em; white-space: nowrap; }
.fr .bar { display: block; width: 100%; height: .16em; overflow: visible; contain: size; }
.bar path { stroke: currentColor; stroke-width: .9px; fill: none; stroke-linecap: round; }
.b .bar path { stroke: #0028b8; } .s .bar path { stroke: #ef806c; }
.ar { display: inline-block; width: 1.05em; height: .45em; vertical-align: .05em; margin: 0 .12em; overflow: visible; }
.ar path, .hk path, .rad path { stroke: currentColor; stroke-width: 1px; stroke-linecap: round; stroke-linejoin: round; }
.hk { display: inline-block; width: .95em; height: .8em; vertical-align: -.02em; margin-right: .2em; overflow: visible; }
.sq { display: inline-flex; align-items: stretch; vertical-align: middle; }
.rad { width: .45em; height: 1.15em; overflow: visible; }
.sqi { border-top: .045em solid currentColor; padding: .02em .08em 0 .04em; margin-top: .04em; }
.dt { position: relative; display: inline-block; }
.dt::after { content: ''; position: absolute; left: 52%; top: .06em; width: .13em; height: .13em; border-radius: 50%; background: currentColor; transform: translateX(-50%); }
.md { display: inline-block; width: .16em; height: .16em; border-radius: 50%; background: currentColor; margin: 0 .2em; vertical-align: .2em; }
.cols { display: grid; column-gap: 4mm; }
.fig { position: relative; }
.fig > svg { display: block; overflow: visible; }
.rule { height: %LH%mm; display: flex; align-items: center; }
.rule svg { width: 100%; height: 2mm; overflow: visible; }
.rule path { fill: none; stroke-width: 1px; stroke-linecap: round; }
.nt { font-size: .82em; }
.ck { display: inline-block; width: .7em; height: .6em; vertical-align: 0; margin: 0 .1em; overflow: visible; }
.ck path, .cb path { stroke: currentColor; stroke-width: 1.1px; stroke-linecap: round; stroke-linejoin: round; }
.cb { display: inline-block; width: .62em; height: .62em; vertical-align: -.02em; margin: 0 .12em 0 .3em; overflow: visible; }
.bx > div { width: 100%; box-sizing: border-box; padding: 0 2.6mm !important; }
.bl { text-align: left; } .bl.c { text-align: center; }
.ci { display: inline-block; width: 1.05em; height: 1.05em; vertical-align: -.2em; margin-right: .22em; overflow: visible; }
.bx { position: absolute; display: flex; align-items: center; justify-content: center; text-align: center; line-height: 1.22; font-size: .64em; }
.bx > div { padding: 0 1.5mm; }
.title { font-size: 2.15em; line-height: 1.2; }
.tb { display: grid; column-gap: 3mm; }
.tb > div { min-height: %LH%mm; display: flex; align-items: center; }
.sm { font-size: .82em; }
.xs { font-size: .7em; line-height: .5; }
.c { text-align: center; }
.r { text-align: right; }
"""


# ------------------------------------------------------------------ extras de estilo
def circ(n, col=K):
    """Número en círculo dibujado a mano (como 'Paso ①' de sus apuntes)."""
    pts = []
    a0 = rng.uniform(0, 6.28)
    for i in range(16):
        a = a0 + 6.6 * i / 15
        r = 9.2 * (1 + rng.uniform(-0.05, 0.05))
        pts.append((11 + r * math.cos(a), 11 + r * math.sin(a)))
    path = wcurve(pts, col, 1.1, amp=0.15)
    t = (f'<text x="11" y="15.3" text-anchor="middle" font-family="{FONT}" font-size="{12.5 if len(str(n)) == 1 else 10}" '
         f'fill="{col}">{n}</text>')
    return f'<svg class="ci" viewBox="0 0 22 22">{path}{t}</svg>'


def step(n, s, col=K, h=None):
    return L(f'§{n}§ ' + s, h=h)


def boxdiag(w_mm, h_lines, boxes, drawing='', fs=None):
    """Diagrama de cajas: dibujo SVG detrás + cajas HTML (con fórmulas) encima.
    boxes: lista de (x, y, w, h, html, color, dashed)"""
    h_mm = h_lines * PITCH
    svg = drawing
    divs = ''
    for (x, y, w, h, inner, col, dashed) in boxes:
        svg += wrect(x, y, w, h, col, 0.85) if not dashed else wrect(x, y, w, h, col, 0.85).replace('stroke-linecap="round"', 'stroke-linecap="round" stroke-dasharray="2.2 1.6"')
        fss = f';font-size:{fs}em' if fs else ''
        divs += (f'<div class="bx" style="left:{x}mm;top:{y}mm;width:{w}mm;height:{h}mm;color:{col}{fss}">'
                 f'<div>{inner}</div></div>')
    return (f'<div class="fig" style="height:{h_mm:.2f}mm;position:relative">'
            f'<svg viewBox="0 0 {w_mm} {h_mm:.2f}" style="position:absolute;left:0;top:0;width:{w_mm}mm;height:{h_mm:.2f}mm;overflow:visible">{svg}</svg>'
            f'{divs}</div>')

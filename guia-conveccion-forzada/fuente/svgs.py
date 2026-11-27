# -*- coding: utf-8 -*-
"""Diagramas SVG de la guía (dibujados a mano en coordenadas)."""
import math, re

INK = '#18202e'; INK2 = '#3a4456'; MUTED = '#6b7383'
EXT = '#0b7285'; EXTL = '#b5e1e8'; INT = '#c2410c'; INTL = '#f6cdb2'
BLUE = '#2b6cb0'; STEEL = '#55606f'


def esc(s):
    return s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')


def rich(txt, size):
    """Convierte 'T_{s} = 65 °C' o 'm^{3}' en tspans con sub/superíndices."""
    out = []
    i = 0
    dysub = size * 0.32
    dysup = size * 0.42
    small = size * 0.72
    buf = ''
    while i < len(txt):
        if txt[i] in '_^' and i + 1 < len(txt) and txt[i + 1] == '{':
            j = txt.index('}', i)
            inner = txt[i + 2:j]
            if buf:
                out.append(f'<tspan>{esc(buf)}</tspan>')
                buf = ''
            if txt[i] == '_':
                out.append(f'<tspan dy="{dysub:.2f}" font-size="{small:.2f}">{esc(inner)}</tspan><tspan dy="{-dysub:.2f}">​</tspan>')
            else:
                out.append(f'<tspan dy="{-dysup:.2f}" font-size="{small:.2f}">{esc(inner)}</tspan><tspan dy="{dysup:.2f}">​</tspan>')
            i = j + 1
        else:
            buf += txt[i]
            i += 1
    if buf:
        out.append(f'<tspan>{esc(buf)}</tspan>')
    return ''.join(out)


def text(x, y, s, size=11, weight=500, fill=INK, anchor='start', italic=False, family='Inter', extra='', halo=False):
    st = ' font-style="italic"' if italic else ''
    if halo:
        st += ' stroke="#ffffff" stroke-width="3.2" paint-order="stroke" stroke-linejoin="round"'
    return (f'<text x="{x}" y="{y}" font-family="{family}" font-size="{size}" font-weight="{weight}" '
            f'fill="{fill}" text-anchor="{anchor}"{st} {extra}>{rich(s, size)}</text>')


def defs(pfx, colors):
    s = '<defs>'
    for name, col in colors.items():
        s += (f'<marker id="{pfx}-{name}" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="5.5" markerHeight="5.5" '
              f'orient="auto-start-reverse"><path d="M0,0.6 L10,5 L0,9.4 z" fill="{col}"/></marker>')
    s += '</defs>'
    return s


def arrow(x1, y1, x2, y2, col, pfx, name, w=1.6, dash=None, both=False):
    d = f' stroke-dasharray="{dash}"' if dash else ''
    ms = f' marker-start="url(#{pfx}-{name})"' if both else ''
    return (f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{col}" stroke-width="{w}"{d}{ms} '
            f'marker-end="url(#{pfx}-{name})"/>')


def dim_h(x1, x2, y, label, pfx, col=INK2, size=10, above=False):
    """Cota horizontal con flechas en ambos extremos."""
    s = arrow(x1 + 1, y, x2 - 1, y, col, pfx, 'dim', w=1.0, both=True)
    s += f'<line x1="{x1}" y1="{y-5}" x2="{x1}" y2="{y+5}" stroke="{col}" stroke-width="0.9"/>'
    s += f'<line x1="{x2}" y1="{y-5}" x2="{x2}" y2="{y+5}" stroke="{col}" stroke-width="0.9"/>'
    ty = y - 4 if above else y + size + 3
    s += text((x1 + x2) / 2, ty, label, size=size, weight=600, fill=col, anchor='middle')
    return s


def dim_v(x, y1, y2, label, pfx, col=INK2, size=10, left=False):
    s = arrow(x, y1 + 1, x, y2 - 1, col, pfx, 'dim', w=1.0, both=True)
    s += f'<line x1="{x-5}" y1="{y1}" x2="{x+5}" y2="{y1}" stroke="{col}" stroke-width="0.9"/>'
    s += f'<line x1="{x-5}" y1="{y2}" x2="{x+5}" y2="{y2}" stroke="{col}" stroke-width="0.9"/>'
    if left:
        s += text(x - 7, (y1 + y2) / 2 + size * 0.35, label, size=size, weight=600, fill=col, anchor='end')
    else:
        s += text(x + 7, (y1 + y2) / 2 + size * 0.35, label, size=size, weight=600, fill=col, anchor='start')
    return s


def svg(w, h, body, cls=''):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" class="{cls}" '
            f'font-family="Inter">{body}</svg>')


def path_from(pts):
    return 'M' + ' L'.join(f'{x:.1f},{y:.1f}' for x, y in pts)


# ---------------------------------------------------------------- streamlines
def cyl_streamlines(cx, cy, R, x0, x1, psis, U=1.0, n=160):
    """Líneas de corriente del flujo potencial alrededor de un cilindro."""
    paths = []
    for psi in psis:
        pts = []
        for k in range(n + 1):
            x = x0 + (x1 - x0) * k / n
            X = x - cx
            # resolver psi = U*y*(1 - R^2/(X^2+y^2)) para y (rama del mismo signo que psi)
            sgn = 1 if psi >= 0 else -1
            lo, hi = (R * 1.0001 if abs(X) < R else 0.0001), 6 * R + abs(psi) * 2
            if abs(X) < R:
                lo = math.sqrt(max(R * R - X * X, 0)) + 1e-4
            f = lambda yy: U * yy * (1 - R * R / (X * X + yy * yy)) - abs(psi)
            a, b = lo, hi
            fa = f(a)
            if fa > 0:
                y = a
            else:
                for _ in range(60):
                    m = 0.5 * (a + b)
                    if f(m) > 0:
                        b = m
                    else:
                        a = m
                y = 0.5 * (a + b)
            pts.append((x, cy - sgn * y))
        paths.append(path_from(pts))
    return paths


# ---------------------------------------------------------------- cover art
def cover_art():
    p = 'cv'
    b = defs(p, {'w': '#ffffff', 'o': '#f59e5b', 't': '#7fd3e0'})
    b += ('<defs><linearGradient id="cv-g" x1="0" x2="1" y1="0" y2="0">'
          '<stop offset="0" stop-color="#7fd3e0" stop-opacity="0.25"/>'
          '<stop offset="1" stop-color="#f59e5b" stop-opacity="0.55"/></linearGradient></defs>')
    cx, cy, R = 175, 100, 30
    b += ('<defs><linearGradient id="cv-f" x1="0" x2="1" y1="0" y2="0">'
          '<stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="0.12" stop-color="#fff" stop-opacity="1"/>'
          '<stop offset="0.8" stop-color="#fff" stop-opacity="1"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>'
          '</linearGradient><mask id="cv-m" maskUnits="userSpaceOnUse" x="0" y="0" width="360" height="200">'
          '<rect x="0" y="0" width="360" height="200" fill="url(#cv-f)"/></mask></defs>')
    psis = [-75, -58, -43, -30, -19, -9, -2.5, 2.5, 9, 19, 30, 43, 58, 75]
    b += '<g mask="url(#cv-m)">'
    for i, d in enumerate(cyl_streamlines(cx, cy, R, 0, 360, psis)):
        op = 0.9 - 0.04 * abs(i - 6.5)
        b += f'<path d="{d}" fill="none" stroke="#7fd3e0" stroke-width="1.3" stroke-opacity="{op:.2f}"/>'
    b += '</g>'
    b += f'<circle cx="{cx}" cy="{cy}" r="{R}" fill="#0f1b2d" stroke="#ffffff" stroke-width="2"/>'
    # pipe
    x0, x1, yt, yb = 420, 668, 62, 138
    b += f'<rect x="{x0}" y="{yt}" width="{x1-x0}" height="{yb-yt}" fill="url(#cv-g)"/>'
    b += f'<rect x="{x0}" y="{yt-7}" width="{x1-x0}" height="7" fill="#f59e5b"/>'
    b += f'<rect x="{x0}" y="{yb}" width="{x1-x0}" height="7" fill="#f59e5b"/>'
    for xs in (480, 590):
        b += f'<line x1="{xs}" y1="{yt+2}" x2="{xs}" y2="{yb-2}" stroke="#ffffff" stroke-opacity="0.6" stroke-width="1"/>'
        for k in range(1, 8):
            yy = yt + (yb - yt) * k / 8
            eta = (yy - (yt + yb) / 2) / ((yb - yt) / 2)
            L = 46 * (1 - eta * eta)
            if L > 4:
                b += arrow(xs, yy, xs + L, yy, '#ffffff', p, 'w', w=1.3)
    for xs in range(440, 668, 34):
        b += arrow(xs, yt - 26, xs, yt - 10, '#f59e5b', p, 'o', w=1.5)
        b += arrow(xs + 17, yb + 26, xs + 17, yb + 10, '#f59e5b', p, 'o', w=1.5)
    b += text(cx, 190, 'EXTERNA', size=11, weight=700, fill='#7fd3e0', anchor='middle', extra='letter-spacing="2.5"')
    b += text((x0 + x1) / 2, 190, 'INTERNA', size=11, weight=700, fill='#f59e5b', anchor='middle', extra='letter-spacing="2.5"')
    return svg(680, 200, b)


# ---------------------------------------------------------------- boundary layer
def boundary_layer():
    p = 'bl'
    b = defs(p, {'t': EXT, 'k': INK2, 'dim': INK2})
    X0, XE, YP = 70, 500, 130
    xcr = 232

    def delta(x):
        if x <= xcr:
            return 2.3 * math.sqrt(max(x - X0, 0))
        base = 2.3 * math.sqrt(xcr - X0)
        return base + 0.5 * (x - xcr) ** 0.8

    pts = []
    for k in range(0, 431):
        x = X0 + k
        d = delta(x)
        if x > xcr + 25:
            d += 1.8 * math.sin((x - xcr) / 5.0) * min(1, (x - xcr - 25) / 30)
        pts.append((x, YP - d))
    area = path_from(pts) + f' L{XE},{YP} L{X0},{YP} Z'
    b += f'<path d="{area}" fill="{EXT}" fill-opacity="0.13"/>'
    b += f'<path d="{path_from(pts)}" fill="none" stroke="{EXT}" stroke-width="1.6"/>'
    b += f'<rect x="{X0}" y="{YP}" width="{XE-X0}" height="7" fill="{INK2}"/>'
    for yy in (52, 74, 96, 118):
        b += arrow(12, yy, 52, yy, EXT, p, 't', w=1.5)
    b += text(10, 38, 'V, T_{∞}', size=11, weight=700, fill=EXT)
    # velocity profiles
    for xs, kind in ((185, 'lam'), (420, 'turb')):
        d = delta(xs)
        b += f'<line x1="{xs}" y1="{YP}" x2="{xs}" y2="{YP-d-10}" stroke="{INK2}" stroke-width="0.9"/>'
        n = 4 if kind == 'lam' else 6
        for k in range(1, n + 1):
            yy = YP - d * k / n
            eta = k / n
            u = (2 * eta - eta * eta) if kind == 'lam' else eta ** (1 / 7)
            L = 34 * u
            b += arrow(xs, yy, xs + L, yy, INK2, p, 'k', w=1.0)
        b += arrow(xs, YP - d - 6, xs + 34, YP - d - 6, INK2, p, 'k', w=1.0)
    b += f'<line x1="{xcr}" y1="{YP}" x2="{xcr}" y2="22" stroke="{MUTED}" stroke-width="1" stroke-dasharray="3 3"/>'
    b += text(xcr + 5, 20, 'x_{cr}:  Re_{x} = 5×10^{5}', size=9.5, weight=600, fill=MUTED)
    b += text(150, 72, 'Laminar', size=10.5, weight=700, fill=EXT, anchor='middle')
    b += text(268, 72, 'Transición', size=9, weight=600, fill=MUTED, anchor='middle')
    b += text(420, 40, 'Turbulenta', size=10.5, weight=700, fill=EXT, anchor='middle')
    b += text(120, YP - delta(120) - 7, 'δ(x)', size=10, weight=600, fill=EXT, italic=True, anchor='middle')
    b += text(X0 + 4, YP + 21, 'Placa a T_{s}', size=9.5, weight=600, fill=INK2)
    b += arrow(330, YP + 17, 395, YP + 17, INK2, p, 'k', w=1.0)
    b += text(400, YP + 21, 'x', size=10, weight=600, fill=INK2, italic=True)
    return svg(520, 158, b)


# ---------------------------------------------------------------- T(x) plots
def tx_plots():
    p = 'tx'
    b = defs(p, {'k': INK2, 'dim': INK2, 'o': INT})

    def axes(ox, title):
        s = arrow(ox, 165, ox + 215, 165, INK2, p, 'k', w=1.1)
        s += arrow(ox, 165, ox, 22, INK2, p, 'k', w=1.1)
        s += text(ox + 217, 170, 'x', size=10, weight=600, italic=True, fill=INK2)
        s += text(ox - 4, 20, 'T', size=10, weight=600, italic=True, fill=INK2, anchor='end')
        s += text(ox + 108, 186, title, size=10, weight=700, fill=INK, anchor='middle')
        return s

    # Panel 1: Ts constante
    ox = 30
    b += axes(ox, 'T_{s} = constante')
    b += f'<line x1="{ox}" y1="45" x2="{ox+200}" y2="45" stroke="{INT}" stroke-width="2"/>'
    pts = [(ox + k, 45 + 100 * math.exp(-2.6 * k / 200)) for k in range(0, 201)]
    b += f'<path d="{path_from(pts)}" fill="none" stroke="{EXT}" stroke-width="2"/>'
    b += text(ox + 200, 40, 'T_{s}', size=10, weight=700, fill=INT, anchor='end')
    b += text(ox + 95, 118, 'T_{m}(x)', size=10, weight=700, fill=EXT)
    b += text(ox + 4, 158, 'T_{in}', size=9, weight=600, fill=INK2)
    yend = 45 + 100 * math.exp(-2.6)
    b += f'<circle cx="{ox+200}" cy="{yend:.1f}" r="2.4" fill="{EXT}"/>'
    b += text(ox + 205, yend + 4, 'T_{out}', size=9, weight=600, fill=INK2)
    b += dim_v(ox + 14, 45, 145, '', p, col=MUTED)
    b += text(ox + 21, 100, 'ΔT_{in}', size=9, weight=600, fill=MUTED)
    b += dim_v(ox + 188, 45, yend, '', p, col=MUTED)
    b += text(ox + 184, 70, 'ΔT_{out}', size=9, weight=600, fill=MUTED, anchor='end')

    # Panel 2: qs constante
    ox = 290
    b += axes(ox, 'q̇_{s} = constante')
    tm = lambda k: 150 - 0.42 * k
    pts_m = [(ox + k, tm(k)) for k in range(0, 201)]
    pts_s = [(ox + k, tm(k) - (42 - 28 * math.exp(-k / 14.0))) for k in range(0, 201)]
    b += f'<path d="{path_from(pts_s)}" fill="none" stroke="{INT}" stroke-width="2"/>'
    b += f'<path d="{path_from(pts_m)}" fill="none" stroke="{EXT}" stroke-width="2"/>'
    b += text(ox + 70, tm(70) - 50, 'T_{s}(x)', size=10, weight=700, fill=INT)
    b += text(ox + 125, tm(125) + 16, 'T_{m}(x)', size=10, weight=700, fill=EXT)
    b += dim_v(ox + 175, tm(175) - 42, tm(175), '', p, col=MUTED)
    b += text(ox + 182, tm(175) - 17, 'q̇_{s}/h', size=9, weight=600, fill=MUTED)
    b += f'<line x1="{ox+45}" y1="30" x2="{ox+45}" y2="165" stroke="{MUTED}" stroke-width="0.8" stroke-dasharray="2 3"/>'
    b += text(ox + 47, 34, 'entrada', size=8, weight=500, fill=MUTED)
    b += text(ox + 4, 158, 'T_{in}', size=9, weight=600, fill=INK2)
    return svg(520, 192, b)


# ---------------------------------------------------------------- 7-37 plate
def fig_737():
    p = 'f1'
    b = defs(p, {'t': EXT, 'dim': INK2})
    x0, y0, s = 112, 40, 132
    b += f'<rect x="{x0}" y="{y0}" width="{s}" height="{s}" rx="3" fill="#e9edf2" stroke="{STEEL}" stroke-width="1.6"/>'
    pos = [(x0 + 30, y0 + 28), (x0 + 82, y0 + 28), (x0 + 30, y0 + 82), (x0 + 82, y0 + 82)]
    for (x, y) in pos:
        b += f'<rect x="{x}" y="{y}" width="22" height="24" rx="2" fill="{INK}"/>'
        b += f'<rect x="{x+4}" y="{y-6}" width="14" height="7" rx="1.5" fill="#9aa4b2"/>'
        b += text(x + 11, y + 15.5, '6 W', size=6.8, weight=700, fill='#ffffff', anchor='middle')
    for yy in (62, 92, 122, 152):
        b += arrow(14, yy, 96, yy, EXT, p, 't', w=1.6)
    b += text(14, 26, 'Aire', size=10.5, weight=700, fill=EXT)
    b += text(14, 39, 'T_{∞} = 35 °C,  V = 4 m/s', size=9, weight=600, fill=EXT)
    b += dim_h(x0, x0 + s, y0 + s + 14, 'L = 0,25 m', p)
    b += dim_v(x0 + s + 14, y0, y0 + s, '0,25 m', p)
    b += text(x0 + s / 2, y0 - 8, 'T_{s} ≤ 65 °C', size=10, weight=700, fill=INT, anchor='middle')
    return svg(300, 210, b)


# ---------------------------------------------------------------- 8-45 duct
def fig_845():
    p = 'f2'
    b = defs(p, {'o': INT, 'k': INK2, 'dim': INK2, 'q': '#a23b0a'})
    x0, x1, yt, yb, dx, dy = 92, 250, 82, 120, 22, -18
    b += f'<path d="M{x0},{yt} L{x0+dx},{yt+dy} L{x1+dx},{yt+dy} L{x1},{yt} Z" fill="#dfe4ea" stroke="{STEEL}" stroke-width="1.3"/>'
    b += f'<rect x="{x0}" y="{yt}" width="{x1-x0}" height="{yb-yt}" fill="#eef1f5" stroke="{STEEL}" stroke-width="1.3"/>'
    b += f'<path d="M{x1},{yt} L{x1+dx},{yt+dy} L{x1+dx},{yb+dy} L{x1},{yb} Z" fill="#c9d0d9" stroke="{STEEL}" stroke-width="1.3"/>'
    b += text(4, 58, 'Aire: 85 °C', size=9, weight=700, fill=INT)
    b += text(4, 70, '1 atm', size=9, weight=600, fill=INT)
    b += text(4, 82, 'V̇ = 0,10 m^{3}/s', size=9, weight=600, fill=INT)
    b += arrow(6, 102, 86, 102, INT, p, 'o', w=2)
    b += arrow(278, 94, 316, 94, INT, p, 'o', w=2)
    b += text(316, 116, 'T_{out} = ?', size=9.5, weight=700, fill=INT, anchor='end')
    b += text((x0 + x1) / 2, 106, 'T_{s} = 70 °C', size=10.5, weight=700, fill=INK, anchor='middle')
    for xs in (120, 165, 210):
        b += arrow(xs + 10, yt - 24, xs + 10, yt - 48, '#a23b0a', p, 'q', w=1.5)
    b += text(124, 24, 'Q̇ perdido al ático', size=9, weight=700, fill='#a23b0a', anchor='start')
    b += dim_h(x0, x1, yb + 14, 'L = 10 m', p)
    b += text(316, yt + dy - 6, 'sección 0,15×0,15 m', size=8.3, weight=600, fill=INK2, anchor='end')
    return svg(320, 152, b)


# ---------------------------------------------------------------- 8-47 collector
def fig_847():
    p = 'f3'
    b = defs(p, {'o': INT, 'b': BLUE, 'k': INK2, 'dim': INK2, 'a': EXT})
    x0, x1, yg, yp = 76, 272, 62, 108
    sx, sy = 292, 24
    b += f'<circle cx="{sx}" cy="{sy}" r="9" fill="#f6b73c"/>'
    for k in range(8):
        a = k * math.pi / 4
        b += (f'<line x1="{sx+13*math.cos(a):.1f}" y1="{sy+13*math.sin(a):.1f}" x2="{sx+18*math.cos(a):.1f}" '
              f'y2="{sy+18*math.sin(a):.1f}" stroke="#f6b73c" stroke-width="1.6" stroke-linecap="round"/>')
    b += f'<rect x="{x0}" y="{yg-4}" width="{x1-x0}" height="4" fill="#9ccbf0" stroke="{BLUE}" stroke-width="0.8"/>'
    b += f'<rect x="{x0}" y="{yp}" width="{x1-x0}" height="8" fill="{INK}"/>'
    b += f'<rect x="{x0}" y="{yp+8}" width="{x1-x0}" height="8" fill="#e6e1d6"/>'
    b += text(x0, yg - 9, 'Vidrio: 20 °C', size=9, weight=700, fill=BLUE)
    b += text(x0, yp + 30, 'Placa absorbente: 60 °C (aislada por debajo)', size=9, weight=700, fill=INK)
    for yy in (74, 85, 96):
        b += arrow(6, yy, 68, yy, EXT, p, 'a', w=1.5)
    b += text(4, 118, 'Aire: 30 °C', size=9, weight=700, fill=EXT)
    b += text(4, 130, '0,15 m^{3}/s', size=9, weight=600, fill=EXT)
    b += arrow(278, 85, 316, 85, EXT, p, 'a', w=1.8)
    b += text(316, 101, 'T_{out} = ?', size=9, weight=700, fill=EXT, anchor='end')
    for xs in (96, 126, 212, 242):
        b += arrow(xs, yp - 2, xs, yp - 16, INT, p, 'o', w=1.4)
        b += arrow(xs + 14, yg + 13, xs + 14, yg + 2, BLUE, p, 'b', w=1.4)
    b += dim_v(166, yg + 1, yp - 1, '', p)
    b += text(173, 89, 's = 3 cm', size=8.6, weight=600, fill=INK2)
    b += text(170, 152, 'L = 5 m en la dirección del flujo · ancho W = 1 m', size=8.3, weight=600, fill=MUTED, anchor='middle')
    return svg(320, 160, b)


# ---------------------------------------------------------------- E1 cylinder
def fig_cyl():
    p = 'f4'
    b = defs(p, {'t': EXT, 'dim': INK2})
    cx, cy, R = 170, 100, 30
    psis = [-52, -36, -22, -10, 10, 22, 36, 52]
    for d in cyl_streamlines(cx, cy, R, 4, 286, psis):
        b += f'<path d="{d}" fill="none" stroke="{EXT}" stroke-width="1.2" stroke-opacity="0.75"/>'
    b += arrow(10, 18, 70, 18, EXT, p, 't', w=1.8)
    b += f'<circle cx="{cx}" cy="{cy}" r="{R}" fill="#f3e3d8" stroke="{INT}" stroke-width="2"/>'
    b += text(cx, cy + 4, 'T_{s} = 80 °C', size=8.8, weight=700, fill=INT, anchor='middle')
    b += text(78, 22, 'Viento: V = 10 m/s, T_{∞} = 20 °C', size=9.2, weight=700, fill=EXT, halo=True)
    b += dim_v(cx + R + 16, cy - R, cy + R, '', p)
    b += text(cx + R + 23, cy + 4, 'D = 5 cm', size=9.5, weight=700, fill=INK2, halo=True)
    return svg(290, 172, b)


# ---------------------------------------------------------------- tubes (E2, E3)
def fig_tube(kind):
    p = 'f5' if kind == 'steam' else 'f6'
    b = defs(p, {'w': BLUE, 'k': INK2, 'dim': INK2, 'o': INT})
    x0, x1, yt, yb = 64, 254, 66, 102
    if kind == 'steam':
        b += f'<rect x="{x0}" y="{yt-20}" width="{x1-x0}" height="{yb-yt+40}" rx="10" fill="#f1f3f6" stroke="{MUTED}" stroke-width="1" stroke-dasharray="4 3"/>'
        for xs in range(80, 250, 28):
            b += f'<circle cx="{xs}" cy="{yt-11}" r="2.2" fill="#9aa4b2"/><circle cx="{xs+13}" cy="{yb+12}" r="2.2" fill="#9aa4b2"/>'
        b += text((x0 + x1) / 2, yt - 26, 'Vapor que se condensa → T_{s} = 60 °C', size=9, weight=700, fill=INT, anchor='middle')
    b += f'<rect x="{x0}" y="{yt-4}" width="{x1-x0}" height="4" fill="{STEEL}"/>'
    b += f'<rect x="{x0}" y="{yb}" width="{x1-x0}" height="4" fill="{STEEL}"/>'
    b += f'<rect x="{x0}" y="{yt}" width="{x1-x0}" height="{yb-yt}" fill="#e3effa"/>'
    if kind == 'coil':
        zz = []
        for k in range(0, 39):
            x = x0 + 4 + k * 4.9
            zz.append((x, yt - 12 if k % 2 == 0 else yt - 2))
        b += f'<path d="{path_from(zz)}" fill="none" stroke="{INT}" stroke-width="1.6"/>'
        zz2 = [(x, (yb + 12 if i % 2 == 0 else yb + 2) + 4) for i, (x, _) in enumerate(zz)]
        b += f'<path d="{path_from(zz2)}" fill="none" stroke="{INT}" stroke-width="1.6"/>'
        b += text((x0 + x1) / 2, yt - 20, 'Resistencia eléctrica: q̇_{s} = 20 kW/m^{2} (uniforme)', size=9, weight=700, fill=INT, anchor='middle')
    xs = 150
    for k in range(1, 6):
        yy = yt + (yb - yt) * k / 6
        eta = (yy - (yt + yb) / 2) / ((yb - yt) / 2)
        L = 30 * (1 - eta * eta) if kind == 'steam' else 30 * (1 - abs(eta) ** 7)
        b += arrow(xs, yy, xs + L, yy, BLUE, p, 'w', w=1.1)
    b += f'<line x1="{xs}" y1="{yt}" x2="{xs}" y2="{yb}" stroke="{BLUE}" stroke-width="0.8"/>'
    if kind == 'steam':
        b += arrow(8, 84, 58, 84, BLUE, p, 'w', w=2)
        b += text(4, 146, 'Agua: 10 °C, ṁ = 0,01 kg/s', size=9, weight=700, fill=BLUE)
        b += arrow(260, 84, 306, 84, BLUE, p, 'w', w=2)
        b += text(310, 146, 'T_{out} = ?', size=9, weight=700, fill=BLUE, anchor='end')
        b += text(159, 162, 'D = 2 cm · L = 10 m', size=8.6, weight=600, fill=INK2, anchor='middle')
    else:
        b += arrow(8, 84, 58, 84, BLUE, p, 'w', w=2)
        b += text(4, 134, 'Agua: 20 °C, 8 L/min', size=9, weight=700, fill=BLUE)
        b += arrow(260, 84, 306, 84, BLUE, p, 'w', w=2)
        b += text(310, 134, 'sale a 60 °C', size=9, weight=700, fill=BLUE, anchor='end')
        b += text(159, 150, 'D = 2 cm · L = ?', size=8.6, weight=600, fill=INK2, anchor='middle')
    h = 168 if kind == 'steam' else 156
    return svg(312, h, b)


if __name__ == '__main__':
    for f in (cover_art, boundary_layer, tx_plots, fig_737, fig_845, fig_847, fig_cyl):
        print(f.__name__, len(f()))
    print(len(fig_tube('steam')), len(fig_tube('coil')))


# ---------------------------------------------------------------- geometry icons
def icon(kind):
    p = 'ic' + kind
    b = defs(p, {'t': EXT})
    if kind == 'placa':
        for yy in (14, 26, 38):
            b += arrow(4, yy, 28, yy, EXT, p, 't', w=1.4)
        pts = [(34 + k, 48 - 1.9 * math.sqrt(k)) for k in range(0, 82)]
        b += f'<path d="{path_from(pts)} L115,48 L34,48 Z" fill="{EXT}" fill-opacity="0.15"/>'
        b += f'<path d="{path_from(pts)}" fill="none" stroke="{EXT}" stroke-width="1.3"/>'
        b += f'<rect x="34" y="48" width="82" height="5" fill="{INK2}"/>'
        b += text(75, 62, 'L', size=9, weight=700, fill=INK2, anchor='middle', italic=True)
    elif kind == 'cil':
        for d in cyl_streamlines(80, 30, 13, 34, 118, [-22, -11, 11, 22]):
            b += f'<path d="{d}" fill="none" stroke="{EXT}" stroke-width="1" stroke-opacity="0.7"/>'
        for yy in (14, 30, 46):
            b += arrow(4, yy, 28, yy, EXT, p, 't', w=1.4)
        b += f'<circle cx="80" cy="30" r="13" fill="#f3e3d8" stroke="{INT}" stroke-width="1.6"/>'
        b += text(80, 62, 'D', size=9, weight=700, fill=INK2, anchor='middle', italic=True)
    elif kind == 'esf':
        b += (f'<defs><radialGradient id="{p}-g" cx="0.35" cy="0.35" r="0.75"><stop offset="0" stop-color="#fff"/>'
              f'<stop offset="1" stop-color="#e2a27a"/></radialGradient></defs>')
        for yy in (14, 30, 46):
            b += arrow(4, yy, 28, yy, EXT, p, 't', w=1.4)
        b += f'<circle cx="80" cy="30" r="17" fill="url(#{p}-g)" stroke="{INT}" stroke-width="1.6"/>'
        b += text(80, 62, 'D', size=9, weight=700, fill=INK2, anchor='middle', italic=True)
    elif kind == 'banco':
        for yy in (14, 30, 46):
            b += arrow(4, yy, 28, yy, EXT, p, 't', w=1.4)
        for i, cx in enumerate((50, 70, 90, 110)):
            for cy in ((14, 30, 46) if i % 2 == 0 else (22, 38)):
                b += f'<circle cx="{cx}" cy="{cy}" r="6" fill="#f3e3d8" stroke="{INT}" stroke-width="1.3"/>'
        b += text(80, 62, 'S_{T}, S_{L}, D', size=8.5, weight=700, fill=INK2, anchor='middle')
    return svg(120, 66, b)

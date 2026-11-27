# -*- coding: utf-8 -*-
"""Dibujos a mano para la versión manuscrita (coordenadas en mm)."""
import math
import hwlib as H
from hwlib import K, B, S, wline, warrow, wcurve, wcircle, wrect, hatch, stext, sgreek, svgfig, boxdiag, PITCH, rng


def chain():
    labels = [('T de props', K), ('$k$, $\\nu$, Pr', K), ('Re', K), ('Nu', B), ('$h = \\frac{Nu\\,k}{L_c}$', K), ('$\\dot{Q}$, $T_{out}$...', K)]
    boxes, draw = [], ''
    x, w, gap = 2, 26.5, 6.3
    for i, (t, c) in enumerate(labels):
        boxes.append((x, 3.5, w, 14, H.T(t), c, False))
        if i < len(labels) - 1:
            draw += warrow(x + w + 0.8, 10.5, x + w + gap - 0.8, 10.5, K, 0.8, 2.0)
        x += w + gap
    return boxdiag(196, 2, boxes, draw, fs=0.78)


def boundary_layer():
    b = ''
    X0, XE, YP, xcr = 30, 160, 26, 82
    for yy in (9, 15.5, 22):
        b += warrow(4, yy, 22, yy, B, 0.8, 2.0)
    b += stext(3, 5, 'aire', B, 5)
    b += wline(X0, YP, XE, YP, K, 1.6, amp=0.3)
    pts = []
    for k in range(0, 41):
        x = X0 + (xcr - X0) * k / 40
        pts.append((x, YP - 1.25 * math.sqrt(max(x - X0, 0))))
    for k in range(1, 25):
        x = xcr + (XE - xcr) * k / 24
        base = 1.25 * math.sqrt(xcr - X0) + 0.5 * (x - xcr) ** 0.8
        pts.append((x, YP - base + (1.0 if k % 2 else -1.0) * (k > 3)))
    b += wcurve(pts, B, 0.9, amp=0.15)
    b += wline(xcr, YP, xcr, 2, S, 0.7, dash='1.6 1.6')
    b += stext(xcr + 2.5, 6.5, 'Re = 500 000', S, 4.8)
    b += stext(38, 13, 'laminar', B, 5) + stext(122, 21, 'turbulenta', B, 5)
    b += stext(X0, YP + 6.5, 'placa', K, 4.8)
    b += sgreek(60, 21, 'δ', B, 5.5)
    return svgfig(170, 3, b)


def tx_plots():
    b = ''
    def axes(ox, title):
        s = warrow(ox, 46, ox + 78, 46, K, 0.8, 2.2) + warrow(ox, 46, ox, 4, K, 0.8, 2.2)
        s += stext(ox + 80, 47.5, 'x', K, 4) + stext(ox - 5, 6, 'T', K, 4)
        s += stext(ox + 10, 53, title, K, 4.2)
        return s
    ox = 12
    b += axes(ox, 'T  constante') + stext(ox + 12.5, 54.2, 's', K, 3)
    b += wline(ox, 12, ox + 72, 12, S, 1.0, amp=0.2) + stext(ox + 66, 9.5, 'T', S, 4) + stext(ox + 68.6, 10.7, 's', S, 2.8)
    pts = [(ox + k * 72 / 20, 12 + 30 * math.exp(-2.6 * k / 20)) for k in range(21)]
    b += wcurve(pts, B, 1.0, amp=0.15) + stext(ox + 28, 34, 'T  (x)', B, 4) + stext(ox + 30.6, 35.2, 'm', B, 2.8)
    b += stext(ox + 1, 45, 'T', K, 3.4) + stext(ox + 3.2, 46, 'in', K, 2.4)
    b += warrow(ox + 5, 40.5, ox + 5, 13, S, 0.6, 1.6, both=True) + stext(ox + 7, 30, 'ΔT', S, 3.3) + stext(ox + 13.4, 31, 'in', S, 2.3)
    b += stext(ox + 42, 22, 'exponencial', B, 3.4)
    ox = 112
    b += axes(ox, 'q  constante') + stext(ox + 12.3, 54.2, 's', K, 3) + wcircle(ox + 11.6, 48.6, 0.35, K, 0.6)
    b += wline(ox, 42, ox + 72, 18, B, 1.0, amp=0.2) + stext(ox + 46, 33, 'T  (x)', B, 4) + stext(ox + 48.6, 34.2, 'm', B, 2.8)
    pts = [(ox + k * 72 / 20, 42 - 24 * k / 20 - (10 - 6 * math.exp(-k / 2.2))) for k in range(21)]
    b += wcurve(pts, S, 1.0, amp=0.15) + stext(ox + 30, 16, 'T  (x)', S, 4) + stext(ox + 32.6, 17.2, 's', S, 2.8)
    b += warrow(ox + 66, 20, ox + 66, 10.5, K, 0.6, 1.5, both=True) + stext(ox + 68, 17, 'q /h', K, 3.3) + wcircle(ox + 69.2, 12.9, 0.3, K, 0.5)
    b += stext(ox + 6, 30, 'lineal', B, 3.4)
    return svgfig(196, 5, b)


def plate_737():
    b = ''
    x0, y0, s = 32, 5, 28
    b += wrect(x0, y0, s, s, K, 0.9)
    for (x, y) in ((x0 + 5, y0 + 5), (x0 + 16, y0 + 5), (x0 + 5, y0 + 16), (x0 + 16, y0 + 16)):
        b += wrect(x, y, 6.5, 7, K, 0.7, fill='#2a2a2a')
    for yy in (11, 19, 27):
        b += warrow(3, yy, 27, yy, B, 0.8, 2.0)
    b += stext(2, 6, 'aire', B, 5)
    b += stext(x0 + 3, y0 + s + 6.5, '0,25 m', S, 4.6)
    b += stext(x0 + s + 2, y0 + 6, '65 °C', S, 4.6)
    return svgfig(76, 4, b)


def duct_845():
    b = ''
    x0, x1, yt, yb, dx, dy = 15, 52, 15, 26, 6, -5
    b += wline(x0, yt, x1, yt, K, 0.8) + wline(x0, yb, x1, yb, K, 0.8) + wline(x0, yt, x0, yb, K, 0.8) + wline(x1, yt, x1, yb, K, 0.8)
    b += wline(x0, yt, x0 + dx, yt + dy, K, 0.8) + wline(x1, yt, x1 + dx, yt + dy, K, 0.8) + wline(x0 + dx, yt + dy, x1 + dx, yt + dy, K, 0.8)
    b += wline(x1, yb, x1 + dx, yb + dy, K, 0.8) + wline(x1 + dx, yt + dy, x1 + dx, yb + dy, K, 0.8)
    b += warrow(1, 21, 12, 21, S, 0.9, 2.2) + stext(0, 13, '85 °C', S, 4.6)
    b += warrow(61, 20, 74, 20, S, 0.9, 2.2) + stext(63, 13, '¿T?', S, 4.6)
    b += stext(22, 23.5, '70 °C', K, 4.6)
    for xx in (22, 32, 42):
        b += warrow(xx + 3, 8, xx + 4, 2, '#b8471f', 0.7, 1.5)
    return svgfig(76, 3, b)


def collector_847():
    b = ''
    x0, x1, yg, yp = 14, 58, 10, 22
    b += wcircle(70, 5, 2.6, '#e8a317', 0.9)
    for k in range(8):
        a = k * math.pi / 4
        b += wline(70 + 3.8 * math.cos(a), 5 + 3.8 * math.sin(a), 70 + 5.6 * math.cos(a), 5 + 5.6 * math.sin(a), '#e8a317', 0.7, amp=0.1)
    b += wline(x0, yg, x1, yg, B, 1.2) + stext(x0 + 2, yg - 3, 'vidrio 20 °C', B, 4.4)
    b += wline(x0, yp, x1, yp, K, 2.2) + stext(x0 + 2, yp + 6.5, 'placa 60 °C', K, 4.4)
    for yy in (13, 16, 19):
        b += warrow(1, yy, 11, yy, S, 0.7, 1.8)
    b += warrow(65, 16, 75, 16, S, 0.8, 2.0)
    for xx in (22, 38):
        b += warrow(xx, yp - 1, xx, yp - 5.5, S, 0.6, 1.4) + warrow(xx + 6, yg + 5.5, xx + 6, yg + 1.2, B, 0.6, 1.4)
    b += warrow(52, yg + 1, 52, yp - 1.2, K, 0.5, 1.2, both=True) + stext(53.5, 18, '3 cm', K, 3.8)
    return svgfig(76, 3, b)


def cylinder_E1():
    b = ''
    cx, cy, R = 42, 16, 9
    for off in (-13, -7, 7, 13):
        pts = []
        for k in range(15):
            x = 4 + k * 5.0
            dxx = (x - cx) / (R * 1.6)
            bump = (R * 0.9) * math.exp(-dxx * dxx) * (1 if off > 0 else -1) * (8 / abs(off))
            pts.append((x, cy + off + bump * 0.6))
        b += wcurve(pts, B, 0.7, amp=0.15)
    b += warrow(2, 16, 18, 16, B, 0.8, 2.0)
    b += wcircle(cx, cy, R, S, 1.1) + stext(cx - 6.2, cy + 1.6, '80 °C', S, 4.4)
    b += stext(1, 6, 'aire', B, 4.6)
    return svgfig(76, 3, b)


def tube(kind):
    b = ''
    x0, x1, yt, yb = 14, 58, 12, 22
    b += wline(x0, yt, x1, yt, K, 1.1) + wline(x0, yb, x1, yb, K, 1.1)
    if kind == 'steam':
        b += wrect(x0 + 2, yt - 5, x1 - x0 - 4, yb - yt + 10, '#888', 0.5).replace('stroke-linecap="round"', 'stroke-linecap="round" stroke-dasharray="1.6 1.4"')
        b += stext(x0 + 8, yt - 6.5, 'pared 60 °C', S, 4.4)
        lab_in, lab_out = '10 °C', '¿T?'
    else:
        zz = [(x0 + 1 + k * 2.1, yt - (2.6 if k % 2 else 0.6)) for k in range(21)]
        b += wcurve(zz, S, 0.7, amp=0.05)
        zz2 = [(x0 + 1 + k * 2.1, yb + (2.6 if k % 2 else 0.6)) for k in range(21)]
        b += wcurve(zz2, S, 0.7, amp=0.05)
        b += stext(x0 + 6, yt - 4.5, '20 kW/m²', S, 4.4)
        lab_in, lab_out = '20 °C', '60 °C'
    for k in range(1, 5):
        yy = yt + (yb - yt) * k / 5
        eta = (yy - (yt + yb) / 2) / ((yb - yt) / 2)
        Lr = 8 * (1 - eta * eta) if kind == 'steam' else 8 * (1 - abs(eta) ** 6)
        b += warrow(32, yy, 32 + Lr, yy, B, 0.6, 1.3)
    b += warrow(1, 17, 11, 17, B, 0.8, 1.9) + warrow(61, 17, 74, 17, B, 0.8, 1.9)
    b += stext(0, 30, lab_in, B, 4.4) + stext(61, 30, lab_out, B, 4.4)
    return svgfig(76, 3, b)


def cover_doodle():
    b = ''
    # placa con capa límite
    for yy in (10, 17, 24):
        b += warrow(4, yy, 20, yy, B, 0.9, 2.2)
    b += wline(26, 30, 80, 30, K, 1.8)
    pts = [(26 + k * 2.7, 30 - 1.5 * math.sqrt(k * 2.7)) for k in range(21)]
    b += wcurve(pts, B, 0.9, amp=0.1)
    b += stext(34, 41, 'externa', B, 6.5)
    # tubo
    b += wline(104, 14, 170, 14, K, 1.2) + wline(104, 30, 170, 30, K, 1.2)
    for k in range(1, 6):
        yy = 14 + 16 * k / 6
        eta = (yy - 22) / 8
        b += warrow(128, yy, 128 + 14 * (1 - eta * eta), yy, S, 0.7, 1.5)
    for xx in range(108, 170, 12):
        b += warrow(xx, 4, xx, 12, S, 0.7, 1.5) + warrow(xx + 6, 40, xx + 6, 32, S, 0.7, 1.5)
    b += stext(122, 50, 'interna', S, 6.5)
    return svgfig(180, 5, b)


def mapa():
    E, I = B, S
    def ln(s, cls=''):
        return f'<div class="bl {cls}">{H.T(s)}</div>'
    boxes = [
        (24, 1, 148, 14, H.T('¿El fluido [u]rodea al cuerpo[/u] o va [u]por dentro[/u] de un tubo?'), K, False),
        (3, 26, 90, 11, H.T('EXTERNA'), E, False),
        (103, 26, 90, 11, H.T('INTERNA'), I, False),
        (3, 44, 90, 13, H.T('1. propiedades a $T_f = (T_s + T_\\infty)/2$'), E, False),
        (3, 64, 90, 58, ln('2. ¿geometría?', 'c') + ln('[k]placa:[/k] $Re_L = VL/\\nu$') + ln('$< 5 \\times 10^5$: $Nu = 0,664 Re_L^{0,5} Pr^{1/3}$') +
         ln('$> 5 \\times 10^5$: $(0,037 Re_L^{0,8} - 871) Pr^{1/3}$') + ln('[k]cilindro:[/k] Churchill–Bernstein') +
         ln('[k]esfera:[/k] Whitaker (props a $T_\\infty$)') + ln('[k]banco de tubos:[/k] Zukauskas'), E, True),
        (3, 129, 90, 12, H.T('3. $h = Nu\\,k / L_c$'), E, False),
        (3, 148, 90, 13, H.T('4. $\\dot{Q} = h A_s (T_s - T_\\infty)$'), E, False),
        (103, 44, 90, 13, H.T('1. supón $T_{out}$ → $T_b$ → propiedades'), I, False),
        (103, 64, 90, 16, H.T('2. $D_h = 4A_c/p$ · $V = \\dot{V}/A_c$ · $Re = V D_h / \\nu$'), I, False),
        (103, 87, 90, 40, ln('3. ¿régimen?', 'c') + ln('[k]Re < 2300:[/k] laminar → 3,66 / 4,36 o entrada') +
         ln('[k]2300–10 000:[/k] Gnielinski') + ln('[k]Re > 10 000:[/k] Dittus–Boelter') + ln('n = 0,4 calienta · 0,3 enfría'), I, True),
        (103, 134, 90, 12, H.T('4. $h = Nu\\,k / D_h$'), I, False),
        (103, 153, 90, 28, ln('5. ¿pared?', 'c') + ln('[k]$T_s$ cte:[/k] $T_{out} = T_s - (T_s - T_{in}) e^{-hA_s/\\dot{m} c_p}$') +
         ln('[k]$\\dot{q}_s$ cte:[/k] $\\dot{Q} = \\dot{q}_s A_s$ · $T_s = T_m + \\dot{q}_s / h$'), I, True),
        (103, 188, 90, 14, H.T('6. $\\dot{Q} = \\dot{m} c_p (T_{out} - T_{in})$ · ¡verificar $T_{out}$!'), I, False),
    ]
    d = ''
    d += warrow(80, 15.5, 52, 25, K, 0.8, 2.2) + warrow(116, 15.5, 144, 25, K, 0.8, 2.2)
    for (a, b_) in ((37, 44), (57, 64), (122, 129), (141, 148)):
        d += warrow(48, a + 0.5, 48, b_ - 0.8, E, 0.7, 1.8)
    for (a, b_) in ((37, 44), (57, 64), (80, 87), (127, 134), (146, 153), (181, 188)):
        d += warrow(148, a + 0.5, 148, b_ - 0.8, I, 0.7, 1.8)
    return boxdiag(196, 20, boxes, d)

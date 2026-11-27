# -*- coding: utf-8 -*-
"""Formularios: convección externa (cap. 7) e interna (cap. 8)."""
import svgs
from content_a import chapter_head

B = '<span class="board">pizarra</span>'
C = '<span class="cls">clase</span>'


def row(case, formula, when, sub=''):
    s = f'<small>{sub}</small>' if sub else ''
    return f'<tr><td class="case">{case}{s}</td><td class="f">{formula}</td><td class="when">{when}</td></tr>'


def ftable(rows, head=('Caso', 'Correlación', 'Úsala cuando…')):
    h = ''.join(f'<th>{x}</th>' for x in head)
    return f'<table class="t"><thead><tr>{h}</tr></thead><tbody>{"".join(rows)}</tbody></table>'


# ------------------------------------------------------------------ 4. externa
def externa():
    placa = ftable([
        row('Laminar · promedio ' + C, r'\[\NU = \frac{hL}{k} = 0.664\,\RE_L^{0.5}\,\PR^{1/3}\]',
            r'\(\RE_L < 5\times10^5\) y \(\PR > 0.6\). Es la más usada (ejercicio 7-37).', 'la más usada'),
        row('Laminar · local', r'\[\NU_x = \frac{h_x\,x}{k} = 0.332\,\RE_x^{0.5}\,\PR^{1/3}\]',
            r'\(\RE_x < 5\times10^5\). Relación útil: \(h_{\mathrm{prom}} = 2\,h_{x=L}\).', 'en un punto x'),
        row('Combinada · promedio', r'\[\NU = \left(0.037\,\RE_L^{0.8} - 871\right)\PR^{1/3}\]',
            r'\(5\times10^5 \le \RE_L \le 10^7\), \(0.6 \le \PR \le 60\). Placa larga: tramo laminar al inicio y turbulento después. Es la que corresponde si \(\RE_L > 5\times10^5\).',
            'laminar + turbulenta'),
        row('Turbulenta en toda la placa', r'\[\NU = 0.037\,\RE_L^{0.8}\,\PR^{1/3} \qquad \NU_x = 0.0296\,\RE_x^{0.8}\,\PR^{1/3}\]',
            r'Solo si la capa límite es turbulenta <b>desde el borde de ataque</b> (placa rugosa o con un alambre que "dispara" la turbulencia).',
            'promedio y local'),
        row('Flujo de calor uniforme', r'\[\NU_x = 0.453\,\RE_x^{0.5}\PR^{1/3}\ (\text{lam.}) \qquad \NU_x = 0.0308\,\RE_x^{0.8}\PR^{1/3}\ (\text{turb.})\]',
            r'Placa con \(\qs\) constante: \(\Qd = \qs A_s\) y \(T_s(x) = T_\infty + \qs/h_x\) (la máxima, al final de la placa).', 'local'),
        row('Tramo inicial sin calentar ξ',
            r'\[\NU_x = \frac{0.332\,\RE_x^{0.5}\PR^{1/3}}{\left[1-(\xi/x)^{3/4}\right]^{1/3}}\ (\text{lam.}) \qquad \NU_x = \frac{0.0296\,\RE_x^{0.8}\PR^{1/3}}{\left[1-(\xi/x)^{9/10}\right]^{1/9}}\ (\text{turb.})\]'
            r'\[h = \frac{2\left[1-(\xi/L)^{3/4}\right]}{1-\xi/L}\,h_{x=L}\ (\text{lam.}) \qquad h = \frac{5\left[1-(\xi/L)^{9/10}\right]}{4\,(1-\xi/L)}\,h_{x=L}\ (\text{turb.})\]',
            r'La placa solo se calienta desde \(x = \xi\). Arriba, el Nu local; abajo, el \(h\) promedio de toda la placa.',
            'local y promedio'),
        row('Fricción y arrastre', r'\[C_f = \frac{1.33}{\RE_L^{0.5}}\ (\text{lam.}) \quad \frac{0.074}{\RE_L^{1/5}}\ (\text{turb.}) \quad \frac{0.074}{\RE_L^{1/5}} - \frac{1742}{\RE_L}\ (\text{comb.})\]',
            r'Si piden fuerza: \(F_D = C_f\,A_s\,\dfrac{\rho V^2}{2}\).', 'solo si lo piden'),
    ])
    hil = r'''<table class="t num compact" style="width:86%;margin:3pt auto 0;font-size:7.8pt">
<thead><tr><th>Re</th><th>C</th><th>m</th></tr></thead><tbody>
<tr><td>0,4 – 4</td><td>0,989</td><td>0,330</td></tr><tr><td>4 – 40</td><td>0,911</td><td>0,385</td></tr>
<tr><td>40 – 4000</td><td>0,683</td><td>0,466</td></tr><tr><td>4000 – 40 000</td><td>0,193</td><td>0,618</td></tr>
<tr><td>40 000 – 400 000</td><td>0,027</td><td>0,805</td></tr></tbody></table>'''
    cil = ftable([
        row('Churchill–Bernstein',
            r'\[\NU = \frac{hD}{k} = 0.3 + \frac{0.62\,\RE^{1/2}\,\PR^{1/3}}{\left[1 + (0.4/\PR)^{2/3}\right]^{1/4}}\left[1 + \left(\frac{\RE}{282\,000}\right)^{5/8}\right]^{4/5}\]',
            r'\(\RE\,\PR > 0.2\). Sirve para todo el rango de Re. Calcúlala por partes (ejemplo E1).', 'la del libro'),
        row('Hilpert', r'\[\NU = C\,\RE^{m}\,\PR^{1/3}\]' + hil,
            r'Más rápida, con resultados parecidos (±10–20 %). Para cilindros no circulares (cuadrado, hexágono…) usa la tabla 7-1 del libro.', 'cilindro circular'),
    ])
    esf = ftable([
        row('Whitaker',
            r'\[\NU = \frac{hD}{k} = 2 + \left[0.4\,\RE^{1/2} + 0.06\,\RE^{2/3}\right]\PR^{0.4}\left(\frac{\mu_\infty}{\mu_s}\right)^{1/4}\]',
            r'\(3.5 \le \RE \le 80\,000\), \(0.7 \le \PR \le 380\). Propiedades a \(T_\infty\), salvo \(\mu_s\) a \(T_s\). \(A_s = \pi D^2\). Si \(V \to 0\), \(\NU \to 2\) (conducción pura).',
            'props a T∞'),
    ])
    zuk = r'''<table class="t num compact" style="font-size:7.9pt">
<thead><tr><th>Disposición</th><th>\(\RE_D\)</th><th>\(\NU_D\) (multiplicar por \((\PR/\PR_s)^{0.25}\))</th></tr></thead><tbody>
<tr><td rowspan="4">En línea</td><td>0 – 100</td><td>\(0.9\,\RE_D^{0.4}\PR^{0.36}\)</td></tr>
<tr><td>100 – 1000</td><td>\(0.52\,\RE_D^{0.5}\PR^{0.36}\)</td></tr>
<tr><td class="nw">1000 – 2×10<sup>5</sup></td><td>\(0.27\,\RE_D^{0.63}\PR^{0.36}\)</td></tr>
<tr><td class="nw">2×10<sup>5</sup> – 2×10<sup>6</sup></td><td>\(0.033\,\RE_D^{0.8}\PR^{0.4}\)</td></tr>
<tr><td rowspan="4">Escalonado</td><td>0 – 500</td><td>\(1.04\,\RE_D^{0.4}\PR^{0.36}\)</td></tr>
<tr><td>500 – 1000</td><td>\(0.71\,\RE_D^{0.5}\PR^{0.36}\)</td></tr>
<tr><td class="nw">1000 – 2×10<sup>5</sup></td><td>\(0.35\,(S_T/S_L)^{0.2}\RE_D^{0.6}\PR^{0.36}\)</td></tr>
<tr><td class="nw">2×10<sup>5</sup> – 2×10<sup>6</sup></td><td>\(0.031\,(S_T/S_L)^{0.2}\RE_D^{0.8}\PR^{0.36}\)</td></tr>
</tbody></table>
<table class="t num compact" style="font-size:7.6pt"><thead><tr><th>\(N_L\)</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>7</th><th>10</th><th>13</th></tr></thead>
<tbody><tr><td>F en línea</td><td>0,70</td><td>0,80</td><td>0,86</td><td>0,90</td><td>0,93</td><td>0,96</td><td>0,98</td><td>0,99</td></tr>
<tr><td>F escalonado</td><td>0,64</td><td>0,76</td><td>0,84</td><td>0,89</td><td>0,93</td><td>0,96</td><td>0,98</td><td>0,99</td></tr></tbody></table>'''
    return chapter_head(4, 'Capítulo 7 · el fluido rodea al cuerpo', 'Formulario: convección externa') + r'''
<div class="box c" style="margin-top:0"><div class="box-label">Reglas generales de la externa</div>
Propiedades a \(T_f = (T_s+T_\infty)/2\) (salvo la esfera) · \(\RE = V L_c/\nu\) con la velocidad de la corriente libre \(V\) · \(h = \NU\,k/L_c\) · \(\Qd = hA_s(T_s - T_\infty)\).
</div>
<h2>4.1 Placa plana con flujo paralelo <span class="tag">\(L_c = L\)</span></h2>
''' + placa + r'''
<h2>4.2 Cilindro en flujo cruzado <span class="tag">\(L_c = D\) · props a \(T_f\)</span></h2>
''' + cil + r'''
<h2>4.3 Esfera <span class="tag">\(L_c = D\) · props a \(T_\infty\)</span></h2>
''' + esf + r'''
<h2>4.4 Banco de tubos (Zukauskas) <span class="tag">si lo vieron en clase</span></h2>
<div class="grid2 avoid">
<div class="small">
<p><b>1. Velocidad máxima</b> (en el paso más estrecho entre tubos):</p>
\[\text{En línea:}\quad V_{max} = \frac{S_T}{S_T - D}\,V\]
\[\text{Escalonado:}\quad V_{max} = \frac{S_T}{S_T - D}\,V \ \ \text{si } S_D > \tfrac{S_T + D}{2}\]
\[\text{si no:}\quad V_{max} = \frac{S_T}{2(S_D - D)}\,V\]
<p>con \(S_D = \sqrt{S_L^2 + (S_T/2)^2}\). Luego \(\RE_D = \rho\,V_{max}\,D/\mu\).</p>
<p><b>2. Propiedades</b> a la media de las temperaturas de entrada y salida del fluido (\(\PR_s\) a \(T_s\)).</p>
<p><b>3. Nusselt</b> con la tabla (válida para \(N_L \ge 16\) y \(0.7 < \PR < 500\)). Si hay menos filas, \(\NU_{D,N_L} = F\,\NU_D\).</p>
<p><b>4. Calor:</b> \(\Tout = T_s - (T_s - \Tin)\,e^{-A_s h/\md c_p}\) y \(\Qd = hA_s\DTln\), con \(A_s = N\pi D L\) y \(\md = \rho_\infty V (N_T S_T L)\).</p>
</div>
<div>''' + zuk + r'''</div>
</div>

<h2>4.5 Resumen visual de la externa</h2>
<div class="geo">
<div class="gcard"><div class="gi">''' + svgs.icon('placa') + r'''</div><h4>Placa plana</h4><ul>
<li>\(L_c = L\) (en la dirección del flujo)</li><li>\(A_s = L\,w\) (¿una o dos caras?)</li><li>Laminar si \(\RE_L < 5\times10^5\)</li>
<li>0,664… o combinada (−871)</li><li>Propiedades a \(T_f\)</li></ul></div>
<div class="gcard"><div class="gi">''' + svgs.icon('cil') + r'''</div><h4>Cilindro (flujo cruzado)</h4><ul>
<li>\(L_c = D\)</li><li>\(A_s = \pi D L\)</li><li>Churchill–Bernstein o Hilpert</li><li>Propiedades a \(T_f\)</li></ul></div>
<div class="gcard"><div class="gi">''' + svgs.icon('esf') + r'''</div><h4>Esfera</h4><ul>
<li>\(L_c = D\)</li><li>\(A_s = \pi D^2\)</li><li>Whitaker (Nu → 2 si V → 0)</li><li>Propiedades a \(T_\infty\); \(\mu_s\) a \(T_s\)</li></ul></div>
<div class="gcard"><div class="gi">''' + svgs.icon('banco') + r'''</div><h4>Banco de tubos</h4><ul>
<li>Re con \(V_{max}\) y \(D\)</li><li>\(A_s = N\pi D L\)</li><li>Zukauskas (+ F si \(N_L < 16\))</li><li>Props a la T media; \(\Qd\) con \(\DTln\)</li></ul></div>
</div>
<div class="box warn" style="margin-top:8pt"><div class="box-label">Ojo con la placa plana</div>
Si \(\RE_L > 5\times10^5\), no uses la fórmula "todo turbulento" (0,037 sin el −871) a menos que el enunciado diga que la capa límite es turbulenta desde el borde: en el ejercicio P1 eso duplica el resultado.
</div>
'''


# ------------------------------------------------------------------ 5. interna
def interna():
    lam_tab = r'''<table class="t num compact">
<thead><tr><th>Sección</th><th>a/b</th><th>Nu (\(T_s\) cte)</th><th>Nu (\(\qs\) cte)</th><th>\(f\cdot\RE\)</th></tr></thead><tbody>
<tr><td>Circular ''' + B + r'''</td><td>—</td><td><b>3,66</b></td><td><b>4,36</b></td><td>64,00</td></tr>
<tr><td rowspan="6">Rectangular<br><span class="small muted">a/b = lado mayor / lado menor</span></td><td class="nw">1 (cuadrado)</td><td>2,98</td><td>3,61</td><td>56,92</td></tr>
<tr><td>2</td><td>3,39</td><td>4,12</td><td>62,20</td></tr>
<tr><td>3</td><td>3,96</td><td>4,79</td><td>68,36</td></tr>
<tr><td>4</td><td>4,44</td><td>5,33</td><td>72,92</td></tr>
<tr><td>6</td><td>5,14</td><td>6,05</td><td>78,80</td></tr>
<tr><td>8</td><td>5,60</td><td>6,49</td><td>82,32</td></tr>
<tr><td>Placas paralelas</td><td>∞</td><td>7,54</td><td>8,24</td><td>96,00</td></tr>
</tbody></table>'''
    entrada = ftable([
        row('Tubo circular (Edwards) ' + B,
            r'\[\NU = 3.66 + \frac{0.065\,(D/L)\,\RE\,\PR}{1 + 0.04\left[(D/L)\,\RE\,\PR\right]^{2/3}}\]',
            r'Laminar, \(T_s\) cte, tubo "corto" (L comparable a \(L_t\)). Da el Nu promedio de todo el tubo. Si \(L\to\infty\), tiende a 3,66.', 'región de entrada'),
        row('Sieder–Tate',
            r'\[\NU = 1.86\left(\frac{\RE\,\PR\,D}{L}\right)^{1/3}\left(\frac{\mu_b}{\mu_s}\right)^{0.14}\]',
            r'Desarrollo simultáneo (velocidad y temperatura), \(0.6 < \PR < 5\), \(0.0044 < \mu_b/\mu_s < 9.75\). \(\mu_s\) a \(T_s\).', 'tubos cortos'),
        row('Placas paralelas ' + B,
            r'\[\NU = 7.54 + \frac{0.03\,(D_h/L)\,\RE\,\PR}{1 + 0.016\left[(D_h/L)\,\RE\,\PR\right]^{2/3}}\]',
            r'"Aletas planas paralelas": placas isotérmicas, \(\RE \le 2800\). \(D_h = 2s\) (s = separación).', 'aletas planas paralelas'),
    ])
    turb = ftable([
        row('Dittus–Boelter ' + B + C,
            r'\[\NU = 0.023\,\RE^{0.8}\,\PR^{\,n} \qquad \begin{cases} n = 0.4 & \text{calentamiento } (T_s > T_m)\\ n = 0.3 & \text{enfriamiento } (T_s < T_m)\end{cases}\]',
            r'\(\RE > 10\,000\), \(0.7 \le \PR \le 160\), \(L/D > 10\). La de clase: 8-39 y 8-47 (n = 0,4), 8-45 (n = 0,3).', 'la de clase'),
        row('Colburn', r'\[\NU = 0.023\,\RE^{0.8}\,\PR^{1/3}\]', r'Mismo rango. Versión que no distingue calentar de enfriar.'),
        row('Gnielinski ' + B,
            r'\[\NU = \frac{(f/8)\,(\RE - 1000)\,\PR}{1 + 12.7\,(f/8)^{0.5}\left(\PR^{2/3} - 1\right)}\]',
            r'\(3\times10^3 < \RE < 5\times10^6\), \(0.5 \le \PR \le 2000\). Más exacta y la <b>única válida en transición</b>. Necesita \(f\).', 'más exacta'),
        row('Petukhov (f, tubo liso) ' + B, r'\[f = \left(0.790\,\ln\RE - 1.64\right)^{-2}\]',
            r'\(3000 < \RE < 5\times10^6\). <b>Ojo: exponente −2</b> (en la foto de la pizarra se ve como "2"): f debe dar ≈ 0,02–0,04. ln = logaritmo natural.', 'superficies lisas'),
        row('Colebrook (f, tubo rugoso) ' + B, r'\[\frac{1}{\sqrt f} = -2.0\,\log\!\left(\frac{\varepsilon/D}{3.7} + \frac{2.51}{\RE\sqrt f}\right)\]',
            r'Turbulento con rugosidad ε. Es implícita: itera (arranca con Haaland). log = base 10.', 'superficies rugosas'),
        row('Haaland (f explícito)', r'\[\frac{1}{\sqrt f} \cong -1.8\,\log\!\left[\frac{6.9}{\RE} + \left(\frac{\varepsilon/D}{3.7}\right)^{1.11}\right]\]',
            r'Da f directo (±2 % de Colebrook). Buen valor inicial.'),
    ])
    return chapter_head(5, 'Capítulo 8 · el fluido va por dentro', 'Formulario: convección interna') + r'''
<div class="grid2">
<div>
<h3 style="margin-top:0">5.1 Relaciones básicas</h3>
<div class="small">
\[\md = \rho\,V_{\mathrm{prom}}\,A_c = \rho\,\Vd \qquad A_c = \frac{\pi D^2}{4}\ \ (\text{circular}) \qquad D_h = \frac{4A_c}{p}\]
\[\RE = \frac{V_{\mathrm{prom}}\,D_h}{\nu} \qquad \text{circular: } \RE = \frac{4\,\md}{\pi D\mu} \qquad \Qd = \md\,c_p\,(T_{\mathrm{out}} - T_{\mathrm{in}})\]
<p>Laminar: Re &lt; 2300 · transición: 2300–10 000 · turbulento: Re &gt; 10 000. Propiedades a \(T_b = (T_{\mathrm{in}} + T_{\mathrm{out}})/2\).</p>
</div>
<h3>5.2 Longitudes de entrada</h3>
<div class="small">
\[\text{Laminar: } L_h \approx 0.05\,\RE\,D \qquad L_t \approx 0.05\,\RE\,\PR\,D = \PR\,L_h\]
\[\text{Turbulento: } L_h \approx L_t \approx 10\,D\]
<p>Si \(L \gg L_t\): usa valores de flujo <b>completamente desarrollado</b>. Si L es comparable a \(L_t\) (típico en laminar), usa una correlación de <b>región de entrada</b>. En turbulento casi siempre \(L \gg 10D\).</p>
</div>
</div>
<div>
<h3 style="margin-top:0">5.3 Condición térmica en la pared</h3>
<div class="box c" style="margin-top:0"><div class="box-label">Temperatura superficial constante (\(T_s\) = cte)</div>
\[T_{\mathrm{out}} = T_s - (T_s - T_{\mathrm{in}})\exp\!\left(-\frac{h A_s}{\md\,c_p}\right)\]
\[\Delta T_{\mathrm{ln}} = \frac{T_{\mathrm{in}} - T_{\mathrm{out}}}{\ln\dfrac{T_s - T_{\mathrm{out}}}{T_s - T_{\mathrm{in}}}}\]
\[\Qd = h\,A_s\,\Delta T_{\mathrm{ln}} = \md\,c_p\,(T_{\mathrm{out}} - T_{\mathrm{in}})\]
<p class="small">\(\mathrm{NTU} = hA_s/\md c_p\): si NTU &gt; 5, \(T_{\mathrm{out}} \approx T_s\) (alargar el tubo ya no sirve). Si el fluido se enfría, \(\Delta T_{\mathrm{ln}}\) y \(\Qd\) salen <b>negativos</b>: el fluido pierde calor.</p>
</div>
<div class="box c"><div class="box-label">Flujo de calor constante (\(\qs\) = cte)</div>
\[\Qd = \qs\,A_s = \md\,c_p\,(T_{\mathrm{out}} - T_{\mathrm{in}})\]
\[T_{\mathrm{out}} = T_{\mathrm{in}} + \frac{\qs\,A_s}{\md\,c_p} \qquad T_s = T_m + \frac{\qs}{h}\]
<p class="small">\(T_m\) crece en línea recta y la pared va siempre \(\qs/h\) por encima: la \(T_s\) <b>máxima está a la salida</b>.</p>
</div>
</div>
</div>
<figure style="width:80%;margin:4pt auto">''' + svgs.tx_plots() + r'''<figcaption>Evolución de la temperatura media del fluido \(T_m\) a lo largo del tubo. Con \(T_s\) constante, \(T_m\) se acerca exponencialmente a \(T_s\) (por eso se usa \(\Delta T_{\mathrm{ln}}\) y no el promedio aritmético). Con \(\qs\) constante, \(T_m\) y \(T_s\) son rectas paralelas (salvo en la entrada, donde \(h\) es mayor).</figcaption></figure>

<div class="grid2">
<div>
<h3>5.4 Laminar completamente desarrollado</h3>
<p class="small">Circular: \(\NU = hD/k\) = <b>3,66</b> (\(T_s\) cte) o <b>4,36</b> (\(\qs\) cte), y \(f = 64/\RE\). Para otras secciones, usa \(D_h\) en Re y en Nu:</p>
''' + lam_tab + r'''
</div>
<div>
<h3>5.5 Caída de presión y potencia de bombeo</h3>
<div class="small">
\[\Delta P = f\,\frac{L}{D_h}\,\frac{\rho\,V_{\mathrm{prom}}^2}{2} \qquad \dot W_{\mathrm{bomba}} = \Vd\,\Delta P = \frac{\md\,\Delta P}{\rho}\]
<p>Laminar: \(f = 64/\RE\) (circular) o \(f = (f\RE)/\RE\) con la tabla. Turbulento: Petukhov (liso) o Colebrook/Haaland (rugoso).</p>
</div>
<h3>5.6 Anillo (tubo doble)</h3>
<p class="small">\(D_h = D_o - D_i\). Laminar desarrollado con una superficie aislada y la otra isotérmica:</p>
<table class="t num compact" style="font-size:7.8pt"><thead><tr><th>\(D_i/D_o\)</th><th>0,05</th><th>0,10</th><th>0,25</th><th>0,50</th><th>1,00</th></tr></thead>
<tbody><tr><td>\(\NU_i\)</td><td>17,46</td><td>11,56</td><td>7,37</td><td>5,74</td><td>4,86</td></tr>
<tr><td>\(\NU_o\)</td><td>4,06</td><td>4,11</td><td>4,23</td><td>4,43</td><td>4,86</td></tr></tbody></table>
<p class="small">Turbulento: Dittus–Boelter con \(D_h\).</p>
</div>
</div>

<h3>5.7 Laminar en la región de entrada (\(T_s\) cte)</h3>
''' + entrada + r'''
<h3>5.8 Turbulento (completamente desarrollado)</h3>
''' + turb + r'''
<div class="box tip"><div class="box-label">Ductos no circulares en turbulento</div>
Se usan las mismas correlaciones del tubo circular con \(D_h\) en lugar de D (así se hizo en el 8-45 y el 8-47).
</div>

<div class="box c avoid" style="margin-top:8pt"><div class="box-label">Resumen: ¿qué Nusselt uso en interna?</div>
<table class="t compact" style="margin:2pt 0 0 0;font-size:8.6pt"><tbody>
<tr><td style="width:38%"><b>Laminar</b> y \(L \gg L_t\) (desarrollado)</td><td>3,66 (\(T_s\) cte) · 4,36 (\(\qs\) cte) · no circulares: tabla de 5.4 con \(D_h\)</td></tr>
<tr><td><b>Laminar</b> y L comparable a \(L_t\)</td><td>Edwards (circular) · placas paralelas · Sieder–Tate (tubos cortos)</td></tr>
<tr><td><b>Transición</b> (2300 &lt; Re &lt; 10 000)</td><td>Gnielinski con f de Petukhov</td></tr>
<tr><td><b>Turbulento</b>, tubo liso (Re &gt; 10 000)</td><td>Dittus–Boelter (n = 0,4 calienta / 0,3 enfría) o Gnielinski</td></tr>
<tr><td><b>Turbulento</b>, tubo rugoso</td><td>Gnielinski con f de Colebrook o Haaland</td></tr>
</tbody></table></div>
'''

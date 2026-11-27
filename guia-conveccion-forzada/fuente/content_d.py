# -*- coding: utf-8 -*-
"""Ejemplos extra, práctica, errores típicos, tablas de propiedades y hoja resumen."""
import svgs
from content_a import chapter_head, step
from content_c import ex_head


# ------------------------------------------------------------------ 7. extras
def e1():
    s1 = (
        step(1, 'Película y propiedades',
             r'<p>\(T_f = (80 + 20)/2 = 50\) °C → \(k = 0.02735\), \(\nu = 1.798\times10^{-5}\), \(\PR = 0.7228\)</p>') +
        step(2, 'Reynolds', r'\[\RE = \frac{VD}{\nu} = \frac{(10)(0.05)}{1.798\times10^{-5}} = 27\,809\]') +
        step(3, 'Churchill–Bernstein, por partes',
             r'<p>\(A = 0.62\,\RE^{1/2}\PR^{1/3} = 0.62(166.8)(0.8974) = 92.79\)<br>'
             r'\(B = \left[1 + (0.4/\PR)^{2/3}\right]^{1/4} = 1.1375\)<br>'
             r'\(C = \left[1 + (\RE/282\,000)^{5/8}\right]^{4/5} = 1.1840\)</p>'
             r'\[\NU = 0.3 + \frac{A}{B}\,C = 0.3 + \frac{92.79}{1.1375}(1.1840) = 96.9\]'
             r'<p class="small">Con Hilpert (C = 0,193, m = 0,618): Nu = 96,6, casi igual.</p>')
    )
    s2 = (
        step(4, 'Coeficiente de convección', r'\[h = \frac{\NU\,k}{D} = \frac{(96.9)(0.02735)}{0.05} = 53.0\un{W/m^2\cdot K}\]') +
        step(5, 'Área (por metro de tubería)', r'\[A_s = \pi D L = \pi(0.05)(1) = 0.1571\un{m^2}\]') +
        step(6, 'Calor', r'\[\Qd = hA_s(T_s - T_\infty) = (53.0)(0.1571)(80 - 20) = 500\un{W}\]')
    )
    return r'''<article class="example ext avoid">''' + ex_head('Ejemplo E1', 'Tubería expuesta al viento', ['Externa', 'Cilindro', 'Churchill–Bernstein']) + r'''
<div class="ex-top">
<div><span class="lbl">Enunciado</span>
<p>Una tubería de 5 cm de diámetro exterior, con su superficie a 80 °C, está expuesta a viento a 20 °C que sopla perpendicular a ella a 10 m/s.
Determina la pérdida de calor por metro de tubería.</p>
<span class="lbl">Suposiciones</span><p class="small">Estacionario · superficie isotérmica · radiación despreciable · aire a 1 atm.</p></div>
<div class="ex-fig">''' + svgs.fig_cyl() + r'''</div></div>
<div class="grid2 calc"><div class="steps">''' + s1 + r'''</div><div class="steps">''' + s2 + r'''
<div class="result" style="margin-top:4pt"><span class="result-label">Resultado</span><span>\(h \approx 53\un{W/m^2\cdot K}\) · \(\Qd \approx 500\) W por metro</span></div>
<div class="learn"><div class="box-label">Lo que enseña</div><ul>
<li>En el cilindro, \(L_c = D\) y la velocidad es la del viento.</li>
<li>Churchill–Bernstein es larga: calcúlala en tres partes (A, B, C) para no equivocarte con la calculadora.</li></ul></div>
</div></div>
</article>'''


def e2():
    s1 = (
        step(1, 'Suponer \\(\\Tout\\) y propiedades',
             r'<p>Supongo \(\Tout \approx 50\) °C → \(T_b = 30\) °C → A-9: \(\rho = 996\), \(c_p = 4178\), \(k = 0.615\), \(\mu = 0.798\times10^{-3}\), \(\PR = 5.42\)</p>') +
        step(2, 'Reynolds (directo con ṁ) y longitudes de entrada',
             r'\[\RE = \frac{4\md}{\pi D\mu} = \frac{4(0.01)}{\pi(0.02)(0.798\times10^{-3})} = 798 < 2300 \Rightarrow \text{laminar}\]'
             r'<p>\(L_h \approx 0.05\RE D = 0.80\) m · \(L_t \approx 0.05\RE\PR D = 4.32\) m: es comparable a L = 10 m, así que la región de entrada térmica importa → <b>Edwards</b>.</p>') +
        step(3, 'Nusselt en la región de entrada',
             r'\[\frac{D}{L}\,\RE\,\PR = \frac{0.02}{10}(798)(5.42) = 8.65\]\[\NU = 3.66 + \frac{0.065(8.65)}{1 + 0.04(8.65)^{2/3}} = 4.14\]')
    )
    s2 = (
        step(4, 'Coeficiente de convección',
             r'\[h = \frac{(4.14)(0.615)}{0.02} = 127.3\un{W/m^2\cdot K}\]<p class="small">Con 3,66 saldría 112,5 W/m²·K (12 % menos).</p>') +
        step(5, 'Temperatura de salida',
             r'<p>\(A_s = \pi D L = \pi(0.02)(10) = 0.6283\) m²</p>'
             r'\[\frac{hA_s}{\md c_p} = \frac{(127.3)(0.6283)}{(0.01)(4178)} = 1.915\]\[\Tout = 60 - (60 - 10)\,e^{-1.915} = 52.6\ ^\circ\mathrm{C}\]') +
        step(6, 'Calor y comprobación',
             r'\[\Qd = \md c_p (\Tout - \Tin) = (0.01)(4178)(42.6) = 1781\un{W}\]'
             r'<p>\(T_b\) real = 31,3 °C ≈ 30 °C supuesto ✓</p>')
    )
    return r'''<article class="example int avoid">''' + ex_head('Ejemplo E2', 'Agua en flujo laminar con región de entrada', ['Interna', 'Laminar', '\\(T_s\\) cte']) + r'''
<div class="ex-top">
<div><span class="lbl">Enunciado</span>
<p>Entra agua a 10 °C, con \(\md = 0.01\) kg/s, a un tubo de 2 cm de diámetro interior y 10 m de largo. Por fuera se condensa vapor, de modo que la pared
se mantiene a 60 °C. Determina la temperatura de salida del agua y el calor transferido.</p></div>
<div class="ex-fig">''' + svgs.fig_tube('steam') + r'''</div></div>
<div class="grid2 calc"><div class="steps">''' + s1 + r'''</div><div class="steps">''' + s2 + r'''</div></div>
<div class="result"><span class="result-label">Resultado</span><span>\(T_{\mathrm{out}} \approx 52.6\) °C · \(\Qd \approx 1.78\) kW</span></div>
<div class="learn"><div class="box-label">Lo que enseña</div><ul>
<li>En laminar, compara L con \(L_t\) para decidir entre "3,66" (desarrollado) y la correlación de entrada. En turbulento casi nunca hace falta.</li>
<li>Si te dan \(\md\) en un tubo circular, \(\RE = 4\md/(\pi D\mu)\): no necesitas calcular la velocidad.</li>
<li>Agua en laminar da \(h\) de unos cientos de W/m²·K; en turbulento, miles (compara con el 8-39).</li></ul></div>
</article>'''


def e3():
    s1 = (
        step(1, 'Propiedades (aquí \\(\\Tout\\) es dato: no hay que suponer)',
             r'<p>\(T_b = (20 + 60)/2 = 40\) °C → A-9: \(\rho = 992.1\), \(c_p = 4179\), \(k = 0.631\), \(\mu = 0.653\times10^{-3}\), \(\PR = 4.32\) → \(\nu = \mu/\rho = 6.582\times10^{-7}\un{m^2/s}\)</p>') +
        step(2, '(a) Longitud necesaria (solo con el balance de energía)',
             r'<p>\(\Vd = 8\) L/min \(= 1.333\times10^{-4}\un{m^3/s}\) → \(\md = \rho\Vd = 0.1323\) kg/s</p>'
             r'\[\Qd = \md c_p (T_{\mathrm{out}} - T_{\mathrm{in}}) = (0.1323)(4179)(40) = 22.1\un{kW}\]'
             r'\[A_s = \frac{\Qd}{\qs} = \frac{22\,110}{20\,000} = 1.106\un{m^2} \qquad L = \frac{A_s}{\pi D} = 17.6\un{m}\]')
    )
    s2 = (
        step(3, '(b) Temperatura de la pared a la salida',
             r'<p>\(\Vp = \Vd/A_c = 0.424\) m/s → \(\RE = (0.424)(0.02)/(6.582\times10^{-7}) = 12\,896\): turbulento y desarrollado (\(L/D = 880\)).</p>'
             r'\[\NU = 0.023(12\,896)^{0.8}(4.32)^{0.4} = 80.2\]\[h = \frac{\NU\,k}{D} = \frac{(80.2)(0.631)}{0.02} = 2531\un{W/m^2\cdot K}\]'
             r'\[T_{s,\mathrm{out}} = T_{\mathrm{out}} + \frac{\qs}{h} = 60 + \frac{20\,000}{2531} = 67.9\ ^\circ\mathrm{C}\]') +
        step(4, '(c) Caída de presión y potencia de bombeo (tubo liso)',
             r'\[f = (0.790\ln 12\,896 - 1.64)^{-2} = 0.0294\]'
             r'\[\Delta P = f\frac{L}{D}\frac{\rho V^2}{2} = (0.0294)(880)\frac{(992.1)(0.424)^2}{2} = 2.3\un{kPa}\]\[\dot W_{\mathrm{bomba}} = \Vd\,\Delta P = (1.333\times10^{-4})(2307) = 0.31\un{W}\]')
    )
    return r'''<article class="example int avoid">''' + ex_head('Ejemplo E3', 'Calentador eléctrico de agua', ['Interna', 'Turbulento', '\\(\\qs\\) cte', 'ΔP']) + r'''
<div class="ex-top">
<div><span class="lbl">Enunciado</span>
<p>Se calienta agua de 20 °C a 60 °C en un tubo de 2 cm de diámetro envuelto por una resistencia eléctrica que entrega un flujo de calor uniforme
de 20 kW/m². El caudal es de 8 L/min. Determina (a) la longitud de tubo necesaria, (b) la temperatura de la superficie a la salida y (c) la potencia de bombeo (tubo liso).</p></div>
<div class="ex-fig">''' + svgs.fig_tube('coil') + r'''</div></div>
<div class="grid2 calc"><div class="steps">''' + s1 + r'''</div><div class="steps">''' + s2 + r'''</div></div>
<div class="result"><span class="result-label">Resultado</span><span>(a) \(L \approx 17.6\) m · (b) \(T_{s,\mathrm{out}} \approx 67.9\) °C · (c) \(\Delta P \approx 2.3\) kPa, \(\dot W \approx 0.31\) W</span></div>
<div class="learn"><div class="box-label">Lo que enseña</div><ul>
<li>Con \(\qs\) constante, la <b>longitud sale del balance de energía</b>: no necesitas \(h\) para eso. \(h\) solo hace falta para la temperatura de la pared.</li>
<li>La pared está siempre \(\qs/h\) por encima del fluido; su temperatura <b>máxima está a la salida</b> (dato clave si piden "que no supere X °C").</li></ul></div>
</article>'''


PROBS = {
    'P1': ('ext', 'Placa larga (régimen combinado)',
           r'Aire a 20 °C fluye a 6 m/s sobre una placa de 2 m de largo (en la dirección del flujo) y 1 m de ancho, cuya superficie está a 60 °C. Calcula el calor que pierde la placa por una cara.'),
    'P2': ('ext', 'Esfera',
           r'Una esfera de 3 cm de diámetro, a 70 °C, se enfría con aire a 20 °C que fluye a 5 m/s. Determina \(h\) y la pérdida de calor.'),
    'P3': ('ext', 'Problema inverso (vuelta al 7-37)',
           r'¿Qué velocidad mínima del aire haría falta para montar <b>6</b> transistores en la placa del ejercicio 7-37, con las mismas temperaturas?'),
    'P4': ('int', 'Ducto cuadrado laminar',
           r'Aire a 1 atm entra a 20 °C a un ducto de 1 cm × 1 cm y 2 m de largo con \(\Vp = 1.5\) m/s. Las paredes están a 80 °C. Suponiendo flujo desarrollado, halla \(\Tout\) y \(\Qd\).'),
    'P5': ('int', 'Transición: ¿qué correlación?',
           r'Para \(\RE = 5000\) y \(\PR = 0.7\), calcula Nu con Gnielinski y con Dittus–Boelter (n = 0,4). ¿Cuál usarías y por qué?'),
}


def ahora_tu(ids, color):
    items = ''.join(f'<li><b>{i} · {PROBS[i][1]}.</b> {PROBS[i][2]}</li>' for i in ids)
    return (f'<div class="box c {color} avoid" style="margin:8pt 0 4pt 0"><div class="box-label">Ahora tú · resuelve con el método y compara con las respuestas al final de esta sección</div>'
            f'<ul style="padding-left:12pt">{items}</ul></div>')


def respuestas():
    return r"""<div class="avoid" style="margin-top:10pt">
<h2 style="margin-top:0">Respuestas de "Ahora tú"</h2>
<table class="t gen compact" style="font-size:8.3pt">
<thead><tr><th style="width:7%">#</th><th>Camino</th><th style="width:27%">Respuesta</th></tr></thead><tbody>
<tr><td><b>P1</b></td><td>\(T_f = 40\) °C (\(k = 0.02662\), \(\nu = 1.702\times10^{-5}\), Pr = 0,7255) · \(\RE_L = 7.05\times10^5 > 5\times10^5\) → combinada (\(x_{cr} = 1.42\) m) · \(\NU = (0.037\RE_L^{0.8} - 871)\PR^{1/3} = 803\)</td>
<td>\(h = 10.7\un{W/m^2\cdot K}\), \(\Qd \approx 856\) W. <span class="small muted">Con "todo turbulento" saldría el doble: error típico.</span></td></tr>
<tr><td><b>P2</b></td><td>Propiedades a \(T_\infty = 20\) °C (\(k = 0.02514\), \(\nu = 1.516\times10^{-5}\), Pr = 0,7309, \(\mu_\infty = 1.825\times10^{-5}\)); \(\mu_s(70\ ^\circ\mathrm{C}) = 2.052\times10^{-5}\) · \(\RE = 9894\) · Whitaker: Nu = 59,8</td>
<td>\(h = 50.1\un{W/m^2\cdot K}\), \(\Qd \approx 7.1\) W</td></tr>
<tr><td><b>P3</b></td><td>\(\Qd = 6(6) = 36\) W → \(h = 36/[(0.0625)(30)] = 19.2\) → \(\NU = hL/k = 175.5\) → \(\RE = [\NU/(0.664\,\PR^{1/3})]^2 = 86\,740\) (laminar ✓)</td>
<td>\(V = \RE\,\nu/L \approx 6.2\) m/s</td></tr>
<tr><td><b>P4</b></td><td>Supón \(T_b \approx 50\) °C · \(D_h = 0.01\) m · \(\RE = 834\) → laminar · Nu = 2,98 (tabla, cuadrado, \(T_s\) cte) · \(\md = 1.638\times10^{-4}\) kg/s · \(A_s = 0.08\) m² · \(T_b\) real = 49,4 °C ✓</td>
<td>\(h = 8.15\un{W/m^2\cdot K}\), \(\Tout \approx 78.8\) °C, \(\Qd \approx 9.7\) W</td></tr>
<tr><td><b>P5</b></td><td>\(f = (0.790\ln 5000 - 1.64)^{-2} = 0.0386\) · Gnielinski: Nu = 16,6 · Dittus–Boelter: Nu = 18,2 (9 % más)</td>
<td>Gnielinski: Dittus–Boelter solo vale para Re &gt; 10 000</td></tr>
</tbody></table></div>"""


def extras():
    return (chapter_head(7, 'Casos que no salieron en tus ejercicios pero pueden caer', 'Ejemplos extra y práctica') +
            e1() + ahora_tu(['P1', 'P2', 'P3'], 'ext') +
            '<div style="break-before: page"></div>' + e2() + ahora_tu(['P4', 'P5'], 'int') +
            '<div style="break-before: page"></div>' + e3() + respuestas())


# ------------------------------------------------------------------ 9. errores
def errores():
    errs = [
        ('Propiedades a la temperatura equivocada', r'Externa → \(T_f = (T_s+T_\infty)/2\). Interna → \(T_b = (T_{\mathrm{in}}+T_{\mathrm{out}})/2\). Nunca a \(T_s\) ni a \(T_{\mathrm{in}}\) solas.'),
        ('Confundir \\(A_c\\) con \\(A_s\\)', r'\(A_c\) = sección transversal (para \(V_{\mathrm{prom}}\) y \(D_h\)). \(A_s\) = superficie mojada (para el calor). En el 8-47: \(A_c = 0.03\) m², \(A_s = 10\) m².'),
        ('Usar el ancho de la placa en Re', r'En placa plana \(L_c\) es la longitud <b>en la dirección del flujo</b>.'),
        ('Olvidar el ×10⁻⁵ de ν', r'Re sale mal por un factor enorme y eliges el régimen equivocado. Revisa el orden de magnitud.'),
        ('n de Dittus–Boelter al revés', r'n = 0,4 si el <b>fluido se calienta</b> (\(T_s > T_m\)); n = 0,3 si se <b>enfría</b> (\(T_s < T_m\)).'),
        ('Dittus–Boelter con Re < 10 000', r'Laminar → 3,66 / 4,36 / región de entrada. Transición → Gnielinski.'),
        ('Exponente de Petukhov', r'\(f = (0.790\ln\RE - 1.64)^{-2}\). Si f te da mucho mayor que 0,1, revisa el signo del exponente.'),
        ('ΔT aritmético en vez de \\(\\Delta T_{\\mathrm{ln}}\\)', r'Con \(T_s\) cte, \(\Qd = hA_s\Delta T_{\mathrm{ln}}\), no \(hA_s(T_s - T_b)\).'),
        ('Signo de \\(\\Delta T_{\\mathrm{ln}}\\)', r'Si el fluido se enfría, sale negativo: \(\Qd\) negativo significa que el fluido <b>pierde</b> calor. Reporta el valor absoluto y el sentido.'),
        ('\\(T_{\\mathrm{out}}\\) fuera de rango', r'Siempre debe quedar entre \(T_{\mathrm{in}}\) y \(T_s\). Si no, revisa el signo del exponente o \(\md c_p\).'),
        ('Densidad del gas', r'\(\rho = P/(RT)\) con T en <b>kelvin</b>, P en kPa y R = 0,287 kPa·m³/kg·K.'),
        ('No verificar la \\(T_{\\mathrm{out}}\\) supuesta', r'Es el paso ⑩. Si difiere mucho, recalcula las propiedades e itera.'),
        ('Redondear mal', r'En un "¿cuántos caben?", hacia abajo (7-37: 4,8 → 4).'),
        ('¿Una cara o dos?', r'Lee si la placa intercambia calor por una cara (la otra aislada) o por ambas: \(A_s\) cambia al doble.'),
        ('Pr^(1/3) en la calculadora', r'Escribe Pr^(1/3) con paréntesis; si no, calculas Pr¹/3.'),
        ('ln frente a log', r'Petukhov usa ln (natural); Colebrook y Haaland usan log (base 10).'),
    ]
    items = ''.join(f'<div class="err"><h4>{t}</h4><p>{d}</p></div>' for t, d in errs)
    return chapter_head(8, 'Lo que más puntos resta', 'Errores típicos y checklist') + r'''
<div class="errs">''' + items + r'''</div>
<div class="grid2" style="margin-top:10pt">
<div class="box note"><div class="box-label">Checklist antes de entregar</div>
<ul class="check">
<li>Dibujo con datos y dirección del flujo; todo en SI</li>
<li>Suposiciones escritas</li>
<li>Temperatura de propiedades correcta (\(T_f\) o \(T_b\))</li>
<li>Re calculado y régimen justificado con el valor crítico</li>
<li>Correlación dentro de su rango de validez (Re, Pr)</li>
<li>\(h\) con un valor razonable (tabla 1.6)</li>
<li>\(T_{\mathrm{out}}\) entre \(T_{\mathrm{in}}\) y \(T_s\), y suposición verificada</li>
<li>\(\Qd\) por dos caminos (\(\md c_p\Delta T\) y \(hA_s\Delta T_{\mathrm{ln}}\)) coinciden</li>
<li>Unidades en el resultado y respuesta a lo que se pregunta</li>
</ul></div>
<div class="box tip"><div class="box-label">Estrategia de examen</div>
<ul>
<li>Escribe primero la <b>cadena</b>: \(T\) de props → props → Re → Nu → \(h\) → \(\Qd\). Te da puntos aunque te equivoques en una cuenta.</li>
<li>Escribe la correlación <b>en letras</b> antes de reemplazar números.</li>
<li>Guarda los valores intermedios con 4 cifras y redondea solo el resultado final.</li>
<li>Si te trabas con \(T_{\mathrm{out}}\), supón un valor razonable, sigue y verifica al final: es exactamente el método del curso.</li>
</ul></div>
</div>
'''


# ------------------------------------------------------------------ 10. tablas
AIR = [  # T, rho, cp, k, mu(e-5), nu(e-5), Pr
    (0, '1,292', 1006, '0,02364', '1,729', '1,338', '0,7362'), (10, '1,246', 1006, '0,02439', '1,778', '1,426', '0,7336'),
    (20, '1,204', 1007, '0,02514', '1,825', '1,516', '0,7309'), (25, '1,184', 1007, '0,02551', '1,849', '1,562', '0,7296'),
    (30, '1,164', 1007, '0,02588', '1,872', '1,608', '0,7282'), (35, '1,145', 1007, '0,02625', '1,895', '1,655', '0,7268'),
    (40, '1,127', 1007, '0,02662', '1,918', '1,702', '0,7255'), (45, '1,109', 1007, '0,02699', '1,941', '1,750', '0,7241'),
    (50, '1,092', 1007, '0,02735', '1,963', '1,798', '0,7228'), (60, '1,059', 1007, '0,02808', '2,008', '1,896', '0,7202'),
    (70, '1,028', 1007, '0,02881', '2,052', '1,995', '0,7177'), (80, '0,9994', 1008, '0,02953', '2,096', '2,097', '0,7154'),
    (90, '0,9718', 1008, '0,03024', '2,139', '2,201', '0,7132'), (100, '0,9458', 1009, '0,03095', '2,181', '2,306', '0,7111'),
    (120, '0,8977', 1011, '0,03235', '2,264', '2,522', '0,7073'), (140, '0,8542', 1013, '0,03374', '2,345', '2,745', '0,7041'),
    (160, '0,8148', 1016, '0,03511', '2,424', '2,975', '0,7014'), (180, '0,7788', 1019, '0,03646', '2,502', '3,212', '0,6992'),
    (200, '0,7459', 1023, '0,03779', '2,577', '3,455', '0,6974'),
]
WATER = [  # T, rho, cp, k, mu(e-3), Pr
    (0.01, 999.8, 4217, 0.561, 1.792, 13.5), (5, 999.9, 4205, 0.571, 1.519, 11.2), (10, 999.7, 4194, 0.580, 1.307, 9.45),
    (15, 999.1, 4185, 0.589, 1.138, 8.09), (20, 998.0, 4182, 0.598, 1.002, 7.01), (25, 997.0, 4180, 0.607, 0.891, 6.14),
    (30, 996.0, 4178, 0.615, 0.798, 5.42), (35, 994.0, 4178, 0.623, 0.720, 4.83), (40, 992.1, 4179, 0.631, 0.653, 4.32),
    (45, 990.1, 4180, 0.637, 0.596, 3.91), (50, 988.1, 4181, 0.644, 0.547, 3.55), (60, 983.3, 4185, 0.654, 0.467, 2.99),
    (70, 977.5, 4190, 0.663, 0.404, 2.55), (80, 971.8, 4197, 0.670, 0.355, 2.22), (90, 965.3, 4206, 0.675, 0.315, 1.96),
    (100, 957.9, 4217, 0.679, 0.282, 1.75),
]


def c(x, nd):
    return f'{x:.{nd}f}'.replace('.', ',')


def tablas():
    air_rows = ''.join(
        f'<tr><td>{t}</td><td>{r}</td><td>{cp}</td><td>{k}</td><td>{mu}</td><td>{nu}</td><td>{pr}</td></tr>'
        for t, r, cp, k, mu, nu, pr in AIR)
    w_rows = ''
    for t, r, cp, k, mu, pr in WATER:
        nu = mu * 1e-3 / r * 1e6
        tt = '0,01' if t == 0.01 else str(t)
        w_rows += (f'<tr><td>{tt}</td><td>{c(r, 1)}</td><td>{cp}</td><td>{c(k, 3)}</td><td>{c(mu, 3)}</td>'
                   f'<td>{c(nu, 3)}</td><td>{c(pr, 2 if pr < 10 else 1)}</td></tr>')
    return chapter_head(9, 'Extracto para practicar · en el examen usa las del libro', 'Tablas de propiedades') + r'''
<h3 style="margin-top:0">Aire a 1 atm (tabla A-15)</h3>
<table class="t num compact gen ptab" style="font-size:8.2pt">
<thead><tr><th>T (°C)</th><th>\(\rho\) (kg/m³)</th><th>\(c_p\) (J/kg·K)</th><th>\(k\) (W/m·K)</th><th>\(\mu\) × 10⁵ (kg/m·s)</th><th>\(\nu\) × 10⁵ (m²/s)</th><th>Pr</th></tr></thead>
<tbody>''' + air_rows + r'''</tbody></table>
<h3>Agua saturada, líquido (tabla A-9)</h3>
<table class="t num compact gen ptab" style="font-size:8.2pt">
<thead><tr><th>T (°C)</th><th>\(\rho\) (kg/m³)</th><th>\(c_p\) (J/kg·K)</th><th>\(k\) (W/m·K)</th><th>\(\mu\) × 10³ (kg/m·s)</th><th>\(\nu\) × 10⁶ (m²/s)</th><th>Pr</th></tr></thead>
<tbody>''' + w_rows + r'''</tbody></table>
<div class="grid2">
<div class="box key"><div class="box-label">Interpolación lineal</div>
\[y = y_1 + (x - x_1)\,\frac{y_2 - y_1}{x_2 - x_1}\]
<p class="small" style="margin:0">Ej.: k del aire a 33 °C: \(0.02588 + (33 - 30)\,(0.02625 - 0.02588)/(35 - 30) = 0.02610\) W/m·K.</p>
</div>
<div class="box note"><div class="box-label">Cómo leer y convertir</div>
<p class="small" style="margin:0 0 3pt 0">"\(\nu\) × 10⁵ = 1,798" significa \(\nu = 1.798\times10^{-5}\) m²/s. En el agua, la columna \(\nu = \mu/\rho\) está calculada (el libro no la trae).
Otra presión (gases): \(\rho \propto P\), \(\nu \propto 1/P\); \(k\), \(c_p\), \(\mu\) y Pr no cambian.</p>
<p class="small" style="margin:0">1 atm = 101,325 kPa · R<sub>aire</sub> = 0,287 kPa·m³/kg·K · T(K) = T(°C) + 273 ·
1 L/min = 1,667×10⁻⁵ m³/s · α = k/(ρc<sub>p</sub>)</p>
</div>
</div>
'''


# ------------------------------------------------------------------ 11. hoja resumen
def resumen():
    return chapter_head(10, 'Para repasar los últimos 10 minutos', 'Hoja resumen') + r"""
<div class="cheat2">
<div class="box note" style="margin-top:0"><div class="box-label">Siempre</div>
\(\Qd = hA_s(T_s - T_\infty)\) · \(\RE = VL_c/\nu\) · \(\NU = hL_c/k\) · \(\PR = \nu/\alpha\) · cadena: <b>T de propiedades → propiedades → Re → Nu → h → \(\Qd\)</b> · verifica el rango de validez y que \(h\) sea razonable.
</div>
<div class="grid2">
<div class="col ext">
<h3>Externa · propiedades a \(T_f = (T_s + T_\infty)/2\)</h3>
<p><b>Placa plana</b> (\(L_c = L\) en la dirección del flujo; \(x_{cr} = 5\times10^5\,\nu/V\)):</p>
\[\RE_L < 5\times10^5:\quad \NU = 0.664\,\RE_L^{0.5}\,\PR^{1/3}\]
\[5\times10^5 < \RE_L < 10^7:\quad \NU = (0.037\,\RE_L^{0.8} - 871)\,\PR^{1/3}\]
<p>Todo turbulento: \(0.037\,\RE_L^{0.8}\PR^{1/3}\) · locales: \(0.332\,\RE_x^{0.5}\PR^{1/3}\) y \(0.0296\,\RE_x^{0.8}\PR^{1/3}\) · con \(\qs\) cte: 0,453 y 0,0308.</p>
<p><b>Cilindro</b> (\(L_c = D\)), Churchill–Bernstein:</p>
\[\NU = 0.3 + \frac{0.62\,\RE^{1/2}\PR^{1/3}}{[1 + (0.4/\PR)^{2/3}]^{1/4}}\left[1 + \left(\frac{\RE}{282\,000}\right)^{5/8}\right]^{4/5}\]
<p>o Hilpert \(\NU = C\,\RE^m\PR^{1/3}\) (40–4000: C = 0,683, m = 0,466 · 4000–40 000: C = 0,193, m = 0,618).</p>
<p><b>Esfera</b> (propiedades a \(T_\infty\), \(\mu_s\) a \(T_s\)):</p>
\[\NU = 2 + \left[0.4\,\RE^{1/2} + 0.06\,\RE^{2/3}\right]\PR^{0.4}\left(\mu_\infty/\mu_s\right)^{1/4}\]
<p><b>Banco de tubos:</b> \(V_{max} = \frac{S_T}{S_T - D}\,V\) (en línea) → \(\RE_D\) → Zukauskas → se trata como intercambiador (\(\DTln\)).</p>
<p><b>Áreas:</b> placa \(Lw\) (¿una o dos caras?) · cilindro \(\pi DL\) · esfera \(\pi D^2\).</p>
<h3>Valores críticos de Re</h3>
<p>Placa \(5\times10^5\) · tubo 2300 (laminar) y 10 000 (turbulento) · cilindro ≈ \(2\times10^5\).</p>
<h3>Valores típicos de h (W/m²·K)</h3>
<p>Gases en convección forzada: 25–250 (a pocos m/s, 10–25) · líquidos: 50–20 000.</p>
</div>
<div class="col int">
<h3>Interna · propiedades a \(T_b = (\Tin + \Tout)/2\)</h3>
<p>Supón \(\Tout\), resuelve y verifica. \(D_h = 4A_c/p\) · \(\Vp = \Vd/A_c\) · \(\md = \rho\Vd\) · \(A_s = pL\).</p>
<p>\(\RE = \Vp D_h/\nu = 4\md/(\pi D\mu)\) · entrada: laminar \(L_h = 0.05\,\RE\,D\) y \(L_t = \PR\,L_h\); turbulento \(L_h \approx 10D\).</p>
<p><b>Laminar desarrollado:</b> circular 3,66 (\(T_s\)) / 4,36 (\(\qs\)) · cuadrado 2,98 / 3,61 · placas paralelas 7,54 / 8,24.</p>
<p><b>Laminar con entrada</b> (\(T_s\) cte, circular):</p>
\[\NU = 3.66 + \frac{0.065\,(D/L)\,\RE\,\PR}{1 + 0.04\,[(D/L)\,\RE\,\PR]^{2/3}}\]
<p><b>Turbulento</b> (Re &gt; 10 000): \(\NU = 0.023\,\RE^{0.8}\PR^{n}\), con n = 0,4 si el fluido se calienta y 0,3 si se enfría. Gnielinski (vale también en transición), con \(f = (0.790\ln\RE - 1.64)^{-2}\):</p>
\[\NU = \frac{(f/8)(\RE - 1000)\,\PR}{1 + 12.7\,(f/8)^{0.5}(\PR^{2/3} - 1)}\]
<p><b>\(T_s\) constante:</b></p>
\[\Tout = T_s - (T_s - \Tin)\,e^{-hA_s/\md c_p}\]
\[\DTln = \frac{\Tin - \Tout}{\ln[(T_s - \Tout)/(T_s - \Tin)]}\]
\[\Qd = hA_s\DTln = \md c_p(\Tout - \Tin)\]
<p><b>\(\qs\) constante:</b> \(\Qd = \qs A_s = \md c_p(\Tout - \Tin)\) · \(T_s = T_m + \qs/h\) (máxima a la salida).</p>
<p><b>Presión:</b> \(\Delta P = f\,(L/D_h)\,\rho\Vp^2/2\) · \(\dot W = \Vd\,\Delta P\) · laminar: \(f = 64/\RE\).</p>
</div>
</div>
<table class="t gen compact" style="margin-top:8pt;font-size:8.6pt">
<thead><tr><th style="width:50%">¿Qué Nusselt uso? · Externa</th><th>¿Qué Nusselt uso? · Interna</th></tr></thead><tbody>
<tr><td>Placa, \(\RE_L < 5\times10^5\): \(0.664\,\RE_L^{0.5}\PR^{1/3}\)</td><td>Laminar desarrollado: 3,66 (\(T_s\)) / 4,36 (\(\qs\)) o tabla con \(D_h\)</td></tr>
<tr><td>Placa, \(\RE_L > 5\times10^5\): combinada \((0.037\,\RE_L^{0.8} - 871)\PR^{1/3}\)</td><td>Laminar con entrada: Edwards (circular) o placas paralelas</td></tr>
<tr><td>Cilindro: Churchill–Bernstein (o Hilpert)</td><td>Transición (2300–10 000): Gnielinski</td></tr>
<tr><td>Esfera: Whitaker · banco de tubos: Zukauskas</td><td>Turbulento: Dittus–Boelter (n = 0,4 / 0,3) o Gnielinski</td></tr>
</tbody></table>
<div class="box warn" style="margin-top:7pt"><div class="box-label">Los 7 errores que más se repiten</div>
① Propiedades a la T equivocada · ② \(A_c\) en vez de \(A_s\) · ③ n de Dittus–Boelter al revés · ④ Dittus–Boelter con Re &lt; 10 000 ·
⑤ ΔT aritmético en vez de \(\DTln\) · ⑥ olvidar el ×10⁻⁵ de ν · ⑦ no verificar la \(\Tout\) supuesta.
</div>
</div>
"""

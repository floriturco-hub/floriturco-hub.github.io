# -*- coding: utf-8 -*-
"""Tus ejercicios de clase resueltos y verificados."""
import svgs
from content_a import chapter_head, step


def ex_head(eid, title, tags):
    t = ''.join(f'<span>{x}</span>' for x in tags)
    return (f'<div class="ex-head"><span class="ex-id">{eid}</span><span class="ex-title">{title}</span>'
            f'<span class="ex-tags">{t}</span></div>')


def ej_737():
    s = (
        step(1, 'Temperatura de película y propiedades',
             r'<p>\(T_f = (T_s + T_\infty)/2 = (65 + 35)/2 = 50\) °C → tabla A-15:</p>'
             r'<p>\(k = 0.02735\un{W/m\cdot K}\) · \(\nu = 1.798\times10^{-5}\un{m^2/s}\) · \(\PR = 0.7228\)</p>') +
        step(2, 'Reynolds y régimen',
             r'\[\RE_L = \frac{V L}{\nu} = \frac{(4)(0.25)}{1.798\times10^{-5}} = 55\,617 < 5\times10^5\ \Rightarrow\ \text{laminar}\]') +
        step(3, 'Nusselt (placa plana, laminar, promedio)',
             r'\[\NU = 0.664\,\RE_L^{0.5}\,\PR^{1/3} = 0.664\,(235.8)(0.8974) = 140.5\]') +
        step(4, 'Coeficiente de convección',
             r'\[h = \frac{\NU\,k}{L} = \frac{(140.5)(0.02735)}{0.25} = 15.37\un{W/m^2\cdot K}\]')
    )
    s2 = (
        step(5, 'Área de transferencia', r'\[A_s = L^2 = (0.25)^2 = 0.0625\un{m^2}\]') +
        step(6, 'Calor máximo que el aire puede retirar',
             r'\[\Qd = h\,A_s\,(T_s - T_\infty) = (15.37)(0.0625)(65 - 35) = 28.8\un{W}\]') +
        step(7, 'Número de transistores',
             r'\[n = \frac{\Qd}{\Qd_{\mathrm{transistor}}} = \frac{28.8}{6} = 4.8\ \Rightarrow\ n = 4\]'
             r'<p class="small">Se redondea <b>hacia abajo</b>: con 5 se generarían 30 W, más de lo que el aire puede retirar, y la placa pasaría de 65 °C.</p>')
    )
    return r'''<article class="example ext">''' + ex_head('Ejercicio 7-37', 'Transistores sobre una placa', ['Externa', 'Placa plana', 'Laminar']) + r'''
<div class="ex-top">
<div>
<span class="lbl">Enunciado (resumido)</span>
<p>Sobre una placa cuadrada de 0,25 m × 0,25 m se montan transistores de potencia que disipan 6 W cada uno. La placa se enfría con aire a 35 °C
que fluye paralelo a ella a 4 m/s, y su temperatura no debe superar 65 °C. ¿Cuántos transistores se pueden montar?</p>
<span class="lbl">Datos</span>
<p class="data">\(\Qd_{\mathrm{tr}} = 6\) W · \(L = 0.25\) m · \(T_\infty = 35\) °C · \(V = 4\) m/s · \(T_s = 65\) °C (máximo)</p>
<span class="lbl">Suposiciones</span>
<p class="small">Estacionario · \(\RE_{cr} = 5\times10^5\) · radiación despreciable · placa isotérmica · el calor sale solo por la cara expuesta al aire · aire a 1 atm.</p>
</div>
<div class="ex-fig">''' + svgs.fig_737() + r'''</div>
</div>
<div class="grid2 calc"><div class="steps">''' + s + r'''</div><div class="steps">''' + s2 + r'''</div></div>
<div class="result"><span class="result-label">Resultado</span><span>\(h = 15.4\un{W/m^2\cdot K}\) · \(\Qd_{max} = 28.8\un{W}\) · <b>4 transistores</b></span></div>
<div class="learn"><div class="box-label">Lo que enseña este ejercicio</div><ul>
<li>En un "¿cuántos caben?", se redondea <b>hacia abajo</b> (4,8 → 4), nunca al entero más cercano.</li>
<li>En placa plana, L es la longitud <b>en la dirección del flujo</b> y el régimen se decide con \(\RE_L\), el de toda la placa.</li>
<li>Si te pidieran la velocidad necesaria para montar más transistores, es un problema inverso (ejercicio P3 de la sección 7).</li>
</ul></div>
</article>'''


def ej_839():
    return r'''<article class="example int">''' + ex_head('Ejercicio 8-39', '¿Por qué el agua "enfría" más que el aire?', ['Interna', 'Turbulento', '\\(\\qs\\) cte']) + r'''
<div class="ex-top" style="grid-template-columns: 1fr 1fr">
<div>
<span class="lbl">Enunciado (reconstruido de tus apuntes)</span>
<p>Determina el coeficiente de convección para el flujo de (a) aire y (b) agua a 2 m/s por un tubo de 8 cm de diámetro y 7 m de largo
sometido a flujo de calor uniforme. Usa propiedades a 25 °C. <span class="small muted">Con estos datos se obtienen exactamente tus valores: 10,4 y 5747 W/m²·K.</span></p>
<span class="lbl">Claves de la resolución</span>
<p class="small">\(\RE = VD/\nu\) para cada fluido → ambos turbulentos (\(\RE > 10\,000\)) y desarrollados (\(L_h \approx 10D = 0.8\) m \(\ll\) 7 m) → Dittus–Boelter con <b>n = 0,4</b>, porque el flujo de calor entra al fluido (se calienta) → \(h = \NU\,k/D\).</p>
</div>
<div>
<table class="t num compact int" style="margin:0">
<thead><tr><th></th><th>Aire (25 °C)</th><th>Agua (25 °C)</th></tr></thead>
<tbody>
<tr><td>\(k\) (W/m·K)</td><td>0,02551</td><td>0,607</td></tr>
<tr><td>\(\nu\) (m²/s)</td><td>1,562×10<sup>−5</sup></td><td>8,937×10<sup>−7</sup> <span class="small muted">(μ/ρ)</span></td></tr>
<tr><td>Pr</td><td>0,7296</td><td>6,14</td></tr>
<tr><td>\(\RE = VD/\nu\)</td><td>10 243</td><td>179 035</td></tr>
<tr><td>\(\NU = 0.023\RE^{0.8}\PR^{0.4}\)</td><td>32,76</td><td>757,4</td></tr>
<tr><td><b>\(h = \NU k/D\)</b> (W/m²·K)</td><td><b>10,4</b></td><td><b>5747</b></td></tr>
</tbody></table>
</div>
</div>
<div class="result"><span class="result-label">Resultado</span><span>\(\dfrac{h_{\mathrm{agua}}}{h_{\mathrm{aire}}} = \dfrac{5747}{10.4} \approx 550\)</span></div>
<div class="learn"><div class="box-label">Lo que enseña este ejercicio</div><ul>
<li>Tu conclusión (“el agua conduce mejor el calor porque su k es 24 veces mayor”) es correcta pero <b>incompleta</b>: k solo explica un factor 24.
El resto viene del Nusselt (757,4 / 32,76 ≈ 23): el agua tiene \(\nu\) unas 17 veces menor (Re mucho mayor) y Pr unas 8 veces mayor. Entonces 23 × 24 ≈ 550.</li>
<li>Por eso la mano en agua a 10 °C se siente mucho más fría que en aire a 10 °C: el agua le saca calor unas 550 veces más rápido.</li>
<li>Para el agua, \(\nu\) no siempre viene en la tabla: se calcula como \(\nu = \mu/\rho\).</li>
</ul></div>
</article>'''


def ej_845():
    s1 = (
        step(1, 'Datos y lo que piden',
             r'<p>① \(T_{\mathrm{out}}\) del aire · ② calor perdido por el ducto. \(T_{\mathrm{in}} = 85\) °C, \(T_s = 70\) °C, \(L = 10\) m, sección 0,15 × 0,15 m, \(\Vd = 0.10\un{m^3/s}\), \(P = 101.325\) kPa.</p>') +
        step(2, 'Suponer \\(T_{\\mathrm{out}}\\) y propiedades',
             r'<p>El aire se enfría: supongo \(\Tout = 75\) °C → \(T_b = (85 + 75)/2 = 80\) °C → A-15:</p>'
             r'<p>\(k = 0.02953\) · \(\nu = 2.097\times10^{-5}\) · \(c_p = 1008\) · \(\PR = 0.7154\)</p>') +
        step(3, 'Diámetro hidráulico',
             r'\[D_h = \frac{4A_c}{p} = \frac{4(0.15)^2}{4(0.15)} = 0.15\un{m}\]<p class="small">En un cuadrado, \(D_h\) = lado.</p>') +
        step(4, 'Velocidad promedio', r'\[V_{\mathrm{prom}} = \frac{\Vd}{A_c} = \frac{0.10}{(0.15)^2} = 4.44\un{m/s}\]') +
        step(5, 'Reynolds, régimen y ¿desarrollado?',
             r'\[\RE = \frac{V_{\mathrm{prom}}D_h}{\nu} = \frac{(4.444)(0.15)}{2.097\times10^{-5}} = 31\,791 > 10\,000\]'
             r'<p>Turbulento. \(L_h \approx 10D_h = 1.5\) m \(\ll\) 10 m → completamente desarrollado.</p>')
    )
    s2 = (
        step(6, 'Nusselt (Dittus–Boelter, n = 0,3: el aire se enfría)',
             r'\[\NU = 0.023\,(31\,791)^{0.8}(0.7154)^{0.3} = 83.17\]') +
        step(7, 'Coeficiente de convección', r'\[h = \frac{\NU\,k}{D_h} = \frac{(83.17)(0.02953)}{0.15} = 16.37\un{W/m^2\cdot K}\]') +
        step(8, 'Área superficial y flujo másico',
             r'\[A_s = pL = 4(0.15)(10) = 6\un{m^2}\]'
             r'\[\rho = \frac{P}{RT_{\mathrm{in}}} = \frac{101.325}{(0.287)(358)} = 0.9862\un{kg/m^3}\]\[\md = \rho\Vd = (0.9862)(0.10) = 0.09862\un{kg/s}\]') +
        step(9, 'Temperatura de salida',
             r'\[\frac{hA_s}{\md c_p} = \frac{(16.37)(6)}{(0.09862)(1008)} = 0.988\]\[\Tout = 70 - (70 - 85)\,e^{-0.988} = 70 + 15(0.372) = 75.6\ ^\circ\mathrm{C}\]') +
        step(10, 'Calor y comprobación',
             r'\[\Delta T_{\mathrm{ln}} = \frac{85 - 75.6}{\ln\frac{70 - 75.6}{70 - 85}} = -9.53\ ^\circ\mathrm{C}\]\[\Qd = hA_s\Delta T_{\mathrm{ln}} = (16.37)(6)(-9.53) = -936\un{W}\]'
             r'<p>Comprobación: \(\md c_p (T_{\mathrm{in}} - T_{\mathrm{out}}) = (0.09862)(1008)(9.42) = 936\) W ✓ · \(T_b\) real = 80,3 °C ≈ 80 °C supuesto ✓</p>')
    )
    return r'''<article class="example int">''' + ex_head('Ejercicio 8-45', 'Ducto cuadrado que pasa por el ático', ['Interna', 'Turbulento', '\\(T_s\\) cte', 'Enfriamiento']) + r'''
<div class="ex-top">
<div>
<span class="lbl">Enunciado (resumido)</span>
<p>Aire caliente a 1 atm y 85 °C entra, a razón de 0,10 m³/s, a un ducto cuadrado sin aislar de 0,15 m × 0,15 m y 10 m de largo que pasa
por el ático. La superficie del ducto está prácticamente a 70 °C. Determina la temperatura de salida del aire y el calor que pierde el ducto.</p>
<span class="lbl">Suposiciones</span>
<p class="small">Estacionario · superficie interior lisa · \(T_s\) uniforme · aire gas ideal · propiedades constantes · flujo desarrollado (se verifica en ⑤).</p>
</div>
<div class="ex-fig">''' + svgs.fig_845() + r'''</div>
</div>
<div class="grid2 calc"><div class="steps">''' + s1 + r'''</div><div class="steps">''' + s2 + r'''</div></div>
<div class="result"><span class="result-label">Resultado</span><span>\(T_{\mathrm{out}} \approx 75.6\) °C · el ducto pierde \(\Qd \approx 936\) W hacia el ático</span></div>
<div class="learn"><div class="box-label">Lo que enseña este ejercicio</div><ul>
<li><b>n = 0,3</b> porque el fluido se <b>enfría</b> (\(T_s < T_m\)). Si se calentara, sería 0,4.</li>
<li>\(\rho\) se calcula con gas ideal <b>a la entrada</b>, porque el caudal \(\Vd\) está dado a la entrada (T en kelvin).</li>
<li>Cuando el fluido se enfría, \(\Delta T_{\mathrm{ln}}\) sale <b>negativo</b>: reporta el valor absoluto y di que el aire <b>pierde</b> calor.</li>
<li>Con Gnielinski (\(f = 0.0233\)) se obtiene Nu = 74,4 y \(h\) = 14,6 W/m²·K, unos 11 % menos. Las dos son válidas aquí; usa la que pida tu profesor.</li>
</ul></div>
</article>'''


def ej_847():
    s1 = (
        step(1, 'Datos y lo que piden',
             r'<p>① calor neto que recibe el aire · ② \(\Delta T = T_{\mathrm{out}} - T_{\mathrm{in}}\). \(W = 1\) m, \(L = 5\) m, \(s = 0.03\) m, \(\Vd = 0.15\un{m^3/s}\), \(T_{\mathrm{in}} = 30\) °C, \(T_{\mathrm{placa}} = 60\) °C, \(T_{\mathrm{vidrio}} = 20\) °C.</p>') +
        step(2, 'Suponer \\(T_{\\mathrm{out}}\\) y propiedades',
             r'<p>Supongo \(\Tout = 40\) °C → \(T_b = (30 + 40)/2 = 35\) °C → A-15:</p>'
             r'<p>\(\rho = 1.145\) · \(k = 0.02625\) · \(\nu = 1.655\times10^{-5}\) · \(c_p = 1007\) · \(\PR = 0.7268\)</p>') +
        step(3, 'Diámetro hidráulico',
             r'\[A_c = W s = (1)(0.03) = 0.03\un{m^2}\]\[p = 2(W + s) = 2(1 + 0.03) = 2.06\un{m}\]'
             r'\[D_h = \frac{4A_c}{p} = \frac{4(0.03)}{2.06} = 0.05825\un{m}\]'
             r'<p class="small" style="color:#b42318"><b>Ojo:</b> en tus apuntes dice \(A_c = 0.3\) m², pero es 0,03 m² (tus cuentas sí usaron 0,03 ✓).</p>') +
        step(4, 'Velocidad promedio', r'\[V_{\mathrm{prom}} = \frac{\Vd}{A_c} = \frac{0.15}{0.03} = 5\un{m/s}\]') +
        step(5, 'Reynolds y régimen',
             r'\[\RE = \frac{(5)(0.05825)}{1.655\times10^{-5}} = 17\,599 > 10\,000\]'
             r'<p>Turbulento. \(L_h \approx 10D_h = 0.58\) m \(\ll\) 5 m → desarrollado.</p>')
    )
    s2 = (
        step(6, 'Nusselt (Dittus–Boelter, n = 0,4: en neto el aire se calienta)',
             r'\[\NU = 0.023\,(17\,599)^{0.8}(0.7268)^{0.4} = 50.43\]') +
        step(7, 'Coeficiente de convección', r'\[h = \frac{\NU\,k}{D_h} = \frac{(50.43)(0.02625)}{0.05825} = 22.72\un{W/m^2\cdot K}\]') +
        step(8, 'El truco de las dos superficies',
             r'\[\Qd_{\mathrm{neto}} = hA(60 - T) - hA(T - 20) = h\,(2A)\,(40 - T)\]'
             r'<p>Equivale a <b>una sola superficie</b> de área \(A_s = 2A = 2(1)(5) = 10\) m² a \(T_s = 40\) °C. Además, \(\md = \rho\Vd = (1.145)(0.15) = 0.1718\) kg/s.</p>') +
        step(9, 'Temperatura de salida',
             r'\[\frac{hA_s}{\md c_p} = \frac{(22.72)(10)}{(0.1718)(1007)} = 1.314\]\[\Tout = 40 - (40 - 30)\,e^{-1.314} = 40 - 10(0.269) = 37.3\ ^\circ\mathrm{C}\]') +
        step(10, 'Calor y comprobación',
             r'\[\Qd = \md c_p (T_{\mathrm{out}} - T_{\mathrm{in}}) = (0.1718)(1007)(7.31) = 1265\un{W}\]'
             r'<p>Con \(\Delta T_{\mathrm{ln}} = 5.57\) °C: \(hA_s\Delta T_{\mathrm{ln}} = (22.72)(10)(5.57) = 1265\) W ✓ · \(T_b\) real = 33,7 °C ≈ 35 °C ✓</p>')
    )
    return r'''<article class="example int">''' + ex_head('Ejercicio 8-47', 'Colector solar de aire', ['Interna', 'Turbulento', 'Ducto rectangular', 'Dos superficies']) + r'''
<div class="ex-top">
<div>
<span class="lbl">Enunciado (resumido)</span>
<p>Un colector solar de aire de 1 m de ancho y 5 m de largo tiene 3 cm de separación entre la cubierta de vidrio y la placa colectora.
Entra aire a 30 °C a razón de 0,15 m³/s y recorre los 5 m. El vidrio está a 20 °C y la placa a 60 °C. Determina el calor neto que recibe el aire y cuánto sube su temperatura.</p>
<span class="lbl">Idea física</span>
<p class="small">El aire <b>gana</b> calor de la placa (60 °C &gt; 30 °C) y <b>pierde</b> hacia el vidrio (20 °C &lt; 30 °C): se pide el calor <b>neto</b>.
Suposiciones: estacionario, superficies lisas, mismo \(h\) en vidrio y placa, colector aislado, radiación despreciable.</p>
</div>
<div class="ex-fig">''' + svgs.fig_847() + r'''</div>
</div>
<div class="grid2 calc"><div class="steps">''' + s1 + r'''</div><div class="steps">''' + s2 + r'''</div></div>
<div class="result"><span class="result-label">Resultado</span><span>\(\Qd_{\mathrm{neto}} \approx 1.26\) kW · \(\Delta T \approx 7.3\) °C (el aire sale a ≈ 37,3 °C)</span></div>
<div class="learn"><div class="box-label">Lo que enseña este ejercicio</div><ul>
<li>Dos superficies con el <b>mismo h</b> equivalen a una sola, con el área total y la temperatura promedio ponderada por área:
\(T_{s,eq} = \frac{A_1T_1 + A_2T_2}{A_1 + A_2}\). Aquí las áreas son iguales, así que \(T_{s,eq} = (60 + 20)/2 = 40\) °C.</li>
<li>Ducto rectangular → <b>\(D_h\)</b>. No confundas \(A_c\) (sección, para \(V_{\mathrm{prom}}\) y \(D_h\)) con \(A_s\) (superficie, para el calor).</li>
<li>Si la \(T_{\mathrm{out}}\) calculada (37,3 °C) se parece a la supuesta (40 °C), las propiedades casi no cambian: no hace falta iterar.</li>
</ul></div>
</article>'''


def resumen_clase():
    return r"""<h2 style="margin-top:14pt">Tus cuatro ejercicios en una tabla</h2>
<table class="t gen compact summary" style="font-size:8.3pt">
<thead><tr><th style="width:7%">Ej.</th><th style="width:16%">Tipo</th><th style="width:15%">Régimen</th><th style="width:18%">Correlación</th><th>Clave del ejercicio</th><th style="width:16%">Resultado</th></tr></thead>
<tbody>
<tr><td><b>7-37</b></td><td>Externa · placa plana</td><td>Laminar<br>Re = 55 617</td><td>\(0.664\,\RE_L^{0.5}\PR^{1/3}\)</td><td>Calcular \(\Qd_{max}\) y redondear hacia abajo</td><td>4 transistores</td></tr>
<tr><td><b>8-39</b></td><td>Interna · tubo circular</td><td>Turbulento</td><td>Dittus–Boelter, n&nbsp;=&nbsp;0,4</td><td>El agua tiene un \(h\) unas 550 veces mayor que el aire (k × 24, Nu × 23)</td><td>10,4 y 5747 W/m²·K</td></tr>
<tr><td><b>8-45</b></td><td>Interna · ducto cuadrado</td><td>Turbulento<br>Re = 31 791</td><td>Dittus–Boelter, n&nbsp;=&nbsp;0,3</td><td>\(D_h\) = lado; \(\rho\) con gas ideal; \(\DTln\) negativo al enfriar</td><td>75,6 °C y 936 W</td></tr>
<tr><td><b>8-47</b></td><td>Interna · ducto rectangular</td><td>Turbulento<br>Re = 17 599</td><td>Dittus–Boelter, n&nbsp;=&nbsp;0,4</td><td>Dos superficies con igual \(h\) = una sola de área 2A a 40 °C</td><td>1265 W y +7,3 °C</td></tr>
</tbody></table>"""


def clase():
    return (chapter_head(6, 'Pasados en limpio, con todos los números verificados', 'Tus ejercicios de clase, resueltos') +
            r"""<p class="lead" style="margin-bottom:6pt">Son los ejercicios de tus apuntes, ordenados con el método paso a paso. Recalculé todo: <b>tus resultados están bien</b>.
Agregué lo que conviene escribir en el examen (suposiciones y verificaciones) y lo que enseña cada uno.</p>""" +
            ej_737() +
            '<div style="break-before: page"></div>' + ej_845() +
            '<div style="break-before: page"></div>' + ej_847() +
            '<div style="break-before: page"></div>' + ej_839() + resumen_clase())

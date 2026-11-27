# -*- coding: utf-8 -*-
"""Portada, ideas clave, mapa de decisión y método paso a paso."""
import svgs


def chapter_head(num, kicker, title):
    return (f'<header class="ch-head"><div class="ch-num">{num}</div><div>'
            f'<div class="ch-kicker">{kicker}</div><h1>{title}</h1></div></header>')


def step(n, title, body):
    return (f'<div class="step"><div class="step-n">{n}</div><div class="step-body">'
            f'<h4>{title}</h4>{body}</div></div>')


TOC = [
    ('gen', 'Ideas clave', 'h, Re, Nu, Pr · regímenes · externa frente a interna', 's1'),
    ('gen', 'Mapa de decisión', '¿externa o interna? ¿qué correlación uso?', 's2'),
    ('gen', 'Método paso a paso', 'el procedimiento que sirve para todos los ejercicios', 's3'),
    ('ext', 'Formulario: convección externa', 'placa plana, cilindro, esfera, banco de tubos', 's4'),
    ('int', 'Formulario: convección interna', 'laminar, turbulento, T<sub>s</sub> o q̇<sub>s</sub> constante, ΔP', 's5'),
    ('int', 'Tus ejercicios de clase, resueltos', '7-37 · 8-45 · 8-47 · 8-39 (verificados)', 's6'),
    ('gen', 'Ejemplos extra y práctica', 'cilindro · laminar con entrada · q̇<sub>s</sub> constante · 5 ejercicios con respuesta', 's7'),
    ('gen', 'Errores típicos y checklist', 'lo que más resta puntos en el examen', 's9'),
    ('gen', 'Tablas de propiedades', 'aire (A-15) y agua (A-9), extracto', 's10'),
    ('gen', 'Hoja resumen', 'todo el tema en una página', 's11'),
]


def cover(pages):
    items = ''
    for i, (c, t, sub, sid) in enumerate(TOC, 1):
        items += (f'<li class="{c}"><span class="n">{i}</span><span class="t">{t}<small>{sub}</small></span>'
                  f'<span class="p">{pages.get(sid, "")}</span></li>')
    return f'''
<section class="cover">
  <div class="cover-band">
    <div class="cover-kicker">Transferencia de calor · Çengel &amp; Ghajar · capítulos 7 y 8</div>
    <h1>Convección<br>forzada</h1>
    <div class="sub">Externa e interna: guía de estudio para resolver cualquier ejercicio paso a paso</div>
    <div class="cover-art">{svgs.cover_art()}</div>
  </div>
  <div class="cover-body">
    <div class="toc">
      <h2>Contenido</h2>
      <ol>{items}</ol>
    </div>
    <div>
      <div class="howto">
        <h3>Cómo usar esta guía</h3>
        <ol>
          <li>Lee las <b>ideas clave</b> y el <b>mapa de decisión</b>: ahí está la lógica de todo el tema.</li>
          <li>Aprende el <b>método paso a paso</b>. Es el mismo para todos los ejercicios y sigue la numeración que usan en clase.</li>
          <li>Resuelve los <b>ejemplos</b> tapando la solución y compara paso por paso.</li>
          <li>Antes del examen, repasa la <b>hoja resumen</b> y los <b>errores típicos</b>.</li>
        </ol>
      </div>
      <div class="legend">
        <span class="sw gen"></span><span>General (vale para todo)</span>
        <span class="sw ext"></span><span>Convección externa (cap. 7)</span>
        <span class="sw int"></span><span>Convección interna (cap. 8)</span>
        <span class="board" style="margin-left:0">pizarra</span><span>Fórmula que apareció en la pizarra de clase</span>
        <span class="cls" style="margin-left:0">clase</span><span>Usada en tus ejercicios de clase</span>
      </div>
    </div>
  </div>
  <div class="cover-foot">Hecha a partir de tus apuntes (ejercicios 7-37, 8-39, 8-45 y 8-47 y fotos de la pizarra) y de Çengel &amp; Ghajar,
  <i>Transferencia de calor y masa</i>. Todos los resultados numéricos se recalcularon y verificaron. Las propiedades son las de las
  tablas A-15 (aire) y A-9 (agua) del libro; si tu edición difiere en algún decimal, usa la de tu curso.</div>
</section>'''


# ------------------------------------------------------------------ 1. ideas clave
def ideas():
    return chapter_head(1, 'Lo que hay que entender antes de calcular', 'Ideas clave') + r'''
<p class="lead">En convección forzada un fluido es <b>empujado</b> (por un ventilador, una bomba o el viento) sobre una superficie o por dentro
de un tubo. Todos los ejercicios del tema se reducen a lo mismo: <b>encontrar el coeficiente de convección \(h\)</b> y con él calcular el calor.</p>

<div class="grid2-6040">
<div>
<h2 style="margin-top:2pt">1.1 Todo gira alrededor de \(h\)</h2>
<p>El calor por convección siempre se calcula con la <b>ley de enfriamiento de Newton</b>:</p>
\[\Qd = h\,A_s\,(T_s - T_\infty)\]
<p>Pero \(h\) <b>no está en tablas</b>: depende del fluido, la velocidad, la geometría y de si el flujo es laminar o turbulento. Se obtiene del
número de Nusselt, que sale de una <b>correlación</b> (fórmula experimental). La cadena de cálculo es siempre la misma:</p>
</div>
<div class="box key" style="margin-top:4pt"><div class="box-label">Idea clave</div>
<p>Resolver un ejercicio de convección forzada es, sobre todo, <b>elegir bien la correlación</b> de Nu. El resto (propiedades, Re, \(h\), \(\Qd\)) es mecánico.</p>
<p>Para elegirla responde: <b>¿externa o interna?</b> <b>¿qué geometría?</b> <b>¿laminar o turbulento?</b> y, si es interna, <b>¿\(T_s\) o \(\qs\) constante?</b></p>
</div>
</div>

<div class="chain">
  <div class="node">T de propiedades<small>\(T_f\) (externa) · \(T_b\) (interna)</small></div><div class="arr">→</div>
  <div class="node">Propiedades<small>\(k,\ \nu,\ \PR\ (c_p,\ \rho,\ \mu)\)</small></div><div class="arr">→</div>
  <div class="node">Reynolds<small>define el régimen</small></div><div class="arr">→</div>
  <div class="node hl">Nusselt<small>correlación adecuada</small></div><div class="arr">→</div>
  <div class="node">\(h = \NU\,k/L_c\)<small>coef. de convección</small></div><div class="arr">→</div>
  <div class="node">\(\Qd,\ T_{\mathrm{out}},\ \dots\)<small>lo que piden</small></div>
</div>

<h2>1.2 Los tres números adimensionales</h2>
<table class="t gen">
<thead><tr><th style="width:12%">Número</th><th style="width:22%">Definición</th><th>Qué mide</th><th style="width:30%">Para recordar</th></tr></thead>
<tbody>
<tr><td class="case">Reynolds</td><td class="f">\(\RE = \dfrac{V L_c}{\nu} = \dfrac{\rho V L_c}{\mu}\)</td>
<td>Fuerzas de inercia frente a fuerzas viscosas. Decide si el flujo es <b>laminar</b> (Re bajo) o <b>turbulento</b> (Re alto).</td>
<td class="when">\(\nu\) viene en tablas con \(\times10^{-5}\) (aire) o \(\times10^{-6}\)–\(10^{-7}\) (agua). Si lo olvidas, Re sale mal por miles.</td></tr>
<tr><td class="case">Nusselt</td><td class="f">\(\NU = \dfrac{h L_c}{k}\)</td>
<td>Cuánto <b>mejora la convección</b> la transferencia de calor frente a la conducción pura a través del fluido (Nu = 1: solo conducción).</td>
<td class="when">Es lo que te dan las correlaciones; de ahí despejas \(h = \NU\,k/L_c\).</td></tr>
<tr><td class="case">Prandtl</td><td class="f">\(\PR = \dfrac{\nu}{\alpha} = \dfrac{\mu\, c_p}{k}\)</td>
<td>Difusividad de cantidad de movimiento frente a difusividad térmica: compara el espesor de la capa límite de velocidad con el de la térmica.</td>
<td class="when">Gases 0,7–1 · agua 1,7–13,7 · aceites 50–100 000 · metales líquidos 0,004–0,03. Sale directo de la tabla.</td></tr>
</tbody></table>

<div class="grid2">
<div>
<h2>1.3 Régimen de flujo</h2>
<table class="t gen compact">
<thead><tr><th style="width:28%">Geometría</th><th style="width:30%">\(L_c\)</th><th>Laminar si…</th></tr></thead>
<tbody>
<tr><td class="case">Placa plana</td><td>L en la dirección del flujo</td><td>\(\RE_L < 5\times10^5\)</td></tr>
<tr><td class="case">Cilindro, esfera</td><td>D exterior</td><td>la correlación cubre todo Re</td></tr>
<tr><td class="case">Tubo o ducto</td><td>D interior o \(D_h\)</td><td>\(\RE < 2300\)<br><span class="small muted">turbulento si \(\RE > 10\,000\); en medio, transición</span></td></tr>
</tbody></table>

<h2>1.4 ¿A qué temperatura busco las propiedades?</h2>
<ul class="tight">
<li><b>Externa:</b> a la <b>temperatura de película</b> \(T_f = (T_s + T_\infty)/2\). Excepción: esfera (Whitaker), a \(T_\infty\) y \(\mu_s\) a \(T_s\).</li>
<li><b>Interna:</b> a la <b>temperatura media de masa</b> (bulk) \(T_b = (\Tin + \Tout)/2\). Si no conoces \(\Tout\), <b>supón</b> un valor, resuelve y verifica al final (en clase: 75 °C en el 8-45 y 40 °C en el 8-47).</li>
</ul>
<div class="box tip"><div class="box-label">Tip: gas a otra presión</div>
\(k\), \(c_p\), \(\mu\) y Pr casi no cambian con la presión, pero \(\rho\) y \(\nu\) sí: \(\rho = P/RT\) (R<sub>aire</sub> = 0,287 kPa·m³/kg·K, T en K) y \(\nu = \nu_{1\,\mathrm{atm}}\,(P_{\mathrm{atm}}/P)\).
</div>
</div>
<div>
<h2>1.5 Longitud característica \(L_c\)</h2>
<ul class="tight">
<li><b>Placa:</b> longitud L <b>en la dirección del flujo</b> (no el ancho).</li>
<li><b>Cilindro y esfera:</b> diámetro exterior D.</li>
<li><b>Tubo circular:</b> diámetro interior D.</li>
<li><b>Ducto no circular:</b> diámetro hidráulico \(D_h = 4A_c/p\), con \(A_c\) = área de la sección y \(p\) = perímetro mojado.</li>
</ul>
<table class="t gen compact" style="margin-top:2pt;width:88%"><tbody>
<tr><td>Cuadrado de lado a</td><td class="nw">\(D_h = a\)</td></tr>
<tr><td>Rectángulo \(a\times b\)</td><td class="nw">\(D_h = 2ab/(a+b)\)</td></tr>
<tr><td>Placas paralelas separadas s</td><td class="nw">\(D_h = 2s\)</td></tr>
<tr><td>Anillo (tubo doble)</td><td class="nw">\(D_h = D_o - D_i\)</td></tr>
</tbody></table>
<h2>1.6 Valores típicos de \(h\)</h2>
<table class="t gen compact">
<thead><tr><th>Situación</th><th>\(h\) (W/m²·K)</th></tr></thead>
<tbody>
<tr><td>Convección natural, gases</td><td>2 – 25</td></tr>
<tr><td>Convección natural, líquidos</td><td>10 – 1000</td></tr>
<tr><td>Convección forzada, gases</td><td>25 – 250</td></tr>
<tr><td>Convección forzada, líquidos</td><td>50 – 20 000</td></tr>
<tr><td>Ebullición y condensación</td><td>2500 – 100 000</td></tr>
</tbody></table>
<p class="small muted">Úsala para ver si tu resultado tiene sentido. En tus ejercicios, aire a pocos m/s dio \(h\) = 10–23 W/m²·K (extremo bajo, normal a baja velocidad) y agua a 2 m/s, 5747 W/m²·K.</p>
</div>
</div>

<h2>1.7 La capa límite (por qué existen dos regímenes)</h2>
<figure style="margin:2pt 0 4pt 0">''' + svgs.boundary_layer() + r'''</figure>
<div class="grid3 small">
<p>Sobre una placa el flujo empieza <b>laminar</b> y, a partir de \(x_{cr}\) (donde \(\RE_x = 5\times10^5\)), se vuelve <b>turbulento</b>. La capa turbulenta es más gruesa, pero mezcla mucho mejor el fluido: por eso <b>\(h\) es mayor</b>.</p>
<p>La capa límite térmica tiene un espesor \(\delta_t \approx \delta/\PR^{1/3}\). En aire (Pr ≈ 0,7) ambas son casi iguales; por eso en las correlaciones aparece \(\PR^{1/3}\).</p>
<p>En tubos pasa lo mismo, pero las capas límite crecen hasta llenar el tubo: desde ahí el flujo está <b>completamente desarrollado</b> y \(h\) se vuelve constante.</p>
</div>

<h2>1.8 Externa e interna, lado a lado</h2>
<table class="t gen compact cmp">
<thead><tr><th></th><th>Externa (cap. 7)</th><th>Interna (cap. 8)</th></tr></thead>
<tbody>
<tr><td>Propiedades a…</td><td>\(T_f = (T_s + T_\infty)/2\)</td><td>\(T_b = (\Tin + \Tout)/2\) (suponer \(\Tout\) y verificar)</td></tr>
<tr><td>Velocidad en Re</td><td>la de la corriente libre, \(V\)</td><td>la promedio, \(\Vp = \Vd/A_c\)</td></tr>
<tr><td>Longitud característica</td><td>L (placa) o D (cilindro, esfera)</td><td>D o \(D_h = 4A_c/p\)</td></tr>
<tr><td>Re crítico</td><td>placa \(5\times10^5\)</td><td>2300 (laminar) · 10 000 (turbulento)</td></tr>
<tr><td>¿Cambia la T del fluido?</td><td>No: lejos del cuerpo sigue a \(T_\infty\)</td><td>Sí: entra a \(\Tin\) y sale a \(\Tout\)</td></tr>
<tr><td>Diferencia de temperatura</td><td>\(T_s - T_\infty\) (constante)</td><td>\(\DTln\) (cambia a lo largo del tubo)</td></tr>
<tr><td>Calor</td><td>\(\Qd = hA_s(T_s - T_\infty)\)</td><td>\(\Qd = hA_s\DTln = \md c_p(\Tout - \Tin)\)</td></tr>
</tbody></table>
'''


# ------------------------------------------------------------------ 2. mapa
def mapa():
    return chapter_head(2, 'Lo primero que haces al leer el enunciado', 'Mapa de decisión: ¿qué fórmula uso?') + r'''
<div class="map-top">¿Dónde está el fluido respecto a la superficie?<small>Lee el enunciado y haz un dibujo antes de elegir fórmulas</small></div>
<svg viewBox="0 0 600 30" style="width:100%;height:22pt;display:block" xmlns="http://www.w3.org/2000/svg">
<defs><marker id="mp-a" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0.6 L10,5 L0,9.4 z" fill="#0b7285"/></marker>
<marker id="mp-b" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0.6 L10,5 L0,9.4 z" fill="#c2410c"/></marker></defs>
<path d="M300,0 L300,8 L148,8 L148,27" fill="none" stroke="#0b7285" stroke-width="1.6" marker-end="url(#mp-a)"/>
<path d="M300,8 L452,8 L452,27" fill="none" stroke="#c2410c" stroke-width="1.6" marker-end="url(#mp-b)"/>
</svg>
<div class="map-cols">
 <div class="mcol ext">
   <div class="mhead">EXTERNA<small>el fluido rodea al cuerpo: placa, cilindro, esfera…</small></div>
   <div class="marr">↓</div>
   <div class="mnode"><b>1</b>&nbsp; Propiedades a \(T_f = (T_s + T_\infty)/2\)</div>
   <div class="marr">↓</div>
   <div class="mnode q"><b>2</b>&nbsp; ¿Qué geometría? Calcula Re con su \(L_c\)
     <div class="branch">
       <span class="k">Placa</span><span class="v">\(\RE_L = VL/\nu\)<br>\(\RE_L < 5\times10^5\): \(\NU = 0.664\,\RE_L^{1/2}\PR^{1/3}\)<br>\(\RE_L > 5\times10^5\): \(\NU = (0.037\,\RE_L^{0.8}-871)\PR^{1/3}\)</span>
       <span class="k">Cilindro</span><span class="v">\(\RE = VD/\nu\) → Churchill–Bernstein (o Hilpert \(C\,\RE^m\PR^{1/3}\))</span>
       <span class="k">Esfera</span><span class="v">\(\RE = VD/\nu\) → Whitaker (propiedades a \(T_\infty\))</span>
       <span class="k">Banco de tubos</span><span class="v">\(V_{max}\) → \(\RE_D\) → Zukauskas</span>
     </div>
   </div>
   <div class="marr">↓</div>
   <div class="mnode"><b>3</b>&nbsp; \(h = \NU\,k/L_c\)</div>
   <div class="marr">↓</div>
   <div class="mnode"><b>4</b>&nbsp; Área: placa \(Lw\) · cilindro \(\pi DL\) · esfera \(\pi D^2\)</div>
   <div class="marr">↓</div>
   <div class="mnode end"><b>5</b>&nbsp; \(\Qd = h\,A_s\,(T_s - T_\infty)\)</div>
   <div class="box c" style="margin-top:8pt"><div class="box-label">Recuerda</div>
   En externa no hay "temperatura de salida": lejos del cuerpo el fluido sigue a \(T_\infty\). La excepción es el banco de tubos, que se trata como un intercambiador con \(\DTln\).</div>
 </div>
 <div class="mcol int">
   <div class="mhead">INTERNA<small>el fluido va por dentro de un tubo o ducto</small></div>
   <div class="marr">↓</div>
   <div class="mnode"><b>1</b>&nbsp; Supón \(\Tout\) → \(T_b = (\Tin + \Tout)/2\) → propiedades</div>
   <div class="marr">↓</div>
   <div class="mnode"><b>2</b>&nbsp; \(D_h = 4A_c/p\) · \(V_{\mathrm{prom}} = \Vd/A_c\) · \(\RE = V_{\mathrm{prom}}D_h/\nu\)</div>
   <div class="marr">↓</div>
   <div class="mnode q"><b>3</b>&nbsp; ¿Régimen?
     <div class="branch">
       <span class="k">Re &lt; 2300</span><span class="v"><b>Laminar.</b> ¿\(L \gg L_t \approx 0.05\,\RE\,\PR\,D\)? Sí: Nu = 3,66 (\(T_s\) cte) o 4,36 (\(\qs\) cte); no circular, tabla 8-1. No: Edwards / placas paralelas (región de entrada)</span>
       <span class="k">2300–10 000</span><span class="v"><b>Transición</b> → Gnielinski</span>
       <span class="k">Re &gt; 10 000</span><span class="v"><b>Turbulento</b> → Dittus–Boelter (n = 0,4 si el fluido se calienta, 0,3 si se enfría) o Gnielinski</span>
     </div>
   </div>
   <div class="marr">↓</div>
   <div class="mnode"><b>4</b>&nbsp; \(h = \NU\,k/D_h\) · \(A_s = pL\) · \(\md = \rho\Vd\)</div>
   <div class="marr">↓</div>
   <div class="mnode q"><b>5</b>&nbsp; ¿Qué condición hay en la pared?
     <div class="branch">
       <span class="k">\(T_s\) cte</span><span class="v">\(T_{\mathrm{out}} = T_s-(T_s-T_{\mathrm{in}})\,e^{-hA_s/\md c_p}\) y \(\Qd = hA_s\Delta T_{\mathrm{ln}}\)</span>
       <span class="k">\(\qs\) cte</span><span class="v">\(\Qd = \qs A_s\) · \(T_{\mathrm{out}} = T_{\mathrm{in}} + \Qd/\md c_p\) · \(T_s = T_m + \qs/h\)</span>
     </div>
   </div>
   <div class="marr">↓</div>
   <div class="mnode end"><b>6</b>&nbsp; \(\Qd = \md\,c_p\,(T_{\mathrm{out}}-T_{\mathrm{in}})\) y verifica la \(T_{\mathrm{out}}\) supuesta</div>
 </div>
</div>

<h2>Pistas en el enunciado</h2>
<table class="t gen compact">
<thead><tr><th style="width:52%">Si el enunciado dice…</th><th>…entonces</th></tr></thead>
<tbody>
<tr><td>"fluye sobre / sopla sobre / paralelo a una placa, superficie, techo"</td><td>Externa · placa plana (\(L_c\) = largo en la dirección del flujo)</td></tr>
<tr><td>"flujo cruzado / perpendicular a un tubo, cable, alambre, varilla"</td><td>Externa · cilindro (\(L_c = D\))</td></tr>
<tr><td>"bola, esfera, gota, tanque esférico"</td><td>Externa · esfera (Whitaker)</td></tr>
<tr><td>"entra a un tubo / ducto a … y sale a …", "caudal", "flujo másico"</td><td>Interna (\(T_b\), \(D_h\), \(V_{\mathrm{prom}}\))</td></tr>
<tr><td>"pared a temperatura constante", "isotérmica", "vapor que se condensa por fuera"</td><td>Interna con \(T_s\) constante (exponencial + \(\Delta T_{\mathrm{ln}}\))</td></tr>
<tr><td>"resistencia eléctrica", "calentado uniformemente", "flujo de calor uniforme"</td><td>Interna con \(\qs\) constante (balance lineal)</td></tr>
<tr><td>"ducto cuadrado/rectangular", "colector solar", "entre dos placas"</td><td>Usa el diámetro hidráulico \(D_h = 4A_c/p\)</td></tr>
<tr><td>"¿cuántos … se pueden montar / caben?"</td><td>Calcula \(\Qd\) máximo y <b>redondea hacia abajo</b></td></tr>
</tbody></table>
'''


# ------------------------------------------------------------------ 3. paso a paso
def metodo():
    ext_steps = (
        step(1, 'Dibujo, datos y suposiciones',
             r'<p>Identifica la geometría y su longitud característica: <b>L de la placa en la dirección del flujo</b>; D del cilindro o la esfera. Pasa todo a SI.</p>') +
        step(2, 'Temperatura de película y propiedades',
             r'<p>\(T_f = (T_s + T_\infty)/2\) → tabla A-15 (aire) o A-9 (agua): \(k\), \(\nu\), Pr. Si la temperatura no aparece exacta, <b>interpola</b>.</p>') +
        step(3, 'Reynolds y régimen',
             r'<p>\(\RE_L = V L_c/\nu\). Placa: laminar si \(\RE_L < 5\times10^5\); si es mayor, la transición ocurre en \(x_{cr} = 5\times10^5\,\nu/V\).</p>') +
        step(4, 'Nusselt',
             r'<p>Elige la correlación según geometría y régimen (sección 4) y <b>comprueba su rango de validez</b> (Re y Pr).</p>') +
        step(5, 'Coeficiente de convección', r'<p>\(h = \NU\,k/L_c\)</p>') +
        step(6, 'Área de transferencia',
             r'<p>Placa \(A_s = L\,w\) (¿una cara o dos?) · cilindro \(A_s = \pi D L\) · esfera \(A_s = \pi D^2\).</p>') +
        step(7, 'Calor', r'<p>\(\Qd = h\,A_s\,(T_s - T_\infty)\). Si dan el flujo de calor: \(T_s = T_\infty + \qs/h\).</p>') +
        step(8, 'Responde lo que te piden',
             r'<p>Interpreta el resultado. En un "¿cuántos caben?", <b>redondea hacia abajo</b>.</p>')
    )
    int_steps = (
        step(1, 'Identificar datos y lo que piden',
             r'<p>\(\Tin\), \(T_s\) o \(\qs\), L, sección (D o \(a\times b\)), caudal (\(\Vd\) o \(\md\)) y presión. Numera lo que piden (① ②), como en clase.</p>') +
        step(2, 'Suponer \\(\\Tout\\) y buscar propiedades',
             r'<p>\(T_b = (\Tin + \Tout)/2\) → tabla: \(k\), \(\nu\), \(c_p\), Pr, \(\rho\). Si el fluido se enfría, \(\Tout < \Tin\); si se calienta, al revés. \(\Tout\) siempre queda <b>entre \(\Tin\) y \(T_s\)</b>.</p>') +
        step(3, 'Diámetro hidráulico',
             r'<p>\(D_h = 4A_c/p\) · circular: \(D_h = D\) · cuadrado: \(D_h = a\) · rectángulo: \(D_h = 2ab/(a+b)\).</p>') +
        step(4, 'Velocidad promedio', r'<p>\(\Vp = \Vd/A_c = \md/(\rho A_c)\)</p>') +
        step(5, 'Reynolds, régimen y ¿desarrollado?',
             r'<p>\(\RE = \Vp D_h/\nu\) (circular: \(\RE = 4\md/\pi D\mu\)). Laminar &lt; 2300 &lt; transición &lt; 10 000 &lt; turbulento. '
             r'¿Desarrollado? Turbulento: \(L_h \approx 10\,D_h\). Laminar: \(L_h \approx 0.05\,\RE\,D\) y \(L_t \approx 0.05\,\RE\,\PR\,D\). Si \(L \gg L_h\), sí.</p>') +
        step(6, 'Nusselt',
             r'<p>Laminar: 3,66 / 4,36 o región de entrada. Turbulento: Dittus–Boelter \(\NU = 0.023\,\RE^{0.8}\PR^{n}\), con <b>n = 0,4 si el fluido se calienta y n = 0,3 si se enfría</b>, o Gnielinski.</p>') +
        step(7, 'Coeficiente de convección', r'<p>\(h = \NU\,k/D_h\)</p>') +
        step(8, 'Área superficial y flujo másico',
             r'<p>\(A_s = p\,L\) (circular: \(\pi D L\)) · \(\md = \rho\,\Vd\). En gases, \(\rho = P/RT\) con T en K, donde se da el caudal (normalmente la entrada).</p>') +
        step(9, 'Temperatura de salida',
             r'<p>\(T_s\) cte: \(\Tout = T_s - (T_s - \Tin)\,e^{-hA_s/\md c_p}\)<br>\(\qs\) cte: \(\Tout = \Tin + \qs A_s/\md c_p\)</p>') +
        step(10, 'Calor y comprobación',
             r'<p>\(\Qd = \md c_p (\Tout - \Tin)\) y, con \(T_s\) cte, \(\Qd = hA_s\DTln\): <b>deben coincidir</b>. Compara la \(\Tout\) calculada con la supuesta en ②; si difieren mucho (más de 5–10 °C), recalcula propiedades con la nueva \(T_b\) y repite.</p>')
    )
    return chapter_head(3, 'El mismo procedimiento para todos los ejercicios', 'Método paso a paso') + r'''
<div class="box note dense" style="margin-top:0"><div class="two-box">
<div><div class="box-label">Antes de empezar (siempre)</div>
<ol>
<li>Haz un <b>dibujo</b> con todos los datos y la <b>dirección del flujo</b>.</li>
<li>Escribe <b>qué te piden</b> y numéralo.</li>
<li>Pasa todo a <b>SI</b> (m, m/s, m³/s, kg/s, W). En diferencias de temperatura da igual °C o K; en \(\rho = P/RT\) usa K.</li>
<li>Escribe las <b>suposiciones</b>: cuentan puntos.</li>
</ol></div>
<div><div class="box-label">Suposiciones típicas (copia las que apliquen)</div>
<ul>
<li>Flujo estacionario; propiedades constantes (a \(T_f\) o \(T_b\)).</li>
<li>Aire como gas ideal a 1 atm; radiación despreciable; superficies lisas.</li>
<li>Placa: \(\RE_{cr} = 5\times10^5\) y superficie isotérmica.</li>
<li>Interna: flujo completamente desarrollado (verificar con \(L_h\)); ducto aislado por fuera si corresponde.</li>
</ul></div>
</div></div>

<div class="grid2" style="margin-top:4pt">
<div class="ext">
<h2 style="margin-top:2pt">3.1 Convección externa <span class="tag">8 pasos</span></h2>
<div class="steps dense">''' + ext_steps + r'''</div>
<div class="box tip dense"><div class="box-label">Problema inverso (te dan \(\Qd\), piden V o L)</div>
\(\Qd \to h = \Qd/(A_s\Delta T) \to \NU = hL/k \to\) despeja Re de la correlación \(\to V = \RE\,\nu/L\). Al final verifica el régimen supuesto.
</div>
<div class="box c int dense"><div class="box-label">Interna: ¿piden la longitud del tubo?</div>
\(T_s\) cte: \(L = \dfrac{\md c_p}{h\,p}\ln\dfrac{T_s - \Tin}{T_s - \Tout}\) · \(\qs\) cte: \(A_s = \md c_p(\Tout - \Tin)/\qs\) y \(L = A_s/p\).
Si \(\Tout\) es dato, \(T_b\) ya se conoce: no hay que suponer nada.
</div>
</div>
<div class="int">
<h2 style="margin-top:2pt">3.2 Convección interna <span class="tag">10 pasos</span></h2>
<div class="steps dense">''' + int_steps + r'''</div>
</div>
</div>
'''

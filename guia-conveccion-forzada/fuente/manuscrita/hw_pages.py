# -*- coding: utf-8 -*-
"""Contenido de la versión manuscrita (estilo de sus apuntes de Samsung Notes)."""
import hwlib as H
from hwlib import L, FL, head, note, blank, half, cols, rule, T
import hw_figs as G

TOC = [('Ideas clave', 2), ('Mapa de decisión', 4), ('Paso a paso: externa e interna', 5), ('Fórmulas: externa', 7),
       ('Fórmulas: interna', 9), ('Mis ejercicios de clase', 11), ('Ejemplos extra y práctica', 15),
       ('Errores típicos', 18), ('Hoja resumen', 19)]


def p_cover():
    b = blank(1)
    b += L('[h]Convección forzada[/h]', cls='title', h=2)
    b += L('[s]Guía de estudio · Çengel, caps. 7 y 8[/s]')
    b += L('[b]externa e interna · paso a paso · fórmulas · ejercicios[/b]', cls='sm')
    b += blank(1)
    b += G.cover_doodle()
    b += head('Contenido', mark='°')
    for i, (t, p) in enumerate(TOC, 1):
        b += cols(L(f'{i}. {t}'), L(f'[b]pág. {p}[/b]', cls='r'), widths=('1fr', '30mm'))
    b += blank(1)
    b += note('Hecha a partir de mis apuntes de clase (7-37, 8-39, 8-45, 8-47) y la pizarra.', 'b', 0)
    b += note('Todos los números están recalculados y verificados.', 's', 0)
    return b


def p_ideas1():
    b = head('Ideas clave', mark='°', hl=True)
    b += head('Todo gira alrededor de h')
    b += FL('$\\dot{Q} = h A_s (T_s - T_\\infty)$', 'ley de enfriamiento de Newton')
    b += note('h NO está en tablas: sale del número de Nusselt (una correlación)', 'b')
    b += L('La cadena siempre es la misma:')
    b += G.chain()
    b += head('Números adimensionales')
    b += FL('$Re = \\frac{V L_c}{\\nu}$', 'inercia / viscosas → ¿laminar o turbulento?')
    b += FL('$Nu = \\frac{h L_c}{k}$', 'cuánto mejora la convección vs. conducción pura')
    b += FL('$Pr = \\frac{\\nu}{\\alpha} = \\frac{\\mu c_p}{k}$', 'gases ≈ 0,7 · agua 1,7 – 13,7')
    b += note('ojo: ν del aire viene con ×10⁻⁵ en la tabla', 's')
    b += head('¿Laminar o turbulento?')
    b += L('placa: laminar si $Re_L < 5 \\times 10^5$')
    b += L('tubo: laminar si $Re < 2300$ · turbulento si $Re > 10 000$')
    b += L('cilindro y esfera: la correlación sirve para todo Re')
    b += head('Ojo con las unidades')
    b += L('ν: ×10⁻⁵ (aire) o ×10⁻⁶–10⁻⁷ (agua) · 1 L/min = 1,667×10⁻⁵ m³/s', cls='sm')
    b += L('°C o K da igual en diferencias · en ρ = P/RT va en K (R = 0,287 kPa·m³/kgK)', cls='sm')
    return b


def p_ideas2():
    b = head('¿A qué T busco las propiedades?')
    b += FL('externa → $T_f = \\frac{T_s + T_\\infty}{2}$', 'temperatura de película')
    b += FL('interna → $T_b = \\frac{T_{in} + T_{out}}{2}$', 'si no sé $T_{out}$: la supongo y verifico al final')
    b += note('excepción: esfera (Whitaker) → propiedades a T∞', 'b')
    b += head('Longitud característica')
    b += L('placa: L en la [u]dirección del flujo[/u] (¡no el ancho!)')
    b += L('cilindro, esfera, tubo: D')
    b += FL('ducto: $D_h = \\frac{4 A_c}{p}$', 'cuadrado a · rectángulo 2ab/(a+b) · placas paralelas 2s')
    b += head('Capa límite')
    b += G.boundary_layer()
    b += note('turbulenta: más gruesa pero mezcla más → h mayor', 'b')
    b += head('Externa vs. interna')
    b += cols(L('[b]externa:[/b] $T_f$ · V libre'), L('[s]interna:[/s] $T_b$ · $V_{prom}$ · $\\Delta T_{ln}$'))
    b += cols(L('$\\dot{Q} = h A_s (T_s - T_\\infty)$', cls='sm'), L('$\\dot{Q} = h A_s \\Delta T_{ln} = \\dot{m} c_p \\Delta T$', cls='sm'))
    b += head('h típicos (W/m²K)')
    b += L('gases forzada 25–250 (a pocos m/s: 10–25) · líquidos 50–20 000', cls='sm')
    b += note('si mi h sale fuera de esto → revisar unidades', 's')
    return b


def p_mapa():
    b = head('Mapa de decisión: ¿qué fórmula uso?', mark='°', hl=True)
    b += G.mapa()
    b += head('Pistas del enunciado')
    b += L('"sopla sobre una placa" → externa · "flujo cruzado sobre un tubo" → cilindro', cls='sm')
    b += L('"entra a un tubo a… y sale a…" → interna · "resistencia eléctrica" → $\\dot{q}_s$ cte', cls='sm')
    return b


def p_metodo_ext():
    b = head('Paso a paso · EXTERNA', mark='°', hl=True)
    b += L('§1§ dibujo + datos + suposiciones · $L_c$: placa → L, cilindro/esfera → D')
    b += L('§2§ $T_f = \\frac{T_s + T_\\infty}{2}$ → tabla A-15 (aire) / A-9 (agua): k, ν, Pr')
    b += L('§3§ $Re = \\frac{V L_c}{\\nu}$ → placa: laminar si $Re_L < 5 \\times 10^5$')
    b += note('placa larga: la transición está en $x_{cr} = 5 \\times 10^5 \\nu / V$', 's', 2)
    b += L('§4§ Nu con la correlación de la geometría (¡revisar el rango!)')
    b += L('§5§ $h = \\frac{Nu\\,k}{L_c}$')
    b += L('§6§ $A_s$: placa L·w (¿1 o 2 caras?) · cilindro πDL · esfera πD²')
    b += L('§7§ $\\dot{Q} = h A_s (T_s - T_\\infty)$ · si dan $\\dot{q}_s$: $T_s = T_\\infty + \\dot{q}_s / h$')
    b += L('§8§ responder lo que piden → "¿cuántos caben?" = hacia abajo')
    b += head('Suposiciones típicas')
    b += L('estacionario · propiedades ctes · aire gas ideal a 1 atm · radiación', cls='sm')
    b += L('despreciable · superficies lisas · placa isotérmica · $Re_{cr} = 5 \\times 10^5$', cls='sm')
    b += head('Problema inverso (dan Q̇, piden V)')
    b += L('$\\dot{Q}$ → $h = \\frac{\\dot{Q}}{A_s \\Delta T}$ → $Nu = \\frac{hL}{k}$ → despejo Re')
    b += L('→ $V = \\frac{Re\\,\\nu}{L}$ (y si era laminar: $Re = [\\frac{Nu}{0,664 Pr^{1/3}}]^2$)')
    b += note('al final verificar que el régimen supuesto sea el correcto', 'b')
    return b


def p_metodo_int():
    b = head('Paso a paso · INTERNA (como en clase)', mark='°', hl=True)
    b += L('§1§ datos: $T_{in}$, $T_s$ o $\\dot{q}_s$, L, sección, $\\dot{V}$ o $\\dot{m}$, P · ¿qué piden?')
    b += L('§2§ supongo $T_{out}$ → $T_b = \\frac{T_{in} + T_{out}}{2}$ → k, ν, $c_p$, Pr, ρ')
    b += L('§3§ $D_h = \\frac{4 A_c}{p}$ [s]circular: D · cuadrado: a[/s]')
    b += L('§4§ $V_{prom} = \\frac{\\dot{V}}{A_c}$')
    b += L('§5§ $Re = \\frac{V_{prom} D_h}{\\nu}$ [s]< 2300 laminar · > 10 000 turbulento[/s]')
    b += note('¿desarrollado? turbulento $L_h \\approx 10 D_h$ · laminar $L_t \\approx 0,05\\,Re\\,Pr\\,D$', 'b', 2)
    b += L('§6§ laminar: 3,66 / 4,36 · turbulento: $Nu = 0,023 Re^{0,8} Pr^n$')
    b += note('n = 0,4 si el fluido se calienta · n = 0,3 si se enfría', 's', 2)
    b += L('§7§ $h = \\frac{Nu\\,k}{D_h}$')
    b += L('§8§ $A_s = p L$ · $\\dot{m} = \\rho \\dot{V}$ [s](gas: ρ = P/RT con T en K)[/s]')
    b += L('§9§ $T_{out} = T_s - (T_s - T_{in})\\,e^{-h A_s / \\dot{m} c_p}$ [s]($T_s$ cte)[/s]')
    b += L('§10§ $\\dot{Q} = \\dot{m} c_p (T_{out} - T_{in}) = h A_s \\Delta T_{ln}$')
    b += note('¿$T_{out}$ ≈ la supuesta? sí → listo · no → nueva $T_b$ y repetir', 'b', 2)
    b += head('¿Piden la longitud?')
    b += L('$L = \\frac{\\dot{m} c_p}{h\\,p} \\ln\\frac{T_s - T_{in}}{T_s - T_{out}}$ [s]($T_s$ cte)[/s] · $A_s = \\frac{\\dot{m} c_p \\Delta T}{\\dot{q}_s}$ [s]($\\dot{q}_s$ cte)[/s]')
    return b


def p_ext1():
    b = head('Fórmulas · EXTERNA', mark='°', hl=True)
    b += L('[s]propiedades a $T_f$ · $\\dot{Q} = h A_s (T_s - T_\\infty)$[/s]', cls='sm')
    b += head('Placa plana ($L_c = L$)')
    b += FL('$Nu = 0,664\\,Re_L^{0,5} Pr^{1/3}$', 'laminar · $Re_L < 5 \\times 10^5$ · Pr > 0,6 [b](7-37)[/b]')
    b += FL('$Nu = (0,037\\,Re_L^{0,8} - 871) Pr^{1/3}$', 'combinada · $5 \\times 10^5 < Re_L < 10^7$')
    b += FL('$Nu = 0,037\\,Re_L^{0,8} Pr^{1/3}$', 'todo turbulento: solo si se "dispara" desde el borde')
    b += FL('$Nu_x = 0,332\\,Re_x^{0,5} Pr^{1/3}$', 'local laminar · $h_{prom} = 2 h_{x=L}$')
    b += FL('$Nu_x = 0,0296\\,Re_x^{0,8} Pr^{1/3}$', 'local turbulento')
    b += FL('$Nu_x = 0,453\\,Re_x^{0,5} Pr^{1/3}$', '$\\dot{q}_s$ cte (lam.) · turb.: 0,0308 $Re_x^{0,8} Pr^{1/3}$')
    b += note('con $\\dot{q}_s$ cte: $T_s(x) = T_\\infty + \\dot{q}_s / h_x$ → máxima al final', 'b')
    b += head('Tramo inicial sin calentar ξ')
    b += FL('$Nu_x = \\frac{0,332\\,Re_x^{0,5} Pr^{1/3}}{[1 - (\\xi/x)^{3/4}]^{1/3}}$', 'laminar')
    b += FL('$Nu_x = \\frac{0,0296\\,Re_x^{0,8} Pr^{1/3}}{[1 - (\\xi/x)^{9/10}]^{1/9}}$', 'turbulento')
    b += head('Arrastre (si lo piden)')
    b += L('$C_f = 1,33 Re_L^{-0,5}$ (lam.) · $0,074 Re_L^{-1/5}$ (turb.) · $F_D = C_f A_s \\frac{\\rho V^2}{2}$')
    b += note('ojo: si $Re_L > 5 \\times 10^5$ NO uses "todo turbulento" → sale el doble', 's')
    return b


def p_ext2():
    b = head('Cilindro en flujo cruzado ($L_c = D$, props a $T_f$)')
    b += L('Churchill–Bernstein (la del libro):')
    b += L('$Nu = 0,3 + \\frac{0,62\\,Re^{1/2} Pr^{1/3}}{[1 + (0,4/Pr)^{2/3}]^{1/4}} [1 + (\\frac{Re}{282 000})^{5/8}]^{4/5}$', h=2.5)
    b += note('vale si Re·Pr > 0,2 · calcularla por partes (A, B, C)', 'b')
    b += L('Hilpert (rápida): $Nu = C\\,Re^m Pr^{1/3}$')
    tb = [('Re', 'C', 'm'), ('0,4 – 4', '0,989', '0,330'), ('4 – 40', '0,911', '0,385'), ('40 – 4000', '0,683', '0,466'),
          ('4000 – 40 000', '0,193', '0,618'), ('40 000 – 400 000', '0,027', '0,805')]
    rows = ''.join(f'<div>{T(a if i else "[s]" + a + "[/s]")}</div><div>{T(c if i else "[s]" + c + "[/s]")}</div><div>{T(m if i else "[s]" + m + "[/s]")}</div>'
                   for i, (a, c, m) in enumerate(tb))
    b += f'<div class="tb sm" style="grid-template-columns:60mm 30mm 30mm;margin-left:10mm">{rows}</div>'
    b += L('$A_s = \\pi D L$ → $\\dot{Q} = h A_s (T_s - T_\\infty)$')
    b += head('Esfera (props a $T_\\infty$, $\\mu_s$ a $T_s$)')
    b += L('$Nu = 2 + [0,4\\,Re^{1/2} + 0,06\\,Re^{2/3}] Pr^{0,4} (\\mu_\\infty / \\mu_s)^{1/4}$')
    b += note('3,5 < Re < 80 000 · 0,7 < Pr < 380 · $A_s = \\pi D^2$', 'b')
    b += head('Banco de tubos (Zukauskas)')
    b += L('en línea: $V_{max} = \\frac{S_T}{S_T - D} V$ → $Re_D = \\frac{\\rho V_{max} D}{\\mu}$')
    b += L('$Nu_D = C\\,Re_D^m Pr^n (Pr/Pr_s)^{0,25}$ [s]tabla 7-2 · F si $N_L$ < 16[/s]')
    b += L('se trata como intercambiador: $\\dot{Q} = h A_s \\Delta T_{ln}$ · $A_s = N \\pi D L$', cls='sm')
    return b


def p_int1():
    b = head('Fórmulas · INTERNA', mark='°', hl=True)
    b += L('[s]propiedades a $T_b = (T_{in} + T_{out})/2$[/s]', cls='sm')
    b += head('Básicas')
    b += L('$\\dot{m} = \\rho V_{prom} A_c = \\rho \\dot{V}$ · $D_h = \\frac{4 A_c}{p}$')
    b += L('$Re = \\frac{V_{prom} D_h}{\\nu} = \\frac{4 \\dot{m}}{\\pi D \\mu}$ [s](la segunda solo en tubo circular)[/s]')
    b += L('laminar < 2300 < transición < 10 000 < turbulento', cls='sm')
    b += L('entrada: laminar $L_h \\approx 0,05 Re D$ · $L_t \\approx Pr\\,L_h$ · turbulento $L_h \\approx 10 D$', cls='sm')
    b += head('$T_s$ constante')
    b += L('$T_{out} = T_s - (T_s - T_{in})\\,e^{-h A_s / \\dot{m} c_p}$')
    b += FL('$\\Delta T_{ln} = \\frac{T_{in} - T_{out}}{\\ln[(T_s - T_{out})/(T_s - T_{in})]}$', 'si se enfría sale negativo → el fluido pierde calor')
    b += L('$\\dot{Q} = h A_s \\Delta T_{ln} = \\dot{m} c_p (T_{out} - T_{in})$')
    b += head('$\\dot{q}_s$ constante')
    b += L('$\\dot{Q} = \\dot{q}_s A_s$ · $T_{out} = T_{in} + \\frac{\\dot{q}_s A_s}{\\dot{m} c_p}$ · $T_s = T_m + \\frac{\\dot{q}_s}{h}$')
    b += note('la pared va siempre $\\dot{q}_s/h$ por encima → $T_s$ máxima a la salida', 'b')
    b += G.tx_plots()
    return b


def p_int2():
    b = head('Laminar completamente desarrollado')
    b += L('$Nu = 3,66$ ($T_s$ cte) · $4,36$ ($\\dot{q}_s$ cte) [s]tubo circular · f = 64/Re[/s] [b](pizarra)[/b]')
    b += L('no circular (con $D_h$): cuadrado 2,98 / 3,61 · a/b = 2: 3,39 / 4,12', cls='sm')
    b += L('a/b = 4: 4,44 / 5,33 · placas paralelas: 7,54 / 8,24', cls='sm')
    b += head('Laminar con región de entrada ($T_s$ cte)')
    b += L('$Nu = 3,66 + \\frac{0,065 (D/L) Re Pr}{1 + 0,04 [(D/L) Re Pr]^{2/3}}$ [s]Edwards · tubo "corto"[/s] [b](pizarra)[/b]')
    b += L('$Nu = 7,54 + \\frac{0,03 (D_h/L) Re Pr}{1 + 0,016 [(D_h/L) Re Pr]^{2/3}}$ [s]aletas / placas paralelas[/s]')
    b += head('Turbulento ($L > 10 D$)')
    b += FL('$Nu = 0,023\\,Re^{0,8} Pr^n$', 'Dittus–Boelter · Re > 10 000 · 0,7 ≤ Pr ≤ 160')
    b += FL('$Nu = \\frac{(f/8)(Re - 1000) Pr}{1 + 12,7 (f/8)^{0,5} (Pr^{2/3} - 1)}$', 'Gnielinski · también en transición')
    b += FL('$f = (0,790 \\ln Re - 1,64)^{-2}$', 'Petukhov (liso) · ¡exponente −2! (en la foto parece 2)')
    b += FL('$\\frac{1}{\\sqrt{f}} = -2,0 \\log(\\frac{\\varepsilon/D}{3,7} + \\frac{2,51}{Re \\sqrt{f}})$', 'Colebrook (rugoso) · iterar')
    b += head('Presión')
    b += L('$\\Delta P = f \\frac{L}{D_h} \\frac{\\rho V^2}{2}$ · $\\dot{W}_{bomba} = \\dot{V} \\Delta P$')
    return b


def datos(lines, fig):
    return cols(''.join(L(x, cls='sm') for x in lines), fig, widths=('1fr', '76mm'))


def p_737():
    b = head('Ejercicio 7-37 · placa con transistores', mark='°', hl=True)
    b += datos(['[s]datos:[/s] 6 W cada transistor', 'placa 0,25 × 0,25 m · V = 4 m/s', '$T_\\infty$ = 35 °C · $T_s$ ≤ 65 °C',
                '[b]¿cuántos transistores caben?[/b]'], G.plate_737())
    b += L('§1§ $T_f = \\frac{65 + 35}{2} = 50$ °C → tabla A-15 [s](externa · placa plana)[/s]', cls='sm')
    b += L('k = 0,02735 · ν = 1,798×10⁻⁵ · Pr = 0,7228', cls='sm')
    b += L('§2§ $Re_L = \\frac{V L}{\\nu} = \\frac{(4)(0,25)}{1,798 \\cdot 10^{-5}} = 55 617$ [b]< 5×10⁵ → laminar[/b]', cls='sm')
    b += L('§3§ $Nu = 0,664\\,Re_L^{0,5} Pr^{1/3} = 0,664 (235,8)(0,8974) = 140,5$', cls='sm')
    b += L('§4§ $h = \\frac{Nu\\,k}{L} = \\frac{(140,5)(0,02735)}{0,25} = 15,37$ W/m²K', cls='sm')
    b += L('§5§ $A_s = (0,25)^2 = 0,0625$ m²', cls='sm')
    b += L('§6§ $\\dot{Q} = h A_s (T_s - T_\\infty) = (15,37)(0,0625)(30) = 28,8$ W', cls='sm')
    b += L('§7§ $n = \\frac{28,8}{6} = 4,8$ → [b][u]4 transistores[/u][/b]', cls='sm')
    b += note('con 5 serían 30 W > 28,8 W → la placa pasaría de 65 °C', 'b', 3)
    b += head('Lo que enseña')
    b += L('· "¿cuántos caben?" → siempre hacia abajo', cls='sm')
    b += L('· en la placa, L es el largo en la dirección del flujo', cls='sm')
    b += L('· el régimen se decide con $Re_L$ (el de toda la placa)', cls='sm')
    return b


def p_845():
    b = head('Ejercicio 8-45 · ducto en el ático', mark='°', hl=True)
    b += datos(['[s]datos:[/s] $T_{in}$ = 85 °C · $T_s$ = 70 °C', 'L = 10 m · sección 0,15 × 0,15 m', '$\\dot{V}$ = 0,10 m³/s · 1 atm',
                '[b]§1§ $T_{out}$ · §2§ calor perdido[/b]'], G.duct_845())
    b += L('§2§ supongo $T_{out}$ = 75 °C → $T_b$ = 80 °C → tabla A-15:', cls='sm')
    b += L('k = 0,02953 · ν = 2,097×10⁻⁵ · $c_p$ = 1008 · Pr = 0,7154', cls='sm')
    b += L('§3§ $D_h = \\frac{4 (0,15)^2}{4 (0,15)} = 0,15$ m [s](cuadrado: $D_h$ = lado)[/s]', cls='sm')
    b += L('§4§ $V = \\frac{\\dot{V}}{A_c} = \\frac{0,10}{0,15^2} = 4,44$ m/s', cls='sm')
    b += L('§5§ $Re = \\frac{(4,444)(0,15)}{2,097 \\cdot 10^{-5}} = 31 791$ [b]turbulento · $L_h$ ≈ 1,5 m << 10 m[/b]', cls='sm')
    b += L('§6§ $Nu = 0,023\\,Re^{0,8} Pr^{0,3} = 83,17$ [s]n = 0,3: el aire se enfría[/s]', cls='sm')
    b += L('§7§ $h = \\frac{(83,17)(0,02953)}{0,15} = 16,37$ W/m²K', cls='sm')
    b += L('§8§ $A_s$ = 4(0,15)(10) = 6 m² · $\\rho = \\frac{P}{RT} = \\frac{101,325}{(0,287)(358)} = 0,9862$ kg/m³', cls='sm')
    b += L('$\\dot{m} = \\rho \\dot{V}$ = (0,9862)(0,10) = 0,09862 kg/s', cls='sm')
    b += L('§9§ $\\frac{h A_s}{\\dot{m} c_p} = 0,988$ → $T_{out} = 70 + 15\\,e^{-0,988} = 75,6$ °C', cls='sm')
    b += L('§10§ $\\Delta T_{ln}$ = −9,53 °C → $\\dot{Q} = h A_s \\Delta T_{ln} = (16,37)(6)(-9,53) = -936$ W', cls='sm')
    b += note('check: $\\dot{m} c_p$ (85 − 75,6) = 936 W ✓ · $T_b$ real = 80,3 °C ≈ 80 ✓', 'b', 2)
    b += L('[b][u]$T_{out}$ ≈ 75,6 °C · el ducto pierde ≈ 936 W[/u][/b]')
    return b


def p_847():
    b = head('Ejercicio 8-47 · colector solar de aire', mark='°', hl=True)
    b += datos(['[s]datos:[/s] 1 m × 5 m · separación 3 cm', '$\\dot{V}$ = 0,15 m³/s · $T_{in}$ = 30 °C',
                'vidrio 20 °C · placa 60 °C', '[b]§1§ calor neto · §2§ ΔT[/b]'], G.collector_847())
    b += note('gana de la placa (60 > 30) y pierde al vidrio (20 < 30) → calor NETO', 'b', 0)
    b += L('§2§ supongo $T_{out}$ = 40 °C → $T_b$ = 35 °C → tabla A-15:', cls='sm')
    b += L('ρ = 1,145 · k = 0,02625 · ν = 1,655×10⁻⁵ · $c_p$ = 1007 · Pr = 0,7268', cls='sm')
    b += L('§3§ $A_c$ = (1)(0,03) = 0,03 m² [s](¡no 0,3!)[/s] · p = 2(1 + 0,03) = 2,06 m', cls='sm')
    b += L('$D_h = \\frac{4 A_c}{p} = \\frac{4 (0,03)}{2,06} = 0,05825$ m · §4§ V = 0,15/0,03 = 5 m/s', cls='sm')
    b += L('§5§ $Re = \\frac{(5)(0,05825)}{1,655 \\cdot 10^{-5}} = 17 599$ [b]turbulento[/b]', cls='sm')
    b += L('§6§ $Nu = 0,023\\,Re^{0,8} Pr^{0,4} = 50,43$ · §7§ $h = \\frac{(50,43)(0,02625)}{0,05825} = 22,72$', cls='sm')
    b += L('§8§ truco: $\\dot{Q}_{neto} = hA(60 - T) - hA(T - 20) = h (2A)(40 - T)$', cls='sm')
    b += note('= una sola superficie de $A_s$ = 2(1)(5) = 10 m² a 40 °C', 's', 2)
    b += L('$\\dot{m}$ = (1,145)(0,15) = 0,1718 kg/s', cls='sm')
    b += L('§9§ $\\frac{h A_s}{\\dot{m} c_p} = 1,314$ → $T_{out} = 40 - 10\\,e^{-1,314} = 37,3$ °C → [b]ΔT = 7,3 °C[/b]', cls='sm')
    b += L('§10§ $\\dot{Q} = \\dot{m} c_p \\Delta T = (0,1718)(1007)(7,31) = 1265$ W ✓', cls='sm')
    b += L('[b][u]$\\dot{Q}_{neto}$ ≈ 1,26 kW · ΔT ≈ 7,3 °C[/u][/b]')
    return b


def p_839():
    b = head('Ejercicio 8-39 · ¿por qué el agua enfría más?', mark='°', hl=True)
    b += L('[s]2 m/s · tubo D = 8 cm, L = 7 m · $\\dot{q}_s$ cte · props a 25 °C[/s]', cls='sm')
    rows = [('', '[b]aire[/b]', '[b]agua[/b]'), ('k (W/mK)', '0,02551', '0,607'), ('ν (m²/s)', '1,562×10⁻⁵', '8,937×10⁻⁷'),
            ('Pr', '0,7296', '6,14'), ('Re = VD/ν', '10 243', '179 035'), ('$Nu = 0,023 Re^{0,8} Pr^{0,4}$', '32,76', '757,4'),
            ('[b]h = Nu k/D[/b]', '[b]10,4[/b]', '[b]5747[/b]')]
    cells = ''.join(f'<div>{T(a)}</div><div>{T(c)}</div><div>{T(d)}</div>' for a, c, d in rows)
    b += f'<div class="tb" style="grid-template-columns:80mm 45mm 45mm">{cells}</div>'
    b += FL('$\\frac{h_{agua}}{h_{aire}} = \\frac{5747}{10,4} \\approx 550$', 'k explica ×24 · el resto (×23) es Nu: ν 17 veces menor y Pr 8 veces mayor', 'b')
    b += head('Mis 4 ejercicios en una tabla')
    b += L('[k]7-37[/k] placa · laminar · 0,664… → [b]4 transistores[/b]', cls='sm')
    b += L('[k]8-39[/k] tubo · turbulento · D–B n = 0,4 → [b]10,4 vs 5747[/b]', cls='sm')
    b += L('[k]8-45[/k] ducto · turbulento · D–B n = 0,3 → [b]75,6 °C y 936 W[/b]', cls='sm')
    b += L('[k]8-47[/k] colector · turbulento · D–B n = 0,4 → [b]1265 W y +7,3 °C[/b]', cls='sm')
    return b


def p_E1():
    b = head('Ejemplo extra E1 · tubería al viento', mark='°', hl=True)
    b += datos(['tubería D = 5 cm a 80 °C', 'viento: 20 °C y 10 m/s',
                '[b]¿calor perdido por metro?[/b]', '[s]externa · cilindro[/s]'], G.cylinder_E1())
    b += L('§1§ $T_f$ = 50 °C → k = 0,02735 · ν = 1,798×10⁻⁵ · Pr = 0,7228', cls='sm')
    b += L('§2§ $Re = \\frac{V D}{\\nu} = \\frac{(10)(0,05)}{1,798 \\cdot 10^{-5}} = 27 809$', cls='sm')
    b += L('§3§ Churchill–Bernstein por partes: A = 0,62 $Re^{1/2} Pr^{1/3}$ = 92,79', cls='sm')
    b += L('B = $[1 + (0,4/Pr)^{2/3}]^{1/4}$ = 1,1375 · C = $[1 + (Re/282 000)^{5/8}]^{4/5}$ = 1,1840', cls='sm')
    b += L('$Nu = 0,3 + \\frac{A}{B} C = 96,9$ [s](Hilpert: 96,6, casi igual)[/s]', cls='sm')
    b += L('§4§ $h = \\frac{Nu\\,k}{D} = \\frac{(96,9)(0,02735)}{0,05} = 53,0$ W/m²K', cls='sm')
    b += L('§5§ $\\dot{Q} = h (\\pi D L)(T_s - T_\\infty) = (53,0)(0,1571)(60) =$ [b][u]500 W por metro[/u][/b]', cls='sm')
    b += head('Ahora tú')
    b += L('[k]P1[/k] aire 20 °C a 6 m/s sobre placa de 2 m (largo) × 1 m a 60 °C. ¿Q̇ por una cara?', cls='sm')
    b += L('[k]P2[/k] esfera D = 3 cm a 70 °C en aire a 20 °C y 5 m/s. ¿h y Q̇?', cls='sm')
    b += L('[k]P3[/k] ¿V mínima para montar 6 transistores en la placa del 7-37?', cls='sm')
    b += note('respuestas en la pág. 17', 's', 0)
    return b


def p_E2():
    b = head('Ejemplo extra E2 · laminar con entrada', mark='°', hl=True)
    b += datos(['agua a 10 °C · $\\dot{m}$ = 0,01 kg/s', 'D = 2 cm · L = 10 m · pared 60 °C',
                '[b]¿$T_{out}$ y $\\dot{Q}$?[/b]', '[s]interna · laminar · $T_s$ cte[/s]'], G.tube('steam'))
    b += L('§1§ supongo $T_{out}$ ≈ 50 °C → $T_b$ = 30 °C → tabla A-9:', cls='sm')
    b += L('ρ = 996 · $c_p$ = 4178 · k = 0,615 · μ = 0,798×10⁻³ · Pr = 5,42', cls='sm')
    b += L('§2§ $Re = \\frac{4 \\dot{m}}{\\pi D \\mu} = 798$ [b]laminar[/b] · $L_t$ = 0,05 Re Pr D = 4,32 m', cls='sm')
    b += note('$L_t$ comparable a L = 10 m → hay región de entrada → Edwards', 'b', 2)
    b += L('§3§ $\\frac{D}{L} Re\\,Pr = 8,65$ → $Nu = 3,66 + \\frac{0,065 (8,65)}{1 + 0,04 (8,65)^{2/3}} = 4,14$', cls='sm')
    b += L('§4§ $h = \\frac{(4,14)(0,615)}{0,02} = 127,3$ W/m²K [s](con 3,66 → 112,5)[/s]', cls='sm')
    b += L('§5§ $A_s$ = πDL = 0,6283 m² · $\\frac{h A_s}{\\dot{m} c_p} = 1,915$', cls='sm')
    b += L('$T_{out} = 60 - 50\\,e^{-1,915} = 52,6$ °C', cls='sm')
    b += L('§6§ $\\dot{Q} = \\dot{m} c_p \\Delta T = (0,01)(4178)(42,6) =$ [b][u]1781 W[/u][/b] · $T_b$ real = 31,3 °C ✓', cls='sm')
    b += head('Ahora tú')
    b += L('[k]P4[/k] aire 20 °C en ducto 1 cm × 1 cm, L = 2 m, V = 1,5 m/s, paredes a 80 °C. ¿$T_{out}$?', cls='sm')
    b += L('[k]P5[/k] Re = 5000, Pr = 0,7: Nu con Gnielinski y con Dittus–Boelter. ¿Cuál uso?', cls='sm')
    return b


def p_E3():
    b = head('Ejemplo extra E3 · resistencia eléctrica', mark='°', hl=True)
    b += datos(['agua de 20 → 60 °C · 8 L/min', 'D = 2 cm · $\\dot{q}_s$ = 20 kW/m²',
                '[b]§1§ L · §2§ $T_s$ salida · §3§ $\\dot{W}$ bomba[/b]', '[s]interna · turbulento · $\\dot{q}_s$ cte[/s]'], G.tube('coil'))
    b += L('§1§ $T_b$ = 40 °C (dato) → ρ = 992,1 · $c_p$ = 4179 · k = 0,631 · Pr = 4,32', cls='sm')
    b += L('§2§ $\\dot{m}$ = 0,1323 kg/s → $\\dot{Q}$ = (0,1323)(4179)(40) = 22,1 kW', cls='sm')
    b += L('$A_s = \\frac{\\dot{Q}}{\\dot{q}_s} = 1,106$ m² → $L = \\frac{A_s}{\\pi D} =$ [b]17,6 m[/b]', cls='sm')
    b += L('§3§ ν = 6,582×10⁻⁷ · V = 0,424 m/s · Re = 12 896 → Nu = 80,2 → h = 2531', cls='sm')
    b += L('$T_{s,out} = T_{out} + \\frac{\\dot{q}_s}{h} = 60 + \\frac{20 000}{2531} =$ [b]67,9 °C[/b]', cls='sm')
    b += L('§4§ f = 0,0294 → ΔP = 2,3 kPa → [b]$\\dot{W}$ = $\\dot{V}$ ΔP = 0,31 W[/b]', cls='sm')
    b += head('Respuestas de "Ahora tú"')
    b += L('[k]P1[/k] $T_f$ = 40 °C · $Re_L$ = 7,05×10⁵ → combinada · Nu = 803 → [b]h = 10,7 · Q̇ ≈ 856 W[/b]', cls='sm')
    b += L('[k]P2[/k] props a 20 °C · Re = 9894 · Whitaker Nu = 59,8 → [b]h = 50,1 · Q̇ ≈ 7,1 W[/b]', cls='sm')
    b += L('[k]P3[/k] Q̇ = 36 W → h = 19,2 → Nu = 175,5 → Re = 86 740 → [b]V ≈ 6,2 m/s[/b]', cls='sm')
    b += L('[k]P4[/k] Re = 834 laminar · Nu = 2,98 · h = 8,15 → [b]$T_{out}$ ≈ 78,8 °C · Q̇ ≈ 9,7 W[/b]', cls='sm')
    b += L('[k]P5[/k] f = 0,0386 · Gnielinski 16,6 · D–B 18,2 → [b]Gnielinski (D–B solo si Re > 10 000)[/b]', cls='sm')
    return b


def p_errores():
    b = head('Errores típicos (los que más restan)', mark='°', hl=True)
    errs = [
        'props a la T equivocada → externa $T_f$ · interna $T_b$',
        '$A_c$ ≠ $A_s$ → sección (para V y $D_h$) vs. superficie (para Q̇)',
        'placa: L = largo en la dirección del flujo, no el ancho',
        'olvidar el ×10⁻⁵ de ν → Re mal por miles',
        'n de Dittus–Boelter al revés → 0,4 calienta · 0,3 enfría',
        'Dittus–Boelter con Re < 10 000 → usar 3,66 / 4,36 o Gnielinski',
        'Petukhov: el exponente es −2 → f ≈ 0,02–0,04',
        'ΔT aritmético en vez de $\\Delta T_{ln}$ (con $T_s$ cte)',
        '$\\Delta T_{ln}$ negativo = el fluido pierde calor (dar el valor absoluto)',
        '$T_{out}$ fuera de [$T_{in}$, $T_s$] → hay un error de signo',
        'ρ = P/RT con T en K y P en kPa',
        'no verificar la $T_{out}$ supuesta (paso 10)',
        '"¿cuántos caben?" → redondear hacia abajo',
        'ln (Petukhov) ≠ log (Colebrook)',
    ]
    for i, e in enumerate(errs, 1):
        b += L(f'[s]{i}.[/s] {e}', cls='sm')
    b += head('Checklist antes de entregar')
    b += L('☐ dibujo y datos en SI ☐ suposiciones ☐ T de props ☐ Re y régimen', cls='sm')
    b += L('☐ correlación en su rango ☐ h razonable ☐ $T_{out}$ verificada ☐ Q̇ por 2 caminos', cls='sm')
    return b


def p_resumen():
    b = head('Hoja resumen', mark='°', hl=True)
    b += L('[b]siempre:[/b] $\\dot{Q} = h A_s (T_s - T_\\infty)$ · Re = $V L_c / \\nu$ · Nu = $h L_c / k$ · T props → Re → Nu → h → Q̇', cls='sm')
    left = (head('Externa · $T_f$', mark='×', cls='b') +
            L('placa lam.: $0,664 Re_L^{0,5} Pr^{1/3}$', cls='sm') +
            L('placa > 5×10⁵: $(0,037 Re_L^{0,8} - 871) Pr^{1/3}$', cls='sm') +
            L('cilindro: Churchill–Bernstein', cls='sm') +
            L('o Hilpert $C Re^m Pr^{1/3}$', cls='sm') +
            L('esfera: Whitaker (props a $T_\\infty$)', cls='sm') +
            L('áreas: Lw · πDL · πD²', cls='sm') +
            L('críticos: placa 5×10⁵', cls='sm') +
            L('h gases: 10–250 W/m²K', cls='sm'))
    right = (head('Interna · $T_b$', mark='×', cls='s') +
             L('$D_h = 4A_c/p$ · $V = \\dot{V}/A_c$ · $\\dot{m} = \\rho\\dot{V}$', cls='sm') +
             L('lam.: 3,66 ($T_s$) / 4,36 ($\\dot{q}_s$)', cls='sm') +
             L('entrada: Edwards / placas paralelas', cls='sm') +
             L('turb.: $0,023 Re^{0,8} Pr^n$ (0,4 / 0,3)', cls='sm') +
             L('transición: Gnielinski + Petukhov', cls='sm') +
             L('$T_s$: $T_{out} = T_s - (T_s - T_{in}) e^{-hA_s/\\dot{m} c_p}$', cls='sm') +
             L('$\\dot{q}_s$: $\\dot{Q} = \\dot{q}_s A_s$ · $T_s = T_m + \\dot{q}_s/h$', cls='sm') +
             L('ΔP = $f (L/D_h) \\rho V^2/2$ · f lam. = 64/Re', cls='sm'))
    b += cols(left, right)
    b += L('$\\Delta T_{ln} = \\frac{T_{in} - T_{out}}{\\ln[(T_s - T_{out})/(T_s - T_{in})]}$ · $\\dot{Q} = h A_s \\Delta T_{ln}$', cls='sm')
    b += head('Los 5 errores que más se repiten', mark='×', cls='s')
    b += L('① T de props · ② $A_c$ vs $A_s$ · ③ n al revés · ④ D–B con Re < 10 000 · ⑤ no verificar $T_{out}$', cls='sm')
    b += head('Para resolver (siempre igual)', mark='×')
    b += L('dibujo y datos → T de props → Re (régimen) → Nu → h → $\\dot{Q}$ / $T_{out}$ → verificar', cls='sm')
    b += head('Datos que conviene tener a mano', mark='×')
    b += L('1 atm = 101,325 kPa · R aire = 0,287 kPa·m³/kgK · T(K) = T(°C) + 273', cls='sm')
    b += L('críticos: placa 5×10⁵ · tubo 2300 y 10 000 · $L_h$ turbulento ≈ 10D', cls='sm')
    return b


PAGES = [p_cover, p_ideas1, p_ideas2, p_mapa, p_metodo_ext, p_metodo_int, p_ext1, p_ext2, p_int1, p_int2,
         p_737, p_845, p_847, p_839, p_E1, p_E2, p_E3, p_errores, p_resumen]

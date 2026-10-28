# estilo.md — guía de estilo extraída de `referencia.mp4`

Fuente analizada: `referencia.mp4` (TikTok @1volt1amp, "pinzas de arranque"), 576×1024, 30 fps, 150,1 s
(138,6 s de narración + 11,5 s de cierre). Fotogramas extraídos a 2 fps (300) + detección de cambio de plano
(`select='gt(scene,0.25)'`), audio transcrito con Whisper `small` (es). Todo lo de abajo está medido salvo lo
marcado con **[SUPOSICIÓN]**. Medidas en píxeles ya escaladas a nuestro lienzo 1080×1920 (factor ×1,875).

## 1. Formato
- Lienzo: 1080×1920, 30 fps.
- Tipo de pieza: explainer de animación 2D vectorial (flat), sin persona en cámara, sin metraje real.
- Una sola escena-mundo continua (dos coches en una calle de noche) que se recorre con la cámara.

## 2. Ritmo de cortes y cámara
- **Cortes duros: 2 en 138 s** (79,3 s y 100,5 s), ambos coinciden con un destello de explosión (flash blanco-amarillo de 1–2 fotogramas que tapa el corte).
- El "montaje" real son **movimientos de cámara continuos** dentro de la misma ilustración: 15 encuadres en 138 s → **1 cambio de encuadre cada ~9 s** (rango 4–20 s).
- Cada transición de encuadre = pan + zoom simultáneos de **~1,0 s (30 fotogramas)** con easing in-out [SUPOSICIÓN: cúbico/`Easing.inOut(Easing.cubic)`].
- Niveles de zoom usados: **plano general 1×**, **plano medio ~2,2×**, **detalle ~4×** (pinza/borne).
- Entre movimientos, la cámara nunca está 100 % quieta: deriva lenta de ~2–3 % de escala o ~20 px por cada 5 s [SUPOSICIÓN: Ken Burns lineal].
- El encuadre cambia en el **punto/pausa de la frase** (las pausas >0,4 s de la voz, ~cada 4 s), no a mitad de palabra.

## 3. Subtítulos
- **No hay subtítulos de la narración.** 0 palabras de la locución transcritas en pantalla.
- En su lugar hay **etiquetas-clave** (ver §4). Si se añaden subtítulos en nuestro vídeo, es una desviación consciente del estilo.

## 4. Textos en pantalla (etiquetas)
- **Fuente:** monoespaciada, peso bold/semibold [SUPOSICIÓN: JetBrains Mono / Fira Code; usar `JetBrains Mono` 700].
- **Tamaño:** altura de bloque de texto 27 px en 576 → **~50 px en 1080 → `font-size: 44px`**, `letter-spacing: 0`.
- **Fondo:** píldora `#080716` al ~85 % de opacidad, padding ≈ 10 px vertical / 18 px horizontal, `border-radius: 14px`. A veces sin píldora (texto blanco 70 % sobre fondo oscuro).
- **Longitud:** **2–4 palabras** ("La última pinza", "Metal del motor", "Como en los dibujos", "Todo esto es el negativo", "Siempre en la última", "Donde no hay gas").
- **Frecuencia:** ~1 etiqueta cada 6–10 s; duración en pantalla **2,5–7 s**.
- **Posición:** anclada al objeto que nombra (no posición fija). En planos generales cae a **~43 % de la altura** (y≈830 px); en detalle, pegada al objeto con línea-guía de 1 px.
- **Animación:** entrada fade + leve subida (~8 px) en **~0,4 s (12 f)**; salida fade **~0,4 s**. Sin rebote, sin escala, sin palabra a palabra.
- **Colores según significado (palabra/etiqueta destacada):**
  - Neutro/descriptivo: blanco `#E8E6F0` ("Metal del motor", "Como en los dibujos", "Abierto: no pasa nada").
  - Regla clave / idea a recordar: amarillo **`#F8C848`** ("La última pinza", "Siempre en la última", "Donde no hay gas").
  - Electricidad / circuito: cian **`#08D8E8`** ("Todo esto es el negativo", "Cerrado").
  - Polo positivo / palabra "Rojo": rojo `#E8414F` [SUPOSICIÓN en el tono exacto].
- **Listas** (pasos): checklist numerada con círculos de 26 px; los pasos inactivos al 25 % de opacidad y el activo al 100 %, se ilumina uno a uno sincronizado con la voz (~2 s por paso).
- **Datos:** tarjeta oscura redondeada (`#0B091D`, borde 1 px blanco 8 %) con número grande amarillo (≈ 64 px) que **cuenta de 0 a N en ~4 s** mientras se rellena una retícula de puntos; fuente citada en 18 px gris abajo ("EE. UU., un año (NHTSA, 1993-94)"). Iconos repetidos para proporciones ("7 de cada 10" = 10 ojos, 7 en amarillo).

## 5. B-roll / recursos visuales
- No hay b-roll de stock. Todo es ilustración propia:
  - **Lupa/callout circular** (radio ≈ 250 px, borde 3 px `#6A5A9A`) con línea fina al punto que amplía: se usa para mostrar el interior (celdas de la batería).
  - **Corriente** = trazo discontinuo cian `#08D8E8` (dash ~20 px / gap ~14 px) que avanza a lo largo del cable ("hormigas en marcha", ~120 px/s [SUPOSICIÓN]).
  - **Partículas:** chispas amarillo-naranja (30–60 segmentos que salen radialmente y caen con gravedad, 0,5–1 s), burbujas/gas como nube blanca difusa (blur ~20 px).
  - **Medidor** vertical (barra con umbral marcado "4 % · Arde") que se llena en ~1 s.
- Cada concepto de la narración tiene su representación visual en el mismo segundo en que se nombra.

## 6. Transiciones
- 0 transiciones tipo wipe/slide/zoom-blur. Solo: (a) movimiento de cámara de ~1 s, (b) fundidos de opacidad de elementos de 0,4 s, (c) 2 cortes disfrazados con flash.
- Elementos superpuestos (tarjetas, lupas, listas) entran con fade 0,4–0,5 s y salen con fade 0,4 s.

## 7. Color e iluminación
- Fondo: noche azul-violeta muy oscura, **`#0B091D`** (dominante), negros `#01000F`; ciudad de fondo en `#2A2350`–`#3A2F6A` con ventanas `#F8C848` al 60 %.
- Paleta de objetos saturada: morado `#582888`, verde azulado `#186878`, rojo cable `#E0303C`, cian `#08D8E8`, amarillo `#F8C848`.
- Luz: cono de farola cálido (`#FFF2C8` al ~8–12 % de opacidad, gradiente), halos de faros con blur, suelo mojado con reflejo especular al 30 %.
- Bajo contraste general (low-key), acentos de alto contraste solo en lo importante. Sin grano, sin LUT visible.

## 8. Sonido
- **Voz en off** masculina, castellano, tono cercano y explicativo. **173 palabras/min**. Frases de 2–5 s; 34 pausas >0,4 s (media 0,59 s).
- Estructura del guion: gancho con contradicción (0–12 s) → creencia lógica → por qué falla → mecanismo físico → consecuencia/datos → regla práctica → resumen en 1 frase (repite la etiqueta clave).
- **Música** de fondo continua, suave, de registro grave/tonal (visible en el espectro como bandas < 1 kHz): **voz ≈ −16 dB RMS, música en pausas ≈ −27/−31 dB → música ~12–15 dB por debajo de la voz**. [SUPOSICIÓN: lo-fi/ambient electrónico, sin percusión marcada].
- Loudness integrado **−14 LUFS**.
- SFX: chispazos sincronizados con las chispas visuales y un golpe en la explosión [SUPOSICIÓN: no aislables en el espectro por debajo de la voz].
- Cierre: 11,5 s de tarjeta de marca (sin voz) sobre fondo `#0B091D`.

## 9. Preferencias del usuario (correcciones aprobadas)
_(Se irán añadiendo aquí cuando me corrijas algo que te guste.)_

- **Sin subtítulos de narración: solo etiquetas-clave** (§4). Confirmado por el usuario.
- **Voz:** ElevenLabs, voz "Pablo – Amigable y Explicativa" (`6X3rSPfxjGvtcD9GxQcW`, castellano peninsular), modelo `eleven_v4`.
- **Fondo sin cono de luz.** Se elimina la luz de farola de la referencia (§7): solo noche azul-violeta `#0B091D` con degradado radial y estrellas que titilan.
- **Música aprobada ("perfecta"):** instrumental ambient electrónico tranquilo, pads graves cálidos, bajo suave, arpegio pulsado sutil, sin batería marcada (ElevenLabs `eleven_music_v2_5`). Volumen 0,2 bajo la voz (~14 dB por debajo), sube a 0,45 en el cierre y se funde al final.
- **Todo lo demás del vídeo de la ley de Ohm queda aprobado como plantilla:** etiquetas monoespaciadas en píldora, paleta (amarillo idea clave, cian electricidad, naranja calor), escenas que se encadenan con zoom de cámara, gráficas en tarjetas oscuras, voz acelerada ×1,1 (~180 palabras/min), destellos + "tic" en los choques, mezcla final a −14 LUFS.
- **Cierre de canal obligatorio (aprobado tal cual) — logo "Frecuencia Cero":** marco redondeado blanco con una onda dentro y el texto "Frecuencia Cero" (sans geométrica tipo Montserrat, blanco sobre negro). Animación: la onda sigue avanzando hacia la derecha, pierde amplitud hasta quedar en **línea recta (frecuencia cero)**; a la vez aparece el texto con una pequeña animación + **efecto de sonido**, y el narrador dice **"Frecuencia Cero"**.
  - **El texto "Frecuencia Cero" se enciende como una bombilla:** a los 63,55 s parpadea (0 → 85 % → 10 % → 95 % → 25 % → 100 % → 70 % → 100 % en 0,52 s) y queda encendido con un halo cálido `#FFF1C9` (dos desenfoques: 16 y 55 px en el lienzo del logo) que se asienta al 55 %. Timing: marco 0,8 s, onda se aplana en 1,5 s, SFX al empezar a aplanarse, texto+voz al terminar.
- **Proceso aprobado para todos los vídeos nuevos (confirmado el 2026-10-28, vídeo "Aspiradora"):**
  - Guion en `guion/<tema>/guion.txt`, en el mismo tono y con la misma estructura: gancho, creencia, por qué falla, mecanismo, dato concreto, regla práctica y resumen en una frase.
  - Voz: ElevenLabs, Pablo (`6X3rSPfxjGvtcD9GxQcW`), `eleven_v4`, acelerada ×1,1. Se descarga la toma A; la toma B queda en el flujo.
  - Tiempos de escena y etiquetas sacados con Whisper `small` (palabra a palabra) sobre la narración final, no sobre el guion.
  - Una sola escena-mundo recorrida con la cámara, etiquetas de 2 a 4 palabras, tarjetas oscuras con datos y cierre Frecuencia Cero.
  - Mezcla final a −14 LUFS y render 1080×1920, 30 fps.
  - Antes de dar el vídeo por bueno: fotogramas de prueba revisados, lint y `tsc` limpios, y después el render completo.
  - **Coste de voz (aprobado el 2026-10-28):** generar **una sola toma** (`generations_count: 1`). La segunda toma duplica el gasto y no se usó nunca. Antes de generar, estimar el coste con `estimate_only: true`. Si hay un error, revisarlo antes de volver a enviar la petición. Reutilizar el audio existente si el texto no ha cambiado.
- **Caras de personas (corrección del 2026-10-28, vídeo "Parálisis"):** las caras de "Sacudida" y "Nariz" salían deformes: un óvalo con un triángulo suelto como nariz, y el ojo y la oreja flotando. A partir de ahora, toda persona usa el componente `src/components/Cara.tsx`:
  - Perfil mirando a la derecha, dibujado como **un solo trazado continuo** (frente, puente, nariz, labios, barbilla, mandíbula y nuca), con pelo, oreja a media altura detrás del ojo, ceja y ojo dentro del contorno.
  - Props: `ojos` (0 cerrado, 1 abierto), `miedo` (cejas arriba, ojo muy abierto, boca entreabierta), `giro` (−90 = tumbado boca arriba con la cabeza a la izquierda), `escala`, `piel`, `pelo`.
  - Prohibido: cabezas hechas con óvalos más formas sueltas pegadas encima, o rasgos fuera del contorno de la cara.
  - Antes de usar una cara nueva o modificada, revisarla en un fotograma de prueba a tamaño grande.

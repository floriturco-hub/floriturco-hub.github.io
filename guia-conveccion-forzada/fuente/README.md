# Guía de convección forzada — fuente

Genera `../Guia_Conveccion_Forzada_Cengel.pdf`.

Requisitos: Python 3 con `pypdf`, Node 18+ y la fuente Inter instalada en el sistema.

```bash
npm install            # katex, source-serif-4, playwright
./build.sh             # dos pasadas: la segunda completa los números de página del índice
cp guia.pdf ../Guia_Conveccion_Forzada_Cengel.pdf
```

- `content_a.py` … `content_d.py`: el contenido (HTML con fórmulas KaTeX entre `\( \)` y `\[ \]`).
- `svgs.py`: los diagramas. `styles.css`: el diseño. `render.js`: HTML → PDF (ajusta solas las fórmulas que no entran).
- Las comas decimales se ponen automáticamente dentro de las fórmulas (`gen.py`).

## Versión manuscrita (`manuscrita/`)

Genera `../Guia_Conveccion_Forzada_Manuscrita.pdf` imitando apuntes de Samsung Notes: hoja cuadriculada,
tintas negra (#151515), azul (#0028B8) y salmón (#EF806C) medidas en los apuntes originales, resaltador amarillo,
viñetas "×" y "°", anotaciones con "↳" y números en círculo. La letra es Indie Flower con variación aleatoria
por letra (giro, altura, escala y espaciado); las letras griegas salen de Playpen Sans.

```bash
npm install                                   # desde fuente/
python3 manuscrita/hw_build.py apuntes.html
node manuscrita/render_hw.js apuntes.html ../Guia_Conveccion_Forzada_Manuscrita.pdf
```

- `hw_pages.py`: el contenido página por página (texto con fórmulas entre `$…$`, colores `[b]…[/b]` azul y `[s]…[/s]` salmón,
  `[h]…[/h]` resaltado, `§3§` número en círculo).
- `hw_figs.py`: los dibujos a mano. `hwlib.py`: el motor (cuadrícula, letra, fórmulas, trazos irregulares).

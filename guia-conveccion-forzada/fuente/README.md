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

# Frecuencia Cero — instrucciones para Claude

Canal de Shorts de ciencia (TikTok, YouTube Shorts, Reels). Proyecto Remotion en `ohm-video/`.

**Antes de cualquier video, lee `ohm-video/estilo.md`.** Ahí están el estilo aprobado, la voz, la música, la plantilla de título y descripción y el flujo de publicación.

## Entrega en Google Drive (obligatorio al terminar cada video)

1. Con el conector de **Google Drive**, crea una subcarpeta con el nombre del video (el mismo que el MP4 del repo, p. ej. `cobre-verde`) dentro de la carpeta **FrecuenciaCero** (id `1GQM8y3XHjGsG35J5BAyWlHWJF4J3lYM4`).
2. Sube ahí `<nombre>.txt` con `create_file` (`contentMimeType: text/plain`, `disableConversionToGoogleType: true`). Formato:
   ```
   TITULO: <título aprobado>
   DESCRIP:
   <descripción aprobada, sin asteriscos, con hashtags>
   ```
3. Sube `<nombre>.mp4` con **Make**, solo con el escenario **«Subir video a Drive (Claude)»** (id `6866522`, equipo `3341215`). El conector de Drive no admite archivos tan grandes.
   - Primero haz commit y push del MP4 a la rama y comprueba que la URL raw responde 200: `https://raw.githubusercontent.com/floriturco-hub/floriturco-hub.github.io/<rama>/ohm-video/<nombre>.mp4`
   - `scenarios_activate` → `scenarios_run` con `responsive: true` y `data: {"video_url": "<URL raw>", "folder_id": "<id de la subcarpeta>", "filename": "<nombre>.mp4"}` → `scenarios_deactivate`.
   - Cuesta unas 2 operaciones de Make; el plan gratuito trae 1.000 al mes.
   - Comprueba en Drive que el MP4 quedó en la subcarpeta. La búsqueda por `parentId` tarda en reflejarlo; busca por `title`.

## Publicar con Make (solo cuando el usuario lo pida)

El escenario **«FrecuenciaCero»** (id `6864241`) publica el MP4 y el TXT de **una** subcarpeta en YouTube (Short), Instagram (Reel), Facebook (Reel) y TikTok (vía Late), al momento.
- Ejecútalo **solo si el usuario pide publicar ese video** y con el título y la descripción ya aprobados.
- `scenarios_activate` → `scenarios_run` con `responsive: true` y `data: {"folder_id": "<id de la subcarpeta del video>"}` → `scenarios_deactivate`.
- Pasa siempre `folder_id`. Si va vacío, el escenario toma la subcarpeta creada más recientemente en FrecuenciaCero.
- Si en la subcarpeta falta el MP4 o el TXT, no publica nada y avisa por correo.
- Cuesta unas 15 operaciones de Make por video.

Para programar una hora: `scenarios_update` con `scheduling: {"type": "once", "date": "<ISO en UTC>"}`. Así publica la subcarpeta más reciente, que debe ser la del video. Después, vuelve a dejar el escenario en `on-demand`.

## Prohibido en Make

- No ejecutes «FrecuenciaCero» si el usuario no lo pidió, ni crees escenarios nuevos (el plan gratuito permite 2 y ya están los dos).
- No numeres los archivos (`video_001`, etc.): usa el nombre del video.

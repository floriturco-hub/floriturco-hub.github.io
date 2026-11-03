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

## Prohibido en Make

- **No ejecutes el escenario «FrecuenciaCero» (id `6864241`)**, que publica en redes, ni crees escenarios nuevos. Make se usa **solo** para subir el MP4 a Drive.
- No numeres los archivos (`video_001`, etc.): usa el nombre del video.

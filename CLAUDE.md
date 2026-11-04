# Frecuencia Cero — instrucciones para Claude

Canal de Shorts de ciencia (TikTok, YouTube Shorts, Reels). Proyecto Remotion en `ohm-video/`.

**Antes de cualquier video, lee `ohm-video/estilo.md`.** Ahí están el estilo aprobado, la voz, la música, la plantilla de título y descripción y el flujo de publicación.

**Gancho:** la primera frase del guion es un golpe de 3-6 palabras que capte toda la atención en 2 s o menos (p. ej. «¡Te espían por tu espejo!»). Detalles en `estilo.md`, §9.

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

**Carpeta «Publicados»** (id `14sEl-T8PGei3jpmDlWfhlC-kq9_ML5Hk`, dentro de FrecuenciaCero):
- Al terminar de publicar, el escenario mueve la subcarpeta del video a `FrecuenciaCero/Publicados` (módulo «Mover subcarpeta a Publicados»). Si el movimiento falla, llega un correo a floriturco@gmail.com para moverla a mano.
- La búsqueda de «subcarpeta más reciente» excluye «Publicados». Sin `folder_id`, el escenario toma la subcarpeta más reciente que siga en FrecuenciaCero, o sea, una aún no publicada. Un video ya publicado no se vuelve a publicar.
- Para volver a publicar un video a propósito, pasa su `folder_id` explícito o devuelve su carpeta a FrecuenciaCero.
- No crees subcarpetas de videos dentro de «Publicados». Las nuevas van siempre en FrecuenciaCero (id `1GQM8y3XHjGsG35J5BAyWlHWJF4J3lYM4`).

**Errores por red:** YouTube, Instagram, Facebook y TikTok tienen cada uno su manejador de errores (correo + Resume).
- Si una red falla, llega un correo y el escenario sigue con las demás. La ejecución no termina en error, así que Make no la repite. Así se evitan duplicados como los del 2026-11-03: el video de los dedos arrugados se publicó dos veces porque Facebook falló, Make relanzó la ejecución y YouTube e Instagram se repitieron.
- Si llega un correo de error de Facebook, revisa la página antes de volver a subir: a veces el Reel sí se publicó.
- Si falla el borrado en Cloudinary, se ignora.

**Programar a una hora:** `scenarios_update` con `scheduling: {"type": "once", "date": "<ISO en UTC>"}`. Publica la subcarpeta más reciente de FrecuenciaCero, que debe ser la del video. Tras la ejecución:
1. Comprueba con `executions_list` que hubo **una sola** ejecución.
2. Devuelve el escenario a `on-demand` y desactívalo.

**Estado actual (2026-11-03):**
- `dedos-arrugados` ya está en Publicados.
- `cobre-verde`, `bunuelos-giran`, `tira-bimetalica`, `tarjeta-contactless`, `amnesia-infantil`, `espejo-espia`, `mimosa-pudica`, `carpintero-g`, `lata-autocalentable`, `gripe-sabor`, `peta-zetas` y `cinturon-bloqueo` siguen en FrecuenciaCero sin publicar. `cinturon-bloqueo` (creada el 2026-11-04) es ahora la más reciente: es la que tomaría el escenario si se ejecuta sin `folder_id`.
- Whisper: transcribe de uno en uno; cuatro en paralelo se atascan y no terminan.
- Antes de subir un MP4 recién re-renderizado con Make, comprueba que la URL raw ya sirve el tamaño nuevo (`content-length`): la caché de GitHub tarda unos minutos.

## Prohibido en Make

- No ejecutes «FrecuenciaCero» si el usuario no lo pidió, ni crees escenarios nuevos (el plan gratuito permite 2 y ya están los dos).
- No numeres los archivos (`video_001`, etc.): usa el nombre del video.

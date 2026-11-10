# Frecuencia Cero — instrucciones para Claude

Canal de Shorts de ciencia (TikTok, YouTube Shorts, Reels). Proyecto Remotion en `ohm-video/`.

**Antes de cualquier video, lee `ohm-video/estilo.md`.** Ahí están el estilo aprobado, la voz, la música, la plantilla de título y descripción y el flujo de publicación.

**Voz:** ElevenLabs, voz Pablo, **siempre con el modelo `eleven_v4`** por su expresividad, también si hay que usar la API REST con la clave del usuario. No uses `eleven_v3` ni otro modelo sin preguntar. Detalles en `estilo.md`.

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
   - Si `scenarios_activate` dice «already running» pero `scenarios_run` responde «not activated», vuelve a activarlo y repite la ejecución (pasó el 2026-11-05).
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
- `cobre-verde`, `bunuelos-giran`, `tira-bimetalica`, `tarjeta-contactless`, `amnesia-infantil`, `espejo-espia`, `mimosa-pudica`, `carpintero-g`, `lata-autocalentable`, `gripe-sabor`, `peta-zetas`, `cinturon-bloqueo`, `arenas-movedizas`, `alcoholimetro`, `silenciador`, `asiento-eyectable`, `oro-invisible`, `memoria-inmune`, `oidos-tapados`, `detector-humo`, `moneda-falsa`, `candado-combinacion`, `plumon-billete`, `rayos-maleta`, `lentes-3d`, `antitranspirante`, `pluma-borrable`, `encendedor-piezo`, `presion-llanta`, `tronar-dedos`, `pilas-rebote`, `jet-florida`, `radio-lofi`, `musculos-espacio`, `lluvia-cerebro`, `comida-tibia` y `como-imprime` siguen en FrecuenciaCero sin publicar. `como-imprime` (creada el 2026-11-09) es ahora la más reciente: es la que tomaría el escenario si se ejecuta sin `folder_id`.
- Plantilla común para videos nuevos: `src/components/Short.tsx` (`Short`, `Lienzo`, `Texto`, `aparece`…); cada video solo define `Escenas.tsx` (con `T`) y una composición corta. Ejemplos: `src/oro`, `src/moneda`.
- API REST de ElevenLabs (clave del usuario): máximo 3 peticiones a la vez; si no, devuelve 429.
- Claves de ElevenLabs del usuario (plan Starter, 40.000 créditos cada una), en este orden: la actual termina en `…1be951`; cuando se agote, usar la que termina en `…013744` y después la que termina en `…a77513`. **Nunca escribas los valores en el repo ni en commits**: si no están en la conversación, pídeselos al usuario. Antes de generar, mira el saldo con `GET https://api.elevenlabs.io/v1/user/subscription` (cabecera `xi-api-key`; `character_limit - character_count`). Un Short de narración gasta unos 900 créditos; una pista de música de 130 s, unos 1.700.
- Whisper: transcribe de uno en uno; cuatro en paralelo se atascan y no terminan.
- Antes de subir un MP4 recién re-renderizado con Make, comprueba que la URL raw ya sirve el tamaño nuevo (`content-length`): la caché de GitHub tarda unos minutos.

## Videos lo-fi horizontales (no son Shorts)

- 1920×1080, en bucle perfecto, para dormir/estudiar. Código en `ohm-video/src/lofi/` (base común en `Base.tsx`) y `src/lluvia/`; MP4 en `ohm-video/lofi/` y `ohm-video/lluvia-lofi.mp4`.
- Regla del bucle: todo movimiento hace un número entero de ciclos por bucle; las capas que se envuelven (nubes) se dibujan en 4 copias (−W, 0, W, 2W) para que no aparezcan de golpe en el borde.
- Audio: música de ElevenLabs (`/v1/music`, `music_v1`, ~130 s) + ambiente en bucle (`/v1/sound-generation` con `loop: true`). La duración del bucle es un número entero de compases (tempo con librosa) con fundido cruzado de 2 compases; volumen −18 LUFS.
- No se suben a la carpeta FrecuenciaCero de Drive: el escenario de publicación los tomaría como Short. Si el usuario los quiere en Drive, van en una carpeta aparte.

### Lo-fi a 60 fps (`src/lofi60/`, 2026-11-10)

- Cuatro bucles nuevos, más ricos que los de `src/lofi/`: `dormir-lluvia-ventana`, `dormir-cabana-nieve`, `estudio-escritorio-noche` y `estudio-tren-atardecer`. En `ohm-video/lofi/` están el MP4 y el TXT (`TITULO:` / `DESCRIP:`) de cada uno.
- 2560×1440 a 60 fps. Las escenas se dibujan en un lienzo de 1920×1080 y `LoFi60.tsx` las amplía (vectorial); para 4K se renderiza con `--scale=1.5`.
- `Kit.tsx` trae lo común: `useBucle` (fase 0..1), `ruido`, `bulto` y `avance` (movimiento periódico), `golpe` y `vaiven` (ritmo). Todo depende de `fase`. Lo que va a compás usa `b = fase * PULSOS`: el bucle de audio empieza en un tiempo fuerte, así que el cabeceo, el altavoz, el ecualizador y los postes del tren caen con la música.
- Rendimiento: a 1440p o 4K cada capa a pantalla completa cuesta aunque no cambie. Pocas capas, las fijas con `React.memo` y `<Capa fija>`, y sin filtros de desenfoque en las capas vivas. Dos renders en paralelo aprovechan mejor 4 núcleos que uno solo.
- Audio: `scripts/lofi60/bucle.py` monta los bucles desde los originales guardados en `lofi/audio/` (pistas de 170 s y ambientes de 30 s). Las pistas se generaron por la API REST (`POST /v1/music`, `music_v2_5`, `force_instrumental`, `output_format=pcm_48000`; unos 2.125 créditos cada una) y salen clavadas al BPM pedido desde t=0, así que se cortan por compases exactos. Dormir a −18 LUFS, estudio a −16 LUFS. Los prompts están en `scripts/lofi60/prompts.json`.
- Render y unión de audio: `scripts/lofi60/render.sh <IdComposicion> <nombre> <audio.wav>`.
- Comprobar el bucle: la diferencia media entre el último fotograma y el primero debe ser igual a la de dos fotogramas seguidos cualesquiera (en las escenas a compás, igual a la de cualquier inicio de compás).
- ElevenLabs: el conector no tenía saldo para música (2026-11-10). La clave quedó guardada como secreto de red del entorno «Predeterminado» para `api.elevenlabs.io`, así que `curl` a la API funciona sin escribirla; tras estos cuatro videos le quedaban 31.500 créditos.

## Prohibido en Make

- No ejecutes «FrecuenciaCero» si el usuario no lo pidió, ni crees escenarios nuevos (el plan gratuito permite 2 y ya están los dos).
- No numeres los archivos (`video_001`, etc.): usa el nombre del video.

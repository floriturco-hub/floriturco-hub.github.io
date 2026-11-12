# Frecuencia Cero — instrucciones para Claude

Canal de Shorts de ciencia (TikTok, YouTube Shorts, Reels). Proyecto Remotion en `ohm-video/`.

**Antes de cualquier video, lee `ohm-video/estilo.md`.** Ahí están el estilo aprobado, la voz, la música, la plantilla de título y descripción y el flujo de publicación.

**Voz:** ElevenLabs, voz Pablo, **siempre con el modelo `eleven_v4`** por su expresividad, también si hay que usar la API REST con la clave del usuario. No uses `eleven_v3` ni otro modelo sin preguntar. Detalles en `estilo.md`.

**Retención:** guiones de 30-40 s, bucle abierto, subtítulos y **sin logo final** (`cola={SIN_LOGO}`: el video acaba y empalma con el inicio en bucle); ver `estilo.md`, §10.

**Gancho:** la primera frase del guion es un golpe de 3-6 palabras que capte toda la atención en 2 s o menos (p. ej. «¡Te espían por tu espejo!»). Detalles en `estilo.md`, §9.

## Entrega en Google Drive (obligatorio al terminar cada video)

1. Con el conector de **Google Drive**, crea una subcarpeta con el nombre del video (el mismo que el MP4 del repo, p. ej. `cobre-verde`) dentro de la carpeta **FrecuenciaCero** (id `1GQM8y3XHjGsG35J5BAyWlHWJF4J3lYM4`).
2. Sube ahí `<nombre>.txt` con `create_file` (`contentMimeType: text/plain`, `disableConversionToGoogleType: true`). Formato:
   ```
   TITULO: <título aprobado>
   DESCRIP:
   <descripción aprobada, sin asteriscos, con hashtags>
   ```
3. **El MP4 lo sube el usuario a mano** a esa subcarpeta. Tú solo creas la subcarpeta y subes el TXT (pasos 1 y 2); no intentes subir el MP4 (ni con la GitHub Action ni con Make).
   - Sigue haciendo commit y push de `ohm-video/<nombre>.mp4` y envíale el MP4 al usuario.
   - La Action «Subir videos a Drive» (`.github/workflows/subir-drive.yml`) queda solo para lanzarla a mano desde la pestaña Actions, si algún día el usuario lo pide; ya no se ejecuta al hacer push.
   - Solo los Shorts verticales; los lo-fi de `ohm-video/lofi/` no van a FrecuenciaCero.

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
- `cobre-verde`, `bunuelos-giran`, `tira-bimetalica`, `tarjeta-contactless`, `amnesia-infantil`, `espejo-espia`, `mimosa-pudica`, `carpintero-g`, `lata-autocalentable`, `gripe-sabor`, `peta-zetas`, `cinturon-bloqueo`, `arenas-movedizas`, `alcoholimetro`, `silenciador`, `asiento-eyectable`, `oro-invisible`, `memoria-inmune`, `oidos-tapados`, `detector-humo`, `moneda-falsa`, `candado-combinacion`, `plumon-billete`, `rayos-maleta`, `lentes-3d`, `antitranspirante`, `pluma-borrable`, `encendedor-piezo`, `presion-llanta`, `tronar-dedos`, `pilas-rebote`, `jet-florida`, `radio-lofi`, `musculos-espacio`, `lluvia-cerebro`, `comida-tibia`, `como-imprime`, `luminol-sangre`, `bala-firma`, `edad-fosil`, `carbon-activado`, `perro-rastreador`, `cajero-billetes`, `ticket-termico`, `cafe-sueno`, `chile-agua`, `apendice-bunker`, `cilantro-jabon`, `anestesia-dentista`, `reloj-atomico`, `perla-ostra`, `veneno-sangre`, `mosquito-elige` y `lentes-polarizados` siguen en FrecuenciaCero sin publicar (desde `luminol-sangre`, el MP4 lo sube el usuario a mano). `lentes-polarizados` (creada el 2026-11-12) es ahora la más reciente: es la que tomaría el escenario si se ejecuta sin `folder_id`.
- Plantilla común para videos nuevos: `src/components/Short.tsx` (`Short`, `Lienzo`, `Texto`, `aparece`…); cada video solo define `Escenas.tsx` (con `T`) y una composición corta. Ejemplos: `src/oro`, `src/moneda`.
- API REST de ElevenLabs (clave del usuario): máximo 3 peticiones a la vez; si no, devuelve 429.
- Claves de ElevenLabs del usuario: `…1be951`, `…013744` y `…a77513`, cada una con su propio saldo. **Ojo:** el entorno de la nube tiene guardado un secreto de red para `api.elevenlabs.io` (cabecera `xi-api-key`) y el proxy lo pone en **todas** las peticiones, sustituyendo la clave que mandes (una clave inválida devuelve 200). Mientras exista ese secreto, todo se cobra a la clave guardada y no se puede ver el saldo de las otras; para cambiar de clave, el usuario edita o borra ese secreto en la configuración del entorno. **Nunca escribas los valores en el repo ni en commits**: si no están en la conversación, pídeselos al usuario. Antes de generar, mira el saldo con `GET https://api.elevenlabs.io/v1/user/subscription` (cabecera `xi-api-key`; `character_limit - character_count`). Un Short de narración gasta unos 900 créditos; una pista de música de 130 s, unos 1.700.
- Whisper: transcribe de uno en uno; cuatro en paralelo se atascan y no terminan.
- Antes de subir un MP4 recién re-renderizado con Make, comprueba que la URL raw ya sirve el tamaño nuevo (`content-length`): la caché de GitHub tarda unos minutos.

## Videos lo-fi horizontales (no son Shorts)

- 1920×1080, en bucle perfecto, para dormir/estudiar. Código en `ohm-video/src/lofi/` (base común en `Base.tsx`) y `src/lluvia/`; MP4 en `ohm-video/lofi/` y `ohm-video/lluvia-lofi.mp4`.
- Regla del bucle: todo movimiento hace un número entero de ciclos por bucle; las capas que se envuelven (nubes) se dibujan en 4 copias (−W, 0, W, 2W) para que no aparezcan de golpe en el borde.
- Audio: música de ElevenLabs (`/v1/music`, `music_v1`, ~130 s) + ambiente en bucle (`/v1/sound-generation` con `loop: true`). La duración del bucle es un número entero de compases (tempo con librosa) con fundido cruzado de 2 compases; volumen −18 LUFS.
- No se suben a la carpeta FrecuenciaCero de Drive: el escenario de publicación los tomaría como Short. Si el usuario los quiere en Drive, van en una carpeta aparte.

## Prohibido en Make

- No ejecutes «FrecuenciaCero» si el usuario no lo pidió, ni crees escenarios nuevos (el plan gratuito permite 2 y ya están los dos).
- No numeres los archivos (`video_001`, etc.): usa el nombre del video.

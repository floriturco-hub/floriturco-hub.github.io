#!/bin/bash
# Renderiza un lo-fi a 60 fps y le une su bucle de audio.
# Uso: scripts/lofi60/render.sh <IdComposicion> <nombre> <audio.wav> [dir_trabajo]
set -e
cd "$(dirname "$0")/../.."
ID=$1; NOMBRE=$2; AUDIO=$3; TMP=${4:-out}
NAV=${NAVEGADOR:-/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell}
mkdir -p "$TMP" lofi
npx remotion render "$ID" "$TMP/$NOMBRE-video.mp4" --muted --concurrency=4 --jpeg-quality=95 \
  --crf=18 --color-space=bt709 --browser-executable="$NAV" --log=error
ffmpeg -v error -y -i "$TMP/$NOMBRE-video.mp4" -i "$AUDIO" -map 0:v -map 1:a -c:v copy \
  -c:a aac -b:a 320k -ar 48000 -shortest -movflags +faststart "lofi/$NOMBRE.mp4"
echo "hecho lofi/$NOMBRE.mp4 $(stat -c %s "lofi/$NOMBRE.mp4") bytes"

#!/usr/bin/env python3
"""Comprueba un lo-fi terminado: formato, duración, empalme de imagen y de audio.

Uso: python3 scripts/lofi60/verifica.py lofi/<nombre>.mp4 [audio_del_bucle.wav]
Requisitos: ffmpeg/ffprobe, numpy, pillow, soundfile, pyloudnorm.
"""
import json, os, subprocess, sys, tempfile
import numpy as np
from PIL import Image

mp4 = sys.argv[1]
wav = sys.argv[2] if len(sys.argv) > 2 else None
tmp = tempfile.mkdtemp()


def run(*a):
    return subprocess.run(a, check=True, capture_output=True, text=True).stdout


info = json.loads(run("ffprobe", "-v", "error", "-show_streams", "-show_format", "-of", "json", mp4))
v = next(s for s in info["streams"] if s["codec_type"] == "video")
a = next(s for s in info["streams"] if s["codec_type"] == "audio")
n = int(v["nb_frames"])
fps = eval(v["r_frame_rate"])
print(f"{os.path.basename(mp4)}: {v['codec_name']} {v['width']}x{v['height']} a {fps:g} fps, {n} fotogramas, "
      f"{float(info['format']['duration']):.4f} s, {int(info['format']['size'])/1e6:.1f} MB, "
      f"{int(info['format']['bit_rate'])/1e6:.2f} Mb/s; audio {a['codec_name']} {a['sample_rate']} Hz {int(a.get('bit_rate', 0))/1000:.0f} kb/s")

# empalme de imagen: último -> primero frente a dos fotogramas seguidos
def frame(k, nombre):
    out = os.path.join(tmp, nombre)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", mp4, "-vf", f"select=eq(n\\,{k}),scale=1280:-1", "-frames:v", "1", out], check=True)
    return np.asarray(Image.open(out).convert("RGB")).astype(np.int16)

f0, f1, fu, fp = frame(0, "0.png"), frame(1, "1.png"), frame(n - 1, "u.png"), frame(n - 2, "p.png")
d = lambda x, y: float(np.abs(x - y).mean())
print(f"  imagen: penúltimo->último {d(fp, fu):.3f} | último->primero (empalme) {d(fu, f0):.3f} | primero->segundo {d(f0, f1):.3f}")

# audio: duración exacta y continuidad en el empalme
pcm = os.path.join(tmp, "a.wav")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", mp4, "-vn", "-c:a", "pcm_s24le", pcm], check=True)
import soundfile as sf, pyloudnorm as pyln
y, sr = sf.read(pcm, dtype="float64")
esperado = n * sr // int(round(fps))
print(f"  audio: {len(y)} muestras (esperadas {esperado}, diferencia {len(y) - esperado}), {pyln.Meter(sr).integrated_loudness(y):.2f} LUFS, pico {20*np.log10(np.abs(y).max()):.2f} dBFS")
m = y.mean(axis=1)
w = int(0.02 * sr)
salto = abs(m[0] - m[-1])
tip = np.percentile(np.abs(np.diff(m)), 99)
e_fin, e_ini = np.sqrt(np.mean(m[-w:] ** 2)), np.sqrt(np.mean(m[:w] ** 2))
print(f"  empalme de audio: salto entre última y primera muestra {salto:.4f} (p99 entre muestras vecinas {tip:.4f}); RMS últimos 20 ms {20*np.log10(e_fin+1e-9):.1f} dB, primeros 20 ms {20*np.log10(e_ini+1e-9):.1f} dB")
if wav:
    r, _ = sf.read(wav, dtype="float64")
    rm = r.mean(axis=1)
    k = min(len(rm), len(m), sr * 20)
    c = np.correlate(m[: k], rm[: k][2048:-2048], mode="valid")
    desfase = int(np.argmax(c)) - 2048
    print(f"  alineación con el bucle original: desfase {desfase} muestras ({desfase/sr*1000:.2f} ms)")

#!/usr/bin/env python3
"""Monta los bucles de audio de los lo-fi a 60 fps (src/lofi60).

Entrada (lofi/audio/):
  <pista>-original.m4a   pistas de ElevenLabs (music_v2_5, 170 s, instrumentales)
  ambiente-<nombre>.mp3  ambientes de ElevenLabs (text_to_sound_v2, 30 s, loop)
Salida (out/lofi60-audio/): <pista>.wav listo para unir al video con render.sh.

Qué hace con cada pista:
  1. Corta por compases exactos (las pistas van clavadas a su BPM desde t=0).
  2. Reordena los tramos para que el bucle empiece en el gancho y el punto de
     bucle caiga en audio contiguo del original; la única unión artificial queda
     dentro, en una frontera de sección, con fundido cruzado compensado por
     correlación.
  3. Ajusta la duración a un número entero de fotogramas a 60 fps (remuestreo
     por FFT, cambio de unas decenas de ppm).
  4. Mezcla el ambiente (paso alto + limitador de chasquidos, en bucle propio).
  5. Normaliza a -18 LUFS (dormir) o -16 LUFS (estudio), pico real <= -1.5 dBTP.

Requisitos: pip install numpy scipy soundfile pyloudnorm; ffmpeg en el PATH.
Uso: python3 scripts/lofi60/bucle.py   (desde ohm-video/)
"""
import os, subprocess
import json, numpy as np, soundfile as sf, pyloudnorm as pyln, warnings
from scipy.signal import resample, resample_poly, butter, sosfiltfilt
from scipy.ndimage import maximum_filter1d, uniform_filter1d
warnings.filterwarnings("ignore")
SR = 48000
FPS = 60
AQUI = os.path.dirname(os.path.abspath(__file__))
ENT = os.path.join(AQUI, "..", "..", "lofi", "audio")
SAL = os.path.join(AQUI, "..", "..", "out", "lofi60-audio")
os.makedirs(SAL, exist_ok=True)


def a_wav(origen, destino):
    if not os.path.exists(destino):
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", origen, "-ar", str(SR), "-ac", "2", "-c:a", "pcm_s24le", destino], check=True)
    return destino

# segs: tramos en compases [inicio, fin) en el orden en que suenan; el final del último
# enlaza con el inicio del primero. juntas: (antes, después) en pulsos para cada unión
# no contigua (None si es contigua en el original).
PLAN = {
    "sleep-lluvia": dict(bpm=62, segs=[(12, 36), (4, 12)], juntas=[(0.5, 0.5), None], amb="lluvia", amb_lu=-11.0, hp=120, cresta=12, lufs=-18.0),
    "sleep-nieve": dict(bpm=66, segs=[(20, 44), (12, 20)], juntas=[(1.0, 0.0), None], amb="chimenea", amb_lu=-12.0, hp=90, cresta=13, lufs=-18.0),
    "study-escritorio": dict(bpm=84, segs=[(12, 44), (4, 12)], juntas=[(0.12, 0.0), None], amb="ciudad", amb_lu=-24.0, hp=150, cresta=12, lufs=-16.0),
    "focus-tren": dict(bpm=90, segs=[(20, 52), (12, 20)], juntas=[(1.0, 0.0), None], amb="tren", amb_lu=-16.0, hp=70, cresta=12, lufs=-16.0),
}

def xfade(a, b):
    n = len(a)
    th = (np.arange(n) + 0.5) / n * (np.pi / 2)
    fo, fi = np.cos(th)[:, None], np.sin(th)[:, None]
    am, bm = a.mean(axis=1), b.mean(axis=1)
    c = float(np.dot(am, bm) / (np.linalg.norm(am) * np.linalg.norm(bm) + 1e-12))
    c = min(1.0, max(0.0, c))
    return (a * fo + b * fi) / np.sqrt(1 + 2 * c * fo * fi), c


def acondiciona(x, hp, cresta):
    """Paso alto (quita retumbe bajo la música) y limitador con anticipación (doma chasquidos)."""
    x = sosfiltfilt(butter(2, hp, btype="highpass", fs=SR, output="sos"), x, axis=0)
    rms = np.sqrt(np.mean(x ** 2))
    T = rms * 10 ** (cresta / 20)
    env = maximum_filter1d(np.abs(x).max(axis=1), size=int(0.004 * SR))
    g = np.minimum(1.0, T / (env + 1e-12))
    # suelta despacio: mínimo corrido de 30 ms y suavizado de 6 ms
    g = -maximum_filter1d(-g, size=int(0.03 * SR))
    g = uniform_filter1d(g, size=int(0.006 * SR))
    return x * g[:, None]

def tp_db(x):
    up = resample_poly(x, 4, 1, axis=0)
    return 20 * np.log10(np.max(np.abs(up)) + 1e-12)

info = {}
for name, p in PLAN.items():
    y, sr = sf.read(a_wav(f"{ENT}/{name}-original.m4a", f"{SAL}/_{name}-original.wav"), dtype="float64")
    beat = 60.0 / p["bpm"]; bar = 4 * beat
    s = lambda bars: int(round(bars * bar * SR))
    trozos = [y[s(a):s(b)] for a, b in p["segs"]]
    out = np.concatenate(trozos)
    n = len(out)
    pos = 0
    notas = []
    for i, (a, b) in enumerate(p["segs"]):
        pos += len(trozos[i])
        j = (i + 1) % len(p["segs"])
        A1, B0 = s(b), s(p["segs"][j][0])
        jt = p["juntas"][i]
        if A1 == B0:
            notas.append(f"unión {b}->{p['segs'][j][0]}: contigua")
            continue
        pre, post = int(round(jt[0] * beat * SR)), int(round(jt[1] * beat * SR))
        x, c = xfade(y[A1 - pre:A1 + post], y[B0 - pre:B0 + post])
        idx = (np.arange(pos - pre, pos + post)) % n
        out[idx] = x
        notas.append(f"unión {b}->{p['segs'][j][0]}: fundido {pre/SR*1000:.0f} ms antes + {post/SR*1000:.0f} ms después, correlación {c:.2f}")
    barras = sum(b - a for a, b in p["segs"])
    L = barras * bar
    frames = int(round(L * FPS))
    nfin = frames * (SR // FPS)
    musica = resample(out, nfin, axis=0) if nfin != n else out
    # ambiente: mosaico con fundidos de 1 s y envoltura de 2 s
    amb, _ = sf.read(a_wav(f"{ENT}/ambiente-{p['amb']}.mp3", f"{SAL}/_ambiente-{p['amb']}.wav"), dtype="float64")
    amb = amb[int(0.1 * SR):len(amb) - int(0.1 * SR)]
    amb = acondiciona(amb, p["hp"], p["cresta"])
    X = SR
    largo = amb.copy()
    while len(largo) < nfin + 3 * SR:
        x, _ = xfade(largo[-X:], amb[:X])
        largo = np.concatenate([largo[:-X], x, amb[X:]])
    W = 2 * SR
    cab, _ = xfade(largo[nfin:nfin + W], largo[:W])
    ambL = np.concatenate([cab, largo[W:nfin]])
    meter = pyln.Meter(SR)
    lm, la = meter.integrated_loudness(musica), meter.integrated_loudness(ambL)
    ambL = ambL * 10 ** ((lm + p["amb_lu"] - la) / 20)
    mix = musica + ambL
    g = 10 ** ((p["lufs"] - meter.integrated_loudness(mix)) / 20)
    mix = mix * g
    tp = tp_db(mix)
    if tp > -1.5:  # deja margen de pico real
        mix = mix * 10 ** ((-1.5 - tp) / 20); g *= 10 ** ((-1.5 - tp) / 20); tp = tp_db(mix)
    sf.write(f"{SAL}/{name}.wav", mix, SR, subtype="PCM_24")
    salto = np.abs(mix[0] - mix[-1]).max(); tip = np.abs(np.diff(mix, axis=0)).mean()
    info[name] = dict(bpm=p["bpm"], compases=barras, pulsos=barras * 4, frames=frames, dur=frames / FPS, dur_musical=L, lufs=float(meter.integrated_loudness(mix)), tp=float(tp), lufs_musica_orig=float(lm))
    print(f"{name}: {barras} compases, {L:.4f} s -> {frames} fotogramas ({frames/FPS:.4f} s), ajuste {(nfin/n-1)*1e6:+.0f} ppm; LUFS {info[name]['lufs']:.2f}, pico real {tp:.2f} dBTP, música original {lm:.1f} LUFS, ambiente a {p['amb_lu']} LU")
    for t in notas: print("   ", t)
    print(f"    salto en la envoltura {salto:.5f} (media entre muestras {tip:.5f})")
json.dump(info, open(f"{SAL}/info.json", "w"), indent=1)

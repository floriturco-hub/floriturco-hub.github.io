import React, { useLayoutEffect, useRef } from "react";
import { random, useCurrentFrame, useVideoConfig } from "remotion";
import { mono } from "../theme";

// Piezas comunes de los lo-fi a 60 fps en bucle perfecto.
// Regla del bucle: todo lo que se mueve depende solo de `fase` (0..1) y completa
// un número ENTERO de ciclos por bucle, así el último fotograma enlaza con el primero.
// Regla del ritmo: `b = fase * beats` es el pulso de la música (el bucle de audio
// empieza en un tiempo fuerte), así que lo que late con `b` va a compás.

export const W = 1920;
export const H = 1080;
export const TAU = Math.PI * 2;

export const frac = (x: number) => x - Math.floor(x);
export const mezcla = (a: number, b: number, u: number) => a + (b - a) * u;
export const limita = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const suave = (u: number) => {
  const x = limita(u);
  return x * x * (3 - 2 * x);
};

// fase 0..1 dentro del bucle, tiempo en segundos y duración del bucle
export const useBucle = () => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const f = frame % durationInFrames;
  return { fase: f / durationInFrames, t: f / fps, L: durationInFrames / fps };
};

// Oscilación con n ciclos enteros por bucle (−1..1)
export const osc = (fase: number, n: number, desfase = 0) =>
  Math.sin(TAU * (n * fase + desfase));

// Número entero de ciclos por bucle más cercano a un periodo en segundos
export const ciclos = (L: number, periodo: number) =>
  Math.max(1, Math.round(L / periodo));

// Ruido orgánico periódico: suma de senos con ciclos enteros (−1..1)
export const ruido = (fase: number, semilla: string, base = 5, capas = 4) => {
  let s = 0;
  let a = 1;
  let total = 0;
  for (let k = 0; k < capas; k++) {
    const n = Math.max(
      1,
      Math.round(base * (k + 1) * (0.8 + 0.6 * random(`${semilla}n${k}`))),
    );
    s += a * Math.sin(TAU * (n * fase + random(`${semilla}p${k}`)));
    total += a;
    a *= 0.6;
  }
  return s / total;
};

// Distancia con signo a un instante c del bucle, respetando el empalme (−0.5..0.5)
export const dist = (fase: number, c: number) => frac(fase - c + 0.5) - 0.5;

// Campana suave centrada en c (fase) con ese ancho (fase): 0..1
export const bulto = (fase: number, c: number, ancho: number) => {
  const d = Math.abs(dist(fase, c));
  return d >= ancho / 2 ? 0 : 0.5 + 0.5 * Math.cos((TAU * d) / ancho);
};

// Avance 0..1 mientras se cruza una ventana centrada en c
export const avance = (fase: number, c: number, ancho: number) =>
  limita(dist(fase, c) / ancho + 0.5);

// Golpe que decae tras cada pulso (1 en el pulso)
export const golpe = (b: number, caida = 5) => Math.exp(-caida * frac(b));

// Vaivén suave: 1 justo en el pulso, 0 a mitad
export const vaiven = (b: number) => 0.5 + 0.5 * Math.cos(TAU * b);

// Capa SVG a pantalla completa. Las fijas (contenido que nunca cambia) van en su
// propia capa de composición para que el navegador no las vuelva a pintar.
export const Capa: React.FC<{
  readonly children: React.ReactNode;
  readonly fija?: boolean;
  readonly estilo?: React.CSSProperties;
}> = ({ children, fija = false, estilo }) => (
  <svg
    width={W}
    height={H}
    viewBox={`0 0 ${W} ${H}`}
    style={{
      position: "absolute",
      left: 0,
      top: 0,
      ...(fija ? { willChange: "transform" } : null),
      ...estilo,
    }}
  >
    {children}
  </svg>
);

// Halo de luz con caída natural
export const Luz: React.FC<{
  readonly id: string;
  readonly cx: number;
  readonly cy: number;
  readonly r: number;
  readonly color: string;
  readonly op?: number;
  readonly rx?: number;
  readonly ry?: number;
}> = ({ id, cx, cy, r, color, op = 1, rx, ry }) => (
  <g opacity={op}>
    <defs>
      <radialGradient id={id}>
        <stop offset="0" stopColor={color} stopOpacity={1} />
        <stop offset="0.18" stopColor={color} stopOpacity={0.55} />
        <stop offset="0.45" stopColor={color} stopOpacity={0.18} />
        <stop offset="0.75" stopColor={color} stopOpacity={0.045} />
        <stop offset="1" stopColor={color} stopOpacity={0} />
      </radialGradient>
    </defs>
    <ellipse cx={cx} cy={cy} rx={rx ?? r} ry={ry ?? r} fill={`url(#${id})`} />
  </g>
);

// Degradado vertical con varias paradas: [posición, color, opacidad?]
export const Vertical: React.FC<{
  readonly id: string;
  readonly paradas: readonly (readonly [number, string, number?])[];
  readonly horizontal?: boolean;
}> = ({ id, paradas, horizontal = false }) => (
  <linearGradient
    id={id}
    x1="0"
    y1="0"
    x2={horizontal ? "1" : "0"}
    y2={horizontal ? "0" : "1"}
  >
    {paradas.map(([o, c, a]) => (
      <stop key={o} offset={o} stopColor={c} stopOpacity={a ?? 1} />
    ))}
  </linearGradient>
);

// Lluvia en el aire: cada gota cae un número entero de veces por bucle
export const Lluvia: React.FC<{
  readonly fase: number;
  readonly L: number;
  readonly cuantas: number;
  readonly largo: number;
  readonly ancho: number;
  readonly caida: number; // segundos en cruzar la altura
  readonly op: number;
  readonly semilla: string;
  readonly x0: number;
  readonly y0: number;
  readonly w: number;
  readonly h: number;
  readonly color?: string;
  readonly inclinacion?: number;
}> = ({
  fase,
  L,
  cuantas,
  largo,
  ancho,
  caida,
  op,
  semilla,
  x0,
  y0,
  w,
  h,
  color = "#B9C6FF",
  inclinacion = 0.08,
}) => {
  const base = L / caida;
  return (
    <g opacity={op} stroke={color} strokeWidth={ancho} strokeLinecap="round">
      {new Array(cuantas).fill(0).map((_, k) => {
        const n = Math.max(
          1,
          Math.round(base * (0.8 + random(`${semilla}v${k}`) * 0.45)),
        );
        const u = frac(random(`${semilla}u${k}`) + n * fase);
        const y = y0 - largo + u * (h + largo * 2);
        const x =
          x0 +
          random(`${semilla}x${k}`) * (w + 160) -
          80 -
          (y - y0) * inclinacion;
        const l = largo * (0.7 + random(`${semilla}l${k}`) * 0.6);
        return (
          <line
            key={k}
            x1={x}
            y1={y}
            x2={x - l * inclinacion}
            y2={y + l}
            opacity={0.45 + random(`${semilla}o${k}`) * 0.55}
          />
        );
      })}
    </g>
  );
};

// Estrellas que titilan (ciclos enteros)
export const Estrellas: React.FC<{
  readonly fase: number;
  readonly cuantas: number;
  readonly x0?: number;
  readonly y0?: number;
  readonly w?: number;
  readonly h: number;
  readonly semilla: string;
  readonly color?: string;
  readonly rMax?: number;
}> = ({
  fase,
  cuantas,
  x0 = 0,
  y0 = 0,
  w = W,
  h,
  semilla,
  color = "#E8ECFF",
  rMax = 2.2,
}) => (
  <g fill={color}>
    {new Array(cuantas).fill(0).map((_, k) => {
      const n = 2 + Math.floor(random(`${semilla}n${k}`) * 9);
      const b = 0.6 + 0.4 * osc(fase, n, random(`${semilla}d${k}`));
      const r = 0.5 + random(`${semilla}r${k}`) ** 2.2 * rMax;
      return (
        <circle
          key={k}
          cx={x0 + random(`${semilla}x${k}`) * w}
          cy={y0 + random(`${semilla}y${k}`) ** 1.4 * h}
          r={r}
          opacity={b * (0.35 + random(`${semilla}o${k}`) * 0.65)}
        />
      );
    })}
  </g>
);

// Motas de polvo o luciérnagas en órbitas cerradas
export const Motas: React.FC<{
  readonly fase: number;
  readonly cuantas: number;
  readonly x0: number;
  readonly y0: number;
  readonly w: number;
  readonly h: number;
  readonly color: string;
  readonly semilla: string;
  readonly r?: number;
  readonly op?: number;
  readonly halo?: boolean;
}> = ({
  fase,
  cuantas,
  x0,
  y0,
  w,
  h,
  color,
  semilla,
  r = 2,
  op = 0.5,
  halo = false,
}) => (
  <g fill={color}>
    {new Array(cuantas).fill(0).map((_, k) => {
      const n1 = 1 + Math.floor(random(`${semilla}a${k}`) * 2);
      const n2 = 1 + Math.floor(random(`${semilla}b${k}`) * 3);
      const nb = 2 + Math.floor(random(`${semilla}c${k}`) * 5);
      const cx =
        x0 +
        random(`${semilla}x${k}`) * w +
        (30 + 50 * random(`${semilla}ax${k}`)) *
          osc(fase, n1, random(`${semilla}p${k}`));
      const cy =
        y0 +
        random(`${semilla}y${k}`) * h +
        (20 + 40 * random(`${semilla}ay${k}`)) *
          osc(fase, n2, random(`${semilla}q${k}`));
      const b = 0.5 + 0.5 * osc(fase, nb, random(`${semilla}d${k}`));
      const rr = r * (0.6 + random(`${semilla}r${k}`) * 0.8);
      return (
        <g key={k} opacity={op * (0.25 + 0.75 * b)}>
          {halo ? <circle cx={cx} cy={cy} r={rr * 4} opacity={0.22} /> : null}
          <circle cx={cx} cy={cy} r={rr} />
        </g>
      );
    })}
  </g>
);

// Vapor: volutas que suben y se deshacen (ciclos enteros)
export const Vapor: React.FC<{
  readonly fase: number;
  readonly L: number;
  readonly x: number;
  readonly y: number;
  readonly s?: number;
  readonly color?: string;
  readonly op?: number;
  readonly semilla?: string;
}> = ({ fase, L, x, y, s = 1, color = "#F2ECFF", op = 0.3, semilla = "v" }) => {
  const n = ciclos(L, 5.5);
  return (
    <g
      transform={`translate(${x} ${y}) scale(${s})`}
      fill="none"
      stroke={color}
      strokeLinecap="round"
    >
      {[0, 1, 2, 3].map((k) => {
        const u = frac(fase * n + k / 4 + random(`${semilla}${k}`) * 0.1);
        const giro = osc(fase, n * 2, k / 4) * 10;
        const sube = -u * 90;
        const dx = (k - 1.5) * 9;
        return (
          <path
            key={k}
            d={`M ${dx} ${sube} c ${10 + giro} -14 ${-10 + giro} -30 ${giro * 0.4} -46`}
            strokeWidth={5 + u * 7}
            opacity={op * Math.sin(u * Math.PI) ** 1.3}
          />
        );
      })}
    </g>
  );
};

// Marca de agua del canal
export const Marca: React.FC<{
  readonly color?: string;
  readonly op?: number;
}> = ({ color = "#E8E6F0", op = 0.16 }) => (
  <text
    x={W - 44}
    y={H - 38}
    textAnchor="end"
    fill={color}
    opacity={op}
    fontFamily={mono}
    fontSize={24}
    fontWeight={700}
  >
    Frecuencia Cero
  </text>
);

// PRNG determinista para el grano (mismo resultado en todas las pestañas del render)
const mulberry = (seed: number) => {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

// Acabado: viñeta + grano de película FIJO en un solo lienzo (una sola capa).
// El grano no cambia entre fotogramas: rompe el bandeado de los degradados
// oscuros sin gastar bitrate.
const AcabadoBase: React.FC<{
  readonly vineta?: number;
  readonly grano?: number;
  readonly color?: readonly [number, number, number];
}> = ({ vineta = 0.55, grano = 0.09, color = [6, 4, 16] }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const [cr, cg, cb] = color;
  useLayoutEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const img = ctx.createImageData(W, H);
    const rnd = mulberry(20261110);
    const d = img.data;
    let i = 0;
    for (let y = 0; y < H; y++) {
      const dy = (y / H - 0.48) / 0.82;
      for (let x = 0; x < W; x++) {
        const dx = (x / W - 0.5) / 0.78;
        // viñeta elíptica: nada hasta el 52 % del radio y luego sube suave
        const r = Math.sqrt(dx * dx + dy * dy);
        const u = Math.min(1, Math.max(0, (r - 0.52) / 0.48));
        const av = vineta * u * u * (3 - 2 * u);
        // grano casi gaussiano: suma de tres uniformes
        const g = (rnd() + rnd() + rnd()) / 1.5 - 1;
        const ag = Math.min(1, Math.abs(g) * grano);
        const v = g > 0 ? 255 : 0;
        const a = ag + av * (1 - ag);
        const k = a > 0 ? (av * (1 - ag)) / a : 0;
        d[i] = v * (1 - k) + cr * k;
        d[i + 1] = v * (1 - k) + cg * k;
        d[i + 2] = v * (1 - k) + cb * k;
        d[i + 3] = a * 255;
        i += 4;
      }
    }
    ctx.putImageData(img, 0, 0);
  }, [vineta, grano, cr, cg, cb]);
  return (
    <canvas
      ref={ref}
      width={W}
      height={H}
      style={{ position: "absolute", left: 0, top: 0, width: W, height: H }}
    />
  );
};

export const Acabado = React.memo(AcabadoBase);

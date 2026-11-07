import { random, useCurrentFrame, useVideoConfig } from "remotion";
import { mono } from "../theme";

// Piezas comunes de las animaciones lo-fi horizontales en bucle perfecto.
// Regla: todo movimiento completa un número ENTERO de ciclos por bucle,
// así el último fotograma enlaza con el primero.

export const W = 1920;
export const H = 1080;

export const frac = (x: number) => x - Math.floor(x);
export const TAU = Math.PI * 2;

// fase 0..1 dentro del bucle y tiempo en segundos
export const useBucle = () => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const fase = (frame % durationInFrames) / durationInFrames;
  return {
    fase,
    t: fase * (durationInFrames / fps),
    L: durationInFrames / fps,
  };
};

// Oscilación con n ciclos enteros por bucle
export const osc = (fase: number, n: number, desfase = 0) =>
  Math.sin(TAU * (n * fase + desfase));

export const Lienzo: React.FC<{
  readonly children: React.ReactNode;
  readonly fondo: string;
}> = ({ children, fondo }) => (
  <svg
    width={W}
    height={H}
    viewBox={`0 0 ${W} ${H}`}
    style={{ position: "absolute", background: fondo }}
  >
    {children}
  </svg>
);

export const Marca: React.FC<{ readonly color?: string }> = ({
  color = "#E8E6F0",
}) => (
  <text
    x={W - 40}
    y={H - 36}
    textAnchor="end"
    fill={color}
    opacity={0.18}
    fontFamily={mono}
    fontSize={26}
    fontWeight={700}
  >
    Frecuencia Cero
  </text>
);

export const Degradado: React.FC<{
  readonly id: string;
  readonly arriba: string;
  readonly abajo: string;
}> = ({ id, arriba, abajo }) => (
  <defs>
    <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor={arriba} />
      <stop offset="1" stopColor={abajo} />
    </linearGradient>
  </defs>
);

// Lluvia: cada gota cae un número entero de veces por bucle
export const Lluvia: React.FC<{
  readonly fase: number;
  readonly cuantas: number;
  readonly largo: number;
  readonly ancho: number;
  readonly vel: number;
  readonly op: number;
  readonly semilla: string;
  readonly color?: string;
  readonly x0?: number;
  readonly y0?: number;
  readonly w?: number;
  readonly h?: number;
  readonly inclinacion?: number;
}> = ({
  fase,
  cuantas,
  largo,
  ancho,
  vel,
  op,
  semilla,
  color = "#9AA8D8",
  x0 = 0,
  y0 = 0,
  w = W,
  h = H,
  inclinacion = 0.18,
}) => (
  <g opacity={op}>
    {new Array(cuantas).fill(0).map((_, k) => {
      const ciclos = Math.max(
        1,
        Math.round(vel * (0.85 + random(`${semilla}v${k}`) * 0.3)),
      );
      const u = frac(random(`${semilla}u${k}`) + ciclos * fase);
      const y = y0 - largo + u * (h + largo * 2);
      const x =
        x0 +
        random(`${semilla}x${k}`) * (w + 300) -
        150 -
        (y - y0) * inclinacion;
      return (
        <line
          key={k}
          x1={x}
          y1={y}
          x2={x - largo * inclinacion}
          y2={y + largo}
          stroke={color}
          strokeWidth={ancho}
          strokeLinecap="round"
        />
      );
    })}
  </g>
);

// Nube de elipses
export const Nube: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s: number;
  readonly color: string;
  readonly semilla: string;
}> = ({ x, y, s, color, semilla }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {new Array(7).fill(0).map((_, k) => (
      <ellipse
        key={k}
        cx={(k - 3) * 70 + random(`${semilla}x${k}`) * 30}
        cy={-Math.sin((k / 6) * Math.PI) * 50 + random(`${semilla}y${k}`) * 20}
        rx={90 + random(`${semilla}r${k}`) * 50}
        ry={60 + random(`${semilla}q${k}`) * 30}
        fill={color}
      />
    ))}
  </g>
);

// Capa de nubes que recorre n anchos de pantalla por bucle (n entero, puede ser negativo)
export const CapaNubes: React.FC<{
  readonly fase: number;
  readonly n: number;
  readonly y: number;
  readonly s: number;
  readonly color: string;
  readonly cuantas: number;
  readonly semilla: string;
  readonly op?: number;
}> = ({ fase, n, y, s, color, cuantas, semilla, op = 1 }) => {
  const off = -frac(fase * n) * W;
  return (
    <g opacity={op}>
      {[-W, 0, W, 2 * W].map((dx) => (
        <g key={dx} transform={`translate(${off + dx} 0)`}>
          {new Array(cuantas).fill(0).map((_, k) => (
            <Nube
              key={k}
              x={(k / cuantas) * W + random(`${semilla}p${k}`) * 120}
              y={y + random(`${semilla}h${k}`) * 70}
              s={s * (0.8 + random(`${semilla}s${k}`) * 0.5)}
              color={color}
              semilla={`${semilla}${k}`}
            />
          ))}
        </g>
      ))}
    </g>
  );
};

// Estrellas que titilan (frecuencias enteras)
export const Estrellas: React.FC<{
  readonly fase: number;
  readonly cuantas: number;
  readonly alto: number;
  readonly semilla: string;
  readonly color?: string;
}> = ({ fase, cuantas, alto, semilla, color = "#E8E6F0" }) => (
  <g>
    {new Array(cuantas).fill(0).map((_, k) => {
      const n = 3 + Math.floor(random(`${semilla}n${k}`) * 9);
      const b = 0.55 + 0.45 * osc(fase, n, random(`${semilla}d${k}`));
      return (
        <circle
          key={k}
          cx={random(`${semilla}x${k}`) * W}
          cy={random(`${semilla}y${k}`) * alto}
          r={1 + random(`${semilla}r${k}`) * 2.2}
          fill={color}
          opacity={b * (0.4 + random(`${semilla}o${k}`) * 0.6)}
        />
      );
    })}
  </g>
);

// Luciérnagas / motas que flotan en órbitas cerradas
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
}> = ({ fase, cuantas, x0, y0, w, h, color, semilla, r = 4 }) => (
  <g>
    {new Array(cuantas).fill(0).map((_, k) => {
      const n1 = 1 + Math.floor(random(`${semilla}a${k}`) * 3);
      const n2 = 2 + Math.floor(random(`${semilla}b${k}`) * 3);
      const nb = 5 + Math.floor(random(`${semilla}c${k}`) * 10);
      const cx =
        x0 +
        random(`${semilla}x${k}`) * w +
        40 * osc(fase, n1, random(`${semilla}p${k}`));
      const cy =
        y0 +
        random(`${semilla}y${k}`) * h +
        30 * osc(fase, n2, random(`${semilla}q${k}`));
      const b = Math.max(0, osc(fase, nb, random(`${semilla}d${k}`)));
      return (
        <g key={k} opacity={0.2 + 0.8 * b}>
          <circle cx={cx} cy={cy} r={r * 3} fill={color} opacity={0.25} />
          <circle cx={cx} cy={cy} r={r} fill={color} />
        </g>
      );
    })}
  </g>
);

// Halo de luz radial
export const Halo: React.FC<{
  readonly id: string;
  readonly cx: number;
  readonly cy: number;
  readonly r: number;
  readonly color: string;
  readonly op: number;
}> = ({ id, cx, cy, r, color, op }) => (
  <g>
    <defs>
      <radialGradient id={id}>
        <stop offset="0" stopColor={color} stopOpacity={op} />
        <stop offset="1" stopColor={color} stopOpacity={0} />
      </radialGradient>
    </defs>
    <circle cx={cx} cy={cy} r={r} fill={`url(#${id})`} />
  </g>
);

// Vapor que sube de una taza (ciclos enteros)
export const Vapor: React.FC<{
  readonly fase: number;
  readonly x: number;
  readonly y: number;
  readonly s?: number;
  readonly n?: number;
}> = ({ fase, x, y, s = 1, n = 24 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[0, 1, 2].map((k) => {
      const u = frac(fase * n + k / 3);
      return (
        <path
          key={k}
          d={`M ${-20 + k * 20} 0 q ${16 * osc(fase, n, k / 3)} -30 0 -60 q ${-16 * osc(fase, n, k / 3)} -30 0 -60`}
          stroke="#E8E6F0"
          strokeWidth={6}
          fill="none"
          strokeLinecap="round"
          opacity={0.35 * Math.sin(u * Math.PI)}
          transform={`translate(0 ${-u * 40})`}
        />
      );
    })}
  </g>
);

// Rayo ramificado
export const Rayo: React.FC<{
  readonly x: number;
  readonly semilla: string;
  readonly op: number;
}> = ({ x, semilla, op }) => {
  let px = x;
  let py = 120;
  const pts = [`${px},${py}`];
  for (let k = 0; k < 9; k++) {
    px += (random(`${semilla}a${k}`) - 0.5) * 90;
    py += 45 + random(`${semilla}b${k}`) * 30;
    pts.push(`${px},${py}`);
  }
  return (
    <g opacity={op}>
      <polyline
        points={pts.join(" ")}
        stroke="#E8ECFF"
        strokeWidth={4}
        fill="none"
        strokeLinejoin="round"
      />
      <polyline
        points={pts.join(" ")}
        stroke="#9AB4FF"
        strokeWidth={14}
        fill="none"
        opacity={0.35}
        strokeLinejoin="round"
      />
    </g>
  );
};

// Intensidad de destello de relámpago en t (s) para una lista de instantes
export const destello = (t: number, rayos: readonly number[]) =>
  rayos.reduce((acc, r) => {
    const d = t - r;
    if (d < 0 || d > 1.2) return acc;
    const p =
      Math.exp(-(d ** 2) / 0.0015) +
      Math.exp(-((d - 0.16) ** 2) / 0.002) * 0.6 +
      Math.exp(-((d - 0.38) ** 2) / 0.006) * 0.8;
    return Math.max(acc, p);
  }, 0);

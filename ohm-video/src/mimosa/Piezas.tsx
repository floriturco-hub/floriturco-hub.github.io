import { interpolate, random } from "remotion";
import { C, clamp, mono } from "../theme";

export const HOJA = "#5CBF6A";
const HOJA_OSC = "#3A8A4A";
const TALLO = "#7A9A4A";

// Una pinna: raquis con pares de foliolos que se pliegan hacia arriba
const Pinna: React.FC<{
  readonly largo: number;
  readonly cierre: number;
  readonly n?: number;
}> = ({ largo, cierre, n = 11 }) => (
  <g>
    <line
      x1={0}
      y1={0}
      x2={0}
      y2={-largo}
      stroke={TALLO}
      strokeWidth={6}
      strokeLinecap="round"
    />
    {new Array(n).fill(0).map((_, k) => {
      const y = -largo * (0.12 + (0.86 * k) / (n - 1));
      const ang = interpolate(cierre, [0, 1], [80, 8]);
      const l = 34 + 6 * Math.sin((k / n) * Math.PI);
      return (
        <g key={k} transform={`translate(0 ${y})`}>
          <ellipse
            cx={0}
            cy={-l / 2}
            rx={10}
            ry={l / 2}
            fill={HOJA}
            stroke={HOJA_OSC}
            strokeWidth={2}
            transform={`rotate(${ang})`}
          />
          <ellipse
            cx={0}
            cy={-l / 2}
            rx={10}
            ry={l / 2}
            fill={HOJA}
            stroke={HOJA_OSC}
            strokeWidth={2}
            transform={`rotate(${-ang})`}
          />
        </g>
      );
    })}
  </g>
);

// Hoja compuesta: peciolo con 4 pinnas en abanico. caida dobla el peciolo hacia abajo.
export const Hoja: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly rot: number;
  readonly s?: number;
  readonly cierre: number;
  readonly caida: number;
}> = ({ x, y, rot, s = 1, cierre, caida }) => {
  const abanico = interpolate(cierre, [0, 1], [26, 6]);
  return (
    <g
      transform={`translate(${x} ${y}) rotate(${rot + caida * (rot > 0 ? 55 : -55)}) scale(${s})`}
    >
      <circle
        cx={0}
        cy={0}
        r={11}
        fill={caida > 0.3 ? C.yellow : "#8AB05A"}
        opacity={0.9}
      />
      <line
        x1={0}
        y1={0}
        x2={0}
        y2={-150}
        stroke={TALLO}
        strokeWidth={8}
        strokeLinecap="round"
      />
      {[-1.5, -0.5, 0.5, 1.5].map((k) => (
        <g key={k} transform={`translate(0 -150) rotate(${k * abanico})`}>
          <Pinna largo={230} cierre={cierre} />
        </g>
      ))}
    </g>
  );
};

// Planta entera en maceta. cierreDe(i) devuelve el cierre de cada hoja (para la onda que se propaga).
export const Planta: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s?: number;
  readonly cierreDe: (i: number) => number;
  readonly espinas?: number;
  readonly senal?: number;
}> = ({ x, y, s = 1, cierreDe, espinas = 0, senal = 0 }) => {
  const hojas: [number, number, number][] = [
    [0, -560, -20],
    [0, -480, 40],
    [0, -380, -55],
    [0, -290, 60],
    [0, -190, -65],
  ];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path
        d="M 0 0 Q -20 -300 0 -600"
        stroke={TALLO}
        strokeWidth={14}
        fill="none"
        strokeLinecap="round"
      />
      {espinas > 0
        ? new Array(8).fill(0).map((_, k) => {
            const yy = -60 - k * 66;
            const lado = k % 2 ? 1 : -1;
            return (
              <path
                key={k}
                d={`M ${-8 * (yy / -600)} ${yy} l ${lado * 26} -10 l ${-lado * 22} 18 Z`}
                fill="#C85A4A"
                opacity={espinas}
              />
            );
          })
        : null}
      {senal > 0 && senal < 1 ? (
        <circle
          cx={-12}
          cy={-600 * senal}
          r={18}
          fill={C.yellow}
          opacity={0.9}
        />
      ) : null}
      {hojas.map(([hx, hy, rot], i) => (
        <Hoja
          key={i}
          x={hx}
          y={hy}
          rot={rot}
          s={0.62}
          cierre={cierreDe(i)}
          caida={Math.max(0, cierreDe(i) * 1.4 - 0.4)}
        />
      ))}
      <path
        d="M -150 0 L 150 0 L 120 200 L -120 200 Z"
        fill="#B8603A"
        stroke="#7A3A1E"
        strokeWidth={6}
      />
      <rect
        x={-170}
        y={-20}
        width={340}
        height={40}
        rx={10}
        fill="#C8703A"
        stroke="#7A3A1E"
        strokeWidth={6}
      />
    </g>
  );
};

// Pulvínulo en corte: células que se desinflan al salir potasio y agua
export const Pulvinulo: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly t: number;
  readonly infla: number;
  readonly iones: number;
  readonly agua: number;
}> = ({ x, y, t, infla, iones, agua }) => {
  const celdas = new Array(14)
    .fill(0)
    .map(
      (_, k) =>
        [
          (k % 5) * 130 - 260 + (Math.floor(k / 5) % 2) * 65,
          Math.floor(k / 5) * 120 - 120,
        ] as const,
    );
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect
        x={-380}
        y={-230}
        width={760}
        height={460}
        rx={40}
        fill="#2A4A30"
        stroke={HOJA_OSC}
        strokeWidth={6}
      />
      {celdas.map(([cx, cy], k) => (
        <g key={k}>
          <ellipse
            cx={cx}
            cy={cy}
            rx={30 + 30 * infla}
            ry={26 + 26 * infla}
            fill="#7ACB86"
            stroke="#2A6A3A"
            strokeWidth={4}
            opacity={0.9}
          />
          {iones > 0
            ? [0, 1].map((j) => {
                const f = (t * 0.7 + k * 0.13 + j * 0.5) % 1;
                const a = random(`io${k}${j}`) * Math.PI * 2;
                return (
                  <text
                    key={j}
                    x={cx + Math.cos(a) * (20 + 80 * f)}
                    y={cy + Math.sin(a) * (20 + 80 * f)}
                    textAnchor="middle"
                    fill={C.yellow}
                    fontFamily={mono}
                    fontSize={22}
                    fontWeight={700}
                    opacity={iones * (1 - f)}
                  >
                    K+
                  </text>
                );
              })
            : null}
          {agua > 0
            ? (() => {
                const f = (t * 0.6 + k * 0.17) % 1;
                const a = random(`ag${k}`) * Math.PI * 2;
                return (
                  <circle
                    cx={cx + Math.cos(a) * (30 + 70 * f)}
                    cy={cy + Math.sin(a) * (30 + 70 * f)}
                    r={8}
                    fill={C.cyan}
                    opacity={agua * (1 - f)}
                  />
                );
              })()
            : null}
        </g>
      ))}
    </g>
  );
};

// Pulso eléctrico a lo largo de una línea
export const Pulso: React.FC<{
  readonly x1: number;
  readonly y1: number;
  readonly x2: number;
  readonly y2: number;
  readonly p: number;
}> = ({ x1, y1, x2, y2, p }) => (
  <g>
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={TALLO}
      strokeWidth={16}
      strokeLinecap="round"
    />
    {p > 0 && p < 1 ? (
      <path
        d={`M ${x1 + (x2 - x1) * p - 30} ${y1 + (y2 - y1) * p} l 14 -24 l 10 18 l 12 -30 l 10 36 l 14 -18`}
        stroke={C.yellow}
        strokeWidth={7}
        fill="none"
        strokeLinejoin="round"
      />
    ) : null}
  </g>
);

export const caidaDe = (
  t: number,
  inicio: number,
  i: number,
  paso = 0.18,
  dur = 0.7,
) =>
  interpolate(t, [inicio + i * paso, inicio + i * paso + dur], [0, 1], clamp);

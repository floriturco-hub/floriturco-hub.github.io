import { interpolateColors, random } from "remotion";
import { C, mono } from "../theme";

export const COBRE = "#E08850";
export const PATINA = "#5DBA9C";
// 0 = cobre nuevo, 0.3 = marrón, 0.55 = casi negro, 1 = pátina verde
export const colorCobre = (p: number) =>
  interpolateColors(
    p,
    [0, 0.3, 0.55, 1],
    [COBRE, "#8A5232", "#3E2C24", PATINA],
  );
const borde = (p: number) =>
  interpolateColors(
    p,
    [0, 0.3, 0.55, 1],
    ["#FFB880", "#B07048", "#5A4438", "#9CE0C8"],
  );

// Estatua de la Libertad esquemática (sin pedestal de piedra salvo que se pida)
export const Estatua: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s?: number;
  readonly p: number;
  readonly brillo?: number;
  readonly t?: number;
  readonly pedestal?: boolean;
  readonly color?: string;
}> = ({ x, y, s = 1, p, brillo = 0, t = 0, pedestal = true, color }) => {
  const c = color ?? colorCobre(p);
  const b = borde(p);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {pedestal ? (
        <g>
          <path
            d="M -150 300 L 150 300 L 130 360 L -130 360 Z"
            fill="#6A6480"
          />
          <rect x={-120} y={360} width={240} height={180} fill="#5A5470" />
          <path
            d="M -180 540 L 180 540 L 200 600 L -200 600 Z"
            fill="#4A4460"
          />
        </g>
      ) : null}
      {/* túnica */}
      <path
        d="M -70 -150 Q -100 0 -120 300 L 120 300 Q 100 40 75 -150 Z"
        fill={c}
        stroke={b}
        strokeWidth={5}
      />
      <path
        d="M -50 -60 Q -20 100 -40 290 M 20 -80 Q 50 100 40 290"
        stroke={b}
        strokeWidth={4}
        fill="none"
        opacity={0.6}
      />
      {/* brazo izquierdo con tablilla */}
      <path
        d="M -70 -110 Q -130 -40 -110 30"
        stroke={c}
        strokeWidth={34}
        fill="none"
        strokeLinecap="round"
      />
      <rect
        x={-160}
        y={-40}
        width={70}
        height={110}
        rx={8}
        fill={c}
        stroke={b}
        strokeWidth={5}
        transform="rotate(-12 -125 15)"
      />
      {/* brazo derecho con antorcha */}
      <path
        d="M 60 -140 L 95 -300"
        stroke={c}
        strokeWidth={34}
        strokeLinecap="round"
      />
      <path
        d="M 80 -310 L 112 -310 L 104 -350 L 88 -350 Z"
        fill={c}
        stroke={b}
        strokeWidth={4}
      />
      <path
        d={`M 96 -350 Q ${76 + Math.sin(t * 9) * 4} -385 96 -420 Q ${116 + Math.sin(t * 7) * 4} -385 96 -350 Z`}
        fill={C.yellow}
      />
      {/* cabeza y corona */}
      <circle cx={0} cy={-185} r={40} fill={c} stroke={b} strokeWidth={5} />
      {new Array(7).fill(0).map((_, k) => {
        const a = -150 + k * 20;
        const r = (a * Math.PI) / 180;
        return (
          <path
            key={k}
            d={`M ${Math.cos(r) * 38} ${-195 + Math.sin(r) * 38} L ${Math.cos(r) * 85} ${-195 + Math.sin(r) * 85}`}
            stroke={c}
            strokeWidth={10}
            strokeLinecap="round"
          />
        );
      })}
      {brillo > 0
        ? [
            [-60, -40],
            [70, 120],
            [10, -190],
            [-90, 200],
          ].map(([dx, dy], k) => {
            const f = (t * 1.2 + k * 0.27) % 1;
            const r = 26 * Math.sin(f * Math.PI);
            return (
              <path
                key={k}
                d={`M ${dx} ${dy - r} L ${dx + r * 0.25} ${dy} L ${dx} ${dy + r} L ${dx - r * 0.25} ${dy} Z M ${dx - r} ${dy} L ${dx} ${dy + r * 0.25} L ${dx + r} ${dy} L ${dx} ${dy - r * 0.25} Z`}
                fill="#FFFFFF"
                opacity={brillo}
              />
            );
          })
        : null}
    </g>
  );
};

// Moneda nueva de cobre
export const Moneda: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly r: number;
  readonly op: number;
}> = ({ x, y, r, op }) => (
  <g transform={`translate(${x} ${y})`} opacity={op}>
    <circle r={r} fill={COBRE} stroke="#FFB880" strokeWidth={8} />
    <circle
      r={r * 0.78}
      fill="none"
      stroke="#FFB880"
      strokeWidth={4}
      opacity={0.7}
    />
    <text
      y={r * 0.22}
      textAnchor="middle"
      fill="#8A4A22"
      fontFamily={mono}
      fontSize={r * 0.62}
      fontWeight={700}
    >
      Cu
    </text>
  </g>
);

// Silueta de ciudad europea con tejados de cobre
export const Ciudad: React.FC<{
  readonly y: number;
  readonly p: (k: number) => number;
  readonly op?: number;
}> = ({ y, p, op = 1 }) => {
  const edificios: [number, number, number, "cupula" | "aguja" | "tejado"][] = [
    [60, 170, 260, "tejado"],
    [250, 200, 380, "cupula"],
    [460, 150, 300, "aguja"],
    [620, 220, 420, "cupula"],
    [850, 180, 280, "aguja"],
  ];
  return (
    <g opacity={op}>
      {edificios.map(([x, w, h, tipo], k) => {
        const c = colorCobre(p(k));
        const b = borde(p(k));
        const top = y - h;
        return (
          <g key={k}>
            <rect
              x={x}
              y={top}
              width={w}
              height={h}
              fill="#2A2350"
              stroke="#4A4270"
              strokeWidth={4}
            />
            {new Array(Math.floor(h / 70)).fill(0).map((_, j) => (
              <rect
                key={j}
                x={x + w / 2 - 14}
                y={top + 30 + j * 70}
                width={28}
                height={40}
                rx={14}
                fill={C.yellow}
                opacity={0.45}
              />
            ))}
            {tipo === "cupula" ? (
              <g>
                <path
                  d={`M ${x - 6} ${top} Q ${x + w / 2} ${top - w * 0.9} ${x + w + 6} ${top} Z`}
                  fill={c}
                  stroke={b}
                  strokeWidth={5}
                />
                <line
                  x1={x + w / 2}
                  y1={top - w * 0.45}
                  x2={x + w / 2}
                  y2={top - w * 0.45 - 60}
                  stroke={b}
                  strokeWidth={6}
                />
              </g>
            ) : tipo === "aguja" ? (
              <path
                d={`M ${x - 6} ${top} L ${x + w / 2} ${top - 260} L ${x + w + 6} ${top} Z`}
                fill={c}
                stroke={b}
                strokeWidth={5}
              />
            ) : (
              <path
                d={`M ${x - 10} ${top} L ${x + w / 2} ${top - 110} L ${x + w + 10} ${top} Z`}
                fill={c}
                stroke={b}
                strokeWidth={5}
              />
            )}
          </g>
        );
      })}
      <rect x={0} y={y} width={1080} height={20} fill="#1A1636" />
    </g>
  );
};

// Placa de cobre con su color según el avance
export const Placa: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
  readonly p: number;
  readonly t: number;
}> = ({ x, y, w, h, p, t }) => (
  <g>
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx={18}
      fill={colorCobre(p)}
      stroke={borde(p)}
      strokeWidth={6}
    />
    {new Array(6).fill(0).map((_, k) => (
      <line
        key={k}
        x1={x + 30 + k * (w / 6)}
        y1={y + 20}
        x2={x + 10 + k * (w / 6)}
        y2={y + h - 20}
        stroke="#FFFFFF"
        strokeWidth={6}
        opacity={
          0.12 * (1 - Math.min(1, p * 3)) * (0.7 + 0.3 * Math.sin(t * 3 + k))
        }
      />
    ))}
  </g>
);

// Lluvia y moléculas cayendo sobre la placa
export const Atmosfera: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
  readonly t: number;
  readonly op: number;
  readonly lluvia?: number;
  readonly moleculas?: number;
}> = ({ x, y, w, h, t, op, lluvia = 1, moleculas = 1 }) => {
  const etiquetas = ["CO2", "SO2", "O2", "H2O"];
  return (
    <g opacity={op}>
      {new Array(22).fill(0).map((_, k) => {
        const f = (t * 0.9 + random(`lf${k}`)) % 1;
        const px = x + random(`lx${k}`) * w;
        return (
          <path
            key={k}
            d={`M ${px} ${y + f * h} l -6 26`}
            stroke={C.cyan}
            strokeWidth={5}
            strokeLinecap="round"
            opacity={lluvia * 0.8}
          />
        );
      })}
      {new Array(8).fill(0).map((_, k) => {
        const f = (t * 0.35 + k / 8) % 1;
        const px = x + 60 + random(`mx${k}`) * (w - 120);
        return (
          <g key={`m${k}`} opacity={moleculas * Math.sin(f * Math.PI)}>
            <rect
              x={px - 46}
              y={y + f * h - 26}
              width={92}
              height={44}
              rx={22}
              fill={C.card}
              stroke={C.cardBorder}
              strokeWidth={2}
            />
            <text
              x={px}
              y={y + f * h + 6}
              textAnchor="middle"
              fill={C.white}
              fontFamily={mono}
              fontSize={26}
              fontWeight={700}
            >
              {etiquetas[k % 4]}
            </text>
          </g>
        );
      })}
    </g>
  );
};

// Rodillo de pintura
export const Rodillo: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly op: number;
}> = ({ x, y, op }) => (
  <g transform={`translate(${x} ${y}) rotate(-20)`} opacity={op}>
    <rect
      x={-90}
      y={-40}
      width={180}
      height={70}
      rx={24}
      fill="#C8C4D8"
      stroke="#8C88A8"
      strokeWidth={5}
    />
    <path
      d="M 90 -5 L 120 -5 L 120 80 L 0 80 L 0 160"
      stroke="#8C88A8"
      strokeWidth={10}
      fill="none"
    />
    <rect x={-14} y={160} width={28} height={110} rx={10} fill="#5A5478" />
  </g>
);

// Pancarta de protesta
export const Pancarta: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly texto: string;
  readonly op: number;
  readonly t: number;
  readonly k: number;
}> = ({ x, y, texto, op, t, k }) => (
  <g
    transform={`translate(${x} ${y + Math.sin(t * 6 + k) * 10}) rotate(${Math.sin(t * 4 + k) * 5})`}
    opacity={op}
  >
    <line x1={0} y1={0} x2={0} y2={180} stroke="#8C6A4A" strokeWidth={10} />
    <rect
      x={-120}
      y={-90}
      width={240}
      height={100}
      rx={10}
      fill="#F0E8D8"
      stroke="#B8A888"
      strokeWidth={4}
    />
    <text
      y={-28}
      textAnchor="middle"
      fill={C.red}
      fontFamily={mono}
      fontSize={30}
      fontWeight={700}
    >
      {texto}
    </text>
  </g>
);

// Corte de la piel de cobre con la pátina encima
export const Corte: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly t: number;
  readonly patina: number;
  readonly ataque: number;
}> = ({ x, y, w, t, patina, ataque }) => (
  <g>
    <rect
      x={x}
      y={y}
      width={w}
      height={140}
      rx={10}
      fill={COBRE}
      stroke="#FFB880"
      strokeWidth={5}
    />
    <text
      x={x + w / 2}
      y={y + 86}
      textAnchor="middle"
      fill="#6A3418"
      fontFamily={mono}
      fontSize={34}
      fontWeight={700}
    >
      cobre
    </text>
    <rect
      x={x}
      y={y - 60 * patina}
      width={w}
      height={60 * patina}
      rx={8}
      fill={PATINA}
      stroke="#9CE0C8"
      strokeWidth={4}
    />
    {patina > 0.5 ? (
      <text
        x={x + w / 2}
        y={y - 18}
        textAnchor="middle"
        fill="#1E4A3C"
        fontFamily={mono}
        fontSize={28}
        fontWeight={700}
      >
        pátina
      </text>
    ) : null}
    {ataque > 0
      ? new Array(7).fill(0).map((_, k) => {
          const f = (t * 0.8 + k / 7) % 1;
          const px = x + 60 + k * ((w - 120) / 6);
          const baja = f < 0.6;
          const py = baja
            ? y - 380 + (f / 0.6) * 300
            : y - 80 - ((f - 0.6) / 0.4) * 160;
          return (
            <circle
              key={k}
              cx={px + (baja ? 0 : ((f - 0.6) / 0.4) * 40 * (k % 2 ? 1 : -1))}
              cy={py}
              r={14}
              fill={k % 2 ? C.cyan : C.white}
              opacity={ataque * 0.9}
            />
          );
        })
      : null}
  </g>
);

// Escudo
export const Escudo: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s?: number;
  readonly op: number;
}> = ({ x, y, s = 1, op }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={op}>
    <path
      d="M 0 -90 L 75 -60 Q 80 40 0 95 Q -80 40 -75 -60 Z"
      fill={PATINA}
      stroke="#9CE0C8"
      strokeWidth={8}
    />
    <path
      d="M -30 0 L -8 24 L 34 -24"
      stroke="#FFFFFF"
      strokeWidth={12}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </g>
);

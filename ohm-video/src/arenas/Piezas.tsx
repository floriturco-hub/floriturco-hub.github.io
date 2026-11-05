import { random } from "remotion";
import { C, mono } from "../theme";

export const ARENA = "#C8A060";

// Persona esquemática (pies en y=0)
export const Persona: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s?: number;
  readonly inclina?: number;
  readonly brazos?: number;
  readonly t?: number;
  readonly color?: string;
}> = ({ x, y, s = 1, inclina = 0, brazos = 0, t = 0, color = "#3A6A9A" }) => (
  <g transform={`translate(${x} ${y}) rotate(${inclina}) scale(${s})`}>
    <rect
      x={-50}
      y={-260}
      width={36}
      height={260}
      rx={18}
      fill="#2A3A5A"
      transform={`rotate(${Math.sin(t * 4) * 4 * brazos} -32 -260)`}
    />
    <rect
      x={14}
      y={-260}
      width={36}
      height={260}
      rx={18}
      fill="#2A3A5A"
      transform={`rotate(${-Math.sin(t * 4) * 4 * brazos} 32 -260)`}
    />
    <rect x={-70} y={-520} width={140} height={280} rx={40} fill={color} />
    <path
      d={`M -70 -500 L ${-150} ${-380 - 120 * brazos}`}
      stroke={color}
      strokeWidth={34}
      strokeLinecap="round"
    />
    <path
      d={`M 70 -500 L ${150} ${-380 - 120 * brazos}`}
      stroke={color}
      strokeWidth={34}
      strokeLinecap="round"
    />
    <circle cx={0} cy={-590} r={62} fill="#E8B898" />
  </g>
);

// Arena movediza en corte: granos que se separan (licua) o se compactan
export const Arena: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
  readonly licua: number;
  readonly compacta: number;
  readonly t: number;
}> = ({ x, y, w, h, licua, compacta, t }) => {
  const n = 120;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill={compacta > 0.5 ? "#8A6A3A" : "#6A5A4A"}
      />
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill={C.cyan}
        opacity={0.12 * (1 - compacta)}
      />
      {new Array(n).fill(0).map((_, k) => {
        const bx = x + random(`ax${k}`) * w;
        const by = y + 10 + random(`ay${k}`) * (h - 20);
        const sep = licua * 10 * Math.sin(t * 3 + k);
        const r = 10 + 6 * random(`ar${k}`);
        return (
          <circle
            key={k}
            cx={bx + sep}
            cy={by + sep * 0.6}
            r={r * (1 + 0.3 * compacta)}
            fill={ARENA}
            stroke="#8A6A3A"
            strokeWidth={2}
          />
        );
      })}
    </g>
  );
};

// Bloques de densidad
export const Densidad: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly op: number;
}> = ({ x, y, op }) => (
  <g transform={`translate(${x} ${y})`} opacity={op}>
    <rect x={-360} y={-200} width={300} height={300} rx={20} fill={ARENA} />
    <text
      x={-210}
      y={-30}
      textAnchor="middle"
      fill={C.bg}
      fontFamily={mono}
      fontSize={48}
      fontWeight={700}
    >
      ~2
    </text>
    <text
      x={-210}
      y={150}
      textAnchor="middle"
      fill={ARENA}
      fontFamily={mono}
      fontSize={32}
      fontWeight={700}
    >
      arena
    </text>
    <rect x={60} y={-50} width={300} height={150} rx={20} fill="#E8B898" />
    <text
      x={210}
      y={45}
      textAnchor="middle"
      fill={C.bg}
      fontFamily={mono}
      fontSize={48}
      fontWeight={700}
    >
      ~1
    </text>
    <text
      x={210}
      y={150}
      textAnchor="middle"
      fill="#E8B898"
      fontFamily={mono}
      fontSize={32}
      fontWeight={700}
    >
      tu cuerpo
    </text>
    <text
      x={0}
      y={230}
      textAnchor="middle"
      fill={C.grey}
      fontFamily={mono}
      fontSize={28}
    >
      densidad (g/cm3)
    </text>
  </g>
);

// Auto pequeño (para comparar la fuerza)
export const AutoMini: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s?: number;
  readonly op: number;
}> = ({ x, y, s = 1, op }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={op}>
    <path
      d="M -160 30 L -150 -10 L -90 -20 L -50 -70 L 70 -70 L 110 -20 L 160 -10 L 165 30 Z"
      fill="#C83A3A"
    />
    <circle cx={-95} cy={34} r={28} fill="#1A1A2A" />
    <circle cx={105} cy={34} r={28} fill="#1A1A2A" />
  </g>
);

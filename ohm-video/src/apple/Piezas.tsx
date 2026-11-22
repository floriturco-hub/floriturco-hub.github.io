import { C, mono } from "../theme";

const ALU = "#B8B4C8";
const ALU_OSC = "#8C88A8";

// Portátil genérico en vista lateral (sin marca). angulo = apertura de la tapa en grados (0 cerrado, 90 vertical)
export const PortatilLado: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly angulo: number; readonly brillo?: number }> = ({
  x,
  y,
  s,
  angulo,
  brillo = 1,
}) => {
  const base = 300;
  const a = ((180 - angulo) * Math.PI) / 180; // la bisagra está a la derecha de la base
  const bx = x + base * s * 0.5;
  const tx = bx + Math.cos(a) * base * s;
  const ty = y - Math.sin(a) * base * s;
  const nx = -Math.sin(a);
  const ny = -Math.cos(a);
  return (
    <g>
      <rect x={x - base * s * 0.5} y={y} width={base * s} height={16 * s} rx={6 * s} fill={ALU} />
      <rect x={x - base * s * 0.5} y={y + 14 * s} width={base * s} height={5 * s} rx={2 * s} fill={ALU_OSC} />
      {/* Tapa: grosor y cara de la pantalla */}
      <polygon points={`${bx},${y} ${tx},${ty} ${tx + nx * 10 * s},${ty + ny * 10 * s} ${bx + nx * 10 * s},${y + ny * 10 * s}`} fill={ALU} />
      <line x1={bx - nx * 2 * s} y1={y - ny * 2 * s} x2={tx - nx * 2 * s} y2={ty - ny * 2 * s} stroke={C.cyan} strokeWidth={4 * s} opacity={0.5 * brillo} />
    </g>
  );
};

// Portátil visto de frente (pantalla con apps abiertas)
export const PortatilFrente: React.FC<{ readonly x: number; readonly y: number; readonly w: number; readonly t: number; readonly altura?: number }> = ({ x, y, w, t, altura = 1 }) => {
  const h = w * 0.62 * altura;
  return (
    <g>
      <rect x={x - w / 2} y={y - h} width={w} height={h} rx={w * 0.03} fill="#1A1636" stroke={ALU} strokeWidth={w * 0.02} />
      <rect x={x - w / 2 + w * 0.05} y={y - h + w * 0.05} width={w * 0.9} height={h - w * 0.1} rx={w * 0.01} fill="#22305A" opacity={altura > 0.3 ? 1 : 0} />
      {altura > 0.5 ? (
        <g>
          <rect x={x - w * 0.4} y={y - h + w * 0.08} width={w * 0.45} height={h * 0.45} rx={w * 0.01} fill="#3A4A7A" />
          <rect x={x + w * 0.08} y={y - h + w * 0.08} width={w * 0.32} height={h * 0.3} rx={w * 0.01} fill="#2A6A6A" />
          <rect x={x - w * 0.4} y={y - h * 0.4} width={w * 0.8} height={w * 0.03} rx={w * 0.015} fill="#5A6A9A" />
          <circle cx={x - w * 0.18 + 6 * Math.sin(t)} cy={y - h * 0.68} r={w * 0.04} fill={C.yellow} opacity={0.8} />
        </g>
      ) : null}
      <path d={`M ${x - w * 0.56} ${y} L ${x + w * 0.56} ${y} L ${x + w * 0.5} ${y + w * 0.04} L ${x - w * 0.5} ${y + w * 0.04} Z`} fill={ALU} />
    </g>
  );
};

// Mano estilizada (índice extendido) que empuja
export const Mano: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly rot?: number }> = ({ x, y, s, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path
      d="M 0 0 L 70 0 Q 85 0 85 12 Q 85 24 70 24 L 40 24 L 52 30 Q 62 36 56 46 L 50 52 Q 56 60 48 68 L 40 72 Q 44 82 34 86 L -30 86 Q -60 86 -70 60 L -80 20 Q -84 4 -66 0 Z"
      fill="#E8C8A8"
      stroke="#B8987A"
      strokeWidth={3}
    />
  </g>
);

// Transportador para marcar el ángulo de la tapa
export const Transportador: React.FC<{ readonly x: number; readonly y: number; readonly r: number; readonly angulo: number; readonly o: number }> = ({ x, y, r, angulo, o }) => {
  const a = ((180 - angulo) * Math.PI) / 180;
  return (
    <g opacity={o}>
      <path d={`M ${x - r} ${y} A ${r} ${r} 0 0 1 ${x + r} ${y}`} fill="none" stroke={C.grey} strokeWidth={3} strokeDasharray="6 8" />
      <path d={`M ${x + r * 0.45} ${y} A ${r * 0.45} ${r * 0.45} 0 0 0 ${x + Math.cos(a) * r * 0.45} ${y - Math.sin(a) * r * 0.45}`} fill="none" stroke={C.yellow} strokeWidth={6} />
      <text x={x + Math.cos(a / 2 + 0.0) * r * 0.75} y={y - Math.sin(a / 2) * r * 0.75} textAnchor="middle" fill={C.yellow} fontFamily={mono} fontSize={44} fontWeight={700}>
        {Math.round(angulo)}°
      </text>
    </g>
  );
};

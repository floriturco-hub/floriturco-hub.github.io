import { random } from "remotion";
import { C, mono } from "../theme";

// Avión de combate de perfil (mirando a la derecha)
export const Avion: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s?: number;
  readonly cabina: number;
  readonly t?: number;
}> = ({ x, y, s = 1, cabina, t = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path
      d="M -420 0 L -380 -40 L 280 -40 Q 400 -30 460 0 Q 400 30 280 40 L -380 40 Z"
      fill="#7A8A9A"
      stroke="#C8D0E0"
      strokeWidth={5}
    />
    <path d="M -420 -10 L -470 -170 L -350 -40 Z" fill="#6A7A8A" />
    <path d="M -100 20 L -260 160 L 40 40 Z" fill="#6A7A8A" />
    <path
      d="M -440 -10 L -520 -10 L -500 10 L -440 10 Z"
      fill={C.orange}
      opacity={0.8 + 0.2 * Math.sin(t * 20)}
    />
    {cabina < 0.5 ? (
      <path d="M 120 -40 Q 180 -110 260 -40 Z" fill="#9AD0F0" opacity={0.8} />
    ) : null}
    {cabina >= 0.5
      ? new Array(10).fill(0).map((_, k) => {
          const f = Math.min(1, (cabina - 0.5) * 2);
          return (
            <path
              key={k}
              d={`M ${150 + k * 10 + f * (random(`cx${k}`) - 0.5) * 300} ${-70 - f * 200 * random(`cy${k}`)} l 20 -8 l -6 18 Z`}
              fill="#9AD0F0"
              opacity={1 - f}
            />
          );
        })
      : null}
  </g>
);

// Asiento con piloto (relativo a su base)
export const Asiento: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s?: number;
  readonly rot?: number;
  readonly cohete?: number;
  readonly t?: number;
  readonly piloto?: boolean;
}> = ({ x, y, s = 1, rot = 0, cohete = 0, t = 0, piloto = true }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    {cohete > 0 ? (
      <path
        d={`M -30 30 L 0 ${60 + 120 * cohete + 20 * Math.sin(t * 30)} L 30 30 Z`}
        fill={C.yellow}
        opacity={cohete}
      />
    ) : null}
    <rect x={-60} y={-20} width={120} height={50} rx={10} fill="#3A3A4A" />
    <rect x={-60} y={-220} width={40} height={220} rx={10} fill="#3A3A4A" />
    {piloto ? (
      <g>
        <rect x={-20} y={-190} width={60} height={170} rx={24} fill="#5A6A3A" />
        <circle
          cx={10}
          cy={-230}
          r={40}
          fill="#E8E6F0"
          stroke="#8C88A8"
          strokeWidth={4}
        />
        <rect x={20} y={-30} width={90} height={34} rx={14} fill="#5A6A3A" />
      </g>
    ) : null}
  </g>
);

// Paracaídas
export const Paracaidas: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly abre: number;
}> = ({ x, y, abre }) => (
  <g transform={`translate(${x} ${y})`} opacity={Math.min(1, abre * 3)}>
    <path
      d={`M ${-200 * abre} -260 Q 0 ${-420 - 40 * abre} ${200 * abre} -260 Z`}
      fill={C.orange}
      stroke="#FFFFFF"
      strokeWidth={4}
    />
    <path
      d={`M ${-200 * abre} -260 L 0 -40 M ${200 * abre} -260 L 0 -40 M 0 -300 L 0 -40`}
      stroke="#E8E6F0"
      strokeWidth={3}
    />
  </g>
);

// Gráfica aceleración-tiempo: golpe brusco vs empuje progresivo
export const GraficaG: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
  readonly p: number;
  readonly suave: number;
}> = ({ x, y, w, h, p, suave }) => {
  const x0 = x + 70;
  const y0 = y + h - 70;
  const brusco = `M ${x0} ${y0} L ${x0 + 20} ${y0 - (h - 150)} L ${x0 + 60} ${y0 - (h - 150)} L ${x0 + 80} ${y0}`;
  const pts = new Array(41).fill(0).map((_, i) => {
    const u = i / 40;
    const v = Math.sin(u * Math.PI) * 0.55;
    return `${(x0 + u * (w - 120) * p).toFixed(1)} ${(y0 - v * (h - 150)).toFixed(1)}`;
  });
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={22}
        fill={C.card}
        stroke={C.cardBorder}
        strokeWidth={2}
      />
      <line
        x1={x0}
        y1={y0}
        x2={x + w - 40}
        y2={y0}
        stroke={C.grey}
        strokeWidth={3}
      />
      <line
        x1={x0}
        y1={y0}
        x2={x0}
        y2={y + 60}
        stroke={C.grey}
        strokeWidth={3}
      />
      <text
        x={x0 + 10}
        y={y + 50}
        fill={C.grey}
        fontFamily={mono}
        fontSize={26}
      >
        aceleración
      </text>
      <text
        x={x + w - 40}
        y={y0 + 44}
        textAnchor="end"
        fill={C.grey}
        fontFamily={mono}
        fontSize={26}
      >
        tiempo
      </text>
      <path
        d={brusco}
        stroke={C.red}
        strokeWidth={7}
        fill="none"
        opacity={1 - 0.6 * suave}
      />
      {suave > 0 ? (
        <path
          d={`M ${pts.join(" L ")}`}
          stroke={C.cyan}
          strokeWidth={8}
          fill="none"
        />
      ) : null}
    </g>
  );
};

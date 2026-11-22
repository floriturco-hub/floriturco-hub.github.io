import { random } from "remotion";
import { C, mono } from "../theme";

// Tronco vertical con corteza y agujero
export const Tronco: React.FC<{
  readonly x: number;
  readonly w?: number;
  readonly hueco?: number;
  readonly yHueco?: number;
}> = ({ x, w = 260, hueco = 0, yHueco = 900 }) => (
  <g>
    <rect x={x} y={0} width={w} height={1920} fill="#6A4A2E" />
    {new Array(16).fill(0).map((_, k) => (
      <path
        key={k}
        d={`M ${x + 20 + (k % 4) * 60} ${k * 125} q 14 60 0 120`}
        stroke="#4A321E"
        strokeWidth={8}
        fill="none"
      />
    ))}
    {hueco > 0 ? (
      <ellipse
        cx={x + 6}
        cy={yHueco}
        rx={18 + 22 * hueco}
        ry={26 + 30 * hueco}
        fill="#2A1A0E"
      />
    ) : null}
  </g>
);

// Pájaro carpintero de perfil, mirando a la derecha. golpe 0..1 lleva la cabeza hacia delante.
export const Carpintero: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s?: number;
  readonly golpe: number;
  readonly cerebro?: number;
}> = ({ x, y, s = 1, golpe, cerebro = 0 }) => {
  const g = golpe * 34;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M -120 40 L -230 220 L -170 200 L -150 260 Z" fill="#1A1A2A" />
      <ellipse
        cx={-60}
        cy={60}
        rx={90}
        ry={150}
        fill="#1A1A2A"
        transform="rotate(-18 -60 60)"
      />
      <ellipse
        cx={-30}
        cy={90}
        rx={50}
        ry={110}
        fill="#F0ECE0"
        transform="rotate(-18 -30 90)"
      />
      {[0, 1, 2, 3].map((k) => (
        <path
          key={k}
          d={`M ${-120 + k * 6} ${20 + k * 40} q 30 10 50 0`}
          stroke="#F0ECE0"
          strokeWidth={10}
          fill="none"
        />
      ))}
      <path
        d="M 10 230 L 60 250 M 10 250 L 60 280"
        stroke="#5A5A6A"
        strokeWidth={8}
        strokeLinecap="round"
      />
      <g transform={`translate(${g} ${-g * 0.15})`}>
        <path
          d="M -10 -60 Q 0 -30 -20 0 L 40 10 Q 60 -40 40 -70 Z"
          fill="#1A1A2A"
        />
        <circle cx={30} cy={-110} r={62} fill="#1A1A2A" />
        <path
          d="M -20 -150 Q 30 -210 80 -140 Q 40 -160 -10 -120 Z"
          fill="#E8414F"
        />
        <path d="M 40 -100 Q 80 -100 92 -84 L 40 -76 Z" fill="#F0ECE0" />
        <circle cx={52} cy={-122} r={9} fill="#FFFFFF" />
        <circle cx={54} cy={-122} r={5} fill={C.bg} />
        <path
          d="M 86 -122 L 210 -108 L 86 -94 Z"
          fill="#8A8A9A"
          stroke="#5A5A6A"
          strokeWidth={3}
        />
        {cerebro > 0 ? (
          <g opacity={cerebro}>
            <circle
              cx={30}
              cy={-110}
              r={62}
              fill="none"
              stroke={C.yellow}
              strokeWidth={4}
              strokeDasharray="8 6"
            />
            <ellipse cx={20} cy={-116} rx={30} ry={22} fill="#E8A0B8" />
          </g>
        ) : null}
      </g>
    </g>
  );
};

// Astillas que salen del tronco
export const Astillas: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly t: number;
  readonly op: number;
}> = ({ x, y, t, op }) => (
  <g opacity={op}>
    {new Array(12).fill(0).map((_, k) => {
      const f = (t * 1.8 + random(`as${k}`)) % 1;
      const vx = -80 - random(`vx${k}`) * 160;
      const vy = -120 + random(`vy${k}`) * 160;
      return (
        <rect
          key={k}
          x={x + vx * f}
          y={y + vy * f + 300 * f * f}
          width={14}
          height={6}
          fill="#C8A070"
          opacity={1 - f}
          transform={`rotate(${k * 47 + f * 300} ${x + vx * f} ${y + vy * f + 300 * f * f})`}
        />
      );
    })}
  </g>
);

// Barras de G comparadas
export const BarrasG: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly p: number;
  readonly humano: number;
}> = ({ x, y, w, p, humano }) => {
  const max = 1300;
  return (
    <g>
      <g opacity={humano}>
        <text
          x={x}
          y={y - 20}
          fill={C.white}
          fontFamily={mono}
          fontSize={32}
          fontWeight={700}
        >
          persona: conmoción
        </text>
        <rect
          x={x}
          y={y}
          width={(w * 100) / max}
          height={70}
          rx={10}
          fill={C.cyan}
        />
        <text
          x={x + (w * 100) / max + 20}
          y={y + 50}
          fill={C.cyan}
          fontFamily={mono}
          fontSize={40}
          fontWeight={700}
        >
          ~100 G
        </text>
      </g>
      <text
        x={x}
        y={y + 170}
        fill={C.white}
        fontFamily={mono}
        fontSize={32}
        fontWeight={700}
      >
        carpintero
      </text>
      <rect
        x={x}
        y={y + 190}
        width={((w * 1200) / max) * p}
        height={70}
        rx={10}
        fill={C.red}
      />
      <text
        x={x + ((w * 1200) / max) * p - 10}
        y={y + 310}
        textAnchor="end"
        fill={C.red}
        fontFamily={mono}
        fontSize={48}
        fontWeight={700}
      >{`${Math.round(1200 * p)} G`}</text>
    </g>
  );
};

// Muelle (amortiguador)
export const Muelle: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly h: number;
  readonly op: number;
}> = ({ x, y, h, op }) => (
  <g opacity={op}>
    <path
      d={`M ${x} ${y} ${new Array(8)
        .fill(0)
        .map((_, k) => `L ${x + (k % 2 ? 40 : -40)} ${y + ((k + 0.5) * h) / 8}`)
        .join(" ")} L ${x} ${y + h}`}
      stroke={C.grey}
      strokeWidth={8}
      fill="none"
    />
  </g>
);

// Martillo
export const Martillo: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s?: number;
  readonly op: number;
  readonly rot?: number;
}> = ({ x, y, s = 1, op, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={op}>
    <rect x={-20} y={-20} width={40} height={300} rx={14} fill="#A07040" />
    <rect
      x={-110}
      y={-90}
      width={220}
      height={90}
      rx={14}
      fill="#8A8A9A"
      stroke="#5A5A6A"
      strokeWidth={5}
    />
  </g>
);

// Cerebro simple (para comparar tamaños)
export const CerebroMini: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s: number;
}> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path
      d="M -100 10 C -110 -60 -50 -95 0 -95 C 55 -100 110 -60 100 0 C 98 45 55 65 12 60 C -20 75 -90 65 -100 10 Z"
      fill="#E8A0B8"
      stroke="#C86A8A"
      strokeWidth={6 / s}
    />
    <path
      d="M -60 -30 Q -20 -60 20 -30 M 10 10 Q 50 -20 80 10"
      stroke="#C86A8A"
      strokeWidth={5 / s}
      fill="none"
    />
  </g>
);

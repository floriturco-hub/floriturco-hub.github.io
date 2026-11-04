import { C, mono } from "../theme";

// Rueda dentada del carrete
export const Rueda: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly r: number;
  readonly rot: number;
}> = ({ x, y, r, rot }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    {new Array(16).fill(0).map((_, k) => (
      <path
        key={k}
        transform={`rotate(${k * 22.5})`}
        d={`M ${-14} ${-r + 4} L ${-6} ${-r - 26} L ${10} ${-r - 26} L ${14} ${-r + 4} Z`}
        fill="#A8ACB8"
      />
    ))}
    <circle r={r} fill="#A8ACB8" stroke="#5A5E6A" strokeWidth={6} />
    <circle r={r * 0.72} fill="#3A3E4A" />
    <circle r={r * 0.62} fill="#2A3A5A" />
    {new Array(6).fill(0).map((_, k) => (
      <path
        key={`c${k}`}
        transform={`rotate(${k * 60})`}
        d={`M 0 0 L 0 ${-r * 0.6}`}
        stroke="#1A2A4A"
        strokeWidth={10}
      />
    ))}
    <circle r={24} fill="#5A5E6A" />
  </g>
);

// Bolita en la cazoleta y palanca: inercia 0..1 la desplaza, la palanca sube y traba
export const Sensor: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly inercia: number;
}> = ({ x, y, inercia }) => {
  const bx = 80 * inercia;
  const by = -30 * inercia * inercia;
  return (
    <g transform={`translate(${x} ${y})`}>
      <path
        d="M -120 -60 Q 0 80 120 -60"
        fill="none"
        stroke="#8C88A8"
        strokeWidth={10}
      />
      <circle
        cx={bx}
        cy={-4 + by}
        r={36}
        fill="#D8DCE4"
        stroke="#8A8E9A"
        strokeWidth={4}
      />
      <circle cx={bx - 10} cy={-14 + by} r={10} fill="#FFFFFF" opacity={0.8} />
      <g transform={`rotate(${-28 * inercia} -40 -70)`}>
        <rect
          x={-60}
          y={-80}
          width={210}
          height={20}
          rx={8}
          fill={inercia > 0.7 ? C.red : C.yellow}
        />
        <path
          d="M 150 -80 L 170 -112 L 172 -60 Z"
          fill={inercia > 0.7 ? C.red : C.yellow}
        />
      </g>
    </g>
  );
};

// Cinta del cinturón saliendo del carrete
export const Cinta: React.FC<{
  readonly x1: number;
  readonly y1: number;
  readonly x2: number;
  readonly y2: number;
  readonly t: number;
  readonly mov: number;
}> = ({ x1, y1, x2, y2, t, mov }) => (
  <g>
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#3A3A4A" strokeWidth={46} />
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke="#5A5A6A"
      strokeWidth={6}
      strokeDasharray="20 30"
      strokeDashoffset={-t * 200 * mov}
    />
  </g>
);

// Pesitas centrífugas sobre el carrete
export const Pesitas: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly r: number;
  readonly rot: number;
  readonly abre: number;
}> = ({ x, y, r, rot, abre }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    {[0, 1].map((k) => (
      <g key={k} transform={`rotate(${k * 180})`}>
        <path
          d={`M 0 ${-r * 0.2} L 0 ${-r * (0.35 + 0.3 * abre)}`}
          stroke="#8C88A8"
          strokeWidth={8}
        />
        <circle
          cx={0}
          cy={-r * (0.38 + 0.3 * abre)}
          r={22}
          fill={abre > 0.6 ? C.red : C.orange}
        />
      </g>
    ))}
  </g>
);

// Auto de perfil
export const Auto: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s?: number;
  readonly inclina?: number;
}> = ({ x, y, s = 1, inclina = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${inclina}) scale(${s})`}>
    <path
      d="M -260 40 L -240 -20 L -150 -30 L -90 -100 L 110 -100 L 180 -30 L 260 -10 L 270 40 Z"
      fill="#3A6A9A"
      stroke="#8CB0D8"
      strokeWidth={6}
    />
    <path
      d="M -80 -90 L -20 -90 L -20 -36 L -130 -36 Z M 0 -90 L 100 -90 L 160 -36 L 0 -36 Z"
      fill="#9AD0F0"
      opacity={0.7}
    />
    <circle
      cx={-160}
      cy={44}
      r={44}
      fill="#1A1A2A"
      stroke="#8C88A8"
      strokeWidth={8}
    />
    <circle
      cx={170}
      cy={44}
      r={44}
      fill="#1A1A2A"
      stroke="#8C88A8"
      strokeWidth={8}
    />
  </g>
);

export const Texto2: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly children: React.ReactNode;
  readonly color?: string;
  readonly op?: number;
  readonly size?: number;
}> = ({ x, y, children, color = C.white, op = 1, size = 36 }) => (
  <text
    x={x}
    y={y}
    textAnchor="middle"
    fill={color}
    fontFamily={mono}
    fontSize={size}
    fontWeight={700}
    opacity={op}
  >
    {children}
  </text>
);

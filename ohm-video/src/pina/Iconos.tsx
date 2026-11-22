import { C, mono } from "../theme";

// Piña estilizada
export const Pina: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly t: number }> = ({ x, y, s, t }) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(${3 * Math.sin(t * 1.5)})`}>
    {[-40, -20, 0, 20, 40].map((a, k) => (
      <path key={k} d={`M 0 -90 Q ${a * 0.6} -170 ${a * 1.2} ${-200 - (k === 2 ? 30 : 0)} Q ${a * 0.4} -150 0 -90`} fill="#3FA86A" stroke="#2A7A4A" strokeWidth={3} />
    ))}
    <defs>
      <clipPath id="cuerpo-pina">
        <ellipse cx={0} cy={0} rx={78} ry={108} />
      </clipPath>
    </defs>
    <ellipse cx={0} cy={0} rx={80} ry={110} fill="#E8A83C" stroke="#B87A1C" strokeWidth={5} />
    <g clipPath="url(#cuerpo-pina)">
    {new Array(7).fill(0).map((_, k) => (
      <line key={`a${k}`} x1={-80 + k * 27} y1={-100} x2={-20 + k * 27} y2={100} stroke="#B87A1C" strokeWidth={3} opacity={0.7} />
    ))}
    {new Array(7).fill(0).map((_, k) => (
      <line key={`b${k}`} x1={80 - k * 27} y1={-100} x2={20 - k * 27} y2={100} stroke="#B87A1C" strokeWidth={3} opacity={0.7} />
    ))}
    </g>
  </g>
);

// Probeta con líquido
export const Probeta: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly nivel: number }> = ({ x, y, s, nivel }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -40 -160 L -40 120 Q -40 160 0 160 Q 40 160 40 120 L 40 -160" fill="rgba(255,255,255,0.05)" stroke="#C8C4D8" strokeWidth={6} />
    <path d={`M -36 ${160 - 300 * nivel} L -36 120 Q -36 156 0 156 Q 36 156 36 120 L 36 ${160 - 300 * nivel} Z`} fill="#D8D4E8" opacity={0.55} />
    <line x1={-56} y1={-160} x2={56} y2={-160} stroke="#C8C4D8" strokeWidth={6} strokeLinecap="round" />
  </g>
);

// Iconos pequeños para el recorrido y las listas
export const Icono: React.FC<{ readonly tipo: string; readonly x: number; readonly y: number; readonly s?: number; readonly color?: string }> = ({ tipo, x, y, s = 1, color = C.white }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {tipo === "estomago" ? <path d="M -20 -50 Q -10 -10 -40 10 Q -60 50 -10 55 Q 50 60 50 10 Q 50 -30 10 -30 Q 0 -40 0 -55" fill="none" stroke={color} strokeWidth={8} strokeLinecap="round" /> : null}
    {tipo === "sangre" ? (
      <g>
        <rect x={-60} y={-24} width={120} height={48} rx={24} fill="none" stroke={C.red} strokeWidth={8} />
        {[-30, 0, 30].map((dx) => <circle key={dx} cx={dx} cy={0} r={9} fill={C.yellow} />)}
      </g>
    ) : null}
    {tipo === "glandula" ? <path d="M -40 30 Q -60 -20 -20 -40 Q 0 -60 20 -40 Q 60 -20 40 30 Q 0 55 -40 30 Z" fill="none" stroke={C.purpleLight} strokeWidth={8} /> : null}
    {tipo === "vaso" ? <path d="M -30 -40 L 30 -40 L 22 45 L -22 45 Z M -26 -5 L 26 -5" fill="none" stroke={C.cyan} strokeWidth={7} strokeLinejoin="round" /> : null}
    {tipo === "copa" ? <path d="M -30 -45 L 30 -45 Q 30 0 0 5 Q -30 0 -30 -45 Z M 0 5 L 0 40 M -22 42 L 22 42" fill="none" stroke={C.red} strokeWidth={7} strokeLinejoin="round" /> : null}
    {tipo === "cigarro" ? (
      <g>
        <rect x={-50} y={-10} width={90} height={20} rx={4} fill="none" stroke={C.grey} strokeWidth={6} />
        <rect x={40} y={-10} width={14} height={20} fill={C.orange} />
        <path d="M 50 -20 Q 40 -40 55 -55" fill="none" stroke={C.grey} strokeWidth={4} opacity={0.6} />
      </g>
    ) : null}
    {tipo === "ajo" ? <path d="M 0 -50 Q -50 -10 -35 30 Q -20 50 0 45 Q 20 50 35 30 Q 50 -10 0 -50 Z M 0 -50 L 0 -65" fill="none" stroke="#E8E6F0" strokeWidth={7} strokeLinejoin="round" /> : null}
    {tipo === "medico" ? (
      <g>
        <rect x={-50} y={-50} width={100} height={100} rx={20} fill="none" stroke={C.red} strokeWidth={8} />
        <rect x={-10} y={-32} width={20} height={64} fill={C.red} />
        <rect x={-32} y={-10} width={64} height={20} fill={C.red} />
      </g>
    ) : null}
    {tipo === "bocadillo" ? (
      <g>
        <path d="M -60 -40 L 60 -40 L 60 25 L 0 25 L -25 50 L -20 25 L -60 25 Z" fill="none" stroke={color} strokeWidth={6} strokeLinejoin="round" />
        <text y={4} textAnchor="middle" fill={color} fontFamily={mono} fontSize={30} fontWeight={700}>...</text>
      </g>
    ) : null}
  </g>
);

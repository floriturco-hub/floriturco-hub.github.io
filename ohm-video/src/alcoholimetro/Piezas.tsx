import { random } from "remotion";
import { C, mono } from "../theme";

const ETANOL = "#C8E048";

// Alveolo con capilar: moléculas de alcohol que pasan de la sangre al aire
export const Alveolo: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s?: number;
  readonly t: number;
  readonly paso: number;
}> = ({ x, y, s = 1, t, paso }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle r={260} fill="#3A2A4A" stroke="#E87890" strokeWidth={10} />
    <text
      y={-120}
      textAnchor="middle"
      fill={C.grey}
      fontFamily={mono}
      fontSize={30}
      fontWeight={700}
    >
      aire
    </text>
    <path
      d="M -330 300 Q 0 160 330 300 L 330 380 Q 0 240 -330 380 Z"
      fill="#B8323A"
    />
    {new Array(12).fill(0).map((_, k) => (
      <ellipse
        key={k}
        cx={-300 + ((t * 120 + k * 55) % 600)}
        cy={300 + Math.sin(k) * 10}
        rx={16}
        ry={10}
        fill="#E8414F"
      />
    ))}
    {new Array(10).fill(0).map((_, k) => {
      const f = (t * 0.45 + k / 10) % 1;
      const sube = paso > 0 && random(`et${k}`) < paso;
      const px = -200 + random(`ex${k}`) * 400;
      const py = sube ? 300 - f * 400 : 310 + Math.sin(t * 3 + k) * 20;
      return (
        <circle
          key={`e${k}`}
          cx={px}
          cy={py}
          r={12}
          fill={ETANOL}
          opacity={sube ? Math.sin(f * Math.PI) : 0.9}
        />
      );
    })}
  </g>
);

// Pila de combustible: alcohol -> electrones -> aguja
export const Pila: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly t: number;
  readonly corriente: number;
}> = ({ x, y, t, corriente }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect
      x={-300}
      y={-160}
      width={600}
      height={320}
      rx={24}
      fill={C.card}
      stroke={C.cardBorder}
      strokeWidth={3}
    />
    <rect x={-240} y={-120} width={60} height={240} rx={10} fill="#C8C8D8" />
    <rect x={180} y={-120} width={60} height={240} rx={10} fill="#C8C8D8" />
    <text
      x={-210}
      y={150}
      textAnchor="middle"
      fill={C.grey}
      fontFamily={mono}
      fontSize={24}
      fontWeight={700}
    >
      platino
    </text>
    {new Array(8).fill(0).map((_, k) => {
      const f = (t * 0.6 + k / 8) % 1;
      return (
        <circle
          key={k}
          cx={-120 + f * 60}
          cy={-100 + k * 28}
          r={11}
          fill={ETANOL}
          opacity={(1 - f) * 0.9}
        />
      );
    })}
    <path
      d="M -210 -120 L -210 -230 L 210 -230 L 210 -120"
      stroke={corriente > 0.05 ? C.cyan : "#5A5478"}
      strokeWidth={8}
      fill="none"
      strokeDasharray="18 12"
      strokeDashoffset={-t * 120 * corriente}
    />
    <g transform="translate(0 -230)">
      <circle r={70} fill="#F4F2EC" stroke="#5A5E6A" strokeWidth={6} />
      <line
        x1={0}
        y1={0}
        x2={Math.cos(Math.PI * (1.15 + 0.7 * corriente)) * 54}
        y2={Math.sin(Math.PI * (1.15 + 0.7 * corriente)) * 54}
        stroke={C.red}
        strokeWidth={8}
        strokeLinecap="round"
      />
    </g>
  </g>
);

// Alcoholímetro de mano con pantalla
export const Aparato: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s?: number;
  readonly lectura: string;
  readonly alerta?: boolean;
}> = ({ x, y, s = 1, lectura, alerta = false }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect
      x={-110}
      y={-220}
      width={220}
      height={440}
      rx={50}
      fill="#2A2A3A"
      stroke="#6A6A8A"
      strokeWidth={6}
    />
    <rect
      x={-80}
      y={-170}
      width={160}
      height={110}
      rx={12}
      fill={alerta ? "#3A1018" : "#0E1A2A"}
    />
    <text
      x={0}
      y={-98}
      textAnchor="middle"
      fill={alerta ? C.red : C.cyan}
      fontFamily={mono}
      fontSize={48}
      fontWeight={700}
    >
      {lectura}
    </text>
    <rect x={-20} y={-290} width={40} height={80} rx={14} fill="#E8E6F0" />
    <circle cx={0} cy={60} r={36} fill="#4A4A5E" />
  </g>
);

// Rejilla de proporción 1 : 2100 (representativa)
export const Proporcion: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly p: number;
}> = ({ x, y, p }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle cx={-300} cy={0} r={22} fill={ETANOL} />
    <text
      x={-300}
      y={80}
      textAnchor="middle"
      fill={C.white}
      fontFamily={mono}
      fontSize={30}
      fontWeight={700}
    >
      aire: 1
    </text>
    {new Array(Math.round(210 * p)).fill(0).map((_, k) => (
      <circle
        key={k}
        cx={-150 + (k % 21) * 22}
        cy={-110 + Math.floor(k / 21) * 22}
        r={8}
        fill="#E8414F"
      />
    ))}
    <text
      x={70}
      y={160}
      textAnchor="middle"
      fill="#E8414F"
      fontFamily={mono}
      fontSize={30}
      fontWeight={700}
    >
      sangre: 2100
    </text>
  </g>
);

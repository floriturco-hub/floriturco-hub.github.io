import { random } from "remotion";
import { C, mono } from "../theme";

const PIEL = "#F0C8A0";

// Bebé esquemático
export const Bebe: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s?: number;
  readonly t?: number;
  readonly ojos?: number;
}> = ({ x, y, s = 1, t = 0, ojos = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={230} rx={150} ry={130} fill="#8AC8E8" />
    <circle r={170} fill={PIEL} stroke="#C8987A" strokeWidth={6} />
    <path d="M -10 -168 Q 20 -210 40 -180 Q 20 -190 10 -165" fill="#8A5A3A" />
    <circle
      cx={-168}
      cy={10}
      r={30}
      fill={PIEL}
      stroke="#C8987A"
      strokeWidth={5}
    />
    <circle
      cx={168}
      cy={10}
      r={30}
      fill={PIEL}
      stroke="#C8987A"
      strokeWidth={5}
    />
    {ojos > 0.5 ? (
      <g>
        <circle cx={-60} cy={-10} r={18} fill="#2A1A2A" />
        <circle cx={60} cy={-10} r={18} fill="#2A1A2A" />
        <circle cx={-54} cy={-16} r={6} fill="#FFFFFF" />
        <circle cx={66} cy={-16} r={6} fill="#FFFFFF" />
      </g>
    ) : (
      <g stroke="#2A1A2A" strokeWidth={6} fill="none" strokeLinecap="round">
        <path d="M -78 -8 Q -60 4 -42 -8" />
        <path d="M 42 -8 Q 60 4 78 -8" />
      </g>
    )}
    <circle cx={-100} cy={50} r={26} fill="#F0A0A0" opacity={0.5} />
    <circle cx={100} cy={50} r={26} fill="#F0A0A0" opacity={0.5} />
    <path
      d={`M -40 70 Q 0 ${105 + Math.sin(t * 3) * 6} 40 70`}
      stroke="#8A3A3A"
      strokeWidth={8}
      fill="none"
      strokeLinecap="round"
    />
  </g>
);

// Cerebro de perfil con el hipocampo resaltado
export const Cerebro: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s?: number;
  readonly hipo?: number;
  readonly obras?: number;
  readonly t?: number;
}> = ({ x, y, s = 1, hipo = 0, obras = 0, t = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path
      d="M -300 40 C -330 -120 -200 -250 -20 -250 C 160 -260 320 -160 310 0 C 305 110 220 170 120 160 C 60 200 -40 190 -90 150 C -200 170 -290 130 -300 40 Z"
      fill="#E8A0B8"
      stroke="#C86A8A"
      strokeWidth={8}
    />
    <path
      d="M -220 -60 Q -150 -140 -60 -90 M -40 -190 Q 20 -120 100 -180 M 120 -80 Q 200 -120 250 -40 M -200 60 Q -120 10 -40 60 M 40 40 Q 120 -10 200 60"
      stroke="#C86A8A"
      strokeWidth={7}
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M 90 160 Q 120 230 100 300"
      stroke="#C86A8A"
      strokeWidth={36}
      fill="none"
      strokeLinecap="round"
    />
    {hipo > 0 ? (
      <g opacity={hipo}>
        <path
          d="M -40 60 C -10 20 50 20 70 60 C 90 100 60 130 30 110 C 10 95 20 80 40 85"
          stroke={C.yellow}
          strokeWidth={16}
          fill="none"
          strokeLinecap="round"
        />
        <circle
          cx={15}
          cy={70}
          r={90 + 8 * Math.sin(t * 4)}
          fill={C.yellow}
          opacity={0.12}
        />
      </g>
    ) : null}
    {obras > 0 ? (
      <g opacity={obras}>
        {[-170, 170].map((dx, k) => (
          <g key={k} transform={`translate(${dx} 230)`}>
            <path d="M -40 60 L 0 -50 L 40 60 Z" fill={C.orange} />
            <rect x={-30} y={0} width={60} height={14} fill="#FFFFFF" />
            <rect
              x={-50}
              y={56}
              width={100}
              height={14}
              rx={4}
              fill="#5A3A1A"
            />
          </g>
        ))}
        <path
          d="M -150 -300 Q 0 -360 150 -300 L 150 -280 L -150 -280 Z"
          fill={C.yellow}
          stroke="#A07818"
          strokeWidth={5}
        />
      </g>
    ) : null}
  </g>
);

// Línea de edad con recuerdos
export const Linea: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly p: number;
  readonly marca: number;
}> = ({ x, y, w, p, marca }) => (
  <g>
    <line x1={x} y1={y} x2={x + w} y2={y} stroke={C.white} strokeWidth={6} />
    {new Array(11).fill(0).map((_, k) => (
      <g key={k}>
        <line
          x1={x + (k / 10) * w}
          y1={y - 14}
          x2={x + (k / 10) * w}
          y2={y + 14}
          stroke={C.white}
          strokeWidth={4}
        />
        {k % 2 === 0 || k === 3 ? (
          <text
            x={x + (k / 10) * w}
            y={y + 56}
            textAnchor="middle"
            fill={k === 3 ? C.yellow : C.grey}
            fontFamily={mono}
            fontSize={30}
            fontWeight={700}
          >
            {k}
          </text>
        ) : null}
      </g>
    ))}
    <text
      x={x + w}
      y={y + 100}
      textAnchor="end"
      fill={C.grey}
      fontFamily={mono}
      fontSize={26}
    >
      años
    </text>
    <rect
      x={x}
      y={y - 260}
      width={(3 / 10) * w}
      height={240}
      fill={C.red}
      opacity={0.12 * marca}
    />
    <text
      x={x + (1.5 / 10) * w}
      y={y - 280}
      textAnchor="middle"
      fill={C.red}
      fontFamily={mono}
      fontSize={30}
      fontWeight={700}
      opacity={marca}
    >
      vacío
    </text>
    {new Array(24).fill(0).map((_, k) => {
      const edad = 3 + random(`le${k}`) * 7;
      if (edad / 10 > p) {
        return null;
      }
      return (
        <circle
          key={k}
          cx={x + (edad / 10) * w}
          cy={y - 40 - random(`lh${k}`) * 200}
          r={12}
          fill={C.yellow}
          opacity={0.85}
        />
      );
    })}
  </g>
);

// Red de neuronas: un recuerdo es un camino iluminado; las neuronas nuevas lo rompen
const NODOS: [number, number][] = new Array(26)
  .fill(0)
  .map((_, k) => [
    (random(`nx${k}`) - 0.5) * 760,
    (random(`ny${k}`) - 0.5) * 620,
  ]);
const RECUERDO = [2, 7, 11, 4, 19, 15, 22];
export const Red: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly t: number;
  readonly recuerdo: number;
  readonly nuevas: number;
  readonly roto: number;
}> = ({ x, y, t, recuerdo, nuevas, roto }) => {
  const nuevasN = Math.round(nuevas * 14);
  return (
    <g transform={`translate(${x} ${y})`}>
      {NODOS.map(([ax, ay], i) =>
        NODOS.slice(i + 1).map(([bx, by], j) => {
          const d = Math.hypot(ax - bx, ay - by);
          return d < 230 ? (
            <line
              key={`${i}-${j}`}
              x1={ax}
              y1={ay}
              x2={bx}
              y2={by}
              stroke="#5A5478"
              strokeWidth={3}
            />
          ) : null;
        }),
      )}
      {RECUERDO.slice(0, -1).map((a, k) => {
        const [ax, ay] = NODOS[a];
        const [bx, by] = NODOS[RECUERDO[k + 1]];
        const roto_k = roto > 0 && k % 2 === 1;
        return (
          <line
            key={`r${k}`}
            x1={ax}
            y1={ay}
            x2={roto_k ? ax + (bx - ax) * (1 - 0.6 * roto) : bx}
            y2={roto_k ? ay + (by - ay) * (1 - 0.6 * roto) : by}
            stroke={C.yellow}
            strokeWidth={9}
            opacity={recuerdo * (1 - 0.55 * roto)}
            strokeLinecap="round"
          />
        );
      })}
      {NODOS.map(([nx, ny], k) => (
        <circle
          key={k}
          cx={nx}
          cy={ny}
          r={16}
          fill={RECUERDO.includes(k) && recuerdo > 0.5 ? C.yellow : "#8A82B8"}
          opacity={RECUERDO.includes(k) ? 1 - 0.4 * roto : 1}
        />
      ))}
      {new Array(nuevasN).fill(0).map((_, k) => {
        const nx = (random(`qx${k}`) - 0.5) * 720;
        const ny = (random(`qy${k}`) - 0.5) * 580;
        const [cx, cy] = NODOS[Math.floor(random(`qc${k}`) * NODOS.length)];
        const pop = 1 + 0.25 * Math.sin(t * 8 + k);
        return (
          <g key={`n${k}`}>
            <line
              x1={nx}
              y1={ny}
              x2={cx}
              y2={cy}
              stroke={C.cyan}
              strokeWidth={4}
              opacity={0.8}
            />
            <circle cx={nx} cy={ny} r={14 * pop} fill={C.cyan} />
          </g>
        );
      })}
    </g>
  );
};

// Foto tipo polaroid con un bebé
export const Foto: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly rot: number;
  readonly op: number;
}> = ({ x, y, rot, op }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`} opacity={op}>
    <rect x={-130} y={-150} width={260} height={300} rx={8} fill="#F4ECDC" />
    <rect x={-110} y={-130} width={220} height={210} fill="#5A6A8A" />
    <Bebe x={0} y={-40} s={0.32} />
  </g>
);

// Llave
export const Llave: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s?: number;
  readonly op: number;
  readonly rot?: number;
}> = ({ x, y, s = 1, op, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={op}>
    <circle
      cx={-90}
      cy={0}
      r={56}
      fill="none"
      stroke={C.yellow}
      strokeWidth={22}
    />
    <rect x={-40} y={-12} width={190} height={24} rx={8} fill={C.yellow} />
    <rect x={110} y={12} width={18} height={40} fill={C.yellow} />
    <rect x={70} y={12} width={18} height={28} fill={C.yellow} />
  </g>
);

// Ratón de laboratorio
export const Raton: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s?: number;
  readonly op: number;
}> = ({ x, y, s = 1, op }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={op}>
    <path
      d="M 120 20 Q 220 60 260 -10"
      stroke="#E8A0B8"
      strokeWidth={8}
      fill="none"
      strokeLinecap="round"
    />
    <ellipse cx={0} cy={0} rx={140} ry={80} fill="#D8D4E0" />
    <circle cx={-140} cy={-30} r={60} fill="#D8D4E0" />
    <circle cx={-150} cy={-90} r={30} fill="#E8A0B8" />
    <circle cx={-170} cy={-36} r={9} fill={C.bg} />
    <circle cx={-198} cy={-20} r={10} fill="#E8A0B8" />
  </g>
);

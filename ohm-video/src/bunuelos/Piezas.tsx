import { interpolateColors, random } from "remotion";
import { C, mono } from "../theme";

export const ACEITE = "#E8B030";
export const CRUDO = "#F2E2B8";
export const DORADO = "#D8902E";
const colorMasa = (c: number) =>
  interpolateColors(c, [0, 0.6, 1], [CRUDO, "#E8B860", DORADO]);

// Buñuelo: bola con dos mitades (A y B) que se cocinan por separado. rot gira la bola entera.
export const Bunuelo: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly r: number;
  readonly rot: number;
  readonly a: number; // cocción mitad A (empieza abajo)
  readonly b: number; // cocción mitad B (empieza arriba)
  readonly t: number;
  readonly vapor?: number;
  readonly id: string;
  readonly grieta?: number;
}> = ({ x, y, r, rot, a, b, t, vapor = 0, id, grieta = 0 }) => (
  <g transform={`translate(${x} ${y})`}>
    <g transform={`rotate(${rot})`}>
      <defs>
        <clipPath id={`bola-${id}`}>
          <circle r={r} />
        </clipPath>
      </defs>
      <g clipPath={`url(#bola-${id})`}>
        <rect x={-r} y={0} width={2 * r} height={r} fill={colorMasa(a)} />
        <rect x={-r} y={-r} width={2 * r} height={r} fill={colorMasa(b)} />
        {[
          [a, 1],
          [b, -1],
        ].map(([c, lado]) =>
          new Array(14).fill(0).map((_, k) => {
            const px = (random(`${id}px${k}${lado}`) - 0.5) * 1.7 * r;
            const py = lado * (0.15 + random(`${id}py${k}${lado}`) * 0.75) * r;
            return (
              <circle
                key={`${lado}${k}`}
                cx={px}
                cy={py}
                r={r * (0.04 + 0.05 * random(`${id}pr${k}`)) * c}
                fill="#8A5418"
                opacity={0.75 * c}
              />
            );
          }),
        )}
      </g>
      <circle
        r={r}
        fill="none"
        stroke={interpolateColors(
          Math.max(a, b),
          [0, 1],
          ["#C8B088", "#8A5418"],
        )}
        strokeWidth={r * 0.06}
      />
      {grieta > 0 ? (
        <path
          d={`M ${-r * 0.1} ${-r} L ${r * 0.05} ${-r * 0.6} L ${-r * 0.12} ${-r * 0.3} L ${r * 0.1} ${-r * 0.05}`}
          stroke="#5A3410"
          strokeWidth={r * 0.08}
          fill="none"
          opacity={grieta}
          strokeLinecap="round"
        />
      ) : null}
    </g>
    {vapor > 0
      ? new Array(8).fill(0).map((_, k) => {
          const f = (t * 0.9 + k / 8) % 1;
          const ang = (random(`${id}va${k}`) - 0.5) * 1.6;
          const d = r * (0.95 + f * 0.9);
          return (
            <circle
              key={`v${k}`}
              cx={Math.sin(ang) * d}
              cy={-Math.abs(Math.cos(ang)) * d * 0.3 - f * r * 0.9 + r * 0.6}
              r={r * 0.07 * (1 + f)}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth={4}
              opacity={vapor * (1 - f)}
            />
          );
        })
      : null}
  </g>
);

// Paila con aceite (vista en corte)
export const Paila: React.FC<{
  readonly y: number;
  readonly t: number;
  readonly nivel?: number;
  readonly burbujas?: number;
  readonly calor?: number;
  readonly fondo?: number;
}> = ({ y, t, nivel = 0, burbujas = 1, calor = 0, fondo = 600 }) => {
  const sup = y + nivel;
  const f = fondo;
  return (
    <g>
      <path
        d={`M 60 ${y - 60} L 110 ${y + f - 40} Q 120 ${y + f} 160 ${y + f} L 920 ${y + f} Q 960 ${y + f} 970 ${y + f - 40} L 1020 ${y - 60}`}
        fill="#2A2350"
        stroke="#8C88A8"
        strokeWidth={10}
      />
      <path
        d={`M 78 ${sup} L 112 ${y + f - 48} Q 122 ${y + f - 12} 160 ${y + f - 12} L 920 ${y + f - 12} Q 958 ${y + f - 12} 968 ${y + f - 48} L 1002 ${sup} Z`}
        fill={interpolateColors(calor, [0, 1], [ACEITE, "#E87030"])}
        opacity={0.88}
      />
      <path
        d={`M 78 ${sup} ${new Array(12)
          .fill(0)
          .map(
            (_, k) =>
              `Q ${120 + k * 77} ${sup + Math.sin(t * 4 + k) * 7} ${155 + k * 77} ${sup}`,
          )
          .join(" ")}`}
        stroke={ACEITE}
        strokeWidth={5}
        fill="none"
      />
      {new Array(14).fill(0).map((_, k) => {
        const g = (t * 0.7 + random(`ab${k}`)) % 1;
        const px = 160 + random(`ax${k}`) * 760;
        return (
          <circle
            key={k}
            cx={px}
            cy={y + fondo - 40 - g * (fondo - 40 - nivel)}
            r={5 + 5 * random(`ar${k}`)}
            fill="none"
            stroke="#FFF2C8"
            strokeWidth={3}
            opacity={burbujas * 0.7 * Math.sin(g * Math.PI)}
          />
        );
      })}
      {calor > 0
        ? new Array(5)
            .fill(0)
            .map((_, k) => (
              <path
                key={`f${k}`}
                d={`M ${200 + k * 170} ${y + f + 80} q 20 -30 0 -60 q -20 -30 0 -60`}
                stroke={C.orange}
                strokeWidth={10}
                fill="none"
                opacity={calor * (0.6 + 0.4 * Math.sin(t * 8 + k))}
                strokeLinecap="round"
              />
            ))
        : null}
    </g>
  );
};

// Flechas de fuerzas: empuje (desde el centro) y peso (desde el centro de gravedad)
export const Fuerzas: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly r: number;
  readonly cg: number;
  readonly op: number;
  readonly etiquetas?: boolean;
}> = ({ x, y, r, cg, op, etiquetas = true }) => (
  <g transform={`translate(${x} ${y})`} opacity={op}>
    <line x1={0} y1={0} x2={0} y2={-r * 1.6} stroke={C.cyan} strokeWidth={12} />
    <path
      d={`M -26 ${-r * 1.6 + 30} L 0 ${-r * 1.6 - 6} L 26 ${-r * 1.6 + 30}`}
      fill={C.cyan}
    />
    <circle r={16} fill={C.cyan} />
    <line
      x1={34}
      y1={cg}
      x2={34}
      y2={cg + r * 1.5}
      stroke={C.red}
      strokeWidth={12}
    />
    <path
      d={`M 8 ${cg + r * 1.5 - 30} L 34 ${cg + r * 1.5 + 6} L 60 ${cg + r * 1.5 - 30}`}
      fill={C.red}
    />
    <circle cx={34} cy={cg} r={16} fill={C.red} />
    {etiquetas ? (
      <g fontFamily={mono} fontWeight={700} fontSize={32}>
        <text x={-40} y={-r * 1.6 - 20} textAnchor="end" fill={C.cyan}>
          empuje
        </text>
        <text x={80} y={cg + r * 1.5} fill={C.red}>
          peso
        </text>
      </g>
    ) : null}
  </g>
);

// Barco con la carga en el techo
export const Barco: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s?: number;
  readonly rot: number;
  readonly t: number;
}> = ({ x, y, s = 1, rot, t }) => (
  <g>
    <path
      d={`M 80 ${y + 40} ${new Array(10)
        .fill(0)
        .map(
          (_, k) =>
            `Q ${125 + k * 90} ${y + 40 + Math.sin(t * 3 + k) * 12} ${170 + k * 90} ${y + 40}`,
        )
        .join(" ")} L 1000 ${y + 260} L 80 ${y + 260} Z`}
      fill="#1E4A7A"
      opacity={0.7}
    />
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <path
        d="M -200 0 L 200 0 L 150 90 L -150 90 Z"
        fill="#8A5A32"
        stroke="#C89A6A"
        strokeWidth={6}
      />
      <rect
        x={-70}
        y={-90}
        width={140}
        height={90}
        fill="#E8E6F0"
        stroke="#8C88A8"
        strokeWidth={5}
      />
      {[0, 1, 2].map((k) => (
        <rect
          key={k}
          x={-120 + k * 80}
          y={-200}
          width={76}
          height={110}
          rx={6}
          fill={C.red}
          stroke="#8A2030"
          strokeWidth={5}
        />
      ))}
    </g>
  </g>
);

// Termómetro de aceite
export const Termometro: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly nivel: number;
  readonly op: number;
}> = ({ x, y, nivel, op }) => (
  <g transform={`translate(${x} ${y})`} opacity={op}>
    <rect
      x={-22}
      y={0}
      width={44}
      height={360}
      rx={22}
      fill={C.card}
      stroke={C.white}
      strokeWidth={5}
    />
    <rect
      x={-12}
      y={350 - 330 * nivel}
      width={24}
      height={330 * nivel}
      rx={12}
      fill={nivel > 0.75 ? C.red : C.orange}
    />
    <circle
      cx={0}
      cy={380}
      r={42}
      fill={nivel > 0.75 ? C.red : C.orange}
      stroke={C.white}
      strokeWidth={5}
    />
  </g>
);

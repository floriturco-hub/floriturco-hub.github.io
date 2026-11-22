import { interpolate } from "remotion";
import { C, clamp, H, mono, useT, W } from "../theme";
import { T } from "./tiempos";

const Persona: React.FC<{ readonly x: number; readonly y: number; readonly color: string }> = ({ x, y, color }) => (
  <g>
    <circle cx={x} cy={y - 50} r={26} fill={color} />
    <path d={`M ${x - 40} ${y + 50} Q ${x - 40} ${y - 15} ${x} ${y - 15} Q ${x + 40} ${y - 15} ${x + 40} ${y + 50} Z`} fill={color} />
  </g>
);

// Dato (iconos repetidos, como en la referencia) y cuándo consultar
const AVISOS = [
  { texto: "Fuerte", t: 52.5 },
  { texto: "Persistente", t: 53.14 },
  { texto: "En un solo oído", t: 54.12 },
];

export const Dato: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const destaca = interpolate(t, [T.dato + 0.8, T.dato + 1.3], [0, 1], clamp);
  const lista = interpolate(t, [T.especialista - 0.2, T.especialista + 0.3], [0, 1], clamp);
  return (
    <svg width={W} height={H} style={{ position: "absolute" }}>
      <rect x={60} y={300} width={960} height={560} rx={24} fill={C.card} stroke={C.cardBorder} strokeWidth={2} />
      <text x={540} y={420} textAnchor="middle" fill={C.yellow} fontFamily={mono} fontSize={72} fontWeight={700} opacity={destaca}>
        1 de cada 10
      </text>
      {new Array(10).fill(0).map((_, k) => {
        const x = 180 + (k % 5) * 180;
        const y = 560 + Math.floor(k / 5) * 190;
        const aparece = interpolate(t, [T.dato + k * 0.06, T.dato + k * 0.06 + 0.3], [0, 1], clamp);
        return (
          <g key={k} opacity={aparece}>
            <Persona x={x} y={y} color={k === 0 && destaca > 0.5 ? C.yellow : "#3A3360"} />
          </g>
        );
      })}
      {lista > 0 ? (
        <g opacity={lista}>
          <rect x={60} y={960} width={960} height={480} rx={24} fill={C.card} stroke={C.cardBorder} strokeWidth={2} />
          <text x={110} y={1030} fill={C.grey} fontFamily={mono} fontSize={30}>consulta si es</text>
          {AVISOS.map((a, k) => {
            const on = interpolate(t, [a.t, a.t + 0.3], [0.25, 1], clamp);
            const y = 1120 + k * 110;
            return (
              <g key={k} opacity={on}>
                <circle cx={135} cy={y} r={28} fill={on > 0.5 ? C.yellow : C.grey} />
                <text x={135} y={y + 11} textAnchor="middle" fill={C.bg} fontFamily={mono} fontSize={30} fontWeight={700}>{k + 1}</text>
                <text x={190} y={y + 17} fill={C.white} fontFamily={mono} fontSize={50} fontWeight={700}>{a.texto}</text>
              </g>
            );
          })}
        </g>
      ) : null}
    </svg>
  );
};

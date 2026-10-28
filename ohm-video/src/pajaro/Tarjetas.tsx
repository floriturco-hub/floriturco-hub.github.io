import { Easing, interpolate } from "remotion";
import { C, clamp, mono, useT } from "../theme";
import { T } from "./tiempos";

const Punto: React.FC<{ readonly x: number; readonly v: string; readonly color: string; readonly o: number }> = ({ x, v, color, o }) => (
  <g opacity={o}>
    <circle cx={x} cy={330} r={22} fill={color} />
    <text x={x} y={410} textAnchor="middle" fill={color} fontFamily={mono} fontSize={38} fontWeight={700}>{v}</text>
  </g>
);

// Tarjetas superiores (espacio de pantalla) que acompañan a la escena del tendido
export const Tarjetas: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const suave = { ...clamp, easing: Easing.inOut(Easing.cubic) };

  // 1) Diferencia de voltaje: un punto solo no hace nada; dos a distinto voltaje, sí
  const t1 = interpolate(t, [T.voltaje - 0.2, T.voltaje + 0.3, T.patas - 0.4, T.patas], [0, 1, 1, 0], clamp);
  const segundo = interpolate(t, [T.diferencia - 0.1, T.diferencia + 0.4], [0, 1], clamp);
  const flecha = interpolate(t, [T.empuja - 0.2, T.empuja + 0.6], [0, 1], suave);

  // 2) Diferencia entre las patas
  const t2 = interpolate(t, [T.milesimas, T.milesimas + 0.4, T.facil - 0.4, T.facil], [0, 1, 1, 0], clamp);

  // 3) Qué conduce mejor
  const t3 = interpolate(t, [T.millones - 0.3, T.millones + 0.2, T.peligro - 0.4, T.peligro], [0, 1, 1, 0], clamp);
  const barra = interpolate(t, [T.millones, T.millones + 0.8], [0, 1], suave);

  // 4) Peligro: diferencia de miles de voltios
  const t4 = interpolate(t, [T.atraviesa - 0.2, T.atraviesa + 0.2, T.aguilas - 0.4, T.aguilas], [0, 1, 1, 0], clamp);

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      {t1 > 0 ? (
        <g opacity={t1}>
          <rect x={60} y={150} width={960} height={320} rx={24} fill={C.card} stroke={C.cardBorder} strokeWidth={2} />
          <text x={110} y={215} fill={C.grey} fontFamily={mono} fontSize={30}>diferencia de voltaje</text>
          <Punto x={220} v="10.000 V" color={C.yellow} o={1} />
          <Punto x={860} v="0 V" color={C.white} o={segundo} />
          {flecha > 0 ? (
            <g opacity={flecha}>
              <line x1={260} y1={330} x2={260 + 520 * flecha} y2={330} stroke={C.cyan} strokeWidth={12 * flecha + 2} strokeLinecap="round" />
              <polyline points={`${240 + 520 * flecha},305 ${270 + 520 * flecha},330 ${240 + 520 * flecha},355`} fill="none" stroke={C.cyan} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
              <text x={540} y={300} textAnchor="middle" fill={C.cyan} fontFamily={mono} fontSize={32} fontWeight={700}>corriente</text>
            </g>
          ) : null}
        </g>
      ) : null}
      {t2 > 0 ? (
        <g opacity={t2}>
          <rect x={60} y={150} width={960} height={250} rx={24} fill={C.card} stroke={C.cardBorder} strokeWidth={2} />
          <text x={110} y={215} fill={C.grey} fontFamily={mono} fontSize={30}>diferencia entre las patas</text>
          <text x={110} y={330} fill={C.cyan} fontFamily={mono} fontSize={88} fontWeight={700}>
            0,002 V
          </text>
        </g>
      ) : null}
      {t3 > 0 ? (
        <g opacity={t3}>
          <rect x={60} y={150} width={960} height={330} rx={24} fill={C.card} stroke={C.cardBorder} strokeWidth={2} />
          <text x={110} y={215} fill={C.grey} fontFamily={mono} fontSize={30}>facilidad para conducir</text>
          <text x={110} y={300} fill={C.cyan} fontFamily={mono} fontSize={40} fontWeight={700}>cable</text>
          <rect x={330} y={268} width={630 * barra} height={44} rx={22} fill={C.cyan} />
          <text x={110} y={410} fill="#3FA8B8" fontFamily={mono} fontSize={40} fontWeight={700}>pájaro</text>
          <rect x={330} y={378} width={6} height={44} rx={3} fill="#3FA8B8" />
          <text x={360} y={410} fill={C.grey} fontFamily={mono} fontSize={30} opacity={barra}>millones de veces menos</text>
        </g>
      ) : null}
      {t4 > 0 ? (
        <g opacity={t4}>
          <rect x={60} y={150} width={960} height={250} rx={24} fill={C.card} stroke={C.red} strokeWidth={3} />
          <text x={110} y={215} fill={C.grey} fontFamily={mono} fontSize={30}>diferencia entre las alas</text>
          <text x={110} y={330} fill={C.red} fontFamily={mono} fontSize={80} fontWeight={700}>
            miles de V
          </text>
        </g>
      ) : null}
    </svg>
  );
};

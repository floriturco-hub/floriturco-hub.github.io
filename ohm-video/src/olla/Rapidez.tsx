import { Easing, interpolate } from "remotion";
import { C, clamp, H, mono, useT, W } from "../theme";

// 20 °C más ≈ reacciones de cocción unas 3 veces más rápidas
const FILAS = [
  { titulo: "a 100 °C", minutos: 90, color: C.white, t: 24.0 },
  { titulo: "a 120 °C", minutos: 30, color: C.yellow, t: 25.0 },
];

export const Rapidez: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const zoom = interpolate(t, [23.6, 28.3], [1, 1.04]);
  return (
    <svg width={W} height={H} style={{ position: "absolute" }}>
      <g transform={`translate(${540 - 540 * zoom} ${960 - 960 * zoom}) scale(${zoom})`}>
        <rect x={60} y={560} width={960} height={720} rx={24} fill={C.card} stroke={C.cardBorder} strokeWidth={2} />
        <text x={110} y={640} fill={C.grey} fontFamily={mono} fontSize={30}>tiempo para ablandar</text>
        {FILAS.map((f, k) => {
          const p = interpolate(t, [f.t, f.t + 1.0], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
          const y = 760 + k * 230;
          const largo = (840 * f.minutos) / 90;
          return (
            <g key={k} opacity={interpolate(t, [f.t - 0.3, f.t], [0, 1], clamp)}>
              <text x={110} y={y} fill={f.color} fontFamily={mono} fontSize={48} fontWeight={700}>{f.titulo}</text>
              <rect x={110} y={y + 30} width={840} height={70} rx={35} fill="rgba(255,255,255,0.06)" />
              <rect x={110} y={y + 30} width={Math.max(70, largo * p)} height={70} rx={35} fill={f.color} />
              <text x={950} y={y} textAnchor="end" fill={C.white} fontFamily={mono} fontSize={44} fontWeight={700} opacity={p}>
                {Math.round(f.minutos * p)} min
              </text>
            </g>
          );
        })}
        <text x={110} y={1240} fill={C.grey} fontFamily={mono} fontSize={24}>valores aproximados (legumbres)</text>
      </g>
    </svg>
  );
};

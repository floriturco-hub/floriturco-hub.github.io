import { Easing, interpolate } from "remotion";
import { C, clamp, H, mono, useT, W } from "../theme";
import { T } from "./tiempos";

const METAL = "#8C88A8";
const CAJA = { x: 110, y: 700, w: 860, h: 600 };
const VENTANA = { x: 170, y: 760, w: 520, h: 480 };

// Cuenco con comida sobre el plato giratorio (vista frontal)
export const Cuenco: React.FC<{ readonly x: number; readonly y: number; readonly calor: number; readonly t: number }> = ({ x, y, calor, t }) => (
  <g>
    <ellipse cx={x} cy={y + 46} rx={200} ry={20} fill="#2A2350" />
    <path d={`M ${x - 130} ${y - 30} Q ${x - 120} ${y + 40} ${x} ${y + 40} Q ${x + 120} ${y + 40} ${x + 130} ${y - 30} Z`} fill="#3A3360" stroke={METAL} strokeWidth={6} />
    <ellipse cx={x} cy={y - 30} rx={130} ry={18} fill={calor > 0.5 ? "#C0603C" : "#7A4E3A"} />
    {calor > 0
      ? [0, 1, 2].map((i) => {
          const p = (t * 0.6 + i / 3) % 1;
          return (
            <path
              key={i}
              d={`M ${x - 50 + i * 50} ${y - 50 - p * 120} q 14 -20 0 -40 q -14 -20 0 -40`}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth={6}
              strokeLinecap="round"
              opacity={0.5 * calor * (1 - p)}
            />
          );
        })
      : null}
  </g>
);

// Vista frontal del microondas: gancho y cierre
export const Microondas: React.FC<{ readonly t0: number; readonly fase: "intro" | "final" }> = ({ t0, fase }) => {
  const t = useT(t0);
  const intro = fase === "intro";
  const zoom = intro
    ? interpolate(t, [0, T.magnetron - 0.6, T.magnetron + 0.2], [1, 1.05, 1.6], { ...clamp, easing: Easing.in(Easing.cubic) })
    : interpolate(t, [t0, t0 + 1, T.fin], [1.4, 1.05, 1.02], { ...clamp, easing: Easing.out(Easing.cubic) });
  const segundos = Math.max(0, Math.ceil(30 - (t - t0)));
  const ondas = intro ? interpolate(t, [0.5, 1.0], [0, 1], clamp) : 0.5;

  return (
    <svg width={W} height={H} style={{ position: "absolute" }}>
      <defs>
        <clipPath id="ventana">
          <rect x={VENTANA.x} y={VENTANA.y} width={VENTANA.w} height={VENTANA.h} rx={20} />
        </clipPath>
        <pattern id="rejilla" width={16} height={16} patternUnits="userSpaceOnUse">
          <circle cx={8} cy={8} r={3} fill="#000000" opacity={0.35} />
        </pattern>
      </defs>
      <g transform={`translate(${540 - 540 * zoom} ${960 - 1000 * zoom}) scale(${zoom})`}>
        <rect x={CAJA.x} y={CAJA.y} width={CAJA.w} height={CAJA.h} rx={40} fill="#1A1636" stroke={METAL} strokeWidth={14} />
        <rect x={VENTANA.x} y={VENTANA.y} width={VENTANA.w} height={VENTANA.h} rx={20} fill="#2B2448" />
        <g clipPath="url(#ventana)">
          <rect x={VENTANA.x} y={VENTANA.y} width={VENTANA.w} height={VENTANA.h} fill="#FFF1C9" opacity={0.12} />
          <Cuenco x={430} y={1140} calor={intro ? interpolate(t, [2, 4], [0, 1], clamp) : 1} t={t} />
          {/* Ondas que "bombardean" la comida */}
          {new Array(6).fill(0).map((_, i) => {
            const p = (t * 0.7 + i / 6) % 1;
            const y = VENTANA.y + 20 + p * 300;
            let d = `M ${VENTANA.x + 40} ${y}`;
            for (let x = 0; x <= 440; x += 10) {
              d += ` L ${VENTANA.x + 40 + x} ${y + 12 * Math.sin(x / 22 - t * 8)}`;
            }
            return <path key={i} d={d} fill="none" stroke={C.cyan} strokeWidth={5} opacity={0.6 * ondas * Math.sin(p * Math.PI)} />;
          })}
          <rect x={VENTANA.x} y={VENTANA.y} width={VENTANA.w} height={VENTANA.h} fill="url(#rejilla)" />
        </g>
        {/* Panel */}
        <rect x={730} y={760} width={200} height={110} rx={14} fill="#0B091D" stroke={METAL} strokeWidth={4} />
        <text x={830} y={838} textAnchor="middle" fill={C.cyan} fontFamily={mono} fontSize={56} fontWeight={700}>
          0:{String(segundos).padStart(2, "0")}
        </text>
        {new Array(6).fill(0).map((_, i) => (
          <circle key={i} cx={780 + (i % 2) * 100} cy={950 + Math.floor(i / 2) * 90} r={28} fill="#2A2350" stroke={METAL} strokeWidth={4} />
        ))}
        <rect x={730} y={1220} width={200} height={30} rx={10} fill={METAL} />
      </g>
    </svg>
  );
};

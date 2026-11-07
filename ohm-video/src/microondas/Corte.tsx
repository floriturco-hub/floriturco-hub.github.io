import { Easing, interpolate } from "remotion";
import { C, clamp, H, mono, useT, W } from "../theme";
import { Cuenco } from "./Microondas";
import { T } from "./tiempos";

const METAL = "#8C88A8";
// Cavidad metálica (corte lateral) y compartimento del magnetrón a la derecha
const CAV = { x0: 120, x1: 720, y0: 820, y1: 1320 };
const MAG = { x: 790, y: 860, w: 170, h: 200 };
const GUIA = { x0: 620, x1: 875, y0: 740, y1: 790 };
const BOCA = { x: 650, y: CAV.y0 };

// Rayo que rebota dentro de la caja: devuelve la polilínea recorrida hasta una longitud dada
const rayo = (angulo: number, longitud: number) => {
  let x = BOCA.x;
  let y = BOCA.y + 2;
  let dx = Math.cos(angulo);
  let dy = Math.sin(angulo);
  const pts: [number, number][] = [[x, y]];
  let resto = longitud;
  for (let k = 0; k < 40 && resto > 0; k++) {
    const tx = dx > 0 ? (CAV.x1 - 10 - x) / dx : (CAV.x0 + 10 - x) / dx;
    const ty = dy > 0 ? (CAV.y1 - 10 - y) / dy : (CAV.y0 + 10 - y) / dy;
    const paso = Math.min(tx, ty, resto);
    x += dx * paso;
    y += dy * paso;
    resto -= paso;
    pts.push([x, y]);
    if (paso === tx) {
      dx = -dx;
    } else if (paso === ty) {
      dy = -dy;
    }
  }
  return pts;
};

const Onda: React.FC<{ readonly x0: number; readonly x1: number; readonly y: number; readonly amp: number; readonly lambda: number; readonly fase: number; readonly color: string; readonly ancho?: number }> = ({
  x0,
  x1,
  y,
  amp,
  lambda,
  fase,
  color,
  ancho = 5,
}) => {
  let d = `M ${x0} ${y}`;
  const paso = x1 > x0 ? 4 : -4;
  for (let x = x0; paso > 0 ? x <= x1 : x >= x1; x += paso) {
    d += ` L ${x} ${y + amp * Math.sin(((x - x0) / lambda) * Math.PI * 2 - fase)}`;
  }
  return <path d={d} fill="none" stroke={color} strokeWidth={ancho} strokeLinecap="round" />;
};

export const Corte: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const suave = { ...clamp, easing: Easing.inOut(Easing.cubic) };
  const corriente = interpolate(t, [T.electricidad, T.electricidad + 0.4], [0, 1], clamp);
  const emite = interpolate(t, [T.electricidad + 0.6, T.electricidad + 1.2], [0, 1], clamp);
  const tarjeta = interpolate(t, [T.ondas12, T.ondas12 + 0.4, T.guia - 0.3, T.guia], [0, 1, 1, 0], clamp);
  const rebotes = interpolate(t, [T.guia + 0.6, T.agua - 0.2], [0, 2600], clamp);
  const hz = Math.floor(interpolate(t, [T.millones, T.millones + 1.6], [0, 2_450_000_000], { ...clamp, easing: Easing.out(Easing.cubic) }));

  // Cámara: magnetrón → caja entera → cuenco
  const alMag = interpolate(t, [T.magnetron - 0.2, T.magnetron + 0.8, T.guia - 0.4, T.guia + 0.5], [0.6, 1, 1, 0], suave);
  const alCuenco = interpolate(t, [T.agua - 0.6, T.agua + 0.3], [0, 1], suave);
  const zoom = 1 + 0.5 * alMag + 1.6 * alCuenco;
  const cx = 540 + (MAG.x + 40 - 540) * alMag + (430 - 540) * alCuenco;
  const cy = 1060 + (900 - 1060) * alMag + (1230 - 1060) * alCuenco;

  return (
    <svg width={W} height={H} style={{ position: "absolute" }}>
      <defs>
        <filter id="brillo-mo" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g transform={`translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`}>
        {/* Carcasa */}
        <rect x={90} y={700} width={900} height={650} rx={40} fill="#15112E" stroke={METAL} strokeWidth={10} opacity={0.6} />
        {/* Cavidad metálica */}
        <rect x={CAV.x0} y={CAV.y0} width={CAV.x1 - CAV.x0} height={CAV.y1 - CAV.y0} fill="#1A1636" stroke={METAL} strokeWidth={14} />
        <Cuenco x={430} y={1230} calor={interpolate(t, [T.guia + 1, T.agua], [0, 0.6], clamp)} t={t} />
        {/* Rebotes */}
        {rebotes > 0
          ? [0.62, 1.15, 2.1].map((a, i) => {
              const pts = rayo(a + Math.PI * 0.0, rebotes - i * 250);
              if (pts.length < 2) {
                return null;
              }
              return (
                <polyline
                  key={i}
                  points={pts.map((p) => p.join(",")).join(" ")}
                  fill="none"
                  stroke={C.yellow}
                  strokeWidth={4}
                  strokeDasharray="20 14"
                  strokeDashoffset={-t * 120}
                  opacity={0.75}
                />
              );
            })
          : null}
        {/* Guía de ondas */}
        <rect x={GUIA.x0} y={GUIA.y0} width={GUIA.x1 - GUIA.x0} height={GUIA.y1 - GUIA.y0} fill="#0F0C24" stroke={METAL} strokeWidth={8} />
        <rect x={BOCA.x - 30} y={GUIA.y1 - 4} width={60} height={CAV.y0 - GUIA.y1 + 8} fill="#0F0C24" stroke={METAL} strokeWidth={8} />
        {emite > 0 ? (
          <g opacity={emite}>
            <Onda x0={GUIA.x1} x1={GUIA.x0 + 10} y={(GUIA.y0 + GUIA.y1) / 2} amp={14} lambda={70} fase={t * 14} color={C.yellow} />
          </g>
        ) : null}
        {/* Magnetrón: cuerpo con aletas y antena */}
        <rect x={MAG.x} y={MAG.y} width={MAG.w} height={MAG.h} rx={20} fill="#2A2350" stroke={METAL} strokeWidth={8} />
        {new Array(6).fill(0).map((_, i) => (
          <line key={i} x1={MAG.x + 20 + i * 26} y1={MAG.y + 20} x2={MAG.x + 20 + i * 26} y2={MAG.y + MAG.h - 20} stroke={METAL} strokeWidth={6} opacity={0.6} />
        ))}
        <rect x={MAG.x + MAG.w / 2 - 10} y={GUIA.y1 - 6} width={20} height={MAG.y - GUIA.y1 + 10} fill={METAL} />
        <circle cx={MAG.x + MAG.w / 2} cy={MAG.y + MAG.h / 2} r={34} fill={emite > 0 ? C.orange : "#3A3360"} opacity={0.5 + 0.5 * emite} filter="url(#brillo-mo)" />
        {/* Cable de corriente */}
        <path d={`M ${MAG.x + MAG.w / 2} ${MAG.y + MAG.h} L ${MAG.x + MAG.w / 2} 1240 L 990 1240`} fill="none" stroke={C.wire} strokeWidth={12} />
        <path
          d={`M 990 1240 L ${MAG.x + MAG.w / 2} 1240 L ${MAG.x + MAG.w / 2} ${MAG.y + MAG.h}`}
          fill="none"
          stroke={C.cyan}
          strokeWidth={5}
          strokeDasharray="20 14"
          strokeDashoffset={-t * 140}
          opacity={corriente}
          filter="url(#brillo-mo)"
        />
      </g>

      {/* Tarjeta: longitud de onda y frecuencia */}
      {tarjeta > 0 ? (
        <g opacity={tarjeta}>
          <rect x={60} y={150} width={960} height={420} rx={24} fill={C.card} stroke={C.cardBorder} strokeWidth={2} />
          <text x={110} y={215} fill={C.grey} fontFamily={mono} fontSize={30}>longitud de onda</text>
          <Onda x0={140} x1={940} y={320} amp={50} lambda={400} fase={t * 3} color={C.yellow} ancho={7} />
          <line x1={140} y1={400} x2={540} y2={400} stroke={C.white} strokeWidth={3} />
          <line x1={140} y1={388} x2={140} y2={412} stroke={C.white} strokeWidth={3} />
          <line x1={540} y1={388} x2={540} y2={412} stroke={C.white} strokeWidth={3} />
          <text x={340} y={450} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={40} fontWeight={700}>~ 12 cm</text>
          {t >= T.millones ? (
            <text x={980} y={530} textAnchor="end" fill={C.cyan} fontFamily={mono} fontSize={40} fontWeight={700}>
              {hz.toLocaleString("es-ES")} /s
            </text>
          ) : null}
        </g>
      ) : null}
    </svg>
  );
};

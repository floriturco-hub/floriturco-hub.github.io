import { Easing, interpolate, interpolateColors, random } from "remotion";
import { C, clamp, H, mono, useT, W } from "../theme";
import { T } from "./tiempos";

const OXIGENO = "#E8414F";
const HIDROGENO = "#E8E6F0";

// Molécula de agua: O (−) con dos H (+) en V a 104,5°. ang = hacia dónde apunta el lado positivo
const Molecula: React.FC<{ readonly x: number; readonly y: number; readonly ang: number; readonly s?: number; readonly cargas?: number }> = ({
  x,
  y,
  ang,
  s = 1,
  cargas = 0,
}) => {
  const d = 34 * s;
  const a1 = ang - (52.25 * Math.PI) / 180;
  const a2 = ang + (52.25 * Math.PI) / 180;
  return (
    <g>
      <circle cx={x + Math.cos(a1) * d} cy={y + Math.sin(a1) * d} r={16 * s} fill={HIDROGENO} />
      <circle cx={x + Math.cos(a2) * d} cy={y + Math.sin(a2) * d} r={16 * s} fill={HIDROGENO} />
      <circle cx={x} cy={y} r={28 * s} fill={OXIGENO} />
      {cargas > 0 ? (
        <g opacity={cargas} fontFamily={mono} fontWeight={700} fontSize={56 * s}>
          <text x={x - Math.cos(ang) * 70 * s} y={y - Math.sin(ang) * 70 * s + 12 * s} textAnchor="middle" fill={OXIGENO}>−</text>
          <text x={x + Math.cos(ang) * 80 * s} y={y + Math.sin(ang) * 80 * s + 12 * s} textAnchor="middle" fill={C.yellow}>+</text>
        </g>
      ) : null}
    </g>
  );
};

const RED = (() => {
  const lista: { x: number; y: number; fase: number; lento: number }[] = [];
  for (let j = 0; j < 9; j++) {
    for (let i = 0; i < 6; i++) {
      lista.push({
        x: 120 + i * 168 + (j % 2) * 84 + (random(`ax${i}-${j}`) - 0.5) * 30,
        y: 720 + j * 150 + (random(`ay${i}-${j}`) - 0.5) * 30,
        fase: random(`af${i}-${j}`) * Math.PI * 2,
        lento: 0.6 + random(`al${i}-${j}`) * 0.6,
      });
    }
  }
  return lista;
})();

export const Agua: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const suave = { ...clamp, easing: Easing.inOut(Easing.cubic) };

  // Campo de la onda: oscila (a cámara muy lenta) desde "el campo de la onda"
  const campoOn = interpolate(t, [T.campo, T.campo + 0.5], [0, 1], clamp);
  const campo = Math.sin((t - T.campo) * Math.PI * 1.6); // −1..1
  const siguen = interpolate(t, [T.girar - 0.3, T.girar + 0.3], [0, 1], clamp);
  const calor = interpolate(t, [T.chocan, T.calor + 1.5], [0, 1], suave);

  // Cámara: primero una molécula grande, luego la red entera
  const unica = interpolate(t, [T.agua, T.campo - 0.6, T.campo + 0.2], [1, 1, 0], suave);
  const zoom = 1 + 1.4 * unica;
  const foco = RED[27];
  const cx = 540 + (foco.x - 540) * unica;
  const cy = 1180 + (foco.y - 1180) * unica;

  return (
    <svg width={W} height={H} style={{ position: "absolute" }}>
      <defs>
        <radialGradient id="tibio" cx="50%" cy="60%" r="70%">
          <stop offset="0" stopColor={C.orange} stopOpacity={0.35} />
          <stop offset="1" stopColor={C.orange} stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect x={0} y={0} width={W} height={H} fill="url(#tibio)" opacity={calor} />
      <g transform={`translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`}>
        {RED.map((m, i) => {
          const termico = m.fase + Math.sin(t * 2 * m.lento + m.fase) * 0.6;
          const objetivo = campo > 0 ? 0 : Math.PI;
          // Siguen al campo con retraso y se pasan; con calor, más agitación
          const giro = termico * (1 - 0.7 * siguen) + siguen * (objetivo * 0.7 + Math.sin(t * 10 + m.fase) * (0.25 + 0.4 * calor));
          const temblor = 4 * calor;
          const destaca = i === 27 ? 1 : 0;
          return (
            <Molecula
              key={i}
              x={m.x + temblor * Math.sin(t * 23 + i)}
              y={m.y + temblor * Math.cos(t * 19 + i)}
              ang={giro}
              cargas={destaca * interpolate(t, [T.positivo, T.positivo + 0.5, T.campo - 0.4, T.campo], [0, 1, 1, 0], clamp)}
            />
          );
        })}
        {/* Choques entre vecinas: destellos */}
        {calor > 0
          ? new Array(14).fill(0).map((_, k) => {
              const p = (t * 1.3 + k / 14) % 1;
              const m = RED[(k * 7 + Math.floor(t * 1.3 + k / 14) * 11) % RED.length];
              return <circle key={k} cx={m.x + 50} cy={m.y} r={10 + 40 * p} fill="none" stroke={interpolateColors(p, [0, 1], [C.yellow, C.orange])} strokeWidth={4} opacity={(1 - p) * calor} />;
            })
          : null}
      </g>

      {/* Indicador del campo eléctrico de la onda */}
      {campoOn > 0 ? (
        <g opacity={campoOn}>
          <rect x={60} y={150} width={960} height={300} rx={24} fill={C.card} stroke={C.cardBorder} strokeWidth={2} />
          <text x={110} y={215} fill={C.grey} fontFamily={mono} fontSize={30}>campo de la onda</text>
          <g transform={`translate(540 330) scale(${campo} 1)`}>
            <line x1={-300} y1={0} x2={280} y2={0} stroke={C.cyan} strokeWidth={14} strokeLinecap="round" />
            <polyline points="240,-50 300,0 240,50" fill="none" stroke={C.cyan} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <text x={980} y={425} textAnchor="end" fill={C.grey} fontFamily={mono} fontSize={26}>
            a cámara lenta · real: 2.450 millones/s
          </text>
        </g>
      ) : null}
    </svg>
  );
};

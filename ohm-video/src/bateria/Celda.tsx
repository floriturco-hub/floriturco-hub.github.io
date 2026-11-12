import { Easing, interpolate, random } from "remotion";
import { C, clamp, H, mono, useT, W } from "../theme";

// Corte de una celda de ion-litio: grafito (−) | electrolito | óxido metálico (+)
const CAJA = { x: 120, y: 820, w: 840, h: 700 };
const ANODO = { x: 160, w: 250 };
const CATODO = { x: 670, w: 250 };
const CAPAS = 12;
const Y_CAPA = (k: number) => CAJA.y + 60 + k * 52;

const N_IONES = 24;
const T_CARGA = 15.06; // "Cargada, el grafito está lleno de iones"
const T_CRUCE_INI = 19.2; // "esos iones cruzan al otro lado"
const T_CRUCE_FIN = 33.6;
const DUR_CRUCE = 1.3;

const IONES = new Array(N_IONES).fill(0).map((_, i) => {
  const fila = i % 12;
  const col = Math.floor(i / 12);
  return {
    x0: ANODO.x + 70 + col * 110,
    y0: Y_CAPA(fila) + 26,
    x1: CATODO.x + 70 + col * 110,
    y1: Y_CAPA((fila * 5) % 12) + 26,
    aparece: T_CARGA + 0.04 * i,
    cruza: T_CRUCE_INI + (T_CRUCE_FIN - T_CRUCE_INI - DUR_CRUCE) * random(`cruce${i}`) ** 0.8,
  };
});

export const fraccionCruzada = (t: number) =>
  IONES.filter((ion) => t >= ion.cruza + DUR_CRUCE / 2).length / N_IONES;

// Circuito exterior: del grafito sube, pasa por la "pantalla" y baja al óxido
const CABLE = `M ${ANODO.x + 125} ${CAJA.y} L ${ANODO.x + 125} 620 L ${CATODO.x + 125} 620 L ${CATODO.x + 125} ${CAJA.y}`;

export const Celda: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const suave = { ...clamp, easing: Easing.inOut(Easing.cubic) };

  // Cámara: general → acerca al grafito al cargarse → general para ver el circuito
  const alGrafito = interpolate(t, [15.0, 15.8, 17.9, 18.8], [0, 1, 1, 0], suave);
  const zoom = interpolate(t, [10.2, 33.9], [1, 1.04]) + 0.45 * alGrafito;
  const cx = 540 + (ANODO.x + ANODO.w / 2 - 540) * alGrafito;
  const cy = 1100 + (CAJA.y + CAJA.h / 2 - 1100) * alGrafito;

  const circuito = interpolate(t, [17.98, 18.6], [0, 1], clamp);
  const corriente = interpolate(t, [20.8, 21.4], [0, 1], clamp);
  const pantalla = interpolate(t, [24.54, 25.0], [0, 1], clamp) * (1 - 0.6 * fraccionCruzada(t));
  const f = fraccionCruzada(t);
  const voltaje = 4.2 - 0.55 * interpolate(t, [T_CRUCE_INI, T_CRUCE_FIN], [0, 1], clamp);
  const tarjeta = interpolate(t, [25.88, 26.3], [0, 1], clamp);

  return (
    <svg width={W} height={H} style={{ position: "absolute" }}>
      <defs>
        <filter id="brillo-celda" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g transform={`translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`}>
        {/* Electrolito */}
        <rect x={CAJA.x} y={CAJA.y} width={CAJA.w} height={CAJA.h} rx={30} fill="rgba(8, 216, 232, 0.05)" stroke={C.wire} strokeWidth={10} />
        <line x1={540} y1={CAJA.y + 20} x2={540} y2={CAJA.y + CAJA.h - 20} stroke={C.white} strokeWidth={4} strokeDasharray="16 14" opacity={0.3} />
        {/* Grafito: capas */}
        <rect x={ANODO.x} y={CAJA.y + 30} width={ANODO.w} height={CAJA.h - 60} rx={12} fill="rgba(90, 86, 117, 0.25)" />
        {new Array(CAPAS).fill(0).map((_, k) => (
          <line key={k} x1={ANODO.x + 10} y1={Y_CAPA(k)} x2={ANODO.x + ANODO.w - 10} y2={Y_CAPA(k)} stroke="#6E6A8C" strokeWidth={8} strokeLinecap="round" />
        ))}
        {/* Óxido metálico: red de bloques */}
        <rect x={CATODO.x} y={CAJA.y + 30} width={CATODO.w} height={CAJA.h - 60} rx={12} fill="rgba(88, 40, 136, 0.25)" />
        {new Array(CAPAS).fill(0).map((_, k) =>
          new Array(5).fill(0).map((__, c) => (
            <rect key={`${k}-${c}`} x={CATODO.x + 14 + c * 46} y={Y_CAPA(k) - 8} width={34} height={16} rx={4} fill={C.purple} stroke={C.purpleLight} strokeWidth={2} />
          )),
        )}
        <text x={ANODO.x + ANODO.w / 2} y={CAJA.y + CAJA.h + 70} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={64} fontWeight={700}>−</text>
        <text x={CATODO.x + CATODO.w / 2} y={CAJA.y + CAJA.h + 70} textAnchor="middle" fill={C.red} fontFamily={mono} fontSize={64} fontWeight={700}>+</text>

        {/* Circuito exterior con la "pantalla" que se enciende */}
        <g opacity={circuito}>
          <path d={CABLE} fill="none" stroke={C.wire} strokeWidth={16} strokeLinejoin="round" />
          <path
            d={CABLE}
            fill="none"
            stroke={C.cyan}
            strokeWidth={6}
            strokeDasharray="22 16"
            strokeDashoffset={-150 * (t - 20.8)}
            opacity={corriente}
            filter="url(#brillo-celda)"
          />
          <rect x={440} y={560} width={200} height={120} rx={16} fill="#0F0C24" stroke={C.white} strokeWidth={6} />
          <rect x={456} y={576} width={168} height={88} rx={8} fill="#FFF1C9" opacity={0.85 * pantalla} />
          {pantalla > 0 ? <rect x={420} y={540} width={240} height={160} rx={30} fill="#FFF1C9" opacity={0.18 * pantalla} filter="url(#brillo-celda)" /> : null}
        </g>

        {/* Iones de litio: aparecen en el grafito y cruzan al óxido */}
        {IONES.map((ion, i) => {
          if (t < ion.aparece) {
            return null;
          }
          const p = interpolate(t, [ion.cruza, ion.cruza + DUR_CRUCE], [0, 1], suave);
          const x = ion.x0 + (ion.x1 - ion.x0) * p;
          const y = ion.y0 + (ion.y1 - ion.y0) * p + Math.sin(p * Math.PI * 3) * 14 * p * (1 - p) * 4;
          const s = interpolate(t, [ion.aparece, ion.aparece + 0.25], [0, 1], clamp);
          return (
            <g key={i}>
              <circle cx={x} cy={y} r={20 * s} fill={C.yellow} />
              <text x={x} y={y + 7} textAnchor="middle" fill={C.bg} fontFamily={mono} fontSize={18} fontWeight={700} opacity={s}>
                Li
              </text>
            </g>
          );
        })}
      </g>

      {/* Tarjeta: voltaje y energía guardada bajan a medida que cruza el litio */}
      <g opacity={tarjeta}>
        <rect x={60} y={150} width={960} height={300} rx={24} fill={C.card} stroke={C.cardBorder} strokeWidth={2} />
        <text x={110} y={215} fill={C.grey} fontFamily={mono} fontSize={30}>voltaje</text>
        <text x={110} y={330} fill={C.yellow} fontFamily={mono} fontSize={96} fontWeight={700}>
          {voltaje.toFixed(2).replace(".", ",")}
          <tspan fill={C.grey} fontSize={48}> V</tspan>
        </text>
        <text x={560} y={215} fill={C.grey} fontFamily={mono} fontSize={30}>energía guardada</text>
        <rect x={560} y={270} width={400} height={60} rx={30} fill="rgba(255,255,255,0.06)" />
        <rect x={560} y={270} width={Math.max(30, 400 * (1 - f))} height={60} rx={30} fill={C.yellow} />
      </g>
    </svg>
  );
};

import { Easing, interpolate, random } from "remotion";
import { C, clamp, H, mono, useT, W } from "../theme";
import { T } from "./tiempos";

// Espectro: lo que oyes por tonos, el hueco de los agudos dañados y el pitido justo ahí
const CARD = { x: 60, y: 420, w: 960, h: 1000 };
const OX = 150;
const OY = 1240;
const ANCHO = 820;
const ALTO = 640;
const BANDAS = 34;
const U_PITIDO = 0.78; // posición (log) de ~6 kHz
const suave = { ...clamp, easing: Easing.inOut(Easing.cubic) };

// Audición sana = 1; hueco entre 0,68 y 0,9
const audicion = (u: number) => {
  const hueco = Math.exp(-(((u - U_PITIDO) / 0.07) ** 2));
  return 0.8 - 0.55 * hueco;
};

export const Espectro: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const tarjeta = interpolate(t, [T.pitido - 0.2, T.pitido + 0.3], [0, 1], clamp);
  const pico = interpolate(t, [T.pitido + 1.8, T.pitido + 2.6], [0, 1], suave);
  const marca = interpolate(t, [T.perdido + 0.6, T.perdido + 1.1], [0, 1], clamp);
  const fondo = interpolate(t, [T.dia, T.dia + 0.5, T.silencio - 0.1, T.silencio + 0.5], [0, 1, 1, 0.08], suave);
  const zoom = interpolate(t, [T.pitido - 0.2, T.dato], [1, 1.04]);
  const f = Math.floor(t * 12);

  const linea: string[] = [];
  for (let k = 0; k <= 100; k++) {
    const u = k / 100;
    linea.push(`${(OX + u * ANCHO).toFixed(1)},${(OY - audicion(u) * ALTO).toFixed(1)}`);
  }

  return (
    <svg width={W} height={H} style={{ position: "absolute" }}>
      <defs>
        <filter id="halo-es" x="-100%" y="-50%" width="300%" height="200%">
          <feGaussianBlur stdDeviation="12" />
        </filter>
      </defs>
      <g opacity={tarjeta} transform={`translate(${540 - 540 * zoom} ${960 - 960 * zoom}) scale(${zoom})`}>
        <rect x={CARD.x} y={CARD.y} width={CARD.w} height={CARD.h} rx={24} fill={C.card} stroke={C.cardBorder} strokeWidth={2} />
        <text x={110} y={CARD.y + 70} fill={C.grey} fontFamily={mono} fontSize={30}>lo que oyes, por tonos</text>
        <line x1={OX} y1={OY} x2={OX + ANCHO} y2={OY} stroke={C.grey} strokeWidth={3} opacity={0.6} />
        <text x={OX} y={OY + 60} fill={C.purpleLight} fontFamily={mono} fontSize={30} fontWeight={700}>graves</text>
        <text x={OX + ANCHO} y={OY + 60} textAnchor="end" fill={C.yellow} fontFamily={mono} fontSize={30} fontWeight={700}>agudos</text>
        {/* Hueco: tonos perdidos */}
        <rect x={OX + (U_PITIDO - 0.11) * ANCHO} y={OY - ALTO} width={0.22 * ANCHO} height={ALTO} fill={C.red} opacity={0.12} />
        <polyline points={linea.join(" ")} fill="none" stroke={C.cyan} strokeWidth={7} strokeLinejoin="round" />
        {/* Ruido de fondo del día: tapa el pitido */}
        {new Array(BANDAS).fill(0).map((_, k) => {
          const u = (k + 0.5) / BANDAS;
          const h = fondo * (0.55 + 0.25 * random(`b${k}-${f}`)) * ALTO;
          return <rect key={k} x={OX + u * ANCHO - 10} y={OY - h} width={20} height={h} rx={6} fill="#5A5675" opacity={0.85} />;
        })}
        {/* El pitido */}
        {pico > 0 ? (
          <g>
            <line x1={OX + U_PITIDO * ANCHO} y1={OY} x2={OX + U_PITIDO * ANCHO} y2={OY - 0.62 * ALTO * pico} stroke={C.yellow} strokeWidth={22} opacity={0.4} filter="url(#halo-es)" />
            <line x1={OX + U_PITIDO * ANCHO} y1={OY} x2={OX + U_PITIDO * ANCHO} y2={OY - 0.62 * ALTO * pico} stroke={C.yellow} strokeWidth={10} strokeLinecap="round" />
            <text x={OX + U_PITIDO * ANCHO} y={OY - 0.62 * ALTO * pico - 30} textAnchor="middle" fill={C.yellow} fontFamily={mono} fontSize={38} fontWeight={700} opacity={pico}>
              pitido
            </text>
          </g>
        ) : null}
        {marca > 0 ? (
          <g opacity={marca}>
            <path d={`M ${OX + (U_PITIDO - 0.11) * ANCHO} ${OY + 90} L ${OX + (U_PITIDO - 0.11) * ANCHO} ${OY + 110} L ${OX + (U_PITIDO + 0.11) * ANCHO} ${OY + 110} L ${OX + (U_PITIDO + 0.11) * ANCHO} ${OY + 90}`} fill="none" stroke={C.red} strokeWidth={4} />
            <text x={OX + U_PITIDO * ANCHO} y={OY + 150} textAnchor="middle" fill={C.red} fontFamily={mono} fontSize={30} fontWeight={700}>tonos perdidos</text>
          </g>
        ) : null}
      </g>
    </svg>
  );
};

import { Easing, interpolate, random } from "remotion";
import { C, clamp, H, mono, useT, W } from "../theme";
import { T } from "./tiempos";

// Lazo de cable de una habitación: interruptor a la izquierda, bombilla a la derecha
const X0 = 180;
const X1 = 900;
const Y0 = 760;
const Y1 = 1500;
const Y_INT = 1300;
const SEG = [Y_INT - Y0, X1 - X0, Y1 - Y0, X1 - X0, Y1 - Y_INT];
const L = SEG.reduce((a, b) => a + b, 0);
const S_BOMBILLA = SEG[0] + SEG[1] + 370;
const BOMBILLA = { x: X1, y: Y0 + 370 };

const punto = (s: number): [number, number] => {
  let r = ((s % L) + L) % L;
  if (r < SEG[0]) return [X0, Y_INT - r];
  r -= SEG[0];
  if (r < SEG[1]) return [X0 + r, Y0];
  r -= SEG[1];
  if (r < SEG[2]) return [X1, Y0 + r];
  r -= SEG[2];
  if (r < SEG[3]) return [X1 - r, Y1];
  r -= SEG[3];
  return [X0, Y1 - r];
};

const suave = { ...clamp, easing: Easing.inOut(Easing.cubic) };
const T_ONDA = 1.3; // el frente recorre medio lazo en 1,3 s (cámara muy lenta)
const V_DERIVA = 8; // px/s

const N = 120;
const ELECTRONES = new Array(N).fill(0).map((_, i) => ({
  s: (i / N) * L + random(`es${i}`) * 10,
  lado: (random(`el${i}`) - 0.5) * 10,
  fase: random(`ef${i}`) * Math.PI * 2,
}));

const camaraKeys = (): [number, number, number, number][] => [
  [0, 540, 1120, 1.0],
  [T.fraccion - 0.3, 540, 1120, 1.04],
  [T.fraccion + 0.6, 540, Y0, 3.2],
  [T.lleno - 0.3, 540, Y0, 3.25],
  [T.lleno + 0.6, 540, 1120, 1.0],
  [T.manguera, 540, 1120, 1.04],
  [T.alterna, 540, Y0, 2.6],
  [T.energia - 0.3, 540, Y0, 2.65],
  [T.energia + 0.6, 680, 1050, 1.15],
  [T.final - 0.3, 680, 1050, 1.18],
  [T.final + 0.6, 540, 1120, 1.0],
  [T.fin + 1, 540, 1120, 1.03],
];

const camara = (t: number) => {
  const K = camaraKeys();
  let k = 0;
  while (k < K.length - 1 && K[k + 1][0] <= t) k++;
  const a = K[k];
  const b = K[Math.min(k + 1, K.length - 1)];
  const p = b[0] === a[0] ? 0 : interpolate(t, [a[0], b[0]], [0, 1], suave);
  return { cx: a[1] + (b[1] - a[1]) * p, cy: a[2] + (b[2] - a[2]) * p, zoom: a[3] + (b[3] - a[3]) * p };
};

const Caracol: React.FC<{ readonly x: number; readonly y: number }> = ({ x, y }) => (
  <g>
    <path d={`M ${x - 40} ${y} Q ${x - 10} ${y - 6} ${x + 34} ${y} L ${x + 40} ${y - 18} L ${x + 44} ${y} Z`} fill="#C8B48C" />
    <line x1={x + 38} y1={y - 16} x2={x + 46} y2={y - 38} stroke="#C8B48C" strokeWidth={4} />
    <circle cx={x - 6} cy={y - 26} r={24} fill="#A8643C" />
    <path d={`M ${x - 6} ${y - 26} m -12 0 a 12 12 0 1 1 12 12 a 6 6 0 1 1 -6 -6`} fill="none" stroke="#7A4A2A" strokeWidth={4} />
  </g>
);

export const Circuito: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const { cx, cy, zoom } = camara(t);

  // Estados del interruptor: demostración inicial, se "rebobina" y se pulsa a cámara lenta
  const demo = t >= T.interruptor && t < T.lleno;
  const pulsado = t >= T.pulsar;
  const cerrado = demo || pulsado;
  const frente = pulsado ? ((t - T.pulsar) / T_ONDA) * (L / 2) : demo ? L : 0;
  const alterna = t >= T.alterna;
  const enBombilla = Math.min(S_BOMBILLA, L - S_BOMBILLA);
  const luz = demo ? 1 : pulsado ? interpolate(frente, [enBombilla, enBombilla + 80], [0, 1], clamp) : 0;
  const campoFuera = interpolate(t, [T.energia, T.energia + 0.6], [0, 1], clamp);

  const desplazamiento = (s: number, fase: number) => {
    if (alterna) {
      return 22 * Math.sin((t - T.alterna) * Math.PI * 2 * 1.1 + fase * 0.05);
    }
    if (!cerrado) return 0;
    const d = Math.min(s, L - s);
    if (d > frente) return 0;
    const inicio = pulsado ? T.pulsar + (d / (L / 2)) * T_ONDA : T.interruptor;
    return V_DERIVA * Math.max(0, t - inicio);
  };

  const lazo = `M ${X0} ${Y_INT} L ${X0} ${Y0} L ${X1} ${Y0} L ${X1} ${Y1} L ${X0} ${Y1} Z`;
  const tarjetaCarrera = interpolate(t, [0.2, 0.6, T.interruptor - 0.3, T.interruptor], [0, 1, 1, 0], clamp);
  const tarjetaHoras = interpolate(t, [T.horas - 0.4, T.horas, T.lleno - 0.3, T.lleno], [0, 1, 1, 0], clamp);
  const tarjetaVel = interpolate(t, [T.luz - 0.2, T.luz + 0.2, T.manguera - 0.3, T.manguera], [0, 1, 1, 0], clamp);
  const tarjetaHz = interpolate(t, [T.veces - 0.2, T.veces + 0.2, T.energia - 0.3, T.energia], [0, 1, 1, 0], clamp);
  const horas = interpolate(t, [T.horas, T.horas + 1.2], [0, 8.3], { ...clamp, easing: Easing.out(Easing.cubic) });

  return (
    <svg width={W} height={H} style={{ position: "absolute" }}>
      <defs>
        <filter id="brillo-in" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
        <radialGradient id="halo-bombilla" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#FFF1C9" stopOpacity={0.9} />
          <stop offset="1" stopColor="#FFF1C9" stopOpacity={0} />
        </radialGradient>
      </defs>
      <g transform={`translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`}>
        <path d={lazo} fill="none" stroke="#2A2350" strokeWidth={30} strokeLinejoin="round" />
        {/* Energía que viaja por el campo, fuera del cable */}
        {campoFuera > 0
          ? [-46, 46].map((off) => (
              <path
                key={off}
                d={`M ${X0 + off} ${Y_INT} L ${X0 + off} ${Y0 + off} L ${X1 - 40} ${Y0 + off}`}
                fill="none"
                stroke={C.yellow}
                strokeWidth={5}
                strokeDasharray="26 18"
                strokeDashoffset={-160 * t}
                opacity={0.8 * campoFuera}
              />
            ))
          : null}
        {campoFuera > 0
          ? [-46, 46].map((off) => (
              <path
                key={`b${off}`}
                d={`M ${X0 + off} ${Y_INT + 120} L ${X0 + off} ${Y1 - off} L ${X1 - 40} ${Y1 - off}`}
                fill="none"
                stroke={C.yellow}
                strokeWidth={5}
                strokeDasharray="26 18"
                strokeDashoffset={-160 * t}
                opacity={0.8 * campoFuera}
              />
            ))
          : null}
        {/* Electrones dentro del cable */}
        {ELECTRONES.map((e, i) => {
          const [x, y] = punto(e.s + desplazamiento(e.s, e.fase));
          const horizontal = y === Y0 || y === Y1;
          return (
            <circle
              key={i}
              cx={x + (horizontal ? 0 : e.lado)}
              cy={y + (horizontal ? e.lado : 0)}
              r={5}
              fill={C.cyan}
              opacity={i === 36 && alterna ? 0 : 0.9}
            />
          );
        })}
        {/* Electrón destacado en alterna: va y viene sin avanzar */}
        {alterna && t < T.energia + 0.5
          ? (() => {
              const [x, y] = punto(ELECTRONES[36].s + desplazamiento(0, 0));
              const [x0] = punto(ELECTRONES[36].s);
              return (
                <g>
                  <line x1={x0 - 22} y1={y + 16} x2={x0 + 22} y2={y + 16} stroke={C.yellow} strokeWidth={2} opacity={0.7} />
                  <circle cx={x} cy={y} r={6} fill={C.cyan} />
                  <circle cx={x} cy={y} r={13} fill="none" stroke={C.yellow} strokeWidth={2} />
                </g>
              );
            })()
          : null}
        {/* Frente del empujón (campo) */}
        {pulsado && frente < L / 2 + 40
          ? [frente, L - frente].map((s, k) => {
              const [x, y] = punto(s);
              return (
                <g key={k}>
                  <circle cx={x} cy={y} r={34} fill={C.yellow} opacity={0.5} filter="url(#brillo-in)" />
                  <circle cx={x} cy={y} r={12} fill={C.yellow} />
                </g>
              );
            })
          : null}
        {/* Interruptor */}
        <rect x={X0 - 50} y={Y_INT - 10} width={100} height={130} rx={16} fill="#1A1636" stroke="#8C88A8" strokeWidth={6} />
        <line
          x1={X0}
          y1={Y_INT + 110}
          x2={X0 + (cerrado ? 0 : 36)}
          y2={Y_INT + (cerrado ? 0 : 20)}
          stroke={cerrado ? C.cyan : "#8C88A8"}
          strokeWidth={10}
          strokeLinecap="round"
        />
        {/* "Ya están dentro de la bombilla": se resaltan los electrones que ya hay ahí */}
        {t >= T.bombilla && t < T.pulsar + 0.5 ? (
          <circle
            cx={BOMBILLA.x}
            cy={BOMBILLA.y}
            r={110 + 8 * Math.sin(t * 6)}
            fill="none"
            stroke={C.yellow}
            strokeWidth={5}
            strokeDasharray="14 10"
            opacity={interpolate(t, [T.bombilla, T.bombilla + 0.4, T.pulsar, T.pulsar + 0.5], [0, 1, 1, 0], clamp)}
          />
        ) : null}
        {/* Bombilla */}
        {luz > 0 ? <circle cx={BOMBILLA.x} cy={BOMBILLA.y} r={260} fill="url(#halo-bombilla)" opacity={luz} /> : null}
        <circle cx={BOMBILLA.x} cy={BOMBILLA.y} r={70} fill={luz > 0.5 ? "#FFF1C9" : "#1A1636"} stroke="#8C88A8" strokeWidth={6} opacity={0.95} />
        <polyline
          points={`${BOMBILLA.x},${BOMBILLA.y - 70} ${BOMBILLA.x - 20},${BOMBILLA.y - 30} ${BOMBILLA.x + 20},${BOMBILLA.y - 10} ${BOMBILLA.x - 20},${BOMBILLA.y + 10} ${BOMBILLA.x + 20},${BOMBILLA.y + 30} ${BOMBILLA.x},${BOMBILLA.y + 70}`}
          fill="none"
          stroke={luz > 0.5 ? C.orange : "#5A5675"}
          strokeWidth={5}
        />
      </g>

      {/* Tarjeta: carrera caracol vs electrón */}
      {tarjetaCarrera > 0 ? (
        <g opacity={tarjetaCarrera}>
          <rect x={60} y={150} width={960} height={380} rx={24} fill={C.card} stroke={C.cardBorder} strokeWidth={2} />
          <text x={110} y={215} fill={C.grey} fontFamily={mono} fontSize={30}>carrera</text>
          <line x1={110} y1={330} x2={970} y2={330} stroke={C.grey} strokeWidth={2} opacity={0.4} />
          <line x1={110} y1={460} x2={970} y2={460} stroke={C.grey} strokeWidth={2} opacity={0.4} />
          <Caracol x={160 + 70 * t} y={325} />
          <text x={970} y={300} textAnchor="end" fill="#C8B48C" fontFamily={mono} fontSize={30} fontWeight={700}>~1 mm/s</text>
          <circle cx={150 + 7 * t} cy={445} r={12} fill={C.cyan} />
          <text x={970} y={430} textAnchor="end" fill={C.cyan} fontFamily={mono} fontSize={30} fontWeight={700}>~0,1 mm/s</text>
        </g>
      ) : null}
      {/* Tarjeta: horas para cruzar 3 m */}
      {tarjetaHoras > 0 ? (
        <g opacity={tarjetaHoras}>
          <rect x={60} y={150} width={960} height={280} rx={24} fill={C.card} stroke={C.cardBorder} strokeWidth={2} />
          <text x={110} y={215} fill={C.grey} fontFamily={mono} fontSize={30}>3 m de cable a 0,1 mm/s</text>
          <text x={110} y={350} fill={C.cyan} fontFamily={mono} fontSize={96} fontWeight={700}>
            {horas.toFixed(1).replace(".", ",")}
            <tspan fill={C.grey} fontSize={48}> horas</tspan>
          </text>
        </g>
      ) : null}
      {/* Tarjeta: velocidad del empujón */}
      {tarjetaVel > 0 ? (
        <g opacity={tarjetaVel}>
          <rect x={60} y={150} width={960} height={300} rx={24} fill={C.card} stroke={C.cardBorder} strokeWidth={2} />
          <text x={110} y={215} fill={C.grey} fontFamily={mono} fontSize={30}>velocidad del empujón</text>
          <text x={110} y={330} fill={C.yellow} fontFamily={mono} fontSize={80} fontWeight={700}>~200.000 km/s</text>
          <text x={110} y={410} fill={C.grey} fontFamily={mono} fontSize={28}>(aquí, a cámara muy lenta)</text>
        </g>
      ) : null}
      {/* Tarjeta: alterna */}
      {tarjetaHz > 0 ? (
        <g opacity={tarjetaHz}>
          <rect x={60} y={150} width={960} height={280} rx={24} fill={C.card} stroke={C.cardBorder} strokeWidth={2} />
          <text x={110} y={215} fill={C.grey} fontFamily={mono} fontSize={30}>corriente alterna</text>
          <text x={110} y={340} fill={C.cyan} fontFamily={mono} fontSize={88} fontWeight={700}>50-60 /s</text>
          <text x={110} y={400} fill={C.grey} fontFamily={mono} fontSize={28}>adelante y atrás (aquí, a cámara lenta)</text>
        </g>
      ) : null}
    </svg>
  );
};

import { Easing, interpolate } from "remotion";
import {
  Electrones,
  ionX,
  ionY,
  R_ELECTRON,
  R_ION,
  Red,
} from "../components/Red";
import { C, clamp, H, mono, useT, W } from "../theme";

// Tramos "acelera → choca" del electrón protagonista, sincronizados con la voz
const TRAMOS = [
  { S: 21.76, C: 23.15 },
  { S: 26.45, C: 27.36 },
  { S: 27.95, C: 28.84 },
];
// Después siguen tramos regulares (para la gráfica de deriva)
const T_LIBRE = 0.75;
const PERIODO = 0.9;
const INICIO_REGULAR = 29.0;

const FILA = 5;
const Y_FILA = ionY(FILA);
const CONTACTO = R_ION + R_ELECTRON + 2;
const T_DESVIO = 0.35;

const velocidad = (t: number) => {
  for (const tr of TRAMOS) {
    if (t >= tr.S && t <= tr.C) {
      return t - tr.S;
    }
  }
  if (t >= INICIO_REGULAR) {
    const u = (t - INICIO_REGULAR) % PERIODO;
    return u <= T_LIBRE ? u : 0;
  }
  return 0;
};

const V_MEDIA = (T_LIBRE * T_LIBRE) / 2 / PERIODO;

// Posición del electrón protagonista: parte del ion 1 y en cada tramo llega al siguiente
const posicionFoco = (t: number) => {
  const salida = (k: number) => ionX(1 + k) + CONTACTO;
  const llegada = (k: number) => ionX(2 + k) - CONTACTO;
  if (t < TRAMOS[0].S) {
    return { x: salida(0), y: Y_FILA };
  }
  for (let k = 0; k < TRAMOS.length; k++) {
    const { S, C: choque } = TRAMOS[k];
    const siguiente = k + 1 < TRAMOS.length ? TRAMOS[k + 1].S : Infinity;
    if (t >= S && t <= choque) {
      const p = (t - S) / (choque - S);
      return { x: salida(k) + (llegada(k) - salida(k)) * p * p, y: Y_FILA };
    }
    if (t > choque && t < siguiente) {
      // Rebota rodeando el ion y queda parado al otro lado
      const th = interpolate(t, [choque, choque + T_DESVIO], [Math.PI, 0], {
        ...clamp,
        easing: Easing.out(Easing.cubic),
      });
      return {
        x: ionX(2 + k) + CONTACTO * Math.cos(th),
        y: Y_FILA - CONTACTO * Math.sin(th),
      };
    }
  }
  return { x: salida(TRAMOS.length), y: Y_FILA };
};

const Destello: React.FC<{ readonly t: number; readonly tc: number; readonly x: number; readonly y: number }> = ({
  t,
  tc,
  x,
  y,
}) => {
  if (t < tc || t > tc + 0.5) {
    return null;
  }
  const p = (t - tc) / 0.5;
  return (
    <g opacity={1 - p}>
      <circle cx={x} cy={y} r={10 + 70 * p} fill="none" stroke={C.yellow} strokeWidth={4} />
      {new Array(10).fill(0).map((_, i) => {
        const a = (i / 10) * Math.PI * 2 + 0.3;
        return (
          <line
            key={i}
            x1={x + Math.cos(a) * (14 + 30 * p)}
            y1={y + Math.sin(a) * (14 + 30 * p) + 40 * p * p}
            x2={x + Math.cos(a) * (26 + 56 * p)}
            y2={y + Math.sin(a) * (26 + 56 * p) + 40 * p * p}
            stroke={i % 2 ? C.yellow : C.orange}
            strokeWidth={4}
            strokeLinecap="round"
          />
        );
      })}
    </g>
  );
};

// Gráfica v(t) del electrón: diente de sierra y, después, su media (= deriva)
const GraficaVelocidad: React.FC<{ readonly t: number }> = ({ t }) => {
  const x0 = 110;
  const x1 = 970;
  const yBase = 520;
  const escala = 210;
  const tIni = 21.6;
  const tFin = 35.0;
  const mapX = (tt: number) => x0 + ((tt - tIni) / (tFin - tIni)) * (x1 - x0);
  const puntos: string[] = [];
  for (let tt = tIni; tt <= Math.min(t, tFin); tt += 1 / 60) {
    puntos.push(`${mapX(tt).toFixed(1)},${(yBase - velocidad(tt) * escala).toFixed(1)}`);
  }
  const yMedia = yBase - V_MEDIA * escala;
  const anchoMedia = interpolate(t, [29.98, 30.9], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  return (
    <g
      opacity={interpolate(t, [21.3, 21.7, 34.6, 35.0], [0, 1, 1, 0], clamp)}
    >
      <rect x={60} y={150} width={960} height={430} rx={24} fill={C.card} stroke={C.cardBorder} strokeWidth={2} />
      <text x={110} y={205} fill={C.grey} fontFamily={mono} fontSize={28}>velocidad del electrón</text>
      <line x1={x0} y1={yBase} x2={x1} y2={yBase} stroke={C.grey} strokeWidth={2} opacity={0.5} />
      <line x1={x0} y1={yBase} x2={x0} y2={230} stroke={C.grey} strokeWidth={2} opacity={0.5} />
      <text x={x1} y={yBase + 40} textAnchor="end" fill={C.grey} fontFamily={mono} fontSize={26}>tiempo</text>
      <polyline points={puntos.join(" ")} fill="none" stroke={C.cyan} strokeWidth={5} strokeLinejoin="round" />
      {anchoMedia > 0 ? (
        <>
          <line
            x1={x0}
            y1={yMedia}
            x2={x0 + (x1 - x0) * anchoMedia}
            y2={yMedia}
            stroke={C.yellow}
            strokeWidth={5}
            strokeDasharray="18 12"
          />
          <text
            x={x1}
            y={yMedia - 16}
            textAnchor="end"
            fill={C.yellow}
            fontFamily={mono}
            fontWeight={700}
            fontSize={32}
            opacity={anchoMedia}
          >
            media = deriva
          </text>
        </>
      ) : null}
    </g>
  );
};

// Bornes de la pila en los bordes y flechas del campo eléctrico (de + a −)
const Campo: React.FC<{ readonly t: number }> = ({ t }) => {
  const aparece = interpolate(t, [14.8, 15.4], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const flechas = interpolate(t, [16.45, 17.2], [0, 1], clamp);
  return (
    <g>
      <g opacity={aparece}>
        <rect x={-24 + 24 * aparece} y={0} width={18} height={H} fill={C.white} opacity={0.85} />
        <rect x={W - 18 * aparece} y={0} width={18} height={H} fill={C.red} />
        <text x={50} y={1880} fill={C.white} fontFamily={mono} fontSize={64} fontWeight={700}>−</text>
        <text x={W - 50} y={1880} textAnchor="end" fill={C.red} fontFamily={mono} fontSize={64} fontWeight={700}>+</text>
      </g>
      {flechas > 0
        ? new Array(5).fill(0).map((_, fila) =>
            new Array(7).fill(0).map((__, col) => {
              const x = ((col * 180 - (t - 16.45) * 90) % 1260 + 1260) % 1260 - 90;
              const y = 210 + fila * 360;
              return (
                <polyline
                  key={`${fila}-${col}`}
                  points={`${x + 26},${y - 26} ${x},${y} ${x + 26},${y + 26}`}
                  fill="none"
                  stroke={C.cyan}
                  strokeWidth={6}
                  strokeLinecap="round"
                  opacity={0.22 * flechas}
                />
              );
            }),
          )
        : null}
    </g>
  );
};

export const Cobre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const foco = posicionFoco(t);

  // Cámara: entra desde cerca, plano general, primer plano del electrón, vuelve a general
  const enfoque = interpolate(t, [21.15, 22.0, 29.49, 30.4], [0, 1, 1, 0], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const zoomBase = interpolate(t, [7.0, 8.6, 21], [1.6, 1, 1.05], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const zoom = zoomBase + (2.6 - zoomBase) * enfoque;
  const cx = 540 + (Math.min(Math.max(foco.x, 380), 760) - 540) * enfoque;
  const cy = 960 + (Y_FILA - 150 - 960) * enfoque;

  const deriva = 70 * Math.max(0, t - 16.97);
  const halo = interpolate(t, [21.15, 21.6, 29.6, 30.2], [0, 1, 1, 0], clamp);

  return (
    <svg width={W} height={H} style={{ position: "absolute" }}>
      <g transform={`translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`}>
        <Red t={t} calor={0} />
        <Electrones tau={t - 7.05} deriva={deriva} opacidad={1 - 0.75 * enfoque} />
        {halo > 0 ? (
          <g opacity={halo}>
            <circle cx={foco.x} cy={foco.y} r={R_ELECTRON * 3.2} fill="none" stroke={C.yellow} strokeWidth={2.5} />
            <circle cx={foco.x} cy={foco.y} r={R_ELECTRON * 1.3} fill={C.cyan} />
          </g>
        ) : null}
        {TRAMOS.map((tr, k) => (
          <Destello key={k} t={t} tc={tr.C} x={ionX(2 + k) - R_ION} y={Y_FILA} />
        ))}
      </g>
      <Campo t={t} />
      <GraficaVelocidad t={t} />
    </svg>
  );
};

export const CHOQUES = TRAMOS.map((tr) => tr.C);

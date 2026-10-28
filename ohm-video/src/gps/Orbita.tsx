import { Easing, interpolate, random } from "remotion";
import { C, clamp, H, mono, useT, W } from "../theme";
import { T } from "./tiempos";

// La Tierra con tu celular arriba y los satélites GPS en órbita (sin escala real)
type P2 = [number, number];
const TIERRA = { x: 540, y: 3700, r: 1500 };
const SUPERFICIE = TIERRA.y - TIERRA.r;
const CEL: P2 = [540, 2160];
const ORBITA = 2900;
const S1: P2 = [-910, 1189];
const S2: P2 = [1766, 1072];
// S3 está en la recta S1–S2: tres centros alineados dejan dos soluciones simétricas
const S3: P2 = [540, S1[1] + ((S2[1] - S1[1]) * (540 - S1[0])) / (S2[0] - S1[0])];
const S4: P2 = [1350, 500];
const SATS = [S1, S2, S3, S4];

const dist = (a: P2, b: P2) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const RADIOS = SATS.map((s) => dist(s, CEL));

// Q: reflejo del celular respecto a la recta S1–S2 (la solución "perdida en el espacio")
const Q: P2 = (() => {
  const dx = S2[0] - S1[0];
  const dy = S2[1] - S1[1];
  const k = ((CEL[0] - S1[0]) * dx + (CEL[1] - S1[1]) * dy) / (dx * dx + dy * dy);
  const pie: P2 = [S1[0] + k * dx, S1[1] + k * dy];
  return [2 * pie[0] - CEL[0], 2 * pie[1] - CEL[1]];
})();

// Otros satélites de la constelación a lo largo de la órbita
const OTROS = new Array(14).fill(0).map((_, i) => {
  const a = -1.15 + (2.3 * i) / 13 + (random(`oa${i}`) - 0.5) * 0.08;
  const r = ORBITA + (random(`or${i}`) - 0.5) * 500;
  return { x: TIERRA.x + r * Math.sin(a), y: TIERRA.y - r * Math.cos(a), giro: random(`og${i}`) * 40 - 20 };
});
// Edificios bajos alrededor del celular; dos torres que crecen en el tramo del túnel
const CASAS = [
  { x: 380, w: 50, h: 60 },
  { x: 440, w: 40, h: 90 },
  { x: 600, w: 44, h: 70 },
  { x: 650, w: 60, h: 50 },
];
const TORRES = [
  { x: 380, w: 72, h: 470 },
  { x: 640, w: 80, h: 520 },
];

const suave = { ...clamp, easing: Easing.inOut(Easing.cubic) };

// Cámara: [tiempo, centro x, centro y, zoom]
const camaraKeys = (): [number, number, number, number][] => [
  [0, 540, 2080, 2.2],
  [T.como - 0.4, 540, 2080, 2.25],
  [T.como + 0.6, 560, 1500, 0.45],
  [T.parece - 0.3, 560, 1500, 0.47],
  [T.parece + 0.6, 540, 1600, 0.85],
  [T.veinteMil - 0.4, 540, 1600, 0.87],
  [T.veinteMil + 0.7, 430, 1500, 0.3],
  [T.relojes - 0.4, 430, 1500, 0.31],
  [T.relojes + 0.6, S3[0], S3[1] - 120, 2.2],
  [T.senal - 0.4, S3[0], S3[1] - 120, 2.25],
  [T.senal + 0.6, 540, 1520, 0.85],
  [T.esfera - 0.4, 540, 1520, 0.87],
  [T.esfera + 0.7, 430, 1150, 0.36],
  [T.cuarto - 0.3, 430, 1150, 0.37],
  [T.cuarto + 0.6, 520, 1200, 0.34],
  [T.millonesima - 0.4, 520, 1200, 0.35],
  [T.millonesima + 0.6, 540, 2120, 1.5],
  [T.einstein - 0.4, 540, 2120, 1.55],
  [T.einstein + 0.6, S4[0], S4[1] - 160, 2.2],
  [T.tunel - 0.4, S4[0], S4[1] - 160, 2.25],
  [T.tunel + 0.6, 540, 1900, 0.9],
  [T.noPregunta - 0.4, 540, 1900, 0.92],
  [T.noPregunta + 0.7, 520, 1250, 0.36],
  [T.fin, 520, 1250, 0.38],
];

const camara = (t: number) => {
  const K = camaraKeys();
  let k = 0;
  while (k < K.length - 1 && K[k + 1][0] <= t) {
    k++;
  }
  const a = K[k];
  const b = K[Math.min(k + 1, K.length - 1)];
  const p = b[0] === a[0] ? 0 : interpolate(t, [a[0], b[0]], [0, 1], suave);
  return { cx: a[1] + (b[1] - a[1]) * p, cy: a[2] + (b[2] - a[2]) * p, zoom: a[3] + (b[3] - a[3]) * p };
};

const Satelite: React.FC<{ readonly x: number; readonly y: number; readonly s?: number; readonly giro?: number; readonly o?: number }> = ({
  x,
  y,
  s = 1,
  giro = 0,
  o = 1,
}) => (
  <g transform={`translate(${x} ${y}) rotate(${giro}) scale(${s})`} opacity={o}>
    {[-1, 1].map((lado) => (
      <g key={lado}>
        <line x1={lado * 26} y1={0} x2={lado * 40} y2={0} stroke="#8C88A8" strokeWidth={6} />
        <rect x={lado > 0 ? 40 : -128} y={-22} width={88} height={44} rx={4} fill="#1E2A6A" stroke={C.cyan} strokeWidth={2} />
        {[1, 2, 3].map((k) => (
          <line key={k} x1={(lado > 0 ? 40 : -128) + k * 22} y1={-22} x2={(lado > 0 ? 40 : -128) + k * 22} y2={22} stroke={C.cyan} strokeWidth={1.5} opacity={0.5} />
        ))}
      </g>
    ))}
    <rect x={-26} y={-30} width={52} height={60} rx={8} fill="#C8C4D8" />
    <rect x={-26} y={-30} width={52} height={14} rx={6} fill={C.yellow} opacity={0.85} />
    <path d="M -14 30 Q 0 52, 14 30" fill="#8C88A8" />
  </g>
);

// Reloj atómico encima de un satélite; la aguja gira con t
const Reloj: React.FC<{ readonly x: number; readonly y: number; readonly t: number; readonly o: number; readonly color?: string }> = ({ x, y, t, o, color = C.yellow }) => {
  if (o <= 0) {
    return null;
  }
  const a = t * 360;
  return (
    <g opacity={o} transform={`translate(${x} ${y})`}>
      <circle r={30} fill={C.pill} stroke={color} strokeWidth={4} />
      {[0, 90, 180, 270].map((g) => (
        <line key={g} x1={0} y1={-22} x2={0} y2={-26} stroke={color} strokeWidth={3} transform={`rotate(${g})`} />
      ))}
      <line x1={0} y1={0} x2={0} y2={-20} stroke={color} strokeWidth={4} strokeLinecap="round" transform={`rotate(${a})`} />
      <line x1={0} y1={0} x2={0} y2={-12} stroke={C.white} strokeWidth={4} strokeLinecap="round" transform={`rotate(${a / 12})`} />
      <circle r={4} fill={color} />
    </g>
  );
};

// Señal que baja de un satélite al celular: línea tenue y pulsos que viajan
const Senal: React.FC<{ readonly a: P2; readonly b: P2; readonly t: number; readonly o: number; readonly color?: string; readonly corte?: number }> = ({
  a,
  b,
  t,
  o,
  color = C.cyan,
  corte = 1,
}) => {
  if (o <= 0) {
    return null;
  }
  const fin: P2 = [a[0] + (b[0] - a[0]) * corte, a[1] + (b[1] - a[1]) * corte];
  return (
    <g opacity={o}>
      <line x1={a[0]} y1={a[1]} x2={fin[0]} y2={fin[1]} stroke={color} strokeWidth={2.5} strokeDasharray="14 12" strokeDashoffset={-80 * t} vectorEffect="non-scaling-stroke" opacity={0.7} />
      {[0, 0.5].map((f) => {
        const s = (t * 0.6 + f) % 1;
        if (s > corte) {
          return null;
        }
        return <circle key={f} cx={a[0] + (b[0] - a[0]) * s} cy={a[1] + (b[1] - a[1]) * s} r={14} fill={color} filter="url(#brillo-gps)" />;
      })}
    </g>
  );
};

// Etiqueta anclada a un punto del mundo, con tamaño constante en pantalla
const Tag: React.FC<{ readonly x: number; readonly y: number; readonly texto: string; readonly color: string; readonly o: number; readonly dx?: number; readonly dy?: number }> = ({
  x,
  y,
  texto,
  color,
  o,
  dx = 0,
  dy = -90,
}) => {
  if (o <= 0) {
    return null;
  }
  const ancho = texto.length * 22 + 36;
  return (
    <g opacity={o}>
      <line x1={x} y1={y} x2={x + dx} y2={y + dy + (dy < 0 ? 26 : -30)} stroke={color} strokeWidth={2} opacity={0.7} />
      <circle cx={x} cy={y} r={6} fill={color} />
      <rect x={x + dx - ancho / 2} y={y + dy - 30} width={ancho} height={56} rx={14} fill={C.pill} stroke={color} strokeWidth={2} />
      <text x={x + dx} y={y + dy + 10} textAnchor="middle" fill={color} fontFamily={mono} fontSize={36} fontWeight={700}>
        {texto}
      </text>
    </g>
  );
};

export const Orbita: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const { cx, cy, zoom } = camara(t);
  const sx = (x: number) => 540 + (x - cx) * zoom;
  const sy = (y: number) => 960 + (y - cy) * zoom;

  // Señales al celular
  const gancho = interpolate(t, [0.2, 0.8, T.parece - 0.3, T.parece], [0, 1, 1, 0], clamp);
  const unaSenal = interpolate(t, [T.escucha - 0.2, T.escucha + 0.3, T.veinteMil - 0.3, T.veinteMil], [0, 1, 1, 0], clamp);
  const viaje = interpolate(t, [T.senal + 0.6, T.centesimas + 0.8], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const viajeO = interpolate(t, [T.senal + 0.4, T.senal + 0.7, T.esfera - 0.3, T.esfera], [0, 1, 1, 0], clamp);
  const tunel = interpolate(t, [T.tunel + 0.2, T.tunel + 0.8, T.noPregunta - 0.2, T.noPregunta + 0.2], [0, 1, 1, 0], clamp);
  const torres = interpolate(t, [T.tunel + 0.3, T.tunel + 1.6, T.noPregunta, T.noPregunta + 0.6], [0, 1, 1, 0], suave);
  const final = interpolate(t, [T.noPregunta + 0.3, T.noPregunta + 1.0], [0, 1], clamp);

  // "Te ve": un haz que baja del satélite y se tacha
  const haz = interpolate(t, [T.parece + 0.3, T.parece + 0.8, T.escucha - 0.3, T.escucha], [0, 1, 1, 0], clamp);
  const tacha = interpolate(t, [T.noSabe + 0.4, T.noSabe + 0.8], [0, 1], clamp);
  const noEnvia = interpolate(t, [T.escucha + 0.2, T.escucha + 0.6, T.veinteMil - 0.3, T.veinteMil], [0, 1, 1, 0], clamp);

  // Constelación y altura
  const constelacion = interpolate(t, [T.veinteMil + 0.2, T.veinteMil + 1.0, T.relojes, T.relojes + 0.6], [0, 1, 1, 0], clamp);
  const altura = interpolate(t, [T.veinteMil + 0.4, T.veinteMil + 0.9, T.relojes - 0.3, T.relojes], [0, 1, 1, 0], clamp);
  const relojS3 = interpolate(t, [T.atomicos - 0.3, T.atomicos + 0.2, T.esfera - 0.3, T.esfera], [0, 1, 1, 0], clamp);
  const relojS4 = interpolate(t, [T.einstein + 0.5, T.einstein + 0.9, T.tunel - 0.3, T.tunel], [0, 1, 1, 0], clamp);

  // Esferas (círculos), el anillo de dos esferas y los dos puntos
  const anillo = (desde: number) =>
    interpolate(t, [desde, desde + 0.6, T.tunel - 0.3, T.tunel], [0, 1, 1, 0], clamp) +
    interpolate(t, [T.noPregunta + 0.4, T.noPregunta + 1.1], [0, 1], clamp);
  const crece = (desde: number) => interpolate(t, [desde, desde + 0.9], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const elipse = interpolate(t, [T.dos + 0.4, T.dos + 0.9, T.tres + 0.3, T.tres + 0.7], [0, 1, 1, 0], clamp);
  const puntos = interpolate(t, [T.tres + 0.5, T.tres + 0.9, T.cuarto - 0.2, T.cuarto + 0.3], [0, 1, 1, 0], clamp);
  const espacio = interpolate(t, [T.espacio - 0.1, T.espacio + 0.3, T.cuarto - 0.2, T.cuarto + 0.3], [0, 1, 1, 0], clamp);
  // Error del reloj del celular: todas las distancias crecen lo mismo y los anillos no coinciden
  const error = 110 * interpolate(t, [T.noAtomico - 0.2, T.noAtomico + 0.6, T.trescientos + 0.2, T.trescientos + 1.3], [0, 1, 1, 0], suave);
  const desdes = [T.esfera, T.dos, T.tres, T.cuarto];

  // Etiquetas
  const tagTu = interpolate(t, [0.6, 1.0, T.como - 0.3, T.como], [0, 1, 1, 0], clamp);
  const tagRecibe = noEnvia;
  const tagEspacio = espacio;
  const tagVe = interpolate(t, [T.tunel + 1.6, T.tunel + 2.0, T.noPregunta - 0.2, T.noPregunta + 0.2], [0, 1, 1, 0], clamp);

  // Qué señales llegan entre las torres: solo la que baja casi en vertical
  const bloqueo = (s: P2) => {
    const torre = s[0] < CEL[0] ? TORRES[0] : TORRES[1];
    const borde = s[0] < CEL[0] ? torre.x + torre.w : torre.x;
    const p = (borde - CEL[0]) / (s[0] - CEL[0]);
    const yCruce = CEL[1] + (s[1] - CEL[1]) * p;
    const techo = SUPERFICIE - torre.h * torres;
    return p > 0 && p < 1 && yCruce > techo ? 1 - p : 1;
  };

  return (
    <svg width={W} height={H} style={{ position: "absolute" }}>
      <defs>
        <filter id="brillo-gps" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
        <radialGradient id="tierra-gps" cx="0.5" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#1E5C78" />
          <stop offset="1" stopColor="#0C2238" />
        </radialGradient>
      </defs>
      <g transform={`translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`}>
        {/* Órbitas */}
        <circle cx={TIERRA.x} cy={TIERRA.y} r={ORBITA} fill="none" stroke={C.purpleLight} strokeWidth={1.5} strokeDasharray="6 10" vectorEffect="non-scaling-stroke" opacity={0.35} />
        <circle cx={TIERRA.x} cy={TIERRA.y} r={dist([TIERRA.x, TIERRA.y], S4)} fill="none" stroke={C.purpleLight} strokeWidth={1.5} strokeDasharray="6 10" vectorEffect="non-scaling-stroke" opacity={0.25} />

        {/* Tierra con atmósfera */}
        <circle cx={TIERRA.x} cy={TIERRA.y} r={TIERRA.r + 40} fill={C.cyan} opacity={0.12} filter="url(#brillo-gps)" />
        <circle cx={TIERRA.x} cy={TIERRA.y} r={TIERRA.r} fill="url(#tierra-gps)" />
        <ellipse cx={TIERRA.x - 520} cy={SUPERFICIE + 260} rx={380} ry={150} fill="#2A6A5A" opacity={0.7} />
        <ellipse cx={TIERRA.x + 600} cy={SUPERFICIE + 330} rx={330} ry={120} fill="#2A6A5A" opacity={0.6} />
        <ellipse cx={TIERRA.x + 40} cy={SUPERFICIE + 120} rx={300} ry={90} fill="#2A6A5A" opacity={0.8} />

        {/* Ciudad y torres */}
        {CASAS.map((c) => (
          <rect key={c.x} x={c.x} y={SUPERFICIE + 8 - c.h} width={c.w} height={c.h} fill="#2A2350" />
        ))}
        {TORRES.map((c) =>
          torres > 0 ? (
            <g key={c.x}>
              <rect x={c.x} y={SUPERFICIE + 8 - c.h * torres} width={c.w} height={c.h * torres} fill="#2A2350" />
              {new Array(Math.floor((c.h * torres) / 40)).fill(0).map((_, k) => (
                <rect key={k} x={c.x + 14} y={SUPERFICIE - 30 - k * 40} width={c.w - 28} height={10} fill={C.yellow} opacity={0.5} />
              ))}
            </g>
          ) : null,
        )}

        {/* Constelación */}
        {OTROS.map((o, i) => (
          <Satelite key={i} x={o.x} y={o.y} s={0.9} giro={o.giro} o={constelacion} />
        ))}
        {/* Distancia hasta la órbita */}
        {altura > 0 ? (
          <g opacity={altura}>
            <line x1={160} y1={SUPERFICIE + 60} x2={160} y2={TIERRA.y - ORBITA + 30} stroke={C.yellow} strokeWidth={3} vectorEffect="non-scaling-stroke" />
            <line x1={110} y1={SUPERFICIE + 60} x2={210} y2={SUPERFICIE + 60} stroke={C.yellow} strokeWidth={3} vectorEffect="non-scaling-stroke" />
            <line x1={110} y1={TIERRA.y - ORBITA + 30} x2={210} y2={TIERRA.y - ORBITA + 30} stroke={C.yellow} strokeWidth={3} vectorEffect="non-scaling-stroke" />
          </g>
        ) : null}

        {/* Esferas de distancia (en 2D, círculos) */}
        {SATS.map((s, i) => {
          const o = Math.min(1, anillo(desdes[i]));
          if (o <= 0) {
            return null;
          }
          const r = RADIOS[i] * crece(desdes[i]) + error;
          return (
            <g key={i} opacity={o}>
              <circle cx={s[0]} cy={s[1]} r={r} fill={C.cyan} opacity={0.04} />
              <circle cx={s[0]} cy={s[1]} r={r} fill="none" stroke={C.cyan} strokeWidth={3} vectorEffect="non-scaling-stroke" opacity={0.85} />
            </g>
          );
        })}
        {/* Dos esferas se cortan en un círculo (visto en perspectiva) */}
        {elipse > 0 ? (
          <ellipse
            cx={(CEL[0] + Q[0]) / 2}
            cy={(CEL[1] + Q[1]) / 2}
            rx={dist(CEL, Q) / 2}
            ry={170}
            transform={`rotate(${(Math.atan2(CEL[1] - Q[1], CEL[0] - Q[0]) * 180) / Math.PI} ${(CEL[0] + Q[0]) / 2} ${(CEL[1] + Q[1]) / 2})`}
            fill="none"
            stroke={C.yellow}
            strokeWidth={4}
            strokeDasharray="16 10"
            vectorEffect="non-scaling-stroke"
            opacity={elipse}
          />
        ) : null}
        {/* Los dos puntos posibles */}
        {puntos > 0 ? (
          <g opacity={puntos}>
            <circle cx={CEL[0]} cy={CEL[1]} r={70} fill={C.yellow} opacity={0.45} filter="url(#brillo-gps)" />
            <circle cx={CEL[0]} cy={CEL[1]} r={26} fill={C.yellow} />
            <circle cx={Q[0]} cy={Q[1]} r={26} fill={C.red} />
            <path d={`M ${Q[0] - 50} ${Q[1] - 50} L ${Q[0] + 50} ${Q[1] + 50} M ${Q[0] + 50} ${Q[1] - 50} L ${Q[0] - 50} ${Q[1] + 50}`} stroke={C.red} strokeWidth={5} vectorEffect="non-scaling-stroke" opacity={espacio} />
          </g>
        ) : null}

        {/* Señales */}
        {SATS.map((s, i) => (
          <Senal key={`g${i}`} a={s} b={CEL} t={t + i * 0.3} o={gancho} />
        ))}
        <Senal a={S3} b={CEL} t={t} o={unaSenal} />
        {SATS.map((s, i) => {
          const c = bloqueo(s);
          return <Senal key={`t${i}`} a={s} b={CEL} t={t + i * 0.3} o={tunel} color={c < 1 ? C.red : C.cyan} corte={c} />;
        })}
        {SATS.map((s, i) => (
          <Senal key={`f${i}`} a={s} b={CEL} t={t + i * 0.3} o={final * 0.8} />
        ))}
        {/* Un pulso que viaja de S3 al celular mientras corre el cronómetro */}
        {viajeO > 0 ? (
          <g opacity={viajeO}>
            <line x1={S3[0]} y1={S3[1]} x2={CEL[0]} y2={CEL[1]} stroke={C.cyan} strokeWidth={2} strokeDasharray="10 12" vectorEffect="non-scaling-stroke" opacity={0.5} />
            <circle cx={S3[0] + (CEL[0] - S3[0]) * viaje} cy={S3[1] + (CEL[1] - S3[1]) * viaje} r={34} fill={C.cyan} opacity={0.5} filter="url(#brillo-gps)" />
            <circle cx={S3[0] + (CEL[0] - S3[0]) * viaje} cy={S3[1] + (CEL[1] - S3[1]) * viaje} r={14} fill={C.white} />
          </g>
        ) : null}
        {/* "El satélite te ve": haz que se tacha */}
        {haz > 0 ? (
          <g opacity={haz}>
            <path d={`M ${S3[0]} ${S3[1] + 40} L ${CEL[0] - 140} ${SUPERFICIE} L ${CEL[0] + 140} ${SUPERFICIE} Z`} fill={C.yellow} opacity={0.12 * (1 - tacha)} />
            <path
              d={`M ${S3[0] - 120} ${(S3[1] + CEL[1]) / 2 - 120} L ${S3[0] + 120} ${(S3[1] + CEL[1]) / 2 + 120} M ${S3[0] + 120} ${(S3[1] + CEL[1]) / 2 - 120} L ${S3[0] - 120} ${(S3[1] + CEL[1]) / 2 + 120}`}
              stroke={C.red}
              strokeWidth={8}
              vectorEffect="non-scaling-stroke"
              opacity={tacha}
            />
          </g>
        ) : null}

        {/* Satélites principales */}
        {SATS.map((s, i) => (
          <Satelite key={i} x={s[0]} y={s[1]} s={1.4} giro={i * 7 - 10} />
        ))}
        <Reloj x={S3[0]} y={S3[1] - 90} t={t} o={relojS3} />
        <Reloj x={S4[0]} y={S4[1] - 90} t={t * 1.6} o={relojS4} />

        {/* Celular */}
        <g transform={`translate(${CEL[0]} ${CEL[1]})`}>
          <rect x={-24} y={-42} width={48} height={84} rx={10} fill="#1A1636" stroke={C.white} strokeWidth={3} />
          <rect x={-18} y={-34} width={36} height={64} rx={4} fill="#0E2A40" />
          <path d="M 0 -18 C -9 -18, -12 -10, -12 -6 C -12 2, 0 14, 0 14 C 0 14, 12 2, 12 -6 C 12 -10, 9 -18, 0 -18 Z" fill={C.yellow} opacity={0.4 + 0.6 * final} />
          <circle cx={0} cy={-6} r={4} fill="#0E2A40" />
        </g>
        {/* El celular no envía nada */}
        {noEnvia > 0 ? (
          <g opacity={noEnvia} transform={`translate(${CEL[0] + 90} ${CEL[1] - 80})`}>
            <line x1={0} y1={40} x2={0} y2={-40} stroke={C.white} strokeWidth={6} strokeLinecap="round" opacity={0.6} />
            <polyline points="-16,-24 0,-42 16,-24" fill="none" stroke={C.white} strokeWidth={6} strokeLinecap="round" opacity={0.6} />
            <path d="M -26 -20 L 26 24 M 26 -20 L -26 24" stroke={C.red} strokeWidth={7} strokeLinecap="round" />
          </g>
        ) : null}
      </g>

      {/* Etiquetas ancladas (tamaño constante en pantalla) */}
      <Tag x={sx(CEL[0])} y={sy(CEL[1] - 50)} dx={0} dy={-160} texto="tú" color={C.yellow} o={tagTu} />
      <Tag x={sx(CEL[0] - 30)} y={sy(CEL[1] + 20)} dx={-230} dy={-170} texto="solo recibe" color={C.cyan} o={tagRecibe} />
      <Tag x={sx(160)} y={sy((SUPERFICIE + TIERRA.y - ORBITA) / 2)} dx={190} dy={0} texto="20.000 km" color={C.yellow} o={altura} />
      <Tag x={sx(Q[0])} y={sy(Q[1])} dx={0} dy={140} texto="en el espacio" color={C.red} o={tagEspacio} />
      <Tag x={sx(CEL[0])} y={sy(CEL[1])} dx={0} dy={160} texto="tú" color={C.yellow} o={puntos} />
      <Tag x={sx(S3[0])} y={sy(S3[1] + 60)} dx={0} dy={150} texto="1 satélite a la vista" color={C.red} o={tagVe} />
    </svg>
  );
};

import { Easing, interpolate, random } from "remotion";
import { C, clamp, H, mono, useT, W } from "../theme";
import { T } from "./tiempos";

// Una habitación de noche con una aspiradora de trineo en corte: ventilador, manguera, tubo y boquilla
const SUELO = 1350;
const CUERPO = { x: 600, y: 1150, w: 320, h: 172 };
const VENTANA = { x: 690, y: 1172, w: 210, h: 128 };
const VENT = { x: 838, y: 1236, r: 52 };
const ENTRADA: [number, number] = [600, 1200];
const TUBO_ARRIBA: [number, number] = [430, 990];
const BOQ_SUELO: [number, number] = [300, 1346];
const BOQ_ALTA: [number, number] = [320, 1150];
const SALIDA: [number, number] = [1010, 1236];

const suave = { ...clamp, easing: Easing.inOut(Easing.cubic) };

// Cámara: [tiempo, centro x, centro y, zoom]
const camaraKeys = (): [number, number, number, number][] => [
  [0, 560, 1180, 1.25],
  [T.columna - 0.3, 560, 1180, 1.28],
  [T.columna + 0.9, 540, 200, 0.5],
  [T.pesa - 0.2, 540, 200, 0.52],
  [T.pesa + 0.8, 540, 1060, 1.0],
  [T.ventilador - 0.4, 540, 1060, 1.03],
  [T.ventilador + 0.6, 790, 1236, 3.1],
  [T.fuera - 0.4, 790, 1236, 3.2],
  [T.fuera + 0.6, 440, 1200, 1.85],
  [T.chorro - 0.4, 440, 1200, 1.9],
  [T.chorro + 0.6, 290, 1290, 3.1],
  [T.tapa - 0.4, 290, 1290, 3.15],
  [T.tapa + 0.6, 330, 1190, 2.7],
  [T.mano - 0.4, 330, 1190, 2.75],
  [T.mano + 0.5, 330, 1200, 2.5],
  [T.noChupa - 0.4, 330, 1200, 2.55],
  [T.noChupa + 0.6, 560, 1180, 1.25],
  [T.fin, 560, 1180, 1.28],
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

// Punto a lo largo de una polilínea, con s entre 0 y 1
const enRuta = (pts: [number, number][], s: number): [number, number] => {
  const largos: number[] = [];
  let total = 0;
  for (let k = 0; k < pts.length - 1; k++) {
    const l = Math.hypot(pts[k + 1][0] - pts[k][0], pts[k + 1][1] - pts[k][1]);
    largos.push(l);
    total += l;
  }
  let d = Math.max(0, Math.min(1, s)) * total;
  for (let k = 0; k < largos.length; k++) {
    if (d <= largos[k] || k === largos.length - 1) {
      const p = largos[k] === 0 ? 0 : Math.min(1, d / largos[k]);
      return [pts[k][0] + (pts[k + 1][0] - pts[k][0]) * p, pts[k][1] + (pts[k + 1][1] - pts[k][1]) * p];
    }
    d -= largos[k];
  }
  return pts[pts.length - 1];
};

// Moléculas de aire de la habitación (puntos que tiemblan)
const AIRE = new Array(230).fill(0).map((_, i) => ({
  x: -150 + random(`ax${i}`) * 1350,
  y: 640 + random(`ay${i}`) * (SUELO - 650),
  f: random(`af${i}`) * Math.PI * 2,
}));
// Columna de aire: más densa abajo, cada vez más rala hacia arriba
const COLUMNA = new Array(260).fill(0).map((_, i) => ({
  x: 150 + random(`cx${i}`) * 780,
  y: SUELO - 3200 * (-Math.log(1 - 0.95 * random(`cy${i}`)) / 3),
  f: random(`cf${i}`) * Math.PI * 2,
}));
// Moléculas dentro del cuerpo (se ven por la ventana del corte)
const DENTRO = new Array(14).fill(0).map((_, i) => ({
  x: VENTANA.x + 14 + random(`dx${i}`) * (VENTANA.w - 140),
  y: VENTANA.y + 14 + random(`dy${i}`) * (VENTANA.h - 28),
  f: random(`df${i}`) * Math.PI * 2,
  r: random(`dr${i}`),
}));
// Partículas del chorro: salen de alrededor de la boquilla y recorren todo el aparato
const CHORRO = new Array(36).fill(0).map((_, i) => ({
  ang: Math.PI * (1.05 + 0.9 * random(`ca${i}`)),
  dist: 160 + random(`cd${i}`) * 220,
  fase: random(`cp${i}`),
}));
// Suciedad del suelo: polvo, migas y pelos
type Mota = { x: number; tipo: "polvo" | "miga" | "pelo"; t0: number; giro: number };
const MOTAS: Mota[] = [
  { x: 180, tipo: "miga", t0: 1.0, giro: 20 },
  { x: 230, tipo: "polvo", t0: 1.4, giro: 0 },
  { x: 380, tipo: "pelo", t0: 1.9, giro: 0 },
  { x: 140, tipo: "polvo", t0: 2.5, giro: 0 },
  { x: 420, tipo: "miga", t0: 3.0, giro: -30 },
  { x: 110, tipo: "pelo", t0: T.polvo - 0.3, giro: 0 },
  { x: 200, tipo: "polvo", t0: T.polvo, giro: 0 },
  { x: 460, tipo: "miga", t0: T.polvo + 0.4, giro: 40 },
  { x: 160, tipo: "miga", t0: T.polvo + 0.8, giro: -10 },
  { x: 410, tipo: "pelo", t0: T.polvo + 1.2, giro: 0 },
  { x: 90, tipo: "polvo", t0: T.viento, giro: 0 },
  { x: 500, tipo: "polvo", t0: T.viento + 0.4, giro: 0 },
];

const Flecha: React.FC<{ readonly x: number; readonly y: number; readonly ang: number; readonly largo: number; readonly color: string; readonly o: number; readonly grosor?: number }> = ({
  x,
  y,
  ang,
  largo,
  color,
  o,
  grosor = 8,
}) => {
  if (o <= 0) {
    return null;
  }
  // (x, y) es la punta; la flecha llega desde la dirección opuesta a `ang`
  const dx = Math.cos(ang);
  const dy = Math.sin(ang);
  const bx = x - dx * largo;
  const by = y - dy * largo;
  const a = grosor * 2.4;
  return (
    <g opacity={o}>
      <line x1={bx} y1={by} x2={x - dx * a * 0.6} y2={y - dy * a * 0.6} stroke={color} strokeWidth={grosor} strokeLinecap="round" />
      <polyline
        points={`${x - dx * a - dy * a * 0.7},${y - dy * a + dx * a * 0.7} ${x},${y} ${x - dx * a + dy * a * 0.7},${y - dy * a - dx * a * 0.7}`}
        fill="none"
        stroke={color}
        strokeWidth={grosor}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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

const MotaDibujo: React.FC<{ readonly tipo: Mota["tipo"]; readonly giro: number }> = ({ tipo, giro }) => {
  if (tipo === "polvo") {
    return (
      <g>
        <circle r={7} fill="#8C88A8" opacity={0.8} />
        <circle cx={6} cy={-4} r={4} fill="#8C88A8" opacity={0.6} />
      </g>
    );
  }
  if (tipo === "miga") {
    return <polygon points="-9,-6 8,-8 10,5 -6,8" fill="#C8964A" transform={`rotate(${giro})`} />;
  }
  return <path d="M -16 2 C -8 -10, 2 10, 16 -2" fill="none" stroke="#B8B4CC" strokeWidth={2} strokeLinecap="round" />;
};

export const Sala: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const { cx, cy, zoom } = camara(t);
  const sx = (x: number) => 540 + (x - cx) * zoom;
  const sy = (y: number) => 960 + (y - cy) * zoom;

  // Boquilla: en el suelo; se levanta cuando algo la tapa
  const alza = interpolate(t, [T.tapa - 0.2, T.tapa + 0.6, T.noChupa, T.noChupa + 0.8], [0, 1, 1, 0], suave);
  const nx = BOQ_SUELO[0] + (BOQ_ALTA[0] - BOQ_SUELO[0]) * alza;
  const ny = BOQ_SUELO[1] + (BOQ_ALTA[1] - BOQ_SUELO[1]) * alza;
  const cuello: [number, number] = [nx + 20, ny - 34];

  // Flujo de aire: encendido desde el principio; se corta mientras la boquilla está tapada
  const tapada = interpolate(t, [T.diferencia, T.diferencia + 0.5, T.noChupa + 0.2, T.noChupa + 0.8], [0, 1, 1, 0], clamp);
  const realce = interpolate(t, [T.empujones - 0.2, T.empujones + 0.4, T.tapa - 0.3, T.tapa], [0, 1, 1, 0], clamp);
  const flujo = (0.55 + 0.45 * realce) * (1 - tapada);

  // Columna de aire y su empuje sobre el suelo
  const columna = interpolate(t, [T.columna - 0.3, T.columna + 0.5, T.ventilador - 0.5, T.ventilador], [0, 1, 1, 0], clamp);
  const aprieta = interpolate(t, [T.pesa, T.pesa + 0.5, T.ventilador - 0.5, T.ventilador], [0, 1, 1, 0], clamp);

  // Dentro del cuerpo: menos aire cuando el ventilador lo saca
  const densidad = interpolate(t, [T.menosAire - 0.3, T.veinte], [1, 0.8], clamp);
  const sacaAire = interpolate(t, [T.saca - 0.2, T.saca + 0.4], [0, 1], clamp) * (1 - tapada * 0.6);

  // Empujones: flechas amarillas de la presión de fuera hacia la boquilla
  const empujon = interpolate(t, [T.empujones - 0.2, T.empujones + 0.4, T.chorro - 0.3, T.chorro], [0, 1, 1, 0], clamp);
  // Calcetín y mano
  const calcetin = interpolate(t, [T.tapa, T.diferencia + 0.4], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const calcetinO = interpolate(t, [T.tapa - 0.3, T.tapa, T.mano - 0.3, T.mano], [0, 1, 1, 0], clamp);
  const empujeCal = interpolate(t, [T.diferencia + 0.4, T.diferencia + 0.8, T.mano - 0.3, T.mano], [0, 1, 1, 0], clamp);
  const mano = interpolate(t, [T.mano - 0.1, T.mano + 0.5, T.noChupa - 0.2, T.noChupa + 0.2], [0, 1, 1, 0], suave);
  const empujeMano = interpolate(t, [T.atmosferaMano - 0.2, T.atmosferaMano + 0.3, T.noChupa - 0.2, T.noChupa + 0.2], [0, 1, 1, 0], clamp);

  // Etiquetas de presión
  const tagFuera = interpolate(t, [T.fuera, T.fuera + 0.4, T.chorro - 0.3, T.chorro], [0, 1, 1, 0], clamp);
  const tagDentro = interpolate(t, [T.fuera + 0.4, T.fuera + 0.8, T.chorro - 0.3, T.chorro], [0, 1, 1, 0], clamp);
  const tagCal = interpolate(t, [T.diferencia + 0.6, T.diferencia + 1.0, T.mano - 0.3, T.mano], [0, 1, 1, 0], clamp);

  const ruta: [number, number][] = [
    [nx, ny - 4],
    cuello,
    TUBO_ARRIBA,
    [520, 1090],
    ENTRADA,
    [VENT.x - 40, VENT.y],
    [VENT.x, VENT.y],
    SALIDA,
  ];
  const mangueraD = `M ${ENTRADA[0]} ${ENTRADA[1]} C 520 1200, 470 1080, ${TUBO_ARRIBA[0]} ${TUBO_ARRIBA[1]}`;
  const recorridoD = `M ${nx} ${ny - 4} L ${cuello[0]} ${cuello[1]} L ${TUBO_ARRIBA[0]} ${TUBO_ARRIBA[1]} C 470 1080, 520 1200, ${ENTRADA[0]} ${ENTRADA[1]} L ${VENT.x} ${VENT.y} L ${SALIDA[0]} ${SALIDA[1]}`;

  return (
    <svg width={W} height={H} style={{ position: "absolute" }}>
      <defs>
        <filter id="brillo-asp" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
        <linearGradient id="col-asp" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor={C.cyan} stopOpacity={0.22} />
          <stop offset="1" stopColor={C.cyan} stopOpacity={0} />
        </linearGradient>
      </defs>
      <g transform={`translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`}>
        {/* Columna de aire sobre el suelo */}
        {columna > 0 ? (
          <g opacity={columna}>
            <rect x={150} y={SUELO - 3400} width={780} height={3400} fill="url(#col-asp)" />
            {COLUMNA.map((m, i) => (
              <circle key={i} cx={m.x + 4 * Math.sin(t * 3 + m.f)} cy={m.y + 4 * Math.cos(t * 2.6 + m.f)} r={5} fill={C.white} opacity={0.55} />
            ))}
          </g>
        ) : null}

        {/* Suelo */}
        <rect x={-800} y={SUELO} width={2700} height={900} fill="#120E28" />
        <line x1={-800} y1={SUELO} x2={1900} y2={SUELO} stroke="#2A2350" strokeWidth={4} />
        <rect x={20} y={SUELO + 4} width={620} height={14} rx={7} fill="#2A2350" opacity={0.7} />

        {/* Moléculas de aire de la habitación */}
        {AIRE.map((m, i) => (
          <circle key={i} cx={m.x + 5 * Math.sin(t * 3.2 + m.f)} cy={m.y + 5 * Math.cos(t * 2.8 + m.f)} r={3.2} fill={C.white} opacity={0.32 * (1 - columna * 0.7)} />
        ))}

        {/* Empuje de la columna sobre el suelo */}
        {[220, 380, 540, 700, 860].map((x) => (
          <Flecha key={x} x={x} y={SUELO - 14} ang={Math.PI / 2} largo={150} color={C.yellow} o={aprieta} grosor={12} />
        ))}

        {/* Manguera y tubo */}
        <path d={mangueraD} fill="none" stroke="#3A2F6A" strokeWidth={30} strokeLinecap="round" />
        <path d={mangueraD} fill="none" stroke="#5A4A8A" strokeWidth={30} strokeDasharray="4 12" />
        <line x1={TUBO_ARRIBA[0]} y1={TUBO_ARRIBA[1]} x2={cuello[0]} y2={cuello[1]} stroke="#8C88A8" strokeWidth={20} strokeLinecap="round" />
        {/* Boquilla */}
        <path d={`M ${nx - 82} ${ny} L ${nx - 66} ${ny - 34} L ${nx + 66} ${ny - 34} L ${nx + 82} ${ny} Z`} fill="#2A2350" stroke={C.purpleLight} strokeWidth={4} strokeLinejoin="round" />
        <rect x={nx - 70} y={ny - 6} width={140} height={6} fill={C.bgDeep} />

        {/* Cuerpo en corte */}
        <rect x={CUERPO.x} y={CUERPO.y} width={CUERPO.w} height={CUERPO.h} rx={70} fill={C.purple} />
        <rect x={VENTANA.x} y={VENTANA.y} width={VENTANA.w} height={VENTANA.h} rx={26} fill={C.bgDeep} stroke={C.purpleLight} strokeWidth={4} />
        <rect x={VENTANA.x + 12} y={VENTANA.y + 14} width={70} height={VENTANA.h - 28} rx={14} fill="#2A2350" opacity={0.9} />
        <text x={VENTANA.x + 47} y={VENTANA.y + VENTANA.h / 2 + 7} textAnchor="middle" fill={C.grey} fontFamily={mono} fontSize={16}>
          bolsa
        </text>
        {DENTRO.map((m, i) =>
          m.r < densidad ? (
            <circle key={i} cx={m.x + 4 * Math.sin(t * 4 + m.f)} cy={m.y + 4 * Math.cos(t * 3.4 + m.f)} r={3.2} fill={C.white} opacity={0.6} />
          ) : null,
        )}
        {/* Ventilador */}
        <g transform={`translate(${VENT.x} ${VENT.y}) rotate(${t * 900})`}>
          {[0, 1, 2, 3, 4, 5].map((k) => (
            <path key={k} d={`M 0 0 C 14 -18, 40 -24, ${VENT.r} -10 L ${VENT.r - 6} 6 C 34 4, 14 4, 0 0 Z`} fill={C.purpleLight} transform={`rotate(${k * 60})`} />
          ))}
          <circle r={12} fill={C.white} />
        </g>
        <circle cx={VENT.x} cy={VENT.y} r={VENT.r + 6} fill="none" stroke={C.purpleLight} strokeWidth={2} opacity={0.5} />
        {/* Rejilla de salida */}
        {[1190, 1214, 1238, 1262, 1286].map((y) => (
          <line key={y} x1={CUERPO.x + CUERPO.w - 6} y1={y} x2={CUERPO.x + CUERPO.w + 8} y2={y} stroke={C.bgDeep} strokeWidth={8} strokeLinecap="round" />
        ))}
        {/* Ruedas */}
        <circle cx={660} cy={1328} r={22} fill="#2A2350" stroke={C.purpleLight} strokeWidth={3} />
        <circle cx={860} cy={1328} r={22} fill="#2A2350" stroke={C.purpleLight} strokeWidth={3} />

        {/* Aire que sale por detrás */}
        {[1196, 1236, 1276].map((y, k) => {
          const avance = (t * 1.6 + k * 0.33) % 1;
          return (
            <Flecha
              key={y}
              x={CUERPO.x + CUERPO.w + 40 + avance * 90}
              y={y}
              ang={0}
              largo={46}
              color={C.white}
              o={sacaAire * flujo * interpolate(avance, [0, 0.2, 0.8, 1], [0, 1, 1, 0])}
              grosor={6}
            />
          );
        })}

        {/* Corriente de aire por dentro del aparato */}
        {flujo > 0.01 ? (
          <>
            <path d={recorridoD} fill="none" stroke={C.cyan} strokeWidth={6} strokeDasharray="20 14" strokeDashoffset={-160 * t} opacity={flujo * 0.6} filter="url(#brillo-asp)" />
            <path d={recorridoD} fill="none" stroke={C.cyan} strokeWidth={4} strokeDasharray="20 14" strokeDashoffset={-160 * t} opacity={flujo} />
          </>
        ) : null}
        {/* Moléculas que entran por la boquilla desde la habitación */}
        {CHORRO.map((p, i) => {
          const s = (t * 0.32 + p.fase) % 1;
          const inicio: [number, number] = [nx + Math.cos(p.ang) * p.dist, Math.min(SUELO - 10, ny + Math.sin(p.ang) * p.dist * 0.8)];
          const [x, y] = s < 0.35 ? enRuta([inicio, [nx, ny - 4]], s / 0.35) : enRuta(ruta, (s - 0.35) / 0.65);
          const o = interpolate(s, [0, 0.08, 0.9, 1], [0, 1, 1, 0]) * flujo;
          return o > 0.01 ? <circle key={i} cx={x} cy={y} r={3.6} fill={C.white} opacity={o} /> : null;
        })}

        {/* Suciedad: se desliza hasta la boquilla y sube por el tubo */}
        {MOTAS.map((m, i) => {
          const viaje = interpolate(t, [m.t0, m.t0 + 0.9], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
          if (viaje >= 1) {
            return null;
          }
          const [x, y] =
            viaje < 0.6
              ? [m.x + (nx - m.x) * (viaje / 0.6), SUELO - 8 - (viaje / 0.6) ** 3 * 4]
              : enRuta([[nx, SUELO - 12], [nx, ny - 10], cuello, TUBO_ARRIBA], (viaje - 0.6) / 0.4);
          return (
            <g key={i} transform={`translate(${x} ${y})`} opacity={viaje > 0.75 ? 0.4 : 1}>
              <MotaDibujo tipo={m.tipo} giro={m.giro + viaje * 400} />
            </g>
          );
        })}

        {/* Calcetín: sube desde el suelo y se queda pegado a la boquilla */}
        {calcetinO > 0 ? (
          <g opacity={calcetinO} transform={`translate(${nx} ${SUELO - 30 + (ny + 26 - (SUELO - 30)) * calcetin}) rotate(${(1 - calcetin) * -40})`}>
            <path d="M -84 -24 L 56 -24 C 84 -24, 96 -14, 96 2 C 96 18, 84 24, 62 24 L -84 24 Z" fill="#186878" />
            <ellipse cx={18} cy={24} rx={24} ry={13} fill="#186878" />
            <path d="M 70 -24 C 92 -22, 96 -8, 96 2 C 96 14, 90 22, 70 24 Z" fill="#2A9AA8" />
            <rect x={-84} y={-24} width={30} height={48} rx={6} fill="#2A9AA8" />
            <path d="M -76 -20 L -76 20 M -68 -20 L -68 20 M -60 -20 L -60 20" stroke="#186878" strokeWidth={3} />
          </g>
        ) : null}
        {[-60, -20, 20, 60].map((dx) => (
          <Flecha key={dx} x={nx + dx} y={ny + 70} ang={-Math.PI / 2} largo={70} color={C.yellow} o={empujeCal} grosor={7} />
        ))}

        {/* Mano tapando la boquilla, la atmósfera la aprieta desde abajo */}
        {mano > 0 ? (
          <g opacity={mano} transform={`translate(${nx} ${ny + 4 + (1 - mano) * 60})`}>
            <rect x={-96} y={0} width={180} height={44} rx={22} fill="#C98A64" />
            <rect x={-104} y={10} width={60} height={30} rx={15} fill="#B87A56" />
            <path d="M -40 30 L 20 30 M -40 14 L 20 14" stroke="#A86A48" strokeWidth={4} strokeLinecap="round" />
            <path d="M 70 20 C 110 30, 140 80, 150 160 L 70 160 C 64 100, 40 60, 20 44 Z" fill="#C98A64" />
          </g>
        ) : null}
        {[-70, -30, 10, 50].map((dx) => (
          <Flecha key={dx} x={nx + dx} y={ny + 58} ang={-Math.PI / 2} largo={70} color={C.yellow} o={empujeMano} grosor={7} />
        ))}

        {/* Empujones del aire de fuera hacia la boquilla */}
        {[Math.PI * 1.1, Math.PI * 1.35, Math.PI * 1.65, Math.PI * 1.9].map((a, k) => {
          const vaiven = 14 * Math.sin(t * 6 + k);
          const r = 150 + vaiven;
          return (
            <Flecha key={k} x={nx + Math.cos(a) * 95} y={Math.min(SUELO - 20, ny - 20 + Math.sin(a) * 95)} ang={a + Math.PI} largo={r - 95} color={C.yellow} o={empujon} grosor={7} />
          );
        })}
      </g>

      {/* Etiquetas de presión (tamaño constante en pantalla) */}
      <Tag x={sx(nx + 40)} y={sy(SUELO - 190)} dx={-20} dy={-150} texto="fuera: 100 %" color={C.yellow} o={tagFuera} />
      <Tag x={sx(ENTRADA[0] - 10)} y={sy(ENTRADA[1] - 6)} dx={-30} dy={-230} texto="dentro: 80 %" color={C.cyan} o={tagDentro} />
      <Tag x={sx(nx)} y={sy(ny - 40)} dx={130} dy={-150} texto="dentro: 80 %" color={C.cyan} o={tagCal} />
      <Tag x={sx(nx - 40)} y={sy(ny + 90)} dx={-120} dy={170} texto="fuera: 100 %" color={C.yellow} o={tagCal} />
    </svg>
  );
};

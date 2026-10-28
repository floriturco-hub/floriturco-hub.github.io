import { Easing, interpolate } from "remotion";
import { Cara } from "../components/Cara";
import { C, clamp, H, mono, useT, W } from "../theme";
import { T } from "./tiempos";

// Dormitorio de noche: alguien boca arriba en la cama, la puerta a la derecha y su cerebro dibujado encima
type P2 = [number, number];
const SUELO = 1560;
const CAMA = { x: 60, w: 720, y: 1300 };
const CABEZA: P2 = [200, 1236];
const ESCALA_CARA = 0.8;
// Ojo de la cara tumbada: (47, -4) local girado −90° y escalado
const OJO: P2 = [CABEZA[0] - 4 * ESCALA_CARA, CABEZA[1] - 47 * ESCALA_CARA];
const PECHO: P2 = [400, 1236];
const MANO: P2 = [470, 1240];
const PIE: P2 = [742, 1250];
const CEREBRO: P2 = [250, 1070];
const PUERTA = { x: 860, y: 880, w: 180 };
const PIEL = "#C98A64";
const APAGADO = "#4A4270";

const suave = { ...clamp, easing: Easing.inOut(Easing.cubic) };

// Cámara: [tiempo, centro x, centro y, zoom]
const camaraKeys = (): [number, number, number, number][] => [
  [0, 250, 1210, 3.0],
  [T.dedo - 0.4, 250, 1210, 3.05],
  [T.dedo + 0.4, 400, 1220, 1.8],
  [T.sientes - 0.2, 400, 1220, 1.85],
  [T.sientes + 0.7, 880, 1200, 1.35],
  [T.parece - 0.2, 880, 1200, 1.38],
  [T.parece + 0.7, 540, 1180, 1.0],
  [T.cerebro - 0.3, 540, 1180, 1.02],
  [T.cerebro + 0.6, 320, 1150, 1.9],
  [T.suenas - 0.3, 320, 1150, 1.95],
  [T.suenas + 0.6, 450, 1180, 1.25],
  [T.aVeces - 0.3, 450, 1180, 1.28],
  [T.aVeces + 0.6, 300, 1160, 2.1],
  [T.sueno - 0.3, 300, 1160, 2.15],
  [T.sueno + 0.6, 600, 1180, 1.05],
  [T.uno - 0.3, 600, 1180, 1.07],
  [T.uno + 0.6, 540, 1260, 0.95],
  [T.siTePasa - 0.3, 540, 1260, 0.97],
  [T.siTePasa + 0.6, 560, 1220, 1.3],
  [T.medico - 0.3, 560, 1220, 1.32],
  [T.medico + 0.6, 540, 1240, 1.0],
  [T.despiertoFinal - 0.2, 540, 1240, 1.0],
  [T.despiertoFinal + 0.6, 400, 1170, 1.6],
  [T.fin, 400, 1170, 1.65],
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

// Cerebro esquemático: nube de lóbulos que pasa de "soñando" (morado) a "despierto" (amarillo)
const Cerebro: React.FC<{ readonly x: number; readonly y: number; readonly despierto: number; readonly o: number; readonly t: number }> = ({ x, y, despierto, o, t }) => {
  if (o <= 0) {
    return null;
  }
  const color = despierto > 0.5 ? C.yellow : C.purpleLight;
  const lobulos: [number, number, number][] = [
    [-34, 4, 26],
    [-14, -14, 28],
    [14, -16, 28],
    [36, 0, 26],
    [18, 16, 24],
    [-10, 18, 24],
  ];
  return (
    <g opacity={o} transform={`translate(${x} ${y})`}>
      <circle r={74} fill={color} opacity={0.18 * (0.6 + 0.4 * Math.sin(t * 3))} />
      {lobulos.map(([lx, ly, r], i) => (
        <circle key={i} cx={lx} cy={ly} r={r} fill={color} opacity={0.85} />
      ))}
      <path d="M -30 2 q 10 -10 20 0 q 10 10 20 0 q 10 -10 20 0" fill="none" stroke={C.bgDeep} strokeWidth={4} strokeLinecap="round" opacity={0.4} />
      {despierto < 0.5 ? (
        <text x={56} y={-40} fill={C.purpleLight} fontFamily={mono} fontSize={30} fontWeight={700} opacity={0.5 + 0.5 * Math.sin(t * 2)}>
          z z
        </text>
      ) : null}
    </g>
  );
};

export const Dormitorio: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const { cx, cy, zoom } = camara(t);
  const sx = (x: number) => 540 + (x - cx) * zoom;
  const sy = (y: number) => 960 + (y - cy) * zoom;

  // Cara: ojos y miedo
  const sueno = (t >= T.suenas && t < T.consciencia + 0.4) || t < T.abres;
  const ojos = sueno ? 0 : interpolate(t, [T.abres, T.abres + 0.3], [0, 1], clamp);
  const miedo = Math.max(
    interpolate(t, [T.sientes, T.sientes + 0.6, T.pero, T.pero + 0.6], [0, 1, 1, 0], clamp),
    interpolate(t, [T.sombras, T.sombras + 0.6, T.uno, T.uno + 0.6], [0, 1, 1, 0], clamp),
  );

  // Sombra en la puerta y peso en el pecho (alucinaciones)
  const sombra = Math.max(
    interpolate(t, [T.sientes, T.sientes + 0.8, T.cerebro - 0.4, T.cerebro], [0, 1, 1, 0], clamp),
    interpolate(t, [T.sombras - 0.2, T.sombras + 0.6, T.uno - 0.3, T.uno + 0.3], [0, 1, 1, 0], clamp),
  );
  const peso = interpolate(t, [T.peso - 0.1, T.peso + 0.5, T.uno - 0.3, T.uno + 0.3], [0, 1, 1, 0], clamp);

  // Cerebro: soñando durante la fase REM, despierto cuando vuelve la consciencia
  const cerebroO = interpolate(t, [T.cerebro - 0.1, T.cerebro + 0.4, T.uno - 0.3, T.uno], [0, 1, 1, 0], clamp)
    + interpolate(t, [T.despiertoFinal - 0.2, T.despiertoFinal + 0.3], [0, 1], clamp);
  const despierto = t < T.suenas ? 1 : t < T.consciencia ? 0 : 1;
  const restos = interpolate(t, [T.sueno, T.sueno + 0.5, T.uno - 0.3, T.uno], [0, 1, 1, 0], clamp);

  // Bloqueo de los músculos: activo desde la fase REM hasta que se mueve el dedo del pie
  const bloqueo = interpolate(t, [T.desconecta, T.desconecta + 0.8], [0, 1], clamp) * interpolate(t, [T.dedoPie + 0.6, T.dedoPie + 1.4], [1, 0], clamp)
    + interpolate(t, [T.despiertoFinal, T.despiertoFinal + 0.6], [0, 1], clamp);
  const musculos = interpolate(t, [T.suenas + 0.3, T.suenas + 0.8, T.consciencia, T.uno], [0, 1, 1, 0], clamp)
    + interpolate(t, [T.siTePasa, T.siTePasa + 0.4, T.medico, T.medico + 0.4], [0, 1, 1, 0], clamp);
  const colorMusculo = bloqueo > 0.5 ? APAGADO : C.cyan;
  const vivos = interpolate(t, [T.libran - 0.1, T.libran + 0.4, T.uno - 0.3, T.uno], [0, 1, 1, 0], clamp);
  const candado = interpolate(t, [T.bloqueo - 0.2, T.bloqueo + 0.3, T.dedoPie + 0.6, T.dedoPie + 1.2], [0, 1, 1, 0], clamp)
    + interpolate(t, [T.despiertoFinal, T.despiertoFinal + 0.5], [0, 1], clamp);

  // El candado solo se abre cuando se mueve el dedo del pie; al final vuelve cerrado (cuerpo dormido)
  const abreCandado = t < T.despiertoFinal ? interpolate(t, [T.dedoPie + 0.4, T.dedoPie + 0.7], [0, 1], clamp) : 0;

  // Respiración (sube y baja el pecho) y dedo del pie que se mueve
  const respira = Math.sin(t * (t > T.respira && t < T.medico ? 1.6 : 2.6)) * 6;
  const dedoPie = t > T.dedoPie ? Math.max(0, Math.sin((t - T.dedoPie) * 14)) * 14 * interpolate(t, [T.dedoPie, T.dedoPie + 1.6], [1, 0], clamp) : 0;
  const intentoDedo = t > T.noPuedes && t < T.sientes ? Math.sin(t * 30) * 1.5 : 0;

  // Etiquetas ancladas
  const tagSombra = interpolate(t, [T.sientes + 0.6, T.sientes + 1.0, T.parece - 0.2, T.parece + 0.2], [0, 1, 1, 0], clamp);
  const tagOjos = interpolate(t, [T.libran, T.libran + 0.4, T.seguro - 0.2, T.seguro + 0.2], [0, 1, 1, 0], clamp);
  const tagResp = interpolate(t, [T.respiracion, T.respiracion + 0.4, T.aVeces - 0.4, T.aVeces], [0, 1, 1, 0], clamp);
  const tagDespierto = interpolate(t, [T.despierto, T.despierto + 0.4, T.sueno - 0.3, T.sueno], [0, 1, 1, 0], clamp);
  const tagPie = interpolate(t, [T.dedoPie, T.dedoPie + 0.4, T.medico - 0.3, T.medico], [0, 1, 1, 0], clamp);

  return (
    <svg width={W} height={H} style={{ position: "absolute" }}>
      <defs>
        <filter id="brillo-pr" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
        <filter id="niebla-pr" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
      </defs>
      <g transform={`translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`}>
        {/* Suelo, ventana y puerta */}
        <rect x={-800} y={SUELO} width={2700} height={900} fill="#120E28" />
        <line x1={-800} y1={SUELO} x2={1900} y2={SUELO} stroke="#2A2350" strokeWidth={4} />
        <rect x={340} y={830} width={200} height={220} rx={10} fill="#0E1028" stroke="#3A3360" strokeWidth={6} />
        <line x1={440} y1={830} x2={440} y2={1050} stroke="#3A3360" strokeWidth={4} />
        <circle cx={500} cy={890} r={20} fill="#E8E6F0" opacity={0.7} />
        <rect x={PUERTA.x} y={PUERTA.y} width={PUERTA.w} height={SUELO - PUERTA.y} fill="#2A2650" stroke="#3A3360" strokeWidth={8} />

        {/* Silueta en la puerta (alucinación) */}
        {sombra > 0 ? (
          <g opacity={sombra * 0.9} filter="url(#niebla-pr)">
            <circle cx={PUERTA.x + 90} cy={1060} r={46} fill="#000000" />
            <path d={`M ${PUERTA.x + 20} 1560 C ${PUERTA.x + 20} 1200, ${PUERTA.x + 40} 1120, ${PUERTA.x + 90} 1110 C ${PUERTA.x + 140} 1120, ${PUERTA.x + 160} 1200, ${PUERTA.x + 160} 1560 Z`} fill="#000000" />
          </g>
        ) : null}

        {/* Cama */}
        <rect x={CAMA.x + 20} y={CAMA.y + 40} width={16} height={SUELO - CAMA.y - 40} fill="#3A3360" />
        <rect x={CAMA.x + CAMA.w - 36} y={CAMA.y + 40} width={16} height={SUELO - CAMA.y - 40} fill="#3A3360" />
        <rect x={CAMA.x - 24} y={CAMA.y - 150} width={26} height={SUELO - CAMA.y + 150} rx={8} fill="#3A3360" />
        <rect x={CAMA.x} y={CAMA.y} width={CAMA.w} height={46} rx={14} fill="#582888" />
        <rect x={CAMA.x} y={CAMA.y} width={CAMA.w} height={14} rx={7} fill="#8A5CC8" opacity={0.6} />
        <rect x={90} y={1268} width={210} height={34} rx={17} fill="#C8C4D8" />

        {/* Cabeza (componente común de caras) */}
        <Cara x={CABEZA[0]} y={CABEZA[1]} escala={ESCALA_CARA} giro={-90} ojos={ojos} miedo={miedo} />

        {/* Cuerpo bajo la manta: el pecho sube y baja; el pie puede moverse */}
        <path
          d={`M 280 1300 C 280 1238, 320 ${1220 - respira}, 400 ${1218 - respira} C 470 ${1218 - respira}, 500 1232, 560 1236 L 680 1238 C 720 1238, 730 ${1226 - dedoPie}, 750 ${1222 - dedoPie} C 770 ${1222 - dedoPie}, 772 1260, 772 1300 Z`}
          fill="#1E5C78"
        />
        <path d={`M 280 1300 C 280 1238, 320 ${1220 - respira}, 400 ${1218 - respira}`} fill="none" stroke="#2A9AA8" strokeWidth={4} />
        {/* Brazo y mano sobre la manta */}
        <rect x={300} y={1228 - respira * 0.5} width={170} height={26} rx={13} fill={PIEL} />
        <g transform={`rotate(${intentoDedo} ${MANO[0]} ${MANO[1]})`}>
          <ellipse cx={MANO[0]} cy={MANO[1] - respira * 0.5} rx={20} ry={15} fill="#B87A56" />
        </g>

        {/* Músculos: activos (cian) o desconectados (gris) */}
        {musculos > 0 ? (
          <g opacity={Math.min(1, musculos)}>
            <path d={`M 310 ${1240 - respira * 0.5} L ${MANO[0] - 10} ${MANO[1] - respira * 0.5}`} stroke={colorMusculo} strokeWidth={7} strokeLinecap="round" strokeDasharray={bloqueo > 0.5 ? "10 10" : "0"} />
            <path d={`M 520 1250 C 600 1250, 680 1250, ${PIE[0]} ${PIE[1] - dedoPie}`} fill="none" stroke={colorMusculo} strokeWidth={7} strokeLinecap="round" strokeDasharray={bloqueo > 0.5 ? "10 10" : "0"} />
            <path d="M 300 1262 C 360 1256, 440 1256, 520 1258" fill="none" stroke={colorMusculo} strokeWidth={7} strokeLinecap="round" strokeDasharray={bloqueo > 0.5 ? "10 10" : "0"} />
          </g>
        ) : null}
        {/* Lo que sigue funcionando: ojos y respiración */}
        {vivos > 0 ? (
          <g opacity={vivos}>
            <circle cx={OJO[0]} cy={OJO[1]} r={16 + 3 * Math.sin(t * 9)} fill={C.cyan} opacity={0.45} filter="url(#brillo-pr)" />
            <ellipse cx={PECHO[0]} cy={PECHO[1] - respira} rx={46 + respira} ry={22} fill={C.cyan} opacity={0.35} filter="url(#brillo-pr)" />
          </g>
        ) : null}
        {/* Candado del bloqueo */}
        {candado > 0 ? (
          <g opacity={Math.min(1, candado)} transform={`translate(560 ${1170 - 30 * interpolate(t, [T.dedoPie + 0.6, T.dedoPie + 1.2], [0, 1], clamp)})`}>
            <path
              d={`M -14 0 L -14 -14 C -14 -32, 14 -32, 14 -14 L 14 ${-2 - 12 * abreCandado}`}
              fill="none"
              stroke={C.red}
              strokeWidth={6}
              strokeLinecap="round"
              transform={`translate(0 ${-10 * abreCandado})`}
            />
            <rect x={-22} y={-2} width={44} height={34} rx={8} fill={C.red} />
            <circle cx={0} cy={14} r={5} fill={C.bgDeep} />
          </g>
        ) : null}

        {/* Peso en el pecho */}
        {peso > 0 ? (
          <g opacity={peso}>
            <ellipse cx={PECHO[0]} cy={PECHO[1] - 40} rx={80} ry={50} fill="#000000" opacity={0.75} filter="url(#niebla-pr)" />
            {[-40, 0, 40].map((dx) => (
              <path key={dx} d={`M ${PECHO[0] + dx} ${PECHO[1] - 110} L ${PECHO[0] + dx} ${PECHO[1] - 40} M ${PECHO[0] + dx - 12} ${PECHO[1] - 56} L ${PECHO[0] + dx} ${PECHO[1] - 40} L ${PECHO[0] + dx + 12} ${PECHO[1] - 56}`} fill="none" stroke={C.yellow} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
            ))}
          </g>
        ) : null}

        {/* Cerebro encima de la cabeza y restos del sueño */}
        <Cerebro x={CEREBRO[0]} y={CEREBRO[1]} despierto={despierto} o={Math.min(1, cerebroO)} t={t} />
        {restos > 0 ? (
          <g opacity={restos}>
            {[0, 1, 2].map((k) => {
              const p = (t * 0.25 + k / 3) % 1;
              return <circle key={k} cx={CEREBRO[0] + 90 + p * 500} cy={CEREBRO[1] - 20 + Math.sin(p * 6 + k) * 30} r={18 - p * 10} fill={C.purpleLight} opacity={0.6 * (1 - p)} filter="url(#brillo-pr)" />;
            })}
          </g>
        ) : null}
      </g>

      {/* Etiquetas ancladas (tamaño constante en pantalla) */}
      <Tag x={sx(PUERTA.x + 90)} y={sy(1060)} dx={-80} dy={-230} texto="¿alguien?" color={C.red} o={tagSombra} />
      <Tag x={sx(OJO[0])} y={sy(OJO[1])} dx={-20} dy={-240} texto="ojos: sí" color={C.cyan} o={tagOjos} />
      <Tag x={sx(PECHO[0])} y={sy(PECHO[1] - 10)} dx={160} dy={-230} texto="respiración: sí" color={C.cyan} o={tagResp} />
      <Tag x={sx(CEREBRO[0] + 40)} y={sy(CEREBRO[1] - 40)} dx={180} dy={-150} texto="despierto" color={C.yellow} o={tagDespierto} />
      <Tag x={sx(PIE[0])} y={sy(PIE[1] - 30)} dx={-60} dy={-220} texto="mueve un dedo" color={C.cyan} o={tagPie} />
    </svg>
  );
};

import { Easing, interpolate } from "remotion";
import { C, clamp, H, mono, useT, W } from "../theme";
import { T } from "./tiempos";

// Dormitorio de noche, cama de perfil con alguien tumbado; la cámara entra hasta su cabeza (cerebro en corte)
type P2 = [number, number];
const SUELO = 1560;
const CAMA = { x: 130, w: 820, y: 1300 };
const CABEZA: P2 = [260, 1232];
const HOMBRO: P2 = [352, 1246];
const PIERNA: P2 = [760, 1262];
const PIEL = "#C98A64";
const SUENO = "#2A2350";

const suave = { ...clamp, easing: Easing.inOut(Easing.cubic) };

// Cámara: [tiempo, centro x, centro y, zoom]
const camaraKeys = (): [number, number, number, number][] => [
  [0, 540, 1180, 1.0],
  [T.vacio - 0.4, 540, 1180, 1.02],
  [T.vacio + 0.4, 540, 1380, 0.8],
  [T.golpe, 540, 1380, 0.8],
  [T.golpe + 0.5, 540, 1180, 1.0],
  [T.cerebro - 0.5, 540, 1180, 1.05],
  [T.cerebro + 0.7, 262, 1236, 4.6],
  [T.siete - 0.3, 262, 1236, 4.7],
  [T.siete + 0.7, 540, 1180, 1.05],
  [T.dormirte - 0.3, 540, 1180, 1.05],
  [T.dormirte + 0.7, 540, 1180, 1.05],
  [T.pero - 0.3, 540, 1180, 1.05],
  [T.pero + 0.7, 262, 1236, 4.6],
  [T.manda - 0.4, 262, 1236, 4.7],
  [T.manda + 0.8, 520, 1220, 1.5],
  [T.tiron + 1.0, 520, 1220, 1.55],
  [T.vacioImagen - 0.4, 520, 1220, 1.55],
  [T.vacioImagen + 0.6, 280, 1130, 2.2],
  [T.teoria - 0.4, 280, 1130, 2.25],
  [T.teoria + 0.6, 540, 1200, 1.0],
  [T.fin, 540, 1200, 1.04],
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

// La cama completa con quien duerme; `jerk` de 0 a 1 mueve brazo y pierna
const Cama: React.FC<{ readonly jerk: number; readonly abre: number }> = ({ jerk, abre }) => (
  <g>
    {/* Patas y somier */}
    <rect x={CAMA.x + 20} y={CAMA.y + 40} width={16} height={SUELO - CAMA.y - 40} fill="#3A3360" />
    <rect x={CAMA.x + CAMA.w - 36} y={CAMA.y + 40} width={16} height={SUELO - CAMA.y - 40} fill="#3A3360" />
    <rect x={CAMA.x - 24} y={CAMA.y - 150} width={26} height={SUELO - CAMA.y + 150} rx={8} fill="#3A3360" />
    <rect x={CAMA.x} y={CAMA.y} width={CAMA.w} height={46} rx={14} fill="#582888" />
    <rect x={CAMA.x} y={CAMA.y} width={CAMA.w} height={14} rx={7} fill="#8A5CC8" opacity={0.6} />
    {/* Almohada y cabeza */}
    <rect x={150} y={1268} width={200} height={34} rx={17} fill="#C8C4D8" />
    <ellipse cx={CABEZA[0]} cy={CABEZA[1]} rx={72} ry={62} fill={PIEL} />
    <path d={`M ${CABEZA[0] - 8} ${CABEZA[1] - 62} l 12 -26 l 14 28`} fill={PIEL} />
    <path d={`M ${CABEZA[0] + 10} ${CABEZA[1] - 20} q 16 -4 28 2`} fill="none" stroke="#5A3A2A" strokeWidth={6} strokeLinecap="round" />
    <path d={`M ${CABEZA[0] + 34} ${CABEZA[1] + 16} q 14 2 24 -2`} fill="none" stroke="#5A3A2A" strokeWidth={5} strokeLinecap="round" opacity={1 - abre} />
    <ellipse cx={CABEZA[0] + 24} cy={CABEZA[1] + 6} rx={12 * (0.35 + 0.65 * abre)} ry={8 * (0.15 + 0.85 * abre)} fill="#F4EEE8" opacity={0.4 + 0.6 * abre} />
    <ellipse cx={CABEZA[0] - 22} cy={CABEZA[1] + 10} rx={22} ry={30} fill="#A86A48" />
    {/* Cuerpo bajo la manta; la pierna se levanta con el tirón */}
    <path
      d={`M 330 1300 C 330 1236, 380 1220, 450 1222 L 650 1228 C 700 1230, 720 ${1236 - 26 * jerk}, 790 ${1236 - 26 * jerk} C 860 ${1236 - 26 * jerk}, 900 1250, 904 1300 Z`}
      fill="#1E5C78"
    />
    <path d="M 330 1300 C 330 1236, 380 1220, 450 1222" fill="none" stroke="#2A9AA8" strokeWidth={4} />
    {/* Brazo sobre la manta: gira desde el hombro */}
    <g transform={`rotate(${-38 * jerk} ${HOMBRO[0]} ${HOMBRO[1]})`}>
      <rect x={HOMBRO[0] - 10} y={HOMBRO[1] - 14} width={170} height={28} rx={14} fill={PIEL} />
      <circle cx={HOMBRO[0] + 160} cy={HOMBRO[1]} r={18} fill="#B87A56" />
    </g>
  </g>
);

export const Cuarto: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const { cx, cy, zoom } = camara(t);
  const sx = (x: number) => 540 + (x - cx) * zoom;
  const sy = (y: number) => 960 + (y - cy) * zoom;

  // Sensación de caída: una cama fantasma cae mientras la real no se mueve
  const caida = interpolate(t, [T.vacio, T.golpe - 0.1], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const fantasma = interpolate(t, [T.vacio - 0.1, T.vacio + 0.1, T.golpe - 0.05, T.golpe + 0.15], [0, 1, 1, 0], clamp);
  const flash = interpolate(t, [T.golpe - 0.02, T.golpe + 0.04, T.golpe + 0.3], [0, 1, 0], clamp);
  const quieto = interpolate(t, [T.noTeHasCaido, T.noTeHasCaido + 0.5, T.cerebro - 0.3, T.cerebro], [0, 1, 1, 0], clamp);

  // Ojos: abiertos al principio, cerrándose al dormirse
  const cierra = interpolate(t, [T.dormirte - 0.2, T.zonas + 1.5], [1, 0.1], clamp);
  const sobresaltoOjos = interpolate(t, [T.golpe, T.golpe + 0.1, T.golpe + 1.0], [1, 1, 0], clamp) * (t < T.noTeHasCaido ? 1 : 0)
    + interpolate(t, [T.tiron - 0.1, T.tiron + 0.1, T.tiron + 1.0], [0, 1, 0], clamp);
  const abreFinal = Math.min(1, Math.max(cierra, sobresaltoOjos));

  // Tirón: brazo y pierna saltan
  const tiron = interpolate(t, [T.tiron - 0.02, T.tiron + 0.06, T.tiron + 0.6], [0, 1, 0], clamp);
  const sobresalto = interpolate(t, [T.golpe, T.golpe + 0.06, T.golpe + 0.5], [0, 1, 0], clamp);
  const jerk = Math.max(tiron, sobresalto);
  const temblor = Math.sin(t * 90) * 5 * jerk;

  // Cerebro en corte
  const corte = interpolate(t, [T.cerebro - 0.1, T.cerebro + 0.6, T.siete - 0.2, T.siete + 0.3], [0, 1, 1, 0], clamp)
    + interpolate(t, [T.pero - 0.1, T.pero + 0.6, T.teoria - 0.2, T.teoria + 0.3], [0, 1, 1, 0], clamp);
  const duerme = (desde: number) => interpolate(t, [desde, desde + 0.9], [0, 1], clamp);
  const sCortex = duerme(T.zonas);
  const sMotor = duerme(T.zonas + 0.7);
  const sCereb = duerme(T.zonas + 1.2);
  const mezcla = (s: number) => (s < 0.5 ? C.cyan : SUENO);
  const op = (s: number) => 1 - 0.75 * s;
  const alerta = interpolate(t, [T.parteDespierta - 0.2, T.parteDespierta + 0.4], [0.5, 1], clamp);
  const destello = 0.5 + 0.5 * Math.sin(t * 10);
  const leyendo = interpolate(t, [T.parteDespierta, T.parteDespierta + 0.4, T.manda - 0.1, T.manda], [0, 1, 1, 0], clamp);

  // Señal por el cuerpo
  const senal = interpolate(t, [T.manda, T.tiron], [0, 1], clamp);
  const senalO = interpolate(t, [T.manda - 0.1, T.manda + 0.2, T.tiron, T.tiron + 0.4], [0, 1, 1, 0], clamp);
  const pulsoA: P2 = [CABEZA[0] + (HOMBRO[0] + 60 - CABEZA[0]) * senal, CABEZA[1] + 40 + (HOMBRO[1] - CABEZA[1] - 30) * senal];
  const pulsoP: P2 = [CABEZA[0] + (PIERNA[0] - CABEZA[0]) * senal, CABEZA[1] + 50 + (PIERNA[1] - CABEZA[1] - 40) * senal];

  // Burbuja con la imagen de un vacío
  const burbuja = interpolate(t, [T.vacioImagen - 0.2, T.vacioImagen + 0.4, T.teoria - 0.5, T.teoria], [0, 1, 1, 0], clamp);
  const caeFigura = ((t * 0.9) % 1) * 90;

  // Etiquetas ancladas
  const tagFantasma = interpolate(t, [T.vacio, T.vacio + 0.3, T.golpe - 0.1, T.golpe], [0, 1, 1, 0], clamp);
  const tagBrain = interpolate(t, [T.cerebro + 0.4, T.cerebro + 0.8, T.sellama - 0.3, T.sellama], [0, 1, 1, 0], clamp);
  const tagDespierta = interpolate(t, [T.parteDespierta + 0.2, T.parteDespierta + 0.6, T.manda - 0.2, T.manda], [0, 1, 1, 0], clamp);
  const tagOrden = interpolate(t, [T.orden, T.orden + 0.3, T.tiron - 0.1, T.tiron], [0, 1, 1, 0], clamp);

  return (
    <svg width={W} height={H} style={{ position: "absolute" }}>
      <defs>
        <filter id="brillo-sd" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
        <clipPath id="craneo-sd">
          <ellipse cx={CABEZA[0]} cy={CABEZA[1]} rx={72} ry={62} />
        </clipPath>
      </defs>
      <g transform={`translate(${540 - cx * zoom + temblor} ${960 - cy * zoom}) scale(${zoom})`}>
        {/* Suelo y ventana */}
        <rect x={-800} y={SUELO} width={2700} height={900} fill="#120E28" />
        <line x1={-800} y1={SUELO} x2={1900} y2={SUELO} stroke="#2A2350" strokeWidth={4} />
        <rect x={650} y={820} width={220} height={260} rx={10} fill="#0E1028" stroke="#3A3360" strokeWidth={6} />
        <line x1={760} y1={820} x2={760} y2={1080} stroke="#3A3360" strokeWidth={4} />
        <circle cx={812} cy={900} r={22} fill="#E8E6F0" opacity={0.7} />

        {/* Cama fantasma que cae */}
        {fantasma > 0 ? (
          <g opacity={0.45 * fantasma} transform={`translate(0 ${caida * 900})`}>
            <rect x={CAMA.x} y={CAMA.y} width={CAMA.w} height={46} rx={14} fill="none" stroke={C.yellow} strokeWidth={5} strokeDasharray="14 10" />
            <ellipse cx={CABEZA[0]} cy={CABEZA[1]} rx={72} ry={62} fill="none" stroke={C.yellow} strokeWidth={5} strokeDasharray="14 10" />
            {[0, 1, 2, 3, 4].map((k) => (
              <line key={k} x1={CAMA.x + 80 + k * 160} y1={CAMA.y - 30 - caida * 220} x2={CAMA.x + 80 + k * 160} y2={CAMA.y - 120 - caida * 340} stroke={C.yellow} strokeWidth={6} strokeLinecap="round" opacity={0.7} />
            ))}
          </g>
        ) : null}

        <Cama jerk={jerk} abre={abreFinal} />

        {/* Cerebro en corte dentro de la cabeza */}
        {corte > 0 ? (
          <g opacity={Math.min(1, corte)}>
            <ellipse cx={CABEZA[0]} cy={CABEZA[1]} rx={72} ry={62} fill="#0E0B22" opacity={0.78} />
            <g clipPath="url(#craneo-sd)">
              {/* corteza */}
              <path d="M 214 1218 C 214 1180, 262 1172, 296 1186 C 322 1198, 322 1232, 296 1244 C 270 1254, 226 1250, 214 1218 Z" fill={mezcla(sCortex)} opacity={0.5 * op(sCortex)} />
              <path d="M 214 1218 C 214 1180, 262 1172, 296 1186 C 322 1198, 322 1232, 296 1244 C 270 1254, 226 1250, 214 1218 Z" fill="none" stroke={mezcla(sCortex)} strokeWidth={2.5} vectorEffect="non-scaling-stroke" opacity={op(sCortex)} />
              {/* tira motora */}
              <path d="M 258 1180 C 262 1198, 262 1214, 254 1238" fill="none" stroke={mezcla(sMotor)} strokeWidth={9} strokeLinecap="round" opacity={op(sMotor)} />
              {/* cerebelo */}
              <ellipse cx={300} cy={1252} rx={20} ry={11} fill={mezcla(sCereb)} opacity={op(sCereb)} />
              {/* tronco cerebral: sigue despierto */}
              <path d="M 262 1244 L 270 1286" stroke={C.yellow} strokeWidth={10} strokeLinecap="round" opacity={alerta} />
              <circle cx={266} cy={1262} r={14 + 5 * destello * leyendo} fill={C.yellow} opacity={0.5 * alerta} filter="url(#brillo-sd)" />
            </g>
            <ellipse cx={CABEZA[0]} cy={CABEZA[1]} rx={72} ry={62} fill="none" stroke={PIEL} strokeWidth={4} vectorEffect="non-scaling-stroke" />
          </g>
        ) : null}

        {/* Impulso que baja por el cuerpo */}
        {senalO > 0 ? (
          <g opacity={senalO}>
            <path d={`M 266 1286 Q 300 1262, ${HOMBRO[0] + 60} ${HOMBRO[1] - 6}`} fill="none" stroke={C.red} strokeWidth={4} strokeDasharray="10 8" vectorEffect="non-scaling-stroke" />
            <path d={`M 266 1292 Q 500 1250, ${PIERNA[0]} ${PIERNA[1] - 20}`} fill="none" stroke={C.red} strokeWidth={4} strokeDasharray="10 8" vectorEffect="non-scaling-stroke" />
            <circle cx={pulsoA[0]} cy={pulsoA[1]} r={14} fill={C.red} filter="url(#brillo-sd)" />
            <circle cx={pulsoA[0]} cy={pulsoA[1]} r={7} fill="#FFFFFF" />
            <circle cx={pulsoP[0]} cy={pulsoP[1]} r={14} fill={C.red} filter="url(#brillo-sd)" />
            <circle cx={pulsoP[0]} cy={pulsoP[1]} r={7} fill="#FFFFFF" />
          </g>
        ) : null}

        {/* Burbuja de pensamiento con el vacío */}
        {burbuja > 0 ? (
          <g opacity={burbuja}>
            <circle cx={CABEZA[0] + 20} cy={CABEZA[1] - 92} r={9} fill={C.white} opacity={0.5} />
            <circle cx={CABEZA[0] + 44} cy={CABEZA[1] - 124} r={14} fill={C.white} opacity={0.5} />
            <ellipse cx={CABEZA[0] + 100} cy={CABEZA[1] - 190} rx={92} ry={64} fill="#0E0B22" stroke={C.white} strokeWidth={3} vectorEffect="non-scaling-stroke" opacity={0.92} />
            <g transform={`translate(${CABEZA[0] + 100} ${CABEZA[1] - 190})`}>
              <clipPath id="burbuja-sd">
                <ellipse rx={84} ry={56} />
              </clipPath>
              <g clipPath="url(#burbuja-sd)">
                <rect x={-60} y={-8} width={120} height={14} rx={4} fill="#3A3360" />
                <circle cx={0} cy={-70 + caeFigura} r={9} fill={PIEL} />
                <rect x={-7} y={-62 + caeFigura} width={14} height={24} rx={6} fill={C.cyan} />
                <line x1={-18} y1={-22} x2={-18} y2={26} stroke={C.white} strokeWidth={2} opacity={0.4} />
                <line x1={18} y1={-22} x2={18} y2={26} stroke={C.white} strokeWidth={2} opacity={0.4} />
              </g>
            </g>
          </g>
        ) : null}
      </g>

      {/* Destello del sobresalto al despertar */}
      {flash > 0 ? <rect x={0} y={0} width={W} height={H} fill="#FFFFFF" opacity={0.35 * flash} /> : null}

      {/* Etiquetas ancladas (tamaño constante en pantalla) */}
      <Tag x={sx(CAMA.x + 400)} y={sy(CAMA.y + caida * 900)} dx={0} dy={160} texto="sensación de caída" color={C.yellow} o={tagFantasma} />
      <Tag x={sx(CAMA.x + 400)} y={sy(CAMA.y + 20)} dx={0} dy={200} texto="no te mueves" color={C.cyan} o={quieto} />
      <Tag x={sx(CABEZA[0] + 20)} y={sy(CABEZA[1] - 40)} dx={170} dy={-170} texto="cerebro" color={C.white} o={tagBrain} />
      <Tag x={sx(266)} y={sy(1262)} dx={190} dy={190} texto="sigue despierta" color={C.yellow} o={tagDespierta} />
      <Tag x={sx(HOMBRO[0] + 60)} y={sy(HOMBRO[1] - 6)} dx={50} dy={-190} texto="¡agárrate!" color={C.red} o={tagOrden} />
    </svg>
  );
};

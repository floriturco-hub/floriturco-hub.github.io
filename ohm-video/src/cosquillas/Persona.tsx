import { Easing, interpolate } from "remotion";
import { Cara } from "../components/Cara";
import { C, clamp, H, mono, useT, W } from "../theme";
import { T } from "./tiempos";

// Una persona de perfil (cara común) con su propia mano, la mano de otra persona y su cerebro dibujado dentro.
type P2 = [number, number];
const CARA: P2 = [380, 600];
const ESC = 1.9;
const local = (x: number, y: number): P2 => [CARA[0] + x * ESC, CARA[1] + y * ESC];
const MOTORA = local(14, -62);
const SENSORIAL = local(-10, -64);
const CEREBELO = local(-36, 4);
const CEREBRO_C = local(-2, -36);
const NUCA = local(-34, 104);
const HOMBRO: P2 = [440, 960];
const CONTACTO: P2 = [672, 1180];
const CAMISETA = "#2E5A78";
const MANGA = "#25496A";
const PIEL = "#C98A64";

const suave = { ...clamp, easing: Easing.inOut(Easing.cubic) };

// Cámara: [tiempo, centro x, centro y, zoom]
const camaraKeys = (): [number, number, number, number][] => [
  [0, 520, 950, 1.0],
  [T.noPuedes - 0.3, 520, 950, 1.02],
  [T.noPuedes + 0.6, 640, 1160, 2.0],
  [T.diferencia - 0.3, 640, 1160, 2.05],
  [T.diferencia + 0.6, 520, 950, 1.0],
  [T.decides - 0.3, 520, 950, 1.0],
  [T.decides + 0.6, 470, 820, 1.25],
  [T.copia - 0.3, 470, 820, 1.27],
  [T.copia + 0.6, 370, 560, 2.5],
  [T.roce - 0.3, 370, 560, 2.55],
  [T.roce + 0.6, 560, 900, 1.15],
  [T.experimento - 0.3, 560, 900, 1.17],
  [T.experimento + 0.6, 560, 820, 1.0],
  [T.alguien - 0.3, 560, 820, 1.02],
  [T.alguien + 0.6, 640, 1150, 1.9],
  [T.necesitan - 0.3, 640, 1150, 1.95],
  [T.necesitan + 0.6, 520, 950, 1.0],
  [T.fin, 520, 950, 1.03],
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

// Mano con dedos que se mueven (cosquillas); mira hacia `dir` (1 derecha, −1 izquierda)
const Mano: React.FC<{ readonly x: number; readonly y: number; readonly dir: number; readonly t: number; readonly mueve: number; readonly piel?: string }> = ({ x, y, dir, t, mueve, piel = PIEL }) => (
  <g transform={`translate(${x} ${y}) scale(${dir} 1)`}>
    <ellipse cx={0} cy={0} rx={34} ry={26} fill={piel} />
    {[-16, -2, 12].map((dy, i) => {
      const flex = Math.sin(t * 18 + i * 1.7) * 10 * mueve;
      return <path key={i} d={`M 22 ${dy} q 22 ${flex * 0.4} 40 ${4 + flex}`} fill="none" stroke={piel} strokeWidth={13} strokeLinecap="round" />;
    })}
    <path d="M 4 18 q 14 16 30 14" fill="none" stroke={piel} strokeWidth={13} strokeLinecap="round" />
  </g>
);

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

export const Persona: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const { cx, cy, zoom } = camara(t);
  const sx = (x: number) => 540 + (x - cx) * zoom;
  const sy = (y: number) => 960 + (y - cy) * zoom;

  // Quién hace cosquillas en cada momento: la propia mano (1) o la de otra persona (1)
  const propia = Math.max(
    interpolate(t, [0.3, 1.0, T.parece - 0.3, T.parece], [0, 1, 1, 0], suave),
    interpolate(t, [T.decides, T.decides + 0.8, T.experimento - 0.3, T.experimento], [0, 1, 1, 0], suave),
  );
  const ajena = Math.max(
    interpolate(t, [T.otra - 0.3, T.otra + 0.4, T.decides - 0.3, T.decides], [0, 1, 1, 0], suave),
    interpolate(t, [T.alguien - 0.3, T.alguien + 0.5, T.necesitan, T.necesitan + 0.6], [0, 1, 1, 0], suave),
  );
  // Mano propia encima de la ajena (el truco)
  const encima = interpolate(t, [T.pon - 0.1, T.pon + 0.7, T.necesitan, T.necesitan + 0.6], [0, 1, 1, 0], suave);

  // Intensidad de la sensación en el punto de contacto
  const atenuada = interpolate(t, [T.volumen - 0.2, T.volumen + 0.5], [1, 0.25], clamp);
  const sensacion = Math.max(
    propia * (t < T.parece ? 0.25 : atenuada),
    ajena * (1 - 0.5 * encima),
  );
  const risa = Math.max(ajena * (1 - 0.6 * encima), 0);

  // Brazo propio: de reposo a la barriga, o encima de la mano ajena
  const reposo: P2 = [500, 1520];
  const destino: P2 = encima > 0 ? [CONTACTO[0] + 80 * encima, CONTACTO[1] - 6] : [CONTACTO[0] - 20, CONTACTO[1]];
  const pose = Math.max(propia, encima);
  const mano: P2 = [reposo[0] + (destino[0] - reposo[0]) * pose, reposo[1] + (destino[1] - reposo[1]) * pose];
  const codo: P2 = [HOMBRO[0] + 10 + (mano[0] - HOMBRO[0]) * 0.2, HOMBRO[1] + 300 - 60 * pose];
  const manoAjena: P2 = [CONTACTO[0] + 40 + (1 - ajena) * 520, CONTACTO[1] + 4];

  // Cerebro: orden, copia y predicción
  const cerebro = interpolate(t, [T.decides, T.decides + 0.5, T.experimento - 0.3, T.experimento], [0, 1, 1, 0], clamp);
  const orden = interpolate(t, [T.orden - 0.1, T.orden + 1.0], [0, 1], suave);
  const copia = interpolate(t, [T.copia, T.cerebelo + 0.4], [0, 1], suave);
  const prediccion = interpolate(t, [T.calcula, T.calcula + 1.2], [0, 1], suave);
  const baja = interpolate(t, [T.volumen - 0.2, T.volumen + 0.4], [0, 1], clamp);

  // Etiquetas ancladas
  const tagPropia = interpolate(t, [0.8, 1.2, T.noPuedes - 0.3, T.noPuedes], [0, 1, 1, 0], clamp);
  const tagAjena = interpolate(t, [T.otra + 0.4, T.otra + 0.8, T.decides - 0.4, T.decides], [0, 1, 1, 0], clamp);
  const tagCerebelo = interpolate(t, [T.cerebelo, T.cerebelo + 0.4, T.roce - 0.3, T.roce], [0, 1, 1, 0], clamp);
  const tagMotora = interpolate(t, [T.orden, T.orden + 0.4, T.copia - 0.2, T.copia + 0.2], [0, 1, 1, 0], clamp);
  const tagPrediccion = interpolate(t, [T.calcula + 0.4, T.calcula + 0.8, T.roce - 0.3, T.roce], [0, 1, 1, 0], clamp);

  const ondas = (n: number) =>
    new Array(n).fill(0).map((_, k) => {
      const p = (t * 1.6 + k / n) % 1;
      return (
        <circle key={k} cx={CONTACTO[0] + 10} cy={CONTACTO[1]} r={20 + p * 160 * sensacion} fill="none" stroke={C.orange} strokeWidth={6} opacity={(1 - p) * Math.min(1, sensacion * 1.4)} />
      );
    });

  return (
    <svg width={W} height={H} style={{ position: "absolute" }}>
      <defs>
        <filter id="brillo-cq" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
      </defs>
      <g transform={`translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`}>
        {/* Pared y suelo */}
        <rect x={-600} y={1900} width={2400} height={900} fill="#120E28" />
        <line x1={-600} y1={1900} x2={1800} y2={1900} stroke="#2A2350" strokeWidth={4} />

        {/* Tronco con camiseta y cuello */}
        <rect x={CARA[0] - 76} y={CARA[1] + 150} width={88} height={110} fill={PIEL} />
        <path d="M 300 830 C 230 860, 180 910, 170 1010 C 160 1300, 168 1700, 172 2600 L 704 2600 C 704 1700, 700 1320, 676 1060 C 660 930, 570 860, 420 830 Z" fill={CAMISETA} />
        <Cara x={CARA[0]} y={CARA[1]} escala={ESC} ojos={1 - 0.8 * risa} miedo={0} />
        {risa > 0.05 ? (
          <path
            d={`M ${CARA[0] + 64 * ESC} ${CARA[1] + 48 * ESC} q ${8 * ESC} ${10 * ESC * risa} ${16 * ESC} 0`}
            fill="#5A2A20"
            stroke="#5A2A20"
            strokeWidth={3}
            opacity={risa}
          />
        ) : null}

        {/* Cerebro dentro de la cabeza */}
        {cerebro > 0 ? (
          <g opacity={cerebro}>
            <ellipse cx={CEREBRO_C[0]} cy={CEREBRO_C[1]} rx={88} ry={66} fill="#0E0B22" opacity={0.7} />
            <ellipse cx={CEREBRO_C[0]} cy={CEREBRO_C[1]} rx={88} ry={66} fill="none" stroke={C.purpleLight} strokeWidth={2} vectorEffect="non-scaling-stroke" />
            <circle cx={MOTORA[0]} cy={MOTORA[1]} r={18} fill={C.yellow} opacity={0.9} />
            <circle cx={SENSORIAL[0]} cy={SENSORIAL[1]} r={16} fill={C.orange} opacity={0.4 + 0.6 * (1 - baja)} />
            <ellipse cx={CEREBELO[0]} cy={CEREBELO[1]} rx={24} ry={16} fill={C.cyan} opacity={0.4 + 0.6 * copia} />
            {/* Orden: de la corteza motora al brazo */}
            <path
              d={`M ${MOTORA[0]} ${MOTORA[1]} C ${MOTORA[0] - 60} ${MOTORA[1] + 60}, ${NUCA[0] + 10} ${NUCA[1] - 80}, ${NUCA[0]} ${NUCA[1]} Q ${NUCA[0] + 20} ${HOMBRO[1] - 40}, ${HOMBRO[0]} ${HOMBRO[1]} L ${mano[0]} ${mano[1]}`}
              fill="none"
              stroke={C.yellow}
              strokeWidth={5}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray="1 1"
              strokeDashoffset={1 - orden}
            />
            {/* Copia al cerebelo */}
            <path
              d={`M ${MOTORA[0]} ${MOTORA[1]} Q ${MOTORA[0] - 70} ${MOTORA[1] + 40}, ${CEREBELO[0] + 10} ${CEREBELO[1] - 12}`}
              fill="none"
              stroke={C.cyan}
              strokeWidth={5}
              strokeLinecap="round"
              strokeDasharray="10 8"
              pathLength={1}
              strokeDashoffset={1 - copia}
              opacity={copia > 0 ? 1 : 0}
            />
            {/* Predicción: el cerebelo avisa a la zona del tacto */}
            {prediccion > 0 ? (
              <g opacity={prediccion}>
                <path d={`M ${CEREBELO[0]} ${CEREBELO[1] - 18} Q ${CEREBELO[0] - 30} ${SENSORIAL[1] + 40}, ${SENSORIAL[0] - 4} ${SENSORIAL[1] + 14}`} fill="none" stroke={C.cyan} strokeWidth={4} strokeDasharray="6 6" />
                <circle cx={SENSORIAL[0] - 40} cy={SENSORIAL[1] + 40} r={14} fill={C.pill} stroke={C.cyan} strokeWidth={3} />
                <line x1={SENSORIAL[0] - 48} y1={SENSORIAL[1] + 40} x2={SENSORIAL[0] - 32} y2={SENSORIAL[1] + 40} stroke={C.cyan} strokeWidth={4} strokeLinecap="round" />
              </g>
            ) : null}
          </g>
        ) : null}

        {/* Ondas de cosquillas en el punto de contacto */}
        {sensacion > 0.02 ? <g>{ondas(3)}</g> : null}

        {/* Brazo propio */}
        <path d={`M ${HOMBRO[0]} ${HOMBRO[1]} Q ${codo[0]} ${codo[1]}, ${mano[0] - 30} ${mano[1]}`} fill="none" stroke={MANGA} strokeWidth={66} strokeLinecap="round" />
        {/* Mano ajena (manga naranja) y, encima, la propia */}
        {ajena > 0 ? (
          <g>
            <path d={`M ${manoAjena[0] + 30} ${manoAjena[1]} L ${manoAjena[0] + 600} ${manoAjena[1] + 80}`} stroke="#B8502E" strokeWidth={70} strokeLinecap="round" />
            <Mano x={manoAjena[0]} y={manoAjena[1]} dir={-1} t={t} mueve={ajena} piel="#A86A48" />
          </g>
        ) : null}
        <Mano x={mano[0]} y={mano[1]} dir={1} t={t} mueve={propia} />
      </g>

      {/* Etiquetas ancladas (tamaño constante en pantalla) */}
      <Tag x={sx(CONTACTO[0])} y={sy(CONTACTO[1] - 30)} dx={-120} dy={-220} texto="tu mano" color={C.cyan} o={tagPropia} />
      <Tag x={sx(manoAjena[0])} y={sy(manoAjena[1] - 30)} dx={60} dy={-220} texto="otra mano" color={C.orange} o={tagAjena} />
      <Tag x={sx(MOTORA[0])} y={sy(MOTORA[1])} dx={170} dy={-160} texto="orden" color={C.yellow} o={tagMotora} />
      <Tag x={sx(CEREBELO[0])} y={sy(CEREBELO[1])} dx={-60} dy={230} texto="cerebelo" color={C.cyan} o={tagCerebelo} />
      <Tag x={sx(SENSORIAL[0] - 40)} y={sy(SENSORIAL[1] + 40)} dx={-60} dy={-200} texto="ya lo esperaba" color={C.cyan} o={tagPrediccion} />
    </svg>
  );
};

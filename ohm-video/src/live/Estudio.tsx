import { Easing, interpolate } from "remotion";
import { Cara } from "../components/Cara";
import { C, clamp, H, mono, useT, W } from "../theme";
import { T } from "./tiempos";

// Estudio de un creador: escritorio, sudadera con detalles, teléfono en trípode con aro de luz.
// Proporciones según estilo.md (cabeza ≈ 180 px con escala 1): hombros a ~1,3 cabezas de la coronilla.
type P2 = [number, number];
const CARA: P2 = [300, 900];
const MESA = 1360;
const TEL: P2 = [700, 1010];
const SUDADERA = "#C8603A";
const SUDADERA_OSCURA = "#A04A2C";
const SUDADERA_LUZ = "#E07A50";
const PIEL = "#C98A64";

const suave = { ...clamp, easing: Easing.inOut(Easing.cubic) };

// Cámara: [tiempo, centro x, centro y, zoom]
const camaraKeys = (): [number, number, number, number][] => [
  [0, 520, 1060, 1.2],
  [T.parece - 0.3, 520, 1060, 1.22],
  [T.parece + 0.6, 520, 1150, 1.0],
  [T.live - 0.6, 520, 1150, 1.0],
  [T.live, TEL[0], TEL[1], 3.0],
  [T.dinero - 0.5, TEL[0], TEL[1], 3.0],
  [T.dinero + 0.3, 520, 1100, 1.1],
  [T.siQuieres - 0.3, 520, 1100, 1.12],
  [T.siQuieres + 0.6, 520, 1150, 1.0],
  [T.fin, 520, 1150, 1.02],
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

// Regalos que vuelan del teléfono al creador
const Regalo: React.FC<{ readonly x: number; readonly y: number; readonly tipo: number; readonly o: number }> = ({ x, y, tipo, o }) => {
  if (tipo === 0) {
    // rosa
    return (
      <g opacity={o} transform={`translate(${x} ${y})`}>
        <circle r={14} fill="#E8414F" />
        <path d="M -6 -2 q 6 -10 12 0 q -6 8 -12 0" fill="#B82A38" />
        <path d="M 0 14 L 0 34" stroke="#3AA85A" strokeWidth={4} />
      </g>
    );
  }
  if (tipo === 1) {
    // estrella
    return (
      <polygon
        opacity={o}
        points={new Array(10)
          .fill(0)
          .map((_, i) => {
            const r = i % 2 ? 8 : 18;
            const a = (i * Math.PI) / 5 - Math.PI / 2;
            return `${x + Math.cos(a) * r},${y + Math.sin(a) * r}`;
          })
          .join(" ")}
        fill={C.yellow}
      />
    );
  }
  // corazón
  return <path opacity={o} d={`M ${x} ${y + 12} C ${x - 22} ${y - 4}, ${x - 12} ${y - 22}, ${x} ${y - 8} C ${x + 12} ${y - 22}, ${x + 22} ${y - 4}, ${x} ${y + 12} Z`} fill="#FF5A8A" />;
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

export const Estudio: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const { cx, cy, zoom } = camara(t);
  const sx = (x: number) => 540 + (x - cx) * zoom;
  const sy = (y: number) => 960 + (y - cy) * zoom;

  // El creador habla (boca) y sonríe al recibir regalos
  const habla = Math.max(0, Math.sin(t * 11)) * (t < T.fin ? 1 : 0);
  const regalos = interpolate(t, [T.regalos - 0.2, T.regalos + 0.3, T.noFacil - 0.3, T.noFacil], [0, 1, 1, 0], clamp);
  const aro = 0.7 + 0.3 * Math.sin(t * 2);
  const enVivo = t > T.live - 0.6;

  const tagAro = interpolate(t, [T.directo, T.directo + 0.4, T.live - 0.8, T.live - 0.4], [0, 1, 1, 0], clamp);

  return (
    <svg width={W} height={H} style={{ position: "absolute" }}>
      <defs>
        <filter id="brillo-lv" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
        <linearGradient id="led-lv" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8A5CC8" />
          <stop offset="0.5" stopColor="#E8414F" />
          <stop offset="1" stopColor="#08D8E8" />
        </linearGradient>
      </defs>
      <g transform={`translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`}>
        {/* Pared con tira LED y estantería */}
        <rect x={-600} y={300} width={2400} height={1300} fill="#17132E" />
        <rect x={-600} y={620} width={2400} height={8} fill="url(#led-lv)" opacity={0.9} />
        <rect x={-600} y={600} width={2400} height={60} fill="url(#led-lv)" opacity={0.15} filter="url(#brillo-lv)" />
        <rect x={760} y={760} width={240} height={14} rx={4} fill="#3A3360" />
        <rect x={790} y={700} width={40} height={60} rx={6} fill="#3A6A8A" />
        <rect x={840} y={690} width={30} height={70} rx={6} fill="#8A5CC8" />
        <path d="M 920 760 q -10 -40 10 -70 q 12 30 -2 70 Z M 940 760 q 14 -36 40 -46 q -10 34 -36 46 Z" fill="#3AA85A" />

        {/* Escritorio */}
        <rect x={100} y={MESA} width={920} height={34} rx={8} fill="#5A4A8A" />
        <rect x={130} y={MESA + 34} width={24} height={300} fill="#3A3360" />
        <rect x={970} y={MESA + 34} width={24} height={300} fill="#3A3360" />

        {/* Sudadera: torso de perfil con capucha, cordones, bolsillo, pliegues y brillo */}
        <path d="M 236 990 C 200 1000, 196 1060, 226 1080 L 290 1060 L 290 1000 Z" fill={SUDADERA_OSCURA} />
        <path d="M 262 1020 C 220 1040, 200 1080, 200 1150 L 205 1362 L 412 1362 C 418 1250, 412 1160, 398 1100 C 388 1060, 362 1034, 322 1020 Z" fill={SUDADERA} />
        <path d="M 262 1020 C 290 1032, 310 1032, 322 1020" fill="none" stroke={SUDADERA_OSCURA} strokeWidth={8} strokeLinecap="round" />
        <path d="M 318 1030 L 322 1104 M 330 1028 L 336 1096" stroke="#F2E6DA" strokeWidth={4} strokeLinecap="round" />
        <circle cx={322} cy={1108} r={5} fill="#F2E6DA" />
        <circle cx={336} cy={1100} r={5} fill="#F2E6DA" />
        <path d="M 300 1240 L 404 1240 L 408 1330 L 296 1330 Z" fill="none" stroke={SUDADERA_OSCURA} strokeWidth={5} strokeLinejoin="round" />
        <path d="M 210 1200 q 30 12 50 2 M 214 1290 q 34 10 60 0" fill="none" stroke={SUDADERA_OSCURA} strokeWidth={4} strokeLinecap="round" />
        <ellipse cx={262} cy={1060} rx={34} ry={12} fill={SUDADERA_LUZ} opacity={0.6} />
        <path d="M 205 1340 L 412 1340" stroke={SUDADERA_OSCURA} strokeWidth={6} />

        {/* Cabeza (componente común) y boca que habla */}
        <Cara x={CARA[0]} y={CARA[1]} escala={1} ojos={1} />
        <ellipse cx={CARA[0] + 71} cy={CARA[1] + 52} rx={4} ry={1 + 4 * habla} fill="#5A2A20" opacity={0.85} />

        {/* Brazo con manga, puño y mano de cuatro dedos y pulgar */}
        <path d="M 300 1080 Q 312 1200, 336 1268 L 470 1336" fill="none" stroke={SUDADERA} strokeWidth={56} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 330 1230 q 18 10 30 -2" fill="none" stroke={SUDADERA_OSCURA} strokeWidth={4} strokeLinecap="round" />
        <rect x={452} y={1316} width={30} height={40} rx={8} fill={SUDADERA_OSCURA} transform="rotate(-20 467 1336)" />
        <g transform="translate(500 1340)">
          <ellipse cx={0} cy={0} rx={26} ry={16} fill={PIEL} />
          {[-10, -3, 4, 11].map((dy, i) => (
            <path key={i} d={`M 20 ${dy} q 16 ${2 + i} 26 ${4 + i}`} fill="none" stroke={PIEL} strokeWidth={8} strokeLinecap="round" />
          ))}
          <path d="M 4 -12 q 14 -12 26 -14" fill="none" stroke={PIEL} strokeWidth={9} strokeLinecap="round" />
        </g>

        {/* Trípode, aro de luz y teléfono */}
        <path d={`M ${TEL[0]} ${TEL[1] + 90} L ${TEL[0]} ${MESA - 60} M ${TEL[0]} ${MESA - 60} L ${TEL[0] - 50} ${MESA} M ${TEL[0]} ${MESA - 60} L ${TEL[0] + 50} ${MESA} M ${TEL[0]} ${MESA - 60} L ${TEL[0]} ${MESA}`} stroke="#3A3360" strokeWidth={8} strokeLinecap="round" />
        <circle cx={TEL[0]} cy={TEL[1]} r={118} fill="none" stroke="#FFF1C9" strokeWidth={22} opacity={0.35 * aro} filter="url(#brillo-lv)" />
        <circle cx={TEL[0]} cy={TEL[1]} r={118} fill="none" stroke="#FFF8E6" strokeWidth={10} opacity={0.9} />
        <rect x={TEL[0] - 42} y={TEL[1] - 78} width={84} height={156} rx={14} fill="#0A0818" stroke="#C8C4D8" strokeWidth={4} />
        <rect x={TEL[0] - 34} y={TEL[1] - 68} width={68} height={136} rx={8} fill={enVivo ? "#2A1E4A" : "#14112A"} />
        {enVivo ? (
          <g>
            <rect x={TEL[0] - 30} y={TEL[1] - 62} width={26} height={11} rx={4} fill="#E8414F" />
            <text x={TEL[0] - 17} y={TEL[1] - 53.5} textAnchor="middle" fill="#FFFFFF" fontFamily={mono} fontSize={7} fontWeight={700}>
              LIVE
            </text>
          </g>
        ) : null}

        {/* Regalos que llegan durante el directo */}
        {regalos > 0
          ? new Array(9).fill(0).map((_, i) => {
              const p = (t * 0.45 + i / 9) % 1;
              const x = TEL[0] - 40 + (CARA[0] + 80 - (TEL[0] - 40)) * p;
              const y = TEL[1] - 40 - Math.sin(p * Math.PI) * 220 + i * 6;
              return <Regalo key={i} x={x} y={y} tipo={i % 3} o={regalos * (1 - p * 0.3)} />;
            })
          : null}
      </g>

      <Tag x={sx(TEL[0])} y={sy(TEL[1] - 120)} dx={-40} dy={-200} texto="un directo" color={C.red} o={tagAro} />
    </svg>
  );
};

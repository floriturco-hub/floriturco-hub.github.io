import { Easing, interpolate } from "remotion";
import { C, clamp, H, mono, useT, W } from "../theme";
import { T } from "./tiempos";

// Casa en corte con lámpara, microondas y televisor; el cable llega del poste al medidor de la fachada
type P2 = [number, number];
const SUELO = 1400;
const MEDIDOR: P2 = [880, 1030];
const LAMPARA: P2 = [210, 1180];
const MICRO: P2 = [560, 1236];
const TELE: P2 = [380, 1040];
const COBRE = "#C8963A";

const suave = { ...clamp, easing: Easing.inOut(Easing.cubic) };

// Cámara: [tiempo, centro x, centro y, zoom]
const camaraKeys = (): [number, number, number, number][] => [
  [0, 560, 1050, 1.05],
  [T.cuenta - 0.3, 560, 1050, 1.07],
  [T.cuenta + 0.6, MEDIDOR[0], MEDIDOR[1], 3.4],
  [T.parece - 0.3, MEDIDOR[0], MEDIDOR[1], 3.45],
  [T.parece + 0.6, 540, 1080, 1.0],
  [T.unidad - 0.3, 540, 1080, 1.02],
  [T.microondas, MICRO[0], MICRO[1] - 20, 2.2],
  [T.bombilla - 0.3, MICRO[0], MICRO[1] - 20, 2.25],
  [T.bombilla + 0.5, LAMPARA[0] + 20, LAMPARA[1], 2.4],
  [T.medidor - 0.3, LAMPARA[0] + 20, LAMPARA[1], 2.45],
  [T.medidor + 0.6, MEDIDOR[0], MEDIDOR[1], 3.6],
  [T.igual - 0.3, MEDIDOR[0], MEDIDOR[1], 3.7],
  [T.igual + 0.6, 560, 1180, 0.95],
  [T.truco - 0.3, 560, 1180, 0.97],
  [T.apaga + 0.4, 520, 1120, 1.15],
  [T.sigue - 0.3, 520, 1120, 1.17],
  [T.sigue + 0.5, MEDIDOR[0], MEDIDOR[1], 3.4],
  [T.silencio - 0.2, MEDIDOR[0], MEDIDOR[1], 3.45],
  [T.silencio + 0.6, TELE[0], TELE[1], 2.6],
  [T.noPagas - 0.2, TELE[0], TELE[1], 2.65],
  [T.noPagas + 0.6, MEDIDOR[0], MEDIDOR[1], 3.4],
  [T.fin, MEDIDOR[0], MEDIDOR[1], 3.5],
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

// Qué está encendido en cada momento (0 a 1)
const estado = (t: number) => {
  const apagado = interpolate(t, [T.apaga, T.apaga + 0.6], [1, 0], clamp);
  const vuelve = interpolate(t, [T.noPagas, T.noPagas + 0.6], [0, 1], clamp);
  const general = Math.max(apagado, vuelve);
  const micro = general * Math.max(
    interpolate(t, [0.2, 0.6], [0, 1], clamp) * interpolate(t, [T.parece, T.parece + 0.4], [1, 0], clamp),
    interpolate(t, [T.microondas - 0.2, T.microondas + 0.3, T.bombilla - 0.2, T.bombilla + 0.2], [0, 1, 1, 0], clamp),
    interpolate(t, [T.igual, T.igual + 0.5], [0, 1], clamp),
  );
  const lampara = general * interpolate(t, [0.1, 0.5], [0, 1], clamp);
  const tele = general * Math.max(interpolate(t, [T.pero, T.pero + 0.4], [0, 1], clamp) * interpolate(t, [T.unidad, T.unidad + 0.4], [1, 0], clamp), interpolate(t, [T.igual, T.igual + 0.5], [0, 1], clamp));
  return { micro, lampara, tele };
};
const potencia = (t: number) => {
  const e = estado(t);
  return 1000 * e.micro + 10 * e.lampara + 100 * e.tele + 4; // + modo de espera
};

// Parpadeos acumulados (ritmo exagerado para que se vean: ~2,5 por segundo con 1.000 W)
const parpadeos = (t: number) => {
  let n = 0;
  const paso = 1 / 30;
  for (let s = 0; s < t; s += paso) {
    n += Math.max(potencia(s) / 400, 0.35) * paso;
  }
  return n;
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

export const Casa: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const { cx, cy, zoom } = camara(t);
  const sx = (x: number) => 540 + (x - cx) * zoom;
  const sy = (y: number) => 960 + (y - cy) * zoom;

  const e = estado(t);
  const n = parpadeos(t);
  const destello = Math.max(0, 1 - (n % 1) * 6);
  const kwh = 4312 + n / 6;
  const lectura = Math.floor(kwh).toString().padStart(5, "0");
  const flujo = e.micro + e.lampara * 0.3 + e.tele * 0.4;

  // Etiquetas
  const tagMedidor = interpolate(t, [T.cuenta + 0.6, T.cuenta + 1.0, T.parece - 0.3, T.parece], [0, 1, 1, 0], clamp);
  const tagMicro = interpolate(t, [T.microondas + 0.3, T.microondas + 0.7, T.bombilla - 0.3, T.bombilla], [0, 1, 1, 0], clamp);
  const tagLampara = interpolate(t, [T.bombilla + 0.5, T.bombilla + 0.9, T.medidor - 0.3, T.medidor], [0, 1, 1, 0], clamp);
  const tagMide = interpolate(t, [T.corriente, T.corriente + 0.4, T.antiguos - 0.3, T.antiguos], [0, 1, 1, 0], clamp);
  const tagLed = interpolate(t, [T.parpadeo, T.parpadeo + 0.4, T.igual - 0.3, T.igual], [0, 1, 1, 0], clamp);
  const tagSigue = interpolate(t, [T.sigue + 0.4, T.sigue + 0.8, T.silencio + 0.2, T.silencio + 0.6], [0, 1, 1, 0], clamp);
  const tagEspera = interpolate(t, [T.silencio + 0.6, T.silencio + 1.0, T.noPagas - 0.2, T.noPagas + 0.2], [0, 1, 1, 0], clamp);

  const cableInterior = `M ${MEDIDOR[0] - 40} ${MEDIDOR[1] + 40} L 800 ${MEDIDOR[1] + 40} L 800 960 L 120 960 L 120 ${LAMPARA[1] + 100} M 380 960 L 380 ${TELE[1] - 70} M 640 960 L 640 1180 L ${MICRO[0] + 60} 1180`;

  return (
    <svg width={W} height={H} style={{ position: "absolute" }}>
      <defs>
        <filter id="brillo-lz" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
        <radialGradient id="halo-lz">
          <stop offset="0" stopColor="#FFF1C9" stopOpacity={0.55} />
          <stop offset="1" stopColor="#FFF1C9" stopOpacity={0} />
        </radialGradient>
      </defs>
      <g transform={`translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`}>
        {/* Suelo */}
        <rect x={-600} y={SUELO} width={2400} height={1200} fill="#120E28" />
        <line x1={-600} y1={SUELO} x2={1800} y2={SUELO} stroke="#2A2350" strokeWidth={4} />

        {/* Poste y cable de la calle */}
        <rect x={1040} y={420} width={22} height={980} fill="#3A2F4A" />
        <rect x={990} y={460} width={120} height={14} rx={6} fill="#3A2F4A" />
        <path d={`M 1000 470 Q 960 760, ${MEDIDOR[0] + 30} ${MEDIDOR[1] - 60}`} fill="none" stroke="#1A1430" strokeWidth={6} />
        <path d={`M 1000 470 Q 960 760, ${MEDIDOR[0] + 30} ${MEDIDOR[1] - 60}`} fill="none" stroke={C.cyan} strokeWidth={3} strokeDasharray="12 12" strokeDashoffset={-n * 30} opacity={0.6} />

        {/* Casa en corte */}
        <path d="M 40 820 L 440 600 L 840 820 Z" fill="#3A2F6A" />
        <rect x={60} y={820} width={760} height={580} fill="#2A2350" />
        <rect x={90} y={850} width={700} height={550} fill="#15112E" />
        {/* Luz de la lámpara en la habitación */}
        <circle cx={LAMPARA[0]} cy={LAMPARA[1] - 20} r={260} fill="url(#halo-lz)" opacity={e.lampara} />

        {/* Cables dentro de la pared */}
        <path d={cableInterior} fill="none" stroke={COBRE} strokeWidth={6} strokeLinejoin="round" opacity={0.5} />
        {flujo > 0.02 ? (
          <path d={cableInterior} fill="none" stroke={C.cyan} strokeWidth={4} strokeDasharray="10 12" strokeDashoffset={-n * 40} strokeLinejoin="round" opacity={Math.min(1, flujo)} />
        ) : null}

        {/* Lámpara con bombilla LED */}
        <rect x={140} y={LAMPARA[1] + 100} width={150} height={20} rx={6} fill="#5A4A8A" />
        <rect x={160} y={LAMPARA[1] + 120} width={14} height={100} fill="#3A3360" />
        <rect x={256} y={LAMPARA[1] + 120} width={14} height={100} fill="#3A3360" />
        <rect x={LAMPARA[0] - 6} y={LAMPARA[1] + 10} width={12} height={90} fill="#8C88A8" />
        <path d={`M ${LAMPARA[0] - 60} ${LAMPARA[1] + 10} L ${LAMPARA[0] - 36} ${LAMPARA[1] - 60} L ${LAMPARA[0] + 36} ${LAMPARA[1] - 60} L ${LAMPARA[0] + 60} ${LAMPARA[1] + 10} Z`} fill="#C8A86A" />
        <circle cx={LAMPARA[0]} cy={LAMPARA[1] + 4} r={14} fill={e.lampara > 0.5 ? "#FFF1C9" : "#6A6488"} />

        {/* Televisor en la pared, con piloto de modo de espera */}
        <rect x={TELE[0] - 110} y={TELE[1] - 70} width={220} height={130} rx={8} fill="#0A0818" stroke="#3A3360" strokeWidth={6} />
        <rect x={TELE[0] - 100} y={TELE[1] - 60} width={200} height={110} rx={4} fill={C.cyan} opacity={0.35 * e.tele} />
        <circle cx={TELE[0] + 96} cy={TELE[1] + 52} r={4} fill={C.red} opacity={0.6 + 0.4 * Math.sin(t * 3)} />

        {/* Encimera y microondas */}
        <rect x={460} y={1290} width={300} height={22} rx={6} fill="#5A4A8A" />
        <rect x={480} y={1312} width={260} height={88} fill="#3A3360" />
        <rect x={MICRO[0] - 90} y={MICRO[1] - 56} width={180} height={110} rx={10} fill="#C8C4D8" />
        <rect x={MICRO[0] - 78} y={MICRO[1] - 44} width={120} height={86} rx={6} fill="#1A1636" />
        <rect x={MICRO[0] - 78} y={MICRO[1] - 44} width={120} height={86} rx={6} fill={C.yellow} opacity={0.35 * e.micro} />
        {e.micro > 0.1 ? (
          <g transform={`translate(${MICRO[0] - 18} ${MICRO[1] + 22}) scale(1 0.35) rotate(${t * 140})`}>
            <rect x={-26} y={-26} width={52} height={52} rx={8} fill="#E8703C" opacity={e.micro} />
          </g>
        ) : null}
        <rect x={MICRO[0] + 50} y={MICRO[1] - 40} width={30} height={12} rx={2} fill="#1A1430" />
        <text x={MICRO[0] + 65} y={MICRO[1] - 31} textAnchor="middle" fill={C.cyan} fontFamily={mono} fontSize={9} opacity={e.micro}>
          1:00
        </text>

        {/* Muro de la fachada donde va el medidor */}
        <rect x={816} y={900} width={150} height={SUELO - 900} fill="#2A2350" />
        <rect x={816} y={900} width={150} height={12} fill="#3A2F6A" />
        <rect x={MEDIDOR[0] - 62} y={MEDIDOR[1] - 78} width={124} height={156} rx={12} fill="#1A1636" />
        {/* Medidor en la fachada: pantalla con kWh y piloto que parpadea */}
        <rect x={MEDIDOR[0] - 50} y={MEDIDOR[1] - 66} width={100} height={132} rx={10} fill="#E8EEF4" stroke="#8C88A8" strokeWidth={4} />
        <rect x={MEDIDOR[0] - 38} y={MEDIDOR[1] - 50} width={76} height={28} rx={4} fill="#1A3A2A" />
        <text x={MEDIDOR[0]} y={MEDIDOR[1] - 30} textAnchor="middle" fill="#7AF0A0" fontFamily={mono} fontSize={16} fontWeight={700} letterSpacing={1}>
          {lectura}
        </text>
        <text x={MEDIDOR[0] + 30} y={MEDIDOR[1] - 8} textAnchor="end" fill="#3A3360" fontFamily={mono} fontSize={9} fontWeight={700}>
          kWh
        </text>
        <circle cx={MEDIDOR[0] - 22} cy={MEDIDOR[1] + 16} r={7} fill="#5A1A1A" />
        <circle cx={MEDIDOR[0] - 22} cy={MEDIDOR[1] + 16} r={7} fill={C.red} opacity={destello} />
        <circle cx={MEDIDOR[0] - 22} cy={MEDIDOR[1] + 16} r={18} fill={C.red} opacity={0.6 * destello} filter="url(#brillo-lz)" />
        <text x={MEDIDOR[0] - 8} y={MEDIDOR[1] + 20} fill="#3A3360" fontFamily={mono} fontSize={7}>
          1 Wh/imp
        </text>
        <rect x={MEDIDOR[0] - 30} y={MEDIDOR[1] + 36} width={60} height={14} rx={3} fill="#C8C4D8" />
      </g>

      {/* Etiquetas ancladas (tamaño constante en pantalla) */}
      <Tag x={sx(MEDIDOR[0])} y={sy(MEDIDOR[1] - 66)} dx={-120} dy={-200} texto="medidor" color={C.white} o={tagMedidor} />
      <Tag x={sx(MICRO[0])} y={sy(MICRO[1] - 56)} dx={0} dy={-220} texto="1.000 W × 1 h" color={C.yellow} o={tagMicro} />
      <Tag x={sx(LAMPARA[0])} y={sy(LAMPARA[1] - 60)} dx={100} dy={-200} texto="10 W × 100 h" color={C.yellow} o={tagLampara} />
      <Tag x={sx(MEDIDOR[0] + 30)} y={sy(MEDIDOR[1] - 60)} dx={-130} dy={-220} texto="corriente y voltaje" color={C.cyan} o={tagMide} />
      <Tag x={sx(MEDIDOR[0] - 22)} y={sy(MEDIDOR[1] + 16)} dx={-120} dy={240} texto="1 parpadeo ≈ 1 Wh" color={C.red} o={tagLed} />
      <Tag x={sx(MEDIDOR[0] - 22)} y={sy(MEDIDOR[1] + 16)} dx={-100} dy={240} texto="sigue parpadeando" color={C.red} o={tagSigue} />
      <Tag x={sx(TELE[0] + 96)} y={sy(TELE[1] + 52)} dx={-140} dy={220} texto="modo de espera" color={C.red} o={tagEspera} />
    </svg>
  );
};

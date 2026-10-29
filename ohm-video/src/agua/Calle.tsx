import { Easing, interpolate, random } from "remotion";
import { C, clamp, H, mono, useT, W } from "../theme";
import { T } from "./tiempos";

// Corte de una casa y la acera: tubería general, medidor con turbina y la tubería que sube hasta el grifo
type P2 = [number, number];
const SUELO = 1300;
const MEDIDOR: P2 = [830, 1392];
const GRIFO: P2 = [372, 1012];
const FUGA: P2 = [470, 1520];
const AGUA = "#4AA8D8";
const TUBO = "#5A6A8A";

// Recorrido del agua: de la tubería general al medidor, luego a la casa y al grifo
const RECORRIDO = `M 1300 1720 L 940 1720 L 940 ${MEDIDOR[1]} L ${MEDIDOR[0] + 50} ${MEDIDOR[1]} M ${MEDIDOR[0] - 50} ${MEDIDOR[1]} L 470 ${MEDIDOR[1]} L 470 1560 L 470 1180 L 420 1180 L 420 ${GRIFO[1] - 30} L ${GRIFO[0] + 20} ${GRIFO[1] - 30}`;

const suave = { ...clamp, easing: Easing.inOut(Easing.cubic) };

// Cámara: [tiempo, centro x, centro y, zoom]
const camaraKeys = (): [number, number, number, number][] => [
  [0, 380, 1030, 3.0],
  [T.turbina - 0.2, 380, 1030, 3.0],
  [T.fuera, MEDIDOR[0], MEDIDOR[1], 3.6],
  [T.depende + 0.6, MEDIDOR[0], MEDIDOR[1], 3.7],
  [T.parece + 0.4, 560, 1250, 0.95],
  [T.metros - 0.3, 560, 1250, 0.97],
  [T.metros + 0.6, MEDIDOR[0], MEDIDOR[1], 3.0],
  [T.dentro - 0.2, MEDIDOR[0], MEDIDOR[1], 3.0],
  [T.dentro + 0.7, MEDIDOR[0], MEDIDOR[1] + 10, 6.4],
  [T.metroCubico - 0.3, MEDIDOR[0], MEDIDOR[1] + 10, 6.5],
  [T.metroCubico + 0.6, 600, 1330, 1.1],
  [T.lee - 0.3, 600, 1330, 1.12],
  [T.lee + 0.6, MEDIDOR[0] - 40, 1300, 2.2],
  [T.tramos - 0.3, MEDIDOR[0] - 40, 1300, 2.25],
  [T.tramos + 0.6, 560, 1400, 0.95],
  [T.truco - 0.3, 560, 1400, 0.97],
  [T.truco + 0.6, 560, 1300, 1.25],
  [T.rueda - 0.3, 560, 1300, 1.27],
  [T.rueda + 0.5, MEDIDOR[0], MEDIDOR[1], 4.0],
  [T.fuga - 0.2, MEDIDOR[0], MEDIDOR[1], 4.05],
  [T.fuga + 0.6, 560, 1380, 1.3],
  [T.noPagas + 0.4, 560, 1380, 1.32],
  [T.vuelta, MEDIDOR[0], MEDIDOR[1], 3.6],
  [T.fin, MEDIDOR[0], MEDIDOR[1], 3.7],
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

// Caudal: el grifo está abierto casi todo el vídeo; se cierra en el truco de la fuga
const caudal = (t: number) =>
  interpolate(t, [T.abres - 0.2, T.abres + 0.4, T.cierra, T.cierra + 0.5, T.noPagas, T.noPagas + 0.6], [0, 1, 1, 0, 0, 1], clamp);
const FUGA_CAUDAL = 0.12;

// Vueltas acumuladas de la turbina (integra el caudal), para la aguja y el contador
const vueltas = (t: number) => {
  let v = 0;
  const paso = 1 / 30;
  for (let s = 0; s < t; s += paso) {
    v += (caudal(s) + (s > T.cierra ? FUGA_CAUDAL : 0)) * paso * 3;
  }
  return v;
};

const PIEDRAS = new Array(90).fill(0).map((_, i) => ({ x: -300 + random(`sx${i}`) * 1800, y: SUELO + 40 + random(`sy${i}`) * 1100, r: 3 + random(`sr${i}`) * 6 }));

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

export const Calle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const { cx, cy, zoom } = camara(t);
  const sx = (x: number) => 540 + (x - cx) * zoom;
  const sy = (y: number) => 960 + (y - cy) * zoom;

  const q = caudal(t);
  const fuga = t > T.cierra ? FUGA_CAUDAL : 0;
  const v = vueltas(t);
  const giro = v * 360;
  const lectura = 1234 + v / 40;
  const digitos = Math.floor(lectura).toString().padStart(5, "0");
  const decimal = lectura % 1;

  // Interior del medidor (engranajes y contador) y radio de lectura a distancia
  const interior = interpolate(t, [T.dentro - 0.1, T.dentro + 0.5, T.metroCubico, T.metroCubico + 0.5], [0, 1, 1, 0], clamp);
  const engranajes = interpolate(t, [T.engranajes - 0.2, T.engranajes + 0.4], [0, 1], clamp) * interior;
  const radio = interpolate(t, [T.distancia - 0.2, T.distancia + 0.3, T.diferencia, T.diferencia + 0.4], [0, 1, 1, 0], clamp);
  const lector = interpolate(t, [T.lee - 0.2, T.lee + 0.3, T.distancia - 0.2, T.distancia + 0.2], [0, 1, 1, 0], clamp);
  const alcantarilla = interpolate(t, [T.alcantarillado - 0.2, T.alcantarillado + 0.4, T.truco - 0.3, T.truco], [0, 1, 1, 0], clamp);
  const gotaFuga = t > T.cierra ? (t * 1.2) % 1 : -1;
  const fugaO = interpolate(t, [T.fuga - 0.3, T.fuga + 0.2, T.vuelta - 0.8, T.vuelta - 0.3], [0, 1, 1, 0], clamp);

  // Etiquetas
  const tagMedidor = interpolate(t, [T.metros, T.metros + 0.4, T.dentro - 0.3, T.dentro], [0, 1, 1, 0], clamp);
  const tagTurbina = interpolate(t, [T.gira, T.gira + 0.4, T.engranajes - 0.2, T.engranajes + 0.2], [0, 1, 1, 0], clamp);
  const tagContador = interpolate(t, [T.suma, T.suma + 0.4, T.metroCubico - 0.3, T.metroCubico], [0, 1, 1, 0], clamp);
  const tagRueda = interpolate(t, [T.rueda, T.rueda + 0.4, T.fuga - 0.2, T.fuga + 0.2], [0, 1, 1, 0], clamp);

  return (
    <svg width={W} height={H} style={{ position: "absolute" }}>
      <defs>
        <filter id="brillo-ag" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <clipPath id="esfera-ag">
          <circle cx={MEDIDOR[0]} cy={MEDIDOR[1]} r={38} />
        </clipPath>
      </defs>
      <g transform={`translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`}>
        {/* Subsuelo */}
        <rect x={-600} y={SUELO} width={2400} height={1400} fill="#1A1430" />
        {PIEDRAS.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={p.r} fill="#2A2245" />
        ))}
        <rect x={-600} y={SUELO - 10} width={2400} height={20} fill="#3A3360" />

        {/* Casa en corte */}
        <path d="M 40 760 L 300 560 L 560 760 Z" fill="#3A2F6A" />
        <rect x={60} y={760} width={480} height={540} fill="#2A2350" />
        <rect x={90} y={790} width={420} height={500} fill="#15112E" />
        <rect x={120} y={830} width={130} height={110} rx={6} fill="#F8C848" opacity={0.25} />
        <line x1={185} y1={830} x2={185} y2={940} stroke="#2A2350" strokeWidth={6} />
        {/* Encimera, fregadero y grifo */}
        <rect x={250} y={1080} width={260} height={30} rx={6} fill="#5A4A8A" />
        <rect x={290} y={1110} width={180} height={190} fill="#3A3360" />
        <path d="M 300 1080 L 310 1120 L 440 1120 L 450 1080 Z" fill="#8C88A8" />
        <path d={`M 420 1080 L 420 ${GRIFO[1] - 30} Q 420 ${GRIFO[1] - 50} 400 ${GRIFO[1] - 50} L ${GRIFO[0]} ${GRIFO[1] - 50} L ${GRIFO[0]} ${GRIFO[1] - 20}`} fill="none" stroke="#C8C4D8" strokeWidth={14} strokeLinecap="round" />
        <rect x={406} y={GRIFO[1] - 76} width={30} height={12} rx={5} fill="#C8C4D8" transform={`rotate(${-50 * q} 421 ${GRIFO[1] - 70})`} />
        {/* Chorro */}
        {q > 0.02 ? <rect x={GRIFO[0] - 5} y={GRIFO[1] - 16} width={10} height={(1108 - GRIFO[1] + 16) * Math.min(1, q * 1.5)} rx={5} fill={AGUA} opacity={0.85} /> : null}

        {/* Alcantarillado: tubería que se lleva el agua usada */}
        <path d={`M 380 1300 L 380 1900 L 1300 1900`} fill="none" stroke="#4A3A2A" strokeWidth={34} />
        {alcantarilla > 0 ? (
          <path d={`M 380 1300 L 380 1900 L 1300 1900`} fill="none" stroke="#8A6A4A" strokeWidth={10} strokeDasharray="18 14" strokeDashoffset={-120 * t} opacity={alcantarilla} />
        ) : null}

        {/* Tuberías de agua potable */}
        <rect x={-600} y={1696} width={2400} height={48} fill={TUBO} />
        <path d={RECORRIDO} fill="none" stroke={TUBO} strokeWidth={26} strokeLinejoin="round" />
        {q + fuga > 0.02 ? (
          <path d={RECORRIDO} fill="none" stroke={AGUA} strokeWidth={8} strokeDasharray="16 14" strokeDashoffset={-140 * v} strokeLinejoin="round" opacity={Math.min(1, (q + fuga) * 1.2)} />
        ) : null}

        {/* Fuga bajo la casa */}
        {t > T.cierra ? (
          <g>
            <circle cx={FUGA[0] + 14} cy={FUGA[1]} r={8} fill={AGUA} />
            {gotaFuga >= 0 ? <ellipse cx={FUGA[0] + 18} cy={FUGA[1] + 14 + gotaFuga * 60} rx={6} ry={9} fill={AGUA} opacity={1 - gotaFuga} /> : null}
            <circle cx={FUGA[0] + 14} cy={FUGA[1]} r={24} fill={C.red} opacity={0.35 * fugaO} filter="url(#brillo-ag)" />
          </g>
        ) : null}

        {/* Arqueta del medidor en la acera */}
        <rect x={MEDIDOR[0] - 90} y={SUELO - 6} width={180} height={150} rx={8} fill="#0E0B22" stroke="#3A3360" strokeWidth={6} />
        {/* Medidor: cuerpo, esfera con turbina, contador y rueda de fugas */}
        <rect x={MEDIDOR[0] - 62} y={MEDIDOR[1] - 18} width={124} height={36} rx={10} fill="#3A6AA0" />
        <circle cx={MEDIDOR[0]} cy={MEDIDOR[1]} r={44} fill="#3A6AA0" />
        <circle cx={MEDIDOR[0]} cy={MEDIDOR[1]} r={38} fill="#E8EEF4" />
        <g clipPath="url(#esfera-ag)">
          {/* Turbina vista a través de la esfera */}
          <g transform={`translate(${MEDIDOR[0]} ${MEDIDOR[1] + 6}) rotate(${giro})`} opacity={0.35 + 0.65 * interior}>
            {[0, 60, 120, 180, 240, 300].map((a) => (
              <path key={a} d="M 0 0 C 6 -8, 14 -14, 22 -14 L 20 -6 C 12 -4, 6 -2, 0 0 Z" fill={AGUA} transform={`rotate(${a})`} />
            ))}
            <circle r={4} fill="#1A3A5A" />
          </g>
          {/* Engranajes que llevan las vueltas al contador */}
          {engranajes > 0 ? (
            <g opacity={engranajes}>
              {[
                [MEDIDOR[0] - 18, MEDIDOR[1] - 16, 8, 1],
                [MEDIDOR[0] - 4, MEDIDOR[1] - 22, 6, -1.4],
                [MEDIDOR[0] + 10, MEDIDOR[1] - 18, 8, 1],
              ].map(([gx, gy, r, s], i) => (
                <g key={i} transform={`translate(${gx} ${gy}) rotate(${giro * s * 0.4})`}>
                  <circle r={r} fill="none" stroke="#8C88A8" strokeWidth={2.4} strokeDasharray="2 2" />
                  <circle r={1.6} fill="#8C88A8" />
                </g>
              ))}
            </g>
          ) : null}
          {/* Contador de metros cúbicos */}
          <rect x={MEDIDOR[0] - 26} y={MEDIDOR[1] - 30} width={52} height={11} rx={2} fill="#1A1430" />
          <text x={MEDIDOR[0]} y={MEDIDOR[1] - 21.5} textAnchor="middle" fill="#FFFFFF" fontFamily={mono} fontSize={9} fontWeight={700} letterSpacing={1}>
            {digitos}
          </text>
          <text x={MEDIDOR[0] + 30} y={MEDIDOR[1] - 21.5} fill="#1A1430" fontFamily={mono} fontSize={6}>
            m³
          </text>
          {/* Rueda de fugas (estrella) */}
          <g transform={`translate(${MEDIDOR[0] + 20} ${MEDIDOR[1] + 22}) rotate(${giro * 6})`}>
            {[0, 72, 144, 216, 288].map((a) => (
              <path key={a} d="M 0 0 L 2 -6 L -2 -6 Z" fill={C.red} transform={`rotate(${a})`} />
            ))}
          </g>
          {/* Aguja de litros */}
          <line x1={MEDIDOR[0] - 20} y1={MEDIDOR[1] + 20} x2={MEDIDOR[0] - 20 + 8 * Math.sin(decimal * Math.PI * 2 * 40)} y2={MEDIDOR[1] + 20 - 8 * Math.cos(decimal * Math.PI * 2 * 40)} stroke={C.red} strokeWidth={1.6} />
          <circle cx={MEDIDOR[0] - 20} cy={MEDIDOR[1] + 20} r={9} fill="none" stroke="#8C88A8" strokeWidth={1} />
        </g>

        {/* Lector y lectura a distancia */}
        {lector > 0 ? (
          <g opacity={lector}>
            <rect x={MEDIDOR[0] + 120} y={1100} width={70} height={110} rx={12} fill="#1A1636" stroke={C.white} strokeWidth={3} />
            <rect x={MEDIDOR[0] + 130} y={1112} width={50} height={60} rx={6} fill={C.cyan} opacity={0.4} />
            <path d={`M ${MEDIDOR[0] + 155} 1210 L ${MEDIDOR[0] + 40} ${MEDIDOR[1] - 40}`} stroke={C.cyan} strokeWidth={3} strokeDasharray="8 8" />
          </g>
        ) : null}
        {radio > 0 ? (
          <g opacity={radio}>
            {[0, 1, 2].map((k) => {
              const p = (t * 1.2 + k / 3) % 1;
              return <circle key={k} cx={MEDIDOR[0]} cy={MEDIDOR[1] - 50} r={20 + p * 180} fill="none" stroke={C.cyan} strokeWidth={4} opacity={1 - p} />;
            })}
          </g>
        ) : null}
      </g>

      {/* Etiquetas ancladas (tamaño constante en pantalla) */}
      <Tag x={sx(MEDIDOR[0])} y={sy(MEDIDOR[1] - 44)} dx={-60} dy={-220} texto="medidor" color={C.white} o={tagMedidor} />
      <Tag x={sx(MEDIDOR[0])} y={sy(MEDIDOR[1] + 10)} dx={-140} dy={260} texto="turbina" color={C.cyan} o={tagTurbina} />
      <Tag x={sx(MEDIDOR[0])} y={sy(MEDIDOR[1] - 25)} dx={80} dy={-240} texto="contador" color={C.yellow} o={tagContador} />
      <Tag x={sx(MEDIDOR[0] + 20)} y={sy(MEDIDOR[1] + 22)} dx={60} dy={240} texto="sigue girando" color={C.red} o={tagRueda} />
      <Tag x={sx(FUGA[0] + 14)} y={sy(FUGA[1])} dx={150} dy={200} texto="fuga" color={C.red} o={fugaO} />
    </svg>
  );
};

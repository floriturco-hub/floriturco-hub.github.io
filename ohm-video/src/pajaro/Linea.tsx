import { Easing, interpolate } from "remotion";
import { C, clamp, H, mono, useT, W } from "../theme";
import { Pajaro } from "./Pajaro";
import { T } from "./tiempos";

// Tendido eléctrico de noche: dos cables con catenaria y un poste a la derecha
const cableA = (x: number) => 950 - 0.00025 * (x - 400) ** 2;
const cableB = (x: number) => cableA(x) + 260;
const POSTE = 1000;
const PAJARO_X = 400;
const AGUILA = { x: 560, s: 1.75 };

const suave = { ...clamp, easing: Easing.inOut(Easing.cubic) };

// Cámara: [tiempo, centro x, centro y, zoom]
const camaraKeys = (): [number, number, number, number][] => [
  [0, 560, 1000, 1.3],
  [T.patas - 0.2, 540, 980, 1.36],
  [T.patas + 0.7, PAJARO_X, 905, 3.0],
  [T.centimetros - 0.2, PAJARO_X, 905, 3.1],
  [T.centimetros + 0.6, PAJARO_X, 935, 5.0],
  [T.facil - 0.3, PAJARO_X, 935, 5.1],
  [T.facil + 0.5, 470, 930, 2.2],
  [T.peligro - 0.3, 470, 930, 2.25],
  [T.peligro + 0.6, 640, 1040, 1.15],
  [T.aguilas - 0.3, 640, 1040, 1.18],
  [T.aguilas + 0.6, 880, 820, 1.8],
  [T.mismo - 0.3, 880, 820, 1.85],
  [T.mismo + 0.6, 560, 1000, 1.3],
  [T.fin, 560, 1000, 1.34],
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

const cablePath = (f: (x: number) => number) => {
  let d = `M -200 ${f(-200)}`;
  for (let x = -180; x <= POSTE - 20; x += 20) {
    d += ` L ${x} ${f(x).toFixed(1)}`;
  }
  return d;
};

// Etiqueta de voltaje en pantalla, anclada a un punto del mundo
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
      <line x1={x} y1={y} x2={x + dx} y2={y + dy + 26} stroke={color} strokeWidth={2} opacity={0.7} />
      <circle cx={x} cy={y} r={6} fill={color} />
      <rect x={x + dx - ancho / 2} y={y + dy - 30} width={ancho} height={56} rx={14} fill={C.pill} stroke={color} strokeWidth={2} />
      <text x={x + dx} y={y + dy + 10} textAnchor="middle" fill={color} fontFamily={mono} fontSize={36} fontWeight={700}>
        {texto}
      </text>
    </g>
  );
};

const Rayo: React.FC<{ readonly pts: [number, number][]; readonly t: number; readonly o: number }> = ({ pts, t, o }) => {
  if (o <= 0) {
    return null;
  }
  const zig: string[] = [];
  for (let k = 0; k < pts.length - 1; k++) {
    const [x1, y1] = pts[k];
    const [x2, y2] = pts[k + 1];
    for (let s = 0; s <= 6; s++) {
      const p = s / 6;
      const j = s === 0 || s === 6 ? 0 : Math.sin(t * 60 + s * 7 + k) * 12;
      zig.push(`${x1 + (x2 - x1) * p + j},${y1 + (y2 - y1) * p - j}`);
    }
  }
  return (
    <g opacity={o}>
      <polyline points={zig.join(" ")} fill="none" stroke={C.yellow} strokeWidth={12} strokeLinejoin="round" opacity={0.4} filter="url(#brillo-pj)" />
      <polyline points={zig.join(" ")} fill="none" stroke="#FFFFFF" strokeWidth={4} strokeLinejoin="round" />
    </g>
  );
};

export const Linea: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const { cx, cy, zoom } = camara(t);
  const sx = (x: number) => 540 + (x - cx) * zoom;
  const sy = (y: number) => 960 + (y - cy) * zoom;

  // Pájaro pequeño: llega volando y se posa
  const llegada = interpolate(t, [0.1, 1.6], [0, 1], suave);
  const pjX = interpolate(llegada, [0, 1], [-120, PAJARO_X]);
  const pjY = interpolate(llegada, [0, 1], [520, cableA(PAJARO_X)]);
  const pjAlas = interpolate(t, [1.2, 1.7], [1, 0], clamp);
  const pjVisible = t < T.peligro ? 1 : interpolate(t, [T.mismo, T.mismo + 0.4], [0, 1], clamp);

  // Águila: aparece en el cable B y abre las alas hasta tocar el cable A
  const aguila = interpolate(t, [T.peligro, T.peligro + 0.5, T.aguilas - 0.3, T.aguilas], [0, 1, 1, 0], clamp);
  const abre = interpolate(t, [T.ala - 0.2, T.ala + 0.5], [0, 1], suave);
  const descarga = t >= T.atraviesa - 0.3 && t < T.aguilas ? interpolate(t, [T.atraviesa - 0.3, T.atraviesa], [0, 1], clamp) : 0;
  const aguilaPies = cableB(AGUILA.x);
  const punta: [number, number] = [AGUILA.x + 170 * AGUILA.s, aguilaPies - 62 * AGUILA.s - 110 * AGUILA.s];

  // Protectores y posadero seguro
  const protectores = interpolate(t, [T.protectores - 0.2, T.protectores + 0.4], [0, 1], clamp);
  const posada = interpolate(t, [T.aguilas + 0.2, T.aguilas + 1.2], [0, 1], suave);

  // Corriente por el cable (gruesa) y por el pájaro (casi nada)
  const corriente = interpolate(t, [T.facil - 0.2, T.facil + 0.3], [0, 1], clamp);
  const porPajaro = interpolate(t, [T.facil + 0.5, T.facil + 1.0, T.peligro - 0.4, T.peligro], [0, 1, 1, 0], clamp);

  // Etiquetas de voltaje
  const tagCable = interpolate(t, [0.6, 1.0, T.patas - 0.3, T.patas], [0, 1, 1, 0], clamp);
  const tagPatas = interpolate(t, [T.diezMil - 0.1, T.diezMil + 0.3, T.facil - 0.4, T.facil], [0, 1, 1, 0], clamp);
  const precisos = t >= T.milesimas - 0.2;
  const tagPeligro = interpolate(t, [T.ala, T.ala + 0.4, T.aguilas - 0.4, T.aguilas], [0, 1, 1, 0], clamp);
  const tagPoste = interpolate(t, [T.poste - 0.1, T.poste + 0.3, T.aguilas - 0.4, T.aguilas], [0, 1, 1, 0], clamp);
  const tagFinal = interpolate(t, [T.mismo + 0.4, T.mismo + 0.8], [0, 1], clamp);

  const piesA: [number, number] = [PAJARO_X - 20, cableA(PAJARO_X - 20)];
  const piesB: [number, number] = [PAJARO_X + 20, cableA(PAJARO_X + 20)];

  return (
    <svg width={W} height={H} style={{ position: "absolute" }}>
      <defs>
        <filter id="brillo-pj" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
      </defs>
      <g transform={`translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`}>
        {/* Poste con cruceta, aisladores y (luego) protectores */}
        <rect x={POSTE - 18} y={640} width={36} height={1400} fill="#3A2F4A" />
        <rect x={POSTE - 150} y={700} width={190} height={22} rx={6} fill="#3A2F4A" />
        <rect x={POSTE - 120} y={640} width={14} height={62} fill="#3A2F4A" opacity={posada} />
        <rect x={POSTE - 170} y={632} width={110} height={12} rx={6} fill="#3A2F4A" opacity={posada} />
        {[cableA, cableB].map((f, k) => (
          <g key={k}>
            {[0, 1, 2].map((d) => (
              <ellipse key={d} cx={POSTE - 40 - d * 16} cy={f(POSTE - 40) } rx={8} ry={20} fill="#C8C4D8" />
            ))}
            <rect x={POSTE - 100} y={f(POSTE - 40) - 26} width={80} height={52} rx={18} fill={C.orange} opacity={0.85 * protectores} />
          </g>
        ))}
        {/* Cables */}
        <path d={cablePath(cableA)} fill="none" stroke="#2A2350" strokeWidth={10} />
        <path d={cablePath(cableB)} fill="none" stroke="#2A2350" strokeWidth={10} />
        {corriente > 0 ? (
          <path
            d={cablePath(cableA)}
            fill="none"
            stroke={C.cyan}
            strokeWidth={5}
            strokeDasharray="22 16"
            strokeDashoffset={-140 * t}
            opacity={corriente * (t > T.peligro ? 0.5 : 1)}
            filter="url(#brillo-pj)"
          />
        ) : null}
        {corriente > 0 ? (
          <path d={cablePath(cableA)} fill="none" stroke={C.cyan} strokeWidth={4} strokeDasharray="22 16" strokeDashoffset={-140 * t} opacity={corriente * (t > T.peligro ? 0.5 : 1)} />
        ) : null}

        {/* Pájaro pequeño */}
        <g opacity={pjVisible}>
          <Pajaro x={pjX} y={pjY} alas={pjAlas} aleteo={t * 18} />
        </g>
        {/* Hilo de corriente que casi no entra en el pájaro */}
        {porPajaro > 0 ? (
          <path
            d={`M ${piesA[0]} ${piesA[1]} L ${PAJARO_X - 16} ${cableA(PAJARO_X) - 32} L ${PAJARO_X + 16} ${cableA(PAJARO_X) - 32} L ${piesB[0]} ${piesB[1]}`}
            fill="none"
            stroke={C.cyan}
            strokeWidth={1.2}
            strokeDasharray="3 5"
            strokeDashoffset={-30 * t}
            opacity={0.6 * porPajaro}
          />
        ) : null}

        {/* Águila con las alas abiertas tocando dos cables */}
        {aguila > 0 ? (
          <g opacity={aguila}>
            <Pajaro x={AGUILA.x} y={aguilaPies} s={AGUILA.s} alas={abre} cuerpo="#7A5A3C" ala="#5A3E28" />
            <Rayo
              pts={[punta, [AGUILA.x, aguilaPies - 62 * AGUILA.s], [AGUILA.x + 20 * AGUILA.s, aguilaPies]]}
              t={t}
              o={descarga * (0.6 + 0.4 * Math.abs(Math.sin(t * 25)))}
            />
            {descarga > 0 ? <circle cx={punta[0]} cy={punta[1]} r={40 + 10 * Math.sin(t * 30)} fill={C.yellow} opacity={0.35 * descarga} filter="url(#brillo-pj)" /> : null}
          </g>
        ) : null}
        {/* Águila posada a salvo en el posadero */}
        {posada > 0 ? (
          <g opacity={posada * (t < T.mismo ? 1 : interpolate(t, [T.mismo, T.mismo + 0.4], [1, 0], clamp))}>
            <Pajaro x={POSTE - 115} y={632} s={1.1} cuerpo="#7A5A3C" ala="#5A3E28" />
          </g>
        ) : null}
      </g>

      {/* Etiquetas de voltaje (tamaño constante en pantalla) */}
      <Tag x={sx(120)} y={sy(cableA(120))} texto="10.000 V" color={C.yellow} o={tagCable} />
      <Tag x={sx(piesA[0])} y={sy(piesA[1])} dx={-170} dy={160} texto={precisos ? "10.000,000 V" : "10.000 V"} color={C.yellow} o={tagPatas} />
      <Tag x={sx(piesB[0])} y={sy(piesB[1])} dx={170} dy={260} texto={precisos ? "9.999,998 V" : "10.000 V"} color={C.yellow} o={tagPatas} />
      <Tag x={sx(punta[0])} y={sy(punta[1])} dx={-60} dy={-110} texto="10.000 V" color={C.yellow} o={tagPeligro} />
      <Tag x={sx(AGUILA.x + 20 * AGUILA.s)} y={sy(aguilaPies)} dx={-140} dy={120} texto="otra fase" color={C.red} o={tagPeligro} />
      <Tag x={sx(POSTE)} y={sy(1500)} dx={-180} dy={0} texto="0 V tierra" color={C.red} o={tagPoste} />
      <Tag x={sx(PAJARO_X)} y={sy(cableA(PAJARO_X) - 120)} dx={0} dy={-80} texto="mismo voltaje" color={C.cyan} o={tagFinal} />
    </svg>
  );
};

import { Easing, interpolate, random } from "remotion";
import { C, clamp, H, mono, useT, W } from "../theme";
import { T } from "./tiempos";

// Arriba, una gasolinera de noche con surtidor y coche; abajo, el cilindro del motor en corte
type P2 = [number, number];
const SUELO = 1400;
const SURTIDOR: P2 = [270, 1210];
const TAPA: P2 = [640, 1250];
const CIG: P2 = [540, 2560]; // centro del cigüeñal
const RADIO_CIG = 110;
const BIELA = 330;
const CULATA = 1985;
const PARED: [number, number] = [400, 680];
const NORMAL = C.cyan;
const PREMIUM = C.yellow;

const suave = { ...clamp, easing: Easing.inOut(Easing.cubic) };

// Cámara: [tiempo, centro x, centro y, zoom]
const camaraKeys = (): [number, number, number, number][] => [
  [0, 520, 1080, 1.1],
  [T.parece - 0.3, 520, 1080, 1.12],
  [T.parece + 0.6, 380, 1160, 1.6],
  [T.motor - 0.4, 380, 1160, 1.62],
  [T.motor + 0.8, 540, 2200, 1.25],
  [T.turbo - 0.3, 540, 2200, 1.27],
  [T.turbo + 0.7, 520, 1080, 1.0],
  [T.manual - 0.3, 520, 1080, 1.02],
  [T.manual + 0.6, TAPA[0], TAPA[1], 2.6],
  [T.final - 0.3, TAPA[0], TAPA[1], 2.65],
  [T.final + 0.6, 520, 1080, 1.1],
  [T.fin, 520, 1080, 1.12],
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

const MEZCLA = new Array(36).fill(0).map((_, i) => ({ u: random(`mu${i}`), v: random(`mv${i}`) }));

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

export const Gasolinera: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const { cx, cy, zoom } = camara(t);
  const sx = (x: number) => 540 + (x - cx) * zoom;
  const sy = (y: number) => 960 + (y - cy) * zoom;

  // Repostaje de premium en el gancho
  const manguera = interpolate(t, [0, 0.3, T.parece, T.parece + 0.4], [0, 1, 1, 0], clamp);
  const sello = interpolate(t, [T.noSirve - 0.05, T.noSirve + 0.1, T.parece - 0.3, T.parece], [0, 1, 1, 0], clamp);
  const selloEscala = interpolate(t, [T.noSirve - 0.05, T.noSirve + 0.12], [1.7, 1], clamp);

  // Motor: giro del cigüeñal y posición del pistón
  const motorActivo = t > T.motor - 0.6 && t < T.turbo + 1.0;
  const theta = motorActivo ? 2 * Math.PI * 0.75 * (t - T.motor) : 0;
  const pin = CIG[1] - (RADIO_CIG * Math.cos(theta) + Math.sqrt(BIELA * BIELA - (RADIO_CIG * Math.sin(theta)) ** 2));
  const corona = pin - 60;
  const munon: P2 = [CIG[0] + RADIO_CIG * Math.sin(theta), CIG[1] - RADIO_CIG * Math.cos(theta)];
  const ciclo = (((theta / (2 * Math.PI)) % 1) + 1) % 1;

  // Encendido normal: chispa en el punto muerto superior y frente de llama desde la bujía
  const chispasOn = t > T.bujia - 0.3;
  const llama = chispasOn && ciclo < 0.22 ? ciclo / 0.22 : 0;
  // Detonación: un segundo frente que nace solo, antes de la chispa, en el borde
  const detona = t > T.sola - 0.2 && t < T.octanaje;
  const autoencendido = detona && ciclo > 0.9 ? (ciclo - 0.9) / 0.1 : detona && ciclo < 0.12 ? 1 : 0;
  const golpe = detona && ciclo < 0.12 ? 1 - ciclo / 0.12 : 0;
  const temblor = Math.sin(t * 90) * 6 * golpe;

  // Etiquetas
  const tagPremium = interpolate(t, [0.2, 0.5, T.parece - 0.3, T.parece], [0, 1, 1, 0], clamp);
  const tagOctanos = interpolate(t, [T.octanos, T.octanos + 0.4, T.motor - 0.4, T.motor], [0, 1, 1, 0], clamp);
  const tagBujia = interpolate(t, [T.bujia, T.bujia + 0.4, T.sola - 0.3, T.sola], [0, 1, 1, 0], clamp);
  const tagPiston = interpolate(t, [T.comprime, T.comprime + 0.4, T.bujia - 0.3, T.bujia], [0, 1, 1, 0], clamp);
  const tagClac = interpolate(t, [T.detonacion, T.detonacion + 0.3, T.octanaje - 0.3, T.octanaje], [0, 1, 1, 0], clamp);
  const tagTapa = interpolate(t, [T.manual + 0.5, T.manual + 0.9, T.final - 0.3, T.final], [0, 1, 1, 0], clamp);

  const camara2 = `translate(${540 - cx * zoom + temblor} ${960 - cy * zoom}) scale(${zoom})`;

  return (
    <svg width={W} height={H} style={{ position: "absolute" }}>
      <defs>
        <filter id="brillo-pr" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
        <clipPath id="camara-pr">
          <rect x={PARED[0]} y={CULATA} width={PARED[1] - PARED[0]} height={Math.max(0, corona - CULATA)} />
        </clipPath>
      </defs>
      <g transform={camara2}>
        {/* Gasolinera: marquesina, suelo y surtidor */}
        <rect x={-600} y={SUELO} width={2400} height={300} fill="#1A1636" />
        <rect x={-600} y={SUELO} width={2400} height={8} fill="#3A3360" />
        <rect x={40} y={560} width={1000} height={60} rx={8} fill="#2A2350" />
        <rect x={40} y={612} width={1000} height={10} fill={C.red} opacity={0.8} />
        <rect x={80} y={622} width={30} height={SUELO - 622} fill="#2A2350" />
        <rect x={970} y={622} width={30} height={SUELO - 622} fill="#2A2350" />
        <rect x={40} y={620} width={1000} height={260} fill="#FFF1C9" opacity={0.04} />

        <g>
          <rect x={SURTIDOR[0] - 110} y={SURTIDOR[1] - 200} width={220} height={SUELO - SURTIDOR[1] + 200} rx={14} fill="#3A3360" />
          <rect x={SURTIDOR[0] - 90} y={SURTIDOR[1] - 180} width={180} height={70} rx={8} fill="#0E1A2A" />
          <text x={SURTIDOR[0]} y={SURTIDOR[1] - 132} textAnchor="middle" fill="#7AF0A0" fontFamily={mono} fontSize={30} fontWeight={700}>
            {(Math.max(0, t) * 2.7).toFixed(2).replace(".", ",")} L
          </text>
          {/* Boquereles NORMAL y PREMIUM */}
          <rect x={SURTIDOR[0] - 96} y={SURTIDOR[1] - 90} width={84} height={56} rx={8} fill={NORMAL} opacity={0.9} />
          <text x={SURTIDOR[0] - 54} y={SURTIDOR[1] - 54} textAnchor="middle" fill="#0A0818" fontFamily={mono} fontSize={17} fontWeight={700}>
            NORMAL
          </text>
          <rect x={SURTIDOR[0] + 12} y={SURTIDOR[1] - 90} width={84} height={56} rx={8} fill={PREMIUM} />
          <text x={SURTIDOR[0] + 54} y={SURTIDOR[1] - 54} textAnchor="middle" fill="#0A0818" fontFamily={mono} fontSize={16} fontWeight={700}>
            PREMIUM
          </text>
          <text x={SURTIDOR[0] - 54} y={SURTIDOR[1] - 4} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={26} fontWeight={700}>
            $
          </text>
          <text x={SURTIDOR[0] + 54} y={SURTIDOR[1] - 4} textAnchor="middle" fill={PREMIUM} fontFamily={mono} fontSize={26} fontWeight={700}>
            $$
          </text>
        </g>

        {/* Coche de perfil */}
        <g>
          <path d="M 560 1350 L 560 1270 C 560 1250, 580 1240, 600 1236 L 680 1230 L 740 1170 C 750 1160, 770 1156, 790 1156 L 900 1156 C 920 1156, 940 1166, 950 1180 L 1000 1236 L 1040 1244 C 1060 1250, 1066 1270, 1066 1290 L 1066 1350 Z" fill="#8A5CC8" />
          <path d="M 700 1230 L 752 1176 L 830 1176 L 830 1230 Z M 846 1176 L 900 1176 C 916 1176, 926 1182, 934 1192 L 970 1230 L 846 1230 Z" fill="#1A3A5A" opacity={0.9} />
          <circle cx={640} cy={1350} r={46} fill="#15121F" />
          <circle cx={640} cy={1350} r={20} fill="#8C88A8" />
          <circle cx={980} cy={1350} r={46} fill="#15121F" />
          <circle cx={980} cy={1350} r={20} fill="#8C88A8" />
          <rect x={TAPA[0] - 22} y={TAPA[1] - 20} width={44} height={40} rx={8} fill="#6A44A8" stroke="#2A1A4A" strokeWidth={3} />
          <circle cx={TAPA[0]} cy={TAPA[1]} r={10} fill="#2A1A4A" />
        </g>

        {/* Manguera con gasolina premium que fluye */}
        {manguera > 0 ? (
          <g opacity={manguera}>
            <path d={`M ${SURTIDOR[0] + 54} ${SURTIDOR[1] - 34} C ${SURTIDOR[0] + 120} 1340, 520 1330, ${TAPA[0] - 10} ${TAPA[1]}`} fill="none" stroke="#15121F" strokeWidth={16} strokeLinecap="round" />
            <path d={`M ${SURTIDOR[0] + 54} ${SURTIDOR[1] - 34} C ${SURTIDOR[0] + 120} 1340, 520 1330, ${TAPA[0] - 10} ${TAPA[1]}`} fill="none" stroke={PREMIUM} strokeWidth={6} strokeDasharray="14 12" strokeDashoffset={-80 * t} strokeLinecap="round" />
          </g>
        ) : null}

        {/* Sello del gancho */}
        {sello > 0 ? (
          <g opacity={sello} transform={`translate(540 860) rotate(-8) scale(${selloEscala})`}>
            <rect x={-300} y={-70} width={600} height={140} rx={16} fill={C.pill} stroke={C.red} strokeWidth={10} />
            <text x={0} y={26} textAnchor="middle" fill={C.red} fontFamily={mono} fontSize={84} fontWeight={700}>
              ¡NO SIRVE!
            </text>
          </g>
        ) : null}

        {/* Cilindro del motor en corte */}
        <g>
          <rect x={PARED[0] - 40} y={CULATA - 60} width={PARED[1] - PARED[0] + 80} height={60} rx={10} fill="#5A5478" />
          <rect x={PARED[0] - 40} y={CULATA} width={40} height={420} fill="#5A5478" />
          <rect x={PARED[1]} y={CULATA} width={40} height={420} fill="#5A5478" />
          <rect x={PARED[0]} y={CULATA} width={PARED[1] - PARED[0]} height={420} fill="#120E28" />
          {/* Mezcla comprimida */}
          <g clipPath="url(#camara-pr)">
            {MEZCLA.map((m, i) => {
              const x = PARED[0] + 12 + m.u * (PARED[1] - PARED[0] - 24);
              const y = CULATA + 8 + m.v * Math.max(0, corona - CULATA - 16);
              const quemado = llama > 0 && Math.hypot(x - 540, y - CULATA) < llama * 320;
              return <circle key={i} cx={x} cy={y} r={6} fill={quemado ? C.orange : "#C8D8E8"} opacity={0.85} />;
            })}
            {llama > 0 ? <circle cx={540} cy={CULATA} r={llama * 320} fill={C.orange} opacity={0.35 * (1 - llama * 0.5)} filter="url(#brillo-pr)" /> : null}
            {autoencendido > 0 ? <circle cx={PARED[1] - 10} cy={corona - 10} r={autoencendido * 140} fill={C.red} opacity={0.6} filter="url(#brillo-pr)" /> : null}
          </g>
          {/* Bujía */}
          <rect x={526} y={CULATA - 120} width={28} height={70} rx={6} fill="#E8E6F0" />
          <rect x={532} y={CULATA - 54} width={16} height={56} fill="#8C88A8" />
          {chispasOn && ciclo < 0.05 ? <circle cx={540} cy={CULATA + 4} r={20} fill={C.yellow} filter="url(#brillo-pr)" /> : null}
          {/* Pistón, biela y cigüeñal */}
          <rect x={PARED[0] + 4} y={corona} width={PARED[1] - PARED[0] - 8} height={120} rx={8} fill="#8C88A8" />
          <rect x={PARED[0] + 4} y={corona + 16} width={PARED[1] - PARED[0] - 8} height={8} fill="#5A5478" />
          <line x1={540} y1={pin} x2={munon[0]} y2={munon[1]} stroke="#C8C4D8" strokeWidth={28} strokeLinecap="round" />
          <circle cx={CIG[0]} cy={CIG[1]} r={RADIO_CIG + 26} fill="#3A3360" />
          <circle cx={munon[0]} cy={munon[1]} r={22} fill="#E8E6F0" />
          {golpe > 0.3 ? (
            <text x={PARED[1] + 70} y={corona - 30} fill={C.red} fontFamily={mono} fontSize={56} fontWeight={700} opacity={golpe}>
              ¡clac!
            </text>
          ) : null}
        </g>
      </g>

      {/* Etiquetas ancladas (tamaño constante en pantalla) */}
      <Tag x={sx(SURTIDOR[0] + 54)} y={sy(SURTIDOR[1] - 90)} dx={150} dy={-170} texto="premium" color={PREMIUM} o={tagPremium} />
      <Tag x={sx(SURTIDOR[0] + 54)} y={sy(SURTIDOR[1] - 60)} dx={180} dy={-200} texto="más octanos" color={PREMIUM} o={tagOctanos} />
      <Tag x={sx(PARED[0] + 40)} y={sy(corona + 40)} dx={-90} dy={230} texto="pistón" color={C.white} o={tagPiston} />
      <Tag x={sx(540)} y={sy(CULATA - 100)} dx={160} dy={-160} texto="bujía" color={C.yellow} o={tagBujia} />
      <Tag x={sx(PARED[1] - 10)} y={sy(corona - 10)} dx={60} dy={-240} texto="detonación" color={C.red} o={tagClac} />
      <Tag x={sx(TAPA[0])} y={sy(TAPA[1] - 20)} dx={-80} dy={-200} texto="¿requiere premium?" color={C.yellow} o={tagTapa} />
    </svg>
  );
};

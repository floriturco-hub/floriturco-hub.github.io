import { Easing, interpolate, random } from "remotion";
import { C, clamp, mono, useT } from "../theme";
import { T } from "./tiempos";

// Mundo: a la izquierda, un grillo arborícola nevado cantando en una rama, con cronómetro, contador y termómetro;
// en el centro, el detalle de las alas (lima con dientes y raspador); a la derecha, frío contra calor
// (moléculas lentas o rápidas y cantos espaciados o seguidos).
const GR = { x: 420, y: 1090, s: 2.0 };
const TERMO = { x: 880, y0: 780, y1: 1300, bulbo: 1355 };
const CRONO: [number, number] = [300, 760];
const NARANJA = "#E8703C";
const GRILLO = "#B8E07A";
const GRILLO_OSC = "#7AA84A";
const AZUL = "#6AB8F8";

const suave = { ...clamp, easing: Easing.inOut(Easing.cubic) };

// Cámara: [tiempo, centro x, centro y, zoom]
const camaraKeys = (): [number, number, number, number][] => [
  [0, 580, 1000, 1.25],
  [T.frota - 0.2, 580, 1000, 1.3],
  [T.frota + 0.5, 1850, 1010, 1.0],
  [T.movimiento - 0.3, 1850, 1010, 1.02],
  [T.movimiento + 0.5, 3100, 1010, 1.0],
  [T.dolbear - 0.3, 3100, 1010, 1.02],
  [T.dolbear + 0.5, 580, 1000, 1.25],
  [T.fin + 2, 580, 1000, 1.32],
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

// Onda triangular entre 0 y 1 (para rebotes)
const tri = (u: number) => {
  const f = ((u % 1) + 1) % 1;
  return f < 0.5 ? f * 2 : 2 - f * 2;
};

const MOLECULAS = new Array(12).fill(0).map((_, i) => ({ fx: random(`mx${i}`), fy: random(`my${i}`), vx: 0.6 + random(`mvx${i}`) * 0.6, vy: 0.5 + random(`mvy${i}`) * 0.6 }));
const ESTRELLAS = new Array(30).fill(0).map((_, i) => ({ x: -200 + random(`ex${i}`) * 1400, y: 250 + random(`ey${i}`) * 500, f: random(`ef${i}`) * 6 }));

// Grillo de perfil mirando a la izquierda; `alas` = ángulo de las alas levantadas
const Grillo: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly alas: number; readonly color?: string }> = ({ x, y, s, alas, color = GRILLO }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {/* Antenas */}
    <path d="M -62 -18 C -120 -80, -170 -90, -230 -60" fill="none" stroke={GRILLO_OSC} strokeWidth={2.5} />
    <path d="M -62 -14 C -130 -60, -180 -40, -235 -10" fill="none" stroke={GRILLO_OSC} strokeWidth={2.5} />
    {/* Patas */}
    <path d="M -40 8 L -58 34 L -70 40 M -10 10 L -14 36 L -24 42" fill="none" stroke={GRILLO_OSC} strokeWidth={4} strokeLinecap="round" />
    <path d="M 30 0 C 70 -40, 110 -36, 120 -20 L 80 34 L 96 40" fill="none" stroke={GRILLO_OSC} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M 36 -2 C 70 -30, 100 -28, 112 -18" fill="none" stroke={color} strokeWidth={12} strokeLinecap="round" />
    {/* Cuerpo */}
    <ellipse cx={20} cy={0} rx={70} ry={17} fill={color} />
    <ellipse cx={-42} cy={-4} rx={22} ry={16} fill={color} />
    <circle cx={-64} cy={-8} r={14} fill={color} />
    <circle cx={-70} cy={-12} r={4.5} fill="#2A2A30" />
    <path d="M -76 0 l -8 8" stroke={GRILLO_OSC} strokeWidth={3} />
    {/* Alas: se levantan para cantar */}
    <g transform={`rotate(${-alas} -30 -10)`}>
      <ellipse cx={30} cy={-14} rx={64} ry={13} fill="#E8F8D8" opacity={0.75} stroke={GRILLO_OSC} strokeWidth={2} />
      <path d="M -20 -14 L 80 -14 M 0 -20 L 60 -8" stroke={GRILLO_OSC} strokeWidth={1.5} opacity={0.6} />
    </g>
    <path d="M 88 4 L 104 10" stroke={GRILLO_OSC} strokeWidth={3} />
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

// Píldora de texto grande en el mundo
const Pildora: React.FC<{ readonly x: number; readonly y: number; readonly texto: string; readonly color: string; readonly o: number; readonly tam?: number }> = ({ x, y, texto, color, o, tam = 50 }) =>
  o > 0 ? (
    <g opacity={o}>
      <rect x={x - (texto.length * tam * 0.62 + 50) / 2} y={y - tam * 0.95} width={texto.length * tam * 0.62 + 50} height={tam * 1.6} rx={20} fill="#1A1430" stroke={color} strokeWidth={4} />
      <text x={x} y={y + tam * 0.3} textAnchor="middle" fill={color} fontFamily={mono} fontSize={tam} fontWeight={700}>
        {texto}
      </text>
    </g>
  ) : null;

export const GrilloMundo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const { cx, cy, zoom } = camara(t);
  const sx = (x: number) => 540 + (x - cx) * zoom;
  const sy = (y: number) => 960 + (y - cy) * zoom;
  const ventana = (a: number, b: number, entra = 0.4, sale = 0.4) => interpolate(t, [a, a + entra, b - sale, b], [0, 1, 1, 0], clamp);

  // Cronómetro y contador: 14 s → 26 cantos; luego 25 s → 45 cantos
  const C1 = [T.cuenta + 0.1, T.suma - 0.1];
  const C2 = [T.veinticinco, T.divide - 0.1];
  const seg1 = interpolate(t, C1, [0, 14], clamp);
  const seg2 = interpolate(t, C2, [0, 25], clamp);
  const enC2 = t >= T.celsius;
  const segundos = enC2 ? seg2 : seg1;
  const cantos = enC2 ? Math.floor((seg2 / 25) * 45 + 1e-6) : Math.floor((seg1 / 14) * 26 + 1e-6);
  const crono = ventana(T.cuenta - 0.2, T.porQue + 0.4) + ventana(T.celsius, T.final + 0.4);
  // Ritmo de canto (cantos por segundo de vídeo) y fase de cada canto
  const ritmo = t < C1[0] ? 3 : t < C1[1] ? 26 / (C1[1] - C1[0]) : t >= C2[0] && t < C2[1] ? 45 / (C2[1] - C2[0]) : 2.6;
  const fase = (t * ritmo) % 1;
  const canta = t < T.frota + 0.5 || t > T.dolbear;
  const alas = canta ? 28 + 10 * Math.sin(t * 90) * (fase < 0.5 ? 1 : 0.2) : 10;

  // Termómetro: 66 °F = 19 °C
  const temp = interpolate(t, [0, 1.4], [40, 66], { ...clamp, easing: Easing.out(Easing.cubic) });
  const nivelY = (f: number) => TERMO.y1 - ((f - 30) / (110 - 30)) * (TERMO.y1 - TERMO.y0);
  const lecturaF = t < T.cuenta || t >= T.suma + 0.4 ? `${Math.round(temp)} °F` : "¿? °F";
  const lecturaC = ventana(T.suma4, T.fin + 2);
  const brilloTermo = ventana(T.temperatura, T.porQue) + ventana(T.suma4, T.final);
  const formula1 = ventana(T.suma, T.porQue + 0.3);
  const formula2 = ventana(T.divide, T.final + 0.2);

  // Alas en detalle: el raspador recorre la lima
  const alasB = ventana(T.frota - 0.2, T.movimiento + 0.4, 0.6, 0.6);
  const raspX = 1850 + 330 * Math.sin(t * 2.6);
  const DIENTES = new Array(24).fill(0).map((_, i) => 1490 + i * 31);
  const clic = DIENTES.reduce((acc, dx) => Math.max(acc, 1 - Math.abs(raspX - dx) / 10), 0);
  const tagLima = ventana(T.dientes, T.movimiento);
  const tagRasp = ventana(T.raspador, T.movimiento);
  const peine = ventana(T.una, T.movimiento);

  // Frío contra calor
  const comparar = ventana(T.movimiento - 0.2, T.dolbear + 0.4, 0.6, 0.6);
  const reacciones = interpolate(t, [T.quimicas - 0.2, T.quimicas + 0.4], [0, 1], clamp);
  const focoCalor = ventana(T.calor, T.frio);
  const focoFrio = ventana(T.frio, T.dolbear + 0.4);

  // Etiquetas del mundo
  const tagAlas = ventana(T.cantar, T.frota + 0.4);
  const tagNevado = ventana(T.nevado, T.celsius);
  const tagAire = ventana(T.cuerpo, T.cantar);

  const camaraT = `translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`;

  // Ondas de sonido del canto
  const ondas = (x: number, y: number, o: number, color: string) =>
    o > 0
      ? [0, 1, 2].map((k) => {
          const p = (fase + k / 3) % 1;
          return <path key={k} d={`M ${x - 40 - p * 160} ${y - 60 - p * 120} A ${90 + p * 200} ${90 + p * 200} 0 0 0 ${x - 40 - p * 160} ${y + 60 + p * 120}`} fill="none" stroke={color} strokeWidth={5} opacity={o * (1 - p)} />;
        })
      : null;

  // Panel frío o calor
  const panel = (x0: number, rapidez: number, color: string, titulo: string, foco: number) => {
    const ancho = 460;
    return (
      <g>
        <rect x={x0} y={620} width={ancho} height={800} rx={30} fill="#14102A" stroke={color} strokeWidth={4 + 6 * foco} opacity={0.6 + 0.4 * foco} />
        <text x={x0 + ancho / 2} y={690} textAnchor="middle" fill={color} fontFamily={mono} fontSize={40} fontWeight={700}>
          {titulo}
        </text>
        {/* Moléculas: más rápidas con calor */}
        <rect x={x0 + 30} y={730} width={ancho - 60} height={300} rx={20} fill="#0E0B20" />
        <g opacity={reacciones}>
          {MOLECULAS.map((m, i) => (
            <circle key={i} cx={x0 + 52 + tri(m.fx + t * m.vx * rapidez * 0.35) * (ancho - 104)} cy={752 + tri(m.fy + t * m.vy * rapidez * 0.35) * 256} r={13} fill={color} opacity={0.85} />
          ))}
        </g>
        <Grillo x={x0 + ancho / 2 + 20} y={1130} s={1.15} alas={18 + 12 * Math.sin(t * rapidez * 9)} color={GRILLO} />
        {/* Cantos: espaciados o seguidos */}
        <line x1={x0 + 30} y1={1340} x2={x0 + ancho - 30} y2={1340} stroke="#3A3360" strokeWidth={3} />
        {new Array(14).fill(0).map((_, k) => {
          const xx = x0 + ancho - 30 - (((k / rapidez) * 55 + t * 120) % (ancho - 60));
          return k * (55 / rapidez) < ancho - 60 ? <rect key={k} x={xx - 5} y={1290} width={10} height={50} rx={4} fill={color} /> : null;
        })}
      </g>
    );
  };

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <g transform={camaraT}>
        {/* Noche en el jardín */}
        <rect x={-300} y={-400} width={1500} height={2300} fill="#10183A" opacity={0.6} />
        {ESTRELLAS.map((e, i) => (
          <circle key={i} cx={e.x} cy={e.y} r={3} fill="#E8E6F0" opacity={0.3 + 0.3 * Math.sin(t * 2 + e.f)} />
        ))}
        <circle cx={1000} cy={380} r={70} fill="#F8F0C8" opacity={0.85} />
        <path d="M -300 1560 Q 200 1500 600 1550 T 1300 1530 L 1300 1900 L -300 1900 Z" fill="#1A3A22" />
        {/* Rama y hoja */}
        <path d="M -300 1240 C 0 1190, 300 1170, 760 1130" fill="none" stroke="#5A4030" strokeWidth={26} strokeLinecap="round" />
        <path d={`M ${GR.x - 260} 1180 C ${GR.x - 100} 1080, ${GR.x + 220} 1070, ${GR.x + 330} 1150 C ${GR.x + 200} 1210, ${GR.x - 60} 1230, ${GR.x - 260} 1180 Z`} fill="#2E6A2A" />
        <path d={`M ${GR.x - 260} 1180 C ${GR.x - 50} 1150, ${GR.x + 180} 1140, ${GR.x + 330} 1150`} fill="none" stroke="#4A8A3A" strokeWidth={4} />
        {/* Grillo y sus ondas */}
        {ondas(GR.x - 150, GR.y - 20, canta ? 1 : 0, "#E8F8D8")}
        <Grillo x={GR.x} y={GR.y} s={GR.s} alas={alas} />

        {/* Termómetro */}
        <rect x={TERMO.x - 34} y={TERMO.y0 - 34} width={68} height={TERMO.y1 - TERMO.y0 + 80} rx={34} fill="#E8E6F0" opacity={0.18} stroke="#E8E6F0" strokeWidth={3} />
        <circle cx={TERMO.x} cy={TERMO.bulbo} r={56} fill={C.red} />
        <rect x={TERMO.x - 14} y={nivelY(temp)} width={28} height={TERMO.bulbo - nivelY(temp)} rx={10} fill={C.red} />
        {[40, 50, 60, 70, 80, 90, 100].map((f) => (
          <line key={f} x1={TERMO.x - 34} y1={nivelY(f)} x2={TERMO.x - 16} y2={nivelY(f)} stroke="#E8E6F0" strokeWidth={3} opacity={0.6} />
        ))}
        <circle cx={TERMO.x} cy={TERMO.bulbo} r={80} fill={C.red} opacity={0.25 * Math.min(1, brilloTermo)} />
        <Pildora x={TERMO.x - 10} y={TERMO.y0 - 90} texto={lecturaF} color={C.red} o={1} tam={44} />
        <Pildora x={700} y={930} texto="19 °C" color={C.yellow} o={lecturaC} tam={44} />

        {/* Cronómetro y contador */}
        {crono > 0 ? (
          <g opacity={Math.min(1, crono)}>
            <circle cx={CRONO[0]} cy={CRONO[1]} r={86} fill="#1A1430" stroke={C.cyan} strokeWidth={6} />
            <rect x={CRONO[0] - 14} y={CRONO[1] - 112} width={28} height={22} rx={6} fill={C.cyan} />
            <path d={`M ${CRONO[0]} ${CRONO[1]} L ${CRONO[0] + Math.sin(segundos * 0.9) * 64} ${CRONO[1] - Math.cos(segundos * 0.9) * 64}`} stroke={C.cyan} strokeWidth={5} strokeLinecap="round" />
            <text x={CRONO[0]} y={CRONO[1] + 60} textAnchor="middle" fill={C.cyan} fontFamily={mono} fontSize={30} fontWeight={700}>
              {`${Math.floor(segundos)} s`}
            </text>
            <g transform={`translate(${CRONO[0] + 230} ${CRONO[1]})`}>
              <rect x={-110} y={-70} width={220} height={140} rx={24} fill="#1A1430" stroke={C.yellow} strokeWidth={5} />
              <text y={22} textAnchor="middle" fill={C.yellow} fontFamily={mono} fontSize={70} fontWeight={700}>
                {cantos}
              </text>
              <text y={58} textAnchor="middle" fill={C.grey} fontFamily={mono} fontSize={24}>
                cantos
              </text>
            </g>
          </g>
        ) : null}
        <Pildora x={470} y={1450} texto="26 + 40 = 66 °F" color={C.yellow} o={formula1} />
        <Pildora x={470} y={1450} texto="45 ÷ 3 + 4 = 19 °C" color={C.yellow} o={formula2} />

        {/* Alas en detalle: lima con dientes y raspador */}
        <g opacity={alasB}>
          <rect x={1340} y={600} width={1020} height={840} rx={40} fill="#14102A" stroke="#3A3360" strokeWidth={4} />
          <path d="M 1400 760 C 1600 640, 2100 640, 2300 760 L 2300 900 L 1400 900 Z" fill="#E8F8D8" opacity={0.22} stroke={GRILLO_OSC} strokeWidth={3} />
          <path d="M 1400 1180 C 1600 1300, 2100 1300, 2300 1180 L 2300 1020 L 1400 1020 Z" fill="#E8F8D8" opacity={0.22} stroke={GRILLO_OSC} strokeWidth={3} />
          {/* Lima: hilera de dientes */}
          <rect x={1470} y={1020} width={780} height={26} rx={10} fill="#8AB85A" />
          {DIENTES.map((dx) => (
            <path key={dx} d={`M ${dx - 11} 1020 L ${dx} 992 L ${dx + 11} 1020 Z`} fill="#C8E89A" />
          ))}
          {/* Raspador del otro ala */}
          <path d={`M ${raspX - 30} 900 L ${raspX + 30} 900 L ${raspX + 8} 990 L ${raspX - 4} 990 Z`} fill="#F8E8B0" stroke="#A88848" strokeWidth={3} />
          <line x1={1400} y1={900} x2={2300} y2={900} stroke={GRILLO_OSC} strokeWidth={6} />
          {[0, 1, 2].map((k) => (
            <circle key={k} cx={raspX} cy={995} r={30 + k * 34 + clic * 10} fill="none" stroke={C.yellow} strokeWidth={4} opacity={clic * (0.9 - k * 0.25)} />
          ))}
          {/* Como una uña sobre un peine */}
          <g opacity={peine}>
            <rect x={1560} y={1300} width={420} height={22} rx={6} fill="#C8A878" />
            {new Array(20).fill(0).map((_, i) => (
              <rect key={i} x={1566 + i * 21} y={1322} width={9} height={60} rx={3} fill="#C8A878" />
            ))}
            <path d={`M ${1780 + 190 * Math.sin(t * 2.6)} 1300 q -26 -50 0 -90 q 30 40 0 90 z`} fill="#F0C8B0" stroke="#C89888" strokeWidth={3} />
          </g>
        </g>

        {/* Frío contra calor */}
        <g opacity={comparar}>
          {panel(2620, 1, AZUL, "frío", focoFrio)}
          {panel(3120, 3, NARANJA, "calor", focoCalor)}
        </g>
      </g>

      <Tag x={sx(GR.x + 30)} y={sy(GR.y - 40)} dx={-60} dy={-260} texto="alas" color="#E8F8D8" o={tagAlas} />
      <Tag x={sx(GR.x + 60)} y={sy(GR.y)} dx={0} dy={-330} texto="cuerpo = aire" color={C.cyan} o={tagAire} />
      <Tag x={sx(GR.x - 40)} y={sy(GR.y - 10)} dx={60} dy={-330} texto="arborícola nevado" color={GRILLO} o={tagNevado} />
      <Tag x={sx(1700)} y={sy(1030)} dx={-40} dy={180} texto="lima (dientes)" color="#C8E89A" o={tagLima} />
      <Tag x={sx(raspX)} y={sy(900)} dx={0} dy={-150} texto="raspador" color="#F8E8B0" o={tagRasp} />
    </svg>
  );
};

import { interpolate, random } from "remotion";
import { camaraEn, ClaveCamara, Panel, Pildora, Tag, ventanaEn } from "../components/Mundo";
import { C, clamp, mono, useT } from "../theme";
import { T } from "./tiempos";

// Mundo: a la izquierda, Júpiter con sus bandas y la nave que entra en llamas; en el centro, una columna vertical por
// dentro del planeta (nubes, gas cada vez más denso, hidrógeno líquido, hidrógeno metálico y núcleo) que la cámara
// recorre mientras la nave cae; a la derecha, la sonda Galileo aplastada.
// Retención (estilo §10): el gancho plantea la pregunta y el final vuelve a ella para el bucle.
const COL = { x0: 1290, x1: 2410 };
const CAPAS = [
  { y0: 400, y1: 900, c0: "#E8D0A8", c1: "#B88A5A" },
  { y0: 900, y1: 1700, c0: "#8A5A3A", c1: "#3A2A30" },
  { y0: 1700, y1: 2350, c0: "#2A3A6A", c1: "#1A2A5A" },
  { y0: 2350, y1: 3000, c0: "#5A7AA8", c1: "#8AA8D8" },
  { y0: 3000, y1: 3500, c0: "#E8703C", c1: "#F8C848" },
];
const CHISPAS = new Array(20).fill(0).map((_, i) => ({ x: COL.x0 + random(`cx${i}`) * 1100, y: 2380 + random(`cy${i}`) * 600 }));

const camaraKeys = (): ClaveCamara[] => [
  [0, 560, 1000, 1.0],
  [T.final - 0.1, 560, 1000, 1.04],
  [T.final + 0.2, 560, 1050, 0.92],
  [T.jupiter - 0.1, 560, 1050, 0.95],
  [T.jupiter + 0.2, 560, 1080, 1.2],
  [T.entrar - 0.1, 560, 1080, 1.23],
  [T.entrar + 0.2, 760, 720, 1.5],
  [T.sobrevives - 0.1, 760, 720, 1.53],
  [T.sobrevives + 0.2, 1850, 640, 1.0],
  [T.suelo, 1850, 1150, 1.0],
  [T.presion + 0.2, 1850, 1350, 1.0],
  [T.denso, 1850, 1800, 1.0],
  [T.abajo + 0.3, 1850, 2350, 1.0],
  [T.galileo - 0.2, 1850, 2650, 1.0],
  [T.galileo + 0.2, 3200, 1300, 1.0],
  [T.duro - 0.1, 3200, 1300, 1.03],
  [T.duro + 0.2, 3200, 1260, 1.4],
  [T.centro - 0.1, 3200, 1260, 1.43],
  [T.centro + 0.2, 1850, 3200, 1.0],
  [T.caliente - 0.1, 1850, 3200, 1.03],
  [T.caliente + 0.2, 1850, 3200, 1.2],
  [T.entonces - 0.1, 1850, 3200, 1.23],
  [T.entonces + 0.25, 560, 1000, 1.0],
  [T.fin + 0.3, 560, 1000, 1.04],
];

const Nave: React.FC<{ x: number; y: number; ang: number; fuego: number; e?: number }> = ({ x, y, ang, fuego, e = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${ang}) scale(${e})`}>
    {fuego > 0 ? <path d="M -40 30 Q 0 160 40 30 Z" fill={C.orange} opacity={fuego} /> : null}
    {fuego > 0 ? <path d="M -25 30 Q 0 110 25 30 Z" fill={C.yellow} opacity={fuego} /> : null}
    <path d="M -50 30 L -28 -50 L 28 -50 L 50 30 Z" fill="#C8CED8" />
    <rect x={-56} y={24} width={112} height={18} rx={8} fill="#8A5A3A" />
    <circle cx={0} cy={-14} r={12} fill="#3A6A8A" />
  </g>
);

export const JupiterMundo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const { cx, cy, zoom } = camaraEn(camaraKeys(), t);
  const sx = (x: number) => 540 + (x - cx) * zoom;
  const sy = (y: number) => 960 + (y - cy) * zoom;
  const ventana = (a: number, b: number, entra = 0.3, sale = 0.3) => ventanaEn(t, a, b, entra, sale);
  const destello = (a: number) => interpolate(t, [a, a + 0.06, a + 0.4], [0, 1, 0], clamp);

  // Nave hacia Júpiter (gancho y entrada)
  const gancho = t < T.final || t > T.entonces;
  const tg = t > T.entonces ? t - T.entonces : t;
  const llegada = gancho ? interpolate(tg, [0, 1.6], [0, 0.6], clamp) : t < T.entrar ? 0.6 : interpolate(t, [T.entrar, T.sobrevives], [0.6, 1], clamp);
  const naveX = 980 - 260 * llegada;
  const naveY = 420 + 300 * llegada;
  const fuego = llegada > 0.55 ? Math.min(1, (llegada - 0.55) * 4) : 0;

  // Caída por la columna
  const cayendo = t > T.sobrevives && t < T.galileo;
  const profundidad = Math.max(0, Math.min(1, (cy - 640) / (2650 - 640)));
  const bar = 10 ** (profundidad * 7);
  const grados = Math.round(-110 + profundidad * 9000);
  const verHud = ventana(T.presion - 0.2, T.galileo);

  // Galileo
  const verGalileo = ventana(T.galileo - 0.1, T.centro + 0.2);
  const aplasta = interpolate(t, [T.duro, T.duro + 0.8], [0, 1], clamp);

  const camaraT = `translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`;

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <defs>
        {CAPAS.map((c, i) => (
          <linearGradient key={i} id={`capa${i}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={c.c0} />
            <stop offset="1" stopColor={c.c1} />
          </linearGradient>
        ))}
        <clipPath id="planeta">
          <circle cx={560} cy={1150} r={420} />
        </clipPath>
      </defs>
      <g transform={camaraT}>
        <rect x={-600} y={-600} width={5000} height={4600} fill="#06060E" />
        {new Array(40).fill(0).map((_, k) => (
          <circle key={k} cx={-200 + random(`sx${k}`) * 4200} cy={-200 + random(`sy${k}`) * 4000} r={2 + random(`sr${k}`) * 2} fill="#FFFFFF" opacity={0.5} />
        ))}

        {/* Júpiter */}
        <g clipPath="url(#planeta)">
          <rect x={100} y={700} width={920} height={900} fill="#D8B888" />
          {[
            [770, "#B8885A"],
            [880, "#E8D8B8"],
            [960, "#A8704A"],
            [1080, "#F0E0C8"],
            [1180, "#C8946A"],
            [1300, "#E8D0A8"],
            [1420, "#A8784A"],
          ].map(([y, c], k) => (
            <rect key={k} x={100} y={Number(y)} width={920} height={60 + (k % 3) * 20} fill={String(c)} />
          ))}
          <ellipse cx={680 + Math.sin(t * 0.3) * 10} cy={1230} rx={90} ry={50} fill="#C85A3A" />
        </g>
        <circle cx={560} cy={1150} r={420} fill="none" stroke="#F0E0C8" strokeWidth={6} opacity={0.4} />
        <Nave x={naveX} y={naveY} ang={-30 + 10 * llegada} fuego={fuego} e={0.9} />
        {llegada < 0.6 ? <path d={`M ${naveX + 40} ${naveY - 40} L ${naveX + 160} ${naveY - 160}`} stroke="#8AA8D8" strokeWidth={4} strokeDasharray="10 10" /> : null}
        <Pildora x={560} y={1660} texto="¿qué hay en el centro?" color={C.white} o={ventana(T.final + 0.2, T.jupiter)} tam={40} />
        <Pildora x={560} y={610} texto="hidrógeno y helio" color="#E8D0A8" o={ventana(T.gas, T.entrar)} tam={42} />
        <Pildora x={760} y={980} texto="170 000 km/h" color={C.orange} o={ventana(T.velocidad, T.sobrevives)} tam={46} />

        {/* Columna por dentro del planeta */}
        {CAPAS.map((c, i) => (
          <rect key={i} x={COL.x0} y={c.y0} width={COL.x1 - COL.x0} height={c.y1 - c.y0} fill={`url(#capa${i})`} />
        ))}
        {[460, 560, 680, 800].map((y, k) => (
          <ellipse key={y} cx={COL.x0 + 200 + ((k * 230 + t * 40) % 600)} cy={y} rx={180} ry={30} fill="#F8F0E0" opacity={0.6} />
        ))}
        {CHISPAS.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={5} fill="#E8F8FF" opacity={0.4 + 0.6 * Math.max(0, Math.sin(t * 6 + i))} />
        ))}
        <circle cx={1850} cy={3300} r={220 + 10 * Math.sin(t * 3)} fill="#F8E080" opacity={0.35} />
        {[
          ["nubes", 500],
          ["gas cada vez más denso", 1250],
          ["como un líquido", 2000],
          ["hidrógeno metálico", 2650],
          ["núcleo", 3150],
        ].map(([txt, y]) => (
          <text key={String(txt)} x={COL.x0 + 30} y={Number(y)} fill="#FFFFFF" fontFamily={mono} fontSize={40} fontWeight={700} opacity={0.85}>
            {txt}
          </text>
        ))}
        {cayendo ? <Nave x={1850} y={cy - 120} ang={180} fuego={0.6} e={0.8 * (1 - 0.3 * profundidad)} /> : null}
        <Pildora x={1850} y={1300} texto="sin suelo" color={C.white} o={ventana(T.suelo - 0.4, T.presion + 0.4)} tam={46} />
        <Pildora x={1850} y={3420} texto="más caliente que el Sol" color={C.yellow} o={ventana(T.caliente, T.entonces)} tam={42} />

        {/* Sonda Galileo */}
        <g opacity={verGalileo}>
          <Panel x0={2700} y0={760} x1={3700} y1={1620} />
          <text x={3200} y={880} textAnchor="middle" fill={C.yellow} fontFamily={mono} fontSize={80} fontWeight={700}>
            1995
          </text>
          <g transform={`translate(3200 1230) scale(${1 + 0.3 * aplasta} ${1 - 0.55 * aplasta})`}>
            <path d="M -150 60 Q 0 -160 150 60 Z" fill="#C8A060" />
            <rect x={-110} y={60} width={220} height={90} rx={14} fill="#8A90A0" />
          </g>
          {aplasta > 0.3
            ? [0, 1, 2].map((k) => <path key={k} d={`M ${3120 + k * 80} 1200 l 20 30 l -16 20 l 22 30`} fill="none" stroke={C.red} strokeWidth={6} opacity={aplasta} />)
            : null}
          <text x={3200} y={1530} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={40} fontWeight={700}>
            sonda Galileo
          </text>
        </g>
        <Pildora x={3200} y={1000} texto="< 1 hora" color={C.red} o={ventana(T.duro + 0.3, T.centro)} tam={52} />
      </g>

      {/* Indicadores de la caída */}
      <g opacity={verHud}>
        <rect x={640} y={400} width={400} height={150} rx={20} fill="rgba(8,7,22,0.85)" stroke="#3A3360" strokeWidth={3} />
        <text x={670} y={460} fill={C.cyan} fontFamily={mono} fontSize={34} fontWeight={700}>
          {`presión ×${bar >= 1e6 ? `${Math.round(bar / 1e6)} mill.` : bar >= 1000 ? `${Math.round(bar / 1000)} mil` : Math.round(bar)}`}
        </text>
        <text x={670} y={520} fill={C.orange} fontFamily={mono} fontSize={34} fontWeight={700}>
          {`${grados} °C`}
        </text>
      </g>
      {[T.entrar, T.sobrevives, T.galileo, T.centro].map((q) => (
        <rect key={q} x={0} y={0} width={1080} height={1920} fill="#FFFFFF" opacity={0.2 * destello(q)} />
      ))}
      <Tag x={sx(naveX)} y={sy(naveY)} dx={-200} dy={-150} texto="tu nave" color="#C8CED8" o={ventana(-1, T.final - 0.2)} />
    </svg>
  );
};

import { interpolate, random } from "remotion";
import { camaraEn, ClaveCamara, Panel, Pildora, Tag, ventanaEn } from "../components/Mundo";
import { C, clamp, mono, useT } from "../theme";
import { T } from "./tiempos";

// Mundo: a la izquierda, un sobre de semillas de sandía «sin semillas»; luego la célula con 2 y 4 juegos de cromosomas,
// el cruce 4 + 2 → 3, los tríos que no hacen parejas, la sandía normal frente a la sin semillas, el campo con plantas
// polinizadoras y la parra que se planta por esquejes.
// Retención (estilo §10): cambio de plano cada 2-3 s y final que empalma con el gancho («Pero las sandías…» → «¡Estas sandías nacen de semillas!»).
const ROJO = "#E8414F";
const CASCARA = "#2A8A4A";
const COLORES = ["#F8C848", "#08D8E8", "#E8703C", "#C88AF8"];
const VERDE = "#48C878";
const UVA = "#7A4AC8";
const CAEN = new Array(16).fill(0).map((_, i) => ({ x: 480 + random(`cx${i}`) * 140, f: random(`cf${i}`), v: 0.6 + random(`cv${i}`) * 0.5 }));

// Cromosoma en X
const Cromo: React.FC<{ x: number; y: number; c: string; e?: number; o?: number }> = ({ x, y, c, e = 1, o = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${e})`} opacity={o}>
    <rect x={-8} y={-30} width={16} height={60} rx={8} fill={c} transform="rotate(25)" />
    <rect x={-8} y={-30} width={16} height={60} rx={8} fill={c} transform="rotate(-25)" />
  </g>
);

// Media sandía en corte
const Media: React.FC<{ x: number; y: number; r: number; semillas: "negras" | "blancas" }> = ({ x, y, r, semillas }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d={`M ${-r} 0 A ${r} ${r} 0 0 0 ${r} 0 Z`} fill={CASCARA} />
    <path d={`M ${-r + 22} 0 A ${r - 22} ${r - 22} 0 0 0 ${r - 22} 0 Z`} fill="#E8F0D0" />
    <path d={`M ${-r + 36} 0 A ${r - 36} ${r - 36} 0 0 0 ${r - 36} 0 Z`} fill={ROJO} />
    {new Array(9).fill(0).map((_, k) => {
      const a = 0.35 + (k / 8) * (Math.PI - 0.7);
      const rr = (r - 36) * (0.45 + (k % 3) * 0.15);
      return <ellipse key={k} cx={Math.cos(a) * rr} cy={Math.sin(a) * rr} rx={semillas === "negras" ? 10 : 7} ry={semillas === "negras" ? 16 : 11} fill={semillas === "negras" ? "#1A1414" : "#F8F0E0"} transform={`rotate(${(a * 180) / Math.PI - 90} ${Math.cos(a) * rr} ${Math.sin(a) * rr})`} />;
    })}
  </g>
);

const camaraKeys = (): ClaveCamara[] => [
  [0, 550, 1000, 1.05],
  [T.final - 0.1, 550, 1000, 1.1],
  [T.final + 0.2, 550, 960, 0.95],
  [T.normal - 0.1, 550, 960, 0.98],
  [T.normal + 0.2, 1850, 1030, 1.0],
  [T.cromosomas - 0.1, 1850, 1030, 1.03],
  [T.cromosomas + 0.2, 1850, 1030, 1.35],
  [T.quimico - 0.1, 1850, 1030, 1.38],
  [T.quimico + 0.2, 1850, 1030, 1.0],
  [T.cuatro - 0.1, 1850, 1030, 1.03],
  [T.cuatro + 0.2, 1850, 1030, 1.3],
  [T.cruzar - 0.1, 1850, 1030, 1.33],
  [T.cruzar + 0.2, 3100, 1030, 1.0],
  [T.tres - 0.1, 3100, 1030, 1.03],
  [T.tres + 0.2, 3100, 1180, 1.5],
  [T.parejas - 0.1, 3100, 1180, 1.53],
  [T.parejas + 0.2, 3100, 1180, 1.75],
  [T.esteril - 0.1, 3100, 1180, 1.78],
  [T.esteril + 0.2, 3100, 1150, 1.3],
  [T.semillas - 0.1, 3100, 1150, 1.33],
  [T.semillas + 0.2, 4350, 1030, 1.0],
  [T.blancas - 0.1, 4350, 1030, 1.03],
  [T.blancas + 0.2, 4600, 1060, 1.6],
  [T.poreso - 0.1, 4600, 1060, 1.63],
  [T.poreso + 0.2, 5600, 1030, 1.0],
  [T.siembran - 0.1, 5600, 1030, 1.03],
  [T.siembran + 0.2, 5600, 1060, 1.35],
  [T.uvas - 0.1, 5600, 1060, 1.38],
  [T.uvas + 0.2, 6850, 1030, 1.0],
  [T.clones - 0.1, 6850, 1030, 1.03],
  [T.clones + 0.2, 6850, 1060, 1.25],
  [T.pero - 0.1, 6850, 1060, 1.28],
  [T.pero + 0.25, 550, 1000, 1.05],
  [T.fin + 0.3, 550, 1000, 1.1],
];

export const SandiaMundo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const { cx, cy, zoom } = camaraEn(camaraKeys(), t);
  const sx = (x: number) => 540 + (x - cx) * zoom;
  const sy = (y: number) => 960 + (y - cy) * zoom;
  const ventana = (a: number, b: number, entra = 0.3, sale = 0.3) => ventanaEn(t, a, b, entra, sale);
  const destello = (a: number) => interpolate(t, [a, a + 0.06, a + 0.4], [0, 1, 0], clamp);

  // Célula: 2 juegos que se duplican a 4 con colchicina
  const verCelula = ventana(T.normal - 0.1, T.cruzar + 0.2);
  const dobla = interpolate(t, [T.quimico + 1.2, T.cuatro], [0, 1], clamp);
  const gota = interpolate(t, [T.quimico + 0.2, T.quimico + 1.2], [0, 1], clamp);

  // Cruce y tríos
  const verCruce = ventana(T.cruzar - 0.1, T.semillas + 0.2);
  const hijo = interpolate(t, [T.cruzar + 1.6, T.tres], [0, 1], clamp);
  const parejas = interpolate(t, [T.parejas + 0.3, T.parejas + 1.4], [0, 1], clamp);
  const padres = ventana(T.cruzar - 0.1, T.tres + 0.3);
  const sello = interpolate(t, [T.esteril, T.esteril + 0.25], [0, 1], clamp);

  // Paneles
  const verSandias = ventana(T.semillas - 0.1, T.poreso + 0.2);
  const verCampo = ventana(T.poreso - 0.1, T.uvas + 0.2);
  const verUvas = ventana(T.uvas - 0.1, T.pero + 0.2);
  const crece = interpolate(t, [T.ramas + 0.3, T.clones + 0.6], [0, 1], clamp);

  const camaraT = `translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`;

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <g transform={camaraT}>
        <rect x={-300} y={-400} width={7900} height={2400} fill="#1E1C2A" />

        {/* Sobre de semillas */}
        <rect x={300} y={600} width={500} height={540} rx={20} fill="#F8F0E0" />
        <rect x={300} y={600} width={500} height={70} rx={20} fill={CASCARA} />
        <text x={550} y={650} textAnchor="middle" fill="#FFFFFF" fontFamily={mono} fontSize={40} fontWeight={700}>
          SANDÍA
        </text>
        <Media x={550} y={760} r={190} semillas="blancas" />
        <text x={550} y={1020} textAnchor="middle" fill={CASCARA} fontFamily={mono} fontSize={46} fontWeight={700}>
          SIN SEMILLAS
        </text>
        <text x={550} y={1090} textAnchor="middle" fill="#8A7A5A" fontFamily={mono} fontSize={30} fontWeight={700}>
          triploide
        </text>
        <path d="M 470 1140 L 630 1140 L 600 1180 L 500 1180 Z" fill="#E8DCC0" />
        {CAEN.map((s, i) => {
          const p = (t * s.v + s.f) % 1;
          return <ellipse key={i} cx={s.x + (p - 0.5) * 20} cy={1180 + p * 230} rx={10} ry={15} fill="#5A4030" stroke="#C8B090" strokeWidth={2} />;
        })}
        <ellipse cx={550} cy={1430} rx={170} ry={36} fill="#5A4030" />
        <Pildora x={550} y={1530} texto="¡semillas!" color={C.yellow} o={Math.max(ventana(-1, T.final), ventana(T.pero, T.fin + 2))} tam={46} />
        <Pildora x={550} y={1530} texto="¿y las uvas?" color="#B89AF8" o={ventana(T.final + 0.3, T.normal)} tam={46} />

        {/* Célula con cromosomas */}
        <g opacity={verCelula}>
          <Panel x0={1340} y0={600} x1={2360} y1={1460} />
          <circle cx={1850} cy={1030} r={330} fill="#2A3A2A" stroke={VERDE} strokeWidth={8} />
          {COLORES.map((c, i) =>
            [0, 1, 2, 3].map((k) => {
              if (k > 1 && dobla <= 0) {
                return null;
              }
              return <Cromo key={`${i}-${k}`} x={1700 + i * 100} y={900 + k * 85} c={c} e={k > 1 ? dobla : 1} />;
            }),
          )}
          {gota > 0 && gota < 1 ? <ellipse cx={1850} cy={620 + 300 * gota} rx={20} ry={28} fill={C.cyan} /> : null}
          {gota >= 1 && dobla < 1 ? <circle cx={1850} cy={1030} r={330 * dobla + 40} fill="none" stroke={C.cyan} strokeWidth={6} opacity={1 - dobla} /> : null}
        </g>
        <Pildora x={1850} y={1420} texto={dobla > 0.5 ? "4 juegos" : "2 juegos"} color={dobla > 0.5 ? C.cyan : C.white} o={Math.max(ventana(T.cromosomas, T.quimico), ventana(T.cuatro, T.cruzar))} tam={46} />
        <Pildora x={1850} y={680} texto="colchicina" color={C.cyan} o={ventana(T.quimico + 0.2, T.cuatro)} tam={42} />

        {/* Cruce 4 + 2 → 3 */}
        <g opacity={verCruce}>
          <Panel x0={2600} y0={600} x1={3600} y1={1460} />
          {(
            [
              [2830, 820, 4],
              [3370, 820, 2],
            ] as const
          ).map(([x, y, n]) => (
            <g key={x} opacity={padres}>
              <circle cx={x} cy={y} r={150} fill="#2A3A2A" stroke={VERDE} strokeWidth={6} />
              {COLORES.map((c, i) => new Array(n).fill(0).map((_, k) => <Cromo key={`${i}-${k}`} x={x - 90 + i * 60} y={y - (n - 1) * 25 + k * 50} c={c} e={0.6} />))}
              <text x={x} y={y - 170} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={36} fontWeight={700}>
                {n} juegos
              </text>
            </g>
          ))}
          <text x={3100} y={840} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={70} fontWeight={700} opacity={padres}>
            ×
          </text>
          <path d="M 3100 920 L 3100 1000 M 3080 980 L 3100 1000 L 3120 980" fill="none" stroke={C.white} strokeWidth={6} opacity={hijo} />
          <g opacity={hijo}>
            <circle cx={3100} cy={1200} r={190} fill="#3A2A2A" stroke={C.yellow} strokeWidth={6} />
            {COLORES.map((c, i) =>
              [0, 1, 2].map((k) => {
                const solo = k === 2;
                const xBase = 2960 + i * 95;
                const yBase = 1120 + k * 75;
                const x = solo ? xBase + Math.sin(t * 9 + i) * 6 * parejas : xBase + (k === 0 ? 14 : -14) * parejas;
                const y = solo ? yBase + 30 * parejas : yBase + (k === 0 ? 30 : -30) * parejas * 0.6;
                return <Cromo key={`${i}-${k}`} x={x} y={y} c={c} e={0.75} o={solo && parejas > 0 ? 0.55 + 0.45 * Math.abs(Math.sin(t * 6)) : 1} />;
              }),
            )}
          </g>
          {sello > 0 ? (
            <g opacity={sello} transform={`translate(3100 1200) rotate(-12) scale(${1.4 - 0.4 * sello})`}>
              <rect x={-180} y={-50} width={360} height={100} rx={12} fill="#1E1C2A" fillOpacity={0.6} stroke={C.red} strokeWidth={8} />
              <text y={20} textAnchor="middle" fill={C.red} fontFamily={mono} fontSize={58} fontWeight={700}>
                ESTÉRIL
              </text>
            </g>
          ) : null}
        </g>
        <Pildora x={3100} y={1440} texto="3 juegos" color={C.yellow} o={ventana(T.tres, T.parejas)} tam={44} />

        {/* Normal frente a sin semillas */}
        <g opacity={verSandias}>
          <Panel x0={3850} y0={600} x1={4850} y1={1460} />
          <Media x={4110} y={940} r={210} semillas="negras" />
          <Media x={4600} y={940} r={210} semillas="blancas" />
          <text x={4110} y={1240} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={36} fontWeight={700}>
            normal
          </text>
          <text x={4600} y={1240} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={36} fontWeight={700}>
            «sin semillas»
          </text>
        </g>

        {/* Campo: cruce cada año y polinizadoras */}
        <g opacity={verCampo}>
          <Panel x0={5100} y0={600} x1={6100} y1={1460} />
          <rect x={5130} y={1000} width={940} height={440} rx={20} fill="#5A4030" />
          {[0, 1, 2, 3, 4].map((f) =>
            new Array(6).fill(0).map((_, k) => {
              const normal = f === 2;
              return (
                <g key={`${f}-${k}`}>
                  <ellipse cx={5200 + k * 160} cy={1060 + f * 80} rx={46} ry={22} fill={normal ? "#7AC87A" : CASCARA} />
                  {normal ? <circle cx={5200 + k * 160} cy={1050 + f * 80} r={10} fill={C.yellow} /> : null}
                </g>
              );
            }),
          )}
          <g transform={`translate(${5300 + ((t * 160) % 700)} ${1180 + Math.sin(t * 9) * 24})`}>
            <ellipse rx={22} ry={15} fill={C.yellow} />
            <line x1={-6} y1={-14} x2={-6} y2={14} stroke="#1A1A1A" strokeWidth={5} />
            <line x1={6} y1={-14} x2={6} y2={14} stroke="#1A1A1A" strokeWidth={5} />
            <ellipse cx={-4} cy={-20} rx={12} ry={8} fill="#FFFFFF" opacity={0.7} />
          </g>
          <g transform="translate(5600 800)">
            <rect x={-110} y={-90} width={220} height={150} rx={16} fill="#F8F0E0" />
            <text y={-10} textAnchor="middle" fill={CASCARA} fontFamily={mono} fontSize={32} fontWeight={700}>
              semillas
            </text>
            <text y={36} textAnchor="middle" fill={CASCARA} fontFamily={mono} fontSize={32} fontWeight={700}>
              nuevas
            </text>
            <path d={`M 170 -40 A 60 60 0 1 1 150 40`} fill="none" stroke={C.yellow} strokeWidth={8} transform={`rotate(${t * 90} 120 0)`} />
          </g>
        </g>
        <Pildora x={5600} y={1420} texto="plantas normales" color="#7AC87A" o={ventana(T.siembran + 0.3, T.uvas)} tam={42} />

        {/* Uvas: esquejes */}
        <g opacity={verUvas}>
          <Panel x0={6350} y0={600} x1={7350} y1={1460} />
          <rect x={6380} y={1250} width={940} height={190} rx={20} fill="#5A4030" />
          {/* Parra madre */}
          <path d="M 6560 1250 C 6540 1100, 6600 1000, 6560 880" fill="none" stroke="#7A5A3A" strokeWidth={22} strokeLinecap="round" />
          {new Array(7).fill(0).map((_, k) => (
            <circle key={k} cx={6540 + (k % 3) * 34} cy={900 + Math.floor(k / 3) * 32} r={18} fill={UVA} />
          ))}
          {/* Rama cortada y plantada que crece */}
          <path d={`M 7100 1250 L 7100 ${1250 - 120 - 250 * crece}`} stroke="#7A5A3A" strokeWidth={18} strokeLinecap="round" />
          {crece > 0.5
            ? new Array(7).fill(0).map((_, k) => <circle key={k} cx={7080 + (k % 3) * 34} cy={1000 + Math.floor(k / 3) * 32} r={18 * (crece - 0.5) * 2} fill={UVA} />)
            : null}
          <path d="M 6650 1060 C 6800 980, 6950 980, 7060 1100" fill="none" stroke={C.yellow} strokeWidth={6} strokeDasharray="14 10" />
          <path d="M 7040 1080 l 20 20 l 4 -28" fill="none" stroke={C.yellow} strokeWidth={6} />
        </g>
        <Pildora x={6850} y={760} texto="clones" color="#B89AF8" o={ventana(T.clones, T.pero + 0.2)} tam={50} />
      </g>

      {[T.quimico + 1.2, T.cruzar, T.esteril, T.uvas].map((q) => (
        <rect key={q} x={0} y={0} width={1080} height={1920} fill="#FFFFFF" opacity={0.2 * destello(q)} />
      ))}
      <Tag x={sx(1700)} y={sy(900)} dx={-60} dy={-200} texto="cromosoma" color={COLORES[0]} o={ventana(T.cromosomas + 0.2, T.quimico)} />
      <Tag x={sx(3245)} y={sy(1300)} dx={80} dy={150} texto="sin pareja" color={C.red} o={ventana(T.parejas + 1.0, T.esteril)} />
      <Tag x={sx(4640)} y={sy(1010)} dx={-80} dy={250} texto="blanditas" color="#F8F0E0" o={ventana(T.blancas + 0.3, T.poreso)} />
      <Tag x={sx(7100)} y={sy(1250)} dx={100} dy={-280} texto="rama plantada" color="#C8A070" o={ventana(T.ramas, T.clones)} />
    </svg>
  );
};

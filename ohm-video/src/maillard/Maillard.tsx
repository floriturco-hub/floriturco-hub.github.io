import { interpolate, random } from "remotion";
import { camaraEn, ClaveCamara, Panel, Pildora, Tag, ventanaEn } from "../components/Mundo";
import { C, clamp, mono, useT } from "../theme";
import { T } from "./tiempos";

// Mundo: a la izquierda, un filete en la sartén y una tostada que se doran; en el centro, azúcar y proteína que a más de
// 140 °C reaccionan y sueltan cientos de moléculas de aroma; a la derecha, la olla de agua que no pasa de 100 °C (carne
// gris) frente a la sartén caliente.
// Retención (estilo §10): el gancho plantea la pregunta y el final vuelve a ella para el bucle.
const CRUDO = "#C87A7A";
const DORADO = "#7A3E1A";
const PAN = "#F0D8A0";
const TOSTADO = "#B86A2A";
const AZUCAR = C.yellow;
const PROTE = "#5A9AE8";
const NUEVAS = new Array(16).fill(0).map((_, i) => ({ a: (i / 16) * Math.PI * 2 + random(`na${i}`) * 0.3, r: 0.5 + random(`nr${i}`) * 0.5, c: ["#E8703C", "#C88A3A", "#8A5CC8", "#48C878", "#E8414F"][i % 5], s: random(`ns${i}`) }));

const mezcla = (a: string, b: string, p: number) => {
  const h = (s: string, k: number) => parseInt(s.slice(1 + 2 * k, 3 + 2 * k), 16);
  return `rgb(${[0, 1, 2].map((k) => Math.round(h(a, k) + (h(b, k) - h(a, k)) * Math.max(0, Math.min(1, p)))).join(",")})`;
};

const camaraKeys = (): ClaveCamara[] => [
  [0, 520, 1140, 1.15],
  [T.final - 0.1, 520, 1140, 1.2],
  [T.final + 0.2, 520, 1120, 1.0],
  [T.superficie - 0.1, 520, 1120, 1.03],
  [T.superficie + 0.2, 450, 1190, 1.8],
  [T.azucares - 0.1, 450, 1190, 1.83],
  [T.azucares + 0.2, 1850, 1030, 1.0],
  [T.encima - 0.1, 1850, 1030, 1.03],
  [T.encima + 0.2, 1500, 1020, 1.35],
  [T.reaccionan - 0.1, 1500, 1020, 1.38],
  [T.reaccionan + 0.2, 1850, 1000, 1.45],
  [T.maillard - 0.1, 1850, 1000, 1.48],
  [T.maillard + 0.2, 1850, 1030, 1.0],
  [T.forman - 0.1, 1850, 1030, 1.03],
  [T.forman + 0.2, 1850, 1030, 1.15],
  [T.aromas - 0.1, 1850, 1030, 1.18],
  [T.aromas + 0.2, 1850, 950, 1.35],
  [T.dorado - 0.1, 1850, 950, 1.38],
  [T.dorado + 0.2, 450, 1190, 1.55],
  [T.costra - 0.1, 450, 1190, 1.58],
  [T.costra + 0.2, 640, 1110, 1.05],
  [T.hervida - 0.1, 640, 1110, 1.08],
  [T.hervida + 0.2, 2880, 1120, 1.4],
  [T.agua - 0.1, 2880, 1120, 1.43],
  [T.agua + 0.2, 3100, 1030, 1.0],
  [T.nunca - 0.1, 3100, 1030, 1.03],
  [T.nunca + 0.2, 3100, 1000, 1.15],
  [T.dora - 0.1, 3100, 1000, 1.18],
  [T.dora + 0.2, 2880, 1180, 1.6],
  [T.falta - 0.1, 2880, 1180, 1.63],
  [T.falta + 0.2, 3330, 1120, 1.35],
  [T.poreso - 0.1, 3330, 1120, 1.38],
  [T.poreso + 0.25, 520, 1140, 1.15],
  [T.fin + 0.3, 520, 1140, 1.2],
];

const Termometro: React.FC<{ x: number; y0: number; y1: number; v: number; max: number; color: string }> = ({ x, y0, y1, v, max, color }) => {
  const h = (y1 - y0) * Math.min(1, v / max);
  return (
    <g>
      <rect x={x - 22} y={y0} width={44} height={y1 - y0} rx={22} fill="#E8E6F0" />
      <rect x={x - 12} y={y1 - h} width={24} height={h} rx={12} fill={color} />
      <circle cx={x} cy={y1 + 30} r={40} fill={color} />
    </g>
  );
};

export const MaillardMundo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const { cx, cy, zoom } = camaraEn(camaraKeys(), t);
  const sx = (x: number) => 540 + (x - cx) * zoom;
  const sy = (y: number) => 960 + (y - cy) * zoom;
  const ventana = (a: number, b: number, entra = 0.3, sale = 0.3) => ventanaEn(t, a, b, entra, sale);
  const destello = (a: number) => interpolate(t, [a, a + 0.06, a + 0.4], [0, 1, 0], clamp);

  // Sartén y tostada: doradas en el gancho y el final; cruda al explicar, se dora en «color dorado»
  const dora = t < T.final || t > T.poreso ? 1 : t < T.dorado ? 0.15 : interpolate(t, [T.dorado - 0.2, T.dorado + 1.2], [0.15, 1], clamp);
  const carne = mezcla(CRUDO, DORADO, dora);
  const pan = mezcla(PAN, TOSTADO, dora);

  // Moléculas
  const verMol = ventana(T.azucares - 0.1, T.dorado + 0.2);
  const temp = interpolate(t, [T.encima, T.grados + 0.6], [60, 160], clamp);
  const junta = interpolate(t, [T.reaccionan, T.reaccionan + 0.9], [0, 1], clamp);
  const suelta = interpolate(t, [T.forman, T.forman + 1.2], [0, 1], clamp);

  // Olla y sartén
  const verComp = ventana(T.hervida - 0.1, T.poreso + 0.2);
  const t100 = interpolate(t, [T.agua, T.agua + 0.8], [20, 100], clamp);

  const camaraT = `translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`;
  const chisporroteo = (x0: number, w: number, y: number, o: number) =>
    o > 0
      ? new Array(10).fill(0).map((_, k) => {
          const q = (t * 1.6 + k / 10) % 1;
          return <circle key={k} cx={x0 + ((k * 37) % w) + Math.sin(t * 8 + k) * 10} cy={y - q * 120} r={5} fill="#FFFFFF" opacity={o * (1 - q)} />;
        })
      : null;

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <g transform={camaraT}>
        <rect x={-300} y={-400} width={4200} height={2400} fill="#1E1A22" />

        {/* Estufa, sartén con filete y tostada */}
        <rect x={100} y={1300} width={900} height={300} rx={14} fill="#2A2E38" />
        <rect x={180} y={1240} width={560} height={60} rx={24} fill="#3A3F4C" />
        <rect x={-60} y={1256} width={250} height={26} rx={12} fill="#2A2A30" />
        <path d="M 300 1240 C 280 1180, 320 1140, 420 1140 C 520 1135, 610 1150, 610 1200 C 612 1225, 600 1240, 580 1240 Z" fill={carne} />
        {dora > 0.4
          ? [0, 1, 2].map((k) => <line key={k} x1={340 + k * 80} y1={1160} x2={400 + k * 80} y2={1230} stroke="#3A1A0A" strokeWidth={10} opacity={(dora - 0.4) * 1.6} strokeLinecap="round" />)
          : null}
        {chisporroteo(300, 300, 1150, 1)}
        {[0, 1, 2].map((k) => {
          const q = (t * 0.5 + k / 3) % 1;
          return <path key={k} d={`M ${360 + k * 90} ${1120 - q * 200} q 20 -30 0 -60 q -20 -30 0 -60`} fill="none" stroke="#C8C8D0" strokeWidth={7} strokeLinecap="round" opacity={0.5 * (1 - q)} />;
        })}
        <g transform="translate(840 1110)">
          <path d="M -110 140 L -110 -40 C -150 -60, -150 -150, -60 -150 L 60 -150 C 150 -150, 150 -60, 110 -40 L 110 140 Z" fill="#C8A060" />
          <path d="M -94 126 L -94 -36 C -128 -56, -126 -134, -56 -134 L 56 -134 C 126 -134, 128 -56, 94 -36 L 94 126 Z" fill={pan} />
        </g>
        <Pildora x={520} y={780} texto="¿y hervido?" color={C.white} o={ventana(T.final + 0.2, T.superficie)} tam={46} />
        <Pildora x={640} y={760} texto="la costra" color={C.orange} o={ventana(T.costra + 0.2, T.hervida)} tam={50} />

        {/* Moléculas */}
        <g opacity={verMol}>
          <Panel x0={1340} y0={600} x1={2360} y1={1460} />
          <Termometro x={1450} y0={700} y1={1300} v={temp} max={180} color={temp > 140 ? C.orange : C.red} />
          <line x1={1410} y1={1300 - 600 * (140 / 180)} x2={1500} y2={1300 - 600 * (140 / 180)} stroke={C.yellow} strokeWidth={6} />
          <text x={1520} y={1300 - 600 * (140 / 180) + 12} fill={C.yellow} fontFamily={mono} fontSize={34} fontWeight={700}>
            140 °C
          </text>
          {suelta < 1 ? (
            <g opacity={1 - suelta}>
              <g transform={`translate(${1700 + 130 * junta} 1000) rotate(${t * 40})`}>
                <path d="M 0 -60 L 52 -30 L 52 30 L 0 60 L -52 30 L -52 -30 Z" fill="none" stroke={AZUCAR} strokeWidth={10} />
              </g>
              <path d={`M ${2140 - 130 * junta} 940 ${new Array(5).fill(0).map((_, k) => `l ${k % 2 ? 40 : -40} 30`).join(" ")}`} fill="none" stroke={PROTE} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
              <text x={1700 + 130 * junta} y={1110} textAnchor="middle" fill={AZUCAR} fontFamily={mono} fontSize={32} fontWeight={700} opacity={1 - junta}>
                azúcar
              </text>
              <text x={2120 - 130 * junta} y={1130} textAnchor="middle" fill={PROTE} fontFamily={mono} fontSize={32} fontWeight={700} opacity={1 - junta}>
                proteína
              </text>
            </g>
          ) : null}
          {suelta > 0
            ? NUEVAS.map((n, i) => {
                const x = 1900 + Math.cos(n.a) * n.r * 340 * suelta + Math.sin(t * 2 + i) * 10;
                const y = 1000 + Math.sin(n.a) * n.r * 300 * suelta - 60 * suelta * n.s;
                return <polygon key={i} points="0,-20 18,-6 11,16 -11,16 -18,-6" transform={`translate(${x} ${y}) rotate(${t * 60 + i * 30})`} fill={n.c} opacity={suelta} />;
              })
            : null}
          {(
            [
              ["tostado", 1700, 760, T.aromas],
              ["nuez", 2050, 820, T.nuez],
              ["carne asada", 1880, 1350, T.carne],
            ] as const
          ).map(([txt, x, y, a]) => (
            <text key={txt} x={x} y={y - 20 * interpolate(t, [a, a + 1], [0, 1], clamp)} textAnchor="middle" fill={C.orange} fontFamily={mono} fontSize={42} fontWeight={700} opacity={ventana(a, T.dorado + 0.2)}>
              {txt}
            </text>
          ))}
        </g>
        <Pildora x={1850} y={700} texto="reacción de Maillard" color={C.yellow} o={ventana(T.maillard, T.forman)} tam={44} />

        {/* Olla de agua frente a sartén */}
        <g opacity={verComp}>
          <Panel x0={2600} y0={600} x1={3600} y1={1460} />
          <rect x={2700} y={1060} width={360} height={240} rx={24} fill="#5A5F6C" />
          <rect x={2712} y={1100} width={336} height={190} rx={18} fill="#4A8AC8" opacity={0.8} />
          <path d="M 2780 1250 C 2770 1200, 2800 1180, 2860 1180 C 2930 1176, 2980 1190, 2980 1225 C 2982 1240, 2970 1250, 2960 1250 Z" fill="#B8A8A0" />
          {[0, 1, 2, 3].map((k) => {
            const q = (t * 1.2 + k / 4) % 1;
            return <circle key={k} cx={2750 + k * 80} cy={1280 - q * 170} r={10} fill="none" stroke="#FFFFFF" strokeWidth={4} opacity={1 - q} />;
          })}
          <Termometro x={3090} y0={720} y1={1200} v={t100} max={180} color={C.cyan} />
          <rect x={3200} y={1240} width={340} height={50} rx={20} fill="#3A3F4C" />
          <path d="M 3270 1240 C 3255 1195, 3285 1170, 3360 1170 C 3440 1166, 3480 1180, 3480 1215 C 3482 1232, 3470 1240, 3460 1240 Z" fill={DORADO} />
          {chisporroteo(3270, 200, 1170, 1)}
          <Termometro x={3520} y0={720} y1={1120} v={170} max={180} color={C.orange} />
          <line x1={3040} y1={1200 - 480 * (140 / 180)} x2={3570} y2={1200 - 480 * (140 / 180)} stroke={C.yellow} strokeWidth={5} strokeDasharray="18 12" opacity={ventana(T.nunca, T.poreso + 0.2)} />
        </g>
        <Pildora x={2880} y={700} texto="máx. 100 °C" color={C.cyan} o={ventana(T.agua + 0.4, T.dora)} tam={44} />
        <Pildora x={2880} y={1400} texto="gris y plana" color="#B8A8A0" o={ventana(T.dora + 0.2, T.falta)} tam={44} />
        <Pildora x={3330} y={1400} texto="más calor" color={C.red} o={ventana(T.falta + 0.2, T.poreso + 0.2)} tam={46} />
      </g>

      {[T.reaccionan + 0.9, T.forman, T.hervida].map((q) => (
        <rect key={q} x={0} y={0} width={1080} height={1920} fill="#FFFFFF" opacity={0.25 * destello(q)} />
      ))}
      <Tag x={sx(450)} y={sy(1150)} dx={120} dy={-220} texto="superficie" color={C.white} o={ventana(T.superficie + 0.3, T.azucares)} />
    </svg>
  );
};

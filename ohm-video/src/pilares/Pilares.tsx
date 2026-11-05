import { interpolate } from "remotion";
import { camaraEn, ClaveCamara, Panel, Pildora, Tag, ventanaEn } from "../components/Mundo";
import { C, clamp, mono, useT } from "../theme";
import { T } from "./tiempos";

// Mundo: a la izquierda, el río en corte con la ataguía (se clava, se bombea, se construye el pilar y vuelve el agua);
// luego, la ataguía vista desde arriba; un cajón neumático en agua profunda; y el concreto vertido bajo el agua por un tubo.
const SUP = 700;
const LECHO = 1400;
const MURO = [300, 800];
const AGUA = "#2A6A9A";
const ACERO = "#8A929A";
const CONCRETO = "#A8A8B0";

const camaraKeys = (): ClaveCamara[] => [
  [0, 550, 1050, 1.15],
  [T.laminas - 0.3, 550, 1050, 1.18],
  [T.laminas + 0.5, 1850, 1030, 1.0],
  [T.bombean - 0.3, 1850, 1030, 1.02],
  [T.bombean + 0.5, 550, 1050, 1.15],
  [T.profunda - 0.3, 550, 1050, 1.18],
  [T.profunda + 0.5, 3100, 1030, 1.0],
  [T.concreto - 0.3, 3100, 1030, 1.02],
  [T.concreto + 0.5, 4300, 1030, 1.0],
  [T.terminar - 0.3, 4300, 1030, 1.02],
  [T.terminar + 0.5, 550, 1000, 1.12],
  [T.fin + 2, 550, 1000, 1.16],
];

// Lámina de acero en zigzag (corte lateral), del techo `y0` al fondo `y1`
const Lamina: React.FC<{ readonly x: number; readonly y0: number; readonly y1: number }> = ({ x, y0, y1 }) => (
  <g>
    <rect x={x - 14} y={y0} width={28} height={y1 - y0} fill={ACERO} />
    {new Array(Math.max(1, Math.floor((y1 - y0) / 40))).fill(0).map((_, k) => (
      <line key={k} x1={x - 14} y1={y0 + k * 40 + 20} x2={x + 14} y2={y0 + k * 40 + 20} stroke="#5A626A" strokeWidth={3} />
    ))}
  </g>
);

export const PilaresMundo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const { cx, cy, zoom } = camaraEn(camaraKeys(), t);
  const sx = (x: number) => 540 + (x - cx) * zoom;
  const sy = (y: number) => 960 + (y - cy) * zoom;
  const ventana = (a: number, b: number, entra = 0.4, sale = 0.4) => ventanaEn(t, a, b, entra, sale);

  // Ataguía en el río
  const murosO = Math.max(ventana(-1, 2.3, 0.4, 0.4), ventana(T.clavan - 0.2, T.terminar + 0.8, 0.3, 0.8));
  const clava = t < 2.3 ? 1 : interpolate(t, [T.clavan, T.laminas - 0.2], [0, 1], clamp);
  const fondoMuro = 900 + (LECHO + 160 - 900) * clava;
  const golpe = t > T.clavan && t < T.laminas ? Math.abs(Math.sin(t * 9)) : 0;
  const nivelDentro =
    t < 2.4
      ? interpolate(t, [0.2, 1.6, 1.9, 2.3], [SUP, LECHO - 60, LECHO - 60, SUP], clamp)
      : t < T.terminar
        ? interpolate(t, [T.bombean, T.seco], [SUP, LECHO], clamp)
        : interpolate(t, [T.vuelve - 0.6, T.vuelve + 0.6], [LECHO, SUP], clamp);
  const bombea = (t < 1.9 && t > 0.1) || (t > T.bombean && t < T.seco + 0.2) ? 1 : 0;
  const pilar = interpolate(t, [T.obreros - 0.3, T.profunda - 0.4], [0, 1], clamp);
  const tablero = interpolate(t, [T.terminar + 0.4, T.vuelve + 0.6], [0, 1], clamp);

  // Vista desde arriba
  const arriba = ventana(T.laminas - 0.3, T.bombean + 0.3, 0.6, 0.6);
  const encaja = interpolate(t, [T.rompecabezas - 0.2, T.rompecabezas + 0.8], [0, 1], clamp);
  const anillo = interpolate(t, [T.laminas, T.muro + 0.3], [0, 1], clamp);

  // Cajón neumático
  const cajon = ventana(T.profunda - 0.3, T.concreto + 0.3, 0.6, 0.6);
  const hunde = interpolate(t, [T.cajon, T.vaso + 1.2], [0, 1], clamp);
  const aire = interpolate(t, [T.aire - 0.2, T.aire + 0.8], [0, 1], clamp);
  const cajonTop = 760 + 180 * hunde;
  const cajonBorde = cajonTop + 480;
  const aguaCajon = SUP + (cajonBorde - 20 - SUP) * aire;
  const vaso = ventana(T.vaso, T.concreto + 0.3);

  // Concreto por tubo
  const tubo = ventana(T.concreto - 0.3, T.terminar + 0.3, 0.6, 0.6);
  const llena = interpolate(t, [T.tubo, T.arriba + 1.0], [0, 1], clamp);
  const nivelConcreto = LECHO - 450 * llena;

  const camaraT = `translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`;

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <g transform={camaraT}>
        {/* Río en corte */}
        <rect x={-300} y={-400} width={1500} height={2400} fill="#1A2440" opacity={0.6} />
        <rect x={-300} y={SUP} width={1500} height={LECHO - SUP} fill={AGUA} />
        <path d={`M -300 ${SUP} ${new Array(16).fill(0).map((_, i) => `Q ${-250 + i * 100} ${SUP - 8 + Math.sin(t * 2 + i) * 6} ${-200 + i * 100} ${SUP}`).join(" ")}`} fill="none" stroke="#8AD8F8" strokeWidth={4} opacity={0.6} />
        <rect x={-300} y={LECHO} width={1500} height={600} fill="#5A4A30" />
        <rect x={-300} y={LECHO + 220} width={1500} height={400} fill="#3A3428" />
        {/* Hueco seco dentro de la ataguía */}
        {murosO > 0 ? <rect x={MURO[0] + 14} y={SUP - 4} width={MURO[1] - MURO[0] - 28} height={nivelDentro - SUP + 4} fill="#1A2440" opacity={murosO} /> : null}
        {/* Pilar */}
        {pilar > 0 ? (
          <g>
            <rect x={420} y={LECHO - 40} width={260} height={60} fill={CONCRETO} />
            <rect x={480} y={LECHO - 40 - 820 * pilar} width={140} height={820 * pilar} fill={CONCRETO} />
            {[500, 550, 600].map((x) => (
              <line key={x} x1={x} y1={LECHO - 40 - 820 * pilar} x2={x} y2={LECHO - 40 - 820 * pilar - 30} stroke="#C8A848" strokeWidth={6} />
            ))}
          </g>
        ) : null}
        {/* Láminas de la ataguía y martinete */}
        {murosO > 0
          ? MURO.map((x) => (
              <g key={x} opacity={murosO}>
                <Lamina x={x} y0={fondoMuro - (LECHO + 160 - 620)} y1={fondoMuro} />
                {t > T.clavan - 0.2 && t < T.laminas ? (
                  <g transform={`translate(${x} ${fondoMuro - (LECHO + 160 - 620) - 40 - 50 * golpe})`}>
                    <rect x={-40} y={-80} width={80} height={80} rx={8} fill="#E8A040" />
                  </g>
                ) : null}
              </g>
            ))
          : null}
        {/* Bomba: el agua sale por encima del muro */}
        {bombea && murosO > 0
          ? [0, 1, 2, 3, 4].map((k) => {
              const p = (t * 1.6 + k / 5) % 1;
              return <circle key={k} cx={MURO[1] - 40 + p * 200} cy={600 - Math.sin(p * Math.PI) * 120 + p * 100} r={14} fill="#8AD8F8" />;
            })
          : null}
        {bombea && murosO > 0 ? <path d={`M 700 ${nivelDentro + 10} L 700 600 L ${MURO[1] - 40} 600`} fill="none" stroke="#3A3A44" strokeWidth={18} /> : null}
        {/* Tablero del puente */}
        {tablero > 0 ? (
          <g opacity={tablero}>
            <rect x={-300} y={560} width={1500} height={60} fill="#5A5A66" />
            <rect x={-300} y={550} width={1500} height={12} fill="#E8C848" />
          </g>
        ) : null}

        {/* Vista desde arriba: anillo de láminas que encajan */}
        <g opacity={arriba}>
          <Panel x0={1340} y0={600} x1={2360} y1={1460} fill="#1A3A5A" />
          <path
            d="M 1550 800 L 2150 800 L 2150 1260 L 1550 1260 Z"
            fill="none"
            stroke={ACERO}
            strokeWidth={22}
            strokeDasharray={`${2120 * anillo} 3000`}
            strokeLinejoin="round"
          />
          {new Array(Math.floor(28 * anillo)).fill(0).map((_, k) => {
            const per = (k / 28) * 2120;
            const [x, y] = per < 600 ? [1550 + per, 800] : per < 1060 ? [2150, 800 + per - 600] : per < 1660 ? [2150 - (per - 1060), 1260] : [1550, 1260 - (per - 1660)];
            return <circle key={k} cx={x} cy={y} r={9} fill="#C8D0D8" />;
          })}
          {/* Dos piezas que encajan */}
          <g transform="translate(1850 1030)">
            <path d={`M ${-200 + 60 * encaja} -20 l 80 0 l 30 60 l 60 0`} fill="none" stroke="#C8D0D8" strokeWidth={14} strokeLinejoin="round" />
            <path d={`M ${200 - 60 * encaja} -20 l -80 0 l -30 60 l -60 0`} fill="none" stroke={C.yellow} strokeWidth={14} strokeLinejoin="round" />
          </g>
        </g>

        {/* Cajón neumático en agua profunda */}
        <g opacity={cajon}>
          <Panel x0={2600} y0={600} x1={3600} y1={1460} fill="#14304A" />
          <rect x={2620} y={SUP} width={960} height={740} fill={AGUA} opacity={0.8} />
          <rect x={2620} y={1440 - 0} width={960} height={10} fill="#5A4A30" />
          {/* Aire dentro del cajón */}
          <rect x={2940} y={cajonTop + 40} width={320} height={aguaCajon - cajonTop - 40} fill="#E8F4FF" opacity={0.12 + 0.5 * aire} />
          <path d={`M 2920 ${cajonTop} L 3280 ${cajonTop} L 3280 ${cajonBorde} L 3260 ${cajonBorde} L 3260 ${cajonTop + 40} L 2940 ${cajonTop + 40} L 2940 ${cajonBorde} L 2920 ${cajonBorde} Z`} fill={CONCRETO} />
          <line x1={3100} y1={cajonTop} x2={3100} y2={640} stroke="#3A3A44" strokeWidth={14} />
          {aire > 0
            ? [0, 1, 2].map((k) => {
                const p = (t * 1.2 + k / 3) % 1;
                return <circle key={k} cx={3100} cy={640 + p * (cajonTop - 640)} r={8} fill="#E8F4FF" opacity={aire} />;
              })
            : null}
          {aire > 0.5
            ? [2960, 3240].map((x, k) => <path key={k} d={`M ${x} ${cajonBorde - 30} l ${k === 0 ? -50 : 50} 30 m ${k === 0 ? 10 : -10} -24 l ${k === 0 ? -10 : 10} 24 l ${k === 0 ? 24 : -24} 6`} fill="none" stroke={C.cyan} strokeWidth={6} opacity={ventana(T.empuja, T.concreto)} />)
            : null}
          {/* Vaso boca abajo en la bañera */}
          <g opacity={vaso} transform="translate(3460 820)">
            <circle r={110} fill="#0E2238" stroke={C.white} strokeWidth={4} />
            <rect x={-100} y={-10} width={200} height={100} fill={AGUA} />
            <path d="M -36 40 L -30 -60 L 30 -60 L 36 40" fill="#E8F4FF" fillOpacity={0.2} stroke={C.white} strokeWidth={5} />
            <rect x={-33} y={-56} width={66} height={80} fill="#E8F4FF" opacity={0.25} />
          </g>
        </g>
        <Pildora x={3100} y={1520} texto="aire a presión" color={C.cyan} o={ventana(T.aire, T.concreto)} tam={40} />

        {/* Concreto bajo el agua por un tubo */}
        <g opacity={tubo}>
          <Panel x0={3800} y0={600} x1={4800} y1={1460} fill="#14304A" />
          <rect x={3820} y={SUP} width={960} height={740} fill={AGUA} opacity={0.8} />
          <rect x={4150} y={650} width={300} height={LECHO - 650} fill="none" stroke={ACERO} strokeWidth={10} />
          <rect x={4155} y={nivelConcreto} width={290} height={LECHO - nivelConcreto} fill={CONCRETO} />
          <rect x={4120} y={630} width={360} height={30} rx={8} fill="#5A5A66" />
          <rect x={4285} y={500} width={30} height={Math.max(0, nivelConcreto + 60 - 500)} fill="#3A3A44" />
          <path d="M 4250 500 L 4350 500 L 4320 560 L 4280 560 Z" fill="#5A5A66" />
          {llena > 0 && llena < 1
            ? [0, 1, 2, 3].map((k) => {
                const p = (t * 1.0 + k / 4) % 1;
                return <circle key={k} cx={4300} cy={520 + p * (nivelConcreto + 40 - 520)} r={10} fill={CONCRETO} />;
              })
            : null}
          {llena > 0
            ? [4200, 4400].map((x) => (
                <path key={x} d={`M ${x} ${nivelConcreto - 30} l 0 -80 m -16 22 l 16 -22 l 16 22`} fill="none" stroke={C.cyan} strokeWidth={6} strokeLinecap="round" opacity={ventana(T.pesado, T.terminar)} />
              ))
            : null}
          <text x={4300} y={1440} textAnchor="middle" fill={C.grey} fontFamily={mono} fontSize={28}>
            fondo
          </text>
        </g>
      </g>

      <Tag x={sx(MURO[0])} y={sy(900)} dx={-40} dy={-260} texto="láminas de acero" color="#C8D0D8" o={ventana(T.clavan + 0.3, T.laminas)} />
      <Tag x={sx(550)} y={sy(LECHO - 20)} dx={0} dy={180} texto="lecho seco" color={C.yellow} o={ventana(T.seco, T.profunda)} />
      <Tag x={sx(1850)} y={sy(800)} dx={0} dy={-160} texto="ataguía" color={C.yellow} o={ventana(T.ataguia - 0.3, T.bombean)} />
      <Tag x={sx(3280)} y={sy(cajonTop + 120)} dx={80} dy={-230} texto="cajón" color={CONCRETO} o={ventana(T.cajon, T.aire)} />
      <Tag x={sx(4285)} y={sy(800)} dx={-150} dy={-220} texto="tubo" color={C.white} o={ventana(T.tubo, T.pesado)} />
      <Tag x={sx(550)} y={sy(LECHO - 300)} dx={0} dy={-330} texto="pilar" color={CONCRETO} o={ventana(T.vuelve, T.fin + 2)} />
    </svg>
  );
};

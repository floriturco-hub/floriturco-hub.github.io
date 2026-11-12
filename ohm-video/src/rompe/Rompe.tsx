import { interpolate } from "remotion";
import { camaraEn, ClaveCamara, Panel, Pildora, Tag, ventanaEn } from "../components/Mundo";
import { C, clamp, mono, useT } from "../theme";
import { T } from "./tiempos";

// Mundo: a la izquierda, el rompehielos de perfil que se sube al hielo y lo parte con su peso (los trozos pasan por
// debajo); en el centro, proa afilada frente a proa de cuchara; a la derecha, el casco de frente (acero grueso y tanques
// que pasan agua de lado a lado); al fondo, el hielo grueso al que embiste una y otra vez.
// Retención (estilo §10): cambio de plano cada 2-3 s y final que empalma con el gancho (el barco aplastando el hielo).
const MAR = "#1A4A7A";
const HIELO = "#E8F4FF";
const CASCO = "#C83A3A";
const W = 1200;
const V = 130;
const BLOQUE = 150;

const camaraKeys = (): ClaveCamara[] => [
  [0, 520, 1100, 1.1],
  [T.final - 0.1, 520, 1100, 1.14],
  [T.final + 0.2, 520, 1060, 0.95],
  [T.proa - 0.1, 520, 1060, 0.98],
  [T.proa + 0.2, 660, 1120, 1.55],
  [T.avanzar - 0.1, 660, 1120, 1.58],
  [T.avanzar + 0.2, 520, 1100, 1.0],
  [T.encima - 0.1, 520, 1100, 1.03],
  [T.encima + 0.2, 680, 1150, 1.45],
  [T.peso - 0.1, 680, 1150, 1.48],
  [T.peso + 0.2, 520, 1050, 1.0],
  [T.parte - 0.1, 520, 1050, 1.03],
  [T.parte + 0.2, 720, 1200, 1.6],
  [T.afilada - 0.1, 720, 1200, 1.63],
  [T.afilada + 0.2, 1850, 1030, 1.0],
  [T.casco - 0.1, 1850, 1030, 1.03],
  [T.casco + 0.2, 3100, 1030, 1.0],
  [T.cm - 0.1, 3100, 1030, 1.03],
  [T.cm + 0.2, 3360, 1060, 1.7],
  [T.trozos - 0.1, 3360, 1060, 1.73],
  [T.trozos + 0.2, 480, 1300, 1.15],
  [T.debajo - 0.1, 480, 1300, 1.18],
  [T.debajo + 0.2, 380, 1330, 1.35],
  [T.grueso - 0.1, 380, 1330, 1.38],
  [T.grueso + 0.2, 4350, 1030, 1.0],
  [T.retrocede - 0.1, 4350, 1030, 1.03],
  [T.retrocede + 0.2, 4300, 1060, 1.1],
  [T.embiste - 0.1, 4300, 1060, 1.12],
  [T.embiste + 0.2, 4520, 1080, 1.45],
  [T.algunos - 0.1, 4520, 1080, 1.48],
  [T.algunos + 0.2, 3100, 1030, 1.0],
  [T.mecerse - 0.1, 3100, 1030, 1.03],
  [T.mecerse + 0.2, 3100, 1050, 1.25],
  [T.porque - 0.1, 3100, 1050, 1.28],
  [T.porque + 0.25, 520, 1100, 1.1],
  [T.fin + 0.3, 520, 1100, 1.14],
];

// Rompehielos de perfil: proa redonda e inclinada a la derecha (origen en la línea de flotación, bajo la proa)
const Rompehielos: React.FC<{ x: number; y: number; ang: number; e?: number }> = ({ x, y, ang, e = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${ang}) scale(${e})`}>
    <path d="M -620 -60 L 40 -60 Q 150 -60 210 -10 Q 240 20 200 50 Q 120 80 -20 80 L -600 80 Q -640 40 -620 -60 Z" fill={CASCO} />
    <path d="M -620 -60 L 40 -60 Q 150 -60 210 -10 L 200 -2 Q 140 -48 40 -48 L -620 -48 Z" fill="#E8E6F0" opacity={0.9} />
    <rect x={-520} y={-200} width={320} height={140} fill="#E8E6F0" />
    <rect x={-490} y={-270} width={200} height={70} fill="#E8E6F0" />
    {[0, 1, 2, 3].map((k) => (
      <rect key={k} x={-500 + k * 70} y={-170} width={44} height={30} fill="#3A6A8A" />
    ))}
    <rect x={-440} y={-330} width={40} height={60} fill="#2A2A30" />
  </g>
);

export const RompeMundo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const { cx, cy, zoom } = camaraEn(camaraKeys(), t);
  const sx = (x: number) => 540 + (x - cx) * zoom;
  const sy = (y: number) => 960 + (y - cy) * zoom;
  const ventana = (a: number, b: number, entra = 0.3, sale = 0.3) => ventanaEn(t, a, b, entra, sale);
  const destello = (a: number) => interpolate(t, [a, a + 0.06, a + 0.4], [0, 1, 0], clamp);

  // Perfil: el hielo avanza hacia el barco; cada bloque se dobla bajo la proa y pasa por debajo
  const fase = ((t * V) / BLOQUE) % 1;
  const sube = Math.sin(fase * Math.PI) * 26;
  const cabeceo = -4 * Math.sin(fase * Math.PI);
  const proaX = 700;
  const bloques = new Array(9).fill(0).map((_, k) => {
    const x = proaX - BLOQUE + (((k * BLOQUE - t * V) % (W + BLOQUE)) + W + BLOQUE) % (W + BLOQUE) ;
    const d = proaX - x;
    const roto = d > 0 ? Math.min(1, d / 160) : 0;
    const hunde = d > 160 ? Math.min(1, (d - 160) / 300) : 0;
    return { x, roto, hunde };
  });
  const flecha = ventana(T.peso, T.parte + 0.4);
  const grieta = Math.max(ventana(T.parte, T.afilada + 0.2), t < T.final ? 1 : 0);

  // Comparación de proas
  const verComp = ventana(T.afilada - 0.1, T.casco + 0.2);

  // Casco de frente
  const verFrente = Math.max(ventana(T.casco - 0.1, T.trozos + 0.2), ventana(T.algunos - 0.1, T.porque + 0.2));
  const acero = ventana(T.casco, T.trozos + 0.2);
  const mece = t > T.algunos ? Math.sin((t - T.algunos) * 2.6) : 0;
  const tanques = ventana(T.algunos, T.porque + 0.2);

  // Embestida contra hielo grueso
  const verEmb = ventana(T.grueso - 0.1, T.algunos + 0.2);
  const ciclo = (a: number) => interpolate(t, [a, a + 0.9, a + 1.6, a + 1.75, a + 2.1], [0, -260, 0, 0, -40], clamp);
  const xEmb = t < T.retrocede ? 0 : t < T.retrocede + 2.1 ? ciclo(T.retrocede) : ciclo(T.retrocede + 2.1);
  const golpe = Math.max(destello(T.retrocede + 1.6), destello(T.retrocede + 3.7));
  const grietas = interpolate(t, [T.retrocede + 1.6, T.retrocede + 3.8], [0, 1], clamp);

  const camaraT = `translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`;

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <g transform={camaraT}>
        <rect x={-300} y={-400} width={5400} height={2400} fill="#141A26" />

        {/* Perfil: cielo, mar, hielo y barco */}
        <rect x={-300} y={500} width={1500} height={700} fill="#3A4A6A" />
        <rect x={-300} y={1200} width={1500} height={500} fill={MAR} />
        {bloques.map((b, k) => (
          <g key={k} opacity={1 - 0.7 * b.hunde} transform={`translate(${b.x} ${1170 + 40 * b.roto + 220 * b.hunde}) rotate(${-14 * b.roto + 40 * b.hunde} ${BLOQUE} 0)`}>
            <rect x={0} y={0} width={BLOQUE - 6} height={60} fill={HIELO} stroke="#A8C8E8" strokeWidth={3} />
          </g>
        ))}
        <Rompehielos x={proaX - 220} y={1180 - sube} ang={cabeceo} />
        {grieta > 0 ? <path d={`M ${proaX - 10} 1170 l 20 24 l -16 14 l 22 22`} fill="none" stroke="#3A5A8A" strokeWidth={6} opacity={grieta} /> : null}
        {flecha > 0 ? (
          <g opacity={flecha}>
            <path d="M 620 760 L 620 1020 M 580 980 L 620 1020 L 660 980" fill="none" stroke={C.yellow} strokeWidth={18} strokeLinecap="round" strokeLinejoin="round" />
          </g>
        ) : null}
        <Pildora x={520} y={640} texto="¿y si es muy grueso?" color={C.white} o={ventana(T.final + 0.3, T.proa)} tam={42} />
        <Pildora x={620} y={700} texto="miles de toneladas" color={C.yellow} o={ventana(T.peso + 0.3, T.parte)} tam={42} />
        <Pildora x={720} y={1420} texto="¡crac!" color={C.yellow} o={ventana(T.parte, T.afilada)} tam={52} />

        {/* Proa afilada frente a cuchara */}
        <g opacity={verComp}>
          <Panel x0={1340} y0={600} x1={2360} y1={1460} />
          <rect x={1360} y={780} width={980} height={200} fill={MAR} />
          <rect x={1900} y={760} width={440} height={50} fill={HIELO} />
          <path d="M 1400 700 L 1840 700 L 1980 785 L 1840 870 L 1400 870 Z" fill="#8A90A0" />
          <path d="M 1920 760 l 30 25 l -30 25" fill="none" stroke={C.red} strokeWidth={8} />
          <text x={1650} y={680} textAnchor="middle" fill={C.red} fontFamily={mono} fontSize={36} fontWeight={700}>
            afilada: se atasca ✗
          </text>
          <rect x={1360} y={1200} width={980} height={240} fill={MAR} />
          <rect x={1940} y={1180 + 30 * Math.max(0, Math.sin(t * 2))} width={400} height={50} fill={HIELO} transform={`rotate(${8 * Math.max(0, Math.sin(t * 2))} 1940 1205)`} />
          <g transform={`translate(1790 ${1190 - 10 * Math.max(0, Math.sin(t * 2))}) scale(0.62)`}>
            <path d="M -620 -60 L 40 -60 Q 150 -60 210 -10 Q 240 20 200 50 Q 120 80 -20 80 L -600 80 Q -640 40 -620 -60 Z" fill={CASCO} />
          </g>
          <text x={1650} y={1110} textAnchor="middle" fill="#48C878" fontFamily={mono} fontSize={36} fontWeight={700}>
            cuchara: sube y parte ✓
          </text>
        </g>

        {/* Casco de frente */}
        <g opacity={verFrente}>
          <Panel x0={2600} y0={600} x1={3600} y1={1460} />
          <rect x={2620} y={1080} width={960} height={360} fill={MAR} opacity={0.8} />
          <g transform={`rotate(${8 * mece * tanques} 3100 1050)`}>
            <path d="M 2800 850 L 3400 850 L 3400 1100 Q 3400 1300 3100 1300 Q 2800 1300 2800 1100 Z" fill="#3A3F4C" stroke={CASCO} strokeWidth={14 + 26 * acero} />
            <rect x={2960} y={720} width={280} height={130} fill="#E8E6F0" />
            {/* Tanques */}
            <g opacity={tanques}>
              <rect x={2840} y={1100} width={180} height={140} rx={10} fill="#1A1E28" stroke="#8A90A0" strokeWidth={4} />
              <rect x={3180} y={1100} width={180} height={140} rx={10} fill="#1A1E28" stroke="#8A90A0" strokeWidth={4} />
              <rect x={2840} y={1170 - 60 * mece} width={180} height={70 + 60 * mece} fill={C.cyan} opacity={0.7} />
              <rect x={3180} y={1170 + 60 * mece} width={180} height={70 - 60 * mece} fill={C.cyan} opacity={0.7} />
              <path d="M 3020 1220 L 3180 1220" stroke={C.cyan} strokeWidth={10} strokeDasharray="16 10" strokeDashoffset={t * 80 * Math.sign(Math.cos((t - T.algunos) * 2.6))} />
            </g>
          </g>
        </g>
        <Pildora x={3150} y={1400} texto="varios cm de acero" color="#F8A8A8" o={ventana(T.cm, T.trozos)} tam={42} />
        <Pildora x={3100} y={1400} texto="se mece" color={C.cyan} o={ventana(T.mecerse, T.porque + 0.2)} tam={46} />

        {/* Embestida contra hielo grueso */}
        <g opacity={verEmb}>
          <Panel x0={3850} y0={600} x1={4850} y1={1460} />
          <rect x={3870} y={1100} width={960} height={340} fill={MAR} />
          <rect x={4520} y={980} width={310} height={330} fill={HIELO} stroke="#A8C8E8" strokeWidth={4} />
          {grietas > 0
            ? [0, 1, 2].map((k) => (
                <path key={k} d={`M 4525 ${1020 + k * 90} l ${60 * grietas} ${20 - k * 10} l ${40 * grietas} ${30 + k * 6} l ${50 * grietas} -10`} fill="none" stroke="#3A5A8A" strokeWidth={6} />
              ))
            : null}
          <g transform={`translate(${xEmb + (golpe > 0 ? Math.sin(t * 80) * 8 * golpe : 0)} 0)`}>
            <Rompehielos x={4300} y={1100} ang={0} e={0.5} />
          </g>
          <text x={4675} y={950} textAnchor="middle" fill={HIELO} fontFamily={mono} fontSize={40} fontWeight={700}>
            3 m
          </text>
        </g>
        <Pildora x={4350} y={1400} texto="otra y otra vez" color={C.orange} o={ventana(T.embiste + 0.2, T.algunos)} tam={44} />
      </g>

      {[T.parte, T.afilada, T.retrocede + 1.6, T.retrocede + 3.7].map((q) => (
        <rect key={q} x={0} y={0} width={1080} height={1920} fill="#FFFFFF" opacity={0.2 * destello(q)} />
      ))}
      <Tag x={sx(proaX - 20)} y={sy(1180 - sube)} dx={-160} dy={-230} texto="proa de cuchara" color={C.white} o={ventana(T.proa + 0.3, T.avanzar)} />
      <Tag x={sx(380)} y={sy(1390)} dx={180} dy={150} texto="trozos por debajo" color={HIELO} o={ventana(T.trozos + 0.3, T.grueso)} />
    </svg>
  );
};

import { interpolate, random } from "remotion";
import { camaraEn, ClaveCamara, Panel, Pildora, Tag, ventanaEn } from "../components/Mundo";
import { C, clamp, mono, useT } from "../theme";
import { T } from "./tiempos";

// Mundo: a la izquierda, la torre de Pisa sobre el suelo en corte (arena firme al norte, arcilla blanda al sur), con su
// centro de gravedad y la vertical; a la derecha, un bloque que vuelca cuando la vertical sale de la base.
type P2 = [number, number];
const PIVOTE: P2 = [550, 1350];
const PISO = 100;
const ANCHO = 180;
const PIEDRA = "#EEE6D6";
const VERDE = "#48C878";
const ESCALA = 1.8; // exageración visual de la inclinación (los grados reales van en las etiquetas)
const PARTICULAS = new Array(40).fill(0).map((_, i) => ({ x: random(`px${i}`), y: random(`py${i}`) }));

const camaraKeys = (): ClaveCamara[] => [
  [0, 560, 1000, 1.0],
  [T.saliera - 0.3, 560, 1000, 1.02],
  [T.saliera + 0.5, 1850, 1030, 1.0],
  [T.anio1990 - 0.3, 1850, 1030, 1.02],
  [T.anio1990 + 0.5, 560, 1000, 1.0],
  [T.fin + 2, 560, 1000, 1.05],
];

export const PisaMundo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const { cx, cy, zoom } = camaraEn(camaraKeys(), t);
  const sx = (x: number) => 540 + (x - cx) * zoom;
  const sy = (y: number) => 960 + (y - cy) * zoom;
  const ventana = (a: number, b: number, entra = 0.4, sale = 0.4) => ventanaEn(t, a, b, entra, sale);

  // Pisos visibles y curva de corrección
  const gancho = t < T.torre;
  const pisos = gancho ? 8 : t < T.seguir ? interpolate(t, [T.torre + 0.3, T.tres], [0, 3], clamp) : interpolate(t, [T.seguir, T.curvada], [3, 8], clamp);
  const curva = gancho || t > T.seguir ? 1 : 0;

  // Inclinación real (grados) a lo largo de la historia
  const real = gancho
    ? 5.5 + Math.sin(t * 5) * 0.6 * (1 - t / T.torre)
    : t < T.anio1990
      ? interpolate(t, [T.suelo, T.cedio + 0.5, T.seguir, T.curvada], [0, 1.5, 1.5, 4.5], clamp)
      : interpolate(t, [T.anio1990, T.cerca, T.enderezo, T.cuarenta + 0.6], [4.5, 5.5, 5.5, 4.0], clamp);
  const th = (real * ESCALA * Math.PI) / 180;
  const aMundo = (lx: number, ly: number): P2 => [PIVOTE[0] + lx * Math.cos(th) - ly * Math.sin(th), PIVOTE[1] + lx * Math.sin(th) + ly * Math.cos(th)];
  const dxPiso = (i: number) => (curva && i >= 3 ? -(i - 2) * 9 : 0);

  // Centro de gravedad de los pisos visibles
  const n = Math.max(1, Math.ceil(pisos));
  let gx = 0;
  let gy = 0;
  for (let i = 0; i < n; i++) {
    gx += dxPiso(i);
    gy += -PISO * i - PISO / 2;
  }
  const cg = aMundo(gx / n, gy / n);
  const bordeDer = aMundo(ANCHO / 2, 0);
  const alLimite = real > 5.2 ? 1 : 0;
  const verCG = Math.max(gancho ? 1 : 0, ventana(T.vuelca, T.fin + 2));
  const compacta = interpolate(t, [T.compacto, T.firme + 0.6], [0, 1], clamp);
  const pausa = ventana(T.guerras, T.seguir);
  const extrae = ventana(T.ingenieros, T.hoy);
  const curvaVer = ventana(T.curvada, T.vuelca);

  // Bloque que vuelca
  const bloque = ventana(T.saliera - 0.3, T.anio1990 + 0.3, 0.6, 0.6);
  const ang = interpolate(t, [T.saliera, T.caeria - 0.2], [8, 34], clamp);
  const cae = interpolate(t, [T.caeria - 0.2, T.caeria + 0.4], [0, 1], clamp);
  const angBloque = ang + (90 - ang) * cae;

  const camaraT = `translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`;

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <g transform={camaraT}>
        {/* Cielo y suelo en corte */}
        <rect x={-300} y={-400} width={1500} height={1750} fill="#1E2440" />
        <rect x={-300} y={1350} width={1500} height={700} fill="#C8B080" />
        <rect x={550} y={1350} width={650} height={700} fill={`rgb(${138 - 30 * compacta}, ${154 - 30 * compacta}, ${168 - 30 * compacta})`} />
        {PARTICULAS.map((p, i) => (
          <circle key={i} cx={560 + p.x * 620} cy={1380 + p.y * 280 * (1 - 0.35 * compacta)} r={6} fill="#5A6A7A" opacity={0.6} />
        ))}
        <text x={150} y={1620} fill="#5A4A2A" fontFamily={mono} fontSize={32} fontWeight={700}>
          arena firme
        </text>
        <text x={1000} y={1620} textAnchor="middle" fill="#1A2A3A" fontFamily={mono} fontSize={32} fontWeight={700}>
          arcilla blanda
        </text>
        {/* Extracción de tierra al norte */}
        {extrae > 0 ? (
          <g opacity={extrae}>
            <line x1={120} y1={1250} x2={440} y2={1420} stroke="#5A5A66" strokeWidth={22} />
            <ellipse cx={450} cy={1420} rx={60} ry={24} fill="#3A3020" />
            {[0, 1, 2].map((k) => {
              const p = (t * 0.8 + k / 3) % 1;
              return <circle key={k} cx={440 - p * 320} cy={1420 - p * 170} r={10} fill="#C8B080" />;
            })}
          </g>
        ) : null}
        {/* Torre */}
        <g transform={`translate(${PIVOTE[0]} ${PIVOTE[1]}) rotate(${(th * 180) / Math.PI})`}>
          {new Array(8).fill(0).map((_, i) => {
            const o = Math.max(0, Math.min(1, pisos - i));
            if (o <= 0) {
              return null;
            }
            const w = i === 7 ? 140 : ANCHO;
            const x0 = dxPiso(i) - w / 2;
            const y0 = -PISO * (i + 1);
            return (
              <g key={i} opacity={o}>
                <rect x={x0} y={y0} width={w} height={PISO} fill={PIEDRA} stroke="#B8AE98" strokeWidth={3} />
                <rect x={x0 - 6} y={y0} width={w + 12} height={10} fill="#D8CEB8" />
                {new Array(i === 7 ? 4 : 5).fill(0).map((__, k) => (
                  <path key={k} d={`M ${x0 + 14 + k * 33} ${y0 + 90} l 0 -46 a 11 11 0 0 1 22 0 l 0 46 Z`} fill="#8A8070" />
                ))}
              </g>
            );
          })}
          {curvaVer > 0 ? (
            <path d={`M 0 0 ${new Array(8).fill(0).map((_, i) => `L ${dxPiso(i)} ${-PISO * (i + 1)}`).join(" ")}`} fill="none" stroke={C.yellow} strokeWidth={6} strokeDasharray="14 8" opacity={curvaVer} />
          ) : null}
        </g>
        {/* Centro de gravedad y su vertical */}
        {verCG > 0 && pisos > 0.5 ? (
          <g opacity={verCG}>
            <line x1={cg[0]} y1={cg[1]} x2={cg[0]} y2={PIVOTE[1] + 10} stroke={alLimite ? C.red : VERDE} strokeWidth={5} strokeDasharray="12 8" />
            <circle cx={cg[0]} cy={cg[1]} r={16} fill={alLimite ? C.red : VERDE} stroke="#FFFFFF" strokeWidth={4} />
            <line x1={aMundo(-ANCHO / 2, 0)[0]} y1={PIVOTE[1] + 18} x2={bordeDer[0]} y2={PIVOTE[1] + 18} stroke={C.white} strokeWidth={6} />
            <circle cx={cg[0]} cy={PIVOTE[1] + 18} r={9} fill={alLimite ? C.red : VERDE} />
          </g>
        ) : null}
        <Pildora x={880} y={600} texto={`${real.toFixed(1).replace(".", ",")}°`} color={alLimite ? C.red : C.yellow} o={Math.max(gancho ? 1 : 0, ventana(T.anio1990, T.final))} tam={52} />
        <Pildora x={560} y={1500} texto="≈ 100 años de pausa" color={C.cyan} o={pausa} tam={44} />
        <Pildora x={560} y={1500} texto="estable ≈ 2 siglos" color={VERDE} o={ventana(T.hoy, T.final)} tam={44} />

        {/* Bloque que vuelca */}
        <g opacity={bloque}>
          <Panel x0={1340} y0={600} x1={2360} y1={1460} />
          <rect x={1400} y={1300} width={900} height={20} fill="#5A5A66" />
          <g transform={`translate(1900 1300) rotate(${angBloque})`}>
            <rect x={-80} y={-420} width={160} height={420} fill={PIEDRA} />
            <circle cx={0} cy={-210} r={14} fill={cae > 0 || ang > 20 ? C.red : VERDE} />
          </g>
          {cae === 0
            ? (() => {
                const a = (ang * Math.PI) / 180;
                const gxB = 1900 + 0 * Math.cos(a) + 210 * Math.sin(a);
                const gyB = 1300 - 210 * Math.cos(a);
                const fuera = gxB > 1900 + 80 * Math.cos(a);
                return <line x1={gxB} y1={gyB} x2={gxB} y2={1300} stroke={fuera ? C.red : VERDE} strokeWidth={5} strokeDasharray="12 8" />;
              })()
            : null}
          <text x={1850} y={720} textAnchor="middle" fill={cae > 0 ? C.red : VERDE} fontFamily={mono} fontSize={44} fontWeight={700}>
            {cae > 0 ? "fuera de la base: ¡cae!" : "dentro de la base: aguanta"}
          </text>
        </g>
      </g>

      <Tag x={sx(cg[0])} y={sy(cg[1])} dx={-220} dy={-160} texto="centro de gravedad" color={VERDE} o={ventana(T.vertical, T.saliera)} />
      <Tag x={sx(bordeDer[0])} y={sy(PIVOTE[1] + 18)} dx={150} dy={120} texto="base" color={C.white} o={ventana(T.base, T.saliera)} />
      <Tag x={sx(aMundo(dxPiso(6), -650)[0])} y={sy(aMundo(dxPiso(6), -650)[1])} dx={-230} dy={-80} texto="pisos corregidos" color={C.yellow} o={ventana(T.torcidos, T.vuelca)} />
      <Tag x={sx(420)} y={sy(1420)} dx={-60} dy={180} texto="sacan tierra" color="#C8B080" o={ventana(T.ingenieros + 0.3, T.hoy)} />
    </svg>
  );
};

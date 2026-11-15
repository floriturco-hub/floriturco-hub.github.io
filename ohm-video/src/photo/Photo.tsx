import { interpolate } from "remotion";
import { camaraEn, ClaveCamara, Panel, Pildora, Tag, ventanaEn } from "../components/Mundo";
import { C, clamp, mono, useT } from "../theme";
import { T } from "./tiempos";

// Mundo: a la izquierda, la pista de perfil con tres corredores y la cámara que solo mira la línea de meta; en el centro,
// la foto de photo finish que se arma rebanada a rebanada (el eje es el tiempo: la pista sale en franjas y un brazo lento
// sale estirado).
// Retención (estilo §10): el gancho plantea la pregunta y el final vuelve a ella para el bucle.
const PISTA = "#C8604A";
const META = 750;
const CARRILES = [1000, 1150, 1300];
const COLORES = ["#3A6AC8", "#E8B030", "#48C878"];

// Corredor de perfil mirando a la derecha; fase anima brazos y piernas; estira alarga el brazo de atrás
const Corredor: React.FC<{ x: number; y: number; fase: number; color: string; e?: number; estira?: number }> = ({ x, y, fase, color, e = 1, estira = 1 }) => {
  const a = Math.sin(fase) * 0.8;
  const pierna = (s: number) => `M 0 10 L ${Math.sin(a * s) * 50} 70 L ${Math.sin(a * s) * 50 + 20 * s} 120`;
  const brazo = (s: number, k: number) => `M 0 -50 L ${Math.sin(-a * s) * 40 * k} 0 L ${Math.sin(-a * s) * 40 * k + 26 * k} 10`;
  return (
    <g transform={`translate(${x} ${y - 110 * e}) scale(${e})`}>
      <path d={pierna(1)} fill="none" stroke={color} strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" />
      <path d={pierna(-1)} fill="none" stroke={color} strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" opacity={0.7} />
      <line x1={0} y1={10} x2={6} y2={-60} stroke={color} strokeWidth={20} strokeLinecap="round" />
      <path d={brazo(1, 1)} fill="none" stroke={color} strokeWidth={13} strokeLinecap="round" strokeLinejoin="round" />
      <path d={brazo(-1, estira)} fill="none" stroke={color} strokeWidth={13} strokeLinecap="round" strokeLinejoin="round" opacity={0.75} />
      <circle cx={10} cy={-88} r={22} fill="#C98A64" />
    </g>
  );
};

const camaraKeys = (): ClaveCamara[] => [
  [0, 1850, 1060, 1.15],
  [T.final - 0.1, 1850, 1060, 1.2],
  [T.final + 0.2, 1850, 1280, 1.6],
  [T.camara - 0.1, 1850, 1280, 1.63],
  [T.camara + 0.2, 550, 1080, 0.95],
  [T.normal - 0.1, 550, 1080, 0.98],
  [T.normal + 0.2, 550, 1100, 1.1],
  [T.mira - 0.1, 550, 1100, 1.13],
  [T.mira + 0.2, 750, 1120, 1.55],
  [T.meta - 0.1, 750, 1120, 1.58],
  [T.meta + 0.2, 700, 1000, 1.15],
  [T.miles - 0.1, 700, 1000, 1.18],
  [T.miles + 0.2, 750, 760, 1.6],
  [T.despues - 0.1, 750, 760, 1.63],
  [T.despues + 0.2, 1850, 1060, 1.0],
  [T.rebanadas - 0.1, 1850, 1060, 1.03],
  [T.rebanadas + 0.2, 2120, 1060, 1.5],
  [T.asi - 0.1, 2120, 1060, 1.53],
  [T.asi + 0.2, 1850, 1060, 1.0],
  [T.tiempo - 0.1, 1850, 1060, 1.03],
  [T.tiempo + 0.2, 1850, 1060, 1.12],
  [T.cada - 0.1, 1850, 1060, 1.15],
  [T.cada + 0.2, 2150, 1260, 1.5],
  [T.cruzo - 0.1, 2150, 1260, 1.53],
  [T.cruzo + 0.2, 1850, 1060, 1.05],
  [T.brazo - 0.1, 1850, 1060, 1.08],
  [T.brazo + 0.2, 1880, 1060, 1.7],
  [T.estirados - 0.1, 1880, 1060, 1.73],
  [T.estirados + 0.2, 1850, 1060, 1.1],
  [T.pista - 0.1, 1850, 1060, 1.13],
  [T.pista + 0.2, 1850, 1280, 1.5],
  [T.repite - 0.1, 1850, 1280, 1.53],
  [T.repite + 0.2, 750, 1150, 1.4],
  [T.poreso - 0.1, 750, 1150, 1.43],
  [T.poreso + 0.25, 1850, 1060, 1.15],
  [T.fin + 0.3, 1850, 1060, 1.2],
];

export const PhotoMundo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const { cx, cy, zoom } = camaraEn(camaraKeys(), t);
  const sx = (x: number) => 540 + (x - cx) * zoom;
  const sy = (y: number) => 960 + (y - cy) * zoom;
  const ventana = (a: number, b: number, entra = 0.3, sale = 0.3) => ventanaEn(t, a, b, entra, sale);
  const destello = (a: number) => interpolate(t, [a, a + 0.06, a + 0.4], [0, 1, 0], clamp);

  // Pista: corredores que pasan por la meta en bucle
  const xCorr = (k: number) => 120 + ((t * (300 - k * 25) + k * 260) % 980);
  const rendija = Math.max(ventana(T.mira, T.despues + 0.2), ventana(T.repite, T.poreso + 0.2));
  const normal = ventana(T.normal, T.mira);

  // Foto: se revela de derecha a izquierda (el tiempo corre hacia la izquierda)
  const gancho = t < T.camara || t > T.poreso;
  const revela = gancho ? 1 : t < T.despues ? 0 : interpolate(t, [T.rebanadas - 0.6, T.asi + 0.3], [0, 1], clamp);
  const verFoto = Math.max(gancho ? 1 : 0, ventana(T.despues - 0.1, T.repite + 0.2));
  const rayaRevela = 2340 - 980 * revela;

  const camaraT = `translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`;

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <defs>
        <clipPath id="revelado">
          <rect x={rayaRevela} y={640} width={2340 - rayaRevela} height={800} />
        </clipPath>
      </defs>
      <g transform={camaraT}>
        <rect x={-300} y={-400} width={3000} height={2400} fill="#161A26" />

        {/* Pista de perfil */}
        <rect x={100} y={860} width={900} height={560} fill={PISTA} />
        {[920, 1070, 1220, 1390].map((y) => (
          <line key={y} x1={100} y1={y} x2={1000} y2={y} stroke="#F8F0E8" strokeWidth={6} />
        ))}
        <rect x={META - 8} y={860} width={16} height={560} fill="#FFFFFF" />
        {CARRILES.map((y, k) => (
          <Corredor key={k} x={xCorr(k)} y={y + 40} fase={t * 14 + k} color={COLORES[k]} e={0.9} />
        ))}
        {/* Cámara en la meta */}
        <rect x={META - 6} y={560} width={12} height={300} fill="#5A5F6C" />
        <rect x={META - 60} y={520} width={120} height={70} rx={12} fill="#2A2E38" stroke="#8A90A0" strokeWidth={4} />
        <circle cx={META} cy={600} r={22} fill="#0A0A10" stroke="#8A90A0" strokeWidth={4} />
        <rect x={META - 6} y={860} width={12} height={560} fill={C.yellow} opacity={0.85 * rendija} />
        {rendija > 0 ? <path d={`M ${META} 620 L ${META - 10} 860 L ${META + 10} 860 Z`} fill={C.yellow} opacity={0.4 * rendija} /> : null}
        {normal > 0 ? (
          <g opacity={normal}>
            <rect x={160} y={880} width={780} height={520} fill="none" stroke={C.white} strokeWidth={10} />
            <line x1={160} y1={880} x2={940} y2={1400} stroke={C.red} strokeWidth={12} />
            <line x1={940} y1={880} x2={160} y2={1400} stroke={C.red} strokeWidth={12} />
          </g>
        ) : null}
        <Pildora x={750} y={760} texto="miles de fotos/s" color={C.cyan} o={ventana(T.miles, T.despues)} tam={40} />
        <Pildora x={550} y={1500} texto="no es una foto normal" color={C.white} o={ventana(T.normal + 0.2, T.mira)} tam={40} />

        {/* Foto de photo finish */}
        <g opacity={verFoto}>
          <Panel x0={1340} y0={600} x1={2360} y1={1500} />
          <g clipPath="url(#revelado)">
            <rect x={1360} y={640} width={980} height={800} fill={PISTA} />
            {[900, 1070, 1240, 1410].map((y) => (
              <line key={y} x1={1360} y1={y} x2={2340} y2={y} stroke="#F8F0E8" strokeWidth={6} />
            ))}
            {/* Franjas verticales finas: cada rebanada */}
            {new Array(49).fill(0).map((_, k) => (
              <line key={k} x1={1360 + k * 20} y1={640} x2={1360 + k * 20} y2={1440} stroke="#000000" strokeWidth={1} opacity={0.12} />
            ))}
            <Corredor x={2150} y={1040} fase={0.4} color={COLORES[0]} e={1.0} />
            <Corredor x={1880} y={1210} fase={1.8} color={COLORES[1]} e={1.0} estira={2.6} />
            <Corredor x={1620} y={1380} fase={3} color={COLORES[2]} e={1.0} />
          </g>
          <line x1={rayaRevela} y1={640} x2={rayaRevela} y2={1440} stroke={C.yellow} strokeWidth={8} opacity={revela > 0 && revela < 1 ? 1 : 0} />
          {(
            [
              [2150, "9,81 s"],
              [1880, "9,87 s"],
              [1620, "9,94 s"],
            ] as const
          ).map(([x, s]) => (
            <text key={s} x={x} y={1480} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={28} fontWeight={700} opacity={revela >= 1 ? 1 : 0}>
              {s}
            </text>
          ))}
          <text x={1400} y={680} fill={C.white} fontFamily={mono} fontSize={30} fontWeight={700} opacity={ventana(T.tiempo, T.cada + 0.3)}>
            ← tiempo
          </text>
        </g>
        <Pildora x={1850} y={1400} texto="¿y la pista?" color={C.white} o={ventana(T.final + 0.2, T.camara)} tam={44} />
        <Pildora x={1850} y={760} texto="no es espacio: es tiempo" color={C.yellow} o={ventana(T.espacio, T.cada)} tam={40} />
        <Pildora x={1880} y={900} texto="brazo lento: estirado" color={C.orange} o={ventana(T.estirados - 0.6, T.pista)} tam={38} />
        <Pildora x={1850} y={1400} texto="siempre igual: franjas" color={C.cyan} o={ventana(T.pista + 0.4, T.repite)} tam={40} />
      </g>

      {[T.camara, T.despues, T.asi, T.pista].map((q) => (
        <rect key={q} x={0} y={0} width={1080} height={1920} fill="#FFFFFF" opacity={0.2 * destello(q)} />
      ))}
      <rect x={0} y={0} width={1080} height={1920} fill="#FFFFFF" opacity={0.5 * (destello(0) + destello(T.poreso + 0.25))} />
      <Tag x={sx(META)} y={sy(1100)} dx={150} dy={-220} texto="solo esta línea" color={C.yellow} o={ventana(T.linea, T.meta + 0.6)} />
      <Tag x={sx(1360 + 980 * 0.9)} y={sy(800)} dx={-120} dy={-160} texto="una rebanada" color={C.white} o={ventana(T.rebanadas + 0.3, T.asi)} />
    </svg>
  );
};

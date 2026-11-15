import { interpolate } from "remotion";
import { camaraEn, ClaveCamara, Panel, Pildora, Tag, ventanaEn } from "../components/Mundo";
import { C, clamp, mono, useT } from "../theme";
import { T } from "./tiempos";

// Mundo: a la izquierda, la montaña en corte con el tanque a 1 km de profundidad (rayos cósmicos frenados por la roca,
// neutrinos que pasan); en el centro, la pared de sensores donde un neutrino choca y deja un anillo de luz azul; a la
// derecha, el Sol, la Tierra atravesada por neutrinos, el neutrino que cambia de tipo y el Nobel de 2015.
// Retención (estilo §10): el gancho plantea la pregunta y el final vuelve a ella para el bucle.
const ROCA = "#4A4038";
const AGUA = "#1A5AA8";
const ORO = "#C8A040";
const AZUL = "#6AD8FF";
const NEU = C.yellow;
const TIPOS = [
  ["electrón", "#F8C848"],
  ["muón", "#48C878"],
  ["tau", "#E8703C"],
] as const;

const camaraKeys = (): ClaveCamara[] => [
  [0, 550, 1280, 1.5],
  [T.final - 0.1, 550, 1280, 1.55],
  [T.final + 0.2, 550, 1000, 0.9],
  [T.japon - 0.1, 550, 1000, 0.93],
  [T.kilometro + 0.2, 420, 1000, 1.05],
  [T.tanque - 0.1, 420, 1000, 1.08],
  [T.tanque + 0.2, 550, 1290, 1.4],
  [T.ultrapura - 0.1, 550, 1290, 1.43],
  [T.ultrapura + 0.2, 550, 1290, 1.7],
  [T.sensores - 0.1, 550, 1290, 1.73],
  [T.sensores + 0.2, 1850, 1030, 1.0],
  [T.neutrinos - 0.1, 1850, 1030, 1.03],
  [T.neutrinos + 0.2, 3100, 1030, 1.0],
  [T.atraviesan - 0.1, 3100, 1030, 1.03],
  [T.atraviesan + 0.2, 3300, 1030, 1.35],
  [T.roca - 0.1, 3300, 1030, 1.38],
  [T.roca + 0.2, 550, 760, 1.2],
  [T.molestarian - 0.1, 550, 760, 1.23],
  [T.molestarian + 0.2, 550, 1000, 0.95],
  [T.choca - 0.1, 550, 1000, 0.98],
  [T.choca + 0.2, 1850, 1030, 1.0],
  [T.lanza - 0.1, 1850, 1030, 1.03],
  [T.lanza + 0.2, 1780, 1100, 1.5],
  [T.destello - 0.1, 1780, 1100, 1.53],
  [T.destello + 0.2, 1850, 1030, 1.15],
  [T.captan - 0.1, 1850, 1030, 1.18],
  [T.captan + 0.2, 1850, 1030, 1.0],
  [T.descubrieron - 0.1, 1850, 1030, 1.03],
  [T.descubrieron + 0.2, 3100, 1030, 1.0],
  [T.masa - 0.1, 3100, 1030, 1.03],
  [T.masa + 0.2, 3100, 1050, 1.25],
  [T.nobel - 0.1, 3100, 1050, 1.28],
  [T.nobel + 0.2, 3100, 1230, 1.6],
  [T.poreso - 0.1, 3100, 1230, 1.63],
  [T.poreso + 0.25, 550, 1280, 1.5],
  [T.fin + 0.3, 550, 1280, 1.55],
];

export const KamiokaMundo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const { cx, cy, zoom } = camaraEn(camaraKeys(), t);
  const sx = (x: number) => 540 + (x - cx) * zoom;
  const sy = (y: number) => 960 + (y - cy) * zoom;
  const ventana = (a: number, b: number, entra = 0.3, sale = 0.3) => ventanaEn(t, a, b, entra, sale);
  const destello = (a: number) => interpolate(t, [a, a + 0.06, a + 0.4], [0, 1, 0], clamp);

  // Tanque: destellos en el gancho y el final
  const gancho = t < T.final || t > T.poreso;
  const flash = gancho ? Math.max(0, Math.sin(t * 5)) ** 4 : 0;
  const rayos = ventana(T.roca, T.choca);

  // Pared de sensores
  const verPared = Math.max(ventana(T.sensores - 0.1, T.neutrinos + 0.2), ventana(T.choca - 0.1, T.descubrieron + 0.2));
  const llega = interpolate(t, [T.choca, T.choca + 1.4], [0, 1], clamp);
  const sale = interpolate(t, [T.lanza, T.lanza + 1.2], [0, 1], clamp);
  const cono = ventana(T.destello - 0.3, T.descubrieron + 0.2);
  const anillo = Math.max(ventana(T.captan, T.descubrieron + 0.2), ventana(T.sensores + 0.8, T.neutrinos, 0.2, 0.2));

  // Sol, Tierra y tipos
  const verSol = Math.max(ventana(T.neutrinos - 0.1, T.roca + 0.2), ventana(T.descubrieron - 0.1, T.poreso + 0.2));
  const cambia = t > T.descubrieron;
  const tipo = Math.floor(((t - T.descubrieron) * 1.2) % 3);
  const viajero = ((t * 0.35) % 1) * 880 + 2660;
  const medalla = interpolate(t, [T.nobel, T.nobel + 0.5], [0, 1], clamp);

  const camaraT = `translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`;

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <g transform={camaraT}>
        <rect x={-300} y={-400} width={4200} height={2400} fill="#10141E" />

        {/* Montaña y tanque */}
        <path d="M -200 900 L 250 480 L 450 620 L 650 420 L 1200 900 Z" fill="#3A5A3A" />
        <rect x={-200} y={900} width={1400} height={800} fill={ROCA} />
        <path d="M -200 900 L 250 480 L 450 620 L 650 420 L 1200 900" fill="none" stroke="#5A7A5A" strokeWidth={8} />
        {/* Cota de 1 km */}
        <g opacity={ventana(T.kilometro - 0.2, T.tanque + 0.2)}>
          <line x1={130} y1={560} x2={130} y2={1140} stroke={C.yellow} strokeWidth={8} />
          <line x1={100} y1={560} x2={160} y2={560} stroke={C.yellow} strokeWidth={8} />
          <line x1={100} y1={1140} x2={160} y2={1140} stroke={C.yellow} strokeWidth={8} />
        </g>
        <Pildora x={130} y={850} texto="1 km" color={C.yellow} o={ventana(T.kilometro - 0.2, T.tanque + 0.2)} tam={50} />
        {/* Tanque cilíndrico */}
        <rect x={330} y={1120} width={440} height={340} rx={20} fill={AGUA} />
        <ellipse cx={550} cy={1120} rx={220} ry={40} fill="#2A7AC8" />
        {new Array(7).fill(0).map((_, k) =>
          [0, 1, 2, 3].map((j) => <circle key={`${k}-${j}`} cx={360 + k * 64} cy={1180 + j * 80} r={14} fill={flash > 0.4 && (k + j) % 2 ? "#FFFFFF" : ORO} opacity={0.85} />),
        )}
        {flash > 0 ? <ellipse cx={550} cy={1300} rx={160} ry={60} fill="none" stroke={AZUL} strokeWidth={10} opacity={flash} /> : null}
        {/* Rayos cósmicos frenados y neutrinos que pasan */}
        {rayos > 0
          ? [0, 1, 2, 3].map((k) => {
              const q = (t * 0.9 + k / 4) % 1;
              const x = 200 + k * 230;
              return (
                <g key={k} opacity={rayos}>
                  <line x1={x - 100} y1={300} x2={x - 100 + 100 * q} y2={300 + 650 * q} stroke={C.red} strokeWidth={8} />
                  {q > 0.95 ? <circle cx={x} cy={950} r={20} fill={C.red} opacity={0.6} /> : null}
                </g>
              );
            })
          : null}
        {rayos > 0
          ? [0, 1].map((k) => (
              <line key={k} x1={350 + k * 300} y1={300} x2={450 + k * 300} y2={1650} stroke={NEU} strokeWidth={5} strokeDasharray="18 14" strokeDashoffset={-t * 200} opacity={rayos} />
            ))
          : null}
        <Pildora x={550} y={1560} texto="¿qué premio?" color={C.white} o={ventana(T.final + 0.2, T.japon)} tam={46} />
        <Pildora x={550} y={1560} texto="50 000 t de agua" color={C.cyan} o={ventana(T.toneladas, T.sensores)} tam={44} />

        {/* Pared de sensores */}
        <g opacity={verPared}>
          <Panel x0={1340} y0={600} x1={2360} y1={1460} fill="#081A30" />
          {new Array(8).fill(0).map((_, j) =>
            new Array(9).fill(0).map((__, k) => {
              const x = 1430 + k * 105;
              const y = 680 + j * 100;
              const d = Math.hypot(x - 1900, y - 1000);
              const enciende = Math.abs(d - 250) < 55 ? anillo : 0;
              return <circle key={`${j}-${k}`} cx={x} cy={y} r={34} fill={enciende > 0.3 ? AZUL : ORO} opacity={0.6 + 0.4 * enciende} />;
            }),
          )}
          {llega > 0 && llega < 1 ? <circle cx={1380 + (1700 - 1380) * llega} cy={1350 - 200 * llega} r={14} fill={NEU} /> : null}
          {llega >= 1 ? <circle cx={1700} cy={1150} r={30 * destello(T.choca + 1.4) + 6} fill="#FFFFFF" /> : null}
          {sale > 0 ? <line x1={1700} y1={1150} x2={1700 + 220 * sale} y2={1150 - 160 * sale} stroke="#FFFFFF" strokeWidth={8} strokeLinecap="round" /> : null}
          {cono > 0 ? <path d={`M 1700 1150 L 2200 780 L 2050 1260 Z`} fill={AZUL} opacity={0.3 * cono} /> : null}
        </g>
        <Pildora x={1850} y={1390} texto="11 000 sensores" color={ORO} o={ventana(T.sensores + 0.3, T.neutrinos)} tam={44} />
        <Pildora x={1850} y={1390} texto="destello azul" color={AZUL} o={ventana(T.destello, T.captan)} tam={46} />

        {/* Sol, Tierra y neutrinos */}
        <g opacity={verSol}>
          <Panel x0={2600} y0={600} x1={3600} y1={1460} />
          <circle cx={2720} cy={1030} r={90} fill={C.yellow} />
          <circle cx={3300} cy={1030} r={180} fill="#2A6AC8" />
          <path d="M 3200 960 q 60 -60 120 -20 q 40 40 -20 80 q -60 30 -100 -60 Z" fill="#3A8A4A" />
          {!cambia
            ? [-60, 0, 60].map((dy) => (
                <line key={dy} x1={2810} y1={1030 + dy * 0.3} x2={3580} y2={1030 + dy} stroke={NEU} strokeWidth={5} strokeDasharray="18 14" strokeDashoffset={-t * 220} />
              ))
            : null}
          {cambia ? (
            <g>
              <line x1={2660} y1={900} x2={3540} y2={900} stroke="#5A5F7C" strokeWidth={4} strokeDasharray="12 10" />
              <circle cx={viajero} cy={900} r={20} fill={TIPOS[tipo][1]} />
              <text x={viajero} y={860} textAnchor="middle" fill={TIPOS[tipo][1]} fontFamily={mono} fontSize={34} fontWeight={700}>
                {TIPOS[tipo][0]}
              </text>
            </g>
          ) : null}
          {medalla > 0 ? (
            <g opacity={medalla} transform={`translate(3100 1250) scale(${0.8 + 0.2 * medalla})`}>
              <circle r={110} fill="#E8B830" stroke="#F8D870" strokeWidth={10} />
              <text y={-6} textAnchor="middle" fill="#5A3A10" fontFamily={mono} fontSize={40} fontWeight={700}>
                Nobel
              </text>
              <text y={44} textAnchor="middle" fill="#5A3A10" fontFamily={mono} fontSize={40} fontWeight={700}>
                2015
              </text>
            </g>
          ) : null}
        </g>
        <Pildora x={3300} y={1400} texto="atraviesan la Tierra" color={NEU} o={ventana(T.atraviesan, T.roca)} tam={42} />
        <Pildora x={3100} y={720} texto="¡tienen masa!" color={C.orange} o={ventana(T.masa, T.nobel + 0.1)} tam={46} />
      </g>

      {[T.sensores, T.choca + 1.4, T.destello, T.nobel].map((q) => (
        <rect key={q} x={0} y={0} width={1080} height={1920} fill="#FFFFFF" opacity={0.2 * destello(q)} />
      ))}
      <Tag x={sx(1700)} y={sy(1150)} dx={-120} dy={180} texto="neutrino" color={NEU} o={ventana(T.choca + 0.3, T.lanza)} />
      <Tag x={sx(550)} y={sy(900)} dx={170} dy={-170} texto="roca = escudo" color={C.red} o={ventana(T.roca + 0.3, T.molestarian + 0.4)} />
    </svg>
  );
};

import { interpolate, random } from "remotion";
import { camaraEn, ClaveCamara, Panel, Pildora, Tag, ventanaEn } from "../components/Mundo";
import { C, clamp, mono, useT } from "../theme";
import { T } from "./tiempos";

// Mundo: a la izquierda, el océano con el cable en el fondo y los pulsos de luz (y sus repetidores); en el centro,
// el cable en corte; a la derecha, la fibra por dentro: núcleo, revestimiento y la luz que rebota en zigzag.
type P2 = [number, number];
const LUZ = "#F8F0A0";
const CABLE: P2[] = [
  [-200, 560],
  [40, 600],
  [200, 1000],
  [360, 1420],
  [700, 1440],
  [1300, 1430],
];
const REPETIDORES = [560, 1000];
const F = { x0: 2620, x1: 3580, y: 1030, nucleo: 50, revest: 150 };

const enLinea = (r: P2[], p: number): P2 => {
  const largos = r.slice(1).map((q, i) => Math.hypot(q[0] - r[i][0], q[1] - r[i][1]));
  let d = largos.reduce((a, b) => a + b, 0) * Math.max(0, Math.min(1, p));
  for (let i = 0; i < largos.length; i++) {
    if (d <= largos[i]) {
      const u = d / largos[i];
      return [r[i][0] + (r[i + 1][0] - r[i][0]) * u, r[i][1] + (r[i + 1][1] - r[i][1]) * u];
    }
    d -= largos[i];
  }
  return r[r.length - 1];
};

const PECES = new Array(6).fill(0).map((_, i) => ({ y: 700 + random(`py${i}`) * 500, f: random(`pf${i}`), v: 0.04 + random(`pv${i}`) * 0.05 }));

const camaraKeys = (): ClaveCamara[] => [
  [0, 560, 1000, 1.15],
  [T.manguera - 0.3, 560, 1000, 1.18],
  [T.manguera + 0.5, 1850, 1030, 1.0],
  [T.curvas - 0.3, 1850, 1030, 1.02],
  [T.curvas + 0.5, 3100, 1030, 1.0],
  [T.repetidores - 0.3, 3100, 1030, 1.02],
  [T.repetidores + 0.5, 560, 1100, 1.15],
  [T.fin + 2, 560, 1100, 1.2],
];

// Icono de foto
const Foto: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly o: number }> = ({ x, y, s, o }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <rect x={-40} y={-30} width={80} height={60} rx={8} fill="#E8E6F0" />
    <path d="M -32 22 L -8 -4 L 8 12 L 18 2 L 32 22 Z" fill="#48A878" />
    <circle cx={18} cy={-14} r={7} fill={C.yellow} />
  </g>
);

export const InternetMundo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const { cx, cy, zoom } = camaraEn(camaraKeys(), t);
  const sx = (x: number) => 540 + (x - cx) * zoom;
  const sy = (y: number) => 960 + (y - cy) * zoom;
  const ventana = (a: number, b: number, entra = 0.4, sale = 0.4) => ventanaEn(t, a, b, entra, sale);

  // Pulsos de luz por el cable
  const rapidez = t < T.datos ? 0.7 : 0.35;
  const repetidores = interpolate(t, [T.repetidores, T.repetidores + 0.6], [0, 1], clamp);
  const fotoSale = interpolate(t, [T.fotos, T.fotos + 0.6], [0, 1], clamp);

  // Corte del cable
  const corte = ventana(T.manguera - 0.3, T.curvas + 0.3, 0.6, 0.6);
  const fibrasBrillan = interpolate(t, [T.mensajes, T.mensajes + 0.4], [0, 1], clamp);
  const comparaPelo = ventana(T.pelo, T.curvas + 0.3);

  // Fibra por dentro
  const fibra = ventana(T.curvas - 0.3, T.repetidores + 0.3, 0.6, 0.6);
  const capas = interpolate(t, [T.capas, T.capas + 0.5], [0, 1], clamp);
  const demo = ventana(T.borde, T.zigzag + 0.2);
  const rebota = interpolate(t, [T.rebota - 0.2, T.rebota + 0.3], [0, 1], clamp);
  const zig = interpolate(t, [T.zigzag - 0.2, T.zigzag + 0.4], [0, 1], clamp);
  const curva = interpolate(t, [T.curva - 0.3, T.curva + 1.0], [0, 1], clamp);
  const off = (x: number) => -curva * 120 * (1 - ((x - 3100) / 480) ** 2);
  const banda = (h: number) => {
    const xs = new Array(25).fill(0).map((_, i) => F.x0 + ((F.x1 - F.x0) * i) / 24);
    return `M ${xs.map((x) => `${x} ${F.y - h + off(x)}`).join(" L ")} L ${xs
      .slice()
      .reverse()
      .map((x) => `${x} ${F.y + h + off(x)}`)
      .join(" L ")} Z`;
  };
  // Rayo en zigzag dentro del núcleo
  const paso = 110;
  const rayo: P2[] = new Array(Math.floor((F.x1 - F.x0) / paso) + 1).fill(0).map((_, i) => {
    const x = F.x0 + i * paso;
    return [x, F.y + (i % 2 === 0 ? -1 : 1) * (F.nucleo - 4) + off(x)];
  });
  const pulso = enLinea(rayo, (t * 0.35) % 1);

  const camaraT = `translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`;

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <g transform={camaraT}>
        {/* Cielo, mar y fondo */}
        <rect x={-400} y={-400} width={1800} height={920} fill="#101830" />
        <rect x={-400} y={520} width={1800} height={940} fill="#0A3A5A" />
        <rect x={-400} y={520} width={1800} height={300} fill="#1A5A7A" opacity={0.5} />
        <path d={`M -400 520 ${new Array(19).fill(0).map((_, i) => `Q ${-350 + i * 100} ${510 + Math.sin(t * 2 + i) * 8} ${-300 + i * 100} 520`).join(" ")}`} fill="none" stroke="#8AD8F8" strokeWidth={4} opacity={0.6} />
        <path d="M -400 1450 Q 300 1420 1400 1460 L 1400 2000 L -400 2000 Z" fill="#3A3424" />
        <path d="M -400 480 L 0 480 L 120 560 L 280 1100 L 300 1460 L -400 1460 Z" fill="#4A6A3A" />
        {/* Barco */}
        <g transform={`translate(${780 + Math.sin(t * 0.8) * 10} 520)`}>
          <path d="M -120 -10 L 120 -10 L 90 30 L -100 30 Z" fill="#C83A3A" />
          <rect x={-60} y={-60} width={80} height={50} fill="#E8E6F0" />
          <line x1={60} y1={-10} x2={60} y2={-90} stroke="#E8E6F0" strokeWidth={6} />
        </g>
        {PECES.map((p, i) => {
          const x = -200 + (((t * p.v + p.f) % 1) * 1600);
          return <path key={i} d={`M ${x} ${p.y} l -30 -12 l 0 24 z M ${x} ${p.y} q 20 -14 40 0 q -20 14 -40 0`} fill="#4A8AA8" opacity={0.6} />;
        })}
        {/* Cable */}
        <path d={`M ${CABLE.map(([x, y]) => `${x} ${y}`).join(" L ")}`} fill="none" stroke="#1A1A20" strokeWidth={22} strokeLinejoin="round" />
        <path d={`M ${CABLE.map(([x, y]) => `${x} ${y}`).join(" L ")}`} fill="none" stroke="#3A3A44" strokeWidth={8} strokeLinejoin="round" />
        {/* Pulsos de luz (se apagan con la distancia y los repetidores los reaniman) */}
        {new Array(8).fill(0).map((_, k) => {
          const p = (t * rapidez + k / 8) % 1;
          const [x, y] = enLinea(CABLE, p);
          const ultimo = repetidores > 0 ? Math.max(0, ...REPETIDORES.filter((r) => r <= x)) : 0;
          const brillo = repetidores > 0 ? Math.max(0.25, 1 - (x - ultimo) / 700) : 1;
          return <circle key={k} cx={x} cy={y} r={12 + 6 * brillo} fill={LUZ} opacity={brillo} />;
        })}
        {REPETIDORES.map((x) => (
          <g key={x} opacity={repetidores}>
            <rect x={x - 46} y={1416} width={92} height={46} rx={20} fill="#8A8A9A" />
            <circle cx={x} cy={1439} r={30 + 10 * Math.sin(t * 6)} fill={LUZ} opacity={0.25} />
          </g>
        ))}
        {/* Datos que entran y salen */}
        <Foto x={150 + Math.sin(t * 3) * 8} y={420} s={1.2} o={ventana(-1, T.manguera)} />
        <g opacity={ventana(-1, T.manguera)}>
          <rect x={240} y={360} width={110} height={70} rx={20} fill={C.cyan} />
          <path d="M 260 430 l -10 26 l 34 -26 z" fill={C.cyan} />
        </g>
        <Foto x={800} y={1300 - 300 * fotoSale} s={1.4} o={fotoSale} />
        <Pildora x={720} y={1320} texto="≈ 2 cm" color={C.white} o={ventana(T.cables + 0.4, T.manguera + 0.4)} tam={44} />

        {/* Cable en corte */}
        <g opacity={corte}>
          <Panel x0={1340} y0={600} x1={2360} y1={1460} />
          <circle cx={1850} cy={980} r={280} fill="#1A1A20" stroke="#3A3A44" strokeWidth={6} />
          {new Array(26).fill(0).map((_, k) => {
            const a = (k / 26) * Math.PI * 2;
            return <circle key={k} cx={1850 + Math.cos(a) * 236} cy={980 + Math.sin(a) * 236} r={22} fill="#8A8A9A" />;
          })}
          <circle cx={1850} cy={980} r={200} fill="#C87A3A" />
          <circle cx={1850} cy={980} r={170} fill="#C8C8D0" />
          <circle cx={1850} cy={980} r={150} fill="#E8E0A0" />
          {new Array(8).fill(0).map((_, k) => {
            const a = (k / 8) * Math.PI * 2;
            const colores = [C.red, C.cyan, C.yellow, "#48C878", "#A87AE8", "#F8883A", "#E8E6F0", "#5AB8F8"];
            return (
              <g key={k}>
                <circle cx={1850 + Math.cos(a) * 60} cy={980 + Math.sin(a) * 60} r={20} fill={colores[k]} />
                <circle cx={1850 + Math.cos(a) * 60} cy={980 + Math.sin(a) * 60} r={30} fill={LUZ} opacity={fibrasBrillan * 0.6 * (0.5 + 0.5 * Math.sin(t * 9 + k * 2))} />
              </g>
            );
          })}
          {/* Núcleo contra pelo */}
          <g opacity={comparaPelo} transform="translate(1850 1370)">
            <circle cx={-160} cy={0} r={4} fill={LUZ} />
            <text x={-160} y={60} textAnchor="middle" fill={LUZ} fontFamily={mono} fontSize={30} fontWeight={700}>
              núcleo 9 µm
            </text>
            <circle cx={160} cy={0} r={32} fill="#7A5030" />
            <text x={160} y={60} textAnchor="middle" fill="#C89870" fontFamily={mono} fontSize={30} fontWeight={700}>
              pelo ≈ 70 µm
            </text>
          </g>
        </g>

        {/* Fibra por dentro */}
        <g opacity={fibra}>
          <Panel x0={2600} y0={600} x1={3600} y1={1460} />
          <path d={banda(F.revest)} fill="#2A4A6A" opacity={0.85} />
          <path d={banda(F.nucleo)} fill="#5AA8D8" opacity={0.5 + 0.3 * capas} />
          {/* Demostración: de frente escapa, inclinada rebota */}
          <g opacity={demo * (1 - zig)}>
            <path d={`M 2760 ${F.y + 40} L 2830 ${F.y - F.nucleo} L 2900 ${F.y - F.revest - 60}`} fill="none" stroke={C.red} strokeWidth={6} strokeDasharray="14 8" />
            <text x={2920} y={F.y - F.revest - 70} fill={C.red} fontFamily={mono} fontSize={30} fontWeight={700}>
              de frente: escapa
            </text>
            <path d={`M 3060 ${F.y + 30} L 3260 ${F.y - F.nucleo + 2} L 3460 ${F.y + 30}`} fill="none" stroke={LUZ} strokeWidth={7 + 4 * rebota} />
            <circle cx={3260} cy={F.y - F.nucleo + 2} r={20 * rebota} fill={LUZ} opacity={0.5 * rebota} />
            <text x={3260} y={F.y + F.revest + 70} textAnchor="middle" fill={LUZ} fontFamily={mono} fontSize={30} fontWeight={700}>
              inclinada: rebota
            </text>
          </g>
          {/* Zigzag y pulso */}
          <g opacity={zig}>
            <path d={`M ${rayo.map(([x, y]) => `${x} ${y}`).join(" L ")}`} fill="none" stroke={LUZ} strokeWidth={5} opacity={0.6} />
            <circle cx={pulso[0]} cy={pulso[1]} r={16} fill={LUZ} />
            <circle cx={pulso[0]} cy={pulso[1]} r={34} fill={LUZ} opacity={0.3} />
          </g>
        </g>
      </g>

      <Tag x={sx(360)} y={sy(1420)} dx={60} dy={-300} texto="cable submarino" color={C.white} o={ventana(T.cables, T.manguera)} />
      <Tag x={sx(1850)} y={sy(980)} dx={-120} dy={-330} texto="fibras de vidrio" color={LUZ} o={ventana(T.hilos, T.curvas)} />
      <Tag x={sx(2100)} y={sy(1180)} dx={80} dy={170} texto="acero" color="#C8C8D0" o={ventana(T.manguera + 0.4, T.hilos)} />
      <Tag x={sx(2700)} y={sy(F.y)} dx={60} dy={-260} texto="núcleo" color="#8AD8F8" o={ventana(T.nucleo, T.borde)} />
      <Tag x={sx(3500)} y={sy(F.y + F.revest - 30)} dx={-80} dy={210} texto="revestimiento" color="#8AA8C8" o={ventana(T.revestimiento, T.borde)} />
      <Tag x={sx(REPETIDORES[0])} y={sy(1416)} dx={40} dy={-260} texto="repetidor" color={LUZ} o={ventana(T.repetidores + 0.3, T.fotos)} />
    </svg>
  );
};

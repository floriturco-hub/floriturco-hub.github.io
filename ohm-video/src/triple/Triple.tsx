import { interpolate, random } from "remotion";
import { camaraEn, ClaveCamara, Panel, Pildora, Tag, ventanaEn } from "../components/Mundo";
import { C, clamp, mono, useT } from "../theme";
import { T } from "./tiempos";

// Mundo: a la izquierda, una campana de vacío con un vaso de agua (bomba, manómetro, burbujas y hielo a la vez); en el
// centro, el diagrama de fases (hielo, agua y vapor) con el punto que baja hasta el punto triple; a la derecha, las
// moléculas que escapan al hervir y enfrían el agua.
// Retención (estilo §10): el gancho plantea la pregunta y el final vuelve a ella para el bucle.
const AGUA = "#3A8AD8";
const HIELO = "#E8F4FF";
const TP: [number, number] = [1563, 1180];
const MOL = new Array(22).fill(0).map((_, i) => ({ x: 2700 + random(`mx${i}`) * 800, y: 1180 + random(`my${i}`) * 220, f: random(`mf${i}`) }));
const BURB = new Array(10).fill(0).map((_, i) => ({ x: 450 + random(`bx${i}`) * 200, f: random(`bf${i}`) }));

// Curva líquido-vapor: del punto triple a 100 °C con 1 atm (y = 860) y más allá
const curvaLV = (u: number): [number, number] => [TP[0] + (2290 - TP[0]) * u, TP[1] - (TP[1] - 760) * (u * u * 0.55 + u * 0.45)];
const xEnCurva = (y: number) => {
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 20; i++) {
    const m = (lo + hi) / 2;
    if (curvaLV(m)[1] > y) {
      lo = m;
    } else {
      hi = m;
    }
  }
  return curvaLV((lo + hi) / 2)[0];
};

const camaraKeys = (): ClaveCamara[] => [
  [0, 550, 1180, 1.3],
  [T.final - 0.1, 550, 1180, 1.35],
  [T.final + 0.2, 580, 1000, 0.95],
  [T.depende - 0.1, 580, 1000, 0.98],
  [T.depende + 0.2, 1850, 1030, 1.0],
  [T.aire - 0.1, 1850, 1030, 1.03],
  [T.aire + 0.2, 2050, 900, 1.4],
  [T.sacas - 0.1, 2050, 900, 1.43],
  [T.sacas + 0.2, 600, 1000, 0.95],
  [T.bomba - 0.1, 600, 1000, 0.98],
  [T.bomba + 0.2, 900, 1000, 1.6],
  [T.hierve - 0.1, 900, 1000, 1.63],
  [T.hierve + 0.2, 1850, 1030, 1.0],
  [T.hervir - 0.1, 1850, 1030, 1.03],
  [T.hervir + 0.2, 3100, 1030, 1.0],
  [T.pierde - 0.1, 3100, 1030, 1.03],
  [T.pierde + 0.2, 3100, 1100, 1.4],
  [T.enfria - 0.1, 3100, 1100, 1.43],
  [T.enfria + 0.2, 3100, 1030, 1.1],
  [T.sigues - 0.1, 3100, 1030, 1.13],
  [T.sigues + 0.2, 1850, 1030, 1.0],
  [T.momento - 0.1, 1850, 1030, 1.03],
  [T.momento + 0.2, 1620, 1130, 1.6],
  [T.congela - 0.1, 1620, 1130, 1.63],
  [T.congela + 0.2, 550, 1200, 1.6],
  [T.vapor - 0.1, 550, 1200, 1.63],
  [T.vapor + 0.2, 560, 1050, 1.1],
  [T.punto - 0.1, 560, 1050, 1.13],
  [T.punto + 0.2, 1620, 1150, 1.45],
  [T.presion - 0.1, 1620, 1150, 1.48],
  [T.presion + 0.2, 1850, 1030, 1.0],
  [T.ahi - 0.1, 1850, 1030, 1.03],
  [T.ahi + 0.25, 550, 1180, 1.3],
  [T.fin + 0.3, 550, 1180, 1.35],
];

export const TripleMundo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const { cx, cy, zoom } = camaraEn(camaraKeys(), t);
  const sx = (x: number) => 540 + (x - cx) * zoom;
  const sy = (y: number) => 960 + (y - cy) * zoom;
  const ventana = (a: number, b: number, entra = 0.3, sale = 0.3) => ventanaEn(t, a, b, entra, sale);
  const destello = (a: number) => interpolate(t, [a, a + 0.06, a + 0.4], [0, 1, 0], clamp);

  // Campana: presión (1 = aire normal, 0 = punto triple), burbujas y hielo
  const gancho = t < T.final || t > T.ahi;
  const presion = gancho ? 0 : t < T.bomba ? 1 : t < T.sigues ? interpolate(t, [T.bomba, T.bomba + 1.2], [1, 0.45], clamp) : interpolate(t, [T.sigues, T.congela], [0.45, 0], clamp);
  const hierve = gancho || (t > T.bomba + 0.6 && t < T.punto + 2) ? 1 : 0;
  const hielo = gancho ? interpolate(t > T.ahi ? t - T.ahi : t, [0, 1.5], [0.3, 1], clamp) : interpolate(t, [T.congela, T.hielo + 0.6], [0, 1], clamp);

  // Diagrama de fases
  const verDiag = Math.max(ventana(T.depende - 0.1, T.sacas + 0.2), ventana(T.hierve - 0.1, T.hervir + 0.2), ventana(T.sigues - 0.1, T.congela + 0.2), ventana(T.punto - 0.1, T.ahi + 0.2));
  const yAtm = 860 + (1180 - 860) * (1 - presion);
  const xHierve = xEnCurva(yAtm);
  const punto: [number, number] = t < T.sigues ? [1700, yAtm] : [1700 + (TP[0] - 1700) * (1 - presion / 0.45), yAtm];
  const estrella = Math.max(ventana(T.congela, T.hielo + 0.3), ventana(T.punto, T.ahi + 0.2));

  // Moléculas
  const verMol = ventana(T.hervir - 0.1, T.sigues + 0.2);
  const frio = interpolate(t, [T.enfria, T.enfria + 1.2], [20, 2], clamp);

  const camaraT = `translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`;
  const lv = new Array(41).fill(0).map((_, i) => curvaLV(i / 40));

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <g transform={camaraT}>
        <rect x={-300} y={-400} width={4200} height={2400} fill="#141824" />

        {/* Campana de vacío */}
        <rect x={180} y={1400} width={740} height={50} rx={10} fill="#5A5F6C" />
        <path d="M 920 1430 C 1000 1430, 1020 1500, 1100 1500" fill="none" stroke="#3A3F4C" strokeWidth={22} />
        <path d="M 240 1400 L 240 900 C 240 700, 860 700, 860 900 L 860 1400" fill="#9AC8E8" fillOpacity={0.08} stroke="#C8E0F8" strokeWidth={8} strokeOpacity={0.7} />
        <rect x={420} y={1080} width={260} height={320} rx={14} fill="#2A3040" stroke="#C8E0F8" strokeWidth={6} />
        <rect x={426} y={1150} width={248} height={244} rx={10} fill={AGUA} opacity={0.8} />
        {hierve
          ? BURB.map((b, i) => {
              const q = (t * 1.3 + b.f) % 1;
              return <circle key={i} cx={b.x + Math.sin(t * 5 + i) * 6} cy={1380 - q * 220} r={8 + q * 10} fill="none" stroke="#FFFFFF" strokeWidth={4} opacity={1 - q * 0.6} />;
            })
          : null}
        {hielo > 0 ? (
          <g opacity={Math.min(1, hielo * 1.5)}>
            <rect x={426} y={1146} width={248} height={14 + 40 * hielo} fill={HIELO} opacity={0.9} />
            {new Array(8).fill(0).map((_, k) => (
              <path key={k} d={`M ${440 + k * 30} ${1160 + 40 * hielo} l 8 ${20 * hielo} l 8 ${-20 * hielo}`} fill={HIELO} />
            ))}
            {[0, 1, 2].map((k) => (
              <g key={k} transform={`translate(${470 + k * 80} 1160)`} stroke="#A8C8E8" strokeWidth={4} opacity={hielo}>
                <line x1={-16} y1={0} x2={16} y2={0} />
                <line x1={-8} y1={-14} x2={8} y2={14} />
                <line x1={8} y1={-14} x2={-8} y2={14} />
              </g>
            ))}
          </g>
        ) : null}
        {hierve ? (
          [0, 1].map((k) => {
            const q = (t * 0.8 + k / 2) % 1;
            return <path key={k} d={`M ${500 + k * 100} ${1120 - q * 160} q 16 -24 0 -48 q -16 -24 0 -48`} fill="none" stroke="#C8D8E8" strokeWidth={6} strokeLinecap="round" opacity={0.6 * (1 - q)} />;
          })
        ) : null}
        {/* Manómetro */}
        <g transform="translate(1000 960) scale(0.8)">
          <circle r={110} fill="#E8E6F0" stroke="#8A90A0" strokeWidth={10} />
          <path d="M -80 30 A 85 85 0 1 1 80 30" fill="none" stroke="#C8CED8" strokeWidth={8} />
          <line x1={0} y1={0} x2={90 * Math.cos(((-200 + 220 * presion) * Math.PI) / 180)} y2={90 * Math.sin(((-200 + 220 * presion) * Math.PI) / 180)} stroke={C.red} strokeWidth={8} strokeLinecap="round" />
          <circle r={12} fill="#2A2A30" />
          <text y={70} textAnchor="middle" fill="#3A3F4C" fontFamily={mono} fontSize={26} fontWeight={700}>
            presión
          </text>
        </g>
        <line x1={1000} y1={1050} x2={1000} y2={1420} stroke="#8A90A0" strokeWidth={12} />
        <Pildora x={580} y={1540} texto="¿a qué presión?" color={C.white} o={ventana(T.final + 0.2, T.depende)} tam={44} />
        <Pildora x={560} y={1540} texto="hielo + agua + vapor" color={C.yellow} o={ventana(T.hielo, T.punto)} tam={42} />

        {/* Diagrama de fases */}
        <g opacity={verDiag}>
          <Panel x0={1340} y0={600} x1={2360} y1={1460} />
          <path d={`M 1440 700 L 1550 700 L ${TP[0]} ${TP[1]} L 1440 1350 Z`} fill="#C8E0F8" opacity={0.2} />
          <path d={`M 1550 700 L 2300 700 L 2300 ${lv[40][1]} ${[...lv].reverse().map((q) => `L ${q[0]} ${q[1]}`).join(" ")} Z`} fill={AGUA} opacity={0.25} />
          <path d={`M 1440 1350 L ${TP[0]} ${TP[1]} ${lv.map((q) => `L ${q[0]} ${q[1]}`).join(" ")} L 2300 1380 L 1440 1380 Z`} fill="#8A90A0" opacity={0.18} />
          <path d={`M 1440 1350 L ${TP[0]} ${TP[1]} L 1550 700`} fill="none" stroke={C.white} strokeWidth={6} />
          <path d={`M ${lv.map((q) => `${q[0]} ${q[1]}`).join(" L ")}`} fill="none" stroke={C.white} strokeWidth={6} />
          <line x1={1430} y1={1380} x2={2310} y2={1380} stroke={C.grey} strokeWidth={4} />
          <line x1={1430} y1={1380} x2={1430} y2={680} stroke={C.grey} strokeWidth={4} />
          <text x={1480} y={900} fill={HIELO} fontFamily={mono} fontSize={40} fontWeight={700}>
            hielo
          </text>
          <text x={1800} y={800} fill="#8AC8F8" fontFamily={mono} fontSize={40} fontWeight={700}>
            agua
          </text>
          <text x={2010} y={1280} fill="#C8CED8" fontFamily={mono} fontSize={40} fontWeight={700}>
            vapor
          </text>
          <text x={2300} y={1430} textAnchor="end" fill={C.grey} fontFamily={mono} fontSize={28}>
            temperatura →
          </text>
          <text x={1450} y={668} fill={C.grey} fontFamily={mono} fontSize={28}>
            presión ↑
          </text>
          {/* Línea de presión y punto de ebullición */}
          <line x1={1430} y1={yAtm} x2={2310} y2={yAtm} stroke={C.yellow} strokeWidth={4} strokeDasharray="16 12" />
          <circle cx={xHierve} cy={yAtm} r={16} fill={C.orange} opacity={t < T.sigues ? 1 : 0} />
          <circle cx={punto[0]} cy={punto[1]} r={20} fill={C.yellow} stroke="#1A1A1A" strokeWidth={4} opacity={t < T.punto ? 1 : 0} />
          {estrella > 0 ? (
            <g opacity={estrella} transform={`translate(${TP[0]} ${TP[1]}) scale(${1 + 0.15 * Math.sin(t * 8)})`}>
              <path d="M 0 -34 L 10 -10 L 34 0 L 10 10 L 0 34 L -10 10 L -34 0 L -10 -10 Z" fill={C.yellow} />
            </g>
          ) : null}
        </g>
        <Pildora x={2100} y={1020} texto={t < T.bomba ? "100 °C" : "hierve antes"} color={C.orange} o={Math.max(ventana(T.aire, T.sacas + 0.2), ventana(T.hierve, T.hervir + 0.2))} tam={42} />
        <Pildora x={1700} y={1300} texto="punto triple" color={C.yellow} o={ventana(T.punto + 0.2, T.grados)} tam={46} />
        <Pildora x={1700} y={1300} texto="0,01 °C" color={C.yellow} o={ventana(T.grados, T.presion)} tam={50} />
        <Pildora x={1850} y={700} texto="÷ 160 la presión" color={C.orange} o={ventana(T.presion, T.ahi + 0.2)} tam={46} />

        {/* Moléculas que escapan */}
        <g opacity={verMol}>
          <Panel x0={2600} y0={600} x1={3600} y1={1460} />
          <rect x={2640} y={1150} width={920} height={290} fill={AGUA} opacity={0.35} />
          {MOL.map((m, i) => {
            const rapida = i % 4 === 0;
            const q = (t * 0.6 + m.f) % 1;
            const y = rapida ? 1180 - q * 520 : m.y + Math.sin(t * 3 + i) * 12;
            return <circle key={i} cx={m.x + Math.sin(t * 2 + i) * 14} cy={y} r={14} fill={rapida ? C.yellow : "#6AB8F8"} opacity={rapida ? 1 - q * 0.5 : 1} />;
          })}
          <g transform="translate(3480 700)">
            <rect x={-20} y={0} width={40} height={300} rx={20} fill="#E8E6F0" />
            <rect x={-10} y={300 - 280 * (frio / 25)} width={20} height={280 * (frio / 25)} rx={10} fill={frio > 8 ? C.red : C.cyan} />
            <circle cx={0} cy={320} r={32} fill={frio > 8 ? C.red : C.cyan} />
          </g>
        </g>
        <Pildora x={3050} y={720} texto="se lleva el calor" color={C.yellow} o={ventana(T.pierde + 0.3, T.sigues)} tam={42} />
      </g>

      {[T.bomba, T.congela, T.punto].map((q) => (
        <rect key={q} x={0} y={0} width={1080} height={1920} fill="#FFFFFF" opacity={0.2 * destello(q)} />
      ))}
      <Tag x={sx(1100)} y={sy(1500)} dx={-160} dy={-150} texto="bomba de vacío" color={C.cyan} o={ventana(T.sacas + 0.2, T.bomba + 0.3)} />
      <Tag x={sx(2177)} y={sy(860)} dx={-150} dy={-180} texto="aire normal" color={C.yellow} o={ventana(T.aire + 0.3, T.sacas)} />
    </svg>
  );
};

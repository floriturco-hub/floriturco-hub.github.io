import { interpolate } from "remotion";
import { camaraEn, ClaveCamara, Panel, Pildora, Tag, ventanaEn } from "../components/Mundo";
import { C, clamp, mono, useT } from "../theme";
import { T } from "./tiempos";

// Mundo: a la izquierda, la báscula en corte (vidrio, celdas de carga en las esquinas y los pies que suben); en el centro,
// una celda de carga como trampolín con la galga pegada; luego la galga gigante que se estira, el puente de Wheatstone y
// el chip que lo pasa a kilos. Retención (estilo §10): cambio de plano cada 2-3 s y final que empalma con el gancho.
const ALU = "#B8C0CC";
const GALGA = "#F8883A";
const LCD = "#7AF0C8";
const VIDRIO = "#9FD8E8";
const B = { x0: 1520, x1: 2240, top: 980, alto: 100 };

const camaraKeys = (): ClaveCamara[] => [
  [0, 1850, 1030, 1.0],
  [T.final - 0.1, 1850, 1030, 1.04],
  [T.final + 0.2, 2050, 1080, 1.45],
  [T.dentro - 0.1, 2050, 1080, 1.5],
  [T.dentro + 0.2, 550, 1000, 1.0],
  [T.celdas - 0.1, 550, 1000, 1.05],
  [T.celdas + 0.2, 550, 1010, 1.3],
  [T.subirte - 0.1, 550, 1010, 1.33],
  [T.subirte + 0.2, 550, 900, 0.95],
  [T.trampolin - 0.1, 550, 900, 0.98],
  [T.trampolin + 0.2, 270, 1010, 2.2],
  [T.pegado - 0.1, 270, 1010, 2.25],
  [T.pegado + 0.2, 1850, 1030, 1.0],
  [T.pegado + 1.4, 1850, 1030, 1.03],
  [T.pegado + 1.7, 1700, 1000, 1.9],
  [T.galga - 0.1, 1700, 1000, 1.95],
  [T.galga + 0.2, 3100, 1030, 1.0],
  [T.estira - 0.1, 3100, 1030, 1.03],
  [T.estira + 0.2, 3100, 1030, 1.25],
  [T.deja - 0.1, 3100, 1030, 1.28],
  [T.deja + 0.2, 3100, 1100, 1.05],
  [T.cambio - 0.1, 3100, 1100, 1.08],
  [T.cambio + 0.2, 3100, 1250, 1.6],
  [T.circuito - 0.1, 3100, 1250, 1.65],
  [T.circuito + 0.2, 4350, 1030, 1.0],
  [T.detecta - 0.1, 4350, 1030, 1.03],
  [T.detecta + 0.2, 4350, 1060, 1.35],
  [T.chip - 0.1, 4350, 1060, 1.38],
  [T.chip + 0.2, 5600, 1030, 1.0],
  [T.kilos - 0.1, 5600, 1030, 1.03],
  [T.kilos + 0.2, 5800, 1030, 1.5],
  [T.cuanto - 0.1, 5800, 1030, 1.52],
  [T.cuanto + 0.2, 1850, 1030, 1.0],
  [T.apenas - 0.1, 1850, 1030, 1.03],
  [T.apenas + 0.2, 2200, 1120, 1.7],
  [T.invisible - 0.1, 2200, 1120, 1.75],
  [T.invisible + 0.2, 1950, 1050, 1.2],
  [T.pero - 0.1, 1950, 1050, 1.23],
  [T.pero + 0.2, 1850, 1030, 1.0],
  [T.fin + 0.3, 1850, 1030, 1.04],
];

// Zigzag de la galga gigante (panel 2), estirada en s ∈ [0, 1]
const zigzag = (s: number): [number, number][] => {
  const pts: [number, number][] = [];
  const paso = 70 * (1 + 0.25 * s);
  const amp = 140 * (1 - 0.05 * s);
  for (let i = 0; i < 9; i++) {
    const x = 3100 + (i - 4) * paso;
    const [a, b] = i % 2 === 0 ? [1020 + amp, 1020 - amp] : [1020 - amp, 1020 + amp];
    pts.push([x, a], [x, b]);
  }
  return pts;
};

export const BasculaMundo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const { cx, cy, zoom } = camaraEn(camaraKeys(), t);
  const sx = (x: number) => 540 + (x - cx) * zoom;
  const sy = (y: number) => 960 + (y - cy) * zoom;
  const ventana = (a: number, b: number, entra = 0.3, sale = 0.3) => ventanaEn(t, a, b, entra, sale);
  const destello = (a: number) => interpolate(t, [a, a + 0.06, a + 0.4], [0, 1, 0], clamp);

  // Báscula en corte: rayos X sobre la caja y el peso que la dobla (con rebote de trampolín)
  const rayos = ventana(T.celdas - 0.3, T.pegado + 0.2);
  const pies = interpolate(t, [T.subirte - 0.2, T.subirte + 0.5], [0, 1], clamp) * (t < T.pegado + 0.3 ? 1 : 0);
  const tr = t - T.subirte - 0.5;
  const carga = pies * (1 + (tr > 0 ? 0.35 * Math.exp(-tr * 2.2) * Math.sin(tr * 14) : 0));
  const dl = 16 * carga;
  const yPie = 960 + dl - (1 - pies) * 520;

  // Celda de carga grande: flecha (exagerada) del extremo libre
  const D =
    t < T.dentro
      ? 110 + 14 * Math.sin(t * 7)
      : t < T.cuanto
        ? 0
        : t < T.pero
          ? interpolate(t, [T.cuanto + 0.3, T.apenas + 0.3], [110, 3], clamp)
          : interpolate(t, [T.pero, T.pero + 0.5], [3, 110], clamp) + (t > T.pero + 0.5 ? 14 * Math.sin((t - T.pero - 0.5) * 7) : 0);
  const w = (x: number) => {
    const u = Math.max(0, (x - B.x0) / (B.x1 - B.x0));
    return (D * u * u * (3 - u)) / 2;
  };
  const xs = new Array(25).fill(0).map((_, i) => B.x0 + (i * (B.x1 - B.x0)) / 24);
  const barra = `M ${xs.map((x) => `${x} ${B.top + w(x)}`).join(" L ")} L ${[...xs].reverse().map((x) => `${x} ${B.top + B.alto + w(x)}`).join(" L ")} Z`;
  const flecha = Math.max(ventana(-1, T.dentro), ventana(T.cuanto, T.apenas), ventana(T.pero, T.fin + 2));
  const regla = Math.max(ventana(T.final + 0.2, T.dentro), ventana(T.apenas - 0.2, T.pero));
  const parche = ventana(T.pegado + 0.4, T.galga + 0.2);

  // Galga gigante
  const s = interpolate(t, [T.cuando + 0.3, T.estira + 0.6], [0, 1], clamp);
  const peor = interpolate(t, [T.deja, T.deja + 0.8], [0, 1], clamp);
  const zz = zigzag(s);
  const largos = zz.slice(1).map((p, i) => Math.hypot(p[0] - zz[i][0], p[1] - zz[i][1]));
  const total = largos.reduce((a, b) => a + b, 0);
  const enZig = (p: number): [number, number] => {
    let d = p * total;
    for (let i = 0; i < largos.length; i++) {
      if (d <= largos[i]) {
        const f = d / largos[i];
        return [zz[i][0] + (zz[i + 1][0] - zz[i][0]) * f, zz[i][1] + (zz[i + 1][1] - zz[i][1]) * f];
      }
      d -= largos[i];
    }
    return zz[zz.length - 1];
  };
  const fase = 0.1 * t - 0.065 * Math.max(0, t - T.deja - 0.4);

  // Puente de Wheatstone y chip
  const aguja = interpolate(t, [T.detecta, T.detecta + 0.5], [0, 38], clamp);
  const lectura = interpolate(t, [T.chip + 0.3, T.kilos], [0, 72.4], clamp);

  // Visibilidad de cada panel (la cámara salta entre ellos)
  const verMedio = Math.max(ventana(-1, T.dentro + 0.2), ventana(T.pegado - 0.1, T.galga + 0.2), ventana(T.cuanto - 0.1, T.fin + 2));
  const ver2 = ventana(T.galga - 0.1, T.circuito + 0.2);
  const ver3 = ventana(T.circuito - 0.1, T.chip + 0.2);
  const ver4 = ventana(T.chip - 0.1, T.cuanto + 0.2);

  const camaraT = `translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`;

  const celda = (fija: number, libre: number) => {
    const m = (fija + libre) / 2;
    return (
      <g>
        <rect x={fija < libre ? fija - 40 : fija} y={1004} width={40} height={36} fill="#5A5F6C" />
        <path d={`M ${fija} 1000 Q ${m} 1000 ${libre} ${1000 + dl} L ${libre} ${1020 + dl} Q ${m} 1020 ${fija} 1020 Z`} fill={ALU} stroke={C.yellow} strokeWidth={4 * rayos} />
        <rect x={libre - 7} y={990 + dl} width={14} height={12} fill="#8A90A0" />
      </g>
    );
  };

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <defs>
        <linearGradient id="piernas" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3A5A8A" stopOpacity={0} />
          <stop offset="0.3" stopColor="#3A5A8A" />
        </linearGradient>
      </defs>
      <g transform={camaraT}>
        <rect x={-300} y={-400} width={6800} height={2400} fill="#1A1E28" />

        {/* Báscula en corte */}
        <rect x={60} y={1112} width={980} height={24} fill="#2A2E38" />
        {celda(210, 330)}
        {celda(890, 770)}
        <rect x={140} y={1040} width={820} height={72} rx={14} fill="#3A3F4C" opacity={1 - 0.8 * rayos} stroke="#6A7080" strokeWidth={3} />
        <rect x={140} y={1000} width={820} height={40} fill="#3A3F4C" opacity={0.85 * (1 - rayos)} />
        <rect x={130} y={960 + dl} width={840} height={30} rx={8} fill={VIDRIO} opacity={0.75} />
        <rect x={130} y={960 + dl} width={840} height={8} rx={4} fill="#FFFFFF" opacity={0.5} />
        {/* Pies que suben */}
        {pies > 0 ? (
          <g>
            {[360, 740].map((x) => (
              <g key={x}>
                <rect x={x - 35} y={yPie - 600} width={70} height={560} fill="url(#piernas)" />
                <path d={`M ${x - 80} ${yPie} L ${x - 80} ${yPie - 40} Q ${x - 40} ${yPie - 70} ${x + 40} ${yPie - 50} Q ${x + 90} ${yPie - 40} ${x + 90} ${yPie} Z`} fill="#E8E6F0" />
              </g>
            ))}
          </g>
        ) : null}
        <Pildora x={550} y={560} texto="72,4 kg" color={LCD} o={ventana(T.subirte + 0.5, T.trampolin)} tam={56} />

        {/* Celda de carga grande (trampolín) */}
        <g opacity={verMedio}>
          <Panel x0={1340} y0={600} x1={2360} y1={1460} />
          <rect x={1400} y={860} width={120} height={340} fill="#5A5F6C" />
          {new Array(6).fill(0).map((_, k) => (
            <line key={k} x1={1400} y1={890 + k * 55} x2={1440} y2={860 + k * 55} stroke="#3A3F4C" strokeWidth={6} />
          ))}
          <line x1={B.x0} y1={B.top + B.alto} x2={B.x1 + 60} y2={B.top + B.alto} stroke={C.white} strokeWidth={3} strokeDasharray="12 10" opacity={regla} />
          <path d={barra} fill={ALU} />
          <path d={`M ${xs.map((x) => `${x} ${B.top + w(x)}`).join(" L ")}`} fill="none" stroke="#E0E6F0" strokeWidth={6} />
          {/* Galga pegada encima, cerca del empotramiento */}
          <g opacity={parche} transform={`translate(0 ${w(1700)})`}>
            <rect x={1590} y={984} width={220} height={30} fill="#C88A3A" opacity={0.6} />
            <path d={`M 1600 1010 ${new Array(10).fill(0).map((_, k) => `L ${1605 + k * 21} ${k % 2 ? 1010 : 988} L ${1615 + k * 21} ${k % 2 ? 1010 : 988}`).join(" ")}`} fill="none" stroke={GALGA} strokeWidth={4} />
          </g>
          {/* Regla de la flecha en el extremo */}
          <g opacity={regla}>
            <line x1={B.x1 + 50} y1={B.top + B.alto} x2={B.x1 + 50} y2={B.top + B.alto + D} stroke={C.yellow} strokeWidth={6} />
            <path d={`M ${B.x1 + 34} ${B.top + B.alto + D - 18} l 16 18 l 16 -18`} fill="none" stroke={C.yellow} strokeWidth={6} opacity={D > 30 ? 1 : 0} />
          </g>
          {/* Tu peso */}
          <g opacity={flecha}>
            <path d={`M ${B.x1 - 40} ${B.top - 220 + w(B.x1)} L ${B.x1 - 40} ${B.top - 40 + w(B.x1)}`} stroke={C.yellow} strokeWidth={22} strokeLinecap="round" />
            <path d={`M ${B.x1 - 90} ${B.top - 90 + w(B.x1)} L ${B.x1 - 40} ${B.top - 20 + w(B.x1)} L ${B.x1 + 10} ${B.top - 90 + w(B.x1)}`} fill="none" stroke={C.yellow} strokeWidth={22} strokeLinecap="round" strokeLinejoin="round" />
            <text x={B.x1 - 40} y={B.top - 250 + w(B.x1)} textAnchor="middle" fill={C.yellow} fontFamily={mono} fontSize={46} fontWeight={700}>
              TU PESO
            </text>
          </g>
          <text x={1850} y={1420} textAnchor="middle" fill={C.grey} fontFamily={mono} fontSize={30} opacity={D > 30 ? 1 : 0}>
            (curva exagerada)
          </text>
        </g>
        <Pildora x={2150} y={1330} texto="¿cuánto?" color={C.yellow} o={ventana(T.final + 0.3, T.dentro)} tam={50} />
        <Pildora x={2150} y={1330} texto="≈ 0,2 mm" color={C.yellow} o={ventana(T.apenas + 0.2, T.pero)} tam={56} />
        <Pildora x={1850} y={760} texto="invisible a simple vista" color={C.white} o={ventana(T.invisible, T.pero)} tam={38} />

        {/* Galga gigante */}
        <g opacity={ver2}>
          <Panel x0={2600} y0={600} x1={3600} y1={1460} />
          <rect x={3100 - 380 * (1 + 0.15 * s)} y={1020 - 200 * (1 - 0.05 * s)} width={760 * (1 + 0.15 * s)} height={400 * (1 - 0.05 * s)} rx={16} fill="#C88A3A" opacity={0.35} />
          <path d={`M ${zz.map((p) => `${p[0]} ${p[1]}`).join(" L ")}`} fill="none" stroke={GALGA} strokeWidth={18 * (1 - 0.5 * s)} strokeLinejoin="round" />
          <path d={`M ${zz.map((p) => `${p[0]} ${p[1]}`).join(" L ")}`} fill="none" stroke={C.red} strokeWidth={30} strokeLinejoin="round" opacity={0.25 * peor * (0.7 + 0.3 * Math.sin(t * 9))} />
          {new Array(14).fill(0).map((_, k) => {
            const [x, y] = enZig((fase + k / 14) % 1);
            return <circle key={k} cx={x} cy={y} r={11} fill={C.cyan} />;
          })}
          {s > 0.05
            ? [-1, 1].map((l) => (
                <path key={l} d={`M ${3100 + l * 420 * (1 + 0.15 * s)} 1020 l ${l * 80} 0 m ${-l * 26} -26 l ${l * 26} 26 l ${-l * 26} 26`} fill="none" stroke={C.white} strokeWidth={8} strokeLinecap="round" opacity={s} />
              ))
            : null}
        </g>
        <Pildora x={3100} y={1330} texto="resistencia ↑" color={C.red} o={ventana(T.deja + 0.3, T.cambio)} tam={48} />
        <Pildora x={3100} y={1330} texto="≈ +0,1 %" color={C.yellow} o={ventana(T.cambio, T.circuito + 0.2)} tam={56} />

        {/* Puente de Wheatstone */}
        <g opacity={ver3}>
          <Panel x0={3850} y0={600} x1={4850} y1={1460} />
          {(
            [
              [4350, 720, 4050, 1000, "#D8DCE4"],
              [4350, 720, 4650, 1000, GALGA],
              [4050, 1000, 4350, 1280, "#D8DCE4"],
              [4650, 1000, 4350, 1280, "#D8DCE4"],
            ] as const
          ).map(([x1, y1, x2, y2, c], k) => {
            const mx = (x1 + x2) / 2;
            const my = (y1 + y2) / 2;
            const ang = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
            return (
              <g key={k}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#8C88A8" strokeWidth={6} />
                <g transform={`translate(${mx} ${my}) rotate(${ang})`}>
                  <rect x={-70} y={-26} width={140} height={52} fill="#14102A" />
                  <path d="M -70 0 L -55 -22 L -35 22 L -15 -22 L 5 22 L 25 -22 L 45 22 L 60 0 L 70 0" fill="none" stroke={c} strokeWidth={7} strokeLinejoin="round" />
                </g>
              </g>
            );
          })}
          {/* Pila */}
          <path d="M 4350 720 L 3950 720 L 3950 960 M 3950 1040 L 3950 1280 L 4350 1280" fill="none" stroke="#8C88A8" strokeWidth={6} />
          <line x1={3910} y1={960} x2={3990} y2={960} stroke={C.white} strokeWidth={8} />
          <line x1={3925} y1={985} x2={3975} y2={985} stroke={C.white} strokeWidth={8} />
          <line x1={3910} y1={1010} x2={3990} y2={1010} stroke={C.white} strokeWidth={8} />
          <line x1={3925} y1={1035} x2={3975} y2={1035} stroke={C.white} strokeWidth={8} />
          {/* Voltímetro */}
          <line x1={4050} y1={1000} x2={4260} y2={1000} stroke="#8C88A8" strokeWidth={6} />
          <line x1={4440} y1={1000} x2={4650} y2={1000} stroke="#8C88A8" strokeWidth={6} />
          <circle cx={4350} cy={1000} r={90} fill="#E8E6F0" />
          <path d="M 4280 980 A 80 80 0 0 1 4420 980" fill="none" stroke="#8C88A8" strokeWidth={4} />
          <line x1={4350} y1={1030} x2={4350 + 85 * Math.sin((aguja * Math.PI) / 180)} y2={1030 - 85 * Math.cos((aguja * Math.PI) / 180)} stroke={C.red} strokeWidth={7} strokeLinecap="round" />
          <circle cx={4350} cy={1030} r={10} fill="#14102A" />
          <text x={4350} y={1170} textAnchor="middle" fill={aguja > 1 ? C.yellow : C.white} fontFamily={mono} fontSize={44} fontWeight={700}>
            {aguja > 1 ? "0,002 V" : "0,000 V"}
          </text>
        </g>

        {/* Chip y pantalla */}
        <g opacity={ver4}>
          <Panel x0={5100} y0={600} x1={6100} y1={1460} />
          <rect x={5230} y={910} width={240} height={240} rx={16} fill="#2A2E38" stroke="#5A5F6C" strokeWidth={4} />
          {new Array(6).fill(0).map((_, k) => (
            <g key={k}>
              <rect x={5250 + k * 36} y={880} width={16} height={30} fill="#C8CED8" />
              <rect x={5250 + k * 36} y={1150} width={16} height={30} fill="#C8CED8" />
            </g>
          ))}
          <text x={5350} y={1045} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={48} fontWeight={700}>
            chip
          </text>
          <path d={`M 5490 1030 L 5600 1030`} stroke={C.cyan} strokeWidth={8} strokeDasharray="14 10" strokeDashoffset={-t * 60} />
          <rect x={5620} y={940} width={400} height={180} rx={20} fill="#0A1A16" stroke={LCD} strokeWidth={4} />
          <text x={5820} y={1060} textAnchor="middle" fill={LCD} fontFamily={mono} fontSize={76} fontWeight={700}>
            {`${lectura.toFixed(1).replace(".", ",")}`}
          </text>
          <text x={5820} y={1170} textAnchor="middle" fill={LCD} fontFamily={mono} fontSize={40} fontWeight={700}>
            kg
          </text>
        </g>
      </g>

      {[T.celdas, T.detecta, T.kilos, T.pero + 0.4].map((d) => (
        <rect key={d} x={0} y={0} width={1080} height={1920} fill="#FFFFFF" opacity={0.2 * destello(d)} />
      ))}
      <Tag x={sx(270)} y={sy(1010)} dx={150} dy={-260} texto="celda de carga" color={C.yellow} o={ventana(T.celdas + 0.2, T.subirte)} />
      <Tag x={sx(1700)} y={sy(995 + w(1700))} dx={40} dy={-230} texto="galga" color={GALGA} o={ventana(T.pegado + 1.7, T.galga)} />
      <Tag x={sx(3100 + 280 * (1 + 0.25 * s))} y={sy(1020)} dx={-60} dy={-300} texto="más larga" color={C.white} o={ventana(T.larga, T.deja)} />
      <Tag x={sx(zz[6][0])} y={sy(zz[6][1] > 1020 ? zz[6][1] : zz[7][1])} dx={-40} dy={170} texto="más delgada" color={GALGA} o={ventana(T.larga + 0.3, T.deja)} />
      <Tag x={sx(4500)} y={sy(860)} dx={130} dy={-200} texto="la galga" color={GALGA} o={ventana(T.circuito + 0.4, T.detecta)} />
    </svg>
  );
};

import { interpolate, random } from "remotion";
import { camaraEn, ClaveCamara, Panel, Pildora, Tag, ventanaEn } from "../components/Mundo";
import { C, clamp, mono, useT } from "../theme";
import { T } from "./tiempos";

// Mundo: a la izquierda, el buzo soldando una viga bajo el mar; en el centro, el electrodo de cerca (arco, burbuja de gas
// y metal fundido); a la derecha, el circuito: generador de corriente continua en el barco, cable a la pinza, arco, pieza
// y cable de tierra, con el buzo fuera del camino de la corriente.
// Retención (estilo §10): cambio de plano cada 2-3 s y final que empalma con el gancho (el buzo soldando).
const ACERO = "#8A90A0";
const FUNDENTE = "#C8A878";
const ARCO = "#E8F8FF";
const TRAJE = "#2A2A30";
const CASCO = "#E8B030";
const BURB = new Array(10).fill(0).map((_, i) => ({ dx: (random(`bx${i}`) - 0.5) * 60, v: 0.6 + random(`bv${i}`) * 0.6, f: random(`bf${i}`) }));
const RUTA: [number, number][] = [
  [3050, 740],
  [3050, 1000],
  [3170, 1170],
  [3185, 1245],
  [3300, 1262],
  [3420, 1262],
  [3420, 900],
  [3150, 740],
  [3050, 740],
];

const camaraKeys = (): ClaveCamara[] => [
  [0, 580, 1060, 1.1],
  [T.final - 0.1, 580, 1060, 1.14],
  [T.final + 0.2, 560, 1000, 0.95],
  [T.buzo - 0.1, 560, 1000, 0.98],
  [T.buzo + 0.2, 500, 1000, 1.25],
  [T.electrodo - 0.1, 500, 1000, 1.28],
  [T.electrodo + 0.2, 1850, 1000, 1.0],
  [T.fundente - 0.1, 1850, 1000, 1.03],
  [T.fundente + 0.2, 1850, 900, 1.5],
  [T.acercar - 0.1, 1850, 900, 1.53],
  [T.acercar + 0.2, 1850, 1100, 1.2],
  [T.grados - 0.1, 1850, 1100, 1.23],
  [T.grados + 0.2, 1850, 1180, 1.6],
  [T.calor - 0.1, 1850, 1180, 1.63],
  [T.calor + 0.2, 1850, 1150, 1.3],
  [T.burbuja - 0.1, 1850, 1150, 1.33],
  [T.burbuja + 0.2, 1850, 1130, 1.05],
  [T.dentro - 0.1, 1850, 1130, 1.08],
  [T.dentro + 0.2, 1850, 1260, 1.7],
  [T.electricidad - 0.1, 1850, 1260, 1.73],
  [T.electricidad + 0.2, 3100, 1030, 1.0],
  [T.continua - 0.1, 3100, 1030, 1.03],
  [T.continua + 0.2, 3100, 900, 1.3],
  [T.pinza - 0.1, 3100, 900, 1.33],
  [T.pinza + 0.2, 3100, 1180, 1.6],
  [T.truco - 0.1, 3100, 1180, 1.63],
  [T.truco + 0.2, 3100, 1030, 1.0],
  [T.camino - 0.1, 3100, 1030, 1.03],
  [T.camino + 0.2, 3280, 1200, 1.6],
  [T.nunca - 0.1, 3280, 1200, 1.63],
  [T.nunca + 0.2, 3000, 1100, 1.2],
  [T.poreso - 0.1, 3000, 1100, 1.23],
  [T.poreso + 0.25, 580, 1060, 1.1],
  [T.fin + 0.3, 580, 1060, 1.14],
];

const enRuta = (p: number): [number, number] => {
  const L = RUTA.slice(1).map((q, i) => Math.hypot(q[0] - RUTA[i][0], q[1] - RUTA[i][1]));
  let d = (((p % 1) + 1) % 1) * L.reduce((a, b) => a + b, 0);
  for (let i = 0; i < L.length; i++) {
    if (d <= L[i]) {
      const f = d / L[i];
      return [RUTA[i][0] + (RUTA[i + 1][0] - RUTA[i][0]) * f, RUTA[i][1] + (RUTA[i + 1][1] - RUTA[i][1]) * f];
    }
    d -= L[i];
  }
  return RUTA[0];
};

// Rayo del arco entre dos puntos, tembloroso
const rayo = (x0: number, y0: number, x1: number, y1: number, t: number, n = 6) =>
  `M ${x0} ${y0} ${new Array(n)
    .fill(0)
    .map((_, i) => {
      const f = (i + 1) / n;
      const j = i === n - 1 ? 0 : Math.sin(t * 60 + i * 2.3) * 14;
      return `L ${x0 + (x1 - x0) * f + j} ${y0 + (y1 - y0) * f}`;
    })
    .join(" ")}`;

export const SoldarMundo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const { cx, cy, zoom } = camaraEn(camaraKeys(), t);
  const sx = (x: number) => 540 + (x - cx) * zoom;
  const sy = (y: number) => 960 + (y - cy) * zoom;
  const ventana = (a: number, b: number, entra = 0.3, sale = 0.3) => ventanaEn(t, a, b, entra, sale);
  const destello = (a: number) => interpolate(t, [a, a + 0.06, a + 0.4], [0, 1, 0], clamp);
  const parpadeo = 0.75 + 0.25 * Math.sin(t * 47) * Math.sin(t * 31);

  // Buzo: arco encendido salvo mientras explica el electrodo
  const arcoBuzo = t < T.buzo + 0.4 || t > T.poreso - 0.2 ? 1 : 0;

  // Electrodo de cerca
  const verElec = ventana(T.electrodo - 0.1, T.electricidad + 0.2);
  const baja = interpolate(t, [T.acercar, T.arco], [0, 1], clamp);
  const punta = 1080 + 110 * baja;
  const encendido = t > T.arco ? 1 : 0;
  const hierve = ventana(T.calor, T.electricidad + 0.2);
  const gas = interpolate(t, [T.burbuja - 0.2, T.burbuja + 0.6], [0, 1], clamp);
  const charco = interpolate(t, [T.dentro, T.funde + 0.3], [0, 1], clamp);
  const cordon = interpolate(t, [T.une - 0.2, T.une + 0.6], [0, 1], clamp);
  const gasta = interpolate(t, [T.arco, T.electricidad], [0, 50], clamp);

  // Circuito
  const verCirc = ventana(T.electricidad - 0.1, T.poreso + 0.2);
  const flujo = ventana(T.continua - 0.2, T.poreso + 0.2);
  const aislado = ventana(T.pinza, T.truco);
  const camino = ventana(T.camino, T.poreso + 0.2);
  const salvo = ventana(T.nunca, T.poreso + 0.2);

  const camaraT = `translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`;

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <defs>
        <linearGradient id="mar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1A5A8A" />
          <stop offset="1" stopColor="#06182A" />
        </linearGradient>
        <radialGradient id="brillo">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity={0.9} />
          <stop offset="0.4" stopColor="#9AD8FF" stopOpacity={0.4} />
          <stop offset="1" stopColor="#9AD8FF" stopOpacity={0} />
        </radialGradient>
      </defs>
      <g transform={camaraT}>
        <rect x={-300} y={-400} width={4200} height={2400} fill="#141824" />

        {/* Bajo el mar: buzo y viga */}
        <rect x={60} y={420} width={1000} height={1140} rx={30} fill="url(#mar)" />
        <rect x={560} y={1140} width={480} height={120} fill={ACERO} />
        <rect x={560} y={1140} width={480} height={14} fill="#B8BEC8" />
        <path d="M 640 1050 C 600 800, 700 600, 660 420" fill="none" stroke="#1A1A1A" strokeWidth={10} />
        <path d="M 1000 1140 C 1010 900, 960 600, 990 420" fill="none" stroke="#3A3A3A" strokeWidth={10} />
        <rect x={970} y={1120} width={60} height={34} rx={6} fill="#C83A3A" />
        {/* Buzo */}
        <g>
          <rect x={250} y={960} width={170} height={300} rx={60} fill={TRAJE} />
          <rect x={270} y={1240} width={60} height={240} rx={26} fill={TRAJE} />
          <rect x={340} y={1240} width={60} height={240} rx={26} fill={TRAJE} />
          <path d="M 400 1000 L 520 1060 L 615 1055" fill="none" stroke={TRAJE} strokeWidth={50} strokeLinecap="round" strokeLinejoin="round" />
          <circle cx={340} cy={880} r={95} fill={CASCO} />
          <rect x={360} y={840} width={70} height={80} rx={16} fill="#1A2A3A" />
          <rect x={366} y={846} width={58} height={40} rx={10} fill="#3A6A8A" opacity={0.5} />
          <rect x={600} y={1030} width={60} height={46} rx={10} fill="#1A1A1A" />
          <line x1={650} y1={1060} x2={735} y2={1128} stroke={FUNDENTE} strokeWidth={12} strokeLinecap="round" />
        </g>
        {arcoBuzo ? (
          <g>
            <circle cx={742} cy={1136} r={130 * parpadeo} fill="url(#brillo)" />
            <path d={rayo(736, 1130, 750, 1142, t, 3)} stroke={ARCO} strokeWidth={6} fill="none" />
            {BURB.map((b, i) => {
              const p = (t * b.v + b.f) % 1;
              return <circle key={i} cx={745 + b.dx + Math.sin(t * 3 + i) * 10} cy={1120 - p * 650} r={8 + p * 14} fill="none" stroke="#C8E8F8" strokeWidth={3} opacity={1 - p} />;
            })}
          </g>
        ) : null}
        <Pildora x={560} y={600} texto="¿sin electrocutarse?" color={C.white} o={ventana(T.final + 0.3, T.buzo)} tam={42} />

        {/* Electrodo de cerca */}
        <g opacity={verElec}>
          <Panel x0={1340} y0={600} x1={2360} y1={1460} fill="#0A2238" />
          {hierve > 0
            ? BURB.map((b, i) => {
                const p = (t * b.v * 1.6 + b.f) % 1;
                return <circle key={i} cx={1850 + b.dx * 3} cy={1190 - p * 560} r={10 + p * 22} fill="none" stroke="#C8E8F8" strokeWidth={3} opacity={hierve * (1 - p)} />;
              })
            : null}
          {/* Placas de acero y cordón */}
          <rect x={1400} y={1200} width={440 + 10 * cordon} height={180} fill={ACERO} />
          <rect x={1860 - 10 * cordon} y={1200} width={440 + 10 * cordon} height={180} fill={ACERO} />
          {charco > 0 ? <ellipse cx={1850} cy={1205} rx={30 + 70 * charco} ry={12 + 10 * charco} fill={cordon > 0.5 ? "#C8B090" : "#F8883A"} opacity={0.9} /> : null}
          {cordon > 0 ? <path d="M 1770 1205 Q 1850 1170 1930 1205" fill="none" stroke="#A89878" strokeWidth={14} opacity={cordon} /> : null}
          {/* Burbuja de gas */}
          {gas > 0 ? <ellipse cx={1850} cy={1150} rx={170 * gas} ry={130 * gas} fill="#C8E8F8" opacity={0.18} stroke="#C8E8F8" strokeWidth={4} /> : null}
          {/* Electrodo */}
          <rect x={1825} y={640} width={50} height={punta - 640 - gasta * 0.3} fill={FUNDENTE} />
          <rect x={1840} y={640} width={20} height={punta - 640} fill="#C8CED8" />
          {encendido ? (
            <g>
              <circle cx={1850} cy={1195} r={160 * parpadeo} fill="url(#brillo)" />
              <path d={rayo(1850, punta, 1850, 1200, t)} stroke={ARCO} strokeWidth={9} fill="none" />
              <path d={rayo(1850, punta, 1850, 1200, t + 0.5)} stroke="#9AD8FF" strokeWidth={4} fill="none" />
              {ventana(T.recubrimiento, T.dentro) > 0
                ? [0, 1, 2].map((k) => {
                    const p = (t * 1.2 + k / 3) % 1;
                    return <circle key={k} cx={1890 + p * 60} cy={punta - 20 - p * 200} r={16 + p * 20} fill="#8A8A8A" opacity={0.5 * (1 - p)} />;
                  })
                : null}
            </g>
          ) : null}
        </g>
        <Pildora x={1850} y={1430} texto="> 5000 °C" color={C.yellow} o={ventana(T.grados, T.calor + 0.3)} tam={56} />

        {/* Circuito */}
        <g opacity={verCirc}>
          <Panel x0={2600} y0={600} x1={3600} y1={1460} fill="#0A2238" />
          <rect x={2620} y={620} width={960} height={70} fill="#1A5A8A" opacity={0.6} />
          <path d="M 2900 690 L 3300 690 L 3260 650 L 2940 650 Z" fill="#C8CED8" />
          <rect x={2990} y={590} width={220} height={70} rx={10} fill="#3A3F4C" stroke={C.yellow} strokeWidth={4} />
          <text x={3100} y={638} textAnchor="middle" fill={C.yellow} fontFamily={mono} fontSize={34} fontWeight={700}>
            DC
          </text>
          <path d={`M ${RUTA.slice(0, 4).map((q) => `${q[0]} ${q[1]}`).join(" L ")}`} fill="none" stroke="#C83A3A" strokeWidth={10} strokeLinejoin="round" />
          <path d="M 3420 1262 L 3420 900 L 3150 740" fill="none" stroke="#3A3A3A" strokeWidth={10} strokeLinejoin="round" />
          <rect x={2900} y={1250} width={600} height={80} fill={ACERO} />
          <rect x={3395} y={1235} width={50} height={30} rx={6} fill="#C83A3A" />
          <rect x={3140} y={1150} width={60} height={40} rx={10} fill="#1A1A1A" stroke={C.cyan} strokeWidth={8 * aislado} />
          <line x1={3175} y1={1185} x2={3185} y2={1242} stroke={FUNDENTE} strokeWidth={10} />
          <circle cx={3186} cy={1248} r={40 * parpadeo} fill="url(#brillo)" />
          {/* Buzo pequeño, fuera del camino */}
          <g transform="translate(2780 1120) scale(0.45)">
            <rect x={-85} y={80} width={170} height={300} rx={60} fill={TRAJE} stroke={C.cyan} strokeWidth={14 * aislado} />
            <circle cx={0} cy={0} r={95} fill={CASCO} />
            <rect x={20} y={-40} width={70} height={80} rx={16} fill="#1A2A3A" />
            <path d="M 60 130 L 300 110 L 760 110" fill="none" stroke={TRAJE} strokeWidth={50} strokeLinecap="round" />
          </g>
          {flujo > 0
            ? new Array(14).fill(0).map((_, k) => {
                const [x, y] = enRuta(t * 0.18 + k / 14);
                return <circle key={k} cx={x} cy={y} r={11} fill={C.yellow} opacity={flujo} />;
              })
            : null}
          {camino > 0 ? <path d="M 3185 1245 L 3300 1262 L 3420 1262" fill="none" stroke={C.yellow} strokeWidth={22} strokeLinecap="round" opacity={0.35 * camino} /> : null}
          {salvo > 0 ? (
            <g opacity={salvo}>
              <circle cx={2780} cy={960} r={44} fill="#2A8A4A" />
              <path d="M 2760 960 l 14 16 l 26 -30" fill="none" stroke="#FFFFFF" strokeWidth={10} strokeLinecap="round" />
            </g>
          ) : null}
        </g>
        <Pildora x={3100} y={1390} texto="continua, no alterna" color={C.yellow} o={ventana(T.continua + 0.2, T.pinza)} tam={40} />
        <Pildora x={3100} y={1390} texto="fuera del circuito" color="#48C878" o={ventana(T.nunca + 0.2, T.poreso + 0.2)} tam={42} />
      </g>

      {[T.arco, T.burbuja, T.electricidad].map((q) => (
        <rect key={q} x={0} y={0} width={1080} height={1920} fill="#FFFFFF" opacity={(q === T.arco ? 0.5 : 0.2) * destello(q)} />
      ))}
      <Tag x={sx(1850)} y={sy(900)} dx={170} dy={-140} texto="núcleo de metal" color="#C8CED8" o={ventana(T.electrodo + 0.3, T.fundente)} />
      <Tag x={sx(1830)} y={sy(860)} dx={-160} dy={170} texto="fundente" color={FUNDENTE} o={ventana(T.fundente, T.acercar)} />
      <Tag x={sx(1850 + 170 * gas)} y={sy(1150)} dx={60} dy={-220} texto="burbuja de gas" color="#C8E8F8" o={ventana(T.burbuja + 0.4, T.dentro)} />
      <Tag x={sx(1850)} y={sy(1205)} dx={140} dy={150} texto="metal fundido" color={C.orange} o={ventana(T.funde - 0.4, T.electricidad)} />
      <Tag x={sx(3170)} y={sy(1150)} dx={-170} dy={-150} texto="pinza aislada" color={C.cyan} o={ventana(T.pinza + 0.3, T.traje)} />
      <Tag x={sx(2780)} y={sy(1180)} dx={60} dy={-220} texto="traje aislado" color={C.cyan} o={ventana(T.traje, T.truco)} />
    </svg>
  );
};

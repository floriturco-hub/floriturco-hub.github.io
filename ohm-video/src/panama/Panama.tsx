import { interpolate, random } from "remotion";
import { camaraEn, ClaveCamara, Pildora, Tag, ventanaEn } from "../components/Mundo";
import { C, clamp, useT } from "../theme";
import { T } from "./tiempos";

// Mundo: el canal de perfil, de izquierda a derecha: el mar, tres esclusas como escalones y el lago Gatún a 26 m, con la
// selva, los ríos y las nubes de lluvia. El barco entra, las válvulas dejan bajar el agua de la cámara de arriba y flota.
// Retención (estilo §10): cambio de plano cada 2-3 s y final que empalma con el gancho (el barco que sube con la lluvia).
const AGUA = "#2A7AC8";
const SELVA = "#2A7A3A";
const NIVEL = { mar: 1300, n1: 1180, n2: 1060, lago: 940 };
const PISO = [1450, 1330, 1210];
const LLUVIA = new Array(70).fill(0).map((_, i) => ({ x: -300 + random(`lx${i}`) * 4200, f: random(`lf${i}`), v: 0.8 + random(`lv${i}`) * 0.6 }));
const NUBES = new Array(14).fill(0).map((_, i) => ({ x: -200 + i * 300 + random(`nx${i}`) * 100, y: 470 + random(`ny${i}`) * 60, r: 110 + random(`nr${i}`) * 60 }));

const camaraKeys = (): ClaveCamara[] => [
  [0, 1000, 1080, 0.85],
  [T.final - 0.1, 1000, 1080, 0.88],
  [T.final + 0.2, 1700, 1050, 0.42],
  [T.canal - 0.1, 1700, 1050, 0.43],
  [T.canal + 0.2, 3000, 960, 0.6],
  [T.metros - 0.1, 3000, 960, 0.62],
  [T.metros + 0.2, 2560, 1120, 0.6],
  [T.llegar - 0.1, 2560, 1120, 0.62],
  [T.llegar + 0.2, 1600, 1150, 0.48],
  [T.escalones - 0.1, 1600, 1150, 0.5],
  [T.escalones + 0.2, 1500, 1100, 0.42],
  [T.entra - 0.1, 1500, 1100, 0.44],
  [T.entra + 0.2, 750, 1150, 0.8],
  [T.cierra - 0.1, 750, 1150, 0.82],
  [T.cierra + 0.2, 730, 1180, 1.1],
  [T.valvulas - 0.1, 730, 1180, 1.12],
  [T.valvulas + 0.2, 1300, 1300, 0.9],
  [T.gravedad - 0.1, 1300, 1300, 0.92],
  [T.gravedad + 0.2, 1300, 1200, 0.75],
  [T.llena - 0.1, 1300, 1200, 0.77],
  [T.llena + 0.2, 1000, 1150, 0.85],
  [T.flota - 0.1, 1000, 1150, 0.87],
  [T.flota + 0.2, 1000, 1100, 1.05],
  [T.siguiente - 0.1, 1000, 1100, 1.08],
  [T.siguiente + 0.2, 1400, 1100, 0.7],
  [T.tres - 0.1, 1400, 1100, 0.72],
  [T.tres + 0.2, 1900, 1060, 0.42],
  [T.lago - 0.1, 1900, 1060, 0.44],
  [T.lago + 0.2, 2750, 1000, 0.6],
  [T.agua - 0.1, 2750, 1000, 0.62],
  [T.agua + 0.2, 3050, 820, 0.7],
  [T.rios - 0.1, 3050, 820, 0.72],
  [T.rios + 0.2, 3250, 900, 0.8],
  [T.gasta - 0.1, 3250, 900, 0.82],
  [T.gasta + 0.2, 1700, 1000, 0.45],
  [T.porque - 0.1, 1700, 1000, 0.46],
  [T.porque + 0.25, 1000, 1080, 0.85],
  [T.fin + 0.3, 1000, 1080, 0.88],
];

const Barco: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M -230 -24 L 230 -24 L 200 50 L -210 50 Z" fill="#C83A3A" />
    <rect x={-230} y={-36} width={460} height={14} fill="#2A2A30" />
    {["#E8703C", "#08A8C8", "#F8C848", "#48C878", "#E8414F", "#8A5CC8"].map((c, k) => (
      <rect key={k} x={-120 + k * 52} y={-96} width={48} height={60} fill={c} />
    ))}
    <rect x={-210} y={-170} width={70} height={134} fill="#E8E6F0" />
    <rect x={-202} y={-160} width={54} height={20} fill="#3A6A8A" />
  </g>
);

export const PanamaMundo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const { cx, cy, zoom } = camaraEn(camaraKeys(), t);
  const sx = (x: number) => 540 + (x - cx) * zoom;
  const sy = (y: number) => 960 + (y - cy) * zoom;
  const ventana = (a: number, b: number, entra = 0.3, sale = 0.3) => ventanaEn(t, a, b, entra, sale);
  const destello = (a: number) => interpolate(t, [a, a + 0.06, a + 0.4], [0, 1, 0], clamp);
  const lin = (a: number, b: number, v0: number, v1: number) => interpolate(t, [a, b], [v0, v1], clamp);

  // Niveles de agua de las tres cámaras y posición del barco
  const gancho = t < T.final || t > T.porque;
  const tg = t > T.porque ? t - T.porque : t;
  const L1 = gancho ? interpolate(tg, [0, 1.4], [NIVEL.mar, NIVEL.n1], clamp) : t < T.llena ? NIVEL.mar : lin(T.llena, T.flota + 0.6, NIVEL.mar, NIVEL.n1);
  const L2 = gancho ? NIVEL.n1 : t < T.llena ? NIVEL.n2 : t < T.tres ? lin(T.llena, T.flota + 0.6, NIVEL.n2, NIVEL.n1) : lin(T.tres + 0.1, T.tres + 0.6, NIVEL.n1, NIVEL.n2);
  const L3 = gancho ? NIVEL.n2 : t < T.tres ? NIVEL.lago : t < T.tres + 1.2 ? lin(T.tres + 0.1, T.tres + 0.6, NIVEL.lago, NIVEL.n2) : lin(T.tres + 1.2, T.lago - 0.1, NIVEL.n2, NIVEL.lago);
  const xBarco = gancho
    ? 1000
    : t < T.entra
      ? 380
      : t < T.siguiente
        ? lin(T.entra, T.entra + 1.1, 380, 1000)
        : t < T.tres
          ? lin(T.siguiente, T.siguiente + 1.0, 1000, 1600)
          : t < T.lago
            ? lin(T.tres + 0.6, T.tres + 1.15, 1600, 2200)
            : lin(T.lago, T.lago + 1.0, 2200, 2950);
  const nivelEn = (x: number) => (x < 700 ? NIVEL.mar : x < 1300 ? L1 : x < 1900 ? L2 : x < 2500 ? L3 : NIVEL.lago);
  const yBarco = nivelEn(xBarco);

  // Compuertas (0 cerrada, 1 abierta)
  const g0 = gancho ? 0 : t < T.cierra ? 1 : interpolate(t, [T.cierra, T.cierra + 0.5], [1, 0], clamp);
  const g1 = ventana(T.siguiente - 0.3, T.tres + 0.1, 0.3, 0.3);
  const g2 = ventana(T.tres + 0.5, T.tres + 1.25, 0.1, 0.1);
  const g3 = t > T.lago - 0.3 && !gancho ? interpolate(t, [T.lago - 0.3, T.lago], [0, 1], clamp) : 0;
  const flujo = Math.max(gancho ? 1 : 0, ventana(T.valvulas, T.flota + 0.6));
  const lluvia = Math.max(gancho ? 1 : 0, ventana(T.agua, T.gasta + 0.3), ventana(T.canal, T.metros));

  const camaraT = `translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`;
  const compuerta = (x: number, abierta: number, piso: number) => (
    <g>
      <rect x={x - 16} y={860 - 120 * abierta} width={32} height={piso - 860} fill="#5A5F6C" opacity={1 - 0.75 * abierta} />
    </g>
  );

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <defs>
        <linearGradient id="cielo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2A3A5A" />
          <stop offset="1" stopColor="#5A7AA8" />
        </linearGradient>
      </defs>
      <g transform={camaraT}>
        <rect x={-2000} y={-2400} width={8000} height={6000} fill="#141824" />
        <rect x={-600} y={300} width={4800} height={1300} fill="url(#cielo)" />
        {/* Nubes y lluvia */}
        {NUBES.map((n, i) => (
          <circle key={i} cx={n.x} cy={n.y} r={n.r} fill="#5A6070" opacity={0.6 + 0.35 * lluvia} />
        ))}
        {lluvia > 0
          ? LLUVIA.map((l, i) => {
              const p = (t * l.v + l.f) % 1;
              const y = 560 + p * 700;
              return <line key={i} x1={l.x} y1={y} x2={l.x - 14} y2={y + 46} stroke="#C8E0F8" strokeWidth={5} opacity={0.7 * lluvia} />;
            })
          : null}
        {/* Selva y ríos sobre el lago */}
        <path d="M 3420 960 Q 3600 820 3750 700 Q 3850 620 4100 580 L 4100 1600 L 3420 1600 Z" fill={SELVA} />
        {new Array(12).fill(0).map((_, k) => (
          <circle key={k} cx={3560 + k * 45} cy={820 - k * 18 + (k % 2) * 20} r={40} fill="#1E5A2A" />
        ))}
        <path d={`M 3950 620 C 3750 700, 3600 820, 3440 930`} fill="none" stroke={AGUA} strokeWidth={22} strokeDasharray="40 20" strokeDashoffset={-t * 120} opacity={0.4 + 0.6 * ventana(T.rios, T.gasta + 0.3)} />
        <path d={`M 4050 760 C 3850 840, 3650 900, 3460 945`} fill="none" stroke={AGUA} strokeWidth={18} strokeDasharray="40 20" strokeDashoffset={-t * 120} opacity={0.4 + 0.6 * ventana(T.rios, T.gasta + 0.3)} />
        {/* Lago Gatún */}
        <rect x={2500} y={NIVEL.lago} width={1000} height={1150 - NIVEL.lago} fill={AGUA} />
        {/* Terreno y esclusas */}
        <path d="M -600 1500 L 700 1500 L 700 1450 L 1300 1450 L 1300 1330 L 1900 1330 L 1900 1210 L 2500 1210 L 2500 1150 L 4100 1150 L 4100 1700 L -600 1700 Z" fill="#5A4A3A" />
        <rect x={-600} y={NIVEL.mar} width={1300} height={200} fill={AGUA} />
        <rect x={700} y={L1} width={600} height={PISO[0] - L1} fill={AGUA} />
        <rect x={1300} y={L2} width={600} height={PISO[1] - L2} fill={AGUA} />
        <rect x={1900} y={L3} width={600} height={PISO[2] - L3} fill={AGUA} />
        {/* Túneles por donde baja el agua */}
        <path d="M 1500 1330 L 1500 1400 L 1100 1400 L 1100 1450" fill="none" stroke="#2A2E38" strokeWidth={34} />
        {flujo > 0
          ? [0, 1, 2, 3].map((k) => {
              const p = (t * 1.2 + k / 4) % 1;
              const d = p * 520;
              const [x, y] = d < 70 ? [1500, 1330 + d] : d < 470 ? [1500 - (d - 70), 1400] : [1100, 1400 + (d - 470)];
              return <circle key={k} cx={x} cy={y} r={12} fill="#9AD8FF" opacity={flujo} />;
            })
          : null}
        {/* Compuertas */}
        {compuerta(700, g0, 1500)}
        {compuerta(1300, g1, PISO[0])}
        {compuerta(1900, g2, PISO[1])}
        {compuerta(2500, g3, PISO[2])}
        <Barco x={xBarco} y={yBarco} />
        {/* 26 m */}
        <g opacity={ventana(T.metros, T.llegar + 0.3)}>
          <line x1={2440} y1={NIVEL.mar} x2={2440} y2={NIVEL.lago} stroke={C.yellow} strokeWidth={10} />
          <line x1={2400} y1={NIVEL.mar} x2={2480} y2={NIVEL.mar} stroke={C.yellow} strokeWidth={10} />
          <line x1={2400} y1={NIVEL.lago} x2={2480} y2={NIVEL.lago} stroke={C.yellow} strokeWidth={10} />
          <line x1={-600} y1={NIVEL.mar} x2={2440} y2={NIVEL.mar} stroke={C.yellow} strokeWidth={4} strokeDasharray="20 16" />
        </g>
        <Pildora x={2440} y={830} texto="26 m" color={C.yellow} o={ventana(T.metros, T.llegar + 0.3)} tam={80} />
        <Pildora x={3050} y={1060} texto="Lago Gatún" color={C.cyan} o={ventana(T.gatun - 0.6, T.metros + 0.3)} tam={70} />
        <Pildora x={1300} y={720} texto="solo gravedad ↓" color={C.yellow} o={ventana(T.gravedad, T.llena + 0.2)} tam={60} />
        <Pildora x={1600} y={760} texto="esclusas" color={C.white} o={ventana(T.esclusas, T.entra)} tam={100} />
        <Pildora x={1700} y={720} texto="≈ 200 millones de litros" color={C.yellow} o={ventana(T.gasta + 0.4, T.porque)} tam={90} />
        <Pildora x={1700} y={760} texto="¿cuánta agua?" color={C.white} o={ventana(T.final + 0.4, T.canal)} tam={110} />
      </g>

      {[T.cierra, T.llena, T.lago, T.gasta].map((q) => (
        <rect key={q} x={0} y={0} width={1080} height={1920} fill="#FFFFFF" opacity={0.2 * destello(q)} />
      ))}
      <Tag x={sx(1300)} y={sy(1400)} dx={-160} dy={170} texto="válvulas" color="#9AD8FF" o={ventana(T.valvulas + 0.2, T.gravedad)} />
      <Tag x={sx(700)} y={sy(1000)} dx={170} dy={-220} texto="compuerta" color={C.white} o={ventana(T.cierra + 0.2, T.valvulas)} />
      <Tag x={sx(3500)} y={sy(840)} dx={-120} dy={-220} texto="ríos de la selva" color="#9AD8FF" o={ventana(T.rios + 0.3, T.gasta)} />
    </svg>
  );
};

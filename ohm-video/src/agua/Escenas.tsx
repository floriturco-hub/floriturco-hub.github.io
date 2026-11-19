import { Easing, interpolate } from "remotion";
import { C, clamp, H, mono, useT, W } from "../theme";
import { Corte, Esfera, Rodillos } from "./Medidor";
import { T } from "./tiempos";

const METAL = "#8C88A8";
const AGUA = "#3F7BD8";
const suave = { ...clamp, easing: Easing.inOut(Easing.cubic) };

const Grifo: React.FC<{ readonly x: number; readonly y: number; readonly abierto: number; readonly t: number }> = ({ x, y, abierto, t }) => (
  <g>
    <rect x={x - 200} y={y - 40} width={200} height={50} rx={14} fill={METAL} />
    <path d={`M ${x} ${y - 40} Q ${x + 90} ${y - 40} ${x + 90} ${y + 40} L ${x + 50} ${y + 40} Q ${x + 50} ${y + 10} ${x} ${y + 10} Z`} fill={METAL} />
    <rect x={x - 60} y={y - 90} width={60} height={50} rx={10} fill={METAL} transform={`rotate(${-35 * abierto} ${x - 30} ${y - 40})`} />
    {abierto > 0
      ? new Array(10).fill(0).map((_, k) => {
          const p = (t * 1.8 + k / 10) % 1;
          return <circle key={k} cx={x + 70 + Math.sin(k) * 4} cy={y + 50 + p * 310} r={12} fill={AGUA} opacity={abierto * 0.9} />;
        })
      : null}
  </g>
);

// Gancho: el grifo abierto y un contador de litros; la tubería baja hasta el medidor. También la escena de la fuga.
export const Casa: React.FC<{ readonly t0: number; readonly fase: "intro" | "fuga" }> = ({ t0, fase }) => {
  const t = useT(t0);
  const intro = fase === "intro";
  const abierto = intro ? 1 : interpolate(t, [T.cierra, T.cierra + 0.5], [1, 0], clamp);
  const litros = intro ? Math.floor(t * 9.5) : 0;
  const bajada = intro ? interpolate(t, [T.aparato, T.medidor - 0.2], [0, 1], suave) : 0;
  const zoom = intro ? 1 + 0.25 * bajada : interpolate(t, [T.truco, T.ruedita - 0.4, T.ruedita + 0.4], [1, 1, 1.9], suave);
  const cy = intro ? 960 + 520 * bajada : 960 + (1430 - 960) * interpolate(t, [T.ruedita - 0.4, T.ruedita + 0.4], [0, 1], suave);
  const fugaGiro = !intro && t > T.ruedita - 0.3 ? (t - T.ruedita) * 200 : 0;
  const gota = !intro ? interpolate(t, [T.fuga - 0.3, T.fuga + 0.3], [0, 1], clamp) : 0;

  return (
    <svg width={W} height={H} style={{ position: "absolute" }}>
      <g transform={`translate(${540 - 540 * zoom} ${960 - cy * zoom}) scale(${zoom})`}>
        {/* Fregadero */}
        <path d="M 330 1000 L 820 1000 L 785 1110 L 365 1110 Z" fill="#2A2350" stroke={METAL} strokeWidth={8} />
        <Grifo x={500} y={640} abierto={abierto} t={t} />
        {/* Tubería hasta el medidor */}
        <path d="M 300 600 L 180 600 L 180 1430 L 340 1430" fill="none" stroke={METAL} strokeWidth={26} strokeLinejoin="round" />
        <path d="M 740 1430 L 1100 1430" fill="none" stroke={METAL} strokeWidth={26} />
        {abierto > 0
          ? [0, 1, 2, 3, 4, 5].map((k) => {
              const p = (t * 0.6 + k / 6) % 1;
              const [x, y] = p < 0.5 ? [1100 - p * 2 * 360, 1430] : [180, 1430 - (p - 0.5) * 2 * 830];
              return <circle key={k} cx={x} cy={y} r={8} fill={AGUA} opacity={abierto} />;
            })
          : null}
        <Esfera x={540} y={1430} valor={1234.567 + t * 0.003 * abierto + (intro ? 0 : (t - t0) * 0.0004)} giro={(t * 360 * abierto) + fugaGiro} s={0.62} />
        {/* Fuga: gota en un empalme */}
        {gota > 0 ? (
          <g opacity={gota}>
            {[0, 1, 2].map((k) => {
              const p = (t * 1.2 + k / 3) % 1;
              return <path key={k} d={`M 180 ${1000 + p * 200} q 10 18 0 26 q -10 -8 0 -26`} fill={AGUA} opacity={1 - p} />;
            })}
            <circle cx={180} cy={980} r={30} fill="none" stroke={C.red} strokeWidth={4} />
          </g>
        ) : null}
        {/* Grifos cerrados */}
        {!intro && abierto < 0.5 ? (
          <g stroke={C.red} strokeWidth={8} strokeLinecap="round" opacity={1 - abierto * 2}>
            <line x1={540} y1={720} x2={620} y2={800} />
            <line x1={620} y1={720} x2={540} y2={800} />
          </g>
        ) : null}
      </g>
      {intro ? (
        <g opacity={interpolate(t, [0.3, 0.7, T.medidor - 0.6, T.medidor - 0.2], [0, 1, 1, 0], clamp)}>
          <rect x={60} y={150} width={960} height={250} rx={24} fill={C.card} stroke={C.cardBorder} strokeWidth={2} />
          <text x={110} y={215} fill={C.grey} fontFamily={mono} fontSize={30}>litros que salen del grifo</text>
          <text x={110} y={340} fill={C.cyan} fontFamily={mono} fontSize={96} fontWeight={700}>
            {litros}
            <tspan fill={C.grey} fontSize={48}> L</tspan>
          </text>
        </g>
      ) : null}
    </svg>
  );
};

// Dentro del medidor: esfera → corte con turbina → engranajes → rodillos; 1 m³ = 1.000 L
export const Interior: React.FC<{ readonly t0: number; readonly fase: "medidor" | "final" }> = ({ t0, fase }) => {
  const t = useT(t0);
  const final = fase === "final";
  const corte = final ? 1 : interpolate(t, [T.turbina - 0.3, T.turbina + 0.5], [0, 1], suave);
  const flujo = final ? 1 : interpolate(t, [T.girar - 0.2, T.girar + 0.3], [0, 1], clamp);
  const giro = (t - T.girar) * 300 * flujo;
  const engranajes = final ? 1 : interpolate(t, [T.engranajes - 0.2, T.engranajes + 0.4], [0, 1], clamp);
  const rodillos = final ? 0 : interpolate(t, [T.cuenta - 0.2, T.cuenta + 0.4], [0, 1], clamp);
  const cubo = final ? 0 : interpolate(t, [T.mil - 0.1, T.mil + 0.4], [0, 1], clamp);
  const vuelta = final ? 0 : interpolate(t, [T.vuelta - 0.1, T.vuelta + 0.3, T.engranajes - 0.3, T.engranajes], [0, 1, 1, 0], clamp);
  const zoom = final ? interpolate(t, [t0, t0 + 1, T.fin + 0.5], [1.3, 1.05, 1.08], suave) : 1 + 0.08 * corte;

  return (
    <svg width={W} height={H} style={{ position: "absolute" }}>
      <g transform={`translate(${540 - 540 * zoom} ${960 - 1100 * zoom}) scale(${zoom})`}>
        {corte < 1 ? (
          <g opacity={1 - corte}>
            <Esfera x={540} y={1100} valor={1234.567} giro={0} s={1.2} />
          </g>
        ) : null}
        {corte > 0 ? (
          <g opacity={corte}>
            <Corte t={t} giro={giro} flujo={flujo} vistaEngranajes={engranajes} />
            {rodillos > 0 ? (
              <g opacity={rodillos}>
                <Rodillos x={250} y={560} valor={1234.567 + Math.max(0, t - T.cuenta) * 0.35} alto={80} />
                <text x={540} y={530} textAnchor="middle" fill={C.grey} fontFamily={mono} fontSize={30} fontWeight={700}>m³</text>
              </g>
            ) : null}
            {vuelta > 0 ? (
              <g opacity={vuelta}>
                <path d={`M 690 1240 A 150 150 0 1 1 640 1120`} fill="none" stroke={C.yellow} strokeWidth={6} strokeDasharray="14 10" />
                <text x={720} y={1460} fill={C.yellow} fontFamily={mono} fontSize={40} fontWeight={700}>1 vuelta</text>
                <text x={720} y={1510} fill={C.white} fontFamily={mono} fontSize={34} fontWeight={700}>= volumen fijo</text>
              </g>
            ) : null}
          </g>
        ) : null}
      </g>
      {cubo > 0 ? (
        <g opacity={cubo}>
          <rect x={60} y={150} width={960} height={330} rx={24} fill={C.card} stroke={C.cardBorder} strokeWidth={2} />
          <g transform="translate(230 320)">
            <polygon points="-90,-40 30,-40 90,-90 -30,-90" fill="#2A4A8A" stroke={AGUA} strokeWidth={4} />
            <rect x={-90} y={-40} width={120} height={120} fill="#1E3A6E" stroke={AGUA} strokeWidth={4} />
            <polygon points="30,-40 90,-90 90,30 30,80" fill="#173058" stroke={AGUA} strokeWidth={4} />
          </g>
          <text x={400} y={300} fill={C.white} fontFamily={mono} fontSize={72} fontWeight={700}>1 m³</text>
          <text x={400} y={390} fill={C.cyan} fontFamily={mono} fontSize={60} fontWeight={700}>= 1.000 litros</text>
        </g>
      ) : null}
    </svg>
  );
};

// Tarjetas del cobro: lectura → tramos → factura (precios de ejemplo)
const TRAMOS = [
  { hasta: 10, precio: 1, color: C.cyan },
  { hasta: 20, precio: 2, color: C.yellow },
  { hasta: 30, precio: 3, color: C.red },
];
const CONSUMO = 18;

export const Cobro: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const lectura = interpolate(t, [T.mes, T.mes + 0.4, T.precio - 0.4, T.precio], [0, 1, 1, 0], clamp);
  const meses = Math.min(2, Math.floor(interpolate(t, [T.mes, T.anota], [0, 2.2], clamp)));
  const actual = interpolate(t, [T.hasta - 0.3, T.hasta + 1.1], [1234, 1252], suave);
  const resta = interpolate(t, [T.dieciocho - 0.3, T.dieciocho + 0.3], [0, 1], clamp);
  const tramos = interpolate(t, [T.precio - 0.2, T.precio + 0.3], [0, 1], clamp);
  const llena = interpolate(t, [T.precio + 0.4, T.tramos + 1.6], [0, CONSUMO], suave);
  const factura = interpolate(t, [T.fijo - 0.4, T.fijo], [0, 1], clamp);
  const lineas = [
    { texto: `Consumo ${CONSUMO} m³`, valor: 26, t: T.fijo - 0.3 },
    { texto: "Cargo fijo", valor: 8, t: T.fijo + 0.3 },
    { texto: "Alcantarillado", valor: 10, t: T.alcantarillado },
    { texto: "Impuestos", valor: 7, t: T.impuestos },
  ];
  const total = lineas.reduce((a, l) => a + (t >= l.t ? l.valor : 0), 0);
  const ox = 140;
  const oy = 1420;
  const escX = 26;
  const escY = 130;

  return (
    <svg width={W} height={H} style={{ position: "absolute" }}>
      {lectura > 0 ? (
        <g opacity={lectura}>
          {/* Calendario */}
          <rect x={60} y={150} width={960} height={230} rx={24} fill={C.card} stroke={C.cardBorder} strokeWidth={2} />
          {["mes 1", "mes 2"].map((m, k) => (
            <g key={k} opacity={k < meses ? 1 : 0.25}>
              <rect x={110 + k * 300} y={200} width={250} height={140} rx={14} fill="#2A2350" stroke={k < meses ? C.yellow : C.grey} strokeWidth={3} />
              <text x={235 + k * 300} y={290} textAnchor="middle" fill={k < meses ? C.yellow : C.grey} fontFamily={mono} fontSize={44} fontWeight={700}>{m}</text>
            </g>
          ))}
          <text x={980} y={290} textAnchor="end" fill={C.grey} fontFamily={mono} fontSize={30}>se lee el medidor</text>
          {/* Lecturas */}
          <rect x={60} y={460} width={960} height={900} rx={24} fill={C.card} stroke={C.cardBorder} strokeWidth={2} />
          <text x={110} y={540} fill={C.grey} fontFamily={mono} fontSize={30} opacity={interpolate(t, [T.resta - 0.2, T.resta + 0.3], [0.3, 1], clamp)}>lectura anterior</text>
          <Rodillos x={150} y={580} valor={1234} decimales={0} alto={130} />
          <text x={110} y={840} fill={C.grey} fontFamily={mono} fontSize={30} opacity={interpolate(t, [T.hasta - 0.3, T.hasta], [0.3, 1], clamp)}>lectura actual</text>
          <Rodillos x={150} y={880} valor={actual} decimales={0} alto={130} />
          <g opacity={resta}>
            <line x1={150} y1={1080} x2={930} y2={1080} stroke={C.white} strokeWidth={4} />
            <text x={150} y={1220} fill={C.yellow} fontFamily={mono} fontSize={110} fontWeight={700}>
              18 <tspan fontSize={60}>m³</tspan>
            </text>
            <text x={930} y={1220} textAnchor="end" fill={C.grey} fontFamily={mono} fontSize={40} fontWeight={700}>gastaste</text>
          </g>
        </g>
      ) : null}
      {tramos > 0 && factura < 1 ? (
        <g opacity={tramos * (1 - factura)}>
          <rect x={60} y={500} width={960} height={1060} rx={24} fill={C.card} stroke={C.cardBorder} strokeWidth={2} />
          <text x={110} y={570} fill={C.grey} fontFamily={mono} fontSize={30}>precio por m³ (ejemplo)</text>
          <line x1={ox} y1={oy} x2={ox + 30 * escX + 20} y2={oy} stroke={C.grey} strokeWidth={3} opacity={0.6} />
          {TRAMOS.map((tr, k) => {
            const desde = k === 0 ? 0 : TRAMOS[k - 1].hasta;
            const visibleTxt = interpolate(t, [k === 0 ? T.baratos : T.caro - 0.4 + k * 0.4, (k === 0 ? T.baratos : T.caro - 0.4 + k * 0.4) + 0.3], [0.3, 1], clamp);
            const relleno = Math.max(0, Math.min(tr.hasta, llena) - desde);
            return (
              <g key={k}>
                <rect x={ox + desde * escX} y={oy - tr.precio * escY} width={(tr.hasta - desde) * escX - 6} height={tr.precio * escY} fill={tr.color} opacity={0.15} />
                <rect x={ox + desde * escX} y={oy - tr.precio * escY} width={relleno * escX} height={tr.precio * escY} fill={tr.color} opacity={0.85} />
                <text x={ox + ((desde + tr.hasta) / 2) * escX} y={oy - tr.precio * escY - 24} textAnchor="middle" fill={tr.color} fontFamily={mono} fontSize={38} fontWeight={700} opacity={visibleTxt}>
                  ${tr.precio}/m³
                </text>
                <text x={ox + tr.hasta * escX} y={oy + 50} textAnchor="middle" fill={C.grey} fontFamily={mono} fontSize={28}>{tr.hasta}</text>
              </g>
            );
          })}
          <line x1={ox + llena * escX} y1={oy + 10} x2={ox + llena * escX} y2={oy - 420} stroke={C.white} strokeWidth={4} strokeDasharray="10 8" />
          <text x={ox + llena * escX} y={oy - 440} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={36} fontWeight={700}>{llena.toFixed(0)} m³</text>
        </g>
      ) : null}
      {factura > 0 && t < T.truco + 0.2 ? (
        <g opacity={factura * interpolate(t, [T.truco - 0.3, T.truco], [1, 0], clamp)}>
          <rect x={140} y={420} width={800} height={1000} rx={16} fill="#E8E6F0" />
          <text x={190} y={510} fill="#0B091D" fontFamily={mono} fontSize={44} fontWeight={700}>FACTURA DE AGUA</text>
          <line x1={190} y1={540} x2={890} y2={540} stroke="#0B091D" strokeWidth={3} />
          {lineas.map((l, k) => {
            const on = interpolate(t, [l.t, l.t + 0.3], [0, 1], clamp);
            return (
              <g key={k} opacity={on}>
                <text x={190} y={640 + k * 110} fill="#0B091D" fontFamily={mono} fontSize={40}>{l.texto}</text>
                <text x={890} y={640 + k * 110} textAnchor="end" fill="#0B091D" fontFamily={mono} fontSize={40} fontWeight={700}>${l.valor}</text>
              </g>
            );
          })}
          <line x1={190} y1={1120} x2={890} y2={1120} stroke="#0B091D" strokeWidth={3} />
          <text x={190} y={1220} fill="#0B091D" fontFamily={mono} fontSize={56} fontWeight={700}>TOTAL</text>
          <text x={890} y={1220} textAnchor="end" fill="#B0302C" fontFamily={mono} fontSize={64} fontWeight={700}>${total}</text>
          <text x={190} y={1340} fill="#5A5675" fontFamily={mono} fontSize={26}>importes de ejemplo</text>
        </g>
      ) : null}
    </svg>
  );
};

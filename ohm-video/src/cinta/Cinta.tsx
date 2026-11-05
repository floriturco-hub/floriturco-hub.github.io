import { interpolate } from "remotion";
import { camaraEn, ClaveCamara, Panel, Pildora, Tag, ventanaEn } from "../components/Mundo";
import { C, clamp, mono, useT } from "../theme";
import { T } from "./tiempos";

// Mundo: a la izquierda, una caja de cartón donde se pega la cinta al instante; en el centro, el corte de la cinta sobre
// una superficie rugosa (el pegamento fluye y aparecen las fuerzas de Van der Waals); a la derecha, tirar rápido o despacio
// y las capas de la cinta americana.
const CINTA = "#D8C8A0";
const PEGA = "#F8D860";
const CARTON = "#B88A50";

const camaraKeys = (): ClaveCamara[] => [
  [0, 550, 1000, 1.12],
  [T.pegamento - 0.3, 550, 1000, 1.16],
  [T.pegamento + 0.5, 1850, 1030, 1.0],
  [T.rapido - 0.3, 1850, 1030, 1.02],
  [T.rapido + 0.5, 3100, 1030, 1.0],
  [T.contacto - 0.3, 3100, 1030, 1.02],
  [T.contacto + 0.5, 550, 1000, 1.12],
  [T.fin + 2, 550, 1000, 1.18],
];

// Superficie rugosa (dientes de sierra irregulares)
const PICOS = [0, 34, 12, 46, 20, 40, 8, 30, 50, 16, 38, 6, 44, 24, 36, 10, 48, 22, 32, 14];

export const CintaMundo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const { cx, cy, zoom } = camaraEn(camaraKeys(), t);
  const sx = (x: number) => 540 + (x - cx) * zoom;
  const sy = (y: number) => 960 + (y - cy) * zoom;
  const ventana = (a: number, b: number, entra = 0.4, sale = 0.4) => ventanaEn(t, a, b, entra, sale);

  // Caja: la cinta se estira sobre la tapa al instante
  const tira = t < T.pegamento ? interpolate(t, [0.1, 0.8], [0, 1], clamp) : interpolate(t, [T.contacto, T.contacto + 0.8], [0, 1], clamp);
  const golpe = t < T.pegamento ? interpolate(t, [0.8, 0.9, 1.4], [0, 1, 0], clamp) : interpolate(t, [T.contacto + 0.8, T.contacto + 0.9, T.contacto + 1.4], [0, 1, 0], clamp);

  // Corte: el pegamento fluye en la rugosidad
  const corte = ventana(T.pegamento - 0.3, T.rapido + 0.3, 0.6, 0.6);
  const aprieta = interpolate(t, [T.aprietas, T.rugosidades + 1.0], [0, 1], clamp);
  const lupa = ventana(T.lisa - 0.2, T.fuerzas);
  const fuerzas = interpolate(t, [T.fuerzas, T.vdw + 0.5], [0, 1], clamp);
  const miles = ventana(T.millones, T.rapido + 0.3);
  const fluye = ventana(T.raro, T.aprietas);
  const ySup = 1200;
  const xs = PICOS.map((_, i) => 1380 + i * 49);
  const superficie = `M 1360 1440 L 1360 ${ySup} ${xs.map((x, i) => `L ${x} ${ySup - PICOS[i] * 2}`).join(" ")} L 2340 ${ySup} L 2340 1440 Z`;
  // Borde inferior del pegamento: de plano (sin apretar) a copiar la rugosidad (apretado)
  const bordePega = xs
    .map((x, i) => `L ${x} ${ySup - 110 + (110 - PICOS[i] * 2) * aprieta}`)
    .reverse()
    .join(" ");

  // Tirar rápido o despacio y cinta americana
  const tirar = ventana(T.rapido - 0.3, T.americana, 0.6, 0.4);
  const rapido = interpolate(t, [T.rapido, T.solido + 1.0], [0, 1], clamp);
  const despacio = interpolate(t, [T.despacio, T.suelta + 1.0], [0, 1], clamp);
  const americana = ventana(T.americana - 0.2, T.contacto + 0.3, 0.5, 0.6);

  const camaraT = `translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`;

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <g transform={camaraT}>
        <rect x={-300} y={-400} width={1500} height={2400} fill="#221E30" />
        {/* Caja de cartón */}
        <path d="M 160 820 L 940 820 L 940 1420 L 160 1420 Z" fill={CARTON} />
        <path d="M 160 820 L 300 700 L 1080 700 L 940 820 Z" fill="#C89A60" />
        <path d="M 940 820 L 1080 700 L 1080 1300 L 940 1420 Z" fill="#9A6A38" />
        <line x1={550} y1={820} x2={690} y2={700} stroke="#8A5A28" strokeWidth={4} />
        {/* Tira de cinta */}
        <path d={`M 400 ${820 + 600 * 0} L ${400 + 300 * tira} 820 L ${400 + 300 * tira} 900 L 400 900 Z`} fill={CINTA} opacity={0.85} />
        <rect x={400} y={820} width={300 * tira} height={80} fill={CINTA} opacity={0.85} />
        <rect x={400} y={820} width={300 * tira} height={80} fill="#FFFFFF" opacity={0.15} />
        {/* Rollo */}
        <g transform={`translate(${400 + 300 * tira + 90} 760)`}>
          <circle r={90} fill={CINTA} />
          <circle r={50} fill="#5A4A3A" />
        </g>
        {golpe > 0 ? <circle cx={550} cy={860} r={60 + 120 * golpe} fill="none" stroke={C.yellow} strokeWidth={6} opacity={golpe} /> : null}
        <Pildora x={550} y={1150} texto="0 s · sin secarse" color={C.yellow} o={ventana(-1, T.pegamento)} tam={48} />

        {/* Corte de la cinta sobre una superficie rugosa */}
        <g opacity={corte}>
          <Panel x0={1340} y0={600} x1={2360} y1={1460} />
          <path d={superficie} fill="#8A8A9A" />
          {/* Pegamento viscoelástico */}
          <path d={`M 1380 940 L 2310 940 ${bordePega} Z`} fill={PEGA} opacity={0.85} />
          {fluye > 0 ? [0, 1, 2].map((k) => <ellipse key={k} cx={1600 + k * 300} cy={1000 + Math.sin(t * 2 + k) * 10} rx={60} ry={14} fill="#FFF0A0" opacity={0.5 * fluye} />) : null}
          {/* Respaldo de la cinta */}
          <rect x={1380} y={880} width={930} height={60} rx={6} fill={CINTA} />
          {/* Rodillo que aprieta */}
          {aprieta > 0 && aprieta < 1 ? <circle cx={1380 + 930 * aprieta} cy={790} r={90} fill="#5A5A66" /> : null}
          {/* Fuerzas de Van der Waals */}
          {fuerzas > 0
            ? xs.map((x, i) => (
                <g key={i} opacity={fuerzas}>
                  <circle cx={x} cy={ySup - PICOS[i] * 2 - 12} r={6} fill={C.cyan} />
                  <circle cx={x} cy={ySup - PICOS[i] * 2 + 10} r={6} fill="#C8C8D8" />
                  <line x1={x} y1={ySup - PICOS[i] * 2 - 6} x2={x} y2={ySup - PICOS[i] * 2 + 4} stroke={C.cyan} strokeWidth={3} opacity={0.5 + 0.5 * Math.sin(t * 8 + i)} />
                </g>
              ))
            : null}
          {/* Lupa: a simple vista parece lisa */}
          {lupa > 0 ? (
            <g opacity={lupa}>
              <rect x={1380} y={680} width={930} height={60} rx={10} fill="#8A8A9A" />
              <text x={1850} y={722} textAnchor="middle" fill="#1A1A20" fontFamily={mono} fontSize={30} fontWeight={700}>
                a simple vista: lisa
              </text>
            </g>
          ) : null}
        </g>
        <Pildora x={1850} y={1530} texto="× miles de millones" color={C.cyan} o={miles} tam={44} />

        {/* Tirar rápido o despacio */}
        <g opacity={tirar}>
          <Panel x0={2600} y0={600} x1={3600} y1={1460} />
          {[0, 1].map((k) => {
            const x0 = 2660 + k * 480;
            const p = k === 0 ? rapido : despacio;
            const color = k === 0 ? C.red : "#48C878";
            const estira = k === 0 ? 20 * p : 160 * p;
            const suelta = k === 1 && p > 0.85;
            return (
              <g key={k}>
                <text x={x0 + 200} y={690} textAnchor="middle" fill={color} fontFamily={mono} fontSize={36} fontWeight={700}>
                  {k === 0 ? "rápido: resiste" : "despacio: se suelta"}
                </text>
                <rect x={x0} y={1200} width={400} height={60} fill="#8A8A9A" />
                <rect x={x0} y={1170} width={260} height={30} fill={CINTA} />
                <path d={`M ${x0 + 260} 1185 L ${x0 + 380} ${1185 - 250 * p}`} stroke={CINTA} strokeWidth={30} />
                {!suelta
                  ? [0, 1, 2, 3].map((f) => <line key={f} x1={x0 + 262 + f * 8} y1={1200} x2={x0 + 268 + f * 10} y2={1200 - estira} stroke={PEGA} strokeWidth={5} />)
                  : null}
                <path d={`M ${x0 + 380} ${1135 - 250 * p} l 0 -70 m -18 22 l 18 -22 l 18 22`} fill="none" stroke={color} strokeWidth={8} strokeLinecap="round" opacity={p > 0 ? 1 : 0} />
              </g>
            );
          })}
        </g>
        {/* Cinta americana en capas */}
        <g opacity={americana}>
          <Panel x0={2600} y0={600} x1={3600} y1={1460} />
          <rect x={2700} y={820} width={800} height={70} fill="#A8A8B8" />
          <text x={3100} y={868} textAnchor="middle" fill="#1A1A20" fontFamily={mono} fontSize={32} fontWeight={700}>
            plástico
          </text>
          <rect x={2700} y={890} width={800} height={70} fill="#E8E0D0" />
          {new Array(20).fill(0).map((_, k) => (
            <line key={k} x1={2700 + k * 40} y1={890} x2={2700 + k * 40} y2={960} stroke="#B8A888" strokeWidth={4} />
          ))}
          <text x={3100} y={938} textAnchor="middle" fill="#5A4A3A" fontFamily={mono} fontSize={32} fontWeight={700}>
            malla de tela
          </text>
          <rect x={2700} y={960} width={800} height={130} fill={PEGA} opacity={0.85} />
          <text x={3100} y={1040} textAnchor="middle" fill="#5A4A1A" fontFamily={mono} fontSize={32} fontWeight={700}>
            caucho grueso
          </text>
        </g>
      </g>

      <Tag x={sx(1850)} y={sy(1000)} dx={-160} dy={-240} texto="pegamento" color={PEGA} o={ventana(T.raro, T.aprietas)} />
      <Tag x={sx(1450)} y={sy(ySup - 20)} dx={60} dy={180} texto="superficie rugosa" color="#C8C8D8" o={ventana(T.rugosidades, T.lisa)} />
      <Tag x={sx(1870)} y={sy(ySup - 60)} dx={-40} dy={280} texto="Van der Waals" color={C.cyan} o={ventana(T.vdw, T.millones)} />
    </svg>
  );
};

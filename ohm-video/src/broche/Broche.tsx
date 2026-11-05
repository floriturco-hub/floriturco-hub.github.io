import { interpolate } from "remotion";
import { camaraEn, ClaveCamara, Panel, Pildora, Tag, ventanaEn } from "../components/Mundo";
import { C, clamp, mono, useT } from "../theme";
import { T } from "./tiempos";

// Mundo: a la izquierda, la salida de la tienda con las columnas antirrobo y una camiseta con broche que pasa;
// en el centro, el broche por dentro (bobina y condensador, sin pila); a la derecha, el cierre de la aguja
// (bolitas, resorte e imán) y las ampollas de tinta.
const COBRE = "#E8A040";
const ONDA = "#8AD8F8";
const ALARMA = "#E8414F";
const SUELO = 1450;

const camaraKeys = (): ClaveCamara[] => [
  [0, 550, 1050, 1.08],
  [T.dentro - 0.3, 550, 1050, 1.12],
  [T.dentro + 0.5, 1850, 1030, 1.0],
  [T.columnas - 0.3, 1850, 1030, 1.02],
  [T.columnas + 0.5, 550, 1050, 1.08],
  [T.quitar - 0.3, 550, 1050, 1.12],
  [T.quitar + 0.5, 3100, 1030, 1.0],
  [T.fin + 2, 3100, 1030, 1.04],
];

// Camiseta en percha con el broche
const Camiseta: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly brilla: number; readonly mancha?: number }> = ({ x, y, s, brilla, mancha = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M 0 -200 q 0 -30 22 -30 q 22 0 22 22" fill="none" stroke="#C8C8D0" strokeWidth={8} />
    <path d="M -120 -150 L 0 -175 L 120 -150" fill="none" stroke="#C8C8D0" strokeWidth={10} />
    <path d="M -60 -170 L -170 -120 L -210 -40 L -140 -10 L -120 -60 L -120 180 L 120 180 L 120 -60 L 140 -10 L 210 -40 L 170 -120 L 60 -170 Q 0 -130 -60 -170 Z" fill="#3A7AC8" />
    <path d="M -60 -170 Q 0 -130 60 -170" fill="none" stroke="#2A5A98" strokeWidth={8} />
    {mancha > 0 ? (
      <g opacity={mancha}>
        <path d="M 30 40 C 90 0, 140 60, 110 120 C 80 170, 0 160, -20 110 C -40 60, -10 70, 30 40 Z" fill="#2A1A8A" transform={`scale(${0.3 + 0.7 * mancha})`} />
        <circle cx={-40} cy={20} r={14 * mancha} fill="#2A1A8A" />
      </g>
    ) : null}
    <circle cx={80} cy={110} r={30} fill="#8A8A9A" stroke="#5A5A66" strokeWidth={4} />
    <circle cx={80} cy={110} r={44} fill={ONDA} opacity={0.5 * brilla} />
  </g>
);

export const BrocheMundo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const { cx, cy, zoom } = camaraEn(camaraKeys(), t);
  const sx = (x: number) => 540 + (x - cx) * zoom;
  const sy = (y: number) => 960 + (y - cy) * zoom;
  const ventana = (a: number, b: number, entra = 0.4, sale = 0.4) => ventanaEn(t, a, b, entra, sale);

  // La camiseta pasa entre las columnas (gancho y luego con la explicación)
  const paso = t < T.dentro ? interpolate(t, [0, 1.6], [0.2, 1], clamp) : interpolate(t, [T.pasas - 0.6, T.alarma + 0.4], [0, 1], clamp);
  const camX = 550;
  const camY = 900 + 260 * paso;
  const camS = 0.55 + 0.75 * paso;
  const ondas = t < T.dentro || t > T.columnas - 0.2 ? 1 : 0;
  const resuena = Math.max(t < T.dentro ? interpolate(t, [0.5, 0.8], [0, 1], clamp) : 0, interpolate(t, [T.vibrar - 0.2, T.vibrar + 0.4], [0, 1], clamp) * (t < T.quitar ? 1 : 0));
  const eco = Math.max(t < T.dentro ? interpolate(t, [0.7, 1.0], [0, 1], clamp) : 0, ventana(T.eco, T.quitar));
  const alarma = Math.max(t < T.dentro ? interpolate(t, [0.9, 1.1], [0, 1], clamp) : 0, ventana(T.alarma, T.quitar));
  const parpadeo = alarma * (Math.sin(t * 22) > 0 ? 1 : 0.3);
  const copa = ventana(T.copa, T.eco + 0.3);

  // Broche por dentro
  const dentro = ventana(T.dentro - 0.3, T.columnas + 0.3, 0.6, 0.6);
  const bobina = interpolate(t, [T.bobina - 0.2, T.bobina + 0.6], [0, 1], clamp);
  const condensador = interpolate(t, [T.condensador - 0.2, T.condensador + 0.4], [0, 1], clamp);
  const sinPila = interpolate(t, [T.noPila - 0.1, T.noPila + 0.3], [0, 1], clamp);

  // Cierre de la aguja y tinta
  const cierre = ventana(T.quitar - 0.3, T.fin + 2, 0.6, 0.4);
  const iman = interpolate(t, [T.iman - 0.2, T.iman + 0.5], [0, 1], clamp) * (1 - interpolate(t, [T.tinta - 0.4, T.tinta], [0, 1], clamp));
  const suelta = interpolate(t, [T.iman + 0.5, T.iman + 1.2], [0, 1], clamp) * (1 - interpolate(t, [T.tinta - 0.4, T.tinta], [0, 1], clamp));
  const tinta = interpolate(t, [T.tinta - 0.2, T.tinta + 0.4], [0, 1], clamp);
  const fuerza = interpolate(t, [T.fuerzas, T.fuerzas + 0.8], [0, 1], clamp);
  const rompe = interpolate(t, [T.fuerzas + 0.8, T.fuerzas + 1.1], [0, 1], clamp);
  const mancha = interpolate(t, [T.manchan - 0.4, T.manchan + 0.6], [0, 1], clamp);

  const camaraT = `translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`;

  // Columna antirrobo
  const columna = (x: number, lado: number) => (
    <g key={x}>
      <rect x={x - 40} y={640} width={80} height={SUELO - 640} rx={30} fill="#E8E6F0" opacity={0.9} />
      <rect x={x - 26} y={680} width={52} height={SUELO - 720} rx={20} fill="none" stroke="#B8B8C8" strokeWidth={4} />
      <rect x={x - 40} y={620} width={80} height={30} rx={12} fill={parpadeo > 0.5 ? ALARMA : "#8A8A9A"} />
      {parpadeo > 0.5 ? <circle cx={x} cy={635} r={70} fill={ALARMA} opacity={0.35} /> : null}
      {ondas
        ? [0, 1, 2].map((k) => {
            const p = (t * 0.8 + k / 3) % 1;
            return <path key={k} d={`M ${x + lado * (50 + p * 220)} ${900 - p * 120} Q ${x + lado * (80 + p * 260)} 1060 ${x + lado * (50 + p * 220)} ${1220 + p * 120}`} fill="none" stroke={ONDA} strokeWidth={5} opacity={(1 - p) * 0.8} />;
          })
        : null}
    </g>
  );

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <g transform={camaraT}>
        {/* Salida de la tienda */}
        <rect x={-300} y={-400} width={1500} height={2400} fill="#221E30" />
        <rect x={-300} y={SUELO} width={1500} height={600} fill="#3A3448" />
        <rect x={250} y={500} width={600} height={SUELO - 500} fill="#14121E" />
        <text x={550} y={470} textAnchor="middle" fill="#48C878" fontFamily={mono} fontSize={44} fontWeight={700}>
          SALIDA
        </text>
        {columna(200, 1)}
        {columna(900, -1)}
        <Camiseta x={camX} y={camY} s={camS} brilla={resuena * (0.6 + 0.4 * Math.sin(t * 30))} />
        {/* Eco del broche hacia las columnas */}
        {eco > 0
          ? [0, 1].map((k) => {
              const p = (t * 1.2 + k / 2) % 1;
              const bx = camX + 80 * camS;
              const by = camY + 110 * camS;
              return <circle key={k} cx={bx} cy={by} r={40 + p * 300} fill="none" stroke={C.yellow} strokeWidth={6} opacity={eco * (1 - p)} />;
            })
          : null}
        {alarma > 0 ? <rect x={-300} y={-400} width={1500} height={2400} fill={ALARMA} opacity={0.15 * parpadeo} /> : null}
        <Pildora x={550} y={600} texto="¡BIP BIP!" color={ALARMA} o={alarma} tam={60} />
        {/* Copa que suena */}
        {copa > 0 ? (
          <g opacity={copa} transform={`translate(${880} ${780}) rotate(${Math.sin(t * 40) * 2})`}>
            <path d="M -50 -80 Q -50 20 0 30 Q 50 20 50 -80 Z" fill="#E8F4FF" fillOpacity={0.3} stroke="#E8F4FF" strokeWidth={4} />
            <line x1={0} y1={30} x2={0} y2={100} stroke="#E8F4FF" strokeWidth={6} />
            <line x1={-36} y1={100} x2={36} y2={100} stroke="#E8F4FF" strokeWidth={6} />
            {[1, 2].map((k) => (
              <path key={k} d={`M ${60 + k * 20} -60 q 14 30 0 60`} fill="none" stroke={C.yellow} strokeWidth={4} />
            ))}
          </g>
        ) : null}

        {/* Broche por dentro */}
        <g opacity={dentro}>
          <Panel x0={1340} y0={600} x1={2360} y1={1460} />
          <circle cx={1850} cy={1030} r={320} fill="#8A8A9A" opacity={0.35} stroke="#C8C8D0" strokeWidth={6} />
          {/* Bobina en espiral */}
          <path
            d={new Array(6)
              .fill(0)
              .map((_, k) => {
                const r = 240 - k * 26;
                return `${k === 0 ? "M" : "L"} ${1850 - r} ${1030 - r * 0.7} L ${1850 + r} ${1030 - r * 0.7} L ${1850 + r} ${1030 + r * 0.7} L ${1850 - r + 26} ${1030 + r * 0.7}`;
              })
              .join(" ")}
            fill="none"
            stroke={COBRE}
            strokeWidth={10}
            strokeDasharray={`${4000 * bobina} 5000`}
          />
          {/* Condensador */}
          <g opacity={condensador}>
            <rect x={1800} y={960} width={20} height={140} fill="#C8C8D0" />
            <rect x={1880} y={960} width={20} height={140} fill="#C8C8D0" />
            <line x1={1610} y1={1030} x2={1800} y2={1030} stroke={COBRE} strokeWidth={6} />
            <line x1={1900} y1={1030} x2={2040} y2={1030} stroke={COBRE} strokeWidth={6} />
          </g>
          {/* Sin pila */}
          <g opacity={sinPila} transform="translate(2200 700)">
            <rect x={-50} y={-30} width={100} height={60} rx={10} fill="none" stroke={C.white} strokeWidth={6} />
            <rect x={50} y={-12} width={12} height={24} rx={3} fill={C.white} />
            <path d="M -70 -50 L 80 50 M 80 -50 L -70 50" stroke={ALARMA} strokeWidth={10} strokeLinecap="round" />
          </g>
        </g>

        {/* Cierre de la aguja e imán */}
        <g opacity={cierre}>
          <Panel x0={2600} y0={600} x1={3600} y1={1460} />
          {/* Carcasa */}
          <path d="M 2800 900 L 3400 900 L 3400 1150 Q 3100 1250 2800 1150 Z" fill="#6A6A76" />
          <path d="M 3020 920 L 3180 920 L 3140 1080 L 3060 1080 Z" fill="#2A2A34" />
          {/* Aguja */}
          <rect x={3088} y={640 - 260 * suelta} width={24} height={460} rx={8} fill="#D8D8E0" />
          <circle cx={3100} cy={640 - 260 * suelta} r={40} fill="#A8A8B8" />
          {/* Bolitas apretando la aguja */}
          {[-1, 1].map((l) => (
            <circle key={l} cx={3100 + l * (28 + 22 * suelta)} cy={1030 + 30 * suelta} r={16} fill="#E8E6F0" stroke="#8A8A9A" strokeWidth={3} />
          ))}
          {/* Resorte */}
          <path d={`M 3060 ${930} ${new Array(8).fill(0).map((_, k) => `L ${k % 2 === 0 ? 3140 : 3060} ${940 + k * (10 + 6 * suelta)}`).join(" ")}`} fill="none" stroke={C.yellow} strokeWidth={5} />
          {/* Imán de la caja */}
          {iman > 0 ? (
            <g opacity={iman} transform={`translate(3100 ${1360 - 80 * iman})`}>
              <rect x={-120} y={-40} width={120} height={80} fill={ALARMA} />
              <rect x={0} y={-40} width={120} height={80} fill="#4A6AF8" />
              <text x={-60} y={14} textAnchor="middle" fill="#FFFFFF" fontFamily={mono} fontSize={40} fontWeight={700}>
                N
              </text>
              <text x={60} y={14} textAnchor="middle" fill="#FFFFFF" fontFamily={mono} fontSize={40} fontWeight={700}>
                S
              </text>
            </g>
          ) : null}
          {/* Ampollas de tinta */}
          {tinta > 0
            ? [2880, 3320].map((x, k) => (
                <g key={x} opacity={tinta}>
                  <rect x={x - 26} y={960} width={52} height={130} rx={24} fill="#E8F4FF" fillOpacity={0.3} stroke="#E8F4FF" strokeWidth={4} />
                  <rect x={x - 20} y={990} width={40} height={94} rx={18} fill={k === 0 ? "#2A1A8A" : "#8A1A4A"} opacity={1 - rompe * 0.7} />
                  {rompe > 0 ? <path d={`M ${x - 26} 1000 l 20 20 l -10 20 l 22 16`} fill="none" stroke="#FFFFFF" strokeWidth={4} /> : null}
                </g>
              ))
            : null}
          {/* Alicate que fuerza */}
          {fuerza > 0 && mancha < 1 ? (
            <g opacity={fuerza * (1 - mancha)} transform={`translate(3100 760)`}>
              <path d={`M -200 -40 L ${-30 + 10 * fuerza} 0 M 200 -40 L ${30 - 10 * fuerza} 0`} stroke="#5A5A66" strokeWidth={30} strokeLinecap="round" />
            </g>
          ) : null}
          {/* Camiseta manchada */}
          {mancha > 0 ? <Camiseta x={3100} y={1200} s={0.9} brilla={0} mancha={mancha} /> : null}
        </g>
        <Pildora x={3100} y={1520} texto="¡arruinada!" color={ALARMA} o={ventana(T.robar, T.fin + 2)} tam={48} />
      </g>

      <Tag x={sx(1850 + 214)} y={sy(1030)} dx={-60} dy={-330} texto="bobina" color={COBRE} o={ventana(T.bobina, T.condensador)} />
      <Tag x={sx(1890)} y={sy(1030)} dx={60} dy={300} texto="condensador" color="#C8C8D0" o={ventana(T.condensador, T.columnas)} />
      <Tag x={sx(3100)} y={sy(1030)} dx={-220} dy={-260} texto="bolitas" color="#E8E6F0" o={ventana(T.bolitas, T.iman)} />
      <Tag x={sx(3100)} y={sy(1300)} dx={220} dy={150} texto="imán" color={ALARMA} o={ventana(T.iman + 0.3, T.tinta)} />
      <Tag x={sx(2880)} y={sy(1030)} dx={-80} dy={-300} texto="tinta" color="#8A7AF8" o={ventana(T.tinta, T.fuerzas)} />
    </svg>
  );
};

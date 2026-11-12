import { interpolate } from "remotion";
import { camaraEn, ClaveCamara, Panel, Pildora, Tag, ventanaEn } from "../components/Mundo";
import { C, clamp, mono, useT } from "../theme";
import { T } from "./tiempos";

// Mundo: a la izquierda, la puerta 305 con su cerradura de tarjeta; en el centro, la tarjeta gigante que graba recepción
// (habitación, salida y número de orden); a la derecha, el interior de la cerradura (pilas, reloj, memoria y lector).
// Retención (estilo §10): cambio de plano cada 2-3 s y final que empalma con el gancho (la tarjeta vieja rechazada).
const VIEJA = "#8A5A9A";
const NUEVA = "#2A7AB8";
const VERDE = "#48C878";
const LATON = "#D8B860";

const camaraKeys = (): ClaveCamara[] => [
  [0, 550, 1000, 1.15],
  [T.final - 0.4, 550, 1000, 1.2],
  [T.final - 0.1, 720, 1060, 1.8],
  [T.tarjeta - 0.1, 720, 1060, 1.85],
  [T.tarjeta + 0.2, 1850, 950, 1.1],
  [T.recepcion - 0.1, 1850, 950, 1.14],
  [T.recepcion + 0.2, 1850, 1030, 0.98],
  [T.habitacion - 0.1, 1850, 1030, 1.0],
  [T.habitacion + 0.2, 1850, 900, 1.35],
  [T.fecha - 0.1, 1850, 900, 1.38],
  [T.fecha + 0.2, 1850, 960, 1.4],
  [T.orden - 0.1, 1850, 960, 1.42],
  [T.orden + 0.2, 1850, 1020, 1.55],
  [T.pilas - 0.1, 1850, 1020, 1.58],
  [T.pilas + 0.2, 3100, 1030, 1.0],
  [T.reloj - 0.1, 3100, 1030, 1.03],
  [T.reloj + 0.2, 3230, 840, 1.55],
  [T.recuerda - 0.1, 3230, 840, 1.58],
  [T.recuerda + 0.2, 3230, 1000, 1.55],
  [T.acercas - 0.1, 3230, 1000, 1.58],
  [T.acercas + 0.2, 3100, 1050, 1.0],
  [T.mayor - 0.1, 3100, 1050, 1.03],
  [T.mayor + 0.2, 3100, 1130, 1.4],
  [T.abre - 0.1, 3100, 1130, 1.43],
  [T.abre + 0.2, 600, 1030, 1.25],
  [T.rechaza - 0.1, 600, 1030, 1.28],
  [T.rechaza + 0.2, 3100, 1080, 1.05],
  [T.viejo - 0.1, 3100, 1080, 1.08],
  [T.viejo + 0.2, 3100, 1150, 1.45],
  [T.nadie - 0.1, 3100, 1150, 1.48],
  [T.nadie + 0.2, 3230, 900, 1.3],
  [T.caduca - 0.1, 3230, 900, 1.33],
  [T.caduca + 0.2, 3100, 1250, 1.45],
  [T.sin - 0.1, 3100, 1250, 1.48],
  [T.sin + 0.2, 550, 900, 1.0],
  [T.mensaje - 0.1, 550, 900, 1.03],
  [T.mensaje + 0.2, 800, 1000, 0.95],
  [T.fin - 0.6, 700, 1000, 1.05],
  [T.fin + 0.3, 550, 1000, 1.15],
];

const Tarjeta: React.FC<{ x: number; y: number; esc: number; color: string; numero: string; o?: number; giro?: number }> = ({ x, y, esc, color, numero, o = 1, giro = 0 }) =>
  o > 0 ? (
    <g opacity={o} transform={`translate(${x} ${y}) rotate(${giro}) scale(${esc})`}>
      <rect x={-160} y={-100} width={320} height={200} rx={18} fill={color} stroke="#FFFFFF" strokeWidth={3} strokeOpacity={0.3} />
      <rect x={-130} y={-60} width={54} height={42} rx={6} fill={LATON} />
      <text x={130} y={-58} textAnchor="end" fill="#FFFFFF" fontFamily={mono} fontSize={26} fontWeight={700} opacity={0.85}>
        HOTEL
      </text>
      <text x={130} y={80} textAnchor="end" fill="#FFFFFF" fontFamily={mono} fontSize={34} fontWeight={700}>
        {`nº ${numero}`}
      </text>
    </g>
  ) : null;

export const CerraduraMundo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const { cx, cy, zoom } = camaraEn(camaraKeys(), t);
  const sx = (x: number) => 540 + (x - cx) * zoom;
  const sy = (y: number) => 960 + (y - cy) * zoom;
  const ventana = (a: number, b: number, entra = 0.3, sale = 0.3) => ventanaEn(t, a, b, entra, sale);
  const destello = (a: number) => interpolate(t, [a, a + 0.06, a + 0.4], [0, 1, 0], clamp);
  const parpadeo = Math.sin(t * 14) > 0 ? 1 : 0.35;

  // Puerta: LED y manija
  const rojo = t < T.final || (t > T.rechaza && t < T.rechaza + 0.1) ? parpadeo : 0;
  const llega = interpolate(t, [T.mensaje + 0.2, T.fin - 0.6], [0, 1], clamp);
  const verdeLed = (t > T.abre && t < T.rechaza) || llega >= 1 ? 1 : 0;
  const manija = (t > T.abre + 0.2 && t < T.rechaza) || t > T.fin - 0.4 ? 28 : 0;

  // Tarjeta gigante en recepción
  const grabando = ventana(T.recepcion, T.pilas, 0.3, 0.3);
  const fila = (a: number) => interpolate(t, [a, a + 0.4], [0, 1], clamp);
  const verMedio = ventana(T.tarjeta - 0.1, T.pilas + 0.2);

  // Interior de la cerradura
  const ver3 = Math.max(ventana(T.pilas - 0.1, T.abre + 0.2), ventana(T.rechaza - 0.1, T.sin + 0.2));
  const minutos = interpolate(t, [T.nadie + 0.3, T.caduca], [0, 1288], clamp);
  const m = 14 * 60 + 32 + minutos;
  const reloj = `${m >= 24 * 60 ? 14 : 13} nov ${String(Math.floor(m / 60) % 24).padStart(2, "0")}:${String(Math.floor(m) % 60).padStart(2, "0")}`;
  const memoria = t > T.abre ? "0042" : "0041";
  const entraNueva = interpolate(t, [T.acercas, T.acercas + 0.7], [0, 1], clamp) * (t < T.abre + 0.3 ? 1 : 0);
  const entraVieja = Math.max(interpolate(t, [T.rechaza, T.rechaza + 0.6], [0, 1], clamp) * (t < T.sin ? 1 : 0), 0);
  const caducada = interpolate(t, [T.caduca, T.caduca + 0.25], [0, 1], clamp);
  const enNadie = t > T.nadie - 0.2 && t < T.sin;

  const camaraT = `translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`;

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <g transform={camaraT}>
        <rect x={-300} y={-400} width={4200} height={2400} fill="#1E1A26" />

        {/* Pasillo y puerta 305 */}
        <rect x={-300} y={1560} width={1500} height={400} fill="#3A2A2A" />
        <rect x={230} y={460} width={640} height={1110} fill="#2A1E18" />
        <rect x={250} y={480} width={600} height={1080} fill="#7A5236" />
        <rect x={300} y={700} width={220} height={360} rx={8} fill="none" stroke="#5A3A22" strokeWidth={8} />
        <rect x={300} y={1120} width={220} height={380} rx={8} fill="none" stroke="#5A3A22" strokeWidth={8} />
        <rect x={470} y={560} width={160} height={80} rx={10} fill={LATON} />
        <text x={550} y={618} textAnchor="middle" fill="#3A2A10" fontFamily={mono} fontSize={52} fontWeight={700}>
          305
        </text>
        {/* Cerradura */}
        <rect x={640} y={880} width={160} height={300} rx={22} fill="#2A2E38" stroke="#5A5F6C" strokeWidth={4} />
        <circle cx={720} cy={960} r={46} fill="#14161C" />
        {[18, 30].map((r) => (
          <path key={r} d={`M ${720 - r * 0.7} ${960 - r * 0.7} A ${r} ${r} 0 0 1 ${720 + r * 0.7} ${960 - r * 0.7}`} fill="none" stroke="#5A5F6C" strokeWidth={5} />
        ))}
        <circle cx={720} cy={1040} r={14} fill={rojo ? C.red : verdeLed ? VERDE : "#3A3F4C"} opacity={rojo ? rojo : 1} />
        <g transform={`rotate(${manija} 720 1120)`}>
          <rect x={700} y={1100} width={180} height={36} rx={18} fill="#C8CED8" />
          <circle cx={720} cy={1118} r={30} fill="#A8AEB8" />
        </g>
        {/* Gancho: tarjeta vieja rechazada */}
        <Tarjeta x={720} y={960} esc={0.75} color={VIEJA} numero="0041" o={interpolate(t, [T.final - 0.5, T.final - 0.2], [1, 0], clamp)} giro={-8} />
        <Pildora x={550} y={1420} texto="✗ rechazada" color={C.red} o={ventana(-1, T.final - 0.2)} tam={50} />
        <Pildora x={720} y={790} texto="¿cómo lo sabe?" color={C.white} o={ventana(T.final, T.tarjeta)} tam={36} />
        <Pildora x={550} y={1420} texto="✓ abre" color={VERDE} o={ventana(T.abre + 0.2, T.rechaza)} tam={50} />
        {/* Sin internet ni cables */}
        <g opacity={ventana(T.sin, T.fin + 2)}>
          <circle cx={400} cy={1380} r={95} fill="#14102A" opacity={0.92} />
          <circle cx={700} cy={1380} r={95} fill="#14102A" opacity={0.92} />
          <g transform="translate(400 1380)">
            {[20, 45, 70].map((r) => (
              <path key={r} d={`M ${-r} ${-r * 0.2} A ${r} ${r} 0 0 1 ${r} ${-r * 0.2}`} fill="none" stroke={C.white} strokeWidth={10} strokeLinecap="round" transform="translate(0 20)" />
            ))}
            <circle cx={0} cy={30} r={9} fill={C.white} />
            <line x1={-70} y1={50} x2={70} y2={-60} stroke={C.red} strokeWidth={12} strokeLinecap="round" />
          </g>
          <g transform="translate(700 1390)">
            <rect x={-30} y={-30} width={60} height={60} rx={10} fill={C.white} />
            <rect x={-18} y={-70} width={10} height={40} fill={C.white} />
            <rect x={8} y={-70} width={10} height={40} fill={C.white} />
            <path d="M 0 30 Q 0 70 60 70" fill="none" stroke={C.white} strokeWidth={10} />
            <line x1={-70} y1={50} x2={70} y2={-60} stroke={C.red} strokeWidth={12} strokeLinecap="round" />
          </g>
        </g>
        {/* El mensaje viaja en la tarjeta: de recepción a la puerta */}
        <Tarjeta x={1500 - 780 * llega} y={960 - 260 * Math.sin(llega * Math.PI)} esc={0.75} color={NUEVA} numero="0042" o={ventana(T.mensaje + 0.1, T.fin + 2, 0.2, 0.2)} giro={-8 * llega} />

        {/* Tarjeta gigante y recepción */}
        <g opacity={verMedio}>
          <Panel x0={1340} y0={600} x1={2360} y1={1460} />
          <g transform="translate(1850 900) scale(2)">
            <rect x={-160} y={-100} width={320} height={200} rx={18} fill={NUEVA} stroke="#FFFFFF" strokeWidth={2} strokeOpacity={0.3} />
            <rect x={-140} y={-80} width={44} height={34} rx={5} fill={LATON} opacity={0.6 + 0.4 * Math.abs(Math.sin(t * 5)) * grabando} />
            <text x={140} y={-56} textAnchor="end" fill="#FFFFFF" fontFamily={mono} fontSize={18} fontWeight={700} opacity={0.85}>
              HOTEL
            </text>
            <text x={-140} y={-8} fill="#FFFFFF" fontFamily={mono} fontSize={22} fontWeight={700} opacity={fila(T.habitacion)}>
              hab. 305
            </text>
            <text x={-140} y={32} fill={C.yellow} fontFamily={mono} fontSize={22} fontWeight={700} opacity={fila(T.fecha)}>
              sale: 14 nov 12:00
            </text>
            <text x={-140} y={72} fill={VERDE} fontFamily={mono} fontSize={22} fontWeight={700} opacity={fila(T.orden)}>
              nº de orden: 0042
            </text>
          </g>
          {/* Codificador de recepción */}
          <g opacity={grabando}>
            {[0, 1, 2].map((k) => {
              const p = (t * 1.5 + k / 3) % 1;
              return <path key={k} d={`M ${1700 - 60 * p} ${1200 - 70 * p} Q 1850 ${1150 - 110 * p} ${2000 + 60 * p} ${1200 - 70 * p}`} fill="none" stroke={C.cyan} strokeWidth={6} opacity={1 - p} />;
            })}
            <rect x={1600} y={1210} width={500} height={90} rx={16} fill="#3A3F4C" />
            <text x={1850} y={1268} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={34} fontWeight={700}>
              recepción
            </text>
          </g>
        </g>
        <Pildora x={1850} y={1385} texto="3 datos" color={C.cyan} o={ventana(T.recepcion + 0.6, T.habitacion)} tam={44} />

        {/* Interior de la cerradura */}
        <g opacity={ver3}>
          <Panel x0={2600} y0={600} x1={3600} y1={1460} />
          {[2700, 2810].map((x) => (
            <g key={x}>
              <rect x={x} y={770} width={80} height={240} rx={14} fill={VERDE} />
              <rect x={x + 25} y={755} width={30} height={18} rx={4} fill="#C8CED8" />
              <text x={x + 40} y={900} textAnchor="middle" fill="#14301E" fontFamily={mono} fontSize={40} fontWeight={700}>
                +
              </text>
            </g>
          ))}
          <rect x={2960} y={770} width={540} height={130} rx={14} fill="#0A1A16" stroke={enNadie ? C.yellow : "#3A5A4A"} strokeWidth={4} />
          <text x={3230} y={855} textAnchor="middle" fill={enNadie && minutos > 1287 ? C.red : "#7AF0C8"} fontFamily={mono} fontSize={50} fontWeight={700}>
            {reloj}
          </text>
          <g opacity={enNadie ? 0.25 : 1}>
            <rect x={2960} y={935} width={540} height={130} rx={14} fill="#14102A" stroke={C.purpleLight} strokeWidth={4} />
            <text x={3230} y={985} textAnchor="middle" fill={C.grey} fontFamily={mono} fontSize={28} fontWeight={700}>
              último nº aceptado
            </text>
            <text x={3230} y={1045} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={50} fontWeight={700}>
              {memoria}
            </text>
          </g>
          {/* Lector */}
          <rect x={2700} y={1190} width={800} height={220} rx={20} fill="#1A1E28" stroke="#3A3F4C" strokeWidth={4} strokeDasharray="16 10" />
          <Tarjeta x={3100 + 700 * (1 - entraNueva)} y={1300} esc={0.95} color={NUEVA} numero="0042" o={entraNueva > 0 ? 1 : 0} />
          <Tarjeta x={3100 + 700 * (1 - entraVieja)} y={1300} esc={0.95} color={VIEJA} numero="0041" o={entraVieja > 0 ? 1 : 0} />
          {caducada > 0 ? (
            <g opacity={caducada} transform={`translate(3100 1300) rotate(-12) scale(${1.4 - 0.4 * caducada})`}>
              <rect x={-190} y={-44} width={380} height={88} rx={10} fill="none" stroke={C.red} strokeWidth={8} />
              <text x={0} y={18} textAnchor="middle" fill={C.red} fontFamily={mono} fontSize={52} fontWeight={700}>
                CADUCADA
              </text>
            </g>
          ) : null}
        </g>
        <Pildora x={3100} y={1135} texto="0042 > 0041 ✓" color={VERDE} o={ventana(T.mayor, T.abre)} tam={40} />
        <Pildora x={3100} y={1135} texto="0041 < 0042 ✗" color={C.red} o={ventana(T.rechaza + 0.5, T.nadie)} tam={40} />
      </g>

      {[T.recepcion, T.abre, T.rechaza + 0.6, T.caduca].map((d) => (
        <rect key={d} x={0} y={0} width={1080} height={1920} fill="#FFFFFF" opacity={0.2 * destello(d)} />
      ))}
      <Tag x={sx(720)} y={sy(900)} dx={-260} dy={-230} texto="huésped anterior" color="#C89AD8" o={ventana(-1, T.final - 0.3)} />
      <Tag x={sx(2740)} y={sy(770)} dx={60} dy={-170} texto="pilas" color={VERDE} o={ventana(T.pilas + 0.2, T.reloj)} />
      <Tag x={sx(3300)} y={sy(770)} dx={-60} dy={-130} texto="reloj propio" color="#7AF0C8" o={ventana(T.reloj + 0.2, T.recuerda)} />
      <Tag x={sx(3400)} y={sy(1065)} dx={-100} dy={190} texto="memoria" color={C.purpleLight} o={ventana(T.recuerda + 0.2, T.acercas)} />
    </svg>
  );
};

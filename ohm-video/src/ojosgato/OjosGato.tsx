import { interpolate } from "remotion";
import { camaraEn, ClaveCamara, Panel, Pildora, Tag, ventanaEn } from "../components/Mundo";
import { C, clamp, useT } from "../theme";
import { T } from "./tiempos";

// Mundo: a la izquierda, una carretera de noche con niebla, un gato en la cuneta y los «ojos de gato» en el asfalto;
// en el centro, el ojo del gato en corte (tapetum lucidum); a la derecha, el reflector en corte (lentes, espejo y goma).
const BRILLO = "#F8F0B0";
const VERDE_OJO = "#9AF878";
const FUGA: [number, number] = [550, 700];

const camaraKeys = (): ClaveCamara[] => [
  [0, 550, 1080, 1.1],
  [T.espejo - 0.3, 550, 1080, 1.14],
  [T.espejo + 0.5, 1850, 1030, 1.0],
  [T.anio - 0.3, 1850, 1030, 1.02],
  [T.anio + 0.5, 550, 1080, 1.1],
  [T.piezas - 0.3, 550, 1080, 1.14],
  [T.piezas + 0.5, 3100, 1030, 1.0],
  [T.sinElec - 0.3, 3100, 1030, 1.02],
  [T.sinElec + 0.5, 550, 1080, 1.1],
  [T.fin + 2, 550, 1080, 1.16],
];

// Gato sentado (silueta) con ojos que reflejan
const Gato: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly ojos: number }> = ({ x, y, s, ojos }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M 40 60 C 120 40, 130 -40, 90 -60" fill="none" stroke="#0A0812" strokeWidth={14} strokeLinecap="round" />
    <ellipse cx={0} cy={20} rx={60} ry={70} fill="#0A0812" />
    <circle cx={0} cy={-70} r={46} fill="#0A0812" />
    <path d="M -40 -96 L -30 -140 L -8 -110 Z M 40 -96 L 30 -140 L 8 -110 Z" fill="#0A0812" />
    {[-18, 18].map((ex) => (
      <g key={ex}>
        <ellipse cx={ex} cy={-74} rx={11} ry={8} fill={VERDE_OJO} opacity={0.15 + 0.85 * ojos} />
        <circle cx={ex} cy={-74} r={26} fill={VERDE_OJO} opacity={0.3 * ojos} />
      </g>
    ))}
  </g>
);

export const OjosGatoMundo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const { cx, cy, zoom } = camaraEn(camaraKeys(), t);
  const sx = (x: number) => 540 + (x - cx) * zoom;
  const sy = (y: number) => 960 + (y - cy) * zoom;
  const ventana = (a: number, b: number, entra = 0.4, sale = 0.4) => ventanaEn(t, a, b, entra, sale);

  // Haz de los faros que avanza hacia el fondo una y otra vez
  const haz = (t * 0.45) % 1;
  const ojosGato = Math.max(0, 1 - Math.abs(haz - 0.25) * 6);
  const studs = new Array(14).fill(0).map((_, i) => {
    const s = 1 - i / 14;
    const y = FUGA[1] + (1800 - FUGA[1]) * s * s;
    const cerca = 1 - i / 14;
    const luz = Math.max(0.15, 1 - Math.abs(cerca - (1 - haz)) * 5);
    return { y, s: 0.15 + 0.85 * s * s, luz };
  });
  const anio = ventana(T.anio, T.idea + 0.3);

  // Ojo del gato en corte
  const ojo = ventana(T.espejo - 0.3, T.anio + 0.3, 0.6, 0.6);
  const rayo = interpolate(t, [T.espejo, T.rebota + 0.6], [0, 1], clamp);
  const tapetum = interpolate(t, [T.tapetum - 0.2, T.tapetum + 0.4], [0, 1], clamp);

  // Reflector en corte
  const reflector = ventana(T.piezas - 0.3, T.sinElec + 0.3, 0.6, 0.6);
  const luzFaro = interpolate(t, [T.faros, T.rebota2 + 0.8], [0, 1], clamp);
  const llanta = interpolate(t, [T.pisa - 0.3, T.goma, T.limpia + 0.8, T.sinElec], [0, 0.5, 0.6, 1], clamp);
  const aplasta = Math.max(0, 1 - Math.abs(llanta - 0.5) * 3);
  const limpia = ventana(T.limpia - 0.2, T.sinElec + 0.3);

  const camaraT = `translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`;

  // Trazo del rayo de ida y vuelta en el ojo (ida hasta el fondo y regreso por el mismo camino)
  const ida = Math.min(1, rayo * 2);
  const vuelta = Math.max(0, rayo * 2 - 1);

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <g transform={camaraT}>
        {/* Carretera de noche en perspectiva */}
        <rect x={-300} y={-400} width={1500} height={2400} fill="#0A0E20" />
        <rect x={-300} y={FUGA[1]} width={1700} height={1300} fill="#0E1A12" />
        <path d={`M -300 1800 L ${FUGA[0] - 20} ${FUGA[1]} L ${FUGA[0] + 20} ${FUGA[1]} L 1400 1800 Z`} fill="#24242C" />
        <path d={`M -300 1800 L ${FUGA[0] - 20} ${FUGA[1]} M 1400 1800 L ${FUGA[0] + 20} ${FUGA[1]}`} stroke="#5A5A66" strokeWidth={6} />
        <rect x={-300} y={FUGA[1] - 6} width={1500} height={6} fill="#1A2A1A" />
        {/* Haz de los faros */}
        <path d={`M 250 1800 L ${FUGA[0] - 40} ${FUGA[1] + 20} L ${FUGA[0] + 40} ${FUGA[1] + 20} L 850 1800 Z`} fill={BRILLO} opacity={0.08} />
        {/* Ojos de gato en el asfalto */}
        {studs.map((d, i) => (
          <g key={i}>
            <rect x={FUGA[0] - 22 * d.s} y={d.y - 8 * d.s} width={44 * d.s} height={16 * d.s} rx={6 * d.s} fill="#3A3A44" />
            <circle cx={FUGA[0] - 10 * d.s} cy={d.y} r={9 * d.s} fill={BRILLO} opacity={d.luz} />
            <circle cx={FUGA[0] + 10 * d.s} cy={d.y} r={9 * d.s} fill={BRILLO} opacity={d.luz} />
            <circle cx={FUGA[0]} cy={d.y} r={55 * d.s} fill={BRILLO} opacity={0.4 * d.luz} />
          </g>
        ))}
        {/* Gato en la cuneta */}
        <Gato x={130} y={1180} s={1.3} ojos={Math.max(ojosGato, ventana(T.vio, T.idea))} />
        {/* Niebla */}
        {[0, 1, 2].map((k) => (
          <rect key={k} x={-300 + Math.sin(t * 0.3 + k) * 80} y={760 + k * 220} width={1700} height={180} fill="#C8D0E0" opacity={0.06 + 0.04 * k} />
        ))}
        <Pildora x={550} y={560} texto="1933" color={C.yellow} o={anio} tam={70} />

        {/* Ojo del gato en corte */}
        <g opacity={ojo}>
          <Panel x0={1340} y0={600} x1={2360} y1={1460} />
          <circle cx={1950} cy={1030} r={300} fill="#1A1430" stroke="#8A84A8" strokeWidth={8} />
          <path d={`M 1950 730 A 300 300 0 0 1 1950 1330`} fill="none" stroke="#E8708A" strokeWidth={22} />
          <path d={`M 1950 760 A 270 270 0 0 1 1950 1300`} fill="none" stroke={VERDE_OJO} strokeWidth={14} opacity={0.3 + 0.7 * tapetum} />
          <ellipse cx={1690} cy={1030} rx={50} ry={110} fill="#C8E8F8" opacity={0.6} />
          {/* Linterna */}
          <rect x={1370} y={1000} width={70} height={60} rx={10} fill="#5A5A66" />
          <path d={`M 1440 1030 L ${1440 + (2210 - 1440) * ida} 1030`} stroke={C.yellow} strokeWidth={10} />
          {vuelta > 0 ? <path d={`M 2210 1045 L ${2210 - (2210 - 1440) * vuelta} 1045`} stroke={VERDE_OJO} strokeWidth={10} /> : null}
          {vuelta > 0.95 ? <circle cx={1440} cy={1045} r={30} fill={VERDE_OJO} opacity={0.5} /> : null}
        </g>

        {/* Reflector en corte */}
        <g opacity={reflector}>
          <Panel x0={2600} y0={600} x1={3600} y1={1460} />
          <rect x={2620} y={1180} width={960} height={260} fill="#24242C" />
          <rect x={2950} y={1110 + 60 * aplasta} width={300} height={120 - 60 * aplasta} rx={20} fill="#1A1A20" />
          <rect x={2930} y={1180} width={340} height={80} fill="#8A8A9A" />
          {/* Dos lentes con espejo detrás */}
          {[2990, 3150].map((x) => (
            <g key={x} transform={`translate(0 ${60 * aplasta})`}>
              <circle cx={x + 30} cy={1150} r={34} fill="#C8E8F8" opacity={0.85} />
              <path d={`M ${x + 52} 1124 A 34 34 0 0 1 ${x + 52} 1176`} fill="none" stroke="#E8E6F0" strokeWidth={8} />
            </g>
          ))}
          {/* Rayo del faro: entra, rebota en el espejo y vuelve a la fuente */}
          <g opacity={luzFaro > 0 && llanta === 0 ? 1 : 0}>
            <rect x={2630} y={880} width={80} height={50} rx={12} fill="#E8E6F0" />
            <path d={`M 2710 905 L ${2710 + (3060 - 2710) * Math.min(1, luzFaro * 2)} ${905 + (1150 - 905) * Math.min(1, luzFaro * 2)}`} stroke={C.yellow} strokeWidth={8} />
            {luzFaro > 0.5 ? <path d={`M 3060 1160 L ${3060 - (3060 - 2710) * (luzFaro * 2 - 1)} ${1160 - (1160 - 920) * (luzFaro * 2 - 1)}`} stroke={BRILLO} strokeWidth={8} strokeDasharray="16 8" /> : null}
          </g>
          {/* Llanta que pisa y la goma que limpia */}
          {llanta > 0 && llanta < 1 ? <circle cx={2620 + llanta * 960} cy={1000 + 60 * aplasta} r={150} fill="#1A1A20" stroke="#3A3A44" strokeWidth={20} /> : null}
          {limpia > 0 ? [0, 1, 2].map((k) => <path key={k} d={`M ${3000 + k * 70} 1080 q 20 -20 40 0`} fill="none" stroke={C.cyan} strokeWidth={5} opacity={limpia * (0.5 + 0.5 * Math.sin(t * 8 + k))} />) : null}
        </g>
      </g>

      <Tag x={sx(1950 + 270)} y={sy(1030)} dx={-40} dy={-330} texto="tapetum lucidum" color={VERDE_OJO} o={ventana(T.tapetum, T.anio)} />
      <Tag x={sx(1950 - 280)} y={sy(1030)} dx={-80} dy={290} texto="retina" color="#E8708A" o={ventana(T.espejo, T.tapetum)} />
      <Tag x={sx(3020)} y={sy(1150)} dx={-150} dy={-240} texto="lente + espejo" color="#C8E8F8" o={ventana(T.lentes, T.faros + 0.3)} />
      <Tag x={sx(3100)} y={sy(1150)} dx={150} dy={-270} texto="goma" color={C.white} o={ventana(T.goma, T.sinElec)} />
      <Tag x={sx(FUGA[0])} y={sy(studs[1].y)} dx={-260} dy={-180} texto="ojos de gato" color={BRILLO} o={ventana(T.idea, T.piezas)} />
    </svg>
  );
};

import { interpolate } from "remotion";
import { camaraEn, ClaveCamara, Panel, Pildora, Tag, ventanaEn } from "../components/Mundo";
import { C, clamp, mono, useT } from "../theme";
import { T } from "./tiempos";

// Mundo: a la izquierda, la punta del bolígrafo en corte (bola, hueco, tinta) sobre el papel; en el centro, agua contra
// tinta espesa boca abajo; a la derecha, el bolígrafo entero con el agujerito de aire y el año del invento.
const TINTA = "#2A3A9A";
const LATON = "#C8A040";
const BOLA = { x: 550, y: 1090, r: 70 };
const PAPEL = BOLA.y + BOLA.r;

const camaraKeys = (): ClaveCamara[] => [
  [0, 550, 1000, 1.6],
  [T.tinta - 0.3, 550, 1000, 1.65],
  [T.tinta + 0.5, 1850, 1030, 1.0],
  [T.escribir - 0.3, 1850, 1030, 1.02],
  [T.escribir + 0.5, 550, 1000, 1.6],
  [T.agujerito - 0.3, 550, 1000, 1.65],
  [T.agujerito + 0.5, 3100, 1030, 1.0],
  [T.final - 0.3, 3100, 1030, 1.02],
  [T.final + 0.5, 550, 1000, 1.6],
  [T.fin + 2, 550, 1000, 1.68],
];

export const BoliMundo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const { cx, cy, zoom } = camaraEn(camaraKeys(), t);
  const sx = (x: number) => 540 + (x - cx) * zoom;
  const sy = (y: number) => 960 + (y - cy) * zoom;
  const ventana = (a: number, b: number, entra = 0.4, sale = 0.4) => ventanaEn(t, a, b, entra, sale);

  // Escribiendo: el papel avanza y la bola gira (gancho, explicación y final)
  const escribe = (t < T.punta ? 1 : 0) || (t > T.escribir && t < T.noRueda) || t > T.final ? 1 : 0;
  const recorrido = t < T.punta ? t * 260 : t < T.noRueda ? Math.max(0, t - T.escribir) * 200 : Math.max(0, t - T.final) * 200;
  const giro = (recorrido / BOLA.r) * (180 / Math.PI);
  const tapon = ventana(T.tapon, T.tinta + 0.3);
  const quieta = ventana(T.noRueda, T.agujerito);
  const zoomPill = ventana(-1, T.punta);

  // Agua contra tinta espesa
  const comparar = ventana(T.tinta - 0.3, T.escribir + 0.3, 0.6, 0.6);
  const gotas = interpolate(t, [T.tinta + 0.3, T.escribir], [0, 1], clamp);

  // Bolígrafo entero
  const entero = ventana(T.agujerito - 0.3, T.final + 0.3, 0.6, 0.6);
  const baja = interpolate(t, [T.aire, T.biro], [0, 1], clamp);
  const anio = ventana(T.biro, T.final + 0.3);

  const camaraT = `translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`;
  const desplaza = recorrido % 80;

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <defs>
        <clipPath id="bolaClip">
          <circle cx={BOLA.x} cy={BOLA.y} r={BOLA.r} />
        </clipPath>
      </defs>
      <g transform={camaraT}>
        <rect x={-300} y={-400} width={1500} height={2400} fill="#1E1A2E" />
        {/* Papel */}
        <rect x={-300} y={PAPEL} width={1500} height={500} fill="#F4F0E4" />
        {new Array(24).fill(0).map((_, k) => (
          <line key={k} x1={-300 + k * 80 - desplaza} y1={PAPEL + 10} x2={-260 + k * 80 - desplaza} y2={PAPEL + 30} stroke="#D8D0C0" strokeWidth={3} />
        ))}
        {/* Trazo de tinta que queda detrás */}
        <rect x={BOLA.x - Math.min(recorrido, 850)} y={PAPEL - 6} width={Math.min(recorrido, 850)} height={10} fill={TINTA} opacity={t > T.noRueda && t < T.final ? 0.5 : 1} />
        {/* Punta en corte */}
        <path d={`M 360 300 L 740 300 L 740 820 L ${BOLA.x + 60} ${BOLA.y - 30} L ${BOLA.x + 60} ${BOLA.y + 20} L ${BOLA.x + 46} ${BOLA.y + 40} L ${BOLA.x + 40} ${BOLA.y + 10} L ${BOLA.x - 40} ${BOLA.y + 10} L ${BOLA.x - 46} ${BOLA.y + 40} L ${BOLA.x - 60} ${BOLA.y + 20} L ${BOLA.x - 60} ${BOLA.y - 30} L 360 820 Z`} fill={LATON} />
        <path d={`M 470 300 L 630 300 L 630 820 L ${BOLA.x + 30} ${BOLA.y - 40} L ${BOLA.x - 30} ${BOLA.y - 40} L 470 820 Z`} fill={TINTA} />
        {/* Bola que gira */}
        <circle cx={BOLA.x} cy={BOLA.y} r={BOLA.r} fill="#A8B0C0" />
        <g clipPath="url(#bolaClip)">
          <circle cx={BOLA.x} cy={BOLA.y} r={BOLA.r} fill="none" stroke={TINTA} strokeWidth={10} opacity={escribe} />
          <g transform={`rotate(${-giro} ${BOLA.x} ${BOLA.y})`}>
            <line x1={BOLA.x - BOLA.r} y1={BOLA.y} x2={BOLA.x + BOLA.r} y2={BOLA.y} stroke="#6A7080" strokeWidth={6} />
            <line x1={BOLA.x} y1={BOLA.y - BOLA.r} x2={BOLA.x} y2={BOLA.y + BOLA.r} stroke="#6A7080" strokeWidth={6} />
          </g>
          <circle cx={BOLA.x - 22} cy={BOLA.y - 26} r={16} fill="#FFFFFF" opacity={0.6} />
        </g>
        {escribe ? <path d={`M ${BOLA.x + 90} ${BOLA.y - 20} A 90 90 0 0 1 ${BOLA.x + 60} ${BOLA.y + 66}`} fill="none" stroke={C.yellow} strokeWidth={6} /> : null}
        {/* Tapón: la bola cierra la salida */}
        {tapon > 0 ? <circle cx={BOLA.x} cy={BOLA.y - 40} r={46} fill="none" stroke={C.yellow} strokeWidth={6} opacity={tapon} strokeDasharray="12 8" /> : null}
        <Pildora x={550} y={1300} texto="sin girar: sin tinta" color={C.red} o={quieta} tam={44} />
        <Pildora x={690} y={700} texto="× 100" color={C.cyan} o={zoomPill} tam={52} />

        {/* Agua contra tinta espesa, boca abajo */}
        <g opacity={comparar}>
          <Panel x0={1340} y0={600} x1={2360} y1={1460} />
          {[0, 1].map((k) => {
            const x = 1600 + k * 500;
            return (
              <g key={k}>
                <text x={x} y={690} textAnchor="middle" fill={k === 0 ? "#6AB8F8" : "#8A9AF8"} fontFamily={mono} fontSize={38} fontWeight={700}>
                  {k === 0 ? "agua" : "tinta"}
                </text>
                <rect x={x - 70} y={740} width={140} height={300} rx={20} fill="none" stroke="#C8C8D0" strokeWidth={6} />
                <rect x={x - 64} y={746} width={128} height={k === 0 ? 290 * (1 - gotas * 0.7) : 290} rx={16} fill={k === 0 ? "#6AB8F8" : TINTA} />
                {k === 0
                  ? [0, 1, 2].map((g) => {
                      const p = (t * 1.5 + g / 3) % 1;
                      return <ellipse key={g} cx={x} cy={1060 + p * 340} rx={14} ry={20} fill="#6AB8F8" opacity={gotas > 0 && gotas < 1 ? 1 - p : 0} />;
                    })
                  : null}
                <text x={x} y={1420} textAnchor="middle" fill={k === 0 ? C.red : "#48C878"} fontFamily={mono} fontSize={34} fontWeight={700} opacity={gotas}>
                  {k === 0 ? "gotea" : "no gotea"}
                </text>
              </g>
            );
          })}
        </g>

        {/* Bolígrafo entero con agujerito */}
        <g opacity={entero}>
          <Panel x0={2600} y0={600} x1={3600} y1={1460} />
          <rect x={2700} y={1000} width={760} height={90} rx={45} fill="#E8E6F0" opacity={0.35} stroke="#E8E6F0" strokeWidth={4} />
          <rect x={2760} y={1030} width={560} height={30} rx={15} fill="none" stroke="#8A8A9A" strokeWidth={3} />
          <rect x={2760 + 300 * baja} y={1032} width={560 - 300 * baja} height={26} rx={13} fill={TINTA} />
          <path d="M 3460 1010 L 3540 1045 L 3460 1080 Z" fill={LATON} />
          <circle cx={3546} cy={1045} r={8} fill="#A8B0C0" />
          <circle cx={2740} cy={1000} r={8} fill="#1A1A20" />
          {[0, 1, 2].map((k) => {
            const p = (t * 1.2 + k / 3) % 1;
            return <circle key={k} cx={2740 + p * 40} cy={940 + p * 60} r={8} fill={C.cyan} opacity={ventana(T.aire, T.biro) * (1 - p)} />;
          })}
          <g opacity={anio}>
            <text x={3100} y={800} textAnchor="middle" fill={C.yellow} fontFamily={mono} fontSize={80} fontWeight={700}>
              1938
            </text>
            <rect x={2900} y={1180} width={400} height={200} rx={8} fill="#E8E4D8" />
            {new Array(6).fill(0).map((_, k) => (
              <rect key={k} x={2920 + (k % 2) * 190} y={1200 + Math.floor(k / 2) * 55} width={170} height={36} fill="#8A8A8A" opacity={0.6} />
            ))}
          </g>
        </g>
      </g>

      <Tag x={sx(BOLA.x + BOLA.r)} y={sy(BOLA.y)} dx={160} dy={-240} texto="bola < 1 mm" color="#C8D0E0" o={ventana(T.punta, T.tapon)} />
      <Tag x={sx(550)} y={sy(600)} dx={180} dy={-160} texto="tinta espesa" color="#8A9AF8" o={ventana(T.tapa, T.tinta + 0.2)} />
      <Tag x={sx(2740)} y={sy(1000)} dx={60} dy={-200} texto="agujerito de aire" color={C.cyan} o={ventana(T.agujerito, T.biro)} />
    </svg>
  );
};

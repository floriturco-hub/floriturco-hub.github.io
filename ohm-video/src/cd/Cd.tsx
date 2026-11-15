import { interpolate } from "remotion";
import { camaraEn, ClaveCamara, Panel, Pildora, Tag, ventanaEn } from "../components/Mundo";
import { C, clamp, useT } from "../theme";
import { T } from "./tiempos";

// Mundo: a la izquierda, un CD que gira con reflejos de arcoíris; en el centro, la espiral de huequitos a 1,6 micras
// frente a un cabello; a la derecha, la rejilla de difracción (la luz blanca rebota y cada color sale en su ángulo, ondas
// que se suman o se anulan); al fondo, una mariposa azul.
// Retención (estilo §10): el gancho plantea la pregunta y el final vuelve a ella para el bucle.
const ARCO = ["#E8414F", "#F8883A", "#F8C848", "#48C878", "#08D8E8", "#4A6AE8", "#8A5CC8"];
const D = { x: 550, y: 1050, r: 380 };

const camaraKeys = (): ClaveCamara[] => [
  [0, 550, 1050, 1.0],
  [T.final - 0.1, 550, 1050, 1.04],
  [T.final + 0.2, 550, 1050, 0.92],
  [T.cd - 0.1, 550, 1050, 0.95],
  [T.cd + 0.2, 760, 900, 1.8],
  [T.espiral - 0.1, 760, 900, 1.83],
  [T.espiral + 0.2, 1850, 1030, 1.0],
  [T.huequitos - 0.1, 1850, 1030, 1.03],
  [T.huequitos + 0.2, 1850, 1030, 1.6],
  [T.lineas - 0.1, 1850, 1030, 1.63],
  [T.lineas + 0.2, 1850, 1030, 1.25],
  [T.cabello - 0.1, 1850, 1030, 1.28],
  [T.cabello + 0.2, 1850, 1030, 0.95],
  [T.esas - 0.1, 1850, 1030, 0.98],
  [T.esas + 0.2, 3100, 1030, 1.0],
  [T.rejilla - 0.1, 3100, 1030, 1.03],
  [T.rejilla + 0.2, 3050, 1230, 1.5],
  [T.luz - 0.1, 3050, 1230, 1.53],
  [T.luz + 0.2, 3100, 1030, 1.0],
  [T.onda - 0.1, 3100, 1030, 1.03],
  [T.onda + 0.2, 3100, 850, 1.45],
  [T.rebotar - 0.1, 3100, 850, 1.48],
  [T.rebotar + 0.2, 3100, 1030, 1.0],
  [T.suman - 0.1, 3100, 1030, 1.03],
  [T.suman + 0.2, 3100, 850, 1.45],
  [T.angulo - 0.1, 3100, 850, 1.48],
  [T.angulo + 0.2, 3150, 1050, 1.1],
  [T.pintura - 0.1, 3150, 1050, 1.13],
  [T.pintura + 0.2, 550, 1050, 1.1],
  [T.mariposas - 0.1, 550, 1050, 1.13],
  [T.mariposas + 0.2, 4350, 1030, 1.0],
  [T.asi - 0.1, 4350, 1030, 1.03],
  [T.asi + 0.25, 550, 1050, 1.0],
  [T.fin + 0.3, 550, 1050, 1.04],
];

export const CdMundo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const { cx, cy, zoom } = camaraEn(camaraKeys(), t);
  const sx = (x: number) => 540 + (x - cx) * zoom;
  const sy = (y: number) => 960 + (y - cy) * zoom;
  const ventana = (a: number, b: number, entra = 0.3, sale = 0.3) => ventanaEn(t, a, b, entra, sale);
  const destello = (a: number) => interpolate(t, [a, a + 0.06, a + 0.4], [0, 1, 0], clamp);

  // Disco
  const giro = t * 0.8;

  // Pistas
  const verPistas = ventana(T.espiral - 0.1, T.esas + 0.2);
  const cabello = ventana(T.cabello, T.esas + 0.2);

  // Difracción
  const verRejilla = ventana(T.esas - 0.1, T.pintura + 0.2);
  const haz = interpolate(t, [T.luz, T.luz + 0.6], [0, 1], clamp);
  const abanico = interpolate(t, [T.colores, T.colores + 0.8], [0, 1], clamp);
  const ondas = Math.max(ventana(T.onda, T.rebotar), ventana(T.suman, T.angulo));
  const modo = t < T.rebotar ? "colores" : t < T.anulan ? "suman" : "anulan";

  // Mariposa
  const verMariposa = ventana(T.mariposas - 0.1, T.asi + 0.2);
  const aleteo = Math.abs(Math.sin(t * 4));

  const camaraT = `translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`;
  const onda = (y: number, lambda: number, amp: number, color: string, fase = 0) =>
    `M 2660 ${y} ${new Array(80)
      .fill(0)
      .map((_, i) => {
        const x = 2660 + i * 11;
        return `L ${x} ${y + amp * Math.sin(((x - 2660) / lambda) * Math.PI * 2 - t * 6 + fase)}`;
      })
      .join(" ")}`;

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <g transform={camaraT}>
        <rect x={-300} y={-400} width={5400} height={2400} fill="#14141E" />

        {/* CD con arcoíris */}
        <circle cx={D.x} cy={D.y} r={D.r} fill="#C8CED8" />
        {new Array(48).fill(0).map((_, i) => {
          const a0 = (i / 48) * Math.PI * 2;
          const a1 = ((i + 1) / 48) * Math.PI * 2;
          const brillo = 0.15 + 0.75 * Math.abs(Math.cos(a0 * 2 - giro)) ** 3;
          const c = ARCO[(i + Math.floor(t * 6)) % ARCO.length];
          return (
            <path
              key={i}
              d={`M ${D.x + 90 * Math.cos(a0)} ${D.y + 90 * Math.sin(a0)} L ${D.x + D.r * Math.cos(a0)} ${D.y + D.r * Math.sin(a0)} A ${D.r} ${D.r} 0 0 1 ${D.x + D.r * Math.cos(a1)} ${D.y + D.r * Math.sin(a1)} L ${D.x + 90 * Math.cos(a1)} ${D.y + 90 * Math.sin(a1)} Z`}
              fill={c}
              opacity={brillo}
            />
          );
        })}
        <circle cx={D.x} cy={D.y} r={90} fill="#E8E6F0" />
        <circle cx={D.x} cy={D.y} r={40} fill="#14141E" />
        <circle cx={D.x} cy={D.y} r={D.r} fill="none" stroke="#E8E6F0" strokeWidth={6} />
        <Pildora x={550} y={1560} texto="¿y la mariposa?" color={C.white} o={ventana(T.final + 0.2, T.cd)} tam={44} />
        <Pildora x={550} y={1560} texto="no es pintura: es forma" color={C.orange} o={ventana(T.pintura + 0.2, T.mariposas)} tam={40} />

        {/* Espiral de huequitos */}
        <g opacity={verPistas}>
          <Panel x0={1340} y0={600} x1={2360} y1={1460} fill="#9AA0AC" />
          {new Array(16).fill(0).map((_, k) => (
            <path key={k} d={`M 1360 ${700 + k * 48} Q 1850 ${640 + k * 48} 2340 ${700 + k * 48}`} fill="none" stroke="#3A3F4C" strokeWidth={14} strokeDasharray={`${30 + (k % 3) * 18} ${22 + (k % 2) * 14}`} strokeDashoffset={-t * 60 * (k % 2 ? 1 : -1)} />
          ))}
          <path d="M 1500 600 C 1700 900, 1900 1100, 2200 1460" fill="none" stroke="#7A5A3A" strokeWidth={520} opacity={0.85 * cabello} strokeLinecap="butt" />
        </g>
        <Pildora x={1850} y={700} texto="≈ 1,6 micras" color={C.cyan} o={ventana(T.micra, T.esas)} tam={48} />

        {/* Rejilla de difracción */}
        <g opacity={verRejilla}>
          <Panel x0={2600} y0={600} x1={3600} y1={1460} />
          <rect x={2660} y={1260} width={880} height={40} fill="#9AA0AC" />
          {new Array(40).fill(0).map((_, k) => (
            <rect key={k} x={2665 + k * 22} y={1252} width={10} height={10} fill="#3A3F4C" />
          ))}
          {haz > 0 ? <line x1={2700} y1={700} x2={2700 + (3050 - 2700) * haz} y2={700 + (1255 - 700) * haz} stroke="#FFFFFF" strokeWidth={16} strokeLinecap="round" /> : null}
          {abanico > 0
            ? ARCO.map((c, k) => {
                const a = ((28 + k * 7) * Math.PI) / 180;
                const L = 560 * abanico;
                return <line key={k} x1={3050} y1={1255} x2={3050 + L * Math.cos(a)} y2={1255 - L * Math.sin(a)} stroke={c} strokeWidth={12} strokeLinecap="round" opacity={0.9} />;
              })
            : null}
          {ondas > 0 ? (
            <g opacity={ondas}>
              <rect x={2640} y={680} width={920} height={340} rx={20} fill="#14102A" opacity={0.92} />
              {modo === "colores" ? (
                <g>
                  <path d={onda(780, 180, 50, ARCO[0])} fill="none" stroke={ARCO[0]} strokeWidth={8} />
                  <path d={onda(930, 90, 50, ARCO[5])} fill="none" stroke={ARCO[5]} strokeWidth={8} />
                </g>
              ) : (
                <g>
                  <path d={onda(760, 140, 34, ARCO[3])} fill="none" stroke={ARCO[3]} strokeWidth={5} opacity={0.6} />
                  <path d={onda(760, 140, 34, ARCO[3], modo === "suman" ? 0 : Math.PI)} fill="none" stroke={ARCO[3]} strokeWidth={5} opacity={0.6} />
                  <path d={onda(920, 140, modo === "suman" ? 68 : 0, ARCO[3])} fill="none" stroke={modo === "suman" ? C.yellow : C.grey} strokeWidth={10} />
                </g>
              )}
            </g>
          ) : null}
        </g>
        <Pildora x={3100} y={1400} texto="luz blanca = todos los colores" color={C.white} o={ventana(T.luz + 0.3, T.onda)} tam={36} />
        <Pildora x={3100} y={1100} texto={modo === "suman" ? "se suman: brillo" : "se anulan: nada"} color={modo === "suman" ? C.yellow : C.grey} o={ventana(T.suman + 0.2, T.angulo)} tam={40} />
        <Pildora x={3100} y={1400} texto="cada color, su ángulo" color={C.yellow} o={ventana(T.angulo + 0.2, T.pintura)} tam={40} />

        {/* Mariposa azul */}
        <g opacity={verMariposa}>
          <Panel x0={3850} y0={600} x1={4850} y1={1460} />
          <g transform="translate(4350 1000)">
            {[-1, 1].map((l) => (
              <g key={l} transform={`scale(${l * (0.4 + 0.6 * aleteo)} 1)`}>
                <path d="M 0 -20 C 120 -260, 380 -220, 330 -40 C 300 40, 120 40, 0 10 Z" fill="#3A8AF8" />
                <path d="M 0 20 C 100 60, 260 120, 200 260 C 150 330, 40 200, 0 60 Z" fill="#2A6AD8" />
                <path d="M 30 -30 C 140 -180, 300 -170, 290 -60" fill="none" stroke="#8AD8FF" strokeWidth={8} opacity={0.6 * aleteo} />
              </g>
            ))}
            <rect x={-14} y={-90} width={28} height={300} rx={14} fill="#1A1A2A" />
          </g>
        </g>
        <Pildora x={4350} y={1400} texto="azul sin pigmento azul" color="#8AD8FF" o={ventana(T.mariposas + 0.3, T.asi)} tam={40} />
      </g>

      {[T.espiral, T.esas, T.colores, T.mariposas].map((q) => (
        <rect key={q} x={0} y={0} width={1080} height={1920} fill="#FFFFFF" opacity={0.2 * destello(q)} />
      ))}
      <Tag x={sx(1700)} y={sy(800)} dx={120} dy={-150} texto="huequitos" color="#2A2E38" o={ventana(T.huequitos + 0.2, T.lineas + 0.4)} />
      <Tag x={sx(1900)} y={sy(1080)} dx={-60} dy={250} texto="un cabello" color="#C8A070" o={ventana(T.cabello + 0.2, T.esas)} />
      <Tag x={sx(3050)} y={sy(1260)} dx={-200} dy={150} texto="rejilla" color="#C8CED8" o={ventana(T.rejilla + 0.2, T.luz)} />
    </svg>
  );
};

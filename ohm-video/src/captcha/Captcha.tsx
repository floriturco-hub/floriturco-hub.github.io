import { interpolate } from "remotion";
import { camaraEn, ClaveCamara, Panel, Pildora, Tag, ventanaEn } from "../components/Mundo";
import { C, clamp, mono, useT } from "../theme";
import { T } from "./tiempos";

// Mundo: a la izquierda, la casilla «No soy un robot» (y la prueba de semáforos); en el centro, el recorrido del ratón
// de un robot contra el de una persona; a la derecha, las señales que se analizan y la puntuación.
type P2 = [number, number];
const VERDE = "#48C878";
const CAJA: P2 = [250, 1000];

const camaraKeys = (): ClaveCamara[] => [
  [0, 550, 1000, 1.1],
  [T.robot - 0.3, 550, 1000, 1.14],
  [T.robot + 0.5, 1850, 1030, 1.0],
  [T.tambien - 0.3, 1850, 1030, 1.02],
  [T.tambien + 0.5, 3100, 1030, 1.0],
  [T.dudas - 0.3, 3100, 1030, 1.02],
  [T.dudas + 0.5, 550, 1000, 1.1],
  [T.fin + 2, 550, 1000, 1.16],
];

// Recorrido humano: curvo, con temblor, se pasa y corrige
const humano = (p: number, a: P2, b: P2): P2 => {
  const u = Math.min(1, p * 1.12);
  const pasa = p > 0.85 ? Math.sin(((p - 0.85) / 0.15) * Math.PI) * 30 : 0;
  return [a[0] + (b[0] - a[0]) * u + Math.sin(u * 9) * 40 * (1 - u) + pasa, a[1] + (b[1] - a[1]) * u - Math.sin(u * Math.PI) * 160 + Math.sin(u * 23) * 8 * (1 - u)];
};

const Cursor: React.FC<{ readonly x: number; readonly y: number; readonly s?: number }> = ({ x, y, s = 1 }) => (
  <path d="M 0 0 L 0 52 L 13 40 L 23 62 L 32 58 L 22 36 L 40 36 Z" transform={`translate(${x} ${y}) scale(${s})`} fill="#FFFFFF" stroke="#1A1A20" strokeWidth={3} />
);

const Robot: React.FC<{ readonly x: number; readonly y: number; readonly s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <line x1={0} y1={-70} x2={0} y2={-50} stroke="#8A8A9A" strokeWidth={6} />
    <circle cx={0} cy={-76} r={8} fill={C.red} />
    <rect x={-50} y={-50} width={100} height={80} rx={14} fill="#8A8A9A" />
    <rect x={-32} y={-30} width={22} height={18} rx={4} fill={C.cyan} />
    <rect x={10} y={-30} width={22} height={18} rx={4} fill={C.cyan} />
    <rect x={-24} y={6} width={48} height={8} rx={3} fill="#3A3A44" />
  </g>
);

export const CaptchaMundo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const { cx, cy, zoom } = camaraEn(camaraKeys(), t);
  const sx = (x: number) => 540 + (x - cx) * zoom;
  const sy = (y: number) => 960 + (y - cy) * zoom;
  const ventana = (a: number, b: number, entra = 0.4, sale = 0.4) => ventanaEn(t, a, b, entra, sale);

  // Casilla: gancho (análisis y ✓), luego al final otra vez
  const recorrido = t < T.robot ? interpolate(t, [0, 1.4], [0, 1], clamp) : interpolate(t, [T.noEres - 0.2, T.imperfeccion + 0.4], [0, 1], clamp);
  const inicio: P2 = [900, 1500];
  const cursor = humano(recorrido, inicio, CAJA);
  const marcada = (t > 1.5 && t < T.robot) || t > T.imperfeccion + 0.5 ? 1 : 0;
  const radar = Math.max(ventana(0, 1.6, 0.1, 0.2), ventana(T.antes, T.robot));
  const grilla = ventana(T.dudas, T.noEres, 0.5, 0.5);
  const seleccion = interpolate(t, [T.semaforos, T.maquina], [0, 1], clamp);
  const robotResuelve = ventana(T.maquina, T.noEres);
  const mejora = interpolate(t, [T.cadaVez, T.cadaVez + 0.6], [0, 1], clamp);

  // Robot contra persona
  const rutas = ventana(T.robot - 0.3, T.tambien + 0.3, 0.6, 0.6);
  const pr = interpolate(t, [T.recta - 0.4, T.centro], [0, 1], clamp);
  const ph = interpolate(t, [T.tu, T.corrige + 0.3], [0, 1], clamp);
  const a1: P2 = [1450, 940];
  const b1: P2 = [2200, 820];
  const a2: P2 = [1450, 1360];
  const b2: P2 = [2200, 1240];
  const robotPos: P2 = [a1[0] + (b1[0] - a1[0]) * pr, a1[1] + (b1[1] - a1[1]) * pr];
  const humanoPos = humano(ph, a2, b2);

  // Señales y puntuación
  const senales = ventana(T.tambien - 0.3, T.dudas + 0.3, 0.6, 0.6);
  const lista: [string, number][] = [
    ["tiempo", T.tambien],
    ["movimiento", T.tambien + 1.7],
    ["cookies", T.cookies],
    ["historial", T.cookies + 0.7],
    ["dispositivo", T.cookies + 1.8],
    ["conexión", T.cookies + 2.7],
  ];
  const nota = interpolate(t, [T.puntuacion, T.humano], [0, 0.9], clamp);

  const camaraT = `translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`;

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <g transform={camaraT}>
        <rect x={-300} y={-400} width={1500} height={2400} fill="#1A1E2E" />
        {/* Casilla «No soy un robot» */}
        <g opacity={1 - grilla}>
          <rect x={150} y={900} width={800} height={200} rx={12} fill="#F4F4F6" stroke="#C8C8D0" strokeWidth={4} />
          <rect x={CAJA[0] - 40} y={CAJA[1] - 40} width={80} height={80} rx={8} fill="#FFFFFF" stroke={marcada ? VERDE : "#8A8A9A"} strokeWidth={6} />
          {marcada ? <path d={`M ${CAJA[0] - 24} ${CAJA[1]} l 18 20 l 34 -42`} fill="none" stroke={VERDE} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" /> : null}
          <text x={340} y={1016} fill="#2A2A34" fontFamily={mono} fontSize={44}>
            No soy un robot
          </text>
          {radar > 0
            ? [0, 1, 2].map((k) => {
                const p = (t * 0.9 + k / 3) % 1;
                return <circle key={k} cx={cursor[0]} cy={cursor[1]} r={40 + p * 300} fill="none" stroke={C.cyan} strokeWidth={4} opacity={radar * (1 - p)} />;
              })
            : null}
          {/* Rastro del cursor */}
          {new Array(16).fill(0).map((_, k) => {
            const q = Math.max(0, recorrido - k * 0.03);
            const [x, y] = humano(q, inicio, CAJA);
            return <circle key={k} cx={x} cy={y} r={6} fill={C.cyan} opacity={0.5 * (1 - k / 16) * (recorrido > 0 ? 1 : 0)} />;
          })}
          <Cursor x={cursor[0]} y={cursor[1]} />
        </g>
        <Pildora x={550} y={760} texto="analizando…" color={C.cyan} o={radar} tam={44} />
        {/* Prueba de imágenes */}
        <g opacity={grilla}>
          <rect x={190} y={620} width={720} height={820} rx={16} fill="#F4F4F6" />
          <rect x={190} y={620} width={720} height={110} rx={16} fill="#4A7AE8" />
          <text x={220} y={690} fill="#FFFFFF" fontFamily={mono} fontSize={34} fontWeight={700}>
            Elige los semáforos
          </text>
          {new Array(9).fill(0).map((_, k) => {
            const c = k % 3;
            const f = Math.floor(k / 3);
            const x = 215 + c * 230;
            const y = 750 + f * 225;
            const tiene = [0, 4, 5, 7].includes(k);
            const elegida = tiene && seleccion * 4 > [0, 4, 5, 7].indexOf(k);
            return (
              <g key={k}>
                <rect x={x} y={y} width={210} height={205} fill="#8AA8C8" stroke={elegida ? "#4A7AE8" : "#F4F4F6"} strokeWidth={elegida ? 10 : 4} />
                <rect x={x} y={y + 140} width={210} height={65} fill="#6A7A6A" />
                {tiene ? (
                  <g transform={`translate(${x + 105} ${y + 90})`}>
                    <rect x={-22} y={-60} width={44} height={110} rx={10} fill="#2A2A30" />
                    <circle cy={-36} r={12} fill={C.red} />
                    <circle cy={-4} r={12} fill={C.yellow} />
                    <circle cy={28} r={12} fill={VERDE} />
                  </g>
                ) : null}
                {elegida ? <circle cx={x + 30} cy={y + 30} r={20} fill="#4A7AE8" /> : null}
              </g>
            );
          })}
          <g opacity={robotResuelve}>
            <Robot x={820} y={1360} s={1.3} />
            <text x={700} y={1490} textAnchor="middle" fill={mejora > 0.5 ? VERDE : C.red} fontFamily={mono} fontSize={36} fontWeight={700}>
              {mejora > 0.5 ? "✓ ya puede" : "✗ le cuesta"}
            </text>
          </g>
        </g>

        {/* Robot contra persona */}
        <g opacity={rutas}>
          <Panel x0={1340} y0={600} x1={2360} y1={1460} />
          <Robot x={1420} y={720} s={0.9} />
          <text x={1500} y={730} fill="#8A8A9A" fontFamily={mono} fontSize={36} fontWeight={700}>
            robot
          </text>
          <text x={1500} y={1130} fill={C.cyan} fontFamily={mono} fontSize={36} fontWeight={700}>
            tú
          </text>
          <line x1={1380} y1={1060} x2={2320} y2={1060} stroke="#3A3360" strokeWidth={3} />
          {/* Casillas destino */}
          {[b1, b2].map(([x, y], k) => (
            <g key={k}>
              <rect x={x - 36} y={y - 36} width={72} height={72} rx={8} fill="#F4F4F6" />
              {k === 0 ? <path d={`M ${x - 50} ${y} L ${x + 50} ${y} M ${x} ${y - 50} L ${x} ${y + 50}`} stroke={C.red} strokeWidth={3} opacity={pr} /> : null}
            </g>
          ))}
          {/* Rastro del robot: puntos a la misma distancia */}
          {new Array(12).fill(0).map((_, k) => {
            const q = (k / 11) * pr;
            return <circle key={k} cx={a1[0] + (b1[0] - a1[0]) * q} cy={a1[1] + (b1[1] - a1[1]) * q} r={7} fill="#8A8A9A" />;
          })}
          {/* Rastro humano: curvas y velocidad cambiante */}
          {new Array(24).fill(0).map((_, k) => {
            const q = Math.pow(k / 23, 1.6) * ph;
            const [x, y] = humano(q, a2, b2);
            return <circle key={k} cx={x} cy={y} r={7} fill={C.cyan} />;
          })}
          <Cursor x={robotPos[0]} y={robotPos[1]} s={0.8} />
          <Cursor x={humanoPos[0]} y={humanoPos[1]} s={0.8} />
        </g>

        {/* Señales y puntuación */}
        <g opacity={senales}>
          <Panel x0={2600} y0={600} x1={3600} y1={1460} />
          {lista.map(([nombre, desde], k) => {
            const o = interpolate(t, [desde - 0.1, desde + 0.3], [0, 1], clamp);
            return (
              <g key={nombre} opacity={0.25 + 0.75 * o}>
                <circle cx={2700} cy={700 + k * 80} r={18} fill={o > 0.5 ? C.cyan : "#3A3360"} />
                <text x={2740} y={714 + k * 80} fill={C.white} fontFamily={mono} fontSize={38} fontWeight={700}>
                  {nombre}
                </text>
              </g>
            );
          })}
          {/* Medidor de puntuación */}
          <g transform="translate(3100 1350)">
            <path d="M -260 0 A 260 260 0 0 1 260 0" fill="none" stroke="#3A3360" strokeWidth={30} />
            <path d="M -260 0 A 260 260 0 0 1 260 0" fill="none" stroke={VERDE} strokeWidth={30} strokeDasharray={`${Math.PI * 260 * nota} 2000`} />
            <line x1={0} y1={0} x2={-Math.cos(Math.PI * nota) * 220} y2={-Math.sin(Math.PI * nota) * 220} stroke={C.white} strokeWidth={8} strokeLinecap="round" />
            <circle r={14} fill={C.white} />
            <text x={-250} y={50} fill={C.red} fontFamily={mono} fontSize={30} fontWeight={700}>
              robot
            </text>
            <text x={250} y={50} textAnchor="end" fill={VERDE} fontFamily={mono} fontSize={30} fontWeight={700}>
              humano
            </text>
          </g>
        </g>
        <Pildora x={3100} y={1530} texto="✓ pasas con un clic" color={VERDE} o={ventana(T.humano, T.dudas)} tam={40} />
      </g>

      <Tag x={sx(robotPos[0])} y={sy(robotPos[1])} dx={-60} dy={-160} texto="línea recta" color="#C8C8D0" o={ventana(T.recta, T.tu)} />
      <Tag x={sx(humanoPos[0])} y={sy(humanoPos[1])} dx={-80} dy={190} texto="curvas y temblor" color={C.cyan} o={ventana(T.curvas, T.tambien)} />
    </svg>
  );
};

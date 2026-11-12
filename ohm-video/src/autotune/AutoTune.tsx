import { interpolate } from "remotion";
import { camaraEn, ClaveCamara, Panel, Pildora, Tag, ventanaEn } from "../components/Mundo";
import { C, clamp, mono, useT } from "../theme";
import { T } from "./tiempos";

// Mundo: a la izquierda, el subsuelo con ecos sísmicos y una bolsa de petróleo (el origen del Auto-Tune); en el centro,
// la onda de la voz cortada en trocitos y comparada consigo misma hasta encontrar el patrón que se repite; a la derecha,
// el tono frente a las notas de la escala: corrección suave o instantánea (la voz robótica en escalera).
// Retención (estilo §10): cambio de plano cada 2-3 s y final que empalma con el gancho («Todo empezó…» → «¡Este programa nació buscando petróleo!»).
const VERDE = "#48C878";
const ONDA = { x0: 1400, x1: 2300, y: 1030, P: 150 };
const NOTAS = [
  { n: "Do", y: 700 },
  { n: "Si", y: 850 },
  { n: "La", y: 1000 },
  { n: "Sol", y: 1150 },
  { n: "Fa", y: 1300 },
];
const OBJ = [1000, 850, 1150, 1000, 850];
const ERR = [-34, 22, -28, 18, -24];
const G = { x0: 2780, x1: 3540 };

// Tono natural (con desafines y deslices), corregido suave y corregido al instante, en función de u ∈ [0, 1]
const natural = (u: number) => {
  const k = Math.min(4, Math.floor(u * 5));
  const f = u * 5 - k;
  const a = OBJ[k] + ERR[k];
  const b = k < 4 ? OBJ[k + 1] + ERR[k + 1] : a;
  const desliz = f > 0.75 ? (1 - Math.cos(((f - 0.75) / 0.25) * Math.PI)) / 2 : 0;
  return a + (b - a) * desliz + 14 * Math.sin(u * 60);
};
const suave = (u: number) => {
  const k = Math.min(4, Math.floor(u * 5));
  const f = u * 5 - k;
  const b = k < 4 ? OBJ[k + 1] : OBJ[k];
  const desliz = f > 0.7 ? (1 - Math.cos(((f - 0.7) / 0.3) * Math.PI)) / 2 : 0;
  return OBJ[k] + (b - OBJ[k]) * desliz + 6 * Math.sin(u * 60);
};
const cercana = (y: number) => NOTAS.reduce((m, n) => (Math.abs(n.y - y) < Math.abs(m - y) ? n.y : m), NOTAS[0].y);

const camaraKeys = (): ClaveCamara[] => [
  [0, 560, 1080, 1.0],
  [T.final - 0.1, 560, 1080, 1.04],
  [T.final + 0.2, 3150, 1030, 1.0],
  [T.inventor - 0.1, 3150, 1030, 1.03],
  [T.inventor + 0.2, 560, 1000, 1.0],
  [T.ecos - 0.1, 560, 1000, 1.03],
  [T.ecos + 0.2, 520, 1150, 1.35],
  [T.petroleo - 0.1, 520, 1150, 1.38],
  [T.petroleo + 0.2, 660, 1340, 1.6],
  [T.uso - 0.1, 660, 1340, 1.63],
  [T.uso + 0.2, 1850, 1030, 1.0],
  [T.corta - 0.1, 1850, 1030, 1.03],
  [T.corta + 0.2, 1850, 1030, 1.15],
  [T.mili - 0.1, 1850, 1030, 1.18],
  [T.mili + 0.2, 1700, 1030, 1.7],
  [T.busca - 0.1, 1700, 1030, 1.73],
  [T.busca + 0.2, 1850, 1030, 1.0],
  [T.patron - 0.1, 1850, 1030, 1.03],
  [T.patron + 0.2, 1750, 1030, 1.4],
  [T.sabe - 0.1, 1750, 1030, 1.43],
  [T.sabe + 0.2, 1850, 1080, 1.1],
  [T.compara - 0.1, 1850, 1080, 1.13],
  [T.compara + 0.2, 3150, 1030, 1.0],
  [T.escala - 0.1, 3150, 1030, 1.03],
  [T.escala + 0.2, 3000, 1020, 1.4],
  [T.sube - 0.1, 3000, 1020, 1.43],
  [T.sube + 0.2, 3050, 1010, 1.55],
  [T.todo - 0.1, 3050, 1010, 1.58],
  [T.todo + 0.2, 3150, 1030, 1.0],
  [T.oido - 0.1, 3150, 1030, 1.03],
  [T.oido + 0.2, 3150, 1000, 1.25],
  [T.robotico - 0.1, 3150, 1000, 1.28],
  [T.robotico + 0.2, 3150, 1030, 1.0],
  [T.inst - 0.1, 3150, 1030, 1.03],
  [T.inst + 0.2, 3150, 1030, 1.2],
  [T.salta - 0.1, 3150, 1030, 1.23],
  [T.salta + 0.2, 3150, 1050, 1.35],
  [T.cher - 0.1, 3150, 1050, 1.38],
  [T.cher + 0.2, 3150, 1030, 1.05],
  [T.empezo - 0.1, 3150, 1030, 1.08],
  [T.empezo + 0.25, 560, 1080, 1.0],
  [T.fin + 0.3, 560, 1080, 1.04],
];

export const AutoTuneMundo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const { cx, cy, zoom } = camaraEn(camaraKeys(), t);
  const sx = (x: number) => 540 + (x - cx) * zoom;
  const sy = (y: number) => 960 + (y - cy) * zoom;
  const ventana = (a: number, b: number, entra = 0.3, sale = 0.3) => ventanaEn(t, a, b, entra, sale);
  const destello = (a: number) => interpolate(t, [a, a + 0.06, a + 0.4], [0, 1, 0], clamp);

  // Subsuelo
  const microfono = Math.max(ventana(-1, T.final), ventana(T.empezo, T.fin + 2), ventana(T.uso - 0.6, T.uso + 0.2, 0.2, 0.2));
  const petroleo = Math.max(ventana(-1, T.final), ventana(T.petroleo, T.uso + 0.2), ventana(T.empezo, T.fin + 2));

  // Onda de la voz
  const verOnda = ventana(T.uso - 0.1, T.compara + 0.2);
  const onda = (x: number, lag = 0) => {
    const f = ((x - ONDA.x0 - lag) / ONDA.P) * Math.PI * 2;
    return ONDA.y + 70 * (Math.sin(f) + 0.5 * Math.sin(2 * f + 1) + 0.3 * Math.sin(3 * f + 2));
  };
  const trazo = (lag: number, x0 = ONDA.x0, x1 = ONDA.x1) =>
    `M ${new Array(91)
      .fill(0)
      .map((_, i) => {
        const x = x0 + ((x1 - x0) * i) / 90;
        return `${x} ${onda(x, lag)}`;
      })
      .join(" L ")}`;
  const cortes = ventana(T.corta + 0.3, T.patron + 0.3);
  const lag = interpolate(t, [T.busca, T.patron], [40, ONDA.P], clamp);
  const copia = ventana(T.busca, T.sabe + 0.3);
  const coincide = t > T.patron - 0.05 ? 1 : 0;

  // Tono frente a la escala
  const verTono = Math.max(ventana(T.final - 0.1, T.inventor + 0.2), ventana(T.compara - 0.1, T.empezo + 0.2));
  const punto = t > T.compara - 0.2 && t < T.todo;
  const yPunto = interpolate(t, [T.sube, T.sube + 0.4], [1031, 1000], clamp);
  const resalta = ventana(T.escala, T.todo);
  const curvas = t > T.todo - 0.2 && t < T.robotico;
  const avance = interpolate(t, [T.todo, T.oido], [0, 1], clamp);
  const robot = (t > T.final - 0.2 && t < T.inventor + 0.2) || t > T.robotico - 0.2;
  const avanceRobot = t < T.inventor + 0.3 ? interpolate(t, [T.final, T.final + 1.4], [0, 1], clamp) : interpolate(t, [T.robotico + 0.3, T.salta + 0.6], [0, 1], clamp);
  const linea = (fn: (u: number) => number, hasta: number) =>
    `M ${new Array(121)
      .fill(0)
      .map((_, i) => {
        const u = (i / 120) * hasta;
        return `${G.x0 + (G.x1 - G.x0) * u} ${fn(u)}`;
      })
      .join(" L ")}`;

  const camaraT = `translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`;

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <g transform={camaraT}>
        <rect x={-300} y={-400} width={4200} height={2400} fill="#181A2A" />

        {/* Subsuelo: capas, ecos sísmicos y petróleo */}
        <rect x={60} y={900} width={1000} height={200} fill="#8A6A4A" />
        <rect x={60} y={1100} width={1000} height={160} fill="#6A5A4A" />
        <rect x={60} y={1260} width={1000} height={260} fill="#4A3E34" />
        <ellipse cx={680} cy={1350} rx={210} ry={62} fill="#0A0A0E" />
        <ellipse cx={640} cy={1330} rx={120} ry={18} fill="#4A4A6A" opacity={0.6} />
        <ellipse cx={680} cy={1350} rx={230} ry={78} fill="none" stroke={C.yellow} strokeWidth={6} opacity={petroleo * (0.5 + 0.5 * Math.sin(t * 8))} />
        {/* Camión vibrador */}
        <rect x={180} y={800} width={200} height={80} rx={10} fill="#D8A040" />
        <rect x={330} y={760} width={70} height={60} rx={8} fill="#D8A040" />
        <circle cx={220} cy={890} r={20} fill="#2A2A30" />
        <circle cx={360} cy={890} r={20} fill="#2A2A30" />
        {/* Geófonos */}
        {[600, 760, 920].map((x) => (
          <path key={x} d={`M ${x - 16} 900 L ${x} 870 L ${x + 16} 900 Z`} fill={C.cyan} />
        ))}
        {/* Ondas hacia abajo y ecos hacia arriba */}
        <clipPath id="subsuelo">
          <rect x={60} y={900} width={1000} height={620} />
        </clipPath>
        <g clipPath="url(#subsuelo)">
          {[0, 1, 2].map((k) => {
            const p = (t * 0.7 + k / 3) % 1;
            return <circle key={k} cx={300} cy={900} r={40 + p * 420} fill="none" stroke={C.white} strokeWidth={5} opacity={0.7 * (1 - p)} />;
          })}
          {[0, 1].map((k) => {
            const p = (t * 0.7 + k / 2 + 0.3) % 1;
            return <circle key={k} cx={560} cy={1280} r={30 + p * 400} fill="none" stroke={C.orange} strokeWidth={5} strokeDasharray="16 10" opacity={0.8 * (1 - p)} />;
          })}
        </g>
        {/* Micrófono */}
        <g opacity={microfono} transform="translate(860 640)">
          <rect x={-40} y={-90} width={80} height={130} rx={40} fill="#C8CED8" />
          {[-60, -35, -10].map((y) => (
            <line key={y} x1={-40} y1={y} x2={40} y2={y} stroke="#8A90A0" strokeWidth={4} />
          ))}
          <path d="M -60 0 Q -60 70 0 70 Q 60 70 60 0" fill="none" stroke="#C8CED8" strokeWidth={8} />
          <line x1={0} y1={70} x2={0} y2={150} stroke="#C8CED8" strokeWidth={8} />
          <line x1={-40} y1={150} x2={40} y2={150} stroke="#C8CED8" strokeWidth={8} />
        </g>
        <Pildora x={520} y={640} texto="Andy Hildebrand" color={C.white} o={ventana(T.inventor + 0.2, T.ecos)} tam={44} />
        <Pildora x={680} y={1460} texto="¡petróleo!" color={C.yellow} o={ventana(T.petroleo + 0.3, T.uso)} tam={44} />

        {/* Onda de la voz */}
        <g opacity={verOnda}>
          <Panel x0={1340} y0={600} x1={2360} y1={1460} />
          <line x1={ONDA.x0} y1={ONDA.y} x2={ONDA.x1} y2={ONDA.y} stroke="#3A3360" strokeWidth={3} />
          <path d={trazo(0)} fill="none" stroke={C.yellow} strokeWidth={7} />
          {cortes > 0
            ? new Array(8).fill(0).map((_, k) => <line key={k} x1={ONDA.x0 + 112 * (k + 1)} y1={830} x2={ONDA.x0 + 112 * (k + 1)} y2={1230} stroke={C.white} strokeWidth={3} strokeDasharray="12 10" opacity={cortes * 0.7} />)
            : null}
          {copia > 0 ? <path d={trazo(lag, ONDA.x0 + 150, ONDA.x1)} fill="none" stroke={coincide ? VERDE : C.cyan} strokeWidth={6} opacity={0.8 * copia} strokeDasharray={coincide ? undefined : "18 10"} /> : null}
          {coincide ? (
            <g opacity={ventana(T.patron, T.compara + 0.2)}>
              <path d={`M ${ONDA.x0 + 150} 1220 l 0 20 l ${ONDA.P} 0 l 0 -20`} fill="none" stroke={VERDE} strokeWidth={6} />
              <text x={ONDA.x0 + 225} y={1290} textAnchor="middle" fill={VERDE} fontFamily={mono} fontSize={34} fontWeight={700}>
                2,3 ms
              </text>
            </g>
          ) : null}
          <text x={1850} y={760} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={40} fontWeight={700} opacity={ventana(T.uso + 0.2, T.corta)}>
            tu voz
          </text>
        </g>
        <Pildora x={1850} y={1380} texto="≈ 430 Hz" color={C.yellow} o={ventana(T.sabe, T.compara + 0.2)} tam={50} />

        {/* Tono frente a las notas */}
        <g opacity={verTono}>
          <Panel x0={2600} y0={600} x1={3600} y1={1460} />
          {NOTAS.map((n) => (
            <g key={n.n}>
              <line x1={G.x0} y1={n.y} x2={G.x1} y2={n.y} stroke={n.n === "La" && resalta > 0 ? C.yellow : "#3A3360"} strokeWidth={n.n === "La" && resalta > 0 ? 6 : 4} />
              <text x={G.x0 - 30} y={n.y + 14} textAnchor="end" fill={C.grey} fontFamily={mono} fontSize={38} fontWeight={700}>
                {n.n}
              </text>
            </g>
          ))}
          {punto ? (
            <g>
              {t > T.sube - 0.3 && t < T.sube + 0.4 ? (
                <path d={`M 3150 1031 L 3150 1004`} stroke={VERDE} strokeWidth={6} />
              ) : null}
              <circle cx={3150} cy={yPunto} r={22} fill={t > T.sube + 0.3 ? VERDE : C.red} />
              <text x={3195} y={yPunto + 50} fill={t > T.sube + 0.3 ? VERDE : C.red} fontFamily={mono} fontSize={36} fontWeight={700}>
                {t > T.sube + 0.3 ? "440 Hz ✓" : "430 Hz"}
              </text>
            </g>
          ) : null}
          {curvas ? (
            <g>
              <path d={linea(natural, avance)} fill="none" stroke={C.grey} strokeWidth={6} />
              <path d={linea(suave, avance)} fill="none" stroke={C.yellow} strokeWidth={8} />
            </g>
          ) : null}
          {robot ? (
            <g>
              <path d={linea(natural, avanceRobot)} fill="none" stroke={C.grey} strokeWidth={5} opacity={0.6} />
              <path d={linea((u) => cercana(natural(u)), avanceRobot)} fill="none" stroke={C.cyan} strokeWidth={9} />
            </g>
          ) : null}
        </g>
        <Pildora x={3150} y={1400} texto="¿por qué?" color={C.white} o={ventana(T.final + 0.5, T.inventor)} tam={44} />
        <Pildora x={3150} y={1400} texto="≈ 5 ms" color={C.cyan} o={ventana(T.todo + 0.3, T.robotico)} tam={52} />
        <Pildora x={3150} y={1400} texto="corrección instantánea" color={C.cyan} o={ventana(T.inst, T.cher)} tam={40} />
        <Pildora x={3150} y={1400} texto="«Believe» (1998)" color={C.white} o={ventana(T.cher + 0.3, T.empezo)} tam={44} />
      </g>

      {[T.uso, T.patron, T.sube + 0.3, T.salta].map((d) => (
        <rect key={d} x={0} y={0} width={1080} height={1920} fill="#FFFFFF" opacity={0.2 * destello(d)} />
      ))}
      <Tag x={sx(560)} y={sy(1250)} dx={-140} dy={-230} texto="eco" color={C.orange} o={ventana(T.ecos + 0.3, T.petroleo)} />
      <Tag x={sx(G.x0 + 400)} y={sy(natural(0.51))} dx={60} dy={230} texto="tu voz" color={C.grey} o={ventana(T.oido - 0.6, T.robotico)} />
      <Tag x={sx(G.x0 + 200)} y={sy(suave(0.26))} dx={-40} dy={-190} texto="corregida" color={C.yellow} o={ventana(T.oido - 0.6, T.robotico)} />
      <Tag x={sx(G.x0 + 0.6 * (G.x1 - G.x0))} y={sy(cercana(natural(0.6)))} dx={-80} dy={-200} texto="¡salto!" color={C.cyan} o={ventana(T.salta + 0.2, T.cher)} />
    </svg>
  );
};

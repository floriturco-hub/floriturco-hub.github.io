import { interpolate } from "remotion";
import { camaraEn, ClaveCamara, Panel, Pildora, Tag, ventanaEn } from "../components/Mundo";
import { C, clamp, mono, useT } from "../theme";
import { T } from "./tiempos";

// Mundo: a la izquierda, la barra de chocolate que se corta en diagonal, se reacomoda y suelta un cuadrito (la barra
// nueva es un poco más baja); en el centro, las tajadas finísimas de cada fila que juntas forman el cuadrito; a la
// derecha, el triángulo de Curry con su hueco y el borde que no es recto.
// Retención (estilo §10): el gancho plantea la pregunta y el final vuelve a ella para el bucle.
const CHOCO = "#6A3A22";
const BRILLO = "#8A5232";
const L = 110;
const B = { x0: 330, y0: 720, cols: 4, filas: 6 };
const ALTO = B.filas * L;
const BAJA = 55;

const Cuadros: React.FC<{ x0: number; y0: number; cols: number; filas: number; w: number; h: number }> = ({ x0, y0, cols, filas, w, h }) => (
  <g>
    {new Array(filas).fill(0).map((_, j) =>
      new Array(cols).fill(0).map((__, i) => (
        <g key={`${i}-${j}`}>
          <rect x={x0 + i * w + 4} y={y0 + j * h + 4} width={w - 8} height={h - 8} rx={8} fill={CHOCO} />
          <rect x={x0 + i * w + 14} y={y0 + j * h + 12} width={w - 28} height={h * 0.25} rx={6} fill={BRILLO} opacity={0.6} />
        </g>
      )),
    )}
  </g>
);

const camaraKeys = (): ClaveCamara[] => [
  [0, 600, 1060, 1.1],
  [T.final - 0.1, 600, 1060, 1.14],
  [T.final + 0.2, 600, 1060, 0.95],
  [T.cortas - 0.1, 600, 1060, 0.98],
  [T.cortas + 0.2, 550, 1050, 1.15],
  [T.sobra - 0.1, 550, 1050, 1.18],
  [T.sobra + 0.2, 640, 1060, 1.05],
  [T.infinito - 0.1, 640, 1060, 1.08],
  [T.infinito + 0.2, 900, 860, 1.6],
  [T.no - 0.1, 900, 860, 1.63],
  [T.no + 0.2, 600, 1060, 1.0],
  [T.fijate - 0.1, 600, 1060, 1.03],
  [T.fijate + 0.2, 560, 760, 1.6],
  [T.nueva - 0.1, 560, 760, 1.63],
  [T.nueva + 0.2, 600, 1060, 1.05],
  [T.corte - 0.1, 600, 1060, 1.08],
  [T.corte + 0.2, 1850, 1030, 1.0],
  [T.tajada - 0.1, 1850, 1030, 1.03],
  [T.tajada + 0.2, 1700, 1000, 1.5],
  [T.sumadas - 0.1, 1700, 1000, 1.53],
  [T.sumadas + 0.2, 1850, 1030, 1.05],
  [T.forman - 0.1, 1850, 1030, 1.08],
  [T.forman + 0.2, 2150, 1030, 1.5],
  [T.aparece - 0.1, 2150, 1030, 1.53],
  [T.aparece + 0.2, 1850, 1030, 1.0],
  [T.reparte - 0.1, 1850, 1030, 1.03],
  [T.curry - 0.1, 1850, 1030, 1.03],
  [T.curry + 0.2, 3100, 1030, 1.0],
  [T.encajar - 0.1, 3100, 1030, 1.03],
  [T.encajar + 0.2, 3100, 1280, 1.4],
  [T.borde - 0.1, 3100, 1280, 1.43],
  [T.borde + 0.2, 3150, 960, 1.7],
  [T.asi - 0.1, 3150, 960, 1.73],
  [T.asi + 0.25, 600, 1060, 1.1],
  [T.fin + 0.3, 600, 1060, 1.14],
];

// Triángulo de Curry (unidades de cuadrícula 13 × 5, y hacia arriba) dibujado en (x0, yBase) con escala s
const Curry: React.FC<{ x0: number; y0: number; s: number; hueco: boolean; dobla: number }> = ({ x0, y0, s, hueco, dobla }) => {
  const P = (pts: number[][]) => pts.map(([x, y]) => `${x0 + x * s},${y0 - y * s}`).join(" ");
  const piezas = hueco
    ? [
        { c: "#4A7AE8", p: [[0, 0], [5, 0], [5, 2]] },
        { c: C.red, p: [[5, 2], [13, 2], [13, 5]] },
        { c: "#48C878", p: [[5, 0], [10, 0], [10, 1], [7, 1], [7, 2], [5, 2]] },
        { c: C.yellow, p: [[10, 0], [13, 0], [13, 1], [12, 1], [12, 2], [7, 2], [7, 1], [10, 1]] },
      ]
    : [
        { c: C.red, p: [[0, 0], [8, 0], [8, 3]] },
        { c: "#4A7AE8", p: [[8, 3], [13, 3], [13, 5]] },
        { c: "#48C878", p: [[8, 0], [13, 0], [13, 1], [10, 1], [10, 2], [8, 2]] },
        { c: C.yellow, p: [[8, 2], [10, 2], [10, 1], [13, 1], [13, 3], [8, 3]] },
      ];
  const dy = (hueco ? -1 : 1) * 0.35 * dobla;
  return (
    <g>
      {piezas.map((q, k) => (
        <polygon key={k} points={P(q.p)} fill={q.c} stroke="#14102A" strokeWidth={4} />
      ))}
      {hueco ? <polygon points={P([[12, 1], [13, 1], [13, 2], [12, 2]])} fill="#14102A" stroke={C.white} strokeWidth={4} strokeDasharray="8 6" /> : null}
      <line x1={x0} y1={y0} x2={x0 + 13 * s} y2={y0 - 5 * s} stroke={C.white} strokeWidth={3} strokeDasharray="10 8" opacity={dobla} />
      {dobla > 0 ? <polyline points={P([[0, 0], [hueco ? 5 : 8, (hueco ? 2 : 3) + dy], [13, 5]])} fill="none" stroke={C.orange} strokeWidth={6} opacity={dobla} /> : null}
    </g>
  );
};

export const CuadradoMundo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const { cx, cy, zoom } = camaraEn(camaraKeys(), t);
  const sx = (x: number) => 540 + (x - cx) * zoom;
  const sy = (y: number) => 960 + (y - cy) * zoom;
  const ventana = (a: number, b: number, entra = 0.3, sale = 0.3) => ventanaEn(t, a, b, entra, sale);
  const destello = (a: number) => interpolate(t, [a, a + 0.06, a + 0.4], [0, 1, 0], clamp);

  // Barra: entera → cortada → piezas movidas → barra nueva más baja + cuadrito
  const gancho = t < T.final || t > T.asi;
  const corte = interpolate(t, [T.cortas, T.cortas + 0.6], [0, 1], clamp);
  const mueve = interpolate(t, [T.mueves, T.mueves + 0.9], [0, 1], clamp);
  const nueva = gancho ? 1 : interpolate(t, [T.sobra, T.sobra + 0.7], [0, 1], clamp);
  const saltaCuadro = gancho ? 1 : nueva;
  const rebote = gancho ? Math.abs(Math.sin(t * 5)) * 30 : 0;
  const fantasma = ventana(T.fijate, T.corte + 0.2);
  const cutY0 = B.y0 + 440;
  const cutY1 = B.y0 + 220;
  const x1 = B.x0 + B.cols * L;

  // Tajadas
  const verTajadas = ventana(T.corte - 0.1, T.curry + 0.2);
  const salen = interpolate(t, [T.tajada, T.sumadas + 0.4], [0, 1], clamp);
  const juntan = interpolate(t, [T.sumadas + 0.4, T.forman + 0.6], [0, 1], clamp);

  // Curry
  const verCurry = ventana(T.curry - 0.1, T.asi + 0.2);
  const dobla = interpolate(t, [T.borde, T.dobla + 0.4], [0, 1], clamp);

  const camaraT = `translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`;

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <defs>
        <clipPath id="abajo">
          <polygon points={`${B.x0},${cutY0} ${x1},${cutY1} ${x1},${B.y0 + ALTO} ${B.x0},${B.y0 + ALTO}`} />
        </clipPath>
        <clipPath id="arriba">
          <polygon points={`${B.x0},${B.y0} ${x1},${B.y0} ${x1},${cutY1} ${B.x0},${cutY0}`} />
        </clipPath>
      </defs>
      <g transform={camaraT}>
        <rect x={-300} y={-400} width={4200} height={2400} fill="#1E1A22" />

        {/* Barra de chocolate */}
        {nueva < 1 ? (
          <g opacity={1 - nueva}>
            <g clipPath="url(#abajo)">
              <Cuadros x0={B.x0} y0={B.y0} cols={B.cols} filas={B.filas} w={L} h={L} />
            </g>
            <g transform={`translate(${-L * mueve} ${BAJA * mueve})`}>
              <g clipPath="url(#arriba)">
                <Cuadros x0={B.x0} y0={B.y0} cols={B.cols} filas={B.filas} w={L} h={L} />
              </g>
            </g>
            {corte > 0 ? <line x1={B.x0} y1={cutY0} x2={B.x0 + (x1 - B.x0) * corte} y2={cutY0 + (cutY1 - cutY0) * corte} stroke={C.yellow} strokeWidth={6} strokeDasharray="16 10" /> : null}
          </g>
        ) : null}
        {nueva > 0 ? (
          <g opacity={nueva}>
            <Cuadros x0={B.x0} y0={B.y0 + BAJA} cols={B.cols} filas={B.filas} w={L} h={(ALTO - BAJA) / B.filas} />
          </g>
        ) : null}
        <g opacity={saltaCuadro} transform={`translate(${900 - (1 - saltaCuadro) * 500} ${800 - rebote})`}>
          <rect x={-L / 2 + 4} y={-L / 2 + 4} width={L - 8} height={L - 8} rx={8} fill={CHOCO} stroke={C.yellow} strokeWidth={5} />
        </g>
        {Math.max(gancho ? 1 : 0, ventana(T.infinito, T.no + 0.4)) > 0 ? (
          <text x={900} y={690} textAnchor="middle" fill={C.yellow} fontFamily={mono} fontSize={90} fontWeight={700} opacity={Math.max(gancho ? 1 : 0, ventana(T.infinito, T.no + 0.4))}>
            ?
          </text>
        ) : null}
        {fantasma > 0 ? (
          <g opacity={fantasma}>
            <rect x={B.x0} y={B.y0} width={x1 - B.x0} height={ALTO} fill="none" stroke={C.white} strokeWidth={4} strokeDasharray="14 10" />
            <line x1={x1 + 30} y1={B.y0} x2={x1 + 30} y2={B.y0 + BAJA} stroke={C.red} strokeWidth={8} />
            <line x1={x1 + 10} y1={B.y0} x2={x1 + 50} y2={B.y0} stroke={C.red} strokeWidth={6} />
            <line x1={x1 + 10} y1={B.y0 + BAJA} x2={x1 + 50} y2={B.y0 + BAJA} stroke={C.red} strokeWidth={6} />
          </g>
        ) : null}
        <Pildora x={600} y={1520} texto="¿chocolate infinito?" color={C.orange} o={ventana(T.infinito, T.no + 0.3)} tam={42} />
        <Pildora x={600} y={1520} texto="un poquito más baja" color={C.red} o={ventana(T.nueva, T.corte)} tam={42} />

        {/* Tajadas de cada fila */}
        <g opacity={verTajadas}>
          <Panel x0={1340} y0={600} x1={2360} y1={1460} />
          {new Array(6).fill(0).map((_, j) => {
            const y = 720 + j * 110;
            const tx = 1500 + 260 * salen;
            const fx = 2150;
            const fy = 1060 - 55 + j * (110 / 6);
            const px = tx + (fx - tx) * juntan - 55;
            const py = y + (fy - y) * juntan;
            return (
              <g key={j}>
                <rect x={1440} y={y + 18} width={110} height={88} rx={8} fill={CHOCO} />
                <rect x={px} y={py} width={110} height={110 / 6} fill={C.red} stroke="#14102A" strokeWidth={2} />
              </g>
            );
          })}
          <rect x={2095} y={1005} width={110} height={110} fill="none" stroke={C.yellow} strokeWidth={6} strokeDasharray="10 8" opacity={juntan} />
        </g>
        <Pildora x={1850} y={1400} texto="= el cuadrito" color={C.yellow} o={ventana(T.forman, T.curry)} tam={46} />
        <Pildora x={1850} y={700} texto="solo se reparte" color={C.white} o={ventana(T.aparece, T.curry)} tam={44} />

        {/* Triángulo de Curry */}
        <g opacity={verCurry}>
          <Panel x0={2600} y0={600} x1={3600} y1={1460} />
          <Curry x0={2710} y0={1060} s={60} hueco={false} dobla={dobla} />
          <Curry x0={2710} y0={1420} s={60} hueco={true} dobla={dobla} />
        </g>
        <Pildora x={3100} y={700} texto="¡un hueco!" color={C.white} o={ventana(T.encajar, T.borde)} tam={44} />
      </g>

      {[T.cortas, T.sobra, T.corte, T.curry].map((q) => (
        <rect key={q} x={0} y={0} width={1080} height={1920} fill="#FFFFFF" opacity={0.2 * destello(q)} />
      ))}
      <Tag x={sx(1600)} y={sy(740)} dx={150} dy={-150} texto="tajada finísima" color={C.red} o={ventana(T.tajada + 0.3, T.sumadas)} />
      <Tag x={sx(3500)} y={sy(860)} dx={-200} dy={-170} texto="no es recto" color={C.orange} o={ventana(T.dobla, T.asi)} />
    </svg>
  );
};

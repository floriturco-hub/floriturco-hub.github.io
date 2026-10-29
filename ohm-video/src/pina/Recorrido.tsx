import { Easing, interpolate } from "remotion";
import { C, clamp, H, mono, useT, W } from "../theme";
import { T } from "./tiempos";

// Diagrama de laboratorio: del plato a la sangre, de la sangre a dos glándulas (matraces) y a un tubo de ensayo.
// Representación esquemática, sin anatomía explícita.
type P2 = [number, number];
const PLATO: P2 = [250, 620];
const INTESTINO: P2 = [760, 640];
const VASO_Y = 980;
const VESICULAS: P2 = [330, 1300];
const PROSTATA: P2 = [750, 1300];
const TUBO: P2 = [540, 1620];
const SANGRE = "#C8303C";
const GLUCOSA = "#FFFFFF";
const FRUCTOSA = "#F8C848";

const suave = { ...clamp, easing: Easing.inOut(Easing.cubic) };

// Cámara: [tiempo, centro x, centro y, zoom]
const camaraKeys = (): [number, number, number, number][] => [
  [0, PLATO[0] + 40, PLATO[1], 2.2],
  [T.mito - 0.3, PLATO[0] + 40, PLATO[1], 2.25],
  [T.mito + 0.6, 540, 1100, 0.95],
  [T.glandulas - 0.3, 540, 1100, 0.97],
  [T.glandulas + 0.6, 540, 1420, 1.35],
  [T.azucar - 0.3, 540, 1420, 1.37],
  [T.azucar + 0.6, 540, 1140, 1.2],
  [T.noViene - 0.3, 540, 1140, 1.22],
  [T.noViene + 0.6, 540, 1100, 0.95],
  [T.sabor - 0.2, 540, 1100, 0.97],
  [T.sabor + 0.6, TUBO[0], TUBO[1] - 40, 2.0],
  [T.compuestos - 0.3, TUBO[0], TUBO[1] - 40, 2.05],
  [T.compuestos + 0.6, 540, 900, 1.15],
  [T.estudios - 0.3, 540, 900, 1.17],
  [T.estudios + 0.6, 540, 1100, 0.95],
  [T.magico - 0.3, 540, 1100, 0.97],
  [T.magico + 0.5, PLATO[0] + 40, PLATO[1], 2.0],
  [T.fin, PLATO[0] + 40, PLATO[1], 2.05],
];

const camara = (t: number) => {
  const K = camaraKeys();
  let k = 0;
  while (k < K.length - 1 && K[k + 1][0] <= t) {
    k++;
  }
  const a = K[k];
  const b = K[Math.min(k + 1, K.length - 1)];
  const p = b[0] === a[0] ? 0 : interpolate(t, [a[0], b[0]], [0, 1], suave);
  return { cx: a[1] + (b[1] - a[1]) * p, cy: a[2] + (b[2] - a[2]) * p, zoom: a[3] + (b[3] - a[3]) * p };
};

const Hexagono: React.FC<{ readonly x: number; readonly y: number; readonly r: number; readonly color: string; readonly o?: number }> = ({ x, y, r, color, o = 1 }) => (
  <polygon
    points={new Array(6)
      .fill(0)
      .map((_, i) => `${x + r * Math.cos((i * Math.PI) / 3)},${y + r * Math.sin((i * Math.PI) / 3)}`)
      .join(" ")}
    fill={color}
    opacity={o}
  />
);

const Pina: React.FC<{ readonly x: number; readonly y: number; readonly s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[-26, -12, 0, 12, 26].map((dx, i) => (
      <path key={i} d={`M ${dx * 0.5} -60 Q ${dx * 1.4} -110, ${dx * 1.8} -128 Q ${dx * 0.6} -96, ${dx * 0.2} -60 Z`} fill={i % 2 ? "#2E8A4A" : "#3AA85A"} />
    ))}
    <ellipse cx={0} cy={0} rx={52} ry={66} fill="#E8A83A" />
    {[-2, -1, 0, 1, 2].map((k) => (
      <g key={k}>
        <line x1={-52} y1={k * 26 - 30} x2={52} y2={k * 26 + 30} stroke="#B87A2A" strokeWidth={3} opacity={0.7} />
        <line x1={52} y1={k * 26 - 30} x2={-52} y2={k * 26 + 30} stroke="#B87A2A" strokeWidth={3} opacity={0.7} />
      </g>
    ))}
  </g>
);

type Alimento = "esparrago" | "ajo" | "copa" | "cafe" | "tabaco";

// Iconos sencillos de los alimentos con compuestos que pasan a los fluidos
const Icono: React.FC<{ readonly x: number; readonly y: number; readonly tipo: Alimento }> = ({ x, y, tipo }) => {
  if (tipo === "esparrago") {
    return (
      <g transform={`translate(${x} ${y})`}>
        {[-14, 0, 14].map((dx) => (
          <g key={dx}>
            <rect x={dx - 6} y={-40} width={12} height={80} rx={6} fill="#5AA84A" />
            <path d={`M ${dx - 8} -36 L ${dx} -54 L ${dx + 8} -36 Z`} fill="#3A8A3A" />
          </g>
        ))}
        <rect x={-26} y={8} width={52} height={10} rx={4} fill="#C8A86A" />
      </g>
    );
  }
  if (tipo === "ajo") {
    return (
      <g transform={`translate(${x} ${y})`}>
        <path d="M 0 -46 C 10 -30, 44 -16, 40 14 C 36 40, -36 40, -40 14 C -44 -16, -10 -30, 0 -46 Z" fill="#F0E8D8" />
        <path d="M 0 -40 L 0 34 M -20 -14 Q -24 14 -14 34 M 20 -14 Q 24 14 14 34" fill="none" stroke="#C8B8A0" strokeWidth={3} />
      </g>
    );
  }
  if (tipo === "copa") {
    return (
      <g transform={`translate(${x} ${y})`}>
        <path d="M -30 -44 L 30 -44 Q 30 4 0 8 Q -30 4 -30 -44 Z" fill="#C8C4D8" opacity={0.5} />
        <path d="M -26 -24 L 26 -24 Q 24 2 0 6 Q -24 2 -26 -24 Z" fill="#A8303C" />
        <rect x={-3} y={8} width={6} height={28} fill="#C8C4D8" />
        <rect x={-20} y={34} width={40} height={6} rx={3} fill="#C8C4D8" />
      </g>
    );
  }
  if (tipo === "cafe") {
    return (
      <g transform={`translate(${x} ${y})`}>
        <path d="M -34 -20 L 30 -20 L 24 30 Q 22 38 14 38 L -18 38 Q -26 38 -28 30 Z" fill="#E8E6F0" />
        <path d="M 30 -8 Q 50 -6 46 12 Q 42 24 26 20" fill="none" stroke="#E8E6F0" strokeWidth={6} />
        <ellipse cx={-2} cy={-20} rx={32} ry={7} fill="#6A3A1E" />
        <ellipse cx={-2} cy={42} rx={44} ry={6} fill="#C8C4D8" />
      </g>
    );
  }
  return (
    <g transform={`translate(${x} ${y}) rotate(-20)`}>
      <rect x={-44} y={-8} width={70} height={16} rx={3} fill="#F0ECE4" />
      <rect x={26} y={-8} width={20} height={16} rx={3} fill="#D8904A" />
      <circle cx={-46} cy={0} r={6} fill="#E8703C" />
      <path d="M -52 -10 q -8 -14 0 -28" fill="none" stroke="#C8C4D8" strokeWidth={3} opacity={0.6} />
    </g>
  );
};

// Matraz de laboratorio con líquido que se llena
const Matraz: React.FC<{ readonly x: number; readonly y: number; readonly nivel: number; readonly color: string }> = ({ x, y, nivel, color }) => {
  const alto = 150;
  return (
    <g>
      <defs>
        <clipPath id={`matraz-${x}`}>
          <path d={`M ${x - 22} ${y - 120} L ${x - 22} ${y - 50} L ${x - 90} ${y + 60} Q ${x - 96} ${y + 74}, ${x - 80} ${y + 74} L ${x + 80} ${y + 74} Q ${x + 96} ${y + 74}, ${x + 90} ${y + 60} L ${x + 22} ${y - 50} L ${x + 22} ${y - 120} Z`} />
        </clipPath>
      </defs>
      <g clipPath={`url(#matraz-${x})`}>
        <rect x={x - 100} y={y + 74 - alto * nivel} width={200} height={alto * nivel} fill={color} opacity={0.75} />
      </g>
      <path
        d={`M ${x - 22} ${y - 120} L ${x - 22} ${y - 50} L ${x - 90} ${y + 60} Q ${x - 96} ${y + 74}, ${x - 80} ${y + 74} L ${x + 80} ${y + 74} Q ${x + 96} ${y + 74}, ${x + 90} ${y + 60} L ${x + 22} ${y - 50} L ${x + 22} ${y - 120}`}
        fill="none"
        stroke="#C8C4D8"
        strokeWidth={5}
      />
      <rect x={x - 30} y={y - 130} width={60} height={12} rx={5} fill="#C8C4D8" />
    </g>
  );
};

// Etiqueta anclada a un punto del mundo, con tamaño constante en pantalla
const Tag: React.FC<{ readonly x: number; readonly y: number; readonly texto: string; readonly color: string; readonly o: number; readonly dx?: number; readonly dy?: number }> = ({
  x,
  y,
  texto,
  color,
  o,
  dx = 0,
  dy = -90,
}) => {
  if (o <= 0) {
    return null;
  }
  const ancho = texto.length * 22 + 36;
  return (
    <g opacity={o}>
      <line x1={x} y1={y} x2={x + dx} y2={y + dy + (dy < 0 ? 26 : -30)} stroke={color} strokeWidth={2} opacity={0.7} />
      <circle cx={x} cy={y} r={6} fill={color} />
      <rect x={x + dx - ancho / 2} y={y + dy - 30} width={ancho} height={56} rx={14} fill={C.pill} stroke={color} strokeWidth={2} />
      <text x={x + dx} y={y + dy + 10} textAnchor="middle" fill={color} fontFamily={mono} fontSize={36} fontWeight={700}>
        {texto}
      </text>
    </g>
  );
};

export const Recorrido: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const { cx, cy, zoom } = camara(t);
  const sx = (x: number) => 540 + (x - cx) * zoom;
  const sy = (y: number) => 960 + (y - cy) * zoom;

  // El "atajo" que la gente imagina: de la piña directo al tubo, y luego tachado
  const atajo = interpolate(t, [T.parece - 0.1, T.parece + 0.6, T.glandulas - 0.3, T.glandulas], [0, 1, 1, 0], clamp);
  const tacha = interpolate(t, [T.licuadora - 0.1, T.licuadora + 0.4], [0, 1], clamp);

  // Llenado de los matraces y del tubo
  const vesiculas = interpolate(t, [T.vesiculas - 0.2, T.vesiculas + 1.0], [0.15, 0.65], suave);
  const prostata = interpolate(t, [T.prostata - 0.2, T.prostata + 1.0], [0.15, 0.4], suave);
  const tubo = interpolate(t, [T.glandulas + 0.4, T.cinco + 0.6], [0, 1], suave);
  const espermaO = interpolate(t, [T.esperma - 0.1, T.esperma + 0.4], [0, 1], clamp);

  // Flujo de glucosa por la sangre y fructosa saliendo de las glándulas
  const flujo = interpolate(t, [T.mito + 0.6, T.mito + 1.2], [0, 1], clamp);
  const fructosa = interpolate(t, [T.fructosa - 0.2, T.fructosa + 0.4], [0, 1], clamp);
  const fabrican = interpolate(t, [T.fabrican - 0.2, T.fabrican + 0.4], [0, 1], clamp);
  // La piña no llega directa
  const noViene = interpolate(t, [T.noViene - 0.1, T.noViene + 0.4, T.sabor - 0.3, T.sabor], [0, 1, 1, 0], clamp);

  // Compuestos volátiles de otros alimentos que sí pueden pasar a los fluidos
  const volatiles = interpolate(t, [T.compuestos, T.compuestos + 0.6, T.estudios - 0.3, T.estudios], [0, 1, 1, 0], clamp);
  const iconos: { x: number; nombre: string; desde: number; tipo: Alimento }[] = [
    { x: 160, nombre: "espárrago", desde: T.esparragos, tipo: "esparrago" },
    { x: 350, nombre: "ajo", desde: T.ajo, tipo: "ajo" },
    { x: 540, nombre: "alcohol", desde: T.alcohol, tipo: "copa" },
    { x: 730, nombre: "café", desde: T.cafe, tipo: "cafe" },
    { x: 920, nombre: "tabaco", desde: T.tabaco, tipo: "tabaco" },
  ];

  // Etiquetas
  const tagPina = interpolate(t, [0.4, 0.8, T.mito - 0.3, T.mito], [0, 1, 1, 0], clamp);
  const tagIntestino = interpolate(t, [T.mito + 0.8, T.mito + 1.2, T.glandulas - 0.3, T.glandulas], [0, 1, 1, 0], clamp);
  const tagVes = interpolate(t, [T.vesiculas, T.vesiculas + 0.4, T.azucar - 0.3, T.azucar], [0, 1, 1, 0], clamp);
  const tagPro = interpolate(t, [T.prostata, T.prostata + 0.4, T.azucar - 0.3, T.azucar], [0, 1, 1, 0], clamp);
  const tagGlucosa = interpolate(t, [T.glucosa - 0.2, T.glucosa + 0.3, T.sabor - 0.3, T.sabor], [0, 1, 1, 0], clamp);

  const VASO = `M 120 ${VASO_Y} L 960 ${VASO_Y}`;

  return (
    <svg width={W} height={H} style={{ position: "absolute" }}>
      <defs>
        <filter id="brillo-pn" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>
      <g transform={`translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`}>
        {/* Mesa de laboratorio */}
        <rect x={-600} y={1760} width={2400} height={600} fill="#1A1636" />
        <rect x={-600} y={1760} width={2400} height={14} fill="#3A3360" />

        {/* Plato con piña */}
        <ellipse cx={PLATO[0]} cy={PLATO[1] + 70} rx={150} ry={34} fill="#C8C4D8" />
        <ellipse cx={PLATO[0]} cy={PLATO[1] + 62} rx={120} ry={22} fill="#E8E6F0" />
        <Pina x={PLATO[0]} y={PLATO[1]} />

        {/* Intestino esquemático: tubo que serpentea */}
        <path d={`M ${INTESTINO[0] - 150} ${INTESTINO[1] - 60} q 75 -50 150 0 q 75 50 150 0 M ${INTESTINO[0] - 150} ${INTESTINO[1] + 20} q 75 -50 150 0 q 75 50 150 0`} fill="none" stroke="#D88A8A" strokeWidth={30} strokeLinecap="round" />
        <path d={`M ${PLATO[0] + 150} ${PLATO[1]} C ${PLATO[0] + 250} ${PLATO[1] - 40}, ${INTESTINO[0] - 260} ${INTESTINO[1] - 80}, ${INTESTINO[0] - 170} ${INTESTINO[1] - 60}`} fill="none" stroke={C.white} strokeWidth={4} strokeDasharray="10 10" strokeDashoffset={-40 * t} opacity={0.5} />
        <path d={`M ${INTESTINO[0]} ${INTESTINO[1] + 60} L ${INTESTINO[0]} ${VASO_Y - 24}`} fill="none" stroke={C.white} strokeWidth={4} strokeDasharray="10 10" strokeDashoffset={-40 * t} opacity={0.5 * flujo} />

        {/* Vaso sanguíneo con glucosa */}
        <path d={VASO} stroke={SANGRE} strokeWidth={48} strokeLinecap="round" opacity={0.85} />
        {new Array(12).fill(0).map((_, i) => {
          const p = (t * 0.12 + i / 12) % 1;
          return <Hexagono key={i} x={120 + p * 840} y={VASO_Y + Math.sin(p * 20 + i) * 8} r={9} color={GLUCOSA} o={flujo} />;
        })}

        {/* De la sangre a las glándulas */}
        <path d={`M ${VESICULAS[0]} ${VASO_Y + 24} L ${VESICULAS[0]} ${VESICULAS[1] - 130}`} stroke={SANGRE} strokeWidth={16} opacity={0.7} />
        <path d={`M ${PROSTATA[0]} ${VASO_Y + 24} L ${PROSTATA[0]} ${PROSTATA[1] - 130}`} stroke={SANGRE} strokeWidth={16} opacity={0.7} />
        {fabrican > 0
          ? [VESICULAS, PROSTATA].map((g, k) => {
              const p = (t * 0.8 + k * 0.5) % 1;
              return <Hexagono key={k} x={g[0]} y={VASO_Y + 24 + p * (g[1] - 154 - VASO_Y)} r={9} color={GLUCOSA} o={fabrican} />;
            })
          : null}

        <Matraz x={VESICULAS[0]} y={VESICULAS[1]} nivel={vesiculas} color="#C8D8E8" />
        <Matraz x={PROSTATA[0]} y={PROSTATA[1]} nivel={prostata} color="#E8E0C8" />
        {/* Fructosa dentro de las vesículas */}
        {fructosa > 0
          ? [-30, 0, 30, -15, 15].map((dx, i) => (
              <Hexagono key={i} x={VESICULAS[0] + dx} y={VESICULAS[1] + 40 - (i > 2 ? 26 : 0) + Math.sin(t * 3 + i) * 3} r={9} color={FRUCTOSA} o={fructosa} />
            ))
          : null}

        {/* Hacia el tubo de ensayo */}
        <path d={`M ${VESICULAS[0] + 60} ${VESICULAS[1] + 74} Q ${VESICULAS[0] + 120} ${TUBO[1] - 200}, ${TUBO[0] - 20} ${TUBO[1] - 150}`} fill="none" stroke="#C8D8E8" strokeWidth={8} opacity={0.6} />
        <path d={`M ${PROSTATA[0] - 60} ${PROSTATA[1] + 74} Q ${PROSTATA[0] - 120} ${TUBO[1] - 200}, ${TUBO[0] + 20} ${TUBO[1] - 150}`} fill="none" stroke="#E8E0C8" strokeWidth={8} opacity={0.6} />
        {/* Tubo de ensayo con capas: vesículas, próstata y una franja mínima de espermatozoides */}
        <g>
          <rect x={TUBO[0] - 40} y={TUBO[1] - 140} width={80} height={250} rx={38} fill="none" stroke="#C8C4D8" strokeWidth={5} />
          <clipPath id="tubo-pn">
            <rect x={TUBO[0] - 37} y={TUBO[1] - 137} width={74} height={244} rx={35} />
          </clipPath>
          <g clipPath="url(#tubo-pn)">
            <rect x={TUBO[0] - 40} y={TUBO[1] + 110 - 230 * tubo * 0.67} width={80} height={230 * tubo * 0.67} fill="#C8D8E8" opacity={0.8} />
            <rect x={TUBO[0] - 40} y={TUBO[1] + 110 - 230 * tubo * 0.97} width={80} height={230 * tubo * 0.3} fill="#E8E0C8" opacity={0.8} />
            <rect x={TUBO[0] - 40} y={TUBO[1] + 110 - 230 * tubo} width={80} height={230 * tubo * 0.03 + 2} fill={C.cyan} opacity={espermaO} />
          </g>
        </g>

        {/* El atajo imaginado: piña → tubo, tachado */}
        {atajo > 0 ? (
          <g opacity={atajo}>
            <path d={`M ${PLATO[0]} ${PLATO[1] + 110} C ${PLATO[0] - 120} 1100, ${TUBO[0] - 300} ${TUBO[1] - 200}, ${TUBO[0] - 50} ${TUBO[1] - 60}`} fill="none" stroke={C.yellow} strokeWidth={8} strokeDasharray="18 12" strokeDashoffset={-60 * t} />
            <path d="M 70 1150 L 230 1310 M 230 1150 L 70 1310" stroke={C.red} strokeWidth={16} strokeLinecap="round" opacity={tacha} />
          </g>
        ) : null}
        {noViene > 0 ? (
          <g opacity={noViene}>
            <Hexagono x={PLATO[0]} y={PLATO[1] - 10} r={16} color={FRUCTOSA} />
            <path d={`M ${PLATO[0]} ${PLATO[1] + 20} L ${PLATO[0]} ${PLATO[1] + 140}`} stroke={C.red} strokeWidth={8} strokeDasharray="10 8" />
            <path d={`M ${PLATO[0] - 30} ${PLATO[1] + 110} L ${PLATO[0] + 30} ${PLATO[1] + 170} M ${PLATO[0] + 30} ${PLATO[1] + 110} L ${PLATO[0] - 30} ${PLATO[1] + 170}`} stroke={C.red} strokeWidth={10} strokeLinecap="round" />
          </g>
        ) : null}

        {/* Otros alimentos: compuestos volátiles que sí pueden pasar a los fluidos */}
        {volatiles > 0 ? (
          <g opacity={volatiles}>
            {iconos.map((ic, i) => {
              const o = interpolate(t, [ic.desde - 0.2, ic.desde + 0.3], [0, 1], clamp);
              return (
                <g key={i} opacity={o}>
                  <Icono x={ic.x} y={380} tipo={ic.tipo} />
                  <text x={ic.x} y={460} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={26} fontWeight={700}>
                    {ic.nombre}
                  </text>
                  {[0, 1, 2].map((k) => {
                    const p = (t * 0.6 + k / 3 + i * 0.2) % 1;
                    return <path key={k} d={`M ${ic.x - 10 + k * 10} ${480 + p * 460} q 10 -14 0 -28`} fill="none" stroke="#9AE07A" strokeWidth={4} opacity={(1 - p) * 0.8} />;
                  })}
                </g>
              );
            })}
          </g>
        ) : null}
      </g>

      {/* Etiquetas ancladas (tamaño constante en pantalla) */}
      <Tag x={sx(PLATO[0])} y={sy(PLATO[1] - 70)} dx={140} dy={-200} texto="piña" color={C.yellow} o={tagPina} />
      <Tag x={sx(INTESTINO[0])} y={sy(INTESTINO[1] - 90)} dx={0} dy={-150} texto="intestino" color={C.white} o={tagIntestino} />
      <Tag x={sx(VESICULAS[0])} y={sy(VESICULAS[1] - 130)} dx={-40} dy={-150} texto="vesículas" color="#C8D8E8" o={tagVes} />
      <Tag x={sx(PROSTATA[0])} y={sy(PROSTATA[1] - 130)} dx={40} dy={-150} texto="próstata" color="#E8E0C8" o={tagPro} />
      <Tag x={sx(540)} y={sy(VASO_Y)} dx={0} dy={-200} texto="glucosa en sangre" color={C.white} o={tagGlucosa} />
    </svg>
  );
};

import { Easing, interpolate } from "remotion";
import { C, clamp, H, mono, useT, W } from "../theme";

const CX = 540;
const CY = 1060;
const PASO_ION = 70;

const Barra: React.FC<{
  readonly y: number;
  readonly etiqueta: string;
  readonly valor: number; // 0..1
  readonly color: string;
}> = ({ y, etiqueta, valor, color }) => (
  <g>
    <text x={120} y={y + 34} fill={color} fontFamily={mono} fontSize={44} fontWeight={700}>
      {etiqueta}
    </text>
    <rect x={200} y={y} width={740} height={44} rx={22} fill="rgba(255,255,255,0.06)" />
    <rect x={200} y={y} width={740 * valor} height={44} rx={22} fill={color} />
  </g>
);

// Un tramo de cable: más largo → más choques (R sube); más grueso → más carriles (R baja)
export const Resistencia: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const suave = { ...clamp, easing: Easing.inOut(Easing.cubic) };
  const largo = interpolate(t, [46.38, 47.3], [560, 940], suave);
  const grueso = interpolate(t, [48.09, 49.0], [170, 380], suave);

  const r = 0.45 * (largo / 560) * (170 / grueso) ** 0.8;
  const i = Math.min(1, 0.23 / r);
  const vel = 220 * (0.45 / ((0.45 * largo) / 560));

  const iones: React.ReactNode[] = [];
  for (let gx = -8; gx <= 8; gx++) {
    for (let gy = -3; gy <= 3; gy++) {
      const x = CX + gx * PASO_ION;
      const y = CY + gy * PASO_ION;
      iones.push(
        <circle
          key={`${gx}-${gy}`}
          cx={x + 2 * Math.sin(t * 10 + gx + gy)}
          cy={y + 2 * Math.cos(t * 12 + gx * gy)}
          r={13}
          fill={C.purple}
          stroke={C.purpleLight}
          strokeWidth={3}
        />,
      );
    }
  }

  const electrones: React.ReactNode[] = [];
  for (let carril = -5; carril <= 5; carril++) {
    const y = CY + carril * PASO_ION + PASO_ION / 2;
    for (let n = 0; n < 14; n++) {
      const desfase = (carril * 37 + n * 97) % 97;
      const x = CX - 500 + ((((n * 80 + desfase + t * vel) % 1120) + 1120) % 1120) - 60;
      electrones.push(<circle key={`${carril}-${n}`} cx={x} cy={y} r={9} fill={C.cyan} />);
    }
  }

  return (
    <svg width={W} height={H} style={{ position: "absolute" }}>
      <defs>
        <clipPath id="tubo">
          <rect x={CX - largo / 2} y={CY - grueso / 2} width={largo} height={grueso} rx={grueso / 2} />
        </clipPath>
      </defs>
      <rect x={60} y={260} width={960} height={260} rx={24} fill={C.card} stroke={C.cardBorder} strokeWidth={2} />
      <Barra y={310} etiqueta="R" valor={r} color={C.purpleLight} />
      <Barra y={420} etiqueta="I" valor={i} color={C.cyan} />
      <rect
        x={CX - largo / 2 - 14}
        y={CY - grueso / 2 - 14}
        width={largo + 28}
        height={grueso + 28}
        rx={grueso / 2 + 14}
        fill="rgba(88, 40, 136, 0.15)"
        stroke={C.wire}
        strokeWidth={10}
      />
      <g clipPath="url(#tubo)">
        {iones}
        {electrones}
      </g>
      {/* Cables de conexión hacia los bornes */}
      <line x1={0} y1={CY} x2={CX - largo / 2 - 14} y2={CY} stroke={C.wire} strokeWidth={18} />
      <line x1={CX + largo / 2 + 14} y1={CY} x2={W} y2={CY} stroke={C.wire} strokeWidth={18} />
    </svg>
  );
};

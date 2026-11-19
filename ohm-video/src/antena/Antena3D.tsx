import { C } from "../theme";
import { Gen, proyectar, puntosBrazo } from "./geom";

type Props = {
  readonly x: number;
  readonly y: number;
  readonly s: number;
  readonly guinada: number;
  readonly genes: Gen[];
  readonly brazos?: number; // 4 brazos girados 90°, como la antena real
  readonly color?: string;
  readonly grosor?: number;
  readonly pasos?: number;
  readonly base?: boolean;
};

// Antena de alambre doblado vista en 3D (proyectada), sobre un disco de masa
export const Antena3D: React.FC<Props> = ({ x, y, s, guinada, genes, brazos = 4, color = "#D8D4E8", grosor = 4, pasos, base = true }) => {
  const brazo = puntosBrazo(genes, pasos);
  const disco: string[] = [];
  for (let k = 0; k <= 48; k++) {
    const a = (k / 48) * Math.PI * 2;
    const [px, py] = proyectar([Math.cos(a) * 34, Math.sin(a) * 34, 0], guinada);
    disco.push(`${(x + px * s).toFixed(1)},${(y + py * s).toFixed(1)}`);
  }
  return (
    <g>
      {base ? <polygon points={disco.join(" ")} fill="#3A3360" stroke="#8C88A8" strokeWidth={Math.max(1, s * 0.6)} /> : null}
      {new Array(brazos).fill(0).map((_, b) => {
        const giro = guinada + (b * Math.PI * 2) / brazos;
        const pts = brazo.map((p) => {
          const [px, py] = proyectar([p[0] + 12, p[1], p[2]], giro);
          return `${(x + px * s).toFixed(1)},${(y + py * s).toFixed(1)}`;
        });
        return (
          <g key={b}>
            <polyline points={pts.join(" ")} fill="none" stroke={color} strokeWidth={grosor * 2.4} strokeLinejoin="round" strokeLinecap="round" opacity={0.18} />
            <polyline points={pts.join(" ")} fill="none" stroke={color} strokeWidth={grosor} strokeLinejoin="round" strokeLinecap="round" />
          </g>
        );
      })}
      <circle cx={x} cy={y} r={Math.max(2, s * 1.2)} fill={C.yellow} />
    </g>
  );
};

// Satélite ST5 estilizado (prisma octogonal) con la antena encima
export const Satelite: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly guinada: number; readonly genes: Gen[] }> = ({ x, y, s, guinada, genes }) => {
  const w = 60 * s;
  const h = 46 * s;
  return (
    <g>
      <polygon
        points={`${x - w},${y} ${x - w * 0.7},${y - h * 0.35} ${x + w * 0.7},${y - h * 0.35} ${x + w},${y} ${x + w},${y + h} ${x + w * 0.7},${y + h * 1.35} ${x - w * 0.7},${y + h * 1.35} ${x - w},${y + h}`}
        fill="#2A2350"
        stroke="#8C88A8"
        strokeWidth={Math.max(1.5, s * 1.5)}
      />
      {new Array(6).fill(0).map((_, k) => (
        <rect key={k} x={x - w * 0.85 + k * w * 0.29} y={y + h * 0.15} width={w * 0.24} height={h * 0.7} fill="#186878" opacity={0.85} />
      ))}
      <Antena3D x={x} y={y - h * 0.35} s={s * 0.9} guinada={guinada} genes={genes} grosor={Math.max(1.2, s * 1.4)} />
    </g>
  );
};

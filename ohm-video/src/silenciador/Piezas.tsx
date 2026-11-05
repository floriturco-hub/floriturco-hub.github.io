import { random } from "remotion";
import { C, mono } from "../theme";

// Barras de decibelios
export const Decibelios: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly filas: [string, number, string, number][];
}> = ({ x, y, w, filas }) => (
  <g>
    {filas.map(([nombre, db, color, op], k) => (
      <g key={nombre} opacity={op} transform={`translate(${x} ${y + k * 150})`}>
        <text
          x={0}
          y={-14}
          fill={C.white}
          fontFamily={mono}
          fontSize={30}
          fontWeight={700}
        >
          {nombre}
        </text>
        <rect
          x={0}
          y={0}
          width={(w * db) / 170}
          height={60}
          rx={10}
          fill={color}
        />
        <text
          x={(w * db) / 170 + 16}
          y={44}
          fill={color}
          fontFamily={mono}
          fontSize={38}
          fontWeight={700}
        >{`${db} dB`}</text>
      </g>
    ))}
  </g>
);

// Tubo con cámaras (supresor) en corte; gases que entran y se frenan
export const Supresor: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly t: number;
  readonly gas: number;
  readonly corte: number;
}> = ({ x, y, w, t, gas, corte }) => {
  const n = 5;
  const h = 200;
  return (
    <g>
      <rect
        x={x}
        y={y - h / 2}
        width={w}
        height={h}
        rx={30}
        fill="#3A3A4A"
        stroke="#8A8A9A"
        strokeWidth={8}
      />
      <g opacity={corte}>
        <rect
          x={x + 10}
          y={y - h / 2 + 10}
          width={w - 20}
          height={h - 20}
          rx={24}
          fill="#1A1A2A"
        />
        {new Array(n).fill(0).map((_, k) => {
          const bx = x + ((k + 1) * w) / (n + 1);
          return (
            <path
              key={k}
              d={`M ${bx - 30} ${y - h / 2 + 10} L ${bx + 10} ${y - 24} L ${bx + 10} ${y + 24} L ${bx - 30} ${y + h / 2 - 10}`}
              stroke="#8A8A9A"
              strokeWidth={10}
              fill="none"
            />
          );
        })}
        {gas > 0
          ? new Array(28).fill(0).map((_, k) => {
              const f = (t * 0.5 + random(`g${k}`)) % 1;
              const px = x + 20 + f * (w - 40);
              const swirl =
                Math.sin(t * 8 + k) *
                (h / 2 - 30) *
                (0.3 + 0.7 * random(`gs${k}`));
              const calor = 1 - f;
              return (
                <circle
                  key={k}
                  cx={px}
                  cy={y + swirl}
                  r={8 + 6 * calor}
                  fill={calor > 0.5 ? C.orange : "#C8C4D8"}
                  opacity={gas * (0.4 + 0.6 * calor)}
                />
              );
            })
          : null}
      </g>
    </g>
  );
};

// Cañón esquemático con proyectil y nube de gas a la salida
export const Salida: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly t: number;
  readonly boom: number;
  readonly suave?: boolean;
}> = ({ x, y, t, boom, suave = false }) => (
  <g>
    <rect
      x={x - 400}
      y={y - 40}
      width={400}
      height={80}
      rx={14}
      fill="#3A3A4A"
      stroke="#8A8A9A"
      strokeWidth={6}
    />
    {boom > 0
      ? new Array(16).fill(0).map((_, k) => {
          const a = ((k / 16) * 2 - 1) * (suave ? 0.4 : 1.1);
          const d = (suave ? 80 : 240) * boom + 20 * Math.sin(t * 10 + k);
          return (
            <circle
              key={k}
              cx={x + 20 + Math.cos(a) * d}
              cy={y + Math.sin(a) * d}
              r={(suave ? 16 : 34) * (1 - boom * 0.4)}
              fill={k % 2 ? C.orange : C.yellow}
              opacity={(1 - boom) * 0.9}
            />
          );
        })
      : null}
    <rect
      x={x + 40 + boom * 500}
      y={y - 16}
      width={60}
      height={32}
      rx={16}
      fill="#C8A060"
    />
  </g>
);

// Bala con cono de Mach (chasquido supersónico)
export const Mach: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly op: number;
}> = ({ x, y, op }) => (
  <g opacity={op}>
    <rect x={x} y={y - 16} width={70} height={32} rx={16} fill="#C8A060" />
    {[0, 1, 2].map((k) => (
      <path
        key={k}
        d={`M ${x - 40 - k * 90} ${y - 140 - k * 60} L ${x + 10} ${y} L ${x - 40 - k * 90} ${y + 140 + k * 60}`}
        stroke={C.cyan}
        strokeWidth={6}
        fill="none"
        opacity={1 - k * 0.3}
      />
    ))}
    <text
      x={x - 200}
      y={y - 240}
      textAnchor="middle"
      fill={C.cyan}
      fontFamily={mono}
      fontSize={40}
      fontWeight={700}
    >
      ¡crac!
    </text>
  </g>
);

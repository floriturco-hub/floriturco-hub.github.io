import { C, mono } from "../theme";

export const METAL = "#8C88A8";
export const ORO = "#C8A048";

// Esfera de reloj genérica (sin marcas). El segundero salta (cuarzo) o se desliza a 8 pasos/s (automático).
export const Reloj: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly r: number;
  readonly t: number;
  readonly tipo: "cuarzo" | "automatico";
  readonly etiqueta?: string;
}> = ({ x, y, r, t, tipo, etiqueta }) => {
  const segundos = tipo === "cuarzo" ? Math.floor(t) : Math.floor(t * 8) / 8;
  const aSeg = (segundos % 60) * 6;
  const aMin = 50 + t * 0.1;
  const aHor = 300 + t * 0.008;
  const caja = tipo === "cuarzo" ? "#5A5675" : ORO;
  return (
    <g>
      <rect x={x - r * 0.42} y={y - r * 1.75} width={r * 0.84} height={r * 0.8} rx={r * 0.1} fill="#2A2350" />
      <rect x={x - r * 0.42} y={y + r * 0.95} width={r * 0.84} height={r * 0.8} rx={r * 0.1} fill="#2A2350" />
      <circle cx={x} cy={y} r={r * 1.12} fill={caja} />
      {tipo === "automatico"
        ? new Array(60).fill(0).map((_, k) => (
            <line key={k} x1={x + Math.cos((k * 6 * Math.PI) / 180) * r * 1.02} y1={y + Math.sin((k * 6 * Math.PI) / 180) * r * 1.02} x2={x + Math.cos((k * 6 * Math.PI) / 180) * r * 1.1} y2={y + Math.sin((k * 6 * Math.PI) / 180) * r * 1.1} stroke="#8A6A28" strokeWidth={2} />
          ))
        : null}
      <rect x={x + r * 1.1} y={y - r * 0.1} width={r * 0.14} height={r * 0.2} rx={3} fill={caja} />
      <circle cx={x} cy={y} r={r} fill={tipo === "cuarzo" ? "#1A1636" : "#14284A"} />
      {new Array(12).fill(0).map((_, k) => {
        const a = (k * 30 * Math.PI) / 180;
        return <line key={k} x1={x + Math.sin(a) * r * 0.78} y1={y - Math.cos(a) * r * 0.78} x2={x + Math.sin(a) * r * 0.92} y2={y - Math.cos(a) * r * 0.92} stroke={C.white} strokeWidth={k % 3 === 0 ? r * 0.05 : r * 0.025} strokeLinecap="round" />;
      })}
      <line x1={x} y1={y} x2={x + Math.sin((aHor * Math.PI) / 180) * r * 0.5} y2={y - Math.cos((aHor * Math.PI) / 180) * r * 0.5} stroke={C.white} strokeWidth={r * 0.07} strokeLinecap="round" />
      <line x1={x} y1={y} x2={x + Math.sin((aMin * Math.PI) / 180) * r * 0.75} y2={y - Math.cos((aMin * Math.PI) / 180) * r * 0.75} stroke={C.white} strokeWidth={r * 0.05} strokeLinecap="round" />
      <line x1={x - Math.sin((aSeg * Math.PI) / 180) * r * 0.15} y1={y + Math.cos((aSeg * Math.PI) / 180) * r * 0.15} x2={x + Math.sin((aSeg * Math.PI) / 180) * r * 0.85} y2={y - Math.cos((aSeg * Math.PI) / 180) * r * 0.85} stroke={C.red} strokeWidth={r * 0.02} strokeLinecap="round" />
      <circle cx={x} cy={y} r={r * 0.05} fill={C.red} />
      {etiqueta ? (
        <text x={x} y={y + r * 0.45} textAnchor="middle" fill={C.grey} fontFamily={mono} fontSize={r * 0.12} fontWeight={700}>
          {etiqueta}
        </text>
      ) : null}
    </g>
  );
};

// Rueda dentada
export const Rueda: React.FC<{ readonly x: number; readonly y: number; readonly r: number; readonly dientes: number; readonly angulo: number; readonly color?: string }> = ({
  x,
  y,
  r,
  dientes,
  angulo,
  color = ORO,
}) => (
  <g transform={`translate(${x} ${y}) rotate(${angulo})`}>
    <circle r={r} fill="none" stroke={color} strokeWidth={Math.max(3, r * 0.12)} />
    {new Array(dientes).fill(0).map((_, k) => (
      <rect key={k} x={-r * 0.08} y={-r - r * 0.18} width={r * 0.16} height={r * 0.22} fill={color} transform={`rotate(${(k * 360) / dientes})`} />
    ))}
    {[0, 1, 2, 3].map((k) => (
      <line key={k} x1={0} y1={0} x2={0} y2={-r} stroke={color} strokeWidth={Math.max(2, r * 0.08)} transform={`rotate(${k * 90})`} />
    ))}
    <circle r={r * 0.15} fill={color} />
  </g>
);

import { C, mono } from "../theme";

type Props = {
  readonly x: number;
  readonly y: number;
  readonly ancho: number;
  readonly alto: number;
  readonly trazo: number; // 0..1 cuánto de la línea está dibujada
  readonly curva: number; // 0 = recta (óhmico), 1 = se curva (calor)
  readonly puntos: number; // 0..2 puntos medidos visibles
  readonly opacidad: number;
};

// Gráfica corriente-voltaje: recta por el origen (ley de Ohm) que puede curvarse
export const GraficaIV: React.FC<Props> = ({ x, y, ancho, alto, trazo, curva, puntos, opacidad }) => {
  const ox = x + 110;
  const oy = y + alto - 90;
  const w = ancho - 170;
  const h = alto - 190;
  const corriente = (v: number) => v - 0.42 * curva * v * v; // v en 0..1
  const mapa = (v: number) => [ox + v * w, oy - corriente(v) * h] as const;
  const linea: string[] = [];
  for (let v = 0; v <= trazo + 1e-6; v += 0.01) {
    const [px, py] = mapa(v);
    linea.push(`${px.toFixed(1)},${py.toFixed(1)}`);
  }
  const color = curva > 0.05 ? C.orange : C.yellow;
  return (
    <g opacity={opacidad}>
      <rect x={x} y={y} width={ancho} height={alto} rx={24} fill={C.card} stroke={C.cardBorder} strokeWidth={2} />
      <line x1={ox} y1={oy} x2={ox + w + 20} y2={oy} stroke={C.grey} strokeWidth={3} opacity={0.6} />
      <line x1={ox} y1={oy} x2={ox} y2={oy - h - 20} stroke={C.grey} strokeWidth={3} opacity={0.6} />
      <text x={ox + w + 20} y={oy + 50} textAnchor="end" fill={C.yellow} fontFamily={mono} fontSize={32} fontWeight={700}>
        voltaje V
      </text>
      <text x={ox - 20} y={oy - h - 40} fill={C.cyan} fontFamily={mono} fontSize={32} fontWeight={700}>
        corriente I
      </text>
      {linea.length > 1 ? (
        <polyline points={linea.join(" ")} fill="none" stroke={color} strokeWidth={7} strokeLinecap="round" />
      ) : null}
      {[0.4, 0.8].map((v, k) => {
        const visible = Math.min(1, Math.max(0, puntos - k));
        if (visible <= 0) {
          return null;
        }
        const [px, py] = mapa(v);
        return (
          <g key={k} opacity={visible}>
            <line x1={px} y1={oy} x2={px} y2={py} stroke={C.grey} strokeWidth={2} strokeDasharray="8 8" />
            <line x1={ox} y1={py} x2={px} y2={py} stroke={C.grey} strokeWidth={2} strokeDasharray="8 8" />
            <circle cx={px} cy={py} r={14 * visible} fill={C.white} />
          </g>
        );
      })}
    </g>
  );
};

import { random } from "remotion";
import { C, mono } from "../theme";

export const BACTERIA = "#8CCB5A";

// Alimentos del experimento (y la galleta del gancho)
export const Comida: React.FC<{ readonly tipo: string; readonly x: number; readonly y: number; readonly s?: number; readonly rot?: number }> = ({ tipo, x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    {tipo === "galleta" ? (
      <g>
        <circle r={70} fill="#C8925A" stroke="#9A6A3A" strokeWidth={5} />
        {[[-25, -20], [20, -30], [30, 15], [-15, 25], [0, 0]].map(([cx, cy], k) => (
          <circle key={k} cx={cx} cy={cy} r={9} fill="#5A3A22" />
        ))}
      </g>
    ) : null}
    {tipo === "sandia" ? (
      <g>
        <path d="M -90 0 A 90 90 0 0 0 90 0 Z" fill="#3FA86A" />
        <path d="M -78 0 A 78 78 0 0 0 78 0 Z" fill="#E8414F" />
        {[-40, -10, 20, 45].map((cx, k) => (
          <ellipse key={k} cx={cx} cy={22 + (k % 2) * 16} rx={5} ry={9} fill="#2A1A1A" />
        ))}
        {[0, 1, 2].map((k) => (
          <path key={`g${k}`} d={`M ${-30 + k * 30} ${-14} q 6 -14 0 -22 q -6 8 0 22`} fill="#7AC8F0" opacity={0.85} />
        ))}
      </g>
    ) : null}
    {tipo === "pan" || tipo === "panMantequilla" ? (
      <g>
        <path d="M -70 50 L -70 -20 Q -80 -70 -30 -70 Q 0 -90 30 -70 Q 80 -70 70 -20 L 70 50 Z" fill="#E8C890" stroke="#B8905A" strokeWidth={6} />
        {tipo === "panMantequilla" ? <path d="M -50 30 L -50 -15 Q -55 -50 -20 -50 L 40 -50 Q 55 -45 50 -15 L 50 30 Z" fill="#F8E070" opacity={0.85} /> : null}
      </g>
    ) : null}
    {tipo === "gomita" ? (
      <g>
        <circle cx={-26} cy={-50} r={18} fill="#E8703C" />
        <circle cx={26} cy={-50} r={18} fill="#E8703C" />
        <ellipse cx={0} cy={0} rx={50} ry={60} fill="#E8703C" />
        <ellipse cx={-14} cy={-12} rx={10} ry={16} fill="#FFFFFF" opacity={0.35} />
      </g>
    ) : null}
  </g>
);

// Superficie de suelo con bacterias
export const Suelo: React.FC<{ readonly tipo: "baldosa" | "acero" | "madera" | "alfombra"; readonly x: number; readonly y: number; readonly w: number; readonly h: number; readonly bacterias?: number; readonly t: number }> = ({
  tipo,
  x,
  y,
  w,
  h,
  bacterias = 0,
  t,
}) => {
  const fondo = { baldosa: "#D8D4E8", acero: "#A8A4B8", madera: "#8A6A48", alfombra: "#7A3A5A" }[tipo];
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={10} fill={fondo} />
      {tipo === "baldosa"
        ? new Array(Math.floor(w / 120)).fill(0).map((_, k) => <line key={k} x1={x + (k + 1) * 120} y1={y} x2={x + (k + 1) * 120} y2={y + h} stroke="#A8A4B8" strokeWidth={4} />)
        : null}
      {tipo === "madera"
        ? new Array(4).fill(0).map((_, k) => <line key={k} x1={x} y1={y + (k + 1) * (h / 5)} x2={x + w} y2={y + (k + 1) * (h / 5)} stroke="#6A4E32" strokeWidth={3} />)
        : null}
      {tipo === "alfombra"
        ? new Array(Math.floor(w / 14)).fill(0).map((_, k) => <line key={k} x1={x + k * 14 + 7} y1={y} x2={x + k * 14 + 7 + 4} y2={y - 14} stroke="#9A4A7A" strokeWidth={5} strokeLinecap="round" />)
        : null}
      {new Array(bacterias).fill(0).map((_, k) => (
        <ellipse
          key={k}
          cx={x + 10 + random(`bx${k}`) * (w - 20)}
          cy={y + 6 + random(`by${k}`) * Math.min(30, h - 10) + Math.sin(t * 3 + k) * 2}
          rx={9}
          ry={5}
          fill={BACTERIA}
          transform={`rotate(${random(`br${k}`) * 180} ${x + 10 + random(`bx${k}`) * (w - 20)} ${y + 6 + random(`by${k}`) * Math.min(30, h - 10)})`}
        />
      ))}
    </g>
  );
};

// Cronómetro grande
export const Cronometro: React.FC<{ readonly x: number; readonly y: number; readonly segundos: number; readonly color?: string }> = ({ x, y, segundos, color = C.white }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={120} fill={C.card} stroke={color} strokeWidth={8} />
    <rect x={-20} y={-150} width={40} height={24} rx={6} fill={color} />
    <path d={`M 0 0 L 0 -100 A 100 100 0 ${(segundos % 5) / 5 > 0.5 ? 1 : 0} 1 ${Math.sin(((segundos % 5) / 5) * Math.PI * 2) * 100} ${-Math.cos(((segundos % 5) / 5) * Math.PI * 2) * 100} Z`} fill={color} opacity={0.2} />
    <text y={30} textAnchor="middle" fill={color} fontFamily={mono} fontSize={90} fontWeight={700}>
      {segundos.toFixed(1).replace(".", ",")}
    </text>
  </g>
);

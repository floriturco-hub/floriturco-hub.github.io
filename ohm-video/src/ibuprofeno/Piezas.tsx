import { C, mono } from "../theme";

// Caja de medicamento genérica (sin logos reales)
export const Caja: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s?: number;
  readonly marca?: boolean;
  readonly texto?: string;
  readonly sub?: string;
  readonly color?: string;
  readonly rayosX?: number; // 0..1 deja ver la pastilla de dentro
  readonly pastilla?: string;
}> = ({ x, y, s = 1, marca = false, texto = "IBUPROFENO", sub = "400 mg", color, rayosX = 0, pastilla = "#F4F0F8" }) => {
  const base = color ?? (marca ? "#D84A6A" : "#E8E6F0");
  const tinta = marca ? "#FFFFFF" : "#3A3360";
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* lateral 3D */}
      <path d="M 150 -110 L 190 -140 L 190 120 L 150 150 Z" fill={base} opacity={0.7} />
      <path d="M -150 -110 L -110 -140 L 190 -140 L 150 -110 Z" fill={base} opacity={0.85} />
      <rect x={-150} y={-110} width={300} height={260} rx={6} fill={base} />
      {marca ? (
        <g>
          <path d="M -150 60 Q 0 0 150 60 L 150 150 L -150 150 Z" fill="#FFFFFF" opacity={0.18} />
          <circle cx={100} cy={-62} r={28} fill="#F8C848" />
          <text x={100} y={-54} textAnchor="middle" fill="#7A3A10" fontFamily={mono} fontSize={22} fontWeight={700}>
            ®
          </text>
        </g>
      ) : (
        <rect x={-150} y={-110} width={300} height={44} fill="#B8B4C8" />
      )}
      <text x={-126} y={marca ? 10 : 2} fill={tinta} fontFamily={mono} fontSize={marca ? 38 : 34} fontWeight={700}>
        {texto}
      </text>
      <text x={-126} y={marca ? 54 : 46} fill={tinta} fontFamily={mono} fontSize={26} opacity={0.85}>
        {sub}
      </text>
      {/* Rayos X: el contenido */}
      {rayosX > 0 ? (
        <g opacity={rayosX}>
          <rect x={-150} y={-110} width={300} height={260} rx={6} fill="#0B091D" opacity={0.82} />
          {[-80, 0, 80].map((px) =>
            [-40, 50].map((py) => <Pastilla key={`${px}${py}`} x={px} y={py + 20} s={0.55} color={pastilla} />),
          )}
        </g>
      ) : null}
    </g>
  );
};

// Pastilla vista de frente (forma configurable)
export const Pastilla: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s?: number;
  readonly color?: string;
  readonly forma?: "redonda" | "capsula" | "ovalada";
  readonly brillo?: number;
  readonly rot?: number;
}> = ({ x, y, s = 1, color = "#F4F0F8", forma = "redonda", brillo = 0.35, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    {forma === "redonda" ? (
      <g>
        <circle r={60} fill={color} stroke="#00000033" strokeWidth={4} />
        <line x1={-44} y1={0} x2={44} y2={0} stroke="#00000030" strokeWidth={5} />
      </g>
    ) : null}
    {forma === "ovalada" ? <ellipse rx={80} ry={46} fill={color} stroke="#00000033" strokeWidth={4} /> : null}
    {forma === "capsula" ? (
      <g>
        <rect x={-90} y={-38} width={180} height={76} rx={38} fill={color} />
        <path d="M 0 -38 L 52 -38 A 38 38 0 0 1 52 38 L 0 38 Z" fill="#FFFFFF" opacity={0.55} />
      </g>
    ) : null}
    <ellipse cx={-20} cy={-22} rx={22} ry={10} fill="#FFFFFF" opacity={brillo} />
  </g>
);

// Molécula de ibuprofeno en fórmula de esqueleto
export const Molecula: React.FC<{ readonly x: number; readonly y: number; readonly s?: number; readonly color?: string; readonly dibujo?: number }> = ({
  x,
  y,
  s = 1,
  color = C.white,
  dibujo = 1,
}) => {
  const r = 70;
  const hex = new Array(6).fill(0).map((_, k) => {
    const a = (Math.PI / 3) * k + Math.PI / 6;
    return [Math.cos(a) * r, Math.sin(a) * r];
  });
  const anillo = `M ${hex.map((p) => p.join(" ")).join(" L ")} Z`;
  // isobutilo a la izquierda, ácido propanoico a la derecha
  const izq = "M -60.6 0 L -121 -35 L -181 0 L -241 -35 M -181 0 L -181 70";
  const der = "M 60.6 0 L 121 -35 L 181 0 M 121 -35 L 121 -105";
  const acido = "M 181 0 L 241 -35";
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill="none" stroke={color} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round">
      <g strokeDasharray={1800} strokeDashoffset={1800 * (1 - dibujo)}>
        <path d={anillo} />
        <path d={`M ${hex[1][0] * 0.72} ${hex[1][1] * 0.72} L ${hex[2][0] * 0.72} ${hex[2][1] * 0.72} M ${hex[3][0] * 0.72} ${hex[3][1] * 0.72} L ${hex[4][0] * 0.72} ${hex[4][1] * 0.72} M ${hex[5][0] * 0.72} ${hex[5][1] * 0.72} L ${hex[0][0] * 0.72} ${hex[0][1] * 0.72}`} />
        <path d={izq} />
        <path d={der} />
        <path d={acido} />
        <path d="M 181 0 L 181 62 M 195 0 L 195 62" />
      </g>
      <g opacity={dibujo > 0.85 ? (dibujo - 0.85) / 0.15 : 0} stroke="none">
        <text x={188} y={112} textAnchor="middle" fill={C.red} fontFamily={mono} fontSize={48} fontWeight={700}>O</text>
        <text x={268} y={-38} fill={C.red} fontFamily={mono} fontSize={48} fontWeight={700}>OH</text>
      </g>
    </g>
  );
};

// Enzima COX: una forma redondeada con un "bolsillo" donde encaja la molécula
export const Enzima: React.FC<{ readonly x: number; readonly y: number; readonly s?: number; readonly bloqueada?: number; readonly t: number }> = ({ x, y, s = 1, bloqueada = 0, t }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path
      d={`M -200 -40 Q -230 -170 -90 -190 Q 20 -215 120 -160 Q 230 -110 210 10 Q 200 160 60 190 Q -90 220 -170 120 Q -230 60 -200 -40 Z`}
      fill="#3A2A6A"
      stroke={C.purpleLight}
      strokeWidth={6}
      transform={`rotate(${Math.sin(t * 1.4) * 2})`}
    />
    {/* bolsillo activo */}
    <path d="M 210 -40 L 60 -40 Q 30 0 60 40 L 210 40" fill="#0B091D" stroke={bloqueada > 0.5 ? C.yellow : C.purpleLight} strokeWidth={6} />
    <text x={-60} y={20} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={64} fontWeight={700}>
      COX
    </text>
  </g>
);

// Mazo de juez
export const Mazo: React.FC<{ readonly x: number; readonly y: number; readonly s?: number; readonly golpe: number }> = ({ x, y, s = 1, golpe }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-120} y={70} width={240} height={36} rx={8} fill="#7A5232" />
    <g transform={`rotate(${-35 + 35 * golpe} 110 20)`}>
      <rect x={-110} y={-10} width={200} height={22} rx={8} fill="#9A6A42" />
      <rect x={-150} y={-55} width={80} height={110} rx={14} fill="#B8804E" />
      <rect x={-150} y={-55} width={80} height={18} rx={6} fill="#8A5A32" />
      <rect x={-150} y={37} width={80} height={18} rx={6} fill="#8A5A32" />
    </g>
  </g>
);

// Icono de dolor / fiebre / inflamación
export const Sintoma: React.FC<{ readonly tipo: "dolor" | "fiebre" | "inflamacion"; readonly x: number; readonly y: number; readonly s?: number; readonly color?: string }> = ({ tipo, x, y, s = 1, color = C.orange }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {tipo === "dolor" ? <path d="M 10 -70 L -30 5 L 5 5 L -15 70 L 40 -15 L 5 -15 L 25 -70 Z" fill={color} /> : null}
    {tipo === "fiebre" ? (
      <g>
        <rect x={-14} y={-75} width={28} height={110} rx={14} fill="none" stroke={color} strokeWidth={7} />
        <circle cy={50} r={28} fill={color} />
        <rect x={-6} y={-30} width={12} height={70} fill={color} />
      </g>
    ) : null}
    {tipo === "inflamacion" ? (
      <g>
        <circle r={55} fill={color} opacity={0.35} />
        <circle r={36} fill={color} opacity={0.7} />
        <circle r={16} fill={color} />
      </g>
    ) : null}
  </g>
);

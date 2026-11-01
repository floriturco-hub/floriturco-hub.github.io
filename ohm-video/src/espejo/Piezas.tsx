import { C, mono } from "../theme";

const PIEL = "#1A1636";
const TRAZO = "#8C88A8";
const PELO = "#2A2350";
const PIERNA = "#3A3360";

// Persona de frente o de espaldas. Origen en la base del cuello.
// ladoReloj: lado de la PANTALLA donde está la mano con el reloj amarillo (+1 derecha, -1 izquierda).
export const Persona: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s?: number;
  readonly vista: "espalda" | "frente";
  readonly ladoReloj?: 1 | -1;
  readonly levanta?: number;
  readonly op?: number;
  readonly tinte?: string;
}> = ({ x, y, s = 1, vista, ladoReloj = 1, levanta = 0, op = 1, tinte = C.purple }) => {
  const brazo = (lado: 1 | -1, sube: number) => {
    const sx = lado * 100;
    const sy = 30;
    const ex = lado * (150 + 40 * sube);
    const ey = 175 - 330 * sube;
    const hx = lado * (140 + 30 * sube);
    const hy = 320 - 600 * sube;
    return { sx, sy, ex, ey, hx, hy };
  };
  const brazos = ([-1, 1] as const).map((lado) => ({ lado, ...brazo(lado, lado === ladoReloj ? levanta : 0) }));
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={op}>
      {/* Piernas */}
      <rect x={-80} y={320} width={70} height={340} rx={30} fill={PIERNA} />
      <rect x={10} y={320} width={70} height={340} rx={30} fill={PIERNA} />
      {/* Brazos */}
      {brazos.map((b) => (
        <g key={b.lado}>
          <path d={`M ${b.sx} ${b.sy} L ${b.ex} ${b.ey} L ${b.hx} ${b.hy}`} stroke={tinte} strokeWidth={46} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx={b.hx} cy={b.hy} r={27} fill={PIEL} stroke={TRAZO} strokeWidth={6} />
          {b.lado === ladoReloj ? (
            <g transform={`translate(${b.ex + (b.hx - b.ex) * 0.72} ${b.ey + (b.hy - b.ey) * 0.72}) rotate(${(Math.atan2(b.hy - b.ey, b.hx - b.ex) * 180) / Math.PI + 90})`}>
              <rect x={-30} y={-16} width={60} height={32} rx={8} fill={C.yellow} />
              <circle r={10} fill="#7A5A10" />
            </g>
          ) : null}
        </g>
      ))}
      {/* Torso */}
      <path d="M -112 10 Q -120 0 -100 -6 L 100 -6 Q 120 0 112 10 L 85 340 L -85 340 Z" fill={tinte} stroke={C.purpleLight} strokeWidth={6} />
      {/* Cuello y cabeza */}
      <rect x={-24} y={-40} width={48} height={44} fill={PIEL} />
      <circle cy={-115} r={78} fill={vista === "espalda" ? PELO : PIEL} stroke={TRAZO} strokeWidth={8} />
      {vista === "espalda" ? (
        <g>
          <ellipse cx={-80} cy={-110} rx={12} ry={22} fill={PIEL} stroke={TRAZO} strokeWidth={5} />
          <ellipse cx={80} cy={-110} rx={12} ry={22} fill={PIEL} stroke={TRAZO} strokeWidth={5} />
          <path d="M -60 -160 Q 0 -200 60 -160" stroke="#3E3670" strokeWidth={6} fill="none" />
          <path d="M -50 -120 Q 0 -150 50 -120" stroke="#3E3670" strokeWidth={6} fill="none" />
        </g>
      ) : (
        <g>
          <path d="M -78 -130 Q -70 -205 0 -196 Q 70 -205 78 -130 Q 60 -170 0 -168 Q -60 -170 -78 -130 Z" fill={PELO} />
          <circle cx={-28} cy={-118} r={9} fill={C.white} />
          <circle cx={28} cy={-118} r={9} fill={C.white} />
          <path d="M 0 -108 L -8 -82 L 6 -82" stroke={TRAZO} strokeWidth={5} fill="none" strokeLinejoin="round" />
          <path d="M -22 -62 Q 0 -50 22 -62" stroke={TRAZO} strokeWidth={5} fill="none" strokeLinecap="round" />
        </g>
      )}
    </g>
  );
};

// Marco de espejo con cristal y reflejos
export const Espejo: React.FC<{ readonly x: number; readonly y: number; readonly w: number; readonly h: number; readonly children?: React.ReactNode; readonly id: string; readonly brillo?: number }> = ({
  x,
  y,
  w,
  h,
  children,
  id,
  brillo = 1,
}) => (
  <g>
    <defs>
      <clipPath id={`cristal-${id}`}>
        <rect x={x} y={y} width={w} height={h} rx={18} />
      </clipPath>
      <linearGradient id={`grad-${id}`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#3A4A7A" stopOpacity={0.55} />
        <stop offset="1" stopColor="#141A3A" stopOpacity={0.55} />
      </linearGradient>
    </defs>
    <rect x={x - 22} y={y - 22} width={w + 44} height={h + 44} rx={30} fill="#2E2A40" stroke="#5A5478" strokeWidth={6} />
    <rect x={x} y={y} width={w} height={h} rx={18} fill={`url(#grad-${id})`} />
    <g clipPath={`url(#cristal-${id})`}>
      {children}
      <g opacity={0.18 * brillo}>
        <path d={`M ${x + w * 0.1} ${y + h} L ${x + w * 0.45} ${y} L ${x + w * 0.58} ${y} L ${x + w * 0.23} ${y + h} Z`} fill="#FFFFFF" />
        <path d={`M ${x + w * 0.66} ${y + h} L ${x + w * 0.95} ${y} L ${x + w} ${y} L ${x + w * 0.74} ${y + h} Z`} fill="#FFFFFF" />
      </g>
    </g>
  </g>
);

// Persona vista desde arriba. Mira hacia arriba (-y) salvo rotación. La mano derecha lleva el reloj amarillo.
// espejado: reflejo especular en el eje de profundidad (scale 1,-1).
export const Planta: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s?: number;
  readonly rot?: number;
  readonly espejado?: boolean;
  readonly color?: string;
  readonly op?: number;
  readonly flecha?: number;
}> = ({ x, y, s = 1, rot = 0, espejado = false, color = C.purple, op = 1, flecha = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s} ${espejado ? -s : s})`} opacity={op}>
    {flecha > 0 ? (
      <g opacity={flecha}>
        <line x1={0} y1={-70} x2={0} y2={-200} stroke={C.cyan} strokeWidth={10} strokeLinecap="round" />
        <path d="M -26 -180 L 0 -215 L 26 -180" stroke={C.cyan} strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    ) : null}
    <ellipse rx={120} ry={46} fill={color} stroke={C.purpleLight} strokeWidth={6} />
    <circle cx={-128} cy={0} r={24} fill={PIEL} stroke={TRAZO} strokeWidth={5} />
    <circle cx={128} cy={0} r={24} fill={C.yellow} stroke="#7A5A10" strokeWidth={5} />
    <circle cy={0} r={46} fill={PELO} stroke={TRAZO} strokeWidth={6} />
    <path d="M -16 -42 L 0 -72 L 16 -42 Z" fill={PIEL} stroke={TRAZO} strokeWidth={5} strokeLinejoin="round" />
  </g>
);

// Ambulancia vista de frente; el rótulo del capó va escrito al revés
export const Ambulancia: React.FC<{ readonly x: number; readonly y: number; readonly s?: number; readonly t: number; readonly reves?: boolean }> = ({ x, y, s = 1, t, reves = true }) => {
  const parpadeo = Math.sin(t * 12) > 0;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* Barra de luces */}
      <rect x={-150} y={-262} width={140} height={44} rx={14} fill={parpadeo ? C.red : "#5A2030"} />
      <rect x={10} y={-262} width={140} height={44} rx={14} fill={parpadeo ? "#2A3A6A" : C.cyan} />
      {/* Carrocería */}
      <rect x={-270} y={-220} width={540} height={430} rx={46} fill="#E8E6F0" stroke="#B8B4C8" strokeWidth={6} />
      <path d="M -220 -180 L 220 -180 L 240 -40 L -240 -40 Z" fill="#1E2240" stroke="#3A3360" strokeWidth={6} />
      <path d="M -190 -165 L -60 -165 L -120 -60 L -215 -60 Z" fill="#FFFFFF" opacity={0.12} />
      {/* Rótulo del capó */}
      <rect x={-250} y={-12} width={500} height={86} rx={12} fill="#FFFFFF" />
      <text x={0} y={50} textAnchor="middle" fill={C.red} fontFamily={mono} fontSize={58} fontWeight={700} transform={reves ? "scale(-1 1)" : undefined}>
        AMBULANCIA
      </text>
      {/* Faros y parrilla */}
      <rect x={-250} y={100} width={500} height={34} fill={C.red} />
      <circle cx={-195} cy={170} r={28} fill="#F8F0C8" />
      <circle cx={195} cy={170} r={28} fill="#F8F0C8" />
      <rect x={-110} y={150} width={220} height={44} rx={10} fill="#3A3360" />
      {/* Ruedas */}
      <rect x={-250} y={206} width={90} height={60} rx={18} fill="#14121F" />
      <rect x={160} y={206} width={90} height={60} rx={18} fill="#14121F" />
    </g>
  );
};

// Texto en una hoja; invertido muestra la escritura reflejada
export const Hoja: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly w?: number;
  readonly h?: number;
  readonly texto: string;
  readonly transparente?: boolean;
  readonly giro?: number; // 0 = de frente, 1 = girada 180 grados
  readonly invertido?: boolean;
}> = ({ x, y, w = 360, h = 200, texto, transparente = false, giro = 0, invertido = false }) => {
  const sx = Math.cos(giro * Math.PI);
  const deEspaldas = sx < 0;
  return (
    <g transform={`translate(${x} ${y}) scale(${Math.max(0.02, Math.abs(sx))} 1)`}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={12} fill={transparente ? C.cyan : "#F4F2FA"} fillOpacity={transparente ? 0.16 : 1} stroke={transparente ? C.cyan : "#B8B4C8"} strokeWidth={5} />
      {!deEspaldas ? (
        <text x={0} y={22} textAnchor="middle" fill={transparente ? C.white : "#2A2350"} fontFamily={mono} fontSize={64} fontWeight={700} transform={invertido ? "scale(-1 1)" : undefined}>
          {texto}
        </text>
      ) : null}
    </g>
  );
};

// Flecha dibujada (la fuente no tiene flechas)
export const Flecha: React.FC<{ readonly x1: number; readonly y1: number; readonly x2: number; readonly y2: number; readonly color?: string; readonly ancho?: number; readonly op?: number }> = ({
  x1,
  y1,
  x2,
  y2,
  color = C.cyan,
  ancho = 10,
  op = 1,
}) => {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const p = 30;
  return (
    <g opacity={op} stroke={color} strokeWidth={ancho} strokeLinecap="round" strokeLinejoin="round" fill="none">
      <line x1={x1} y1={y1} x2={x2} y2={y2} />
      <path d={`M ${x2 - p * Math.cos(a - 0.5)} ${y2 - p * Math.sin(a - 0.5)} L ${x2} ${y2} L ${x2 - p * Math.cos(a + 0.5)} ${y2 - p * Math.sin(a + 0.5)}`} />
    </g>
  );
};

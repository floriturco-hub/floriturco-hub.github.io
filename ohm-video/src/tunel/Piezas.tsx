import { C, mono } from "../theme";

// Tierra en corte: corteza, manto, núcleo externo e interno, con el túnel vertical
export const Tierra: React.FC<{
  readonly cx: number;
  readonly cy: number;
  readonly R: number;
  readonly tunel?: boolean;
  readonly esfera?: number; // radio de la "Tierra que queda debajo" (0 = sin resaltar)
  readonly calor?: number; // brillo del núcleo
  readonly t: number;
}> = ({ cx, cy, R, tunel = true, esfera = 0, calor = 0, t }) => (
  <g>
    <defs>
      <radialGradient id="manto" cx="50%" cy="50%" r="50%">
        <stop offset="0.5" stopColor="#E8703C" />
        <stop offset="1" stopColor="#8A3420" />
      </radialGradient>
      <radialGradient id="nucleo" cx="50%" cy="50%" r="50%">
        <stop offset="0" stopColor="#FFF1C9" />
        <stop offset="1" stopColor="#F8C848" />
      </radialGradient>
      <filter id="brillo-tierra" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="18" />
      </filter>
    </defs>
    <circle cx={cx} cy={cy} r={R + 18} fill={C.cyan} opacity={0.08} />
    <circle cx={cx} cy={cy} r={R} fill="#2E5A44" />
    <circle cx={cx} cy={cy} r={R * 0.975} fill="url(#manto)" />
    <circle cx={cx} cy={cy} r={R * 0.546} fill="#F0A040" />
    <circle cx={cx} cy={cy} r={R * 0.19 * (1 + calor * 0.04 * Math.sin(t * 6))} fill="url(#nucleo)" />
    {calor > 0 ? <circle cx={cx} cy={cy} r={R * 0.5} fill="#FFD27A" opacity={0.35 * calor} filter="url(#brillo-tierra)" /> : null}
    {esfera > 0 ? (
      <g>
        <circle cx={cx} cy={cy} r={R} fill="#0B091D" opacity={0.45} />
        <circle cx={cx} cy={cy} r={esfera} fill={C.cyan} opacity={0.22} />
        <circle cx={cx} cy={cy} r={esfera} fill="none" stroke={C.cyan} strokeWidth={5} strokeDasharray="14 10" />
      </g>
    ) : null}
    {tunel ? <rect x={cx - 20} y={cy - R - 26} width={40} height={2 * R + 52} rx={10} fill="#0B091D" stroke="#5A5478" strokeWidth={4} /> : null}
  </g>
);

// Persona pequeña cayendo con los brazos arriba
export const Saltador: React.FC<{ readonly x: number; readonly y: number; readonly s?: number; readonly rot?: number; readonly color?: string }> = ({ x, y, s = 1, rot = 0, color = C.white }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <circle cy={-30} r={13} fill={color} />
    <line x1={0} y1={-16} x2={0} y2={16} stroke={color} strokeWidth={8} strokeLinecap="round" />
    <path d="M -18 -36 L 0 -10 L 18 -36" stroke={color} strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M -12 36 L 0 14 L 12 36" stroke={color} strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </g>
);

// Marcador grande (cronómetro o velocímetro)
export const Marcador: React.FC<{ readonly x: number; readonly y: number; readonly titulo: string; readonly valor: string; readonly color?: string; readonly w?: number }> = ({
  x,
  y,
  titulo,
  valor,
  color = C.yellow,
  w = 420,
}) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-w / 2} y={-80} width={w} height={150} rx={22} fill={C.card} stroke={C.cardBorder} strokeWidth={2} />
    <text x={-w / 2 + 28} y={-38} fill={C.grey} fontFamily={mono} fontSize={26}>
      {titulo}
    </text>
    <text x={0} y={44} textAnchor="middle" fill={color} fontFamily={mono} fontSize={68} fontWeight={700}>
      {valor}
    </text>
  </g>
);

// Gráfica: gravedad según la distancia al centro (modelo de densidad uniforme)
export const GraficaGravedad: React.FC<{ readonly x: number; readonly y: number; readonly w: number; readonly h: number; readonly f: number; readonly dibujo: number }> = ({ x, y, w, h, f, dibujo }) => {
  const x0 = x + 70;
  const y0 = y + h - 50;
  const ancho = w - 120;
  const alto = h - 110;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={22} fill={C.card} stroke={C.cardBorder} strokeWidth={2} />
      <text x={x + 30} y={y + 44} fill={C.grey} fontFamily={mono} fontSize={26}>gravedad</text>
      <line x1={x0} y1={y0} x2={x0 + ancho} y2={y0} stroke={C.grey} strokeWidth={3} />
      <line x1={x0} y1={y0} x2={x0} y2={y0 - alto} stroke={C.grey} strokeWidth={3} />
      <text x={x0} y={y0 + 36} textAnchor="middle" fill={C.grey} fontFamily={mono} fontSize={24}>centro</text>
      <text x={x0 + ancho} y={y0 + 36} textAnchor="middle" fill={C.grey} fontFamily={mono} fontSize={24}>superficie</text>
      <line x1={x0} y1={y0} x2={x0 + ancho * dibujo} y2={y0 - alto * dibujo} stroke={C.cyan} strokeWidth={7} strokeLinecap="round" />
      {dibujo >= 1 ? <circle cx={x0 + ancho * f} cy={y0 - alto * f} r={14} fill={C.yellow} /> : null}
    </g>
  );
};

// Gráfica de la oscilación: posición en el túnel según el tiempo
export const GraficaOscilacion: React.FC<{ readonly x: number; readonly y: number; readonly w: number; readonly h: number; readonly dibujo: number; readonly marcas: number }> = ({ x, y, w, h, dibujo, marcas }) => {
  const x0 = x + 60;
  const ym = y + h / 2 + 10;
  const ancho = w - 100;
  const amp = h / 2 - 60;
  const n = Math.max(2, Math.round(120 * dibujo));
  const pts = new Array(n + 1).fill(0).map((_, i) => {
    const u = (i / 120) * 2; // dos ciclos
    return `${x0 + (u / 2) * ancho} ${ym - amp * Math.cos(u * Math.PI * 2)}`;
  });
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={22} fill={C.card} stroke={C.cardBorder} strokeWidth={2} />
      <text x={x + 30} y={y + 44} fill={C.grey} fontFamily={mono} fontSize={26}>posición en el túnel</text>
      <line x1={x0} y1={ym} x2={x0 + ancho} y2={ym} stroke={C.grey} strokeWidth={2} strokeDasharray="6 8" />
      <path d={`M ${pts.join(" L ")}`} stroke={C.yellow} strokeWidth={7} fill="none" strokeLinecap="round" />
      <g opacity={marcas} fontFamily={mono} fontSize={26} fontWeight={700}>
        <line x1={x0 + ancho * 0.25} y1={ym - amp} x2={x0 + ancho * 0.25} y2={ym + amp} stroke={C.cyan} strokeWidth={3} strokeDasharray="6 6" />
        <text x={x0 + ancho * 0.25} y={ym + amp + 34} textAnchor="middle" fill={C.cyan}>42 min</text>
        <line x1={x0 + ancho * 0.5} y1={ym - amp} x2={x0 + ancho * 0.5} y2={ym + amp} stroke={C.orange} strokeWidth={3} strokeDasharray="6 6" />
        <text x={x0 + ancho * 0.5} y={ym + amp + 34} textAnchor="middle" fill={C.orange}>84 min</text>
        <text x={x0 - 14} y={ym - amp + 8} textAnchor="end" fill={C.grey} fontSize={22} fontWeight={400}>aquí</text>
        <text x={x0 - 14} y={ym + amp + 8} textAnchor="end" fill={C.grey} fontSize={22} fontWeight={400}>allá</text>
      </g>
    </g>
  );
};

// Termómetro
export const Termometro: React.FC<{ readonly x: number; readonly y: number; readonly nivel: number; readonly texto: string }> = ({ x, y, nivel, texto }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-22} y={-220} width={44} height={240} rx={22} fill={C.card} stroke={C.white} strokeWidth={5} />
    <rect x={-10} y={10 - 210 * nivel} width={20} height={210 * nivel} rx={10} fill={C.red} />
    <circle cy={40} r={40} fill={C.red} stroke={C.white} strokeWidth={5} />
    <text x={0} y={140} textAnchor="middle" fill={C.red} fontFamily={mono} fontSize={48} fontWeight={700}>
      {texto}
    </text>
  </g>
);

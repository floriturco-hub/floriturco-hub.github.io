import { C, mono } from "../theme";

// Onda de sonido: frecuencia (ciclos en el ancho) y amplitud
export const Onda: React.FC<{ readonly x: number; readonly y: number; readonly w: number; readonly amp: number; readonly ciclos: number; readonly t: number; readonly color: string; readonly grosor?: number }> = ({
  x,
  y,
  w,
  amp,
  ciclos,
  t,
  color,
  grosor = 7,
}) => {
  const pts = new Array(121).fill(0).map((_, i) => {
    const u = i / 120;
    const env = Math.sin(u * Math.PI);
    return `${x + u * w} ${y + Math.sin(u * ciclos * Math.PI * 2 - t * 8) * amp * env}`;
  });
  return <path d={`M ${pts.join(" L ")}`} stroke={color} strokeWidth={grosor} fill="none" strokeLinecap="round" strokeLinejoin="round" />;
};

// Nota de voz genérica (sin logos)
export const NotaVoz: React.FC<{ readonly x: number; readonly y: number; readonly s?: number; readonly t: number; readonly progreso: number }> = ({ x, y, s = 1, t, progreso }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-360} y={-70} width={720} height={140} rx={70} fill="#1E5A4A" />
    <circle cx={-290} cy={0} r={44} fill={C.white} />
    <path d="M -305 -22 L -270 0 L -305 22 Z" fill="#1E5A4A" />
    {new Array(36).fill(0).map((_, k) => {
      const h = 14 + Math.abs(Math.sin(k * 1.7) * 36 + Math.sin(k * 0.6) * 14);
      const activo = k / 36 < progreso;
      return <rect key={k} x={-220 + k * 14} y={-h / 2 + (activo ? Math.sin(t * 12 + k) * 2 : 0)} width={8} height={h} rx={4} fill={activo ? "#9CF0C8" : "#5A8A7A"} />;
    })}
    <text x={300} y={52} textAnchor="end" fill="#9CF0C8" fontFamily={mono} fontSize={24}>0:07</text>
  </g>
);

// Los dos caminos sobre CabezaPerfil (coordenadas de la cabeza sin escalar)
export const Caminos: React.FC<{ readonly t: number; readonly aire: number; readonly hueso: number }> = ({ t, aire, hueso }) => (
  <g>
    {aire > 0
      ? [0, 1, 2].map((k) => {
          const f = (t * 0.7 + k / 3) % 1;
          const r = 60 + f * 260;
          return <path key={k} d={`M ${900 + r * 0.2} ${1060 - r} A ${r} ${r} 0 0 1 ${900 + r * 0.2} ${1060 + r * 0.3}`} stroke={C.cyan} strokeWidth={8} fill="none" opacity={aire * (1 - f)} strokeLinecap="round" />;
        })
      : null}
    {aire > 0 ? (
      <path d="M 960 820 C 900 640 700 620 640 860" stroke={C.cyan} strokeWidth={8} fill="none" strokeDasharray="22 16" strokeDashoffset={-t * 60} opacity={aire} strokeLinecap="round" />
    ) : null}
    {hueso > 0 ? (
      <g opacity={hueso}>
        <path d="M 760 1230 C 720 1150 680 1060 640 960" stroke={C.orange} strokeWidth={10} fill="none" strokeDasharray="10 12" strokeDashoffset={-t * 50} strokeLinecap="round" />
        {[0, 1, 2, 3].map((k) => (
          <path key={k} d={`M ${720 - k * 20} ${1170 - k * 60} q ${10 + 6 * Math.sin(t * 30 + k)} -14 0 -28`} stroke={C.orange} strokeWidth={6} fill="none" strokeLinecap="round" />
        ))}
        <circle cx={590} cy={940} r={30 + 6 * Math.sin(t * 10)} fill={C.orange} opacity={0.35} />
      </g>
    ) : null}
  </g>
);

// Espectro: barras de graves a agudos
export const Espectro: React.FC<{ readonly x: number; readonly y: number; readonly w: number; readonly h: number; readonly refuerzo: number; readonly titulo: string; readonly color: string }> = ({ x, y, w, h, refuerzo, titulo, color }) => {
  const n = 12;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={22} fill={C.card} stroke={C.cardBorder} strokeWidth={2} />
      <text x={x + 30} y={y + 46} fill={color} fontFamily={mono} fontSize={30} fontWeight={700}>{titulo}</text>
      {new Array(n).fill(0).map((_, k) => {
        const base = 0.55 + 0.15 * Math.sin(k * 1.3);
        const extra = refuerzo * Math.max(0, 1 - k / 5) * 0.4;
        const bh = (h - 120) * Math.min(1, base + extra);
        return <rect key={k} x={x + 40 + k * ((w - 80) / n)} y={y + h - 50 - bh} width={(w - 80) / n - 10} height={bh} rx={6} fill={color} opacity={0.85} />;
      })}
      <text x={x + 40} y={y + h - 14} fill={C.grey} fontFamily={mono} fontSize={24}>graves</text>
      <text x={x + w - 40} y={y + h - 14} textAnchor="end" fill={C.grey} fontFamily={mono} fontSize={24}>agudos</text>
    </g>
  );
};

// Micrófono
export const Microfono: React.FC<{ readonly x: number; readonly y: number; readonly s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-60} y={-160} width={120} height={200} rx={60} fill="#5A5478" stroke={C.white} strokeWidth={6} />
    {new Array(5).fill(0).map((_, k) => (
      <line key={k} x1={-40} y1={-120 + k * 30} x2={40} y2={-120 + k * 30} stroke="#8C88A8" strokeWidth={4} />
    ))}
    <path d="M -90 -20 Q -90 100 0 100 Q 90 100 90 -20" stroke={C.white} strokeWidth={8} fill="none" />
    <line x1={0} y1={100} x2={0} y2={180} stroke={C.white} strokeWidth={8} />
    <line x1={-60} y1={180} x2={60} y2={180} stroke={C.white} strokeWidth={8} strokeLinecap="round" />
  </g>
);

// Mano tapando el oído (coordenadas de CabezaPerfil)
export const ManoOido: React.FC<{ readonly op: number }> = ({ op }) => (
  <g opacity={op}>
    <path d="M 560 1080 C 520 980 540 870 610 850 C 680 840 700 900 690 960 C 680 1020 660 1060 640 1100 Z" fill="#3A3360" stroke="#8C88A8" strokeWidth={7} />
    <path d="M 640 1100 L 610 1300" stroke="#3A3360" strokeWidth={70} strokeLinecap="round" />
  </g>
);

// Barras del estudio (cualitativas, sin cifras)
export const BarrasEstudio: React.FC<{ readonly x: number; readonly y: number; readonly p: number }> = ({ x, y, p }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-420} y={-260} width={840} height={520} rx={24} fill={C.card} stroke={C.cardBorder} strokeWidth={2} />
    <text x={-380} y={-200} fill={C.grey} fontFamily={mono} fontSize={28}>cuánto les gusta su propia voz grabada</text>
    <rect x={-300} y={160 - 200 * p} width={180} height={200 * p} rx={12} fill={C.grey} />
    <rect x={120} y={160 - 330 * p} width={180} height={330 * p} rx={12} fill={C.yellow} />
    <text x={-210} y={210} textAnchor="middle" fill={C.grey} fontFamily={mono} fontSize={26} fontWeight={700}>sabían</text>
    <text x={-210} y={242} textAnchor="middle" fill={C.grey} fontFamily={mono} fontSize={22}>que era la suya</text>
    <text x={210} y={210} textAnchor="middle" fill={C.yellow} fontFamily={mono} fontSize={26} fontWeight={700}>no sabían</text>
    <text x={210} y={242} textAnchor="middle" fill={C.yellow} fontFamily={mono} fontSize={22}>que era la suya</text>
  </g>
);

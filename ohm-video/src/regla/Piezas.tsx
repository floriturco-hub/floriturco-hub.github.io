import { C, mono } from "../theme";

export const ROSA = "#F06A8A";

// Calendario mensual con los días de regla marcados
export const Calendario: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s?: number;
  readonly titulo: string;
  readonly dias: number[];
  readonly color?: string;
  readonly progreso?: number; // cuántos días marcados se ven (0..1)
  readonly coinciden?: number[];
}> = ({ x, y, s = 1, titulo, dias, color = ROSA, progreso = 1, coinciden = [] }) => {
  const celda = 62;
  const inicio = 2; // el mes empieza en miércoles
  const visibles = Math.round(dias.length * progreso);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-240} y={-210} width={480} height={440} rx={24} fill={C.card} stroke={C.cardBorder} strokeWidth={2} />
      <rect x={-240} y={-210} width={480} height={70} rx={24} fill={color} opacity={0.9} />
      <rect x={-240} y={-160} width={480} height={20} fill={color} opacity={0.9} />
      <text x={0} y={-162} textAnchor="middle" fill="#0B091D" fontFamily={mono} fontSize={34} fontWeight={700}>
        {titulo}
      </text>
      {["L", "M", "X", "J", "V", "S", "D"].map((d, k) => (
        <text key={d} x={-186 + k * celda} y={-108} textAnchor="middle" fill={C.grey} fontFamily={mono} fontSize={24}>
          {d}
        </text>
      ))}
      {new Array(30).fill(0).map((_, i) => {
        const n = i + 1;
        const pos = i + inicio;
        const cx = -186 + (pos % 7) * celda;
        const cy = -62 + Math.floor(pos / 7) * 56;
        const idx = dias.indexOf(n);
        const marcado = idx >= 0 && idx < visibles;
        const juntos = marcado && coinciden.includes(n);
        return (
          <g key={n}>
            {marcado ? <circle cx={cx} cy={cy - 8} r={24} fill={color} opacity={0.9} /> : null}
            {juntos ? <circle cx={cx} cy={cy - 8} r={28} fill="none" stroke={C.yellow} strokeWidth={4} /> : null}
            <text x={cx} y={cy} textAnchor="middle" fill={marcado ? "#0B091D" : C.white} fontFamily={mono} fontSize={24} fontWeight={marcado ? 700 : 400}>
              {n}
            </text>
          </g>
        );
      })}
    </g>
  );
};

// Residencia universitaria (estudio de 1971)
export const Residencia: React.FC<{ readonly x: number; readonly y: number; readonly s?: number; readonly luces: number }> = ({ x, y, s = 1, luces }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -260 -160 L 0 -290 L 260 -160 Z" fill="#3A3360" stroke={C.purpleLight} strokeWidth={5} />
    <rect x={-240} y={-160} width={480} height={360} fill="#2A2350" stroke={C.purpleLight} strokeWidth={5} />
    {new Array(4).fill(0).map((_, f) =>
      new Array(5).fill(0).map((__, c) => {
        const k = f * 5 + c;
        const on = (k * 7) % 20 < luces * 20;
        return <rect key={k} x={-205 + c * 84} y={-130 + f * 74} width={54} height={46} rx={6} fill={on ? "#F8D890" : "#1A1636"} />;
      }),
    )}
    <rect x={-40} y={130} width={80} height={70} rx={8} fill="#1A1636" />
  </g>
);

// Dos líneas de ciclo que se acercan (lo que se creyó ver)
export const Convergen: React.FC<{ readonly x: number; readonly y: number; readonly w: number; readonly p: number; readonly tachado?: number }> = ({ x, y, w, p, tachado = 0 }) => {
  const a = `M ${x} ${y - 70} C ${x + w * 0.5} ${y - 60} ${x + w * 0.7} ${y - 6} ${x + w} ${y - 4}`;
  const b = `M ${x} ${y + 70} C ${x + w * 0.5} ${y + 60} ${x + w * 0.7} ${y + 6} ${x + w} ${y + 4}`;
  const L = w * 1.15;
  return (
    <g>
      <path d={a} stroke={ROSA} strokeWidth={8} fill="none" strokeDasharray={L} strokeDashoffset={L * (1 - p)} strokeLinecap="round" />
      <path d={b} stroke={C.cyan} strokeWidth={8} fill="none" strokeDasharray={L} strokeDashoffset={L * (1 - p)} strokeLinecap="round" />
      {tachado > 0 ? (
        <g opacity={tachado} stroke={C.red} strokeWidth={12} strokeLinecap="round">
          <line x1={x + w * 0.2} y1={y - 110} x2={x + w * 0.8} y2={y + 110} />
          <line x1={x + w * 0.8} y1={y - 110} x2={x + w * 0.2} y2={y + 110} />
        </g>
      ) : null}
    </g>
  );
};

// Móvil con parejas de puntos que se separan (análisis de una app)
export const AppParejas: React.FC<{ readonly x: number; readonly y: number; readonly s?: number; readonly separa: number }> = ({ x, y, s = 1, separa }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-190} y={-340} width={380} height={680} rx={46} fill="#1A1636" stroke="#5A5478" strokeWidth={6} />
    <rect x={-60} y={-322} width={120} height={18} rx={9} fill="#2E2A40" />
    {new Array(30).fill(0).map((_, k) => {
      const cx = -120 + (k % 5) * 60;
      const cy = -250 + Math.floor(k / 5) * 90;
      const d = 6 + separa * (8 + ((k * 13) % 17));
      const ang = ((k * 47) % 180) * (Math.PI / 180);
      const dx = Math.cos(ang) * d;
      const dy = Math.sin(ang) * d * 0.5;
      return (
        <g key={k}>
          <line x1={cx - dx} y1={cy - dy} x2={cx + dx} y2={cy + dy} stroke={C.grey} strokeWidth={2} opacity={0.6} />
          <circle cx={cx - dx} cy={cy - dy} r={8} fill={ROSA} />
          <circle cx={cx + dx} cy={cy + dy} r={8} fill={C.cyan} />
        </g>
      );
    })}
  </g>
);

// Dos líneas de tiempo de ciclos con distinta duración: coinciden y se separan
export const Derivas: React.FC<{ readonly x: number; readonly y: number; readonly w: number; readonly dias: number; readonly cabezal: number; readonly ciclos: [number, number]; readonly desfase?: number }> = ({
  x,
  y,
  w,
  dias,
  cabezal,
  ciclos,
  desfase = 10,
}) => {
  const esc = w / dias;
  const bloques = (ciclo: number, off: number) => {
    const out: number[] = [];
    for (let d = off; d < dias; d += ciclo) out.push(d);
    return out;
  };
  const a = bloques(ciclos[0], 0);
  const b = bloques(ciclos[1], desfase);
  const solapes = a.flatMap((da) => b.filter((db) => Math.abs(da - db) < 5).map((db) => [Math.max(da, db), Math.min(da, db) + 5]));
  const visible = (d: number) => d <= cabezal * dias;
  return (
    <g>
      <rect x={x - 30} y={y - 150} width={w + 60} height={400} rx={22} fill={C.card} stroke={C.cardBorder} strokeWidth={2} />
      <text x={x} y={y - 92} fill={ROSA} fontFamily={mono} fontSize={34} fontWeight={700}>tú · {ciclos[0]} días</text>
      <text x={x} y={y + 92} fill={C.cyan} fontFamily={mono} fontSize={34} fontWeight={700}>tu amiga · {ciclos[1]} días</text>
      <line x1={x} y1={y - 20} x2={x + w} y2={y - 20} stroke={C.wire} strokeWidth={4} />
      <line x1={x} y1={y + 150} x2={x + w} y2={y + 150} stroke={C.wire} strokeWidth={4} />
      {solapes.filter(([s0]) => visible(s0)).map(([s0, s1], k) => (
        <rect key={`s${k}`} x={x + s0 * esc - 4} y={y - 60} width={(s1 - s0) * esc + 8} height={240} rx={8} fill={C.yellow} opacity={0.22} stroke={C.yellow} strokeWidth={3} />
      ))}
      {a.filter(visible).map((d) => (
        <rect key={`a${d}`} x={x + d * esc} y={y - 44} width={5 * esc} height={48} rx={8} fill={ROSA} />
      ))}
      {b.filter(visible).map((d) => (
        <rect key={`b${d}`} x={x + d * esc} y={y + 126} width={5 * esc} height={48} rx={8} fill={C.cyan} />
      ))}
      <line x1={x + cabezal * w} y1={y - 70} x2={x + cabezal * w} y2={y + 195} stroke={C.white} strokeWidth={4} />
      <text x={x + w} y={y + 232} textAnchor="end" fill={C.grey} fontFamily={mono} fontSize={28}>{Math.round(dias / 30)} meses</text>
    </g>
  );
};

// Reloj de 28 días: tu regla fija, la de tu amiga cae al azar
export const RelojCiclo: React.FC<{ readonly x: number; readonly y: number; readonly R: number; readonly desfase: number; readonly zona: number }> = ({ x, y, R, desfase, zona }) => {
  const arco = (d0: number, d1: number, r: number) => {
    const a0 = (d0 / 28) * Math.PI * 2 - Math.PI / 2;
    const a1 = (d1 / 28) * Math.PI * 2 - Math.PI / 2;
    const large = d1 - d0 > 14 ? 1 : 0;
    return `M ${x + Math.cos(a0) * r} ${y + Math.sin(a0) * r} A ${r} ${r} 0 ${large} 1 ${x + Math.cos(a1) * r} ${y + Math.sin(a1) * r}`;
  };
  const dentro = ((desfase % 28) + 28) % 28;
  const coincide = dentro < 5 || dentro > 23;
  return (
    <g>
      <circle cx={x} cy={y} r={R} fill="none" stroke={C.wire} strokeWidth={40} />
      {new Array(28).fill(0).map((_, k) => {
        const a = (k / 28) * Math.PI * 2 - Math.PI / 2;
        return <line key={k} x1={x + Math.cos(a) * (R - 26)} y1={y + Math.sin(a) * (R - 26)} x2={x + Math.cos(a) * (R - 40)} y2={y + Math.sin(a) * (R - 40)} stroke={C.grey} strokeWidth={3} />;
      })}
      <path d={arco(-5, 5, R)} stroke={C.yellow} strokeWidth={70} fill="none" opacity={0.22 * zona} />
      <path d={arco(0, 5, R)} stroke={ROSA} strokeWidth={40} fill="none" />
      <path d={arco(dentro, dentro + 5, R - 70)} stroke={C.cyan} strokeWidth={30} fill="none" />
      <text x={x} y={y - 10} textAnchor="middle" fill={coincide ? C.yellow : C.grey} fontFamily={mono} fontSize={44} fontWeight={700}>
        {coincide ? "coinciden" : "no coinciden"}
      </text>
      <text x={x} y={y + 40} textAnchor="middle" fill={C.grey} fontFamily={mono} fontSize={26}>ciclo de 28 días</text>
    </g>
  );
};

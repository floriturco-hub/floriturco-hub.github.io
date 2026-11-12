import { random } from "remotion";
import { C, mono } from "../theme";

export const HUESO = "#E8DCC8";
const OSTEOCLASTO = "#A85CC8";
const OSTEOBLASTO = C.cyan;

// Hueso largo (fémur estilizado), horizontal o vertical
export const HuesoLargo: React.FC<{ readonly x: number; readonly y: number; readonly s?: number; readonly rot?: number; readonly grosor?: number; readonly color?: string; readonly corte?: boolean }> = ({
  x,
  y,
  s = 1,
  rot = 0,
  grosor = 1,
  color = HUESO,
  corte = false,
}) => {
  const g = 34 * grosor;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <path d={`M -200 ${-g} L 200 ${-g} L 200 ${g} L -200 ${g} Z`} fill={color} />
      {[-1, 1].map((l) => (
        <g key={l}>
          <circle cx={l * 220} cy={-36} r={48} fill={color} />
          <circle cx={l * 220} cy={36} r={48} fill={color} />
        </g>
      ))}
      {corte ? (
        <g>
          <rect x={-200} y={-g + 12} width={400} height={2 * g - 24} fill="#C89A6A" opacity={0.5} />
          {new Array(26).fill(0).map((_, k) => (
            <circle key={k} cx={-230 + random(`e${k}`) * 460} cy={(random(`f${k}`) - 0.5) * 90} r={6 + random(`r${k}`) * 6} fill="#8A5A3A" opacity={0.5} />
          ))}
        </g>
      ) : null}
    </g>
  );
};

// Esqueleto sencillo de frente
export const Esqueleto: React.FC<{ readonly x: number; readonly y: number; readonly s?: number; readonly color?: string; readonly op?: number; readonly brillo?: number; readonly t?: number }> = ({
  x,
  y,
  s = 1,
  color = HUESO,
  op = 1,
  brillo = 0,
  t = 0,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={op} stroke={color} strokeLinecap="round" fill="none">
    <ellipse cx={0} cy={-330} rx={70} ry={84} fill={color} stroke="none" />
    <circle cx={-26} cy={-340} r={16} fill="#0B091D" stroke="none" />
    <circle cx={26} cy={-340} r={16} fill="#0B091D" stroke="none" />
    <line x1={0} y1={-245} x2={0} y2={60} strokeWidth={20} strokeDasharray="22 8" />
    {new Array(5).fill(0).map((_, k) => (
      <path key={k} d={`M 0 ${-190 + k * 38} Q -110 ${-170 + k * 38} -120 ${-130 + k * 38} M 0 ${-190 + k * 38} Q 110 ${-170 + k * 38} 120 ${-130 + k * 38}`} strokeWidth={12} />
    ))}
    <line x1={-140} y1={-220} x2={140} y2={-220} strokeWidth={16} />
    <path d="M -140 -220 L -190 -40 L -210 120" strokeWidth={18} />
    <path d="M 140 -220 L 190 -40 L 210 120" strokeWidth={18} />
    <path d="M -100 60 Q 0 120 100 60 Q 60 130 0 130 Q -60 130 -100 60 Z" fill={color} stroke="none" />
    <path d="M -60 120 L -80 380 L -80 620" strokeWidth={24} />
    <path d="M 60 120 L 80 380 L 80 620" strokeWidth={24} />
    {brillo > 0
      ? new Array(12).fill(0).map((_, k) => {
          const f = (t * 0.7 + k / 12) % 1;
          const px = (random(`b${k}`) - 0.5) * 400;
          const py = -380 + random(`c${k}`) * 1000;
          return <circle key={k} cx={px} cy={py} r={6 + 10 * Math.sin(f * Math.PI)} fill={C.yellow} stroke="none" opacity={brillo * Math.sin(f * Math.PI)} />;
        })
      : null}
  </g>
);

// Superficie de hueso con un hueco que se excava y se rellena
export const Remodelado: React.FC<{ readonly x: number; readonly y: number; readonly w: number; readonly t: number; readonly excava: number; readonly rellena: number }> = ({ x, y, w, t, excava, rellena }) => {
  const prof = 140 * excava * (1 - rellena);
  const cx = x + w / 2;
  return (
    <g>
      <rect x={x} y={y} width={w} height={360} rx={16} fill={HUESO} />
      <path d={`M ${cx - 180} ${y} Q ${cx} ${y + prof * 2} ${cx + 180} ${y} Z`} fill="#0B091D" />
      {rellena > 0 ? <path d={`M ${cx - 180} ${y} Q ${cx} ${y + 280 * excava} ${cx + 180} ${y} Z`} fill={OSTEOBLASTO} opacity={0.25 * rellena} /> : null}
      {/* Osteoclastos: grandes, varios núcleos */}
      {excava > 0 && rellena < 0.6
        ? [0, 1].map((k) => (
            <g key={k} transform={`translate(${cx - 70 + k * 140} ${y + prof - 30 + Math.sin(t * 3 + k) * 6})`} opacity={1 - rellena}>
              <ellipse rx={70} ry={42} fill={OSTEOCLASTO} />
              {[-30, 0, 30].map((d) => (
                <circle key={d} cx={d} cy={-4} r={9} fill="#5A2A7A" />
              ))}
              {[-40, -10, 20, 50].map((d) => (
                <circle key={`a${d}`} cx={d} cy={46 + ((t * 40 + d) % 30)} r={5} fill={C.yellow} opacity={0.7} />
              ))}
            </g>
          ))
        : null}
      {/* Osteoblastos: pequeños, en fila */}
      {rellena > 0
        ? new Array(7).fill(0).map((_, k) => (
            <circle key={k} cx={cx - 150 + k * 50} cy={y - 26 + 140 * excava * (1 - rellena) * Math.sin(((k + 0.5) / 7) * Math.PI)} r={20} fill={OSTEOBLASTO} opacity={rellena} />
          ))
        : null}
      <text x={x + 20} y={y + 330} fill="#8A6A4A" fontFamily={mono} fontSize={28}>hueso</text>
    </g>
  );
};

// Casco de astronauta
export const Casco: React.FC<{ readonly x: number; readonly y: number; readonly s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle r={150} fill="#E8E6F0" stroke="#8C88A8" strokeWidth={8} />
    <path d="M -110 -30 Q 0 -120 110 -30 Q 120 60 0 80 Q -120 60 -110 -30 Z" fill="#1A1A3A" stroke="#5A5478" strokeWidth={6} />
    <path d="M -70 -40 Q -20 -80 30 -60" stroke="#FFFFFF" strokeWidth={10} fill="none" opacity={0.5} strokeLinecap="round" />
    <rect x={-100} y={120} width={200} height={60} rx={20} fill="#C8C4D8" />
  </g>
);

// Gráfica de masa ósea cayendo
export const GraficaPerdida: React.FC<{ readonly x: number; readonly y: number; readonly w: number; readonly h: number; readonly p: number }> = ({ x, y, w, h, p }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx={22} fill={C.card} stroke={C.cardBorder} strokeWidth={2} />
    <text x={x + 30} y={y + 48} fill={C.grey} fontFamily={mono} fontSize={28}>masa ósea en el espacio</text>
    <line x1={x + 60} y1={y + h - 50} x2={x + w - 40} y2={y + h - 50} stroke={C.grey} strokeWidth={3} />
    <line x1={x + 60} y1={y + 80} x2={x + 60 + (w - 100) * p} y2={y + 80 + (h - 160) * 0.6 * p} stroke={C.red} strokeWidth={8} strokeLinecap="round" />
    <text x={x + w - 40} y={y + h - 14} textAnchor="end" fill={C.grey} fontFamily={mono} fontSize={24}>meses</text>
  </g>
);

// Calcio pasando del hueso a la sangre
export const CalcioSangre: React.FC<{ readonly x: number; readonly y: number; readonly t: number; readonly p: number }> = ({ x, y, t, p }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-420} y={-60} width={840} height={120} rx={60} fill="#B8323A" />
    <rect x={-420} y={-40} width={840} height={80} rx={40} fill="#E8414F" />
    {new Array(8).fill(0).map((_, k) => {
      const f = (t * 0.5 + k / 8) % 1;
      return (
        <g key={k} opacity={p * Math.sin(f * Math.PI)}>
          <circle cx={-360 + k * 100} cy={260 - f * 280} r={22} fill={C.yellow} />
          <text x={-360 + k * 100} y={268 - f * 280} textAnchor="middle" fill="#0B091D" fontFamily={mono} fontSize={20} fontWeight={700}>Ca</text>
        </g>
      );
    })}
  </g>
);

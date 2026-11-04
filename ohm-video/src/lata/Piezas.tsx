import { interpolateColors, random } from "remotion";
import { C, mono } from "../theme";

const METAL = "#B8BCC8";
const CAFE = "#6A3A1E";

// Vapor que sube
export const Vapor: React.FC<{ readonly x: number; readonly y: number; readonly t: number; readonly op: number; readonly ancho?: number }> = ({ x, y, t, op, ancho = 120 }) => (
  <g opacity={op}>
    {new Array(5).fill(0).map((_, k) => {
      const f = (t * 0.6 + k / 5) % 1;
      const px = x + (k - 2) * (ancho / 4) + Math.sin(t * 3 + k) * 14;
      return <path key={k} d={`M ${px} ${y - f * 200} q 20 -30 0 -60 q -20 -30 0 -60`} stroke="#FFFFFF" strokeWidth={10} fill="none" strokeLinecap="round" opacity={(1 - f) * 0.6} />;
    })}
  </g>
);

// Lata autocalentable en corte. calor 0..1, roto: membrana rota, boton: 0..1 presionado
export const Lata: React.FC<{ readonly x: number; readonly y: number; readonly s?: number; readonly corte: number; readonly roto: number; readonly calor: number; readonly boton: number; readonly t: number }> = ({ x, y, s = 1, corte, roto, calor, boton, t }) => {
  const W = 300;
  const H = 560;
  const cafe = interpolateColors(calor, [0, 1], [CAFE, "#9A4A1E"]);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* cuerpo */}
      <rect x={-W / 2} y={-H / 2} width={W} height={H} rx={30} fill={METAL} stroke="#6A6E7A" strokeWidth={6} />
      <rect x={-W / 2} y={-H / 2 + 120} width={W} height={200} fill="#C83A3A" opacity={1 - corte} />
      <text x={0} y={-H / 2 + 240} textAnchor="middle" fill="#FFFFFF" fontFamily={mono} fontSize={48} fontWeight={700} opacity={1 - corte}>CAFÉ</text>
      <g opacity={corte}>
        <rect x={-W / 2 + 14} y={-H / 2 + 40} width={W - 28} height={H - 54} rx={20} fill={cafe} />
        {/* cámara interior */}
        <path d={`M -80 ${H / 2 - 14} L -80 ${-H / 2 + 170} Q 0 ${-H / 2 + 130} 80 ${-H / 2 + 170} L 80 ${H / 2 - 14} Z`} fill={interpolateColors(calor, [0, 1], ["#5A5E6A", "#E8703C"])} stroke="#3A3E4A" strokeWidth={6} />
        {/* cal viva */}
        <path d={`M -74 ${H / 2 - 20} L -74 ${-20} Q 0 ${-50} 74 ${-20} L 74 ${H / 2 - 20} Z`} fill={roto > 0.5 ? "#F0E8D8" : "#F4F2EC"} />
        {new Array(20).fill(0).map((_, k) => (
          <circle key={k} cx={-60 + random(`cv${k}`) * 120} cy={-10 + random(`cy${k}`) * 250} r={4} fill="#C8C4B8" />
        ))}
        {/* bolsa de agua */}
        <rect x={-70} y={-H / 2 + 175} width={140} height={110} rx={20} fill={C.cyan} opacity={0.6 * (1 - roto)} />
        <line x1={-74} y1={-H / 2 + 292} x2={74} y2={-H / 2 + 292} stroke={roto > 0.3 ? "#8A8E9A" : C.white} strokeWidth={6} strokeDasharray={roto > 0.3 ? "12 18" : undefined} />
        {roto > 0
          ? new Array(10).fill(0).map((_, k) => {
              const f = (t * 1.2 + k / 10) % 1;
              return <circle key={`g${k}`} cx={-50 + k * 11} cy={-H / 2 + 290 + f * 220} r={8} fill={C.cyan} opacity={roto * (1 - f) * (calor < 0.95 ? 1 : 0.3)} />;
            })
          : null}
        {calor > 0.05
          ? new Array(10).fill(0).map((_, k) => {
              const f = (t * 0.8 + k / 10) % 1;
              const side = k % 2 ? 1 : -1;
              return <path key={`h${k}`} d={`M ${side * (90 + f * 40)} ${150 - f * 300} q ${side * 12} -14 0 -28`} stroke={C.orange} strokeWidth={6} fill="none" opacity={calor * (1 - f)} />;
            })
          : null}
      </g>
      {/* botón y punzón */}
      <rect x={-40} y={H / 2 - 6 - 20 * boton} width={80} height={30} rx={10} fill={C.yellow} stroke="#A07818" strokeWidth={4} />
      <g opacity={corte}>
        <path d={`M 0 ${H / 2 - 20 - 20 * boton} L 0 ${-H / 2 + 300 - 30 * boton} M -10 ${-H / 2 + 310 - 30 * boton} L 0 ${-H / 2 + 290 - 30 * boton} L 10 ${-H / 2 + 310 - 30 * boton}`} stroke="#3A3E4A" strokeWidth={8} fill="none" />
      </g>
      <ellipse cx={0} cy={-H / 2 + 4} rx={W / 2 - 8} ry={20} fill="#D8DCE4" stroke="#6A6E7A" strokeWidth={5} />
    </g>
  );
};

// Termómetro grande con grados
export const Termometro: React.FC<{ readonly x: number; readonly y: number; readonly grados: number; readonly op: number }> = ({ x, y, grados, op }) => {
  const p = Math.min(1, grados / 80);
  return (
    <g transform={`translate(${x} ${y})`} opacity={op}>
      <rect x={-26} y={-300} width={52} height={360} rx={26} fill={C.card} stroke={C.white} strokeWidth={5} />
      <rect x={-14} y={50 - 340 * p} width={28} height={340 * p} rx={14} fill={grados > 45 ? C.red : C.orange} />
      <circle cx={0} cy={90} r={48} fill={grados > 45 ? C.red : C.orange} stroke={C.white} strokeWidth={5} />
      <text x={70} y={60 - 340 * p} fill={C.white} fontFamily={mono} fontSize={44} fontWeight={700}>{`${Math.round(grados)}°C`}</text>
    </g>
  );
};

// Bolsa calentadora militar
export const Bolsa: React.FC<{ readonly x: number; readonly y: number; readonly s?: number; readonly agua: number; readonly calor: number; readonly t: number }> = ({ x, y, s = 1, agua, calor, t }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -180 -260 L 180 -260 L 200 260 L -200 260 Z" fill="#6A7A4A" stroke="#4A5A2A" strokeWidth={6} />
    <rect x={-150} y={60} width={300} height={180} rx={14} fill="#8A8A9A" opacity={0.9} />
    {new Array(40).fill(0).map((_, k) => (
      <circle key={k} cx={-140 + random(`mg${k}`) * 280} cy={70 + random(`mh${k}`) * 160} r={5} fill={k % 3 ? "#C8C8D8" : "#5A4A3A"} />
    ))}
    <text x={0} y={30} textAnchor="middle" fill="#E8E6C8" fontFamily={mono} fontSize={36} fontWeight={700}>Mg + Fe</text>
    {agua > 0 ? <rect x={-150} y={240 - 120 * agua} width={300} height={120 * agua} fill={C.cyan} opacity={0.35} /> : null}
    <rect x={-120} y={-220} width={240} height={180} rx={14} fill={interpolateColors(calor, [0, 1], ["#8A6A4A", "#C8703A"])} />
    <text x={0} y={-118} textAnchor="middle" fill="#F4ECDC" fontFamily={mono} fontSize={34} fontWeight={700}>COMIDA</text>
    {calor > 0 ? <Vapor x={0} y={-270} t={t} op={calor} ancho={240} /> : null}
  </g>
);

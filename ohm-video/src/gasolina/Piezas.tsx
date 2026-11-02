
import { C, mono } from "../theme";

const GAS = "#F0A040";

// Pistola de gasolina vista por fuera
export const Pistola: React.FC<{ readonly x: number; readonly y: number; readonly s?: number; readonly gatillo?: number }> = ({ x, y, s = 1, gatillo = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -260 -60 L 60 -60 Q 110 -60 130 -20 L 330 120 L 310 150 L 110 20 L -260 20 Z" fill="#2E2A40" stroke="#5A5478" strokeWidth={6} />
    <path d="M -240 20 Q -260 160 -150 170 L -40 170 L -40 20 Z" fill="none" stroke="#5A5478" strokeWidth={14} />
    <g transform={`rotate(${-18 * (1 - gatillo)} -40 20)`}>
      <rect x={-200} y={40} width={150} height={26} rx={10} fill="#C8C4D8" />
    </g>
    <rect x={-320} y={-50} width={70} height={60} rx={10} fill="#1A1636" />
    <path d="M -320 -20 Q -420 -20 -460 -140" stroke="#1A1636" strokeWidth={34} fill="none" strokeLinecap="round" />
    <circle cx={318} cy={136} r={8} fill="#0B091D" stroke={C.cyan} strokeWidth={3} />
  </g>
);

// Chip tachado: "sin electrónica"
export const ChipTachado: React.FC<{ readonly x: number; readonly y: number; readonly op: number }> = ({ x, y, op }) => (
  <g transform={`translate(${x} ${y})`} opacity={op}>
    <rect x={-70} y={-70} width={140} height={140} rx={16} fill="#1A1636" stroke={C.grey} strokeWidth={6} />
    {[-40, 0, 40].map((d) => (
      <g key={d} stroke={C.grey} strokeWidth={6}>
        <line x1={d} y1={-70} x2={d} y2={-96} />
        <line x1={d} y1={70} x2={d} y2={96} />
        <line x1={-70} y1={d} x2={-96} y2={d} />
        <line x1={70} y1={d} x2={96} y2={d} />
      </g>
    ))}
    <line x1={-110} y1={-110} x2={110} y2={110} stroke={C.red} strokeWidth={16} strokeLinecap="round" />
  </g>
);

// Esquema de la boquilla en corte
export const Esquema: React.FC<{
  readonly t: number;
  readonly flujo: number; // 0..1 gasolina pasando
  readonly aire: number; // 0..1 aire entrando por el agujerito
  readonly nivel: number; // 0..1 nivel del depósito
  readonly membrana: number; // 0..1 hundimiento
  readonly disparo: number; // 0..1 palanca soltada y válvula cerrada
  readonly resaltes?: { agujero?: number; tubo?: number; venturi?: number; camara?: number };
}> = ({ t, flujo, aire, nivel, membrana, disparo, resaltes = {} }) => {
  const tuboFino = "M 440 540 L 440 610 L 700 610 L 740 640 L 780 1110";
  const tanqueTop = 1000;
  const nivelY = 1440 - nivel * 440;
  const tapado = nivelY < 1120;
  return (
    <g>
      {/* Depósito */}
      <rect x={560} y={tanqueTop} width={440} height={460} rx={20} fill="#14102A" stroke="#5A5478" strokeWidth={6} />
      <rect x={566} y={nivelY} width={428} height={1454 - nivelY} rx={14} fill={GAS} opacity={0.55} />
      <path d={`M 566 ${nivelY} q 60 ${Math.sin(t * 4) * 6} 120 0 t 120 0 t 120 0 t 68 0`} stroke={GAS} strokeWidth={4} fill="none" />
      {/* Tubería principal con estrechamiento Venturi */}
      <path d="M 60 470 L 360 470 L 420 500 L 460 500 L 520 470 L 700 470 Q 760 470 770 530 L 800 1100 L 760 1100 L 732 560 Q 726 530 700 530 L 520 530 L 460 560 L 420 560 L 360 530 L 60 530 Z" fill="#2A2350" stroke="#8C88A8" strokeWidth={5} />
      {resaltes.venturi ? <rect x={410} y={490} width={60} height={80} rx={10} fill="none" stroke={C.yellow} strokeWidth={5} opacity={resaltes.venturi} /> : null}
      {/* Gasolina fluyendo */}
      {flujo > 0
        ? new Array(14).fill(0).map((_, k) => {
            const f = (t * 0.6 + k / 14) % 1;
            let px: number;
            let py: number;
            if (f < 0.55) {
              px = 80 + (f / 0.55) * 640;
              py = 500;
            } else {
              const g = (f - 0.55) / 0.45;
              px = 740 + g * 40;
              py = 520 + g * 560;
            }
            const enVenturi = px > 400 && px < 480;
            return <rect key={k} x={px - (enVenturi ? 22 : 14)} y={py - 6} width={enVenturi ? 44 : 28} height={12} rx={6} fill={GAS} opacity={flujo} />;
          })
        : null}
      {/* Tubo fino al agujerito */}
      <path d={tuboFino} stroke={resaltes.tubo ? C.cyan : "#6A6690"} strokeWidth={resaltes.tubo ? 8 : 6} fill="none" />
      <circle cx={780} cy={1110} r={resaltes.agujero ? 16 : 10} fill="#0B091D" stroke={resaltes.agujero ? C.yellow : C.cyan} strokeWidth={resaltes.agujero ? 6 : 4} />
      {/* Burbujas de aire subiendo por el tubo fino */}
      {aire > 0
        ? new Array(6).fill(0).map((_, k) => {
            const f = (t * 0.8 + k / 6) % 1;
            const pts: [number, number][] = [
              [780, 1110],
              [740, 640],
              [700, 610],
              [440, 610],
              [440, 540],
            ];
            const seg = Math.min(3, Math.floor(f * 4));
            const u = f * 4 - seg;
            const [ax, ay] = pts[seg];
            const [bx, by] = pts[seg + 1];
            return <circle key={k} cx={ax + (bx - ax) * u} cy={ay + (by - ay) * u} r={8} fill="none" stroke={C.cyan} strokeWidth={3} opacity={aire} />;
          })
        : null}
      {/* Cámara con membrana */}
      <rect x={380} y={300} width={120} height={120} rx={14} fill="#1A1636" stroke={resaltes.camara ? C.yellow : "#8C88A8"} strokeWidth={5} />
      <line x1={440} y1={420} x2={440} y2={470} stroke="#8C88A8" strokeWidth={6} />
      <path d={`M 384 360 Q 440 ${360 + 40 * membrana} 496 360`} stroke={C.orange} strokeWidth={7} fill="none" />
      {/* Pestillo y palanca */}
      <line x1={440} y1={360 + 40 * membrana} x2={300} y2={360 + 40 * membrana + 30 * disparo} stroke="#C8C4D8" strokeWidth={6} />
      <g transform={`rotate(${30 * disparo} 260 640)`}>
        <rect x={120} y={630} width={150} height={24} rx={10} fill="#C8C4D8" />
      </g>
      {/* Válvula */}
      <rect x={240} y={470 + 60 * (1 - disparo) - 60} width={20} height={60} fill={disparo > 0.5 ? C.red : "#5A5478"} />
      {tapado && aire < 0.1 ? <text x={830} y={1080} fill={C.yellow} fontFamily={mono} fontSize={26} fontWeight={700}>tapado</text> : null}
    </g>
  );
};

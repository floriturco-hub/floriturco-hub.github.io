import { Easing, interpolate } from "remotion";
import { C, clamp, H, mono, useT, W } from "../theme";

// Lo que mide el chip: lista numerada que se ilumina paso a paso (estilo §4 "Listas")
export const MEDIDAS = [
  { n: 1, texto: "Voltaje", color: C.yellow, t: 42.42 },
  { n: 2, texto: "Electrones que salen", color: C.cyan, t: 43.66 },
  { n: 3, texto: "Temperatura", color: C.orange, t: 45.3 },
];

const CHIP = { x: 420, y: 980, s: 240 };

export const ChipMide: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const suave = { ...clamp, easing: Easing.inOut(Easing.cubic) };
  const salida = interpolate(t, [47.0, 47.4], [0, 1], clamp);
  // La estimación "rueda" y se fija en 1 % con "cuánto queda"
  const valor = Math.round(interpolate(t, [47.0, 47.76], [64, 1], { ...clamp, easing: Easing.out(Easing.cubic) }));
  const contador = Math.floor(interpolate(t, [43.66, 48.3], [0, 4_800_000_000_000]));
  const zoom = interpolate(t, [41.5, 48.3], [1, 1.05]);

  return (
    <svg width={W} height={H} style={{ position: "absolute" }}>
      <defs>
        <filter id="brillo-chip" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="24" />
        </filter>
      </defs>
      <g transform={`translate(${540 - 540 * zoom} ${960 - 960 * zoom}) scale(${zoom})`}>
        <rect x={60} y={260} width={960} height={500} rx={24} fill={C.card} stroke={C.cardBorder} strokeWidth={2} />
        <text x={110} y={330} fill={C.grey} fontFamily={mono} fontSize={30}>el chip mide</text>
        {MEDIDAS.map((m, k) => {
          const activo = interpolate(t, [m.t, m.t + 0.3], [0.25, 1], clamp);
          const y = 420 + k * 120;
          const pulso = interpolate(t, [m.t, m.t + 0.8], [0, 1], suave);
          return (
            <g key={m.n}>
              <g opacity={activo}>
                <circle cx={130} cy={y} r={26} fill={activo > 0.5 ? m.color : C.grey} />
                <text x={130} y={y + 11} textAnchor="middle" fill={C.bg} fontFamily={mono} fontSize={30} fontWeight={700}>
                  {m.n}
                </text>
                <text x={180} y={y + 15} fill={m.color} fontFamily={mono} fontSize={44} fontWeight={700}>
                  {m.texto}
                </text>
                {m.n === 2 && t >= m.t ? (
                  <text x={180} y={y + 58} fill={C.cyan} fontFamily={mono} fontSize={26} opacity={0.7}>
                    {contador.toLocaleString("es-ES")} e⁻
                  </text>
                ) : null}
              </g>
              {/* Pulso que viaja de la fila al chip */}
              {pulso > 0 && pulso < 1 ? (
                <circle cx={130 + (CHIP.x + CHIP.s / 2 - 130) * pulso} cy={y + (CHIP.y - y) * pulso} r={14} fill={m.color} opacity={1 - pulso * 0.5} />
              ) : null}
            </g>
          );
        })}
        {/* Chip */}
        <rect x={CHIP.x - 40} y={CHIP.y - 40} width={CHIP.s + 80} height={CHIP.s + 80} rx={40} fill={C.yellow} opacity={0.18 * salida} filter="url(#brillo-chip)" />
        {new Array(7).fill(0).map((_, k) => (
          <g key={k}>
            <line x1={CHIP.x - 30} y1={CHIP.y + 30 + k * 30} x2={CHIP.x} y2={CHIP.y + 30 + k * 30} stroke={C.grey} strokeWidth={8} />
            <line x1={CHIP.x + CHIP.s} y1={CHIP.y + 30 + k * 30} x2={CHIP.x + CHIP.s + 30} y2={CHIP.y + 30 + k * 30} stroke={C.grey} strokeWidth={8} />
          </g>
        ))}
        <rect x={CHIP.x} y={CHIP.y} width={CHIP.s} height={CHIP.s} rx={20} fill="#1A1636" stroke={C.yellow} strokeWidth={6} />
        <text x={CHIP.x + CHIP.s / 2} y={CHIP.y + CHIP.s / 2 + 14} textAnchor="middle" fill={C.grey} fontFamily={mono} fontSize={36} fontWeight={700}>
          BMS
        </text>
        {/* Estimación */}
        <line x1={CHIP.x + CHIP.s / 2} y1={CHIP.y + CHIP.s} x2={CHIP.x + CHIP.s / 2} y2={CHIP.y + CHIP.s + 120 * salida} stroke={C.yellow} strokeWidth={6} />
        <g opacity={salida}>
          <rect x={340} y={1360} width={400} height={170} rx={24} fill={C.card} stroke={C.yellow} strokeWidth={3} />
          <text x={540} y={1478} textAnchor="middle" fill={valor <= 1 ? C.red : C.white} fontFamily={mono} fontSize={96} fontWeight={700}>
            {valor} %
          </text>
        </g>
      </g>
    </svg>
  );
};

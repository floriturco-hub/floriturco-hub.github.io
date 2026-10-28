import { Easing, interpolate } from "remotion";
import { C, clamp, H, mono, useT, W } from "../theme";

const TEL = { x: 310, y: 470, w: 460, h: 940, r: 70 };

// Icono de batería con el nivel de carga
const IconoBateria: React.FC<{ readonly x: number; readonly y: number; readonly nivel: number; readonly encendido: number }> = ({
  x,
  y,
  nivel,
  encendido,
}) => (
  <g>
    <rect x={x} y={y} width={220} height={110} rx={20} fill="none" stroke={C.white} strokeWidth={10} />
    <rect x={x + 222} y={y + 35} width={18} height={40} rx={6} fill={C.white} />
    <rect x={x + 14} y={y + 14} width={Math.max(10, 192 * nivel)} height={82} rx={10} fill={C.red} opacity={encendido} />
  </g>
);

const Chip: React.FC<{ readonly x: number; readonly y: number; readonly brillo: number }> = ({ x, y, brillo }) => (
  <g>
    {brillo > 0 ? <rect x={x - 30} y={y - 30} width={150} height={150} rx={30} fill={C.yellow} opacity={0.25 * brillo} filter="url(#desenfoque)" /> : null}
    {new Array(5).fill(0).map((_, k) => (
      <g key={k}>
        <line x1={x - 16} y1={y + 12 + k * 17} x2={x} y2={y + 12 + k * 17} stroke={C.grey} strokeWidth={5} />
        <line x1={x + 90} y1={y + 12 + k * 17} x2={x + 106} y2={y + 12 + k * 17} stroke={C.grey} strokeWidth={5} />
      </g>
    ))}
    <rect x={x} y={y} width={90} height={90} rx={10} fill="#1A1636" stroke={brillo > 0.5 ? C.yellow : C.grey} strokeWidth={5} />
    <circle cx={x + 18} cy={y + 18} r={6} fill={C.grey} />
  </g>
);

type Props = {
  readonly t0: number;
  readonly fase: "intro" | "final";
};

// Escenas del celular: gancho del 1 %, interior (batería + chip medidor) y cierre con el escudo
export const Telefono: React.FC<Props> = ({ t0, fase }) => {
  const t = useT(t0);
  const intro = fase === "intro";
  const parpadeo = 0.55 + 0.45 * Math.round((Math.sin(t * Math.PI * 2.2) + 1) / 2);

  // Intro: 0–4,4 s pantalla con 1 %; 4,44 s se abre el interior; 8,4 s la cámara va al chip
  const interior = intro ? interpolate(t, [4.44, 5.2], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) }) : 0;
  const brilloChip = intro ? interpolate(t, [7.64, 8.0], [0, 1], clamp) : 0;
  const alChip = intro ? interpolate(t, [8.4, 9.4], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) }) : 0;
  const zoom = intro
    ? interpolate(t, [0, 4.4], [1, 1.05], clamp) + 0.9 * alChip
    : interpolate(t, [t0, t0 + 1, 61.5], [1.5, 1.08, 1.03], { ...clamp, easing: Easing.out(Easing.cubic) });
  const CHIP = { x: 590, y: 560 };
  const cx = 540 + (CHIP.x + 45 - 540) * alChip;
  const cy = 960 + (CHIP.y + 45 - 960) * alChip;

  // Final: escudo alrededor del icono "antes de protegerla"
  const escudo = intro ? 0 : interpolate(t, [59.16, 60.0], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const LONG_ESCUDO = 1500;

  return (
    <svg width={W} height={H} style={{ position: "absolute" }}>
      <defs>
        <filter id="desenfoque" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="20" />
        </filter>
      </defs>
      <g transform={`translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`}>
        <rect x={TEL.x} y={TEL.y} width={TEL.w} height={TEL.h} rx={TEL.r} fill="#0F0C24" stroke={C.wire} strokeWidth={16} />
        <rect x={490} y={500} width={100} height={22} rx={11} fill={C.wire} />
        {/* Pantalla */}
        <g opacity={1 - interior}>
          <IconoBateria x={420} y={820} nivel={0.01} encendido={parpadeo} />
          <text x={540} y={1110} textAnchor="middle" fill={C.red} fontFamily={mono} fontWeight={700} fontSize={130}>
            1 %
          </text>
          {escudo > 0 ? (
            <path
              d="M 540 735 L 705 790 L 705 880 Q 705 962 540 1008 Q 375 962 375 880 L 375 790 Z"
              fill="none"
              stroke={C.yellow}
              strokeWidth={10}
              strokeLinejoin="round"
              strokeDasharray={LONG_ESCUDO}
              strokeDashoffset={LONG_ESCUDO * (1 - escudo)}
            />
          ) : null}
        </g>
        {/* Interior: celda de la batería y chip que la vigila */}
        {interior > 0 ? (
          <g opacity={interior}>
            <rect x={360} y={720} width={360} height={600} rx={30} fill="rgba(24, 104, 120, 0.25)" stroke="#186878" strokeWidth={8} />
            <text x={540} y={1035} textAnchor="middle" fill="#3FA8B8" fontFamily={mono} fontWeight={700} fontSize={48}>
              Li-ion
            </text>
            <path d={`M ${CHIP.x + 45} ${CHIP.y + 106} L ${CHIP.x + 45} 720`} stroke={C.grey} strokeWidth={5} />
            <Chip x={CHIP.x} y={CHIP.y} brillo={brilloChip} />
          </g>
        ) : null}
      </g>
    </svg>
  );
};

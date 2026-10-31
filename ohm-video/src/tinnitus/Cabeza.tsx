import { Easing, interpolate } from "remotion";
import { C, clamp, H, useT, W } from "../theme";
import { T } from "./tiempos";

const METAL = "#8C88A8";
export const OIDO = { x: 560, y: 1000 };

// Silueta de cabeza de perfil (mirando a la derecha) en una habitación en silencio
const PERFIL =
  "M 430 1560 L 430 1320 C 300 1260 285 1010 335 880 C 395 720 560 655 690 695 C 805 730 862 815 862 920 L 905 1012 L 864 1032 C 874 1082 862 1112 842 1122 C 858 1152 842 1182 812 1192 C 802 1242 762 1262 702 1257 L 692 1560 Z";

// Onda fina y aguda que solo existe "dentro" de la cabeza
export const OndaInterna: React.FC<{ readonly t: number; readonly o: number; readonly x: number; readonly y: number }> = ({ t, o, x, y }) => {
  if (o <= 0) return null;
  let d = `M ${x - 120} ${y}`;
  for (let k = -120; k <= 120; k += 3) {
    const env = Math.cos((k / 120) * (Math.PI / 2));
    d += ` L ${x + k} ${y + 16 * env * Math.sin(k / 3.2 - t * 40)}`;
  }
  return (
    <g opacity={o}>
      <path d={d} fill="none" stroke={C.yellow} strokeWidth={9} opacity={0.35} filter="url(#halo-cab)" />
      <path d={d} fill="none" stroke={C.yellow} strokeWidth={4} />
    </g>
  );
};

export const Cabeza: React.FC<{ readonly t0: number; readonly fase: "intro" | "final" }> = ({ t0, fase }) => {
  const t = useT(t0);
  const intro = fase === "intro";
  const zumbido = intro
    ? interpolate(t, [T.tinnitus - 0.3, T.tinnitus + 0.4], [0, 1], clamp)
    : interpolate(t, [T.final + 0.3, T.final + 1.0], [0, 0.8], clamp);
  // Cámara: deriva lenta y, al final del gancho, entra por el oído
  const zoom = intro
    ? interpolate(t, [0, T.coclea - 0.9, T.coclea + 0.2], [1, 1.05, 3.4], { ...clamp, easing: Easing.in(Easing.cubic) })
    : interpolate(t, [t0, t0 + 1, T.fin], [1.5, 1.05, 1.02], { ...clamp, easing: Easing.out(Easing.cubic) });
  const foco = intro ? interpolate(zoom, [1.05, 3.4], [0, 1], clamp) : 0;
  const cx = 540 + (OIDO.x - 540) * foco;
  const cy = 1080 + (OIDO.y - 1080) * foco;
  // Ondas de sonido "externas" ausentes: anillos tachados alrededor
  const sinFuente = intro ? interpolate(t, [1.5, 2.0, T.tinnitus - 0.2, T.tinnitus + 0.2], [0, 1, 1, 0], clamp) : 0;

  return (
    <svg width={W} height={H} style={{ position: "absolute" }}>
      <defs>
        <filter id="halo-cab" x="-50%" y="-200%" width="200%" height="500%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
      </defs>
      <g transform={`translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`}>
        <path d={PERFIL} fill="#1A1636" stroke={METAL} strokeWidth={8} strokeLinejoin="round" />
        {/* Oreja */}
        <path d={`M ${OIDO.x - 10} ${OIDO.y - 70} C ${OIDO.x - 70} ${OIDO.y - 70} ${OIDO.x - 75} ${OIDO.y + 60} ${OIDO.x - 15} ${OIDO.y + 70} C ${OIDO.x + 15} ${OIDO.y + 40} ${OIDO.x - 25} ${OIDO.y + 10} ${OIDO.x} ${OIDO.y - 20}`} fill="none" stroke={METAL} strokeWidth={8} strokeLinecap="round" />
        <circle cx={OIDO.x - 18} cy={OIDO.y + 8} r={10} fill="#0B091D" />
        {/* Fuera: silencio (ondas tachadas) */}
        {sinFuente > 0 ? (
          <g opacity={sinFuente}>
            {[0, 1, 2].map((k) => (
              <path key={k} d={`M ${200 - k * 40} ${1000 - 70 - k * 30} Q ${160 - k * 40} 1000 ${200 - k * 40} ${1000 + 70 + k * 30}`} fill="none" stroke={C.grey} strokeWidth={6} strokeLinecap="round" opacity={0.5} />
            ))}
            <line x1={90} y1={880} x2={230} y2={1120} stroke={C.red} strokeWidth={8} strokeLinecap="round" />
          </g>
        ) : null}
        <OndaInterna t={t} o={zumbido} x={640} y={940} />
      </g>
    </svg>
  );
};

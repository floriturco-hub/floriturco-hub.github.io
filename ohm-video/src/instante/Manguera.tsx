import { Easing, interpolate } from "remotion";
import { C, clamp, H, mono, useT, W } from "../theme";
import { T } from "./tiempos";

// Analogía: manguera llena de agua. Al abrir el grifo sale agua al instante por el otro extremo,
// pero la gota marcada que entra se queda al principio.
const Y = 1050;
const X0 = 170;
const X1 = 930;
const AGUA = "#3F7BD8";

export const Manguera: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const abre = interpolate(t, [T.grifo, T.grifo + 0.4], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const avance = t > T.grifo ? (t - T.grifo) * 60 : 0;
  const marcada = interpolate(t, [T.misma - 0.2, T.misma + 0.3], [0, 1], clamp);
  const zoom = interpolate(t, [T.manguera - 0.3, T.alterna], [1, 1.05]);

  const gotas: React.ReactNode[] = [];
  for (let k = 0; k < 24; k++) {
    const x = X0 + 20 + k * 32 + avance;
    if (x > X1 + 10) continue;
    gotas.push(<circle key={k} cx={x} cy={Y} r={13} fill={AGUA} />);
  }
  // Gotas nuevas que entran por el grifo (la primera va marcada)
  const nuevas = Math.floor(avance / 32);
  for (let k = 0; k < nuevas; k++) {
    const x = X0 + 20 + avance - (k + 1) * 32;
    gotas.push(<circle key={`n${k}`} cx={x} cy={Y} r={13} fill={k === nuevas - 1 && marcada > 0 ? C.red : AGUA} />);
  }

  return (
    <svg width={W} height={H} style={{ position: "absolute" }}>
      <g transform={`translate(${540 - 540 * zoom} ${960 - 1000 * zoom}) scale(${zoom})`}>
        {/* Grifo */}
        <rect x={60} y={980} width={110} height={60} rx={12} fill="#8C88A8" />
        <rect x={90} y={930} width={50} height={50} rx={8} fill="#8C88A8" />
        <rect x={70} y={905 - 30 * abre} width={90} height={22} rx={8} fill={abre > 0.5 ? C.cyan : "#8C88A8"} transform={`rotate(${-30 * abre} 115 915)`} />
        {/* Manguera */}
        <rect x={X0} y={Y - 26} width={X1 - X0} height={52} rx={26} fill="rgba(63, 123, 216, 0.12)" stroke="#2A6A3A" strokeWidth={10} />
        {gotas}
        {/* Chorro de salida instantáneo */}
        {abre > 0
          ? new Array(6).fill(0).map((_, k) => {
              const p = (t * 1.6 + k / 6) % 1;
              return <circle key={k} cx={X1 + 20 + p * 70} cy={Y + p * p * 260} r={12 * (1 - p * 0.4)} fill={AGUA} opacity={abre * (1 - p * 0.5)} />;
            })
          : null}
        {marcada > 0 ? (
          <g opacity={marcada}>
            <text x={X0 + 30} y={Y - 70} fill={C.red} fontFamily={mono} fontSize={34} fontWeight={700}>la que entra</text>
            <text x={X1 - 10} y={Y - 70} textAnchor="end" fill={AGUA} fontFamily={mono} fontSize={34} fontWeight={700}>la que sale</text>
          </g>
        ) : null}
      </g>
    </svg>
  );
};

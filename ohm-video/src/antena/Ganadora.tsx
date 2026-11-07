import { Easing, interpolate } from "remotion";
import { C, clamp, H, mono, useT, W } from "../theme";
import { Antena3D } from "./Antena3D";
import { cruzar, GANADORA } from "./geom";
import { T } from "./tiempos";

const suave = { ...clamp, easing: Easing.inOut(Easing.cubic) };

// Hélice convencional (diseño a mano) para comparar
const Helice: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly t: number }> = ({ x, y, s, t }) => {
  const pts: string[] = [];
  for (let k = 0; k <= 120; k++) {
    const a = (k / 120) * Math.PI * 6 + t * 0.8;
    pts.push(`${x + Math.cos(a) * 12 * s},${y - (k / 120) * 70 * s + Math.sin(a) * 4 * s}`);
  }
  return <polyline points={pts.join(" ")} fill="none" stroke="#D8D4E8" strokeWidth={4} />;
};

type Props = { readonly t0: number; readonly fase: "ganadora" | "final" };

export const Ganadora: React.FC<Props> = ({ t0, fase }) => {
  const t = useT(t0);
  const final = fase === "final";
  const comparar = final ? 0 : interpolate(t, [T.mejor - 0.2, T.mejor + 0.4, T.requisitos - 0.3, T.requisitos], [0, 1, 1, 0], clamp);
  const requisitos = final ? 0 : interpolate(t, [T.requisitos, T.requisitos + 0.4], [0, 1], clamp);
  const rediseno = final ? 0 : interpolate(t, [T.requisitos + 0.8, T.semanas + 0.6], [0, 1], suave);
  const genes = rediseno > 0 ? cruzar(GANADORA, GANADORA, 7, 3, 30 * rediseno) : GANADORA;
  const zoom = final
    ? interpolate(t, [t0, t0 + 1.2, T.fin + 0.5], [0.7, 1, 1.04], { ...clamp, easing: Easing.out(Easing.cubic) })
    : interpolate(t, [T.aparecio - 0.3, T.aparecio + 1.2, T.requisitos], [0.5, 1, 1.05], { ...clamp, easing: Easing.out(Easing.cubic) });
  const antenaY = comparar > 0 || requisitos > 0 ? 1350 : 1180;

  return (
    <svg width={W} height={H} style={{ position: "absolute" }}>
      <g transform={`translate(${540 - 540 * zoom} ${1050 - 1050 * zoom}) scale(${zoom})`}>
        <Antena3D x={540} y={antenaY} s={6.5} guinada={t * 0.8} genes={genes} grosor={7} color={final ? C.yellow : "#E8E6F0"} />
      </g>
      {comparar > 0 ? (
        <g opacity={comparar}>
          <rect x={60} y={150} width={960} height={560} rx={24} fill={C.card} stroke={C.cardBorder} strokeWidth={2} />
          <text x={110} y={215} fill={C.grey} fontFamily={mono} fontSize={30}>rendimiento en la misión</text>
          <Helice x={190} y={420} s={2.4} t={t} />
          <text x={300} y={340} fill={C.white} fontFamily={mono} fontSize={38} fontWeight={700}>diseño a mano</text>
          <rect x={300} y={370} width={660} height={36} rx={18} fill="rgba(255,255,255,0.08)" />
          <rect x={300} y={370} width={660 * 0.55 * Math.min(1, comparar * 1.4)} height={36} rx={18} fill={C.grey} />
          <Antena3D x={190} y={660} s={2} guinada={t * 0.8} genes={GANADORA} grosor={2.4} color={C.yellow} base={false} />
          <text x={300} y={560} fill={C.yellow} fontFamily={mono} fontSize={38} fontWeight={700}>evolucionada</text>
          <rect x={300} y={590} width={660} height={36} rx={18} fill="rgba(255,255,255,0.08)" />
          <rect x={300} y={590} width={660 * 0.9 * Math.min(1, comparar * 1.4)} height={36} rx={18} fill={C.yellow} />
        </g>
      ) : null}
      {requisitos > 0 ? (
        <g opacity={requisitos}>
          <rect x={60} y={150} width={960} height={430} rx={24} fill={C.card} stroke={C.cardBorder} strokeWidth={2} />
          <text x={110} y={215} fill={C.grey} fontFamily={mono} fontSize={30}>nuevos requisitos</text>
          {["órbita distinta", "otro patrón de señal"].map((r, k) => (
            <g key={k}>
              <circle cx={135} cy={290 + k * 90} r={26} fill={rediseno > 0.3 + k * 0.3 ? C.cyan : C.grey} />
              <text x={190} y={304 + k * 90} fill={C.white} fontFamily={mono} fontSize={44} fontWeight={700}>{r}</text>
            </g>
          ))}
          <rect x={110} y={480} width={860} height={30} rx={15} fill="rgba(255,255,255,0.08)" />
          <rect x={110} y={480} width={860 * rediseno} height={30} rx={15} fill={C.cyan} />
          <text x={970} y={555} textAnchor="end" fill={C.cyan} fontFamily={mono} fontSize={30} fontWeight={700}>
            re-evolución: {Math.round(rediseno * 100)} %
          </text>
        </g>
      ) : null}
    </svg>
  );
};

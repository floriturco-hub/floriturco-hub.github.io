import { Easing, interpolate } from "remotion";
import { C, clamp, mono, useT } from "../theme";
import { T } from "./tiempos";

const Tarjeta: React.FC<{ readonly alto: number; readonly titulo: string; readonly o: number; readonly children: React.ReactNode }> = ({ alto, titulo, o, children }) => (
  <g opacity={o}>
    <rect x={60} y={150} width={960} height={alto} rx={24} fill={C.card} stroke={C.cardBorder} strokeWidth={2} />
    <text x={110} y={215} fill={C.grey} fontFamily={mono} fontSize={30}>
      {titulo}
    </text>
    {children}
  </g>
);

// Diamante esquemático
const Diamante: React.FC<{ readonly x: number; readonly y: number; readonly s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <polygon points="-30,-14 -14,-30 14,-30 30,-14 0,30" fill={C.cyan} />
    <polygon points="-30,-14 30,-14 0,30" fill="#0AA8B8" />
    <polyline points="-14,-30 -8,-14 0,30 8,-14 14,-30" fill="none" stroke="#E8FCFF" strokeWidth={2} opacity={0.7} />
  </g>
);

// Tarjetas superiores y llamada final (espacio de pantalla)
export const Tarjetas: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const sale = (desde: number, hasta: number) => interpolate(t, [desde, desde + 0.4, hasta - 0.4, hasta], [0, 1, 1, 0], clamp);
  const sube = (desde: number) => interpolate(t, [desde - 0.1, desde + 0.3], [0, 1], clamp);

  // 1) Viral frente a comunidad
  const t1 = sale(T.parece - 0.2, T.live - 0.4);
  const traza = (desde: number, dur: number) => interpolate(t, [desde, desde + dur], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const viral = "M 120 440 L 300 440 L 340 250 L 380 430 L 470 440 L 940 440";
  const comunidad = "M 120 440 C 300 430, 420 400, 560 360 C 700 320, 820 290, 940 250";
  // 2) Del regalo al cobro
  const t2 = sale(T.regalos - 0.3, T.noFacil);
  // 3) Llamada final
  const cta = interpolate(t, [T.siQuieres - 0.1, T.siQuieres + 0.5], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.6)) });
  const latido = 1 + 0.05 * Math.sin(t * 7);
  const toque = (t * 1.3) % 1;

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      {t1 > 0 ? (
        <Tarjeta alto={340} titulo="seguidores con el tiempo" o={t1}>
          <line x1={120} y1={440} x2={940} y2={440} stroke={C.cardBorder} strokeWidth={3} />
          <path d={viral} fill="none" stroke={C.red} strokeWidth={6} strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - traza(T.viral - 0.2, 1.6)} />
          <path d={comunidad} fill="none" stroke={C.cyan} strokeWidth={8} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - traza(T.directo, 1.6)} />
          <text x={390} y={280} fill={C.red} fontFamily={mono} fontSize={28} fontWeight={700} opacity={sube(T.viral + 0.6)}>
            viral: 1 día
          </text>
          <text x={940} y={235} textAnchor="end" fill={C.cyan} fontFamily={mono} fontSize={28} fontWeight={700} opacity={sube(T.directo + 0.8)}>
            directos: comunidad
          </text>
        </Tarjeta>
      ) : null}

      {t2 > 0 ? (
        <Tarjeta alto={360} titulo="cómo se gana en un LIVE" o={t2}>
          <g opacity={sube(T.regalos)}>
            <rect x={140} y={262} width={110} height={90} rx={12} fill="#E8414F" />
            <rect x={130} y={246} width={130} height={26} rx={8} fill="#C8303C" />
            <rect x={188} y={246} width={14} height={106} fill={C.yellow} />
            <text x={195} y={400} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={28} fontWeight={700}>
              regalos
            </text>
          </g>
          <text x={330} y={318} fill={C.grey} fontFamily={mono} fontSize={48} opacity={sube(T.diamantes)}>
            →
          </text>
          <g opacity={sube(T.diamantes)}>
            <Diamante x={480} y={300} s={1.4} />
            <text x={480} y={400} textAnchor="middle" fill={C.cyan} fontFamily={mono} fontSize={28} fontWeight={700}>
              diamantes
            </text>
          </g>
          <text x={600} y={318} fill={C.grey} fontFamily={mono} fontSize={48} opacity={sube(T.cobrar)}>
            →
          </text>
          <g opacity={sube(T.cobrar)}>
            <rect x={700} y={258} width={150} height={96} rx={14} fill="#3AA85A" />
            <rect x={790} y={286} width={70} height={40} rx={10} fill="#2A8A4A" />
            <circle cx={812} cy={306} r={7} fill={C.yellow} />
            <text x={775} y={400} textAnchor="middle" fill="#7AE09A" fontFamily={mono} fontSize={28} fontWeight={700}>
              cobro
            </text>
          </g>
          <g opacity={sube(T.mayor)}>
            <rect x={110} y={430} width={86} height={50} rx={12} fill={C.red} />
            <text x={153} y={465} textAnchor="middle" fill="#FFFFFF" fontFamily={mono} fontSize={30} fontWeight={700}>
              18+
            </text>
            <text x={220} y={465} fill={C.white} fontFamily={mono} fontSize={28}>
              y requisitos de tu país
            </text>
          </g>
        </Tarjeta>
      ) : null}

      {cta > 0 ? (
        <g opacity={Math.min(1, cta)}>
          <rect x={0} y={0} width={1080} height={1920} fill="#0B091D" opacity={0.6} />
          <text x={540} y={560} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={40} fontWeight={700}>
            pulsa el enlace
          </text>
          <path d="M 540 590 L 540 660 M 510 636 L 540 666 L 570 636" fill="none" stroke={C.white} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
          <g transform={`translate(540 780) scale(${cta * latido})`}>
            <rect x={-300} y={-80} width={600} height={160} rx={80} fill="#E8414F" />
            <rect x={-300} y={-80} width={600} height={160} rx={80} fill="none" stroke="#FF8A96" strokeWidth={4} />
            <circle cx={-238} cy={0} r={16} fill="#FFFFFF" opacity={0.6 + 0.4 * Math.sin(t * 8)} />
            <text x={36} y={22} textAnchor="middle" fill="#FFFFFF" fontFamily={mono} fontSize={58} fontWeight={700}>
              Iniciar LIVE
            </text>
          </g>
          {/* Dedo que pulsa */}
          <g transform={`translate(${812} ${905 - 30 * Math.max(0, Math.sin(toque * Math.PI))})`}>
            <rect x={-26} y={-40} width={52} height={150} rx={26} fill="#C98A64" />
            <ellipse cx={0} cy={-26} rx={18} ry={12} fill="#E8B090" />
            <rect x={-30} y={100} width={60} height={60} rx={10} fill="#2E5A78" />
          </g>
          <circle cx={812} cy={850} r={30 + 50 * toque} fill="none" stroke="#FFFFFF" strokeWidth={4} opacity={1 - toque} />
        </g>
      ) : null}
    </svg>
  );
};

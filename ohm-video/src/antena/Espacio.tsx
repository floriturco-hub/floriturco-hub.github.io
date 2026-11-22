import { Easing, interpolate } from "remotion";
import { C, clamp, H, mono, useT, W } from "../theme";
import { Antena3D, Satelite } from "./Antena3D";
import { GANADORA } from "./geom";
import { T } from "./tiempos";

// Espacio: la Tierra, los tres satélites ST5 en órbita y la antena rara
const TIERRA = { x: 540, y: 1700, r: 520 };
const suave = { ...clamp, easing: Easing.inOut(Easing.cubic) };

const Tierra: React.FC = () => (
  <g>
    <defs>
      <radialGradient id="tierra" cx="40%" cy="30%" r="80%">
        <stop offset="0" stopColor="#2F7FA8" />
        <stop offset="0.7" stopColor="#164A6A" />
        <stop offset="1" stopColor="#0B2238" />
      </radialGradient>
    </defs>
    <circle cx={TIERRA.x} cy={TIERRA.y} r={TIERRA.r + 30} fill="#3FA8B8" opacity={0.12} />
    <circle cx={TIERRA.x} cy={TIERRA.y} r={TIERRA.r} fill="url(#tierra)" />
    <path d={`M ${TIERRA.x - 300} ${TIERRA.y - 380} q 80 -40 160 10 q 60 40 140 0 q 40 -20 60 30`} fill="none" stroke="#3FA8B8" strokeWidth={10} opacity={0.35} strokeLinecap="round" />
  </g>
);

type Props = { readonly t0: number; readonly fase: "intro" | "lanzamiento" };

export const Espacio: React.FC<Props> = ({ t0, fase }) => {
  const t = useT(t0);
  const intro = fase === "intro";
  const guinada = t * 0.9;

  // Intro: satélite en primer plano, la cámara se acerca a la antena y luego se aleja a la órbita
  const alAntena = intro ? interpolate(t, [T.persona, T.computadora, T.mision - 0.4, T.mision + 0.6], [0, 1, 1, 0], suave) : 0;
  const orbita = intro ? interpolate(t, [T.mision, T.mision + 1.0], [0, 1], suave) : 1;
  const aUno = intro ? interpolate(t, [T.centimetros - 0.3, T.centimetros + 0.6, T.ingenieros - 0.6, T.ingenieros], [0, 1, 1, 0.6], suave) : 0;
  const cobertura = intro ? interpolate(t, [T.angulo, T.angulo + 0.6], [0, 1], clamp) : 0;
  const regla = intro ? interpolate(t, [T.centimetros + 0.4, T.centimetros + 0.9, T.angulo - 0.2, T.angulo + 0.2], [0, 1, 1, 0], clamp) : 0;
  const tarjeta = intro ? interpolate(t, [T.mision + 0.3, T.mision + 0.8, T.centimetros - 0.4, T.centimetros], [0, 1, 1, 0], clamp) : 0;
  const fecha = intro ? 0 : interpolate(t, [T.primera + 0.3, T.primera + 0.8], [0, 1], clamp);

  // Satélites en órbita
  const sats = [0, 1, 2].map((k) => {
    const a = -Math.PI / 2 + (k - 1) * 0.55 + (t - t0) * 0.03;
    return { x: TIERRA.x + Math.cos(a) * (TIERRA.r + 260), y: TIERRA.y + Math.sin(a) * (TIERRA.r + 260) };
  });

  // Satélite protagonista (en el intro está en primer plano antes de la órbita)
  const prota = { x: 540, y: 900 };
  const zoomIntro = 1 + 1.3 * alAntena;
  const cxIntro = 540;
  const cyIntro = 960 + (prota.y - 260 - 960) * alAntena;
  const s1 = sats[1];
  const zoomUno = 1 + 1.6 * aUno;

  return (
    <svg width={W} height={H} style={{ position: "absolute" }}>
      {/* Fase de primer plano (intro antes de la misión) */}
      {orbita < 1 ? (
        <g opacity={1 - orbita} transform={`translate(${540 - cxIntro * zoomIntro} ${960 - cyIntro * zoomIntro}) scale(${zoomIntro})`}>
          <Satelite x={prota.x} y={prota.y} s={3} guinada={guinada} genes={GANADORA} />
        </g>
      ) : null}
      {/* Órbita con la Tierra y los tres satélites */}
      {orbita > 0 ? (
        <g opacity={orbita} transform={`translate(${540 - (540 + (s1.x - 540) * aUno) * zoomUno} ${960 - (1000 + (s1.y - 1000) * aUno) * zoomUno}) scale(${zoomUno})`}>
          <Tierra />
          <circle cx={TIERRA.x} cy={TIERRA.y} r={TIERRA.r + 260} fill="none" stroke={C.grey} strokeWidth={2} strokeDasharray="8 12" opacity={0.4} />
          {cobertura > 0 ? (
            <path
              d={`M ${s1.x} ${s1.y - 20} L ${s1.x - 420} ${TIERRA.y - TIERRA.r + 60} Q ${s1.x} ${TIERRA.y - TIERRA.r - 60} ${s1.x + 420} ${TIERRA.y - TIERRA.r + 60} Z`}
              fill={C.cyan}
              opacity={0.14 * cobertura * (0.8 + 0.2 * Math.sin(t * 4))}
            />
          ) : null}
          {sats.map((p, k) => (
            <Satelite key={k} x={p.x} y={p.y} s={intro ? 0.9 : 1.3} guinada={guinada + k} genes={GANADORA} />
          ))}
          {regla > 0 ? (
            <g opacity={regla}>
              <line x1={s1.x + 70} y1={s1.y - 60} x2={s1.x + 70} y2={s1.y - 20} stroke={C.white} strokeWidth={2} />
              <line x1={s1.x + 62} y1={s1.y - 60} x2={s1.x + 78} y2={s1.y - 60} stroke={C.white} strokeWidth={2} />
              <line x1={s1.x + 62} y1={s1.y - 20} x2={s1.x + 78} y2={s1.y - 20} stroke={C.white} strokeWidth={2} />
              <text x={s1.x + 86} y={s1.y - 34} fill={C.white} fontFamily={mono} fontSize={16} fontWeight={700}>pocos cm</text>
            </g>
          ) : null}
        </g>
      ) : null}

      {tarjeta > 0 ? (
        <g opacity={tarjeta}>
          <rect x={60} y={150} width={960} height={250} rx={24} fill={C.card} stroke={C.cardBorder} strokeWidth={2} />
          <text x={110} y={215} fill={C.grey} fontFamily={mono} fontSize={30}>misión de la NASA</text>
          <text x={110} y={310} fill={C.white} fontFamily={mono} fontSize={58} fontWeight={700}>Space Technology 5</text>
          <text x={110} y={370} fill={C.cyan} fontFamily={mono} fontSize={34} fontWeight={700}>3 microsatélites · 2006</text>
        </g>
      ) : null}
      {fecha > 0 ? (
        <g opacity={fecha}>
          <rect x={60} y={150} width={960} height={220} rx={24} fill={C.card} stroke={C.cardBorder} strokeWidth={2} />
          <text x={110} y={215} fill={C.grey} fontFamily={mono} fontSize={30}>lanzamiento</text>
          <text x={110} y={320} fill={C.yellow} fontFamily={mono} fontSize={80} fontWeight={700}>22·03·2006</text>
        </g>
      ) : null}
    </svg>
  );
};

// Antena sola, grande, girando (para la ganadora y el cierre)
export const AntenaGrande: React.FC<{ readonly t: number; readonly y?: number; readonly s?: number }> = ({ t, y = 1150, s = 7 }) => (
  <Antena3D x={540} y={y} s={s} guinada={t * 0.8} genes={GANADORA} grosor={7} />
);

import { AbsoluteFill, Easing, interpolate } from "remotion";
import { clamp, montserrat, useT } from "../theme";

// Coordenadas del logo original (lienzo de 1932 px de lado)
const MARCO = { x: 323, y: 497, w: 1285, h: 930, r: 140 };
const GROSOR = 46;
const BASE = 1042;
const X_INI = 347;
const X_FIN = 1585;
// Puntos de la onda tal y como aparece en el logo
const PUNTOS: [number, number][] = [
  [X_INI, 1032], [400, 1042], [460, 1000], [560, 830], [640, 715], [710, 680], [780, 720],
  [860, 880], [960, 1110], [1068, 1250], [1170, 1170], [1290, 930], [1410, 800],
  [1490, 860], [1550, 990], [X_FIN, 1030],
];

const catmullRom = (u: number) => {
  // y(x) por interpolación de Catmull-Rom sobre los puntos del logo; plano fuera de ellos
  if (u <= X_INI || u >= X_FIN) {
    return BASE;
  }
  let k = 0;
  while (k < PUNTOS.length - 2 && PUNTOS[k + 1][0] < u) {
    k++;
  }
  const p0 = PUNTOS[Math.max(0, k - 1)];
  const p1 = PUNTOS[k];
  const p2 = PUNTOS[k + 1];
  const p3 = PUNTOS[Math.min(PUNTOS.length - 1, k + 2)];
  const s = (u - p1[0]) / (p2[0] - p1[0]);
  const s2 = s * s;
  const s3 = s2 * s;
  return (
    0.5 *
    (2 * p1[1] +
      (-p0[1] + p2[1]) * s +
      (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * s2 +
      (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * s3)
  );
};

const LONG_MARCO = 2 * (MARCO.w + MARCO.h) - (8 - 2 * Math.PI) * MARCO.r;
const TEXTO = "Frecuencia Cero";

export const Logo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const suave = { ...clamp, easing: Easing.inOut(Easing.cubic) };

  const marco = interpolate(t, [61.5, 62.3], [0, 1], suave);
  const revela = interpolate(t, [61.7, 62.4], [0, 1], suave);
  // La onda sigue su recorrido hacia la derecha; detrás solo entra línea plana (frecuencia cero)
  const avance = interpolate(t, [62.4, 63.9], [0, X_FIN - X_INI + 40], suave);
  // Pulso de luz que recorre la línea ya plana
  const pulso = interpolate(t, [63.6, 64.6], [X_INI - 200, X_FIN + 200], clamp);
  const salida = interpolate(t, [67.3, 68.0], [1, 0], clamp);

  const xMax = X_INI + (X_FIN - X_INI) * revela;
  const trazo: string[] = [];
  for (let x = X_INI; x <= xMax; x += 3) {
    trazo.push(`${x},${catmullRom(x - avance).toFixed(1)}`);
  }

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000", opacity: salida }}>
      <svg
        viewBox="0 0 1932 1932"
        width={1000}
        height={1000}
        style={{ position: "absolute", left: 40, top: 360 }}
      >
        <defs>
          <linearGradient id="pulso" gradientUnits="userSpaceOnUse" x1={pulso - 160} y1={0} x2={pulso + 160} y2={0}>
            <stop offset="0" stopColor="#FFFFFF" stopOpacity={0} />
            <stop offset="0.5" stopColor="#FFFFFF" stopOpacity={1} />
            <stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
          </linearGradient>
          <filter id="halo" x="-20%" y="-200%" width="140%" height="500%">
            <feGaussianBlur stdDeviation="18" />
          </filter>
        </defs>
        <rect
          x={MARCO.x}
          y={MARCO.y}
          width={MARCO.w}
          height={MARCO.h}
          rx={MARCO.r}
          fill="none"
          stroke="#FFFFFF"
          strokeWidth={GROSOR}
          strokeDasharray={LONG_MARCO}
          strokeDashoffset={LONG_MARCO * (1 - marco)}
        />
        {trazo.length > 1 ? (
          <polyline
            points={trazo.join(" ")}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth={GROSOR}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : null}
        {t > 63.6 ? (
          <line
            x1={X_INI}
            y1={BASE}
            x2={X_FIN}
            y2={BASE}
            stroke="url(#pulso)"
            strokeWidth={GROSOR * 2.2}
            filter="url(#halo)"
          />
        ) : null}
        <text
          x={966}
          y={1690}
          textAnchor="middle"
          fill="#FFFFFF"
          fontFamily={montserrat}
          fontSize={205}
          fontWeight={400}
        >
          {TEXTO.split("").map((letra, k) => {
            const tl = 63.55 + k * 0.035;
            return (
              <tspan key={k} opacity={interpolate(t, [tl, tl + 0.3], [0, 1], clamp)}>
                {letra}
              </tspan>
            );
          })}
        </text>
      </svg>
    </AbsoluteFill>
  );
};

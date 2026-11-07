import { Easing, interpolate, random } from "remotion";
import { GraficaIV } from "../components/GraficaIV";
import { Electrones, ionX, ionY, Red } from "../components/Red";
import { C, clamp, H, useT, W } from "../theme";

// Choques "de fondo": destellos breves en iones al azar; más frecuentes con calor
const DESTELLOS = new Array(90).fill(0).map((_, k) => ({
  t: 50.6 + random(`dt${k}`) * 7.4,
  i: Math.floor(random(`di${k}`) * 6),
  j: 4 + Math.floor(random(`dj${k}`) * 7),
  umbral: random(`du${k}`),
}));

export const Calor: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const calor = interpolate(t, [52.8, 55.0], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const zoom = interpolate(t, [50.5, 57.9], [1.15, 1.3]);
  return (
    <svg width={W} height={H} style={{ position: "absolute" }}>
      <g transform={`translate(${540 - 540 * zoom} ${1150 - 1150 * zoom}) scale(${zoom})`}>
        <Red t={t} calor={calor} />
        <Electrones tau={t - 40} deriva={50 * (t - 40) * (1 - 0.4 * calor)} />
        {DESTELLOS.map((d, k) => {
          // Con frío solo se ve 1 de cada 4 choques; con calor, todos
          if (d.umbral > 0.25 + 0.75 * calor || t < d.t || t > d.t + 0.35) {
            return null;
          }
          const p = (t - d.t) / 0.35;
          return (
            <circle
              key={k}
              cx={ionX(d.i)}
              cy={ionY(d.j)}
              r={20 + 50 * p}
              fill="none"
              stroke={C.yellow}
              strokeWidth={4}
              opacity={1 - p}
            />
          );
        })}
      </g>
      <GraficaIV
        x={60}
        y={150}
        ancho={960}
        alto={600}
        trazo={1}
        curva={interpolate(t, [56.4, 57.4], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) })}
        puntos={0}
        opacidad={interpolate(t, [50.8, 51.2], [0, 1], clamp)}
      />
    </svg>
  );
};

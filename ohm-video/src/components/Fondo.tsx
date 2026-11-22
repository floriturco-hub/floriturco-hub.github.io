import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { C, H, W } from "../theme";

const ESTRELLAS = new Array(70).fill(0).map((_, i) => ({
  x: random(`ex${i}`) * W,
  y: random(`ey${i}`) * H,
  r: 1 + random(`er${i}`) * 1.8,
  fase: random(`ef${i}`) * Math.PI * 2,
}));

// Noche azul-violeta con estrellas (sin cono de luz: preferencia del usuario)
// tono "azul": sin violeta (campañas que piden evitar morado y rojo)
export const FONDOS = {
  noche: ["#15112E", C.bg, C.bgDeep],
  azul: ["#0B2238", "#06121F", "#02070D"],
} as const;

export const Fondo: React.FC<{ readonly tono?: keyof typeof FONDOS }> = ({ tono = "noche" }) => {
  const frame = useCurrentFrame();
  const [c0, c1, c2] = FONDOS[tono];
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 90% 60% at 50% 45%, ${c0} 0%, ${c1} 55%, ${c2} 100%)`,
      }}
    >
      <svg width={W} height={H} style={{ position: "absolute" }}>
        {ESTRELLAS.map((e, i) => (
          <circle
            key={i}
            cx={e.x}
            cy={e.y}
            r={e.r}
            fill="#FFFFFF"
            opacity={0.25 + 0.25 * Math.sin(frame / 20 + e.fase)}
          />
        ))}
      </svg>
    </AbsoluteFill>
  );
};

import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, clamp, mono } from "../theme";

type Props = {
  readonly texto: string;
  readonly desde: number;
  readonly hasta: number;
  readonly y: number;
  readonly x?: number;
  readonly color?: string;
  readonly tamano?: number;
};

// Etiqueta-clave del estilo: monoespaciada 44 px, píldora oscura, fade + subida de 8 px en 0,4 s
export const Etiqueta: React.FC<Props> = ({
  texto,
  desde,
  hasta,
  y,
  x = 540,
  color = C.white,
  tamano = 44,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  if (t < desde || t > hasta) {
    return null;
  }
  // Fundido de 0,4 s; en etiquetas muy breves se acorta para que quepa
  const f = Math.min(0.4, (hasta - desde) / 2 - 0.01);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        translate: `-50% ${interpolate(t, [desde, desde + f], [8, 0], {
          ...clamp,
          easing: Easing.out(Easing.cubic),
        })}px`,
        opacity: interpolate(
          t,
          [desde, desde + f, hasta - f, hasta],
          [0, 1, 1, 0],
          clamp,
        ),
        fontFamily: mono,
        fontWeight: 700,
        fontSize: tamano,
        color,
        background: C.pill,
        padding: "10px 22px",
        borderRadius: 14,
        whiteSpace: "nowrap",
      }}
    >
      {texto}
    </div>
  );
};

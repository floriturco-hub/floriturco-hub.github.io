import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { clamp } from "../theme";

const SOLAPE = 0.25; // s antes y después del tramo de narración
const T_TRANS = 15; // fotogramas de entrada/salida (~0,5 s)

const Paso: React.FC<{
  readonly children: React.ReactNode;
  readonly entrada: boolean;
  readonly salida: boolean;
}> = ({ children, entrada, salida }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const a = entrada ? 0 : 1; // opacidad/escala inicial (1 = sin transición de entrada)
  const z = salida ? 0 : 1; // opacidad final (1 = sin transición de salida)
  return (
    <AbsoluteFill
      style={{
        opacity: interpolate(
          frame,
          [0, T_TRANS, durationInFrames - T_TRANS, durationInFrames],
          [a, 1, 1, z],
          clamp,
        ),
        // Transición de "cámara": entra desde lejos y sale acercándose
        scale: interpolate(
          frame,
          [0, T_TRANS, durationInFrames - T_TRANS, durationInFrames],
          [entrada ? 0.85 : 1, 1, 1, salida ? 1.35 : 1],
          { ...clamp, easing: Easing.inOut(Easing.cubic) },
        ),
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

type Props = {
  readonly nombre: string;
  readonly desde: number;
  readonly hasta: number;
  readonly children: (t0: number) => React.ReactNode;
  readonly entrada?: boolean; // false: sin fundido de entrada (primera escena de un bucle)
  readonly salida?: boolean; // false: sin fundido de salida (última escena de un bucle)
};

// Una escena ocupa un tramo de la narración (en segundos absolutos).
// Los hijos reciben t0 para trabajar con los tiempos de la locución.
export const Escena: React.FC<Props> = ({
  nombre,
  desde,
  hasta,
  children,
  entrada = true,
  salida = true,
}) => {
  const { fps } = useVideoConfig();
  const t0 = Math.max(0, desde - SOLAPE);
  return (
    <Sequence
      name={nombre}
      from={Math.round(t0 * fps)}
      durationInFrames={Math.round((hasta + SOLAPE - t0) * fps)}
    >
      <Paso entrada={entrada} salida={salida}>
        {children(t0)}
      </Paso>
    </Sequence>
  );
};

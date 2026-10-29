import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Logo } from "../scenes/Logo";
import { C } from "../theme";
import { Recorrido } from "./Recorrido";
import { Tarjetas } from "./Tarjetas";
import { T } from "./tiempos";

export const INICIO_LOGO_PINA = T.fin + 0.5;
export const DURACION_PINA_S = INICIO_LOGO_PINA + 6.5;
const D = INICIO_LOGO_PINA - 61.5;

// Una sola escena-mundo (el diagrama de laboratorio) recorrida con la cámara
export const PinaVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena nombre="Diagrama" desde={0} hasta={INICIO_LOGO_PINA}>
        {(t0) => (
          <>
            <Recorrido t0={t0} />
            <Tarjetas t0={t0} />
          </>
        )}
      </Escena>
      <Escena nombre="Logo" desde={INICIO_LOGO_PINA} hasta={DURACION_PINA_S}>
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO_PINA} />}
      </Escena>

      {/* Etiquetas-clave: 2–4 palabras */}
      <Etiqueta texto="¿Mito o verdad?" desde={T.mito - 0.2} hasta={T.parece - 0.1} y={1660} color={C.yellow} tamano={60} />
      <Etiqueta texto="No es una licuadora" desde={T.licuadora} hasta={T.glandulas - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Fructosa propia" desde={T.fructosa} hasta={T.noViene - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="No viene de la piña" desde={T.noViene} hasta={T.sabor - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Compuestos que pasan" desde={T.compuestos + 0.4} hasta={T.estudios - 0.1} y={1660} color="#9AE07A" />
      <Etiqueta texto="Solo anécdotas" desde={T.anecdotas} hasta={T.agua - 0.1} y={1660} />
      <Etiqueta texto="No es magia" desde={T.magico - 0.2} hasta={T.fin + 0.4} y={1660} color={C.yellow} tamano={60} />

      {/* Sonido: esquema aprobado */}
      <Audio src={staticFile("audio/pina/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [0, 1.5, INICIO_LOGO_PINA - 0.3, INICIO_LOGO_PINA + 0.7, DURACION_PINA_S - 1.5, DURACION_PINA_S],
            [0, 0.2, 0.2, 0.45, 0.45, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[T.licuadora, T.cinco, T.noViene, T.estudios].map((tc) => (
        <Sequence key={tc} name="Tic" from={Math.round(tc * fps)} durationInFrames={Math.round(0.3 * fps)}>
          <Audio src={staticFile("audio/choque.wav")} volume={0.4} />
        </Sequence>
      ))}
      <Sequence name="SFX logo" from={Math.round((62.35 + D) * fps)} durationInFrames={Math.round(2.9 * fps)}>
        <Audio src={staticFile("audio/sfx_logo.wav")} volume={0.7} />
      </Sequence>
      <Sequence name="Voz: Frecuencia Cero" from={Math.round((63.75 + D) * fps)} durationInFrames={Math.round(1.7 * fps)}>
        <Audio src={staticFile("audio/frecuencia_cero.wav")} />
      </Sequence>
    </AbsoluteFill>
  );
};

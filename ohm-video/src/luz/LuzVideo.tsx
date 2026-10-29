import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Logo } from "../scenes/Logo";
import { C } from "../theme";
import { Casa } from "./Casa";
import { Tarjetas } from "./Tarjetas";
import { T } from "./tiempos";

export const INICIO_LOGO_LUZ = T.fin + 0.5;
export const DURACION_LUZ_S = INICIO_LOGO_LUZ + 6.5;
const D = INICIO_LOGO_LUZ - 61.5;

// Una sola escena-mundo (la casa en corte y el medidor de la fachada) recorrida con la cámara
export const LuzVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena nombre="Casa y medidor" desde={0} hasta={INICIO_LOGO_LUZ}>
        {(t0) => (
          <>
            <Casa t0={t0} />
            <Tarjetas t0={t0} />
          </>
        )}
      </Escena>
      <Escena nombre="Logo" desde={INICIO_LOGO_LUZ} hasta={DURACION_LUZ_S}>
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO_LUZ} />}
      </Escena>

      {/* Etiquetas-clave: 2–4 palabras */}
      <Etiqueta texto="Cobra energía" desde={T.energia - 0.1} hasta={T.parece - 0.1} y={1660} color={C.yellow} tamano={60} />
      <Etiqueta texto="Energía × tiempo" desde={T.pero} hasta={T.unidad - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Corriente y voltaje" desde={T.medidor} hasta={T.antiguos - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Cada parpadeo cuenta" desde={T.parpadeo} hasta={T.igual - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Nueva menos anterior" desde={T.diferencia} hasta={T.hora - 0.1} y={1660} />
      <Etiqueta texto="Precio según la hora" desde={T.hora} hasta={T.cargo - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Apaga todo" desde={T.apaga} hasta={T.sigue - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Consumo en silencio" desde={T.silencio} hasta={T.noPagas - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Pagas cada parpadeo" desde={T.parpadeoFinal - 0.3} hasta={T.fin + 0.4} y={1660} color={C.yellow} tamano={60} />

      {/* Sonido: esquema aprobado */}
      <Audio src={staticFile("audio/luz/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [0, 1.5, INICIO_LOGO_LUZ - 0.3, INICIO_LOGO_LUZ + 0.7, DURACION_LUZ_S - 1.5, DURACION_LUZ_S],
            [0, 0.2, 0.2, 0.45, 0.45, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[T.parpadea, T.gasta, T.parpadeo, T.precio, T.sigue].map((tc) => (
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

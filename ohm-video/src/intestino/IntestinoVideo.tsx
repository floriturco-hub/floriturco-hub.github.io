import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Logo } from "../scenes/Logo";
import { C } from "../theme";
import { Eje } from "./Eje";
import { Tarjetas } from "./Tarjetas";
import { T } from "./tiempos";

export const INICIO_LOGO_INTESTINO = T.fin + 0.5;
export const DURACION_INTESTINO_S = INICIO_LOGO_INTESTINO + 6.5;
const D = INICIO_LOGO_INTESTINO - 61.5;

// Una sola escena-mundo (persona con rayos X, pared intestinal y laboratorio) recorrida con la cámara
export const IntestinoVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena sinEntrada nombre="Eje intestino-cerebro" desde={0} hasta={INICIO_LOGO_INTESTINO}>
        {(t0) => (
          <>
            <Eje t0={t0} />
            <Tarjetas t0={t0} />
          </>
        )}
      </Escena>
      <Escena nombre="Logo" desde={INICIO_LOGO_INTESTINO} hasta={DURACION_INTESTINO_S}>
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO_INTESTINO} />}
      </Escena>

      {/* Etiquetas-clave: 2–4 palabras. La primera ya está en el primer fotograma (gancho) */}
      <Etiqueta texto="¿Ánimo en la tripa?" desde={-0.4} hasta={T.parece - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Hablan todo el tiempo" desde={T.hablan} hasta={T.nervio - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Nervio vago" desde={T.nervio} hasta={T.mayoria - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Mensajes hacia arriba" desde={T.arriba} hasta={T.fabrican - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Calman la inflamación" desde={T.acidos + 0.5} hasta={T.gaba - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="GABA calma neuronas" desde={T.gaba} hasta={T.tambien - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="No cruza al cerebro" desde={T.noLlega} hasta={T.ratones - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Peor ante el estrés" desde={T.estres} hasta={T.pones - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Más apáticos" desde={T.apaticos} hasta={T.humanos - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="¿Qué causa qué?" desde={T.causa - 0.4} hasta={T.noControlan - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="No te controlan" desde={T.noControlan} hasta={T.influyen - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Pero sí influyen" desde={T.influyen} hasta={T.ayuda - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Habla con un profesional" desde={T.profesional} hasta={T.final - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="No solo en tu cabeza" desde={T.final} hasta={T.inquilinos - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Tiene inquilinos" desde={T.inquilinos} hasta={T.fin + 0.4} y={1660} color={C.yellow} tamano={56} />

      {/* Sonido: música 6 dB más baja (0,1 bajo la voz, 0,225 en el cierre) */}
      <Audio src={staticFile("audio/intestino/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [0, 1.5, INICIO_LOGO_INTESTINO - 0.3, INICIO_LOGO_INTESTINO + 0.7, DURACION_INTESTINO_S - 1.5, DURACION_INTESTINO_S],
            [0, 0.1, 0.1, 0.225, 0.225, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[T.intestino, T.nervio, T.noLlega, T.estres, T.influyen].map((tc) => (
        <Sequence key={tc} name="Tic" from={Math.round(tc * fps)} durationInFrames={Math.round(0.3 * fps)}>
          <Audio src={staticFile("audio/choque.wav")} volume={tc === T.intestino ? 0.6 : 0.4} />
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

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

export const INICIO_LOGO_ORINAR = T.fin + 0.5;
export const DURACION_ORINAR_S = INICIO_LOGO_ORINAR + 6.5;
const D = INICIO_LOGO_ORINAR - 61.5;

// Una sola escena-mundo (calle y puerta de casa con pasillo al baño) recorrida con la cámara
export const OrinarVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena sinEntrada nombre="Puerta de casa" desde={0} hasta={INICIO_LOGO_ORINAR}>
        {(t0) => (
          <>
            <Casa t0={t0} />
            <Tarjetas t0={t0} />
          </>
        )}
      </Escena>
      <Escena nombre="Logo" desde={INICIO_LOGO_ORINAR} hasta={DURACION_ORINAR_S}>
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO_ORINAR} />}
      </Escena>

      {/* Etiquetas-clave: 2–4 palabras. La primera ya está en el primer fotograma (gancho) */}
      <Etiqueta texto="¿Justo en la puerta?" desde={-0.4} hasta={T.parece - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Cambió tu cerebro" desde={T.cambio} hasta={T.musculo - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Un músculo que se estira" desde={T.musculo} hasta={T.ml - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="«Todavía no»" desde={T.todavia} hasta={T.calle - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Freno puesto" desde={T.freno} hasta={T.aprende - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Aprende asociaciones" desde={T.aprende} hasta={T.asi - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Aquí sí se puede" desde={T.aqui} hasta={T.suelta - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Se suelta el freno" desde={T.suelta} hasta={T.pavlov - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Como Pavlov" desde={T.pavlov} hasta={T.urgencia - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Urgencia de la llave" desde={T.urgencia} hasta={T.truco - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="No corras" desde={T.corras} hasta={T.para - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Para y respira" desde={T.para} hasta={T.aprieta - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Aprieta el suelo pélvico" desde={T.aprieta} hasta={T.bajaU - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Baja en segundos" desde={T.bajaU} hasta={T.escapa - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Se entrena" desde={T.entrena} hasta={T.final - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="No es tu vejiga" desde={T.final} hasta={T.recordando - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Es tu cerebro recordando" desde={T.recordando} hasta={T.fin + 0.4} y={1660} color={C.yellow} />

      {/* Sonido: música 6 dB más baja (0,1 bajo la voz, 0,225 en el cierre) */}
      <Audio src={staticFile("audio/orinar/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [0, 1.5, INICIO_LOGO_ORINAR - 0.3, INICIO_LOGO_ORINAR + 0.7, DURACION_ORINAR_S - 1.5, DURACION_ORINAR_S],
            [0, 0.1, 0.1, 0.225, 0.225, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[T.meando, T.cambio, T.todavia, T.suelta, T.corras].map((tc) => (
        <Sequence key={tc} name="Tic" from={Math.round(tc * fps)} durationInFrames={Math.round(0.3 * fps)}>
          <Audio src={staticFile("audio/choque.wav")} volume={tc === T.meando ? 0.6 : 0.4} />
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

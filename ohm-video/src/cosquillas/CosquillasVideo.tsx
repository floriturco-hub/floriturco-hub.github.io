import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Logo } from "../scenes/Logo";
import { C } from "../theme";
import { Persona } from "./Persona";
import { Tarjetas } from "./Tarjetas";
import { T } from "./tiempos";

export const INICIO_LOGO_COSQUILLAS = T.fin + 0.5;
export const DURACION_COSQUILLAS_S = INICIO_LOGO_COSQUILLAS + 6.5;
const D = INICIO_LOGO_COSQUILLAS - 61.5;

// Una sola escena-mundo (una persona y su cerebro) recorrida con la cámara
export const CosquillasVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena nombre="Persona y cerebro" desde={0} hasta={INICIO_LOGO_COSQUILLAS}>
        {(t0) => (
          <>
            <Persona t0={t0} />
            <Tarjetas t0={t0} />
          </>
        )}
      </Escena>
      <Escena nombre="Logo" desde={INICIO_LOGO_COSQUILLAS} hasta={DURACION_COSQUILLAS_S}>
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO_COSQUILLAS} />}
      </Escena>

      {/* Etiquetas-clave: 2–4 palabras */}
      <Etiqueta texto="Tu cerebro lo predice" desde={0.4} hasta={T.noPuedes - 0.1} y={1660} color={C.yellow} tamano={52} />
      <Etiqueta texto="Sin cosquillas" desde={T.noPuedes} hasta={T.parece - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Es la sorpresa" desde={T.sorpresa - 0.2} hasta={T.decides - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Orden a los músculos" desde={T.orden} hasta={T.copia - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Una copia al cerebelo" desde={T.copia} hasta={T.calcula - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Predice el roce" desde={T.calcula} hasta={T.volumen - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Le baja el volumen" desde={T.volumen} hasta={T.experimento - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Con retraso, vuelven" desde={T.volvian - 0.3} hasta={T.mismoTruco - 0.1} y={1660} color={C.orange} />
      <Etiqueta texto="Pon tu mano encima" desde={T.pon} hasta={T.necesitan - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Necesitan sorpresa" desde={T.necesitan + 0.3} hasta={T.fin + 0.4} y={1660} color={C.yellow} tamano={60} />

      {/* Sonido: esquema aprobado */}
      <Audio src={staticFile("audio/cosquillas/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [0, 1.5, INICIO_LOGO_COSQUILLAS - 0.3, INICIO_LOGO_COSQUILLAS + 0.7, DURACION_COSQUILLAS_S - 1.5, DURACION_COSQUILLAS_S],
            [0, 0.2, 0.2, 0.45, 0.45, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[T.sorpresa, T.cerebelo, T.volumen, T.volvian, T.sorpresaFinal].map((tc) => (
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

import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Logo } from "../scenes/Logo";
import { C } from "../theme";
import { Dormitorio } from "./Dormitorio";
import { Tarjetas } from "./Tarjetas";
import { T } from "./tiempos";

export const INICIO_LOGO_PARALISIS = T.fin + 0.5;
export const DURACION_PARALISIS_S = INICIO_LOGO_PARALISIS + 6.5;
const D = INICIO_LOGO_PARALISIS - 61.5;

// Una sola escena-mundo (el dormitorio de noche) recorrida con la cámara
export const ParalisisVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena nombre="Dormitorio" desde={0} hasta={INICIO_LOGO_PARALISIS}>
        {(t0) => (
          <>
            <Dormitorio t0={t0} />
            <Tarjetas t0={t0} />
          </>
        )}
      </Escena>
      <Escena nombre="Logo" desde={INICIO_LOGO_PARALISIS} hasta={DURACION_PARALISIS_S}>
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO_PARALISIS} />}
      </Escena>

      {/* Etiquetas-clave: 2–4 palabras */}
      <Etiqueta texto="No puedes moverte" desde={T.noPuedes} hasta={T.sientes - 0.1} y={1660} color={C.yellow} tamano={60} />
      <Etiqueta texto="Despierta antes" desde={T.despertado} hasta={T.suenas - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Músculos desconectados" desde={T.desconecta} hasta={T.libran - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Un seguro" desde={T.seguro} hasta={T.aVeces - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Despierto y bloqueado" desde={T.despierto} hasta={T.sueno - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Restos del sueño" desde={T.sombras} hasta={T.miedo - 0.1} y={1660} color={C.purpleLight} />
      <Etiqueta texto="El miedo amplifica" desde={T.miedo} hasta={T.uno - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="No luches" desde={T.noLuches} hasta={T.dedoPie - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="No es un fantasma" desde={T.fantasma} hasta={T.despiertoFinal - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Cerebro despierto, cuerpo dormido" desde={T.despiertoFinal} hasta={T.fin + 0.4} y={1660} color={C.yellow} tamano={46} />

      {/* Sonido: esquema aprobado */}
      <Audio src={staticFile("audio/paralisis/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [0, 1.5, INICIO_LOGO_PARALISIS - 0.3, INICIO_LOGO_PARALISIS + 0.7, DURACION_PARALISIS_S - 1.5, DURACION_PARALISIS_S],
            [0, 0.2, 0.2, 0.45, 0.45, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[T.noPuedes, T.bloqueo, T.diez, T.dedoPie + 0.6].map((tc) => (
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

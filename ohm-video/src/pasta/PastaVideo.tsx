import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Logo } from "../scenes/Logo";
import { C } from "../theme";
import { Tubo } from "./Tubo";
import { Tarjetas } from "./Tarjetas";
import { T } from "./tiempos";

export const INICIO_LOGO_PASTA = T.fin + 0.5;
export const DURACION_PASTA_S = INICIO_LOGO_PASTA + 6.5;
const D = INICIO_LOGO_PASTA - 61.5;

// Una sola escena-mundo (lavabo con el tubo y fábrica de llenado) recorrida con la cámara
export const PastaVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena sinEntrada nombre="Lavabo y fábrica" desde={0} hasta={INICIO_LOGO_PASTA}>
        {(t0) => (
          <>
            <Tubo t0={t0} />
            <Tarjetas t0={t0} />
          </>
        )}
      </Escena>
      <Escena nombre="Logo" desde={INICIO_LOGO_PASTA} hasta={DURACION_PASTA_S}>
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO_PASTA} />}
      </Escena>

      {/* Etiquetas-clave: 2–4 palabras. La primera ya está en el primer fotograma (gancho) */}
      <Etiqueta texto="¿Por qué no se mezclan?" desde={-0.4} hasta={T.parece - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Sin separadores" desde={T.peroNo} hasta={T.secreto - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Se llena por detrás" desde={T.llena} hasta={T.inyecta - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Tres franjas a la vez" desde={T.franjas - 0.3} hasta={T.sella - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Fondo sellado" desde={T.sella} hasta={T.porQue - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Casi un sólido" desde={T.espesa} hasta={T.fluye - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="No se difunden" desde={T.difunden - 0.3} hasta={T.segunda - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Flujo laminar" desde={T.laminar} hasta={T.sinRemolinos - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Sin remolinos, sin mezcla" desde={T.noMezcla} hasta={T.truco - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Tubito con agujeros" desde={T.tubito} hasta={T.color - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="A veces, marketing" desde={T.marketing} hasta={T.final - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="No es magia" desde={T.final - 0.3} hasta={T.espesaFinal - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Demasiado espesa para remolinos" desde={T.espesaFinal} hasta={T.fin + 0.4} y={1660} color={C.yellow} tamano={42} />

      {/* Sonido: música 6 dB más baja (0,1 bajo la voz, 0,225 en el cierre) */}
      <Audio src={staticFile("audio/pasta/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [0, 1.5, INICIO_LOGO_PASTA - 0.3, INICIO_LOGO_PASTA + 0.7, DURACION_PASTA_S - 1.5, DURACION_PASTA_S],
            [0, 0.1, 0.1, 0.225, 0.225, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[T.perfectas, T.peroNo, T.sella, T.noMezcla, T.espesaFinal].map((tc) => (
        <Sequence key={tc} name="Tic" from={Math.round(tc * fps)} durationInFrames={Math.round(0.3 * fps)}>
          <Audio src={staticFile("audio/choque.wav")} volume={tc === T.perfectas ? 0.6 : 0.4} />
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

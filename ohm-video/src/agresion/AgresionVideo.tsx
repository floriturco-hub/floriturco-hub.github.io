import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Logo } from "../scenes/Logo";
import { C } from "../theme";
import { AgresionMundo } from "./Agresion";
import { Tarjetas } from "./Tarjetas";
import { T } from "./tiempos";

export const INICIO_LOGO_AGRESION = T.fin + 0.5;
export const DURACION_AGRESION_S = INICIO_LOGO_AGRESION + 6.5;
const D = INICIO_LOGO_AGRESION - 61.5;

// Una sola escena-mundo (cachorro con el medidor, cerebro con el depósito de dopamina y gráfica de la calma) recorrida con la cámara
export const AgresionVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena sinEntrada nombre="Cachorro y cerebro" desde={0} hasta={INICIO_LOGO_AGRESION}>
        {(t0) => (
          <>
            <AgresionMundo t0={t0} />
            <Tarjetas t0={t0} />
          </>
        )}
      </Escena>
      <Escena nombre="Logo" desde={INICIO_LOGO_AGRESION} hasta={DURACION_AGRESION_S}>
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO_AGRESION} />}
      </Escena>

      {/* Etiquetas-clave: 2–4 palabras. La primera (gancho) repite la frase de choque desde el primer fotograma */}
      <Etiqueta texto="¡Tu cerebro quiere morder cachorros!" desde={-0.4} hasta={T.ves - 0.1} y={1660} color={C.yellow} tamano={44} />
      <Etiqueta texto="Algo muy tierno…" desde={T.ves} hasta={T.aprietas - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Aprietas los dientes" desde={T.aprietas} hasta={T.punos - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Cierras los puños" desde={T.punos} hasta={T.comoMe - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="¡Me lo como!" desde={T.comoMe} hasta={T.nombre - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Agresión tierna" desde={T.nombre} hasta={T.todos - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Casi todos la sienten" desde={T.todos} hasta={T.adorable - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Sistema de recompensa" desde={T.adorable} hasta={T.dopamina - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Ola de dopamina" desde={T.dopamina} hasta={T.pero - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Demasiado grande…" desde={T.pero} hasta={T.desborda - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Te desborda" desde={T.desborda} hasta={T.equilibra - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Tu cerebro equilibra" desde={T.equilibra} hasta={T.contraria - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Una emoción contraria" desde={T.contraria} hasta={T.alegria - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Como llorar de alegría" desde={T.alegria} hasta={T.estudios - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Te calmas más rápido" desde={T.estudios} hasta={T.noDano - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="No quieres hacer daño" desde={T.noDano} hasta={T.cuidarlo - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Listo para cuidarlo" desde={T.cuidarlo} hasta={T.maldad - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Freno a la ternura" desde={T.maldad} hasta={T.fin + 0.4} y={1660} color={C.yellow} tamano={50} />

      {/* Sonido: música 6 dB más baja (0,1 bajo la voz, 0,225 en el cierre) */}
      <Audio src={staticFile("audio/agresion-tierna/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [0, 1.5, INICIO_LOGO_AGRESION - 0.3, INICIO_LOGO_AGRESION + 0.7, DURACION_AGRESION_S - 1.5, DURACION_AGRESION_S],
            [0, 0.1, 0.1, 0.225, 0.225, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[0.6, T.comoMe, T.contraria].map((tc) => (
        <Sequence key={tc} name="Tic" from={Math.round(tc * fps)} durationInFrames={Math.round(0.3 * fps)}>
          <Audio src={staticFile("audio/choque.wav")} volume={tc < 2 ? 0.6 : 0.4} />
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

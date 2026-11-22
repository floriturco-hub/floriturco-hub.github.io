import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Logo } from "../scenes/Logo";
import { C } from "../theme";
import { Cabeza } from "./Cabeza";
import { Coclea } from "./Coclea";
import { Dato } from "./Dato";
import { Espectro } from "./Espectro";
import { Ganancia } from "./Ganancia";
import { T } from "./tiempos";

export const INICIO_LOGO_TINNITUS = T.fin + 0.5;
export const DURACION_TINNITUS_S = INICIO_LOGO_TINNITUS + 6.5;
const D = INICIO_LOGO_TINNITUS - 61.5;

export const Tinnitus: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena nombre="Cabeza en silencio" desde={0} hasta={T.coclea}>
        {(t0) => <Cabeza t0={t0} fase="intro" />}
      </Escena>
      <Escena nombre="Cóclea" desde={T.coclea} hasta={T.entonces}>
        {(t0) => <Coclea t0={t0} />}
      </Escena>
      <Escena nombre="El cerebro sube el volumen" desde={T.entonces} hasta={T.pitido}>
        {(t0) => <Ganancia t0={t0} />}
      </Escena>
      <Escena nombre="Espectro" desde={T.pitido} hasta={T.dato}>
        {(t0) => <Espectro t0={t0} />}
      </Escena>
      <Escena nombre="Dato" desde={T.dato} hasta={T.final}>
        {(t0) => <Dato t0={t0} />}
      </Escena>
      <Escena nombre="Cabeza final" desde={T.final} hasta={INICIO_LOGO_TINNITUS}>
        {(t0) => <Cabeza t0={t0} fase="final" />}
      </Escena>
      <Escena nombre="Logo" desde={INICIO_LOGO_TINNITUS} hasta={DURACION_TINNITUS_S}>
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO_TINNITUS} />}
      </Escena>

      {/* Etiquetas-clave: 2–4 palabras */}
      <Etiqueta texto="Sin sonido fuera" desde={1.5} hasta={3.8} y={1640} />
      <Etiqueta texto="Tinnitus" desde={T.tinnitus} hasta={T.coclea - 0.3} y={1640} color={C.yellow} tamano={64} />
      <Etiqueta texto="Cóclea" desde={T.coclea + 0.7} hasta={T.ciliadas - 0.1} y={1560} color={C.yellow} />
      <Etiqueta texto="Células ciliadas" desde={T.ciliadas} hasta={T.agudos - 0.1} y={1560} />
      <Etiqueta texto="Agudos a la entrada" desde={T.agudos} hasta={T.graves - 0.1} y={1560} color={C.yellow} />
      <Etiqueta texto="Graves al fondo" desde={T.graves} hasta={T.sonido - 0.1} y={1560} color={C.purpleLight} />
      <Etiqueta texto="Avisan al cerebro" desde={T.avisan} hasta={T.ruido - 0.1} y={1560} color={C.cyan} />
      <Etiqueta texto="Ruido fuerte" desde={T.ruido} hasta={T.danar - 0.1} y={1560} color={C.red} />
      <Etiqueta texto="Caen los agudos" desde={T.caer} hasta={T.entonces - 0.1} y={1560} color={C.red} />
      <Etiqueta texto="Sin señal" desde={33.84} hasta={T.sube - 0.1} y={1680} color={C.red} />
      <Etiqueta texto="Sube el volumen" desde={T.sube} hasta={T.radio - 0.1} y={1680} color={C.yellow} />
      <Etiqueta texto="Radio sin emisora" desde={T.radio} hasta={T.pitido - 0.1} y={1680} />
      <Etiqueta texto="Ese es el pitido" desde={T.pitido + 2.0} hasta={T.perdido - 0.1} y={1560} color={C.yellow} />
      <Etiqueta texto="El tono perdido" desde={T.perdido} hasta={T.dia - 0.1} y={1560} color={C.red} />
      <Etiqueta texto="De día lo tapa" desde={T.dia} hasta={T.silencio - 0.1} y={1560} />
      <Etiqueta texto="En silencio, aparece" desde={T.silencio} hasta={T.dato - 0.1} y={1560} color={C.yellow} />
      <Etiqueta texto="Consulta a un especialista" desde={54.74} hasta={T.final - 0.1} y={1560} color={C.yellow} />
      <Etiqueta texto="Escuchando el silencio" desde={58.48} hasta={T.fin + 0.4} y={1640} color={C.yellow} tamano={56} />

      {/* Sonido: esquema aprobado + el propio pitido (suave) y el ruido fuerte */}
      <Audio src={staticFile("audio/tinnitus/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [0, 1.5, INICIO_LOGO_TINNITUS - 0.3, INICIO_LOGO_TINNITUS + 0.7, DURACION_TINNITUS_S - 1.5, DURACION_TINNITUS_S],
            [0, 0.2, 0.2, 0.45, 0.45, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[T.tinnitus - 0.3, T.silencio, T.final + 0.3].map((tc) => (
        <Sequence key={tc} name="Pitido" from={Math.round(tc * fps)} durationInFrames={Math.round(3.5 * fps)}>
          <Audio src={staticFile("audio/tinnitus/pitido.wav")} volume={0.35} />
        </Sequence>
      ))}
      <Sequence name="Ruido fuerte" from={Math.round(T.ruido * fps)} durationInFrames={Math.round(2.5 * fps)}>
        <Audio src={staticFile("audio/tinnitus/ruido.wav")} volume={0.35} />
      </Sequence>
      <Sequence name="SFX logo" from={Math.round((62.35 + D) * fps)} durationInFrames={Math.round(2.9 * fps)}>
        <Audio src={staticFile("audio/sfx_logo.wav")} volume={0.7} />
      </Sequence>
      <Sequence name="Voz: Frecuencia Cero" from={Math.round((63.75 + D) * fps)} durationInFrames={Math.round(1.7 * fps)}>
        <Audio src={staticFile("audio/frecuencia_cero.wav")} />
      </Sequence>
    </AbsoluteFill>
  );
};

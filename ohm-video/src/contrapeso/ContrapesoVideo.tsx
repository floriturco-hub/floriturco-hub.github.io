import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import narracion from "../../guion/contrapeso/narracion.json";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Progreso, Subtitulos } from "../components/Retencion";
import { C } from "../theme";
import { ContrapesoMundo } from "./Contrapeso";
import { T } from "./tiempos";

// Retención (estilo §10): 35 s, gancho que plantea la pregunta, bucle abierto, subtítulos arriba, barra de progreso y SIN logo: termina con «Por eso…» y empalma con «¿Qué se esconde detrás del ascensor?»
export const DURACION_CONTRAPESO_S = T.fin + 0.3;

export const ContrapesoVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena sinEntrada nombre="Hueco del ascensor" desde={0} hasta={DURACION_CONTRAPESO_S}>
        {(t0) => <ContrapesoMundo t0={t0} />}
      </Escena>

      <Subtitulos palabras={narracion.words} fin={T.fin} />
      <Progreso fin={DURACION_CONTRAPESO_S} />

      {/* Etiquetas-clave: 2–4 palabras. La primera (gancho) repite la frase de choque desde el primer fotograma */}
      <Etiqueta texto="¿Qué hay detrás?" desde={-0.4} hasta={T.final - 0.1} y={1660} color={C.yellow} tamano={50} />
      <Etiqueta texto="¿Cuánto mueve el motor?" desde={T.final} hasta={T.detras - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="El contrapeso" desde={T.detras} hasta={T.cables - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Cables y polea" desde={T.cables} hasta={T.pesa - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Cabina + media carga" desde={T.pesa} hasta={T.asi - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Uno baja, otro sube" desde={T.asi} hasta={T.subeybaja - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Sube y baja equilibrado" desde={T.subeybaja} hasta={T.motor - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Solo la diferencia" desde={T.motor} hasta={T.cuanto - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Unos cientos de kilos" desde={T.cuanto} hasta={T.pequeno - 0.1} y={1660} color={C.orange} />
      <Etiqueta texto="Motor pequeño" desde={T.pequeno} hasta={T.poreso - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="¿Qué hay detrás?" desde={T.poreso} hasta={DURACION_CONTRAPESO_S + 0.1} y={1660} color={C.yellow} tamano={50} />

      {/* Sonido: música a 0,1 bajo la voz, sin subida final (no hay logo); se funde en el último medio segundo */}
      <Audio src={staticFile("audio/contrapeso/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) => interpolate(f / fps, [0, 1.2, DURACION_CONTRAPESO_S - 0.5, DURACION_CONTRAPESO_S], [0, 0.1, 0.1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />
      {[1.0, T.detras + 0.3, T.subeybaja, T.diferencia, T.pequeno].map((tc) => (
        <Sequence key={tc} name="Tic" from={Math.round(tc * fps)} durationInFrames={Math.round(0.3 * fps)}>
          <Audio src={staticFile("audio/choque.wav")} volume={tc < 2 ? 0.6 : 0.4} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

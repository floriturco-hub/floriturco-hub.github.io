import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import narracion from "../../guion/cuadrado-perdido/narracion.json";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Progreso, Subtitulos } from "../components/Retencion";
import { C } from "../theme";
import { CuadradoMundo } from "./Cuadrado";
import { T } from "./tiempos";

// Retención (estilo §10): 34 s, gancho que plantea la pregunta, bucle abierto, subtítulos arriba, barra de progreso y SIN logo: termina con «…pregúntate:» y empalma con «¿De dónde sale este cuadrito?»
export const DURACION_CUADRADO_S = T.fin + 0.3;

export const CuadradoVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena sinEntrada nombre="Barra de chocolate y triángulo" desde={0} hasta={DURACION_CUADRADO_S}>
        {(t0) => <CuadradoMundo t0={t0} />}
      </Escena>

      <Subtitulos palabras={narracion.words} fin={T.fin} />
      <Progreso fin={DURACION_CUADRADO_S} />

      {/* Etiquetas-clave: 2–4 palabras. La primera (gancho) repite la frase de choque desde el primer fotograma */}
      <Etiqueta texto="¿De dónde sale?" desde={-0.4} hasta={T.final - 0.1} y={1660} color={C.yellow} tamano={50} />
      <Etiqueta texto="Un triángulo que engaña" desde={T.final} hasta={T.cortas - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Cortar y mover" desde={T.cortas} hasta={T.infinito - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="¿Chocolate infinito?" desde={T.infinito} hasta={T.fijate - 0.1} y={1660} color={C.orange} />
      <Etiqueta texto="La barra es más baja" desde={T.fijate} hasta={T.corte - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Tajadas finísimas" desde={T.corte} hasta={T.sumadas - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="= el cuadrito" desde={T.sumadas} hasta={T.aparece - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Solo se reparte" desde={T.aparece} hasta={T.curry - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Triángulo de Curry" desde={T.curry} hasta={T.borde - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="El borde se dobla" desde={T.borde} hasta={T.asi - 0.1} y={1660} color={C.orange} />
      <Etiqueta texto="¿De dónde sale?" desde={T.asi} hasta={DURACION_CUADRADO_S + 0.1} y={1660} color={C.yellow} tamano={50} />

      {/* Sonido: música a 0,1 bajo la voz, sin subida final (no hay logo); se funde en el último medio segundo */}
      <Audio src={staticFile("audio/cuadrado-perdido/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) => interpolate(f / fps, [0, 1.2, DURACION_CUADRADO_S - 0.5, DURACION_CUADRADO_S], [0, 0.1, 0.1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />
      {[1.0, T.cortas, T.sobra, T.corte, T.curry].map((tc) => (
        <Sequence key={tc} name="Tic" from={Math.round(tc * fps)} durationInFrames={Math.round(0.3 * fps)}>
          <Audio src={staticFile("audio/choque.wav")} volume={tc < 2 ? 0.6 : 0.4} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

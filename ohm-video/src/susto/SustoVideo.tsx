import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import narracion from "../../guion/susto-palido/narracion.json";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Progreso, Subtitulos } from "../components/Retencion";
import { C } from "../theme";
import { SustoMundo } from "./Susto";
import { T } from "./tiempos";

// Retención (estilo §10): 36 s, gancho que plantea la pregunta, bucle abierto, subtítulos arriba, barra de progreso y SIN logo: termina con «Por eso, cuando algo te asusta…» y empalma con «¿Por qué el miedo te pone pálido?»
export const DURACION_SUSTO_S = T.fin + 0.3;

export const SustoVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena sinEntrada nombre="Cara, cuerpo y vasos" desde={0} hasta={DURACION_SUSTO_S}>
        {(t0) => <SustoMundo t0={t0} />}
      </Escena>

      <Subtitulos palabras={narracion.words} fin={T.fin} />
      <Progreso fin={DURACION_SUSTO_S} />

      {/* Etiquetas-clave: 2–4 palabras. La primera (gancho) repite la frase de choque desde el primer fotograma */}
      <Etiqueta texto="¿Por qué pálido?" desde={-0.4} hasta={T.final - 0.1} y={1660} color={C.yellow} tamano={50} />
      <Etiqueta texto="¿Una ventaja?" desde={T.final} hasta={T.asustarte - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Lucha o huida" desde={T.asustarte} hasta={T.glandulas - 0.1} y={1660} color={C.orange} />
      <Etiqueta texto="Adrenalina" desde={T.glandulas} hasta={T.cierra - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Cierra vasos de la piel" desde={T.cierra} hasta={T.cara - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Cara y manos" desde={T.cara} hasta={T.menos - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Piel pálida" desde={T.menos} hasta={T.enfrian - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Manos frías" desde={T.enfrian} hasta={T.donde - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Sangre a los músculos" desde={T.donde} hasta={T.corazon - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Corazón y cerebro" desde={T.corazon} hasta={T.late - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Late rápido, respira hondo" desde={T.late} hasta={T.ventaja - 0.1} y={1660} color={C.orange} />
      <Etiqueta texto="Sangras menos" desde={T.ventaja} hasta={T.poreso - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="¿Por qué pálido?" desde={T.poreso} hasta={DURACION_SUSTO_S + 0.1} y={1660} color={C.yellow} tamano={50} />

      {/* Sonido: música a 0,1 bajo la voz, sin subida final (no hay logo); se funde en el último medio segundo */}
      <Audio src={staticFile("audio/susto-palido/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) => interpolate(f / fps, [0, 1.2, DURACION_SUSTO_S - 0.5, DURACION_SUSTO_S], [0, 0.1, 0.1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />
      {[0.1, T.adrenalina, T.cierra, T.late, T.fin - 0.5].map((tc) => (
        <Sequence key={tc} name="Tic" from={Math.round(tc * fps)} durationInFrames={Math.round(0.3 * fps)}>
          <Audio src={staticFile("audio/choque.wav")} volume={tc < 2 ? 0.6 : 0.4} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

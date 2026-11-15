import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import narracion from "../../guion/punto-triple/narracion.json";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Progreso, Subtitulos } from "../components/Retencion";
import { C } from "../theme";
import { TripleMundo } from "./Triple";
import { T } from "./tiempos";

// Retención (estilo §10): 33 s, gancho que plantea la pregunta, bucle abierto, subtítulos arriba, barra de progreso y SIN logo: termina con «Ahí, en un solo vaso…» y empalma con «¿Agua hirviendo y congelada a la vez?»
export const DURACION_TRIPLE_S = T.fin + 0.3;

export const TripleVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena sinEntrada nombre="Campana, diagrama y moléculas" desde={0} hasta={DURACION_TRIPLE_S}>
        {(t0) => <TripleMundo t0={t0} />}
      </Escena>

      <Subtitulos palabras={narracion.words} fin={T.fin} />
      <Progreso fin={DURACION_TRIPLE_S} />

      {/* Etiquetas-clave: 2–4 palabras. La primera (gancho) repite la frase de choque desde el primer fotograma */}
      <Etiqueta texto="¿Hierve y se congela?" desde={-0.4} hasta={T.final - 0.1} y={1660} color={C.yellow} tamano={50} />
      <Etiqueta texto="¿A qué presión?" desde={T.final} hasta={T.depende - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Hierve a 100 °C… con aire" desde={T.depende} hasta={T.sacas - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Bomba de vacío" desde={T.sacas} hasta={T.hervir - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Al hervir, se enfría" desde={T.hervir} hasta={T.sigues - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Menos presión" desde={T.sigues} hasta={T.congela - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="¡Hierve y se congela!" desde={T.congela} hasta={T.hielo - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Hielo, agua y vapor" desde={T.hielo} hasta={T.punto - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Punto triple: 0,01 °C" desde={T.punto} hasta={T.presion - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="160 veces menos presión" desde={T.presion} hasta={T.ahi - 0.1} y={1660} color={C.orange} />
      <Etiqueta texto="¿Hierve y se congela?" desde={T.ahi} hasta={DURACION_TRIPLE_S + 0.1} y={1660} color={C.yellow} tamano={50} />

      {/* Sonido: música a 0,1 bajo la voz, sin subida final (no hay logo); se funde en el último medio segundo */}
      <Audio src={staticFile("audio/punto-triple/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) => interpolate(f / fps, [0, 1.2, DURACION_TRIPLE_S - 0.5, DURACION_TRIPLE_S], [0, 0.1, 0.1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />
      {[1.0, T.bomba, T.congela, T.punto].map((tc) => (
        <Sequence key={tc} name="Tic" from={Math.round(tc * fps)} durationInFrames={Math.round(0.3 * fps)}>
          <Audio src={staticFile("audio/choque.wav")} volume={tc < 2 ? 0.6 : 0.4} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

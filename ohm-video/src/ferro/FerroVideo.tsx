import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import narracion from "../../guion/ferrofluido/narracion.json";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Progreso, Subtitulos } from "../components/Retencion";
import { C } from "../theme";
import { FerroMundo } from "./Ferro";
import { T } from "./tiempos";

// Retención (estilo §10): 37 s, bucle abierto, subtítulos arriba, barra de progreso y SIN logo: termina con «…sin gravedad. Porque…» y empalma con «¡Este líquido es un imán!»
export const DURACION_FERRO_S = T.fin + 0.3;

export const FerroVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena sinEntrada nombre="Ferrofluido, partículas y fuerzas" desde={0} hasta={DURACION_FERRO_S}>
        {(t0) => <FerroMundo t0={t0} />}
      </Escena>

      <Subtitulos palabras={narracion.words} fin={T.fin} />
      <Progreso fin={DURACION_FERRO_S} />

      {/* Etiquetas-clave: 2–4 palabras. La primera (gancho) repite la frase de choque desde el primer fotograma */}
      <Etiqueta texto="¡Un líquido imán!" desde={-0.4} hasta={T.final - 0.1} y={1660} color={C.yellow} tamano={50} />
      <Etiqueta texto="¿Quién lo inventó?" desde={T.final} hasta={T.aceite - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Aceite + hierro" desde={T.aceite} hasta={T.cabello - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Finísimas" desde={T.cabello} hasta={T.jabon - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Cubiertas de jabón" desde={T.jabon} hasta={T.sin - 0.1} y={1660} color={"#C8D860"} />
      <Etiqueta texto="Sin imán: líquido" desde={T.sin} hasta={T.acercar - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Cada una, un imán" desde={T.acercar} hasta={T.alinea - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Se alinean" desde={T.alinea} hasta={T.sube - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Sube por el campo" desde={T.sube} hasta={T.gravedad - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Gravedad y tensión" desde={T.gravedad} hasta={T.equilibrio - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Equilibrio: espinas" desde={T.equilibrio} hasta={T.quien - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="La NASA, años 60" desde={T.quien} hasta={T.mover - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Combustible sin gravedad" desde={T.mover} hasta={T.porque - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Porque… ¡es un imán!" desde={T.porque} hasta={DURACION_FERRO_S + 0.1} y={1660} color={C.yellow} tamano={50} />

      {/* Sonido: música a 0,1 bajo la voz, sin subida final (no hay logo); se funde en el último medio segundo */}
      <Audio src={staticFile("audio/ferrofluido/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) => interpolate(f / fps, [0, 1.2, DURACION_FERRO_S - 0.5, DURACION_FERRO_S], [0, 0.1, 0.1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />
      {[1.0, T.acercar + 0.3, T.sube, T.espinas, T.nasa].map((tc) => (
        <Sequence key={tc} name="Tic" from={Math.round(tc * fps)} durationInFrames={Math.round(0.3 * fps)}>
          <Audio src={staticFile("audio/choque.wav")} volume={tc < 2 ? 0.6 : 0.4} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

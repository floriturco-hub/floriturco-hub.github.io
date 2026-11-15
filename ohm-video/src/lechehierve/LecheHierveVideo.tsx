import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import narracion from "../../guion/leche-hierve/narracion.json";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Progreso, Subtitulos } from "../components/Retencion";
import { C } from "../theme";
import { LecheHierveMundo } from "./LecheHierve";
import { T } from "./tiempos";

// Retención (estilo §10): 36 s, gancho que plantea la pregunta, bucle abierto, subtítulos arriba, barra de progreso y SIN logo: termina con «Si no…» y empalma con «¿Por qué la leche se desborda?»
export const DURACION_LECHEHIERVE_S = T.fin + 0.3;

export const LecheHierveVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena sinEntrada nombre="Olla, microscopio y agua" desde={0} hasta={DURACION_LECHEHIERVE_S}>
        {(t0) => <LecheHierveMundo t0={t0} />}
      </Escena>

      <Subtitulos palabras={narracion.words} fin={T.fin} />
      <Progreso fin={DURACION_LECHEHIERVE_S} />

      {/* Etiquetas-clave: 2–4 palabras. La primera (gancho) repite la frase de choque desde el primer fotograma */}
      <Etiqueta texto="¿Por qué se desborda?" desde={-0.4} hasta={T.final - 0.1} y={1660} color={C.yellow} tamano={50} />
      <Etiqueta texto="¿Cómo evitarlo?" desde={T.final} hasta={T.leche - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Proteínas y grasa" desde={T.leche} hasta={T.calentarse - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Se forma la nata" desde={T.calentarse} hasta={T.abajo - 0.1} y={1660} color={"#F8E8B8"} />
      <Etiqueta texto="Burbujas de vapor" desde={T.abajo} hasta={T.atrapa - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="La nata las atrapa" desde={T.atrapa} hasta={T.espuma - 0.1} y={1660} color={C.orange} />
      <Etiqueta texto="Espuma que crece" desde={T.espuma} hasta={T.sale - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="¡Se desborda!" desde={T.sale} hasta={T.agua - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Agua: revientan" desde={T.agua} hasta={T.evitar - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Fuego medio y remover" desde={T.evitar} hasta={T.sino - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Si no… ¡se desborda!" desde={T.sino} hasta={DURACION_LECHEHIERVE_S + 0.1} y={1660} color={C.yellow} tamano={50} />

      {/* Sonido: música a 0,1 bajo la voz, sin subida final (no hay logo); se funde en el último medio segundo */}
      <Audio src={staticFile("audio/leche-hierve/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) => interpolate(f / fps, [0, 1.2, DURACION_LECHEHIERVE_S - 0.5, DURACION_LECHEHIERVE_S], [0, 0.1, 0.1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />
      {[1.0, T.capa, T.atrapa, T.sale, T.agua].map((tc) => (
        <Sequence key={tc} name="Tic" from={Math.round(tc * fps)} durationInFrames={Math.round(0.3 * fps)}>
          <Audio src={staticFile("audio/choque.wav")} volume={tc < 2 ? 0.6 : 0.4} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import narracion from "../../guion/sandia-sin-semillas/narracion.json";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Progreso, Subtitulos } from "../components/Retencion";
import { C } from "../theme";
import { SandiaMundo } from "./Sandia";
import { T } from "./tiempos";

// Retención (estilo §10): 38 s, bucle abierto, subtítulos arriba, barra de progreso y SIN logo: termina con «Pero las sandías…» y empalma con «¡Estas sandías nacen de semillas!»
export const DURACION_SANDIA_S = T.fin + 0.3;

export const SandiaVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena sinEntrada nombre="Semillas, cromosomas y campo" desde={0} hasta={DURACION_SANDIA_S}>
        {(t0) => <SandiaMundo t0={t0} />}
      </Escena>

      <Subtitulos palabras={narracion.words} fin={T.fin} />
      <Progreso fin={DURACION_SANDIA_S} />

      {/* Etiquetas-clave: 2–4 palabras. La primera (gancho) repite la frase de choque desde el primer fotograma */}
      <Etiqueta texto="¡Nacen de semillas!" desde={-0.4} hasta={T.final - 0.1} y={1660} color={C.yellow} tamano={50} />
      <Etiqueta texto="¿Y las uvas?" desde={T.final} hasta={T.normal - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Dos juegos de cromosomas" desde={T.normal} hasta={T.quimico - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Colchicina: cuatro juegos" desde={T.quimico} hasta={T.cruzar - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="4 + 2 → semilla de 3" desde={T.cruzar} hasta={T.parejas - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Tres no hacen parejas" desde={T.parejas} hasta={T.esteril - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Planta estéril" desde={T.esteril} hasta={T.semillas - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Semillas blanditas" desde={T.semillas} hasta={T.poreso - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="El cruce, cada año" desde={T.poreso} hasta={T.siembran - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Plantas normales al lado" desde={T.siembran} hasta={T.uvas - 0.1} y={1660} color={"#7AC87A"} />
      <Etiqueta texto="Uvas: ramas, clones" desde={T.uvas} hasta={T.pero - 0.1} y={1660} color={"#B89AF8"} />
      <Etiqueta texto="Pero las sandías… ¡semillas!" desde={T.pero} hasta={DURACION_SANDIA_S + 0.1} y={1660} color={C.yellow} tamano={50} />

      {/* Sonido: música a 0,1 bajo la voz, sin subida final (no hay logo); se funde en el último medio segundo */}
      <Audio src={staticFile("audio/sandia-sin-semillas/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) => interpolate(f / fps, [0, 1.2, DURACION_SANDIA_S - 0.5, DURACION_SANDIA_S], [0, 0.1, 0.1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />
      {[1.0, T.quimico + 1.2, T.cruzar, T.esteril, T.uvas].map((tc) => (
        <Sequence key={tc} name="Tic" from={Math.round(tc * fps)} durationInFrames={Math.round(0.3 * fps)}>
          <Audio src={staticFile("audio/choque.wav")} volume={tc < 2 ? 0.6 : 0.4} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

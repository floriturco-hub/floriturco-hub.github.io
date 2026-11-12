import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import narracion from "../../guion/estornudo-sol/narracion.json";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Progreso, Subtitulos } from "../components/Retencion";
import { C } from "../theme";
import { AchooMundo } from "./Achoo";
import { T } from "./tiempos";

// Retención (estilo §10): 34 s, bucle abierto, subtítulos arriba, barra de progreso y SIN logo: termina con «¡Achú! Porque…» y empalma con «¡El sol te hace estornudar!»
export const DURACION_ACHOO_S = T.fin + 0.3;

export const AchooVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena sinEntrada nombre="Cabeza, nervios y siglas" desde={0} hasta={DURACION_ACHOO_S}>
        {(t0) => <AchooMundo t0={t0} />}
      </Escena>

      <Subtitulos palabras={narracion.words} fin={T.fin} />
      <Progreso fin={DURACION_ACHOO_S} />

      {/* Etiquetas-clave: 2–4 palabras. La primera (gancho) repite la frase de choque desde el primer fotograma */}
      <Etiqueta texto="¡Estornudar por el sol!" desde={-0.4} hasta={T.final - 0.1} y={1660} color={C.yellow} tamano={50} />
      <Etiqueta texto="¿Por qué «ACHOO»?" desde={T.final} hasta={T.pasa - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="1 de cada 4" desde={T.pasa} hasta={T.salen - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="De lo oscuro al sol" desde={T.salen} hasta={T.explica - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="La explicación" desde={T.explica} hasta={T.nervio - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="El nervio de la luz" desde={T.nervio} hasta={T.nariz - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="El de la nariz" desde={T.nariz} hasta={T.destello - 0.1} y={1660} color={"#F8885A"} />
      <Etiqueta texto="Destello: señal fuerte" desde={T.destello} hasta={T.cruza - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="¡Se cruza!" desde={T.cruza} hasta={T.cerebro - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="¿Te pica la nariz?" desde={T.cerebro} hasta={T.hereda - 0.1} y={1660} color={"#F8885A"} />
      <Etiqueta texto="Se hereda" desde={T.hereda} hasta={T.nombre - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="¿Y el nombre?" desde={T.nombre} hasta={T.elegidas - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Siglas que estornudan" desde={T.elegidas} hasta={T.achu - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="¡Achú!" desde={T.achu} hasta={DURACION_ACHOO_S + 0.1} y={1660} color={C.yellow} tamano={50} />

      {/* Sonido: música a 0,1 bajo la voz, sin subida final (no hay logo); se funde en el último medio segundo */}
      <Audio src={staticFile("audio/estornudo-sol/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) => interpolate(f / fps, [0, 1.2, DURACION_ACHOO_S - 0.5, DURACION_ACHOO_S], [0, 0.1, 0.1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />
      {[1.0, T.sol, T.cruza, T.estornudas, T.achu].map((tc) => (
        <Sequence key={tc} name="Tic" from={Math.round(tc * fps)} durationInFrames={Math.round(0.3 * fps)}>
          <Audio src={staticFile("audio/choque.wav")} volume={tc < 2 ? 0.6 : 0.4} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

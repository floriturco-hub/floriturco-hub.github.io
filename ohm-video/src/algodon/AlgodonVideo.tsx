import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import narracion from "../../guion/algodon-azucar/narracion.json";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Progreso, Subtitulos } from "../components/Retencion";
import { C } from "../theme";
import { AlgodonMundo } from "./Algodon";
import { T } from "./tiempos";

// Retención (estilo §10): 35 s, bucle abierto, subtítulos arriba, barra de progreso y SIN logo: termina con «…pero es casi nada: es…» y empalma con «¡Esto es vidrio de azúcar!»
export const DURACION_ALGODON_S = T.fin + 0.3;

export const AlgodonVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena sinEntrada nombre="Máquina de algodón de azúcar" desde={0} hasta={DURACION_ALGODON_S}>
        {(t0) => <AlgodonMundo t0={t0} />}
      </Escena>

      <Subtitulos palabras={narracion.words} fin={T.fin} />
      <Progreso fin={DURACION_ALGODON_S} />

      {/* Etiquetas-clave: 2–4 palabras. La primera (gancho) repite la frase de choque desde el primer fotograma */}
      <Etiqueta texto="¡Vidrio de azúcar!" desde={-0.4} hasta={T.final - 0.1} y={1660} color={C.yellow} tamano={50} />
      <Etiqueta texto="¿Cuánto azúcar hay?" desde={T.final} hasta={T.centro - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Cabeza caliente que gira" desde={T.centro} hasta={T.cae - 0.1} y={1660} color={C.orange} />
      <Etiqueta texto="El azúcar se derrite" desde={T.cae} hasta={T.girar - 0.1} y={1660} color={"#F8A8C8"} />
      <Etiqueta texto="Fuerza centrífuga" desde={T.girar} hasta={T.hilos - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Hilos finísimos" desde={T.hilos} hasta={T.aire - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Se enfría al instante" desde={T.aire} hasta={T.vidrio - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Vidrio, como caramelo" desde={T.vidrio} hasta={T.enredan - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Enredados en el palito" desde={T.enredan} hasta={T.casi - 0.1} y={1660} color={"#F8A8C8"} />
      <Etiqueta texto="Casi todo aire" desde={T.casi} hasta={T.nube - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Azúcar de una lata" desde={T.nube} hasta={T.parece - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Parece mucho… casi nada" desde={T.parece} hasta={T.es - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Es… ¡vidrio de azúcar!" desde={T.es} hasta={DURACION_ALGODON_S + 0.1} y={1660} color={C.yellow} tamano={50} />

      {/* Sonido: música a 0,1 bajo la voz, sin subida final (no hay logo); se funde en el último medio segundo */}
      <Audio src={staticFile("audio/algodon-azucar/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) => interpolate(f / fps, [0, 1.2, DURACION_ALGODON_S - 0.5, DURACION_ALGODON_S], [0, 0.1, 0.1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />
      {[1.0, T.miles, T.lanza, T.vidrio, T.nube].map((tc) => (
        <Sequence key={tc} name="Tic" from={Math.round(tc * fps)} durationInFrames={Math.round(0.3 * fps)}>
          <Audio src={staticFile("audio/choque.wav")} volume={tc < 2 ? 0.6 : 0.4} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

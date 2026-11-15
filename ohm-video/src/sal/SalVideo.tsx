import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import narracion from "../../guion/sal-mesa/narracion.json";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Progreso, Subtitulos } from "../components/Retencion";
import { C } from "../theme";
import { SalMundo } from "./Sal";
import { T } from "./tiempos";

// Retención (estilo §10): 35 s, gancho que plantea la pregunta, bucle abierto, subtítulos arriba, barra de progreso y SIN logo: termina con «…así que…» y empalma con «¿Echas veneno a tus papas?»
export const DURACION_SAL_S = T.fin + 0.3;

export const SalVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena sinEntrada nombre="Papas, sodio, cloro y cristal" desde={0} hasta={DURACION_SAL_S}>
        {(t0) => <SalMundo t0={t0} />}
      </Escena>

      <Subtitulos palabras={narracion.words} fin={T.fin} />
      <Progreso fin={DURACION_SAL_S} />

      {/* Etiquetas-clave: 2–4 palabras. La primera (gancho) repite la frase de choque desde el primer fotograma */}
      <Etiqueta texto="¿Veneno en tus papas?" desde={-0.4} hasta={T.final - 0.1} y={1660} color={C.yellow} tamano={50} />
      <Etiqueta texto="¿Ya no es peligroso?" desde={T.final} hasta={T.sodio - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Sodio: explota en agua" desde={T.sodio} hasta={T.cloro - 0.1} y={1660} color={C.orange} />
      <Etiqueta texto="Cloro: gas venenoso" desde={T.cloro} hasta={T.pero - 0.1} y={1660} color={"#9AE87A"} />
      <Etiqueta texto="Sodio: sobra 1 electrón" desde={T.pero} hasta={T.falta - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Cloro: falta 1" desde={T.falta} hasta={T.juntan - 0.1} y={1660} color={"#9AE87A"} />
      <Etiqueta texto="Se lo entrega" desde={T.juntan} hasta={T.iones - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Iones + y −" desde={T.iones} hasta={T.cristales - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Forman cristales" desde={T.cristales} hasta={T.sal - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Sal de mesa: NaCl" desde={T.sal} hasta={T.ya - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Estables: no reaccionan" desde={T.ya} hasta={T.asi - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="¿Veneno en tus papas?" desde={T.asi} hasta={DURACION_SAL_S + 0.1} y={1660} color={C.yellow} tamano={50} />

      {/* Sonido: música a 0,1 bajo la voz, sin subida final (no hay logo); se funde en el último medio segundo */}
      <Audio src={staticFile("audio/sal-mesa/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) => interpolate(f / fps, [0, 1.2, DURACION_SAL_S - 0.5, DURACION_SAL_S], [0, 0.1, 0.1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />
      {[1.0, T.explotar, T.llama, T.cristales].map((tc) => (
        <Sequence key={tc} name="Tic" from={Math.round(tc * fps)} durationInFrames={Math.round(0.3 * fps)}>
          <Audio src={staticFile("audio/choque.wav")} volume={tc < 2 ? 0.6 : 0.4} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

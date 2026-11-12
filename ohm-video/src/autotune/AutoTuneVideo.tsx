import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import narracion from "../../guion/auto-tune/narracion.json";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Progreso, Subtitulos } from "../components/Retencion";
import { C } from "../theme";
import { AutoTuneMundo } from "./AutoTune";
import { T } from "./tiempos";

// Retención (estilo §10): 35 s, bucle abierto, subtítulos arriba, barra de progreso y SIN logo: termina con «Todo empezó…» y empalma con «¡Este programa nació buscando petróleo!»
export const DURACION_AUTOTUNE_S = T.fin + 0.3;

export const AutoTuneVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena sinEntrada nombre="Subsuelo, onda y escala" desde={0} hasta={DURACION_AUTOTUNE_S}>
        {(t0) => <AutoTuneMundo t0={t0} />}
      </Escena>

      <Subtitulos palabras={narracion.words} fin={T.fin} />
      <Progreso fin={DURACION_AUTOTUNE_S} />

      {/* Etiquetas-clave: 2–4 palabras. La primera (gancho) repite la frase de choque desde el primer fotograma */}
      <Etiqueta texto="¡Nació buscando petróleo!" desde={-0.4} hasta={T.final - 0.1} y={1660} color={C.yellow} tamano={50} />
      <Etiqueta texto="¿Por qué suena a robot?" desde={T.final} hasta={T.inventor - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Andy Hildebrand" desde={T.inventor} hasta={T.ecos - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Ecos del subsuelo" desde={T.ecos} hasta={T.uso - 0.1} y={1660} color={C.orange} />
      <Etiqueta texto="Matemáticas para la voz" desde={T.uso} hasta={T.corta - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Trocitos de milisegundos" desde={T.corta} hasta={T.busca - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Busca la repetición" desde={T.busca} hasta={T.sabe - 0.1} y={1660} color={"#48C878"} />
      <Etiqueta texto="Así sabe la nota" desde={T.sabe} hasta={T.compara - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="La nota más cercana" desde={T.compara} hasta={T.sube - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="La sube o la baja" desde={T.sube} hasta={T.todo - 0.1} y={1660} color={"#48C878"} />
      <Etiqueta texto="En pocos milisegundos" desde={T.todo} hasta={T.robotico - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="¿Y lo robótico?" desde={T.robotico} hasta={T.salta - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Saltos instantáneos" desde={T.salta} hasta={T.cher - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Cher, «Believe»" desde={T.cher} hasta={T.empezo - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Todo empezó…" desde={T.empezo} hasta={DURACION_AUTOTUNE_S + 0.1} y={1660} color={C.yellow} tamano={50} />

      {/* Sonido: música a 0,1 bajo la voz, sin subida final (no hay logo); se funde en el último medio segundo */}
      <Audio src={staticFile("audio/auto-tune/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) => interpolate(f / fps, [0, 1.2, DURACION_AUTOTUNE_S - 0.5, DURACION_AUTOTUNE_S], [0, 0.1, 0.1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />
      {[1.0, T.uso, T.patron, T.sube + 0.3, T.salta].map((tc) => (
        <Sequence key={tc} name="Tic" from={Math.round(tc * fps)} durationInFrames={Math.round(0.3 * fps)}>
          <Audio src={staticFile("audio/choque.wav")} volume={tc < 2 ? 0.6 : 0.4} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

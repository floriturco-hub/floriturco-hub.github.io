import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import narracion from "../../guion/maillard/narracion.json";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Progreso, Subtitulos } from "../components/Retencion";
import { C } from "../theme";
import { MaillardMundo } from "./Maillard";
import { T } from "./tiempos";

// Retención (estilo §10): 35 s, gancho que plantea la pregunta, bucle abierto, subtítulos arriba, barra de progreso y SIN logo: termina con «…del que da el agua. Por eso…» y empalma con «¿Por qué lo tostado sabe mejor?»
export const DURACION_MAILLARD_S = T.fin + 0.3;

export const MaillardVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena sinEntrada nombre="Sartén, moléculas y olla" desde={0} hasta={DURACION_MAILLARD_S}>
        {(t0) => <MaillardMundo t0={t0} />}
      </Escena>

      <Subtitulos palabras={narracion.words} fin={T.fin} />
      <Progreso fin={DURACION_MAILLARD_S} />

      {/* Etiquetas-clave: 2–4 palabras. La primera (gancho) repite la frase de choque desde el primer fotograma */}
      <Etiqueta texto="¿Por qué sabe mejor?" desde={-0.4} hasta={T.final - 0.1} y={1660} color={C.yellow} tamano={50} />
      <Etiqueta texto="¿Y hervido?" desde={T.final} hasta={T.superficie - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Azúcares y proteínas" desde={T.superficie} hasta={T.encima - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Más de 140 °C" desde={T.encima} hasta={T.maillard - 0.1} y={1660} color={C.orange} />
      <Etiqueta texto="Reacción de Maillard" desde={T.maillard} hasta={T.forman - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Moléculas nuevas" desde={T.forman} hasta={T.aromas - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Tostado, nuez, asado" desde={T.aromas} hasta={T.dorado - 0.1} y={1660} color={C.orange} />
      <Etiqueta texto="Color dorado" desde={T.dorado} hasta={T.costra - 0.1} y={1660} color={"#C88A3A"} />
      <Etiqueta texto="La costra" desde={T.costra} hasta={T.hervida - 0.1} y={1660} color={C.orange} />
      <Etiqueta texto="Agua: máximo 100 °C" desde={T.hervida} hasta={T.nunca - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="No llega: no se dora" desde={T.nunca} hasta={T.falta - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Más calor" desde={T.falta} hasta={T.poreso - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="¿Por qué sabe mejor?" desde={T.poreso} hasta={DURACION_MAILLARD_S + 0.1} y={1660} color={C.yellow} tamano={50} />

      {/* Sonido: música a 0,1 bajo la voz, sin subida final (no hay logo); se funde en el último medio segundo */}
      <Audio src={staticFile("audio/maillard/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) => interpolate(f / fps, [0, 1.2, DURACION_MAILLARD_S - 0.5, DURACION_MAILLARD_S], [0, 0.1, 0.1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />
      {[1.0, T.reaccionan + 0.9, T.forman, T.hervida].map((tc) => (
        <Sequence key={tc} name="Tic" from={Math.round(tc * fps)} durationInFrames={Math.round(0.3 * fps)}>
          <Audio src={staticFile("audio/choque.wav")} volume={tc < 2 ? 0.6 : 0.4} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

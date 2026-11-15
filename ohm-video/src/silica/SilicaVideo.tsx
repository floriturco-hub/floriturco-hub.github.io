import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import narracion from "../../guion/silica-gel/narracion.json";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Progreso, Subtitulos } from "../components/Retencion";
import { C } from "../theme";
import { SilicaMundo } from "./Silica";
import { T } from "./tiempos";

// Retención (estilo §10): 34 s, gancho que plantea la pregunta, bucle abierto, subtítulos arriba, barra de progreso y SIN logo: termina con «Ahora ya sabes…» y empalma con «¿Qué hay en esta bolsita?»
export const DURACION_SILICA_S = T.fin + 0.3;

export const SilicaVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena sinEntrada nombre="Caja, bolita y cancha" desde={0} hasta={DURACION_SILICA_S}>
        {(t0) => <SilicaMundo t0={t0} />}
      </Escena>

      <Subtitulos palabras={narracion.words} fin={T.fin} />
      <Progreso fin={DURACION_SILICA_S} />

      {/* Etiquetas-clave: 2–4 palabras. La primera (gancho) repite la frase de choque desde el primer fotograma */}
      <Etiqueta texto="¿Qué hay dentro?" desde={-0.4} hasta={T.final - 0.1} y={1660} color={C.yellow} tamano={50} />
      <Etiqueta texto="¿Por qué «no comer»?" desde={T.final} hasta={T.son - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Sílice, como la arena" desde={T.son} hasta={T.poros - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Llena de poros" desde={T.poros} hasta={T.gramo - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="1 g ≈ 700 m²" desde={T.gramo} hasta={T.cancha - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Más que una cancha" desde={T.cancha} hasta={T.humedad - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Atrapa la humedad" desde={T.humedad} hasta={T.zapatos - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Adiós moho" desde={T.zapatos} hasta={T.noes - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="No es veneno" desde={T.noes} hasta={T.entonces - 0.1} y={1660} color={"#48C878"} />
      <Etiqueta texto="Atraganta y no alimenta" desde={T.entonces} hasta={T.colorante - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Colorante tóxico" desde={T.colorante} hasta={T.ahora - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="¿Qué hay dentro?" desde={T.ahora} hasta={DURACION_SILICA_S + 0.1} y={1660} color={C.yellow} tamano={50} />

      {/* Sonido: música a 0,1 bajo la voz, sin subida final (no hay logo); se funde en el último medio segundo */}
      <Audio src={staticFile("audio/silica-gel/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) => interpolate(f / fps, [0, 1.2, DURACION_SILICA_S - 0.5, DURACION_SILICA_S], [0, 0.1, 0.1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />
      {[1.0, T.son, T.gramo, T.noes].map((tc) => (
        <Sequence key={tc} name="Tic" from={Math.round(tc * fps)} durationInFrames={Math.round(0.3 * fps)}>
          <Audio src={staticFile("audio/choque.wav")} volume={tc < 2 ? 0.6 : 0.4} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

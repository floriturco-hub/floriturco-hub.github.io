import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import narracion from "../../guion/superhidrofobico/narracion.json";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Progreso, Subtitulos } from "../components/Retencion";
import { C } from "../theme";
import { HidroMundo } from "./Hidro";
import { T } from "./tiempos";

// Retención (estilo §10): 35 s, bucle abierto, subtítulos arriba, barra de progreso y SIN logo: termina con «…sale limpia del lodo. Por eso…» y empalma con «¡El kétchup rebota en esta tela!»
export const DURACION_HIDRO_S = T.fin + 0.3;

export const HidroVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena sinEntrada nombre="Camiseta, microscopio y loto" desde={0} hasta={DURACION_HIDRO_S}>
        {(t0) => <HidroMundo t0={t0} />}
      </Escena>

      <Subtitulos palabras={narracion.words} fin={T.fin} />
      <Progreso fin={DURACION_HIDRO_S} />

      {/* Etiquetas-clave: 2–4 palabras. La primera (gancho) repite la frase de choque desde el primer fotograma */}
      <Etiqueta texto="¡El kétchup rebota!" desde={-0.4} hasta={T.final - 0.1} y={1660} color={C.yellow} tamano={50} />
      <Etiqueta texto="¿Copiado de qué planta?" desde={T.final} hasta={T.superficie - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Bultitos microscópicos" desde={T.superficie} hasta={T.pelusas - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Y pelusas encima" desde={T.pelusas} hasta={T.capa - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Capa que repele" desde={T.capa} hasta={T.gota - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="La gota no toca" desde={T.gota} hasta={T.apoya - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Solo las puntas" desde={T.apoya} hasta={T.colchon - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Colchón de aire" desde={T.colchon} hasta={T.contacto - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Esfera casi perfecta" desde={T.contacto} hasta={T.rueda - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Rueda y limpia" desde={T.rueda} hasta={T.ojo - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Con el roce, se pierde" desde={T.ojo} hasta={T.planta - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="La flor de loto" desde={T.planta} hasta={T.poreso - 0.1} y={1660} color={"#F8A8C8"} />
      <Etiqueta texto="Por eso… ¡rebota!" desde={T.poreso} hasta={DURACION_HIDRO_S + 0.1} y={1660} color={C.yellow} tamano={50} />

      {/* Sonido: música a 0,1 bajo la voz, sin subida final (no hay logo); se funde en el último medio segundo */}
      <Audio src={staticFile("audio/superhidrofobico/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) => interpolate(f / fps, [0, 1.2, DURACION_HIDRO_S - 0.5, DURACION_HIDRO_S], [0, 0.1, 0.1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />
      {[0.45, T.gota + 0.5, T.rueda, T.planta, T.poreso + 0.75].map((tc) => (
        <Sequence key={tc} name="Tic" from={Math.round(tc * fps)} durationInFrames={Math.round(0.3 * fps)}>
          <Audio src={staticFile("audio/choque.wav")} volume={tc < 2 ? 0.6 : 0.4} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

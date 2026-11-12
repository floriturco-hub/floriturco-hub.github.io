import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import narracion from "../../guion/bascula-digital/narracion.json";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Progreso, Subtitulos } from "../components/Retencion";
import { C } from "../theme";
import { BasculaMundo } from "./Bascula";
import { T } from "./tiempos";

// Retención (estilo §10): 35 s, bucle abierto, subtítulos arriba, barra de progreso y SIN logo: termina con «…pero no para tu peso» y empalma con «¡Tu peso dobla el metal!»
export const DURACION_BASCULA_S = T.fin + 0.3;

export const BasculaVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena sinEntrada nombre="Báscula y celda de carga" desde={0} hasta={DURACION_BASCULA_S}>
        {(t0) => <BasculaMundo t0={t0} />}
      </Escena>

      <Subtitulos palabras={narracion.words} fin={T.fin} />
      <Progreso fin={DURACION_BASCULA_S} />

      {/* Etiquetas-clave: 2–4 palabras. La primera (gancho) repite la frase de choque desde el primer fotograma */}
      <Etiqueta texto="¡Tu peso dobla el metal!" desde={-0.4} hasta={T.final - 0.1} y={1660} color={C.yellow} tamano={50} />
      <Etiqueta texto="¿Cuánto se dobla?" desde={T.final} hasta={T.dentro - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Celdas de carga" desde={T.dentro} hasta={T.subirte - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Se doblan un poquito" desde={T.subirte} hasta={T.pegado - 0.1} y={1660} color={C.orange} />
      <Etiqueta texto="Galga: hilo en zigzag" desde={T.pegado} hasta={T.cuando - 0.1} y={1660} color={"#F8883A"} />
      <Etiqueta texto="Se estira y adelgaza" desde={T.cuando} hasta={T.deja - 0.1} y={1660} color={"#F8883A"} />
      <Etiqueta texto="Conduce un poco peor" desde={T.deja} hasta={T.cambio - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Cambio diminuto" desde={T.cambio} hasta={T.circuito - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Puente de Wheatstone" desde={T.circuito} hasta={T.chip - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="El chip: kilos" desde={T.chip} hasta={T.cuanto - 0.1} y={1660} color={"#7AF0C8"} />
      <Etiqueta texto="≈ 0,2 mm" desde={T.cuanto} hasta={T.invisible - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Invisible para ti" desde={T.invisible} hasta={T.pero - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="¡Pero no para tu peso!" desde={T.pero} hasta={DURACION_BASCULA_S + 0.1} y={1660} color={C.yellow} tamano={50} />

      {/* Sonido: música a 0,1 bajo la voz, sin subida final (no hay logo); se funde en el último medio segundo */}
      <Audio src={staticFile("audio/bascula-digital/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) => interpolate(f / fps, [0, 1.2, DURACION_BASCULA_S - 0.5, DURACION_BASCULA_S], [0, 0.1, 0.1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />
      {[1.2, T.celdas, T.detecta, T.kilos, T.pero + 0.4].map((tc) => (
        <Sequence key={tc} name="Tic" from={Math.round(tc * fps)} durationInFrames={Math.round(0.3 * fps)}>
          <Audio src={staticFile("audio/choque.wav")} volume={tc < 2 ? 0.6 : 0.4} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import narracion from "../../guion/cerradura-hotel/narracion.json";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Progreso, Subtitulos } from "../components/Retencion";
import { C } from "../theme";
import { CerraduraMundo } from "./Cerradura";
import { T } from "./tiempos";

// Retención (estilo §10): 35 s, bucle abierto, subtítulos arriba, barra de progreso y SIN logo: termina con «…el mensaje viaja en tu tarjeta» y empalma con «¡La puerta borra al huésped anterior!»
export const DURACION_CERRADURA_S = T.fin + 0.3;

export const CerraduraVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena sinEntrada nombre="Puerta, tarjeta y cerradura" desde={0} hasta={DURACION_CERRADURA_S}>
        {(t0) => <CerraduraMundo t0={t0} />}
      </Escena>

      <Subtitulos palabras={narracion.words} fin={T.fin} />
      <Progreso fin={DURACION_CERRADURA_S} />

      {/* Etiquetas-clave: 2–4 palabras. La primera (gancho) repite la frase de choque desde el primer fotograma */}
      <Etiqueta texto="¡Borra al huésped anterior!" desde={-0.4} hasta={T.final - 0.1} y={1660} color={C.yellow} tamano={50} />
      <Etiqueta texto="No es la cerradura" desde={T.final} hasta={T.tarjeta - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Es tu tarjeta" desde={T.tarjeta} hasta={T.recepcion - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Recepción graba 3 datos" desde={T.recepcion} hasta={T.habitacion - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Habitación y salida" desde={T.habitacion} hasta={T.orden - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Número de orden" desde={T.orden} hasta={T.pilas - 0.1} y={1660} color={"#48C878"} />
      <Etiqueta texto="Pilas y reloj propio" desde={T.pilas} hasta={T.recuerda - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Recuerda el último nº" desde={T.recuerda} hasta={T.acercas - 0.1} y={1660} color={C.purpleLight} />
      <Etiqueta texto="Número mayor: abre" desde={T.acercas} hasta={T.abre - 0.1} y={1660} color={"#48C878"} />
      <Etiqueta texto="¡Te abre!" desde={T.abre} hasta={T.rechaza - 0.1} y={1660} color={"#48C878"} />
      <Etiqueta texto="Rechaza los viejos" desde={T.rechaza} hasta={T.nadie - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Si no, caduca sola" desde={T.nadie} hasta={T.sin - 0.1} y={1660} color={C.orange} />
      <Etiqueta texto="Sin internet ni cables" desde={T.sin} hasta={T.mensaje - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="¡Viaja en tu tarjeta!" desde={T.mensaje} hasta={DURACION_CERRADURA_S + 0.1} y={1660} color={C.yellow} tamano={50} />

      {/* Sonido: música a 0,1 bajo la voz, sin subida final (no hay logo); se funde en el último medio segundo */}
      <Audio src={staticFile("audio/cerradura-hotel/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) => interpolate(f / fps, [0, 1.2, DURACION_CERRADURA_S - 0.5, DURACION_CERRADURA_S], [0, 0.1, 0.1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />
      {[1.0, T.recepcion, T.abre, T.rechaza + 0.6, T.caduca].map((tc) => (
        <Sequence key={tc} name="Tic" from={Math.round(tc * fps)} durationInFrames={Math.round(0.3 * fps)}>
          <Audio src={staticFile("audio/choque.wav")} volume={tc < 2 ? 0.6 : 0.4} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

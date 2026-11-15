import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import narracion from "../../guion/supermercado/narracion.json";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Progreso, Subtitulos } from "../components/Retencion";
import { C } from "../theme";
import { SuperMundo } from "./Super";
import { T } from "./tiempos";

// Retención (estilo §10): 34 s, gancho que plantea la pregunta, bucle abierto, subtítulos arriba, barra de progreso y SIN logo: termina con «La próxima vez, pregúntate:» y empalma con «¿Por qué la leche está al fondo?»
export const DURACION_SUPER_S = T.fin + 0.3;

export const SuperVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena sinEntrada nombre="Plano del supermercado" desde={0} hasta={DURACION_SUPER_S}>
        {(t0) => <SuperMundo t0={t0} />}
      </Escena>

      <Subtitulos palabras={narracion.words} fin={T.fin} />
      <Progreso fin={DURACION_SUPER_S} />

      {/* Etiquetas-clave: 2–4 palabras. La primera (gancho) repite la frase de choque desde el primer fotograma */}
      <Etiqueta texto="¿Por qué al fondo?" desde={-0.4} hasta={T.final - 0.1} y={1660} color={C.yellow} tamano={50} />
      <Etiqueta texto="El truco del carrito" desde={T.final} hasta={T.entrar - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Frutas en la entrada" desde={T.entrar} hasta={T.colores - 0.1} y={1660} color={"#48C878"} />
      <Etiqueta texto="Colores y buen humor" desde={T.colores} hasta={T.sano - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Sano → capricho" desde={T.sano} hasta={T.leche - 0.1} y={1660} color={C.orange} />
      <Etiqueta texto="Lo más comprado" desde={T.leche} hasta={T.fondo - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Recorres toda la tienda" desde={T.fondo} hasta={T.tentacion - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Cada pasillo tienta" desde={T.tentacion} hasta={T.carrito - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Carritos más grandes" desde={T.carrito} hasta={T.vacio - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Medio vacío: lo llenas" desde={T.vacio} hasta={T.proxima - 0.1} y={1660} color={C.orange} />
      <Etiqueta texto="¿Por qué al fondo?" desde={T.proxima} hasta={DURACION_SUPER_S + 0.1} y={1660} color={C.yellow} tamano={50} />

      {/* Sonido: música a 0,1 bajo la voz, sin subida final (no hay logo); se funde en el último medio segundo */}
      <Audio src={staticFile("audio/supermercado/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) => interpolate(f / fps, [0, 1.2, DURACION_SUPER_S - 0.5, DURACION_SUPER_S], [0, 0.1, 0.1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />
      {[1.0, T.colores, T.leche, T.carrito, T.llenas].map((tc) => (
        <Sequence key={tc} name="Tic" from={Math.round(tc * fps)} durationInFrames={Math.round(0.3 * fps)}>
          <Audio src={staticFile("audio/choque.wav")} volume={tc < 2 ? 0.6 : 0.4} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

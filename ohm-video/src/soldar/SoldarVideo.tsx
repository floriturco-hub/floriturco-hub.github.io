import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import narracion from "../../guion/soldadura-submarina/narracion.json";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Progreso, Subtitulos } from "../components/Retencion";
import { C } from "../theme";
import { SoldarMundo } from "./Soldar";
import { T } from "./tiempos";

// Retención (estilo §10): 36 s, bucle abierto, subtítulos arriba, barra de progreso y SIN logo: termina con «…nunca a través del buzo. Por eso…» y empalma con «¡Suelda dentro del agua salada!»
export const DURACION_SOLDAR_S = T.fin + 0.3;

export const SoldarVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena sinEntrada nombre="Buzo, electrodo y circuito" desde={0} hasta={DURACION_SOLDAR_S}>
        {(t0) => <SoldarMundo t0={t0} />}
      </Escena>

      <Subtitulos palabras={narracion.words} fin={T.fin} />
      <Progreso fin={DURACION_SOLDAR_S} />

      {/* Etiquetas-clave: 2–4 palabras. La primera (gancho) repite la frase de choque desde el primer fotograma */}
      <Etiqueta texto="¡Suelda bajo el mar!" desde={-0.4} hasta={T.final - 0.1} y={1660} color={C.yellow} tamano={50} />
      <Etiqueta texto="¿Sin electrocutarse?" desde={T.final} hasta={T.buzo - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Electrodo con fundente" desde={T.buzo} hasta={T.acercar - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Arco a 5000 °C" desde={T.acercar} hasta={T.calor - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Burbuja de gas" desde={T.calor} hasta={T.dentro - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="El metal se funde" desde={T.dentro} hasta={T.electricidad - 0.1} y={1660} color={C.orange} />
      <Etiqueta texto="Corriente continua" desde={T.electricidad} hasta={T.pinza - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Pinza y traje aislados" desde={T.pinza} hasta={T.truco - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Electrodo → pieza" desde={T.truco} hasta={T.camino - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Nunca por el buzo" desde={T.camino} hasta={T.poreso - 0.1} y={1660} color={"#48C878"} />
      <Etiqueta texto="Por eso… ¡bajo el mar!" desde={T.poreso} hasta={DURACION_SOLDAR_S + 0.1} y={1660} color={C.yellow} tamano={50} />

      {/* Sonido: música a 0,1 bajo la voz, sin subida final (no hay logo); se funde en el último medio segundo */}
      <Audio src={staticFile("audio/soldadura-submarina/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) => interpolate(f / fps, [0, 1.2, DURACION_SOLDAR_S - 0.5, DURACION_SOLDAR_S], [0, 0.1, 0.1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />
      {[1.0, T.arco, T.burbuja, T.electricidad, T.nunca].map((tc) => (
        <Sequence key={tc} name="Tic" from={Math.round(tc * fps)} durationInFrames={Math.round(0.3 * fps)}>
          <Audio src={staticFile("audio/choque.wav")} volume={tc < 2 ? 0.6 : 0.4} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

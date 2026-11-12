import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import narracion from "../../guion/agua-sobreenfriada/narracion.json";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Progreso, Subtitulos } from "../components/Retencion";
import { C } from "../theme";
import { SobreMundo } from "./Sobre";
import { T } from "./tiempos";

// Retención (estilo §10): 35 s, bucle abierto, subtítulos arriba, barra de progreso y SIN logo: termina con «…nadie le dio la señal. Por eso…» y empalma con «¡Esta agua está bajo cero!»
export const DURACION_SOBRE_S = T.fin + 0.3;

export const SobreVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena sinEntrada nombre="Botella y moléculas" desde={0} hasta={DURACION_SOBRE_S}>
        {(t0) => <SobreMundo t0={t0} />}
      </Escena>

      <Subtitulos palabras={narracion.words} fin={T.fin} />
      <Progreso fin={DURACION_SOBRE_S} />

      {/* Etiquetas-clave: 2–4 palabras. La primera (gancho) repite la frase de choque desde el primer fotograma */}
      <Etiqueta texto="¡Bajo cero y líquida!" desde={-0.4} hasta={T.final - 0.1} y={1660} color={C.yellow} tamano={50} />
      <Etiqueta texto="¿Por qué no se congela?" desde={T.final} hasta={T.para - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Moléculas sueltas" desde={T.para} hasta={T.punto - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Un punto de partida" desde={T.punto} hasta={T.impureza - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Impureza, burbuja, grieta" desde={T.impureza} hasta={T.purificada - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Agua pura y quieta" desde={T.purificada} hasta={T.baja - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Bajo cero… y líquida" desde={T.baja} hasta={T.sobre - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Sobreenfriamiento" desde={T.sobre} hasta={T.golpe - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Un golpe: burbujas" desde={T.golpe} hasta={T.cristal - 0.1} y={1660} color={C.orange} />
      <Etiqueta texto="Cristales en cadena" desde={T.cristal} hasta={T.cruza - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="¡Hielo en segundos!" desde={T.cruza} hasta={T.nadie - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Nadie dio la señal" desde={T.nadie} hasta={T.poreso - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Por eso… ¡bajo cero!" desde={T.poreso} hasta={DURACION_SOBRE_S + 0.1} y={1660} color={C.yellow} tamano={50} />

      {/* Sonido: música a 0,1 bajo la voz, sin subida final (no hay logo); se funde en el último medio segundo */}
      <Audio src={staticFile("audio/agua-sobreenfriada/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) => interpolate(f / fps, [0, 1.2, DURACION_SOBRE_S - 0.5, DURACION_SOBRE_S], [0, 0.1, 0.1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />
      {[1.0, T.golpe, T.cristal, T.cruza].map((tc) => (
        <Sequence key={tc} name="Tic" from={Math.round(tc * fps)} durationInFrames={Math.round(0.3 * fps)}>
          <Audio src={staticFile("audio/choque.wav")} volume={tc < 2 ? 0.6 : 0.4} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

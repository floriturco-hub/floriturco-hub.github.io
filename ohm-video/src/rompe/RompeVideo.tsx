import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import narracion from "../../guion/rompehielos/narracion.json";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Progreso, Subtitulos } from "../components/Retencion";
import { C } from "../theme";
import { RompeMundo } from "./Rompe";
import { T } from "./tiempos";

// Retención (estilo §10): 38 s, bucle abierto, subtítulos arriba, barra de progreso y SIN logo: termina con «Porque este barco…» y empalma con «¡No corta el hielo: lo aplasta!»
export const DURACION_ROMPE_S = T.fin + 0.3;

export const RompeVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena sinEntrada nombre="Rompehielos, proas y casco" desde={0} hasta={DURACION_ROMPE_S}>
        {(t0) => <RompeMundo t0={t0} />}
      </Escena>

      <Subtitulos palabras={narracion.words} fin={T.fin} />
      <Progreso fin={DURACION_ROMPE_S} />

      {/* Etiquetas-clave: 2–4 palabras. La primera (gancho) repite la frase de choque desde el primer fotograma */}
      <Etiqueta texto="¡No corta: aplasta!" desde={-0.4} hasta={T.final - 0.1} y={1660} color={C.yellow} tamano={50} />
      <Etiqueta texto="¿Y si es muy grueso?" desde={T.final} hasta={T.proa - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Proa de cuchara" desde={T.proa} hasta={T.avanzar - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Se sube encima" desde={T.avanzar} hasta={T.peso - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Su peso empuja" desde={T.peso} hasta={T.parte - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="¡El hielo se parte!" desde={T.parte} hasta={T.afilada - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Afilada: se atasca" desde={T.afilada} hasta={T.casco - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Acero de varios cm" desde={T.casco} hasta={T.trozos - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Trozos por debajo" desde={T.trozos} hasta={T.grueso - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="¿Hielo muy grueso?" desde={T.grueso} hasta={T.retrocede - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Retrocede y embiste" desde={T.retrocede} hasta={T.algunos - 0.1} y={1660} color={C.orange} />
      <Etiqueta texto="Agua de lado a lado" desde={T.algunos} hasta={T.porque - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="¡No corta: aplasta!" desde={T.porque} hasta={DURACION_ROMPE_S + 0.1} y={1660} color={C.yellow} tamano={50} />

      {/* Sonido: música a 0,1 bajo la voz, sin subida final (no hay logo); se funde en el último medio segundo */}
      <Audio src={staticFile("audio/rompehielos/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) => interpolate(f / fps, [0, 1.2, DURACION_ROMPE_S - 0.5, DURACION_ROMPE_S], [0, 0.1, 0.1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />
      {[1.0, T.parte, T.retrocede + 1.6, T.retrocede + 3.7, T.algunos].map((tc) => (
        <Sequence key={tc} name="Tic" from={Math.round(tc * fps)} durationInFrames={Math.round(0.3 * fps)}>
          <Audio src={staticFile("audio/choque.wav")} volume={tc < 2 ? 0.6 : 0.4} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

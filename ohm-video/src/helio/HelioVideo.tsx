import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import narracion from "../../guion/helio-voz/narracion.json";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Progreso, Subtitulos } from "../components/Retencion";
import { C } from "../theme";
import { HelioMundo } from "./Helio";
import { T } from "./tiempos";

// Retención (estilo §10): 36 s, bucle abierto, subtítulos arriba, barra de progreso y SIN logo: termina con «Y aun así…» y empalma con «¡Tu voz no cambia de tono!»
export const DURACION_HELIO_S = T.fin + 0.3;

export const HelioVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena sinEntrada nombre="Cabeza, tubo y espectro" desde={0} hasta={DURACION_HELIO_S}>
        {(t0) => <HelioMundo t0={t0} />}
      </Escena>

      <Subtitulos palabras={narracion.words} fin={T.fin} />
      <Progreso fin={DURACION_HELIO_S} />

      {/* Etiquetas-clave: 2–4 palabras. La primera (gancho) repite la frase de choque desde el primer fotograma */}
      <Etiqueta texto="¡Tu voz no cambia!" desde={-0.4} hasta={T.final - 0.1} y={1660} color={C.yellow} tamano={50} />
      <Etiqueta texto="Y el gas contrario…" desde={T.final} hasta={T.hablar - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Las cuerdas vibran" desde={T.hablar} hasta={T.zumbido - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="El zumbido sube" desde={T.zumbido} hasta={T.caja - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Caja de resonancia" desde={T.caja} hasta={T.notas - 0.1} y={1660} color={C.orange} />
      <Etiqueta texto="Velocidad del sonido" desde={T.notas} hasta={T.helio - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Helio: ×3 más rápido" desde={T.helio} hasta={T.asi - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Notas más agudas" desde={T.asi} hasta={T.cuerdas - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Cuerdas: igual" desde={T.cuerdas} hasta={T.ardilla - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="¡Ardilla!" desde={T.ardilla} hasta={T.hexa - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Hexafluoruro de azufre" desde={T.hexa} hasta={T.lento - 0.1} y={1660} color={C.orange} />
      <Etiqueta texto="Sonido más lento" desde={T.lento} hasta={T.gigante - 0.1} y={1660} color={C.orange} />
      <Etiqueta texto="¡Voz de gigante!" desde={T.gigante} hasta={T.ojo - 0.1} y={1660} color={C.orange} />
      <Etiqueta texto="¡Ojo: quita oxígeno!" desde={T.ojo} hasta={T.aun - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Y aun así…" desde={T.aun} hasta={DURACION_HELIO_S + 0.1} y={1660} color={C.yellow} tamano={50} />

      {/* Sonido: música a 0,1 bajo la voz, sin subida final (no hay logo); se funde en el último medio segundo */}
      <Audio src={staticFile("audio/helio-voz/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) => interpolate(f / fps, [0, 1.2, DURACION_HELIO_S - 0.5, DURACION_HELIO_S], [0, 0.1, 0.1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />
      {[1.0, T.caja, T.helio, T.hexa, T.ojo].map((tc) => (
        <Sequence key={tc} name="Tic" from={Math.round(tc * fps)} durationInFrames={Math.round(0.3 * fps)}>
          <Audio src={staticFile("audio/choque.wav")} volume={tc < 2 ? 0.6 : 0.4} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

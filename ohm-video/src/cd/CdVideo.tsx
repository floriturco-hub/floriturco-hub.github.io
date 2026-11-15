import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import narracion from "../../guion/cd-arcoiris/narracion.json";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Progreso, Subtitulos } from "../components/Retencion";
import { C } from "../theme";
import { CdMundo } from "./Cd";
import { T } from "./tiempos";

// Retención (estilo §10): 34 s, gancho que plantea la pregunta, bucle abierto, subtítulos arriba, barra de progreso y SIN logo: termina con «…así que…» y empalma con «¿De dónde salen estos colores?»
export const DURACION_CD_S = T.fin + 0.3;

export const CdVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena sinEntrada nombre="CD, pistas y rejilla" desde={0} hasta={DURACION_CD_S}>
        {(t0) => <CdMundo t0={t0} />}
      </Escena>

      <Subtitulos palabras={narracion.words} fin={T.fin} />
      <Progreso fin={DURACION_CD_S} />

      {/* Etiquetas-clave: 2–4 palabras. La primera (gancho) repite la frase de choque desde el primer fotograma */}
      <Etiqueta texto="¿De dónde salen?" desde={-0.4} hasta={T.final - 0.1} y={1660} color={C.yellow} tamano={50} />
      <Etiqueta texto="¿Y la mariposa?" desde={T.final} hasta={T.cd - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Espiral de huequitos" desde={T.cd} hasta={T.lineas - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Líneas a 1,6 µm" desde={T.lineas} hasta={T.cabello - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Más fino que un cabello" desde={T.cabello} hasta={T.esas - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Rejilla de difracción" desde={T.esas} hasta={T.luz - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Cada color, una onda" desde={T.luz} hasta={T.rebotar - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Se suman o se anulan" desde={T.rebotar} hasta={T.angulo - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Cada color, su ángulo" desde={T.angulo} hasta={T.pintura - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="No es pintura: forma" desde={T.pintura} hasta={T.mariposas - 0.1} y={1660} color={C.orange} />
      <Etiqueta texto="Como las mariposas" desde={T.mariposas} hasta={T.asi - 0.1} y={1660} color={"#4A9AF8"} />
      <Etiqueta texto="¿De dónde salen?" desde={T.asi} hasta={DURACION_CD_S + 0.1} y={1660} color={C.yellow} tamano={50} />

      {/* Sonido: música a 0,1 bajo la voz, sin subida final (no hay logo); se funde en el último medio segundo */}
      <Audio src={staticFile("audio/cd-arcoiris/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) => interpolate(f / fps, [0, 1.2, DURACION_CD_S - 0.5, DURACION_CD_S], [0, 0.1, 0.1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />
      {[1.0, T.espiral, T.esas, T.colores, T.mariposas].map((tc) => (
        <Sequence key={tc} name="Tic" from={Math.round(tc * fps)} durationInFrames={Math.round(0.3 * fps)}>
          <Audio src={staticFile("audio/choque.wav")} volume={tc < 2 ? 0.6 : 0.4} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

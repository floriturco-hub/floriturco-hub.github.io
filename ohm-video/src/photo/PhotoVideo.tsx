import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import narracion from "../../guion/photo-finish/narracion.json";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Progreso, Subtitulos } from "../components/Retencion";
import { C } from "../theme";
import { PhotoMundo } from "./Photo";
import { T } from "./tiempos";

// Retención (estilo §10): 35 s, gancho que plantea la pregunta, bucle abierto, subtítulos arriba, barra de progreso y SIN logo: termina con «Por eso…» y empalma con «¿Por qué esta foto se ve tan rara?»
export const DURACION_PHOTO_S = T.fin + 0.3;

export const PhotoVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena sinEntrada nombre="Pista y foto de llegada" desde={0} hasta={DURACION_PHOTO_S}>
        {(t0) => <PhotoMundo t0={t0} />}
      </Escena>

      <Subtitulos palabras={narracion.words} fin={T.fin} />
      <Progreso fin={DURACION_PHOTO_S} />

      {/* Etiquetas-clave: 2–4 palabras. La primera (gancho) repite la frase de choque desde el primer fotograma */}
      <Etiqueta texto="¿Por qué se ve rara?" desde={-0.4} hasta={T.final - 0.1} y={1660} color={C.yellow} tamano={50} />
      <Etiqueta texto="¿Y la pista?" desde={T.final} hasta={T.camara - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="No es una foto normal" desde={T.camara} hasta={T.mira - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Solo una línea: la meta" desde={T.mira} hasta={T.miles - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Miles por segundo" desde={T.miles} hasta={T.despues - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Rebanadas juntas" desde={T.despues} hasta={T.asi - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Muestra el tiempo" desde={T.asi} hasta={T.cada - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Cada uno al cruzar" desde={T.cada} hasta={T.brazo - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Lento = estirado" desde={T.brazo} hasta={T.pista - 0.1} y={1660} color={C.orange} />
      <Etiqueta texto="La pista: siempre igual" desde={T.pista} hasta={T.poreso - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="¿Por qué se ve rara?" desde={T.poreso} hasta={DURACION_PHOTO_S + 0.1} y={1660} color={C.yellow} tamano={50} />

      {/* Sonido: música a 0,1 bajo la voz, sin subida final (no hay logo); se funde en el último medio segundo */}
      <Audio src={staticFile("audio/photo-finish/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) => interpolate(f / fps, [0, 1.2, DURACION_PHOTO_S - 0.5, DURACION_PHOTO_S], [0, 0.1, 0.1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />
      {[0.1, T.camara, T.despues, T.asi, T.pista].map((tc) => (
        <Sequence key={tc} name="Tic" from={Math.round(tc * fps)} durationInFrames={Math.round(0.3 * fps)}>
          <Audio src={staticFile("audio/choque.wav")} volume={tc < 2 ? 0.6 : 0.4} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

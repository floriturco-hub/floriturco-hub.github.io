import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import narracion from "../../guion/super-kamiokande/narracion.json";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Progreso, Subtitulos } from "../components/Retencion";
import { C } from "../theme";
import { KamiokaMundo } from "./Kamioka";
import { T } from "./tiempos";

// Retención (estilo §10): 37 s, gancho que plantea la pregunta, bucle abierto, subtítulos arriba, barra de progreso y SIN logo: termina con «…en 2015. Por eso…» y empalma con «¿Por qué enterraron este tanque?»
export const DURACION_KAMIOKA_S = T.fin + 0.3;

export const KamiokaVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena sinEntrada nombre="Montaña, sensores y neutrinos" desde={0} hasta={DURACION_KAMIOKA_S}>
        {(t0) => <KamiokaMundo t0={t0} />}
      </Escena>

      <Subtitulos palabras={narracion.words} fin={T.fin} />
      <Progreso fin={DURACION_KAMIOKA_S} />

      {/* Etiquetas-clave: 2–4 palabras. La primera (gancho) repite la frase de choque desde el primer fotograma */}
      <Etiqueta texto="¿Por qué enterrarlo?" desde={-0.4} hasta={T.final - 0.1} y={1660} color={C.yellow} tamano={50} />
      <Etiqueta texto="¿Qué premio ganó?" desde={T.final} hasta={T.japon - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="1 km bajo una montaña" desde={T.japon} hasta={T.tanque - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="50 000 t de agua pura" desde={T.tanque} hasta={T.sensores - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="11 000 sensores de luz" desde={T.sensores} hasta={T.neutrinos - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Neutrinos del Sol" desde={T.neutrinos} hasta={T.atraviesan - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Atraviesan la Tierra" desde={T.atraviesan} hasta={T.roca - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Roca como escudo" desde={T.roca} hasta={T.choca - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Un choque en el agua" desde={T.choca} hasta={T.lanza - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Destello azul" desde={T.lanza} hasta={T.captan - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Los sensores lo ven" desde={T.captan} hasta={T.descubrieron - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Cambian de tipo: masa" desde={T.descubrieron} hasta={T.nobel - 0.1} y={1660} color={C.orange} />
      <Etiqueta texto="Nobel de Física 2015" desde={T.nobel} hasta={T.poreso - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="¿Por qué enterrarlo?" desde={T.poreso} hasta={DURACION_KAMIOKA_S + 0.1} y={1660} color={C.yellow} tamano={50} />

      {/* Sonido: música a 0,1 bajo la voz, sin subida final (no hay logo); se funde en el último medio segundo */}
      <Audio src={staticFile("audio/super-kamiokande/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) => interpolate(f / fps, [0, 1.2, DURACION_KAMIOKA_S - 0.5, DURACION_KAMIOKA_S], [0, 0.1, 0.1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />
      {[1.0, T.sensores, T.choca + 1.4, T.destello, T.nobel].map((tc) => (
        <Sequence key={tc} name="Tic" from={Math.round(tc * fps)} durationInFrames={Math.round(0.3 * fps)}>
          <Audio src={staticFile("audio/choque.wav")} volume={tc < 2 ? 0.6 : 0.4} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

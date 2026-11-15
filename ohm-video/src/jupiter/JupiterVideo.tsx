import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import narracion from "../../guion/jupiter/narracion.json";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Progreso, Subtitulos } from "../components/Retencion";
import { C } from "../theme";
import { JupiterMundo } from "./Jupiter";
import { T } from "./tiempos";

// Retención (estilo §10): 38 s, gancho que plantea la pregunta, bucle abierto, subtítulos arriba, barra de progreso y SIN logo: termina con «Entonces…» y empalma con «¿Se puede aterrizar en Júpiter?»
export const DURACION_JUPITER_S = T.fin + 0.3;

export const JupiterVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena sinEntrada nombre="Júpiter por dentro" desde={0} hasta={DURACION_JUPITER_S}>
        {(t0) => <JupiterMundo t0={t0} />}
      </Escena>

      <Subtitulos palabras={narracion.words} fin={T.fin} />
      <Progreso fin={DURACION_JUPITER_S} />

      {/* Etiquetas-clave: 2–4 palabras. La primera (gancho) repite la frase de choque desde el primer fotograma */}
      <Etiqueta texto="¿Aterrizar en Júpiter?" desde={-0.4} hasta={T.final - 0.1} y={1660} color={C.yellow} tamano={50} />
      <Etiqueta texto="¿Qué hay en el centro?" desde={T.final} hasta={T.jupiter - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Una bola de gas" desde={T.jupiter} hasta={T.entrar - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="170 000 km/h" desde={T.entrar} hasta={T.sobrevives - 0.1} y={1660} color={C.orange} />
      <Etiqueta texto="Sin suelo" desde={T.sobrevives} hasta={T.presion - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Cada vez más denso" desde={T.presion} hasta={T.denso - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Como un líquido" desde={T.denso} hasta={T.abajo - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Hidrógeno metálico" desde={T.abajo} hasta={T.galileo - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Galileo: aplastada" desde={T.galileo} hasta={T.duro - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Menos de 1 hora" desde={T.duro} hasta={T.centro - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Núcleo de roca" desde={T.centro} hasta={T.caliente - 0.1} y={1660} color={C.orange} />
      <Etiqueta texto="Más caliente que el Sol" desde={T.caliente} hasta={T.entonces - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="¿Aterrizar en Júpiter?" desde={T.entonces} hasta={DURACION_JUPITER_S + 0.1} y={1660} color={C.yellow} tamano={50} />

      {/* Sonido: música a 0,1 bajo la voz, sin subida final (no hay logo); se funde en el último medio segundo */}
      <Audio src={staticFile("audio/jupiter/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) => interpolate(f / fps, [0, 1.2, DURACION_JUPITER_S - 0.5, DURACION_JUPITER_S], [0, 0.1, 0.1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />
      {[1.0, T.entrar, T.sobrevives, T.galileo, T.centro].map((tc) => (
        <Sequence key={tc} name="Tic" from={Math.round(tc * fps)} durationInFrames={Math.round(0.3 * fps)}>
          <Audio src={staticFile("audio/choque.wav")} volume={tc < 2 ? 0.6 : 0.4} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

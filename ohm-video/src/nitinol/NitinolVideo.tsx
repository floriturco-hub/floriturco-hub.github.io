import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import narracion from "../../guion/nitinol/narracion.json";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Progreso, Subtitulos } from "../components/Retencion";
import { C } from "../theme";
import { NitinolMundo } from "./Nitinol";
import { T } from "./tiempos";

// Retención (estilo §10): 37 s, bucle abierto, subtítulos arriba, barra de progreso y SIN logo: termina con «Un metal que…» y empalma con «¡Este metal recuerda su forma!»
export const DURACION_NITINOL_S = T.fin + 0.3;

export const NitinolVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena sinEntrada nombre="Clip, átomos y usos" desde={0} hasta={DURACION_NITINOL_S}>
        {(t0) => <NitinolMundo t0={t0} />}
      </Escena>

      <Subtitulos palabras={narracion.words} fin={T.fin} />
      <Progreso fin={DURACION_NITINOL_S} />

      {/* Etiquetas-clave: 2–4 palabras. La primera (gancho) repite la frase de choque desde el primer fotograma */}
      <Etiqueta texto="¡Recuerda su forma!" desde={-0.4} hasta={T.final - 0.1} y={1660} color={C.yellow} tamano={50} />
      <Etiqueta texto="¿Y su nombre?" desde={T.final} hasta={T.mezcla - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Níquel + titanio" desde={T.mezcla} hasta={T.atomos - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Dos formas de ordenarse" desde={T.atomos} hasta={T.frio - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Frío: se deja doblar" desde={T.frio} hasta={T.capas - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Capas como acordeón" desde={T.capas} hasta={T.calor - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Calor: vuelve el orden" desde={T.calor} hasta={T.alambre - 0.1} y={1660} color={C.orange} />
      <Etiqueta texto="Regresa a su forma" desde={T.alambre} hasta={T.usa - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Stents en arterias" desde={T.usa} hasta={T.gafas - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Gafas casi irrompibles" desde={T.gafas} hasta={T.nombre - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Ni + Ti + NOL" desde={T.nombre} hasta={T.metal - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="¡Un metal que recuerda!" desde={T.metal} hasta={DURACION_NITINOL_S + 0.1} y={1660} color={C.yellow} tamano={50} />

      {/* Sonido: música a 0,1 bajo la voz, sin subida final (no hay logo); se funde en el último medio segundo */}
      <Audio src={staticFile("audio/nitinol/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) => interpolate(f / fps, [0, 1.2, DURACION_NITINOL_S - 0.5, DURACION_NITINOL_S], [0, 0.1, 0.1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />
      {[1.0, T.atomos, T.vuelven, T.alambre, T.nombre].map((tc) => (
        <Sequence key={tc} name="Tic" from={Math.round(tc * fps)} durationInFrames={Math.round(0.3 * fps)}>
          <Audio src={staticFile("audio/choque.wav")} volume={tc < 2 ? 0.6 : 0.4} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

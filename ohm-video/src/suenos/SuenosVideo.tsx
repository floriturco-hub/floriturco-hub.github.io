import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import narracion from "../../guion/suenos-alarma/narracion.json";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Progreso, Subtitulos } from "../components/Retencion";
import { C } from "../theme";
import { SuenosMundo } from "./Suenos";
import { T } from "./tiempos";

// Retención (estilo §10): 33 s, gancho que plantea la pregunta, bucle abierto, subtítulos arriba, barra de progreso y SIN logo: termina con «Y cuando suena la alarma…» y empalma con «¿Por qué sueñas justo antes de despertar?»
export const DURACION_SUENOS_S = T.fin + 0.3;

export const SuenosVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena sinEntrada nombre="Dormitorio, hipnograma y cerebro" desde={0} hasta={DURACION_SUENOS_S}>
        {(t0) => <SuenosMundo t0={t0} />}
      </Escena>

      <Subtitulos palabras={narracion.words} fin={T.fin} />
      <Progreso fin={DURACION_SUENOS_S} />

      {/* Etiquetas-clave: 2–4 palabras. La primera (gancho) repite la frase de choque desde el primer fotograma */}
      <Etiqueta texto="¿Por qué sueñas al final?" desde={-0.4} hasta={T.final - 0.1} y={1660} color={C.yellow} tamano={50} />
      <Etiqueta texto="¿Por qué no lo notas?" desde={T.final} hasta={T.sueno - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Ciclos de 90 min" desde={T.sueno} hasta={T.fase - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Sueño REM: se alarga" desde={T.fase} hasta={T.principio - 0.1} y={1660} color={C.orange} />
      <Etiqueta texto="Minutos → casi 1 hora" desde={T.principio} hasta={T.poreso - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="La alarma te corta" desde={T.poreso} hasta={T.recuerdas - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Y lo recuerdas" desde={T.recuerdas} hasta={T.enrem - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Emociones e imágenes: ON" desde={T.enrem} hasta={T.pero - 0.1} y={1660} color={C.orange} />
      <Etiqueta texto="La lógica se apaga" desde={T.pero} hasta={T.volar - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Todo te parece normal" desde={T.volar} hasta={T.cuando - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="¿Por qué sueñas al final?" desde={T.cuando} hasta={DURACION_SUENOS_S + 0.1} y={1660} color={C.yellow} tamano={50} />

      {/* Sonido: música a 0,1 bajo la voz, sin subida final (no hay logo); se funde en el último medio segundo */}
      <Audio src={staticFile("audio/suenos-alarma/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) => interpolate(f / fps, [0, 1.2, DURACION_SUENOS_S - 0.5, DURACION_SUENOS_S], [0, 0.1, 0.1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />
      {[1.0, T.rem, T.alarma, T.enrem, T.apaga].map((tc) => (
        <Sequence key={tc} name="Tic" from={Math.round(tc * fps)} durationInFrames={Math.round(0.3 * fps)}>
          <Audio src={staticFile("audio/choque.wav")} volume={tc < 2 ? 0.6 : 0.4} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

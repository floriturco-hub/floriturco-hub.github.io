import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import narracion from "../../guion/motor-electrico/narracion.json";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Progreso, Subtitulos } from "../components/Retencion";
import { C } from "../theme";
import { MotorMundo } from "./Motor";
import { T } from "./tiempos";

// Retención (estilo §10): 34 s, gancho que plantea la pregunta, bucle abierto, subtítulos arriba, barra de progreso y SIN logo: termina con «…engaña al imán. Así…» y empalma con «¿Cómo gira un motor eléctrico?»
export const DURACION_MOTOR_S = T.fin + 0.3;

export const MotorVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena sinEntrada nombre="Motor y conmutador" desde={0} hasta={DURACION_MOTOR_S}>
        {(t0) => <MotorMundo t0={t0} />}
      </Escena>

      <Subtitulos palabras={narracion.words} fin={T.fin} />
      <Progreso fin={DURACION_MOTOR_S} />

      {/* Etiquetas-clave: 2–4 palabras. La primera (gancho) repite la frase de choque desde el primer fotograma */}
      <Etiqueta texto="¿Cómo gira?" desde={-0.4} hasta={T.final - 0.1} y={1660} color={C.yellow} tamano={50} />
      <Etiqueta texto="El truco de media vuelta" desde={T.final} hasta={T.dentro - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Imanes y una bobina" desde={T.dentro} hasta={T.corriente - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Corriente: electroimán" desde={T.corriente} hasta={T.polo - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Norte atraído por sur" desde={T.polo} hasta={T.pero - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Se quedaría quieta" desde={T.pero} hasta={T.truco - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="El conmutador" desde={T.truco} hasta={T.invierte - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Invierte la corriente" desde={T.invierte} hasta={T.polos - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Atrae → empuja" desde={T.polos} hasta={T.cada - 0.1} y={1660} color={C.orange} />
      <Etiqueta texto="Cada media vuelta" desde={T.cada} hasta={T.asi - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="¿Cómo gira?" desde={T.asi} hasta={DURACION_MOTOR_S + 0.1} y={1660} color={C.yellow} tamano={50} />

      {/* Sonido: música a 0,1 bajo la voz, sin subida final (no hay logo); se funde en el último medio segundo */}
      <Audio src={staticFile("audio/motor-electrico/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) => interpolate(f / fps, [0, 1.2, DURACION_MOTOR_S - 0.5, DURACION_MOTOR_S], [0, 0.1, 0.1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />
      {[1.0, T.corriente, T.truco, T.instante, T.engana].map((tc) => (
        <Sequence key={tc} name="Tic" from={Math.round(tc * fps)} durationInFrames={Math.round(0.3 * fps)}>
          <Audio src={staticFile("audio/choque.wav")} volume={tc < 2 ? 0.6 : 0.4} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Logo } from "../scenes/Logo";
import { C } from "../theme";
import { Espacio } from "./Espacio";
import { Generaciones, Poblacion } from "./Evolucion";
import { Ganadora } from "./Ganadora";
import { T } from "./tiempos";

export const INICIO_LOGO_ANTENA = T.fin + 0.5;
export const DURACION_ANTENA_S = INICIO_LOGO_ANTENA + 6.5;
const D = INICIO_LOGO_ANTENA - 61.5;

export const AntenaNasa: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena nombre="Satélite y órbita" desde={0} hasta={T.ingenieros}>
        {(t0) => <Espacio t0={t0} fase="intro" />}
      </Escena>
      <Escena nombre="Población y ADN" desde={T.ingenieros} hasta={T.mezclan}>
        {(t0) => <Poblacion t0={t0} />}
      </Escena>
      <Escena nombre="Cruce y generaciones" desde={T.mezclan} hasta={T.aparecio}>
        {(t0) => <Generaciones t0={t0} />}
      </Escena>
      <Escena nombre="La ganadora" desde={T.aparecio} hasta={T.primera}>
        {(t0) => <Ganadora t0={t0} fase="ganadora" />}
      </Escena>
      <Escena nombre="Lanzamiento" desde={T.primera} hasta={T.sobrevivio}>
        {(t0) => <Espacio t0={t0} fase="lanzamiento" />}
      </Escena>
      <Escena nombre="Cierre" desde={T.sobrevivio} hasta={INICIO_LOGO_ANTENA}>
        {(t0) => <Ganadora t0={t0} fase="final" />}
      </Escena>
      <Escena nombre="Logo" desde={INICIO_LOGO_ANTENA} hasta={DURACION_ANTENA_S}>
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO_ANTENA} />}
      </Escena>

      {/* Etiquetas-clave: 2–4 palabras */}
      <Etiqueta texto="Ninguna persona" desde={T.persona} hasta={T.computadora - 0.1} y={1640} />
      <Etiqueta texto="La diseñó una computadora" desde={T.computadora} hasta={T.evolucion - 0.1} y={1640} color={C.cyan} />
      <Etiqueta texto="Imitando la evolución" desde={T.evolucion} hasta={T.mision - 0.1} y={1640} color={C.yellow} />
      <Etiqueta texto="Pocos centímetros" desde={T.centimetros + 0.4} hasta={T.angulo - 0.1} y={520} />
      <Etiqueta texto="Casi cualquier ángulo" desde={T.angulo} hasta={T.ingenieros - 0.1} y={520} color={C.cyan} />
      <Etiqueta texto="Sin dibujar nada" desde={T.ingenieros + 0.4} hasta={T.azar - 0.1} y={1720} />
      <Etiqueta texto="Antenas al azar" desde={T.azar} hasta={T.adn - 0.2} y={1720} />
      <Etiqueta texto="Un ADN de instrucciones" desde={T.avanza - 0.6} hasta={T.simulador - 0.1} y={1720} color={C.yellow} />
      <Etiqueta texto="Simulador" desde={T.simulador} hasta={T.sobreviven - 0.1} y={1720} color={C.cyan} />
      <Etiqueta texto="Sobreviven las mejores" desde={T.sobreviven} hasta={T.mezclan - 0.1} y={1720} color={C.yellow} />
      <Etiqueta texto="Mezcla + mutación" desde={T.mutaciones} hasta={T.generacion - 0.1} y={1760} color={C.yellow} />
      <Etiqueta texto="Y otra, y otra" desde={T.otra} hasta={T.aparecio - 0.1} y={1760} />
      <Etiqueta texto="Rara, asimétrica" desde={T.rara} hasta={T.mejor - 0.1} y={1720} />
      <Etiqueta texto="Mejor que la humana" desde={T.mejor + 0.4} hasta={T.requisitos - 0.1} y={1720} color={C.yellow} />
      <Etiqueta texto="En pocas semanas" desde={T.semanas} hasta={T.primera - 0.1} y={1720} color={C.cyan} />
      <Etiqueta texto="Primera en el espacio" desde={T.primera} hasta={T.sobrevivio - 0.1} y={480} color={C.yellow} />
      <Etiqueta texto="Sobrevivió" desde={T.sobrevivio + 0.9} hasta={T.fin + 0.4} y={1720} color={C.yellow} tamano={64} />

      {/* Sonido: esquema aprobado */}
      <Audio src={staticFile("audio/antena/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [0, 1.5, INICIO_LOGO_ANTENA - 0.3, INICIO_LOGO_ANTENA + 0.7, DURACION_ANTENA_S - 1.5, DURACION_ANTENA_S],
            [0, 0.2, 0.2, 0.45, 0.45, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[T.sobreviven, T.descartan, T.mutaciones].map((tc) => (
        <Sequence key={tc} name="Tic" from={Math.round(tc * fps)} durationInFrames={Math.round(0.3 * fps)}>
          <Audio src={staticFile("audio/choque.wav")} volume={0.4} />
        </Sequence>
      ))}
      <Sequence name="SFX logo" from={Math.round((62.35 + D) * fps)} durationInFrames={Math.round(2.9 * fps)}>
        <Audio src={staticFile("audio/sfx_logo.wav")} volume={0.7} />
      </Sequence>
      <Sequence name="Voz: Frecuencia Cero" from={Math.round((63.75 + D) * fps)} durationInFrames={Math.round(1.7 * fps)}>
        <Audio src={staticFile("audio/frecuencia_cero.wav")} />
      </Sequence>
    </AbsoluteFill>
  );
};

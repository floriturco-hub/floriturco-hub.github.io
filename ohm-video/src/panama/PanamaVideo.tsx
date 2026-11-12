import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import narracion from "../../guion/canal-panama/narracion.json";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Progreso, Subtitulos } from "../components/Retencion";
import { C } from "../theme";
import { PanamaMundo } from "./Panama";
import { T } from "./tiempos";

// Retención (estilo §10): 38 s, bucle abierto, subtítulos arriba, barra de progreso y SIN logo: termina con «…porque en Panamá…» y empalma con «¡La lluvia sube este barco!»
export const DURACION_PANAMA_S = T.fin + 0.3;

export const PanamaVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena sinEntrada nombre="Esclusas y lago Gatún" desde={0} hasta={DURACION_PANAMA_S}>
        {(t0) => <PanamaMundo t0={t0} />}
      </Escena>

      <Subtitulos palabras={narracion.words} fin={T.fin} />
      <Progreso fin={DURACION_PANAMA_S} />

      {/* Etiquetas-clave: 2–4 palabras. La primera (gancho) repite la frase de choque desde el primer fotograma */}
      <Etiqueta texto="¡La lluvia lo sube!" desde={-0.4} hasta={T.final - 0.1} y={1660} color={C.yellow} tamano={50} />
      <Etiqueta texto="¿Cuánta agua gasta?" desde={T.final} hasta={T.canal - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Lago Gatún" desde={T.canal} hasta={T.metros - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="26 metros arriba" desde={T.metros} hasta={T.llegar - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Esclusas: cámaras" desde={T.llegar} hasta={T.escalones - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Escalones de agua" desde={T.escalones} hasta={T.entra - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Entra y se cierra" desde={T.entra} hasta={T.valvulas - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Válvulas abiertas" desde={T.valvulas} hasta={T.gravedad - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Solo gravedad" desde={T.gravedad} hasta={T.llena - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="El barco flota arriba" desde={T.llena} hasta={T.siguiente - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Siguiente escalón" desde={T.siguiente} hasta={T.tres - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Tres escalones: ¡lago!" desde={T.tres} hasta={T.agua - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Ríos y lluvia" desde={T.agua} hasta={T.gasta - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="≈ 200 millones de litros" desde={T.gasta} hasta={T.porque - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="En Panamá… ¡la lluvia!" desde={T.porque} hasta={DURACION_PANAMA_S + 0.1} y={1660} color={C.yellow} tamano={50} />

      {/* Sonido: música a 0,1 bajo la voz, sin subida final (no hay logo); se funde en el último medio segundo */}
      <Audio src={staticFile("audio/canal-panama/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) => interpolate(f / fps, [0, 1.2, DURACION_PANAMA_S - 0.5, DURACION_PANAMA_S], [0, 0.1, 0.1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />
      {[1.0, T.cierra, T.llena, T.lago, T.gasta].map((tc) => (
        <Sequence key={tc} name="Tic" from={Math.round(tc * fps)} durationInFrames={Math.round(0.3 * fps)}>
          <Audio src={staticFile("audio/choque.wav")} volume={tc < 2 ? 0.6 : 0.4} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

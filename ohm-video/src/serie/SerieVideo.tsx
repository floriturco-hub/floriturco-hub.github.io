import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import narracion from "../../guion/numero-serie/narracion.json";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Progreso, Subtitulos } from "../components/Retencion";
import { C } from "../theme";
import { SerieMundo } from "./Serie";
import { T } from "./tiempos";

// Retención (estilo §10): 39 s, bucle abierto, subtítulos arriba, barra de progreso y SIN logo:
// termina con la narración y empalma con el gancho («…porque el metal…» → «¡El metal recuerda los números!»)
export const DURACION_SERIE_S = T.fin + 0.3;

export const SerieVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena sinEntrada nombre="Placa y corte" desde={0} hasta={DURACION_SERIE_S}>
        {(t0) => <SerieMundo t0={t0} />}
      </Escena>

      <Subtitulos palabras={narracion.words} fin={T.fin} />
      <Progreso fin={DURACION_SERIE_S} />

      {/* Etiquetas-clave: 2–4 palabras. La primera (gancho) repite la frase de choque desde el primer fotograma */}
      <Etiqueta texto="¡El metal recuerda!" desde={-0.4} hasta={T.final - 0.1} y={1660} color={C.yellow} tamano={50} />
      <Etiqueta texto="¿Por qué en segundos?" desde={T.final} hasta={T.estampa - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Estampar un número" desde={T.estampa} hasta={T.golpe - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Aplasta los cristales" desde={T.golpe} hasta={T.ladron - 0.1} y={1660} color={C.orange} />
      <Etiqueta texto="Lo liman: liso" desde={T.ladron} hasta={T.pero - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="La zona sigue ahí" desde={T.pero} hasta={T.policia - 0.1} y={1660} color={C.orange} />
      <Etiqueta texto="Pulir y ácido" desde={T.policia} hasta={T.deformado - 0.1} y={1660} color="#7AE87A" />
      <Etiqueta texto="Se disuelve distinto" desde={T.deformado} hasta={T.reaparece - 0.1} y={1660} color="#7AE87A" />
      <Etiqueta texto="¡Reaparece!" desde={T.reaparece} hasta={T.hierro - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Polvo magnético" desde={T.hierro} hasta={T.sigue - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="El ácido sigue…" desde={T.sigue} hasta={T.porEso - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="¡Foto al instante!" desde={T.porEso} hasta={DURACION_SERIE_S + 0.1} y={1660} color={C.yellow} tamano={50} />

      {/* Sonido: música a 0,1 bajo la voz, sin subida final (no hay logo); se funde en el último medio segundo */}
      <Audio src={staticFile("audio/numero-serie/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) => interpolate(f / fps, [0, 1.2, DURACION_SERIE_S - 0.5, DURACION_SERIE_S], [0, 0.1, 0.1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />
      {[1.2, T.estampa + 0.8, T.reaparece, T.instante].map((tc) => (
        <Sequence key={tc} name="Tic" from={Math.round(tc * fps)} durationInFrames={Math.round(0.3 * fps)}>
          <Audio src={staticFile("audio/choque.wav")} volume={tc < 2 ? 0.6 : 0.4} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

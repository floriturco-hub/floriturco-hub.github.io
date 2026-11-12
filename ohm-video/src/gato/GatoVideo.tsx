import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import narracion from "../../guion/gato-hidraulico/narracion.json";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Progreso, Subtitulos } from "../components/Retencion";
import { C } from "../theme";
import { GatoMundo } from "./Gato";
import { T } from "./tiempos";

// Retención (estilo §10): 38 s, bucle abierto, subtítulos arriba, barra de progreso y SIN logo: termina con «…debe bajar cien. Y así…» y empalma con «¡Una mano levanta diez toneladas!»
export const DURACION_GATO_S = T.fin + 0.3;

export const GatoVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena sinEntrada nombre="Camión, gato en corte y áreas" desde={0} hasta={DURACION_GATO_S}>
        {(t0) => <GatoMundo t0={t0} />}
      </Escena>

      <Subtitulos palabras={narracion.words} fin={T.fin} />
      <Progreso fin={DURACION_GATO_S} />

      {/* Etiquetas-clave: 2–4 palabras. La primera (gancho) repite la frase de choque desde el primer fotograma */}
      <Etiqueta texto="¡Una mano: 10 toneladas!" desde={-0.4} hasta={T.final - 0.1} y={1660} color={C.yellow} tamano={50} />
      <Etiqueta texto="¿Cuál es el precio?" desde={T.final} hasta={T.gato - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Dos pistones y aceite" desde={T.gato} hasta={T.delgado - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Delgado: empujas tú" desde={T.delgado} hasta={T.grueso - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Grueso: levanta" desde={T.grueso} hasta={T.aceite - 0.1} y={1660} color={C.orange} />
      <Etiqueta texto="No se comprime" desde={T.aceite} hasta={T.presion - 0.1} y={1660} color={"#E8A040"} />
      <Etiqueta texto="Presión igual en todo" desde={T.presion} hasta={T.pascal - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Principio de Pascal" desde={T.pascal} hasta={T.formula - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Presión = fuerza ÷ área" desde={T.formula} hasta={T.cien - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="×100 área = ×100 fuerza" desde={T.cien} hasta={T.palanca - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Palanca: 20 kg" desde={T.palanca} hasta={T.delgado2 - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Pistón delgado: 100 kg" desde={T.delgado2} hasta={T.grueso2 - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Pistón grueso: 10 t" desde={T.grueso2} hasta={T.precio - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="1 cm arriba = 100 abajo" desde={T.precio} hasta={T.asi - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Y así… ¡10 toneladas!" desde={T.asi} hasta={DURACION_GATO_S + 0.1} y={1660} color={C.yellow} tamano={50} />

      {/* Sonido: música a 0,1 bajo la voz, sin subida final (no hay logo); se funde en el último medio segundo */}
      <Audio src={staticFile("audio/gato-hidraulico/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) => interpolate(f / fps, [0, 1.2, DURACION_GATO_S - 0.5, DURACION_GATO_S], [0, 0.1, 0.1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />
      {[1.0, T.gato, T.pascal, T.grueso2, T.precio].map((tc) => (
        <Sequence key={tc} name="Tic" from={Math.round(tc * fps)} durationInFrames={Math.round(0.3 * fps)}>
          <Audio src={staticFile("audio/choque.wav")} volume={tc < 2 ? 0.6 : 0.4} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import narracion from "../../guion/detector-mentiras/narracion.json";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { COLA_CORTA, Progreso, Subtitulos } from "../components/Retencion";
import { Logo } from "../scenes/Logo";
import { C } from "../theme";
import { DetectorMundo } from "./Detector";
import { T } from "./tiempos";

// Primer Short con las reglas de retención (estilo §10): 37 s, bucle abierto, subtítulos arriba, barra de progreso y logo de 4 s
export const INICIO_LOGO_DETECTOR = T.fin + 0.5;
export const DURACION_DETECTOR_S = INICIO_LOGO_DETECTOR + COLA_CORTA;
const D = INICIO_LOGO_DETECTOR - 61.5;

export const DetectorVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena sinEntrada nombre="Polígrafo y señales" desde={0} hasta={INICIO_LOGO_DETECTOR}>
        {(t0) => <DetectorMundo t0={t0} />}
      </Escena>
      <Escena nombre="Logo" desde={INICIO_LOGO_DETECTOR} hasta={DURACION_DETECTOR_S}>
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO_DETECTOR} />}
      </Escena>

      <Subtitulos palabras={narracion.words} fin={T.fin} />
      <Progreso fin={T.fin} />

      {/* Etiquetas-clave: 2–4 palabras. La primera (gancho) repite la frase de choque desde el primer fotograma */}
      <Etiqueta texto="¡No detecta mentiras!" desde={-0.4} hasta={T.final - 0.1} y={1660} color={C.yellow} tamano={50} />
      <Etiqueta texto="Al final: cómo engañarla" desde={T.final} hasta={T.poligrafo - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Mide tu cuerpo" desde={T.poligrafo} hasta={T.bandas - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Respiración" desde={T.bandas} hasta={T.brazalete - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Pulso y presión" desde={T.brazalete} hasta={T.sensores - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Sudor" desde={T.sensores} hasta={T.nervioso - 0.1} y={1660} color="#48C878" />
      <Etiqueta texto="Nervios: todo sube" desde={T.nervioso} hasta={T.examinador - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Neutra, control…" desde={T.examinador} hasta={T.clave - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="…y la clave" desde={T.clave} hasta={T.reacciona - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Más reacción: sospecha" desde={T.reacciona} hasta={T.nervios - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Nervios ≠ mentiras" desde={T.nervios} hasta={T.inocente - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Inocente: falla" desde={T.inocente} hasta={T.mentiroso - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Mentiroso: tranquilo" desde={T.mentiroso} hasta={T.tenso - 0.1} y={1660} color="#48C878" />
      <Etiqueta texto="Tenso a propósito" desde={T.tenso} hasta={T.igual - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Todo parece igual" desde={T.igual} hasta={T.porEso - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="¿Detector?" desde={T.porEso} hasta={T.fin + 0.4} y={1660} color={C.yellow} tamano={50} />

      {/* Sonido: música 0,1 bajo la voz y 0,225 en el cierre */}
      <Audio src={staticFile("audio/detector-mentiras/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(f / fps, [0, 1.5, INICIO_LOGO_DETECTOR - 0.3, INICIO_LOGO_DETECTOR + 0.7, DURACION_DETECTOR_S - 1.2, DURACION_DETECTOR_S], [0, 0.1, 0.1, 0.225, 0.225, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        }
      />
      {[1.2, T.clave, T.fallar, T.igual].map((tc) => (
        <Sequence key={tc} name="Tic" from={Math.round(tc * fps)} durationInFrames={Math.round(0.3 * fps)}>
          <Audio src={staticFile("audio/choque.wav")} volume={tc < 2 ? 0.6 : 0.4} />
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

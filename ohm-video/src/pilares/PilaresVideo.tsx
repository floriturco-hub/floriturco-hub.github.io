import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Logo } from "../scenes/Logo";
import { C } from "../theme";
import { PilaresMundo } from "./Pilares";
import { Tarjetas } from "./Tarjetas";
import { T } from "./tiempos";

export const INICIO_LOGO_PILARES = T.fin + 0.5;
export const DURACION_PILARES_S = INICIO_LOGO_PILARES + 6.5;
const D = INICIO_LOGO_PILARES - 61.5;

// Una sola escena-mundo (río con la ataguía, vista desde arriba, cajón neumático y concreto por tubo) recorrida con la cámara
export const PilaresVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena sinEntrada nombre="Río y ataguía" desde={0} hasta={INICIO_LOGO_PILARES}>
        {(t0) => (
          <>
            <PilaresMundo t0={t0} />
            <Tarjetas t0={t0} />
          </>
        )}
      </Escena>
      <Escena nombre="Logo" desde={INICIO_LOGO_PILARES} hasta={DURACION_PILARES_S}>
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO_PILARES} />}
      </Escena>

      {/* Etiquetas-clave: 2–4 palabras. La primera (gancho) repite la frase de choque desde el primer fotograma */}
      <Etiqueta texto="¡Secan un pedazo del río!" desde={-0.4} hasta={T.levantar - 0.1} y={1660} color={C.yellow} tamano={50} />
      <Etiqueta texto="Un pilar en el agua" desde={T.levantar} hasta={T.sacar - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Primero, sacar el agua" desde={T.sacar} hasta={T.clavan - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Clavan láminas de acero" desde={T.clavan} hasta={T.rompecabezas - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Como un rompecabezas" desde={T.rompecabezas} hasta={T.muro - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Un muro cerrado" desde={T.muro} hasta={T.ataguia - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Ataguía" desde={T.ataguia} hasta={T.bombean - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Bombean el agua" desde={T.bombean} hasta={T.seco - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Un hueco seco" desde={T.seco} hasta={T.obreros - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Trabajo en el lecho" desde={T.obreros} hasta={T.profunda - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="¿Agua muy profunda?" desde={T.profunda} hasta={T.cajon - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Un cajón sin fondo" desde={T.cajon} hasta={T.aire - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Aire a presión" desde={T.aire} hasta={T.vaso - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Vaso boca abajo" desde={T.vaso} hasta={T.concreto - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Concreto bajo el agua" desde={T.concreto} hasta={T.pesado - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Más pesado: empuja" desde={T.pesado} hasta={T.terminar - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Retiran el muro" desde={T.terminar} hasta={T.vuelve - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Y el río vuelve" desde={T.vuelve} hasta={T.fin + 0.4} y={1660} color={C.cyan} tamano={50} />

      {/* Sonido: música 6 dB más baja (0,1 bajo la voz, 0,225 en el cierre) */}
      <Audio src={staticFile("audio/pilares-agua/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [0, 1.5, INICIO_LOGO_PILARES - 0.3, INICIO_LOGO_PILARES + 0.7, DURACION_PILARES_S - 1.5, DURACION_PILARES_S],
            [0, 0.1, 0.1, 0.225, 0.225, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[T.clavan, T.seco, T.aire].map((tc) => (
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

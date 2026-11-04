import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Logo } from "../scenes/Logo";
import { C } from "../theme";
import { GrilloMundo } from "./Grillo";
import { Tarjetas } from "./Tarjetas";
import { T } from "./tiempos";

export const INICIO_LOGO_GRILLO = T.fin + 0.5;
export const DURACION_GRILLO_S = INICIO_LOGO_GRILLO + 6.5;
const D = INICIO_LOGO_GRILLO - 61.5;

// Una sola escena-mundo (grillo con termómetro, alas en detalle y frío contra calor) recorrida con la cámara
export const GrilloVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena sinEntrada nombre="Grillo y termómetro" desde={0} hasta={INICIO_LOGO_GRILLO}>
        {(t0) => (
          <>
            <GrilloMundo t0={t0} />
            <Tarjetas t0={t0} />
          </>
        )}
      </Escena>
      <Escena nombre="Logo" desde={INICIO_LOGO_GRILLO} hasta={DURACION_GRILLO_S}>
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO_GRILLO} />}
      </Escena>

      {/* Etiquetas-clave: 2–4 palabras. La primera (gancho) repite la frase de choque desde el primer fotograma */}
      <Etiqueta texto="¡Este grillo es un termómetro!" desde={-0.4} hasta={T.cuenta - 0.1} y={1660} color={C.yellow} tamano={50} />
      <Etiqueta texto="Cuenta 14 segundos" desde={T.cuenta} hasta={T.suma - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Cantos + 40 = °F" desde={T.suma} hasta={T.porQue - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="¿Por qué funciona?" desde={T.porQue} hasta={T.noFabrica - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Sin calor propio" desde={T.noFabrica} hasta={T.cuerpo - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Cuerpo = aire" desde={T.cuerpo} hasta={T.cantar - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Frota sus alas" desde={T.cantar} hasta={T.dientes - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Hilera de dientes" desde={T.dientes} hasta={T.raspador - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Y un raspador" desde={T.raspador} hasta={T.una - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Uña sobre un peine" desde={T.una} hasta={T.movimiento - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Lo mueven músculos" desde={T.movimiento} hasta={T.quimicas - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Reacciones químicas" desde={T.quimicas} hasta={T.calor - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Calor: más rápido" desde={T.calor} hasta={T.frio - 0.1} y={1660} color={C.orange} />
      <Etiqueta texto="Frío: se frena" desde={T.frio} hasta={T.dolbear - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Ley de Dolbear, 1897" desde={T.dolbear} hasta={T.nevado - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Grillo arborícola nevado" desde={T.nevado} hasta={T.celsius - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="¿Y en Celsius?" desde={T.celsius} hasta={T.veinticinco - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Cantos en 25 s" desde={T.veinticinco} hasta={T.divide - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="÷ 3 + 4 = °C" desde={T.divide} hasta={T.final - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Un termómetro que canta" desde={T.final} hasta={T.fin + 0.4} y={1660} color={C.yellow} tamano={50} />

      {/* Sonido: música 6 dB más baja (0,1 bajo la voz, 0,225 en el cierre) */}
      <Audio src={staticFile("audio/grillo-termometro/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [0, 1.5, INICIO_LOGO_GRILLO - 0.3, INICIO_LOGO_GRILLO + 0.7, DURACION_GRILLO_S - 1.5, DURACION_GRILLO_S],
            [0, 0.1, 0.1, 0.225, 0.225, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[T.suma, T.calor, T.divide].map((tc) => (
        <Sequence key={tc} name="Tic" from={Math.round(tc * fps)} durationInFrames={Math.round(0.3 * fps)}>
          <Audio src={staticFile("audio/choque.wav")} volume={0.4} />
        </Sequence>
      ))}
      {[0.15, 0.5, 0.85, 1.2, 1.55, T.final, T.final + 0.35, T.final + 0.7, T.final + 1.05, T.final + 1.4].map((tc) => (
        <Sequence key={`canto-${tc}`} name="Canto" from={Math.round(tc * fps)} durationInFrames={Math.round(0.2 * fps)}>
          <Audio src={staticFile("audio/grillo-canto.wav")} volume={0.18} />
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

import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Logo } from "../scenes/Logo";
import { C } from "../theme";
import { Calle } from "./Calle";
import { Tarjetas } from "./Tarjetas";
import { T } from "./tiempos";

export const INICIO_LOGO_BOTONES = T.fin + 0.5;
export const DURACION_BOTONES_S = INICIO_LOGO_BOTONES + 6.5;
const D = INICIO_LOGO_BOTONES - 61.5;

// Una sola escena-mundo (calle con semáforo, central, ascensor y termostato) recorrida con la cámara
export const BotonesVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena sinEntrada nombre="Calle y edificio" desde={0} hasta={INICIO_LOGO_BOTONES}>
        {(t0) => (
          <>
            <Calle t0={t0} />
            <Tarjetas t0={t0} />
          </>
        )}
      </Escena>
      <Escena nombre="Logo" desde={INICIO_LOGO_BOTONES} hasta={DURACION_BOTONES_S}>
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO_BOTONES} />}
      </Escena>

      {/* Etiquetas-clave: 2–4 palabras. La primera ya está en el primer fotograma (gancho) */}
      <Etiqueta texto="¿Conectado a nada?" desde={-0.4} hasta={T.parece - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Programa fijo" desde={T.programa} hasta={T.nuevaYork - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Solo 750 funcionaban" desde={T.funcionando - 0.3} hasta={T.resto + 0.4} y={1660} color={C.yellow} />
      <Etiqueta texto="Control central" desde={T.central - 0.3} hasta={T.otros + 0.3} y={1660} color={C.cyan} />
      <Etiqueta texto="De noche, sí" desde={T.verde} hasta={T.punta - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="No cambia nada" desde={T.noCambia} hasta={T.noSolo - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="No acorta la espera" desde={T.noAcorta} hasta={T.minimo - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Tiempo mínimo abierto" desde={T.minimo} hasta={T.oficinas - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Termostato de adorno" desde={T.nada} hasta={T.porQue - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="En tu cabeza" desde={T.cabeza - 0.2} hasta={T.placebo - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Botones placebo" desde={T.placebo} hasta={T.control - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Una vez y espera" desde={T.unaVez} hasta={T.cinco2 - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="No lo acelera" desde={T.noAcelera} hasta={T.final - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="No aprietas un botón" desde={T.final} hasta={T.paciencia - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Aprietas tu paciencia" desde={T.paciencia} hasta={T.fin + 0.4} y={1660} color={C.yellow} tamano={52} />

      {/* Sonido: música 6 dB más baja (0,1 bajo la voz, 0,225 en el cierre) */}
      <Audio src={staticFile("audio/botones/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [0, 1.5, INICIO_LOGO_BOTONES - 0.3, INICIO_LOGO_BOTONES + 0.7, DURACION_BOTONES_S - 1.5, DURACION_BOTONES_S],
            [0, 0.1, 0.1, 0.225, 0.225, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[T.conectado, T.funcionando, T.noCambia, T.placebo, T.noAcelera].map((tc) => (
        <Sequence key={tc} name="Tic" from={Math.round(tc * fps)} durationInFrames={Math.round(0.3 * fps)}>
          <Audio src={staticFile("audio/choque.wav")} volume={tc === T.conectado ? 0.6 : 0.4} />
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

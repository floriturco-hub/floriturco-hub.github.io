import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Logo } from "../scenes/Logo";
import { C } from "../theme";
import { AnguilaMundo } from "./Anguila";
import { Tarjetas } from "./Tarjetas";
import { T } from "./tiempos";

export const INICIO_LOGO_ANGUILA = T.fin + 0.5;
export const DURACION_ANGUILA_S = INICIO_LOGO_ANGUILA + 6.5;
const D = INICIO_LOGO_ANGUILA - 61.5;

// Una sola escena-mundo (río con el pez eléctrico en rayos X y electrocitos en serie) recorrida con la cámara
export const AnguilaVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena sinEntrada nombre="Río y batería" desde={0} hasta={INICIO_LOGO_ANGUILA}>
        {(t0) => (
          <>
            <AnguilaMundo t0={t0} />
            <Tarjetas t0={t0} />
          </>
        )}
      </Escena>
      <Escena nombre="Logo" desde={INICIO_LOGO_ANGUILA} hasta={DURACION_ANGUILA_S}>
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO_ANGUILA} />}
      </Escena>

      {/* Etiquetas-clave: 2–4 palabras. La primera (gancho) repite la frase de choque desde el primer fotograma */}
      <Etiqueta texto="¡Este pez dispara 600 voltios!" desde={-0.4} hasta={T.noEs - 0.1} y={1660} color={C.yellow} tamano={46} />
      <Etiqueta texto="No es una anguila" desde={T.noEs} hasta={T.cuchillo - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Es un pez cuchillo" desde={T.cuchillo} hasta={T.bateria - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Su cuerpo: una batería" desde={T.bateria} hasta={T.dentro - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Miles de células planas" desde={T.dentro} hasta={T.electrocitos - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Electrocitos" desde={T.electrocitos} hasta={T.pilas - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="En fila, como pilas" desde={T.pilas} hasta={T.cada - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="0,15 V cada una" desde={T.cada} hasta={T.pero - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="En serie: 600 V" desde={T.pero} hasta={T.disparar - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Una orden del cerebro" desde={T.disparar} hasta={T.vez - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Todas a la vez" desde={T.vez} hasta={T.zas - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="¡Zas! En 2 ms" desde={T.zas} hasta={T.corazon - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="¿Y su corazón?" desde={T.corazon} hasta={T.primero - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="1. Lejos de la batería" desde={T.primero} hasta={T.segundo - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="2. Envuelto en grasa" desde={T.segundo} hasta={T.tercero - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="3. Sale por el agua" desde={T.tercero} hasta={T.asi - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="El choque va afuera" desde={T.asi} hasta={T.fin + 0.4} y={1660} color={C.yellow} tamano={50} />

      {/* Sonido: música 6 dB más baja (0,1 bajo la voz, 0,225 en el cierre) */}
      <Audio src={staticFile("audio/anguila-electrica/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [0, 1.5, INICIO_LOGO_ANGUILA - 0.3, INICIO_LOGO_ANGUILA + 0.7, DURACION_ANGUILA_S - 1.5, DURACION_ANGUILA_S],
            [0, 0.1, 0.1, 0.225, 0.225, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[0.25, 1.05, T.zas, T.afuera].map((tc) => (
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

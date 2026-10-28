import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Logo } from "../scenes/Logo";
import { C } from "../theme";
import { Orbita } from "./Orbita";
import { Tarjetas } from "./Tarjetas";
import { T } from "./tiempos";

export const INICIO_LOGO_GPS = T.fin + 0.5;
export const DURACION_GPS_S = INICIO_LOGO_GPS + 6.5;
const D = INICIO_LOGO_GPS - 61.5;

// Una sola escena-mundo (la Tierra y la constelación GPS) recorrida con la cámara
export const GpsVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena nombre="Tierra y satélites" desde={0} hasta={INICIO_LOGO_GPS}>
        {(t0) => (
          <>
            <Orbita t0={t0} />
            <Tarjetas t0={t0} />
          </>
        )}
      </Escena>
      <Escena nombre="Logo" desde={INICIO_LOGO_GPS} hasta={DURACION_GPS_S}>
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO_GPS} />}
      </Escena>

      {/* Etiquetas-clave: 2–4 palabras */}
      <Etiqueta texto="¿Cómo lo calcula?" desde={T.como - 0.2} hasta={T.parece - 0.1} y={1560} color={C.yellow} tamano={60} />
      <Etiqueta texto="No sabe que existes" desde={T.noSabe} hasta={T.escucha - 0.1} y={1620} />
      <Etiqueta texto="Solo escucha" desde={T.escucha} hasta={T.veinteMil - 0.1} y={1620} color={C.cyan} />
      <Etiqueta texto="Unos 30 satélites" desde={T.treinta} hasta={T.relojes - 0.1} y={1620} />
      <Etiqueta texto="Relojes atómicos" desde={T.atomicos - 0.2} hasta={T.repite} y={1560} color={C.yellow} />
      <Etiqueta texto="Retraso = distancia" desde={T.retraso} hasta={T.esfera - 0.1} y={1620} color={C.cyan} />
      <Etiqueta texto="Una esfera" desde={T.esfera} hasta={T.dos - 0.1} y={1700} color={C.cyan} />
      <Etiqueta texto="Un círculo" desde={T.dos} hasta={T.tres - 0.1} y={1700} color={C.yellow} />
      <Etiqueta texto="Dos puntos" desde={T.tres} hasta={T.cuarto - 0.1} y={1700} color={C.yellow} />
      <Etiqueta texto="Falta un cuarto" desde={T.cuarto} hasta={T.error - 0.1} y={1700} color={C.yellow} />
      <Etiqueta texto="Cada error cuenta" desde={T.error} hasta={T.einstein - 0.1} y={1700} color={C.red} />
      <Etiqueta texto="Hasta Einstein" desde={T.einstein} hasta={T.adelantan - 0.1} y={1620} />
      <Etiqueta texto="Se pierde" desde={T.pierde - 0.2} hasta={T.cuatroSat - 0.1} y={1700} color={C.red} />
      <Etiqueta texto="Mínimo 4 satélites" desde={T.cuatroSat} hasta={T.noPregunta - 0.1} y={1700} color={C.yellow} />
      <Etiqueta texto="Lo calcula con tiempo" desde={T.tiempo - 0.2} hasta={T.cuatroRelojes - 0.1} y={1620} color={C.cyan} />
      <Etiqueta texto="Cuatro relojes, una posición" desde={T.cuatroRelojes} hasta={T.fin + 0.4} y={1620} color={C.yellow} tamano={52} />

      {/* Sonido: esquema aprobado */}
      <Audio src={staticFile("audio/gps/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [0, 1.5, INICIO_LOGO_GPS - 0.3, INICIO_LOGO_GPS + 0.7, DURACION_GPS_S - 1.5, DURACION_GPS_S],
            [0, 0.2, 0.2, 0.45, 0.45, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[T.centesimas + 0.8, T.tres + 0.5, T.trescientos, T.diezKm, T.cuatroRelojes].map((tc) => (
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

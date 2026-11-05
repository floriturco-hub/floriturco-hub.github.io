import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Logo } from "../scenes/Logo";
import { C } from "../theme";
import { ExtintorMundo } from "./Extintor";
import { Tarjetas } from "./Tarjetas";
import { T } from "./tiempos";

export const INICIO_LOGO_EXTINTOR = T.fin + 0.5;
export const DURACION_EXTINTOR_S = INICIO_LOGO_EXTINTOR + 6.5;
const D = INICIO_LOGO_EXTINTOR - 61.5;

// Una sola escena-mundo (cocina con la sartén en llamas, triángulo del fuego y extintor por dentro) recorrida con la cámara
export const ExtintorVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena sinEntrada nombre="Cocina y extintor" desde={0} hasta={INICIO_LOGO_EXTINTOR}>
        {(t0) => (
          <>
            <ExtintorMundo t0={t0} />
            <Tarjetas t0={t0} />
          </>
        )}
      </Escena>
      <Escena nombre="Logo" desde={INICIO_LOGO_EXTINTOR} hasta={DURACION_EXTINTOR_S}>
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO_EXTINTOR} />}
      </Escena>

      {/* Etiquetas-clave: 2–4 palabras. La primera (gancho) repite la frase de choque desde el primer fotograma */}
      <Etiqueta texto="¡Nunca le eches agua a esto!" desde={-0.4} hasta={T.tres - 0.1} y={1660} color={C.red} tamano={50} />
      <Etiqueta texto="El fuego necesita 3 cosas" desde={T.tres} hasta={T.calor - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Calor, combustible, oxígeno" desde={T.calor} hasta={T.quita - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Quita una: se apaga" desde={T.quita} hasta={T.extintor - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Dentro del extintor" desde={T.extintor} hasta={T.polvo - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Polvo químico" desde={T.polvo} hasta={T.gas - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Gas a presión" desde={T.gas} hasta={T.pasador - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Quitas el pasador" desde={T.pasador} hasta={T.palanca - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Aprietas la palanca" desde={T.palanca} hasta={T.empuja - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="El gas empuja el polvo" desde={T.empuja} hasta={T.cubre - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Cubre el fuego" desde={T.cubre} hasta={T.corta - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Sin oxígeno: se apaga" desde={T.corta} hasta={T.sarten - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="¿Aceite en llamas?" desde={T.sarten} hasta={T.aceite - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Más de 300 °C" desde={T.aceite} hasta={T.agua - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="El agua se hunde" desde={T.agua} hasta={T.hierve - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Hierve de golpe" desde={T.hierve} hasta={T.vapor - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Vapor: × 1.700" desde={T.vapor} hasta={T.lanza - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Lanza el aceite" desde={T.lanza} hasta={T.millones - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Millones de gotas" desde={T.millones} hasta={T.bola - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="¡Bola de fuego!" desde={T.bola} hasta={T.queHacer - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="¿Qué hacer? Apaga y tapa" desde={T.queHacer} hasta={T.sinOxigeno - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Sin oxígeno, muere" desde={T.sinOxigeno} hasta={T.fin + 0.4} y={1660} color={C.yellow} tamano={50} />

      {/* Sonido: música 6 dB más baja (0,1 bajo la voz, 0,225 en el cierre) */}
      <Audio src={staticFile("audio/extintor-sarten/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [0, 1.5, INICIO_LOGO_EXTINTOR - 0.3, INICIO_LOGO_EXTINTOR + 0.7, DURACION_EXTINTOR_S - 1.5, DURACION_EXTINTOR_S],
            [0, 0.1, 0.1, 0.225, 0.225, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[0.8, T.palanca, T.bola - 0.4, T.tapa].map((tc) => (
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

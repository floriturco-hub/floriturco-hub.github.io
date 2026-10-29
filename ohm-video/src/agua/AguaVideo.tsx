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

export const INICIO_LOGO_AGUA = T.fin + 0.5;
export const DURACION_AGUA_S = INICIO_LOGO_AGUA + 6.5;
const D = INICIO_LOGO_AGUA - 61.5;

// Una sola escena-mundo (la casa en corte y la acera con el medidor) recorrida con la cámara
export const AguaVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena nombre="Casa y medidor" desde={0} hasta={INICIO_LOGO_AGUA}>
        {(t0) => (
          <>
            <Calle t0={t0} />
            <Tarjetas t0={t0} />
          </>
        )}
      </Escena>
      <Escena nombre="Logo" desde={INICIO_LOGO_AGUA} hasta={DURACION_AGUA_S}>
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO_AGUA} />}
      </Escena>

      {/* Etiquetas-clave: 2–4 palabras */}
      <Etiqueta texto="Una turbina decide" desde={T.turbina} hasta={T.parece - 0.1} y={1660} color={C.yellow} tamano={56} />
      <Etiqueta texto="No es una cuota fija" desde={T.parece} hasta={T.pero - 0.1} y={1660} />
      <Etiqueta texto="Metros cúbicos" desde={T.metros - 0.2} hasta={T.dentro - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="El agua la hace girar" desde={T.gira - 0.2} hasta={T.engranajes - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Cada vuelta suma" desde={T.engranajes} hasta={T.metroCubico - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Lectura cada periodo" desde={T.lee - 0.2} hasta={T.diferencia - 0.1} y={1660} />
      <Etiqueta texto="Precio por tramos" desde={T.tramos} hasta={T.suman - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Cierra todo" desde={T.cierra} hasta={T.rueda - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Si gira, hay fuga" desde={T.rueda} hasta={T.noPagas - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Pagas cada vuelta" desde={T.vuelta - 0.3} hasta={T.fin + 0.4} y={1660} color={C.yellow} tamano={60} />

      {/* Sonido: esquema aprobado */}
      <Audio src={staticFile("audio/agua/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [0, 1.5, INICIO_LOGO_AGUA - 0.3, INICIO_LOGO_AGUA + 0.7, DURACION_AGUA_S - 1.5, DURACION_AGUA_S],
            [0, 0.2, 0.2, 0.45, 0.45, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[T.turbina, T.suma, T.anterior + 0.5, T.extra, T.fuga].map((tc) => (
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

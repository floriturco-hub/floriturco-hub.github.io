import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Logo } from "../scenes/Logo";
import { C } from "../theme";
import { Ruleta } from "./Ruleta";
import { Tarjetas } from "./Tarjetas";
import { GIROS, T } from "./tiempos";

export const INICIO_LOGO_MARTIN = T.fin + 0.5;
export const DURACION_MARTIN_S = INICIO_LOGO_MARTIN + 6.5;
const D = INICIO_LOGO_MARTIN - 61.5;

// Una sola escena-mundo (la ruleta y la mesa de apuestas) con tarjetas de datos
export const MartingalaVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena nombre="Ruleta" desde={0} hasta={INICIO_LOGO_MARTIN}>
        {(t0) => (
          <>
            <Ruleta t0={t0} />
            <Tarjetas t0={t0} />
          </>
        )}
      </Escena>
      <Escena nombre="Logo" desde={INICIO_LOGO_MARTIN} hasta={DURACION_MARTIN_S}>
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO_MARTIN} />}
      </Escena>

      {/* Etiquetas-clave: 2–4 palabras */}
      <Etiqueta texto="Doblas cada vez" desde={T.trampa} hasta={T.salga - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Ruleta sin memoria" desde={T.memoria} hasta={T.debe - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Seis negros seguidos" desde={T.racha} hasta={T.perdidos - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Te quedan 370" desde={T.quedan - 0.2} hasta={T.noPuedes - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Casi 2 de cada 100" desde={T.probabilidad} hasta={T.cero - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Un cero: 2,7 %" desde={T.cero} hasta={T.tope - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Tope de mesa" desde={T.tope} hasta={T.regla - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Solo gana la casa" desde={T.casa} hasta={T.ayuda - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Cambia cuándo pierdes" desde={T.ayuda - 0.4} hasta={T.fin + 0.4} y={1660} color={C.yellow} tamano={52} />

      {/* Sonido: esquema aprobado */}
      <Audio src={staticFile("audio/martingala/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [0, 1.5, INICIO_LOGO_MARTIN - 0.3, INICIO_LOGO_MARTIN + 0.7, DURACION_MARTIN_S - 1.5, DURACION_MARTIN_S],
            [0, 0.2, 0.2, 0.45, 0.45, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {GIROS.map((tc) => (
        <Sequence key={tc} name="Giro" from={Math.round(tc * fps)} durationInFrames={Math.round(0.4 * fps)}>
          <Audio src={staticFile("audio/choque.wav")} volume={0.35} />
        </Sequence>
      ))}
      <Sequence name="Mentira" from={Math.round(T.mentira * fps)} durationInFrames={Math.round(0.3 * fps)}>
        <Audio src={staticFile("audio/choque.wav")} volume={0.6} />
      </Sequence>
      <Sequence name="SFX logo" from={Math.round((62.35 + D) * fps)} durationInFrames={Math.round(2.9 * fps)}>
        <Audio src={staticFile("audio/sfx_logo.wav")} volume={0.7} />
      </Sequence>
      <Sequence name="Voz: Frecuencia Cero" from={Math.round((63.75 + D) * fps)} durationInFrames={Math.round(1.7 * fps)}>
        <Audio src={staticFile("audio/frecuencia_cero.wav")} />
      </Sequence>
    </AbsoluteFill>
  );
};

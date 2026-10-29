import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Logo } from "../scenes/Logo";
import { C } from "../theme";
import { Maniqui } from "./Maniqui";
import { Tarjetas } from "./Tarjetas";
import { T } from "./tiempos";

export const INICIO_LOGO_PECHO = T.fin + 0.5;
export const DURACION_PECHO_S = INICIO_LOGO_PECHO + 6.5;
const D = INICIO_LOGO_PECHO - 61.5;

// Una sola escena-mundo (el maniquí de anatomía) recorrida con la cámara
export const PechoVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena nombre="Maniquí" desde={0} hasta={INICIO_LOGO_PECHO}>
        {(t0) => (
          <>
            <Maniqui t0={t0} />
            <Tarjetas t0={t0} />
          </>
        )}
      </Escena>
      <Escena nombre="Logo" desde={INICIO_LOGO_PECHO} hasta={DURACION_PECHO_S}>
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO_PECHO} />}
      </Escena>

      {/* Etiquetas-clave: 2–4 palabras */}
      <Etiqueta texto="¿El izquierdo más grande?" desde={0.2} hasta={T.noUnica - 0.1} y={1660} color={C.yellow} tamano={50} />
      <Etiqueta texto="No eres la única" desde={T.noUnica} hasta={T.parece - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Ningún cuerpo es simétrico" desde={T.ningun - 0.3} hasta={T.dentro - 0.1} y={1660} color={C.yellow} tamano={40} />
      <Etiqueta texto="Grasa y glándulas" desde={T.grasa} hasta={T.crece - 0.1} y={1660} />
      <Etiqueta texto="Crece con estrógenos" desde={T.estrogenos - 0.2} hasta={T.cadaLado - 0.1} y={1660} color={C.purpleLight} />
      <Etiqueta texto="Cada lado responde distinto" desde={T.cadaLado} hasta={T.estudios - 0.1} y={1660} color={C.purpleLight} tamano={40} />
      <Etiqueta texto="Aún sin explicación" desde={T.noSabe} hasta={T.tiempo - 0.1} y={1660} />
      <Etiqueta texto="Es normal" desde={T.normal} hasta={T.consultar - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Tu pecho tampoco" desde={T.tampoco - 0.2} hasta={T.fin + 0.4} y={1660} color={C.yellow} tamano={60} />

      {/* Sonido: esquema aprobado */}
      <Audio src={staticFile("audio/pecho/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [0, 1.5, INICIO_LOGO_PECHO - 0.3, INICIO_LOGO_PECHO + 0.7, DURACION_PECHO_S - 1.5, DURACION_PECHO_S],
            [0, 0.2, 0.2, 0.45, 0.45, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[T.noUnica, T.receptores, T.izquierdo, T.normal].map((tc) => (
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

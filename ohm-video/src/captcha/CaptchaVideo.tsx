import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Logo } from "../scenes/Logo";
import { C } from "../theme";
import { CaptchaMundo } from "./Captcha";
import { Tarjetas } from "./Tarjetas";
import { T } from "./tiempos";

export const INICIO_LOGO_CAPTCHA = T.fin + 0.5;
export const DURACION_CAPTCHA_S = INICIO_LOGO_CAPTCHA + 6.5;
const D = INICIO_LOGO_CAPTCHA - 61.5;

// Una sola escena-mundo (casilla «No soy un robot», robot contra persona y señales con la puntuación) recorrida con la cámara
export const CaptchaVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena sinEntrada nombre="Casilla y señales" desde={0} hasta={INICIO_LOGO_CAPTCHA}>
        {(t0) => (
          <>
            <CaptchaMundo t0={t0} />
            <Tarjetas t0={t0} />
          </>
        )}
      </Escena>
      <Escena nombre="Logo" desde={INICIO_LOGO_CAPTCHA} hasta={DURACION_CAPTCHA_S}>
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO_CAPTCHA} />}
      </Escena>

      {/* Etiquetas-clave: 2–4 palabras. La primera (gancho) repite la frase de choque desde el primer fotograma */}
      <Etiqueta texto="¡Te analiza antes del clic!" desde={-0.4} hasta={T.casilla - 0.1} y={1660} color={C.yellow} tamano={50} />
      <Etiqueta texto="«No soy un robot»" desde={T.casilla} hasta={T.antes - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Mira lo de antes" desde={T.antes} hasta={T.robot - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Un robot…" desde={T.robot} hasta={T.recta - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Línea recta, perfecta" desde={T.recta} hasta={T.centro - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Clic al centro" desde={T.centro} hasta={T.tu - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Tú tiemblas" desde={T.tu} hasta={T.curvas - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Curvas y frenazos" desde={T.curvas} hasta={T.corrige - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Te pasas y corriges" desde={T.corrige} hasta={T.tambien - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Tu tiempo y movimiento" desde={T.tambien} hasta={T.huellas - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Huellas del navegador" desde={T.huellas} hasta={T.cookies - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Cookies, historial…" desde={T.cookies} hasta={T.puntuacion - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Una puntuación" desde={T.puntuacion} hasta={T.humano - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Pasas con un clic" desde={T.humano} hasta={T.dudas - 0.1} y={1660} color="#48C878" />
      <Etiqueta texto="¿Dudas? Busca semáforos" desde={T.dudas} hasta={T.maquina - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Difícil para máquinas" desde={T.maquina} hasta={T.cadaVez - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="…cada vez menos" desde={T.cadaVez} hasta={T.noEres - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="No es el clic" desde={T.noEres} hasta={T.imperfeccion - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Es tu imperfección" desde={T.imperfeccion} hasta={T.fin + 0.4} y={1660} color={C.yellow} tamano={50} />

      {/* Sonido: música 6 dB más baja (0,1 bajo la voz, 0,225 en el cierre) */}
      <Audio src={staticFile("audio/captcha-robot/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [0, 1.5, INICIO_LOGO_CAPTCHA - 0.3, INICIO_LOGO_CAPTCHA + 0.7, DURACION_CAPTCHA_S - 1.5, DURACION_CAPTCHA_S],
            [0, 0.1, 0.1, 0.225, 0.225, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[1.5, T.humano, T.imperfeccion + 0.5].map((tc) => (
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

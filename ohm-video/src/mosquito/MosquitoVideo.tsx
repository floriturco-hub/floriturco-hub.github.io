import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Logo } from "../scenes/Logo";
import { C } from "../theme";
import { MosquitoMundo } from "./Mosquito";
import { Tarjetas } from "./Tarjetas";
import { T } from "./tiempos";

export const INICIO_LOGO_MOSQUITO = T.fin + 0.5;
export const DURACION_MOSQUITO_S = INICIO_LOGO_MOSQUITO + 6.5;
const D = INICIO_LOGO_MOSQUITO - 61.5;

// Una sola escena-mundo (piel en corte con las seis agujas, por qué no duele y hembra contra macho) recorrida con la cámara
export const MosquitoVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena sinEntrada nombre="Piel y mosquito" desde={0} hasta={INICIO_LOGO_MOSQUITO}>
        {(t0) => (
          <>
            <MosquitoMundo t0={t0} />
            <Tarjetas t0={t0} />
          </>
        )}
      </Escena>
      <Escena nombre="Logo" desde={INICIO_LOGO_MOSQUITO} hasta={DURACION_MOSQUITO_S}>
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO_MOSQUITO} />}
      </Escena>

      {/* Etiquetas-clave: 2–4 palabras. La primera (gancho) repite la frase de choque desde el primer fotograma */}
      <Etiqueta texto="¡Te están clavando seis agujas!" desde={-0.4} hasta={T.cuando - 0.1} y={1660} color={C.yellow} tamano={46} />
      <Etiqueta texto="Solo una funda" desde={T.cuando} hasta={T.dobla - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Se dobla hacia atrás" desde={T.dobla} hasta={T.dentro - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Seis agujas dentro" desde={T.dentro} hasta={T.dos - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="2 sierras vibrando" desde={T.dos} hasta={T.otras - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="2 la abren" desde={T.otras} hasta={T.pajita - 0.1} y={1660} color={C.purpleLight} />
      <Etiqueta texto="Una pajita" desde={T.pajita} hasta={T.vaso - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Busca un vaso" desde={T.vaso} hasta={T.saliva - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="1 inyecta saliva" desde={T.saliva} hasta={T.coagule - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Sangre sin coágulos" desde={T.coagule} hasta={T.porQue - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="¿Por qué no duele?" desde={T.porQue} hasta={T.haz - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Haz finísimo" desde={T.haz} hasta={T.serrucha - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Serrucha, no empuja" desde={T.serrucha} hasta={T.fuerza - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Fuerza diminuta" desde={T.fuerza} hasta={T.sensores - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Casi no duele" desde={T.sensores} hasta={T.picazon - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="La picazón, después" desde={T.picazon} hasta={T.histamina - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Libera histamina" desde={T.histamina} hasta={T.hincha - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Se hincha y pica" desde={T.hincha} hasta={T.hembras - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Solo las hembras" desde={T.hembras} hasta={T.huevos - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Sangre para sus huevos" desde={T.huevos} hasta={T.fin + 0.4} y={1660} color={C.red} tamano={50} />

      {/* Sonido: música 6 dB más baja (0,1 bajo la voz, 0,225 en el cierre) */}
      <Audio src={staticFile("audio/mosquito-agujas/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [0, 1.5, INICIO_LOGO_MOSQUITO - 0.3, INICIO_LOGO_MOSQUITO + 0.7, DURACION_MOSQUITO_S - 1.5, DURACION_MOSQUITO_S],
            [0, 0.1, 0.1, 0.225, 0.225, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[0.2, T.seis, T.cortan, T.hincha].map((tc) => (
        <Sequence key={tc} name="Tic" from={Math.round(tc * fps)} durationInFrames={Math.round(0.3 * fps)}>
          <Audio src={staticFile("audio/choque.wav")} volume={tc < 1 ? 0.6 : 0.4} />
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

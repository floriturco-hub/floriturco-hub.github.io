import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Logo } from "../scenes/Logo";
import { C } from "../theme";
import { OjosGatoMundo } from "./OjosGato";
import { Tarjetas } from "./Tarjetas";
import { T } from "./tiempos";

export const INICIO_LOGO_OJOSGATO = T.fin + 0.5;
export const DURACION_OJOSGATO_S = INICIO_LOGO_OJOSGATO + 6.5;
const D = INICIO_LOGO_OJOSGATO - 61.5;

// Una sola escena-mundo (carretera con niebla, ojo del gato en corte y reflector en corte) recorrida con la cámara
export const OjosGatoVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena sinEntrada nombre="Carretera y reflector" desde={0} hasta={INICIO_LOGO_OJOSGATO}>
        {(t0) => (
          <>
            <OjosGatoMundo t0={t0} />
            <Tarjetas t0={t0} />
          </>
        )}
      </Escena>
      <Escena nombre="Logo" desde={INICIO_LOGO_OJOSGATO} hasta={DURACION_OJOSGATO_S}>
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO_OJOSGATO} />}
      </Escena>

      {/* Etiquetas-clave: 2–4 palabras. La primera (gancho) repite la frase de choque desde el primer fotograma */}
      <Etiqueta texto="¡Copiaron los ojos de un gato!" desde={-0.4} hasta={T.noche - 0.1} y={1660} color={C.yellow} tamano={50} />
      <Etiqueta texto="Ojos que brillan" desde={T.noche} hasta={T.devuelven - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="No hacen luz: la devuelven" desde={T.devuelven} hasta={T.espejo - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Un espejo en el ojo" desde={T.espejo} hasta={T.tapetum - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Tapetum lucidum" desde={T.tapetum} hasta={T.rebota - 0.1} y={1660} color="#9AF878" />
      <Etiqueta texto="Vuelve por donde vino" desde={T.rebota} hasta={T.anio - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="1933, niebla" desde={T.anio} hasta={T.percy - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Percy Shaw" desde={T.percy} hasta={T.vio - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Unos ojos brillando…" desde={T.vio} hasta={T.idea - 0.1} y={1660} color="#9AF878" />
      <Etiqueta texto="Nace la idea" desde={T.idea} hasta={T.piezas - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Piezas en el asfalto" desde={T.piezas} hasta={T.lentes - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Lentes y espejo" desde={T.lentes} hasta={T.faros - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Entra la luz del faro" desde={T.faros} hasta={T.rebota2 - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Vuelve a tus ojos" desde={T.rebota2} hasta={T.retro - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Retrorreflexión" desde={T.retro} hasta={T.ingenioso - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Lo más ingenioso…" desde={T.ingenioso} hasta={T.pisa - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Al pisarlos, se hunden" desde={T.pisa} hasta={T.limpia - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="La goma los limpia" desde={T.limpia} hasta={T.sinElec - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Sin electricidad" desde={T.sinElec} hasta={T.fin + 0.4} y={1660} color={C.yellow} tamano={50} />

      {/* Sonido: música 6 dB más baja (0,1 bajo la voz, 0,225 en el cierre) */}
      <Audio src={staticFile("audio/ojos-gato/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [0, 1.5, INICIO_LOGO_OJOSGATO - 0.3, INICIO_LOGO_OJOSGATO + 0.7, DURACION_OJOSGATO_S - 1.5, DURACION_OJOSGATO_S],
            [0, 0.1, 0.1, 0.225, 0.225, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[T.rebota, T.retro, T.pisa].map((tc) => (
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

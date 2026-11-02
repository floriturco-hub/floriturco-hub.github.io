import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Logo } from "../scenes/Logo";
import { C } from "../theme";
import { Ojo } from "./Ojo";
import { Tarjetas } from "./Tarjetas";
import { T } from "./tiempos";

export const INICIO_LOGO_MANCHAS = T.fin + 0.5;
export const DURACION_MANCHAS_S = INICIO_LOGO_MANCHAS + 6.5;
const D = INICIO_LOGO_MANCHAS - 61.5;

// Una sola escena-mundo (cielo visto y ojo en corte) recorrida con la cámara
export const ManchasVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena sinEntrada nombre="Cielo y ojo" desde={0} hasta={INICIO_LOGO_MANCHAS}>
        {(t0) => (
          <>
            <Ojo t0={t0} />
            <Tarjetas t0={t0} />
          </>
        )}
      </Escena>
      <Escena nombre="Logo" desde={INICIO_LOGO_MANCHAS} hasta={DURACION_MANCHAS_S}>
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO_MANCHAS} />}
      </Escena>

      {/* Etiquetas-clave: 2–4 palabras. La primera ya está en el primer fotograma (gancho) */}
      <Etiqueta texto="¿Bichitos en el cielo?" desde={-0.4} hasta={T.parece - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Están dentro" desde={T.dentro} hasta={T.relleno - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Humor vítreo" desde={T.vitreo} hasta={T.agua - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Grumos y hebras" desde={T.grumos} hasta={T.noVes - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Ves su sombra" desde={T.sombra} hasta={T.luz - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Sombra en la retina" desde={T.pantalla} hasta={T.porEso - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Fondo liso + luz" desde={T.fondo} hasta={T.porQue - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Flotan en el gel" desde={T.gel} hasta={T.mueves - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="El gel las arrastra" desde={T.arrastra} hasta={T.paras - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Siguen deslizándose" desde={T.deslizan} hasta={T.llaman - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Son normales" desde={T.normales} hasta={T.pero - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Oftalmólogo hoy" desde={T.oftalmo} hasta={T.desgarro - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Desgarro de retina" desde={T.desgarro} hasta={T.final - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="No son bichos" desde={T.final} hasta={T.sombras - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Son sombras" desde={T.sombras} hasta={T.fin + 0.4} y={1660} color={C.yellow} tamano={60} />

      {/* Sonido: música 6 dB más baja (0,1 bajo la voz, 0,225 en el cierre) */}
      <Audio src={staticFile("audio/manchas/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [0, 1.5, INICIO_LOGO_MANCHAS - 0.3, INICIO_LOGO_MANCHAS + 0.7, DURACION_MANCHAS_S - 1.5, DURACION_MANCHAS_S],
            [0, 0.1, 0.1, 0.225, 0.225, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[T.escapan, T.dentro, T.sombra, T.mueves, T.oftalmo].map((tc) => (
        <Sequence key={tc} name="Tic" from={Math.round(tc * fps)} durationInFrames={Math.round(0.3 * fps)}>
          <Audio src={staticFile("audio/choque.wav")} volume={tc === T.escapan ? 0.6 : 0.4} />
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

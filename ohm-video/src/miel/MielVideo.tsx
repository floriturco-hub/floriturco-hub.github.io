import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Logo } from "../scenes/Logo";
import { C } from "../theme";
import { Tumba } from "./Tumba";
import { Tarjetas } from "./Tarjetas";
import { T } from "./tiempos";

export const INICIO_LOGO_MIEL = T.fin + 0.5;
export const DURACION_MIEL_S = INICIO_LOGO_MIEL + 6.5;
const D = INICIO_LOGO_MIEL - 61.5;

// Una sola escena-mundo (tumba, panal, microscopio y cocina) recorrida con la cámara
export const MielVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena sinEntrada nombre="Tumba y panal" desde={0} hasta={INICIO_LOGO_MIEL}>
        {(t0) => (
          <>
            <Tumba t0={t0} />
            <Tarjetas t0={t0} />
          </>
        )}
      </Escena>
      <Escena nombre="Logo" desde={INICIO_LOGO_MIEL} hasta={DURACION_MIEL_S}>
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO_MIEL} />}
      </Escena>

      {/* Etiquetas-clave: 2–4 palabras. La primera ya está en el primer fotograma (gancho) */}
      <Etiqueta texto="3.000 años… y comestible" desde={-0.4} hasta={T.tumbas - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Tumbas de Egipto" desde={T.tumbas} hasta={T.quimica - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Por su química" desde={T.quimica} hasta={T.como - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Tres defensas" desde={T.tresDefensas} hasta={T.primera - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Del 70 % a <20 %" desde={T.setenta} hasta={T.azucar - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Le roba el agua" desde={T.roba} hasta={T.seca - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Se seca" desde={T.seca} hasta={T.segunda - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Ácida como naranja" desde={T.naranja - 0.6} hasta={T.tercera - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Agua oxigenada" desde={T.oxigenada} hasta={T.cristaliza - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="No se pudre" desde={T.noPudre} hasta={T.banoMaria - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Al baño María" desde={T.banoMaria} hasta={T.ojo - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Ciérrala bien" desde={T.fermentar} hasta={T.bebes - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Nunca a bebés" desde={T.bebes} hasta={T.final - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="No se conserva" desde={T.final} hasta={T.defiende - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Se defiende" desde={T.defiende - 0.2} hasta={T.fin + 0.4} y={1660} color={C.yellow} tamano={60} />

      {/* Sonido: música 6 dB más baja (0,1 bajo la voz, 0,225 en el cierre) */}
      <Audio src={staticFile("audio/miel-eterna/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [0, 1.5, INICIO_LOGO_MIEL - 0.3, INICIO_LOGO_MIEL + 0.7, DURACION_MIEL_S - 1.5, DURACION_MIEL_S],
            [0, 0.1, 0.1, 0.225, 0.225, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[T.comertela, T.seca, T.noPudre, T.cierrala, T.defiende].map((tc) => (
        <Sequence key={tc} name="Tic" from={Math.round(tc * fps)} durationInFrames={Math.round(0.3 * fps)}>
          <Audio src={staticFile("audio/choque.wav")} volume={tc === T.comertela ? 0.6 : 0.4} />
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

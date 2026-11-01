import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Logo } from "../scenes/Logo";
import { C } from "../theme";
import { Gasolinera } from "./Gasolinera";
import { Tarjetas } from "./Tarjetas";
import { T } from "./tiempos";

export const INICIO_LOGO_PREMIUM = T.fin + 0.5;
export const DURACION_PREMIUM_S = INICIO_LOGO_PREMIUM + 6.5;
const D = INICIO_LOGO_PREMIUM - 61.5;

// Una sola escena-mundo (gasolinera arriba, cilindro del motor abajo) recorrida con la cámara
export const PremiumVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena nombre="Gasolinera y motor" desde={0} hasta={INICIO_LOGO_PREMIUM}>
        {(t0) => (
          <>
            <Gasolinera t0={t0} />
            <Tarjetas t0={t0} />
          </>
        )}
      </Escena>
      <Escena nombre="Logo" desde={INICIO_LOGO_PREMIUM} hasta={DURACION_PREMIUM_S}>
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO_PREMIUM} />}
      </Escena>

      {/* Etiquetas-clave: 2–4 palabras */}
      <Etiqueta texto="Si no la necesita" desde={T.alMenos} hasta={T.parece - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="¿Más potencia?" desde={T.octanos} hasta={T.pero - 0.1} y={1660} />
      <Etiqueta texto="No mide energía" desde={T.pero} hasta={T.motor - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Chispa en su momento" desde={T.bujia} hasta={T.sola - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Se enciende sola" desde={T.sola} hasta={T.detonacion - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Detonación" desde={T.detonacion} hasta={T.octanaje - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Octanaje = aguante" desde={T.octanaje} hasta={T.turbo - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Ni más, ni menos" desde={T.ni} hasta={T.manual - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="No es potencia" desde={T.final} hasta={T.aguanteFinal - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Es aguante" desde={T.aguanteFinal} hasta={T.fin + 0.4} y={1660} color={C.yellow} tamano={60} />

      {/* Sonido: esquema aprobado */}
      <Audio src={staticFile("audio/premium/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [0, 1.5, INICIO_LOGO_PREMIUM - 0.3, INICIO_LOGO_PREMIUM + 0.7, DURACION_PREMIUM_S - 1.5, DURACION_PREMIUM_S],
            [0, 0.2, 0.2, 0.45, 0.45, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[T.noSirve, T.energia, T.detonacion, T.misma, T.ni].map((tc) => (
        <Sequence key={tc} name="Tic" from={Math.round(tc * fps)} durationInFrames={Math.round(0.3 * fps)}>
          <Audio src={staticFile("audio/choque.wav")} volume={tc === T.noSirve ? 0.6 : 0.4} />
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

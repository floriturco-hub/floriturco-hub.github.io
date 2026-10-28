import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Logo } from "../scenes/Logo";
import { C, clamp, mono } from "../theme";
import { Bano } from "./Bano";
import { Tarjetas } from "./Tarjetas";
import { T } from "./tiempos";

export const INICIO_LOGO_SMOOTHIE = T.fin + 0.5;
export const DURACION_SMOOTHIE_S = INICIO_LOGO_SMOOTHIE + 6.5;
const D = INICIO_LOGO_SMOOTHIE - 61.5;

// Aviso de contenido patrocinado: discreto, al principio y al final
const AvisoPublicidad: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const o = Math.max(
    interpolate(t, [0, 0.3, 3.5, 4.0], [0, 1, 1, 0], clamp),
    interpolate(t, [T.noMagia - 0.4, T.noMagia, INICIO_LOGO_SMOOTHIE, INICIO_LOGO_SMOOTHIE + 0.3], [0, 1, 1, 0], clamp),
  );
  if (o <= 0) {
    return null;
  }
  return (
    <div
      style={{
        position: "absolute",
        top: 70,
        left: 60,
        opacity: o * 0.85,
        fontFamily: mono,
        fontSize: 26,
        color: C.white,
        background: C.pill,
        padding: "6px 16px",
        borderRadius: 10,
      }}
    >
      Publicidad · Palmolive
    </div>
  );
};

// Una sola escena-mundo (la ducha) recorrida con la cámara; contenido de curiosidad con producto integrado
export const SmoothieVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena nombre="Ducha" desde={0} hasta={INICIO_LOGO_SMOOTHIE}>
        {(t0) => (
          <>
            <Bano t0={t0} />
            <Tarjetas t0={t0} />
          </>
        )}
      </Escena>
      <Escena nombre="Logo" desde={INICIO_LOGO_SMOOTHIE} hasta={DURACION_SMOOTHIE_S}>
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO_SMOOTHIE} />}
      </Escena>
      <AvisoPublicidad />

      {/* Etiquetas-clave: 2–4 palabras */}
      <Etiqueta texto="¿Por qué más espuma?" desde={0.6} hasta={T.parece - 0.1} y={1640} color={C.yellow} tamano={56} />
      <Etiqueta texto="Mete aire" desde={T.meterAire - 0.2} hasta={T.gel - 0.1} y={1640} color={C.yellow} />
      <Etiqueta texto="Moléculas con dos caras" desde={T.dosCaras} hasta={T.entraAire - 0.1} y={1640} color={C.cyan} />
      <Etiqueta texto="Atrapan el aire" desde={T.entraAire} hasta={T.poros - 0.1} y={1640} color={C.cyan} />
      <Etiqueta texto="Miles de poros" desde={T.poros} hasta={T.masAire - 0.1} y={1640} />
      <Etiqueta texto="Más aire, más burbujas" desde={T.masAire} hasta={T.curiosidad - 0.1} y={1640} color={C.yellow} />
      <Etiqueta texto="Directo a las emociones" desde={T.directo} hasta={T.primerPaso - 0.1} y={1640} color={C.yellow} />
      <Etiqueta texto="El primer paso" desde={T.primerPaso} hasta={T.mio - 0.1} y={1640} color={C.yellow} />
      <Etiqueta texto="Siempre con esponja" desde={T.esponja} hasta={T.fragancia - 0.1} y={1640} color={C.cyan} />
      <Etiqueta texto="Fragancia irresistible" desde={T.fragancia} hasta={T.truco - 0.1} y={1640} color={C.yellow} />
      <Etiqueta texto="#SMOOTHORIALS" desde={T.noMagia} hasta={T.fin + 0.4} y={1560} color={C.yellow} tamano={60} />
      <Etiqueta texto="Aire, agua y buen olor" desde={T.aire} hasta={T.fin + 0.4} y={1670} />

      {/* Sonido: esquema aprobado */}
      <Audio src={staticFile("audio/smoothie/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [0, 1.5, INICIO_LOGO_SMOOTHIE - 0.3, INICIO_LOGO_SMOOTHIE + 0.7, DURACION_SMOOTHIE_S - 1.5, DURACION_SMOOTHIE_S],
            [0, 0.2, 0.2, 0.45, 0.45, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[T.meterAire, T.masAire, T.emociones, T.esponja].map((tc) => (
        <Sequence key={tc} name="Tic" from={Math.round(tc * fps)} durationInFrames={Math.round(0.3 * fps)}>
          <Audio src={staticFile("audio/choque.wav")} volume={0.35} />
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

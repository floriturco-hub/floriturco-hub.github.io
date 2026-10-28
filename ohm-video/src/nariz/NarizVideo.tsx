import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Logo } from "../scenes/Logo";
import { C } from "../theme";
import { Cabeza } from "./Cabeza";
import { Tarjetas } from "./Tarjetas";
import { T } from "./tiempos";

export const INICIO_LOGO_NARIZ = T.fin + 0.5;
export const DURACION_NARIZ_S = INICIO_LOGO_NARIZ + 6.5;
const D = INICIO_LOGO_NARIZ - 61.5;

// Una sola escena-mundo (la cabeza de perfil con la nariz en corte) recorrida con la cámara
export const NarizVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena nombre="Cabeza y nariz" desde={0} hasta={INICIO_LOGO_NARIZ}>
        {(t0) => (
          <>
            <Cabeza t0={t0} />
            <Tarjetas t0={t0} />
          </>
        )}
      </Escena>
      <Escena nombre="Logo" desde={INICIO_LOGO_NARIZ} hasta={DURACION_NARIZ_S}>
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO_NARIZ} />}
      </Escena>

      {/* Etiquetas-clave: 2–4 palabras */}
      <Etiqueta texto="¿De dónde sale?" desde={T.deDonde} hasta={T.parece - 0.1} y={1660} color={C.yellow} tamano={60} />
      <Etiqueta texto="Un punto diminuto" desde={T.diminuto} hasta={T.parteDelantera - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Hasta cinco arterias" desde={T.cinco} hasta={T.red - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Una red finísima" desde={T.red} hasta={T.nueve - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Se agrieta" desde={T.agrieta} hasta={T.basta - 0.1} y={1660} color={C.orange} />
      <Etiqueta texto="Un vaso se abre" desde={T.abre} hasta={T.irrigada - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Muy irrigada" desde={T.irrigada} hasta={T.pararlo - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Hacia delante" desde={T.delante} hasta={T.aprieta - 0.1} y={1700} color={C.yellow} />
      <Etiqueta texto="Aprieta y espera" desde={T.aprieta} hasta={T.atras - 0.1} y={1700} color={C.yellow} />
      <Etiqueta texto="Hacia atrás, no" desde={T.atras} hasta={T.veinte - 0.1} y={1700} color={C.red} />
      <Etiqueta texto="Una red muy fina" desde={T.redFinal} hasta={T.fin + 0.4} y={1660} color={C.yellow} tamano={60} />

      {/* Sonido: esquema aprobado */}
      <Audio src={staticFile("audio/nariz/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [0, 1.5, INICIO_LOGO_NARIZ - 0.3, INICIO_LOGO_NARIZ + 0.7, DURACION_NARIZ_S - 1.5, DURACION_NARIZ_S],
            [0, 0.2, 0.2, 0.45, 0.45, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[T.diminuto, T.nueve + 1.6, T.abre, T.diezMin].map((tc) => (
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

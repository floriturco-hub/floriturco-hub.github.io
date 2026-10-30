import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Logo } from "../scenes/Logo";
import { C, clamp, mono } from "../theme";
import { Estudio } from "./Estudio";
import { Pantalla } from "./Pantalla";
import { Tarjetas } from "./Tarjetas";
import { T } from "./tiempos";

export const INICIO_LOGO_LIVE = T.fin + 0.5;
export const DURACION_LIVE_S = INICIO_LOGO_LIVE + 6.5;
const D = INICIO_LOGO_LIVE - 61.5;

// Aviso de contenido promocional: discreto, al principio y al final
const AvisoPublicidad: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const o = Math.max(
    interpolate(t, [0, 0.3, 3.5, 4.0], [0, 1, 1, 0], clamp),
    interpolate(t, [T.siQuieres - 0.4, T.siQuieres, INICIO_LOGO_LIVE, INICIO_LOGO_LIVE + 0.3], [0, 1, 1, 0], clamp),
  );
  if (o <= 0) {
    return null;
  }
  return (
    <div style={{ position: "absolute", top: 70, left: 60, opacity: o * 0.85, fontFamily: mono, fontSize: 26, color: C.white, background: C.pill, padding: "6px 16px", borderRadius: 10 }}>
      Publicidad · TikTok LIVE
    </div>
  );
};

// Una sola escena-mundo (el estudio del creador) con la pantalla del directo y la llamada a "Iniciar LIVE"
export const LiveVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena nombre="Estudio" desde={0} hasta={INICIO_LOGO_LIVE}>
        {(t0) => (
          <>
            <Estudio t0={t0} />
            <Pantalla t0={t0} />
            <Tarjetas t0={t0} />
          </>
        )}
      </Escena>
      <Escena nombre="Logo" desde={INICIO_LOGO_LIVE} hasta={DURACION_LIVE_S}>
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO_LIVE} />}
      </Escena>
      <AvisoPublicidad />

      {/* Etiquetas-clave: 2–4 palabras */}
      <Etiqueta texto="¿Vivir de TikTok?" desde={0.3} hasta={T.noSuerte - 0.1} y={1640} color={C.yellow} tamano={60} />
      <Etiqueta texto="No es suerte" desde={T.noSuerte} hasta={T.parece - 0.1} y={1640} color={C.red} tamano={60} />
      <Etiqueta texto="Un directo construye" desde={T.directo} hasta={T.live - 0.1} y={1640} color={C.cyan} />
      <Etiqueta texto="Comentan y vuelven" desde={T.comenta} hasta={T.mostrar - 0.1} y={1640} color={C.cyan} />
      <Etiqueta texto="Más tiempo, más alcance" desde={T.mostrar} hasta={T.crecimiento - 0.1} y={1640} color={C.yellow} />
      <Etiqueta texto="Estrategia de LIVE" desde={T.crecimiento} hasta={T.uno - 0.1} y={1640} color={C.yellow} tamano={60} />
      <Etiqueta texto="1 · Tema claro" desde={T.uno} hasta={T.dos - 0.1} y={1640} color={C.yellow} />
      <Etiqueta texto="2 · Horario fijo" desde={T.dos} hasta={T.tres - 0.1} y={1640} color={C.yellow} />
      <Etiqueta texto="3 · Saluda por nombre" desde={T.tres} hasta={T.cuatro - 0.1} y={1640} color={C.yellow} />
      <Etiqueta texto="4 · Recorta y sube" desde={T.cuatro} hasta={T.dinero - 0.1} y={1640} color={C.yellow} />
      <Etiqueta texto="No es dinero fácil" desde={T.noFacil} hasta={T.sistema - 0.1} y={1640} color={C.white} />
      <Etiqueta texto="Es un sistema" desde={T.sistema} hasta={T.siQuieres - 0.1} y={1640} color={C.yellow} tamano={60} />
      <Etiqueta texto="Tu primer directo, hoy" desde={T.hoy - 0.4} hasta={T.fin + 0.4} y={1640} color={C.yellow} />

      {/* Sonido: esquema aprobado */}
      <Audio src={staticFile("audio/live/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [0, 1.5, INICIO_LOGO_LIVE - 0.3, INICIO_LOGO_LIVE + 0.7, DURACION_LIVE_S - 1.5, DURACION_LIVE_S],
            [0, 0.2, 0.2, 0.45, 0.45, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[T.noSuerte, T.live, T.uno, T.dos, T.tres, T.cuatro, T.cobrar, T.iniciar].map((tc) => (
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

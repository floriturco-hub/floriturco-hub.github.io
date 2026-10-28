import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Logo } from "../scenes/Logo";
import { C } from "../theme";
import { Cuarto } from "./Cama";
import { Tarjetas } from "./Tarjetas";
import { T } from "./tiempos";

export const INICIO_LOGO_SACUDIDA = T.fin + 0.5;
export const DURACION_SACUDIDA_S = INICIO_LOGO_SACUDIDA + 6.5;
const D = INICIO_LOGO_SACUDIDA - 61.5;

// Una sola escena-mundo (el dormitorio y el cerebro de quien duerme) recorrida con la cámara
export const SacudidaVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena nombre="Dormitorio y cerebro" desde={0} hasta={INICIO_LOGO_SACUDIDA}>
        {(t0) => (
          <>
            <Cuarto t0={t0} />
            <Tarjetas t0={t0} />
          </>
        )}
      </Escena>
      <Escena nombre="Logo" desde={INICIO_LOGO_SACUDIDA} hasta={DURACION_SACUDIDA_S}>
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO_SACUDIDA} />}
      </Escena>

      {/* Etiquetas-clave: 2–4 palabras */}
      <Etiqueta texto="¿Caes al vacío?" desde={T.vacio - 0.2} hasta={T.golpe + 0.2} y={1700} color={C.yellow} tamano={60} />
      <Etiqueta texto="No te has caído" desde={T.noTeHasCaido} hasta={T.cerebro - 0.1} y={1700} color={C.cyan} />
      <Etiqueta texto="Sacudida hipnagógica" desde={T.sellama} hasta={T.siete - 0.1} y={1700} color={C.yellow} />
      <Etiqueta texto="El cuerpo se relaja" desde={T.dormirte} hasta={T.pero - 0.1} y={1700} />
      <Etiqueta texto="Se duerme por zonas" desde={T.zonas} hasta={T.seCree - 0.1} y={1700} color={C.cyan} />
      <Etiqueta texto="Una parte sigue despierta" desde={T.parteDespierta} hasta={T.manda - 0.1} y={1700} color={C.yellow} tamano={40} />
      <Etiqueta texto="Orden de emergencia" desde={T.manda} hasta={T.tiron - 0.1} y={1700} color={C.red} />
      <Etiqueta texto="Un tirón" desde={T.tiron} hasta={T.teoria - 0.1} y={1700} color={C.red} />
      <Etiqueta texto="Reflejo antiguo" desde={T.teoria} hasta={T.probable - 0.1} y={1700} />
      <Etiqueta texto="Es inofensiva" desde={T.inofensiva} hasta={T.reducirla - 0.1} y={1700} color={C.cyan} />
      <Etiqueta texto="Tu cerebro se asusta" desde={T.porPartes} hasta={T.fin + 0.4} y={1700} color={C.yellow} tamano={60} />

      {/* Sonido: esquema aprobado */}
      <Audio src={staticFile("audio/sacudida/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [0, 1.5, INICIO_LOGO_SACUDIDA - 0.3, INICIO_LOGO_SACUDIDA + 0.7, DURACION_SACUDIDA_S - 1.5, DURACION_SACUDIDA_S],
            [0, 0.2, 0.2, 0.45, 0.45, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[T.golpe, T.siete + 1.4, T.tiron, T.vacioImagen].map((tc) => (
        <Sequence key={tc} name="Tic" from={Math.round(tc * fps)} durationInFrames={Math.round(0.3 * fps)}>
          <Audio src={staticFile("audio/choque.wav")} volume={0.45} />
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

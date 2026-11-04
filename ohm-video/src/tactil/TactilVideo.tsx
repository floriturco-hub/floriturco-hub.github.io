import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Logo } from "../scenes/Logo";
import { C } from "../theme";
import { Movil } from "./Movil";
import { Tarjetas } from "./Tarjetas";
import { T } from "./tiempos";

export const INICIO_LOGO_TACTIL = T.fin + 0.5;
export const DURACION_TACTIL_S = INICIO_LOGO_TACTIL + 6.5;
const D = INICIO_LOGO_TACTIL - 61.5;

// Una sola escena-mundo (móvil, rejilla de electrodos y comparación de objetos) recorrida con la cámara
export const TactilVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena sinEntrada nombre="Móvil y rejilla" desde={0} hasta={INICIO_LOGO_TACTIL}>
        {(t0) => (
          <>
            <Movil t0={t0} />
            <Tarjetas t0={t0} />
          </>
        )}
      </Escena>
      <Escena nombre="Logo" desde={INICIO_LOGO_TACTIL} hasta={DURACION_TACTIL_S}>
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO_TACTIL} />}
      </Escena>

      {/* Etiquetas-clave: 2–4 palabras. La primera ya está en el primer fotograma (gancho) */}
      <Etiqueta texto="Salchicha ✓  Lápiz ✗" desde={-0.4} hasta={T.parece - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="¿Siente la presión?" desde={T.parece} hasta={T.apretar - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Ni con fuerza" desde={T.apretar + 0.4} hasta={T.noPresion - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Siente electricidad" desde={T.electricidad - 0.4} hasta={T.rejilla - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Rejilla invisible" desde={T.rejilla + 0.4} hasta={T.campo - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Cientos de veces/s" desde={T.cientos} hasta={T.dedo - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Agua con sal" desde={T.sal} hasta={T.acercarlo - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Así sabe dónde" desde={T.sabe} hasta={T.salchicha2 - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="También conduce" desde={T.salchicha2 + 0.6} hasta={T.corea - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Cambio diminuto" desde={T.noNota - 0.4} hasta={T.guante - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="El guante aísla" desde={T.aislante} hasta={T.porEso - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Hilos conductores" desde={T.hilos} hasta={T.goma - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Goma conductora" desde={T.goma} hasta={T.final - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="No te siente a ti" desde={T.final} hasta={T.electricidadFinal - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Siente tu electricidad" desde={T.electricidadFinal} hasta={T.fin + 0.4} y={1660} color={C.yellow} tamano={50} />

      {/* Sonido: música 6 dB más baja (0,1 bajo la voz, 0,225 en el cierre) */}
      <Audio src={staticFile("audio/pantalla-tactil/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [0, 1.5, INICIO_LOGO_TACTIL - 0.3, INICIO_LOGO_TACTIL + 0.7, DURACION_TACTIL_S - 1.5, DURACION_TACTIL_S],
            [0, 0.1, 0.1, 0.225, 0.225, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[0.3, 2.8, T.cambia, T.noNota, T.goma].map((tc) => (
        <Sequence key={tc} name="Tic" from={Math.round(tc * fps)} durationInFrames={Math.round(0.3 * fps)}>
          <Audio src={staticFile("audio/choque.wav")} volume={tc === 0.3 ? 0.6 : 0.4} />
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

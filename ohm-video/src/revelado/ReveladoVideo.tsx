import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Logo } from "../scenes/Logo";
import { C } from "../theme";
import { Cuarto } from "./Cuarto";
import { Tarjetas } from "./Tarjetas";
import { T } from "./tiempos";

export const INICIO_LOGO_REVELADO = T.fin + 0.5;
export const DURACION_REVELADO_S = INICIO_LOGO_REVELADO + 6.5;
const D = INICIO_LOGO_REVELADO - 61.5;

// Una sola escena-mundo (cuarto oscuro, cristal de bromuro de plata y muro de energía) recorrida con la cámara
export const ReveladoVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena sinEntrada nombre="Cuarto oscuro" desde={0} hasta={INICIO_LOGO_REVELADO}>
        {(t0) => (
          <>
            <Cuarto t0={t0} />
            <Tarjetas t0={t0} />
          </>
        )}
      </Escena>
      <Escena nombre="Logo" desde={INICIO_LOGO_REVELADO} hasta={DURACION_REVELADO_S}>
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO_REVELADO} />}
      </Escena>

      {/* Etiquetas-clave: 2–4 palabras. La primera ya está en el primer fotograma (gancho) */}
      <Etiqueta texto="¿Por qué luz roja?" desde={-0.4} hasta={T.parece - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Ciego a unos colores" desde={T.peroNo} hasta={T.cristales - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Bromuro de plata" desde={T.bromuro - 0.3} hasta={T.foton - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Imagen latente" desde={T.latente} hasta={T.revelador - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Se vuelve negra" desde={T.revelador + 0.4} hasta={T.clave + 0.6} y={1660} color={C.white} />
      <Etiqueta texto="Energía de cada color" desde={T.clave + 0.7} hasta={T.azul - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Azul: mucha energía" desde={T.golpean} hasta={T.rojaE - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Rojo: no alcanza" desde={T.noAlcanzan} hasta={T.cantidad - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Mil rojos no bastan" desde={T.mil} hasta={T.muro - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Llegar a la altura" desde={T.altura - 0.6} hasta={T.porEso - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Ciego al rojo" desde={T.ciegoRojo} hasta={T.carrete - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Carrete: a oscuras" desde={T.oscuras} hasta={T.ojo - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Se cuela otro color" desde={T.cuela} hasta={T.cerca - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Vela el papel" desde={T.vela} hasta={T.final - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="No es débil" desde={T.final} hasta={T.energia - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Le falta energía" desde={T.energia} hasta={T.fin + 0.4} y={1660} color={C.yellow} tamano={56} />

      {/* Sonido: música 6 dB más baja (0,1 bajo la voz, 0,225 en el cierre) */}
      <Audio src={staticFile("audio/revelado/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [0, 1.5, INICIO_LOGO_REVELADO - 0.3, INICIO_LOGO_REVELADO + 0.7, DURACION_REVELADO_S - 1.5, DURACION_REVELADO_S],
            [0, 0.1, 0.1, 0.225, 0.225, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[T.arruina, T.choca, T.chocan, T.unoAzul, T.vela].map((tc) => (
        <Sequence key={tc} name="Tic" from={Math.round(tc * fps)} durationInFrames={Math.round(0.3 * fps)}>
          <Audio src={staticFile("audio/choque.wav")} volume={tc === T.arruina ? 0.6 : 0.4} />
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

import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Logo } from "../scenes/Logo";
import { C } from "../theme";
import { ImpresoraMundo } from "./Impresora";
import { Tarjetas } from "./Tarjetas";
import { T } from "./tiempos";

export const INICIO_LOGO_IMPRESORA = T.fin + 0.5;
export const DURACION_IMPRESORA_S = INICIO_LOGO_IMPRESORA + 6.5;
const D = INICIO_LOGO_IMPRESORA - 61.5;

// Una sola escena-mundo (hoja con los puntos amarillos, código descifrado y para qué sirve) recorrida con la cámara
export const ImpresoraVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena sinEntrada nombre="Hoja y código" desde={0} hasta={INICIO_LOGO_IMPRESORA}>
        {(t0) => (
          <>
            <ImpresoraMundo t0={t0} />
            <Tarjetas t0={t0} />
          </>
        )}
      </Escena>
      <Escena nombre="Logo" desde={INICIO_LOGO_IMPRESORA} hasta={DURACION_IMPRESORA_S}>
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO_IMPRESORA} />}
      </Escena>

      {/* Etiquetas-clave: 2–4 palabras. La primera (gancho) repite la frase de choque desde el primer fotograma */}
      <Etiqueta texto="¡Tu impresora te está delatando!" desde={-0.4} hasta={T.muchas - 0.1} y={1660} color={C.yellow} tamano={46} />
      <Etiqueta texto="Impresoras láser a color" desde={T.muchas} hasta={T.puntitos - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Puntitos amarillos" desde={T.puntitos} hasta={T.decima - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="0,1 mm cada uno" desde={T.decima} hasta={T.amarillo - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Amarillo sobre blanco" desde={T.amarillo} hasta={T.noVe - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Tu ojo no los ve" desde={T.noVe} hasta={T.lupa - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Lupa y luz azul" desde={T.lupa} hasta={T.noAzar - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="No están al azar" desde={T.noAzar} hasta={T.codigo - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Un código repetido" desde={T.codigo} hasta={T.serie - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Número de serie" desde={T.serie} hasta={T.fecha - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Fecha y hora" desde={T.fecha} hasta={T.paraQue - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Contra billetes falsos" desde={T.paraQue} hasta={T.maquina - 0.1} y={1660} color="#48C878" />
      <Etiqueta texto="¿Con qué máquina?" desde={T.maquina} hasta={T.anio2005 - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="2005: descifrado" desde={T.anio2005} hasta={T.anio2017 - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="2017: una filtración" desde={T.anio2017} hasta={T.noNombre - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="No dicen tu nombre" desde={T.noNombre} hasta={T.impresora - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Sí tu impresora" desde={T.impresora} hasta={T.fin + 0.4} y={1660} color={C.yellow} tamano={50} />

      {/* Sonido: música 6 dB más baja (0,1 bajo la voz, 0,225 en el cierre) */}
      <Audio src={staticFile("audio/impresora-puntos/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [0, 1.5, INICIO_LOGO_IMPRESORA - 0.3, INICIO_LOGO_IMPRESORA + 0.7, DURACION_IMPRESORA_S - 1.5, DURACION_IMPRESORA_S],
            [0, 0.1, 0.1, 0.225, 0.225, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[0.3, T.lupa, T.falso, T.filtro].map((tc) => (
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

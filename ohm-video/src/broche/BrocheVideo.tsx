import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Logo } from "../scenes/Logo";
import { C } from "../theme";
import { BrocheMundo } from "./Broche";
import { Tarjetas } from "./Tarjetas";
import { T } from "./tiempos";

export const INICIO_LOGO_BROCHE = T.fin + 0.5;
export const DURACION_BROCHE_S = INICIO_LOGO_BROCHE + 6.5;
const D = INICIO_LOGO_BROCHE - 61.5;

// Una sola escena-mundo (salida de la tienda con columnas, broche por dentro y cierre con imán y tinta) recorrida con la cámara
export const BrocheVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena sinEntrada nombre="Tienda y broche" desde={0} hasta={INICIO_LOGO_BROCHE}>
        {(t0) => (
          <>
            <BrocheMundo t0={t0} />
            <Tarjetas t0={t0} />
          </>
        )}
      </Escena>
      <Escena nombre="Logo" desde={INICIO_LOGO_BROCHE} hasta={DURACION_BROCHE_S}>
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO_BROCHE} />}
      </Escena>

      {/* Etiquetas-clave: 2–4 palabras. La primera (gancho) repite la frase de choque desde el primer fotograma */}
      <Etiqueta texto="¡Este broche te delata sin batería!" desde={-0.4} hasta={T.dentro - 0.1} y={1660} color={C.yellow} tamano={44} />
      <Etiqueta texto="Dentro: un circuito" desde={T.dentro} hasta={T.bobina - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Bobina + condensador" desde={T.bobina} hasta={T.noPila - 0.1} y={1660} color={C.orange} />
      <Etiqueta texto="Sin pila" desde={T.noPila} hasta={T.columnas - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="La puerta emite ondas" desde={T.columnas} hasta={T.pasas - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Al pasar…" desde={T.pasas} hasta={T.vibrar - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="El circuito vibra" desde={T.vibrar} hasta={T.copa - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Como una copa" desde={T.copa} hasta={T.eco - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Detectan el eco" desde={T.eco} hasta={T.alarma - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="¡Alarma!" desde={T.alarma} hasta={T.energia - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Energía de la puerta" desde={T.energia} hasta={T.quitar - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="¿Y quitarlo?" desde={T.quitar} hasta={T.aguja - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Aguja atrapada" desde={T.aguja} hasta={T.bolitas - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Bolitas y resorte" desde={T.bolitas} hasta={T.iman - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Solo un imán potente" desde={T.iman} hasta={T.tinta - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Algunos llevan tinta" desde={T.tinta} hasta={T.fuerzas - 0.1} y={1660} color={C.purpleLight} />
      <Etiqueta texto="Si lo fuerzas…" desde={T.fuerzas} hasta={T.manchan - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="¡Manchan la ropa!" desde={T.manchan} hasta={T.robar - 0.1} y={1660} color={C.purpleLight} />
      <Etiqueta texto="Robar = arruinar" desde={T.robar} hasta={T.fin + 0.4} y={1660} color={C.yellow} tamano={50} />

      {/* Sonido: música 6 dB más baja (0,1 bajo la voz, 0,225 en el cierre) */}
      <Audio src={staticFile("audio/broche-antirrobo/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [0, 1.5, INICIO_LOGO_BROCHE - 0.3, INICIO_LOGO_BROCHE + 0.7, DURACION_BROCHE_S - 1.5, DURACION_BROCHE_S],
            [0, 0.1, 0.1, 0.225, 0.225, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[1.0, T.alarma, T.iman + 0.5, T.fuerzas + 0.8].map((tc) => (
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

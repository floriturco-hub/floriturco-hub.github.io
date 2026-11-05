import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Logo } from "../scenes/Logo";
import { C } from "../theme";
import { GomaMundo } from "./Goma";
import { Tarjetas } from "./Tarjetas";
import { T } from "./tiempos";

export const INICIO_LOGO_GOMA = T.fin + 0.5;
export const DURACION_GOMA_S = INICIO_LOGO_GOMA + 6.5;
const D = INICIO_LOGO_GOMA - 61.5;

// Una sola escena-mundo (hoja con garabato que se borra, papel al microscopio y la historia de 1770) recorrida con la cámara
export const GomaVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena sinEntrada nombre="Hoja y microscopio" desde={0} hasta={INICIO_LOGO_GOMA}>
        {(t0) => (
          <>
            <GomaMundo t0={t0} />
            <Tarjetas t0={t0} />
          </>
        )}
      </Escena>
      <Escena nombre="Logo" desde={INICIO_LOGO_GOMA} hasta={DURACION_GOMA_S}>
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO_GOMA} />}
      </Escena>

      {/* Etiquetas-clave: 2–4 palabras. La primera (gancho) repite la frase de choque desde el primer fotograma */}
      <Etiqueta texto="¡Antes borraban con pan!" desde={-0.4} hasta={T.lapiz - 0.1} y={1660} color={C.yellow} tamano={50} />
      <Etiqueta texto="Con lápiz…" desde={T.lapiz} hasta={T.noPintas - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="No pintas el papel" desde={T.noPintas} hasta={T.escamas - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Escamas de grafito" desde={T.escamas} hasta={T.polvo - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Como polvo encima" desde={T.polvo} hasta={T.goma - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="La goma…" desde={T.goma} hasta={T.pegajosa - 0.1} y={1660} color="#F088A0" />
      <Etiqueta texto="…es pegajosa" desde={T.pegajosa} hasta={T.frotar - 0.1} y={1660} color="#F088A0" />
      <Etiqueta texto="Al frotar" desde={T.frotar} hasta={T.pegaMas - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Se pega a la goma" desde={T.pegaMas} hasta={T.virutas - 0.1} y={1660} color="#F088A0" />
      <Etiqueta texto="Virutas que atrapan" desde={T.virutas} hasta={T.grises - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Por eso salen grises" desde={T.grises} hasta={T.antes - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Antes de las gomas…" desde={T.antes} hasta={T.pan - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Miga de pan húmeda" desde={T.pan} hasta={T.blanda - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Blanda y pegajosa" desde={T.blanda} hasta={T.historia - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Cuenta la historia…" desde={T.historia} hasta={T.anio - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="1770" desde={T.anio} hasta={T.caucho - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Caucho por error" desde={T.caucho} hasta={T.mejor - 0.1} y={1660} color={C.orange} />
      <Etiqueta texto="¡Borraba mejor!" desde={T.mejor} hasta={T.boli - 0.1} y={1660} color="#48C878" />
      <Etiqueta texto="¿Y el bolígrafo?" desde={T.boli} hasta={T.fibras - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Tinta dentro de las fibras" desde={T.fibras} hasta={T.polvoNo - 0.1} y={1660} color={C.purpleLight} />
      <Etiqueta texto="Nada que levantar" desde={T.polvoNo} hasta={T.borrar - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Pegar y llevarse" desde={T.borrar} hasta={T.fin + 0.4} y={1660} color={C.yellow} tamano={50} />

      {/* Sonido: música 6 dB más baja (0,1 bajo la voz, 0,225 en el cierre) */}
      <Audio src={staticFile("audio/goma-borrar/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [0, 1.5, INICIO_LOGO_GOMA - 0.3, INICIO_LOGO_GOMA + 0.7, DURACION_GOMA_S - 1.5, DURACION_GOMA_S],
            [0, 0.1, 0.1, 0.225, 0.225, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[T.pegaMas, T.virutas, T.caucho].map((tc) => (
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

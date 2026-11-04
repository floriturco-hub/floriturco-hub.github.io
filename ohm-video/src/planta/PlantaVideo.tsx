import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Logo } from "../scenes/Logo";
import { C } from "../theme";
import { Planta } from "./Planta";
import { Tarjetas } from "./Tarjetas";
import { T } from "./tiempos";

export const INICIO_LOGO_PLANTA = T.fin + 0.5;
export const DURACION_PLANTA_S = INICIO_LOGO_PLANTA + 6.5;
const D = INICIO_LOGO_PLANTA - 61.5;

// Una sola escena-mundo (atrapamoscas, vista desde arriba, gráfica del calcio y corte de los lóbulos) recorrida con la cámara
export const PlantaVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena sinEntrada nombre="Planta y trampa" desde={0} hasta={INICIO_LOGO_PLANTA}>
        {(t0) => (
          <>
            <Planta t0={t0} />
            <Tarjetas t0={t0} />
          </>
        )}
      </Escena>
      <Escena nombre="Logo" desde={INICIO_LOGO_PLANTA} hasta={DURACION_PLANTA_S}>
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO_PLANTA} />}
      </Escena>

      {/* Etiquetas-clave: 2–4 palabras. La primera (gancho) repite la frase de choque desde el primer fotograma */}
      <Etiqueta texto="¡Esta planta sabe contar!" desde={-0.4} hasta={T.toca - 0.1} y={1660} color={C.yellow} tamano={50} />
      <Etiqueta texto="Un toque: nada" desde={T.toca} hasta={T.otraVez - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Dos toques: ¡zas!" desde={T.otraVez} hasta={T.noCerebro - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Sin cerebro" desde={T.noCerebro} hasta={T.lobulo - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="3 pelos sensores" desde={T.lobulo} hasta={T.dobla - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Se dobla un pelo" desde={T.dobla} hasta={T.senal - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Señal eléctrica" desde={T.senal} hasta={T.nervios - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Como tus nervios" desde={T.nervios} hasta={T.unSolo - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="¿Una gota de lluvia?" desde={T.unSolo} hasta={T.recuerda - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="La planta recuerda" desde={T.recuerda} hasta={T.calcio - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Acumula calcio" desde={T.calcio} hasta={T.segundo - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="2.º toque: < 20 s" desde={T.segundo} hasta={T.supera - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Supera el límite" desde={T.supera} hasta={T.sinMusculos - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="¿Y sin músculos?" desde={T.sinMusculos} hasta={T.resorte - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Tensas como resorte" desde={T.resorte} hasta={T.agua - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="El agua se mueve" desde={T.agua} hasta={T.invierte - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="La curva se invierte" desde={T.invierte} hasta={T.salta - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="¡Salta!" desde={T.salta} hasta={T.insecto - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Sigue contando" desde={T.insecto} hasta={T.cinco - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="5 toques: a digerir" desde={T.cinco} hasta={T.noPiensa - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="No piensa: cuenta" desde={T.noPiensa} hasta={T.fin + 0.4} y={1660} color={C.yellow} tamano={50} />

      {/* Sonido: música 6 dB más baja (0,1 bajo la voz, 0,225 en el cierre) */}
      <Audio src={staticFile("audio/planta-carnivora/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [0, 1.5, INICIO_LOGO_PLANTA - 0.3, INICIO_LOGO_PLANTA + 0.7, DURACION_PLANTA_S - 1.5, DURACION_PLANTA_S],
            [0, 0.1, 0.1, 0.225, 0.225, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[1.15, T.zas, T.cierra2, T.salta, T.cinco].map((tc) => (
        <Sequence key={tc} name="Tic" from={Math.round(tc * fps)} durationInFrames={Math.round(0.3 * fps)}>
          <Audio src={staticFile("audio/choque.wav")} volume={tc === 1.15 ? 0.7 : 0.45} />
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
